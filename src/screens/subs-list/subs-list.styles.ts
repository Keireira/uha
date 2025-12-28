import styled from 'styled-components/native';
import MaskedView from '@react-native-masked-view/masked-view';

export const ContentView = styled.ScrollView`
	padding-vertical: 16px;
`;

export const Masked = styled(MaskedView)`
	flex-direction: column;
	gap: 16px;
`;

export const BottomSpacer = styled.View`
	height: 96px;
`;

export default styled.View`
	flex: 1;
	background-color: #f2f2f7;
	padding-top: 40px;
	padding-bottom: 96px;
`;
