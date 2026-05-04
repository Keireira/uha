import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { categoriesTable } from '@db/schema';
import useEditCategoryStore from '../../hooks/use-edit-category';

import * as ImagePicker from 'expo-image-picker';

import type { SFSymbol } from 'expo-symbols';
import type { CategoryEditParams } from '@screens/library/categories';

const normalizeCategoryDraft = (category: typeof categoriesTable.$inferSelect): CategoryEditParams => ({
	slug: category.slug || '',
	title: category.title || '',

	emoji: category.emoji || '',
	color: category.color || '',
	logo_url: category.logo_url || '',
	symbol: category.symbol as SFSymbol
});

const useDraft = (category?: typeof categoriesTable.$inferSelect) => {
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
	const resetSymbol = () => patch({ symbol: undefined });
	const resetLogoUrl = () => patch({ logo_url: undefined });

	return {
		draft,
		actions: {
			onChangeSlug,
			onChangeTitle,
			onChangeColor,
			onChangeEmoji,
			resetLogoUrl,
			resetSymbol,
			openImagePicker
		}
	};
};

export default useDraft;
