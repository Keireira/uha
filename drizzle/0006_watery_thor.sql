CREATE TABLE `phantom_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` real NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`date` text DEFAULT (CURRENT_DATE) NOT NULL,
	`currency_id` text NOT NULL,
	`tender_id` text NOT NULL,
	`subscription_id` text NOT NULL,
	FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `phantom_transactions_sub_date_idx` ON `phantom_transactions` (`subscription_id`,`date`);--> statement-breakpoint
CREATE INDEX `phantom_transactions_date_idx` ON `phantom_transactions` (`date`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` real NOT NULL,
	`status` text DEFAULT 'completed' NOT NULL,
	`date` text DEFAULT (CURRENT_DATE) NOT NULL,
	`currency_id` text NOT NULL,
	`tender_id` text NOT NULL,
	`subscription_id` text NOT NULL,
	FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "amount", "status", "date", "currency_id", "tender_id", "subscription_id") SELECT "id", "amount", "status", "date", "currency_id", "tender_id", "subscription_id" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `transactions_sub_date_idx` ON `transactions` (`subscription_id`,`date`);--> statement-breakpoint
CREATE INDEX `transactions_date_idx` ON `transactions` (`date`);