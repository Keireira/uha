import styled from 'styled-components/native';
import PagerView from 'react-native-pager-view';

export const Page = styled.View`
	flex: 1;
`;

export const Pager = styled(PagerView)`
	flex: 1;
	height: 60%;
	max-height: 60%;
	min-height: 250px;
`;

export default styled.View<{ $top: number; $bottom: number }>`
	flex: 1;
	background-color: #f2f2f7;
	padding-top: ${({ $top }) => $top}px;
	margin-bottom: ${({ $bottom }) => $bottom}px;
`;
