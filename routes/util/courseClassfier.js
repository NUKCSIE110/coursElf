//把課程結構化
let parseRules = (courses, rules) => {
  //Filter to target condition
  let sub_courses = [];
  if (typeof rules["premise"] === "function") {
    sub_courses = courses.filter(rules["premise"]);
  } else {
    sub_courses = courses; //Default premise
  }

  let rtVal = {};
  let other = sub_courses;
  for (let name in rules) {
    let rule = () => {};

    if (name === "premise") continue;

    if (typeof rules[name] === "function") {
      rtVal[name] = sub_courses.filter(rules[name]);
      rule = rules[name];
    } else if (typeof rules[name] === "object") {
      rtVal[name] = parseRules(sub_courses, rules[name]);
      rule = rules[name]["premise"];
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

let classfier = function(my_courses, dept) {
  let classify_rules = {
    done: {
      premise: x => x[3] >= 60,
      //共同必修
      common: {
        premise: x => /^GR.+/.test(x[0]),

        chinese: x => /^中文.+/.test(x[1]),
        english: x => /^英語會話與閱讀.+/.test(x[1])
      },

      //核心通識
      cc: {
        premise: x => /^CC.+/.test(x[0]),

        science: x => /^CCC5.+/.test(x[0]),
        ethics: x => /^CCC6.+/.test(x[0]),
        thinking: x => /^CCI1.+/.test(x[0]),
        aesthetics: x => /^CCI2.+/.test(x[0]),
        civil: x => /^CCO3.+/.test(x[0]),
        culture: x => /^CCO4.+/.test(x[0])
      },

      //博雅通識
      by: {
        premise: x => /^(LI|SC|SO)/.test(x[0]),

        humanities: x => /^LI.+/.test(x[0]),
        science: x => /^SC.+/.test(x[0]),
        society: x => /^SO.+/.test(x[0])
      },

      // 系必修/系選修
      dept: {
        premise: x => new RegExp(`^${dept[0]}.+`).test(x[0]),

        compulsory: x => x[4],
        choose: x => !x[4]
      }
    },
    //未送成績, 被當的和棄選的(other)
    uncommit: x => x[3] === "未送",
    //failed: x => x[3] < 60,
    //discard: x => x[3] === "棄選"
  };

  let course = parseRules(my_courses, classify_rules);
  let point = calcPoint(course);

  return { course, point };
};

module.exports = classfier;
