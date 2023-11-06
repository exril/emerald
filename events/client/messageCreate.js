/** @format */

const { RateLimitManager } = require("@sapphire/ratelimits");
const spamRateLimitManager = new RateLimitManager(10000, 5);
const cooldownRateLimitManager = new RateLimitManager(5000);

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

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////// Fetch some stuffs from Databases //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    let voted = false;
    let [noPrefixUser, premiumUser, premiumGuild, blacklistUser, owner, admin] =
      await Promise.all([
        await client.noPrefix.get(`${client.user.id}_${message.author.id}`),
        await client.premium.get(`${client.user.id}_${message.author.id}`),
        await client.premium.get(`${client.user.id}_${message.guild.id}`),
        await client.blacklist.get(`${client.user.id}_${message.author.id}`),
        await client.owners.find((x) => x === message.author.id),
        await client.admins.find((x) => x === message.author.id),
      ]);

    if (owner || admin) blacklistUser = false;

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////// Dokdo ///////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    if (message.content.toLowerCase().includes("jsk")) {
      const pfx =
        noPrefixUser && !message.content.startsWith(client.prefix)
          ? ""
          : client.prefix;
      return await client.emit("dokdo", message, pfx);
    }

    let prefix = client.prefix;

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////// Reply to mention and Auto - Blacklist on mention spam ///////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    if (message.content.match(mention)) {
      if (blacklistUser)
        return await client.emit("blUser", message, blacklistUser);
      const mentionRlBucket = spamRateLimitManager.acquire(
        `${message.author.id}`,
      );
      if (mentionRlBucket.limited && !owner && !admin)
        return client.blacklist.set(
          `${client.user.id}_${message.author.id}`,
          true,
        );
      try {
        mentionRlBucket.consume();
      } catch (e) {}
      return await client.emit("mention", message);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////// Some pretty shitty stuff that i won't explain ////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    prefix =
      (noPrefixUser || premiumUser) &&
      !message.content.startsWith(client.prefix)
        ? ""
        : client.prefix;

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`,
    );
    if (!prefixRegex.test(message.content.toLowerCase())) return;
    const [matchedPrefix] = message.content.toLowerCase().match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// Get command object from command collection /////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
      );

    if (!command) return;

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////// Check - Blacklist //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    if (blacklistUser) {
      return await client.emit("blUser", message, blacklistUser);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////// Auto - Blacklist on command spam //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    const commandRlBucket = spamRateLimitManager.acquire(
      `${message.author.id}`,
    );

    if (commandRlBucket.limited && !owner && !admin)
      return client.blacklist.set(
        `${client.user.id}_${message.author.id}`,
        true,
      );

    try {
      commandRlBucket.consume();
    } catch (e) {}

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////// Command usage Cooldown /////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(
        command.name,
        new (require("discord.js").Collection)(),
      );
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = parseInt(command.cooldown) * 1000 || 5 * 1000;

    if (timestamps.has(message.author.id) && !owner && !admin) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const cooldownRlBucket = cooldownRateLimitManager.acquire(
          `${message.author.id}_${command.name}`,
        );
        if (cooldownRlBucket.limited) return;
        try {
          cooldownRlBucket.consume();
        } catch (e) {}

        const expiredTimestamp = Math.round(expirationTime - now);
        description = ` Please wait ${client.formatTime(
          expiredTimestamp,
        )} before reusing the command **\`${command.name}\``;
        return message.channel.send({
          embeds: [
            new client.embed().desc(`${client.emoji.cool} **${description}`),
          ],
        });
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////// Check if bot has view channel permission or not ///////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    if (
      !message.channel
        .permissionsFor(message.guild.members.me)
        ?.has("ViewChannel")
    )
      return;

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////// Check if bot has send messages permission or not //////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    if (
      !message.channel
        .permissionsFor(message.guild.members.me)
        ?.has("SendMessages")
    )
      return await message.author
        .send({
          embeds: [
            new client.embed().desc(
              `${client.emoji.warn} **I need \`SEND_MESSAGES\` permission in ${message.channel} to execute the command \`${command.name}\`**`,
            ),
          ],
        })
        .catch(() => {});

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////// Check if bot has embed links permission or not ///////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    if (
      !message.channel
        .permissionsFor(message.guild.members.me)
        ?.has("EmbedLinks")
    )
      return await message.author
        .send({
          embeds: [
            new client.embed().desc(
              `${client.emoji.warn} **I need \`EMBED_LINKS\` permission in ${message.channel} to execute the command \`${command.name}\`**`,
            ),
          ],
        })
        .catch(() => {});

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// Check args and emit command infoRequested event ////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    if (args[0]?.toLowerCase() == "-h")
      return await client.emit("infoRequested", message, command);

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////// Check args needed or not if yes check provided or not /////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    if (command.args && !args.length) {
      let reply = `${client.emoji.no} **Invalid/No args provided**`;
      if (command.usage)
        reply += `\n${client.emoji.bell} Usage: \`${prefix}${command.name} ${command.usage}\``;
      return await message.reply({
        embeds: [new client.embed().desc(reply)],
      });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////// Check Perms needed by user to execute command ////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    if (
      command.userPerms &&
      !message.member.permissions.has(command.userPerms)
    ) {
      return await message.reply({
        embeds: [
          new client.embed().desc(
            `${client.emoji.warn} **You need \`${command.userPerms.join(
              ", ",
            )}\` permission/s to use this command**`,
          ),
        ],
      });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////// Check Perms needed by bot to execute command /////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    if (
      (command.botPerms &&
        !message.guild.members.me.permissions.has(command.botPerms)) ||
      !message.channel
        .permissionsFor(message.guild.members.me)
        ?.has(command.botPerms)
    ) {
      return await message.reply({
        embeds: [
          new client.embed().desc(
            `${client.emoji.warn} **I need \`${command.userPerms.join(
              ", ",
            )}\` in ${message.channel} permission/s to execute this command**`,
          ),
        ],
      });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// Check admin commands /////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    if (command.admin) {
      if (!owner && !admin)
        return await message.reply({
          embeds: [
            new client.embed().desc(
              `${client.emoji.admin} **Only my Owner/s and Admin/s can use this command**`,
            ),
          ],
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////// Check owner commands //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    if (command.owner && !command.admin) {
      if (!owner)
        return await message.reply({
          embeds: [
            new client.embed().desc(
              `${client.emoji.king} **Only my Owner/s can use this command**`,
            ),
          ],
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////// Check vote locked commands ////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    if (command.vote && !owner && !premiumUser && !premiumGuild) {
      if (client.vote && client.topGgAuth) {
        await fetch(
          `https://top.gg/api/bots/${client.user.id}/check?userId=${message.author.id}`,
          {
            method: "GET",
            headers: {
              Authorization: client.topGgAuth,
            },
          },
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
          return await message.reply({
            embeds: [
              new client.embed().desc(
                `${client.emoji.premium} **Only my Voter/s can use this command**\n` +
                  `[Click to vote me](${client.vote})`,
              ),
            ],
          });
      }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////// Execute commands if checks successful /////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    command.execute(client, message, args);
  },
};
