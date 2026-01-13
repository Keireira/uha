import 'styled-components/native';

export type ThemeT = 'dark' | 'light' | 'oled';

export type ThemeConfigT = {
	tint: 'dark' | 'light';
	background: {
		default: string;
		// secondary: string;
		// tertiary: string;
		// elevated: string;
	};
	surface: {
		default: string;
		navbar: string;
		placeholder: string;
	};
	shadow: {
		default: string;
	};
	text: {
		primary: string;
		secondary: string;
		tertiary: string;
		disabled: string;
		inverse: string;
	};
	accent: {
		primary: string;
		secondary: string;
		tertiary: string;
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
