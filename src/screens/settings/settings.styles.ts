import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { H6, SmallText } from '@ui';

export const Row = styled.View`
	flex-direction: row;
	gap: 10px;
`;

export const SectionFooterText = styled(SmallText)`
	color: ${({ theme }) => theme.text.tertiary};
	margin-top: 10px;
	margin-horizontal: 4px;
`;

export const SectionCard = styled(GlassView)`
	border-radius: 20px;
	overflow: hidden;
	padding: 12px;
`;

export const SectionLabel = styled(H6)`
	font-size: 12px;
	color: ${({ theme }) => theme.text.tertiary};
	letter-spacing: 0.5px;
	text-transform: uppercase;
	margin-bottom: 10px;
	margin-left: 4px;
`;

export const SectionWrap = styled.View`
	padding-horizontal: 16px;
	margin-bottom: 20px;
`;

export default styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled' as const
})`
	flex: 1;
	background-color: ${({ theme }) => theme.background.default};
`;
