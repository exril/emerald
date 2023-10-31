/** @format */

require('dotenv').config();
require('module-alias/register');
console.log('Launcher started . /_\\./_-.//.');

console.log(`
▒█▀▀▀ ▒█▀▄▀█ ▒█▀▀▀ ▒█▀▀█ ░█▀▀█ ▒█░░░ ▒█▀▀▄ 
▒█▀▀▀ ▒█▒█▒█ ▒█▀▀▀ ▒█▄▄▀ ▒█▄▄█ ▒█░░░ ▒█░▒█ 
▒█▄▄▄ ▒█░░▒█ ▒█▄▄▄ ▒█░▒█ ▒█░▒█ ▒█▄▄█ ▒█▄▄▀
`);
require('./sharder.js');
require('@utils/web_server.js');
