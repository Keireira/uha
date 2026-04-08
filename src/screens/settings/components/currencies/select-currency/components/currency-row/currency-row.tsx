import React from 'react';
import * as Haptics from 'expo-haptics';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSettingsValue, useAccent, setSettingsValue, useFeatureGate } from '@hooks';

import { Text } from '@ui';
import Root, { Code, Separator } from './currency-row.styles';

import type { Props } from './currency-row.d';
import type { SearchParamsT } from '../../select-currency.d';

const CurrencyRow = ({ code, name, isForbidden, isLast }: Props) => {
	const router = useRouter();
	const settingAccent = useAccent();
	const openFeatureGate = useFeatureGate();

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
				<Text $color={settingAccent} $weight={currentValue === code ? 600 : 400}>
					{name}
				</Text>

				<Code>{code}</Code>
			</Root>

			{!isLast && <Separator />}
		</>
	);
};

export default CurrencyRow;
