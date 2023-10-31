/** @format */

const { readdirSync } = require('fs');
module.exports = async (client) => {
  let count = 0;
  readdirSync('./events/client').forEach((file) => {
    const event = require(`../events/client/${file}`);
    client.on(event.name, (...args) => {
      event.run(client, ...args);
    });
    count++;
  });
  client.log(`Loaded ${count} Client Events`, 'event');
};
