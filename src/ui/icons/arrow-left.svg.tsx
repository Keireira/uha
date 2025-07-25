import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { SvgProps } from 'react-native-svg';

const SvgComponent = ({ width = 24, height = 24, ...props }: SvgProps) => (
	<Svg width={width} height={height} fill="none" viewBox="0 0 24 24" {...props}>
		<Path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeMiterlimit={10}
			strokeWidth={1.5}
			d="M15 19.92 8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"
		/>
	</Svg>
);

export default SvgComponent;
