import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { Text } from '@ui';

/* Backup / Restore tiles */
export const TileRow = styled.View`
	margin-vertical: 10px;
	flex-direction: row;
	gap: 10px;
`;

export const Tile = styled(GlassView)`
	flex: 1;
	overflow: hidden;
	border-radius: 16px;
`;

export const TileInner = styled.Pressable`
	padding: 16px;
	gap: 12px;
`;

export const TileTitle = styled(Text)`
	font-size: 16px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.primary};
`;
