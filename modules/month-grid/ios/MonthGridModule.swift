import ExpoModulesCore

public class MonthGridModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MonthGrid")

    View(MonthGridView.self) {
      Events("onPressMonth")

      Prop("title") { (view: MonthGridView, value: String) in
        guard view.state.title != value else { return }
        view.state.title = value
      }

      Prop("year") { (view: MonthGridView, value: Int) in
        guard view.state.year != value else { return }
        view.state.year = value
      }

      Prop("month") { (view: MonthGridView, value: Int) in
        guard view.state.month != value else { return }
        view.state.month = value
      }

      Prop("weekStartsOn") { (view: MonthGridView, value: Int) in
        guard view.state.weekStartsOn != value else { return }
        view.state.weekStartsOn = value
      }

      Prop("isInRange") { (view: MonthGridView, value: Bool) in
        guard view.state.isInRange != value else { return }
        view.state.isInRange = value
      }

      Prop("daysWithTxs") { (view: MonthGridView, value: [String]) in
        let newSet = Set(value)
        guard view.state.daysWithTxs != newSet else { return }
        view.state.daysWithTxs = newSet
      }

      Prop("selectedDay") { (view: MonthGridView, value: String?) in
        guard view.state.selectedDay != value else { return }
        view.state.selectedDay = value
      }

      Prop("colors") { (view: MonthGridView, value: [String: String]) in
        view.state.updateColors(value)
      }
    }
  }
}
