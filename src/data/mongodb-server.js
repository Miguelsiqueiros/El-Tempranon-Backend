const MongoClient = require('mongodb').MongoClient;
const data = require('./users.json')

const url = "mongodb+srv://tempranonDB:<yVMIYnInqyxNIcdg>@clustertempranon-2opbs.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "TempranonDB";

async function main() {

  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  client.connect(err => {

    try {
      results = client.db(dbName).collection('users').insertMany(data);

      console.log(results);

    } catch (error) {
      console.log(error)
    } finally {
      client.close();
    }
  });
}

main();