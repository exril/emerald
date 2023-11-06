/** @format */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "blUser",
  run: async (client, message, blacklistUser) => {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// Warn blacklist user if not warned //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    let embed = new client.embed().desc(
      `${client.emoji.no} **You are blacklisted and can't use my commands !**\n` +
        `${client.emoji.bell} *Note : This message wont be shown ever again !*`,
    );

    let row = new ActionRowBuilder().addComponents(
      new client.button()
        .link("Click to join Support Server", client.support)
        .setEmoji(client.emoji.support),
    );

    if (blacklistUser != "warned") {
      await client.blacklist.set(
        `${client.user.id}_${message.author.id}`,
        "warned",
      );

      await message.reply({
        embeds: [embed],
        components: [row],
      });

      await message.author
        .send({
          embeds: [embed],
          components: [row],
        })
        .catch(() => {});

      return;
    }
  },
};
