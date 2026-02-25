import SwiftUI
import UIKit

class FloatingSearchBarState: ObservableObject {
	@Published var text: String = ""
	@Published var placeholder: String = "Search"
	@Published var tintColor: Color = .primary
	var onTextChange: ((String) -> Void)?
}

struct FloatingSearchBarContent: View {
	@ObservedObject var state: FloatingSearchBarState
	@FocusState private var isFocused: Bool
	@State private var showCloseButton = false

	var body: some View {
		HStack(spacing: 10) {
			searchField
			if isFocused { closeButton }
		}
		.tint(state.tintColor)
		.padding(.horizontal, 16)
		.animation(.easeInOut(duration: 0.25), value: isFocused)
		.onChange(of: isFocused) { focused in
			if focused {
				// Field shrinks first, then button appears
				withAnimation(.easeInOut(duration: 0.25)) {
					showCloseButton = true
				}
			} else {
				// Button disappears first, then field expands
				withAnimation(.easeInOut(duration: 0.15)) {
					showCloseButton = false
				}
			}
		}
		.onChange(of: state.text) { newValue in
			state.onTextChange?(newValue)
		}
	}

	private var searchField: some View {
		HStack(spacing: 12) {
			Image(systemName: "magnifyingglass")
				.foregroundStyle(state.tintColor.opacity(0.5))

			TextField(state.placeholder, text: $state.text)
				.font(.custom("Nunito", size: 17))
				.autocorrectionDisabled()
				.textInputAutocapitalization(.never)
				.focused($isFocused)
				.submitLabel(.search)

			if !state.text.isEmpty {
				Button {
					state.text = ""
				} label: {
					Image(systemName: "xmark.circle.fill")
						.foregroundStyle(state.tintColor)
						.font(.system(size: 16))
				}
			}
		}
		.padding(.horizontal, 14)
		.padding(.vertical, 12)
		.glass(in: .capsule)
	}

	private var closeButton: some View {
		Button {
			withAnimation(.easeInOut(duration: 0.15)) {
				showCloseButton = false
			}

			isFocused = false
			state.text = ""
		} label: {
			Image(systemName: "xmark")
				.font(.system(size: 14, weight: .semibold))
				.frame(width: 44, height: 44)
		}
		.glass(in: Circle())
		.transition(.scale.combined(with: .opacity))
	}
}

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

extension View {
	func glass<S: Shape>(in shape: S) -> some View {
		modifier(GlassModifier(shape: shape))
	}
}
