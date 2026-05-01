import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import db from '@db';
import { asc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { categoriesTable, servicesTable } from '@db/schema';

import { useAccent } from '@hooks';
import { withAlpha } from '@lib/colors';
import { normalizeOptional } from '../../common';

import {
	tag,
	font,
	padding,
	listStyle,
	lineLimit,
	onSubmit,
	submitLabel,
	onTapGesture,
	truncationMode,
	foregroundStyle,
	onLongPressGesture,
	scrollDismissesKeyboard,
	multilineTextAlignment
} from '@expo/ui/swift-ui/modifiers';
import { swipeActions } from '@modules/expo-ui-modifiers';
import {
	Host,
	Text,
	List,
	HStack,
	VStack,
	Image,
	Picker,
	Button,
	Section,
	TextField,
	ContextMenu,
	ColorPicker,
	LabeledContent
} from '@expo/ui/swift-ui';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';

const ServiceDetails = () => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const { id } = useLocalSearchParams<{ id: string }>();

	const {
		data: [service]
	} = useLiveQuery(db.select().from(servicesTable).where(eq(servicesTable.id, id)).limit(1), [id]);
	const { data: categories = [] } = useLiveQuery(db.select().from(categoriesTable).orderBy(asc(categoriesTable.title)));

	const [slug, setSlug] = useState('');
	const [title, setTitle] = useState('');
	const [color, setColor] = useState('');
	const [logoUrl, setLogoUrl] = useState('');
	const [symbol, setSymbol] = useState('');
	const [bundleId, setBundleId] = useState('');
	const [refLink, setRefLink] = useState('');
	const [categorySlug, setCategorySlug] = useState('');
	const [aliases, setAliases] = useState<string[]>([]);
	const [aliasDraft, setAliasDraft] = useState('');
	const [aliasInputKey, setAliasInputKey] = useState(0);
	const [isSlugEditable, setIsSlugEditable] = useState(false);
	const [isLogoEditable, setIsLogoEditable] = useState(false);
	const [isRefEditable, setIsRefEditable] = useState(false);

	useEffect(() => {
		if (!service) return;

		setTitle(service.title);
		setSlug(service.slug ?? '');
		setColor(service.color);
		setLogoUrl(service.logo_url ?? '');
		setSymbol(service.symbol ?? '');
		setBundleId(service.bundle_id ?? '');
		setRefLink(service.ref_link ?? '');
		setCategorySlug(service.category_slug);
		setAliases(service.aliases ?? []);
	}, [service]);

	const addAlias = () => {
		const value = aliasDraft.trim();
		if (!value || aliases.includes(value)) {
			setAliasDraft('');
			setAliasInputKey((n) => n + 1);
			return;
		}
		setAliases([...aliases, value]);
		setAliasDraft('');
		setAliasInputKey((n) => n + 1);
	};

	const removeAlias = (alias: string) => () => {
		setAliases((current) => current.filter((a) => a !== alias));
	};

	const enableSlugEdit = () => setIsSlugEditable(true);
	const enableLogoEdit = () => setIsLogoEditable(true);
	const enableRefEdit = () => setIsRefEditable(true);

	const copyId = () => {
		if (!service) return;

		Clipboard.setString(service.id);

		Toast.show({
			type: 'success',
			text1: t('library.details.id_copied'),
			text2: service.id
		});
	};

	const copyText = (value: string) => () => {
		if (!value) return;
		Clipboard.setString(value);
		Toast.show({ type: 'success', text1: t('library.details.copied'), text2: value });
	};

	const save = async () => {
		if (!service) return;

		const nextTitle = title.trim();
		const nextColor = color.trim();
		if (!nextTitle || !nextColor || !categorySlug) return;

		try {
			await db
				.update(servicesTable)
				.set({
					title: nextTitle,
					slug: normalizeOptional(slug),
					color: nextColor,
					logo_url: normalizeOptional(logoUrl),
					symbol: normalizeOptional(symbol),
					bundle_id: normalizeOptional(bundleId),
					ref_link: normalizeOptional(refLink),
					category_slug: categorySlug,
					aliases
				})
				.where(eq(servicesTable.id, service.id));

			router.back();
		} catch (err) {
			console.warn('[service-details] save failed:', err);
		}
	};

	if (!service) return null;

	const labelMods = [font({ size: 16, weight: 'regular' })];
	const valueMods = [
		multilineTextAlignment('trailing'),
		foregroundStyle(theme.text.secondary),
		font({ size: 16, weight: 'regular' })
	];

	const idValueMods = [
		multilineTextAlignment('trailing'),
		foregroundStyle(theme.text.secondary),
		font({ size: 13, design: 'monospaced', weight: 'regular' }),
		lineLimit(1),
		truncationMode('middle')
	];

	return (
		<>
			<Stack.Screen options={{ title: title || service.title }} />

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={save} tintColor={settingAccent} />
			</Stack.Toolbar>

			<Host style={{ flex: 1 }}>
				<List modifiers={[listStyle('insetGrouped'), scrollDismissesKeyboard('immediately')]}>
					<Section title={t('library.details.section.identity')}>
						<LabeledContent label={t('library.details.fields.id')} modifiers={[onTapGesture(copyId)]}>
							<HStack spacing={6}>
								<Text modifiers={idValueMods}>{service.id}</Text>
								<Image systemName="doc.on.doc" size={13} color={withAlpha(settingAccent, 0.6)} />
							</HStack>
						</LabeledContent>

						{isSlugEditable ? (
							<LabeledContent label={t('library.details.fields.slug')}>
								<TextField
									autoFocus
									defaultValue={slug}
									placeholder="slug"
									onValueChange={setSlug}
									modifiers={valueMods}
								/>
							</LabeledContent>
						) : (
							<LabeledContent label={t('library.details.fields.slug')} modifiers={[onLongPressGesture(enableSlugEdit)]}>
								<Text modifiers={valueMods}>{slug || '—'}</Text>
							</LabeledContent>
						)}

						<LabeledContent label={t('library.details.fields.title')} modifiers={labelMods}>
							<TextField
								defaultValue={service?.title ?? ''}
								placeholder=""
								onValueChange={setTitle}
								modifiers={valueMods}
							/>
						</LabeledContent>

						<Picker
							label={t('library.details.fields.category')}
							selection={categorySlug}
							onSelectionChange={setCategorySlug}
						>
							{categories.map((category) => (
								<Text key={category.slug} modifiers={[tag(category.slug)]}>
									{t(`category.${category.slug}`, { defaultValue: category.title ?? category.slug })}
								</Text>
							))}
						</Picker>
					</Section>

					<Section title={t('library.details.section.appearance')}>
						<ColorPicker
							label={t('library.details.fields.color')}
							selection={color ?? null}
							onSelectionChange={setColor}
							supportsOpacity={false}
						/>

						<LabeledContent label={t('library.details.fields.symbol')} modifiers={labelMods}>
							<TextField
								defaultValue={service.symbol ?? ''}
								placeholder="square.fill"
								onValueChange={setSymbol}
								modifiers={valueMods}
							/>
						</LabeledContent>

						{isLogoEditable ? (
							<LabeledContent label={t('library.details.fields.logo_url')} modifiers={labelMods}>
								<TextField
									autoFocus
									defaultValue={logoUrl}
									placeholder="https://…"
									onValueChange={setLogoUrl}
									onFocusChange={(focused) => !focused && setIsLogoEditable(false)}
									modifiers={valueMods}
								/>
							</LabeledContent>
						) : (
							<LabeledContent
								label={t('library.details.fields.logo_url')}
								modifiers={[onTapGesture(enableLogoEdit)]}
							>
								<ContextMenu>
									<ContextMenu.Trigger>
										<Text
											modifiers={[
												multilineTextAlignment('trailing'),
												foregroundStyle(theme.text.secondary),
												font({ size: 16, weight: 'regular' }),
												lineLimit(1),
												truncationMode('tail')
											]}
										>
											{logoUrl || '—'}
										</Text>
									</ContextMenu.Trigger>
									<ContextMenu.Preview>
										<VStack modifiers={[padding({ all: 14 })]}>
											<Text modifiers={[font({ size: 13, design: 'monospaced', weight: 'regular' })]}>
												{logoUrl || '—'}
											</Text>
										</VStack>
									</ContextMenu.Preview>
									<ContextMenu.Items>
										<Button
											label={t('library.details.copy')}
											systemImage="doc.on.doc"
											onPress={copyText(logoUrl)}
										/>
									</ContextMenu.Items>
								</ContextMenu>
							</LabeledContent>
						)}
					</Section>

					<Section title={t('library.details.section.other')}>
						<LabeledContent label={t('library.details.fields.bundle_id')} modifiers={labelMods}>
							<TextField
								defaultValue={service.bundle_id ?? ''}
								placeholder="com.example.app"
								onValueChange={setBundleId}
								modifiers={valueMods}
							/>
						</LabeledContent>

						{isRefEditable ? (
							<LabeledContent label={t('library.details.fields.ref_link')} modifiers={labelMods}>
								<TextField
									autoFocus
									defaultValue={refLink}
									placeholder="https://…"
									onValueChange={setRefLink}
									onFocusChange={(focused) => !focused && setIsRefEditable(false)}
									modifiers={valueMods}
								/>
							</LabeledContent>
						) : (
							<LabeledContent
								label={t('library.details.fields.ref_link')}
								modifiers={[onTapGesture(enableRefEdit)]}
							>
								<ContextMenu>
									<ContextMenu.Trigger>
										<Text
											modifiers={[
												multilineTextAlignment('trailing'),
												foregroundStyle(theme.text.secondary),
												font({ size: 16, weight: 'regular' }),
												lineLimit(1),
												truncationMode('tail')
											]}
										>
											{refLink || '—'}
										</Text>
									</ContextMenu.Trigger>
									<ContextMenu.Preview>
										<VStack modifiers={[padding({ all: 14 })]}>
											<Text modifiers={[font({ size: 13, design: 'monospaced', weight: 'regular' })]}>
												{refLink || '—'}
											</Text>
										</VStack>
									</ContextMenu.Preview>
									<ContextMenu.Items>
										<Button
											label={t('library.details.copy')}
											systemImage="doc.on.doc"
											onPress={copyText(refLink)}
										/>
									</ContextMenu.Items>
								</ContextMenu>
							</LabeledContent>
						)}
					</Section>

					<Section title={t('library.details.section.aliases')}>
						{aliases.map((alias) => (
							<HStack
								key={alias}
								spacing={8}
								modifiers={[
									padding({ vertical: 4 }),
									swipeActions({
										actions: [
											{
												id: 'delete',
												systemImage: 'trash',
												tint: theme.semantic.error,
												onPress: removeAlias(alias)
											}
										]
									})
								]}
							>
								<Text modifiers={[font({ size: 16, weight: 'regular' })]}>{alias}</Text>
							</HStack>
						))}

						<LabeledContent label="" modifiers={labelMods}>
							<TextField
								key={`alias-input-${aliasInputKey}`}
								defaultValue=""
								placeholder={t('library.details.aliases.add')}
								onValueChange={setAliasDraft}
								modifiers={[
									multilineTextAlignment('leading'),
									font({ size: 16, weight: 'regular' }),
									submitLabel('done'),
									onSubmit(addAlias)
								]}
							/>
						</LabeledContent>
					</Section>
				</List>
			</Host>
		</>
	);
};

export default ServiceDetails;
