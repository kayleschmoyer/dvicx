import winston from 'winston';
import 'winston-daily-rotate-file';
import dotenv from 'dotenv';

dotenv.config();

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: process.env.LOG_FILE || 'logs/backend.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxFiles: '14d',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console(), dailyRotateFileTransport],
});

export default logger;
