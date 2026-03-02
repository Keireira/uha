import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

import type { TilePropsT } from './theme-picker.d';

export const InnerTile = styled.Pressable`
	align-items: center;
	justify-content: center;
	padding: 16px 10px;
	gap: 10px;
`;

export const Tile = styled(GlassView)<TilePropsT>`
	flex: 1;
	border-radius: 16px;
	overflow: hidden;
	background-color: ${({ $bg }) => $bg};
	border-width: 2.5px;
	border-color: ${({ $isActive, $accent }) => ($isActive ? $accent : 'transparent')};
`;

export default styled.View`
	flex-direction: row;
	gap: 10px;
`;
