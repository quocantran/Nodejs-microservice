"use strict";

import MessageService from "./src/services/consumerQueue.service";

const queueName = "test-topic";
// MessageService.consumerToQueue(queueName)
//   .then(() => {
//     console.log("Consumer is running");
//   })
//   .catch((err) => console.log(err));

MessageService.consumerToQueueError(queueName);
MessageService.consumerToQueueSuccess(queueName);
