# Уха

<https://currencyapi.net/documentation>

## TODO

- [ ] Add missed currency SF symbols as custom SF symbols (see figma plugin + <https://developer.apple.com/documentation/uikit/creating-custom-symbol-images-for-your-app>)
- [ ] When text overflows trigger in list, show ... sign instead just cutting the text
- [ ] Implement custom lists (child\husband\friend??)

## WTF

```sh
# run dev
pnpm expo run:ios --device


# Install eas-cli
pnpm add --global eas-cli

# Login to expo
pnpm expo login
eas login

# initiate build on EAS side
eas build --platform ios

# Initiate submission process for iOS
eas submit --platform ios
```

- <https://docs.expo.dev/workflow/android-studio-emulator/>
- <https://docs.expo.dev/workflow/ios-simulator/>
- pnpx expo install expo-dev-client
- Do Not Forget to sign into your account in xed, and setup provisioning profile
- pnpm expo run:ios --device

I wanted to implement behavior when you can't close ContextMenu while tapping on it, so I created related patch.
Do not forget to remove it later, when support for such behavior will be added in `@expo/ui`
