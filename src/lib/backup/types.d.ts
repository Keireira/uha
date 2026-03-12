/** Error codes thrown by react-native-icloud-kit (mapped from Swift exceptions by Expo Modules Core). */
export enum ICLOUD_ERROR {
	/** User is not signed into iCloud on this device. */
	NOT_AVAILABLE = 'ERR_I_CLOUD_NOT_AVAILABLE',
	/** iCloud storage quota exceeded — user needs to free up space. */
	QUOTA_EXCEEDED = 'ERR_I_CLOUD_QUOTA_EXCEEDED',
	/** Network unreachable or CloudKit service unavailable. */
	NETWORK = 'ERR_I_CLOUD_NETWORK',
	/** The requested record ID does not exist in the private database. */
	RECORD_NOT_FOUND = 'ERR_I_CLOUD_RECORD_NOT_FOUND',
	/** Too many requests — retry after the delay indicated in the error message. */
	RATE_LIMITED = 'ERR_I_CLOUD_RATE_LIMITED',
	/** Catch-all for any other CKError code. */
	GENERIC = 'ERR_I_CLOUD'
}

/** Shape of errors thrown by react-native-icloud-kit at runtime. */
export type ICloudError = Error & {
	code: ICLOUD_ERROR;
};
