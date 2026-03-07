import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { SmallText, H1 } from '@ui';

export const StepperButton = styled.Pressable<{ $disabled: boolean }>`
	width: 28px;
	height: 28px;
	border-radius: 8px;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => `${theme.text.tertiary}12`};
	opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
`;

export const Stepper = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 6px;
	margin-top: 6px;
`;

export const Code = styled(H1)`
	letter-spacing: -0.5px;
	font-weight: 800;
	margin-top: 2px;
`;

export const Label = styled(SmallText)`
	font-weight: 600;
	color: ${({ theme }) => theme.text.tertiary};
	letter-spacing: 0.2px;
`;

export default styled(GlassView)`
	flex: 1;
	border-radius: 16px;
	overflow: hidden;
	padding: 16px;
	gap: 4px;
`;
