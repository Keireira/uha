import React from 'react';

import { Switch } from 'react-native';

import type { AccessorySwitchT } from './switch.d';

const SwitchAccessory = ({ value, onPress, disabled = false }: AccessorySwitchT) => {
	return <Switch value={value} onValueChange={onPress} disabled={disabled} />;
};

export default SwitchAccessory;
