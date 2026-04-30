import React, { useEffect, useState } from 'react';
import { eq, asc } from 'drizzle-orm';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useAccent } from '@hooks';
import db from '@db';
import { categoriesTable, servicesTable } from '@db/schema';

import { normalizeOptional } from '../../common';

import { listStyle, scrollDismissesKeyboard, tag } from '@expo/ui/swift-ui/modifiers';
import { Host, List, Section, Text, TextField, Picker, Button } from '@expo/ui/swift-ui';

const ServiceDetails = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const settingAccent = useAccent();
	const { data } = useLiveQuery(db.select().from(servicesTable).where(eq(servicesTable.id, id)).limit(1), [id]);
	const { data: categories } = useLiveQuery(db.select().from(categoriesTable).orderBy(asc(categoriesTable.title)));
	const service = data?.[0];

	const [title, setTitle] = useState('');
	const [slug, setSlug] = useState('');
	const [color, setColor] = useState('');
	const [logoUrl, setLogoUrl] = useState('');
	const [symbol, setSymbol] = useState('');
	const [categorySlug, setCategorySlug] = useState('');

	useEffect(() => {
		if (!service) return;
		setTitle(service.title);
		setSlug(service.slug ?? '');
		setColor(service.color);
		setLogoUrl(service.logo_url ?? '');
		setSymbol(service.symbol ?? '');
		setCategorySlug(service.category_slug);
	}, [service]);

	const save = async () => {
		if (!service || !title.trim() || !color.trim() || !categorySlug) return;

		await db
			.update(servicesTable)
			.set({
				title: title.trim(),
				slug: normalizeOptional(slug),
				color: color.trim(),
				logo_url: normalizeOptional(logoUrl),
				symbol: normalizeOptional(symbol),
				category_slug: categorySlug
			})
			.where(eq(servicesTable.id, service.id));
	};

	return (
		<>
			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={save} tintColor={settingAccent} />
			</Stack.Toolbar>
			<Host style={{ flex: 1 }}>
				<List modifiers={[listStyle('insetGrouped'), scrollDismissesKeyboard('immediately')]}>
					<Section title="Service">
						<TextField
							key={`title-${service?.id ?? 'new'}`}
							defaultValue={service?.title ?? title}
							placeholder="Title"
							onValueChange={setTitle}
						/>
						<TextField
							key={`slug-${service?.id ?? 'new'}`}
							defaultValue={service?.slug ?? slug}
							placeholder="Slug"
							onValueChange={setSlug}
						/>
						<TextField
							key={`color-${service?.id ?? 'new'}`}
							defaultValue={service?.color ?? color}
							placeholder="Color"
							onValueChange={setColor}
						/>
					</Section>
					<Section title="Logo">
						<TextField
							key={`logo-${service?.id ?? 'new'}`}
							defaultValue={service?.logo_url ?? logoUrl}
							placeholder="Logo URL"
							onValueChange={setLogoUrl}
						/>
						<TextField
							key={`symbol-${service?.id ?? 'new'}`}
							defaultValue={service?.symbol ?? symbol}
							placeholder="SF Symbol"
							onValueChange={setSymbol}
						/>
					</Section>
					<Section title="Category">
						<Picker label="Category" selection={categorySlug} onSelectionChange={setCategorySlug}>
							{(categories ?? []).map((category) => (
								<Text key={category.slug} modifiers={[tag(category.slug)]}>
									{category.title ?? category.slug}
								</Text>
							))}
						</Picker>
					</Section>
					<Section>
						<Button label="Save" onPress={save} />
					</Section>
				</List>
			</Host>
		</>
	);
};

export default ServiceDetails;
