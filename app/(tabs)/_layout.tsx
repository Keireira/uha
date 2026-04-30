import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useAccent } from '@hooks';
import { useTxDatesStore } from '@screens/transactions/models';

import TabContextMenu from '@modules/tab-context-menu';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

import type { TabContextMenuActionEvent } from '@modules/tab-context-menu';

const TabLayout = () => {
	const router = useRouter();
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const setActiveMonth = useTxDatesStore((s) => s.setActiveMonth);

	useEffect(() => {
		TabContextMenu.configure([
			{
				tabIndex: 0,
				actions: [
					{ id: 'view_list', title: t('navbar.transactions.view_list'), icon: 'list.bullet' },
					{ id: 'view_calendar', title: t('navbar.transactions.view_calendar'), icon: 'calendar' },
					{
						id: 'open_filters',
						title: t('navbar.transactions.open_filters'),
						icon: 'line.3.horizontal.decrease.circle'
					}
				]
			},
			{
				tabIndex: 1,
				actions: [
					{ id: 'lib_categories', title: t('navbar.library.categories'), icon: 'square.grid.2x2' },
					{ id: 'lib_services', title: t('navbar.library.services'), icon: 'building.2' },
					{ id: 'lib_payments', title: t('navbar.library.payments'), icon: 'creditcard' },
					{ id: 'lib_subscriptions', title: t('navbar.library.subscriptions'), icon: 'arrow.triangle.2.circlepath' }
				]
			},
			{
				tabIndex: 2,
				actions: [
					{ id: 'add_category', title: t('navbar.add.category'), icon: 'square.grid.2x2' },
					{ id: 'add_payment', title: t('navbar.add.payment'), icon: 'creditcard' },
					{ id: 'add_subscription', title: t('navbar.add.subscription'), icon: 'arrow.triangle.2.circlepath' }
				]
			}
		]);

		const sub = TabContextMenu.addListener('onAction', (e: TabContextMenuActionEvent) => {
			switch (e.actionId) {
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

				case 'lib_subscriptions': {
					router.navigate('/(tabs)/library/subscriptions-list');
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
	}, [t, router, setActiveMonth]);

	return (
		<NativeTabs minimizeBehavior="onScrollDown" tintColor={settingAccent}>
			<NativeTabs.Trigger name="transactions">
				<NativeTabs.Trigger.Label>{t('navbar.transactions.title')}</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon selectedColor={settingAccent} sf="house" />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="library">
				<NativeTabs.Trigger.Label>{t('navbar.library.title')}</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon selectedColor={settingAccent} sf="books.vertical" />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="settings">
				<NativeTabs.Trigger.Label>{t('navbar.settings.title')}</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon selectedColor={settingAccent} sf="gear" />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="add" role="search">
				<NativeTabs.Trigger.Label>{t('navbar.add.title')}</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon selectedColor={settingAccent} sf="plus" />
			</NativeTabs.Trigger>
		</NativeTabs>
	);
};

export default TabLayout;
