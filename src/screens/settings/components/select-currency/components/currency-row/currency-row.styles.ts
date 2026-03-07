import styled from 'styled-components/native';
import { Text, SmallText } from '@ui';

import type { AccentT } from '@themes';

export const Title = styled(Text)<{ $settingAccent: AccentT; $isSelected: boolean }>`
	font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
	color: ${({ $isSelected, $settingAccent, theme }) =>
		$isSelected ? theme.accents[$settingAccent] : theme.text.primary};
`;

export const Code = styled(SmallText)`
	color: ${({ theme }) => theme.text.secondary};
`;

export const Separator = styled.View`
	height: 0.5px;
	margin-left: 24px;
	background-color: ${({ theme }) => `${theme.border.default}50`};
`;

export default styled.Pressable`
	flex: 1;
	gap: 2px;
	padding: 12px 24px;
`;
