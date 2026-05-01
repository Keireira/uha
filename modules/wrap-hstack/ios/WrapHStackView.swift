import SwiftUI
import ExpoModulesCore
import ExpoUI

public final class WrapHStackViewProps: UIBaseViewProps {
  @Field var spacing: Double = 8
  @Field var lineSpacing: Double = 8
  @Field var columns: Int = 0
}

public struct WrapHStackLayout: Layout {
  var spacing: CGFloat = 8
  var lineSpacing: CGFloat = 8
  var columns: Int = 0

  public init(spacing: CGFloat = 8, lineSpacing: CGFloat = 8, columns: Int = 0) {
    self.spacing = spacing
    self.lineSpacing = lineSpacing
    self.columns = columns
  }

  private func itemWidth(for width: CGFloat?) -> CGFloat? {
    guard let width, width.isFinite, columns > 0 else {
      return nil
    }

    let columnCount = CGFloat(columns)
    let totalSpacing = spacing * max(columnCount - 1, 0)

    return max((width - totalSpacing) / columnCount, 0)
  }

  public func sizeThatFits(
    proposal: ProposedViewSize,
    subviews: Subviews,
    cache: inout ()
  ) -> CGSize {
    let maxWidth = proposal.width ?? .infinity
    let preferredItemWidth = itemWidth(for: proposal.width)
    let itemProposal = preferredItemWidth.map {
      ProposedViewSize(width: $0, height: nil)
    } ?? .unspecified

    var x: CGFloat = 0
    var y: CGFloat = 0
    var lineHeight: CGFloat = 0
    var resultWidth: CGFloat = 0

    for subview in subviews {
      var size = subview.sizeThatFits(itemProposal)

      if let preferredItemWidth {
        size.width = preferredItemWidth
      }

      if x > 0, x + size.width > maxWidth {
        y += lineHeight + lineSpacing
        x = 0
        lineHeight = 0
      }

      resultWidth = max(resultWidth, x + size.width)
      x += size.width + spacing
      lineHeight = max(lineHeight, size.height)
    }

    return CGSize(
      width: proposal.width ?? resultWidth,
      height: y + lineHeight
    )
  }

  public func placeSubviews(
    in bounds: CGRect,
    proposal: ProposedViewSize,
    subviews: Subviews,
    cache: inout ()
  ) {
    let preferredItemWidth = itemWidth(for: bounds.width)
    let itemProposal = preferredItemWidth.map {
      ProposedViewSize(width: $0, height: nil)
    } ?? .unspecified

    var x: CGFloat = 0
    var y: CGFloat = 0
    var lineHeight: CGFloat = 0

    for subview in subviews {
      var size = subview.sizeThatFits(itemProposal)

      if let preferredItemWidth {
        size.width = preferredItemWidth
      }

      if x > 0, x + size.width > bounds.width {
        y += lineHeight + lineSpacing
        x = 0
        lineHeight = 0
      }

      subview.place(
        at: CGPoint(x: bounds.minX + x, y: bounds.minY + y),
        proposal: ProposedViewSize(width: size.width, height: size.height)
      )

      x += size.width + spacing
      lineHeight = max(lineHeight, size.height)
    }
  }
}

public struct WrapHStackView: ExpoSwiftUI.View {
  @ObservedObject public var props: WrapHStackViewProps

  public init(props: WrapHStackViewProps) {
    self.props = props
  }

  public var body: some View {
    WrapHStackLayout(
      spacing: CGFloat(props.spacing),
      lineSpacing: CGFloat(props.lineSpacing),
      columns: props.columns
    ) {
      Children()
    }
  }
}
