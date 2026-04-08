import type { ThemeConfigT } from './themes.d';

const lightThemeConfig: ThemeConfigT = {
	tint: 'light',
	is_oled: false,

	static: {
		pure_white: '#ffffff',
		white: '#fafafa',
		pure_black: '#000000',
		black: '#1C1C1E'
	},

	background: {
		default: '#f2f2f7',
		secondary: '#ffffff'
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

	accents: {
		red: '#FF383C',
		orange: '#FF8D28',
		yellow: '#FFCC00',
		green: '#34C759',
		mint: '#00C8B3',
		teal: '#00C3D0',
		cyan: '#00C0E8',
		blue: '#0088FF',
		indigo: '#6155F5',
		purple: '#CB30E0',
		pink: '#FF2D55'
	},

	semantic: {
		success: '#30d158',
		warning: '#ff9f0a',
		error: '#ff453a',
		info: '#0a84ff'
	},

	border: {
		default: '#c6c6c8',
		subtle: '#2c2c2e'
	}
};

export default lightThemeConfig;
