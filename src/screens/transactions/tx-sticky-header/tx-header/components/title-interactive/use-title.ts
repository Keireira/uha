import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useLensesStore } from '@screens/transactions/models';
import { useSearchParams } from '@hooks';

const useTitle = () => {
	const { t } = useTranslation();
	const { txViewMode } = useSearchParams();

	const timeMode = useLensesStore((s) => s.time_mode);

	const title = useMemo(() => {
		if (txViewMode === 'list') {
			return t(`transactions.time_mode.${timeMode}`);
		} else if (txViewMode === 'subscriptions') {
			return t('transactions.view_mode.subscriptions');
		}
	}, [t, timeMode, txViewMode]);

	return title;
};

export default useTitle;
