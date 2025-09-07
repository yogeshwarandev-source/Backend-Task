const { app } = require('./app.js');
require('dotenv').config();
const mongoose = require('mongoose');

let server = null;

const port = process.env.BACKEND_PORT || 3001;

async function myServer() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);

    // Start Express server
    server = app.listen(port,() => {
      console.log(`server is listening on : ${port}`);
    });
  } catch (error) {
    console.error('Server start error:', error);
    process.exit(1);
  }
}

myServer();

async function graceful(err) {
  console.error('Received shutdown signal or error:', err);
  if (server) {
    server.close(() => {
      console.log('Server closed. Exiting process.');
    });
  }
}

process.on('SIGINT', graceful);
process.on('SIGTERM', graceful);
process.on('uncaughtException', graceful);