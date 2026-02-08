const hexToRgb = (hex: string): [number, number, number] => {
	const h = hex.replace('#', '');
	return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
};

const rgbToHex = (r: number, g: number, b: number): string => {
	return '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');
};

export const colorMix = (color1: string, color2: string, ratio: number = 0.5): string => {
	const [r1, g1, b1] = hexToRgb(color1);
	const [r2, g2, b2] = hexToRgb(color2);
	return rgbToHex(r1 * ratio + r2 * (1 - ratio), g1 * ratio + g2 * (1 - ratio), b1 * ratio + b2 * (1 - ratio));
};

export const isTextDark = (backgroundColor: string): boolean => {
	const [r, g, b] = hexToRgb(backgroundColor);
	const toSRGB = (c: number) => {
		c = c / 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	};
	const luminance = 0.2126 * toSRGB(r) + 0.7152 * toSRGB(g) + 0.0722 * toSRGB(b);
	return luminance > 0.4;
};
