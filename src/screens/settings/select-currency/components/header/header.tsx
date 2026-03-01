import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { CircleButton, InlineTitleIOS } from '@ui';
import Root, { HeaderRow, Title } from './header.styles';

type SearchParamsT = {
	target: 'default_currency_code' | 'recalc_currency_code';
};

const Header = () => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();
	const { target } = useLocalSearchParams<SearchParamsT>();

	const confirm = () => {
		router.back();
	};

	return (
		<Root intensity={25} tint={theme.tint}>
			<HeaderRow>
				<Title>
					<InlineTitleIOS>{t(`settings.currencies.${target}`)}</InlineTitleIOS>
				</Title>

				<CircleButton
					size={42}
					onPress={confirm}
					systemImage="checkmark"
					glassTint={theme.accent.orange}
					symbolColor={theme.static.white}
				/>
			</HeaderRow>
		</Root>
	);
};

export default Header;
