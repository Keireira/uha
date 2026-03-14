import React, { useCallback } from 'react';

import { LogoView } from '@ui';
import logos from '@assets/logos';
import Root, { LogoGlass, Title } from './preview-item.styles';

import type { PropsT } from './preview-item.d';

const PreviewItem = ({ id, title, slug, color = '#333333', onPress }: PropsT) => {
	const logoUrl = slug ? logos[slug as keyof typeof logos] : null;

	const handlePress = useCallback(() => {
		onPress?.(id);
	}, [id, onPress]);

	return (
		<Root onPress={handlePress}>
			<LogoGlass>
				<LogoView name={title} logoId={logoUrl} color={color} size={44} />
			</LogoGlass>

			<Title>{title}</Title>
		</Root>
	);
};

export default React.memo(PreviewItem);
