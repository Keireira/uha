import type { CurrencyT } from '@models';
import type { PreparedDbTxT } from '@hooks/use-transactions';
import type { EnrichedCategoryT } from './use-category-details';

export type ChartDatumT = {
	id: string;
	value: number;
	color: string;
};

export type MerchantBreakdownT = {
	id: string;
	title: string;
	amount: number;
	formattedAmount: string;
	tx: PreparedDbTxT;
};

export type BreakdownRowT =
	| {
			type: 'category';
			id: EnrichedCategoryT['id'];
			title: EnrichedCategoryT['title'];
			subtitle: string;
			amount: EnrichedCategoryT['amount'];
			formattedAmount: EnrichedCategoryT['formattedAmount'];
			color: EnrichedCategoryT['color'];
			emoji: EnrichedCategoryT['emoji'];
	  }
	| {
			type: 'merchant';
			id: MerchantBreakdownT['id'];
			title: MerchantBreakdownT['title'];
			subtitle: string;
			amount: MerchantBreakdownT['amount'];
			formattedAmount: MerchantBreakdownT['formattedAmount'];
			tx: PreparedDbTxT;
	  };

export type BreakdownSectionT = {
	id: string;
	title?: string;
	rows: BreakdownRowT[];
};

export type AnalyticsCurrencyT = Pick<CurrencyT, 'id' | 'intl_locale' | 'fraction_digits'>;
