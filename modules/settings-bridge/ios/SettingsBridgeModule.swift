import ExpoModulesCore
import UIKit
import UserNotifications

private final class ThemeObserverViewController: UIViewController {
	var onThemeChange: ((UIUserInterfaceStyle) -> Void)?

	override func loadView() {
		let view = UIView(frame: .zero)
		view.isHidden = true
		view.isUserInteractionEnabled = false
		self.view = view
	}

	override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
		super.traitCollectionDidChange(previousTraitCollection)

		let currentStyle = traitCollection.userInterfaceStyle
		guard currentStyle != .unspecified else {
			return
		}

		if previousTraitCollection?.userInterfaceStyle != currentStyle {
			onThemeChange?(currentStyle)
		}
	}
}

public class SettingsBridgeModule: Module {
	private var hasListeners = false
	private var lastStoredThemeValue: String?
	private var lastInterfaceStyleValue: String?
	private var lastNotificationPermissionValue: UNAuthorizationStatus?
	private var themeObserverViewController: ThemeObserverViewController?

	public func definition() -> ModuleDefinition {
		Name("SettingsBridge")

		Events("onThemeChanged", "onNotificationChanged")

		Function("getColorScheme") { () -> String? in
			return self.currentInterfaceStyleValue()
		}

		OnStartObserving {
			self.hasListeners = true
			self.lastStoredThemeValue = UserDefaults.standard.string(forKey: "theme")
			self.lastInterfaceStyleValue = self.currentInterfaceStyleValue()
			self.attachThemeObserverIfNeeded()
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

		NotificationCenter.default.addObserver(
			self,
			selector: #selector(userInterfaceStyleDidChange(_:)),
			name: Notification.Name("RCTUserInterfaceStyleDidChangeNotification"),
			object: nil
		)
	}

	private func createThemeEventData(_ source: String, _ oldValue: String?, _ newValue: String?) -> [String: Any] {
		return [
			"key": "theme",
			"timestamp": Date().timeIntervalSince1970,
			"source": source,
			"oldValue": oldValue ?? NSNull(),
			"newValue": newValue ?? NSNull()
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

	private func colorSchemeName(for style: UIUserInterfaceStyle) -> String? {
		switch style {
			case .dark:
				return "dark"
			case .light:
				return "light"
			default:
				return nil
		}
	}

	private func currentWindow() -> UIWindow? {
		return UIApplication.shared.connectedScenes
			.compactMap { $0 as? UIWindowScene }
			.flatMap { $0.windows }
			.first { $0.isKeyWindow }
	}

	private func currentInterfaceStyleValue() -> String? {
		if let style = currentWindow()?.traitCollection.userInterfaceStyle {
			return colorSchemeName(for: style)
		}

		return colorSchemeName(for: UITraitCollection.current.userInterfaceStyle)
	}

	private func resolvedThemeValue(_ storedValue: String?) -> String? {
		if storedValue == "auto" || storedValue == nil {
			return currentInterfaceStyleValue()
		}

		return storedValue
	}

	private func attachThemeObserverIfNeeded() {
		DispatchQueue.main.async {
			guard self.themeObserverViewController == nil else {
				return
			}

			guard let rootViewController = self.currentWindow()?.rootViewController else {
				return
			}

			let observer = ThemeObserverViewController()
			observer.onThemeChange = { [weak self] _ in
				self?.interfaceStyleDidChange(source: "ios_settings")
			}

			rootViewController.addChild(observer)
			rootViewController.view.addSubview(observer.view)
			observer.didMove(toParent: rootViewController)

			self.themeObserverViewController = observer
			self.lastInterfaceStyleValue = self.currentInterfaceStyleValue()
		}
	}

	private func interfaceStyleValue(from notification: Notification) -> String? {
		guard let traitCollection = notification.userInfo?["traitCollection"] as? UITraitCollection else {
			return currentInterfaceStyleValue()
		}

		return colorSchemeName(for: traitCollection.userInterfaceStyle) ?? currentInterfaceStyleValue()
	}

	@objc
	private func defaultValuesDidChange() {
		guard hasListeners else {
			return
		}

		let currentTheme = UserDefaults.standard.string(forKey: "theme")

		if currentTheme != lastStoredThemeValue {
			let eventData = createThemeEventData("app", resolvedThemeValue(lastStoredThemeValue), resolvedThemeValue(currentTheme))
			sendEvent("onThemeChanged", eventData)
		}

		lastStoredThemeValue = currentTheme
	}

	@objc
	private func appDidBecomeActive() {
		guard hasListeners else {
			return
		}

		attachThemeObserverIfNeeded()
		interfaceStyleDidChange(source: "ios_settings")

		let currentTheme = UserDefaults.standard.string(forKey: "theme")

		if currentTheme != lastStoredThemeValue {
			let eventData = createThemeEventData("app", resolvedThemeValue(lastStoredThemeValue), resolvedThemeValue(currentTheme))
			sendEvent("onThemeChanged", eventData)
		}

		lastStoredThemeValue = currentTheme

		checkNotificationPermission { status in
			if status != self.lastNotificationPermissionValue {
				let eventData = self.createNotificationEventData("ios_settings", status)
				self.sendEvent("onNotificationChanged", eventData)
				self.lastNotificationPermissionValue = status
			}
		}
	}

	@objc
	private func userInterfaceStyleDidChange(_ notification: Notification) {
		interfaceStyleDidChange(source: "ios_settings", currentValue: interfaceStyleValue(from: notification))
	}

	private func interfaceStyleDidChange(source: String, currentValue: String? = nil) {
		guard hasListeners else {
			lastInterfaceStyleValue = currentValue ?? currentInterfaceStyleValue()
			return
		}

		let currentInterfaceStyle = currentValue ?? currentInterfaceStyleValue()

		if currentInterfaceStyle != lastInterfaceStyleValue {
			let eventData = createThemeEventData(source, lastInterfaceStyleValue, currentInterfaceStyle)
			sendEvent("onThemeChanged", eventData)
		}

		lastInterfaceStyleValue = currentInterfaceStyle
	}

	deinit {
		NotificationCenter.default.removeObserver(self)
	}
}
