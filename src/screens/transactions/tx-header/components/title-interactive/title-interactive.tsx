import React, { useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useUnit } from 'effector-react';

import useTitle from './use-title';
import { useAppModel } from '@models';
import { format, startOfMonth } from 'date-fns';

import { Text, CircleButton } from '@ui';
import { frame } from '@expo/ui/swift-ui/modifiers';
import { BottomSheet, Picker, Host } from '@expo/ui/swift-ui';
import Root, { Title, SheetHost, Pickers, ButtonsRow, InnerBottomSheet } from './title-interactive.styles';

import { ALL_TIME_MODES } from '@screens/transactions/models/lenses';

type PickerOptionSelectedEvent = {
	nativeEvent: {
		index: number;
		label: string;
	};
};

const DEFAULT_MONTHS = (() => {
	const months = [];
	for (let month = 0; month < 12; month++) {
		months.push(format(new Date(2024, month, 1), 'MMMM'));
	}
	return months;
})();

const PADDING = 16;
const BUTTONS_HEIGHT = 64;
const PICKER_HEIGHT = 200;

const TitleInteractive = () => {
	const title = useTitle();
	const { width } = useWindowDimensions();
	const [selectedMonth, setSelectedMonth] = useState(0);
	const [selectedYear, setSelectedYear] = useState(0);
	const [isPickerOpened, setIsPickerOpened] = useState(false);

	const { lenses, tx_dates, view_mode } = useAppModel();
	const lensesStore = useUnit(lenses.$store);
	const viewMode = useUnit(view_mode.$mode);
	const minActiveDate = useUnit(tx_dates.minActiveDate.$value);
	const maxActiveDate = useUnit(tx_dates.maxActiveDate.$value);

	const YEARS = useMemo(() => {
		const years = [];

		for (let year = minActiveDate.getFullYear(); year <= maxActiveDate.getFullYear(); year++) {
			years.push(year.toString());
		}

		return years;
	}, [minActiveDate, maxActiveDate]);

	const setNextTimeMode = () => {
		const timeMode = lensesStore.time_mode;
		const currentIndex = ALL_TIME_MODES.indexOf(timeMode);
		const nextIndex = (currentIndex + 1) % ALL_TIME_MODES.length;
		const nextTimeMode = ALL_TIME_MODES[nextIndex];
		lenses.time_mode.set(nextTimeMode);
	};

	const showPicker = () => {
		setIsPickerOpened(true);
	};

	const closePickerHd = () => {
		setIsPickerOpened(false);
	};

	const handleMonthSelected = (event: PickerOptionSelectedEvent) => {
		const { index } = event.nativeEvent;

		setSelectedMonth(index);
	};

	const handleYearSelected = (event: PickerOptionSelectedEvent) => {
		const { index } = event.nativeEvent;

		setSelectedYear(index);
	};

	const onSelectDateHd = () => {
		const nextActiveMonth = startOfMonth(new Date(YEARS[selectedYear], selectedMonth));
		tx_dates.activeMonth.set(nextActiveMonth);
		setIsPickerOpened(false);
	};

	const onPressHd = () => {
		if (viewMode === 'list') {
			setNextTimeMode();
		} else if (viewMode === 'calendar') {
			showPicker();
		}
	};

	return (
		<>
			<Root onPress={onPressHd}>
				<Title>{title}</Title>
			</Root>

			{viewMode === 'calendar' && (
				<SheetHost style={{ width, position: 'absolute', bottom: isPickerOpened ? 0 : -1000 }}>
					<BottomSheet
						isOpened={isPickerOpened}
						onIsOpenedChange={setIsPickerOpened}
						modifiers={[frame({ height: BUTTONS_HEIGHT + PICKER_HEIGHT })]}
					>
						<InnerBottomSheet>
							<ButtonsRow>
								<Host style={{ flex: 1, height: BUTTONS_HEIGHT }}>
									<CircleButton
										onPress={closePickerHd}
										size={BUTTONS_HEIGHT - PADDING}
										role="cancel"
										systemImage="chevron.left"
									/>
								</Host>

								{/* IDK how to make it work without third empty block */}
								<Host style={{ flex: 3 }}>
									<Text>&nbsp;</Text>
								</Host>

								<Host style={{ flex: 1, height: BUTTONS_HEIGHT }}>
									<CircleButton onPress={onSelectDateHd} size={BUTTONS_HEIGHT - PADDING} systemImage="checkmark" />
								</Host>
							</ButtonsRow>

							<Pickers>
								<Host matchContents style={{ flex: 1 }}>
									<Picker
										options={DEFAULT_MONTHS}
										selectedIndex={selectedMonth}
										onOptionSelected={handleMonthSelected}
										variant="wheel"
										modifiers={[frame({ height: PICKER_HEIGHT })]}
									/>
								</Host>

								<Host matchContents style={{ flex: 1 }}>
									<Picker
										options={YEARS}
										selectedIndex={selectedYear}
										onOptionSelected={handleYearSelected}
										variant="wheel"
										modifiers={[frame({ height: PICKER_HEIGHT })]}
									/>
								</Host>
							</Pickers>
						</InnerBottomSheet>
					</BottomSheet>
				</SheetHost>
			)}
		</>
	);
};

export default TitleInteractive;
