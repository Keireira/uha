import styled from 'styled-components/native';
import PagerView from 'react-native-pager-view';

export const Page = styled.View`
	flex: 1;
`;

export const Pager = styled(PagerView)`
	flex: 1;
`;

export default styled.View<{ $top: number; $bottom: number }>`
	flex: 1;
	background-color: #1c1c1e;
	padding-top: ${({ $top }) => $top}px;
	padding-bottom: ${({ $bottom }) => $bottom}px;
`;
