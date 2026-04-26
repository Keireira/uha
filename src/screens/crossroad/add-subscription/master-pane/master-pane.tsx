import React from 'react';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useTheme } from 'styled-components/native';

import db from '@db';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { categoriesTable, tendersTable } from '@db/schema';

import { useGlassStyle } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import type { BillingCycleT } from '../hooks/use-draft-store';

import LogoRow from './logo-row';
import Timeline from './timeline';
import PriceRow from './price-row';
import {
	font,
	listStyle,
	onTapGesture,
	scrollTargetBehavior,
	scrollDismissesKeyboard,
	foregroundStyle,
	listSectionSpacing,
	listRowBackground,
	listRowSeparator,
	multilineTextAlignment
} from '@expo/ui/swift-ui/modifiers';
import { Host, List, Section, Toggle, Text, HStack, Spacer, Image, TextField, RNHostView } from '@expo/ui/swift-ui';
import { NotesCard, NotesField } from './master-pane.styles';

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

	const goToFPDSettings = () => {
		router.push('/(crossroad)/first-payment-date');
	};

	const goToBillingCycleSettings = () => {
		router.push('/(crossroad)/billing-cycle');
	};

	const goToTrialDurationSettings = () => {
		router.push('/(crossroad)/trial-duration');
	};

	const goToCategorySelection = () => {
		router.push({
			pathname: '/(pickers)/select-category',
			params: { target: 'add_subscription_category' }
		});
	};

	const goToPaymentSelection = () => {
		router.push({
			pathname: '/(pickers)/select-tender',
			params: { target: 'add_subscription_tender' }
		});
	};

	const goToNotificationsSettings = () => {
		router.push('/(crossroad)/notifications');
	};

	return (
		<Host style={{ flex: 1 }} useViewportSizeMeasurement>
			<List
				modifiers={[
					listStyle('insetGrouped'),
					scrollDismissesKeyboard('immediately'),
					scrollTargetBehavior('viewAligned')
				]}
			>
				<Section modifiers={[listRowBackground('transparent'), listRowSeparator('hidden'), listSectionSpacing(0)]}>
					<RNHostView matchContents>
						<LogoRow />
					</RNHostView>

					<TextField
						defaultValue={draft.title}
						onValueChange={draft.setTitle}
						placeholder="Service name"
						modifiers={[
							multilineTextAlignment('center'),
							font({ size: 26, weight: 'bold' }),
							foregroundStyle(theme.text.primary)
						]}
					/>

					<PriceRow />
				</Section>

				{/* FPD | Billing Cycle | Trial */}
				<Section>
					{/* First payment date */}
					<HStack spacing={6} alignment="center" modifiers={[onTapGesture(goToFPDSettings)]}>
						<Text modifiers={[font({ size: 16, weight: 'medium' })]}>First Payment Date</Text>

						<Spacer />

						<Text modifiers={[font({ size: 15 }), foregroundStyle(theme.text.secondary)]}>{firstPaymentPreview}</Text>

						<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
					</HStack>

					{/* Billing cycle */}
					<HStack spacing={6} alignment="center" modifiers={[onTapGesture(goToBillingCycleSettings)]}>
						<Text modifiers={[font({ size: 16, weight: 'medium' })]}>Billing Cycle</Text>
						<Spacer />

						<Text modifiers={[font({ size: 15 }), foregroundStyle(theme.text.secondary)]}>{cyclePreview}</Text>
						<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
					</HStack>

					{/* Trial block */}
					<Toggle label="With Trial" isOn={draft.with_trial} onIsOnChange={draft.setWithTrial} />

					{draft.with_trial && (
						<HStack spacing={6} alignment="center" modifiers={[onTapGesture(goToTrialDurationSettings)]}>
							<Text modifiers={[font({ size: 16, weight: 'medium' })]}>Trial Duration</Text>
							<Spacer />

							<Text modifiers={[font({ size: 15 }), foregroundStyle(theme.text.secondary)]}>{trialPreview}</Text>
							<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
						</HStack>
					)}
				</Section>

				{/* Category | List | Payment Method */}
				<Section>
					<HStack spacing={6} alignment="center" modifiers={[onTapGesture(goToCategorySelection)]}>
						<Text modifiers={[font({ size: 16, weight: 'medium' })]}>Category</Text>
						<Spacer />

						<Text modifiers={[font({ size: 15 }), foregroundStyle(theme.text.secondary)]}>{categoryPreview}</Text>
						<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
					</HStack>

					<HStack spacing={6} alignment="center" modifiers={[onTapGesture(goToPaymentSelection)]}>
						<Text modifiers={[font({ size: 16, weight: 'medium' })]}>Payment Method</Text>
						<Spacer />

						<Text modifiers={[font({ size: 15 }), foregroundStyle(theme.text.secondary)]}>{paymentPreview}</Text>
						<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
					</HStack>
				</Section>

				{/* Notifications */}
				<Section>
					<HStack spacing={6} alignment="center" modifiers={[onTapGesture(goToNotificationsSettings)]}>
						<Text modifiers={[font({ size: 16, weight: 'medium' })]}>Notifications</Text>
						<Spacer />

						<Text modifiers={[font({ size: 15 }), foregroundStyle(theme.text.secondary)]}>{notificationsPreview}</Text>
						<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
					</HStack>
				</Section>

				<Section modifiers={[listRowBackground('transparent'), listRowSeparator('hidden'), listSectionSpacing(0)]}>
					<RNHostView matchContents>
						<NotesCard glassEffectStyle={glassEffectStyle}>
							<NotesField value={draft.notes} onChangeText={draft.setNotes} placeholder="Notes (optional)" />
						</NotesCard>
					</RNHostView>
				</Section>

				<Timeline />
			</List>
		</Host>
	);
};

export default MasterPane;
