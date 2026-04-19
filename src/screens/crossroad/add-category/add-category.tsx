import React from 'react';
import { Stack } from 'expo-router';

import { TextField } from '@ui';
import { useAccent } from '@hooks';

import useAddCategory from './use-add-category';
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
	ColorGrid,
	ColorSwatchWrap,
	ColorSwatchInner
} from './add-category.styles';

const COLOR_PALETTE = [
	'#FF6B35',
	'#E74C3C',
	'#E91E63',
	'#FF4081',
	'#FF69B4',
	'#A855F7',
	'#9C27B0',
	'#7B68EE',
	'#3F51B5',
	'#5C6BC0',
	'#42A5F5',
	'#2196F3',
	'#00BCD4',
	'#26A69A',
	'#009688',
	'#4CAF50',
	'#FFD700',
	'#FF9800',
	'#FF5722',
	'#8D6E63',
	'#795548',
	'#78909C',
	'#607D8B',
	'#455A64'
];

const AddCategoryScreen = () => {
	const accent = useAccent();
	const { title, setTitle, emoji, setEmoji, color, setColor, isValid, save } = useAddCategory();

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
								placeholder="e.g. Streaming"
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
						<EmojiField value={emoji} onChangeText={setEmoji} placeholder="🎬" maxLength={4} />
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
			</Root>
		</>
	);
};

export default AddCategoryScreen;
