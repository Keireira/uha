import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

export const TitleField = styled.View`
	flex: 1;
`;

export const FieldsGroup = styled(GlassView).attrs({
	isInteractive: false
})`
	align-self: stretch;
	overflow: hidden;

	border-radius: 16px;
`;

export const NotesCard = styled(GlassView).attrs({
	isInteractive: false
})`
	align-self: stretch;
	overflow: hidden;

	border-radius: 16px;
`;

export const NotesField = styled.TextInput.attrs(({ theme }) => ({
	placeholderTextColor: theme.text.tertiary,
	multiline: true,
	textAlignVertical: 'top' as const
}))`
	font-family: 'Nunito';
	font-size: 15px;
	font-weight: 400;
	line-height: 21px;

	min-height: 84px;

	padding: 14px 16px;

	color: ${({ theme }) => theme.text.primary};
`;

export default styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled',
	contentInsetAdjustmentBehavior: 'automatic',
	keyboardDismissMode: 'on-drag',
	contentContainerStyle: {
		gap: 16
	}
})`
	flex: 1;
	background-color: ${({ theme }) => theme.background.default};
`;
