import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { font, padding, submitLabel, onSubmit, multilineTextAlignment } from '@expo/ui/swift-ui/modifiers';
import { swipeActions } from '@modules/expo-ui-modifiers';
import { Text, HStack, TextField, LabeledContent } from '@expo/ui/swift-ui';

import type { ServiceEditParams } from '@screens/library/services';

type Props = {
	aliases: ServiceEditParams['aliases'];
	onChangeAliases: (aliases: string[]) => void;
};

const Aliases = ({ aliases, onChangeAliases }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const [aliasDraft, setAliasDraft] = useState('');
	const [inputKey, setInputKey] = useState(0);

	const addAlias = () => {
		const value = aliasDraft.trim();
		if (!value || aliases.includes(value)) {
			setAliasDraft('');
			setInputKey((n) => n + 1);
			return;
		}

		onChangeAliases([...aliases, value]);
		setAliasDraft('');
		setInputKey((n) => n + 1);
	};

	const removeAlias = (alias: string) => () => {
		onChangeAliases(aliases.filter((a) => a !== alias));
	};

	return (
		<>
			{aliases.map((alias) => (
				<HStack
					key={alias}
					spacing={8}
					modifiers={[
						padding({ vertical: 4 }),
						...swipeActions({
							actions: [
								{
									id: 'delete',
									systemImage: 'trash',
									tint: theme.semantic.error,
									onPress: removeAlias(alias)
								}
							]
						})
					]}
				>
					<Text modifiers={[font({ size: 16, weight: 'regular', design: 'rounded' })]}>{alias}</Text>
				</HStack>
			))}

			<LabeledContent label="" modifiers={[font({ size: 16, weight: 'regular', design: 'rounded' })]}>
				<TextField
					key={`alias-input-${inputKey}`}
					defaultValue=""
					placeholder={t('library.details.aliases.add')}
					onValueChange={setAliasDraft}
					modifiers={[
						multilineTextAlignment('leading'),
						font({ size: 16, weight: 'regular', design: 'rounded' }),
						submitLabel('done'),
						onSubmit(addAlias)
					]}
				/>
			</LabeledContent>
		</>
	);
};

export default Aliases;
