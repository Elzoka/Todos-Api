const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017", (err, client) => {
  if(err){
    return console.log("Unable to connect to mongodb server");
  }
  console.log("Connnected to mongodb server");

  const db = client.db("Todos");
  //
  // db.collection("documents").insertMany([{
  //     text: "Something to do",
  //     completed: false
  //   }], (error, res) => {
  //   if(error){
  //     return console.log("Unable to insert to the database");
  //   }
  //   console.log(JSON.stringify(res.ops, undefined, 2));
  // });

  db.collection("Users").insertOne({
    name: "Mahmoud",
    age: 21,
    location: "Damnhour"
  }, (err, res) => {
    if(err){
      return console.log("Unable to add to the database");
    }
    console.log(JSON.stringify(res.ops, undefined, 2));
  });

  client.close();
});
