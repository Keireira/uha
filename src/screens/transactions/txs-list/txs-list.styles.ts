import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export const Gradient = styled(LinearGradient)`
	flex: 1;
`;

export const Masked = styled(MaskedView)`
	flex: 1;
`;

export const BottomSpacer = styled.View`
	height: 32px;
`;

export const ItemSeparator = styled.View`
	height: 4px;
`;

export default styled.View`
	flex: 1;
	gap: 16px;
	flex-direction: column;
`;
