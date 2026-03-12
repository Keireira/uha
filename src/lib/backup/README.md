# CloudKit Backup Setup

Step-by-step guide for setting up iCloud/CloudKit backup.

## How it works

The app backs up the SQLite database (`db.db` (`const DB_NAME`)) to the CloudKit Private Database.

- **Backup**: WAL checkpoint -> read db file -> encode to base64 -> save as a CloudKit record
- **Restore**: query record from CloudKit -> decode base64 -> validate SQLite header -> replace db -> reload app

All data is stored in the user's **private database** -- only the iCloud account owner has access.

## 1. Apple Developer Portal

### 1.1 Enable iCloud capability on the App ID

1. Open [Apple Developer - Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/)
2. In the left sidebar click **Identifiers**
3. Find and click your App ID: `com.keireira.uha`
4. Scroll down to the **Capabilities** list
5. Find **iCloud** and make sure the checkbox is enabled
6. Click on **iCloud** to expand it -- make sure **CloudKit** is selected (not just Key-Value Storage)
7. Click **Save** if you made any changes

### 1.2 iCloud Containers

An iCloud Container is a named storage bucket in CloudKit. Each app that uses CloudKit must be associated with at least one container. The container identifier follows the format `iCloud.{bundle-id}`.

**How to check if the container exists:**

1. In the same [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/) page
2. In the left sidebar, under **Identifiers**, click the dropdown filter (it defaults to "App IDs")
3. Switch the filter to **iCloud Containers**
4. Look for `iCloud.com.keireira.uha` in the list

**If the container does not exist -- create it:**

1. On the **iCloud Containers** page click the **+** button
2. Enter description: `Uha CloudKit Container` (or anything descriptive)
3. Enter identifier: `iCloud.com.keireira.uha`
4. Click **Continue**, then **Register**

**Associate the container with the App ID:**

1. Go back to **Identifiers** (switch the filter back to "App IDs")
2. Click on `com.keireira.uha`
3. Scroll down to the **iCloud** capability and expand it
4. Under **iCloud Containers**, check the box next to `iCloud.com.keireira.uha`
5. Click **Save**

> The Expo plugin (`react-native-icloud-kit/plugin/withICloud`) handles the Xcode entitlements file automatically during prebuild, but the container itself must exist in the Developer Portal.

## 2. Expo Plugin (app.json)

The plugin automatically adds entitlements and the iCloud capability during prebuild:

```json
[
	"react-native-icloud-kit/plugin/withICloud",
	{
		"containerIdentifier": "iCloud.com.keireira.uha"
	}
]
```

After changing app.json:

```bash
pnpm expo prebuild --clean
pnpm expo run:ios
```

## 3. CloudKit Dashboard -- Schema (Development)

This is the most important step. Without it `query()` does not work.

