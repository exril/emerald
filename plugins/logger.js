/** @format */

const chalk = require('chalk');
const moment = require('moment');

module.exports = class logger {
  static log(content, type = 'log', client = 'Client') {
    const date = moment().format('DD-MM-YYYY hh:mm:ss');

    const logTypeColors = {
      log: {
        color: (text) => chalk.hex('#ffffff')(text),
        display: 'Log',
      },
      warn: {
        color: (text) => chalk.hex('#ffaa00')(text),
        display: 'Warning',
      },
      error: {
        color: (text) => chalk.hex('#ff2200')(text),
        display: 'Err',
      },
      debug: {
        color: (text) => chalk.hex('#eeee55')(text),
        display: 'Debug',
      },
      cmd: {
        color: (text) => chalk.hex('#77ff22')(text),
        display: 'Command',
      },
      event: {
        color: (text) => chalk.hex('#e1f507')(text),
        display: 'Event',
      },
      ready: {
        color: (text) => chalk.hex('#ff88cc')(text),
        display: 'Ready',
      },
      database: {
        color: (text) => chalk.hex('#55ff22')(text),
        display: 'Database',
      },
      player: {
        color: (text) => chalk.hex('#22aaff')(text),
        display: 'Player',
      },
      lavalink: {
        color: (text) => chalk.hex('#ff8800')(text),
        display: 'Lavalink',
      },
      cluster: {
        color: (text) => chalk.hex('#ff2200')(text),
        display: 'Cluster',
      },
      manager: {
        color: (text) => chalk.hex('#22ff00')(text),
        display: 'Manager',
      },
    };

    const log = logTypeColors[type];

    const logMessage =
      chalk.bold(
        `${chalk.hex('#2222FF')(date)} - [${chalk.hex('#222255')(
          client,
        )}] ${' '.repeat(15 - client.length)}=>   ${log.color(
          log.display + ' '.repeat(9 - log.display.length),
        )} - > `,
      ) + `${chalk.hex('#880088')(content)}`;

    console.log(logMessage);
  }
};
