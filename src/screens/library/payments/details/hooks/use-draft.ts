import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { tendersTable } from '@db/schema';
import useEditPaymentStore from '../../hooks/use-edit-payment';

import * as ImagePicker from 'expo-image-picker';

import type { SFSymbol } from 'expo-symbols';
import type { PaymentEditParams } from '@screens/library/payments';

const normalizePaymentDraft = (payment: typeof tendersTable.$inferSelect): PaymentEditParams => ({
	title: payment.title || '',
	comment: payment.comment || '',
	is_card: payment.is_card,

	emoji: payment.emoji || '',
	color: payment.color || '',
	logo_url: payment.logo_url || '',
	symbol: payment.symbol as SFSymbol
});

const useDraft = (payment?: typeof tendersTable.$inferSelect) => {
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
	const resetSymbol = () => patch({ symbol: undefined });
	const resetLogoUrl = () => patch({ logo_url: undefined });

	return {
		draft,
		actions: {
			onChangeTitle,
			onChangeEmoji,
			onChangeColor,
			onChangeComment,
			onChangeIsCard,
			openImagePicker,
			resetSymbol,
			resetLogoUrl
		}
	};
};

export default useDraft;
