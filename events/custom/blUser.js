/** @format */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "blUser",
  run: async (client, message, blacklistUser) => {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// Warn blacklist user if not warned //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    if (blacklistUser != "warned") {
      await client.blacklist.set(`${message.author.id}`, "warned");
      return message.reply({
        embeds: [
          new client.embed().desc(
            `${client.emoji.no} **You are blacklisted and can't use my commands !**\n` +
              `${client.emoji.bell} *Note : This message wont be shown ever again !*`
          ),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new client.button()
              .link("Click to join Support Server", client.support)
              .setEmoji(client.emoji.support)
          ),
        ],
      });
    }
  },
};
