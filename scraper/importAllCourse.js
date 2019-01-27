require("dotenv").load({ path: "../.env" });
let allCourse = require("./AllCourse.json");
const courseModel = require("../models/courseModel");

//DO NOT execute it twice

let counter = 0;

courseModel.remove({}, () => {
  console.log("Remove succeed");
});
allCourse.forEach(e => {
  let newCourse = new courseModel(e);
  newCourse.save().then(() => console.log(`${++counter} Succeed`));
});
