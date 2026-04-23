# Uha | Уха

<https://trello.com/b/pEHXDigd/uha>

## TODO

- [x] utilize `max_horizon` settings
- [ ] unify `formSheet` pages with searchBar & remove `floating-search-bar` module

## WTF

```sh
# update expo
pnpm expo install expo@latest --fix

# fix errors
pnpx expo-doctor

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

### Patch Package
```sh
# 1. Start patching process:
pnpm patch "<PACKAGE_NAME>"

# 2. Edit files in provided tmp path
cd /Volumes/Personal/uha/node_modules/.pnpm_patches/@expo/ui@55.0.12
zed ./

# 3. Edit required files
# ...
# 4. Apply patch (exact string shall be provided to you at the 1st step):
pnpm patch-commit '/Volumes/Personal/uha/node_modules/.pnpm_patches/@expo/ui@55.0.12'
```


### Drizzle ORM

```sh
# 1. Update schemas
# 2. Apply migrations & resolve conflicts
pnpm drizzle-kit generate
```

```sh
# Custom migration
pnpm drizzle-kit generate --custom
```

### Setup

```sh
pnpm install
pnpm expo run:ios --device
```

### Submit-2

```sh
brew install fastlane cocoapods

# Build locally
eas build --platform ios --profile production --local

# Submit via EAS
eas submit --platform ios
```

- <https://docs.expo.dev/workflow/android-studio-emulator/>
- <https://docs.expo.dev/workflow/ios-simulator/>
- pnpx expo install expo-dev-client
- Do Not Forget to sign into your account in xed, and setup provisioning profile
- pnpm expo run:ios --device

I wanted to implement behavior when you can't close ContextMenu while tapping on it, so I created related patch.
Do not forget to remove it later, when support for such behavior will be added in `@expo/ui`
