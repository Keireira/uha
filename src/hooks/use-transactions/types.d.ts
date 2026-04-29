import type { TransactionT, SubscriptionT, CurrencyT, ServiceT, CategoryT, TenderT } from '@models';

export type PreparedDbTxT = {
	id: TransactionT['id'];
	subscription_id: TransactionT['subscription_id'];
	service_id: SubscriptionT['service_id'];
	currency: CurrencyT['symbol'];
	currency_code: CurrencyT['id'];
	denominator: CurrencyT['denominator'];
	price: TransactionT['amount'];
	slug: ServiceT['slug'];
	logo_url: ServiceT['logo_url'];
	title: ServiceT['title'];
	customName: SubscriptionT['custom_name'];
	custom_logo: SubscriptionT['custom_logo'];
	custom_symbol: SubscriptionT['custom_symbol'];
	emoji: CategoryT['emoji'];
	color: ServiceT['color'];
	date: TransactionT['date'];
	comment: TransactionT['comment'];

	category_slug: CategoryT['slug'];
	category_title: CategoryT['title'];
	category_color: CategoryT['color'];

	tender_id: TenderT['id'] | null;
	tender_emoji: TenderT['emoji'] | null;
	tender_title: TenderT['title'] | null;
	tender_comment: TenderT['comment'] | null;
};

export type PreparedSubscriptionT = SubscriptionT & {
	/**
	 * We may, or we may not, have a latest transaction date for a subscription
	 * If we don't, we will use the first payment date as a fallback later
	 */
	latest_transaction_date: TransactionT['date'] | null;

	/** Current price in minor units, resolved from the latest priced timeline event */
	current_price: number | null;
	current_currency_id: string | null;

	currency: CurrencyT['symbol'];
	denominator: CurrencyT['denominator'];
	slug: ServiceT['slug'];
	logo_url: ServiceT['logo_url'];
	title: ServiceT['title'];
	emoji: CategoryT['emoji'];
	color: ServiceT['color'];

	/* category-related fields. category_slug is already included in the SubscriptionT */
	category_title: CategoryT['title'];
	category_color: CategoryT['color'];
};
