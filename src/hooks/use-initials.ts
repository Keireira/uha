import { useMemo } from 'react';

const useInitials = (name: string = '') => {
	const initials = useMemo(() => {
		if (!name) return '';

		const result = name
			.trim()
			.split(' ')
			.filter(Boolean)
			.reduce((acc, item) => acc + item[0].toUpperCase(), '');

		return result;
	}, [name]);

	return initials;
};

export default useInitials;
