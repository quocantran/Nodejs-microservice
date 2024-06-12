const amqp = require("amqplib");

const runConsumer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, { durable: true });

    //send messages to consumer channel
    channel.consume(
      queueName,
      (message) => {
        console.log(`Consumer: ${message.content.toString()}`);
      },
      {
        noAck: true,
      }
    );

    console.log(`Producer: ${messages}`);
  } catch (err) {}
};

runConsumer().catch((err) => console.log(err));
