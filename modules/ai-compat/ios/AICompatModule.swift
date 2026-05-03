import ExpoModulesCore
import Foundation

public class AICompatModule: Module {
  public func definition() -> ModuleDefinition {
  	Name("AICompat")

    Function("isSupported") { () -> Bool in
      return self.checkAISupport()
    }
  }

  private func checkAISupport() -> Bool {
    guard #available(iOS 18.1, *) else {
      return false
    }

    #if targetEnvironment(simulator)
    	return true
    #endif

    var systemInfo = utsname()
    uname(&systemInfo)

    let machine = withUnsafePointer(to: &systemInfo.machine) {
      $0.withMemoryRebound(to: CChar.self, capacity: 1) {
        String(cString: $0)
      }
    }

    if machine.hasPrefix("iPhone") {
      let parts = machine
        .replacingOccurrences(of: "iPhone", with: "")
        .split(separator: ",")

      if let major = Int(parts.first ?? "") {
        return major >= 16
      }
    }

    if machine.hasPrefix("iPad") {
      let parts = machine
        .replacingOccurrences(of: "iPad", with: "")
        .split(separator: ",")

      if let major = Int(parts.first ?? "") {
        return major >= 13
      }
    }

    return false
  }
}
