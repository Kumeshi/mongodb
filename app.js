const Express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const CONNECTION_URL = 'mongodb://127.0.0.1:27017';
const DATABASE_NAME = "Details";

var app = Express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
var database, collection;

app.listen(5000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if (error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("CustomerDetails");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});
app.put("/CustomerDetails", (request, response) => {
    let id = request.query.id;
    collection.findOneAndUpdate({ _id: id },
        { $set: request.body },
        { new: true, upsert: true, returnOriginal: false });
    response.status(200).send(true)
});

app.get("/CustomerDetails", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.post("/CustomerDetails", (request, response) => {
    collection.insertOne(request.body, (error, result) => {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});
