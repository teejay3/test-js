/* eslint-disable strict, object-curly-newline */

'use strict';

const { Pool } = require('pg');
const logger = require('./logger');
const rules = require('./routing_table');

function getConfig()
{
    if (process.env.DATABASE_URL)
    {
        return { connectionString: process.env.DATABASE_URL, ssl: true };
    }
    return {
        user: process.env.DBUSER,
        host: process.env.DBHOST,
        database: process.env.DBNAME,
        password: process.env.DBPASSWORD,
        port: process.env.DBPORT,
        ssl: true };
}

const config = getConfig();

// console.log(config);

/* connectionString: process.env.DATABASE_URL,

PGUSER=dbuser \
PGHOST=database.server.com \
PGPASSWORD=secretpassword \
PGDATABASE=mydb \
PGPORT=3211 */

/* const pool = new Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    ssl: true,
}); */
const pool = new Pool(config);
// ошибка
// {"errorCode":"6","errorMessage":"Заказ не найден","merchantOrderParams":[],"attributes":[]}

// успех {command: "CALL", rowCount: null, oid: null, rows: Array(0), fields: Array(0), …}

pool.routes = rules.routes;
pool.rules = rules.rules;

async function qquery(callType, dbMethod, params)
{
    let str = '';
    if (callType === 'CALL')
    {
        str += `CALL ${dbMethod}`;
    }
    else if (callType === 'SELECT')
    {
        str += `SELECT * from ${dbMethod}`;
    }
    // console.log('_qquery ' + str);
    let par = '';
    for (let i = 0; i < params.length; i++)
    {
        const t = i + 1;
        par += `$${t}`;
        if (i !== params.length - 1) par += ', ';
    }
    str += `( ${par} );`;
    try
    {
        // console.log(`_qquery ${str}`);
        // console.log('_qquery ' + JSON.stringify(params));
        const result = await pool.query(str, params);
        let tmp = null;
        // console.log(result);
        // return result;
        if (callType === 'SELECT')
        {
            tmp = result.rows;
        }
        else if (callType === 'CALL')
        {
            tmp = result;
        }
        tmp.errorCode = 0;
        tmp.errorMessage = 'Успех';
        tmp.responseCode = '200';
        return tmp;
    }
    catch (e)
    {
        logger.error({ message: `Query error: ${e.stack}` });
        throw new Error(e);
    }
}

pool.qquery = qquery;

async function byRoute(route, payload)
{
    try
    {
        const r = this.routes.find((obj) => obj.route === route);
        if (typeof r === 'undefined') throw new Error(`Route not found ${route}`);
        const result = await this.qquery(r.call_type, r.db_method, payload);
        return result;
    }
    catch (e)
    {
        logger.error({ message: `Query by route error: ${e.stack}` });
        return ({ errorCode: 1, errorMessage: e.stack, responseCode: 500 });
    }
}
pool.byRoute = byRoute;

async function byRegexp(ctx)
{
    try
    {
        const r = pool.rules.find((obj) => obj.path.test(ctx.baseUrl + ctx.url)
        && obj.method === ctx.method);
        if (typeof r === 'undefined') throw new Error('Route not found');
        let payload = null;
        if (Object.keys(ctx.params).length === 0 && ctx.params.constructor === Object)
        {
            // console.log('params is null');
        }
        else
        {
            payload = Object.values(ctx.params);
            // console.log('params is ');
            // console.log(ctx.params);
        }
        if (ctx.method === 'GET' || ctx.method === 'DELETE')
        {
            if (payload !== null && typeof payload !== 'undefined' && payload.length > 0)
            {
                payload = payload.concat(Object.values(ctx.query));
            }
            else payload = Object.values(ctx.query);
        }
        else if (ctx.method === 'POST' || ctx.method === 'PUT')
        {
            if (payload !== null && typeof payload !== 'undefined' && payload.length > 0)
            {
                payload = payload.concat(Object.values(ctx.body));
            }
            else payload = Object.values(ctx.body);
        }
        else
        {
            throw new Error(`Unknown method ${ctx.method}`);
        }
        // console.log(payload);
        return this.qquery(r.call_type, r.db_method, payload);
    }
    catch (e)
    {
        logger.error({ message: `Query by regexp error: ${e.stack}` });
        return ({ errorCode: 1, errorMessage: e.stack, responseCode: 500 });
    }
}
pool.byRegexp = byRegexp;

module.exports = pool;
