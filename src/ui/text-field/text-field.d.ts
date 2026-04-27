import type { Ref } from 'react';
import type { HostProps, TextFieldProps as ExpoTextFieldProps, TextFieldRef } from '@expo/ui/swift-ui';
import type { ViewStyle } from 'react-native';

export type { TextFieldRef };

export type Props = Omit<ExpoTextFieldProps, 'modifiers'> & {
	ref?: Ref<TextFieldRef>;
	/** Optional hex color for the text. Maps to SwiftUI `foregroundStyle`. */
	color?: string;
	/** Font size in points. @default 17 */
	fontSize?: number;
	/** Font weight. @default 'regular' */
	fontWeight?: 'ultraLight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black';
	/** Text alignment. @default 'leading' */
	align?: 'center' | 'leading' | 'trailing';
	/** Extra modifiers appended to the base modifier chain. */
	modifiers?: ExpoTextFieldProps['modifiers'];
	/** Style for the outer `Host`. */
	style?: ViewStyle;
	/**
	 * Controls how the host measures its size.
	 * Pass `{ vertical: true }` to let the field stretch horizontally (e.g. inside a flex row).
	 * @default true
	 */
	matchContents?: HostProps['matchContents'];
};
