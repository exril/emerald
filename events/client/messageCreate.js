/** @format */

const { RateLimitManager } = require("@sapphire/ratelimits");
const rateLimitManager = new RateLimitManager(10000, 4);

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {
    if (
      message.author.bot ||
      !message ||
      !message.guild ||
      !message.channel ||
      !message.content
    )
      return;

    let voted = false;
    const [noPrefixUser, premiumUser, blacklistUser, developer, admin] =
      await Promise.all([
        await client.noPrefix.get(`${client.user.id}_${message.author.id}`),
        await client.premium.get(`${client.user.id}_${message.author.id}`),
        await client.blacklist.get(`${message.author.id}`),
        await client.owners.find((x) => x === message.author.id),
        await client.admins.find((x) => x === message.author.id),
      ]);

    if (message.content.toLowerCase().includes("jsk")) {
      const pfx =
        noPrefixUser && !message.content.startsWith(client.prefix)
          ? ""
          : client.prefix;
      return await client.emit("dokdo", message, pfx);
    }

    let prefix = client.prefix;

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

    if (message.content.match(mention)) {
      if (blacklistUser)
        return await client.emit("blUser", message, blacklistUser);
      const mentionRlBucket = rateLimitManager.acquire(`${message.author.id}`);
      if (mentionRlBucket.limited && !developer && !admin)
        return client.blacklist.set(`${message.author.id}`, true);
      try {
        mentionRlBucket.consume();
      } catch (e) {}
      return await client.emit("mention", message);
    }

    prefix =
      (noPrefixUser || premiumUser) &&
      !message.content.startsWith(client.prefix)
        ? ""
        : client.prefix;

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!prefixRegex.test(message.content.toLowerCase())) return;
    const [matchedPrefix] = message.content.toLowerCase().match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    if (blacklistUser) {
      return await client.emit("blUser", message, blacklistUser);
    }

    const commandRlBucket = rateLimitManager.acquire(`${message.author.id}`);

    if (commandRlBucket.limited && !developer && !admin)
      return client.blacklist.set(`${message.author.id}`, true);

    try {
      commandRlBucket.consume();
    } catch (e) {}

    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(
        command.name,
        new (require("discord.js").Collection)()
      );
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = parseInt(command.cooldown) || 5000;

    if (timestamps.has(message.author.id) && !developer) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round((expirationTime - now) / 1000);
        description = ` Please wait ${expiredTimestamp} second(s) before reusing the command **\`${command.name}\``;
        return message.channel
          .send({
            embeds: [
              new client.embed().desc(`${client.emoji.cool} **${description}`),
            ],
          })
          .then(
            async (m) =>
              await setTimeout(async () => {
                m.delete().catch(() => {});
              }, 3000)
          );
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    if (
      !message.channel
        .permissionsFor(message.guild.members.me)
        ?.has("ViewChannel")
    )
      return;

    if (
      !message.channel
        .permissionsFor(message.guild.members.me)
        ?.has("SendMessages")
    )
      return await message.author
        .send({
          embeds: [
            new client.embed().desc(
              `${client.emoji.warn} **I need \`SEND_MESSAGES\` permission in ${message.channel} to execute the command \`${command.name}\`**`
            ),
          ],
        })
        .catch(() => {});

    if (
      !message.channel
        .permissionsFor(message.guild.members.me)
        ?.has("EmbedLinks")
    )
      return await message.author
        .send({
          embeds: [
            new client.embed().desc(
              `${client.emoji.warn} **I need \`EMBED_LINKS\` permission in ${message.channel} to execute the command \`${command.name}\`**`
            ),
          ],
        })
        .catch(() => {});

    const embed = new client.embed();

    if (command.args && !args.length) {
      let reply = `${client.emoji.no} **Invalid/No args provided**`;

      if (command.usage) {
        reply += `\n${client.emoji.bell} Usage: \`${prefix}${command.name} ${command.usage}\``;
      }

      embed.desc(reply);
      return message.channel.send({ embeds: [embed] });
    }

    if (
      command.userPerms &&
      !message.member.permissions.has(command.userPerms)
    ) {
      embed.desc(
        `${client.emoji.warn} **You need \`${command.userPerms.join(
          ", "
        )}\` permission/s to use this command**`
      );
      return message.channel.send({ embeds: [embed] });
    }
    if (
      (command.botPerms &&
        !message.guild.members.me.permissions.has(command.botPerms)) ||
      !message.channel
        .permissionsFor(message.guild.members.me)
        ?.has(command.botPerms)
    ) {
      embed.desc(
        `${client.emoji.warn} **I need \`${command.userPerms.join(", ")}\` in ${
          message.channel
        } permission/s to execute this command**`
      );
      return message.channel.send({ embeds: [embed] });
    }

    if (command.admin) {
      if (!developer && !admin)
        return message.channel.send({
          embeds: [
            embed.desc(
              `${client.emoji.admin} **Only my Owner/s and Admin/s can use this command**`
            ),
          ],
        });
    }

    if (command.owner && !command.admin) {
      if (!developer)
        return message.channel.send({
          embeds: [
            embed.desc(
              `${client.emoji.king} **Only my Owner/s can use this command**`
            ),
          ],
        });
    }

    if (command.vote && !developer && !premiumUser) {
      if (client.vote && client.topGgAuth) {
        await fetch(
          `https://top.gg/api/bots/${client.user.id}/check?userId=${message.author.id}`,
          {
            method: "GET",
            headers: {
              Authorization: client.topGgAuth,
            },
          }
        )
          .then((res) => res.json())
          .then((json) => {
            return (voted = json?.voted != 0 ? true : false);
          })
          .catch((err) => {
            this.log(`Commands cannot be vote locked !!! ${err}`);
            return (voted = true);
          });
        if (!voted)
          return message.channel.send({
            embeds: [
              embed.desc(
                `${client.emoji.premium} **Only my Voter/s can use this command**\n` +
                  `[Click to vote me](${client.vote})`
              ),
            ],
          });
      }
    }

    command.execute(client, message, args);
  },
};
