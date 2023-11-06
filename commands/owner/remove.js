/** @format */

const pagination = require("@functions/pagination.js");

module.exports = {
  name: "remove",
  aliases: [],
  cooldown: "",
  category: "owner",
  usage: "<mention> <static>",
  description: "Remove static",
  args: false,
  vote: false,
  admin: true,
  owner: true,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    let id = message.mentions?.users?.first()?.id || args[0] || null;

    let valid = (await client.users.fetch(id).catch(() => {})) || null;

    if (!valid)
      return await message.reply({
        embeds: [
          new client.embed().desc(`${client.emoji.no} **Invalid User**`),
        ],
      });

    const [np, bl, premium] = await Promise.all([
      await client.noPrefix.get(`${client.user.id}_${id}`),
      await client.blacklist.get(`${client.user.id}_${id}`),
      await client.premium.get(`${client.user.id}_${id}`),
    ]);

    const static = args[1] ? args[1] : null;

    switch (static) {
      case "np":
        if (!np)
          return await message.reply({
            embeds: [
              new client.embed().desc(
                `${client.emoji.bell} **<@${id}> doesn't have this privilage**`,
              ),
            ],
          });

        await client.noPrefix.delete(`${id}`);
        await message.reply({
          embeds: [
            new client.embed().desc(
              `${client.emoji.off} **No prefix privilage removed from <@${id}>**`,
            ),
          ],
        });
        break;

      case "bl":
        if (!bl)
          return await message.reply({
            embeds: [
              new client.embed().desc(
                `${client.emoji.bell} **<@${id}> is not blacklisted**`,
              ),
            ],
          });

        await client.blacklist.delete(`${client.user.id}_${id}`);
        await message.reply({
          embeds: [
            new client.embed().desc(
              `${client.emoji.off} **Removed <@${id}> from blacklist**`,
            ),
          ],
        });
        break;

      case "premium":
        if (!premium)
          return await message.reply({
            embeds: [
              new client.embed().desc(
                `${client.emoji.bell} **<@${id}> is not a premium subscriber**`,
              ),
            ],
          });

        await client.premium.delete(`${client.user.id}_${id}`);
        await message.reply({
          embeds: [
            new client.embed().desc(
              `${client.emoji.off} **Premium subscription revoked for <@${id}>**`,
            ),
          ],
        });
        break;
      default:
        await message.reply({
          embeds: [
            new client.embed().desc(
              `${client.emoji.no} **No valid static provided\n**` +
                `${client.emoji.bell} **Avaliable options :** \`np\`, \`bl\`, \`premium\``,
            ),
          ],
        });
        break;
    }
  },
};
