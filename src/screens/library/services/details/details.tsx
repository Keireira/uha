import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAccent } from '@hooks';
import { useInitDraft, useDraft } from './hooks';

import {
	font,
	listStyle,
	listRowSeparator,
	listRowBackground,
	listSectionSpacing,
	scrollDismissesKeyboard
} from '@expo/ui/swift-ui/modifiers';
import { swipeActions } from '@modules/expo-ui-modifiers';
import { Host, List, Section, ColorPicker, Text } from '@expo/ui/swift-ui';
import { Header, LogoPreview, Slug, Title, Category, Emoji, LogoUrl, Symbol, BundleId, Aliases } from './components';

const ServiceDetails = () => {
	const { t } = useTranslation();
	const settingAccent = useAccent();

	const initDraft = useInitDraft();
	const { draft, actions } = useDraft(initDraft);

	if (!initDraft) {
		return null;
	}

	return (
		<>
			<Header initDraft={initDraft} draft={draft} />

			<Host style={{ flex: 1 }}>
				<List modifiers={[listStyle('insetGrouped'), scrollDismissesKeyboard('immediately')]}>
					{/* Logo Preview */}
					<Section modifiers={[listRowBackground('transparent'), listRowSeparator('hidden'), listSectionSpacing(0)]}>
						<LogoPreview {...draft} />
					</Section>

					<Section title={t('library.details.section.identity')}>
						{/* Slug */}
						<Slug slug={draft.slug} onChangeSlug={actions.onChangeSlug} />

						{/* Title */}
						<Title title={initDraft.title} onChangeTitle={actions.onChangeTitle} />

						{/* Category */}
						<Category categorySlug={draft.category_slug} />
					</Section>

					<Section
						title={t('library.details.section.appearance')}
						footer={
							<Text modifiers={[font({ size: 12, weight: 'regular', design: 'rounded' })]}>
								Swipe right restores init value. Swipe left clears one.
							</Text>
						}
					>
						{/* Emoji */}
						<Emoji
							emoji={draft.emoji}
							onChangeEmoji={actions.onChangeEmoji}
							resetEmoji={actions.resetEmoji}
							resetToInitialEmoji={actions.resetToInitialEmoji}
						/>

						{/* Logo URL */}
						<LogoUrl
							logoUrl={draft.logo_url}
							openImagePicker={actions.openImagePicker}
							resetLogoUrl={actions.resetLogoUrl}
							resetToInitialLogoUrl={actions.resetToInitialLogoUrl}
						/>

						{/* Symbol */}
						<Symbol
							symbol={draft.symbol}
							color={draft.color}
							resetSymbol={actions.resetSymbol}
							resetToInitialSymbol={actions.resetToInitialSymbol}
						/>

						{/* Color */}
						<ColorPicker
							label={t('library.details.fields.color')}
							selection={draft.color}
							onSelectionChange={actions.onChangeColor}
							supportsOpacity={false}
							modifiers={[
								...swipeActions({
									actions: [
										{
											id: 'reset',
											edge: 'leading',
											systemImage: 'arrow.counterclockwise',
											tint: settingAccent,
											onPress: actions.resetToInitialColor
										}
									]
								})
							]}
						/>
					</Section>

					<Section title={t('library.details.section.other')}>
						{/* Bundle ID */}
						<BundleId bundleId={draft.bundle_id} onChangeBundleId={actions.onChangeBundleId} />
					</Section>

					<Section title={t('library.details.section.aliases')}>
						{/* Aliases */}
						<Aliases aliases={draft.aliases} onChangeAliases={actions.onChangeAliases} />
					</Section>
				</List>
			</Host>
		</>
	);
};

export default ServiceDetails;
