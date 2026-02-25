import ExpoModulesCore

public class FloatingSearchBarModule: Module {
	public func definition() -> ModuleDefinition {
		Name("FloatingSearchBar")

		View(FloatingSearchBarView.self) {
			Events("onChangeText")

			Prop("value") { (view: FloatingSearchBarView, value: String?) in
				view.updateValue(value ?? "")
			}

			Prop("tintColor") { (view: FloatingSearchBarView, color: String?) in
				view.updateTintColor(color ?? "#000000")
			}

			Prop("placeholder") { (view: FloatingSearchBarView, placeholder: String?) in
				view.updatePlaceholder(placeholder ?? "Search")
			}
		}
	}
}
