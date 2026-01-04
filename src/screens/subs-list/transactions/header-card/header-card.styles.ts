import styled from 'styled-components/native';
import { H4, Text } from '@ui';

export const DateText = styled(H4).attrs({
	$align: 'left',
	$weight: 700
})``;

export const TotalText = styled(Text).attrs({
	$align: 'right',
	$weight: 400
})`
	opacity: 0.33;
`;

export default styled.View`
	margin-top: 16px;
	margin-horizontal: 16px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;
