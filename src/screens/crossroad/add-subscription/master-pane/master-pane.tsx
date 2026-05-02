import React from 'react';
import { useRouter } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useTheme } from 'styled-components/native';

import db from '@db';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { categoriesTable, tendersTable } from '@db/schema';

import { useAccent } from '@hooks';

import {
	selectHasTrial,
	selectTrialDuration,
	selectFirstPaymentDate
} from '@screens/crossroad/add-subscription/events';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import LogoRow from './logo-row';
import Timeline from './timeline';
import PriceRow from './price-row';
import {
	font,
	tint,
	listStyle,
	lineLimit,
	toggleStyle,
	onTapGesture,
	scrollTargetBehavior,
	scrollDismissesKeyboard,
	foregroundStyle,
	listSectionSpacing,
	listRowBackground,
	listRowSeparator,
	multilineTextAlignment
} from '@expo/ui/swift-ui/modifiers';
import {
	Host,
	List,
	Section,
	Toggle,
	Text,
	ColorPicker,
	HStack,
	Spacer,
	Image,
	TextField,
	RNHostView
} from '@expo/ui/swift-ui';

import type { BillingCycleT } from '../events';

const logoKeys = ['image_uri', 'symbol', 'color'] as const;
const blank = (v: unknown) => (v == null || v === '' ? null : v);

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

type Props = {
	focusVersion: number;
	canSyncLocalService: boolean;
	onSyncLocalService: () => void;
};

