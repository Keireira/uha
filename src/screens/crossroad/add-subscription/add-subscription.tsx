import React, { useEffect, useMemo } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import db from '@db';
import { currenciesTable } from '@db/schema';
import { useAccent, useSettingsValue } from '@hooks';
import { useTheme } from 'styled-components/native';
import { useLoadService, useDraftStore, useSaveSubscriptions } from './hooks';
import { timelineErrors } from './events';

import MasterPane from './master-pane';
import Root from './add-subscription.styles';

const AddSubscriptionScreen = () => {
	const router = useRouter();
	const settingAccent = useAccent();
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { service, isLoading } = useLoadService();
	const defaultCurrency = useSettingsValue<string>('default_currency');
	const initSubscription = useDraftStore((state) => state.actions.init);
	const autoFixTimeline = useDraftStore((state) => state.actions.autoFixTimeline);
	const saveSubscription = useSaveSubscriptions();

	const draft = useDraftStore(
		useShallow((state) => ({
			id: state.id,
			title: state.title,
			color: state.color,
			slug: state.slug,
			logo_url: state.logo_url,
			bundle_id: state.bundle_id,
			ref_link: state.ref_link,
			domains: state.domains,
			social_links: state.social_links,
			aliases: state.aliases,
			symbol: state.symbol,
			category_slug: state.category_slug,
			currency: state.currency,
			price: state.price,
			first_payment_date: state.first_payment_date,
			billing_cycle_type: state.billing_cycle_type,
			billing_cycle_value: state.billing_cycle_value,
			tender_id: state.tender_id,
			notes: state.notes,
			notify_enabled: state.notify_enabled,
			notify_days_before: state.notify_days_before,
			timeline: state.timeline
		}))
	);

	const { data: currencyRows } = useLiveQuery(
		db
			.select()
			.from(currenciesTable)
			.where(eq(currenciesTable.id, draft.currency ?? '')),
		[draft.currency]
	);
	const currency = currencyRows?.[0];

	const errors = useMemo(() => timelineErrors(draft.timeline), [draft.timeline]);
	const hasTimelineErrors = errors.length > 0;
	const hasPrice = typeof draft.price === 'number' && draft.price > 0;
	const canSave = !hasTimelineErrors && draft.title?.trim().length > 0 && !!currency && !!draft.id && hasPrice;

	const handleSave = async () => {
		if (!(canSave && currency)) return;

		try {
			await saveSubscription({
				service: {
					id: draft.id,
					title: draft.title,
					color: draft.color,
					slug: draft.slug,
					logo_url: draft.logo_url,
					bundle_id: draft.bundle_id,
					ref_link: draft.ref_link,
					domains: draft.domains || [],
					social_links: draft.social_links || {},
					aliases: draft.aliases
				},
				category_slug: draft.category_slug,
				custom_name: draft.title,
				custom_emoji: draft.symbol ?? null,
				billing_cycle_type: draft.billing_cycle_type,
				billing_cycle_value: draft.billing_cycle_value,
				currencyId: currency.id,
				denominator: currency.denominator,
				firstPaymentDate: draft.first_payment_date,
				tenderId: draft.tender_id,
				notes: draft.notes || null,
				notifyEnabled: draft.notify_enabled,
				notifyDaysBefore: draft.notify_days_before,
				timeline: draft.timeline
			});
		} catch (err) {
			console.warn('[add-subscription] save failed:', err);
		}
	};

	useEffect(() => {
		if (isLoading || !service) return;

		initSubscription({
			...service,
			currency: defaultCurrency,
			color: service.color || settingAccent
		});
	}, [initSubscription, service, settingAccent, defaultCurrency, isLoading]);

	if (isLoading) {
		return null;
	}

	return (
		<Root
			contentContainerStyle={{
				paddingTop: 24,
				paddingHorizontal: 16,
				paddingBottom: insets.bottom + 24
			}}
		>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button
					icon="xmark"
					onPress={() => {
						router.back();
					}}
					variant="plain"
					tintColor={settingAccent}
				/>
			</Stack.Toolbar>

			<MasterPane />

			<Stack.Toolbar placement="bottom">
				{hasTimelineErrors ? (
					<Stack.Toolbar.Button onPress={autoFixTimeline} tintColor={theme.semantic.error}>
						Fix timeline issues
					</Stack.Toolbar.Button>
				) : (
					<Stack.Toolbar.Button onPress={handleSave} disabled={!canSave} tintColor={settingAccent}>
						Create Subscription
					</Stack.Toolbar.Button>
				)}
			</Stack.Toolbar>
		</Root>
	);
};

export default AddSubscriptionScreen;
