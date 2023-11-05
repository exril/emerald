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
      new client.button().secondary(`end`, `❌`),
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
      .setCustomId("report")
      .setTitle("Report an issue");

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("command")
          .setPlaceholder("Enter command name that's causing the issue")
          .setLabel("Command name")
          .setMaxLength(15)
          .setStyle(TextInputStyle.Paragraph)

          .setRequired(true),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("issue")
          .setPlaceholder("Describe the problem you are facing")
          .setLabel("Describe the issue")
          .setMaxLength(400)
          .setStyle(TextInputStyle.Paragraph)

          .setRequired(true),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("comments")
          .setPlaceholder("// Additional comments . . .")
          .setLabel("Additional Comments")
          .setMaxLength(200)
          .setStyle(TextInputStyle.Paragraph)

          .setRequired(false),
      ),
    );

    const filter = async (interaction) => {
      if (interaction.user.id === message.author.id) {
        return true;
      }
      await interaction.reply({
        embeds: [
          new client.embed().desc(
            `${client.emoji.no} **This isn't meant for you**`,
          ),
        ],
        ephemeral: true,
      });
      return false;
    };
    const collector = msg?.createMessageComponentCollector({
      filter,
      time: 30000,
    });

    collector.on("collect", async (interaction) => {
      switch (interaction.customId) {
        case "report":
          await interaction.showModal(modal);
          break;
        case "end":
          await interaction.deferUpdate();
          await collector.stop();
          await msg.edit({
            embeds: [
              new client.embed().desc(
                `${client.emoji.bell} **Reporting operation cancelled by user**`,
              ),
            ],
            components: [],
          });
          break;
        default:
          break;
      }
    });

    collector.on("end", async (collected, reason) => {
      if (collected.size == 0)
        await msg.edit({
          embeds: [
            new client.embed()
              .desc(`${client.emoji.bell} **Click to show report modal**`)
              .setFooter({ text: "Command timed out !" }),
          ],
          components: [],
        });
    });
  },

  //let modalSubmit event handle the rest [events/custom/modalSubmit.js]
};
