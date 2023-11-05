/** @format */

module.exports = {
  name: "modalSubmit",
  run: async (client, interaction) => {
    if (!interaction.customId == "report") return;
    const [command, issue, comments] = [
      interaction.fields.getTextInputValue("command"),
      interaction.fields.getTextInputValue("issue"),
      interaction.fields.getTextInputValue("comments"),
    ];

    await interaction.deferUpdate();

    await interaction.message.edit({
      embeds: [
        new client.embed().desc(
          `${client.emoji.yes} **Successfully reported issue**`,
        ),
      ],
      components: [],
    });

    let app = await client.application.fetch();
    let owner = app.owner.members
      ? [...app.owner.members.keys()][0]
      : app.owner.id;

    owner = await client.users.fetch(owner);
    owner.send({
      embeds: [
        new client.embed().desc(
          `## Issue Report "${command}":\n` +
            `User : ${interaction.member}\n` +
            `Guild : ${interaction.guild}\n\n` +
            `Issue : \`\`\`\n${issue}\`\`\`\n` +
            `Comments : \`\`\`\n${
              comments || `No additional comments`
            }\`\`\`\n`,
        ),
      ],
    });
  },
};
