import React from 'react';
import { useRouter } from 'expo-router';
import { useSettingsValue } from '@hooks';
import { useTranslation } from 'react-i18next';

import Root, { Inner, Label, Code, Subtitle } from './currencies.styles';

const Currencies = () => {
	const router = useRouter();
	const { t } = useTranslation();
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');
	const defaultCurrencyCode = useSettingsValue<string>('default_currency_code');

	const openCurrencyPicker = (target: string) => {
		router.push({
			pathname: '/(tabs)/settings/select-currency',
			params: { target }
		});
	};

	return (
		<>
			<Root isInteractive>
				<Inner onPress={() => openCurrencyPicker('default_currency_code')}>
					<Label numberOfLines={1}>{t('settings.currencies.default_currency_code')}</Label>
					<Code numberOfLines={1}>{defaultCurrencyCode}</Code>

					<Subtitle numberOfLines={1}>{t(`currencies.${defaultCurrencyCode}`)}</Subtitle>
				</Inner>
			</Root>

			<Root isInteractive>
				<Inner onPress={() => openCurrencyPicker('recalc_currency_code')}>
					<Label numberOfLines={1}>{t('settings.currencies.recalc_currency_code')}</Label>
					<Code numberOfLines={1}>{recalcCurrencyCode}</Code>

					<Subtitle numberOfLines={1}>{t(`currencies.${recalcCurrencyCode}`)}</Subtitle>
				</Inner>
			</Root>
		</>
	);
};

export default Currencies;
