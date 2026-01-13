import React from 'react';
import { useTheme } from 'styled-components/native';

import { ListIcon, CalendarIcon, SettingsIcon, LibraryIcon, AddIcon } from '@ui/icons';

type Props = {
	isInverted?: boolean;
	name: 'list' | 'library' | 'calendar' | 'settings' | 'add';
};

const NavbarIcon = ({ name }: Props) => {
	const theme = useTheme();

	switch (name) {
		case 'list':
			return <ListIcon color={theme.text.primary} />;
		case 'calendar':
			return <CalendarIcon color={theme.text.primary} />;
		case 'library':
			return <LibraryIcon color={theme.text.primary} />;
		case 'settings':
			return <SettingsIcon color={theme.text.primary} />;
		case 'add':
			return <AddIcon color={theme.tint === 'dark' ? theme.text.primary : theme.text.inverse} />;
	}

	return null;
};

export default NavbarIcon;
