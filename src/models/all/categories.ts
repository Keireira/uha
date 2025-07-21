import { asc } from 'drizzle-orm';
import { createEffect, createEvent, createStore, sample } from 'effector';

import { categoriesTable } from '@db/schema';
import type { CategoryT, DBT } from '@models/app-model.d';

const createCategoriesModel = ({ db }: { db: DBT }) => {
	const $categories = createStore<CategoryT[]>([]);
	const getCategoriesFx = createEffect(async () => {
		const categories = await db.select().from(categoriesTable).orderBy(asc(categoriesTable.title));

		return categories;
	});
	const setCategories = createEvent<CategoryT[]>();

	sample({
		clock: getCategoriesFx.doneData,
		target: $categories
	});

	sample({
		clock: setCategories,
		fn: (categories) => {
			db.insert(categoriesTable).values(categories);

			return categories;
		},
		target: $categories
	});

	getCategoriesFx();

	return {
		$categories,
		setCategories
	};
};

export default createCategoriesModel;
