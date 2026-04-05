import SwiftUI

// Fonts
private enum GridFonts {
  static let header = Font.custom("Nunito", size: 15).weight(.bold)
  static let day = Font.custom("Nunito", size: 11).weight(.regular)
}

// Data
struct DayData: Identifiable {
  let id: String
  let label: String
  let dateKey: String
  let isCurrentMonth: Bool
}

private struct WeekRow: Identifiable {
  let id: Int          // row index
  let days: [DayData]
}

// View
struct MonthGridContent: View {
  @ObservedObject var state: MonthGridState

  var body: some View {
    let weeks = buildWeeks(year: state.year, month: state.month, weekStartsOn: state.weekStartsOn)

    Button(action: { state.onPressMonth?() }) {
      VStack(alignment: .leading, spacing: 0) {
        Text(state.title)
          .font(GridFonts.header)
          .foregroundStyle(state.headerColor)
          .padding(.bottom, 4)

        VStack(spacing: 0) {
          ForEach(weeks) { week in
            HStack(spacing: 0) {
              ForEach(week.days) { day in
                dayCell(day)
              }
            }
          }
        }
      }
    }
    .buttonStyle(.plain)
    .disabled(!state.isInRange)
    .opacity(state.isInRange ? 1.0 : 0.444)
  }

  @ViewBuilder
  private func dayCell(_ day: DayData) -> some View {
    ZStack {
      if day.isCurrentMonth {
        let isSelected = state.selectedDay == day.dateKey
        let hasTx = !isSelected && state.daysWithTxs.contains(day.dateKey)

        if isSelected || hasTx {
          Circle()
            .fill(isSelected ? state.markSelected : state.markTx)
            .frame(width: 16, height: 16)
        }

        Text(day.label)
          .font(GridFonts.day)
          .foregroundStyle(isSelected || hasTx ? state.textHighlight : state.textPrimary)
          .minimumScaleFactor(0.5)
          .lineLimit(1)
      } else {
        Rectangle().fill(state.emptyBg)
      }
    }
    .frame(maxWidth: .infinity)
    .aspectRatio(1, contentMode: .fit)
    .padding(2)
  }
}

// Calendar math
private func buildWeeks(year: Int, month: Int, weekStartsOn: Int) -> [WeekRow] {
  var cal = Calendar.current
  cal.firstWeekday = weekStartsOn == 1 ? 2 : 1 // 2 = Monday, 1 = Sunday

  guard let monthStart = cal.date(from: DateComponents(year: year, month: month, day: 1)),
        let daysInMonth = cal.range(of: .day, in: .month, for: monthStart)?.count else {
      return []
  }

  // How many empty cells before day 1
  let leadingBlanks = (cal.component(.weekday, from: monthStart) - cal.firstWeekday + 7) % 7
  let rowCount = (leadingBlanks + daysInMonth + 6) / 7

  // "2026-04-" — shared prefix, avoids DateFormatter
  let prefix = String(format: "%04d-%02d-", year, month)

  return (0..<rowCount).map { row in
    let days = (0..<7).map { col -> DayData in
      let dayNum = row * 7 + col - leadingBlanks + 1

      guard (1...daysInMonth).contains(dayNum) else {
        return DayData(id: "e\(row)\(col)", label: "", dateKey: "", isCurrentMonth: false)
      }

      let key = prefix + String(format: "%02d", dayNum)
      return DayData(id: key, label: "\(dayNum)", dateKey: key, isCurrentMonth: true)
    }

    return WeekRow(id: row, days: days)
  }
}
