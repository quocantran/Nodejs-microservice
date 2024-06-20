const amqp = require("amqplib");

const consumerOrderedMessage = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queueName = "orderedQueue";

  await channel.assertQueue(queueName, { durable: true });

  for (let i = 0; i < 10; i++) {
    channel.sendToQueue(queueName, Buffer.from(`Message ${i}`), {
      persistent: true,
    });
  }

  setTimeout(() => {
    connection.close();
  }, 1000);
};

consumerOrderedMessage().catch((err) => console.log(err));
