import React from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SymbolView } from 'expo-symbols';
import { EmojiPicker, ColorPicker } from '@elements';
import useAddCategory from './use-add-category';
import {
	Container,
	Header,
	Title,
	CloseGlass,
	CloseInner,
	Field,
	FieldLabel,
	EmojiPreview,
	EmojiPreviewText,
	PlaceholderText,
	Input,
	SaveButton,
	SaveLabel
} from './add-category.styles';

const AddCategoryScreen = () => {
	const theme = useTheme();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const {
		title,
		setTitle,
		emoji,
		setEmoji,
		color,
		setColor,
		showEmojiPicker,
		setShowEmojiPicker,
		showColorPicker,
		setShowColorPicker,
		isValid,
		save
	} = useAddCategory();

	return (
		<Container contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 24, gap: 24, paddingBottom: insets.bottom + 24 }}>
			<Header>
				<Title>New Category</Title>
				<CloseGlass isInteractive>
					<CloseInner onPress={() => router.back()} hitSlop={10}>
						<SymbolView name="xmark" size={16} weight="bold" tintColor={theme.text.tertiary} />
					</CloseInner>
				</CloseGlass>
			</Header>

			<Field>
				<FieldLabel>Title</FieldLabel>
				<Input
					value={title}
					onChangeText={setTitle}
					placeholder="e.g. Food & Drinks"
					placeholderTextColor={`${theme.text.tertiary}75`}
					autoFocus
				/>
			</Field>

			<Field>
				<FieldLabel>Emoji</FieldLabel>
				<EmojiPreview onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
					{emoji ? <EmojiPreviewText>{emoji}</EmojiPreviewText> : <PlaceholderText>Tap to pick</PlaceholderText>}
				</EmojiPreview>
				{showEmojiPicker && (
					<EmojiPicker
						selected={emoji}
						onSelect={(e) => {
							setEmoji(e);
							setShowEmojiPicker(false);
						}}
					/>
				)}
			</Field>

			<Field>
				<FieldLabel>Color</FieldLabel>
				<EmojiPreview onPress={() => setShowColorPicker(!showColorPicker)}>
					<EmojiPreviewText style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: color }} />
					<PlaceholderText>{color}</PlaceholderText>
				</EmojiPreview>
				{showColorPicker && <ColorPicker value={color} onSelect={setColor} />}
			</Field>

			<SaveButton $disabled={!isValid} disabled={!isValid} onPress={save}>
				<SaveLabel>Save</SaveLabel>
			</SaveButton>
		</Container>
	);
};

export default AddCategoryScreen;
