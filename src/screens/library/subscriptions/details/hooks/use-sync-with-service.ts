import { useTranslation } from 'react-i18next';

import db from '@db';
import { eq } from 'drizzle-orm';
import { servicesTable, subscriptionsTable } from '@db/schema';
import Toast from 'react-native-toast-message';

import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import type { SFSymbol } from 'expo-symbols';
import type { ServiceT, SubscriptionT } from '@models';
import type { LogoDraftT, SubscriptionDraftT } from '@screens/crossroad/add-subscription/events';

export type SyncDiff = {
	title: boolean;
	logo: boolean;
	symbol: boolean;
};

type DraftSlice = Pick<SubscriptionDraftT, 'custom_name' | 'logo'>;

export const computeSyncDiff = (service: ServiceT, draft: DraftSlice): SyncDiff => {
	const draftName = draft.custom_name.trim();
	const draftImage = draft.logo.image_uri ?? null;
	const draftSymbol = draft.logo.symbol ?? null;

	return {
		title: Boolean(draftName) && draftName !== service.title,
		logo: Boolean(draftImage) && draftImage !== service.logo_url,
		symbol: Boolean(draftSymbol) && draftSymbol !== service.symbol
	};
};

export const hasSyncDiff = (diff: SyncDiff) => diff.title || diff.logo || diff.symbol;

const useSyncWithService = () => {
	const { t } = useTranslation();
	const setTitle = useDraftStore((state) => state.actions.setSubscriptionTitle);
	const setLogoImage = useDraftStore((state) => state.actions.setLogoImage);
	const setLogoSymbol = useDraftStore((state) => state.actions.setLogoSymbol);

	const applyToService = async (subscription: SubscriptionT, service: ServiceT, draft: DraftSlice) => {
		const diff = computeSyncDiff(service, draft);
		if (!hasSyncDiff(diff)) return;

		const draftName = draft.custom_name.trim();
		const draftImage = draft.logo.image_uri ?? null;
		const draftSymbol = (draft.logo.symbol ?? null) as SFSymbol | null;

		const serviceUpdate: Partial<typeof servicesTable.$inferInsert> = {};
		const subscriptionClear: Partial<typeof subscriptionsTable.$inferInsert> = {};
		const logoPatch: Partial<LogoDraftT> = {};
		let nextTitle: string | null = null;

		if (diff.title) {
			serviceUpdate.title = draftName;
			subscriptionClear.custom_name = null;
			nextTitle = service.title === draftName ? draftName : draftName;
		}

		if (diff.logo) {
			serviceUpdate.logo_url = draftImage;
			serviceUpdate.symbol = null;
			subscriptionClear.custom_logo = null;
			logoPatch.image_uri = draftImage ?? undefined;
		}

		if (diff.symbol) {
			serviceUpdate.symbol = draftSymbol;
			serviceUpdate.logo_url = null;
			subscriptionClear.custom_symbol = null;
			logoPatch.symbol = (draftSymbol ?? undefined) as LogoDraftT['symbol'];
		}

		try {
			await db.transaction(async (tx) => {
				if (Object.keys(serviceUpdate).length > 0) {
					await tx.update(servicesTable).set(serviceUpdate).where(eq(servicesTable.id, service.id));
				}

				if (Object.keys(subscriptionClear).length > 0) {
					await tx.update(subscriptionsTable).set(subscriptionClear).where(eq(subscriptionsTable.id, subscription.id));
				}
			});

			if (nextTitle != null) {
				setTitle(nextTitle);
			}
			if (Object.prototype.hasOwnProperty.call(logoPatch, 'image_uri')) {
				setLogoImage(logoPatch.image_uri);
			}
			if (Object.prototype.hasOwnProperty.call(logoPatch, 'symbol')) {
				setLogoSymbol(logoPatch.symbol);
			}

			Toast.show({
				type: 'success',
				text1: t('library.details.sync.toast.success.title'),
				text2: t('library.details.sync.toast.success.description')
			});
		} catch (err) {
			console.warn('[subscription-details] sync failed:', err);

			Toast.show({
				type: 'error',
				text1: t('library.details.sync.toast.error.title'),
				text2: t('library.details.sync.toast.error.description')
			});
		}
	};

	return applyToService;
};

export default useSyncWithService;
