ALTER TABLE `payment_methods` RENAME TO `tenders`;--> statement-breakpoint
ALTER TABLE `prices_history` RENAME TO `price_history`;--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` real NOT NULL,
	`date` text DEFAULT (CURRENT_DATE) NOT NULL,
	`currency_id` text NOT NULL,
	`tender_id` text NOT NULL,
	`subscription_id` text NOT NULL,
	FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `transactions_sub_date_idx` ON `transactions` (`subscription_id`,`date`);--> statement-breakpoint
CREATE INDEX `transactions_date_idx` ON `transactions` (`date`);--> statement-breakpoint
DROP TABLE `billing_cycles`;--> statement-breakpoint
DROP INDEX `payment_methods_id_unique`;--> statement-breakpoint
DROP INDEX `prices_history_id_unique`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_price_history` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` real NOT NULL,
	`date` text DEFAULT (CURRENT_DATE) NOT NULL,
	`currency_id` text NOT NULL,
	`subscription_id` text NOT NULL,
	FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_price_history`("id", "amount", "date", "currency_id", "subscription_id") SELECT "id", "amount", "date", "currency_id", "subscription_id" FROM `price_history`;--> statement-breakpoint
DROP TABLE `price_history`;--> statement-breakpoint
ALTER TABLE `__new_price_history` RENAME TO `price_history`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `price_history_subscription_id_idx` ON `price_history` (`subscription_id`,`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `price_history_unique` ON `price_history` (`subscription_id`,`date`);--> statement-breakpoint
CREATE TABLE `__new_currency_rates` (
	`id` text PRIMARY KEY NOT NULL,
	`base_currency_id` text NOT NULL,
	`target_currency_id` text NOT NULL,
	`rate` real NOT NULL,
	`date` text DEFAULT (CURRENT_DATE) NOT NULL,
	FOREIGN KEY (`base_currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_currency_rates`("id", "base_currency_id", "target_currency_id", "rate", "date") SELECT "id", "base_currency_id", "target_currency_id", "rate", "date" FROM `currency_rates`;--> statement-breakpoint
DROP TABLE `currency_rates`;--> statement-breakpoint
ALTER TABLE `__new_currency_rates` RENAME TO `currency_rates`;--> statement-breakpoint
CREATE INDEX `currency_rates_lookup_idx` ON `currency_rates` (`base_currency_id`,`target_currency_id`,`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `currency_rates_unique` ON `currency_rates` (`base_currency_id`,`target_currency_id`,`date`);--> statement-breakpoint
CREATE TABLE `__new_subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text,
	`service_id` text,
	`custom_name` text,
	`billing_cycle_type` text DEFAULT 'months' NOT NULL,
	`billing_cycle_value` integer DEFAULT 1 NOT NULL,
	`current_price` integer NOT NULL,
	`current_currency_id` text NOT NULL,
	`first_payment_date` text DEFAULT (CURRENT_DATE) NOT NULL,
	`tender_id` text,
	`cancellation_date` text,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`current_currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_subscriptions`("id", "category_id", "service_id", "custom_name", "billing_cycle_type", "billing_cycle_value", "current_price", "current_currency_id", "first_payment_date", "tender_id", "cancellation_date") SELECT "id", "category_id", "service_id", "custom_name", "billing_cycle_type", "billing_cycle_value", "current_price", "current_currency_id", "first_payment_date", "tender_id", "cancellation_date" FROM `subscriptions`;--> statement-breakpoint
DROP TABLE `subscriptions`;--> statement-breakpoint
ALTER TABLE `__new_subscriptions` RENAME TO `subscriptions`;--> statement-breakpoint
CREATE INDEX `subscriptions_category_id_idx` ON `subscriptions` (`category_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_service_id_idx` ON `subscriptions` (`service_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_current_currency_id_idx` ON `subscriptions` (`current_currency_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_tender_id_idx` ON `subscriptions` (`tender_id`);--> statement-breakpoint
DROP INDEX `categories_id_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `categories_full_unique` ON `categories` (`title`,`emoji`,`color`);--> statement-breakpoint
DROP INDEX `currencies_id_unique`;--> statement-breakpoint
ALTER TABLE `currencies` ADD `denominator` integer DEFAULT 100 NOT NULL;--> statement-breakpoint
CREATE TABLE `__new_services` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`color` text NOT NULL,
	`aliases` text DEFAULT '[]' NOT NULL,
	`category_id` text,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_services`("id", "slug", "title", "color", "aliases", "category_id") SELECT "id", "slug", "title", "color", "aliases", "category_id" FROM `services`;--> statement-breakpoint
DROP TABLE `services`;--> statement-breakpoint
ALTER TABLE `__new_services` RENAME TO `services`;--> statement-breakpoint
CREATE UNIQUE INDEX `services_slug_unique` ON `services` (`slug`);--> statement-breakpoint
CREATE INDEX `services_category_id_idx` ON `services` (`category_id`);--> statement-breakpoint
CREATE INDEX `services_title_idx` ON `services` (`title`);--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`theme` text DEFAULT 'auto' NOT NULL,
	`recalc_currency` text,
	`default_currency` text,
	FOREIGN KEY (`recalc_currency`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`default_currency`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "theme", "recalc_currency", "default_currency") SELECT "id", "theme", "recalc_currency", "default_currency" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;