import UIKit

/*
 * Transparent full-screen container that passes through touches to views behind it.
 * Only intercepts touches on actual subviews.
 */
class PassthroughView: UIView {
	override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
		let result = super.hitTest(point, with: event)
		return result === self ? nil : result
	}
}
