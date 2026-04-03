import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isTextDark } from '@lib/color-utils';
import { SymbolView } from 'expo-symbols';
import SquircleMask from '@assets/masks/squircle.svg.tsx';
import useAddSubscription from './use-add-subscription';

import {
	Container,
	Header,
	Title,
	CloseGlass,
	CloseInner,
	ServicePreview,
	ServiceName,
	Main,
	Section,
	Caption,
	Input,
	PriceRow,
	PriceInput,
	CurrencyPill,
	CurrencyText,
	CycleRow,
	CycleValueInput,
	CycleOption,
	CycleLabel,
	CycleHint,
	PillList,
	Pill,
	PillEmoji,
	PillLabel,
	TenderScroll,
	TenderChip,
	TenderEmoji,
	TenderTitle,
	TrialRow,
	TrialLabel,
	TrialDaysRow,
	TrialInput,
	TrialHint,
	ColorDot,
	SaveButton,
	SaveLabel,
	LoadingWrap
} from './add-subscription.styles';

const COLORS = [
	'#f3a683',
	'#f19066',
	'#f7d794',
	'#f5cd79',
	'#778beb',
	'#546de5',
	'#e77f67',
	'#e15f41',
	'#cf6a87',
	'#c44569',
	'#786fa6',
	'#574b90',
	'#f8a5c2',
	'#f78fb3',
	'#63cdda',
	'#3dc1d3',
	'#ea8685',
	'#e66767',
	'#7B68EE',
	'#1DB954',
	'#E74C3C',
	'#FF6B35',
	'#3498DB',
	'#2C3E50',
	'#4CAF50',
	'#FF9800',
	'#9C27B0',
	'#009688',
	'#607D8B',
	'#E91E63'
];

const CYCLES = [
	{ type: 'days', label: 'Days' },
	{ type: 'weeks', label: 'Weeks' },
	{ type: 'months', label: 'Months' },
	{ type: 'years', label: 'Years' }
] as const;

const formatCycleHint = (value: number, type: string) => {
	if (value === 1) return `Every ${type.slice(0, -1)}`;
	return `Every ${value} ${type}`;
};

