$(document).ready(() => {
  $(".titleBar nav .login").addClass("selected");
  $(".loginform .loading").hide();
});

$("#submit").click(function() {
  for (var i = 1; i < 99999; i++) window.clearInterval(i);
  let waitingWords = new ganTalk($("#submit span"));
  waitingWords.update();
  setInterval(() => waitingWords.update(), 2000);
  $(".loginform .loading").show();
  $(this).attr('disabled','');
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
