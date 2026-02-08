import styled from 'styled-components/native';
import { ScrollView } from 'react-native';

export default styled(ScrollView).attrs({
	contentContainerStyle: {
		gap: 24
	}
})`
	padding-horizontal: 20px;
`;
