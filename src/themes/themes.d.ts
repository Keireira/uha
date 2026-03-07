import 'styled-components/native';

export type ThemeT = 'dark' | 'light' | 'oled';

export type ThemeConfigT = {
	tint: 'dark' | 'light';
	is_oled: boolean;

	static: {
		pure_white: string;
		white: string;
		pure_black: string;
		black: string;
	};

	background: {
		default: string;
		secondary: string;
		// tertiary: string;
		// elevated: string;
	};
	surface: {
		default: string;
		secondary: string;
		navbar: string;
	};
	shadow: {
		default: string;
	};
	text: {
		primary: string;
		secondary: string;
		tertiary: string;
		inverse: string;
	};
	accents: {
		red: string;
		orange: string;
		yellow: string;
		green: string;
		mint: string;
		teal: string;
		cyan: string;
		blue: string;
		indigo: string;
		purple: string;
		pink: string;
	};
	semantic: {
		success: string;
		warning: string;
		error: string;
		info: string;
	};
	border: {
		default: string;
		subtle: string;
	};
};

export type AccentT = keyof ThemeConfigT['accents'];

declare module 'styled-components/native' {
	/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
	export interface DefaultTheme extends ThemeConfigT {}
}
