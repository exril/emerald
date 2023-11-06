/** @format */

const { readdirSync } = require("fs");

module.exports = async (client) => {
  let count = 0;
  readdirSync("./commands").forEach((dir) => {
    const commandFiles = readdirSync(`./commands/${dir}/`).filter((f) =>
      f.endsWith(".js"),
    );
    for (const file of commandFiles) {
      count++;
      const command = require(`../commands/${dir}/${file}`);
      client.commands.set(command.name, command);
    }
  });
  client.log(`Loaded ${count} Command/(s)`, "cmd");
};
