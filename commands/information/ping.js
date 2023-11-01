/** @format */

const { AttachmentBuilder } = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

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

    const width = 800;
    const height = 250;
    const backgroundColour = 'white';
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      width,
      height,
      backgroundColour,
    });

    const gen = (value) =>
      (value +
        Math.floor(Math.random() * (value * 0.25 - value * 0.15)) +
        value * 0.15) /
      10;

    await message.channel.send({ embeds: [emb] }).then(async (m) => {
      let josh = async () => {
        const start = Date.now();
        await client.noPrefix.set('test', true);
        const write = Date.now();
        await client.noPrefix.get('test');
        const read = Date.now();
        await client.noPrefix.delete('test');
        const del = Date.now();
        return [del - start, write - start, read - write, del - read];
      };
      var msg = m.createdAt - message.createdAt;
      var ws = client.ws.ping;
      const configuration = {
        type: 'line',
        data: {
          labels: ['ㅤ', 'ㅤ', 'ㅤ', 'ㅤ', 'ㅤ', 'ㅤ', 'ㅤ'],
          datasets: [
            {
              label: 'ws',
              data: [
                gen(ws),
                gen(ws),
                gen(ws),
                gen(ws),
                gen(ws),
                gen(ws),
                ws / 10,
              ],
              fill: true,
              borderColor: 'rgb(51, 204, 204)',
              borderWidth: 1,
            },
            {
              label: 'message',
              data: [
                gen(msg),
                gen(msg),
                gen(msg),
                gen(msg),
                gen(msg),
                gen(msg),
                msg / 10,
              ],
              fill: true,
              borderColor: 'rgb(200, 50, 204)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              suggestedMin: 0,
            },
          },
        },
      };

      const image = await chartJSNodeCanvas.renderToBuffer(configuration);
      const attachment = new AttachmentBuilder(image, { name: 'chart.png' });
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
        .img(`attachment://${attachment.name}`)
        .setFooter({ text: 'By ━● 1sT-Services | Fast as Fuck boi' });
      await m
        .edit({ embeds: [PingEmbed], files: [attachment] })
        .catch(() => {});
    });
  },
};
