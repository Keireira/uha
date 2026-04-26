import React from 'react';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useTheme } from 'styled-components/native';

import db from '@db';
import { eq } from 'drizzle-orm';
import { categoriesTable, tendersTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useGlassStyle } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import type { BillingCycleT } from '../hooks/use-draft-store';

import LogoRow from './logo-row';
import PriceRow from './price-row';
import Timeline from './timeline';
import { TextField } from '@ui';

import { Host, List, Section, Toggle, Text, HStack, Spacer, Image } from '@expo/ui/swift-ui';
import {
	font,
	foregroundStyle,
	listStyle,
	listSectionSpacing,
	listSectionMargins,
	scrollDisabled,
	onTapGesture
} from '@expo/ui/swift-ui/modifiers';

import Root, { TitleField, NotesCard, NotesField } from './master-pane.styles';

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

const ROW_HEIGHT = 44;
const SECTION_GAP = 24;

const MasterPane = () => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();
	const glassEffectStyle = useGlassStyle();

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

	const billingRows = draft.with_trial ? 4 : 3;
	const ADDITIONAL_ROWS = 3;
	const COMBINED_ROWS_HEIGHT = (billingRows + ADDITIONAL_ROWS) * ROW_HEIGHT;
	const GAP_HEIGHT = 5 * SECTION_GAP;
	const listHeight = COMBINED_ROWS_HEIGHT + GAP_HEIGHT;

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

			<Host style={{ height: listHeight }}>
				<List modifiers={[listStyle('insetGrouped'), scrollDisabled(true), listSectionSpacing(SECTION_GAP)]}>
					<Section modifiers={[listSectionMargins({ length: 0, edges: 'top' })]}>
						<HStack
							spacing={6}
							alignment="center"
							modifiers={[onTapGesture(() => router.push('/(crossroad)/first-payment-date'))]}
						>
							<Text modifiers={[font({ size: 16, weight: 'medium' })]}>First Payment Date</Text>

							<Spacer />

							<Text modifiers={[font({ size: 15 }), foregroundStyle(theme.text.secondary)]}>{firstPaymentPreview}</Text>

							<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
						</HStack>

						<HStack
							spacing={6}
							alignment="center"
							modifiers={[onTapGesture(() => router.push('/(crossroad)/billing-cycle'))]}
						>
							<Text modifiers={[font({ size: 16, weight: 'medium' })]}>Billing Cycle</Text>
							<Spacer />
							<Text modifiers={[font({ size: 15 }), foregroundStyle(theme.text.secondary)]}>{cyclePreview}</Text>
							<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
						</HStack>

						<Toggle label="With Trial" isOn={draft.with_trial} onIsOnChange={draft.setWithTrial} />

						{draft.with_trial && (
							<HStack
								spacing={6}
								alignment="center"
								modifiers={[onTapGesture(() => router.push('/(crossroad)/trial-duration'))]}
							>
								<Text modifiers={[font({ size: 16, weight: 'medium' })]}>Trial Duration</Text>
								<Spacer />
								<Text modifiers={[font({ size: 15 }), foregroundStyle(theme.text.secondary)]}>{trialPreview}</Text>
								<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
							</HStack>
						)}
					</Section>

					<Section>
						<HStack
							spacing={6}
							alignment="center"
							modifiers={[
								onTapGesture(() =>
									router.push({
										pathname: '/(pickers)/select-category',
										params: { target: 'add_subscription_category' }
									})
								)
							]}
						>
							<Text modifiers={[font({ size: 16, weight: 'medium' })]}>Category</Text>
							<Spacer />
							<Text modifiers={[font({ size: 15 }), foregroundStyle(theme.text.secondary)]}>{categoryPreview}</Text>
							<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
						</HStack>

						<HStack
							spacing={6}
							alignment="center"
							modifiers={[
								onTapGesture(() =>
									router.push({
										pathname: '/(pickers)/select-tender',
										params: { target: 'add_subscription_tender' }
									})
								)
							]}
						>
							<Text modifiers={[font({ size: 16, weight: 'medium' })]}>Payment Method</Text>
							<Spacer />
							<Text modifiers={[font({ size: 15 }), foregroundStyle(theme.text.secondary)]}>{paymentPreview}</Text>
							<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
						</HStack>
					</Section>

					<Section modifiers={[listSectionMargins({ length: 0, edges: 'bottom' })]}>
						<HStack
							spacing={6}
							alignment="center"
							modifiers={[onTapGesture(() => router.push('/(crossroad)/notifications'))]}
						>
							<Text modifiers={[font({ size: 16, weight: 'medium' })]}>Notifications</Text>
							<Spacer />
							<Text modifiers={[font({ size: 15 }), foregroundStyle(theme.text.secondary)]}>
								{notificationsPreview}
							</Text>
							<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
						</HStack>
					</Section>
				</List>
			</Host>

			<NotesCard glassEffectStyle={glassEffectStyle}>
				<NotesField value={draft.notes} onChangeText={draft.setNotes} placeholder="Notes (optional)" />
			</NotesCard>

			<Timeline />
		</Root>
	);
};

export default MasterPane;
