import React from 'react';

import { useParams } from '../../hooks';
import { useAccent, useFeatureGate } from '@hooks';

import Root, { Title, Code, Separator } from './currency-row.styles';

import type { Props } from './currency-row.d';

const CurrencyRow = ({ code, name, isForbidden, isLast }: Props) => {
	const settingAccent = useAccent();
	const openFeatureGate = useFeatureGate();

	const [currentValue, action] = useParams();

	const onSelectHd = () => {
		if (typeof action !== 'function') return;

		if (isForbidden) {
			openFeatureGate(() => action(code));
		} else {
			action(code);
		}
	};

	return (
		<>
			<Root onPress={onSelectHd}>
				<Title $accent={settingAccent} $isSelected={currentValue === code}>
					{name}
				</Title>

				<Code>{code}</Code>
			</Root>

			{!isLast && <Separator />}
		</>
	);
};

export default CurrencyRow;
