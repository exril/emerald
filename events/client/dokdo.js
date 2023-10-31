/** @format */

module.exports = {
  name: 'dokdo',
  run: async (client, message) => {
    new (require('dokdo'))(client, {
      owners: client.owners,
      aliases: ['jsk', 'Jsk'],
      prefix:
        noPrefixUser && !message.content.startsWith(client.prefix)
          ? ''
          : client.prefix,
    }).run(message);
  },
};
