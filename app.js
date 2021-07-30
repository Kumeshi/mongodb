const Express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const {ObjectId} = require("mongodb");
const { response } = require("express");

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
app.put("/CustomerDetails/:id", (request, response) => {
    const update = collection.findOneAndUpdate({ _id: ObjectId(request.params.id) },
        { $set: request.body },
    )
    response.send(update)
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
app.delete("/CustomerDetails/:id",(request,response)=>{
    const dele = collection.deleteOne(
        { _id: ObjectId(request.params.id)})
        response.send(dele);
    })
