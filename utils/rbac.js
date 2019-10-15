/* eslint-disable strict */

'use strict';

const rules = require('../utils/routing_table');

function validateUser()
{
    return true;
}

function rbac(req, res, next)
{
    if (validateUser())
    {
        next();
    }
    else
    {
        throw new Error('No access');
    }
}
