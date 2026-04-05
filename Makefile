.PHONY: rm fix dev dev-logs build-release

rm:
	rm -rf ./node_modules
	rm -rf ./ios
	rm -rf ./android
	rm -rf ./.expo
	rm ./pnpm-lock.yaml


fix:
	pnpm expo install expo@latest --fix

dev:
	pnpm expo run:ios --device

dev-logs:
	xcrun simctl spawn booted log stream --level debug 2>&1

build-release:
	eas build --platform ios --profile production --local
