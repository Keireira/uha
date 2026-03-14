import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { Text } from '@ui';

/* Backup / Restore tiles */

export const TileRow = styled.View`
	flex-direction: row;
	gap: 10px;
	margin-top: 10px;
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

/* CSV button */

export const CsvButton = styled(GlassView)<{ $disabled: boolean }>`
	border-radius: 14px;
	overflow: hidden;
	margin-top: 10px;
	opacity: ${({ $disabled }) => ($disabled ? 0.3 : 1)};
`;

export const CsvButtonInner = styled.Pressable`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 13px 20px;
	gap: 8px;
`;
