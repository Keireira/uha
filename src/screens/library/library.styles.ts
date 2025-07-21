import styled from 'styled-components/native';
import { ScrollView, View } from 'react-native';

export const Section = styled(View)`
	gap: 12px;
`;

export default styled(ScrollView).attrs({
	contentContainerStyle: {
		gap: 48
	}
})`
	padding-left: 24px;
	padding-right: 24px;
`;
