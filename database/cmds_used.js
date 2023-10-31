/** @format */

const Josh = require('@joshdb/core');
const JSON = require('@joshdb/json');

module.exports = new Josh({
  name: 'cmds_used',
  provider: JSON,
  providerOptions: {
    cleanupEmpty: true,
    dataDir: './josh-data/cmds_used',
  },
});
