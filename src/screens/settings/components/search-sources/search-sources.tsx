import React, { useCallback } from 'react';
import { Switch, Settings } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useRouter } from 'expo-router';
import * as Localization from 'expo-localization';

import i18n from '@src/i18n';
import * as Haptics from 'expo-haptics';
import { useSettingsValue, setSettingsValue, useAccent } from '@hooks';

import { codeToFlag } from './data';
import Root, {
	Dot,
	Separator,
	ProviderRow,
	ProviderInfo,
	ProviderName,
	StoreConfigRow,
	ConfigPill,
	ConfigPillText
} from './search-sources.styles';

import type { SourceT } from '@api/soup/soup.d';
import type { AccentT } from '@themes/themes.d';

type ProviderMeta = {
	key: SourceT;
	color_slug: AccentT;
	labelKey: string;
	storeConfig?: 'country' | 'country+lang';
};

const PROVIDERS: ProviderMeta[] = [
	{ key: 'appstore', color_slug: 'blue', labelKey: 'settings.sources.appstore', storeConfig: 'country' },
	{ key: 'playstore', color_slug: 'green', labelKey: 'settings.sources.playstore', storeConfig: 'country+lang' },
	{ key: 'web', color_slug: 'orange', labelKey: 'settings.sources.web' },
	{ key: 'brandfetch', color_slug: 'purple', labelKey: 'settings.sources.brandfetch' },
	{ key: 'logo.dev', color_slug: 'mint', labelKey: 'settings.sources.logo_dev' }
];

const ALL_EXTERNAL: SourceT[] = PROVIDERS.map((p) => p.key);

const getDeviceRegion = (): string => Localization.getLocales()[0]?.regionCode?.toUpperCase() || 'US';

export const getEnabledSources = (): SourceT[] => {
	const raw = Settings.get('search_sources');
	if (!Array.isArray(raw)) return ALL_EXTERNAL;
	return raw;
};

export const getStoreSettings = () => ({
	app_store_country: (Settings.get('appstore_country') as string) || getDeviceRegion(),
	playstore_country: (Settings.get('playstore_country') as string) || getDeviceRegion(),
	language: (Settings.get('playstore_lang') as string) || i18n.language
});

const SearchSources = () => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();
	const accentColor = useAccent();

	const deviceRegion = getDeviceRegion();

	const sources = useSettingsValue<SourceT[]>('search_sources');
	const enabledSources = Array.isArray(sources) ? sources : ALL_EXTERNAL;

	const appstoreCountry = useSettingsValue<string>('appstore_country') || deviceRegion;
	const playstoreCountry = useSettingsValue<string>('playstore_country') || deviceRegion;
	const playstoreLang = useSettingsValue<string>('playstore_lang') || i18n.language;

	const toggle = useCallback(
		(source: SourceT) => {
			const isEnabled = enabledSources.includes(source);
			const next = isEnabled ? enabledSources.filter((s) => s !== source) : [...enabledSources, source];

			if (next.length === 0) return;

			setSettingsValue('search_sources', next);
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		},
		[enabledSources]
	);

	const openPicker = (target: string) => {
		router.push({
			pathname: '/(tabs)/settings/select-store-option',
			params: { target }
		});
	};

	const storeConfigs: Record<string, { country: string; lang?: string }> = {
		appstore: { country: appstoreCountry },
		playstore: { country: playstoreCountry, lang: playstoreLang }
	};

	return (
		<Root>
			{PROVIDERS.map((provider, index) => {
				const color = theme.accents[provider.color_slug];
				const isEnabled = enabledSources.includes(provider.key);
				const isLast = index === PROVIDERS.length - 1;

				const cfg = provider.storeConfig ? storeConfigs[provider.key] : null;

				return (
					<React.Fragment key={provider.key}>
						<ProviderRow>
							<ProviderInfo>
								<Dot $color={color} />
								<ProviderName>{t(provider.labelKey)}</ProviderName>
							</ProviderInfo>

							<Switch value={isEnabled} trackColor={{ true: accentColor }} onValueChange={() => toggle(provider.key)} />
						</ProviderRow>

						{provider.storeConfig && isEnabled && cfg && (
							<StoreConfigRow>
								<ConfigPill $color={color} onPress={() => openPicker(`${provider.key}_country`)}>
									<ConfigPillText $color={color}>
										{codeToFlag(cfg.country)}&nbsp;{t(`tokens.countries.${cfg.country}`)}
									</ConfigPillText>
								</ConfigPill>

								{provider.storeConfig === 'country+lang' && (
									<ConfigPill $color={color} onPress={() => openPicker(`${provider.key}_lang`)}>
										<ConfigPillText $color={color}>{t(`tokens.languages.${cfg.lang}`)}</ConfigPillText>
									</ConfigPill>
								)}
							</StoreConfigRow>
						)}

						{!isLast && <Separator />}
					</React.Fragment>
				);
			})}
		</Root>
	);
};

export default SearchSources;
