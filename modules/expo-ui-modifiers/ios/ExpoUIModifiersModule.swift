import ExpoModulesCore
import ExpoUI

public class ExpoUIModifiersModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoUIModifiers")

    OnCreate {
      ViewModifierRegistry.register("scrollIndicators") { params, appContext, _ in
        return try ScrollIndicatorsModifier(from: params, appContext: appContext)
      }

      ViewModifierRegistry.register("locale") { params, appContext, _ in
        return try LocaleModifier(from: params, appContext: appContext)
      }

      ViewModifierRegistry.register("swipeActions") { params, appContext, dispatcher in
        return try SwipeActionsModifier(from: params, appContext: appContext, eventDispatcher: dispatcher)
      }
    }

    OnDestroy {
      ViewModifierRegistry.unregister("scrollIndicators")
      ViewModifierRegistry.unregister("locale")
      ViewModifierRegistry.unregister("swipeActions")
    }
  }
}
