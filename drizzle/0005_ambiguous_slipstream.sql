PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_services` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`color` text NOT NULL,
	`aliases` text DEFAULT '[]' NOT NULL,
	`category_id` text NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_services`("id", "slug", "title", "color", "aliases", "category_id") SELECT "id", "slug", "title", "color", "aliases", "category_id" FROM `services`;--> statement-breakpoint
DROP TABLE `services`;--> statement-breakpoint
ALTER TABLE `__new_services` RENAME TO `services`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `services_slug_unique` ON `services` (`slug`);--> statement-breakpoint
CREATE INDEX `services_category_id_idx` ON `services` (`category_id`);--> statement-breakpoint
CREATE INDEX `services_title_idx` ON `services` (`title`);--> statement-breakpoint
CREATE TABLE `__new_subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`service_id` text NOT NULL,
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
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`theme` text DEFAULT 'auto' NOT NULL,
	`recalc_currency` text NOT NULL,
	`default_currency` text NOT NULL,
	FOREIGN KEY (`recalc_currency`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`default_currency`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "theme", "recalc_currency", "default_currency") SELECT "id", "theme", "recalc_currency", "default_currency" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;