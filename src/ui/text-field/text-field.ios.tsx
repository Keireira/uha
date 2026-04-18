import React from 'react';
import { useTheme } from 'styled-components/native';

import { Host, TextField as ExpoTextField } from '@expo/ui/swift-ui';
import { font, foregroundStyle, padding, multilineTextAlignment } from '@expo/ui/swift-ui/modifiers';

import type { Props } from './text-field.d';

const TextFieldIOS = ({
	color,
	fontSize = 17,
	align = 'leading',
	fontWeight = 'regular',
	modifiers = [],
	style,
	matchContents = true,
	...restProps
}: Props) => {
	const theme = useTheme();

	return (
		<Host matchContents={matchContents} style={style}>
			<ExpoTextField
				modifiers={[
					font({ family: 'Nunito', size: fontSize, weight: fontWeight }),
					foregroundStyle(color ?? theme.text.primary),
					padding({ all: 12 }),
					multilineTextAlignment(align),
					...modifiers
				]}
				{...restProps}
			/>
		</Host>
	);
};

export default TextFieldIOS;
