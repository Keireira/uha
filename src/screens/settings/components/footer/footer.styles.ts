import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

export const Version = styled.Pressable`
	padding: 12px;
	margin-top: -8px;
	margin-left: -8px;
`;

export const Inner = styled.Pressable`
	flex-direction: row;
	align-items: center;
	padding: 9px 14px;
	gap: 5px;
`;

export const Pill = styled(GlassView)`
	border-radius: 12px;
	overflow: hidden;
`;

export const Links = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;
`;

export default styled.View`
	padding-top: 8px;
	padding-bottom: 16px;
	padding-horizontal: 16px;
	gap: 12px;
`;
