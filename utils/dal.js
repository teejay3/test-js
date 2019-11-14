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
