import type { ThemeConfigT } from './themes.d';

const lightThemeConfig: ThemeConfigT = {
	tint: 'light',
	is_oled: false,

	static: {
		white: '#fafafa'
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

	accent: {
		blue: '#007AFF',
		green: '#34C759',
		orange: '#FF9500',
		red: '#FF3B30',
		purple: '#AF52DE',
		pink: '#FF2D55',
		yellow: '#FFCC00',
		teal: '#5AC8FA',
		indigo: '#5856D6',
		mint: '#00C7BE',
		cyan: '#32ADE6'
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
