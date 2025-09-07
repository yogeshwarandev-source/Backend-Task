// queue/rabbitmq.js
const amqp = require("amqplib");

let channel;
const queueName = "data-processing";

async function connectRabbit() {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
}

async function addToRabbitQueue(job) {
  if (!channel) await connectRabbit();
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(job)), { persistent: true });
  console.log("Job added to RabbitMQ:", job);
}

async function consumeRabbitQueue(callback) {
  if (!channel) await connectRabbit();
  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      const job = JSON.parse(msg.content.toString());
      callback(job);
      channel.ack(msg);
    }
  });
}

module.exports = { addToRabbitQueue, consumeRabbitQueue };
