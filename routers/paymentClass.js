/* eslint-disable strict */
/* eslint-disable max-len */

'use strict';

const req = require('request');
const logger = require('../utils/logger');
const dal = require('../utils/dal');

class CPayment
{
    constructor(env, token)
    {
        this.successUrl = 'http://cybersirius.ru/success.php?order=';
        if (env === 'development')
        {
            this.paymentUrl = `https://3dsec.sberbank.ru/payment/rest/register.do?token=${token}`;
            this.statusUrl = `https://3dsec.sberbank.ru/payment/rest/getOrderStatusExtended.do?token=${token}`;
            this.payments = [{ type: '0', price: 350 },
                { type: '1', price: 400 },
                { type: '2', price: 500 },
                { type: '3', price: 500 }];
        }
        else
        {
            this.paymentUrl = `https://securepayments.sberbank.ru/payment/rest/register.do?token=${token}`;
            this.statusUrl = `https://securepayments.sberbank.ru/payment/rest/getOrderStatusExtended.do?token=${token}`;
            this.payments = [{ type: '0', price: 35000 },
                { type: '1', price: 400000 },
                { type: '2', price: 5000 },
                { type: '3', price: 5000 }];
        }
    }

    // запрос к удалённому ресурсу по url
    async makeRequest(url)
    {
        return new Promise((resolve, reject) =>
        {
            req.get(url, (error, resp, body) =>
            {
                !error ? resolve(body) : reject(error);
            });
        });
    }

    // возвращает порядковый номер следующего заказа
    async getNextOrder(data)
    {
        try
        {
            const result = await dal.smartRouter(
                this.getNextOrder.name,
                [
                    data.token,
                    data.user_name,
                    data.type,
                    data.amount,
                    new Date(),
                ],
            );
            // получили номер заказа
            return parseInt(result[0].f_get_next_order, 10);
        }
        catch (e)
        {
            logger.error({ message: `Get next order error: ${e.stack}` });
            return -1;
        }
    }

    async updateOrder(ordId, ordSysId)
    {
        dal.smartRouter(this.updateOrder.name, [ordId, ordSysId, new Date()]);
    }

    // Боевая оплата
    async pay(request, response)
    {
        let amount = 0;
        const data = {
            user_name: '', token: '', amount: '', type: '',
        };
        // имя плательщика, токен от Php, тип платежа
        const { name, token, ptype: type } = request.body;
        data.user_name = name;
        data.type = type;
        data.token = token;
        try
        {
            // попробуем найти цену на услугу из массива
            amount = this.payments.find((e) => e.type === type).price;
            data.amount = amount;
            // console.log(`price amount ${data.amount}`);
            const orderNum = await this.getNextOrder(data);
            // console.log(`next order ${orderNum}`);
            if (orderNum > 0)
            {
                const payUrl = `${this.paymentUrl}&currency=643&language=ru&orderNumber=${orderNum}&amount=${data.amount}&returnUrl=${this.successUrl + orderNum}&sessionTimeoutSecs=600`;
                // console.log(`pay url ${payUrl}`);
                const bdy = await this.makeRequest(payUrl);
                // console.log(`response ${bdy}`);
                this.updateOrder(orderNum, JSON.parse(bdy).orderId);
                logger.warn({ message: `Order update ${orderNum} ${JSON.parse(bdy).orderId}` });
                response.send(bdy);
            }
            else
            {
                throw new Error('Нудалось получить следующий номер заказа');
            }
        }
        catch (e)
        {
            logger.error({ message: `Payment error: ${e.stack}` });
            response.send({ errorCode: 0, errorText: `Wrong parameters ${e.stack}` });
        }
    }

    async getOrderStatus(request, response)
    {
        const { id: orderId } = request.params;
        // console.log(orderId);
        if (orderId === null) throw new Error('Номер заказа не передан');
        try
        {
            const statUrl = `${this.statusUrl}&orderId=${orderId}`;
            // console.log(`order status ${statUrl}`);
            const bdy = await this.makeRequest(statUrl);
            // console.log(`status response ${bdy}`);
            response.send(bdy);
        }
        catch (e)
        {
            logger.error({ message: `Get order status error: ${e.stack}` });
        }
    }
}

module.exports.CPayment = CPayment;
