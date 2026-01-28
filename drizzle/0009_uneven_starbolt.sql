PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_currency_rates` (
	`id` text PRIMARY KEY NOT NULL,
	`target_currency_id` text NOT NULL,
	`rate` real NOT NULL,
	`date` text DEFAULT (CURRENT_DATE) NOT NULL,
	FOREIGN KEY (`target_currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_currency_rates`("id", "target_currency_id", "rate", "date") SELECT "id", "target_currency_id", "rate", "date" FROM `currency_rates`;--> statement-breakpoint
DROP TABLE `currency_rates`;--> statement-breakpoint
ALTER TABLE `__new_currency_rates` RENAME TO `currency_rates`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `currency_rates_lookup_idx` ON `currency_rates` (`target_currency_id`,`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `currency_rates_unique` ON `currency_rates` (`target_currency_id`,`date`);