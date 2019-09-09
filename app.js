'use strict';

const express = require('express');

const app = express();
const bodyParser = require('body-parser');
// const compression = require('compression');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// подключаем маршруты
const logger = require('./utils/logger');
const comm = require('./routers/common');
const dal = require('./utils/dal.js');

const payment = require('./routers/payments');
const testPayment = require('./routers/test_payment');

async function smartRouter(request, response)
{
    let payload;
    if (request.method === 'GET') payload = Object.values(request.query);
    else payload = Object.values(request.body);
    payload.forEach((o) => { if (o === '') return null; return 0; });
    const result = await dal.smartRouter(request.path, payload);
    response.send(result);
}

// app.use(compression());
// логирование, пока через console.log
app.use(comm.consoleLog);

app.disable('x-powered-by');

app.post('/payment.do', urlencodedParser, payment.pay);
app.post('/paymentTest.do', urlencodedParser, testPayment.testPay);
app.post('/addToken', urlencodedParser, comm.handleToken);
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

app.get('/about', comm.about);

function init()
{
    const environment = process.env.NODE_ENV || 'development';
    const port = process.env.SERVER_PORT || 4200;

    payment.setUrls(process.env.TOKEN);
    testPayment.set_urls(process.env.TEST_TOKEN);

    if (environment === 'development')
    {
        console.log(`running in ${environment} mode`);
        console.log(`active port: ${port}`);
    }
    app.listen(port, () => { logger.info('app started'); });
    // DEBUG=express:* node app.js
}

app.init = init;
app.init();
// module.exports.app = app;
