import React, { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Stack, useRouter } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { categoriesTable, currenciesTable } from '@db/schema';

import { useTheme } from 'styled-components/native';
import { useAccent, useSettingsValue } from '@hooks';

import { selectCurrencyId, selectCurrentAmount, timelineErrors } from './events';
import { useLoadService, useDraftStore, useSaveSubscriptions } from './hooks';

import MasterPane from './master-pane';
import Root from './add-subscription.styles';

import type { CurrencyT, ServiceT } from '@models';
import type { LogoDraftT } from './events';

const AddSubscriptionScreen = () => {
	/* We have SwiftUI's multiple TextFields inside a UICollectionView, and navigation
	 * is happening while one of them is still the first responder.
	 * And if we will try to destroy list(by closing formSheet), we got an exception
	 * "The first responder contained inside of a deleted section or item refused to resign".
	 * To avoid such a situation we shall call UIResponder.resignFirstResponder
	 * But this is not a swift, so we have to force inputs lose focus in a hard way.
	 * We can't use Keybpard.dismiss() here btw, so using key in every input at master's root,
	 * and moving router to the bottom of the stack is our only option.
	 */
	const [focusVersion, setFocusVersion] = useState(0);

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

	const { data: currencyRows } = useLiveQuery(
		db
			.select()
			.from(currenciesTable)
			.where(eq(currenciesTable.id, currencyId ?? '')),
		[currencyId]
	);
	const currency = currencyRows?.[0];
	const { data: categoryRows } = useLiveQuery(
		db.select().from(categoriesTable).where(eq(categoriesTable.slug, draft.category_slug.trim())),
		[draft.category_slug]
	);
	const category = categoryRows?.[0];

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
	const saveButtonTint = canSave ? settingAccent : theme.text.tertiary;

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
			setFocusVersion((v) => v + 1);

			setTimeout(() => {
				resetSubscription();
				router.back();
			}, 0);
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
		setFocusVersion((v) => v + 1);
	};

	const closeSheetHd = () => {
		setFocusVersion((v) => v + 1);

		setTimeout(() => {
			router.back();
		}, 0);
	};

	if (isLoading) {
		return null;
	}

	return (
		<Root>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button icon="xmark" variant="plain" onPress={closeSheetHd} tintColor={settingAccent} />
			</Stack.Toolbar>

			<MasterPane
				focusVersion={focusVersion}
				canSyncLocalService={Boolean(localService) && !isLocalSynced}
				onSyncLocalService={syncLocalService}
			/>

			<Stack.Toolbar placement="bottom">
				{hasTimelineErrors ? (
					<Stack.Toolbar.Button onPress={autoFixTimeline} tintColor={theme.semantic.error}>
						Fix timeline issues
					</Stack.Toolbar.Button>
				) : (
					<Stack.Toolbar.Button onPress={handleSave} tintColor={saveButtonTint}>
						Create Subscription
					</Stack.Toolbar.Button>
				)}
			</Stack.Toolbar>
		</Root>
	);
};

export default AddSubscriptionScreen;
