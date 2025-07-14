CREATE TABLE `apps` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text,
	`title` text NOT NULL,
	`color` text NOT NULL,
	`aliases` text DEFAULT '[]',
	`category_id` text,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `apps_id_unique` ON `apps` (`id`);--> statement-breakpoint
CREATE TABLE `billing_cycles` (
	`id` text PRIMARY KEY NOT NULL,
	`min` integer NOT NULL,
	`max` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `billing_cycles_id_unique` ON `billing_cycles` (`id`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`emoji` text NOT NULL,
	`color` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_id_unique` ON `categories` (`id`);--> statement-breakpoint
CREATE TABLE `currencies` (
	`id` text PRIMARY KEY NOT NULL,
	`symbol` text NOT NULL,
	`is_favorite` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `currencies_id_unique` ON `currencies` (`id`);--> statement-breakpoint
CREATE TABLE `currency_rates` (
	`id` text PRIMARY KEY NOT NULL,
	`currency_id` text,
	`date` text DEFAULT (CURRENT_DATE),
	`rates` text DEFAULT '{}',
	FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `currency_rates_id_unique` ON `currency_rates` (`id`);--> statement-breakpoint
CREATE TABLE `payment_methods` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`is_card` integer DEFAULT true NOT NULL,
	`comment` text DEFAULT '',
	`color` text NOT NULL,
	`emoji` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_methods_id_unique` ON `payment_methods` (`id`);--> statement-breakpoint
CREATE TABLE `prices_history` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` real NOT NULL,
	`date` text DEFAULT (CURRENT_DATE)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `prices_history_id_unique` ON `prices_history` (`id`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text,
	`app_id` text,
	`custom_name` text,
	`currency_id` text,
	`amount` real NOT NULL,
	`first_payment_date` text DEFAULT (CURRENT_DATE),
	`billing_cycle` text,
	`payment_method_id` text,
	`prices_history` text DEFAULT '[]',
	`note` text,
	`is_canceled` integer DEFAULT false NOT NULL,
	`cancellation_date` text DEFAULT (CURRENT_DATE),
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`app_id`) REFERENCES `apps`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_id_unique` ON `subscriptions` (`id`);--> statement-breakpoint
CREATE TABLE `user` (
	`recalc_currency` text,
	`default_currency` text,
	FOREIGN KEY (`recalc_currency`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`default_currency`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE no action
);
