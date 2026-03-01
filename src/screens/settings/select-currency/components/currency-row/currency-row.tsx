import React from 'react';
import * as Haptics from 'expo-haptics';

import { setSettingsValue, useSettingsValue } from '@hooks';
import { useRouter, useLocalSearchParams } from 'expo-router';

import Root, { Title, Code, Separator } from './currency-row.styles';

import type { Props } from './currency-row.d';
import type { SearchParamsT } from '../../select-currency.d';

const CurrencyRow = ({ code, name, isLast }: Props) => {
	const router = useRouter();
	const { target } = useLocalSearchParams<SearchParamsT>();
	const currentValue = useSettingsValue<string>(target);

	const onSelectHd = () => {
		if (!target) return;

		setSettingsValue(target, code);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.back();
	};

	return (
		<>
			<Root onPress={onSelectHd}>
				<Title $isSelected={currentValue === code}>{name}</Title>
				<Code>{code}</Code>
			</Root>

			{!isLast && <Separator />}
		</>
	);
};

export default CurrencyRow;
