import styled from 'styled-components/native';

export const LogoWrap = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
`;

export const ColorSwatch = styled.View<{ $color: string }>`
	background-color: ${({ theme, $color }) => $color ?? theme.background.default};
`;

export default styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled' as const,
	contentInsetAdjustmentBehavior: 'automatic' as const,
	keyboardDismissMode: 'on-drag' as const
})`
	flex: 1;
	background-color: ${({ theme }) => theme.background.default};
`;
