import { useRouter } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { categoriesTable, subscriptionsTable } from '@db/schema';

import type { CategoryT } from '@models';
import type { CategoryEditParams } from '@screens/library/categories';

const prepareCategoryToSave = (draft: CategoryEditParams) => {
	const slug = draft.slug.trim();

	if (!slug) {
		return;
	}

	return {
		slug,
		title: draft.title.trim(),
		color: draft.color.trim(),
		emoji: draft.emoji || null,
		symbol: draft.symbol || null,
		logo_url: draft.logo_url?.trim() || null
	};
};

const useSaveCategory = () => {
	const router = useRouter();

	const saveCategory = async (category: CategoryT, draft: CategoryEditParams) => {
		const nextCategory = prepareCategoryToSave(draft);

		if (!nextCategory) {
			return;
		}

		const { slug: nextSlug, ...dataToUpdate } = nextCategory;

		try {
			if (nextSlug === category.slug) {
				await db.update(categoriesTable).set(dataToUpdate).where(eq(categoriesTable.slug, category.slug));
			} else {
				await db.transaction(async (tx) => {
					await tx
						.update(subscriptionsTable)
						.set({ category_slug: nextSlug })
						.where(eq(subscriptionsTable.category_slug, category.slug));

					await tx
						.update(categoriesTable)
						.set({
							slug: nextSlug,
							...dataToUpdate
						})
						.where(eq(categoriesTable.slug, category.slug));
				});
			}

			router.back();
		} catch (err) {
			console.warn('[category-details] save failed:', err);
		}
	};

	return saveCategory;
};

export default useSaveCategory;
