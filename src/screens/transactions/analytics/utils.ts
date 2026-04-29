import type { AnalyticsCurrencyT, MerchantBreakdownT } from './analytics.d';
import type { PreparedDbTxT } from '@hooks/use-transactions';

export const formatAmount = (amount: number, currency: AnalyticsCurrencyT): string =>
	amount.toLocaleString(currency.intl_locale, {
		style: 'currency',
		currency: currency.id,
		currencyDisplay: 'symbol',
		minimumFractionDigits: amount > 1000 ? 0 : currency.fraction_digits,
		maximumFractionDigits: amount > 1000 ? 0 : currency.fraction_digits
	});

export const getMerchantKey = (tx: PreparedDbTxT): string => tx.service_id || tx.slug || tx.title;

export const buildMerchantBreakdown = (
	txs: PreparedDbTxT[],
	currency: AnalyticsCurrencyT
): MerchantBreakdownT[] => {
	const byMerchant = new Map<string, MerchantBreakdownT>();

	for (const tx of txs) {
		const key = getMerchantKey(tx);
		const denominator = tx.denominator || 1;
		const amount = tx.price / denominator;
		const current = byMerchant.get(key);

		if (current) {
			current.amount += amount;
			current.formattedAmount = formatAmount(current.amount, currency);
			continue;
		}

		byMerchant.set(key, {
			id: key,
			title: tx.title || tx.customName || key,
			amount,
			formattedAmount: formatAmount(amount, currency),
			tx
		});
	}

	return Array.from(byMerchant.values()).sort((a, b) => b.amount - a.amount);
};
