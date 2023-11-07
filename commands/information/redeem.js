/** @format */

module.exports = {
  name: "redeem",
  aliases: [],
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
    let [premiumUser, premiumGuild] = await Promise.all([
      await client.premium.get(`${client.user.id}_${message.author.id}`),
      await client.premium.get(`${client.user.id}_${message.guild.id}`),
    ]);

    await message.channel
      .send({
        embeds: [
          new client.embed().desc(
            `**${client.emoji.cool} Validating Code. Please wait !**`,
          ),
        ],
      })
      .then(async (m) => {
        let code = args[0];
        let valid = await client.vouchers.get(code);
        if (!valid)
          return m.edit({
            embeds: [
              new client.embed().desc(
                `**${client.emoji.no} Code invalid or already redeemed**`,
              ),
            ],
          });

        //////////////////////////////////////////////////////////////////////////

        if (code.includes("GUILD")) {
          if (premiumGuild)
            return m.edit({
              embeds: [
                new client.embed().desc(
                  `**${client.emoji.no} This Guild already has premium activated**\n` +
                    `*${client.emoji.bell} Code not used ! Gift it to someone else.*`,
                ),
              ],
            });
          await client.premium.set(
            `${client.user.id}_${message.guild.id}`,
            true,
          );
          await client.vouchers.delete(`${code}`);
        }
        if (code.includes("USER")) {
          if (premiumUser)
            return m.edit({
              embeds: [
                new client.embed().desc(
                  `**${client.emoji.no} This User already has premium activated**\n` +
                    `*${client.emoji.bell} Code not used ! Gift it to someone else.*`,
                ),
              ],
            });
          await client.premium.set(
            `${client.user.id}_${message.author.id}`,
            true,
          );
          await client.vouchers.delete(`${code}`);
        }
        setTimeout(async () => {
          m.edit({
            embeds: [
              new client.embed()
                .title(`${client.emoji.premium} Premium Activated !`)
                .desc(
                  `${client.emoji.space} **Client : **${client.user}\n` +
                    `**${client.emoji.space} For a Duration of : **Lifetime`,
                )
                .addFields({
                  name: `Privilages attained :\n`,
                  value:
                    `${client.emoji.point} No prefix\n` +
                    `${client.emoji.point} Vote bypass and more . . .`,
                })
                .thumb(client.user.displayAvatarURL())
                .setFooter({
                  text: `${message.author.username}, we hope you enjoy our services`,
                }),
            ],
          }).catch(() => {});
        }, 3000);
      });
  },
};
