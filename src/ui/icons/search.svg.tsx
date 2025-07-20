import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { SvgProps } from 'react-native-svg';

const SvgComponent = ({ width = 24, height = 24, ...props }: SvgProps) => (
	<Svg width={width} height={height} fill="none" viewBox="0 0 24 24" {...props}>
		<Path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.5}
			d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2"
		/>
	</Svg>
);

export default SvgComponent;
