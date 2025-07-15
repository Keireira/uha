import React, { useState } from 'react';

import { Switch, Platform } from 'react-native';
import Root from './switch.styles';

import type { AccessorySwitchT } from './switch.d';

const SwitchAccessory = ({ value, disabled, onPress }: AccessorySwitchT) => {
	const [version] = useState(() => {
		return Number.parseInt(`${Platform.Version}`, 10);
	});

	return (
		<Root $isOldIOS={Platform.OS === 'ios' && version < 26}>
			<Switch value={value} onValueChange={onPress} disabled={disabled} />
		</Root>
	);
};

export default SwitchAccessory;
