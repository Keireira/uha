import SwiftUI
import ExpoModulesCore

internal struct LocaleModifier: ViewModifier, Record {
  @Field var identifier: String = ""

  @ViewBuilder
  func body(content: Content) -> some View {
    if identifier.isEmpty {
      content
    } else {
      content.environment(\.locale, Locale(identifier: identifier))
    }
  }
}
