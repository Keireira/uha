import styled from 'styled-components/native';
import { withAlpha } from '@lib/colors';

export const Row = styled.Pressable`
	flex-direction: row;
	align-items: center;
	gap: 14px;

	padding: 12px 16px;

	border-radius: 14px;
	background-color: ${({ theme }) => theme.surface.default};
`;

export const NoneRow = styled(Row)``;

export const CreateRow = styled.Pressable<{ $accent: string }>`
	flex-direction: row;
	align-items: center;
	gap: 14px;

	padding: 12px 16px;

	border-radius: 14px;
	background-color: ${({ $accent }) => withAlpha($accent, 0.14)};
`;

export const CreateBadge = styled.View<{ $accent: string }>`
	width: 32px;
	height: 32px;
	border-radius: 16px;

	align-items: center;
	justify-content: center;

	background-color: ${({ $accent }) => withAlpha($accent, 0.25)};
`;

export const CreateTitle = styled.Text<{ $accent: string }>`
	flex: 1;

	font-family: 'Nunito';
	font-size: 16px;
	font-weight: 600;

	color: ${({ $accent }) => $accent};
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

export const Description = styled.View`
	flex: 1;
	gap: 2px;
`;

export const Title = styled.Text`
	font-family: 'Nunito';
	font-size: 16px;
	font-weight: 500;

	color: ${({ theme }) => theme.text.primary};
`;

export const NoneTitle = styled(Title)`
	flex: 1;
	color: ${({ theme }) => theme.text.secondary};
`;

export const Comment = styled.Text`
	font-family: 'Nunito';
	font-size: 13px;
	font-weight: 400;

	color: ${({ theme }) => theme.text.secondary};
`;

export const Check = styled.Text`
	font-size: 18px;
	font-weight: 700;

	color: ${({ theme }) => theme.text.primary};
`;

export default styled.ScrollView.attrs({
	contentContainerStyle: {
		padding: 16,
		gap: 6
	}
})`
	flex: 1;
	background-color: ${({ theme }) => theme.background.secondary};
`;
