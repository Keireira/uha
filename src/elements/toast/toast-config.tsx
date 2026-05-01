import React from 'react';
import ToastBody from './toast';

import type { BaseToastProps } from 'react-native-toast-message';

const toastConfig = {
	error: (props: BaseToastProps) => <ToastBody {...props} kind="error" />,
	success: (props: BaseToastProps) => <ToastBody {...props} kind="success" />,
	info: (props: BaseToastProps) => <ToastBody {...props} kind="info" />
};

export default toastConfig;
