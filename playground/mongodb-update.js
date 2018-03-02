const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017", (err, client) => {
  if(err){
    return console.log("Unable to connect to mongodb server");
  }
  console.log("Connnected to mongodb server");

  const db = client.db("Todos");

  db.collection("Users").findOneAndUpdate({_id: new ObjectID("5a99b8ba8f7eff320c71b637")},
  {
    $set: {
      name: "Ahmed"
    },
    $inc: {
      age: 1
    }
  },
  {
    returnOriginal: false
  }, (err, result) =>{
      console.log(result);
  })
  client.close();
});
