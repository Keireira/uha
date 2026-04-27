import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { H5 } from '@ui';

export const Unit = styled(H5)`
	text-transform: uppercase;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const InputWrap = styled.View`
	width: 160px;
	justify-content: center;
`;

export const ValueWrap = styled.View`
	align-items: center;
	min-width: 120px;
`;

export const InnerButton = styled.Pressable`
	flex: 1;
	align-items: center;
	justify-content: center;
`;

export const GlassButton = styled(GlassView)<{ $disabled?: boolean }>`
	width: 52px;
	height: 52px;
	overflow: hidden;
	border-radius: 999px;
	opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
`;

export default styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 24px;

	margin-bottom: 24px;
`;
