import React, { useMemo } from 'react';

import { useInitials } from '@hooks';
import { useTheme } from 'styled-components/native';

import { H3 } from '../typography';
import { SymbolView } from 'expo-symbols';
import SquircleMask from '@assets/masks/squircle.svg.tsx';
import Root, { Emoji } from './logo-view.styles';

import type { Props } from './logo-view.d';

const renderSwitch = (emoji: Props['emoji'], initials: string, size: Props['size'], color: Props['color']) => {
	switch (true) {
		case Boolean(emoji):
			return <Emoji $align="center">{emoji}</Emoji>;
		case Boolean(initials):
			return <H3 $align="center">{initials}</H3>;
		default:
			return <SymbolView name="questionmark" size={size ? Math.round(size / 2) : 24} tintColor={color} />;
	}
};

const useLogo = ({ slug, emoji, name, color, size = 48 }: Props) => {
	const initials = useInitials(name);

	const Component = useMemo(() => {
		if (slug) {
			const link = `https://s3.uha.app/logos/${slug}.webp`;

			return <SquircleMask size={size} color={color} link={link} />;
		}

		return renderSwitch(emoji, initials, size, color);
	}, [emoji, slug, initials, size, color]);

	return Component;
};

const LogoView = (props: Props) => {
	const theme = useTheme();
	const logoContent = useLogo(props);

	return (
		<SquircleMask size={props.size || 48}>
			<Root $color={props.color || theme.surface.default}>{logoContent}</Root>
			{props.children && props.children}
		</SquircleMask>
	);
};

export default LogoView;
