/** @format */

const { ActionRowBuilder } = require("discord.js");
const voucher_codes = require("voucher-code-generator");

module.exports = {
  name: "premium",
  aliases: ["p"],
  cooldown: "",
  category: "information",
  usage: "",
  description: "Shows bot's invite link",
  args: false,
  vote: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    let [premiumUser, premiumGuild, owner, admin] = await Promise.all([
      await client.premium.get(`${client.user.id}_${message.author.id}`),
      await client.premium.get(`${client.user.id}_${message.guild.id}`),
      await client.owners.find((x) => x === message.author.id),
      await client.admins.find((x) => x === message.author.id),
    ]);

    const cmd = args[0] ? args[0].toLowerCase() : null;
    const type = args[1] ? args[1].toLowerCase() : null;

    switch (cmd) {
      case "gen":
        if (!owner && !admin)
          return await message.reply({
            embeds: [
              new client.embed().desc(
                `${client.emoji.admin} **Only my Owner/s and Admin/s can use this command**`,
              ),
            ],
          });
        let code;
        switch (type) {
          case "guild":
            code = voucher_codes.generate({
              pattern: "F##U-E##G-O##B-Y##1-S##T-GUILD",
            });
            code = code[0].toUpperCase();
            await client.vouchers.set(code, true);
            break;
          default:
            code = voucher_codes.generate({
              pattern: "F##U-E##G-O##B-Y##1-S##T-USER",
            });
            code = code[0].toUpperCase();
            await client.vouchers.set(code, true);
            break;
        }
        await message.channel.send({
          embeds: [
            new client.embed().desc(
              `${client.emoji.premium} **Here is your generated code**\n` +
                `Use [\`${client.prefix}redeem <code>\`](${client.support}) to activate`,
            ),
            new client.embed().desc(`${code}`),
          ],
        });
        break;

      default:
        await message.channel.send({
          embeds: [
            new client.embed().desc(
              `${client.emoji.premium} **Premium Status**\n\n` +
                `${client.emoji.point} **User : ** ${
                  premiumUser ? client.emoji.on : client.emoji.off
                }\n` +
                `${client.emoji.point} **Guild : ** ${
                  premiumGuild ? client.emoji.on : client.emoji.off
                }\n`,
            ),
          ],
        });
        break;
    }
  },
};
