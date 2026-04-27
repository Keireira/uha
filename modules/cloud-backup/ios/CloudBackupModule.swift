import ExpoModulesCore
import CloudKit
import Foundation
import ZIPFoundation

public class CloudBackupModule: Module {
	private let containerID = "iCloud.com.keireira.uha"
	private let recordID = CKRecord.ID(recordName: "latest-backup")

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

		AsyncFunction("zip") { (at: String, to: String) -> Void in
			try self.zipDirectory(at: at, to: to)
		}

		AsyncFunction("unzip") { (at: String, to: String) -> Void in
			try self.unzipArchive(at: at, to: to)
		}
	}

	private func isAvailable() async throws -> Bool {
		let container = CKContainer(identifier: containerID)
		let status = try await container.accountStatus()

		return status == .available
	}

	private func createBackup(path: String) async throws {
		guard FileManager.default.fileExists(atPath: path) else {
			throw makeError(code: 0, message: "File not found")
		}

		let compressedPath = try compressFile(at: path)

		defer { try? FileManager.default.removeItem(atPath: compressedPath) }

		let record = CKRecord(recordType: "Backup", recordID: recordID)
		record["asset"] = CKAsset(fileURL: URL(filePath: compressedPath))
		record["timestamp"] = Date() as CKRecordValue

		let container = CKContainer(identifier: containerID)
		let database = container.privateCloudDatabase

		let operation = CKModifyRecordsOperation(recordsToSave: [record], recordIDsToDelete: nil)
		operation.savePolicy = .allKeys

		try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
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
		let container = CKContainer(identifier: containerID)
		let database = container.privateCloudDatabase
		let record = try await database.record(for: recordID)

		guard let asset = record["asset"] as? CKAsset else {
			throw makeError(code: 1, message: "Backup not found")
		}

		guard let fileURL = asset.fileURL else {
			throw makeError(code: 2, message: "Failed to get backup path")
		}

		let decompressedPath = try decompressFile(at: fileURL.path)

		return decompressedPath
	}

	private func getTimestamp() async throws -> String {
		let container = CKContainer(identifier: containerID)
		let database = container.privateCloudDatabase
		let operation = CKFetchRecordsOperation(recordIDs: [recordID])
		operation.desiredKeys = ["timestamp"]

		return try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<String, Error>) in
			operation.perRecordResultBlock = { _, result in
				switch result {
				case .success(let record):
					guard let timestamp = record["timestamp"] as? Date else {
						continuation.resume(throwing: self.makeError(code: 3, message: "Failed to get timestamp"))
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

	private func compressFile(at sourcePath: String) throws -> String {
		let data = try Data(contentsOf: URL(filePath: sourcePath))
		let compressed = try (data as NSData).compressed(using: .lzma) as Data

		let tmpPath = FileManager.default.temporaryDirectory.appendingPathComponent("backup-compressed.lzma")
		try replaceFile(at: tmpPath, with: compressed)

		return tmpPath.path
	}

	private func decompressFile(at sourcePath: String) throws -> String {
		let data = try Data(contentsOf: URL(filePath: sourcePath))
		let decompressed = try (data as NSData).decompressed(using: .lzma) as Data

		let tmpPath = FileManager.default.temporaryDirectory.appendingPathComponent("backup-restored.db")
		try replaceFile(at: tmpPath, with: decompressed)

		return tmpPath.path
	}

	private func zipDirectory(at sourcePath: String, to destPath: String) throws {
		try FileManager.default.zipItem(at: URL(filePath: sourcePath), to: URL(filePath: destPath))
	}

	private func unzipArchive(at sourcePath: String, to destPath: String) throws {
		try FileManager.default.unzipItem(at: URL(filePath: sourcePath), to: URL(filePath: destPath))
	}

	private func replaceFile(at url: URL, with data: Data) throws {
		let fm = FileManager.default

		if fm.fileExists(atPath: url.path) {
			try fm.removeItem(at: url)
		}

		try data.write(to: url)
	}

	private func makeError(code: Int, message: String) -> NSError {
		NSError(domain: "CloudBackup", code: code, userInfo: [NSLocalizedDescriptionKey: message])
	}
}
