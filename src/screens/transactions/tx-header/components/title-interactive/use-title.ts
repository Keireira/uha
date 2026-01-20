import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppModel } from '@models';
import { useUnit } from 'effector-react';

const useTitle = () => {
	const { t } = useTranslation();
	const appModel = useAppModel();
	const lenses = useUnit(appModel.lenses.$store);
	const viewMode = useUnit(appModel.view_mode.$mode);
	const activeMonth = useUnit(appModel.tx_dates.activeMonth.$value);
	const isTerminationView = useUnit(appModel.tx_dates.is_termination_view.$value);

	const title = useMemo(() => {
		if (viewMode === 'list') {
			return t(`transactions.time_mode.${lenses.time_mode}`);
		} else if (viewMode === 'subscriptions') {
			return t('transactions.view_mode.subscriptions');
		}
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [isTerminationView, lenses.time_mode, viewMode, activeMonth]);

	return title;
};

export default useTitle;
