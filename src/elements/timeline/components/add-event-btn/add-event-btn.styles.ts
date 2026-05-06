import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { withAlpha } from '@lib/colors';

export const Label = styled.Text<{ $tintColor: string }>`
	font-size: 15px;
	font-weight: 600;

	color: ${({ $tintColor }) => $tintColor};
`;

export const InnerBtn = styled.Pressable<{ $tintColor: string }>`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 8px;

	padding: 14px 16px;

	background-color: ${({ $tintColor }) => withAlpha($tintColor, 0.14)};
`;

export default styled(GlassView).attrs({
	isInteractive: true
})`
	align-self: stretch;
	overflow: hidden;

	border-radius: 14px;

	margin-top: 10px;
	margin-horizontal: 16px;
`;
