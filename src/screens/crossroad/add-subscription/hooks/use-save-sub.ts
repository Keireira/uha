const useSaveSubscriptions = () => {
	// 1. Save service
	// 2. Save subscription
	// 3. Generate subscription txs
	// 4. Go back
	// const save = async () => {
	// 	if (!isValid || !service) return;
	// 	const subscriptionId = Crypto.randomUUID();
	// 	const subscription = {
	// 		id: subscriptionId,
	// 		color,
	// 		service_id: service.id,
	// 		category_slug: selectedCategorySlug,
	// 		custom_name: customName.trim() || null,
	// 		billing_cycle_type: cycleType,
	// 		billing_cycle_value: cycleValue,
	// 		current_price: priceMinorUnits,
	// 		current_currency_id: currencyId,
	// 		first_payment_date: effectiveFirstDate,
	// 		tender_id: tenderId || null,
	// 		cancellation_date: null
	// 	};
	// 	await db.insert(subscriptionsTable).values(subscription);
	// 	await generateSubscriptionTxs(subscription);
	// 	router.back();
	// };
};

export default useSaveSubscriptions;
