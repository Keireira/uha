import { sql } from 'drizzle-orm';
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { categoriesTable } from './categories';

export const servicesTable = sqliteTable(
	'services',
	{
		id: text().primaryKey(), // uuid v4
		slug: text(), // adguard | spotify | ...
		title: text().notNull(), // Adguard | Spotify | ...
		color: text().notNull(), // #0000FF | #00FFFF | ...
		logo_url: text(), // optional logo url if we don't have a slug to display
		aliases: text({ mode: 'json' })
			.$type<string[]>()
			.default(sql`'[]'`)
			.notNull(), // ["адгард"]
		category_slug: text()
			.references(() => categoriesTable.slug)
			.notNull() // uuid v4
	},
	(table) => [index('services_category_slug_idx').on(table.category_slug), index('services_title_idx').on(table.title)]
);
