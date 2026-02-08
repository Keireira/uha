import React from 'react';

import { LogoView } from '@ui';
import logos from '@assets/logos';
import Root, { LogoGlass, Title } from './preview-item.styles';

import type { PropsT } from './preview-item.d';

const PreviewItem = ({ title, slug, color = '#333333', onPress }: PropsT) => {
	const logoUrl = slug ? logos[slug as keyof typeof logos] : null;

	return (
		<Root onPress={onPress}>
			<LogoGlass tintColor={color}>
				<LogoView name={title} logoId={logoUrl} color={color} size={40} />
			</LogoGlass>

			<Title>{title}</Title>
		</Root>
	);
};

export default React.memo(PreviewItem);
