import winston from "winston";
import { env } from "#env";
import type { Command, UsableInteraction } from "#structures/command";

export type LogLevel = "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";

type LogMeta = {
  command?: string;
  subcommand?: string;
  user?: string;
  userId?: string;
  guildId?: string;
  [key: string]: unknown;
};

class Logger {
  public logger: winston.Logger;

  constructor(filename: string) {
    this.logger = winston.createLogger({
      level: "debug",
      transports: [
        new winston.transports.File({
          filename,
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
      ],
    });

    this.logger.add(
      new winston.transports.Console({
        level: env().NODE_ENV === "development" ? "debug" : "info",
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
            return `${timestamp} | [${level}]: ${message} ${metaStr}`;
          }),
        ),
      }),
    );
  }

  log(level: LogLevel, message: string, meta?: LogMeta) {
    this.logger.log(level, message, meta);
  }

  info(message: string, meta?: LogMeta) {
    this.logger.info(message, meta);
  }

  error(message: string, meta?: LogMeta) {
    this.logger.error(message, meta);
  }

  debug(message: string, meta?: LogMeta) {
    this.logger.debug(message, meta);
  }

  logCommand(command: Command, interaction: UsableInteraction) {
    if (!interaction.isChatInputCommand()) return;
    const subcommand = interaction.options.getSubcommand(false) ?? "";

    this.log("info", "Command executed", {
      command: command.name,
      subcommand,
      user: interaction.user.tag,
      userId: interaction.user.id,
    });
  }
}

export default Logger;
