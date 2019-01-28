$(document).ready(() => {
  $(".titleBar nav .login").addClass("selected");
  $(".loginform .loading").hide();
});

$("form.loginform").submit(function(e) {
  e.preventDefault();
  let waitingWords = new ganTalk($("#submit span"));
  waitingWords.update();
  setInterval(() => waitingWords.update(), 2000);
  $(".loginform .loading").show();
  $("#submit").prop("disabled", true);
  postForm("/users/login")
    .then(data => {
      $("#message").removeClass();
      if (data.status === "ok") {
        $("#message").addClass("text-success");
        $("#message").text(data.msg);
        gtag("event", "login", { method: "elearning" });
        window.location = "/users/mycourse";
      } else {
        $("#message").addClass("text-danger");
        $("#message").text(data.msg);
      }
    })
    .catch(error => {
      $("#message").removeClass();
      $("#message").addClass("text-danger");
      $("#message").text(error.message);
    })
    .finally(() => {
      for (var i = 1; i < 99999; i++) window.clearInterval(i);
      $("#submit span").text("開始爬課");
      $("#submit").prop("disabled", false);
      $(".loginform .loading").hide();
    });
  //$(this).removeClass("btn-primary");
  //$(this).addClass("btn-warning");
});

class ganTalk {
  constructor(_container) {
    this.container = _container;
    this.words = [
      "等一下哦",
      "小精靈們正在努力整理你的課表",
      "他們真的很辛苦",
      "不但是廉價勞工",
      "而且過年還不能回家",
      "幫小精靈QQ"
    ];
    this.index = 0;
  }
  update() {
    $(this.container).text(this.words[this.index]);
    this.index = (this.index + 1) % this.words.length;
  }
}
function postForm(url) {
  const formData = JSON.stringify({
    sid: $("#sid").val(),
    pw: $("#pw").val()
  });

  return fetch(url, {
    method: "POST",
    credentials: "same-origin",
    body: formData,
    headers: new Headers({
      "Content-Type": "application/json"
    })
  }).then(r => {
    if (r.ok) {
      return r.json();
    }
    throw new Error(`${r.statusText} (${r.status})`);
  });
}
