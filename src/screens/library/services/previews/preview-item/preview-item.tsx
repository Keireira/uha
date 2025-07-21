import React from 'react';

import logos from '@assets/logos';
import { SymbolView } from 'expo-symbols';
import SquircleMask from '@assets/masks/squircle.svg.tsx';
import Root, { Title, Gradient, Blurred } from './preview-item.styles';

import type { PropsT } from './preview-item.d';

const PreviewItem = ({ title, slug, color = '#333333' }: PropsT) => {
	const logoUrl = slug ? logos[slug as keyof typeof logos] : null;

	return (
		<Root $color={color}>
			<Gradient colors={[`${color}40`, `${color}60`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

			{logoUrl ? (
				<SquircleMask style={{ width: 48, height: 48 }} link={logoUrl} />
			) : (
				<Blurred>
					<SymbolView name="questionmark" size={24} tintColor={color} />
				</Blurred>
			)}

			<Title>{title}</Title>
		</Root>
	);
};

export default React.memo(PreviewItem);
