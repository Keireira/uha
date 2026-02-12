import styled from 'styled-components/native';
import { Text } from '@ui';

export const Divider = styled.View<{ $isDimmed: boolean }>`
	height: 0.5px;
	margin-left: 38px;
	background-color: ${({ theme }) => theme.border.default};
	opacity: ${({ $isDimmed }) => ($isDimmed ? 0.3 : 0.9)};
`;

export const CheckCircle = styled.View<{ $isSelected: boolean; $isImplied: boolean }>`
	width: 24px;
	height: 24px;
	border-radius: 12px;
	align-items: center;
	justify-content: center;
	border-width: ${({ $isSelected }) => ($isSelected ? '0px' : '1.5px')};
	background-color: ${({ theme, $isSelected }) => ($isSelected ? theme.accent.orange : 'transparent')};
	border-color: ${({ theme, $isImplied }) => ($isImplied ? `${theme.accent.orange}90` : `${theme.text.secondary}30`)};
`;

export const ImpliedDot = styled.View`
	width: 8px;
	height: 8px;
	border-radius: 4px;
	background-color: ${({ theme }) => `${theme.accent.orange}70`};
`;

/* Title | Start */
export const Title = styled(Text)<{ $withSubtitle: boolean }>`
	font-size: ${({ $withSubtitle }) => ($withSubtitle ? '16px' : '17px')};
`;

export const TitleView = styled.View`
	flex: 1;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	gap: 2px;
`;
/* Title | End */

export default styled.Pressable<{ $isDimmed: boolean }>`
	gap: 14px;
	flex-direction: row;
	align-items: center;
	padding-vertical: 14px;
	opacity: ${({ $isDimmed }) => ($isDimmed ? 0.3 : 1)};
`;
