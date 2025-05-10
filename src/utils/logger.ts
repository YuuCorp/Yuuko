import winston, { config } from 'winston'
import { env } from '#env';

class Logger {
  public logger: winston.Logger;

  constructor(filename: string) {
    this.logger = winston.createLogger({
      transports: [new winston.transports.File({ filename })],
      level: env().NODE_ENV === 'development' ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} | [${level.toUpperCase()}]: ${message}`;
        })
      )
    });

    this.logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ level: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} | [${level}]: ${message}`;
        })
      ),
    }));
  }

  log(text: string, category: string = "info") {
    if (category.toLowerCase() === "debug" && env().NODE_ENV !== "development") return;
    this.logger.log(category.toLowerCase(), text);
  }
}

export default Logger
