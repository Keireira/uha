import React from 'react';
import Svg, { Defs, Path, Mask } from 'react-native-svg';

import type { SvgProps } from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
	<Svg viewBox="0 0 1 1" {...props}>
		<Defs>
			<Mask id="squircle" maskUnits="objectBoundingBox">
				<Path d="M0 .5C0 .172.172 0 .5 0s.5.172.5.5-.172.5-.5.5S0 .828 0 .5" />
			</Mask>
		</Defs>
	</Svg>
);
export default SvgComponent;
