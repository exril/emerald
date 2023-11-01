/** @format */

module.exports = async (file_name) => {
  const archiver = require("dir-archiver");

  const ignored = [
    ".git",
    ".pm2",
    "logs",
    ".config",
    "npm-debug.log*",
    "yarn-debug.log*",
    "yarn-error.log*",
    "node_modules",
    ".npm",
    ".yarn-integrity",
    ".cache",
    ".vscode",
    "yarn.lock",
    ".yarn",
    "package-lock.json",
    "npm-shrinkwrap.json",
  ];
  const zipper = new archiver("./", file_name, false, ignored);
  await zipper.createZip();
};
