import type { ThemeConfigT } from './themes.d';

const darkThemeConfig: ThemeConfigT = {
	tint: 'dark',
	is_oled: false,

	static: {
		pure_white: '#ffffff',
		white: '#fafafa',
		pure_black: '#000000',
		black: '#1C1C1E'
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

	accents: {
		red: '#FF453A',
		orange: '#FF9F0A',
		yellow: '#FFD60A',
		green: '#30D158',
		mint: '#63E6E2',
		teal: '#64D2FF',
		cyan: '#64D2FF',
		blue: '#0A84FF',
		indigo: '#5E5CE6',
		purple: '#BF5AF2',
		pink: '#FF375F'
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
