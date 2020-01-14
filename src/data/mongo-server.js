const MongoClient = require('mongodb').MongoClient;

(async function() {
  const url = process.env.MongoClient || 'mongodb://localhost:27017/Tempranon';

  const dbName = 'Tempranon';
  const client = new MongoClient(url, { useNewUrlParser: true });

  try {
    await client.connect();

    const db = client.db(dbName);
    console.log('succesfuly conected');
    const collection = db.collection('users');
    await collection.find({}, { pin: 1, _id: 0 }).toArray(function(error, doc) {
      if (error) {
        console.log(error);
      }
      console.log(doc);
    });
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
})();
