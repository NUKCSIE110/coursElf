var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose
  .connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PW}@${
      process.env.DB_LOC
    }`,
    { useNewUrlParser: true }
  )
  .then(
    () => {
      console.log("Connect succeed");
    },
    err => {
      console.log(err);
    }
  );

var userSchema = new mongoose.Schema({
  dept: String,
  id: String,
  target: String,
  name: String,
  point: String,
  compulsory: Boolean,
  teacher: String,
  location: String,
  time: Array,
  limit: Array
});
let model = mongoose.model("course", userSchema);

module.exports = model;
