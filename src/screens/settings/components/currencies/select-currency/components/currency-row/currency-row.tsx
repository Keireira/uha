import React from 'react';
import * as Haptics from 'expo-haptics';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSettingsValue, setSettingsValue, useFeatureGate } from '@hooks';

import Root, { Title, Code, Separator } from './currency-row.styles';

import type { AccentT } from '@themes';
import type { Props } from './currency-row.d';
import type { SearchParamsT } from '../../select-currency.d';

const CurrencyRow = ({ code, name, isForbidden, isLast }: Props) => {
	const router = useRouter();
	const openFeatureGate = useFeatureGate();
	const settingAccent = useSettingsValue<AccentT>('accent');
	const { target } = useLocalSearchParams<SearchParamsT>();
	const currentValue = useSettingsValue<string>(target);

	const onSelectHd = () => {
		if (!target) return;

		const action = () => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			setSettingsValue(target, code);
			router.back();
		};

		if (isForbidden) {
			openFeatureGate(action);
		} else {
			action();
		}
	};

	return (
		<>
			<Root onPress={onSelectHd}>
				<Title $settingAccent={settingAccent} $isSelected={currentValue === code}>
					{name}
				</Title>
				<Code>{code}</Code>
			</Root>

			{!isLast && <Separator />}
		</>
	);
};

export default CurrencyRow;
