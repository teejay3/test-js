const winston = require('winston');

const {
    combine, timestamp, prettyPrint, padLevels, simple
} = winston.format;

const logger = winston.createLogger({
    levels: winston.config.npm.levels,
    format: combine(timestamp(),
        prettyPrint(),
        padLevels()),
    transports: [
        new winston.transports.File({ filename: './error.log', level: 'error' }),
        new winston.transports.File({ filename: './info.log', level: 'info' })],
});

if (process.env.NODE_ENV !== 'production')
{
    const myFormat = winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
    });
    logger.add(new winston.transports.Console({ levels: 'info', format: myFormat }));
}

module.exports = logger;

// logger.log({message:'Error',
//           level:'error' ,
//           transationId:'one',
//           correlationId:'one',
//           response:error, status:500 ,
//           operation:'demoFunction' });

// logger.log({message:'Request recieved', level:'info' ,
//         transationId:'one', correlationId:'one',
//         request:req.query ,
//         operation:'demoFunction' })
