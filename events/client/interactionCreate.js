/** @format */

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (interaction.isModalSubmit()) {
      switch (interaction.customId) {
        case "report":
          await client.emit("reportSubmit", interaction);
          break;

        default:
          break;
      }
      return;
    }

    if (
      interaction.isCommand() ||
      interaction.isContextMenuCommand() ||
      interaction.isChatInputCommand() ||
      interaction.isAutocomplete()
    ) {
      if (!interaction.guild || interaction.user.bot) return;

      /////// Get command

      let subCommandName = "";
      try {
        subCommandName = interaction.options.getSubcommand();
      } catch (e) {}
      let subCommandGroupName = "";
      try {
        subCommandGroupName = interaction.options.getSubcommandGroup();
      } catch (e) {}

      const command = await client.slashCommands.find((command) => {
        switch (command.name.length) {
          case 1:
            return command.name[0] == interaction.commandName;
          case 2:
            return (
              command.name[0] == interaction.commandName &&
              command.name[1] == subCommandName
            );
          case 3:
            return (
              command.name[0] == interaction.commandName &&
              command.name[1] == subCommandGroupName &&
              command.name[2] == subCommandName
            );
        }
      });

      ///////////////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////// Check if bot has view channel permission or not ///////////////////////
      ///////////////////////////////////////////////////////////////////////////////////////////////////

      if (
        !interaction.channel
          .permissionsFor(interaction.guild.members.me)
          ?.has("ViewChannel")
      )
        return;

      ///////////////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////// Check if bot has send messages permission or not //////////////////////
      ///////////////////////////////////////////////////////////////////////////////////////////////////

      if (
        !interaction.channel
          .permissionsFor(interaction.guild.members.me)
          ?.has("SendMessages")
      )
        return await interaction.author
          .send({
            embeds: [
              new client.embed().desc(
                `${client.emoji.warn} **I need \`SEND_MESSAGES\` permission in ${interaction.channel} to execute the command \`${command.name}\`**`,
              ),
            ],
          })
          .catch(() => {});

      ///////////////////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////// Check if bot has embed links permission or not ///////////////////////
      ///////////////////////////////////////////////////////////////////////////////////////////////////

      if (
        !interaction.channel
          .permissionsFor(interaction.guild.members.me)
          ?.has("EmbedLinks")
      )
        return await interaction.author
          .send({
            embeds: [
              new client.embed().desc(
                `${client.emoji.warn} **I need \`EMBED_LINKS\` permission in ${interaction.channel} to execute the command \`${command.name}\`**`,
              ),
            ],
          })
          .catch(() => {});

      ///////////////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////// Check args needed or not if yes check provided or not /////////////////////
      ///////////////////////////////////////////////////////////////////////////////////////////////////

      if (command.args && !args.length) {
        let reply = `${client.emoji.no} **Invalid/No args provided**`;
        if (command.usage)
          reply += `\n${client.emoji.bell} Usage: \`${prefix}${command.name} ${command.usage}\``;
        return await interaction.reply({
          embeds: [new client.embed().desc(reply)],
        });
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////// Check Perms needed by user to execute command ////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////////////////////

      if (
        command.userPerms &&
        !interaction.member.permissions.has(command.userPerms)
      ) {
        return await interaction.reply({
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
          !interaction.guild.members.me.permissions.has(command.botPerms)) ||
        !interaction.channel
          .permissionsFor(interaction.guild.members.me)
          ?.has(command.botPerms)
      ) {
        return await interaction.reply({
          embeds: [
            new client.embed().desc(
              `${client.emoji.warn} **I need \`${command.userPerms.join(
                ", ",
              )}\` in ${
                interaction.channel
              } permission/s to execute this command**`,
            ),
          ],
        });
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////// Check admin commands /////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////////////////////

      if (command.admin) {
        if (!owner && !admin)
          return await interaction.reply({
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
          return await interaction.reply({
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

      if (command.vote && !owner && !premiumUser) {
        if (client.vote && client.topGgAuth) {
          await fetch(
            `https://top.gg/api/bots/${client.user.id}/check?userId=${interaction.author.id}`,
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
            return await interaction.reply({
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

      command.execute(client, interaction);
    }
  },
};
