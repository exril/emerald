/** @format */

module.exports = {
  name: 'guildCreate',
  run: async (client, guild) => {
    if (!guild.name) return;
    const { ActionRowBuilder } = require('discord.js');
    let desc =
      `${
        client.emoji.cloud +
        ` \`` +
        client.user.username +
        `\` has been successfully added to \`${guild.name}\``
      }\n\n` +
      `You can report any issues at my **[Support Server](${client.support})** following the needed steps. ` +
      `You can also rech out to my **[Developers](${client.support})** if you want to know more about me.`;
    let e = new client.embed()
      .title(`Thank you for choosing ${client.user.username}!`)
      .desc(desc);
    try {
      let owner = await client.users.fetch(guild.ownerId);
      owner.send({
        embeds: [e],
        components: [
          new ActionRowBuilder().addComponents(
            new client.button().link(`Support Server`, `${client.support}`),
            new client.button().link(`Get Premium`, `${client.support}`),
          ),
        ],
      });
    } catch (e) {}
  },
};
