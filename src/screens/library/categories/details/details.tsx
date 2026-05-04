import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useAccent } from '@hooks';
import { useDetailsDraft, useSaveDetails } from '@screens/library/categories/hooks';

import {
	font,
	frame,
	listStyle,
	resizable,
	clipShape,
	onTapGesture,
	foregroundStyle,
	listRowSeparator,
	listRowBackground,
	listSectionSpacing,
	onLongPressGesture,
	multilineTextAlignment,
	scrollDismissesKeyboard
} from '@expo/ui/swift-ui/modifiers';
import {
	Host,
	Text,
	List,
	Image,
	HStack,
	Section,
	TextField,
	ColorPicker,
	LabeledContent,
	RNHostView
} from '@expo/ui/swift-ui';
import { LogoView } from '@ui';

type LocalSearchParams = {
	id: string;
	title: string;
	type: 'category';
};

const useCategoryDetailsQuery = () => {
	const { id } = useLocalSearchParams<LocalSearchParams>();

	const {
		data: [category]
	} = useLiveQuery(db.select().from(categoriesTable).where(eq(categoriesTable.slug, id)).limit(1), [id]);

	return category;
};

const CategoryDetails = () => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();
	const settingAccent = useAccent();

	const saveCategory = useSaveDetails();
	const category = useCategoryDetailsQuery();
	const { draft, actions } = useDetailsDraft(category);

	const [isSlugEditable, setIsSlugEditable] = useState(false);

	const labelMods = [font({ size: 16, weight: 'regular', design: 'rounded' })];
	const valueMods = [
		multilineTextAlignment('trailing'),
		foregroundStyle(theme.text.secondary),
		font({ size: 16, weight: 'regular', design: 'rounded' })
	];

	const screenTitle = useMemo(() => {
		if (!category) return '';

		if (category.title) {
			return category.title;
		}

		return t(`category.${category.slug}`, { defaultValue: category.slug });
	}, [category, t]);

	const closeModal = () => {
		router.back();
	};

	const enableSlugEdit = () => {
		if (category?.is_system) return;

		setIsSlugEditable(true);
	};

	const openLogoPicker = () => {
		router.push({
			pathname: '/(pickers)/select-symbol-logo',
			params: {
				target: 'library_category_logo'
			}
		});
	};

	const save = () => {
		if (!category) return;

		saveCategory(category, draft);
	};

	if (!category?.slug) {
		return null;
	}

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button variant="plain" icon="xmark" onPress={closeModal} />
			</Stack.Toolbar>

			<Stack.Screen options={{ title: screenTitle }} />

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={save} tintColor={settingAccent} />
			</Stack.Toolbar>

			<Host style={{ flex: 1 }}>
				<List modifiers={[listStyle('insetGrouped'), scrollDismissesKeyboard('immediately')]}>
					<Section modifiers={[listRowBackground('transparent'), listRowSeparator('hidden'), listSectionSpacing(0)]}>
						<HStack alignment="center" modifiers={[frame({ maxWidth: Number.POSITIVE_INFINITY })]}>
							<RNHostView matchContents>
								<LogoView
									name={draft.title}
									symbolName={draft.symbol}
									emoji={draft.emoji}
									url={draft.logo_url}
									color={draft.color}
									size={96}
								/>
							</RNHostView>
						</HStack>
					</Section>

					<Section title={t('library.details.section.identity')}>
						{/* Slug */}
						{isSlugEditable && !category.is_system ? (
							<LabeledContent label={t('library.details.fields.slug')}>
								<TextField
									autoFocus
									defaultValue={draft.slug}
									placeholder="slug"
									onValueChange={actions.onChangeSlug}
									modifiers={valueMods}
								/>
							</LabeledContent>
						) : (
							<LabeledContent label={t('library.details.fields.slug')} modifiers={[onLongPressGesture(enableSlugEdit)]}>
								<Text modifiers={valueMods}>{draft.slug}</Text>
							</LabeledContent>
						)}

						{/* Title */}
						<LabeledContent label={t('library.details.fields.title')} modifiers={labelMods}>
							<TextField
								defaultValue={draft.title}
								placeholder="Override current one"
								onValueChange={actions.onChangeTitle}
								modifiers={valueMods}
							/>
						</LabeledContent>
					</Section>

					<Section title={t('library.details.section.appearance')}>
						{/* Emoji */}
						<LabeledContent label={t('library.details.fields.emoji')} modifiers={labelMods}>
							<TextField
								defaultValue={draft.emoji}
								placeholder="One emoji to symbolize"
								onValueChange={actions.onChangeEmoji}
								modifiers={[...valueMods, font({ size: 20, design: 'rounded', weight: 'regular' })]}
							/>
						</LabeledContent>

						{/* Logo URL */}
						<LabeledContent
							label={t('library.details.fields.logo_url')}
							modifiers={[onTapGesture(actions.openImagePicker)]}
						>
							<HStack spacing={8}>
								{draft.logo_url ? (
									<Image
										uiImage={draft.logo_url}
										modifiers={[resizable(), frame({ width: 28, height: 28 }), clipShape('roundedRectangle')]}
									/>
								) : (
									<Text modifiers={valueMods}>—</Text>
								)}
							</HStack>
						</LabeledContent>

						{/* Symbol */}
						<LabeledContent label={t('library.details.fields.symbol')} modifiers={[onTapGesture(openLogoPicker)]}>
							<HStack spacing={8}>
								{draft.symbol ? (
									<Image systemName={draft.symbol} size={22} color={draft.color || settingAccent} />
								) : (
									<Text modifiers={valueMods}>—</Text>
								)}
							</HStack>
						</LabeledContent>

						{/* Color */}
						<ColorPicker
							label={t('library.details.fields.color')}
							selection={draft.color}
							onSelectionChange={actions.onChangeColor}
							supportsOpacity={false}
						/>
					</Section>

					{draft.logo_url && (
						<Section>
							<HStack spacing={8} alignment="center" modifiers={[onTapGesture(actions.resetLogoUrl)]}>
								<Image systemName="pencil.and.outline" size={18} color={theme.accents.red} />
								<Text modifiers={[font({ design: 'rounded', size: 16, weight: 'medium' })]}>Remove Image</Text>
							</HStack>
						</Section>
					)}
				</List>
			</Host>
		</>
	);
};

export default CategoryDetails;
