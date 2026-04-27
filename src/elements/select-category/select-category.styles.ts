import styled from 'styled-components/native';
import { LargeText } from '@ui';

export const Title = styled(LargeText)<{ $isActive: boolean; $tintColor: string }>`
	flex: 1;
	color: ${({ theme, $isActive, $tintColor }) => ($isActive ? $tintColor : theme.text.primary)};
`;

export const Row = styled.Pressable`
	gap: 18px;
	align-items: center;
	flex-direction: row;

	padding: 12px 24px;
	background-color: ${({ theme }) => theme.surface.default};
`;

export default styled.ScrollView`
	flex: 1;
	background-color: ${({ theme }) => theme.background.secondary};
`;
