/** @format */

module.exports = {
  name: 'backup',
  aliases: [],
  cooldown: '',
  category: 'owner',
  usage: '',
  description: 'sends backup zip to DM',
  args: false,
  vote: false,
  admin: false,
  owner: true,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    const moment = require('moment');
    const date = moment().format('DD-MM-YYYY_hh-mm-ss');

    const backup_zip_creator = require('../../functions/zipper.js');

    const backup_zip_manager = async (msg) => {
      const file = `./fuego-${args[0] ? `${args[0]}-` : ``}${date}.zip`;

      await backup_zip_creator(file);

      const { AttachmentBuilder } = require('discord.js');

      let m = await msg.channel.send({
        embeds: [
          new client.embed().desc(
            `**${client.emoji.cool} | Preparing zip please wait. . .**`,
          ),
        ],
      });

      await client.sleep(10000);

      await msg.author
        .send({
          embeds: [
            new client.embed().desc(
              `> ${client.emoji.json} - Name: Backup${
                args[0] ? `-${args[0]}` : ``
              }\n` + `> ${client.emoji.cool} - ${date}`,
            ),
          ],
          files: [
            new AttachmentBuilder(file, {
              name: file,
            }),
          ],
        })
        .then(async () => {
          await m.edit({
            embeds: [
              new client.embed().desc(
                `**${client.emoji.cloud} | Successfully sent zip to DM**`,
              ),
            ],
          });
        });
      const fs = require('fs');
      await fs.unlink(file, () => {
        return;
      });
    };
    const run = async () => {
      await backup_zip_manager(message);
    };

    run();
  },
};
