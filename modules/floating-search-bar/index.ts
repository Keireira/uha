import { requireNativeView } from 'expo';
import type { ViewProps } from 'react-native';

export type FloatingSearchBarProps = ViewProps & {
	value: string;
	tintColor?: string;
	placeholder?: string;
	onChangeText?: (event: { nativeEvent: { text: string } }) => void;
};

export default requireNativeView<FloatingSearchBarProps>('FloatingSearchBar');
