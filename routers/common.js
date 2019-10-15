/* eslint-disable strict */

'use strict';

const dal = require('../utils/dal');

const logger = require('../utils/logger');

function about(request, response)
{
    if (request.method === 'GET')
    {
        response.send({
            errorCode: 1, errorMessage: 'Заказ не найден', merchantOrderParams: [], query: request.query,
        });
    }
    if (request.method === 'POST')
    {
        response.send({ errorCode: 1, errorMessage: 'Заказ не найден', data: request.body });
    }
}

function consoleLog(request, response, next)
{
    const ip = `${request.headers['x-forwarded-for']} ${request.connection.remoteAddress}`;
    logger.log({
        level: 'info', message: `ip: ${ip} method: ${request.method}, url: ${request.url}, ua: ${request.get('user-agent')}`,
    });
    next();
}

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
module.exports.smartRouter = smartRouter;

async function ctxRouter(request, response)
{
    console.log(`${request.baseUrl} ${request.path} ${request.url} ${request.params}`);
    try
    {
        const result = await dal.routerByRegexp(request);
        response.send(result);
    }
    catch (e)
    {
        console.log(e.stack);
        response.send(e.stack);
    }
}
module.exports.ctxRouter = ctxRouter;
module.exports.about = about;
module.exports.consoleLog = consoleLog;
