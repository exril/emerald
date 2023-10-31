/** @format */

const YML = require('js-yaml').load(
  require('fs').readFileSync('./config.yml', 'utf8'),
);

const { ClusterManager } = require('discord-hybrid-sharding');
[
  {
    file: './clients/client.js',
    token: YML.CLIENT.TOKEN,
    shards: YML.CLIENT.SHARDS,
    perCluster: YML.CLIENT.PER_CLUSTER,
  },
].forEach((client) => {
  new ClusterManager(client.file, {
    restarts: {
      max: 5,
      interval: 1000,
    },
    respawn: true,
    mode: 'process',
    token: client.token,
    totalShards: client.shards || 'auto',
    shardsPerClusters: client.perCluster || 2,
  })

    .on('shardCreate', (cluster) => {
      require('@plugins/logger').log(
        `Launched cluster ${cluster.id}`,
        'cluster',
      );
    })
    .on('debug', (info) => {
      require('@plugins/logger').log(`${info}`, 'cluster');
    })
    .spawn({ timeout: -1 });
});
