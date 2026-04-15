import styled from 'styled-components/native';

export const PressableWrap = styled.Pressable`
	position: relative;
`;

export const LogoWrap = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	margin-bottom: 24px;
`;

export const ColorSwatch = styled.View<{ $color: string }>`
	background-color: ${({ theme, $color }) => $color ?? theme.background.default};
`;

export default styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled',
	contentInsetAdjustmentBehavior: 'automatic',
	keyboardDismissMode: 'on-drag'
})`
	flex: 1;
	background-color: ${({ theme }) => theme.background.default};
`;
