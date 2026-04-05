import { useMemo } from 'react';

const useInitials = (name: string = '') => {
	const initials = useMemo(() => {
		if (!name) return '';

		const result = name
			.trim()
			.split(' ')
			.filter(Boolean)
			.reduce((acc, word) => acc + word[0].toUpperCase(), '');

		return result;
	}, [name]);

	return initials;
};

export default useInitials;
