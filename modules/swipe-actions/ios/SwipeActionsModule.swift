import ExpoModulesCore
import ExpoUI

public class SwipeActionsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("SwipeActions")

    OnCreate {
      ViewModifierRegistry.register("swipeActions") { params, appContext, dispatcher in
        return try SwipeActionsModifier(from: params, appContext: appContext, eventDispatcher: dispatcher)
      }
    }

    OnDestroy {
      ViewModifierRegistry.unregister("swipeActions")
    }
  }
}
