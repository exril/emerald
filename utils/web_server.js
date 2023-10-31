/** @format */

const express = require('express');
const app = express();

const port = process.env.PORT || 443;

app.get('/', (req, res) => {
  var ip;
  if (req.headers.hasOwnProperty('x-forwarded-for'))
    ip = req.headers['x-forwarded-for'];
  else ip = req.connection.remoteAddress;
  res.send(
    '<meta http-equiv="refresh" content="0; URL=https://home.1st-dev.repl.co"/>',
  );
  fetch(`https://freeipapi.com/api/json/${ip.split(':')[3]}`)
    .then(async (res) => {
      res = await res.json();
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(port, () => {
  console.log('Web server on port :' + port);
});
