/** @format */

const { ActionRowBuilder } = require('discord.js');

module.exports = {
  name: 'invite',
  aliases: ['inv'],
  cooldown: '',
  category: 'information',
  usage: '',
  description: "Shows bot's invite link",
  args: false,
  vote: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    const row = new ActionRowBuilder().addComponents(
      new client.button().link('Required Perms', client.invite.required),
      new client.button().link('Admin Perms', client.invite.admin),
    );
    const mainPage = new client.embed().desc(
      `${client.emoji.arrow} **Click one of the buttons below to Invite Me **`,
    );
    message.channel.send({ embeds: [mainPage], components: [row] });
  },
};
