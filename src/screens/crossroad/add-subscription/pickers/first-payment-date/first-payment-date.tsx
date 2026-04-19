import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import { SymbolView } from 'expo-symbols';

import { useAccent } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { MIN_EVENT_DATE } from '@screens/crossroad/add-subscription/events';

import { Host, DatePicker } from '@expo/ui/swift-ui';
import { datePickerStyle } from '@expo/ui/swift-ui/modifiers';
import Root, {
	FromTimelineBanner,
	BannerTextBlock,
	BannerTitle,
	BannerDescription
} from './first-payment-date.styles';

const FirstPaymentDateScreen = () => {
	const router = useRouter();
	const accent = useAccent();
	const { from } = useLocalSearchParams<{ from?: string }>();
	const fromTimeline = from === 'timeline';

	const { first_payment_date, setFirstPaymentDate } = useDraftStore(
		useShallow((state) => ({
			first_payment_date: state.first_payment_date,
			setFirstPaymentDate: state.actions.setFirstPaymentDate
		}))
	);

	const [selection, setSelection] = useState(() => parseISO(first_payment_date));

	const handleDateChange = (date: Date) => {
		setSelection(date);
		setFirstPaymentDate(format(date, 'yyyy-MM-dd'));
	};

	const jumpToToday = () => {
		const today = new Date();
		setSelection(today);
		setFirstPaymentDate(format(today, 'yyyy-MM-dd'));
	};

	const confirm = () => {
		router.back();
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button onPress={jumpToToday} tintColor={accent}>
					Today
				</Stack.Toolbar.Button>
			</Stack.Toolbar>

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={confirm} tintColor={accent} />
			</Stack.Toolbar>

			{fromTimeline && (
				<FromTimelineBanner $accent={accent}>
					<SymbolView
						name="point.3.connected.trianglepath.dotted"
						size={18}
						tintColor={accent}
						weight="semibold"
					/>
					<BannerTextBlock>
						<BannerTitle $accent={accent}>Editing first payment event</BannerTitle>
						<BannerDescription>
							Date changes apply directly to the first payment on the timeline.
						</BannerDescription>
					</BannerTextBlock>
				</FromTimelineBanner>
			)}

			<Root>
				<Host matchContents>
					<DatePicker
						selection={selection}
						displayedComponents={['date']}
						onDateChange={handleDateChange}
						range={{ start: MIN_EVENT_DATE }}
						modifiers={[datePickerStyle('graphical')]}
					/>
				</Host>
			</Root>
		</>
	);
};

export default FirstPaymentDateScreen;
