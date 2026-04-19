/**
 * Config plugin — bundles alternate iOS app-icon PNGs at the app bundle root
 * so `UIApplication.setAlternateIconName` can find them, and so the
 * `CFBundleAlternateIcons` entries declared in `app.json` resolve.
 *
 * The primary icon (.icon / Liquid Glass) is handled by Expo's built-in
 * `ios.icon` — this plugin only deals with alternates.
 *
 * Drop one square source PNG per alternate into `assets/alt-icons/`, e.g.
 * `enby.png` at 1024×1024. The plugin auto-generates every scale/idiom
 * variant iOS requires:
 *
 *   enby@2x.png       (120×120 — iPhone)
 *   enby@3x.png       (180×180 — iPhone)
 *   enby~ipad.png     (76×76   — iPad)
 *   enby~ipad@2x.png  (152×152 — iPad)
 *
 * If a file already carries a scale/idiom suffix (`@2x`, `@3x`, `~ipad`, etc.)
 * it's treated as pre-rendered and copied through as-is — useful when you have
 * hand-tuned artwork per size.
 *
 * Generated PNGs are flattened over a white background (iOS app icons must not
 * contain alpha — transparent icons fail App Store review).
 *
 * The plugin also registers every resulting file in the Xcode project's
 * "Copy Bundle Resources" build phase for the main target, so they end up at
 * the bundle root. iOS then resolves the right scale/idiom variant at runtime
 * from the bare name listed in `CFBundleIconFiles`.
 */

const fs = require('fs');
const path = require('path');

const { withDangerousMod, withXcodeProject } = require('expo/config-plugins');
const { generateImageAsync } = require('@expo/image-utils');

const SRC_DIR = 'assets/alt-icons';

/** Variants to synthesize from each un-suffixed source PNG. */
const VARIANTS = [
	{ suffix: '@2x', size: 120 }, // iPhone
	{ suffix: '@3x', size: 180 }, // iPhone
	{ suffix: '~ipad', size: 76 }, // iPad
	{ suffix: '~ipad@2x', size: 152 } // iPad
];

/** Matches anything that already encodes a scale or idiom. */
const PRE_RENDERED_RE = /(@\dx|~ipad|~iphone)(?=\.png$)/i;

const listPngs = (dir) => {
	if (!fs.existsSync(dir)) return [];
	return fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.png'));
};

/**
 * For every source PNG without a scale/idiom suffix, synthesize the full
 * iPhone + iPad variant set. Pre-rendered files pass through untouched.
 */
const writeVariants = async (srcRoot, destRoot, projectRoot, file) => {
	const srcPath = path.join(srcRoot, file);

	if (PRE_RENDERED_RE.test(file)) {
		fs.copyFileSync(srcPath, path.join(destRoot, file));
		return [file];
	}

	const baseName = file.replace(/\.png$/i, '');
	const outputs = [];

	for (const { suffix, size } of VARIANTS) {
		const outName = `${baseName}${suffix}.png`;
		const { source } = await generateImageAsync(
			{ projectRoot, cacheType: 'alt-icon' },
			{
				src: srcPath,
				name: outName,
				width: size,
				height: size,
				resizeMode: 'cover',
				// App Store rejects transparent icons — flatten over white.
				removeTransparency: true,
				backgroundColor: '#FFFFFF'
			}
		);
		fs.writeFileSync(path.join(destRoot, outName), source);
		outputs.push(outName);
	}

	return outputs;
};

/**
 * Generate variants from source PNGs and copy them all into `ios/<ProjectName>/`.
 * Returns the list of files that landed in that folder — it's the same list the
 * Xcode mod needs to reference, so we stash it on `config._internal` to pass it
 * between mods (modRequest can't carry arbitrary state).
 */
const withCopyAltIconPngs = (config) =>
	withDangerousMod(config, [
		'ios',
		async (config) => {
			const { projectName, platformProjectRoot, projectRoot } = config.modRequest;
			const srcRoot = path.join(projectRoot, SRC_DIR);
			const destRoot = path.join(platformProjectRoot, projectName);

			const sources = listPngs(srcRoot);
			if (sources.length === 0) {
				console.warn(
					`[with-alt-icons] no PNGs found in ${SRC_DIR}/ — alternate icons will fail at runtime`
				);
				config._altIconFiles = [];
				return config;
			}

			const written = [];
			for (const file of sources) {
				const outputs = await writeVariants(srcRoot, destRoot, projectRoot, file);
				written.push(...outputs);
			}

			config._altIconFiles = written;
			return config;
		}
	]);

/** Add the generated PNGs to the Xcode project as resources of the main target. */
const withAltIconXcodeResources = (config) =>
	withXcodeProject(config, (config) => {
		const files = config._altIconFiles || [];
		if (files.length === 0) return config;

		const project = config.modResults;
		const { projectName } = config.modRequest;
		const target = project.getFirstTarget().uuid;

		// Work around a bug in `xcode@3`: `correctForResourcesPath` dereferences
		// `project.pbxGroupByName('Resources').path` unconditionally, and Expo's
		// generated pbxproj has no such group — so `addResourceFile` crashes with
		// "Cannot read properties of null (reading 'path')". Pre-creating an empty,
		// path-less group fixes the crash without creating a visible Resources folder
		// in Xcode and without nesting the copied files under a subdirectory in the
		// app bundle (files added via Copy Bundle Resources are flattened to the
		// bundle root regardless of their project group).
		if (!project.pbxGroupByName('Resources')) {
			project.addPbxGroup([], 'Resources');
		}

		// Collect already-referenced paths so repeat prebuilds don't duplicate entries.
		const referenced = new Set();
		const fileRefs = project.hash.project.objects.PBXFileReference || {};
		for (const ref of Object.values(fileRefs)) {
			if (typeof ref === 'object' && ref.path) {
				// xcode wraps paths in quotes when they contain special chars.
				referenced.add(ref.path.replace(/^"|"$/g, ''));
			}
		}

		for (const file of files) {
			const projectRelPath = `${projectName}/${file}`;
			if (referenced.has(projectRelPath) || referenced.has(file)) continue;
			project.addResourceFile(projectRelPath, { target });
		}

		return config;
	});

module.exports = (config) => withAltIconXcodeResources(withCopyAltIconPngs(config));
