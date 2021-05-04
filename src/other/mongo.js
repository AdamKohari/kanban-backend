const { MongoClient } = require("mongodb");

async function initMongo() {
    try {
        const mongoUri = 'mongodb+srv://kohiadi:vanye-kanye@cluster0.e1nsi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
        const mongoClient = new MongoClient(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await mongoClient.connect();
        global.kanban = mongoClient.db('kanban_table');
    } 
    finally {}
}

exports.initMongo = initMongo;