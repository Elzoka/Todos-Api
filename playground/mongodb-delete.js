const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017", (err, client) => {
  if(err){
    return console.log("Unable to connect to mongodb server");
  }
  console.log("Connnected to mongodb server");

  const db = client.db("Todos");

  // db.collection("Users").deleteMany({name: "ahmed"}, (err, result) => {
  //   console.log(result);
  // });

  db.collection("Users").findOneAndDelete({_id: new ObjectID("5a99c3a01a95880a44d95411")}, (err, result) => {
    console.log(result);
  });
  client.close();
});
