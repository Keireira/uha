import ExpoModulesCore
import ExpoUI

public class WrapHStackModule: Module {
  public func definition() -> ModuleDefinition {
    Name("WrapHStack")

    ExpoUIView(WrapHStackView.self)
  }
}
