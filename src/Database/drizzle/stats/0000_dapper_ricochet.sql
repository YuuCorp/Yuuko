CREATE TABLE `animestats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`mediaId` integer NOT NULL,
	`users` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mangastats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`mediaId` integer NOT NULL,
	`users` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `animestats_id_unique` ON `animestats` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `animestats_mediaId_unique` ON `animestats` (`mediaId`);--> statement-breakpoint
CREATE UNIQUE INDEX `mangastats_id_unique` ON `mangastats` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `mangastats_mediaId_unique` ON `mangastats` (`mediaId`);