import { lightFormat } from 'date-fns';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import db from '@db';
import { and, eq } from 'drizzle-orm';
import { useSettingsValue } from './use-settings';
import { currenciesTable, currencyRatesTable } from '@db/schema';

const useRates = (date: Date) => {
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');

	const {
		data: [recalcCurrency]
	} = useLiveQuery(db.select().from(currenciesTable).where(eq(currenciesTable.id, recalcCurrencyCode)), [
		recalcCurrencyCode
	]);

	const { data: rates } = useLiveQuery(
		db
			.select()
			.from(currencyRatesTable)
			.where(
				and(
					eq(currencyRatesTable.target_currency_id, recalcCurrencyCode),
					eq(currencyRatesTable.date, lightFormat(date, 'yyyy-MM-dd'))
				)
			),
		[recalcCurrencyCode, date]
	);

	const getRates = (value: number, currency: string) => {
		return value;
	};

	return {
		r: getRates
	};
};

export default useRates;
