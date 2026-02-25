import SwiftUI
import UIKit

struct GlassModifier<S: Shape>: ViewModifier {
	let shape: S

	func body(content: Content) -> some View {
		if #available(iOS 26.0, *) {
			content.glassEffect(.regular.interactive(), in: AnyShape(shape))
		} else {
			content.background(.ultraThinMaterial, in: shape)
		}
	}
}

public extension View {
	func glass<S: Shape>(in shape: S) -> some View {
		modifier(GlassModifier(shape: shape))
	}
}
