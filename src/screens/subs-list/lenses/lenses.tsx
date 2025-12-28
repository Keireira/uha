import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAppModel } from '@models';
import * as Haptics from 'expo-haptics';
import { useUnit } from 'effector-react';

import { H2, H3, Text } from '@ui';
import { FilterIcon } from '@ui/icons';
import { Host, Button, BottomSheet } from '@expo/ui/swift-ui';
import Root, { Title, TitlePress, FilterBtn, SheetHost, SheetContent } from './lenses.styles';

import { ALL_TIME_MODES } from '@models/all/lenses';

const Lenses = () => {
	const { t } = useTranslation();
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const [isOpened, setIsOpened] = useState(false);
	const openBottomSheet = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setIsOpened(true);
	};

	const setNextTimeMode = () => {
		const timeMode = lensesStore.time_mode;

		const currentIndex = ALL_TIME_MODES.indexOf(timeMode);
		const nextIndex = (currentIndex + 1) % ALL_TIME_MODES.length;
		const nextTimeMode = ALL_TIME_MODES[nextIndex];

		lenses.setTimeMode(nextTimeMode);
	};

	return (
		<>
			<Root>
				<TitlePress onPress={setNextTimeMode}>
					<Title>{t(`lenses.${lensesStore.time_mode}`)}</Title>
				</TitlePress>

				<FilterBtn onPress={openBottomSheet}>
					<FilterIcon color="#333" />
				</FilterBtn>
			</Root>

			{isOpened && (
				<SheetHost>
					<BottomSheet isOpened={isOpened} onIsOpenedChange={setIsOpened}>
						<SheetContent>
							<H2>Filters</H2>

							<View style={{ flexDirection: 'row', gap: 16, marginTop: 32 }}>
								<Host>
									<Button onPress={() => lenses.setTimeMode('all')}>
										<H3>{t(`lenses.all`)}</H3>
									</Button>
								</Host>

								<Host>
									<Button onPress={() => lenses.setTimeMode('future')}>
										<H3>{t(`lenses.future`)}</H3>
									</Button>
								</Host>
							</View>

							<View style={{ flexDirection: 'column', gap: 16, marginTop: 32 }}>
								<Host>
									<Button>
										<Text>Category</Text>
									</Button>
								</Host>

								<Host>
									<Button>
										<Text>Service</Text>
									</Button>
								</Host>

								<Host>
									<Button>
										<Text>Payment Method</Text>
									</Button>
								</Host>

								<Host>
									<Button>
										<Text>Base Currency</Text>
									</Button>
								</Host>
							</View>
						</SheetContent>
					</BottomSheet>
				</SheetHost>
			)}
		</>

		// <Text>Applied Filters:</Text>
		// {lensesStore.applied_filters.map((filter) => {

		// 	const removeFilter = () => {
		// 		lenses.filters.remove({ type: filter.type, value: filter.value });
		// 	}

		// 	return (
		// 		<View key={filter.value} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
		// 			<Text style={{ color: 'green', fontStyle: 'italic' }}>{filter.label}</Text>

		// 			<Host>
		// 				<Button onPress={removeFilter}>
		// 					<Text style={{ color: 'red', fontWeight: 'bold' }}>REMOVE</Text>
		// 				</Button>
		// 			</Host>
		// 		</View>
		// 	)
		// })}

		// <Host>
		// 	<Button onPress={() => {
		// 		const randomValue = `CATEGORY_${Math.random().toString(36).substring(2, 15)}`;

		// 		lenses.filters.add({ type: 'category', value: randomValue, label: randomValue })
		// 	}}>
		// 		<Text style={{ color: '#333', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', padding: 16, backgroundColor: 'lightgreen', borderRadius: 8 }}>
		// 			Add Category Filter
		// 		</Text>
		// 	</Button>
		// </Host>

		// <Host>
		// 	<Button onPress={() => lenses.filters.remove({ type: 'category' })} disabled={lensesStore.applied_filters.filter((filter) => filter.type === 'category').length === 0}>
		// 		<Text style={{ color: '#fafafa', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', padding: 16, backgroundColor: 'lightcoral', borderRadius: 8, opacity: lensesStore.applied_filters.filter((filter) => filter.type === 'category').length === 0 ? 0.5 : 1 }}>
		// 			Remove Category Filters (all)
		// 		</Text>
		// 	</Button>
		// </Host>

		// <Host>
		// 	<Button onPress={() => {
		// 		const randomValue = `TENDER_${Math.random().toString(36).substring(2, 15)}`;

		// 		lenses.filters.add({ type: 'tender', value: randomValue, label: randomValue })
		// 	}}>
		// 		<Text style={{ color: '#333', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', padding: 16, backgroundColor: 'lightgreen', borderRadius: 8 }}>
		// 			Add Tender Filter
		// 		</Text>
		// 	</Button>
		// </Host>

		// <Host>
		// 	<Button onPress={() => lenses.filters.remove({ type: 'tender' })} disabled={lensesStore.applied_filters.filter((filter) => filter.type === 'tender').length === 0}>
		// 		<Text style={{ color: '#fafafa', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', padding: 16, backgroundColor: 'lightcoral', borderRadius: 8, opacity: lensesStore.applied_filters.filter((filter) => filter.type === 'tender').length === 0 ? 0.5 : 1 }}>
		// 			Remove Tender Filters (all)
		// 		</Text>
		// 	</Button>
		// </Host>
	);
};

export default Lenses;
