/** @format */

module.exports = {
  name: "restart",
  aliases: [],
  cooldown: "",
  category: "owner",
  usage: "",
  description: "Respawns all shards",
  args: false,
  vote: false,
  admin: false,
  owner: true,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    await message.channel.send({
      embeds: [
        new client.embed().desc(
          `${client.emoji.cool} **| Respawning all shards. ETA: 10-15s**`,
        ),
      ],
    });
    client.log(`Killing and respawning all shards`, "debug"),
      await client.cluster.respawnAll();
  },
};
