import ExpoModulesCore
import SwiftUI

final class MonthGridState: ObservableObject {
  @Published var title: String = ""
  @Published var year: Int = 2026
  @Published var month: Int = 1
  @Published var weekStartsOn: Int = 1
  @Published var isInRange: Bool = true
  @Published var daysWithTxs: Set<String> = []
  @Published var selectedDay: String? = nil

  // Colors — updated in batch, not individually published
  var emptyBg: Color = .clear
  var textPrimary: Color = .primary
  var textHighlight: Color = .white
  var markSelected: Color = .orange
  var markTx: Color = .purple
  var headerColor: Color = .primary

  var onPressMonth: (() -> Void)?

  func updateColors(_ dict: [String: String]) {
    // Single objectWillChange instead of 6 separate @Published fires
    var changed = false
    for (key, hex) in dict {
      let color = Color(hex: hex)
      switch key {
      case "emptyBg":       emptyBg = color;       changed = true
      case "textPrimary":   textPrimary = color;    changed = true
      case "textHighlight": textHighlight = color;  changed = true
      case "markSelected":  markSelected = color;   changed = true
      case "markTx":        markTx = color;         changed = true
      case "headerColor":   headerColor = color;    changed = true
      default: break
      }
    }
    if changed { objectWillChange.send() }
  }
}

final class MonthGridView: ExpoView {
  let onPressMonth = EventDispatcher()
  let state = MonthGridState()
  private let hostingController: UIHostingController<MonthGridContent>

  required init(appContext: AppContext? = nil) {
    let content = MonthGridContent(state: state) // capture before super.init
    let hc = UIHostingController(rootView: content)
    hc._disableSafeArea = true
    hc.view.backgroundColor = .clear
    self.hostingController = hc

    super.init(appContext: appContext)

    clipsToBounds = false
    backgroundColor = .clear
    state.onPressMonth = { [weak self] in self?.onPressMonth([:]) }
    addSubview(hc.view)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    let hcView = hostingController.view!
    if hcView.frame != bounds { hcView.frame = bounds }
  }

  override func sizeThatFits(_ size: CGSize) -> CGSize {
    let fitted = hostingController.sizeThatFits(
      in: CGSize(width: size.width, height: .greatestFiniteMagnitude)
    )
    return CGSize(width: size.width, height: fitted.height)
  }

  override var intrinsicContentSize: CGSize {
    let w = bounds.width > 0 ? bounds.width : 120
    return hostingController.sizeThatFits(
      in: CGSize(width: w, height: .greatestFiniteMagnitude)
    )
  }
}
