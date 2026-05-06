import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { TextField } from '@expo/ui/swift-ui';
import { font, foregroundStyle, lineLimit } from '@expo/ui/swift-ui/modifiers';

type Props = {
	notes: string;
	onChangeNotes: (value: string) => void;
};

const Notes = ({ notes, onChangeNotes }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<TextField
			axis="vertical"
			defaultValue={notes}
			placeholder={t('library.details.placeholders.notes')}
			onValueChange={onChangeNotes}
			modifiers={[
				foregroundStyle(theme.text.primary),
				font({ size: 17, design: 'rounded' }),
				lineLimit(4, { reservesSpace: true })
			]}
		/>
	);
};

export default Notes;
