import SwiftUI

public extension Color {
  init(hex: String) {
    let raw: Substring
    if hex.first == "#" { raw = hex.dropFirst() } else { raw = hex[...] }

    guard let int = UInt64(raw, radix: 16) else {
      self.init(.sRGB, red: 0, green: 0, blue: 0, opacity: 1)
      return
    }

    switch raw.count {
    case 6:
      self.init(
        .sRGB,
        red:     Double((int >> 16) & 0xFF) / 255,
        green:   Double((int >> 8)  & 0xFF) / 255,
        blue:    Double(int         & 0xFF) / 255,
        opacity: 1
      )

    case 8:
      self.init(
        .sRGB,
        red:     Double((int >> 24) & 0xFF) / 255,
        green:   Double((int >> 16) & 0xFF) / 255,
        blue:    Double((int >> 8)  & 0xFF) / 255,
        opacity: Double(int         & 0xFF) / 255
      )

    default:
      self.init(.sRGB, red: 0, green: 0, blue: 0, opacity: 1)
    }
  }
}
