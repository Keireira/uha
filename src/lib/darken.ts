/**
 * Darken a hex color by a given percentage
 * @param hex - The hex color to darken
 * @param percent - The percentage to darken the color by
 * @returns The darkened hex color
 */
const darken = (hex: string, percent = 10) => {
	const normalized = hex.replace('#', '').trim();
	if (normalized.length !== 6) return hex;

	const factor = Math.max(0, Math.min(100, 100 - percent)) / 100;

	const r = Math.round(parseInt(normalized.slice(0, 2), 16) * factor);
	const g = Math.round(parseInt(normalized.slice(2, 4), 16) * factor);
	const b = Math.round(parseInt(normalized.slice(4, 6), 16) * factor);

	const toHex = (v: number) => v.toString(16).padStart(2, '0');

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export default darken;
