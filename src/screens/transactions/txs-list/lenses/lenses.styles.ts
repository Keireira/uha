import styled from 'styled-components/native';

export const TitlePress = styled.Pressable`
	padding-top: 12px;
	padding-bottom: 12px;
`;

export const FilterBtn = styled.Pressable`
	border-radius: 12px;
	padding: 12px;
`;

export default styled.View`
	display: flex;
	flex-direction: row;
	gap: 16px;
	padding-horizontal: 16px;
	align-items: center;
	justify-content: space-between;
`;
