/** @format */

const { RateLimitManager } = require('@sapphire/ratelimits');
const rateLimitManager = new RateLimitManager(10000, 2);
module.exports = {
  name: 'dokdo',
  run: async (client, message, prefix) => {
    const rl = rateLimitManager.acquire(`${message.author.id}`);

    if (rl.limited) {
      return message.reply('Dokdo rate limited');
    }

    rl.consume();
    new (require('dokdo'))(client, {
      owners: client.owners,
      aliases: ['jsk', 'Jsk'],
      prefix: prefix,
    }).run(message);
  },
};
