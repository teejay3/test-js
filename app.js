/* eslint-disable strict */

'use strict';

const express = require('express');

const app = express();
const bodyParser = require('body-parser');
// const compression = require('compression');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// подключаем маршруты
const logger = require('./utils/logger.js');
const comm = require('./routers/common');
const dal = require('./utils/dal.js');

const payment = require('./routers/payments');
const testPayment = require('./routers/test_payment');
const users = require('./routers/users');

async function smartRouter(request, response)
{
    let payload;
    if (request.method === 'GET') payload = Object.values(request.query);
    else payload = Object.values(request.body);
    console.log(payload);
    // payload.forEach((o) => { if (o === '') return null; return 0; });//!!!!!!
    const result = await dal.smartRouter(request.path, payload);
    console.log(result);
    response.send(result);
}

// app.use(compression());
// app.user(comm.rbac);
// логирование
app.use(comm.consoleLog);

app.disable('x-powered-by');

app.post('/payment.do', urlencodedParser, payment.pay);
app.post('/paymentTest.do', urlencodedParser, testPayment.testPay);
// app.post('/addToken', urlencodedParser, comm.handleToken);
app.post('/addToken', urlencodedParser, smartRouter);
// сделать get!!!!
app.post('/getOrderStatus', urlencodedParser, payment.getOrderStatus);

app.post('/addNews', urlencodedParser, smartRouter);
app.post('/updateNews', urlencodedParser, smartRouter);
app.post('/updateClub', urlencodedParser, smartRouter);
app.post('/addClub', urlencodedParser, smartRouter);
app.post('/addEvent', urlencodedParser, smartRouter);
app.post('/updateEvent', urlencodedParser, smartRouter);
app.get('/get_news_list', smartRouter);
app.get('/getEventsList', smartRouter);
app.get('/get_clubs_list', smartRouter);

app.post('/loginUser', urlencodedParser, users.login);
app.post('/registerUser', urlencodedParser, users.login);

app.get('/about', comm.about);
app.post('/about', urlencodedParser, comm.about);

function init()
{
    const environment = process.env.NODE_ENV || 'development';
    const port = process.env.PORT || process.env.SERVER_PORT || 4200;

    payment.setUrls(process.env.TOKEN);
    testPayment.set_urls(process.env.TEST_TOKEN);

    if (environment === 'development')
    {
        logger.info({ message: `Server started at port ${port} in ${environment} mode` });
    }
    app.listen(port, () => { logger.info({ level: 'info', message: 'Server started.' }); });
}

process.on('uncaughtException', (err) =>
{
    logger.error({ message: `Server critical error:\n ${err.stack}` });
    process.exit(1);
});

app.init = init;
app.init();
// module.exports.app = app;
