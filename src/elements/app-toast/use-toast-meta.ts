import { useTheme } from 'styled-components/native';
import type { ToastKindT, ToastMetaT } from './toast.d';

const TOAST_META = {
	success: {
		icon: 'checkmark.circle.fill',
		tint: 'success'
	},
	error: {
		icon: 'exclamationmark.triangle.fill',
		tint: 'error'
	},
	info: {
		icon: 'info.circle.fill',
		tint: 'info'
	}
} as const satisfies Record<ToastKindT, ToastMetaT>;

const useToastMeta = (kind: ToastKindT) => {
	const theme = useTheme();
	const meta = TOAST_META[kind];
	const tintColor = theme.semantic[meta.tint];

	return {
		...meta,
		tintColor
	};
};

export default useToastMeta;
