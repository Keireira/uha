import React, { useState, useCallback, useEffect } from 'react';
import { Linking, Pressable, Switch } from 'react-native';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import i18n from '@src/i18n';
import { openSettings } from 'expo-linking';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotifications, useAICompat } from './hooks';
import { setSettingsValue, useSettingsValue, useScrollDirection, useEntitlement, useFeatureGate } from '@hooks';
import { backfillRates } from '@hooks/setup';
import Toast from 'react-native-toast-message';
import { shareBackup, restoreFromBackup } from '@lib/backup';
import { exportAllCSV, importAllCSV } from '@lib/backup/csv-export';
import useTipJar from '@hooks/use-tip-jar';
import * as Haptics from 'expo-haptics';

import { SymbolView } from 'expo-symbols';

import { requestNotifications, RESULTS } from 'react-native-permissions';
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application';

import {
	Container,
	SectionWrap,
	SectionLabel,
	SectionCard,
	SectionFooterText,
	CurrencyRow,
	CurrencyTile,
	CurrencyTileInner,
	CurrencyTileLabel,
	CurrencyTileCode,
	CurrencyTileName,
	RefreshButton,
	RefreshInner,
	RefreshText,
	TileGrid,
	ThemePickerRow,
	ThemePickerTile,
	ThemePickerTileInner,
	ThemePickerLabel,
	NavTile,
	NavTileInner,
	NavTileTitle,
	NavTileValue,
	Card,
	CardRow,
	CardRowTitle,
	CardRowValue,
	AccentSpectrum,
	AccentBarItem,
	DayHint,
	StepperWrap,
	StepperButton,
	ColorGradingPreview,
	ColorDot,
	SupportRow,
	SupportPill,
	SupportPillInner,
	SupportPillTitle,
	SupportPillSub,
	UpgradeBanner,
	UpgradeBannerInner,
	UpgradeBannerText,
	UpgradeBannerTitle,
	UpgradeBannerSub,
	UnlimitedBadge,
	UnlimitedBadgeInner,
	UnlimitedBadgeText,
	UnlimitedBadgeTitle,
	UnlimitedBadgeSub,
	Separator,
	FooterWrap,
	FooterLinks,
	FooterPill,
	FooterPillInner,
	FooterPillText,
	FooterVersion
} from './settings.styles';
import { AppLogoPicker } from './components';

/* Accent color keys */
const ACCENT_KEYS = [
	'red',
	'orange',
	'yellow',
	'green',
	'mint',
	'teal',
	'cyan',
	'blue',
	'indigo',
	'purple',
	'pink'
] as const;

type AccentBarProps = {
	color: string;
	isActive: boolean;
	onPress: () => void;
};

const AnimatedAccentBar = ({ color, isActive, onPress }: AccentBarProps) => {
	const flex = useSharedValue(isActive ? 4 : 1.4);

	useEffect(() => {
		flex.value = withTiming(isActive ? 4 : 1.4, { duration: 180 });
	}, [isActive]);

	const animStyle = useAnimatedStyle(() => ({
		flex: flex.value
	}));

	return (
		<AccentBarItem $color={color} $active={isActive} style={animStyle}>
			<Pressable onPress={onPress} style={{ flex: 1 }} />
		</AccentBarItem>
	);
};

