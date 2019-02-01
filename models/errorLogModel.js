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

var errorLogSchema = new mongoose.Schema({
  time: Date,
  message: String,
  status: String,
  stack: String,
  session: Object
});
let model = mongoose.model("error", errorLogSchema);

module.exports = model;

