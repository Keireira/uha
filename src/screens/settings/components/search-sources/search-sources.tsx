import React from 'react';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { codeToFlag } from '@lib';
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
	ConfigPillText,
	DescRow,
	DescText
} from './search-sources.styles';
import { Switch } from 'react-native';

import type { SourceT } from '@api/soup/soup.d';
import type { ProviderMeta } from './search-sources.d';

export const PROVIDERS: ProviderMeta[] = [
	{
		key: 'inhouse',
		color_slug: 'pink',
		labelKey: 'settings.sources.inhouse',
		subtitleKey: 'settings.sources.inhouse_desc'
	},
	{
		key: 'appstore',
		color_slug: 'blue',
		labelKey: 'settings.sources.appstore',
		storeConfig: 'country'
	},
	{
		key: 'playstore',
		color_slug: 'green',
		labelKey: 'settings.sources.playstore',
		storeConfig: 'country+lang'
	},
	{
		key: 'web',
		color_slug: 'orange',
		labelKey: 'settings.sources.web',
		subtitleKey: 'settings.sources.web_desc'
	},
	{
		key: 'brandfetch',
		color_slug: 'purple',
		labelKey: 'settings.sources.brandfetch'
	},
	{
		key: 'logo.dev',
		color_slug: 'mint',
		labelKey: 'settings.sources.logo_dev'
	}
];

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

		if (!next.length) {
			return;
		}

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
				const subtitle = provider.subtitleKey ? t(provider.subtitleKey) : null;

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

						{subtitle && (
							<DescRow>
								<DescText>{subtitle}</DescText>
							</DescRow>
						)}

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
