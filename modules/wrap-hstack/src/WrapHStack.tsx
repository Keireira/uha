import React from 'react';
import { requireNativeView } from 'expo';
import { type CommonViewModifierProps } from '@expo/ui/swift-ui';
import { createViewModifierEventListener } from '@expo/ui/swift-ui/modifiers';

export type WrapHStackProps = CommonViewModifierProps & {
	spacing?: number;
	lineSpacing?: number;
	columns?: number;
	children?: React.ReactNode;
};

const NativeWrapHStack = requireNativeView<WrapHStackProps>('WrapHStack', 'WrapHStackView');

export const WrapHStack = ({ modifiers, ...props }: WrapHStackProps) => {
	return (
		<NativeWrapHStack
			modifiers={modifiers}
			{...(modifiers ? createViewModifierEventListener(modifiers) : undefined)}
			{...props}
		/>
	);
};
