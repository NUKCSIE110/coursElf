require("should");
let deptTable = require("../data/dept.json");
let classifier = require("../routes/util/courseClassfier");

describe("Course classifier", () => {
  let dept = deptTable[55];
  it("Basic layout", () => {
    let result = classifier([], dept);
    result.should.has.keys(
      "doneCourse",
      "donePoint",
      "uncommitCourse",
      "failedCourse"
    );
  });
  it("中文", () => {
    let course = [["GR5302", "中文(下)", "2", "63", true]];
    let result = classifier(course, dept);
    should(result.doneCourse.common.chinese[0]).be.equal(course[0]);
  });
  it("英文", () => {
    let course = [["GRA0B7", "英語會話與閱讀(上)：中階班", "2", "84", true]];
    let result = classifier(course, dept);
    should(result.doneCourse.common.english[0]).be.equal(course[0]);
  });
  it("體育", () => {
    let course = [["GRSA32", "體育(三)-羽球B", "0", "60", true]];
    let result = classifier(course, dept);
    should(result.doneCourse.common.other[0]).be.equal(course[0]);
  });
  
  it("核心通識 - 科學素養", () => {
    let course = [["CCC544", "科技與社會", "3", "60", false]];
    let result = classifier(course, dept);
    should(result.doneCourse.cc.science[0]).be.equal(course[0]);
  });
  it("核心通識 - 倫理素養", () => {
    let course = [["CCC681", "科技與工程倫理", "3", "60", false]];
    let result = classifier(course, dept);
    should(result.doneCourse.cc.ethics[0]).be.equal(course[0]);
  });
  it("核心通識 - 思維方法", () => {
    let course = [["CCI122", "哲學基本問題", "3", "60", false]];
    let result = classifier(course, dept);
    should(result.doneCourse.cc.thinking[0]).be.equal(course[0]);
  });
  it("核心通識 - 美學素養", () => {
    let course = [["CCI251", "台灣藝術史", "3", "60", false]];
    let result = classifier(course, dept);
    should(result.doneCourse.cc.aesthetics[0]).be.equal(course[0]);
  });
  it("核心通識 - 公民素養", () => {
    let course = [["CCO363", "媒體識讀與公民參與", "3", "60", false]];
    let result = classifier(course, dept);
    should(result.doneCourse.cc.civil[0]).be.equal(course[0]);
  });
  it("核心通識 - 文化素養", () => {
    let course = [["CCO414", "全球化與多元文化", "3", "60", false]];
    let result = classifier(course, dept);
    should(result.doneCourse.cc.culture[0]).be.equal(course[0]);
  });

  it("博雅通識 - 人文科學", () => {
    let course = [["LIA436", "中國古典詩詞選讀", "3", "60", false]];
    let result = classifier(course, dept);
    should(result.doneCourse.by.humanities[0]).be.equal(course[0]);
  });
  it("博雅通識 - 自然科學", () => {
    let course = [["SCA621", "人類生殖探秘", "2", "60", false]];
    let result = classifier(course, dept);
    should(result.doneCourse.by.science[0]).be.equal(course[0]);
  });
  it("博雅通識 - 社會科學", () => {
    let course = [["SOA686", "交通事故鑑定法規與案例解說", "2", "60", false]];
    let result = classifier(course, dept);
    should(result.doneCourse.by.society[0]).be.equal(course[0]);
  });

  it("系必修", () => {
    let course = [["CSA07B", "程式設計與實習（二）", "2", "78", true]];
    let result = classifier(course, dept);
    should(result.doneCourse.dept.compulsory[0]).be.equal(course[0]);
  });
  it("系選修", () => {
    let course = [["CSF664", "即時計算機系統", "3", "68", false]];
    let result = classifier(course, dept);
    should(result.doneCourse.dept.choose[0]).be.equal(course[0]);
  });
  it("其他", () => {
    let course = [["IMD562", "Java Script 前端應用程式設計", "3", "87", true]];
    let result = classifier(course, dept);
    should(result.doneCourse.other[0]).be.equal(course[0]);
  });

  it("未送成績", () => {
    let course = [["IMD562", "Java Script 前端應用程式設計", "3", "未送", true]];
    let result = classifier(course, dept);
    should(result.uncommitCourse[0]).be.equal(course[0]);
  });
  it("未通過", () => {
    let course = [["IMD562", "Java Script 前端應用程式設計", "3", "59.9", true]];
    let result = classifier(course, dept);
    should(result.failedCourse[0]).be.equal(course[0]);
  });

});
