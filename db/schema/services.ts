import { sql } from 'drizzle-orm';
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { categoriesTable } from './categories';

export const servicesTable = sqliteTable(
	'services',
	{
		id: text().primaryKey(), // uuid v4
		bundle_id: text(), // com.slug.root
		slug: text(), // adguard | spotify | ...
		title: text().notNull(), // Adguard | Spotify | ...
		domains: text({ mode: 'json' })
			.$type<string[]>()
			.default(sql`'[]'`),
		social_links: text({ mode: 'json' })
			.$type<Record<string, string>>()
			.default(sql`'{}'`),
		aliases: text({ mode: 'json' })
			.$type<string[]>()
			.default(sql`'[]'`)
			.notNull(), // ["адгард"] (result.alternative_names)
		category_slug: text()
			.references(() => categoriesTable.slug)
			.notNull(), // uuid v4

		emoji: text(), // 🍔 | 🚗 | ...
		color: text().notNull(), // #FF0000 | #00FF00 | ...
		symbol: text(), // SF Symbol name
		logo_url: text(), // URL of the logo

		initial_emoji: text(),
		initial_color: text(),
		initial_symbol: text(),
		initial_logo_url: text()
	},
	(table) => [index('services_category_slug_idx').on(table.category_slug), index('services_title_idx').on(table.title)]
);
