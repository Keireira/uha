import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

export const CardRow = styled.Pressable`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 14px 16px;
	gap: 12px;
`;

export const Card = styled(GlassView)`
	margin-top: 10px;
	overflow: hidden;
	border-radius: 16px;
`;

export default styled(GlassView)`
	flex-direction: column;
	flex-wrap: wrap;
	gap: 10px;
	flex-basis: 48%;
	flex-grow: 1;
	border-radius: 16px;
	overflow: hidden;
	padding: 16px;
	gap: 4px;
`;
