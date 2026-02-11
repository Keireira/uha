import React from 'react';
import { useTheme } from 'styled-components/native';

import { useIconAnimations } from '../hooks';

import Animated from 'react-native-reanimated';
import { ListIcon, CalendarIcon, SettingsIcon, LibraryIcon, AddIcon } from '@ui/icons';

type Props = {
	isFocused?: boolean;
	name: 'list' | 'library' | 'calendar' | 'settings' | 'add';
};

const NavbarIcon = ({ name, isFocused }: Props) => {
	const theme = useTheme();
	const iconStyles = useIconAnimations(isFocused);
	const indexIconColor = isFocused ? theme.accent.orange : theme.text.primary;

	const renderIcon = () => {
		switch (name) {
			case 'list':
				return <ListIcon color={indexIconColor} />;
			case 'calendar':
				return <CalendarIcon color={indexIconColor} />;
			case 'library':
				return <LibraryIcon color={indexIconColor} />;
			case 'settings':
				return <SettingsIcon color={indexIconColor} />;
			case 'add':
				return <AddIcon color={theme.tint === 'dark' ? theme.text.primary : theme.text.inverse} />;
		}
	};

	return <Animated.View style={iconStyles}>{renderIcon()}</Animated.View>;
};

export default NavbarIcon;
