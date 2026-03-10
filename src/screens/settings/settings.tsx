import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTipJar, useEntitlement, useScrollDirection } from '@hooks';
import Toast from 'react-native-toast-message';
import { shareBackup, restoreFromBackup } from '@lib/backup';
import { exportAllCSV, importAllCSV } from '@lib/backup/csv-export';

import {
	NeuroSetting,
	CurrencyRefresh,
	FirstDaySetting,
	UnlimitedSetting,
	CurrenciesSetting,
	MaxHorizonSetting,
	ThemePickerSetting,
	AppLogoPickerSetting,
	AccentSpectrumSetting,
	SystemSetting,
	SupportSetting,
	FooterSection
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
	Card,
	CardRow,
	CardRowTitle,
	CardRowValue,
	Separator
} from './settings.styles';

const SettingsScreen = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
	const handleScroll = useScrollDirection();

	const { isUnlimited } = useEntitlement();
	const { products: tipProducts } = useTipJar();
	const glassEffectStyle = !theme.is_oled && theme.tint === 'dark' ? 'regular' : 'clear';

	return (
		<Container
			contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 48 }}
			onScroll={handleScroll}
		>
			<AppLogoPickerSetting />

			{/* Appearance */}
			<SectionWrap style={{ marginTop: 42 }}>
				<SectionLabel>{t('settings.appearance.header')}</SectionLabel>

				<SectionCard glassEffectStyle={glassEffectStyle}>
					<ThemePickerSetting />

					<AccentSpectrumSetting />
				</SectionCard>
			</SectionWrap>

			{/* Currencies */}
			<SectionWrap>
				<SectionLabel>{t('settings.currencies.header')}</SectionLabel>

				<SectionCard glassEffectStyle={glassEffectStyle}>
					<Row>
						<CurrenciesSetting />
					</Row>

					<CurrencyRefresh />
				</SectionCard>
			</SectionWrap>

			{/* Preferences */}
			<SectionWrap>
				<SectionLabel>{t('settings.preferences.header')}</SectionLabel>

				<SectionCard glassEffectStyle={glassEffectStyle}>
					<Row>
						<FirstDaySetting />

						<MaxHorizonSetting />
					</Row>
				</SectionCard>
			</SectionWrap>

			{/* AI Features */}
			<SectionWrap>
				<SectionLabel>{t('settings.ai.header')}</SectionLabel>

				<SectionCard glassEffectStyle={glassEffectStyle}>
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

				<SectionCard glassEffectStyle={glassEffectStyle}>
					<Row>
						<SystemSetting />
					</Row>
				</SectionCard>
			</SectionWrap>

			{/* Data sync & backups */}
			<SectionWrap>
				<SectionLabel>{t('settings.data.header')}</SectionLabel>
				<SectionCard glassEffectStyle={glassEffectStyle}>
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
				<SectionLabel>
					{isUnlimited && tipProducts.length > 0 ? t('settings.tip_jar.header') : t('settings.donations.header')}
				</SectionLabel>

				<SupportSetting />

				<SectionFooterText>{t('settings.donations.description')}</SectionFooterText>
			</SectionWrap>

			{/* Footer — about */}
			<FooterSection />
		</Container>
	);
};

export default SettingsScreen;
