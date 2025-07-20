import styled from 'styled-components/native';

export default styled.Pressable<{ $color: string }>`
	display: flex;
	flex-direction: row;
	gap: 18px;
	align-items: center;
	padding: 18px 36px 18px 18px;
	background-color: ${({ $color }) => `${$color}50`};
	border-radius: 12px;
	box-shadow: 0 2px 4px rgba(0 0 0 / 0.1);
`;
