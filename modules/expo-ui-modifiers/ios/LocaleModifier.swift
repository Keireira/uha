import SwiftUI
import ExpoModulesCore

// fr_FR, en_US etc
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
