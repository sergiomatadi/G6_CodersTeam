// Schema
// const {Schema, model} = require('mongoose')

const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    password: String,
    avatar: {},
  });
  
  // Modelo
  
  const User = mongoose.model("User", userSchema);

  // User.find({}).then(result => {
//   console.log(result)
//   mongoose.connection.close()
// });

// const user = new User({
//   id: "123",
//   name: "Jordi",
//   email: "jordi@gmail.com",
//   password: "1234",
//   avatar: {},
// });

// user
//   .save()
//   .then((result) => {
//     console.log(result);
//     mongoose.connection.close();
//   })
//   .catch((err) => {
//     console.error(err);
//   });

module.exports = User;