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
			d="M19.32 10H4.69c-1.48 0-2.68-1.21-2.68-2.68V4.69c0-1.48 1.21-2.68 2.68-2.68h14.63C20.8 2.01 22 3.22 22 4.69v2.63C22 8.79 20.79 10 19.32 10ZM19.32 22H4.69c-1.48 0-2.68-1.21-2.68-2.68v-2.63c0-1.48 1.21-2.68 2.68-2.68h14.63c1.48 0 2.68 1.21 2.68 2.68v2.63c0 1.47-1.21 2.68-2.68 2.68ZM6 5v2M10 5v2M6 17v2M10 17v2M14 6h4M14 18h4"
		/>
	</Svg>
);

export default SvgComponent;
