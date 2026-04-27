import React from 'react';

export type Props = {
	date?: Date;
	amountText: string;
	setAmountText: React.Dispatch<React.SetStateAction<string>>;
};
