const { Client } = require("@elastic/elasticsearch");

const esClient = new Client({
  node: "http://localhost:9200",
});

const queryData = {
  query: {
    match_all: {},
  },
  from: 0,
  size: 1,
};

const searchDocument = async (idxName, payload) => {
  const res = await esClient.search({
    index: idxName,
    body: payload,
  });

  console.log("Search:::", res?.body?.hits?.hits);
};

const createIdx = async (idxName) => {
  const res = await esClient.indices.create({
    index: idxName,
  });

  console.log("Create:::", res);
};

const addDocument = async (idxName, docType, payload) => {
  const res = await esClient.index({
    index: idxName,
    type: docType,
    body: payload,
  });

  console.log("Add:::", res);
};

const createIndexWithMapping = async (indexName) => {
  try {
    // Kiểm tra xem index đã tồn tại chưa
    const indexExists = await esClient.indices.exists({ index: indexName });
    if (indexExists.body) {
      console.log(`Index ${indexName} already exists.`);
      return;
    }

    // Tạo index mới với mapping
    await esClient.indices.create({
      index: indexName,
      body: {
        mappings: {
          properties: {
            title: { type: "text" },
            description: { type: "text" },
            date: { type: "date" },
            // Thêm các trường và kiểu dữ liệu tùy ý
          },
        },
      },
    });

    console.log(`Index ${indexName} created with mapping.`);
  } catch (error) {
    console.error("Error creating index:", error);
  }
};

const bulkItems = [
  // Thao tác đầu tiên: index một document
  { index: { _index: "sport" } },
  {
    name: "Tennis",
    players: 2,
  },
  // Thao tác thứ hai: index một document khác
  { index: { _index: "sport" } },
  {
    name: "Basketball",
    players: 5,
  },
];

const bulkInsert = async (idxName, payload) => {
  try {
    const res = await esClient.bulk({
      index: idxName,
      body: payload,
    });

    console.log("Bulk insert:::", res);
  } catch (error) {
    console.error("Error in bulk insert:", error);
  }
};

searchDocument("sport", queryData).then((rs) => console.log(rs));
