import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import db from '@db';
import { asc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { categoriesTable, servicesTable, subscriptionsTable, tendersTable } from '@db/schema';

import { regenerateAllTxs } from '@hooks/setup';
import { useAccent, useSettingsValue } from '@hooks';
import { normalizeOptional, parsePositiveInt } from '../../shared';

import { listStyle, scrollDismissesKeyboard, tag } from '@expo/ui/swift-ui/modifiers';
import { Host, List, Section, Text, TextField, Picker, Toggle, Button } from '@expo/ui/swift-ui';

type BillingCycleT = 'days' | 'weeks' | 'months' | 'years';

const cycleTypes: BillingCycleT[] = ['days', 'weeks', 'months', 'years'];
const noPaymentMethod = '__none__';

const SubscriptionDetails = () => {
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();
	const settingAccent = useAccent();
	const maxHorizon = useSettingsValue<number>('max_horizon');
	const { data } = useLiveQuery(db.select().from(subscriptionsTable).where(eq(subscriptionsTable.id, id)).limit(1), [
		id
	]);
	const { data: services } = useLiveQuery(db.select().from(servicesTable).orderBy(asc(servicesTable.title)));
	const { data: categories } = useLiveQuery(db.select().from(categoriesTable).orderBy(asc(categoriesTable.title)));
	const { data: payments } = useLiveQuery(db.select().from(tendersTable).orderBy(asc(tendersTable.title)));
	const subscription = data?.[0];

	const [customName, setCustomName] = useState('');
	const [serviceId, setServiceId] = useState('');
	const [categorySlug, setCategorySlug] = useState('');
	const [tenderId, setTenderId] = useState(noPaymentMethod);
	const [billingCycleType, setBillingCycleType] = useState<BillingCycleT>('months');
	const [billingCycleValue, setBillingCycleValue] = useState('1');
	const [trialType, setTrialType] = useState<BillingCycleT>('weeks');
	const [trialValue, setTrialValue] = useState('1');
	const [firstPaymentDate, setFirstPaymentDate] = useState('');
	const [cancellationDate, setCancellationDate] = useState('');
	const [notes, setNotes] = useState('');
	const [notifyEnabled, setNotifyEnabled] = useState(false);

	useEffect(() => {
		if (!subscription) return;
		setCustomName(subscription.custom_name ?? '');
		setServiceId(subscription.service_id);
		setCategorySlug(subscription.category_slug);
		setTenderId(subscription.tender_id ?? noPaymentMethod);
		setBillingCycleType(subscription.billing_cycle_type);
		setBillingCycleValue(String(subscription.billing_cycle_value));
		setTrialType(subscription.trial_type);
		setTrialValue(String(subscription.trial_value));
		setFirstPaymentDate(subscription.first_payment_date);
		setCancellationDate(subscription.cancellation_date ?? '');
		setNotes(subscription.notes ?? '');
		setNotifyEnabled(subscription.notify_enabled);
	}, [subscription]);

	const save = async () => {
		if (!subscription || !serviceId || !categorySlug || !firstPaymentDate.trim()) return;

		await db
			.update(subscriptionsTable)
			.set({
				custom_name: normalizeOptional(customName),
				service_id: serviceId,
				category_slug: categorySlug,
				tender_id: tenderId === noPaymentMethod ? null : tenderId,
				billing_cycle_type: billingCycleType,
				billing_cycle_value: parsePositiveInt(billingCycleValue, subscription.billing_cycle_value),
				trial_type: trialType,
				trial_value: parsePositiveInt(trialValue, subscription.trial_value),
				first_payment_date: firstPaymentDate.trim(),
				cancellation_date: normalizeOptional(cancellationDate),
				notes: normalizeOptional(notes),
				notify_enabled: notifyEnabled
			})
			.where(eq(subscriptionsTable.id, subscription.id));

		const horizonYears = typeof maxHorizon === 'number' && Number.isFinite(maxHorizon) ? maxHorizon : 2;
		await regenerateAllTxs(horizonYears);
	};

	const closeModal = () => {
		router.back();
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button variant="plain" icon="xmark" onPress={closeModal} />
			</Stack.Toolbar>

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={save} tintColor={settingAccent} />
			</Stack.Toolbar>

			<Host style={{ flex: 1 }}>
				<List modifiers={[listStyle('insetGrouped'), scrollDismissesKeyboard('immediately')]}>
					<Section title="Subscription">
						<TextField
							key={`name-${subscription?.id ?? 'new'}`}
							defaultValue={subscription?.custom_name ?? customName}
							placeholder="Custom name"
							onValueChange={setCustomName}
						/>
						<Picker label="Service" selection={serviceId} onSelectionChange={setServiceId}>
							{(services ?? []).map((service) => (
								<Text key={service.id} modifiers={[tag(service.id)]}>
									{service.title}
								</Text>
							))}
						</Picker>
						<Picker label="Category" selection={categorySlug} onSelectionChange={setCategorySlug}>
							{(categories ?? []).map((category) => (
								<Text key={category.slug} modifiers={[tag(category.slug)]}>
									{category.title ?? category.slug}
								</Text>
							))}
						</Picker>
						<Picker label="Payment Method" selection={tenderId} onSelectionChange={setTenderId}>
							<Text modifiers={[tag(noPaymentMethod)]}>None</Text>
							{(payments ?? []).map((payment) => (
								<Text key={payment.id} modifiers={[tag(payment.id)]}>
									{payment.title}
								</Text>
							))}
						</Picker>
					</Section>
					<Section title="Billing">
						<Picker label="Cycle" selection={billingCycleType} onSelectionChange={setBillingCycleType}>
							{cycleTypes.map((cycle) => (
								<Text key={cycle} modifiers={[tag(cycle)]}>
									{cycle}
								</Text>
							))}
						</Picker>
						<TextField
							key={`cycle-value-${subscription?.id ?? 'new'}`}
							defaultValue={subscription ? String(subscription.billing_cycle_value) : billingCycleValue}
							placeholder="Cycle value"
							onValueChange={setBillingCycleValue}
						/>
						<TextField
							key={`first-payment-${subscription?.id ?? 'new'}`}
							defaultValue={subscription?.first_payment_date ?? firstPaymentDate}
							placeholder="First payment date"
							onValueChange={setFirstPaymentDate}
						/>
						<TextField
							key={`cancellation-${subscription?.id ?? 'new'}`}
							defaultValue={subscription?.cancellation_date ?? cancellationDate}
							placeholder="Cancellation date"
							onValueChange={setCancellationDate}
						/>
					</Section>
					<Section title="Trial">
						<Picker label="Trial type" selection={trialType} onSelectionChange={setTrialType}>
							{cycleTypes.map((cycle) => (
								<Text key={cycle} modifiers={[tag(cycle)]}>
									{cycle}
								</Text>
							))}
						</Picker>
						<TextField
							key={`trial-value-${subscription?.id ?? 'new'}`}
							defaultValue={subscription ? String(subscription.trial_value) : trialValue}
							placeholder="Trial value"
							onValueChange={setTrialValue}
						/>
					</Section>
					<Section title="Notes">
						<TextField
							key={`notes-${subscription?.id ?? 'new'}`}
							defaultValue={subscription?.notes ?? notes}
							placeholder="Notes"
							axis="vertical"
							onValueChange={setNotes}
						/>
						<Toggle isOn={notifyEnabled} label="Notifications" onIsOnChange={setNotifyEnabled} />
					</Section>
					<Section>
						<Button label="Save and Recalculate" onPress={save} />
					</Section>
				</List>
			</Host>
		</>
	);
};

export default SubscriptionDetails;
