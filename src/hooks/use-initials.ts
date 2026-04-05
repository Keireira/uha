import { split, join, toUpper, take } from 'ramda';

const getInitials = (raw: string): string => {
	const parts = split(/\s+/, raw);
	const letters = parts.map((w) => w[0]);

	return toUpper(join('', take(2, letters)));
};

const useInitials = (fullName?: string) => {
	const name = fullName?.trim();

	return name ? getInitials(name) : '';
};

export default useInitials;
