import ExpoModulesCore;
import CloudKit;

public class CloudBackupModule: Module {
	private let containerID = "iCloud.com.keireira.uha"

	public func definition() -> ModuleDefinition {
		Name("CloudBackup")

		AsyncFunction("isAvailable") { () -> Bool in
			return try await self.isAvailable()
		}

		AsyncFunction("createBackup") { (path: String) -> Void in
			try await self.createBackup(path: path)
		}

		AsyncFunction("fetchBackup") { () -> String in
			return try await self.fetchBackup()
		}

		AsyncFunction("getTimestamp") { () -> String in
			return try await self.getTimestamp()
		}
	}

	private func isAvailable() async throws -> Bool {
		let cloudKitContainer = CKContainer(identifier: self.containerID)
		let accountStatus = try await cloudKitContainer.accountStatus()

    return accountStatus == .available
	}

	private func createBackup(path: String) async throws {
		let fileManager = FileManager.default
		let isFileExists = fileManager.fileExists(atPath: path)

		if !isFileExists {
			throw NSError(domain: "CloudBackup", code: 0, userInfo: [NSLocalizedDescriptionKey: "File not found"])
		}

		let pathUrl = URL(filePath: path);
		let asset = CKAsset(fileURL: pathUrl)
		let record = CKRecord(recordType: "Backup", recordID: CKRecord.ID(recordName: "latest-backup"))
		record.setValue(asset, forKey: "asset")
		record.setValue(Date(), forKey: "timestamp")

		let cloudKitContainer = CKContainer(identifier: self.containerID)
		let database = cloudKitContainer.privateCloudDatabase

		let operation = CKModifyRecordsOperation(recordsToSave: [record], recordIDsToDelete: nil)
		operation.savePolicy = .allKeys

		try await withCheckedThrowingContinuation { continuation in
			operation.modifyRecordsResultBlock = { result in
				switch result {
					case .success:
						continuation.resume()
					case .failure(let error):
						continuation.resume(throwing: error)
				}
			}

			database.add(operation)
		}
	}

	private func fetchBackup() async throws -> String {
		let cloudKitContainer = CKContainer(identifier: self.containerID)
		let database = cloudKitContainer.privateCloudDatabase
		let record = try await database.record(for: CKRecord.ID(recordName: "latest-backup"))
		guard let asset = record.value(forKey: "asset") as? CKAsset else {
			throw NSError(domain: "CloudBackup", code: 1, userInfo: [NSLocalizedDescriptionKey: "Backup not found"])
		}

		guard let fileURL = asset.fileURL else {
			throw NSError(domain: "CloudBackup", code: 2, userInfo: [NSLocalizedDescriptionKey: "Failed to get backup path"])
		}

		let fileManager = FileManager.default
		let tmpPath = fileManager.temporaryDirectory.appendingPathComponent("backup.zip")
		if fileManager.fileExists(atPath: tmpPath.path) {
			try fileManager.removeItem(at: tmpPath)
		}
		try fileManager.copyItem(at: fileURL, to: tmpPath)

		return tmpPath.path
	}

	private func getTimestamp() async throws -> String {
		let cloudKitContainer = CKContainer(identifier: self.containerID)
		let database = cloudKitContainer.privateCloudDatabase
		let recordId = CKRecord.ID(recordName: "latest-backup")
		let operation = CKFetchRecordsOperation(recordIDs: [recordId])
		operation.desiredKeys = ["timestamp"]

		return try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<String, Error>) in
			operation.perRecordResultBlock = { recordID, result in
				switch result {
					case .success(let record):
						guard let timestamp = record.value(forKey: "timestamp") as? Date else {
							let error = NSError(domain: "CloudBackup", code: 3, userInfo: [NSLocalizedDescriptionKey: "Failed to get timestamp"])

							continuation.resume(throwing: error)
							return
						}

						continuation.resume(returning: ISO8601DateFormatter().string(from: timestamp))
					case .failure(let error):
						continuation.resume(throwing: error)
				}
			}

			database.add(operation)
		}
	}
}