const SettingsScreen = () => {
	const { t } = useTranslation();
	const theme = useTheme();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const handleScroll = useScrollDirection();

	const { isUnlimited, tier } = useEntitlement();
	const gate = useFeatureGate();

	const notificationStatus = useNotifications();
	const currentTheme = useSettingsValue<'dark' | 'light'>('theme');
	const isOledEnabled = useSettingsValue<boolean>('oled_mode');
	const isFaceIdEnabled = useSettingsValue<boolean>('face_id');
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');
	const defaultCurrencyCode = useSettingsValue<string>('default_currency_code');
	const maxHorizon = useSettingsValue<number>('max_horizon') || 3;
	const withColorGrading = useSettingsValue<boolean>('with_color_grading') ?? true;
	const aiEnabled = useSettingsValue<boolean>('ai_enabled') ?? true;
	const { isSupported: isAISupported } = useAICompat();
	const { products: tipProducts, purchasing: tipPurchasing, purchaseTip } = useTipJar();
	const [firstDay, setFirstDay] = useState(1); // 0=Sun … 6=Sat, default Mon

	const activeMode = isOledEnabled && currentTheme === 'dark' ? 'oled' : currentTheme;

	const handleThemeSelect = (mode: 'light' | 'dark' | 'oled') => {
		if (mode === 'light') {
			setSettingsValue('theme', 'light');
			setSettingsValue('oled_mode', false);
		} else if (mode === 'dark') {
			setSettingsValue('theme', 'dark');
			setSettingsValue('oled_mode', false);
		} else {
			setSettingsValue('theme', 'dark');
			setSettingsValue('oled_mode', true);
		}
	};

	const [selectedAccent, setSelectedAccent] = useState('orange');
	const [isRefreshing, setIsRefreshing] = useState(false);

	// Icon picker state
	const handleRefreshRates = useCallback(async () => {
		setIsRefreshing(true);

		try {
			await backfillRates();

			Toast.show({
				type: 'success',
				text1: t('rates.success_title')
			});
		} catch {
			Toast.show({
				type: 'error',
				text1: t('rates.error_title'),
				text2: t('rates.error_description')
			});
		} finally {
			setIsRefreshing(false);
		}
	}, [t]);

	const openCurrencyPicker = (target: string) => {
		router.push({ pathname: '/(tabs)/settings/select-currency', params: { target } });
	};

	const handleNotifications = () => {
		if (notificationStatus.status === RESULTS.DENIED) {
			requestNotifications();
		} else if (notificationStatus.status === RESULTS.BLOCKED) {
			openSettings();
		}
	};

	return (
		<Container
			contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 48 }}
			onScroll={handleScroll}
		>
			<AppLogoPicker />

			{/* Appearance */}
			<SectionWrap style={{ marginTop: 42 }}>
				<SectionLabel>{t('settings.appearance.header')}</SectionLabel>
				<SectionCard>
					<ThemePickerRow>
						<ThemePickerTile
							$bg="#F2F2F7"
							$active={activeMode === 'light'}
							$accent={theme.accent.orange}
							colorScheme="light"
						>
							<ThemePickerTileInner onPress={() => handleThemeSelect('light')}>
								<SymbolView name="sun.max.fill" size={28} tintColor="#1C1C1E" />
								<ThemePickerLabel $color="#1C1C1E">{t('settings.appearance.light')}</ThemePickerLabel>
							</ThemePickerTileInner>
						</ThemePickerTile>

						<ThemePickerTile
							$bg="#1C1C1E"
							$active={activeMode === 'dark'}
							$accent={theme.accent.orange}
							colorScheme="dark"
						>
							<ThemePickerTileInner onPress={() => handleThemeSelect('dark')}>
								<SymbolView name="moon.fill" size={28} tintColor="#FFFFFF" />
								<ThemePickerLabel $color="#FFFFFF">{t('settings.appearance.dark')}</ThemePickerLabel>
							</ThemePickerTileInner>
						</ThemePickerTile>

						<ThemePickerTile
							$bg="#000000"
							$active={activeMode === 'oled'}
							$accent={theme.accent.orange}
							colorScheme="dark"
						>
							<ThemePickerTileInner onPress={() => handleThemeSelect('oled')}>
								<SymbolView name="moon.stars.fill" size={28} tintColor="#FFFFFF" />
								<ThemePickerLabel $color="#FFFFFF">{t('settings.appearance.oled')}</ThemePickerLabel>
							</ThemePickerTileInner>
						</ThemePickerTile>
					</ThemePickerRow>

					<AccentSpectrum>
						{ACCENT_KEYS.map((key) => (
							<AnimatedAccentBar
								key={key}
								color={theme.accent[key]}
								isActive={selectedAccent === key}
								onPress={() => {
									setSelectedAccent(key);
									Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
								}}
							/>
						))}
					</AccentSpectrum>
				</SectionCard>
			</SectionWrap>

			{/* Currencies */}
			<SectionWrap>
				<SectionLabel>{t('settings.currencies.header')}</SectionLabel>
				<SectionCard>
					<CurrencyRow>
						<CurrencyTile>
							<CurrencyTileInner onPress={() => openCurrencyPicker('default_currency_code')}>
								<CurrencyTileLabel>{t('settings.currencies.default_currency_code')}</CurrencyTileLabel>
								<CurrencyTileCode>{defaultCurrencyCode}</CurrencyTileCode>
								<CurrencyTileName numberOfLines={1}>{t(`currencies.${defaultCurrencyCode}`)}</CurrencyTileName>
							</CurrencyTileInner>
						</CurrencyTile>

						<CurrencyTile>
							<CurrencyTileInner onPress={() => openCurrencyPicker('recalc_currency_code')}>
								<CurrencyTileLabel>{t('settings.currencies.recalc_currency_code')}</CurrencyTileLabel>
								<CurrencyTileCode>{recalcCurrencyCode}</CurrencyTileCode>
								<CurrencyTileName numberOfLines={1}>{t(`currencies.${recalcCurrencyCode}`)}</CurrencyTileName>
							</CurrencyTileInner>
						</CurrencyTile>
					</CurrencyRow>

					<RefreshButton>
						<RefreshInner onPress={handleRefreshRates} disabled={isRefreshing}>
							<SymbolView name="arrow.clockwise" size={15} weight="semibold" tintColor={theme.accent.orange} />
							<RefreshText>{isRefreshing ? '...' : t('settings.currencies.refresh_rates')}</RefreshText>
						</RefreshInner>
					</RefreshButton>
				</SectionCard>
			</SectionWrap>

			{/* Preferences */}
			<SectionWrap>
				<SectionLabel>{t('settings.preferences.header')}</SectionLabel>
				<SectionCard>
					<CurrencyRow>
						<CurrencyTile>
							<CurrencyTileInner
								onPress={() => {
									gate(() => {
										setFirstDay(firstDay === 1 ? 0 : 1);
										Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
									});
								}}
							>
								<CurrencyTileLabel>{t('settings.preferences.first_day')}</CurrencyTileLabel>
								<CurrencyTileCode>{t(`settings.preferences.days.${firstDay === 1 ? 'mo' : 'su'}`)}</CurrencyTileCode>
								<DayHint>
									{firstDay === 0 ? t('settings.preferences.day_hint_us') : t('settings.preferences.day_hint_iso')}
								</DayHint>
							</CurrencyTileInner>
						</CurrencyTile>

						<CurrencyTile>
							<CurrencyTileInner>
								<CurrencyTileLabel>{t('settings.preferences.max_horizon')}</CurrencyTileLabel>
								<CurrencyTileCode>
									{maxHorizon} {t('settings.preferences.years_unit')}
								</CurrencyTileCode>
								<StepperWrap>
									<StepperButton
										$disabled={maxHorizon <= 2}
										onPress={() => {
											if (maxHorizon > 2) {
												setSettingsValue('max_horizon', maxHorizon - 1);
												Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
											}
										}}
									>
										<SymbolView name="minus" size={13} weight="bold" tintColor={theme.text.secondary} />
									</StepperButton>
									<StepperButton
										$disabled={!isUnlimited && maxHorizon >= tier.maxHorizon}
										onPress={() => {
											if (!isUnlimited && maxHorizon >= tier.maxHorizon) {
												gate(() => {});
												return;
											}
											if (maxHorizon < 10) {
												setSettingsValue('max_horizon', maxHorizon + 1);
												Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
											}
										}}
									>
										<SymbolView name="plus" size={13} weight="bold" tintColor={theme.text.secondary} />
									</StepperButton>
								</StepperWrap>
							</CurrencyTileInner>
						</CurrencyTile>
					</CurrencyRow>

					<CurrencyTile style={{ marginTop: 10 }}>
						<CurrencyTileInner
							onPress={() => {
								setSettingsValue('with_color_grading', !withColorGrading);
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
							}}
						>
							<CurrencyTileLabel>{t('settings.preferences.color_grading')}</CurrencyTileLabel>
							<ColorGradingPreview>
								{withColorGrading ? (
									<>
										<ColorDot $color="#FF3B30" $size={18} />
										<ColorDot $color="#FF9500" $size={14} />
										<ColorDot $color="#34C759" $size={11} />
										<ColorDot $color="#007AFF" $size={9} />
									</>
								) : (
									<ColorDot $color={theme.text.tertiary} $size={18} />
								)}
							</ColorGradingPreview>
							<CurrencyTileName>
								{withColorGrading ? t('settings.preferences.grading_on') : t('settings.preferences.grading_off')}
							</CurrencyTileName>
						</CurrencyTileInner>
					</CurrencyTile>
				</SectionCard>
			</SectionWrap>

			{/* AI Features */}
			<SectionWrap>
				<SectionLabel>{t('settings.ai.header')}</SectionLabel>
				<SectionCard>
					<TileGrid>
						<NavTile>
							<NavTileInner>
								<NavTileTitle>{t('settings.ai.status')}</NavTileTitle>
								<NavTileValue>
									{isAISupported ? t('settings.ai.supported') : t('settings.ai.not_supported')}
								</NavTileValue>
							</NavTileInner>
						</NavTile>
					</TileGrid>

					{isAISupported && (
						<Card style={{ marginTop: 10 }}>
							<CardRow onPress={() => setSettingsValue('ai_enabled', !aiEnabled)}>
								<CardRowTitle>{t('settings.ai.toggle')}</CardRowTitle>
								<Switch
									value={aiEnabled}
									onValueChange={(v) => setSettingsValue('ai_enabled', v)}
									trackColor={{ true: theme.accent.orange }}
								/>
							</CardRow>
						</Card>
					)}
				</SectionCard>
				<SectionFooterText>{t('settings.ai.footer')}</SectionFooterText>
			</SectionWrap>

			{/* Unlimited / Upgrade */}
			<SectionWrap>
				{isUnlimited ? (
					<UnlimitedBadge>
						<UnlimitedBadgeInner>
							<SymbolView name="crown.fill" size={24} tintColor={theme.accent.orange} />
							<UnlimitedBadgeText>
								<UnlimitedBadgeTitle>{t('settings.unlimited.badge')}</UnlimitedBadgeTitle>
								<UnlimitedBadgeSub>{t('settings.unlimited.active')}</UnlimitedBadgeSub>
							</UnlimitedBadgeText>
						</UnlimitedBadgeInner>
					</UnlimitedBadge>
				) : (
					<UpgradeBanner>
						<UpgradeBannerInner onPress={() => router.push('/(crossroad)/paywall')}>
							<SymbolView name="crown.fill" size={24} tintColor={theme.accent.orange} />
							<UpgradeBannerText>
								<UpgradeBannerTitle>{t('settings.unlimited.badge')}</UpgradeBannerTitle>
								<UpgradeBannerSub>{t('limits.upgrade')}</UpgradeBannerSub>
							</UpgradeBannerText>
							<SymbolView name="chevron.right" size={14} weight="semibold" tintColor={theme.text.tertiary} />
						</UpgradeBannerInner>
					</UpgradeBanner>
				)}
			</SectionWrap>

			{/* System */}
			<SectionWrap>
				<SectionLabel>{t('settings.general.header')}</SectionLabel>
				<SectionCard>
					<TileGrid>
						<NavTile>
							<NavTileInner onPress={handleNotifications}>
								<NavTileTitle>{t('settings.system.notifications.header')}</NavTileTitle>
								<NavTileValue>{notificationStatus.label}</NavTileValue>
							</NavTileInner>
						</NavTile>

						<NavTile>
							<NavTileInner onPress={openSettings}>
								<NavTileTitle>{t('settings.system.language')}</NavTileTitle>
								<NavTileValue>{t(`languages.${i18n.language}`)}</NavTileValue>
							</NavTileInner>
						</NavTile>
					</TileGrid>

					<Card style={{ marginTop: 10 }}>
						<CardRow onPress={() => setSettingsValue('face_id', !isFaceIdEnabled)}>
							<CardRowTitle>{t('settings.system.face_id')}</CardRowTitle>
							<Switch
								value={isFaceIdEnabled}
								onValueChange={(v) => setSettingsValue('face_id', v)}
								trackColor={{ true: theme.accent.orange }}
							/>
						</CardRow>
					</Card>
				</SectionCard>
			</SectionWrap>

			{/* Data */}
			<SectionWrap>
				<SectionLabel>{t('settings.data.header')}</SectionLabel>
				<SectionCard>
					<Card>
						<CardRow disabled style={{ opacity: 0.45 }}>
							<CardRowTitle>{t('settings.data.icloud_sync')}</CardRowTitle>
							<CardRowValue>{t('settings.data.icloud_coming_soon')}</CardRowValue>
						</CardRow>
					</Card>

					<TileGrid style={{ marginTop: 10 }}>
						<NavTile>
							<NavTileInner
								onPress={async () => {
									try {
										await shareBackup();
										Toast.show({ type: 'success', text1: t('settings.data.backup_success') });
									} catch {
										Toast.show({ type: 'error', text1: t('settings.data.backup_error') });
									}
								}}
							>
								<NavTileTitle>{t('settings.data.backup')}</NavTileTitle>
							</NavTileInner>
						</NavTile>

						<NavTile>
							<NavTileInner
								onPress={async () => {
									try {
										const ok = await restoreFromBackup();
										if (ok) {
											Toast.show({ type: 'success', text1: t('settings.data.restore_success') });
										}
									} catch {
										Toast.show({ type: 'error', text1: t('settings.data.restore_error') });
									}
								}}
							>
								<NavTileTitle>{t('settings.data.restore')}</NavTileTitle>
							</NavTileInner>
						</NavTile>
					</TileGrid>

					<Card style={{ marginTop: 10 }}>
						<CardRow
							onPress={async () => {
								try {
									await exportAllCSV();
									Toast.show({ type: 'success', text1: t('settings.data.export_success') });
								} catch {
									Toast.show({ type: 'error', text1: t('settings.data.export_error') });
								}
							}}
						>
							<CardRowTitle>{t('settings.data.export_csv')}</CardRowTitle>
							<SymbolView name="square.and.arrow.up" size={18} tintColor={theme.text.tertiary} />
						</CardRow>
						<Separator />
						<CardRow
							onPress={async () => {
								try {
									const ok = await importAllCSV();
									if (ok) {
										Toast.show({ type: 'success', text1: t('settings.data.import_success') });
									}
								} catch {
									Toast.show({ type: 'error', text1: t('settings.data.import_error') });
								}
							}}
						>
							<CardRowTitle>{t('settings.data.import_csv')}</CardRowTitle>
							<SymbolView name="square.and.arrow.down" size={18} tintColor={theme.text.tertiary} />
						</CardRow>
					</Card>
					<SectionFooterText>{t('settings.data.data_footer')}</SectionFooterText>
				</SectionCard>
			</SectionWrap>

			{/* Support */}
			<SectionWrap>
				<SectionLabel>{t('settings.donations.header')}</SectionLabel>
				<SupportRow>
					<SupportPill>
						<SupportPillInner onPress={() => Linking.openURL('https://github.com/sponsors/Keireira')}>
							<SupportPillTitle>{t('settings.about.github')}</SupportPillTitle>
							<SupportPillSub>keireira</SupportPillSub>
						</SupportPillInner>
					</SupportPill>

					<SupportPill>
						<SupportPillInner onPress={() => Linking.openURL('https://boosty.to/keireira/donate')}>
							<SupportPillTitle>{t('settings.donations.boosty')}</SupportPillTitle>
							<SupportPillSub>keireira</SupportPillSub>
						</SupportPillInner>
					</SupportPill>

					<SupportPill>
						<SupportPillInner onPress={() => Linking.openURL('https://patreon.com/keireira_fog')}>
							<SupportPillTitle>{t('settings.donations.patreon')}</SupportPillTitle>
							<SupportPillSub>keireira_fog</SupportPillSub>
						</SupportPillInner>
					</SupportPill>
				</SupportRow>
				<SectionFooterText>{t('settings.donations.description')}</SectionFooterText>
			</SectionWrap>

			{/* Tip Jar — premium only */}
			{isUnlimited && tipProducts.length > 0 && (
				<SectionWrap>
					<SectionLabel>{t('settings.tip_jar.header')}</SectionLabel>
					<SupportRow>
						{tipProducts.map((product) => {
							const label =
								product.identifier === 'uha_tip_small'
									? t('settings.tip_jar.small')
									: product.identifier === 'uha_tip_medium'
										? t('settings.tip_jar.medium')
										: t('settings.tip_jar.large');

							return (
								<SupportPill key={product.identifier}>
									<SupportPillInner onPress={() => purchaseTip(product)} disabled={tipPurchasing !== null}>
										<SupportPillTitle>{product.priceString}</SupportPillTitle>
										<SupportPillSub>{label}</SupportPillSub>
									</SupportPillInner>
								</SupportPill>
							);
						})}
					</SupportRow>
					<SectionFooterText>{t('settings.tip_jar.description')}</SectionFooterText>
				</SectionWrap>
			)}

			{/* Footer — about */}
			<FooterWrap>
				<FooterLinks>
					<FooterPill>
						<FooterPillInner onPress={() => Linking.openURL('https://github.com/Keireira/uha')}>
							<FooterPillText>{t('settings.about.sources')}</FooterPillText>
							<SymbolView name="arrow.up.right" size={10} weight="semibold" tintColor={theme.text.tertiary} />
						</FooterPillInner>
					</FooterPill>

					<FooterPill>
						<FooterPillInner onPress={() => Linking.openURL('https://testflight.apple.com/join/uVYrDkbA')}>
							<FooterPillText>{t('settings.about.beta')}</FooterPillText>
							<SymbolView name="arrow.up.right" size={10} weight="semibold" tintColor={theme.text.tertiary} />
						</FooterPillInner>
					</FooterPill>
				</FooterLinks>

				<FooterVersion>
					{t('settings.about.version')} {nativeApplicationVersion} ({nativeBuildVersion})
				</FooterVersion>
			</FooterWrap>
		</Container>
	);
};

export default SettingsScreen;
