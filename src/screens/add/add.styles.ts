import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { H1 } from '@ui';

export const CardInner = styled.Pressable`
	padding: 20px 16px;
	gap: 12px;
`;

export const CardGlass = styled(GlassView)`
	flex-grow: 1;
	flex-basis: 45%;
	border-radius: 16px;
	overflow: hidden;
	border-width: 1px;
	border-color: ${({ theme }) => `${theme.border.default}30`};
`;

export const Grid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 12px;
	padding-horizontal: 20px;
	padding-top: 16px;
`;

export const ScreenTitle = styled(H1)`
	font-size: 32px;
	font-weight: 800;
	letter-spacing: -0.5px;
	padding-horizontal: 20px;
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
