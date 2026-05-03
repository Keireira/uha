import React, { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Stack, useRouter, useNavigation } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { categoriesTable, currenciesTable } from '@db/schema';

import { useTheme } from 'styled-components/native';
import { useAccent, useSettingsValue } from '@hooks';

import { useLoadService, useDraftStore, useSaveSubscriptions } from './hooks';
import { selectCurrencyId, selectCurrentAmount, timelineErrors } from './events';

import MasterPane from './master-pane';
import { Host } from '@expo/ui/swift-ui';

import type { LogoDraftT } from './events';
import type { CurrencyT, ServiceT } from '@models';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
	index: undefined;
	modal: undefined;
};

type StackNavigation = NativeStackNavigationProp<RootStackParamList>;

const AddSubscriptionScreen = () => {
	const [mountId, setMountId] = useState(() => Date.now());

	const theme = useTheme();
	const router = useRouter();
	const settingAccent = useAccent();
	const { service: loadedService, localService, isLoading } = useLoadService();
	const [service, setService] = useState<ServiceT>();
	const [isLocalSynced, setIsLocalSynced] = useState(false);
	const defaultCurrency = useSettingsValue<string>('default_currency');
	const initSubscription = useDraftStore((state) => state.actions.init);
	const patchSubscription = useDraftStore((state) => state.actions.patch);
	const resetSubscription = useDraftStore((state) => state.actions.reset);
	const autoFixTimeline = useDraftStore((state) => state.actions.autoFixTimeline);
	const saveSubscription = useSaveSubscriptions();

	const draft = useDraftStore(
		useShallow((state) => ({
			logo: state.logo,
			custom_name: state.custom_name,
			category_slug: state.category_slug,
			billing_cycle_type: state.billing_cycle_type,
			billing_cycle_value: state.billing_cycle_value,
			tender_id: state.tender_id,
			notes: state.notes,
			notify_enabled: state.notify_enabled,
			notify_days_before: state.notify_days_before,
			notify_trial_end: state.notify_trial_end,
			timeline: state.timeline
		}))
	);
	const currencyId = selectCurrencyId(draft.timeline);
	const amount = selectCurrentAmount(draft.timeline);
	const navigation = useNavigation<StackNavigation>();

	useEffect(() => {
		// Monkey??? patch to force a re-render on transitionEnd
		const unsubscribe = navigation.addListener('transitionEnd', () => {
			setMountId(Date.now());
		});

		return unsubscribe;
	}, [navigation]);

	useEffect(() => {
		const unsubscribe = navigation.addListener('beforeRemove', () => {
			resetSubscription();
		});

		return unsubscribe;
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [navigation]);

	const { data: currencyRows } = useLiveQuery(
		db
			.select()
			.from(currenciesTable)
			.where(eq(currenciesTable.id, currencyId ?? ''))
			.limit(1),
		[currencyId]
	);
	const currency = currencyRows.at(0);
	const { data: categoryRows } = useLiveQuery(
		db.select().from(categoriesTable).where(eq(categoriesTable.slug, draft.category_slug.trim())).limit(1),
		[draft.category_slug]
	);
	const category = categoryRows.at(0);

	const errors = useMemo(() => timelineErrors(draft.timeline), [draft.timeline]);
	const hasTimelineErrors = errors.length > 0;
	const hasPrice = typeof amount === 'number' && amount > 0;
	const hasCategory = draft.category_slug.trim().length > 0 && Boolean(category);
	const canSave =
		!hasTimelineErrors &&
		draft.custom_name.trim().length > 0 &&
		Boolean(currency) &&
		hasCategory &&
		Boolean(service?.id) &&
		hasPrice;

	const handleSave = async () => {
		if (!(canSave && currency && service)) return;

		try {
			await saveSubscription({
				service: {
					...service,
					color: service.color || settingAccent,
					category_slug: draft.category_slug
				},
				draft
			});

			router.back();
		} catch (err) {
			console.warn('[add-subscription] save failed:', err);
		}
	};

	useEffect(() => {
		if (isLoading || !loadedService) return;

		setService(loadedService);
		setIsLocalSynced(false);

		initSubscription(
			{
				...loadedService,
				color: loadedService.color || settingAccent
			},
			{
				currency_id: defaultCurrency as CurrencyT['id']
			}
		);
	}, [initSubscription, loadedService, settingAccent, defaultCurrency, isLoading]);

	const syncLocalService = () => {
		if (!localService) return;

		setService(localService);
		setIsLocalSynced(true);
		patchSubscription({
			custom_name: localService.title,
			category_slug: localService.category_slug,
			logo: {
				image_uri: localService.symbol ? undefined : (localService.logo_url ?? undefined),
				symbol: (localService.symbol ?? undefined) as LogoDraftT['symbol'],
				color: localService.color || settingAccent
			}
		});
	};

	const closeSheetHd = () => {
		router.back();
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button icon="xmark" variant="plain" onPress={closeSheetHd} tintColor={settingAccent} />
			</Stack.Toolbar>

			<Stack.Toolbar placement="bottom">
				{hasTimelineErrors ? (
					<Stack.Toolbar.Button key={`fix-${mountId}`} onPress={autoFixTimeline} tintColor={theme.semantic.error}>
						Fix timeline issues
					</Stack.Toolbar.Button>
				) : (
					<Stack.Toolbar.Button
						key={`create-${mountId}`}
						disabled={!canSave}
						onPress={handleSave}
						tintColor={settingAccent}
					>
						Create Subscription
					</Stack.Toolbar.Button>
				)}
			</Stack.Toolbar>

			<Host style={{ flex: 1 }}>
				<MasterPane
					key={mountId}
					onSyncLocalService={syncLocalService}
					canSyncLocalService={Boolean(localService) && !isLocalSynced}
				/>
			</Host>
		</>
	);
};

export default AddSubscriptionScreen;
