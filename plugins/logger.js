/** @format */

const chalk = require("chalk");
const moment = require("moment");

module.exports = class logger {
  static log(content, type = "log", client = "Process") {
    const date = moment().format("DD-MM-YYYY hh:mm:ss");

    const logTypeColors = {
      log: {
        headingColor: (text) => chalk.hex("#ffffff")(text),
        loggingColor: (text) => chalk.hex("#ffffff")(text),
        display: "Log",
      },
      warn: {
        headingColor: (text) => chalk.hex("#ffaa00")(text),
        loggingColor: (text) => chalk.hex("#880088")(text),
        display: "Warning",
      },
      error: {
        headingColor: (text) => chalk.hex("#ff2200")(text),
        loggingColor: (text) => chalk.hex("#880088")(text),
        display: "Error",
      },
      debug: {
        headingColor: (text) => chalk.hex("#dddd55")(text),
        loggingColor: (text) => chalk.hex("#880088")(text),
        display: "Debug",
      },
      cmd: {
        headingColor: (text) => chalk.hex("#ff2277")(text),
        loggingColor: (text) => chalk.hex("#880088")(text),
        display: "Command",
      },
      event: {
        headingColor: (text) => chalk.hex("#0088cc")(text),
        loggingColor: (text) => chalk.hex("#880088")(text),
        display: "Event",
      },
      ready: {
        headingColor: (text) => chalk.hex("#77ee55")(text),
        loggingColor: (text) => chalk.hex("#880088")(text),
        display: "Ready",
      },
      database: {
        headingColor: (text) => chalk.hex("#55cc22")(text),
        loggingColor: (text) => chalk.hex("#880088")(text),
        display: "Database",
      },
      cluster: {
        headingColor: (text) => chalk.hex("#00cccc")(text),
        loggingColor: (text) => chalk.hex("#880088")(text),
        display: "Cluster",
      },
    };

    const log = logTypeColors[type];

    const logMessage =
      chalk.bold(
        `${chalk.hex("#2222FF")(date)} -   ` +
          `${chalk.hex("#222255")(client)} ` +
          `${" ".repeat(15 - client.length)}=>   ` +
          `${log.headingColor(
            log.display + " ".repeat(9 - log.display.length),
          )} - `,
      ) + `${log.loggingColor(content)}`;

    console.log(logMessage);
  }
};
