import styled from 'styled-components/native';
import { BaseText, SmallText } from '@ui';

export const SectionTitle = styled(SmallText)`
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	color: ${({ theme }) => theme.text.secondary};
	margin-bottom: 8px;
	margin-top: 16px;
`;

export const Grid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 4px;
`;

export const EmojiCell = styled.Pressable`
	width: 44px;
	height: 44px;
	align-items: center;
	justify-content: center;
	border-radius: 10px;
`;

export const EmojiText = styled(BaseText)`
	font-size: 28px;
`;

export const SelectedCell = styled.View`
	width: 44px;
	height: 44px;
	align-items: center;
	justify-content: center;
	border-radius: 10px;
	background-color: ${({ theme }) => `${theme.accent.primary}25`};
`;
