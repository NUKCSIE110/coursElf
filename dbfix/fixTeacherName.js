require("dotenv").load({ path: "../.env" });
const courseModel = require("../models/courseModel");

let fixs = [
  { from: /童士��/g, to: "童士恒" },
  { from: /康�Y銘/g, to: "康倈銘" },
  { from: /黃�~蔚/g, to: "黃冸蔚" },
  { from: /王�痗�/g, to: "王恒隆" }
];

(async () => {
  for (fix of fixs) {
    let result = await courseModel.find({ teacher: fix.from });
    console.log(result);
    for (i of result) {
      console.log(i);
      i.teacher = i.teacher.replace(fix.from, fix.to);
      console.log(i.teacher);
      await i.save();
      console.log(fix.to);
    }
  }
  console.log("done");
})();
