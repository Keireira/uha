import React from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import db from '@db';
import { eq } from 'drizzle-orm';
import { tendersTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import {
	font,
	shapes,
	contentShape,
	onTapGesture,
	foregroundStyle,
	multilineTextAlignment
} from '@expo/ui/swift-ui/modifiers';
import { Text, LabeledContent } from '@expo/ui/swift-ui';

type Props = {
	tenderId: string | null;
};

const Payment = ({ tenderId }: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();

	const { data: [tender] = [] } = useLiveQuery(
		db
			.select()
			.from(tendersTable)
			.where(eq(tendersTable.id, tenderId ?? '')),
		[tenderId]
	);

	const openPaymentPicker = () => {
		router.push({
			pathname: '/(pickers)/select-tender',
			params: { target: 'library_subscription_tender' }
		});
	};

	const label = tender?.title || t('library.details.fields.payment_none');

	return (
		<LabeledContent
			label={t('library.details.fields.payment')}
			modifiers={[contentShape(shapes.rectangle()), onTapGesture(openPaymentPicker)]}
		>
			<Text
				modifiers={[
					multilineTextAlignment('trailing'),
					foregroundStyle(theme.text.secondary),
					font({ size: 16, weight: 'regular', design: 'rounded' })
				]}
			>
				{label}
			</Text>
		</LabeledContent>
	);
};

export default Payment;
