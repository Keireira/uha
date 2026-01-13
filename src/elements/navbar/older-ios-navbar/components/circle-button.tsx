import React from 'react';
import styled from 'styled-components/native';

import NavbarIcon from './navbar-icon';

const Root = styled.Pressable`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48px;
	height: 48px;
	background-color: ${({ theme }) => theme.surface.navbar};
	border-radius: 50%;
`;

const CircleButton = (props: React.ComponentProps<typeof Root>) => (
	<Root {...props}>
		<NavbarIcon name="add" />
	</Root>
);

export default CircleButton;
