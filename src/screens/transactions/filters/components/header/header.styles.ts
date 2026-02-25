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

export const Title = styled.View`
	position: absolute;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	flex-direction: row;
	justify-content: center;
	gap: 12px;
`;

export const HeaderRow = styled.View`
	position: relative;
	left: 0;
	right: 0;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

export default styled(BlurView)`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 10;
	padding: 18px;
	gap: 18px;
	flex-direction: column;
	border-bottom-width: 1px;
	border-bottom-color: ${({ theme }) => `${theme.border.default}40`};
`;
