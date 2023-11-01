/** @format */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "info",
  aliases: ["botinfo", "bi"],
  cooldown: "",
  category: "information",
  usage: "",
  description: "Shows bot-info",
  args: false,
  vote: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    const e0 = new client.embed()
      .setAuthor({
        name: `About ${client.user.username}`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        url: "https://home.1st-dev.repl.co",
      })
      .desc(
        `${client.emoji.arrow} ${client.user.username} is a feature-rich Discord Music Bot.` +
          ` Made in lavalink to provide you the best quality audio possible.` +
          ` Also comes with a variety of awesome audio filters, custom equalizer and much more.`,
      )
      .img(
        "https://media.discordapp.net/attachments/1162750317004345396/1165879349224943687/Picsart_23-10-22_23-49-47-924.jpg?ex=654874c1&is=6535ffc1&hm=ec9f08bcbed73f1175cf5c5f4f19189db2615a13b47f34ccc74b10695022d50d&",
      )
      .setFooter({ text: `Page : [1/4] By ━● 1sT-Services` });

    const e1 = new client.embed()
      .setAuthor({
        name: `About ${client.user.username} [Nerdy Stats]`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .desc(
        `${client.emoji.stats} **Version : **\`v1.0.0-Emerald\`\n` +
          `${client.emoji.djs} **Discord.js : **\`v14.13.0\`\n` +
          `${client.emoji.nodejs} **Node version : **\`v18.17.1\`\n` +
          `${client.emoji.cog} **SRC Manager : **\`M-3.1.3\`\n` +
          `${client.emoji.json} **API Manager : **\`IV-Link\`\n` +
          `${client.emoji.premium} **Plugins : **\`v1.0.0 - Xeon\`\n`,
      )
      .thumb("https://images.dmca.com/Badges/dmca-badge-w250-1x1-01.png")
      .setFooter({ text: `Page : [2/4] By ━● 1sT-Services` });

    const e2 = new client.embed()
      .setAuthor({
        name: `About ${client.user.username} [Dev & Owner]`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .desc(
        `${client.emoji.space + client.emoji.arrow} \`painfuego\`\n` +
          `${client.emoji.space + client.emoji.arrow} \`rainyXeon </>\`\n`,
      )
      .thumb(
        "https://media.discordapp.net/attachments/1162750317004345396/1165333567493115904/bot.png?ex=65467875&is=65340375&hm=030d3aa4c7e648b4f01ab4ad6f3c2edda742db6d7de8b4192543609d9ec51564&",
      )
      .setFooter({ text: `Page : [3/4] By ━● 1sT-Services` });

    const e4 = new client.embed()
      .setAuthor({
        name: `About ${client.user.username} [Honorables]`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .desc(
        `${client.emoji.space + client.emoji.arrow} \`Void.Dex#5063\`\n` +
          `${client.emoji.space + client.emoji.arrow} \`script#1337\`\n` +
          `${client.emoji.space + client.emoji.arrow} \`Kazi#0002\`\n` +
          `${client.emoji.space + client.emoji.arrow} \`ChesTeR.#7000\`\n` +
          `${client.emoji.space + client.emoji.arrow} \`~ 𝐹𝑙𝑎𝑚𝑒 </>#4540\`\n` +
          `${client.emoji.space + client.emoji.arrow} \`CYAN🍁†#5106\`\n` +
          `${
            client.emoji.space + client.emoji.arrow
          } \`!!🕉 𝑨 𝒅 𝒊 𝒕 𝒚 𝒂#8566\`\n` +
          `${client.emoji.space + client.emoji.arrow} \`_ragnor.\`\n`,
      )
      .thumb(
        "https://media.discordapp.net/attachments/1162750317004345396/1165335299820355685/211a7fca11133e91df9f2f8284e50d1b-medal-of-honor-icon.png?ex=65467a12&is=65340512&hm=264c1fb828492c79f0d07d0ee47872c6276426d8a7bca9271cbfef84c5024c22&",
      )
      .setFooter({ text: `Page : [4/4] By ━● 1sT-Services` });

    const pages = [e0, e1, e2, e4];
    let page = 0;

    const btn1 = new client.button().success(`home`, `Home`);
    const btn2 = new client.button().primary(`stats`, `Stat`);
    const btn3 = new client.button().primary(`dev`, `Dev`);
    const btn4 = new client.button().primary(`honor`, `Vip`);
    const btn5 = new client.button().danger(`stop`, `❌`);

    const row = new ActionRowBuilder().addComponents(
      btn1,
      btn2,
      btn3,
      btn4,
      btn5,
    );

    const msg = await message.channel.send({
      embeds: [pages[page]],
      components: [row],
    });

    const collector = msg.createMessageComponentCollector({
      filter: ({ user }) => user.id === message.author.id,
      time: 60000,
      idle: 60000 / 2,
    });

    collector.on("collect", async (c) => {
      if (!c.deferred) await c.deferUpdate();

      switch (c.customId) {
        case "home":
          page = 0;
          await msg.edit({ embeds: [pages[page]] }).catch(() => {});
          break;

        case "stats":
          page = 1;
          await msg.edit({ embeds: [pages[page]] }).catch(() => {});
          break;

        case "dev":
          page = 2;
          await msg.edit({ embeds: [pages[page]] }).catch(() => {});
          break;

        case "honor":
          page = 3;
          await msg.edit({ embeds: [pages[page]] }).catch(() => {});
          break;

        case "stop":
          await collector.stop();
          break;

        default:
          break;
      }
    });

    collector.on("end", async () => {
      await msg.edit({
        components: [],
      });
    });
  },
};
