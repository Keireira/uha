import { sql } from 'drizzle-orm';
import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core';

import { categoriesTable } from './categories';

export const servicesTable = sqliteTable(
	'services',
	{
		id: text().primaryKey(), // uuid v4
		slug: text().unique().notNull(), // adguard | spotify | ...
		title: text().notNull(), // Adguard | Spotify | ...
		color: text().notNull(), // #0000FF | #00FFFF | ...
		aliases: text({ mode: 'json' })
			.$type<string[]>()
			.default(sql`'[]'`)
			.notNull(), // ["адгард"]
		category_id: text().references(() => categoriesTable.id) // uuid v4
	},
	(table) => [index('services_category_id_idx').on(table.category_id), index('services_title_idx').on(table.title)]
);
