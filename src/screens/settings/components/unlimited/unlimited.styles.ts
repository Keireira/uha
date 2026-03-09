import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

import type { UserT } from '@models';

export const TextView = styled.View`
	flex: 1;
	gap: 2px;
`;

export const Inner = styled.Pressable`
	flex-direction: row;
	align-items: center;
	padding: 16px;
	gap: 12px;
`;

export default styled(GlassView)<{ $accent: UserT['accent'] }>`
	background-color: ${({ theme, $accent }) => `${theme.accents[$accent]}10`};
	overflow: hidden;

	border-color: ${({ theme, $accent }) => `${theme.accents[$accent]}30`};
	border-radius: 20px;
	border-width: 1px;
`;
