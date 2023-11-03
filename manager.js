/** @format */
require("dotenv").config();
require("./utils/web_server");
const YML = require("js-yaml").load(
  require("fs").readFileSync("./config.yml", "utf8")
);
const cron = require("node-cron");
const { Client } = require("discord.js");
const { ActivityType } = require("discord.js");
const client = new Client({ 
  intents: 3276799
 });
const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

const sleep = (t) => {
  return new Promise((r) => setTimeout(r, t));
};

client.on("ready", async () => {
  require("./plugins/logger").log(
    `Ready! Logged in as ${client.user.tag}`,
    "manager"
  );
  client.prefix = "!";
  client.config = require("./config/options");
  client.admins = client.config.bot.admins;
  client.owners = client.config.bot.owners;
  client.support = client.config.links.support;
  client.emoji = require("./assets/emoji");
  client.embed = require("./plugins/embed");
  client.button = require("./plugins/button");
  client.premium = require("./database/premium");
  client.vouchers = require("./database/vouchers");
  client.user.setPresence({
    activities: [
      {
        name: "Executing Backup-Manager.exe",
        type: ActivityType.Custom,
      },
    ],
    status: "doNotDisturb",
  });

  const channel = await client.channels.fetch("1162104949061210153");
  const messages = await channel.messages.fetch({ limit: 10 });
  const toDel = messages.filter((msg) => msg.author.id === client.user.id);
  await toDel.forEach(async (m) => await m.delete());
  await channel.send("Backup Manager Started");

  cron.schedule("0 */1 * * *", async () => {
    const backup_zip_creator = require("./functions/zipper.js");

    const backup_zip_manager = async () => {
      const file = `./emerald-backup.zip`;
      await backup_zip_creator(file);
      await sleep(10000);
      const { AttachmentBuilder } = require("discord.js");
      await channel
        .send({
          files: [
            new AttachmentBuilder(file, {
              name: file,
            }),
          ],
        })
        .then(async (msg) => {
          const fs = require("fs");
          fs.unlink(file, () => {
            return;
          });
          setTimeout(async () => {
            await msg.delete();
          }, 5 * 60 * 1000);
        });
    };

    await backup_zip_manager();
  });
});

client.on("messageCreate", async (message) => {
  if (
    !message ||
    !message.author ||
    !message.channel ||
    !message.guild ||
    message.author.bot
  )
    return;

  await new (require("dokdo"))(client, {
    owners: ["692617937512562729"],
    aliases: ["jsk", "Jsk"],
    prefix: client.prefix,
  }).run(message);

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(client.prefix)})\\s*`
  );
  if (!prefixRegex.test(message.content.toLowerCase())) return;
  const [matchedPrefix] = message.content.toLowerCase().match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  if (
    cmd == "gen" &&
    (client.admins.includes(message.author.id) ||
      client.owners.includes(message.author.id))
  ) {
    var voucher_codes = require("voucher-code-generator");

    let code = await voucher_codes.generate({
      pattern: "F##U-E##G-O##B-Y##1-S##T",
    });
    code = code[0].toUpperCase();

    await client.vouchers.set(code, "unused");

    if (message?.mentions?.members?.first()) {
      message?.mentions?.members?.first().send({
        embeds: [
          new client.embed().desc(
            `${client.emoji.premium} **Here is your generated code**\nUse [\`${client.prefix}redeem <code>\`](${client.support}) to activate your premium`
          ),
          new client.embed().desc(`${code}`),
        ],
      });

      return message.channel.send({
        embeds: [
          new client.embed().desc(
            `${
              client.emoji.yes
            } **DM'd code to ${message?.mentions?.members?.first()}**`
          ),
        ],
      });
    }

    message.channel.send({
      embeds: [
        new client.embed().desc(
          `${client.emoji.premium} **Here is your generated code**\nUse [\`${client.prefix}redeem <code>\`](${client.support}) to activate your premium`
        ),
        new client.embed().desc(`${code}`),
      ],
    });
  }

  if (cmd == "redeem") {
    let valid = await client.vouchers.get(args[0]);

    if (!valid)
      return message.channel.send({
        embeds: [
          new client.embed().desc(
            `**${client.emoji.no} Code invalid or already redeemed**`
          ),
        ],
      });
    if (valid == "unused") {
      const menu = new StringSelectMenuBuilder()
        .setCustomId("menu")
        .setPlaceholder("Select Bot To Activate Premium In . . .")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions([
          {
            label: "Fuego",
            value: "1050423676689985606",
            emoji: `${client.emoji.a_}`,
          },
          {
            label: "Fuego Prime",
            value: "1087627654888443925",
            emoji: `${client.emoji.b_}`,
          },
        ]);
      const row = new ActionRowBuilder().addComponents(menu);
      await client.vouchers.delete(args[0]);
      const m = await message.channel.send({
        //embeds: [embed],
        content: "Premium lelo guyz. . .",
        components: [row],
      });
      const collector = m?.createMessageComponentCollector({
        filter: (i) => i.user.id === message.author.id,
        time: 30000,
        idle: 30000 / 2,
      });

      collector.on("collect", async (interaction) => {
        if (!interaction.deferred) await interaction.deferUpdate();
        await client.premium.set(
          `${interaction.values}_${message.author.id}`,
          true
        );
        const bot = await client.users.fetch(`${interaction.values}`);
        const avatar = await bot.displayAvatarURL();
        await m.delete().catch(() => {});
        return message.channel
          .send({
            embeds: [
              new client.embed()
                .title(`${client.emoji.premium} Premium Activated !`)
                .desc(
                  `${client.emoji.space} **Client : **<@${interaction.values}>\n` +
                    `**${client.emoji.space} For a Duration of : **Lifetime`
                )
                .addFields({
                  name: `Privilages attained :\n`,
                  value:
                    `${client.emoji.point} No prefix\n` +
                    `${client.emoji.point} Better sound\n` +
                    `${client.emoji.point} Access to Custom-Eq\n` +
                    `${client.emoji.point} Access to several radios\n` +
                    `${client.emoji.point} 247 in VC and more . . .`,
                })
                .thumb(avatar)
                .setFooter({
                  text: `Hope you enjoy our services ${message.author.username}`,
                }),
            ],
          })
          .catch(() => {});
      });

      collector.on("end", async () => {
        return m
          .edit({
            embeds: [
              new client.embed().desc(
                `${client.emoji.warn} **Timeout ! No options selected**`
              ),
            ],
            components: [],
          })
          .then(async () => {
            await client.vouchers.set(args[0], "unused").catch((e) => {});
          });
      });
    }
  }
});
require("./utils/error_handler")(client);
client.login(YML.MANAGER.TOKEN);
