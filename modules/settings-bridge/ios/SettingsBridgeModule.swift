import ExpoModulesCore
import UserNotifications

public class SettingsBridgeModule: Module {
	private var hasListeners = false
	private var lastThemeValue: String?
	private var lastNotificationPermissionValue: UNAuthorizationStatus?

	public func definition() -> ModuleDefinition {
		Name("SettingsBridge")

		Events("onThemeChanged", "onNotificationChanged")

		OnStartObserving {
			self.hasListeners = true
			self.lastThemeValue = UserDefaults.standard.string(forKey: "theme")
			self.checkNotificationPermission { status in
				self.lastNotificationPermissionValue = status
			}
		}

		OnStopObserving {
			self.hasListeners = false
		}
	}

	public required init(appContext: AppContext) {
		super.init(appContext: appContext)

		NotificationCenter.default.addObserver(
			self,
			selector: #selector(defaultValuesDidChange),
			name: UserDefaults.didChangeNotification,
			object: nil
		)

		NotificationCenter.default.addObserver(
			self,
			selector: #selector(appDidBecomeActive),
			name: UIApplication.didBecomeActiveNotification,
			object: nil
		)
	}

	private func createThemeEventData(_ source: String, _ newValue: String?) -> [String: Any] {
		return [
			"key": "theme",
			"timestamp": Date().timeIntervalSince1970,
			"source": source,
			"oldValue": lastThemeValue ?? "nil",
			"newValue": newValue == "system" ? nil : (newValue ?? "nil")
		]
	}

	private func createNotificationEventData(_ source: String, _ newValue: UNAuthorizationStatus) -> [String: Any] {
		return [
			"key": "notification",
			"timestamp": Date().timeIntervalSince1970,
			"source": source,
			"oldValue": lastNotificationPermissionValue?.rawValue ?? -1,
			"newValue": newValue.rawValue
		]
	}

	private func checkNotificationPermission(completion: @escaping (UNAuthorizationStatus) -> Void) {
		UNUserNotificationCenter.current().getNotificationSettings { settings in
			DispatchQueue.main.async {
				completion(settings.authorizationStatus)
			}
		}
	}

	@objc
	private func defaultValuesDidChange() {
		guard hasListeners else {
			return
		}

		let currentTheme = UserDefaults.standard.string(forKey: "theme")

		if currentTheme != lastThemeValue {
			let eventData = createThemeEventData("app", currentTheme)
			sendEvent("onThemeChanged", eventData)
		}

		lastThemeValue = currentTheme
	}

	@objc
	private func appDidBecomeActive() {
		guard hasListeners else {
			return
		}

		let currentTheme = UserDefaults.standard.string(forKey: "theme")

		if currentTheme != lastThemeValue {
			let eventData = createThemeEventData("ios_settings", currentTheme)
			sendEvent("onThemeChanged", eventData)
		}

		lastThemeValue = currentTheme

		checkNotificationPermission { status in
			if status != self.lastNotificationPermissionValue {
				let eventData = self.createNotificationEventData("ios_settings", status)
				self.sendEvent("onNotificationChanged", eventData)
				self.lastNotificationPermissionValue = status
			}
		}
	}

	deinit {
		NotificationCenter.default.removeObserver(self)
	}
}
