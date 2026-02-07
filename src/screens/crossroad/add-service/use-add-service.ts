import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { like, or } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import db from '@db';
import { servicesTable, categoriesTable } from '@db/schema';

const useAddService = () => {
	const router = useRouter();

	const [search, setSearch] = useState('');
	const [mode, setMode] = useState<'search' | 'create'>('search');

	// Custom creation fields
	const [title, setTitle] = useState('');
	const [color, setColor] = useState('#ff9f0a');
	const [selectedCategoryId, setSelectedCategoryId] = useState('');
	const [showColorPicker, setShowColorPicker] = useState(false);

	// Load categories for picker
	const { data: categories } = useLiveQuery(db.select().from(categoriesTable));

	// Search existing services
	const pattern = `%${search}%`;
	const { data: searchResults } = useLiveQuery(
		db
			.select()
			.from(servicesTable)
			.where(or(like(servicesTable.title, pattern), like(servicesTable.slug, pattern))),
		[search]
	);

	const filteredResults = useMemo(() => {
		if (!search.trim()) return [];
		return searchResults ?? [];
	}, [search, searchResults]);

	const isValid = title.trim().length > 0 && color.length > 0 && selectedCategoryId.length > 0;

	const switchToCreate = () => {
		setMode('create');
		setTitle(search);
	};

	const save = async () => {
		if (!isValid) return;

		const trimmedTitle = title.trim();

		await db.insert(servicesTable).values({
			id: Crypto.randomUUID(),
			slug: trimmedTitle.toLowerCase().replace(/\s+/g, '-'),
			title: trimmedTitle,
			color,
			aliases: [],
			category_id: selectedCategoryId
		});

		router.back();
	};

	return {
		search,
		setSearch,
		mode,
		setMode,
		title,
		setTitle,
		color,
		setColor,
		selectedCategoryId,
		setSelectedCategoryId,
		showColorPicker,
		setShowColorPicker,
		categories: categories ?? [],
		filteredResults,
		isValid,
		switchToCreate,
		save
	};
};

export default useAddService;
