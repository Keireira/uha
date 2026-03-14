import styled from 'styled-components/native';

export const Line = styled.View`
	position: absolute;
	height: 1px;
	background-color: ${({ theme }) => {
		if (theme.tint === 'light') {
			return `${theme.text.tertiary}20`;
		} else if (theme.is_oled) {
			return `${theme.static.white}30`;
		}

		return `${theme.text.tertiary}40`;
	}};
	z-index: 1;
`;

export default styled.View`
	align-self: center;
	justify-content: center;
	width: 100%;
	height: 300px;
`;
