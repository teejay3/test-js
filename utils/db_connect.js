'use strict';

const { Pool } = require('pg');

// Pool.prototype.updateNews = updateNews;

const pool = new Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
});
// ошибка
// {"errorCode":"6","errorMessage":"Заказ не найден","merchantOrderParams":[],"attributes":[]}

// успех {command: "CALL", rowCount: null, oid: null, rows: Array(0), fields: Array(0), …}

pool.route_list = [{ route: '/get_news_list', db_method: 'f_get_news', call_type: 'SELECT' },
    { route: '/updateNews', db_method: 'p_update_news', call_type: 'CALL' },
    { route: '/addNews', db_method: 'p_add_news', call_type: 'CALL' },
    { route: '/get_clubs_list', db_method: 'f_get_clubs', call_type: 'SELECT' },
    { route: '/updateClub', db_method: 'p_update_club', call_type: 'CALL' },
    { route: '/addClub', db_method: 'p_add_club', call_type: 'CALL' },
    { route: '/getEventsList', db_method: 'f_get_events', call_type: 'SELECT' },
    { route: '/updateEvent', db_method: 'p_update_event', call_type: 'CALL' },
    { route: '/addEvent', db_method: 'p_add_event', call_type: 'CALL' }];

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
    str += `(' ${par} ');`;
    try
    {
        // console.log('_qquery ' + str);
        const result = await pool.query(str, params);
        let tmp;
        // console.log(result);
        // return result;
        if (callType === 'SELECT')
        {
            tmp = result.rows;
        }
        else
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
        console.log(`qquery error ${e}`);
        throw new Error(e);
    }
}

pool.qquery = qquery;

async function byRoute(route, payload)
{
    try
    {
        const r = this.route_list.find((obj) => obj.route === route);
        if (typeof r === 'undefined') throw new Error('Route not found');
        const result = await this.qquery(r.call_type, r.db_method, payload);
        return result;
    }
    catch (e)
    {
        return ({ errorCode: 1, errorMessage: e.stack, responseCode: 500 });
    }
}
pool.byRoute = byRoute;

// получает следующий заказ из базы
async function getNextOrder(token, userName, type, amount, date)
{
    const values = [token, userName, type, amount, date];
    try
    {
        const result = await this.qquery('SELECT', 'f_get_next_order', values);
        return result;
    }
    catch (e)
    {
        return ({ errorCode: 1, errorMessage: e.stack, responseCode: 500 });
    }
}
pool.getNextOrder = getNextOrder;

// обновляет идентификатор заказа
async function updateOrder(ordId, ordSysId, date)
{
    const values = [ordId, ordSysId, date];
    try
    {
        const result = await this.qquery('SELECT', 'f_update_order', values);
        return result;
    }
    catch (e)
    {
        return ({ errorCode: 1, errorMessage: e.stack, responseCode: 500 });
    }
}
pool.updateOrder = updateOrder;

// обновляет или добавляет токен для посетителя
async function updateToken(token, ip1, ip2, ua, comm)
{
    const values = [token, ip1, ip2, ua, comm];
    try
    {
        const result = await this.qquery('SELECT', 'f_insert_token', values);
        return result;
    }
    catch (e)
    {
        return ({ errorCode: 1, errorMessage: e.stack, responseCode: 500 });
    }
}

pool.updateToken = updateToken;

module.exports = pool;
