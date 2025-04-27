import winston from 'winston'
import colors from 'colors'
import { env } from '#env';

class Logger {
  public logger: winston.Logger
  constructor(filename: string) {
    this.logger = winston.createLogger({
      transports: [new winston.transports.File({ filename })],
    })
  }

  log(text: string, category: string = "Info") {
    if (category === "Debug" && env().NODE_ENV !== "development") return;
    const d = new Date()
    this.logger.log({
      level: 'info',
      message: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} - ${d.getHours()}:${d.getMinutes()} | [${category}]: ${text}`,
    })
    console.log(
      colors.green(
        `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} - ${d.getHours()}:${d.getMinutes()}`,
      ) + colors.yellow(` | [${category}]: ${text}`),
    )
  }
}

export default Logger
