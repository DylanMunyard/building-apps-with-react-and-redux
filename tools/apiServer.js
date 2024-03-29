/*
This uses json-server, but with the module approach: https://github.com/typicode/json-server#module
Downside: You can't pass the json-server command line options.
Instead, can override some defaults by passing a config object to jsonServer.defaults();
You have to check the source code to set some items.
Examples:
Validation/Customization: https://github.com/typicode/json-server/issues/266
Delay: https://github.com/typicode/json-server/issues/534
ID: https://github.com/typicode/json-server/issues/613#issuecomment-325393041
Relevant source code: https://github.com/typicode/json-server/blob/master/src/cli/run.js
*/

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const router = jsonServer.router(path.join(__dirname, "db.json"));

// Can pass a limited number of options to this to override (some) defaults. See https://github.com/typicode/json-server#api
const middlewares = jsonServer.defaults({
  // Display json-server's built in homepage when json-server starts.
  static: "node_modules/json-server/dist"
});

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser. Using JSON Server's bodyParser
server.use(jsonServer.bodyParser);

// Simulate delay on all requests
server.use(function(req, res, next) {
  setTimeout(next, 0);
});

// Declaring custom routes below. Add custom routes before JSON Server router

server.post("/api/v2/app/setPreferences", function(req, res, next) {
  console.warn(req.body);
  const error = validatePrefs(req.body);
  if (error) {
    res.status(400).send(error);
  } else {
    next();
  }
});

function validatePrefs(prefs) {
  if (parseInt(prefs.listen_port, 10) < 1) return "Make listen port > 0";
  if (parseInt(prefs.max_uploads, 10) < 1) return "Make global upload spots > 0";
  return "";
}

// Custom routes
server.get('/api/v2/auth/login', (_, res) => {
  res.cookie('SID', 'faDaV5fsHvxGLTvv37uA5ZPOTmBrx7Am', { path: '/', sameSite: "strict" });
  res.json({});
})

server.use(jsonServer.rewriter({
  "/api/v2/sync/maindata*": '/maindata$1',
  "/api/v2/app/preferences*": '/preferences$1',
  "/api/v2/app/setPreferences*": '/preferences$1'
}));

// Use default router
server.use(router);

// Start server
const port = 3004;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});