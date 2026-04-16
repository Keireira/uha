import styled from 'styled-components/native';
import { BaseText } from '@ui';

export const Container = styled.ScrollView.attrs({
	keyboardShouldPersistTaps: 'handled' as const,
	showsVerticalScrollIndicator: false
})`
	flex: 1;
`;

export const Header = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

export const Title = styled(BaseText)<{ $dark: boolean }>`
	font-size: 22px;
	font-weight: 700;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
`;
