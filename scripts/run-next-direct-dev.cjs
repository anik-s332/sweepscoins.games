const { startServer } = require("../node_modules/next/dist/server/lib/start-server");

startServer({
  dir: process.cwd(),
  port: 3000,
  allowRetry: false,
  isDev: true,
  hostname: "0.0.0.0",
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
