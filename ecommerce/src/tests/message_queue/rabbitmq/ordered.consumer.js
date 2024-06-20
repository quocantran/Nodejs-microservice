const amqp = require("amqplib");

const consumerOrderedMessage = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queueName = "orderedQueue";

  await channel.assertQueue(queueName, { durable: true });

  //set prefetch to 1 to ensure only one message is consumed at a time
  channel.prefetch(1);

  await channel.consume(queueName, (message) => {
    const messageContent = message.content.toString();

    setTimeout(() => {
      console.log(`Consumer: ${messageContent}`);
      channel.ack(message);
    }, Math.random() * 1000);
  });
};

consumerOrderedMessage().catch((err) => console.log(err));
