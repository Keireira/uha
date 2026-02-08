import React, { useMemo } from 'react';

import { useTransaction } from './hooks';

import { AccentRail, Divider } from '@ui';
import { Price, Merchant, Meta } from './components';
import Root, { Content } from './tx-detailed-view.styles';

const TxDetailedView = () => {
	const transaction = useTransaction();

	const date = useMemo(() => {
		return transaction?.date ? new Date(transaction.date) : undefined;
	}, [transaction?.date]);

	if (!transaction || !date) {
		return null;
	}

	return (
		<Root>
			<AccentRail
				segments={[
					{ color: transaction.color || transaction.category_color, flex: 3 },
					{ color: transaction.category_color || transaction.color, flex: 2 }
				]}
			/>

			<Content>
				<Price
					date={date}
					isPhantom={transaction.isPhantom}
					currencyCode={transaction.currency_code}
					price={transaction.price}
					denominator={transaction.denominator}
				/>

				<Divider />

				<Merchant
					date={date}
					slug={transaction.slug}
					emoji={transaction.emoji}
					customName={transaction.customName}
					title={transaction.title}
					color={transaction.color}
					isPhantom={transaction.isPhantom}
				/>

				<Divider />

				<Meta
					id={transaction.id}
					categoryTitle={transaction.category_title}
					currencyCode={transaction.currency_code}
					tenderTitle={transaction.tender_title}
					tenderEmoji={transaction.tender_emoji}
					tenderComment={transaction.tender_comment}
					comment={transaction.comment}
				/>
			</Content>
		</Root>
	);
};

export default TxDetailedView;
