PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text DEFAULT (CURRENT_DATE) NOT NULL,
	`amount` integer NOT NULL,
	`currency_id` text NOT NULL,
	`tender_id` text NOT NULL,
	`subscription_id` text NOT NULL,
	`is_phantom` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "date", "amount", "currency_id", "tender_id", "subscription_id", "is_phantom") SELECT "id", "date", "amount", "currency_id", "tender_id", "subscription_id", "is_phantom" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `transactions_sub_date_idx` ON `transactions` (`subscription_id`,`date`);--> statement-breakpoint
CREATE INDEX `transactions_date_idx` ON `transactions` (`date`);--> statement-breakpoint
ALTER TABLE `user` ADD `oled_mode` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `max_horizon` integer DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `with_color_grading` integer DEFAULT true NOT NULL;