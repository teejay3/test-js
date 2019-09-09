'use strict';

const req = require('request');
const fs = require('fs');
// const pool = require('../utils/db_connect');
const dal = require('../utils/dal');

let paymentUrl = 'https://securepayments.sberbank.ru/payment/rest/register.do?token=';
const successUrl = 'http://cybersirius.ru/success.php?order=';
let statusUrl = 'https://securepayments.sberbank.ru/payment/rest/getOrderStatusExtended.do?token=';
const ordersLog = 'orders.log';

/* var games =
    [{ 'name': "lol", 'fullName': 'League of legends', 'price': 2500 },
    { 'name': "csgo", 'fullName': 'Counter-Strike GO', 'price': 500 },
    { 'name': 'dota', 'fullName': 'Dota2', 'price': 1500 },
    { 'name': 'heart', 'fullName': 'Heartstone', 'price': 3500 },
    { 'name': 'tournament', 'fullName': 'BattleOfCities', 'price': 50 }]; */

const payments = [{ type: '0', price: 35000 },
    { type: '1', price: 400000 },
    { type: '2', price: 5000 },
    { type: '3', price: 5000 }];

// запрос к удалённому ресурсу по url
async function makeRequest(ordId, url)
{
    return new Promise((resolve, reject) => {
        req.get(url, (error, resp, body) =>
        {
            const now = new Date();
            const msg = JSON.parse(body).formUrl || JSON.parse(body).errorCode;

            // let currentUrl = new URL(url);
            // let query_string = current_url.search;
            // let search_params = new URLSearchParams(query_string);
            const searchParams = new URLSearchParams(URL(url).search);
            const order = searchParams.get('orderNumber');

            const data = `${now}\t${msg}\t${order}`;
            fs.appendFile(ordersLog, `${data} \n`, () => { });
            if (error === null)
            {
                resolve(body);
            }
            else
            {
                reject(error);
            }
        });
    });
}

// возвращает порядковый номер следующего заказа
async function getNextOrder(data)
{
    // console.log('get next order');
    // const values = [data.token, data.user_name, data.type, data.amount, new Date()];
    try
    {
        const result = await dal.getNextOrder(data.token, data.user_name, data.type, data.amount, new Date());
        // console.log(result);
        // получили номер заказа
        // const orderNum = parseInt(result[0].f_get_next_order, 10);
        // console.log(orderNum);
        return parseInt(result[0].f_get_next_order, 10);
    }
    catch (e)
    {
        console.log(e.stack);
        return -1;
    }
}

async function updateOrder(ordId, ordSysId)
{
    // const values = [ordId, ordSysId, new Date()];
    try
    {
        const result = await dal.updateOrder(ordId, ordSysId, new Date());
        // console.log(result);
    }
    catch (e)
    {
        console.log(e);
    }
}

// Боевая оплата
async function pay(request, response)
{
    // console.log('urls ' + paymentUrl + ' ' + successUrl);
    let amount = 0;
    const data = {
        user_name: '', token: '', amount: '', type: '',
    };
    // имя плательщика
    const { name } = request.body;
    data.user_name = name;
    // тип платежа
    const type = request.body.ptype;
    data.type = type;
    // токен от Php
    const { token } = request.body;
    data.token = token;
    try
    {
        // попробуем найти цену на услугу из массива
        amount = payments.find((e) => e.type === type).price;
        data.amount = amount;
        const orderNum = await getNextOrder(data);
        if (orderNum > 0)
        {
            // let succUrl = successUrl + orderNum;
            // let payUrl = paymentUrl + `&currency=643&language=ru&orderNumber=${orderNum}&amount=${data.amount}&returnUrl=${succUrl}&sessionTimeoutSecs=600`;
            const payUrl = `${paymentUrl}&currency=643&language=ru&orderNumber=${orderNum}&amount=${data.amount}&returnUrl=${successUrl + orderNum}&sessionTimeoutSecs=600`;
            const bdy = await makeRequest(orderNum, payUrl);
            updateOrder(orderNum, JSON.parse(bdy).orderId);
            response.send(bdy);
        }
    }
    catch (e)
    {
        console.log(e);
        response.send({ errorCode: 0, errorText: `Wrong parameters ${e.stack}` });
    }
}

function getOrderInfo(orderId)
{
    const statUrl = `${statusUrl}&orderId=${orderId}`;
    return new Promise((resolve, reject) =>
    {
        req.get(statUrl, (error, resp, bdy) =>
        {
            if (error === null)
            {
                resolve(bdy);
            }
            else
            {
                reject(error);
            }
        });
    });
}

// 7e6aa1ae-3888-7e60-9e3c-9e2c5e18617a
// {"errorCode":"0","errorMessage":"Успешно","orderNumber":"96","orderStatus":6,"actionCode":-2007,"actionCodeDescription":"Истек срок ожидания ввода данных.","amount":35000,"currency":"643","date":1567576474073,"orderDescription":"","merchantOrderParams":[],"attributes":[{"name":"mdOrder","value":"9d5ec036-b573-7aa3-9d54-27a501fa9b92"}],"terminalId":"21224205","paymentAmountInfo":{"paymentState":"DECLINED","approvedAmount":0,"depositedAmount":0,"refundedAmount":0},"bankInfo":{"bankCountryCode":"UNKNOWN","bankCountryName":"<Неизвестно>"}}
// {"errorCode":"6","errorMessage":"Заказ не найден","merchantOrderParams":[],"attributes":[]}
async function getOrderStatus(request, response)
{
    const { orderId } = request.body;
    // let token = request.body.token;
    if (orderId === null) response.status(200);
    try
    {
        const bdy = await getOrderInfo(orderId);
        response.send(bdy);
    }
    catch (e)
    {
        console.log(e);
    }
}

function setUrls(token)
{
    paymentUrl += token;
    statusUrl += token;
}

// module.exports.get_next_order = get_next_order;
module.exports.pay = pay;
// module.exports.updateOrder = updateOrder;
module.exports.getOrderStatus = getOrderStatus;
module.exports.setUrls = setUrls;

module.exports.paymentUrl = paymentUrl;
// module.exports.successUrl = successUrl;
module.exports.statusUrl = statusUrl;
