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
import { Host, List, Section, Text } from '@expo/ui/swift-ui';
import { Timeline } from '@elements';
import {
	Header,
	LogoPreview,
	CustomName,
	Category,
	Payment,
	LogoUrl,
	Symbol,
	Notes,
	Notifications,
	Sync
} from './components';

const SubscriptionDetails = () => {
	const { t } = useTranslation();

	const initRow = useInitDraft();
	const { draft, actions } = useDraft();

	if (!initRow) {
		return null;
	}

	const { subscription, service } = initRow;
	const headerTitle = draft.custom_name.trim() || service.title;

	return (
		<>
			<Header subscription={subscription} service={service} headerTitle={headerTitle} />

			<Host style={{ flex: 1 }}>
				<List modifiers={[listStyle('insetGrouped'), scrollDismissesKeyboard('immediately')]}>
					<Section modifiers={[listRowBackground('transparent'), listRowSeparator('hidden'), listSectionSpacing(0)]}>
						<LogoPreview logo={draft.logo} title={headerTitle} />
					</Section>

					<Section title={t('library.details.section.identity')}>
						<CustomName customName={draft.custom_name} onChangeCustomName={actions.setTitle} />
						<Category categorySlug={draft.category_slug} />
						<Payment tenderId={draft.tender_id} />
					</Section>

					<Section
						title={t('library.details.section.appearance')}
						footer={
							<Text modifiers={[font({ size: 12, weight: 'regular', design: 'rounded' })]}>
								{t('library.details.appearance.footer')}
							</Text>
						}
					>
						<LogoUrl imageUri={draft.logo.image_uri} />
						<Symbol symbol={draft.logo.symbol} color={draft.logo.color} />
					</Section>

					<Section title={t('library.details.section.notes')} modifiers={[listRowSeparator('hidden')]}>
						<Notes notes={draft.notes} onChangeNotes={actions.setNotes} />
					</Section>

					<Section>
						<Notifications
							notifyEnabled={draft.notify_enabled}
							notifyDaysBefore={draft.notify_days_before}
							onChangeNotifyEnabled={actions.setNotifyEnabled}
						/>
					</Section>

					<Timeline />

					<Sync subscription={subscription} service={service} customName={draft.custom_name} logo={draft.logo} />
				</List>
			</Host>
		</>
	);
};

export default SubscriptionDetails;
