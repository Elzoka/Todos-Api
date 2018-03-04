const mongoose = require("./../server/db/mongoose");
const User = require("./../server/models/user");

User.findById("5a9b0c9f6f831e16fcae9aae").then(user => {
  if(!user){
    return console.log("User not found in the database");
  }
  console.log("user:", user);
}).catch(e => {
  console.log(e)
});
