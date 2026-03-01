import type { ThemeConfigT } from './themes.d';

const darkThemeConfig: ThemeConfigT = {
	tint: 'dark',
	is_oled: false,

	static: {
		white: '#fafafa' // +
	},

	background: {
		default: '#1c1c1e', // +
		secondary: '#2c2c2e'
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
		blue: '#0A84FF',
		green: '#30D158',
		orange: '#FF9F0A',
		red: '#FF453A',
		purple: '#BF5AF2',
		pink: '#FF375F',
		yellow: '#FFD60A',
		teal: '#64D2FF',
		indigo: '#5E5CE6',
		mint: '#63E6E2',
		cyan: '#64D2FF'
	},

	semantic: {
		success: '#30d158',
		warning: '#ff9f0a',
		error: '#ff453a',
		info: '#0a84ff'
	},

	border: {
		default: '#545458', // +
		subtle: '#2c2c2e'
	}
};

export default darkThemeConfig;
