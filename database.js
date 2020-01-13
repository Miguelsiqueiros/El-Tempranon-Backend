const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://tempranonDB:<yVMIYnInqyxNIcdg>@clustertempranon-2opbs.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(err => {

  const conn = client.db("tempranonDB");

  // perform actions on the conn object

  client.close();
});

