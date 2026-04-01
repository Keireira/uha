import React, { useEffect } from 'react';

import { useAppModel } from '@models';
import { useRouter } from 'expo-router';
import { startOfMonth } from 'date-fns';
import { useSettingsValue } from '@hooks';
import { backfillRates } from '@hooks/setup';

import TabContextMenu from '@modules/tab-context-menu';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

import type { AccentT } from '@themes';
import type { TabContextMenuActionEvent } from '@modules/tab-context-menu';

const TabLayout = () => {
	const router = useRouter();
	const { view_mode, tx_dates } = useAppModel();
	const settingAccent = useSettingsValue<AccentT>('accent');

	useEffect(() => {
		TabContextMenu.configure([
			{
				tabIndex: 0,
				actions: [
					// { id: 'go_to_today', title: 'Go to Today', icon: 'calendar.badge.clock' },
					{ id: 'view_list', title: 'List View', icon: 'list.bullet' },
					{ id: 'view_calendar', title: 'Calendar View', icon: 'calendar' },
					{ id: 'open_filters', title: 'Filters', icon: 'line.3.horizontal.decrease.circle' }
				]
			},
			{
				tabIndex: 1,
				actions: [
					{ id: 'lib_categories', title: 'Categories', icon: 'square.grid.2x2' },
					{ id: 'lib_services', title: 'Services', icon: 'building.2' },
					{ id: 'lib_payments', title: 'Payments', icon: 'creditcard' }
				]
			},
			{
				tabIndex: 2,
				actions: [{ id: 'refresh_rates', title: 'Update Rates', icon: 'arrow.triangle.2.circlepath' }]
			},
			{
				tabIndex: 3,
				actions: [
					{ id: 'add_service', title: 'New Service', icon: 'building.2' },
					{ id: 'add_category', title: 'New Category', icon: 'square.grid.2x2' },
					{ id: 'add_payment', title: 'New Payment', icon: 'creditcard' },
					{ id: 'add_subscription', title: 'New Subscription', icon: 'arrow.triangle.2.circlepath' }
				]
			}
		]);

		const sub = TabContextMenu.addListener('onAction', (e: TabContextMenuActionEvent) => {
			switch (e.actionId) {
				case 'go_to_today': {
					tx_dates.activeMonth.set(startOfMonth(new Date()));
					view_mode.list.scrollToTop();
					break;
				}

				case 'view_list': {
					router.setParams({ tx_view_mode: 'list' });
					break;
				}

				case 'view_calendar': {
					router.setParams({ tx_view_mode: 'calendar' });
					break;
				}

				case 'open_filters': {
					router.push('/(tabs)/transactions/filters');
					break;
				}

				case 'lib_categories': {
					router.navigate('/(tabs)/library/categories-list');
					break;
				}

				case 'lib_services': {
					router.navigate('/(tabs)/library/services-list');
					break;
				}

				case 'lib_payments': {
					router.navigate('/(tabs)/library/payments-list');
					break;
				}

				case 'refresh_rates': {
					backfillRates();
					break;
				}

				case 'add_service': {
					router.push('/add-service');
					break;
				}

				case 'add_category': {
					router.push('/add-category');
					break;
				}

				case 'add_payment': {
					router.push('/add-payment');
					break;
				}

				case 'add_subscription': {
					router.push('/add-subscription');
					break;
				}
			}
		});

		return () => sub.remove();
	}, [router, view_mode, tx_dates]);

	return (
		<NativeTabs minimizeBehavior="onScrollDown">
			<NativeTabs.Trigger name="transactions">
				<NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon selectedColor={settingAccent} sf="house" />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="library">
				<NativeTabs.Trigger.Label>Library</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon selectedColor={settingAccent} sf="books.vertical" />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="settings">
				<NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon selectedColor={settingAccent} sf="gear" />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="add" role="search">
				<NativeTabs.Trigger.Label>New</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon selectedColor={settingAccent} sf="plus" />
			</NativeTabs.Trigger>
		</NativeTabs>
	);
};

export default TabLayout;
