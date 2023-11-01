/** @format */

const { ActivityType } = require("discord.js");

module.exports = setStatus = async (client) => {
  let gc = async () => {
    let total = 0;
    let res = await client.cluster.broadcastEval((client) => {
      return client.guilds.cache.size;
    });
    for (n of res) {
      total += n;
    }
    return total;
  };

  let mc = async () => {
    let total = 0;
    let res = await client.cluster.broadcastEval((client) => {
      let mcount = 0;
      client.guilds.cache.forEach((guild) => {
        mcount += guild.memberCount;
      });
      return mcount;
    });
    for (n of res) {
      total += n;
    }
    return total;
  };

  let statuses = [
    { type: ActivityType.Custom, text: `By ━● 1sT-Services` },
    {
      type: ActivityType.Custom,
      text: `Looking for @${client.user.username} | ${client.prefix}help`,
    },
    {
      type: ActivityType.Custom,
      text: `I got ${await mc()} users | ${client.prefix}help`,
    },
    {
      type: ActivityType.Custom,
      text: `I am in ${await gc()} guilds | ${client.prefix}help`,
    },
  ];

  setInterval(() => {
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    client.user.setPresence({
      activities: [
        {
          name: status.text,
          type: status.type,
        },
      ],
      status: "online",
    });
  }, 10000);
};
