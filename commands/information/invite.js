/** @format */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "invite",
  aliases: ["inv"],
  cooldown: "",
  category: "information",
  usage: "",
  description: "Shows bot's invite link",
  args: false,
  vote: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    const row = new ActionRowBuilder().addComponents(
      new client.button().link("Required Perms", client.invite.required),
      new client.button().link("Admin Perms", client.invite.admin),
    );
    await message.reply({
      embeds: [
        new client.embed().desc(
          `${client.emoji.bell} **Click one of the buttons below to Invite Me **`,
        ),
      ],
      components: [row],
    });
  },
};
