// workers/rabbitWorker.js
const { consumeRabbitQueue } = require("../queue/dataQueue.js");
const Destination = require("../models/Destination.js");
const Log = require("../models/Log.js");
const axios = require("axios");

consumeRabbitQueue(async (job) => {
  const { logId, accountId, data } = job;

  try {
    const destinations = await Destination.find({ account_id: accountId });

    for (let dest of destinations) {
      await axios({
        method: dest.http_method,
        url: dest.url,
        headers: dest.headers,
        data,
      });
    }

    await Log.findByIdAndUpdate(logId, { status: "success", processed_timestamp: new Date() });
  } catch (err) {
    await Log.findByIdAndUpdate(logId, { status: "failed" });
  }
});
