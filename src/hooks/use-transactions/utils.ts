import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

import type { PreparedSubscriptionT } from './types.d';

export const advanceDate = (
	date: Date,
	type: PreparedSubscriptionT['billing_cycle_type'],
	value: PreparedSubscriptionT['billing_cycle_value']
) => {
	switch (type) {
		case 'days':
			return addDays(date, value);
		case 'weeks':
			return addWeeks(date, value);
		case 'months':
			return addMonths(date, value);
		case 'years':
			return addYears(date, value);
		default:
			return date;
	}
};

export const debugLogging = (maxDate: Date, preparedSubscriptions: PreparedSubscriptionT[]) => {
	console.log('\n\x1b[1m\x1b[35m🔮 Phantom Transactions\x1b[0m');
	console.log('\x1b[90m═══════════════════════════════════════════\x1b[0m');
	console.log(`\x1b[33m📅 Max Date:\x1b[0m ${maxDate}`);
	console.log(`\x1b[33m📦 Total:\x1b[0m   ${preparedSubscriptions.length} subscriptions\n`);

	preparedSubscriptions.forEach((sub, index) => {
		const name = sub.custom_name || sub.title || 'Unnamed';
		const price = sub.current_price
			? `${sub.currency}${(sub.current_price / (sub.denominator ?? 100)).toFixed(2)}`
			: 'N/A';
		const cycle = `${sub.billing_cycle_value} ${sub.billing_cycle_type}`;

		console.log(`\x1b[36m┌─ ${sub.emoji ?? '📋'} \x1b[1m${name} (${index + 1})\x1b[0m`);
		console.log(`\x1b[90m│\x1b[0m  \x1b[90mID:\x1b[0m       ${sub.id.slice(0, 8)}…`);
		console.log(`\x1b[90m│\x1b[0m  \x1b[90mService:\x1b[0m  ${sub.slug ?? '—'}`);
		console.log(`\x1b[90m│\x1b[0m  \x1b[90mCategory:\x1b[0m ${sub.category_title ?? '—'}`);
		console.log(`\x1b[90m│\x1b[0m  \x1b[32mPrice:\x1b[0m    ${price}`);
		console.log(`\x1b[90m│\x1b[0m  \x1b[90mCycle:\x1b[0m    every ${cycle}`);
		console.log(`\x1b[90m│\x1b[0m  \x1b[90mStarted:\x1b[0m  ${sub.first_payment_date}`);
		console.log(`\x1b[90m│\x1b[0m  \x1b[90mLast Tx:\x1b[0m  ${sub.latest_transaction_date ?? 'none yet'}`);
		console.log(`\x1b[90m└${'─'.repeat(42)}\x1b[0m\n`);
	});
};
