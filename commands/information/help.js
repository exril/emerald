/** @format */

const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  aliases: ['h'],
  cooldown: '',
  category: 'information',
  usage: '',
  description: "Shows bot's help menu",
  args: false,
  vote: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    const genCommandList = async (category) => {
      let commands = await client.commands
        .filter((x) => x.category && x.category === category)
        .map(
          (x) =>
            `${client.emoji.point} **\`${x.name}\` → [${
              x.description || 'No description'
            }](${client.support})** ${x.new ? `${client.emoji.new}` : ''}${
              x.vote ? `${client.emoji.premium}` : ''
            }`,
        )
        .join('\n');
      return commands || '**No commands to display**';
    };

    if (args[0]) {
      const category = args[0].toLowerCase();
      if (client.categories.includes(category)) {
        return message.channel.send({
          embeds: [
            new client.embed()
              .desc(await genCommandList(category))
              .title(
                `${
                  category.charAt(0).toUpperCase() + category.slice(1)
                } - related Commands`,
              )
              .setFooter({
                text: `By ━● 1sT-Services | Please run ${prefix}help for full menu`,
              }),
          ],
        });
      }

      const cmd =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()),
        );

      if (cmd) {
        return message.channel.send({
          embeds: [
            new client.embed()
              .desc(
                ` **${client.emoji.point} Nameㅤ →ㅤ${cmd.name} ${
                  cmd.aliases?.[0] ? `, ${cmd.aliases.join(', ')}` : ''
                }\n` +
                  `${client.emoji.point} Infoㅤㅤ→ㅤ${
                    cmd.description || 'Not Available'
                  }\n` +
                  `${client.emoji.point} Usageㅤ→ㅤ[${client.prefix}${cmd.name} ${cmd.usage}](${client.support})\n**`,
              )
              .title(
                `Command info - ${
                  cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1)
                }`,
              )
              .setFooter({
                text: `By ━● 1sT-Services | Please run ${prefix}help for menu`,
              }),
          ],
        });
      }
    }

    const embed = new client.embed()
      .setAuthor({
        name: `Heyyy ${
          message.member.nickname || message.member.user.username
        } I am the ,`,
      })
      .desc(
        `**Definiton of the best music bot**` +
          `\n\n` +
          `> ${client.emoji.point}** Music**\n` +
          `> ${client.emoji.point}** Filters**\n` +
          `> ${client.emoji.point}** information**\n`,
      )
      .thumb(client.user.displayAvatarURL())
      .setFooter({
        text: `Page [1/5] By ━● 1sT-Services`,
        iconURL:
          'https://media.discordapp.net/attachments/1145600285553741884/1145600466068185088/3061501b2e6bdcc1762deeb76218addc.webp',
      });

    const cmds = async (cat) => {
      return await (
        await client.commands.filter((c) => {
          if (c.category == cat) return c.name;
        })
      )
        .map((c) => `\`${c.name}\``)
        .join(', ');
    };

    let arr = [];
    for (cat of client.categories) {
      cmnds = client.commands.filter((c) => c.category == cat);
      arr.push(cmnds.map((c) => `\`${c.name}\``));
    }
    let allCmds = await client.categories.map(
      (cat, i) =>
        `${client.emoji.point} **[${cat}](${client.support})\n ${arr[i].join(
          ',',
        )}**`,
    );
    desc = allCmds.join('\n\n');

    const all = new client.embed().desc(desc).setFooter({
      text: `Page [5/5] By ━● 1sT-Services`,
    });

    let menu = new StringSelectMenuBuilder()
      .setCustomId('helpop')
      .setMinValues(1)
      .setMaxValues(1)
      .setPlaceholder('Select category to view commands')
      .addOptions([
        {
          label: 'Home',
          value: 'home',
          emoji: `${client.emoji.arrow}`,
        },
      ]);
    const selectMenu = new ActionRowBuilder().addComponents(menu);

    client.categories.forEach((category) => {
      if (category !== 'owner') {
        menu.addOptions({
          label: category.charAt(0).toUpperCase() + category.slice(1),
          value: category,
          emoji: `${client.emoji.arrow}`,
        });
      }
    });

    menu.addOptions([
      {
        label: 'All commands',
        value: 'all',
        emoji: `${client.emoji.arrow}`,
      },
    ]);

    const m = await message.channel.send({
      embeds: [embed],
      components: [selectMenu],
    });

    const collector = m?.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 60000,
      idle: 60000 / 2,
    });

    collector.on('collect', async (interaction) => {
      if (!interaction.deferred) await interaction.deferUpdate();

      const category = interaction.values[0];
      switch (category) {
        case 'home':
          await m
            .edit({
              embeds: [embed],
            })
            .catch(() => {});
          break;

        case 'all':
          await m
            .edit({
              embeds: [all],
            })
            .catch(() => {});
          break;

        default:
          let x = {};

          for (i = 0; i < client.categories.length; i++) {
            x[client.categories[i]] = i + 1;
          }

          page = x[category];
          await m
            .edit({
              embeds: [
                new client.embed()
                  .desc(await genCommandList(category))
                  .title(
                    `${
                      category.charAt(0).toUpperCase() + category.slice(1)
                    } - related Commands`,
                  )
                  .setFooter({
                    text: `Page [${page + 1}/5] By ━● 1sT-Services`,
                  }),
              ],
            })
            .catch(() => {});
          break;
      }
    });

    collector.on('end', async () => {
      if (!m) return;
      await m.edit({ components: [] }).catch(() => {});
    });
  },
};
