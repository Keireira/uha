import SwiftUI
import ExpoModulesCore
import ExpoUI

internal enum SwipeEdgeOption: String, Enumerable {
  case leading
  case trailing

  var horizontalEdge: HorizontalEdge {
    switch self {
    case .leading: return .leading
    case .trailing: return .trailing
    }
  }
}

internal enum SwipeActionRoleOption: String, Enumerable {
  case `default`
  case destructive
  case cancel

  var buttonRole: SwiftUI.ButtonRole? {
    switch self {
    case .default: return nil
    case .destructive: return .destructive
    case .cancel: return .cancel
    }
  }
}

internal struct SwipeActionRecord: Record {
  @Field var id: String = ""
  @Field var systemImage: String = ""
  @Field var tint: UIColor?
  @Field var role: SwipeActionRoleOption = .default
  // Optional visible label. Empty string keeps the button icon-only.
  @Field var label: String = ""

  init() {}
}

internal struct SwipeActionsModifier: ViewModifier, Record {
  @Field var actions: [SwipeActionRecord] = []
  @Field var edge: SwipeEdgeOption = .trailing
  @Field var allowsFullSwipe: Bool = true

  var eventDispatcher: EventDispatcher?

  init() {}

  init(from params: Dict, appContext: AppContext, eventDispatcher: EventDispatcher) throws {
    try self = .init(from: params, appContext: appContext)
    self.eventDispatcher = eventDispatcher
  }

  @ViewBuilder
  private func actionButton(_ action: SwipeActionRecord) -> some View {
    let dispatcher = eventDispatcher
    let actionId = action.id
    let tintColor: Color? = action.tint.map { Color($0) }

    Button(role: action.role.buttonRole) {
      // Routing in @expo/ui JS keys events by modifier $type, see
      // node_modules/@expo/ui/src/swift-ui/modifiers/utils.ts.
      dispatcher?(["swipeActions": ["id": actionId]])
    } label: {
      if action.label.isEmpty {
        Label("", systemImage: action.systemImage)
          .labelStyle(.iconOnly)
      } else {
        Label(action.label, systemImage: action.systemImage)
      }
    }
    .tint(tintColor)
  }

  func body(content: Content) -> some View {
    content.swipeActions(edge: edge.horizontalEdge, allowsFullSwipe: allowsFullSwipe) {
      ForEach(actions, id: \.id) { action in
        actionButton(action)
      }
    }
  }
}
