import type { ThemeConfigT } from './themes.d';

const lightThemeConfig: ThemeConfigT = {
	tint: 'light',

	static: {
		white: '#fafafa'
	},

	background: {
		default: '#f2f2f7'
		// secondary: '#ffffff'
		// tertiary: '#e5e5ea',
		// elevated: '#ffffff'
	},

	surface: {
		default: '#ffffff',
		secondary: '#e5e5ea',
		navbar: '#1c1c1e'
	},

	shadow: {
		default: '#333333'
	},

	text: {
		primary: '#333333',
		secondary: '#636366',
		tertiary: '#8e8e93',
		inverse: '#fafafa'
	},

	accent: {
		primary: '#ff9f0a',
		secondary: '#6d28d9',
		tertiary: '#007aff'
	},

	semantic: {
		success: '#30d158',
		warning: '#ff9f0a',
		error: '#ff453a',
		info: '#0a84ff'
	},

	border: {
		default: '#38383a',
		subtle: '#2c2c2e'
	}
};

export default lightThemeConfig;
