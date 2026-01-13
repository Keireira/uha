import styled from 'styled-components/native';
import MaskedView from '@react-native-masked-view/masked-view';

export const Masked = styled(MaskedView)`
	flex: 1;
`;

export default styled.View<{ $top: number; $bottom: number }>`
	flex: 1;
	background-color: ${({ theme }) => theme.background.default};
	padding-top: ${({ $top }) => $top}px;
`;
