import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { withAlpha } from '@lib/colors';

export const TypePickerBackdrop = styled.Pressable`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	background-color: rgba(0, 0, 0, 0.5);
	justify-content: flex-end;
`;

export const TypePickerSheet = styled(GlassView).attrs({
	isInteractive: false
})`
	padding: 20px 16px 28px;
	gap: 12px;

	border-top-left-radius: 24px;
	border-top-right-radius: 24px;
	overflow: hidden;
`;

export const TypePickerTitle = styled.Text`
	font-size: 13px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.4px;
	text-align: center;

	color: ${({ theme }) => theme.text.tertiary};

	margin-bottom: 4px;
`;

export const TypeChipGrid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;

	justify-content: center;
`;

export const TypeChipWrap = styled(GlassView).attrs({
	isInteractive: true
})`
	overflow: hidden;
	border-radius: 20px;
`;

export const TypeChip = styled.Pressable<{ $tone: string }>`
	flex-direction: row;
	align-items: center;
	gap: 6px;

	padding: 10px 14px;

	background-color: ${({ $tone }) => withAlpha($tone, 0.16)};
	border-radius: 20px;
`;

export const TypeChipLabel = styled.Text<{ $tone: string }>`
	font-size: 14px;
	font-weight: 600;

	color: ${({ $tone }) => $tone};
`;
