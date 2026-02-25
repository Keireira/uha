import ExpoModulesCore
import SwiftUI

class FloatingSearchBarView: ExpoView {
	let onChangeText = EventDispatcher()

	private var hostingView: UIView?
	private var hostingController: UIHostingController<FloatingSearchBarContent>?
	private let state = FloatingSearchBarState()

	required init(appContext: AppContext? = nil) {
		super.init(appContext: appContext)

		state.onTextChange = { [weak self] newText in
			self?.onChangeText(["text": newText])
		}
	}

	override func didMoveToWindow() {
		super.didMoveToWindow()

		if window != nil && hostingView == nil {
			attach()
		} else if window == nil {
			detach()
		}
	}

	private func attach() {
		guard let keyWindow = keyWindow else { return }

		let controller = UIHostingController(rootView: FloatingSearchBarContent(state: state))
		controller.view.backgroundColor = .clear

		let container = PassthroughView(frame: keyWindow.bounds)
		container.autoresizingMask = [.flexibleWidth, .flexibleHeight]
		container.backgroundColor = .clear

		controller.view.translatesAutoresizingMaskIntoConstraints = false
		container.addSubview(controller.view)

		NSLayoutConstraint.activate([
			controller.view.leadingAnchor.constraint(equalTo: container.leadingAnchor),
			controller.view.trailingAnchor.constraint(equalTo: container.trailingAnchor),
			controller.view.bottomAnchor.constraint(equalTo: container.bottomAnchor),
		])

		keyWindow.addSubview(container)
		hostingView = container
		hostingController = controller
	}

	private func detach() {
		hostingView?.removeFromSuperview()
		hostingView = nil
		hostingController = nil
	}

	func updateValue(_ value: String) {
		guard state.text != value else { return }
		state.text = value
	}

	func updatePlaceholder(_ placeholder: String) {
		state.placeholder = placeholder
	}

	func updateTintColor(_ hex: String) {
		state.tintColor = Color(hex: hex)
	}

	private var keyWindow: UIWindow? {
		UIApplication.shared.connectedScenes
			.compactMap { $0 as? UIWindowScene }
			.first?
			.windows
			.first(where: \.isKeyWindow)
	}
}
