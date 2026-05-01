import SwiftUI
import ExpoModulesCore

internal enum WeekdayOption: String, Enumerable {
  case sunday
  case monday
  case tuesday
  case wednesday
  case thursday
  case friday
  case saturday

  // Calendar.firstWeekday uses 1...7 with 1 = Sunday.
  var calendarValue: Int {
    switch self {
    case .sunday: return 1
    case .monday: return 2
    case .tuesday: return 3
    case .wednesday: return 4
    case .thursday: return 5
    case .friday: return 6
    case .saturday: return 7
    }
  }
}

internal struct FirstWeekdayModifier: ViewModifier, Record {
  @Field var day: WeekdayOption = .monday

  func body(content: Content) -> some View {
    var calendar = Calendar.current
    calendar.firstWeekday = day.calendarValue
    return content.environment(\.calendar, calendar)
  }
}
