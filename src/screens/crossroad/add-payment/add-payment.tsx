import React from 'react';
import { Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SymbolView } from 'expo-symbols';
import { EmojiPicker, ColorPicker } from '@elements';
import useAddPayment from './use-add-payment';
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
	SwitchRow,
	SwitchLabel,
	Input,
	SaveButton,
	SaveLabel
} from './add-payment.styles';

const AddPaymentScreen = () => {
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
		isCard,
		setIsCard,
		comment,
		setComment,
		showEmojiPicker,
		setShowEmojiPicker,
		showColorPicker,
		setShowColorPicker,
		isValid,
		save
	} = useAddPayment();

	return (
		<Container contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 24, gap: 24, paddingBottom: insets.bottom + 24 }}>
			<Header>
				<Title>New Payment</Title>
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
					placeholder="e.g. Visa Gold"
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

			<Field>
				<FieldLabel>Type</FieldLabel>
				<SwitchRow>
					<SwitchLabel>Card</SwitchLabel>
					<Switch
						value={isCard}
						onValueChange={setIsCard}
						trackColor={{ false: theme.surface.secondary, true: theme.accent.primary }}
					/>
				</SwitchRow>
			</Field>

			<Field>
				<FieldLabel>Comment</FieldLabel>
				<Input
					value={comment}
					onChangeText={setComment}
					placeholder="*1234"
					placeholderTextColor={`${theme.text.tertiary}75`}
				/>
			</Field>

			<SaveButton $disabled={!isValid} disabled={!isValid} onPress={save}>
				<SaveLabel>Save</SaveLabel>
			</SaveButton>
		</Container>
	);
};

export default AddPaymentScreen;
