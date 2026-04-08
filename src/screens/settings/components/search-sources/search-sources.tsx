import React from 'react';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { codeToFlag } from '@lib';
import { PROVIDERS } from './data';
import * as Haptics from 'expo-haptics';
import { useSettingsValue, setSettingsValue, useAccent } from '@hooks';

import Root, {
	Dot,
	Separator,
	ProviderRow,
	ProviderInfo,
	ProviderName,
	StoreConfigRow,
	ConfigPill,
	ConfigPillText
} from './search-sources.styles';
import { Switch } from 'react-native';

import type { SourceT } from '@api/soup/soup.d';

const useStoreConfigs = () => {
	const playstoreLang = useSettingsValue<string>('playstore_lang');
	const appstoreCountry = useSettingsValue<string>('appstore_country');
	const playstoreCountry = useSettingsValue<string>('playstore_country');

	const storeConfigs: Record<string, { country: string; lang?: string }> = {
		appstore: { country: appstoreCountry },
		playstore: { country: playstoreCountry, lang: playstoreLang }
	};

	return storeConfigs;
};

const SearchSources = () => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();
	const accentColor = useAccent();

	const storeConfigs = useStoreConfigs();
	const enabledSources = useSettingsValue<SourceT[]>('search_sources');

	const toggleSource = (source: SourceT) => {
		const isEnabled = enabledSources.includes(source);
		const next = isEnabled ? enabledSources.filter((s) => s !== source) : [...enabledSources, source];

		if (next.length === 0) return;

		setSettingsValue('search_sources', next);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	const openPicker = (target: string) => {
		const pathname = target.startsWith('appstore')
			? '/(tabs)/settings/pick-a-store-apple'
			: '/(tabs)/settings/pick-a-store';

		router.push({
			pathname,
			params: { target }
		});
	};

	return (
		<Root>
			{PROVIDERS.map((provider, index) => {
				const color = theme.accents[provider.color_slug];
				const isEnabled = enabledSources.includes(provider.key);
				const isLast = index === PROVIDERS.length - 1;

				const cfg = provider.storeConfig ? storeConfigs[provider.key] : null;

				return (
					<React.Fragment key={provider.key}>
						<ProviderRow>
							<ProviderInfo>
								<Dot $color={color} />
								<ProviderName>{t(provider.labelKey)}</ProviderName>
							</ProviderInfo>

							<Switch
								value={isEnabled}
								trackColor={{ true: accentColor }}
								onValueChange={() => toggleSource(provider.key)}
							/>
						</ProviderRow>

						{provider.storeConfig && isEnabled && cfg && (
							<StoreConfigRow>
								<ConfigPill $color={color} onPress={() => openPicker(`${provider.key}_country`)}>
									<ConfigPillText $color={color}>
										{codeToFlag(cfg.country)}&nbsp;{t(`tokens.countries.${cfg.country}`)}
									</ConfigPillText>
								</ConfigPill>

								{provider.storeConfig === 'country+lang' && (
									<ConfigPill $color={color} onPress={() => openPicker(`${provider.key}_lang`)}>
										<ConfigPillText $color={color}>{t(`tokens.languages.${cfg.lang}`)}</ConfigPillText>
									</ConfigPill>
								)}
							</StoreConfigRow>
						)}

						{!isLast && <Separator />}
					</React.Fragment>
				);
			})}
		</Root>
	);
};

export default SearchSources;
