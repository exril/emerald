/** @format */

const pagination = require("@functions/pagination.js");

module.exports = {
  name: "list",
  aliases: [],
  cooldown: "",
  category: "owner",
  usage: "<static>",
  description: "Add static",
  args: true,
  vote: false,
  admin: true,
  owner: true,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    const static = args[0] ? args[0] : null;

    let db = null;

    switch (static) {
      case "np":
        db = "noPrefix";
        break;

      case "bl":
        db = "blacklist";
        break;

      case "premium":
        db = "premium";
        break;

      default:
        message.channel.send({
          embeds: [
            new client.embed().desc(
              `${client.emoji.no} **No valid static provided\n**` +
                `${client.emoji.bell} **Avaliable options :** \`np\`, \`bl\`, \`premium\``,
            ),
          ],
        });
        return;
    }

    let ids = await client[db].keys;
    if (!ids.length)
      return message.channel.send({
        embeds: [
          new client.embed().desc(`${client.emoji.no}**No users found !**`),
        ],
      });
    let names = [];
    for (id of ids) {
      id = db == "blacklist" ? id : id.split("_")[1];
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
        .desc(
          `## ${db.charAt(0).toUpperCase() + db.slice(1)} users list : \n\n${
            descriptions[i]
          }`,
        )
        .setFooter({ text: `Page • 1/${pages.length}` });
      pages.push(embed);
    }
    await pagination(client, message, pages);
  },
};