1. Open [CloudKit Console](https://icloud.developer.apple.com)
2. Select container **iCloud.com.keireira.uha**
3. Make sure the **Development** environment is selected

### 3.1 Record Type

Go to **Schema -> Record Types**.

Record types are created automatically on the first `save()`, but indexes must be added manually.

There are two record types:

#### `DatabaseBackup` (manifest)

The main record that stores backup metadata. One record per backup.

| Field Name    | Type      | Description                             |
| ------------- | --------- | --------------------------------------- |
| `timestamp`   | `Int(64)` | Unix timestamp of the backup (ms)       |
| `totalChunks` | `Int(64)` | Number of chunk records for this backup |
| `version`     | `Int(64)` | Backup format version (currently 1)     |

#### `DatabaseBackupChunk` (data chunks)

Each chunk holds a portion of the compressed base64 data (up to 666KB per record). A backup with a 2MB compressed payload would have 3 chunk records.

| Field Name | Type      | Description                                 |
| ---------- | --------- | ------------------------------------------- |
| `data`     | `String`  | Base64 slice of the zip-compressed db file  |
| `index`    | `Int(64)` | Zero-based chunk index for reassembly order |

Chunk record IDs follow the pattern `latest-backup-chunk-{index}`.

### 3.2 Indexes (required!)

Without indexes CloudKit refuses to execute `query()` with the error:

```
CloudKit error: Type is not marked indexable: DatabaseBackup
```

You need indexes on **both** record types.

#### `DatabaseBackup` indexes

Go to **Schema -> Record Types -> DatabaseBackup -> Edit Indexes**:

1. Add an index:
   - **Field**: `recordName`
   - **Index Type**: `QUERYABLE`
2. Add an index:
   - **Field**: `timestamp`
   - **Index Type**: `QUERYABLE`
3. Add an index:
   - **Field**: `timestamp`
   - **Index Type**: `SORTABLE`

#### `DatabaseBackupChunk` indexes

Go to **Schema -> Record Types -> DatabaseBackupChunk -> Edit Indexes**:

1. Add an index:
   - **Field**: `recordName`
   - **Index Type**: `QUERYABLE`

> `recordName` is a system field. It must be marked QUERYABLE on every record type for `query()` to work at all.

> Each index type is a separate entry (e.g. QUERYABLE and SORTABLE on `timestamp` are two rows).

## 4. Testing in Development

1. Run the app on a **real device** (CloudKit often does not work on the simulator)
2. The device must be signed into iCloud (Settings -> Apple Account)
3. The device must have network access
4. Try creating a backup from Settings -> Data -> iCloud Sync
5. In CloudKit Console -> **Data** -> **Private Database** -> **RNICloudKitZone** you should see:
   - A `DatabaseBackup` record with `recordName` = `latest-backup`
   - One or more `DatabaseBackupChunk` records with `recordName` = `latest-backup-chunk-0`, `latest-backup-chunk-1`, etc.

### Common errors

| Error                                         | Cause                                 | Solution                                             |
| --------------------------------------------- | ------------------------------------- | ---------------------------------------------------- |
| `ERR_I_CLOUD_NETWORK` (CKErrorDomain error 4) | No network or CloudKit is unreachable | Check internet, try on a real device                 |
| `Type is not marked indexable`                | No indexes on the record type         | Add QUERYABLE indexes (step 3.2)                     |
| `ERR_I_CLOUD_NOT_AVAILABLE`                   | User is not signed into iCloud        | The app shows "Sign in to iCloud" and opens Settings |
| `ERR_I_CLOUD_QUOTA_EXCEEDED`                  | iCloud storage is full                | User needs to free up space                          |
| `ERR_I_CLOUD_RECORD_NOT_FOUND`                | No backup exists                      | Expected behavior on first launch                    |

## 5. Deploy to Production

**Only after everything works in Development!**

1. Open [CloudKit Console](https://icloud.developer.apple.com)
2. Select container `iCloud.com.keireira.uha`
3. Go to **Schema -> Deploy to Production...**
4. Review the diff -- it should include `DatabaseBackup`, `DatabaseBackupChunk` and their indexes
5. Click **Deploy**

> Production schema is additive only -- you cannot delete fields or record types. Make sure the schema is correct before deploying.

## 6. Code constants

Defined in `src/lib/backup/shared.ts`:

```
RECORD_TYPE       = 'DatabaseBackup'       -- manifest record type
CHUNK_RECORD_TYPE = 'DatabaseBackupChunk'  -- chunk record type (in cloudkit-backup.ts)
RECORD_ID         = 'latest-backup'        -- deterministic ID, each backup overwrites the previous one
CHUNK_SIZE        = 666_000                -- max base64 chars per chunk record
```

If you need to change the record type name -- update the constants. But after the first production deploy the old record types cannot be deleted.

## 7. Limitations

- **Size**: each chunk record holds up to 666KB of base64. Data is split across multiple records automatically, so backups up to tens of MB are supported
- **iOS only**: on Android `isAvailable()` returns `false`, the UI shows "unavailable"
- **Single backup**: uses a deterministic ID, a new backup overwrites the old one
- **Private database**: data is tied to the user's iCloud account, we have no access to it
- **Currency rates excluded**: the `currency_rates` table is stripped before backup to reduce size. Rates are re-fetched from API after restore
