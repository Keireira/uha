CREATE TABLE `timeline_events` (
	`id` text PRIMARY KEY NOT NULL,
	`subscription_id` text NOT NULL,
	`type` text NOT NULL,
	`date` text DEFAULT (CURRENT_DATE) NOT NULL,
	`amount` integer,
	`currency_id` text,
	`duration_type` text,
	`duration_value` integer,
	`reason` text,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `timeline_events_subscription_id_idx` ON `timeline_events` (`subscription_id`,`date`);
--> statement-breakpoint
-- Migrate existing price_history rows. Earliest row per subscription becomes a
-- `first_payment` event; subsequent rows become `price_up` / `price_down`
-- based on the amount delta vs. the previous row for that subscription. This
-- is a best-effort reconstruction — the old table didn't record intent.
INSERT INTO `timeline_events` (`id`, `subscription_id`, `type`, `date`, `amount`, `currency_id`)
SELECT
	ph.id,
	ph.subscription_id,
	CASE
		WHEN prev.amount IS NULL THEN 'first_payment'
		WHEN ph.amount > prev.amount THEN 'price_up'
		WHEN ph.amount < prev.amount THEN 'price_down'
		ELSE 'price_up'
	END,
	ph.date,
	ph.amount,
	ph.currency_id
FROM `price_history` ph
LEFT JOIN `price_history` prev
	ON prev.subscription_id = ph.subscription_id
	AND prev.date = (
		SELECT MAX(p2.date)
		FROM `price_history` p2
		WHERE p2.subscription_id = ph.subscription_id AND p2.date < ph.date
	);
--> statement-breakpoint
DROP TABLE `price_history`;
