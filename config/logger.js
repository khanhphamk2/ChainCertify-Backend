const winston = require('winston');
const config = require('./config');

const logger = winston.createLogger({
    level: config.env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.errors({ stack: true }), // Tự động xử lý lỗi và chuyển đổi chúng thành stack trace
        config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.simple() // Sử dụng định dạng log đơn giản
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error'], // Ghi log lỗi vào stderr
        }),
    ],
});

module.exports = logger;
