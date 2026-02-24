import styled from 'styled-components/native';

import { BlurView } from 'expo-blur';

import MaskedView from '@react-native-masked-view/masked-view';

export const Masked = styled(MaskedView)`
	flex: 1;
	margin-horizontal: -18px;
`;

export const TabsBarRow = styled.ScrollView.attrs({
	horizontal: true,
	showsHorizontalScrollIndicator: false,
	contentContainerStyle: {
		gap: 6,
		paddingVertical: 4,
		paddingHorizontal: 18
	}
})``;

export default styled(BlurView)`
	z-index: 10;
	padding: 18px;
	padding-top: 78px;
	gap: 18px;
	flex-direction: column;
	border-bottom-width: 1px;
	border-bottom-color: ${({ theme }) => `${theme.border.default}40`};
`;
