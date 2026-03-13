import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { BaseText, Text } from '@ui';

/* iCloud row */

export const Card = styled(GlassView)`
	border-radius: 16px;
	overflow: hidden;
`;

export const CardRow = styled.Pressable`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 14px 16px;
	gap: 12px;
`;

export const CardRowTitle = styled(BaseText)`
	font-size: 16px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.primary};
	flex-shrink: 1;
`;

export const CardRowValue = styled(BaseText)`
	font-size: 15px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.tertiary};
`;

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
