import React from 'react';
import { format } from 'date-fns';
import { useUnit } from 'effector-react';

import { useAppModel } from '@models';

import { Text } from '@ui';
import Root from './lenses.styles';
import { Host, Button } from '@expo/ui/swift-ui';
import { View } from 'react-native';

const Lenses = () => {
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	return (
		<Root>
			<Text>Start Date: {lensesStore.start_date ? format(lensesStore.start_date, 'yyyy-MM-dd') : 'N/A'}</Text>
			<Text>End Date: {lensesStore.end_date ? format(lensesStore.end_date, 'yyyy-MM-dd') : 'N/A'}</Text>

			<Host>
				<Button onPress={() => lenses.setPrimaryLens('upcoming')}>
					<Text>Upcoming</Text>
				</Button>
			</Host>

			<Host>
				<Button onPress={() => lenses.setPrimaryLens('past_and_upcoming')}>
					<Text>Past and Upcoming</Text>
				</Button>
			</Host>

			<Host>
				<Button onPress={() => lenses.setPrimaryLens('selected_period')}>
					<Text>Selected Period</Text>
				</Button>
			</Host>

			<Host>
				<Button onPress={() => lenses.setPrimaryLens('infinite')}>
					<Text>Infinite</Text>
				</Button>
			</Host>

			<Text>--------------------------------</Text>

			<Text>Applied Filters:</Text>
			{lensesStore.applied_filters.map((filter) => {

				const removeFilter = () => {
					lenses.filters.remove({ type: filter.type, value: filter.value });
				}

				return (
					<View key={filter.value} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Text style={{ color: 'green', fontStyle: 'italic' }}>{filter.label}</Text>

						<Host>
							<Button onPress={removeFilter}>
								<Text style={{ color: 'red', fontWeight: 'bold' }}>REMOVE</Text>
							</Button>
						</Host>
					</View>
				)
			})}

			<Host>
				<Button onPress={() => {
					const randomValue = `CATEGORY_${Math.random().toString(36).substring(2, 15)}`;

					lenses.filters.add({ type: 'category', value: randomValue, label: randomValue })
				}}>
					<Text style={{ color: '#333', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', padding: 16, backgroundColor: 'lightgreen', borderRadius: 8 }}>
						Add Category Filter
					</Text>
				</Button>
			</Host>

			<Host>
				<Button onPress={() => lenses.filters.remove({ type: 'category' })} disabled={lensesStore.applied_filters.filter((filter) => filter.type === 'category').length === 0}>
					<Text style={{ color: '#fafafa', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', padding: 16, backgroundColor: 'lightcoral', borderRadius: 8, opacity: lensesStore.applied_filters.filter((filter) => filter.type === 'category').length === 0 ? 0.5 : 1 }}>
						Remove Category Filters (all)
					</Text>
				</Button>
			</Host>

			<Host>
				<Button onPress={() => {
					const randomValue = `TENDER_${Math.random().toString(36).substring(2, 15)}`;

					lenses.filters.add({ type: 'tender', value: randomValue, label: randomValue })
				}}>
					<Text style={{ color: '#333', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', padding: 16, backgroundColor: 'lightgreen', borderRadius: 8 }}>
						Add Tender Filter
					</Text>
				</Button>
			</Host>

			<Host>
				<Button onPress={() => lenses.filters.remove({ type: 'tender' })} disabled={lensesStore.applied_filters.filter((filter) => filter.type === 'tender').length === 0}>
					<Text style={{ color: '#fafafa', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', padding: 16, backgroundColor: 'lightcoral', borderRadius: 8, opacity: lensesStore.applied_filters.filter((filter) => filter.type === 'tender').length === 0 ? 0.5 : 1 }}>
						Remove Tender Filters (all)
					</Text>
				</Button>
			</Host>
		</Root>
	);
};

export default Lenses;
