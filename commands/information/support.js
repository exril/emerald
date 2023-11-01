/** @format */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "support",
  aliases: [],
  cooldown: "",
  category: "information",
  usage: "",
  description: "Shows link to support server",
  args: false,
  vote: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    const row = new ActionRowBuilder().addComponents(
      new client.button()
        .link("Click to join Support Server", client.support)
        .setEmoji(client.emoji.support),
    );
    await message.channel.send({ components: [row] });
  },
};
