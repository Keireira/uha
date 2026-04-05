import React from 'react';

import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';

type Props = React.PropsWithChildren<{
	link?: string;
	assetId?: number;
	size: number;
	color?: string;
	onError?: () => void;
}>;

const SQUIRCLE_PATH = `
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

const SquircleMask = ({ children, size, link, assetId, onError }: Props) => {
	const source = link ?? assetId;

	const rectDimensions = {
		width: size,
		height: size
	};

	return (
		<MaskedView
			style={rectDimensions}
			maskElement={
				<Svg viewBox="0 0 1 1" style={rectDimensions}>
					<Path d={SQUIRCLE_PATH} fill="black" />
				</Svg>
			}
		>
			{source ? <Image source={source} style={rectDimensions} cachePolicy="disk" onError={onError} /> : children}
		</MaskedView>
	);
};

export default SquircleMask;
