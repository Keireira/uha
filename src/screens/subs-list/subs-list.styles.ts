import styled from 'styled-components/native';
import MaskedView from '@react-native-masked-view/masked-view';

export const Item = styled.View`
	gap: 12px;
	width: calc(100% + 24px);
	padding: 12px 16px;
	border-radius: 18px;
	background-color: lightblue;
`;

export const ContentView = styled.ScrollView`
	padding-vertical: 16px;
`;

export const Masked = styled(MaskedView)`
	flex-direction: column;
	gap: 16px;
`;

export const BottomSpacer = styled.View<{ $bottom: number }>`
	height: ${({ $bottom }) => $bottom + 64}px;
`;

export default styled.View<{ $top: number; $bottom: number }>`
	flex: 1;
	background-color: #f2f2f7;
	padding-top: ${({ $top }) => $top}px;
	margin-bottom: ${({ $bottom }) => $bottom}px;
`;
