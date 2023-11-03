/** @format */

const pagination = require("@functions/pagination.js");

module.exports = {
  name: "add",
  aliases: [],
  cooldown: "",
  category: "owner",
  usage: "<mention> <static>",
  description: "Add static",
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
      return message.channel.send({
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
        if (np)
          return message.channel.send({
            embeds: [
              new client.embed().desc(
                `${client.emoji.bell} **<@${id}> already has this privilage**`
              ),
            ],
          });

        await client.noPrefix.set(`${client.user.id}_${id}`, true);
        message.channel.send({
          embeds: [
            new client.embed().desc(
              `${client.emoji.on} **No prefix privilage added to <@${id}>**`
            ),
          ],
        });
        break;

      case "bl":
        if (bl)
          return message.channel.send({
            embeds: [
              new client.embed().desc(
                `${client.emoji.bell} **<@${id}> is already blacklisted**`
              ),
            ],
          });

        await client.noPrefix.set(`${client.user.id}_${id}`, true);
        message.channel.send({
          embeds: [
            new client.embed().desc(
              `${client.emoji.on} **Added <@${id}> to blacklist**`
            ),
          ],
        });
        break;

      case "premium":
        if (premium)
          return message.channel.send({
            embeds: [
              new client.embed().desc(
                `${client.emoji.bell} **<@${id}> is already a premium subscriber**`
              ),
            ],
          });

        await client.noPrefix.set(`${client.user.id}_${id}`, true);
        message.channel.send({
          embeds: [
            new client.embed().desc(
              `${client.emoji.on} **Premium subscription added to <@${id}>**`
            ),
          ],
        });
        break;
      default:
        message.channel.send({
          embeds: [
            new client.embed().desc(
              `${client.emoji.no} **No valid static provided\n**` +
                `${client.emoji.bell} **Avaliable options :** \`np\`, \`bl\`, \`premium\``
            ),
          ],
        });
        break;
    }
  },
};
