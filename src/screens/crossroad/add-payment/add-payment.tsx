import React, { useMemo } from 'react';
import { Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SymbolView } from 'expo-symbols';
import { EmojiPicker, ColorPicker } from '@elements';
import { colorMix, isTextDark } from '@lib/color-utils';
import useAddPayment from './use-add-payment';
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
	SwitchRow,
	SwitchLabel,
	CommentInput,
	SaveButton,
	SaveLabel
} from './add-payment.styles';

const AddPaymentScreen = () => {
	const theme = useTheme();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { title, setTitle, emoji, setEmoji, color, setColor, isCard, setIsCard, comment, setComment, isValid, save } =
		useAddPayment();

	const dark = useMemo(() => isTextDark(color), [color]);
	const previewBg = useMemo(() => colorMix(color, theme.background.default, 0.5), [color, theme.background.default]);
	const iconColor = dark ? '#333333' : '#ffffff';

	return (
		<Container
			style={{ backgroundColor: color }}
			contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 24, gap: 24, paddingBottom: insets.bottom + 24 }}
		>
				<Header>
					<Title $dark={dark}>New Payment</Title>
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
					placeholder="Payment name"
					placeholderTextColor={dark ? 'rgba(51,51,51,0.35)' : 'rgba(255,255,255,0.35)'}
					autoFocus
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

					<Section>
						<Caption $dark={dark}>Type</Caption>
						<SwitchRow>
							<SwitchLabel $dark={dark}>Card</SwitchLabel>
							<Switch
								value={isCard}
								onValueChange={setIsCard}
								trackColor={{
									false: 'rgba(255,255,255,0.15)',
									true: 'rgba(255,255,255,0.4)'
								}}
								thumbColor="#ffffff"
							/>
						</SwitchRow>
					</Section>

					<Section>
						<Caption $dark={dark}>Comment</Caption>
						<CommentInput
							$dark={dark}
							value={comment}
							onChangeText={setComment}
							placeholder="*1234"
							placeholderTextColor={dark ? 'rgba(51,51,51,0.3)' : 'rgba(255,255,255,0.3)'}
						/>
					</Section>
				</Main>

				<SaveButton $disabled={!isValid} disabled={!isValid} onPress={save}>
					<SaveLabel $dark={dark}>Create</SaveLabel>
				</SaveButton>
		</Container>
	);
};

export default AddPaymentScreen;
