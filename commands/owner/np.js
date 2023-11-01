/** @format */

const pagination = require("@functions/pagination.js");

module.exports = {
  name: "np",
  aliases: [],
  cooldown: "",
  category: "owner",
  usage: "<add/del> <mention>",
  description: "Add/remove np",
  args: false,
  vote: false,
  admin: true,
  owner: true,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    let id = message.mentions?.users?.first()?.id || args[1] || null;

    let valid = (await client.users.fetch(id).catch(() => {})) || null;
    const exist = await client.noPrefix.get(`${client.user.id}_${id}`);

    if (!valid && !args[1] == "list")
      return message.channel.send({
        embeds: [
          new client.embed().desc(`${client.emoji.no} **Invalid User**`),
        ],
      });

    switch (args[0].toLowerCase()) {
      case "add":
        {
          if (exist)
            return message.channel.send({
              embeds: [
                new client.embed().desc(
                  `${client.emoji.bell} **<@${id}> already has this privilage**`,
                ),
              ],
            });

          await client.noPrefix.set(`${client.user.id}_${id}`, true);
          message.channel.send({
            embeds: [
              new client.embed().desc(
                `${client.emoji.on} **No prefix privilage added to <@${id}>**`,
              ),
            ],
          });
        }
        break;

      case "rem":
      case "del":
      case "remove":
      case "delete":
        {
          if (!exist)
            return message.channel.send({
              embeds: [
                new client.embed().desc(
                  `${client.emoji.bell} **<@${id}> doesn't have this privilage**`,
                ),
              ],
            });

          await client.noPrefix.delete(`${client.user.id}_${id}`);
          message.channel.send({
            embeds: [
              new client.embed().desc(
                `${client.emoji.off} **No prefix privilage removed from <@${id}>**`,
              ),
            ],
          });
        }
        break;
      case "list":
        let ids = (await client.noPrefix.keys)
          .filter((key) => key.includes(client.user.id))
          .map((key) => key.split("_")[1]);
        ids = [...ids];
        if (!ids.length)
          return message.channel.send({
            embeds: [
              new client.embed().desc(
                `${client.emoji.no}**No users with NoPrefix**`,
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
        const mapping = require("lodash").chunk(names, 10);
        const descriptions = mapping.map((s) => s.join("\n"));
        var pages = [];
        for (let i = 0; i < descriptions.length; i++) {
          const embed = new client.embed()
            .desc(`## Np users list : \n\n${descriptions[i]}`)
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
