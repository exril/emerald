/** @format */

const { readdirSync } = require("fs");

module.exports = async (client) => {
  let count = 0;
  readdirSync("./slashCommands").forEach((dir) => {
    const commandFiles = readdirSync(`./slashCommands/${dir}/`).filter((f) =>
      f.endsWith(".js"),
    );
    for (const file of commandFiles) {
      count++;
      const command = require(`../slashCommands/${dir}/${file}`);
      if (command.name.length > 3)
        return client.log(
          `[${command.name}] - Command name is too long, skipping this command`,
          "warn",
        );
      client.slashCommands.set(command.name, command);
    }
  });
  client.log(`Loaded ${count} slash Command/(s)`, "cmd");
};
