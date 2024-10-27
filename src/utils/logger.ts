import winston from 'winston'
import colors from 'colors'

class Logger {
  public logger: winston.Logger
  constructor(filename: string) {
    this.logger = winston.createLogger({
      transports: [new winston.transports.File({ filename })],
    })
  }

  log(text: string, category: string) {
    if (category === "Debug" && process.env.NODE_ENV !== "development") return;
    const d = new Date()
    const categoryText = category ? category : 'Info'
    this.logger.log({
      level: 'info',
      message: `${d.getHours()}:${d.getMinutes
        } - ${d.getDate()}:${d.getMonth()}:${d.getFullYear()} | [${categoryText}]: ${text}`,
    })
    console.log(
      colors.green(
        `${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`,
      ) + colors.yellow(` | [${categoryText}]: ${text}`),
    )
  }
}

export default Logger
