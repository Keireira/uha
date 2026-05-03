import React from 'react';
import { useTheme } from 'styled-components/native';

import { withAlpha } from '@lib/colors';
import useToastMeta from './use-toast-meta';

import {
	font,
	frame,
	shadow,
	padding,
	background,
	clipShape,
	glassEffect,
	lineLimit,
	foregroundStyle
} from '@expo/ui/swift-ui/modifiers';
import { Host, HStack, VStack, ZStack, Text, Image, Circle, Capsule } from '@expo/ui/swift-ui';

import type { ToastKindT } from './toast.d';
import type { BaseToastProps } from 'react-native-toast-message';

const ToastBody = ({ text1, text2, kind }: BaseToastProps & { kind: ToastKindT }) => {
	const theme = useTheme();
	const toast = useToastMeta(kind);

	return (
		<Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch', marginHorizontal: 16 }}>
			<HStack
				alignment="center"
				spacing={14}
				modifiers={[
					frame({ minHeight: 60, alignment: 'leading' }),
					padding({ vertical: 12, horizontal: 16 }),
					glassEffect({
						glass: {
							variant: 'regular',
							interactive: true,
							tint: withAlpha(theme.surface.navbar, 0.6)
						},
						shape: 'roundedRectangle',
						cornerRadius: 22
					}),
					shadow({ color: withAlpha(theme.shadow.default, 0.2), radius: 18, y: 10 })
				]}
			>
				<ZStack modifiers={[frame({ width: 34, height: 34 })]}>
					<Circle modifiers={[foregroundStyle(withAlpha(toast.tintColor, 0.18))]} />
					<Image systemName={toast.icon} size={18} color={toast.tintColor} />
				</ZStack>

				<VStack alignment="leading" spacing={4} modifiers={[frame({ maxWidth: 999, alignment: 'leading' })]}>
					{text1 ? (
						<Text
							modifiers={[
								font({ design: 'rounded', size: 15, weight: 'semibold' }),
								foregroundStyle(theme.text.primary),
								lineLimit(2, { reservesSpace: false })
							]}
						>
							{text1}
						</Text>
					) : null}

					{text2 ? (
						<Text
							modifiers={[
								font({ design: 'rounded', size: 13, weight: 'regular' }),
								foregroundStyle(theme.text.secondary),
								lineLimit(2, { reservesSpace: false })
							]}
						>
							{text2}
						</Text>
					) : null}
				</VStack>

				<Capsule modifiers={[frame({ width: 3, height: 24 }), background(toast.tintColor), clipShape('capsule')]} />
			</HStack>
		</Host>
	);
};

export default ToastBody;
