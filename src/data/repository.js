const { MongoClient } = require('mongodb');

function repo() {

    const url = "mongodb+srv://tempranonDB:<yVMIYnInqyxNIcdg>@clustertempranon-2opbs.mongodb.net/test?retryWrites=true&w=majority";
    const dbName = "TempranonDB";

    function loadData(data) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);

                results = await db.collection('users').insertMany(data);
                resolve(results);
                client.close();
            } catch (error) {
                reject(error)
            }
        })
    }

    return loadData

}

module.exports = repo();