CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`emoji` text NOT NULL,
	`color` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_full_unique` ON `categories` (`title`,`emoji`,`color`);--> statement-breakpoint
CREATE TABLE `currencies` (
	`id` text PRIMARY KEY NOT NULL,
	`symbol` text NOT NULL,
	`denominator` integer DEFAULT 100 NOT NULL,
	`fraction_digits` integer DEFAULT 2 NOT NULL,
	`intl_locale` text NOT NULL,
	`region` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `price_history` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` real NOT NULL,
	`date` text DEFAULT (CURRENT_DATE) NOT NULL,
	`currency_id` text NOT NULL,
	`subscription_id` text NOT NULL,
	FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `price_history_subscription_id_idx` ON `price_history` (`subscription_id`,`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `price_history_unique` ON `price_history` (`subscription_id`,`date`);--> statement-breakpoint
CREATE TABLE `currency_rates` (
	`id` text PRIMARY KEY NOT NULL,
	`target_currency_id` text NOT NULL,
	`rate` real NOT NULL,
	`date` text DEFAULT (CURRENT_DATE) NOT NULL,
	FOREIGN KEY (`target_currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `currency_rates_lookup_idx` ON `currency_rates` (`target_currency_id`,`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `currency_rates_unique` ON `currency_rates` (`target_currency_id`,`date`);--> statement-breakpoint
CREATE TABLE `services` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`color` text NOT NULL,
	`aliases` text DEFAULT '[]' NOT NULL,
	`category_id` text NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_slug_unique` ON `services` (`slug`);--> statement-breakpoint
CREATE INDEX `services_category_id_idx` ON `services` (`category_id`);--> statement-breakpoint
CREATE INDEX `services_title_idx` ON `services` (`title`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
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
CREATE INDEX `subscriptions_category_id_idx` ON `subscriptions` (`category_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_service_id_idx` ON `subscriptions` (`service_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_current_currency_id_idx` ON `subscriptions` (`current_currency_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_tender_id_idx` ON `subscriptions` (`tender_id`);--> statement-breakpoint
CREATE TABLE `tenders` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`is_card` integer DEFAULT true NOT NULL,
	`comment` text DEFAULT '',
	`color` text NOT NULL,
	`emoji` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text DEFAULT (CURRENT_DATE) NOT NULL,
	`amount` integer NOT NULL,
	`currency_id` text NOT NULL,
	`tender_id` text NOT NULL,
	`subscription_id` text NOT NULL,
	`is_phantom` integer DEFAULT false NOT NULL,
	`comment` text DEFAULT '',
	FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `transactions_sub_date_idx` ON `transactions` (`subscription_id`,`date`);--> statement-breakpoint
CREATE INDEX `transactions_date_idx` ON `transactions` (`date`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`theme` text DEFAULT 'auto' NOT NULL,
	`oled_mode` integer DEFAULT false NOT NULL,
	`max_horizon` integer DEFAULT 3 NOT NULL,
	`with_color_grading` integer DEFAULT true NOT NULL,
	`explain_currency` integer DEFAULT true NOT NULL,
	`recalc_currency` text NOT NULL,
	`default_currency` text NOT NULL,
	FOREIGN KEY (`recalc_currency`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`default_currency`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action
);
