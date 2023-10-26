import winston from 'winston'
import colors from 'colors'

class Logger {
  public logger: winston.Logger
  constructor(filename: string) {
    this.logger = winston.createLogger({
      transports: [new winston.transports.File({ filename })],
    })
  }

  log(text: string) {
    const d = new Date()
    this.logger.log({
      level: 'info',
      message: `${d.getHours()}:${
        d.getMinutes
      } - ${d.getDate()}:${d.getMonth()}:${d.getFullYear()} | Info: ${text}`,
    })
    console.log(
      colors.green(
        `${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`,
      ) + colors.yellow(` | Info: ${text}`),
    )
  }
}

export default Logger