const AddSubscriptionScreen = () => {
	const router = useRouter();
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
	const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

	const {
		service,
		resolving,
		customName,
		setCustomName,
		color,
		setColor,
		selectedCategorySlug,
		setSelectedCategorySlug,
		cycleType,
		setCycleType,
		cycleValue,
		setCycleValue,
		price,
		setPrice,
		currencyId,
		setCurrencyId,
		tenderId,
		setTenderId,
		firstDate,
		setFirstDate,
		trialEnabled,
		setTrialEnabled,
		trialDays,
		setTrialDays,
		effectiveFirstDate,
		tenders,
		currencies,
		categories,
		selectedCurrency,
		isValid,
		save
	} = useAddSubscription();

	const dark = useMemo(() => isTextDark(color), [color]);
	const iconColor = dark ? '#333333' : '#ffffff';
	const placeholderColor = dark ? 'rgba(51,51,51,0.3)' : 'rgba(255,255,255,0.3)';

	if (resolving || !service) {
		return (
			<LoadingWrap>
				<ActivityIndicator color="#999" />
			</LoadingWrap>
		);
	}

	const currencyDisplay = selectedCurrency ? `${selectedCurrency.symbol} ${selectedCurrency.id}` : currencyId;

	return (
		<Container
			style={{ backgroundColor: color }}
			contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 24, gap: 24, paddingBottom: insets.bottom + 24 }}
		>
			<Header>
				<Title $dark={dark}>New Subscription</Title>
				<CloseGlass isInteractive>
					<CloseInner onPress={() => router.back()} hitSlop={10}>
						<SymbolView name="xmark" size={16} weight="bold" tintColor={iconColor} />
					</CloseInner>
				</CloseGlass>
			</Header>

			{/* Service preview */}
			<ServicePreview>
				<SquircleMask size={80} link={service.logo_url || undefined} color={color}>
					{!service.logo_url && <ServiceName $dark={dark}>{service.name.charAt(0)}</ServiceName>}
				</SquircleMask>
				<ServiceName $dark={dark}>{service.name}</ServiceName>
			</ServicePreview>

			<Main>
				{/* Custom name */}
				<Section>
					<Caption $dark={dark}>Custom Name</Caption>
					<Input
						$dark={dark}
						value={customName}
						onChangeText={setCustomName}
						placeholder={service.name}
						placeholderTextColor={placeholderColor}
					/>
				</Section>

				{/* Price + currency */}
				<Section>
					<Caption $dark={dark}>Price</Caption>
					<PriceRow>
						<PriceInput
							$dark={dark}
							value={price}
							onChangeText={setPrice}
							placeholder="0.00"
							placeholderTextColor={placeholderColor}
							keyboardType="decimal-pad"
						/>
						<CurrencyPill onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}>
							<CurrencyText $dark={dark}>{currencyDisplay}</CurrencyText>
						</CurrencyPill>
					</PriceRow>

					{showCurrencyPicker && (
						<PillList>
							{currencies.map((c) => (
								<Pill
									key={c.id}
									$selected={currencyId === c.id}
									onPress={() => {
										setCurrencyId(c.id);
										setShowCurrencyPicker(false);
									}}
								>
									<PillLabel $dark={dark} $selected={currencyId === c.id}>
										{c.symbol} {c.id}
									</PillLabel>
								</Pill>
							))}
						</PillList>
					)}
				</Section>

				{/* Billing cycle: every N days/weeks/months/years */}
				<Section>
					<Caption $dark={dark}>Billing Cycle</Caption>
					<CycleRow>
						<CycleValueInput
							$dark={dark}
							value={String(cycleValue)}
							onChangeText={(t) => {
								const n = parseInt(t, 10);
								setCycleValue(isNaN(n) || n < 1 ? 1 : n);
							}}
							keyboardType="number-pad"
							maxLength={3}
						/>
						{CYCLES.map((c) => (
							<CycleOption key={c.type} $selected={cycleType === c.type} onPress={() => setCycleType(c.type)}>
								<CycleLabel $dark={dark} $selected={cycleType === c.type}>
									{c.label}
								</CycleLabel>
							</CycleOption>
						))}
					</CycleRow>
					<CycleHint $dark={dark}>{formatCycleHint(cycleValue, cycleType)}</CycleHint>
				</Section>

				{/* First payment date */}
				<Section>
					<Caption $dark={dark}>First Payment</Caption>
					<Input
						$dark={dark}
						value={firstDate}
						onChangeText={setFirstDate}
						placeholder="YYYY-MM-DD"
						placeholderTextColor={placeholderColor}
						keyboardType="numbers-and-punctuation"
					/>
				</Section>

				{/* Trial */}
				<Section>
					<TrialRow>
						<TrialLabel $dark={dark}>Free Trial</TrialLabel>
						<Switch value={trialEnabled} onValueChange={setTrialEnabled} />
					</TrialRow>
					{trialEnabled && (
						<TrialDaysRow>
							<TrialInput
								$dark={dark}
								value={trialDays}
								onChangeText={setTrialDays}
								keyboardType="number-pad"
								maxLength={3}
							/>
							<TrialHint $dark={dark}>days free, first charge on {effectiveFirstDate}</TrialHint>
						</TrialDaysRow>
					)}
				</Section>

				{/* Category */}
				<Section>
					<Caption $dark={dark}>Category</Caption>
					<TenderScroll>
						{categories.map((category) => (
							<TenderChip
								key={category.slug}
								$selected={selectedCategorySlug === category.slug}
								onPress={() => setSelectedCategorySlug(category.slug)}
							>
								<TenderTitle $dark={dark} $selected>
									{category.title || t(`category.${category.slug}`)}
								</TenderTitle>
							</TenderChip>
						))}
					</TenderScroll>
				</Section>

				{/* Payment method (horizontal scroll) */}
				{tenders.length > 0 && (
					<Section>
						<Caption $dark={dark}>Payment Method</Caption>
						<TenderScroll>
							{tenders.map((t) => (
								<TenderChip
									key={t.id}
									$selected={tenderId === t.id}
									onPress={() => setTenderId(tenderId === t.id ? '' : t.id)}
								>
									<TenderEmoji>{t.emoji}</TenderEmoji>
									<TenderTitle $dark={dark} $selected={tenderId === t.id}>
										{t.title}
									</TenderTitle>
								</TenderChip>
							))}
						</TenderScroll>
					</Section>
				)}

				{/* Custom color */}
				<Section>
					<Caption $dark={dark}>Color</Caption>
					<TenderScroll>
						{COLORS.map((c) => (
							<ColorDot key={c} $color={c} $selected={color === c} onPress={() => setColor(c)} />
						))}
					</TenderScroll>
				</Section>
			</Main>

			<SaveButton $disabled={!isValid} disabled={!isValid} onPress={save}>
				<SaveLabel $dark={dark}>Subscribe</SaveLabel>
			</SaveButton>
		</Container>
	);
};

export default AddSubscriptionScreen;
