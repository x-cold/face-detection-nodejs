import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import session from 'koa-session';
import views from 'koa-views';
import convert from 'koa-convert';
import serve from 'koa-static';
import finalHandler from './lib/middlewares/finalHandler';
import router from './router';
import IO from 'socket.io';
import socketProxy from './lib/socket/proxy';

const app = new Koa();

// Koa Http Server
app.use(finalHandler());
app.use(views(`${__dirname}/views`, {
  map: {
    html: 'nunjucks'
  }
}));
app.use(logger());
app.use(bodyParser());
app.keys = ['some secret hurr'];
app.use(convert(session(app)));
app.use(serve(__dirname + '/public'));
app
  .use(router.routes())
  .use(router.allowedMethods());

// WebSocket server
const io = new IO().attach(app);
io.on('connection', socketProxy);
io.listen(3001);

export default app;
