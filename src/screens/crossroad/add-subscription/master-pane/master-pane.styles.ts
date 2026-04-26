import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

export const NotesCard = styled(GlassView).attrs({
	isInteractive: false
})`
	align-self: stretch;
	overflow: hidden;

	border-radius: 16px;
	margin-horizontal: 16px;
`;

export const NotesField = styled.TextInput.attrs(({ theme }) => ({
	placeholderTextColor: theme.text.tertiary,
	multiline: true,
	textAlignVertical: 'top' as const
}))`
	font-size: 16px;
	font-weight: 400;
	line-height: 21px;

	min-height: 84px;

	padding: 14px 16px;

	color: ${({ theme }) => theme.text.primary};
`;
