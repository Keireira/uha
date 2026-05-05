import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import useEditCategoryStore from '../../hooks/use-edit-category';

import * as ImagePicker from 'expo-image-picker';

import type { CategoryT } from '@models';
import type { SFSymbol } from 'expo-symbols';
import type { CategoryEditParams } from '@screens/library/categories';

const normalizeCategoryDraft = (category: CategoryT): CategoryEditParams => ({
	slug: category.slug || '',
	title: category.title || '',

	color: category.color || '',
	emoji: category.emoji || '',
	symbol: category.symbol as SFSymbol | null,
	logo_url: category.logo_url || ''
});

const useDraft = (category?: CategoryT) => {
	const initStore = useEditCategoryStore((state) => state.actions.init);
	const patch = useEditCategoryStore((state) => state.actions.patch);

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
		if (!category) return;

		const normalized = normalizeCategoryDraft(category);
		initStore(normalized);
	}, [category, initStore]);

	const onChangeSlug = (slug: string) => patch({ slug });
	const onChangeTitle = (title: string) => patch({ title });
	const onChangeColor = (color: string) => patch({ color });
	const onChangeEmoji = (emoji: string) => patch({ emoji: emoji.slice(-8) });
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

	/* Reset actions */
	const resetEmoji = () => patch({ emoji: '' });
	const resetSymbol = () => patch({ symbol: undefined });
	const resetLogoUrl = () => patch({ logo_url: undefined });

	/* Initial resets */
	const resetToInitialEmoji = () => {
		if (!category) return;

		patch({ emoji: category.initial_emoji || '' });
	};

	const resetToInitialSymbol = () => {
		if (!category) return;

		patch({ symbol: category.initial_symbol as SFSymbol });
	};

	const resetToInitialColor = () => {
		if (!category) return;

		patch({ color: category.initial_color || '' });
	};

	const resetToInitialLogoUrl = () => {
		if (!category) return;

		patch({ logo_url: category.initial_logo_url });
	};

	return {
		draft,
		actions: {
			onChangeSlug,
			onChangeTitle,
			onChangeColor,
			onChangeEmoji,
			openImagePicker,

			resetEmoji,
			resetSymbol,
			resetLogoUrl,

			resetToInitialEmoji,
			resetToInitialSymbol,
			resetToInitialColor,
			resetToInitialLogoUrl
		}
	};
};

export default useDraft;
