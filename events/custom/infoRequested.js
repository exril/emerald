/** @format */

module.exports = {
  name: "infoRequested",
  run: async (client, message, command) => {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Reply when bot is mentioned ////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    return message.reply({
      embeds: [
        new client.embed()
          .desc(
            ` **${client.emoji.point} Nameㅤ →ㅤ${command.name} ${
              command.aliases?.[0] ? `, ${command.aliases.join(", ")}` : ""
            }\n` +
              `${client.emoji.point} Infoㅤㅤ→ㅤ${
                command.description || "Not Available"
              }\n` +
              `${client.emoji.point} Usageㅤ→ㅤ[${client.prefix}${command.name} ${command.usage}](${client.support})\n**`,
          )
          .title(
            `Command info - ${
              command.name.charAt(0).toUpperCase() + command.name.slice(1)
            }`,
          )
          .setFooter({
            text: `By ━● 1sT-Services | Please run ${client.prefix}help for menu`,
          }),
      ],
    });
  },
};
