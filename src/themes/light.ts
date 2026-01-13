import type { ThemeConfigT } from './themes.d';

const lightThemeConfig: ThemeConfigT = {
	tint: 'light',
	background: {
		default: '#f2f2f7'
		// secondary: '#ffffff',
		// tertiary: '#e5e5ea',
		// elevated: '#ffffff'
	},

	surface: {
		default: '#ffffff',
		navbar: '#1c1c1e',
		placeholder: '#c7c7cc'
	},

	shadow: {
		default: '#333333'
	},

	text: {
		primary: '#222222',
		secondary: '#3c3c43',
		tertiary: '#8e8e93',
		disabled: '#c7c7cc',
		inverse: '#fafafa'
	},

	accent: {
		primary: '#d98028',
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
