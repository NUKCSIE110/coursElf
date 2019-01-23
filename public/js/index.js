const Homepage = true;
$(".titleBar .allCourses").click(function() {
  $(this).addClass("selected");
  $(".content").css("align-items", "flex-start");
  $("#timeline").hide();
  $(".query").show();
  window.history.pushState({}, "", "/query");
});

$(document).ready(function() {
  let width = 400;
  let height = 500;
  let draw = SVG("timeline").size(width, height);

  let lables = [
    { text: "第一階段開始", time: new Date("2019-01-28") },
    { text: "第一階段結束", time: new Date("2019-02-01") },
    { text: "第二階段開始", time: new Date("2019-02-11") },
    { text: "第二階段結束", time: new Date("2019-02-15") },
    { text: "加退選開始", time: new Date("2019-02-18") },
    { text: "加退選結束", time: new Date("2019-02-28") }
  ];
  let lineStart = 5;
  let lineEnd = height - 5;
  let centerLine = width / 2;
  let now = +Date.now();

  //Decided progress of line
  let threshold = -1 + (now - lables[0].time + 86400000 * 12) / (86400000 * 12);
  for (let i = 1; i < lables.length; i++) {
    if (now < +lables[i - 1].time) break;
    threshold =
      i -
      1 +
      (now - lables[i - 1].time) / (lables[i].time - lables[i - 1].time);
  }
  if (threshold == lables.length - 1) {
    threshold = lineEnd;
  } else {
    threshold =
      lineStart + ((threshold + 0.5) / lables.length) * (lineEnd - lineStart);
  }

  draw
    .line(centerLine, threshold, centerLine, lineEnd)
    .stroke({ color: "black", width: 5, linecap: "round" });
  draw
    .line(centerLine, lineStart, centerLine, threshold)
    .stroke({ color: "steelblue", width: 5, linecap: "round" });
  //Draw head
  if (threshold != lineEnd) {
    draw
      .circle(12)
      .fill("lightsteelblue")
      .center(centerLine, threshold)
      .animate(2000, "<>")
      .size(8)
      .loop(true, true);
  }

  //Draw lables
  for (let i = 0; i < lables.length; i++) {
    let offset =
      lineStart + ((i + 0.5) / lables.length) * (lineEnd - lineStart);
    let circle = draw.circle(30).fill("#fff");
    circle.stroke({
      color: now >= lables[i].time ? "steelblue" : "black",
      width: 4
    });
    circle.center(centerLine, offset);

    let text = draw.text(
      function(add) {
        add.tspan(
          `${lables[this].time.getMonth() + 1}/${lables[this].time.getDate()}`
        );
        add.tspan(`${lables[this].text}`).newLine();
      }.bind(i)
    );
    text
      .font({
        family: "Noto Sans TC",
        size: 25,
        anchor: "middle",
        leading: "1.5em"
      })
      .fill(now >= lables[i].time ? "#a0a0a0" : "black");
    text.move(centerLine + ((i % 2) * 2 - 1) * 100, offset - 40);
    //console.log(now-i.time)
  }

  //Attribute relatived to RWD
  $("#timeline svg").attr("viewBox", `0 0 ${width} ${height}`);
  $("#timeline svg").removeAttr("width");
  $("#timeline svg").removeAttr("height");
  $("#timeline svg").attr("preserveAspectRatio", "xMidYMid");
});
