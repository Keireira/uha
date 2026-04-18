import React from 'react';
import { useRouter } from 'expo-router';
import { useSettingsValue } from '@hooks';
import { useTranslation } from 'react-i18next';

import Root, { Inner, Label, Code, Subtitle } from './currencies.styles';

const Currencies = () => {
	const router = useRouter();
	const { t } = useTranslation();
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency');
	const defaultCurrencyCode = useSettingsValue<string>('default_currency');

	const openDefaultPicker = () => {
		router.push({
			pathname: `/(pickers)/select-currency`,
			params: {
				target: 'settings_default_currency'
			}
		});
	};

	const openRecalcPicker = () => {
		router.push({
			pathname: `/(pickers)/select-currency`,
			params: {
				target: 'settings_recalc_currency'
			}
		});
	};

	return (
		<>
			<Root isInteractive>
				<Inner onPress={openDefaultPicker}>
					<Label numberOfLines={1}>{t('settings.currencies.default_currency')}</Label>
					<Code numberOfLines={1}>{defaultCurrencyCode}</Code>

					<Subtitle numberOfLines={1}>{t(`tokens.currencies.${defaultCurrencyCode}`)}</Subtitle>
				</Inner>
			</Root>

			<Root isInteractive>
				<Inner onPress={openRecalcPicker}>
					<Label numberOfLines={1}>{t('settings.currencies.recalc_currency')}</Label>
					<Code numberOfLines={1}>{recalcCurrencyCode}</Code>

					<Subtitle numberOfLines={1}>{t(`tokens.currencies.${recalcCurrencyCode}`)}</Subtitle>
				</Inner>
			</Root>
		</>
	);
};

export default Currencies;
