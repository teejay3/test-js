/* eslint-disable strict */

'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const comm = require('./common');
const users = require('./users');

const newsRouter = express.Router();

newsRouter.put('/:id', urlencodedParser, comm.ctxRouter);
newsRouter.delete('/:id', comm.ctxRouter);
newsRouter.get('/', comm.ctxRouter);
newsRouter.post('/', urlencodedParser, comm.ctxRouter);

module.exports.newsRouter = newsRouter;

const eventsRouter = express.Router();

eventsRouter.get('/types', comm.ctxRouter);
eventsRouter.put('/:id', urlencodedParser, comm.ctxRouter);
eventsRouter.delete('/:id', comm.ctxRouter);
eventsRouter.post('/', urlencodedParser, comm.ctxRouter);
eventsRouter.get('/', comm.ctxRouter);

module.exports.eventsRouter = eventsRouter;

const clubsRouter = express.Router();

clubsRouter.put('/:id', urlencodedParser, comm.ctxRouter);
clubsRouter.delete('/:id', comm.ctxRouter);
clubsRouter.post('/', urlencodedParser, comm.ctxRouter);
clubsRouter.get('/', comm.ctxRouter);

module.exports.clubsRouter = clubsRouter;

const userRouter = express.Router();

userRouter.get('/:id/group', comm.ctxRouter);
userRouter.put('/:id/pass', urlencodedParser, comm.ctxRouter);
userRouter.put('/:id/admpass', urlencodedParser, comm.ctxRouter);
userRouter.get('/types', comm.ctxRouter);
userRouter.get('/roles', comm.ctxRouter);
userRouter.get('/teachers', comm.ctxRouter);
userRouter.post('/login', urlencodedParser, users.login);
userRouter.get('/:id', comm.ctxRouter);
userRouter.put('/:id', urlencodedParser, comm.ctxRouter);
userRouter.delete('/:id', comm.ctxRouter);
userRouter.post('/', urlencodedParser, users.login);
userRouter.get('/', comm.ctxRouter);

module.exports.userRouter = userRouter;

const groupRouter = express.Router();

groupRouter.get('/:id', comm.ctxRouter);
groupRouter.put('/:id/student/:studId', urlencodedParser, comm.ctxRouter);
groupRouter.get('/:id/notstudent/', comm.ctxRouter);
groupRouter.get('/:id/student/', comm.ctxRouter);
groupRouter.delete('/:id/student/:studId', comm.ctxRouter);
groupRouter.delete('/:id', comm.ctxRouter);
groupRouter.put('/:id', urlencodedParser, comm.ctxRouter);
groupRouter.post('/', urlencodedParser, comm.ctxRouter);
groupRouter.get('/', comm.ctxRouter);

module.exports.groupRouter = groupRouter;

const gamesRouter = express.Router();

gamesRouter.get('/:id', comm.ctxRouter);
gamesRouter.put('/:id', urlencodedParser, comm.ctxRouter);
gamesRouter.delete('/:id', comm.ctxRouter);
gamesRouter.post('/', urlencodedParser, comm.ctxRouter);
gamesRouter.get('/', comm.ctxRouter);

module.exports.gamesRouter = gamesRouter;

const trainersRouter = express.Router();

trainersRouter.get('/:id', comm.ctxRouter);
trainersRouter.put('/:id', urlencodedParser, comm.ctxRouter);
trainersRouter.delete('/:id', comm.ctxRouter);
trainersRouter.post('/', urlencodedParser, comm.ctxRouter);
trainersRouter.get('/', comm.ctxRouter);

module.exports.trainersRouter = trainersRouter;

const defaultRouter = express.Router();
defaultRouter.use('/', (request, response) =>
{
    response.status(404);
});

module.exports.defaultRouter = defaultRouter;

const aboutRouter = express.Router();
aboutRouter.get('/', comm.about);
aboutRouter.post('/', urlencodedParser, comm.about);

module.exports.aboutRouter = aboutRouter;

// const orderRouter = express.Router();
// orderRouter.post();

// module.exports.orderRouter = orderRouter;
