export const parsePrice = (input: string): number | undefined => {
	const cleaned = input.replace(/[^\d.,]/g, '');
	if (!cleaned) return undefined;

	const lastSep = Math.max(cleaned.lastIndexOf('.'), cleaned.lastIndexOf(','));
	const normalized =
		lastSep === -1 ? cleaned : cleaned.slice(0, lastSep).replace(/[.,]/g, '') + '.' + cleaned.slice(lastSep + 1);

	const n = Number.parseFloat(normalized);
	return Number.isFinite(n) ? Math.abs(n) : undefined;
};
