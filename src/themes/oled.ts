import type { ThemeConfigT } from './themes.d';

const oledThemeConfig: ThemeConfigT = {
	tint: 'dark',
	is_oled: true,

	static: {
		white: '#fafafa'
	},

	background: {
		default: '#000000',
		secondary: '#1c1c1e'
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
		default: '#545458',
		subtle: '#0a0a0a'
	}
};

export default oledThemeConfig;
