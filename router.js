import Router from 'koa-router';

const router = new Router();

router.get('/', async (ctx) => {
  await ctx.render('index.html');
});

export default router;
