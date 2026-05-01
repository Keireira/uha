import SwiftUI
import ExpoModulesCore

internal enum ScrollIndicatorsVisibility: String, Enumerable {
  case automatic
  case visible
  case hidden
  case never

  @available(iOS 16.0, *)
  var toSwiftUI: ScrollIndicatorVisibility {
    switch self {
    case .automatic: return .automatic
    case .visible: return .visible
    case .hidden: return .hidden
    case .never: return .never
    }
  }
}

internal struct ScrollIndicatorsModifier: ViewModifier, Record {
  @Field var visibility: ScrollIndicatorsVisibility = .hidden

  @ViewBuilder
  func body(content: Content) -> some View {
    if #available(iOS 16.0, *) {
      content.scrollIndicators(visibility.toSwiftUI)
    } else {
      content
    }
  }
}
