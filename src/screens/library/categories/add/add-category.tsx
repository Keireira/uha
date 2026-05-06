import React, { useEffect, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useTheme } from 'styled-components/native';
import * as ImagePicker from 'expo-image-picker';

import db from '@db';
import { categoriesTable } from '@db/schema';
import { useAccent } from '@hooks';
import { DiscardChangesConfirmation, useDiscardChangesConfirmation } from '@elements';
import useEditCategoryStore from '../hooks/use-edit-category';

import {
	font,
	foregroundStyle,
	listStyle,
	listRowSeparator,
	listRowBackground,
	listSectionSpacing,
	multilineTextAlignment,
	scrollDismissesKeyboard
} from '@expo/ui/swift-ui/modifiers';
import { Host, List, Section, ColorPicker, Text, TextField, LabeledContent } from '@expo/ui/swift-ui';
import { LogoPreview, Title, Emoji, LogoUrl, Symbol } from '../details/components';

import type { CategoryEditParams } from '../types.d';

const slugify = (value: string) =>
	value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const normalizeCategory = (draft: CategoryEditParams) => {
	const title = draft.title.trim();
	const slug = slugify(draft.slug || title);
	const color = draft.color.trim();

	if (!(title && slug && color)) return null;

	return {
		slug,
		title,
		is_system: false,
		color,
		emoji: draft.emoji || null,
		symbol: draft.symbol || null,
		logo_url: draft.logo_url?.trim() || null,
		initial_color: color,
		initial_emoji: draft.emoji || null,
		initial_symbol: draft.symbol || null,
		initial_logo_url: draft.logo_url?.trim() || null
	};
};

const AddCategory = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const didInitRef = useRef(false);
	const didEditSlugRef = useRef(false);
	const autoSlugRef = useRef('');
	const [slugInputKey, setSlugInputKey] = useState(0);

	const init = useEditCategoryStore((state) => state.actions.init);
	const patch = useEditCategoryStore((state) => state.actions.patch);
	const reset = useEditCategoryStore((state) => state.actions.reset);
	const discardConfirmation = useDiscardChangesConfirmation({
		onDiscard: reset
	});
	const draft = useEditCategoryStore(
		useShallow((state) => ({
			slug: state.slug,
			title: state.title,
			color: state.color,
			emoji: state.emoji,
			symbol: state.symbol,
			logo_url: state.logo_url
		}))
	);

	useEffect(() => {
		if (didInitRef.current) return;

		init({
			slug: '',
			title: '',
			color: settingAccent,
			emoji: null,
			symbol: 'square.grid.2x2',
			logo_url: null
		});
		didInitRef.current = true;
	}, [init, settingAccent]);

	const closeModal = () => discardConfirmation.requestClose();
	const canSave = Boolean(normalizeCategory(draft));

	const onChangeSlug = (slug: string) => {
		if (!didEditSlugRef.current && slug === autoSlugRef.current) {
			patch({ slug });
			return;
		}

		didEditSlugRef.current = true;
		patch({ slug });
	};

	const onChangeTitle = (title: string) => {
		if (didEditSlugRef.current) {
			patch({ title });
			return;
		}

		const slug = slugify(title);
		autoSlugRef.current = slug;
		patch({ title, slug });
		setSlugInputKey((key) => key + 1);
	};

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

	const save = async () => {
		const category = normalizeCategory(draft);
		if (!category) return;

		await db.insert(categoriesTable).values(category);
		reset();
		discardConfirmation.closeWithoutConfirmation();
	};

	const resetEmoji = () => patch({ emoji: '' });
	const resetSymbol = () => patch({ symbol: undefined });
	const resetLogoUrl = () => patch({ logo_url: undefined });

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
							<LabeledContent label={t('library.details.fields.slug')}>
								<TextField
									key={`slug-${slugInputKey}`}
									defaultValue={draft.slug}
									placeholder={t('library.details.placeholders.slug')}
									onValueChange={onChangeSlug}
									modifiers={[
										multilineTextAlignment('trailing'),
										foregroundStyle(theme.text.secondary),
										font({ size: 16, weight: 'regular', design: 'rounded' })
									]}
								/>
							</LabeledContent>
							<Title title={draft.title} onChangeTitle={onChangeTitle} />
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
						title="Are you sure you want to discard this new category?"
						isPresented={discardConfirmation.isPresented}
						onIsPresentedChange={discardConfirmation.setIsPresented}
						onDiscard={discardConfirmation.discard}
					/>
				</>
			</Host>
		</>
	);
};

export default AddCategory;
