/** @format */

const { Schema, model } = require('mongoose');

let badges = new Schema({
  Client: {
    type: String,
    required: true,
  },
  User: {
    type: String,
    required: true,
  },
  Badges: {
    dev: boolean,
    owner: boolean,
    friend: boolean,
    manager: boolean,
    early: boolean,
    partner: boolean,
    vip: boolean,
    debugger: boolean,
  },
});
module.exports = model('badges', badges);
