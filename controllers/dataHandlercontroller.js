const Account = require("../models/Account.js");
const Log = require("../models/Log.js");
const dataQueue = require("../queue/dataQueue.js");
const { v4: uuidv4 } = require('uuid');


exports.handleIncomingData = async (req, res) => {
  try {
    const token = req.header("CL-X-TOKEN");
    const eventId = req.header("CL-X-EVENT-ID") || uuidv4();  ;
    const receivedData = req.body;

    if (!token || !eventId) {
      return res.status(400).json({ success: false, message: "Missing headers" });
    }

    const account = await Account.findOne({ app_secret_token: token });
    if (!account) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const existingLog = await Log.findOne({ event_id: eventId });
    if (existingLog) {
      return res.status(400).json({ success: false, message: "Duplicate event_id" });
    }

    const log = await Log.create({
      event_id: eventId,
      account_id: account._id,
      received_timestamp: new Date(),
      received_data: receivedData,
      status: "pending"
    });

    await dataQueue.add({
      logId: log._id,
      accountId: account._id,
      data: receivedData
    });

    next()
  } catch (error) {
    console.error("Incoming Data Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};