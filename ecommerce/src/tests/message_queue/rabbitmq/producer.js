const amqp = require("amqplib");

const messages = "hello world123";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, { durable: true });

    //send messages to consumer channel
    channel.sendToQueue(queueName, Buffer.from(messages));

    console.log(`Producer: ${messages}`);
  } catch (err) {}
};

runProducer().catch((err) => console.log(err));
