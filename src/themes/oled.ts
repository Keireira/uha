import type { ThemeConfigT } from './themes.d';

const oledThemeConfig: ThemeConfigT = {
	tint: 'dark',

	static: {
		white: '#fafafa'
	},

	background: {
		default: '#000000'
	},

	surface: {
		default: '#1c1c1e',
		secondary: '#0a0a0a',
		navbar: '#000000'
	},

	shadow: {
		default: '#fafafa'
	},

	text: {
		primary: '#ffffff',
		secondary: '#a8a8a8',
		tertiary: '#737373',
		inverse: '#000000'
	},

	accent: {
		primary: '#d98028',
		secondary: '#6d28d9',
		tertiary: '#0a84ff'
	},

	semantic: {
		success: '#30d158',
		warning: '#ff9f0a',
		error: '#ff453a',
		info: '#0a84ff'
	},

	border: {
		default: '#1c1c1e',
		subtle: '#0a0a0a'
	}
};

export default oledThemeConfig;
