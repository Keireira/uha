import type { ColorSchemeName } from 'react-native';

export enum NotificationPermissionStatus {
	NOT_DETERMINED = 0,
	DENIED = 1,
	AUTHORIZED = 2,
	PROVISIONAL = 3,
	EPHEMERAL = 4
}

export type SettingsChangedEventPayload = {
	key: string | 'theme';
	timestamp: number;
	source: 'app' | 'ios_settings';
	oldValue: ColorSchemeName;
	newValue: ColorSchemeName;
};

export type NotificationPermissionChangedEventPayload = {
	key: 'notification';
	timestamp: number;
	source: 'ios_settings';
	oldValue: NotificationPermissionStatus; // UNAuthorizationStatus raw value
	newValue: NotificationPermissionStatus; // UNAuthorizationStatus raw value
};

export type SettingsBridgeModuleEvents = {
	onThemeChanged: (params: SettingsChangedEventPayload) => void;
	onNotificationChanged: (params: NotificationPermissionChangedEventPayload) => void;
};
