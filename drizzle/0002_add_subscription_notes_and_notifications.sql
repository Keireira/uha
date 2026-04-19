ALTER TABLE `subscriptions` ADD `notes` text;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `notify_enabled` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `notify_days_before` text DEFAULT '[1]' NOT NULL;