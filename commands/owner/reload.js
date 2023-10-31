/** @format */

module.exports = {
  name: 'reload',
  aliases: ['rl'],
  cooldown: '',
  category: 'owner',
  usage: '<command_name>',
  description: 'Reloades given command',
  args: false,
  vote: false,
  admin: false,
  owner: true,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    let cmds = [];

    const commandName = args[0].toLowerCase();
    const commands =
      commandName == 'all'
        ? [...client.commands].map((entry) => entry[1])
        : [
            message.client.commands.get(commandName) ||
              message.client.commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
              ),
          ];

    if (!commands)
      return message.channel.send({
        embeds: [
          new client.embed().desc(
            `${client.emoji.warn} **There is no command with provided name or alias**`,
          ),
        ],
      });

    cmds = commands;
    let success = [];
    let failed = [];

    for (i = 0; i < cmds.length; i++) {
      let cmd = cmds[i];
      delete require.cache[
        require.resolve(
          `${process.cwd()}/commands/${cmd.category}/${cmd.name}.js`,
        )
      ];

      try {
        const newCommand = require(
          `${process.cwd()}/commands/${cmd.category}/${cmd.name}.js`,
        );
        await message.client.commands.set(newCommand.name, newCommand);
        await success.push(`${cmd.name}`);
      } catch (error) {
        await failed.push(`${cmd.name} => [${error}]`);
      }
    }

    await message.channel.send({
      embeds: [
        new client.embed().desc(
          `${
            client.emoji.yes
          } **| Successfully reloaded \n\`\`\`\n${success.join(
            ', ',
          )}\n\`\`\`**\n` +
            `${client.emoji.no} **| Reload Failed \n\`\`\`\n${
              failed.join(',\n') || 'None'
            }\n\`\`\`**`,
        ),
      ],
    });
  },
};
