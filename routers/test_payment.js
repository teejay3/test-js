"use strict";

//const pool = require('../utils/db_connect');
const pay = require('./payments');

var paymentTestUrl = "https://3dsec.sberbank.ru/payment/rest/register.do?token=";
var statusTestUrl = 'https://3dsec.sberbank.ru/payment/rest/getOrderStatusExtended.do?token=';

function testPay(request, response)
{
    let amount = 0;
    let data = {user_name:'', token:'', amount:'', url:paymentTestUrl, successUrl:pay.successUrl, type:''};
    try
    {
        //имя плательщика
        let name = request.body.name;
        data.user_name = name;
        //тип платежа
        let type = request.body.ptype;
        data.type = type;
        //токен от Php
        let token = request.body.token;
        data.token = token;
        try
        {
            //попробуем найти цену на услугу из массива
            amount = payments.find(e => e.type === type).price;
            data.amount = amount;
        } 
        catch(e)
        {	
            response.send(JSON.parse('{"errorCode":0, "errorText":"Wrong parameters"}'));
        }
        try
        {
    	    pay.get_next_order(data, response, makeRequest);
        }
        catch (e)
        {
            console.log(e);
        }
	}
    catch (e)
    {
	    console.log('error parsing query string');
	    console.log(e);
	    response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	    response.send(JSON.parse('{"errorCode":0, "errorText":"Wrong parameters"}'));
    }
}

function set_urls(token)
{
	paymentTestUrl += token;
	statusTestUrl += token;
}

module.exports.testPay = testPay;
module.exports.paymentTestUrl = paymentTestUrl;
module.exports.statusTestUrl = statusTestUrl;
module.exports.set_urls = set_urls;