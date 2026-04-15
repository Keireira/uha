import React, { useState } from 'react';
import { useTheme } from 'styled-components/native';

import { useInitials } from '@hooks';

import { H3 } from '../typography';
import { SymbolView } from 'expo-symbols';
import SquircleMask from '@assets/masks/squircle.svg.tsx';
import Root, { Emoji } from './logo-view.styles';

import type { Props, FallbackProps } from './logo-view.d';

const getLink = (url?: string | null, slug?: string | null) => {
	if (url) {
		return url;
	}

	if (slug) {
		return `https://s3.uha.app/logos/${slug}.webp`;
	}

	return;
};

const Fallback = ({ symbolName, emoji, initials, size, color }: FallbackProps) => {
	if (symbolName) {
		return <SymbolView name={symbolName} size={Math.round(size / 2)} tintColor={color ?? undefined} />;
	}

	if (initials) {
		return <H3 $align="center">{initials}</H3>;
	}

	if (emoji) {
		return <Emoji $align="center">{emoji}</Emoji>;
	}

	return <SymbolView name="questionmark" size={Math.round(size / 2)} tintColor={color ?? undefined} />;
};

const LogoView = ({ emoji, symbolName, assetId, slug, url, name, color, size = 48, children }: Props) => {
	const theme = useTheme();
	const initials = useInitials(name);
	const [imgFailed, setImgFailed] = useState(false);

	const link = getLink(url, slug);
	const showRemote = (link || assetId) && !imgFailed;

	const content = showRemote ? (
		<SquircleMask
			size={size}
			color={color ?? undefined}
			link={link}
			assetId={assetId}
			onError={() => setImgFailed(true)}
		/>
	) : (
		<Fallback symbolName={symbolName} emoji={emoji} initials={initials} size={size} color={color} />
	);

	return (
		<SquircleMask size={size}>
			<Root $color={color ?? theme.surface.default}>{content}</Root>

			{children}
		</SquircleMask>
	);
};

export default LogoView;
