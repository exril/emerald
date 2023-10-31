/** @format */

const fs = require('fs');
const yaml = require('js-yaml');

const YML = yaml.load(fs.readFileSync('./config.yml', 'utf8'));

module.exports = {
  bot: {
    owners: YML.BOT.OWNERS,
    admins: YML.BOT.ADMINS,
  },

  links: {
    support: YML.LINKS.SUPPORT || 'https://discord.gg/uY5BXAfd',
    mongoURI: YML.LINKS.MONGO_URI,
  },
};
