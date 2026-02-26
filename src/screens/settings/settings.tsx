import React, { useState, useCallback } from 'react';
import { Linking, Switch } from 'react-native';

import i18n from '@src/i18n';
import { openSettings } from 'expo-linking';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotifications } from './hooks';
import { setSettingsValue, useSettingsValue } from '@hooks';
import { backfillRates } from '@hooks/setup';
import Toast from 'react-native-toast-message';

import { SymbolView } from 'expo-symbols';
import { AppLogoPicker } from '@elements';
import { requestNotifications, RESULTS } from 'react-native-permissions';
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application';

import {
	Container,
	LogoHint,
	SectionWrap,
	SectionLabel,
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
	CardRowTrailing,
	CardRowValue,
	Separator,
	AccentPiano,
	AccentKeyWrap,
	AccentKeyBg,
	AccentKey,
	AccentKeyInner,
	SupportRow,
	SupportPill,
	SupportPillInner,
	SupportPillTitle,
	SupportPillSub,
	FooterWrap,
	FooterLinks,
	FooterPill,
	FooterPillInner,
	FooterPillText,
	FooterVersion
} from './settings.styles';

const SettingsScreen = () => {
	const { t } = useTranslation();
	const theme = useTheme();
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const notificationStatus = useNotifications();
	const currentTheme = useSettingsValue<'dark' | 'light'>('theme');
	const isOledEnabled = useSettingsValue<boolean>('oled_mode');
	const isFaceIdEnabled = useSettingsValue<boolean>('face_id');
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');
	const defaultCurrencyCode = useSettingsValue<string>('default_currency_code');

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

	const accentKeys = Object.keys(theme.accent) as string[];
	const [selectedAccent, setSelectedAccent] = useState('orange');
	const [isRefreshing, setIsRefreshing] = useState(false);

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
		router.push({ pathname: '/(crossroad)/select-currency', params: { target } });
	};

	const handleNotifications = () => {
		if (notificationStatus.status === RESULTS.DENIED) {
			requestNotifications();
		} else if (notificationStatus.status === RESULTS.BLOCKED) {
			openSettings();
		}
	};

	return (
		<Container contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 48 }}>
			<AppLogoPicker />
			<LogoHint>{t('settings.logo_hint')}</LogoHint>

			{/* Currencies */}
			<SectionWrap>
				<CurrencyRow>
					<CurrencyTile>
						<CurrencyTileInner onPress={() => openCurrencyPicker('default_currency_code')}>
							<CurrencyTileLabel>{t('settings.currencies.default')}</CurrencyTileLabel>
							<CurrencyTileCode>{defaultCurrencyCode}</CurrencyTileCode>
							<CurrencyTileName numberOfLines={1}>{t(`currencies.${defaultCurrencyCode}`)}</CurrencyTileName>
						</CurrencyTileInner>
					</CurrencyTile>

					<CurrencyTile>
						<CurrencyTileInner onPress={() => openCurrencyPicker('recalc_currency_code')}>
							<CurrencyTileLabel>{t('settings.currencies.recalc')}</CurrencyTileLabel>
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
			</SectionWrap>

			{/* Appearance */}
			<SectionWrap style={{ marginTop: 36 - 28 }}>
				<ThemePickerRow>
					<ThemePickerTile $bg="#F2F2F7" $active={activeMode === 'light'} $accent={theme.accent.orange} colorScheme="light">
						<ThemePickerTileInner onPress={() => handleThemeSelect('light')}>
							<SymbolView name="sun.max.fill" size={28} tintColor="#1C1C1E" />
							<ThemePickerLabel $color="#1C1C1E">{t('settings.appearance.light')}</ThemePickerLabel>
						</ThemePickerTileInner>
					</ThemePickerTile>

					<ThemePickerTile $bg="#1C1C1E" $active={activeMode === 'dark'} $accent={theme.accent.orange} colorScheme="dark">
						<ThemePickerTileInner onPress={() => handleThemeSelect('dark')}>
							<SymbolView name="moon.fill" size={28} tintColor="#FFFFFF" />
							<ThemePickerLabel $color="#FFFFFF">{t('settings.appearance.dark')}</ThemePickerLabel>
						</ThemePickerTileInner>
					</ThemePickerTile>

					<ThemePickerTile $bg="#000000" $active={activeMode === 'oled'} $accent={theme.accent.orange} colorScheme="dark">
						<ThemePickerTileInner onPress={() => handleThemeSelect('oled')}>
							<SymbolView name="moon.stars.fill" size={28} tintColor="#FFFFFF" />
							<ThemePickerLabel $color="#FFFFFF">{t('settings.appearance.oled')}</ThemePickerLabel>
						</ThemePickerTileInner>
					</ThemePickerTile>
				</ThemePickerRow>

				<AccentPiano>
					{accentKeys.map((key) => {
						const color = theme.accent[key as keyof typeof theme.accent];
						return (
							<AccentKeyWrap key={key} $active={selectedAccent === key} $color={color}>
								<AccentKeyBg />
								<AccentKey $color={color} colorScheme={theme.tint}>
									<AccentKeyInner onPress={() => setSelectedAccent(key)} />
								</AccentKey>
							</AccentKeyWrap>
						);
					})}
				</AccentPiano>
			</SectionWrap>

			{/* Preferences */}
			<SectionWrap>
				<SectionLabel>{t('settings.preferences.header')}</SectionLabel>

				<Card>
					<CardRow>
						<CardRowTitle>{t('settings.preferences.first_day')}</CardRowTitle>
						<CardRowTrailing>
							<CardRowValue>Monday</CardRowValue>
							<SymbolView name="chevron.right" size={12} weight="semibold" tintColor={theme.text.tertiary} />
						</CardRowTrailing>
					</CardRow>

					<Separator />

					<CardRow>
						<CardRowTitle>{t('settings.preferences.max_horizon')}</CardRowTitle>
						<CardRowTrailing>
							<CardRowValue>1 year</CardRowValue>
							<SymbolView name="chevron.right" size={12} weight="semibold" tintColor={theme.text.tertiary} />
						</CardRowTrailing>
					</CardRow>

					<Separator />

					<CardRow>
						<CardRowTitle>{t('settings.preferences.color_grading')}</CardRowTitle>
						<CardRowTrailing>
							<CardRowValue>Default</CardRowValue>
							<SymbolView name="chevron.right" size={12} weight="semibold" tintColor={theme.text.tertiary} />
						</CardRowTrailing>
					</CardRow>
				</Card>
			</SectionWrap>

			{/* General */}
			<SectionWrap>
				<SectionLabel>{t('settings.general.header')}</SectionLabel>

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
