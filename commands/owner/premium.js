/** @format */

const pagination = require("@functions/pagination.js");

module.exports = {
  name: "premium",
  aliases: [],
  cooldown: "",
  category: "owner",
  usage: "<add/del> <mention>",
  description: "Add/remove premium",
  args: false,
  vote: false,
  admin: true,
  owner: true,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new client.embed()
            .title(`${client.emoji.premium} Premium Info`)

            .desc(
              `${client.emoji.space} **Client : **<@${client.user.id}>\n` +
                `**${client.emoji.space} For a Duration of : **Lifetime`,
            )

            .addFields(
              {
                name: `Privilages :\n`,

                value:
                  `${client.emoji.point} No prefix\n` +
                  `${client.emoji.point} Better sound\n` +
                  `${client.emoji.point} Access to Custom-Eq\n` +
                  `${client.emoji.point} Access to several radios\n` +
                  `${client.emoji.point} 247 in VC and more . . .`,
              },
              {
                name: `Requirements :\n`,

                value:
                  `${client.emoji.point} Add me in 5 servers\n` +
                  `${client.emoji.point} Must stay in support server\n`,
              },
            )
            .thumb(
              "https://media.discordapp.net/attachments/1162750317004345396/1166771983179071548/8ef5f8c801f3cdbcb74794e2b153f445.webp?ex=654bb416&is=65393f16&hm=f74c229b5f5174c02a68503bd9c5c54e179ca9b5b983848e1ae2ff175ea22a0b&",
            ),
        ],
      });
    }
    let id = message.mentions?.users?.first()?.id || args[1] || null;

    let valid = (await client.users.fetch(id).catch(() => {})) || null;
    const exist = await client.premiun.get(`${client.user.id}_${id}`);

    if (!valid && !args[1] == "list")
      return message.channel.send({
        embeds: [
          new client.embed().desc(`${client.emoji.no} **Invalid User**`),
        ],
      });

    switch (args[0].toLowerCase()) {
      case "add":
        {
          if (!exist)
            return message.channel.send({
              embeds: [
                new client.embed().desc(
                  `${client.emoji.bell} **<@${id}> already has this privilage**`,
                ),
              ],
            });

          await client.premium.set(`${client.user.id}_${id}`, true);
          message.channel.send({
            embeds: [
              new client.embed().desc(
                `${client.emoji.on} **Premium privilage added to <@${id}>**`,
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

          await client.premium.delete(`${client.user.id}_${id}`);
          message.channel.send({
            embeds: [
              new client.embed().desc(
                `${client.emoji.off} **Premium privilage removed from <@${id}>**`,
              ),
            ],
          });
        }
        break;
      case "list":
        let ids = (await client.premium.keys)
          .filter((key) => key.includes(client.user.id))
          .map((key) => key.split("_")[1]);
        ids = [...ids];
        if (!ids.length)
          return message.channel.send({
            embeds: [
              new client.embed().desc(
                `${client.emoji.no}**No users with Premium**`,
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
            .desc(`## Premium users list : \n\n${descriptions[i]}`)
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
