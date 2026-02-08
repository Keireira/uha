const CYCLE_ABBREV: Record<string, string> = {
	days: ' / day',
	weeks: ' / wk',
	months: ' / mo',
	years: ' / yr'
};

export const formatPrice = (price: number, denominator: number, locale: string, currency: string): string => {
	const value = price / (denominator || 1);

	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency
	}).format(value);
};

export const formatCycle = (type: string, value: number): string => {
	const abbrev = CYCLE_ABBREV[type] || ` / ${type}`;

	if (value === 1) return abbrev;

	return ` / ${value}${type.charAt(0)}`;
};
