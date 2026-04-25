import styled from 'styled-components/native';
import { LargeText, SmallText } from '@ui';

export const Comment = styled(SmallText)`
	color: ${({ theme }) => theme.text.secondary};
`;

export const Title = styled(LargeText)<{ $isActive: boolean; $tintColor: string }>`
	color: ${({ theme, $isActive, $tintColor }) => ($isActive ? $tintColor : theme.text.primary)};
`;

export const Description = styled.View`
	flex: 1;
	gap: 2px;
	flex-direction: column;
	justify-content: space-evenly;
`;

export const Row = styled.Pressable`
	gap: 14px;
	align-items: center;
	flex-direction: row;

	padding: 12px 24px;
	background-color: ${({ theme }) => theme.surface.default};
`;

export default styled.ScrollView`
	flex: 1;
	background-color: ${({ theme }) => theme.background.secondary};
`;
