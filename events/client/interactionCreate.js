/** @format */

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (interaction.isModalSubmit())
      switch (interaction.customId) {
        case "report":
          await client.emit("reportSubmit", interaction);
          break;

        default:
          break;
      }
  },
};
