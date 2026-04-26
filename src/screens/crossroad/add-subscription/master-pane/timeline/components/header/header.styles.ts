import styled from 'styled-components/native';
import { SmallText, H6 } from '@ui';

export const Hint = styled(SmallText)`
	color: ${({ theme }) => theme.text.tertiary};
`;

export const Title = styled(H6)`
	text-transform: uppercase;
	color: ${({ theme }) => theme.text.tertiary};
`;

export default styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	padding: 0 4px;
	margin-bottom: 8px;
`;
