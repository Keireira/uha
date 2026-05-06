import React, { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';

import db from '@db';
import { tendersTable } from '@db/schema';
import { useAccent } from '@hooks';
import { DiscardChangesConfirmation, useDiscardChangesConfirmation } from '@elements';
import useEditPaymentStore from '../hooks/use-edit-payment';

import {
	font,
	listStyle,
	listRowSeparator,
	listRowBackground,
	listSectionSpacing,
	scrollDismissesKeyboard
} from '@expo/ui/swift-ui/modifiers';
import { Host, List, Section, ColorPicker, Text } from '@expo/ui/swift-ui';
import { LogoPreview, Title, Comment, CardToggle, Emoji, LogoUrl, Symbol } from '../details/components';

import type { PaymentEditParams } from '../types.d';

const normalizePayment = (draft: PaymentEditParams) => {
	const title = draft.title.trim();
	const color = draft.color.trim();
	const logoUrl = draft.logo_url?.trim() || null;

	if (!(title && color)) return null;

	return {
		id: Crypto.randomUUID(),
		title,
		comment: draft.comment.trim(),
		is_card: draft.is_card,
		color,
		emoji: draft.emoji || null,
		symbol: draft.symbol || null,
		logo_url: logoUrl,
		initial_color: color,
		initial_emoji: draft.emoji || null,
		initial_symbol: draft.symbol || null,
		initial_logo_url: logoUrl
	};
};

const AddPayment = () => {
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const didInitRef = useRef(false);

	const init = useEditPaymentStore((state) => state.actions.init);
	const patch = useEditPaymentStore((state) => state.actions.patch);
	const reset = useEditPaymentStore((state) => state.actions.reset);
	const discardConfirmation = useDiscardChangesConfirmation({
		onDiscard: reset
	});
	const draft = useEditPaymentStore(
		useShallow((state) => ({
			title: state.title,
			comment: state.comment,
			is_card: state.is_card,
			color: state.color,
			emoji: state.emoji,
			symbol: state.symbol,
			logo_url: state.logo_url
		}))
	);

	useEffect(() => {
		if (didInitRef.current) return;

		init({
			title: '',
			comment: '',
			is_card: true,
			color: settingAccent,
			emoji: null,
			symbol: 'creditcard',
			logo_url: null
		});
		didInitRef.current = true;
	}, [init, settingAccent]);

	const closeModal = () => discardConfirmation.requestClose();
	const canSave = Boolean(normalizePayment(draft));

	const save = async () => {
		const payment = normalizePayment(draft);
		if (!payment) return;

		await db.insert(tendersTable).values(payment);
		reset();
		discardConfirmation.closeWithoutConfirmation();
	};

	const resetEmoji = () => patch({ emoji: '' });
	const resetSymbol = () => patch({ symbol: undefined });
	const resetLogoUrl = () => patch({ logo_url: undefined });
	const openImagePicker = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
			exif: false,
			shouldDownloadFromNetwork: true
		});

		if (result.canceled || !result.assets.length) return;

		const [asset] = result.assets;
		patch({ logo_url: asset.uri });
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button variant="plain" icon="xmark" onPress={closeModal} />
			</Stack.Toolbar>

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button
					variant="done"
					icon="checkmark"
					onPress={save}
					tintColor={settingAccent}
					disabled={!canSave}
				/>
			</Stack.Toolbar>

			<Host style={{ flex: 1 }}>
				<>
					<List modifiers={[listStyle('insetGrouped'), scrollDismissesKeyboard('immediately')]}>
						<Section modifiers={[listRowBackground('transparent'), listRowSeparator('hidden'), listSectionSpacing(0)]}>
							<LogoPreview {...draft} />
						</Section>

						<Section title={t('library.details.section.identity')}>
							<Title title={draft.title} onChangeTitle={(title) => patch({ title })} />
							<Comment comment={draft.comment} onChangeComment={(comment) => patch({ comment })} />
							<CardToggle isCard={draft.is_card} onChangeIsCard={(is_card) => patch({ is_card })} />
						</Section>

						<Section
							title={t('library.details.section.appearance')}
							footer={
								<Text modifiers={[font({ size: 12, weight: 'regular', design: 'rounded' })]}>
									Swipe left clears one.
								</Text>
							}
						>
							<Emoji
								emoji={draft.emoji}
								onChangeEmoji={(emoji) => patch({ emoji: emoji.slice(-8) })}
								resetEmoji={resetEmoji}
								resetToInitialEmoji={resetEmoji}
							/>
							<LogoUrl
								logoUrl={draft.logo_url}
								openImagePicker={openImagePicker}
								resetLogoUrl={resetLogoUrl}
								resetToInitialLogoUrl={resetLogoUrl}
							/>
							<Symbol
								symbol={draft.symbol}
								color={draft.color}
								resetSymbol={resetSymbol}
								resetToInitialSymbol={resetSymbol}
							/>
							<ColorPicker
								label={t('library.details.fields.color')}
								selection={draft.color}
								onSelectionChange={(color) => patch({ color })}
								supportsOpacity={false}
							/>
						</Section>
					</List>

					<DiscardChangesConfirmation
						title="Are you sure you want to discard this new payment method?"
						isPresented={discardConfirmation.isPresented}
						onIsPresentedChange={discardConfirmation.setIsPresented}
						onDiscard={discardConfirmation.discard}
					/>
				</>
			</Host>
		</>
	);
};

export default AddPayment;
