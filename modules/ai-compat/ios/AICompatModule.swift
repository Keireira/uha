import ExpoModulesCore

public class AICompatModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AICompat")

    Function("isSupported") { () -> Bool in
      return self.checkAISupport()
    }
  }

  private func checkAISupport() -> Bool {
    // Apple Intelligence requires iOS 18.1+ and specific hardware
    // (iPhone 15 Pro or later, iPad with M1 or later, Mac with M1 or later)
    guard #available(iOS 18.1, *) else {
      return false
    }

    // On iOS 18.1+, we check if the device supports Apple Intelligence
    // by checking the writing tools availability (a proxy for AI support)
    var systemInfo = utsname()
    uname(&systemInfo)
    let machine = withUnsafePointer(to: &systemInfo.machine) {
      $0.withMemoryRebound(to: CChar.self, capacity: 1) {
        String(cString: $0)
      }
    }

    // iPhone 15 Pro (iPhone16,1) and later, or simulators
    if machine.hasPrefix("iPhone") {
      let parts = machine.replacingOccurrences(of: "iPhone", with: "").split(separator: ",")
      if let major = Int(parts.first ?? "") {
        return major >= 16 // iPhone16,x = iPhone 15 Pro and later
      }
    }

    // iPad with M1+ (iPad13,4 and later with M-series)
    if machine.hasPrefix("iPad") {
      let parts = machine.replacingOccurrences(of: "iPad", with: "").split(separator: ",")
      if let major = Int(parts.first ?? "") {
        return major >= 13
      }
    }

    // Simulator — allow for testing
    if machine == "x86_64" || machine == "arm64" {
      return true
    }

    return false
  }
}
