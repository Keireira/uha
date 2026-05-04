import React from 'react';
import { useAccent } from '@hooks';

import { ActivityIndicator } from 'react-native';
import Root from './loader.styles';

const Loader = () => {
	const settingAccent = useAccent();

	return (
		<Root>
			<ActivityIndicator size="large" color={settingAccent} />
		</Root>
	);
};

export default Loader;
