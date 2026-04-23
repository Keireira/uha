import styled from 'styled-components/native';
import { withAlpha } from '@lib/colors';
import { SmallText } from '@ui';

export const Description = styled(SmallText)`
	color: ${({ theme }) => theme.text.secondary};
`;

export const TextBlock = styled.View`
	flex: 1;
	gap: 2px;
`;

export default styled.View<{ $tintColor: string }>`
	flex-direction: row;
	align-items: center;
	gap: 12px;

	padding: 12px 14px;
	margin-top: 12px;

	border-radius: 12px;
	background-color: ${({ $tintColor }) => withAlpha($tintColor, 0.12)};
`;
