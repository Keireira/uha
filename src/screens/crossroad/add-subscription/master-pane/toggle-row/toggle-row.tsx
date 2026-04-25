import React from 'react';

import { font } from '@expo/ui/swift-ui/modifiers';
import { Host, Toggle, Text } from '@expo/ui/swift-ui';

import Root from './toggle-row.styles';

import type { Props } from './toggle-row.d';

const ToggleRow = ({ label, value, onChange, isLast = false }: Props) => (
	<Root $isLast={isLast}>
		<Host matchContents={{ vertical: true }}>
			<Toggle isOn={value} onIsOnChange={onChange}>
				<Text modifiers={[font({ size: 16, weight: 'medium' })]}>{label}</Text>
			</Toggle>
		</Host>
	</Root>
);

export default ToggleRow;
