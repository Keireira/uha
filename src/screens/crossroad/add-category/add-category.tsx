import React, { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SymbolView } from 'expo-symbols';
import { EmojiPicker, ColorPicker } from '@elements';
import { colorMix, isTextDark } from '@lib/color-utils';
import useAddCategory from './use-add-category';
import {
	Container,
	Header,
	Title,
	CloseGlass,
	CloseInner,
	Preview,
	PreviewEmoji,
	PreviewPlaceholder,
	NameInput,
	Main,
	Section,
	Caption,
	SaveButton,
	SaveLabel
} from './add-category.styles';

const AddCategoryScreen = () => {
	const theme = useTheme();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { title, setTitle, emoji, setEmoji, color, setColor, isValid, save } = useAddCategory();

	const dark = useMemo(() => isTextDark(color), [color]);
	const previewBg = useMemo(() => colorMix(color, theme.background.default, 0.5), [color, theme.background.default]);
	const iconColor = dark ? '#333333' : '#ffffff';

	return (
		<Container
			style={{ backgroundColor: color }}
			contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 24, gap: 24, paddingBottom: insets.bottom + 24 }}
		>
				<Header>
					<Title $dark={dark}>New Category</Title>
					<CloseGlass isInteractive>
						<CloseInner onPress={() => router.back()} hitSlop={10}>
							<SymbolView name="xmark" size={16} weight="bold" tintColor={iconColor} />
						</CloseInner>
					</CloseGlass>
				</Header>

				<Preview $bg={previewBg}>
					{emoji ? <PreviewEmoji>{emoji}</PreviewEmoji> : <PreviewPlaceholder $dark={dark}>?</PreviewPlaceholder>}
				</Preview>

				<NameInput
					$dark={dark}
					value={title}
					onChangeText={setTitle}
					placeholder="Category name"
					placeholderTextColor={dark ? 'rgba(51,51,51,0.35)' : 'rgba(255,255,255,0.35)'}
				/>

				<Main>
					<Section>
						<Caption $dark={dark}>Logo Emoji</Caption>
						<EmojiPicker color={color} selected={emoji} onSelect={setEmoji} />
					</Section>

					<Section>
						<Caption $dark={dark}>Support Color</Caption>
						<ColorPicker value={color} onSelect={setColor} />
					</Section>
				</Main>

				<SaveButton $disabled={!isValid} disabled={!isValid} onPress={save}>
					<SaveLabel $dark={dark}>Create</SaveLabel>
				</SaveButton>
		</Container>
	);
};

export default AddCategoryScreen;
