ALTER TABLE `currencies` ADD `fraction_digits` integer DEFAULT 2 NOT NULL;--> statement-breakpoint
ALTER TABLE `currencies` ADD `intl_locale` text NOT NULL;--> statement-breakpoint
ALTER TABLE `currencies` ADD `region` text NOT NULL;--> statement-breakpoint
ALTER TABLE `currencies` DROP COLUMN `is_favorite`;