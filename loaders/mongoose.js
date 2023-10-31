/** @format */

const mongoose = require('mongoose');

module.exports = async (client) => {
  const dbOptions = {
    useNewUrlParser: true,
    autoIndex: false,
    connectTimeoutMS: 5000,
    family: 4,
    useUnifiedTopology: true,
  };
  mongoose.set('strictQuery', true);
  mongoose.Promise = global.Promise;

  if (!client.config.links.mongoURI)
    return client.log(
      `Mongoose not loaded !!! No valid Mongo URI provided !!`,
      `error`,
    );
  mongoose.connect(client.config.links.mongoURI, dbOptions).catch((e) => {
    client.log(`Mongoose connection error ${e}`, 'error');
  });
  mongoose.connection.on('connected', () => {
    client.log(`Mongoose connection established`, 'database');
  });
  mongoose.connection.on('err', (err) => {
    client.log(`Mongoose connection error \n ${err.stack}`, 'error');
  });
  mongoose.connection.on('disconnected', () => {
    client.log(`Mongoose connection terminated`, 'error');
  });
};
