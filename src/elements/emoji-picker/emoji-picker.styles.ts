import styled from 'styled-components/native';
import { BaseText } from '@ui';

export const Grid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 10px;
`;

export const EmojiCell = styled.Pressable<{ $bg: string }>`
	width: 48px;
	height: 48px;
	align-items: center;
	justify-content: center;
	border-radius: 14px;
	background-color: ${({ $bg }) => $bg};
`;

export const EmojiText = styled(BaseText)`
	font-size: 24px;
`;
