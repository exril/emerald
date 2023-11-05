/** @format */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "vote",
  aliases: [],
  cooldown: "",
  category: "information",
  usage: "",
  description: "Shows bot's vote link",
  args: false,
  vote: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    const row = new ActionRowBuilder().addComponents(
      new client.button()
        .link("Click to Vote me on Top.gg", client.vote || client.support)
        .setEmoji(client.emoji.love),
    );
    await message.reply({
      embeds: [
        new client.embed().desc(
          `${client.emoji.bell} **Click one of the buttons below to Vote Me **`,
        ),
      ],
      components: [row],
    });
  },
};
