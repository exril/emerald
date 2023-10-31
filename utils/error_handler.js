/** @format */

module.exports = (client) => {
  process.on('unhandledRejection', (...args) => {
    e = `${args}`;
    if (!e.toLowerCase().includes('unknown')) console.log(...args);
  });
  process.on('uncaughtException', (...args) => {
    e = `${args}`;
    if (!e.toLowerCase().includes('unknown')) console.log(...args);
  });
};
