import styled from 'styled-components/native';
import MaskedView from '@react-native-masked-view/masked-view';

export const Masked = styled(MaskedView)`
	flex: 1;
`;

export const BottomSpacer = styled.View<{ $height: number }>`
	height: ${({ $height }) => $height + 64}px;
`;

export const ItemSeparator = styled.View`
	height: 4px;
`;

export default styled.View`
	flex: 1;
	flex-direction: column;
	gap: 16px;
`;
