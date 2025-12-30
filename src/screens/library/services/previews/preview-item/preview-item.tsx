import React from 'react';

import { LogoView } from '@ui';
import logos from '@assets/logos';
import Root, { Title, Gradient } from './preview-item.styles';

import type { PropsT } from './preview-item.d';

const PreviewItem = ({ title, slug, color = '#333333' }: PropsT) => {
	const logoUrl = slug ? logos[slug as keyof typeof logos] : null;

	return (
		<Root $color={color}>
			<Gradient colors={[`${color}40`, `${color}60`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

			<LogoView name={title} logoId={logoUrl} color={color} size={48} />

			<Title>{title}</Title>
		</Root>
	);
};

export default React.memo(PreviewItem);
