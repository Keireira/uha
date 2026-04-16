ALTER TABLE `subscriptions` ADD `custom_emoji` text;--> statement-breakpoint
ALTER TABLE `user` ADD `color_presets` text DEFAULT '["#F26D6D", "#F28865", "#F2A856", "#F2C94C", "#D9CE4A", "#A6C957", "#6DB865", "#4FB093", "#4AB8B3", "#5BC0D8", "#5AA9E6", "#6B8CEA", "#7A7EE8", "#9B7AE5", "#B573DB", "#D66FC9", "#E66BA5", "#ED6882"]' NOT NULL;
