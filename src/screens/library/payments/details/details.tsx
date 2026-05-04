import React from 'react';
import { useTranslation } from 'react-i18next';
import { useInitDraft, useDraft } from './hooks';

import {
	listStyle,
	listSectionSpacing,
	scrollDismissesKeyboard,
	listRowSeparator,
	listRowBackground
} from '@expo/ui/swift-ui/modifiers';
import { Host, List, Section, ColorPicker } from '@expo/ui/swift-ui';
import { Header, LogoPreview, Title, Comment, CardToggle, Emoji, LogoUrl, Symbol } from './components';

const PaymentDetails = () => {
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
						{/* Title */}
						<Title title={draft.title} onChangeTitle={actions.onChangeTitle} />
					</Section>

					<Section title={t('library.details.section.appearance')}>
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

					<Section title={t('library.details.section.other')}>
						{/* Comment */}
						<Comment comment={draft.comment} onChangeComment={actions.onChangeComment} />

						{/* Card toggle */}
						<CardToggle isCard={draft.is_card} onChangeIsCard={actions.onChangeIsCard} />
					</Section>
				</List>
			</Host>
		</>
	);
};

export default PaymentDetails;
