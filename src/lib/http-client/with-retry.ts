const withRetry = async <T>(fn: () => Promise<T>, attempts = 3): Promise<T> => {
	for (let i = 0; i < attempts; i++) {
		try {
			return await fn();
		} catch (error) {
			if (i === attempts - 1) throw error;
			await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)));
		}
	}
	throw new Error('withRetry: unreachable');
};

export default withRetry;
