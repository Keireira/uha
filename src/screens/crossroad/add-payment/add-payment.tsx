import React from 'react';
import { Switch } from 'react-native';
import { Stack } from 'expo-router';

import { TextField } from '@ui';
import { useAccent } from '@hooks';

import useAddPayment from './use-add-payment';
import Root, {
	PreviewRow,
	PreviewBadge,
	PreviewEmoji,
	PreviewPlaceholder,
	Section,
	SectionHeader,
	SectionTitle,
	Card,
	FieldPad,
	EmojiField,
	CommentField,
	ColorGrid,
	ColorSwatchWrap,
	ColorSwatchInner,
	ToggleRow,
	ToggleLabel
} from './add-payment.styles';

const COLOR_PALETTE = [
	'#1A1F71',
	'#1A8F71',
	'#007F73',
	'#000000',
	'#4285F4',
	'#2C3E50',
	'#F7931A',
	'#E74C3C',
	'#8B3FFD',
	'#FFDD2D',
	'#00BFFF',
	'#07C160',
	'#635BFF',
	'#3B7BBF',
	'#FF6B35',
	'#9C27B0'
];

const AddPaymentScreen = () => {
	const accent = useAccent();
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
		isValid,
		save
	} = useAddPayment();

	return (
		<>
			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button
					variant="done"
					icon="checkmark"
					onPress={save}
					tintColor={accent}
					disabled={!isValid}
				/>
			</Stack.Toolbar>

			<Root>
				<PreviewRow>
					<PreviewBadge $color={color}>
						{emoji ? <PreviewEmoji>{emoji}</PreviewEmoji> : <PreviewPlaceholder>?</PreviewPlaceholder>}
					</PreviewBadge>
				</PreviewRow>

				<Section>
					<SectionHeader>
						<SectionTitle>Name</SectionTitle>
					</SectionHeader>
					<Card>
						<FieldPad>
							<TextField
								defaultValue={title}
								onValueChange={setTitle}
								placeholder="e.g. My Visa"
								fontSize={17}
							/>
						</FieldPad>
					</Card>
				</Section>

				<Section>
					<SectionHeader>
						<SectionTitle>Emoji</SectionTitle>
					</SectionHeader>
					<Card>
						<EmojiField value={emoji} onChangeText={setEmoji} placeholder="💳" maxLength={4} />
					</Card>
				</Section>

				<Section>
					<SectionHeader>
						<SectionTitle>Color</SectionTitle>
					</SectionHeader>
					<ColorGrid>
						{COLOR_PALETTE.map((preset) => (
							<ColorSwatchWrap
								key={preset}
								$color={preset}
								$active={preset === color}
								onPress={() => setColor(preset)}
							>
								<ColorSwatchInner $active={preset === color} />
							</ColorSwatchWrap>
						))}
					</ColorGrid>
				</Section>

				<Section>
					<SectionHeader>
						<SectionTitle>Type</SectionTitle>
					</SectionHeader>
					<Card>
						<ToggleRow>
							<ToggleLabel>Card</ToggleLabel>
							<Switch value={isCard} onValueChange={setIsCard} />
						</ToggleRow>
					</Card>
				</Section>

				<Section>
					<SectionHeader>
						<SectionTitle>Comment (optional)</SectionTitle>
					</SectionHeader>
					<Card>
						<CommentField
							value={comment}
							onChangeText={setComment}
							placeholder="Last 4 digits, bank name, etc."
						/>
					</Card>
				</Section>
			</Root>
		</>
	);
};

export default AddPaymentScreen;
