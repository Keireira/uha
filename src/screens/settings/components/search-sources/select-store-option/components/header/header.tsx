import React from 'react';
import { useSettingsValue } from '@hooks';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { CircleButton, InlineTitleIOS } from '@ui';
import Root, { HeaderRow, Title } from './header.styles';

import type { AccentT } from '@themes';
import type { SearchParamsT } from '../../select-store-option.d';

const TITLE_MAP: Record<string, string> = {
	appstore_country: 'settings.sources.appstore',
	appstore_lang: 'settings.sources.appstore',
	playstore_country: 'settings.sources.playstore',
	playstore_lang: 'settings.sources.playstore'
};

const Header = () => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();
	const { target } = useLocalSearchParams<SearchParamsT>();
	const settingAccent = useSettingsValue<AccentT>('accent');

	const titleKey = TITLE_MAP[target] ?? 'settings.sources.appstore';

	return (
		<Root intensity={25} tint={theme.tint}>
			<HeaderRow>
				<Title>
					<InlineTitleIOS>{t(titleKey)}</InlineTitleIOS>
				</Title>

				<CircleButton
					size={42}
					onPress={() => router.back()}
					systemImage="checkmark"
					symbolColor={theme.static.white}
					glassTint={theme.accents[settingAccent]}
				/>
			</HeaderRow>
		</Root>
	);
};

export default Header;
