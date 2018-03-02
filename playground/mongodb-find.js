const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017", (err, client) => {
  if(err){
    return console.log("Unable to connect to mongodb server");
  }
  console.log("Connnected to mongodb server");

  const db = client.db("Todos");

  db.collection("Users").find({name: "Mahmoud"}).count((err, count) => {
    console.log(count);
  });
  client.close();
});
