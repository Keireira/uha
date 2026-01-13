import type { ThemeConfigT } from './themes.d';

const oledThemeConfig: ThemeConfigT = {
	tint: 'dark',
	background: {
		default: '#000000'
		// secondary: '#0a0a0a'
	},

	surface: {
		default: '#1c1c1e',
		navbar: '#000000',
		placeholder: '#2c2c2e'
	},

	shadow: {
		default: '#fafafa'
	},

	text: {
		primary: '#ffffff',
		secondary: '#a8a8ad',
		tertiary: '#a1a1a6',
		disabled: '#636366',
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
