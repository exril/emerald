/** @format */

require('module-alias/register');
const { Collection, Partials, Client } = require('discord.js');
const { ClusterClient, getInfo } = require('discord-hybrid-sharding');

module.exports = class ExtendedClient extends Client {
  constructor() {
    super({
      intents: 3276543,

      failIfNotExists: false,

      allowedMentions: {
        repliedUser: false,
        parse: ['users', 'roles'],
      },

      partials: [
        Partials.User,
        Partials.Guilds,
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember,
      ],

      shards: getInfo().SHARD_LIST,
      shardCount: getInfo().TOTAL_SHARDS,
    });

    this.setMaxListeners(0);

    this.cluster = new ClusterClient(this);

    this.aliases = new Collection();
    this.commands = new Collection();
    this.cooldowns = new Collection();

    this.config = require('../config/options');

    this.owners = this.config.bot.owners;
    this.admins = this.config.bot.admins;
    this.support = this.config.links.support;

    this.emoji = require('@assets/emoji.js');

    this.button = require('@plugins/button.js');
    this.logger = require('@plugins/logger.js');

    this.premium = require('@db/premium.js');
    this.vouchers = require('@db/vouchers.js');
    this.noPrefix = require('@db/noPrefix.js');
    this.blacklist = require('@db/blacklist.js');
    this.cmds_used = require('@db/cmds_used.js');

    this.formatTime = require('@functions/formatTime.js');
    this.formatBytes = require('@functions/formatBytes.js');

    this.categories = require('fs').readdirSync('./commands');

    this.sleep = function (t) {
      return new Promise((r) => setTimeout(r, t));
    };

    this.log = function (message, type = 'log') {
      return this.logger.log(
        message,
        type,
        `${this.user?.username || 'Client'}`,
      );
    };

    this.connect = async (token, prefix = '%', color, auth, voteUri) => {
      this.prefix = prefix;
      this.vote = voteUri;
      this.topGgAuth = auth;
      if (!voteUri || auth)
        this.log(
          `Commands cannot be vote locked !!! ${
            this.vote ? `Top GG Auth Token` : `Vote URI`
          } is not provided !!`,
          `error`,
        );
      this.embed = require('@plugins/embed.js')(color || '#2c2d31');
      await super.login(token).catch(() => {
        this.log(
          `Client cannot be logged in !!! Valid Token not provided !!`,
          `error`,
        );
        process.exit(1);
      });
    };

    this.on('ready', async (client) => {
      const handler = require('@functions/handleReadyEvent.js')(client);

      await require('@functions/setStatus.js')(client);
      await require('@loaders/mongoose.js')(client);
      await require('@loaders/clientEvents.js')(client);
      await require('@loaders/customEvents.js')(client);
      await require('@loaders/commands.js')(client);

      this.log(
        `Ready for ${handler[0]} Servers | ${handler[1]} Users`,
        'ready',
      );
    });
  }
};
