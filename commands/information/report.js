/** @format */

const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  name: "report",
  aliases: [],
  cooldown: "1800",
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
      new client.button().secondary(
        `report`,
        `Report an issue`,
        client.emoji.support,
      ),
    );
    let msg = await message.reply({
      embeds: [
        new client.embed().desc(
          `${client.emoji.bell} **Click to show report modal**`,
        ),
      ],
      components: [row],
    });
    const modal = new ModalBuilder()
      .setCustomId("myModal")
      .setTitle("My Modal");

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("command")
          .setLabel("Command name")
          .setStyle(TextInputStyle.Short)
          .setRequired(true),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("issue")
          .setLabel("Describe the issue")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("comments")
          .setLabel("Additional Comments")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false),
      ),
    );

    const filter = (m) => m.user.id === message.author.id;
    const collector = msg?.createMessageComponentCollector({
      filter,
      time: 30000,
    });

    collector.on("collect", async (interaction) => {
      await interaction.showModal(modal);
    });
  },

  //let modalSubmit event handle the rest [events/custom/modalSubmit.js]
};
