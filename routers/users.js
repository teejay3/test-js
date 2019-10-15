/* eslint-disable strict */

'use strict';

const logger = require('../utils/logger');
const dal = require('../utils/dal');

async function login(request, response)
{
    try
    {
        const result = await dal.routerByRegexp(request);
        if (!result[0].message && result[0].userid !== '-1') // не очень хорошее место, может проскочить
        {
            // послать емайл с подтверждением, токен взять из ответа
            response.json({
                errorCode: 0, userid: result[0].userid, type: result[0].person_type, token: 'test1-token', role: result[0].role,
            });
        }
        else
        {
            // logger.error({ message: `Login/register error: ${request.path} ${Object.values(request.body)} ${result[0].message}` });
            // response.json({ errorCode: 1, errorMessage: result[0].message });
            throw new Error(result[0].message);
        }
    }
    catch (e)
    {
        logger.error({ message: `Login/register error: ${request.path} ${Object.values(request.body)} ${e.message}` });
        response.json({ errorCode: 1, errorMessage: e.message });
    }
}

module.exports.login = login;
