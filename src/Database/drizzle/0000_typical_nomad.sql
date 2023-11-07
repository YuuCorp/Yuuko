CREATE TABLE `anilistusers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`discord_id` text(18) NOT NULL,
	`anilist_token` text(3000) NOT NULL,
	`anilist_id` integer NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `announcementmodel` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`announcement` text(128) NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `userbirthday` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`guild_id` text(18) NOT NULL,
	`user_id` text(18) NOT NULL,
	`birthday` integer NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `anilistusers_discord_id_unique` ON `anilistusers` (`discord_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `anilistusers_anilist_token_unique` ON `anilistusers` (`anilist_token`);--> statement-breakpoint
CREATE UNIQUE INDEX `anilistusers_anilist_id_unique` ON `anilistusers` (`anilist_id`);