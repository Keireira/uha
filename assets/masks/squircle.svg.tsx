import React from 'react';
import Svg, { Defs, Path, G, ClipPath, Image } from 'react-native-svg';

import type { SvgProps } from 'react-native-svg';

const SvgComponent = (props: SvgProps & { link: string }) => (
	<Svg viewBox="0 0 1 1" {...props}>
		<Defs>
			<ClipPath id="squircle">
				<Path d="M 0,0.5 C 0,0.1725  0.1725,0  0.5,0 0.8275,0  1,0.1725  1,0.5 1,0.8275  0.8275,1  0.5,1 0.1725,1  0,0.8275  0,0.5" />
			</ClipPath>
		</Defs>

		<G x="0" y="0" width="100%" height="100%" clipPath="url(#squircle)">
			<Image x="0" y="0" width="100%" height="100%" href={props.link} />
		</G>
	</Svg>
);
export default SvgComponent;
