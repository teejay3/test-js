/* eslint-disable strict */

'use strict';

const db = require('../utils/db_connect');

// универсальный маршрут для типовых операций
async function smartRouter(route, payload)
{
    // let result = await db.by_route(route, payload);
    return db.byRoute(route, payload);
}
module.exports.smartRouter = smartRouter;

// универсальный маршрут для типовых операций
async function routerByRegexp(ctx)
{
    // let result = await db.by_route(route, payload);
    try
    {
        return db.byRegexp(ctx);
    }
    catch (e)
    {
        throw new Error(e.stack);
    }
}
module.exports.routerByRegexp = routerByRegexp;
// заказы, оплата
/* async function getNextOrder(token, userName, type, amount, date)
{
    // const result = await db.getNextOrder(token, userName, type, amount, date);
    // return result;
    return db.getNextOrder(token, userName, type, amount, date);
} */

/* async function updateOrder(values)
{
    const result = await db.qquery('SELECT', 'f_update_order', values);
    return result;
    // const result = await db.updateOrder(ordId, ordSysId, date);
    // return result;
} */

/* async function updateToken(token, ip1, ip2, ua, comm)
{
    const result = await db.updateToken(token, ip1, ip2, ua, comm);
    return result;
} */

// module.exports.getNextOrder = getNextOrder;
// module.exports.updateOrder = updateOrder;
// module.exports.updateToken = updateToken;
