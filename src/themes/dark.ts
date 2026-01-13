import type { ThemeConfigT } from './themes.d';

const darkThemeConfig: ThemeConfigT = {
	tint: 'dark', // +

	static: {
		white: '#fafafa' // +
	},

	background: {
		default: '#1c1c1e' // +
		// secondary: '#2c2c2e'
		// tertiary: '#3a3a3c',
		// elevated: '#48484a'
	},

	surface: {
		default: '#2c2c2e', // +
		secondary: '#3c3c3e', // +
		navbar: '#333333' // +
	},

	shadow: {
		default: '#a8a8ad' // +
	},

	text: {
		primary: '#fafafa', // +
		secondary: '#a1a1a6', // +
		tertiary: '#636366', // +
		inverse: '#1c1c1e' // +
	},

	accent: {
		primary: '#ff9f0a',
		secondary: '#6d28d9', // +
		tertiary: '#0a84ff'
	},

	semantic: {
		success: '#30d158',
		warning: '#ff9f0a',
		error: '#ff453a',
		info: '#0a84ff'
	},

	border: {
		default: '#38383a', // +
		subtle: '#2c2c2e'
	}
};

export default darkThemeConfig;
