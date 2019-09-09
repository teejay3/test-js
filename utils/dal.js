'use strict';

const db = require('../utils/db_connect');

// универсальный маршрут для типовых операций
async function smartRouter(route, payload)
{
    // let result = await db.by_route(route, payload);
    return db.byRoute(route, payload);
}
module.exports.smartRouter = smartRouter;

// заказы, оплата
async function getNextOrder(token, userName, type, amount, date)
{
    const result = await db.getNextOrder(token, userName, type, amount, date);
    return result;
}

async function updateOrder(ordId, ordSysId, date)
{
    const result = await db.updateOrder(ordId, ordSysId, date);
    return result;
}

async function updateToken(token, ip1, ip2, ua, comm)
{
    const result = await db.updateToken(token, ip1, ip2, ua, comm);
    return result;
}

module.exports.getNextOrder = getNextOrder;
module.exports.updateOrder = updateOrder;
module.exports.updateToken = updateToken;
