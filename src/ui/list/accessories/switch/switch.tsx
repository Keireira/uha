import React from 'react';

import { Switch } from 'react-native';
import Root from './switch.styles';

import type { AccessorySwitchT } from './switch.d';

const SwitchAccessory = ({ value, disabled, onPress }: AccessorySwitchT) => {
	return (
		<Root>
			<Switch value={value} onValueChange={onPress} hitSlop={20} disabled={disabled} />
		</Root>
	);
};

export default SwitchAccessory;
