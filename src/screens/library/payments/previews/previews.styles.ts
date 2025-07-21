import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

export const SnapMark = styled.View<{ $left?: boolean; $right?: boolean }>`
	width: 0;
	${({ $left }) => $left && 'margin-left: -12px;'}
	${({ $right }) => $right && 'margin-right: -12px;'}
`;

export default styled(ScrollView).attrs({
	horizontal: true,
	showsHorizontalScrollIndicator: false,
	contentContainerStyle: {
		gap: 24
	}
})``;
