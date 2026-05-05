import { useRouter } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { servicesTable } from '@db/schema';

import { normalizeOptional } from '@screens/library/shared';

import type { ServiceT } from '@models';
import type { ServiceEditParams } from '@screens/library/services';

const prepareServiceToSave = (draft: ServiceEditParams) => {
	const title = draft.title.trim();
	const color = draft.color.trim();

	if (!title || !color || !draft.category_slug) {
		return;
	}

	return {
		title,
		color,
		slug: normalizeOptional(draft.slug),
		bundle_id: normalizeOptional(draft.bundle_id),
		category_slug: draft.category_slug,
		aliases: draft.aliases,
		emoji: normalizeOptional(draft.emoji || ''),
		symbol: normalizeOptional(draft.symbol || ''),
		logo_url: normalizeOptional(draft.logo_url || '')
	};
};

const useSaveService = () => {
	const router = useRouter();

	const saveService = async (service: ServiceT, draft: ServiceEditParams) => {
		const nextService = prepareServiceToSave(draft);

		if (!nextService) {
			return;
		}

		try {
			await db.update(servicesTable).set(nextService).where(eq(servicesTable.id, service.id));

			router.back();
		} catch (err) {
			console.warn('[service-details] save failed:', err);
		}
	};

	return saveService;
};

export default useSaveService;
