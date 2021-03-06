// Mongoose
const mongoose = require("mongoose");
const password = require("./password.js");

// Definicion conexion BBDD en mongo atlas
const connectionString = `mongodb+srv://CodersTeam:${password}@cluster0.37gt5.mongodb.net/Game?retryWrites=true&w=majority`;

// Conexion a mongoDB con mongoose
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Conexion correcta a BBDD mongo");
  })
  .catch((err) => {
    console.error(err);
  });

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
