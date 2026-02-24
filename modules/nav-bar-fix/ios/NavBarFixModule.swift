import ExpoModulesCore
import UIKit

public class NavBarFixModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NavBarFix")

    AsyncFunction("removeBarButtonBackground") { (promise: Promise) in
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
        if #available(iOS 26.0, *) {
          Self.patchBarButtonItems()
        }
        promise.resolve(nil)
      }
    }
  }

  @available(iOS 26.0, *)
  private static func patchBarButtonItems() {
    guard let scene = UIApplication.shared.connectedScenes
      .compactMap({ $0 as? UIWindowScene }).first
    else { return }

    for window in scene.windows {
      var vc: UIViewController? = window.rootViewController

      while let current = vc {
        Self.stripGlass(from: current)

        for child in current.children {
          Self.stripGlass(from: child)
        }

        vc = current.presentedViewController
      }
    }
  }

  @available(iOS 26.0, *)
  private static func stripGlass(from vc: UIViewController) {
    guard let nav = vc as? UINavigationController else { return }
    let navItem = nav.topViewController?.navigationItem

    for item in (navItem?.leftBarButtonItems ?? []) + (navItem?.rightBarButtonItems ?? []) {
      item.hidesSharedBackground = true
    }
  }
}
