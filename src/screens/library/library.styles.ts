import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import { Text } from '@ui';

export const NoItems = styled(Text)`
	font-size: 18px;
	color: #888;
`;

export default styled(ScrollView).attrs({
	contentContainerStyle: {
		gap: 48
	}
})`
	padding-horizontal: 16px;
`;
