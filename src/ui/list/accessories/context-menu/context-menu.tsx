import React from 'react';

import ContextMenu from 'react-native-context-menu-view';
import { Trigger, TriggerText } from './context-menu.styles';

import type { AccessoryContextMenuT } from './context-menu.d';

const ContextMenuAccessory = ({ actions, trigger, onPress }: AccessoryContextMenuT) => {
	return (
		<ContextMenu dropdownMenuMode actions={actions} onPress={onPress} fontName="Nunito">
			<Trigger>
				<TriggerText>{trigger}</TriggerText>
			</Trigger>
		</ContextMenu>
	);
};

export default ContextMenuAccessory;
