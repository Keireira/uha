const first = <T>(array: T[]): T | undefined => {
	return Array.isArray(array) ? array[0] : undefined;
};

export default first;
