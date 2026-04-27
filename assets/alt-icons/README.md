# Alternate iOS app icons

Drop **one square source PNG per alternate** here (e.g. `enby.png` at 1024×1024).
The `with-alt-icons` config plugin auto-generates every scale/idiom variant iOS
and the App Store validator require, then copies the resulting files into
`ios/Uha/` during prebuild:

| Output file                | Pixels    | Device           |
| -------------------------- | --------- | ---------------- |
| `<name>60x60@2x.png`       | 120×120   | iPhone @2x       |
| `<name>60x60@3x.png`       | 180×180   | iPhone @3x       |
| `<name>76x76.png`          | 76×76     | iPad @1x         |
| `<name>76x76@2x.png`       | 152×152   | iPad @2x         |
| `<name>83.5x83.5@2x.png`   | 167×167   | iPad Pro 12.9″   |

The size-in-filename convention (rather than the shorter `~ipad` / `@2x`
auto-suffixes) is required so the App Store validator can find each slot by
exact pixel dimensions — particularly 167×167, for which iOS has no standard
suffix modifier.

The filenames without the trailing `@<scale>x` (`<name>60x60`, `<name>76x76`,
`<name>83.5x83.5`) are what you list under `CFBundleIconFiles` in `app.json`.
iOS picks the right variant at runtime based on the device.

## Bring-your-own variants

If you want hand-tuned artwork per size instead of letting the plugin resize,
drop the pre-rendered files directly — any filename that already encodes a
scale (`@2x`, `@3x`), idiom (`~ipad`) or a pixel-size token (`60x60`, etc.)
is copied through as-is without resizing.

## Notes

- Use large, square sources (≥ 1024×1024). The plugin downsizes; going the
  other way would be blurry.
- App Store rejects icons with alpha. The plugin flattens every generated
  variant over white (`#FFFFFF`). If you need a different base color, pre-render
  and drop the variants directly (see above).
- The primary icon is **not** managed here — it lives at `assets/images/uha.icon`
  (Liquid Glass) and is set via `ios.icon` in `app.json`.
- To add a new alternate: drop its source PNG here, then add matching entries
  to both `CFBundleIcons` (iPhone: one file) and `CFBundleIcons~ipad` (three
  files) under `CFBundleAlternateIcons` in `app.json`, then add a new logo
  entry to `src/screens/settings/components/app-logo-picker/logos.ts` so the
  picker UI shows it.
