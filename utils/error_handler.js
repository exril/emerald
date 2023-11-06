/** @format */

module.exports = (client) => {
  client.log(`Anti-Crash loading successful`, "ready");

  process.on("error", (...args) => {
    client.log(`error ${args}`, "error");
    console.log(...args);
  });
  process.on("warning", (...args) => {
    if (`${args}`.toLowerCase().includes("deprecation")) return;
    client.log(`warning ${args}`, "warn");
    console.log(...args);
  });
  process.on("unhandledRejection", (...args) => {
    client.log(`unhandledRejection ${args}`, "warn");
    console.log(...args);
  });
  process.on("uncaughtException", (...args) => {
    client.log(`uncaughtException ${args}`, "warn");
    console.log(...args);
  });
};
