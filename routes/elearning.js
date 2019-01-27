var querystring = require("querystring");
var https = require("https");
var { PythonShell } = require("python-shell");
var path = require("path");

var elearningLogin = {
  check: function(sid, pw) {
    return new Promise(function(resolve, reject) {
      let postData = querystring.stringify({
        logintype: "stu",
        seturl: "http://elearning.nuk.edu.tw/",
        CHKID: "9587",
        stuid: sid,
        stupw: pw
      });
      var options = {
        host: "stu.nuk.edu.tw",
        port: "443",
        path: "/GEC/login_at2.asp",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": postData.length
        }
      };
      var req = https.request(options, res => {
        if (
          res.statusCode === 302 &&
          res.headers.location.search("ERR") === -1
        ) {
          resolve(true);
        } else {
          reject({ message: "e平臺我說你打錯密碼了" });
        }
      });

      req.on("error", e => {
        reject({ message: "e平臺發生錯誤" });
      });

      req.write(postData);
      req.end();
    });
  },
  getDoneCourse: function(sid, pw) {
    return new Promise(function(resolve, reject) {
      let options = {
        mode: "text",
        pythonOptions: ["-u"], // get print results in real-time
        scriptPath: path.join(__dirname, "../scraper"),
        args: [sid, pw]
      };
      PythonShell.run("getDoneCourse.py", options, function(err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(results));
        }
      });
    });
  }
};

module.exports = elearningLogin;
