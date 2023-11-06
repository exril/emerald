/** @format */

const QuickChart = require("quickchart-js");
const qc = new QuickChart();

module.exports = {
  name: "ping",
  aliases: ["pong"],
  cooldown: "",
  category: "information",
  usage: "",
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

    const gen = (wsl, msg) => {
      let rnd = Math.random();
      wsl = parseInt(
        wsl + Math.floor(rnd * (-wsl * 0.1 - wsl * 0.1)) + wsl * 0.1,
      );
      msg = parseInt(
        msg + Math.floor(rnd * (-msg * 0.02 - msg * 0.02)) + msg * 0.02,
      );
      return [wsl, msg];
    };

    await message.reply({ embeds: [emb] }).then(async (m) => {
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
      const msg = m.createdAt - message.createdAt;

      let data = [];
      for (i = 0; i < 17; i++) {
        data.push(gen(ws, msg));
      }
      data.push([ws, msg]);

      ////////////////////////////////////////////////////////////////////////////

      qc.setConfig({
        type: "line",
        data: {
          labels: [
            "_",
            "_",
            "_",
            "_",
            "_",
            "_",
            "_",
            "_",
            "_",
            "_",
            "_",
            "_",
            "_",
            "_",
            "_",
            "_",
            "_",
          ],
          datasets: [
            {
              label: "Websocket Latency",
              yAxisID: "ws",
              data: data.map((item) => item[0]),
              fill: true,
              borderColor: "#ff5500",
              borderWidth: 1,
              backgroundColor: QuickChart.getGradientFillHelper("vertical", [
                "#fc4e14",
                "#ffffff",
              ]),
            },
            {
              label: "Message Latency",
              yAxisID: "msg",
              data: data.map((item) => item[1]),
              fill: true,
              borderColor: "#00d8ff",
              borderWidth: 1,
              backgroundColor: QuickChart.getGradientFillHelper("vertical", [
                "#24ffd3",
                "#ffffff",
              ]),
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                id: "msg",
                type: "linear",
                position: "right",
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: 200,
                  callback: (value) => {
                    return `${value}`;
                  },
                },
              },
              {
                id: "ws",
                type: "linear",
                position: "left",
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: msg,
                  callback: (value) => {
                    return `${value}`;
                  },
                },
              },
            ],
          },
        },
      });
      qc.setWidth(400);
      qc.setHeight(200);
      qc.setBackgroundColor("transparent");

      let uri = await qc.getUrl();
      ////////////////////////////////////////////////////////////////////////////

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
        .img(uri)
        .setFooter({ text: "By ━● 1sT-Services | Fast as Fuck boi" });
      await m
        .edit({
          embeds: [PingEmbed],
        })
        .catch(() => {});
    });
  },
};
