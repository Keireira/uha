import React from 'react';

import { isAfterToday } from '@lib/date';
import { useFormattedPrice } from '@hooks/rates';

import Root, { BasePrice, ConvertedPrice } from './price.styles';

import type { Props } from './price.d';

const Price = ({ date, price, currencyCode }: Props) => {
	const { withConversion, basePrice, convertedPrice } = useFormattedPrice(date, price, currencyCode);
	const isInFuture = isAfterToday(date);

	return (
		<Root $withConversion={withConversion}>
			<BasePrice>{basePrice}</BasePrice>

			{withConversion && (
				<ConvertedPrice>
					{isInFuture ? `≈\u2009` : `=\u2009`}
					{convertedPrice}
				</ConvertedPrice>
			)}
		</Root>
	);
};

export default Price;
