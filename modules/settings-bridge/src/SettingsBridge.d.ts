export type SettingsColorSchemeName = 'light' | 'dark' | null;

export enum NotificationPermissionStatus {
	NOT_DETERMINED = 0,
	DENIED = 1,
	AUTHORIZED = 2,
	PROVISIONAL = 3,
	EPHEMERAL = 4
}

export type SettingsChangedEventPayload = {
	key: 'theme';
	timestamp: number;
	source: 'app' | 'ios_settings';
	oldValue: SettingsColorSchemeName;
	newValue: SettingsColorSchemeName;
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
