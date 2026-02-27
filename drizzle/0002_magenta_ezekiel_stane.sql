ALTER TABLE `user` ADD `is_unlimited` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `unlimited_type` text;--> statement-breakpoint
ALTER TABLE `user` ADD `unlimited_expires_at` text;