# Alternate iOS app icons

Drop **one square source PNG per alternate** here (e.g. `enby.png` at 1024×1024).
The `with-alt-icons` config plugin auto-generates every scale/idiom variant iOS
needs and copies the resulting files into `ios/Uha/` during prebuild:

| Output file          | Size      | Device |
| -------------------- | --------- | ------ |
| `<name>@2x.png`      | 120×120   | iPhone |
| `<name>@3x.png`      | 180×180   | iPhone |
| `<name>~ipad.png`    | 76×76     | iPad   |
| `<name>~ipad@2x.png` | 152×152   | iPad   |

The base name (without any suffix) is what you list in
`CFBundleIcons > CFBundleAlternateIcons > <name> > CFBundleIconFiles` in
`app.json`. iOS resolves the right variant at runtime from the bare name.

## Bring-your-own variants

If you want hand-tuned artwork per size instead of letting the plugin resize,
drop the pre-rendered files directly — any filename that already encodes a
scale (`@2x`, `@3x`) or idiom (`~ipad`) is copied through as-is without
resizing.

## Notes

- Use large, square sources (≥ 1024×1024). The plugin downsizes; going the
  other way would be blurry.
- App Store rejects icons with alpha. The plugin flattens every generated
  variant over white (`#FFFFFF`). If you need a different base color, pre-render
  and drop the variants directly (see above).
- The primary icon is **not** managed here — it lives at `assets/images/uha.icon`
  (Liquid Glass) and is set via `ios.icon` in `app.json`.
- To add a new alternate: drop its source PNG here, then add an entry to
  `CFBundleIcons > CFBundleAlternateIcons` (and the `~ipad` mirror) in `app.json`,
  then add a new logo entry to
  `src/screens/settings/components/app-logo-picker/logos.ts` so the picker UI shows it.
