import React from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';

import db from '@db';
import { asc, like } from 'drizzle-orm';
import { tendersTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { ArrowLeftIcon } from '@ui/icons';
import Root, { PaymentRoot, Emoji, Title, Subtitle, Header, HeaderTitle, Description } from './list.styles';

import type { Props } from './list.d';

const PaymentsListScreen = ({ search }: Props) => {
	const router = useRouter();
	const theme = useTheme();

	const { data: payments } = useLiveQuery(
		db
			.select()
			.from(tendersTable)
			.where(like(tendersTable.title, `%${search.trim()}%`))
			.orderBy(asc(tendersTable.title)),
		[search]
	);

	const navigateTo = () => {
		router.dismiss(1);
	};

	return (
		<Root>
			<Header hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={navigateTo}>
				<ArrowLeftIcon width={14} height={14} color={theme.text.tertiary} />
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

export default PaymentsListScreen;
