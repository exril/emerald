/** @format */

const { readdirSync } = require('fs');
module.exports = async (client) => {
  let count = 0;
  readdirSync('./events/custom').forEach((file) => {
    const event = require(`../events/custom/${file}`);
    client.on(event.name, (...args) => {
      event.run(client, ...args);
    });
    count++;
  });
  client.log(`Loaded ${count} Custom Events`, 'event');
};
