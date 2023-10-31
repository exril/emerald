/** @format */

const pagination = require('@functions/pagination.js');

module.exports = {
  name: 'blacklist',
  aliases: ['bl'],
  cooldown: '',
  category: 'owner',
  usage: '<add/del> <mention>',
  description: 'Add/remove to/from blacklist',
  args: false,
  vote: false,
  admin: true,
  owner: true,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    let id = message.mentions?.users?.first()?.id || args[1] || null;

    let valid = (await client.users.fetch(id).catch(() => {})) || null;
    const exist = await client.blacklist.get(`${id}`);

    if (!valid && !args[1] == 'list')
      return message.channel.send({
        embeds: [
          new client.embed().desc(`${client.emoji.no} **Invalid User**`),
        ],
      });

    switch (args[0].toLowerCase()) {
      case 'add':
        {
          if (exist)
            return message.channel.send({
              embeds: [
                new client.embed().desc(
                  `${client.emoji.bell} **<@${id}> is already blcklisted**`,
                ),
              ],
            });

          await client.blacklist.set(`${id}`, true);
          message.channel.send({
            embeds: [
              new client.embed().desc(
                `${client.emoji.on} **Added <@${id}> to blacklist**`,
              ),
            ],
          });
        }
        break;

      case 'rem':
      case 'del':
      case 'remove':
      case 'delete':
        {
          if (!exist)
            return message.channel.send({
              embeds: [
                new client.embed().desc(
                  `${client.emoji.bell} **<@${id}> isn't blacklisted**`,
                ),
              ],
            });

          await client.blacklist.delete(`${id}`);
          message.channel.send({
            embeds: [
              new client.embed().desc(
                `${client.emoji.off} **Removed <@${id}> from blacklist**`,
              ),
            ],
          });
        }
        break;
      case 'list':
        let ids = await client.blacklist.keys;
        //ids = [...ids];
        if (!ids.length)
          return message.channel.send({
            embeds: [
              new client.embed().desc(
                `${client.emoji.no}**No blacklisted users**`,
              ),
            ],
          });
        let names = [];
        for (id of ids) {
          let user = await client.users.fetch(id);
          names.push(
            `**• [${user.username}](https://discord.com/users/${user.id}) [${user.id}]**`,
          );
        }
        const mapping = require('lodash').chunk(names, 10);
        const descriptions = mapping.map((s) => s.join('\n'));
        var pages = [];
        for (let i = 0; i < descriptions.length; i++) {
          const embed = new client.embed()
            .desc(`## Blacklisted users list : \n\n${descriptions[i]}`)
            .setFooter({ text: `Page • 1/${pages.length}` });
          pages.push(embed);
        }
        await pagination(client, message, pages);
        break;
      default:
        break;
    }
  },
};
