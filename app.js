/* eslint-disable strict */

'use strict';

const express = require('express');

const app = express();
let classPayment = null;
const bodyParser = require('body-parser');
// const compression = require('compression');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const logger = require('./utils/logger.js');
const comm = require('./routers/common');
const CPayment = require('./routers/paymentsClass');
const routes = require('./routers/routes');

function startApp(port)
{
    // app.use(compression());
    // app.use(rbac.rbac);
    // логирование
    app.use(comm.consoleLog);
    app.disable('x-powered-by');

    app.post('/order', urlencodedParser, classPayment.pay.bind(classPayment));
    // или вот так es6: router.get('/users', (...args) => userController.list(...args));
    app.get('/order/:id', classPayment.getOrderStatus.bind(classPayment));

    app.post('/token', urlencodedParser, comm.ctxRouter);

    app.use('/about', routes.aboutRouter);
    app.use('/news', routes.newsRouter);
    app.use('/event', routes.eventsRouter);
    app.use('/club', routes.clubsRouter);
    app.use('/user', routes.userRouter);
    app.use('/group', routes.groupRouter);
    app.use('/game', routes.gamesRouter);
    app.use('/trainer', routes.trainersRouter);
    app.use('/', routes.defaultRouter);

    app.listen(port, () => { logger.info({ level: 'info', message: 'Server started.' }); });
}

function init()
{
    const environment = process.env.NODE_ENV || 'development';
    const port = process.env.PORT || process.env.SERVER_PORT || 4200;

    if (environment === 'development')
    {
        classPayment = new CPayment.CPayment(environment, process.env.TEST_TOKEN);
        logger.info({ message: `Server started at port ${port} in ${environment} mode` });
    }
    else
    {
        classPayment = new CPayment.CPayment(environment, process.env.TOKEN);
    }
    startApp(port);
}

process.on('uncaughtException', (err) =>
{
    logger.error({ message: `Server critical error:\n ${err.stack}` });
    process.exit(1);
});

app.init = init;
app.init();
