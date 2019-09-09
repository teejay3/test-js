'use strict';

const fs = require('fs');

const dal = require('../utils/dal');

const accessLog = 'access.log';

// Добавляет новый токен в базу и больше ничего не делает
async function handleToken(request, response)
{
// console.log('token request');
// console.log(request.body);
    const { token } = request.body;
    const { ip1 } = request.body.ip1;
    const { ip2 } = request.body.ip2;
    const { ua } = request.body.ua;
    const { comm } = request.body.comm;
    if (token === null) response.status(200);

    try
    {
        const result = await dal.updateToken(token, ip1, ip2, ua, comm);
        response.status(200).send(result);
    }
    catch (e)
    {
        console.log(e.stack);
        response.status(200).send({ errorCode: 0, errorText: 'Unable to handle token' });
    }
    /* const values = [token, ip1, ip2, ua, comm];

    try{
         pool.query('SELECT * FROM f_insert_token($1, $2, $3, $4, $5)', values, (error, results) => {
            if (error)
            {
             console.log(error.stack);
            }
            response.status(201).send({"ok":token});
        });
    }
    catch(e)
    {
        console.log(e);
        response.status(200).send({"errorCode": 0, "errorText":"Unable to handle token"});
    } */
}

/* app.post('/user', urlencodedParser, function(request, response)
{
    console.log(request.body);
    if(!request.body) return response.sendStatus(400);
    response.json(`${request.body.userName} - ${request.body.userAge}`);
}); */

function about(request, response)
{
    response.send({ ok: 'wrong path' });
}

function consoleLog(request, response, next)
{
    // let now = new Date();
    const ip = `${request.headers['x-forwarded-for']} ${request.connection.remoteAddress}`;
    const data = `${new Date()}\t${ip}\t${request.method}\t${request.url}\t${request.get('user-agent')}`;
    console.log(data);
    fs.appendFile(accessLog, `${data}\n`, () => { });
    next();
}

module.exports.handleToken = handleToken;
module.exports.about = about;
module.exports.consoleLog = consoleLog;
