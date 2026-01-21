import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppModel } from '@models';
import { useUnit } from 'effector-react';
import { useSearchParams } from '@hooks';

const useTitle = () => {
	const { t } = useTranslation();
	const appModel = useAppModel();
	const { txViewMode } = useSearchParams();

	const lenses = useUnit(appModel.lenses.$store);
	const activeMonth = useUnit(appModel.tx_dates.activeMonth.$value);

	const title = useMemo(() => {
		if (txViewMode === 'list') {
			return t(`transactions.time_mode.${lenses.time_mode}`);
		} else if (txViewMode === 'subscriptions') {
			return t('transactions.view_mode.subscriptions');
		}
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [lenses.time_mode, txViewMode, activeMonth]);

	return title;
};

export default useTitle;
