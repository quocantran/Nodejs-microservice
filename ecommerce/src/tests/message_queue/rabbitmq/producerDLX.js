const amqp = require("amqplib");
const message = "new product";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const notiExchange = "notiExchange";
    const notiQueue = "notiQueue";
    const notiDLX = "notiDLX";
    const notiRoutingKey = "notiRoutingKey";

    await channel.assertExchange(notiExchange, "direct", { durable: true });

    const result = await channel.assertQueue(notiQueue, {
      durable: true,
      exclusive: false,
      deadLetterExchange: notiDLX,
      deadLetterRoutingKey: notiRoutingKey,
    });
    await channel.bindQueue(result.queue, notiExchange, notiRoutingKey);

    channel.sendToQueue(result.queue, Buffer.from(message), {
      expiration: "5000",
    });
    console.log("send message to queue");
  } catch (err) {
    console.log(err);
  }
};

runProducer().catch((err) => console.log(err));
