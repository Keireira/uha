import React from 'react';
import Svg, { Path, G, Image, Defs, ClipPath } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';

import type { SvgProps } from 'react-native-svg';

type Props = SvgProps & {
	link?: string | number;
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

const SvgComponent = ({ children, size, link, ...restProps }: Props) => {
	if (link) {
		return (
			<Svg viewBox="0 0 1 1" style={{ width: size, height: size }} {...restProps}>
				<Defs>
					<ClipPath id="squircle">
						<Path d={MASK} />
					</ClipPath>
				</Defs>

				<G width="100%" height="100%" clipPath="url(#squircle)">
					<Image x="0" y="0" width="100%" height="100%" href={link} />
				</G>
			</Svg>
		);
	}

	return (
		<MaskedView
			style={{ width: size, height: size }}
			maskElement={
				<Svg viewBox="0 0 1 1" style={{ width: size, height: size }} {...restProps}>
					<Path d={MASK} />
				</Svg>
			}
		>
			{children}
		</MaskedView>
	);
};

export default SvgComponent;
