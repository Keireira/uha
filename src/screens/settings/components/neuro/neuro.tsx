import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useAIAvailability } from '@lib/ai';
import { setSettingsValue, useSettingsValue, useAccent } from '@hooks';

import { H5, SmallText } from '@ui';
import { Switch } from 'react-native';
import Root, { Card, CardRow } from './neuro.styles';

import type { UserT } from '@models';

const Neuro = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const accentColor = useAccent();
	const isAISupported = useAIAvailability();
	const aiEnabled = useSettingsValue<UserT['ai_enabled']>('ai_enabled');

	return (
		<>
			<Root>
				<H5 $weight={600}>{t('settings.ai.status')}</H5>

				<SmallText $color={isAISupported ? theme.accents.green : theme.text.secondary}>
					{isAISupported ? t('settings.ai.supported') : t('settings.ai.not_supported')}
				</SmallText>
			</Root>

			{isAISupported && (
				<Card isInteractive>
					<CardRow onPress={() => setSettingsValue('ai_enabled', !aiEnabled)}>
						<H5 $weight={600}>{t('settings.ai.toggle')}</H5>

						<Switch
							value={aiEnabled}
							trackColor={{ true: accentColor }}
							onValueChange={(isAiEnabled) => setSettingsValue('ai_enabled', isAiEnabled)}
						/>
					</CardRow>
				</Card>
			)}
		</>
	);
};

export default Neuro;
