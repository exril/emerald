/** @format */

const YML = require('js-yaml').load(
  require('fs').readFileSync('./config.yml', 'utf8'),
);

const client = new (require('../main/extendedClient'))();
require('@utils/error_handler')(client);
client.connect(
  YML.CLIENT.TOKEN,
  YML.CLIENT.PREFIX,
  YML.CLIENT.COLOR,
  YML.CLIENT.TOPGGAUTH,
  YML.CLIENT.VOTEURI,
);
module.exports = client;
