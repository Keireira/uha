import React from 'react';
import { useUnit } from 'effector-react';
import { useTranslation } from 'react-i18next';
import { useAppModel } from '@models';

import { FilterIcon } from '@ui/icons';
import { Host, Button, Switch, ContextMenu, Divider } from '@expo/ui/swift-ui';
import Root, { Title, TitlePress, FilterBtn } from './lenses.styles';

import { ALL_TIME_MODES } from '@models/all/lenses';

const Lenses = () => {
	const { t } = useTranslation();
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const setNextTimeMode = () => {
		const timeMode = lensesStore.time_mode;

		const currentIndex = ALL_TIME_MODES.indexOf(timeMode);
		const nextIndex = (currentIndex + 1) % ALL_TIME_MODES.length;
		const nextTimeMode = ALL_TIME_MODES[nextIndex];

		lenses.setTimeMode(nextTimeMode);
	};

	return (
		<Root>
			<TitlePress onPress={setNextTimeMode}>
				<Title>{t(`lenses.${lensesStore.time_mode}`)}</Title>
			</TitlePress>

			<Host>
				<ContextMenu>
					<ContextMenu.Items>
						<Button systemImage="infinity" onPress={() => lenses.setTimeMode('all')}>
							{t(`lenses.all`)}
						</Button>
						<Button variant="bordered" systemImage="figure.run" onPress={() => lenses.setTimeMode('future')}>
							{t(`lenses.future`)}
						</Button>

						{/* <Divider /> */}

						<ContextMenu dismissBehavior="disabled">
							<ContextMenu.Items>
								<Switch
									label="Category 1"
									value={lensesStore.filters.some(
										(filter) => filter.type === 'category' && filter.value === 'category_1'
									)}
									onValueChange={(value) =>
										lenses.filters.add({
											type: 'category',
											value: 'category_1'
										})
									}
								/>

								<Switch
									label="Category 2"
									value={lensesStore.filters.some(
										(filter) => filter.type === 'category' && filter.value === 'category_2'
									)}
									onValueChange={(value) =>
										lenses.filters.add({
											type: 'category',
											value: 'category_2'
										})
									}
								/>
							</ContextMenu.Items>

							<ContextMenu.Trigger>
								<Button systemImage="camera.filters">By Category</Button>
							</ContextMenu.Trigger>
						</ContextMenu>

						<ContextMenu dismissBehavior="disabled">
							<ContextMenu.Items>
								<Switch
									label="Service 1"
									value={lensesStore.filters.some(
										(filter) => filter.type === 'service' && filter.value === 'service_1'
									)}
									onValueChange={(value) =>
										lenses.filters.add({
											type: 'service',
											value: 'service_1'
										})
									}
								/>
							</ContextMenu.Items>

							<ContextMenu.Trigger>
								<Button systemImage="camera.filters">By Service</Button>
							</ContextMenu.Trigger>
						</ContextMenu>

						<ContextMenu dismissBehavior="disabled">
							<ContextMenu.Items>
								<Switch
									label="Tender 1"
									value={lensesStore.filters.some((filter) => filter.type === 'tender' && filter.value === 'tender_1')}
									onValueChange={(value) =>
										lenses.filters.add({
											type: 'tender',
											value: 'tender_1'
										})
									}
								/>
							</ContextMenu.Items>

							<ContextMenu.Trigger>
								<Button systemImage="camera.filters">By Tender</Button>
							</ContextMenu.Trigger>
						</ContextMenu>

						<ContextMenu dismissBehavior="disabled">
							<ContextMenu.Items>
								<Switch
									label="Currency 1"
									value={lensesStore.filters.some(
										(filter) => filter.type === 'currency' && filter.value === 'currency_1'
									)}
									onValueChange={(value) =>
										lenses.filters.add({
											type: 'currency',
											value: 'currency_1'
										})
									}
								/>
							</ContextMenu.Items>

							<ContextMenu.Trigger>
								<Button systemImage="camera.filters">By Base Currency</Button>
							</ContextMenu.Trigger>
						</ContextMenu>

						<Divider />

						{lensesStore.filters.length > 0 && (
							<Button variant="bordered" systemImage="xmark.circle" onPress={() => lenses.filters.clear()}>
								Clear Filters
							</Button>
						)}
					</ContextMenu.Items>

					<ContextMenu.Trigger>
						<FilterBtn>
							<FilterIcon color="#333" />
						</FilterBtn>
					</ContextMenu.Trigger>
				</ContextMenu>
			</Host>
		</Root>
	);
};

export default Lenses;
