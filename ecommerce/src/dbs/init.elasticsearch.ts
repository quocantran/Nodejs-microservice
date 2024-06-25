"use strict";

import { Client } from "@elastic/elasticsearch";

interface RedisClientInstance {
  instanceConnect: Client;
}

let clients: RedisClientInstance = {
  instanceConnect: {} as Client,
};

const handleEventConnect = async (connectionElastic: Client) => {
  try {
    await connectionElastic.ping();
    console.log("Elasticsearch connected");
  } catch (e) {
    console.log("Elasticsearch error: ", e);
  }
};

const initElasticsearch = ({
  ELASTICSEARCH_IS_ENABLED = true,
  ELASTICSEARCH_HOST = "http://localhost:9200",
}) => {
  if (!ELASTICSEARCH_IS_ENABLED) {
    return;
  }
  const client = new Client({
    node: ELASTICSEARCH_HOST,
  });
  clients.instanceConnect = client;
  handleEventConnect(client);
};

const getClients = () => {
  return clients;
};

export { initElasticsearch, getClients };
