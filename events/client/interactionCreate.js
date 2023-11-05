/** @format */

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (interaction.isModalSubmit())
      return await client.emit("modalSubmit", interaction);
  },
};
