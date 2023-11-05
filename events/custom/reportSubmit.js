/** @format */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "reportSubmit",
  run: async (client, interaction) => {
    const [command, issue, comments] = [
      interaction.fields.getTextInputValue("command"),
      interaction.fields.getTextInputValue("issue"),
      interaction.fields.getTextInputValue("comments"),
    ];

    await interaction.deferUpdate();

    const row = new ActionRowBuilder().addComponents(
      new client.button()
        .link("Join support server for more info", client.support)
        .setEmoji(client.emoji.support),
    );
    await interaction.message.edit({
      embeds: [
        new client.embed().desc(
          `${client.emoji.yes} **Successfully reported issue**`,
        ),
      ],
      components: [row],
    });

    let app = await client.application.fetch();
    let owner = app.owner.members
      ? [...app.owner.members.keys()][0]
      : app.owner.id;

    owner = await client.users.fetch(owner);
    owner.send({
      embeds: [
        new client.embed()
          .title(`Issue reported for : ${command}`)
          .desc(
            `**User :** ${interaction.member} [${interaction.member}.id]\n` +
              `**Guild :** ${interaction.guild} [${interaction.guild}.id]\n\n` +
              `**Issue :** \`\`\`\n${issue}\`\`\`\n` +
              `**Comments :** \`\`\`\n${
                comments || `No additional comments`
              }\`\`\`\n`,
          ),
      ],
    });
  },
};
