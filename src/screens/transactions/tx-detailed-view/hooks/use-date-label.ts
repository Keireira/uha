import { useTranslation } from 'react-i18next';
import { format, startOfToday, isToday, isTomorrow, isYesterday, isSameYear } from 'date-fns';

const today = startOfToday();

const useDateLabel = (date: Date | undefined) => {
	const { t } = useTranslation();

	if (!date) return '';

	if (isToday(date)) return t('dates.today');
	if (isTomorrow(date)) return t('dates.tomorrow');
	if (isYesterday(date)) return t('dates.yesterday');

	return format(date, isSameYear(date, today) ? 'd MMMM (EEEE)' : 'd MMMM, yyyy (EEEE)');
};

export default useDateLabel;
