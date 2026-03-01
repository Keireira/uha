import 'styled-components/native';

export type ThemeT = 'dark' | 'light' | 'oled';

export type ThemeConfigT = {
	tint: 'dark' | 'light';
	is_oled: boolean;

	static: {
		white: string;
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
	accent: {
		blue: string;
		green: string;
		orange: string;
		red: string;
		purple: string;
		pink: string;
		yellow: string;
		teal: string;
		indigo: string;
		mint: string;
		cyan: string;
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

declare module 'styled-components/native' {
	/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
	export interface DefaultTheme extends ThemeConfigT {}
}
