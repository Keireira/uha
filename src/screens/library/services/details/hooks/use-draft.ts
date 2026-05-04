import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import useEditServiceStore from '../../hooks/use-edit-service';

import * as ImagePicker from 'expo-image-picker';

import type { ServiceT } from '@models';
import type { SFSymbol } from 'expo-symbols';
import type { ServiceEditParams } from '@screens/library/services';

const normalizeServiceDraft = (service: ServiceT): ServiceEditParams => ({
	slug: service.slug || '',
	title: service.title || '',
	color: service.color || '',
	bundle_id: service.bundle_id || '',
	category_slug: service.category_slug || '',
	aliases: service.aliases || [],

	emoji: service.emoji || undefined,
	symbol: (service.symbol as SFSymbol | '') || undefined,
	logo_url: service.logo_url || undefined
});

const useDraft = (service?: ServiceT) => {
	const initStore = useEditServiceStore((state) => state.actions.init);
	const patch = useEditServiceStore((state) => state.actions.patch);

	const draft = useEditServiceStore(
		useShallow((state) => ({
			slug: state.slug,
			title: state.title,
			color: state.color,
			bundle_id: state.bundle_id,
			category_slug: state.category_slug,
			aliases: state.aliases,

			emoji: state.emoji,
			symbol: state.symbol,
			logo_url: state.logo_url
		}))
	);

	useEffect(() => {
		if (!service) return;

		const normalized = normalizeServiceDraft(service);
		initStore(normalized);
	}, [service, initStore]);

	const onChangeSlug = (slug: string) => patch({ slug });
	const onChangeTitle = (title: string) => patch({ title });
	const onChangeColor = (color: string) => patch({ color });
	const onChangeBundleId = (bundle_id: string) => patch({ bundle_id });
	const onChangeEmoji = (emoji: string) => patch({ emoji: emoji.slice(-8) });
	const onChangeAliases = (aliases: string[]) => patch({ aliases });

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

	/* Initial resets */
	const resetToInitialEmoji = () => {
		if (!service) return;

		patch({ emoji: service.initial_emoji || undefined });
	};

	const resetToInitialSymbol = () => {
		if (!service) return;

		patch({ symbol: (service.initial_symbol as SFSymbol) || undefined });
	};

	const resetToInitialColor = () => {
		if (!service) return;

		patch({ color: service.initial_color || '' });
	};

	const resetToInitialLogoUrl = () => {
		if (!service) return;

		patch({ logo_url: service.initial_logo_url || undefined });
	};

	return {
		draft,
		actions: {
			onChangeSlug,
			onChangeTitle,
			onChangeColor,
			onChangeBundleId,
			onChangeEmoji,
			openImagePicker,
			resetLogoUrl,
			onChangeAliases,
			resetSymbol,

			resetToInitialEmoji,
			resetToInitialSymbol,
			resetToInitialColor,
			resetToInitialLogoUrl
		}
	};
};

export default useDraft;
