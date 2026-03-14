import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { SmallText, H1 } from '@ui';

export const Label = styled(SmallText)`
	font-weight: 600;
	color: ${({ theme }) => theme.text.secondary};
	letter-spacing: 0.2px;
`;

export const Code = styled(H1)`
	text-transform: capitalize;
	letter-spacing: -0.5px;
	font-weight: 800;
	margin-top: 2px;
`;

export const DayHint = styled(SmallText)`
	font-weight: 500;
	color: ${({ theme }) => theme.text.tertiary};
	margin-top: 2px;
`;

export const Inner = styled(GlassView)`
	flex: 1;
	padding: 16px;
	gap: 4px;
`;

export default styled.Pressable`
	flex: 1;
	overflow: hidden;
	border-radius: 16px;
`;
