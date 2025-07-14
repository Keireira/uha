import React from 'react';

import { Trigger, TriggerText } from './plain-action.styles';

import type { AccessoryPlainActionMenuT } from './plain-action.d';

const PlainActionAccessory = ({ onPress, trigger }: AccessoryPlainActionMenuT) => {
	return (
		<Trigger onPress={onPress}>
			<TriggerText>{trigger}</TriggerText>
		</Trigger>
	);
};

export default PlainActionAccessory;
