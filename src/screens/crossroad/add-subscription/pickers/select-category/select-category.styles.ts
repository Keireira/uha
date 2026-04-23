import styled from 'styled-components/native';

export const Row = styled.Pressable`
	flex-direction: row;
	align-items: center;
	gap: 14px;

	padding: 12px 16px;

	border-radius: 14px;
	background-color: ${({ theme }) => theme.surface.default};
`;

export const Emoji = styled.Text<{ $color: string }>`
	width: 32px;
	height: 32px;
	line-height: 32px;

	text-align: center;
	text-align-vertical: center;

	font-size: 18px;
	border-radius: 16px;

	background-color: ${({ $color }) => `${$color}33`};
	color: ${({ theme }) => theme.text.primary};
`;

export const Title = styled.Text`
	flex: 1;

	font-family: 'Nunito';
	font-size: 16px;
	font-weight: 500;

	color: ${({ theme }) => theme.text.primary};
`;

export const Check = styled.Text`
	font-size: 18px;
	font-weight: 700;

	color: ${({ theme }) => theme.text.primary};
`;

export default styled.ScrollView.attrs({
	contentContainerStyle: {
		padding: 16,
		paddingTop: 84,
		paddingBottom: 36,
		gap: 6
	}
})`
	flex: 1;
	background-color: ${({ theme }) => theme.background.secondary};
`;
