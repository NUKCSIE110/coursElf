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
  sid: String,
  courses: Array,
  wishList: Array
});
let model = mongoose.model("user", userSchema);

module.exports = model;
