import { useRouter } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { tendersTable } from '@db/schema';

import type { TenderT } from '@models';
import type { PaymentEditParams } from '@screens/library/payments';

const preparePaymentToSave = (draft: PaymentEditParams) => {
	return {
		title: draft.title.trim(),
		comment: draft.comment.trim(),
		is_card: draft.is_card,

		color: draft.color.trim(),
		emoji: draft.emoji || null,
		symbol: draft.symbol || null,
		logo_url: draft.logo_url?.trim() || null
	};
};

const useSavePayment = () => {
	const router = useRouter();

	const savePayment = async (initDraft: TenderT, draft: PaymentEditParams) => {
		const nextPayment = preparePaymentToSave(draft);

		try {
			await db.update(tendersTable).set(nextPayment).where(eq(tendersTable.id, initDraft.id));

			router.back();
		} catch (err) {
			console.warn('[payment-details] save failed:', err);
		}
	};

	return savePayment;
};

export default useSavePayment;
