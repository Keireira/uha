import type { ThemeConfigT } from './themes.d';

const oledThemeConfig: ThemeConfigT = {
	tint: 'dark',
	is_oled: true,

	static: {
		pure_white: '#ffffff',
		white: '#fafafa',
		pure_black: '#000000',
		black: '#1C1C1E'
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

	accents: {
		red: '#FF6165',
		orange: '#FFA056',
		yellow: '#FEDF43',
		green: '#4AD968',
		mint: '#54DFCB',
		teal: '#3BDDEC',
		cyan: '#6DD9FF',
		blue: '#5CB8FF',
		indigo: '#A7AAFF',
		purple: '#EA8DFF',
		pink: '#FF8AC4'
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
