import { clamp } from 'ramda';

const normalizeHex = (hex: string): string => {
	const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;

	switch (cleanHex.length) {
		case 3:
			return cleanHex
				.split('')
				.map((c) => c + c)
				.join('');
		case 8:
			return cleanHex.slice(0, 6);
		default:
			return cleanHex;
	}
};

export const withAlpha = (hex: string, opacity: number) => {
	const clamped = clamp(0, 1, opacity);

	const alpha = Math.round(clamped * 255)
		.toString(16)
		.padStart(2, '0');

	return `#${normalizeHex(hex)}${alpha}`.toUpperCase();
};
