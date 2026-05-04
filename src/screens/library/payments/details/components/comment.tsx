import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { font, foregroundStyle, multilineTextAlignment } from '@expo/ui/swift-ui/modifiers';
import { TextField, LabeledContent } from '@expo/ui/swift-ui';

import type { PaymentEditParams } from '@screens/library/payments';

type Props = {
	comment: PaymentEditParams['comment'];
	onChangeComment: (value: string) => void;
};

const Comment = ({ comment, onChangeComment }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<LabeledContent
			label={t('library.details.fields.comment')}
			modifiers={[font({ size: 16, weight: 'regular', design: 'rounded' })]}
		>
			<TextField
				defaultValue={comment}
				placeholder="* 7482"
				onValueChange={onChangeComment}
				modifiers={[
					multilineTextAlignment('trailing'),
					foregroundStyle(theme.text.secondary),
					font({ size: 16, weight: 'regular', design: 'rounded' })
				]}
			/>
		</LabeledContent>
	);
};

export default Comment;
