import React from 'react';
import { useTranslation } from 'react-i18next';
import { useInitDraft, useDraft } from './hooks';

import {
	font,
	listStyle,
	listRowSeparator,
	listRowBackground,
	listSectionSpacing,
	scrollDismissesKeyboard
} from '@expo/ui/swift-ui/modifiers';
import { Host, List, Section, ColorPicker, Text } from '@expo/ui/swift-ui';
import { Header, LogoPreview, Slug, Title, Emoji, LogoUrl, Symbol } from './components';

const CategoryDetails = () => {
	const { t } = useTranslation();

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
						<Slug isSystem={initDraft.is_system} slug={draft.slug} onChangeSlug={actions.onChangeSlug} />

						{/* Title */}
						<Title title={draft.title} onChangeTitle={actions.onChangeTitle} />
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
						<Emoji emoji={draft.emoji} onChangeEmoji={actions.onChangeEmoji} />

						{/* Logo URL */}
						<LogoUrl
							logoUrl={draft.logo_url}
							resetLogoUrl={actions.resetLogoUrl}
							openImagePicker={actions.openImagePicker}
						/>

						{/* Symbol */}
						<Symbol symbol={draft.symbol} color={draft.color} resetSymbol={actions.resetSymbol} />

						{/* Color */}
						<ColorPicker
							label={t('library.details.fields.color')}
							selection={draft.color}
							onSelectionChange={actions.onChangeColor}
							supportsOpacity={false}
						/>
					</Section>
				</List>
			</Host>
		</>
	);
};

export default CategoryDetails;
