let classify_rules = {
  common: {
    rule: x => /^GR.+/.test(x[0]),
    chinese: x => /^中文.+/.test(x[1]),
    english: x => /^英語會話與閱讀.+/.test(x[1])
  },
  cc: x => x[0].match(/^CC.+/),
  by: {
    rule: x => /^(LI|SC|SO)/.test(x[0]),
    li: x => /^LI.+/.test(x[0]),
    sc: x => /^SC.+/.test(x[0]),
    so: x => /^SO.+/.test(x[0])
  },
  dept: {
    rule: x => new RegExp(`^${dept[0]}.+`).test(x[0]),
    compulsory: x => x[4],
    choose: x => !x[4]
  }
};

let dept = []; //Remain uninitialize

//把課程結構化
let parseRules = (courses, rules) => {
  //Filter to target condition
  let sub_courses = [];
  if (typeof rules["rule"] === "function") {
    sub_courses = courses.filter(rules["rule"]);
  } else {
    sub_courses = courses;
  }

  let rtVal = {};
  let other = sub_courses;
  for (let name in rules) {
    let rule = () => {};

    if (name === "rule") continue;

    if (typeof rules[name] === "function") {
      rtVal[name] = sub_courses.filter(rules[name]);
      rule = rules[name];
    } else if (typeof rules[name] === "object") {
      rtVal[name] = parseRules(sub_courses, rules[name]);
      rule = rules[name]["rule"];
    }

    //Take complement
    other = other.filter(x => !rule(x));
  }

  rtVal["other"] = other;

  return rtVal;
};

//結構化成績計算
let calcPoint = course => {
  let rtVal = {};
  if (course.constructor === Array) {
    rtVal = course.reduce((acc, e) => (acc += parseFloat(e[2])), 0);
  } else {
    let total = 0;
    for (let name in course) {
      let sumSubElement = calcPoint(course[name]);
      if (typeof sumSubElement === "number") {
        total += sumSubElement;
      } else {
        total += sumSubElement.p;
      }
      rtVal[name] = sumSubElement;
    }
    rtVal["p"] = total;
  }
  return rtVal;
};

let classfier = function(my_courses, sid_dept) {
  dept = sid_dept; //Initialize global varible
  let passed = my_courses.filter(x => x[3] >= 60);

  let doneCourse = parseRules(passed, classify_rules);
  let donePoint = calcPoint(doneCourse);

  //未送成績和棄選的
  let uncommitCourse = my_courses.filter(x => x[3] === "未送");
  let failedCourse = my_courses.filter(x => x[3] < 60);

  return { doneCourse, donePoint, uncommitCourse, failedCourse };
};

module.exports = classfier;
