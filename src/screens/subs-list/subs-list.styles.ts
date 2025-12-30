import styled from 'styled-components/native';
import MaskedView from '@react-native-masked-view/masked-view';

export const ContentView = styled.ScrollView`
	padding-vertical: 16px;
`;

export const Masked = styled(MaskedView)`
	flex-direction: column;
	gap: 16px;
`;

export default styled.View<{ $top: number; $bottom: number }>`
	flex: 1;
	background-color: #f2f2f7;
	padding-top: ${({ $top }) => $top}px;
	margin-bottom: ${({ $bottom }) => $bottom}px;
`;
