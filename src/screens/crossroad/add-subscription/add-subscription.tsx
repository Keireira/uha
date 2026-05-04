import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Stack, useRouter, useNavigation } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';

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

import type { CurrencyT, ServiceT } from '@models';
import type { LogoDraftT, SubscriptionDraftT } from './events';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
	index: undefined;
	modal: undefined;
};

type StackNavigation = NativeStackNavigationProp<RootStackParamList>;

const AddSubscriptionScreen = () => {
	const theme = useTheme();
	const router = useRouter();
	const settingAccent = useAccent();
	const { service: loadedService, preliminaryService, localService, isLoading } = useLoadService();
	const [service, setService] = useState<ServiceT>(preliminaryService);
	const [isLocalSynced, setIsLocalSynced] = useState(false);
	const [syncEpoch, setSyncEpoch] = useState(0);
	const [isSaving, setIsSaving] = useState(false);
	const defaultCurrency = useSettingsValue<string>('default_currency');
	const initSubscription = useDraftStore((state) => state.actions.init);
	const patchSubscription = useDraftStore((state) => state.actions.patch);
	const resetSubscription = useDraftStore((state) => state.actions.reset);
	const autoFixTimeline = useDraftStore((state) => state.actions.autoFixTimeline);
	const saveSubscription = useSaveSubscriptions();

	const initedRef = useRef(false);
	if (!initedRef.current) {
		initSubscription(
			{
				...preliminaryService,
				color: preliminaryService.color || settingAccent
			},
			{
				currency_id: defaultCurrency as CurrencyT['id']
			}
		);
		initedRef.current = true;
	}

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
			setIsSaving(true);
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
		} finally {
			setIsSaving(false);
		}
	};

	const enrichmentAppliedRef = useRef(false);
	useEffect(() => {
		if (isLoading || !loadedService) return;

		setService(loadedService);
		setIsLocalSynced(false);

		if (enrichmentAppliedRef.current) return;
		enrichmentAppliedRef.current = true;

		const currentDraft = useDraftStore.getState();
		const patch: Partial<SubscriptionDraftT> & { logoSnapshot?: LogoDraftT } = {};

		if (currentDraft.custom_name === preliminaryService.title && loadedService.title) {
			patch.custom_name = loadedService.title;
		}
		if (currentDraft.category_slug === preliminaryService.category_slug && loadedService.category_slug) {
			patch.category_slug = loadedService.category_slug;
		}

		const prelImageUri = preliminaryService.symbol ? undefined : preliminaryService.logo_url || undefined;
		const prelSymbol = (preliminaryService.symbol ?? undefined) as LogoDraftT['symbol'];
		const prelColor = preliminaryService.color || settingAccent;
		const draftLogo = currentDraft.logo;
		const logoUntouched =
			draftLogo.image_uri === prelImageUri && draftLogo.symbol === prelSymbol && draftLogo.color === prelColor;

		if (logoUntouched) {
			const enrichedLogo: LogoDraftT = {
				image_uri: loadedService.symbol ? undefined : loadedService.logo_url || undefined,
				symbol: (loadedService.symbol ?? undefined) as LogoDraftT['symbol'],
				color: loadedService.color || settingAccent
			};
			patch.logo = enrichedLogo;
			patch.logoSnapshot = enrichedLogo;
		}

		if (Object.keys(patch).length > 0) {
			useDraftStore.setState(patch);
			if (patch.custom_name !== undefined) {
				setSyncEpoch((n) => n + 1);
			}
		}
	}, [loadedService, isLoading, preliminaryService, settingAccent]);

	const syncLocalService = () => {
		if (!localService) return;

		setService(localService);
		setIsLocalSynced(true);
		setSyncEpoch((n) => n + 1);
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

			{hasTimelineErrors && !isLoading && (
				<Stack.Toolbar placement="bottom">
					<Stack.Toolbar.Button onPress={autoFixTimeline} tintColor={theme.semantic.error}>
						Fix timeline issues
					</Stack.Toolbar.Button>
				</Stack.Toolbar>
			)}

			{!hasTimelineErrors && !isLoading && (
				<Stack.Toolbar placement="bottom">
					<Stack.Toolbar.Button disabled={!canSave || isSaving} onPress={handleSave} tintColor={settingAccent}>
						Create Subscription
					</Stack.Toolbar.Button>
				</Stack.Toolbar>
			)}

			<Host style={{ flex: 1 }}>
				<MasterPane
					syncEpoch={syncEpoch}
					onSyncLocalService={syncLocalService}
					canSyncLocalService={Boolean(localService) && !isLocalSynced}
				/>
			</Host>
		</>
	);
};

export default AddSubscriptionScreen;
