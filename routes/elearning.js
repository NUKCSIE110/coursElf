var querystring = require("querystring");
var https = require("https");

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
          'Content-Length': postData.length
        }
      };
      var req = https.request(options, res => {
        if(res.statusCode===302 && res.headers.location.search("ERR")===-1){
            resolve(sid);
        }else{
            reject({'message': 'login failed'});
        }
      });

      req.on("error", e => {
          reject(e);
      });

      req.write(postData);
      req.end();
    });
  }
};

module.exports = elearningLogin;
