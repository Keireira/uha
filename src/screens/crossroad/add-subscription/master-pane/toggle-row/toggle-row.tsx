import React from 'react';

import { Host, Toggle } from '@expo/ui/swift-ui';
import Root, { Label } from './toggle-row.styles';

import type { Props } from './toggle-row.d';

const ToggleRow = ({ label, value, onChange, isLast = false }: Props) => (
	<Root $isLast={isLast} onPress={() => onChange(!value)}>
		<Label>{label}</Label>

		<Host matchContents>
			<Toggle isOn={value} onIsOnChange={onChange} />
		</Host>
	</Root>
);

export default ToggleRow;
