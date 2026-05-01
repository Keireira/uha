import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useTheme } from 'styled-components/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { categoriesTable, servicesTable } from '@db/schema';

import { useAccent } from '@hooks';
import { withAlpha } from '@lib/colors';
import { normalizeOptional } from '../../shared';
import { useEditServiceStore } from '@screens/library/services/hooks';

import {
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
	Button,
	Section,
	TextField,
	ContextMenu,
	ColorPicker,
	LabeledContent
} from '@expo/ui/swift-ui';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';

import type { SFSymbol } from 'sf-symbols-typescript';

const ServiceDetails = () => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const { id } = useLocalSearchParams<{ id: string }>();

	const {
		data: [service]
	} = useLiveQuery(db.select().from(servicesTable).where(eq(servicesTable.id, id)).limit(1), [id]);

	const initStore = useEditServiceStore((state) => state.init);
	const patch = useEditServiceStore((state) => state.patch);

	const draft = useEditServiceStore(
		useShallow((state) => ({
			slug: state.slug,
			title: state.title,
			color: state.color,
			logo_url: state.logo_url,
			symbol: state.symbol,
			bundle_id: state.bundle_id,
			ref_link: state.ref_link,
			category_slug: state.category_slug,
			aliases: state.aliases
		}))
	);

	const { data: [category] = [] } = useLiveQuery(
		db.select().from(categoriesTable).where(eq(categoriesTable.slug, draft.category_slug)),
		[draft.category_slug]
	);

	const [aliasDraft, setAliasDraft] = useState('');
	const [aliasInputKey, setAliasInputKey] = useState(0);
	const [isSlugEditable, setIsSlugEditable] = useState(false);
	const [isLogoEditable, setIsLogoEditable] = useState(false);
	const [isRefEditable, setIsRefEditable] = useState(false);

	useEffect(() => {
		if (!service) return;

		initStore({
			id: service.id,
			slug: service.slug ?? '',
			title: service.title,
			color: service.color,
			logo_url: service.logo_url ?? '',
			symbol: (service.symbol ?? '') as SFSymbol | '',
			bundle_id: service.bundle_id ?? '',
			ref_link: service.ref_link ?? '',
			category_slug: service.category_slug,
			aliases: service.aliases ?? []
		});
	}, [service, initStore]);

	const addAlias = () => {
		const value = aliasDraft.trim();
		if (!value || draft.aliases.includes(value)) {
			setAliasDraft('');
			setAliasInputKey((n) => n + 1);
			return;
		}

		patch({ aliases: [...draft.aliases, value] });
		setAliasDraft('');
		setAliasInputKey((n) => n + 1);
	};

	const removeAlias = (alias: string) => () => {
		patch({ aliases: draft.aliases.filter((a) => a !== alias) });
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

	const openCategoryPicker = () => {
		router.push({
			pathname: '/(pickers)/select-category',
			params: { target: 'library_service_category' }
		});
	};

	const openLogoPicker = () => {
		router.push({
			pathname: '/(pickers)/select-symbol-logo',
			params: { target: 'library_service_logo' }
		});
	};

	const save = async () => {
		if (!service) return;

		const nextTitle = draft.title.trim();
		const nextColor = draft.color.trim();
		if (!nextTitle || !nextColor || !draft.category_slug) return;

		try {
			await db
				.update(servicesTable)
				.set({
					title: nextTitle,
					slug: normalizeOptional(draft.slug),
					color: nextColor,
					logo_url: normalizeOptional(draft.logo_url),
					symbol: normalizeOptional(draft.symbol),
					bundle_id: normalizeOptional(draft.bundle_id),
					ref_link: normalizeOptional(draft.ref_link),
					category_slug: draft.category_slug,
					aliases: draft.aliases
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
	const linkValueMods = [
		multilineTextAlignment('trailing'),
		foregroundStyle(theme.text.secondary),
		font({ size: 16, weight: 'regular' }),
		lineLimit(1),
		truncationMode('tail')
	];

	const categoryLabel = draft.category_slug
		? t(`category.${draft.category_slug}`, { defaultValue: category?.title ?? draft.category_slug })
		: '—';

	const closeModal = () => {
		router.back();
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button variant="plain" icon="xmark" onPress={closeModal} />
			</Stack.Toolbar>

			<Stack.Screen options={{ title: draft.title || service.title }} />

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
									defaultValue={draft.slug}
									placeholder="slug"
									onValueChange={(slug) => patch({ slug })}
									modifiers={valueMods}
								/>
							</LabeledContent>
						) : (
							<LabeledContent label={t('library.details.fields.slug')} modifiers={[onLongPressGesture(enableSlugEdit)]}>
								<Text modifiers={valueMods}>{draft.slug || '—'}</Text>
							</LabeledContent>
						)}

						<LabeledContent label={t('library.details.fields.title')} modifiers={labelMods}>
							<TextField
								defaultValue={service.title}
								placeholder=""
								onValueChange={(title) => patch({ title })}
								modifiers={valueMods}
							/>
						</LabeledContent>

						<LabeledContent label={t('library.details.fields.category')} modifiers={[onTapGesture(openCategoryPicker)]}>
							<HStack spacing={6}>
								<Text modifiers={valueMods}>{categoryLabel}</Text>
								<Image systemName="chevron.right" size={12} color={withAlpha(settingAccent, 0.6)} />
							</HStack>
						</LabeledContent>
					</Section>

					<Section title={t('library.details.section.appearance')}>
						<ColorPicker
							label={t('library.details.fields.color')}
							selection={draft.color || null}
							onSelectionChange={(color) => patch({ color })}
							supportsOpacity={false}
						/>

						<LabeledContent label={t('library.details.fields.symbol')} modifiers={[onTapGesture(openLogoPicker)]}>
							<HStack spacing={8}>
								{draft.symbol ? (
									<Image systemName={draft.symbol as SFSymbol} size={20} color={draft.color || settingAccent} />
								) : (
									<Text modifiers={valueMods}>—</Text>
								)}
								<Image systemName="chevron.right" size={12} color={withAlpha(settingAccent, 0.6)} />
							</HStack>
						</LabeledContent>

						{isLogoEditable ? (
							<LabeledContent label={t('library.details.fields.logo_url')} modifiers={labelMods}>
								<TextField
									autoFocus
									defaultValue={draft.logo_url}
									placeholder="https://…"
									onValueChange={(logo_url) => patch({ logo_url })}
									onFocusChange={(focused) => !focused && setIsLogoEditable(false)}
									modifiers={valueMods}
								/>
							</LabeledContent>
						) : (
							<LabeledContent label={t('library.details.fields.logo_url')} modifiers={[onTapGesture(enableLogoEdit)]}>
								<ContextMenu>
									<ContextMenu.Trigger>
										<Text modifiers={linkValueMods}>{draft.logo_url || '—'}</Text>
									</ContextMenu.Trigger>
									<ContextMenu.Preview>
										<VStack modifiers={[padding({ all: 14 })]}>
											<Text modifiers={[font({ size: 13, design: 'monospaced', weight: 'regular' })]}>
												{draft.logo_url || '—'}
											</Text>
										</VStack>
									</ContextMenu.Preview>
									<ContextMenu.Items>
										<Button
											label={t('library.details.copy')}
											systemImage="doc.on.doc"
											onPress={copyText(draft.logo_url)}
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
								onValueChange={(bundle_id) => patch({ bundle_id })}
								modifiers={valueMods}
							/>
						</LabeledContent>

						{isRefEditable ? (
							<LabeledContent label={t('library.details.fields.ref_link')} modifiers={labelMods}>
								<TextField
									autoFocus
									defaultValue={draft.ref_link}
									placeholder="https://…"
									onValueChange={(ref_link) => patch({ ref_link })}
									onFocusChange={(focused) => !focused && setIsRefEditable(false)}
									modifiers={valueMods}
								/>
							</LabeledContent>
						) : (
							<LabeledContent label={t('library.details.fields.ref_link')} modifiers={[onTapGesture(enableRefEdit)]}>
								<ContextMenu>
									<ContextMenu.Trigger>
										<Text modifiers={linkValueMods}>{draft.ref_link || '—'}</Text>
									</ContextMenu.Trigger>
									<ContextMenu.Preview>
										<VStack modifiers={[padding({ all: 14 })]}>
											<Text modifiers={[font({ size: 13, design: 'monospaced', weight: 'regular' })]}>
												{draft.ref_link || '—'}
											</Text>
										</VStack>
									</ContextMenu.Preview>
									<ContextMenu.Items>
										<Button
											label={t('library.details.copy')}
											systemImage="doc.on.doc"
											onPress={copyText(draft.ref_link)}
										/>
									</ContextMenu.Items>
								</ContextMenu>
							</LabeledContent>
						)}
					</Section>

					<Section title={t('library.details.section.aliases')}>
						{draft.aliases.map((alias) => (
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
