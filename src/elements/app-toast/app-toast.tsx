import React from 'react';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import toastConfig from './toast-config';

const AppToast = () => {
	const insets = useSafeAreaInsets();

	return <Toast config={toastConfig} topOffset={insets.top} />;
};

export default AppToast;
