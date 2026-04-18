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

const hueToRgb = (p: number, q: number, t: number) => {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

	return p;
};

const toHex = (c: number) => {
	const hex = Math.round(c * 255)
		.toString(16)
		.padStart(2, '0');

	return hex;
};

export const withAlpha = (hex: string, opacity: number) => {
	const clamped = clamp(0, 1, opacity);

	return `#${normalizeHex(hex)}${toHex(clamped)}`.toUpperCase();
};

export const isLight = (hex: string) => {
	const normalized = normalizeHex(hex);

	if (normalized.length !== 6) return false;

	const r = Number.parseInt(normalized.slice(0, 2), 16);
	const g = Number.parseInt(normalized.slice(2, 4), 16);
	const b = Number.parseInt(normalized.slice(4, 6), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

	return luminance > 0.5;
};

export const lighten = (hex: string, amount: number): string => {
	const normalized = normalizeHex(hex);

	if (normalized.length !== 6) return hex;

	const r = parseInt(normalized.slice(0, 2), 16) / 255;
	const g = parseInt(normalized.slice(2, 4), 16) / 255;
	const b = parseInt(normalized.slice(4, 6), 16) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	const d = max - min;

	let h = 0;
	let s = 0;

	if (d !== 0) {
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
				break;
			case g:
				h = ((b - r) / d + 2) / 6;
				break;
			case b:
				h = ((r - g) / d + 4) / 6;
				break;
		}
	}

	const newL = Math.max(0, Math.min(1, l + amount));

	let nr = newL;
	let ng = newL;
	let nb = newL;

	if (s !== 0) {
		const q = newL < 0.5 ? newL * (1 + s) : newL + s - newL * s;
		const p = 2 * newL - q;
		nr = hueToRgb(p, q, h + 1 / 3);
		ng = hueToRgb(p, q, h);
		nb = hueToRgb(p, q, h - 1 / 3);
	}

	return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
};
