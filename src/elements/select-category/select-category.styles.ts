import styled from 'styled-components/native';
import { H4 } from '@ui';

export const Title = styled(H4)<{ $isActive: boolean; $tintColor: string }>`
	flex: 1;
	font-weight: 600;
	color: ${({ theme, $isActive, $tintColor }) => ($isActive ? $tintColor : theme.text.primary)};
`;

export const Check = styled(H4)`
	color: ${({ theme }) => theme.text.primary};
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
