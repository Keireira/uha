import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useComment } from './hooks';

import { Divider } from '@ui';
import {
	Row,
	Label,
	MetaItem,
	MetaValue,
	TenderValue,
	TenderEmoji,
	TenderDetails,
	TenderComment,
	NoteInput
} from './meta.styles';

import type { Props } from './meta.d';

const NoteMeta = (props: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const { note, setNote, handleBlur } = useComment(props);

	return (
		<Row>
			<MetaItem>
				<Label>{t('transactions.details.notes')}</Label>

				<NoteInput
					value={note}
					onChangeText={setNote}
					onBlur={handleBlur}
					placeholder={t('transactions.details.notes_placeholder')}
					placeholderTextColor={theme.text.tertiary}
					multiline
					scrollEnabled={false}
					textAlignVertical="top"
				/>
			</MetaItem>
		</Row>
	);
};

const TenderMeta = ({ tenderTitle, tenderEmoji, tenderComment }: Props) => {
	const { t } = useTranslation();

	return (
		<Row>
			<MetaItem>
				<Label>{t('transactions.details.payment')}</Label>

				<TenderValue>
					<TenderEmoji>{tenderEmoji}</TenderEmoji>

					<TenderDetails>
						<MetaValue>{tenderTitle}</MetaValue>

						{tenderComment && <TenderComment>{tenderComment}</TenderComment>}
					</TenderDetails>
				</TenderValue>
			</MetaItem>
		</Row>
	);
};

const IndexMeta = ({ categoryTitle, currencyCode }: Props) => {
	const { t } = useTranslation();

	return (
		<Row>
			<MetaItem>
				<Label>{t('transactions.details.category')}</Label>

				<MetaValue>{categoryTitle}</MetaValue>
			</MetaItem>

			<MetaItem>
				<Label>{t('transactions.details.currency')}</Label>

				<MetaValue>{t(`currencies.${currencyCode}`)}</MetaValue>
			</MetaItem>
		</Row>
	);
};

const Meta = (props: Props) => (
	<>
		<IndexMeta {...props} />

		{props.tenderTitle && (
			<>
				<Divider />

				<TenderMeta {...props} />
			</>
		)}

		<Divider />

		<NoteMeta {...props} />
	</>
);

export default Meta;
