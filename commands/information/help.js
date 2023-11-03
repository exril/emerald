/** @format */

const genCommandList = require("@functions/commandList.js");
const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  cooldown: "",
  category: "information",
  usage: "",
  description: "Shows bot's help menu",
  args: false,
  vote: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    let categories = await client.categories.filter((c) => c != "owner");

    let cat = categories
      .map(
        (c) =>
          `> ${client.emoji.point}** ${
            c.charAt(0).toUpperCase() + c.slice(1)
          }**\n`,
      )
      .join("");

    const embed = new client.embed()
      .setAuthor({
        name: `Heyyy ${
          message.member.nickname || message.member.user.username
        } I am the ,`,
      })
      .desc(`**Definiton of the best music bot**` + `\n\n` + cat)
      .thumb(client.user.displayAvatarURL())
      .setFooter({
        text: `Developed By ━● 1sT-Servicesㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ`,
      });

    let arr = [];
    for (cat of categories) {
      cmnds = client.commands.filter((c) => c.category == cat);
      arr.push(cmnds.map((c) => `\`${c.name}\``));
    }
    let allCmds = await categories.map(
      (cat, i) =>
        `${client.emoji.point} **[${cat}](${client.support})\n ${arr[i].join(
          ",",
        )}**`,
    );
    desc = allCmds.join("\n\n");

    const all = new client.embed().desc(desc).setFooter({
      text: `Developed By ━● 1sT-Servicesㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ`,
    });

    let menu = new StringSelectMenuBuilder()
      .setCustomId("menu")
      .setMinValues(1)
      .setMaxValues(1)
      .setPlaceholder("Select category to view commands")
      .addOptions([
        {
          label: "Home",
          value: "home",
          emoji: `${client.emoji.arrow}`,
        },
      ]);
    const selectMenu = new ActionRowBuilder().addComponents(menu);

    categories.forEach((category) => {
      menu.addOptions({
        label: category.charAt(0).toUpperCase() + category.slice(1),
        value: category,
        emoji: `${client.emoji.arrow}`,
      });
    });

    menu.addOptions([
      {
        label: "All commands",
        value: "all",
        emoji: `${client.emoji.arrow}`,
      },
    ]);

    const m = await message.reply({
      embeds: [embed],
      components: [selectMenu],
    });

    const collector = m?.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 60000,
      idle: 60000 / 2,
    });

    collector.on("collect", async (interaction) => {
      if (!interaction.deferred) await interaction.deferUpdate();

      const category = interaction.values[0];
      switch (category) {
        case "home":
          await m
            .edit({
              embeds: [embed],
            })
            .catch(() => {});
          break;

        case "all":
          await m
            .edit({
              embeds: [all],
            })
            .catch(() => {});
          break;

        default:
          await m
            .edit({
              embeds: [
                new client.embed()
                  .desc(await genCommandList(client, category))
                  .title(
                    `${
                      category.charAt(0).toUpperCase() + category.slice(1)
                    } - related Commands`,
                  )
                  .setFooter({
                    text: `Developed By ━● 1sT-Servicesㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ`,
                  }),
              ],
            })
            .catch(() => {});
          break;
      }
    });

    collector.on("end", async () => {
      if (!m) return;
      await m.edit({ components: [] }).catch(() => {});
    });
  },
};
