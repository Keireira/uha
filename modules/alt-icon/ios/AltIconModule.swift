import ExpoModulesCore
import UIKit

/// Thin wrapper around `UIApplication.setAlternateIconName` so JS can switch
/// between the primary (.icon / Liquid Glass) asset and the alternate PNGs
/// declared in the app's Info.plist (`CFBundleIcons > CFBundleAlternateIcons`).
///
/// `setAlternateIconName(nil)` restores the primary icon — this is the only
/// way back to the default once an alternate has been applied.
public class AltIconModule: Module {
	public func definition() -> ModuleDefinition {
		Name("AltIcon")

		AsyncFunction("isSupported") { () -> Bool in
			await MainActor.run { UIApplication.shared.supportsAlternateIcons }
		}

		AsyncFunction("getCurrent") { () -> String? in
			await MainActor.run { UIApplication.shared.alternateIconName }
		}

		AsyncFunction("setCurrent") { (name: String?) -> Void in
			try await MainActor.run {
				guard UIApplication.shared.supportsAlternateIcons else {
					throw NSError(
						domain: "AltIcon",
						code: 1,
						userInfo: [NSLocalizedDescriptionKey: "Alternate icons not supported on this device"]
					)
				}
			}

			try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
				DispatchQueue.main.async {
					UIApplication.shared.setAlternateIconName(name) { error in
						if let error = error {
							continuation.resume(throwing: error)
						} else {
							continuation.resume()
						}
					}
				}
			}
		}
	}
}
