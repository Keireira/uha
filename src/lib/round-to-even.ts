const roundToEven = (num: number): number => {
	const floor = Math.floor(num);
	const decimal = num - floor;

	if (decimal === 0.5) {
		return floor % 2 === 0 ? floor : floor + 1;
	}

	return Math.round(num);
};

export default roundToEven;
