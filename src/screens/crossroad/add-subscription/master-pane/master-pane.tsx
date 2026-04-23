import React from 'react';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useShallow } from 'zustand/react/shallow';

import db from '@db';
import { eq } from 'drizzle-orm';
import { categoriesTable, tendersTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useDraftStore } from '../hooks';
import type { BillingCycleT } from '../hooks/use-draft-store';

import LogoRow from './logo-row';
import PriceRow from './price-row';
import FieldRow from './field-row';
import ToggleRow from './toggle-row';
import Timeline from './timeline';
import { TextField } from '@ui';
import Root, { TitleField, FieldsGroup, NotesCard, NotesField } from './master-pane.styles';

const UNIT_LABELS: Record<BillingCycleT, { single: string; plural: string }> = {
	days: { single: 'Daily', plural: 'days' },
	weeks: { single: 'Weekly', plural: 'weeks' },
	months: { single: 'Monthly', plural: 'months' },
	years: { single: 'Yearly', plural: 'years' }
};

const TRIAL_UNIT_LABELS: Record<BillingCycleT, { single: string; plural: string }> = {
	days: { single: 'day', plural: 'days' },
	weeks: { single: 'week', plural: 'weeks' },
	months: { single: 'month', plural: 'months' },
	years: { single: 'year', plural: 'years' }
};

const formatCycle = (type: BillingCycleT, value: number) => {
	const unit = UNIT_LABELS[type];
	return value === 1 ? unit.single : `Every ${value} ${unit.plural}`;
};

const formatTrial = (type: BillingCycleT, value: number) => {
	const unit = TRIAL_UNIT_LABELS[type];
	return `${value} ${value === 1 ? unit.single : unit.plural}`;
};

const MasterPane = () => {
	const router = useRouter();
	const theme = useTheme();
	const { t } = useTranslation();

	const glassEffectStyle = !theme.is_oled && theme.tint === 'dark' ? 'regular' : 'clear';

	const draft = useDraftStore(
		useShallow((state) => ({
			title: state.title,
			category_slug: state.category_slug,
			logoSnapshot: state.logoSnapshot,
			first_payment_date: state.first_payment_date,
			billing_cycle_type: state.billing_cycle_type,
			billing_cycle_value: state.billing_cycle_value,
			with_trial: state.with_trial,
			trial_duration_type: state.trial_duration_type,
			trial_duration_value: state.trial_duration_value,
			tender_id: state.tender_id,
			notes: state.notes,
			notify_enabled: state.notify_enabled,
			notify_days_before: state.notify_days_before,
			setTitle: state.actions.setTitle,
			setWithTrial: state.actions.setWithTrial,
			setNotes: state.actions.setNotes
		}))
	);

	const {
		data: [category]
	} = useLiveQuery(db.select().from(categoriesTable).where(eq(categoriesTable.slug, draft.category_slug)), [
		draft.category_slug
	]);

	const {
		data: [tender]
	} = useLiveQuery(
		db
			.select()
			.from(tendersTable)
			.where(eq(tendersTable.id, draft.tender_id ?? '')),
		[draft.tender_id]
	);

	const firstPaymentPreview = format(parseISO(draft.first_payment_date), 'MMM d, yyyy');
	const cyclePreview = formatCycle(draft.billing_cycle_type, draft.billing_cycle_value);
	const trialPreview = formatTrial(draft.trial_duration_type, draft.trial_duration_value);
	const categoryPreview = category?.title ?? (draft.category_slug ? t(`category.${draft.category_slug}`) : 'None');
	const paymentPreview = tender?.title ?? 'None';
	const notificationsPreview = !draft.notify_enabled
		? 'Off'
		: draft.notify_days_before.length === 0
			? 'On'
			: `${draft.notify_days_before.length} reminder${draft.notify_days_before.length === 1 ? '' : 's'}`;

	return (
		<Root>
			<LogoRow />

			<TitleField>
				<TextField
					defaultValue={draft.title}
					onValueChange={draft.setTitle}
					placeholder="Service name"
					align="center"
					fontSize={22}
					fontWeight="bold"
				/>
			</TitleField>

			<PriceRow />

			<FieldsGroup glassEffectStyle={glassEffectStyle}>
				<FieldRow
					label="First Payment Date"
					preview={firstPaymentPreview}
					onPress={() => {
						router.push({
							pathname: '/(crossroad)/first-payment-date'
						});
					}}
				/>
				<FieldRow
					label="Billing Cycle"
					preview={cyclePreview}
					onPress={() => router.push('/(pickers)/billing-cycle')}
				/>
				<ToggleRow
					label="With Trial"
					value={draft.with_trial}
					onChange={draft.setWithTrial}
					isLast={!draft.with_trial}
				/>
				{draft.with_trial && (
					<FieldRow
						label="Trial Duration"
						preview={trialPreview}
						onPress={() => router.push('/(pickers)/trial-duration')}
						isLast
					/>
				)}
			</FieldsGroup>

			<FieldsGroup glassEffectStyle={glassEffectStyle}>
				<FieldRow
					label="Category"
					preview={categoryPreview}
					onPress={() => router.push('/(pickers)/select-category')}
				/>
				<FieldRow
					label="Payment Method"
					preview={paymentPreview}
					onPress={() => router.push('/(pickers)/select-tender')}
					isLast
				/>
			</FieldsGroup>

			<FieldsGroup glassEffectStyle={glassEffectStyle}>
				<FieldRow
					label="Notifications"
					preview={notificationsPreview}
					onPress={() => router.push('/(pickers)/notifications')}
					isLast
				/>
			</FieldsGroup>

			<NotesCard glassEffectStyle={glassEffectStyle}>
				<NotesField value={draft.notes} onChangeText={draft.setNotes} placeholder="Notes (optional)" />
			</NotesCard>

			<Timeline />
		</Root>
	);
};

export default MasterPane;
