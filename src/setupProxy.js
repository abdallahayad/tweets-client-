const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://us-central1-my-social-app-fdb68.cloudfunctions.net',
      changeOrigin: true,
    })
  );
};
