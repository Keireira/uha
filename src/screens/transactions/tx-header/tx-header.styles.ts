import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

export const GlassItem = styled(GlassView)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	border-radius: 42px;
	padding-horizontal: 4px;
`;

export const FilterBtn = styled.Pressable`
	display: flex;
	align-items: center;
	justify-content: center;

	border-radius: 12px;
	padding-vertical: 8px;
	padding-horizontal: 12px;
`;

export default styled.View`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	gap: 16px;
	margin-bottom: 16px;
	padding-horizontal: 16px;
`;
