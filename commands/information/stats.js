/** @format */

module.exports = {
  name: 'stats',
  aliases: ['shard', 'status', 'stat'],
  cooldown: '',
  category: 'information',
  usage: '',
  description: "Shows bot's shard stats",
  args: false,
  vote: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
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

    let e = new client.embed().desc(
      ` ${client.emoji.cool} **| Fetching details please wait . . . **`,
    );
    let msg = await message.reply({ embeds: [e] });

    let v = await client.cluster.broadcastEval(async (x) => {
      let cpu = '[ N/A ]';

      await new Promise(async (res, reject) => {
        await require('os-utils').cpuUsage((v) => {
          res(v);
        });
      }).then((value) => {
        return (cpu = value);
      });

      let val =
        `[**__${x.emoji.online} Basic Info__**](${x.support})\n` +
        `**⠀⠀⠀• Ping : **\`${x.ws.ping} ms\`\n` +
        `**⠀⠀⠀• Uptime : **\`${x.formatTime(x.uptime)}\`\n` +
        `[**__${x.emoji.brain} Resources__**](${x.support})\n` +
        `**⠀⠀⠀• RAM : **\`${x.formatBytes(
          process.memoryUsage().heapUsed,
        )}\`\n` +
        `**⠀⠀⠀• CPU : **\`${cpu.toFixed(2)} %vCPU\`\n` +
        `[**__${x.emoji.stats} Size & Stats__**](${x.support})\n` +
        `**⠀⠀⠀• Servers: **\`${x.guilds.cache.size / 1000}K\`\n` +
        `**⠀⠀⠀• Members : **\`${
          (await x.guilds.cache.reduce(
            (total, guild) => total + guild.memberCount,
            0,
          )) / 1000
        }K\`\n`;

      return [val, process.pid];
    });

    let embed = new client.embed().title(`${client.user.username} Status :`);

    for (i = 0; i < v.length; i++) {
      embed.addFields({
        name: `Cluster [${i}] (PID ${v[i][1]}) :`,
        value: v[i][0],
        inline: true,
      });
    }

    embed.setFooter({
      text: `${await client.cmds_used.get(client.user.id)} Cmds used`,
    });
    msg.edit({ embeds: [embed] });
  },
};
