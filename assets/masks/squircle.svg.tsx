import React from 'react';
import Svg, { Path } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import { Image } from 'expo-image';

import type { SvgProps } from 'react-native-svg';

type Props = SvgProps & {
	link?: string;
	assetId?: number;
	size: number;
	color?: string;
};

const MASK = `
	M 0,0.5 C 0,0.1725
	0.1725,0
	0.5,0 0.8275,0
	1,0.1725
	1,0.5 1,0.8275
	0.8275,1
	0.5,1 0.1725,1
	0,0.8275
	0,0.5
`;

const SvgComponent = ({ children, size, link, assetId, ...restProps }: Props) => {
	return (
		<MaskedView
			style={{ width: size, height: size }}
			maskElement={
				<Svg viewBox="0 0 1 1" style={{ width: size, height: size }} {...restProps}>
					<Path d={MASK} fill="black" />
				</Svg>
			}
		>
			{link ? <Image source={link} style={{ width: size, height: size }} cachePolicy="disk" /> : null}
			{assetId ? <Image source={assetId} style={{ width: size, height: size }} /> : null}
			{!link && !assetId && children}
		</MaskedView>
	);
};

export default SvgComponent;
