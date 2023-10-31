/** @format */

module.exports = {
  name: 'ping',
  aliases: ['pong'],
  cooldown: '',
  category: 'information',
  usage: '',
  description: "Shows bot's ping",
  args: false,
  vote: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    let emb = new client.embed().desc(
      `${client.emoji.cool} **| Getting data. Please wait . . .**`,
    );
    await message.channel.send({ embeds: [emb] }).then(async (m) => {
      let josh = async () => {
        await client.noPrefix.set('test', true);
        const start = Date.now();
        await client.noPrefix.get('test');
        const end = Date.now();
        await client.noPrefix.delete('test');
        return end - start;
      };
      var msg = m.createdAt - message.createdAt;
      var ws = client.ws.ping;

      const PingEmbed = new client.embed()
        .desc(
          `> ${
            client.emoji.json
          } - **DB Latencyㅤ : **\`${await josh()} ms\`\n` +
            `> ${client.emoji.cloud} - **WS Latencyㅤ: **\`${ws} ms\`\n` +
            `> ${client.emoji.message} - **MSG Latency : **\`${msg} ms\`\n`,
        )
        .thumb(client.user.displayAvatarURL())
        .setFooter({ text: 'By ━● 1sT-Services | Fast as Fuck boi' });
      await m.edit({ embeds: [PingEmbed] }).catch(() => {});
    });
  },
};
