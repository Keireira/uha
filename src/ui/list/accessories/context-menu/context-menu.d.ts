import type { NativeSyntheticEvent } from 'react-native';
import type { ContextMenuAction, ContextMenuOnPressNativeEvent } from 'react-native-context-menu-view';

export type AccessoryContextMenuT = {
	type: 'context-menu';
	trigger: string;
	onPress: (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => void;
	actions: ContextMenuAction[];
};
