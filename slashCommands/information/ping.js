/** @format */

module.exports = {
  name: ["ping"],
  description: "Shows bot's ping",
  cooldown: "",
  category: "information",
  vote: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],

  execute: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: false });

    let emb = new client.embed().desc(
      `${client.emoji.cool} **| Getting data. Please wait . . .**`,
    );

    await interaction.editReply({ embeds: [emb] }).then(async (m) => {
      let josh = async () => {
        const start = performance.now();
        await client.noPrefix.set("test", true);
        const write = performance.now();
        await client.noPrefix.get("test");
        const read = performance.now();
        await client.noPrefix.delete("test");
        const del = performance.now();
        return [
          (del - start).toFixed(2),
          (write - start).toFixed(2),
          (read - write).toFixed(2),
          (del - read).toFixed(2),
        ];
      };
      const ws = client.ws.ping;
      const msg = m.createdAt - interaction.createdAt;

      const dbData = await josh();
      const PingEmbed = new client.embed()
        .desc(
          `${client.emoji.json} -  **DB Readㅤ : **\`${dbData[2]} ms\`\n` +
            `${client.emoji.json} -  **DB Writeㅤ : **\`${dbData[1]} ms\`\n` +
            `${client.emoji.json} -  **DB Deleteㅤ : **\`${dbData[3]} ms\`\n` +
            `${client.emoji.json} - **DB Totalㅤ : **\`${dbData[0]} ms\`\n` +
            `${client.emoji.cloud} - **WS Latencyㅤ: **\`${ws} ms\`\n` +
            `${client.emoji.message} - **MSG Latency : **\`${msg} ms\`\n`,
        )
        .thumb(client.user.displayAvatarURL())

        .setFooter({ text: "By ━● 1sT-Services | Fast as Fuck boi" });
      await m.edit({ embeds: [PingEmbed] }).catch(() => {});
    });
  },
};
