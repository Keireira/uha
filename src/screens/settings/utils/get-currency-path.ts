const SPACE_SIGN = ' ';

const getCurrencyPath = (indexPath: number[]): string[] => {
	const newPath = indexPath.join(`${SPACE_SIGN}actions${SPACE_SIGN}`).split(SPACE_SIGN);

	return [...newPath, 'subtitle'];
};

export default getCurrencyPath;
