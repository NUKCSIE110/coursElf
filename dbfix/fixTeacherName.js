require("dotenv").load({ path: "../.env" });
const courseModel = require("../models/courseModel");

let fixs = [
  { from: /^童士/, to: "童士恒", fixed: true },
  { from: /^康.+銘/, to: "康倈銘", fixed: true },
  { from: /^黃.+蔚/, to: "黃冸蔚", fixed: true },
  { from: /^王�痗�/, to: "王恒隆", fixed: true },
  { from: /^林順富楊文仁王�痗�高佑靈溫秋明葛孟杰黃永森陳彥澄楊佳寧黃重期鄭竣亦/, to: "林順富楊文仁王恒隆高佑靈溫秋明葛孟杰黃永森陳彥澄楊佳寧黃重期鄭竣亦", fixed: true }
];

(async () => {
  for (fix of fixs) {
    if (fix.fixed === true) continue;
    let result = await courseModel.find({ teacher: fix.from });
    console.log(result);
    for (i of result) {
      console.log(i);
      i.teacher = fix.to;
      await i.save();
      console.log(fix.to);
    }
  }
})();
