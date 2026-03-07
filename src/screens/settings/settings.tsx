import React from 'react';
import { Linking } from 'react-native';

import i18n from '@src/i18n';
import { openSettings } from 'expo-linking';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotifications } from './hooks';
import { useScrollDirection, useEntitlement } from '@hooks';
import Toast from 'react-native-toast-message';
import { shareBackup, restoreFromBackup } from '@lib/backup';
import { exportAllCSV, importAllCSV } from '@lib/backup/csv-export';
import useTipJar from '@hooks/use-tip-jar';

import { requestNotifications, RESULTS } from 'react-native-permissions';
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application';

import {
	NeuroSetting,
	CurrencyRefresh,
	FirstDaySetting,
	UnlimitedSetting,
	CurrenciesSetting,
	MaxHorizonSetting,
	ThemePickerSetting,
	AppLogoPickerSetting,
	AccentSpectrumSetting
} from './components';
import { SymbolView } from 'expo-symbols';
import {
	Container,
	SectionWrap,
	SectionLabel,
	SectionCard,
	SectionFooterText,
	Row,
	TileGrid,
	NavTile,
	NavTileInner,
	NavTileTitle,
	NavTileValue,
	Card,
	CardRow,
	CardRowTitle,
	CardRowValue,
	SupportRow,
	SupportPill,
	SupportPillInner,
	SupportPillTitle,
	SupportPillSub,
	Separator,
	FooterWrap,
	FooterLinks,
	FooterPill,
	FooterPillInner,
	FooterPillText,
	FooterVersion
} from './settings.styles';

const SettingsScreen = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
	const handleScroll = useScrollDirection();

	const { isUnlimited } = useEntitlement();
	const notificationStatus = useNotifications();
	const { products: tipProducts, purchasing: tipPurchasing, purchaseTip } = useTipJar();

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
			<AppLogoPickerSetting />

			{/* Appearance */}
			<SectionWrap style={{ marginTop: 42 }}>
				<SectionLabel>{t('settings.appearance.header')}</SectionLabel>

				<SectionCard>
					<ThemePickerSetting />

					<AccentSpectrumSetting />
				</SectionCard>
			</SectionWrap>

			{/* Currencies */}
			<SectionWrap>
				<SectionLabel>{t('settings.currencies.header')}</SectionLabel>

				<SectionCard>
					<Row>
						<CurrenciesSetting />
					</Row>

					<CurrencyRefresh />
				</SectionCard>
			</SectionWrap>

			{/* Preferences */}
			<SectionWrap>
				<SectionLabel>{t('settings.preferences.header')}</SectionLabel>

				<SectionCard>
					<Row>
						<FirstDaySetting />

						<MaxHorizonSetting />
					</Row>
				</SectionCard>
			</SectionWrap>

			{/* AI Features */}
			<SectionWrap>
				<SectionLabel>{t('settings.ai.header')}</SectionLabel>

				<SectionCard>
					<NeuroSetting />
				</SectionCard>

				<SectionFooterText>{t('settings.ai.footer')}</SectionFooterText>
			</SectionWrap>

			{/* Unlimited / Upgrade */}
			<SectionWrap>
				<UnlimitedSetting />
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
			{tipProducts.length > 0 && (
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
