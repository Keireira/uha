.PHONY: rm fix dev build-release

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

build-release:
	eas build --platform ios --profile production --local
