import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Linking, Pressable, Switch } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

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
import * as Haptics from 'expo-haptics';

import { SymbolView } from 'expo-symbols';
import SquircleMask from '@assets/masks/squircle.svg.tsx';
import { setAppIcon, getAppIcon } from '@howincodes/expo-dynamic-app-icon';
import { requestNotifications, RESULTS } from 'react-native-permissions';
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application';

import {
	Container,
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
	FooterVersion,
	ConstellationWrap,
	ConstellationLine,
	ConstellationStar,
	ConstellationGlow,
	ConstellationDot,
	SectionDivider
} from './settings.styles';

type LogoPageT = {
	key: string;
	source: number;
	labelKey: string;
	tint: string;
};

const LOGO_PAGES: LogoPageT[] = [
	{
		key: 'DEFAULT',
		source: require('@assets/images/ios-light.png'),
		labelKey: 'settings.icons.classic',
		tint: '#FF9500'
	},
	{
		key: 'enby',
		source: require('@assets/images/enby-icon.png'),
		labelKey: 'settings.icons.nonbinary',
		tint: '#FCF434'
	},
	{ key: 'trans', source: require('@assets/images/trans-icon.png'), labelKey: 'settings.icons.trans', tint: '#5BCEFA' },
	{
		key: 'lesbi',
		source: require('@assets/images/lesbi-icon.png'),
		labelKey: 'settings.icons.lesbian',
		tint: '#D362A4'
	},
	{ key: 'pan', source: require('@assets/images/pan-icon.png'), labelKey: 'settings.icons.pan', tint: '#FF218C' }
];

/* Lupus constellation — based on reference chart */
const STAR_POSITIONS = [
	{ x: 140, y: 95 }, // center hub
	{ x: 110, y: 35 }, // upper left
	{ x: 190, y: 30 }, // upper right
	{ x: 60, y: 155 }, // lower left
	{ x: 175, y: 160 } // lower right
];
const STAR_LINES: [number, number][] = [
	[0, 1],
	[0, 2],
	[1, 2],
	[0, 3],
	[0, 4]
];
const STAR_ACTIVE_SIZE = 64;
const HIT_SLOP = { top: 18, bottom: 18, left: 18, right: 18 };

const randomDotSizes = () => {
	const sizes: number[] = [9];
	for (let i = 1; i < 5; i++) {
		sizes.push(sizes[i - 1] + 2 + Math.round(Math.random()));
	}
	return sizes;
};

type StarProps = {
	page: LogoPageT;
	dotSize: number;
	position: { x: number; y: number };
	isActive: boolean;
	onPress: () => void;
};

const AnimatedStar = ({ page, dotSize, position, isActive, onPress }: StarProps) => {
	const rotateY = useSharedValue(isActive ? 0 : 90);
	const scale = useSharedValue(isActive ? 1 : 0);
	const opacity = useSharedValue(isActive ? 1 : 0);

	useEffect(() => {
		if (isActive) {
			rotateY.value = withTiming(0, { duration: 200 });
			scale.value = withTiming(1, { duration: 200 });
			opacity.value = withTiming(1, { duration: 100 });
		} else {
			rotateY.value = withTiming(90, { duration: 150 });
			scale.value = withTiming(0, { duration: 150 });
			opacity.value = withTiming(0, { duration: 80 });
		}
	}, [isActive]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ perspective: 600 }, { rotateY: `${rotateY.value}deg` }, { scale: scale.value }],
		opacity: opacity.value
	}));

	const size = STAR_ACTIVE_SIZE;

	return (
		<>
			<Pressable
				hitSlop={HIT_SLOP}
				style={{ position: 'absolute', left: position.x - dotSize / 2, top: position.y - dotSize / 2, zIndex: 6 }}
				onPress={onPress}
			>
				<ConstellationDot $color={page.tint} style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2 }} />
			</Pressable>
			<ConstellationStar style={[{ left: position.x - size / 2, top: position.y - size / 2 }, animatedStyle]}>
				<Pressable hitSlop={HIT_SLOP} onPress={onPress}>
					<SquircleMask link={page.source} size={size} />
				</Pressable>
			</ConstellationStar>
			{isActive && (
				<ConstellationGlow
					$color={page.tint}
					style={{ left: position.x - 40, top: position.y - 40, width: 80, height: 80 }}
				/>
			)}
		</>
	);
};

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

	// Icon picker state
	const dotSizes = useMemo(() => randomDotSizes(), []);
	const [appIcon, setAppIconLocal] = useState<string>(() => getAppIcon());

	useEffect(() => {
		const activeIcon = getAppIcon();
		if (activeIcon !== appIcon) {
			setAppIcon(appIcon === 'DEFAULT' ? null : (appIcon as 'enby' | 'trans' | 'lesbi' | 'pan'));
		}
	}, [appIcon]);

	const handleIconSelect = useCallback((key: string) => {
		setAppIconLocal(key);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	}, []);

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
			{/* Constellation */}
			<ConstellationWrap style={{ marginTop: 16 }}>
				{STAR_LINES.map(([a, b]) => {
					const ax = STAR_POSITIONS[a].x;
					const ay = STAR_POSITIONS[a].y;
					const bx = STAR_POSITIONS[b].x;
					const by = STAR_POSITIONS[b].y;
					const dx = bx - ax;
					const dy = by - ay;
					const len = Math.sqrt(dx * dx + dy * dy);
					const angle = Math.atan2(dy, dx) * (180 / Math.PI);
					return (
						<ConstellationLine
							key={`${a}-${b}`}
							style={{
								left: ax,
								top: ay,
								width: len,
								transformOrigin: '0 0',
								transform: [{ rotate: `${angle}deg` }]
							}}
						/>
					);
				})}
				{LOGO_PAGES.map((page, index) => (
					<AnimatedStar
						key={page.key}
						page={page}
						dotSize={dotSizes[index]}
						position={STAR_POSITIONS[index]}
						isActive={page.key === appIcon}
						onPress={() => handleIconSelect(page.key)}
					/>
				))}
			</ConstellationWrap>

			{/* Appearance */}
			<SectionWrap marginTop={42}>
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

			{/* Currencies */}
			<SectionWrap style={{ marginBottom: 0 }}>
				<SectionLabel style={{ marginBottom: 6 }}>{t('settings.currencies.header')}</SectionLabel>
			</SectionWrap>
			<SectionDivider style={{ marginBottom: 16 }} />

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

			{/* System */}
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
