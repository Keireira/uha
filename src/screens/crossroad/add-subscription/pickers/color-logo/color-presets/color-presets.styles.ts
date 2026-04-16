import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

export const CardInner = styled.Pressable`
	padding: 12px;
	gap: 12px;
`;

export const CardGlass = styled(GlassView)`
	border-radius: 16px;
`;

export default styled.ScrollView.attrs({
	contentInsetAdjustmentBehavior: 'automatic',
	automaticallyAdjustKeyboardInsets: true,
	keyboardDismissMode: 'interactive' as const,
	showsVerticalScrollIndicator: false,
	contentContainerStyle: {
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 32,
		gap: 12
	}
})``;
