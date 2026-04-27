import React from 'react';
import * as Haptics from 'expo-haptics';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSettingsValue, setSettingsValue, useAccent } from '@hooks';

import Root, { Title, Code, Separator } from './option-row.styles';

import type { Props } from './option-row.d';
import type { SearchParamsT } from '../../select-store-option.d';

const OptionRow = ({ code, name, subtitle, isLast }: Props) => {
	const router = useRouter();
	const settingAccent = useAccent();

	const { target } = useLocalSearchParams<SearchParamsT>();
	const currentValue = useSettingsValue<string>(target);

	const onSelect = () => {
		if (!target) return;

		const action = () => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			setSettingsValue(target, code);
			router.back();
		};

		action();
	};

	return (
		<>
			<Root onPress={onSelect}>
				<Title $accent={settingAccent} $isSelected={currentValue === code}>
					{name}
				</Title>

				{subtitle && <Code>{subtitle}</Code>}
			</Root>

			{!isLast && <Separator />}
		</>
	);
};

export default OptionRow;
