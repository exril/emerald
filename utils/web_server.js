/** @format */

const app = require("express")();
const port = process.env.PORT || 443;
const logger = require("@plugins/logger");

app.get("/", (req, res) => {
  res.send(
    '<meta http-equiv="refresh" content="0; URL=https://home.1st-dev.repl.co"/>',
  );
});

app.get("/support", (req, res) => {
  res.send(
    '<meta http-equiv="refresh" content="0; URL=https://discord.gg/uY5BXAfd"/>',
  );
});

app.use(require("express-status-monitor")());

app.listen(port, () => {
  logger.log(`Web server ready(${port})`, `ready`);
});
