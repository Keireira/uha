import React from 'react';
import * as Haptics from 'expo-haptics';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSettingsValue, setSettingsValue, useFeatureGate, useAccent } from '@hooks';

import { Text } from '@ui';
import Root, { Code, Separator } from './option-row.styles';

import type { Props } from './option-row.d';
import type { SearchParamsT } from '../../select-store-option.d';

const OptionRow = ({ code, name, subtitle, isLast, isForbidden }: Props) => {
	const router = useRouter();
	const settingAccent = useAccent();
	const openFeatureGate = useFeatureGate();

	const { target } = useLocalSearchParams<SearchParamsT>();
	const currentValue = useSettingsValue<string>(target);

	const onSelect = () => {
		if (!target) return;

		const action = () => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			console.log('next:', target, code);
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
			<Root onPress={onSelect}>
				<Text $color={settingAccent} $weight={currentValue === code ? 600 : 400}>
					{name}
				</Text>

				{subtitle && <Code>{subtitle}</Code>}
			</Root>

			{!isLast && <Separator />}
		</>
	);
};

export default OptionRow;
