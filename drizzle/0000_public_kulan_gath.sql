CREATE TABLE `categories` (
	`slug` text PRIMARY KEY NOT NULL,
	`title` text,
	`is_system` integer DEFAULT false NOT NULL,
	`emoji` text,
	`color` text NOT NULL,
	`symbol` text,
	`logo_url` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_full_unique` ON `categories` (`emoji`,`color`);--> statement-breakpoint
CREATE TABLE `currencies` (
	`id` text PRIMARY KEY NOT NULL,
	`symbol` text NOT NULL,
	`denominator` integer DEFAULT 100 NOT NULL,
	`fraction_digits` integer DEFAULT 2 NOT NULL,
	`intl_locale` text NOT NULL,
	`region` text NOT NULL
);
--> statement-breakpoint
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
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `timeline_events_subscription_id_idx` ON `timeline_events` (`subscription_id`,`date`);--> statement-breakpoint
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
	`bundle_id` text,
	`slug` text,
	`title` text NOT NULL,
	`domains` text DEFAULT '[]',
	`social_links` text DEFAULT '{}',
	`aliases` text DEFAULT '[]' NOT NULL,
	`category_slug` text NOT NULL,
	`emoji` text,
	`color` text NOT NULL,
	`symbol` text,
	`logo_url` text,
	FOREIGN KEY (`category_slug`) REFERENCES `categories`(`slug`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `services_category_slug_idx` ON `services` (`category_slug`);--> statement-breakpoint
CREATE INDEX `services_title_idx` ON `services` (`title`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`category_slug` text NOT NULL,
	`service_id` text NOT NULL,
	`custom_name` text,
	`custom_logo` text,
	`billing_cycle_type` text DEFAULT 'months' NOT NULL,
	`billing_cycle_value` integer DEFAULT 1 NOT NULL,
	`trial_value` integer DEFAULT 1 NOT NULL,
	`trial_type` text DEFAULT 'weeks' NOT NULL,
	`first_payment_date` text DEFAULT (CURRENT_DATE) NOT NULL,
	`tender_id` text,
	`custom_symbol` text,
	`cancellation_date` text,
	`notes` text,
	`notify_enabled` integer DEFAULT false NOT NULL,
	`notify_days_before` integer DEFAULT 1 NOT NULL,
	`notify_trial_end` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`category_slug`) REFERENCES `categories`(`slug`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `subscriptions_category_slug_idx` ON `subscriptions` (`category_slug`);--> statement-breakpoint
CREATE INDEX `subscriptions_service_id_idx` ON `subscriptions` (`service_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_tender_id_idx` ON `subscriptions` (`tender_id`);--> statement-breakpoint
CREATE TABLE `tenders` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`is_card` integer DEFAULT true NOT NULL,
	`comment` text DEFAULT '',
	`emoji` text,
	`color` text NOT NULL,
	`symbol` text,
	`logo_url` text
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text DEFAULT (CURRENT_DATE) NOT NULL,
	`amount` integer NOT NULL,
	`currency_id` text NOT NULL,
	`tender_id` text,
	`subscription_id` text NOT NULL,
	`comment` text DEFAULT '',
	FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `transactions_sub_date_idx` ON `transactions` (`subscription_id`,`date`);--> statement-breakpoint
CREATE INDEX `transactions_date_idx` ON `transactions` (`date`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`theme` text DEFAULT 'auto' NOT NULL,
	`oled_mode` integer DEFAULT false NOT NULL,
	`max_horizon` integer DEFAULT 2 NOT NULL,
	`recalc_currency` text NOT NULL,
	`default_currency` text NOT NULL,
	`first_day` text DEFAULT 'monday' NOT NULL,
	`ai_enabled` integer DEFAULT false NOT NULL,
	`is_unlimited` integer DEFAULT false NOT NULL,
	`accent` text DEFAULT 'orange' NOT NULL,
	`appstore_country` text NOT NULL,
	`playstore_country` text NOT NULL,
	`playstore_lang` text NOT NULL,
	`search_sources` text DEFAULT '["inhouse","appstore","web"]' NOT NULL,
	FOREIGN KEY (`recalc_currency`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`default_currency`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`linked_subscription_id` text NOT NULL,
	`kind` text NOT NULL,
	`fire_date` text NOT NULL,
	FOREIGN KEY (`linked_subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `notifications_linked_subscription_id_idx` ON `notifications` (`linked_subscription_id`);