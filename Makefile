.PHONY: rm fix pod dev dev-logs build-release migrate migrate-custom

rm:
	rm -rf ./node_modules
	rm -rf ./ios
	rm -rf ./android
	rm -rf ./.expo
	rm ./pnpm-lock.yaml

fix:
	pnpm expo install expo@latest --fix

pod:
	cd ./ios && pod install

dev:
	pnpm expo run:ios --device

dev-logs:
	xcrun simctl spawn booted log stream --level debug 2>&1

build-release:
	eas build --platform ios --profile production --local

migrate:
	pnpm drizzle-kit generate

migrate-custom:
	pnpm drizzle-kit generate --custom
