import React from 'react';

import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useTipJar, useEntitlement } from '@hooks';

import {
	// NeuroSetting,
	SystemSetting,
	FooterSection,
	SupportSetting,
	DataSyncSection,
	CurrencyRefresh,
	FirstDaySetting,
	UnlimitedSetting,
	CurrenciesSetting,
	MaxHorizonSetting,
	ThemePickerSetting,
	AppLogoPickerSetting,
	AccentSpectrumSetting,
	SearchSourcesSetting
} from './components';
import Root, { SectionWrap, SectionLabel, SectionCard, SectionFooterText, Row } from './settings.styles';

const SettingsScreen = () => {
	const theme = useTheme();
	const { t } = useTranslation();

	const { isUnlimited } = useEntitlement();
	const { products: tipProducts } = useTipJar();
	const glassEffectStyle = !theme.is_oled && theme.tint === 'dark' ? 'regular' : 'clear';

	return (
		<Root>
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

			{/* Search Sources */}
			<SectionWrap>
				<SectionLabel>{t('settings.sources.header')}</SectionLabel>

				<SectionCard glassEffectStyle={glassEffectStyle}>
					<SearchSourcesSetting />
				</SectionCard>

				<SectionFooterText>{t('settings.sources.footer')}</SectionFooterText>
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

			{/*@TODO: Use it later, when I'll do AI here*/}
			{/* AI Features */}
			{/*<SectionWrap>
				<SectionLabel>{t('settings.ai.header')}</SectionLabel>

				<SectionCard glassEffectStyle={glassEffectStyle}>
					<NeuroSetting />
				</SectionCard>

				<SectionFooterText>{t('settings.ai.footer')}</SectionFooterText>
			</SectionWrap>*/}

			{/* Unlimited / Upgrade */}
			<SectionWrap>
				<UnlimitedSetting />
			</SectionWrap>

			{/* System */}
			<SectionWrap>
				<SectionLabel>{t('settings.general.header')}</SectionLabel>

				<Row>
					<SystemSetting />
				</Row>
			</SectionWrap>

			{/* Data sync & backups */}
			<SectionWrap>
				<SectionLabel>{t('settings.data.header')}</SectionLabel>

				<DataSyncSection />

				<SectionFooterText>{t('settings.data.data_footer')}</SectionFooterText>
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
		</Root>
	);
};

export default SettingsScreen;
