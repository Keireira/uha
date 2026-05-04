/* With reverse domain support */
export const normalizeDomain = (url: string) => {
	const value = url.trim().toLowerCase();

	return value
		.replace(/^https?:\/\//, '')
		.replace(/^www\./, '')
		.split('/')[0]
		.split('?')[0]
		.split('#')[0]
		.split(':')[0];
};
