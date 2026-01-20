import styled from 'styled-components/native';

import { H2 } from '@ui';
import { GlassView, GlassContainer } from 'expo-glass-effect';

export const Stub = styled.View`
	height: 40px;
	width: 40px;
`;

export const YearButton = styled.Pressable`
	border-radius: 12px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	gap: 4px;
	padding-left: 12px;
	padding-right: 16px;
	height: 40px;
`;

export const GlassItem = styled(GlassView)`
	display: flex;
	align-items: center;
	justify-content: center;

	border-radius: 42px;
`;

export const GlassWrapper = styled(GlassContainer)`
	padding-vertical: 8px;
`;

/* Trigger */
export const Title = styled(H2)`
	text-transform: capitalize;
	color: ${({ theme }) => theme.text.primary};
`;

export default styled.Pressable`
	padding-vertical: 11px;
`;
