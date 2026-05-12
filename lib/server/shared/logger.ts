import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf((info: any) => {
  const { level, message, label, timestamp } = info;
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${date.toDateString()} ${hour}:${minutes}:${seconds} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(label({ label: 'SERVER-NAME' }), timestamp(), myFormat),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'winston',
        'success',
        '%DATE%-success.log',
      ),
      datePattern: 'DD-MM-YYYY-HH',
      maxSize: '20m',
      maxFiles: '1d',
    }),
  ],
});

const errorLogger = winston.createLogger({
  level: 'error',
  format: combine(label({ label: 'SERVER-NAME' }), timestamp(), myFormat),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'winston',
        'error',
        '%DATE%-error.log',
      ),
      datePattern: 'DD-MM-YYYY-HH',
      maxSize: '20m',
      maxFiles: '1d',
    }),
  ],
});

export { errorLogger, logger };
