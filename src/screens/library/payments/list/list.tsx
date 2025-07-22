import React from 'react';
import { useRouter } from 'expo-router';
import { asc, like } from 'drizzle-orm';
import { db } from '@src/sql-migrations';
import { paymentMethodsTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { ArrowLeftIcon } from '@ui/icons';
import Root, { PaymentRoot, Emoji, Title, Subtitle, Header, HeaderTitle, Description } from './list.styles';

import type { Props } from './list.d';

const CategoriesListScreen = ({ search }: Props) => {
	const router = useRouter();

	const { data: payments } = useLiveQuery(
		db
			.select()
			.from(paymentMethodsTable)
			.where(like(paymentMethodsTable.title, `%${search.trim()}%`))
			.orderBy(asc(paymentMethodsTable.title)),
		[search]
	);

	const navigateTo = () => {
		router.dismiss(1);
	};

	return (
		<Root>
			<Header hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={navigateTo}>
				<ArrowLeftIcon width={18} height={18} color="#333" />

				<HeaderTitle>Library</HeaderTitle>
			</Header>

			{payments.map((payment) => (
				<PaymentRoot key={payment.id}>
					<Emoji $color={payment.color}>{payment.emoji}</Emoji>

					<Description>
						<Title $withComment={Boolean(payment.comment)}>{payment.title}</Title>
						{payment.comment && <Subtitle>{payment.comment}</Subtitle>}
					</Description>
				</PaymentRoot>
			))}
		</Root>
	);
};

export default CategoriesListScreen;
