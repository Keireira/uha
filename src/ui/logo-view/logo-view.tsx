import React, { useMemo } from 'react';

import { useInitials } from '@hooks';

import { H3 } from '../typography';
import { SymbolView } from 'expo-symbols';
import SquircleMask from '@assets/masks/squircle.svg.tsx';
import Root, { Emoji, BlurView } from './logo-view.styles';

import type { Props } from './logo-view.d';

const renderSwitch = (emoji: Props['emoji'], initials: string, size: Props['size'], color: Props['color']) => {
	switch (true) {
		case Boolean(emoji):
			return <Emoji>{emoji}</Emoji>;
		case Boolean(initials):
			return <H3>{initials}</H3>;
		default:
			return <SymbolView name="questionmark" size={size ? Math.round(size / 2) : 24} tintColor={color} />;
	}
};

const useLogo = ({ logoId, logoUrl, emoji, name, color, size = 48 }: Props) => {
	const initials = useInitials(name);

	const Component = useMemo(() => {
		if (logoId || logoUrl) {
			return <SquircleMask size={size} color={color} link={(logoId || logoUrl)!} />;
		}

		return (
			<BlurView intensity={25} tint="prominent">
				{renderSwitch(emoji, initials, size, color)}
			</BlurView>
		);
	}, [emoji, logoId, initials, size, color, logoUrl]);

	return Component;
};

const LogoView = (props: Props) => {
	const logoContent = useLogo(props);

	return (
		<SquircleMask size={props.size || 48}>
			<Root $color={props.color || '#ffffff'}>{logoContent}</Root>
		</SquircleMask>
	);
};

export default LogoView;
