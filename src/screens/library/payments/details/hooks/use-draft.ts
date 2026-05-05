import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import useEditPaymentStore from '../../hooks/use-edit-payment';

import * as ImagePicker from 'expo-image-picker';

import type { TenderT } from '@models';
import type { SFSymbol } from 'expo-symbols';
import type { PaymentEditParams } from '@screens/library/payments';

const normalizePaymentDraft = (payment: TenderT): PaymentEditParams => ({
	title: payment.title || '',
	comment: payment.comment || '',
	is_card: payment.is_card,

	color: payment.color || '',
	emoji: payment.emoji || '',
	symbol: payment.symbol as SFSymbol | null,
	logo_url: payment.logo_url || ''
});

const useDraft = (payment?: TenderT) => {
	const initStore = useEditPaymentStore((state) => state.actions.init);
	const patch = useEditPaymentStore((state) => state.actions.patch);

	const draft = useEditPaymentStore(
		useShallow((state) => ({
			title: state.title,
			comment: state.comment,
			is_card: state.is_card,

			emoji: state.emoji,
			color: state.color,
			logo_url: state.logo_url,
			symbol: state.symbol
		}))
	);

	useEffect(() => {
		if (!payment) return;

		const normalized = normalizePaymentDraft(payment);
		initStore(normalized);
	}, [payment, initStore]);

	const onChangeComment = (comment: string) => patch({ comment });
	const onChangeIsCard = (is_card: boolean) => patch({ is_card });
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
		if (!payment) return;

		patch({ emoji: payment.initial_emoji || '' });
	};

	const resetToInitialSymbol = () => {
		if (!payment) return;

		patch({ symbol: payment.initial_symbol as SFSymbol });
	};

	const resetToInitialColor = () => {
		if (!payment) return;

		patch({ color: payment.initial_color || '' });
	};

	const resetToInitialLogoUrl = () => {
		if (!payment) return;

		patch({ logo_url: payment.initial_logo_url });
	};

	return {
		draft,
		actions: {
			onChangeTitle,
			onChangeEmoji,
			onChangeColor,
			onChangeComment,
			onChangeIsCard,
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
