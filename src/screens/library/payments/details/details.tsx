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
import { Header, LogoPreview, Title, Comment, CardToggle, Emoji, LogoUrl, Symbol } from './components';

const PaymentDetails = () => {
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
						{/* Title */}
						<Title title={draft.title} onChangeTitle={actions.onChangeTitle} />

						{/* Comment */}
						<Comment comment={draft.comment} onChangeComment={actions.onChangeComment} />

						{/* Card toggle */}
						<CardToggle isCard={draft.is_card} onChangeIsCard={actions.onChangeIsCard} />
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
				</List>
			</Host>
		</>
	);
};

export default PaymentDetails;