const MasterPane = ({ focusVersion, canSyncLocalService, onSyncLocalService }: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();
	const settingAccent = useAccent();

	const draft = useDraftStore(
		useShallow((state) => ({
			custom_name: state.custom_name,
			category_slug: state.category_slug,
			billing_cycle_type: state.billing_cycle_type,
			billing_cycle_value: state.billing_cycle_value,
			tender_id: state.tender_id,
			notes: state.notes,
			notify_enabled: state.notify_enabled,
			notify_days_before: state.notify_days_before,
			timeline: state.timeline,
			setTitle: state.actions.setSubscriptionTitle,
			enableTrial: state.actions.enableTrial,
			disableTrial: state.actions.disableTrial,
			setNotes: state.actions.setNotes,

			logo: state.logo,
			logoSnapshot: state.logoSnapshot
		}))
	);
	const resetLogo = useDraftStore((state) => state.actions.resetLogo);
	const setColor = useDraftStore((state) => state.actions.setSubscriptionColor);

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

	const firstPaymentDate = selectFirstPaymentDate(draft.timeline) ?? format(new Date(), 'yyyy-MM-dd');
	const trialDuration = selectTrialDuration(draft.timeline) ?? { duration_type: 'days' as const, duration_value: 7 };
	const hasTrial = selectHasTrial(draft.timeline);
	const firstPaymentPreview = format(parseISO(firstPaymentDate), 'PP');
	const cyclePreview = formatCycle(draft.billing_cycle_type, draft.billing_cycle_value);
	const trialPreview = formatTrial(trialDuration.duration_type, trialDuration.duration_value);
	const categoryPreview = category?.title ?? (draft.category_slug ? t(`category.${draft.category_slug}`) : 'None');
	const paymentPreview = tender?.title ?? 'None';
	const notificationsPreview =
		draft.notify_enabled && draft.notify_days_before > 0
			? `${draft.notify_days_before} ${draft.notify_days_before === 1 ? 'day' : 'days'} before`
			: 'Off';

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

	const setTrialEnabled = (enabled: boolean) => {
		if (enabled) {
			draft.enableTrial();
		} else {
			draft.disableTrial();
		}
	};

	const isLogoDirty = logoKeys.some((key) => blank(draft.logo[key]) !== blank(draft.logoSnapshot[key]));

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
						key={focusVersion}
						defaultValue={draft.custom_name}
						onValueChange={draft.setTitle}
						placeholder="Service name"
						modifiers={[
							multilineTextAlignment('center'),
							font({ design: 'rounded', size: 26, weight: 'bold' }),
							foregroundStyle(theme.text.primary)
						]}
					/>

					<PriceRow focusVersion={focusVersion} />
				</Section>

				{/* Sync with local service */}
				{(canSyncLocalService || isLogoDirty) && (
					<Section>
						{canSyncLocalService && (
							<HStack spacing={8} alignment="center" modifiers={[onTapGesture(onSyncLocalService)]}>
								<Image systemName="arrow.triangle.2.circlepath" size={18} color={theme.text.secondary} />

								<Text modifiers={[font({ design: 'rounded', size: 16, weight: 'medium' })]}>
									Use Local Service Info
								</Text>

								<Spacer />

								<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
							</HStack>
						)}

						{isLogoDirty && (
							<HStack spacing={8} alignment="center" modifiers={[onTapGesture(resetLogo)]}>
								<Image systemName="arrow.triangle.2.circlepath" size={18} color={theme.text.secondary} />

								<Text modifiers={[font({ design: 'rounded', size: 16, weight: 'medium' })]}>Reset Logo</Text>

								<Spacer />

								<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
							</HStack>
						)}
					</Section>
				)}

				{/* Color Picker */}
				<Section>
					<ColorPicker
						label="Color"
						supportsOpacity={false}
						onSelectionChange={setColor}
						selection={draft.logo.color ?? settingAccent ?? null}
					/>
				</Section>

				{/* FPD | Billing Cycle | Trial */}
				<Section>
					{/* First payment date */}
					<HStack spacing={6} alignment="center" modifiers={[onTapGesture(goToFPDSettings)]}>
						<Text modifiers={[font({ design: 'rounded', size: 16, weight: 'medium' })]}>First Payment Date</Text>

						<Spacer />

						<Text modifiers={[font({ design: 'rounded', size: 15 }), foregroundStyle(theme.text.secondary)]}>
							{firstPaymentPreview}
						</Text>

						<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
					</HStack>

					{/* Billing cycle */}
					<HStack spacing={6} alignment="center" modifiers={[onTapGesture(goToBillingCycleSettings)]}>
						<Text modifiers={[font({ design: 'rounded', size: 16, weight: 'medium' })]}>Billing Cycle</Text>
						<Spacer />

						<Text modifiers={[font({ design: 'rounded', size: 15 }), foregroundStyle(theme.text.secondary)]}>
							{cyclePreview}
						</Text>
						<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
					</HStack>

					{/* Trial block */}
					<Toggle
						label="With Trial"
						isOn={hasTrial}
						modifiers={[toggleStyle('switch'), tint(settingAccent)]}
						onIsOnChange={setTrialEnabled}
					/>

					{hasTrial && (
						<HStack spacing={6} alignment="center" modifiers={[onTapGesture(goToTrialDurationSettings)]}>
							<Text modifiers={[font({ design: 'rounded', size: 16, weight: 'medium' })]}>Trial Duration</Text>
							<Spacer />

							<Text modifiers={[font({ design: 'rounded', size: 15 }), foregroundStyle(theme.text.secondary)]}>
								{trialPreview}
							</Text>
							<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
						</HStack>
					)}
				</Section>

				{/* Category | List | Payment Method */}
				<Section>
					<HStack spacing={6} alignment="center" modifiers={[onTapGesture(goToCategorySelection)]}>
						<Text modifiers={[font({ design: 'rounded', size: 16, weight: 'medium' })]}>Category</Text>
						<Spacer />

						<Text modifiers={[font({ design: 'rounded', size: 15 }), foregroundStyle(theme.text.secondary)]}>
							{categoryPreview}
						</Text>
						<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
					</HStack>

					<HStack spacing={6} alignment="center" modifiers={[onTapGesture(goToPaymentSelection)]}>
						<Text modifiers={[font({ design: 'rounded', size: 16, weight: 'medium' })]}>Payment Method</Text>
						<Spacer />

						<Text modifiers={[font({ design: 'rounded', size: 15 }), foregroundStyle(theme.text.secondary)]}>
							{paymentPreview}
						</Text>
						<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
					</HStack>
				</Section>

				{/* Notifications */}
				<Section>
					<HStack spacing={6} alignment="center" modifiers={[onTapGesture(goToNotificationsSettings)]}>
						<Text modifiers={[font({ design: 'rounded', size: 16, weight: 'medium' })]}>Notifications</Text>
						<Spacer />

						<Text modifiers={[font({ design: 'rounded', size: 15 }), foregroundStyle(theme.text.secondary)]}>
							{notificationsPreview}
						</Text>
						<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
					</HStack>
				</Section>

				<Section title="Notes" modifiers={[listRowSeparator('hidden')]}>
					<TextField
						key={focusVersion}
						axis="vertical"
						defaultValue={draft.notes}
						onValueChange={draft.setNotes}
						placeholder="Cancel later"
						modifiers={[
							font({ design: 'rounded', size: 17 }),
							lineLimit(4, { reservesSpace: true }),
							foregroundStyle(theme.text.primary)
						]}
					/>
				</Section>

				<Timeline />
			</List>
		</Host>
	);
};

export default MasterPane;
