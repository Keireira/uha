import styled from 'styled-components/native';
import { ScrollView } from 'react-native';

export default styled(ScrollView).attrs({
	contentContainerStyle: {
		gap: 48
	}
})`
	padding-horizontal: 16px;
`;
