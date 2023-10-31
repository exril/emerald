/** @format */
const JOSH = require('@joshdb/core');
const JSON = require('@joshdb/json');

module.exports = new JOSH({
  name: 'noPrefix',
  provider: JSON,
  providerOptions: {
    cleanupEmpty: true,
    dataDir: './josh-data/noPrefix',
  },
});
