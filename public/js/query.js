function init() {
  $(".selType a").each(function() {
    $(this).click(function() {
      if ($("#typeSelBtn").data("value") === $(this).data("code")) return;
      $("#typeSelBtn").text($(this).text());
      $("#typeSelBtn").data("value", $(this).data("code"));
      $("#targetSelBtn").text("全部班級");
      $("#targetSelBtn").data("value", "all");
      fetchTarget($(this).data("code"));
      fetchResult(
        $("#typeSelBtn").data("value"),
        $("#targetSelBtn").data("value")
      );
    });
  });

  $(".query .loading").hide();
  if (typeof Homepage === "undefined")
    $(".titleBar .allCourses").addClass("selected");
}
init();

function fetchTarget(type) {
  fetch(`/api/target/${type}`)
    .then(r => {
      if (r.ok) {
        return r.json();
      }
      throw new Error(`${r.statusText} (${r.status})`);
    })
    .then(d => {
      $(".selTarget .dropdown-menu").html("");
      $("#targetSelBtn").text("全部班級");
      $("#targetSelBtn").data("value", "all");
      let newA = document.createElement("a");
      $(newA).addClass("dropdown-item");
      $(newA).data("code", "all");
      $(newA).text("全部班級");
      $(".selTarget .dropdown-menu").append(newA);
      d.forEach(e => {
        let newA = document.createElement("a");
        $(newA).addClass("dropdown-item");
        $(newA).text(e);
        $(newA).data("code", e);
        $(".selTarget .dropdown-menu").append(newA);
      });
      $(".selTarget .dropdown-menu a").each(function() {
        $(this).click(function() {
          if ($("#targetSelBtn").data("value") === $(this).data("code")) return;
          $("#targetSelBtn").text($(this).text());
          $("#targetSelBtn").data("value", $(this).data("code"));
          fetchResult(
            $("#typeSelBtn").data("value"),
            $("#targetSelBtn").data("value")
          );
        });
      });
    });
}

function fetchResult(type, target) {
  $(".query .loading").show();
  $(".query .result").slideUp(200, () => {
    fetch(`/api/courses/${type}/${target}`)
      .then(r => {
        if (r.ok) {
          return r.json();
        }
        throw new Error(`${r.statusText} (${r.status})`);
      })
      .then(d => {
        hideAllTooltip();
        $(".query .result").html("");
        d.forEach(e => {
          let detailUrl = `https://course.nuk.edu.tw/QueryCourse/tcontent.asp?
              OpenYear=107&Helf=2&Sclass=${e.dept}&Cono=${e.id}`.replace(
            /[\s\t\n]/g,
            ""
          );
          const weekdays=['', '一', '二', '三', '四', '五'];
          e.time = e.time.map(x=>`${weekdays[x[0]]}${x[1]}`);
          let detail = `
                <h5 class="classID">${e.dept + e.id}</h5>
                <p class="className">${e.name}</p>
                <p class="teacher">教授: ${e.teacher}</p>
                <p class="time">上課時間: ${e.time.join(', ')}</p>
                <p class="location">上課地點: ${e.location}</p>
                <p class="${e.compulsory ? "compulsory" : "choose"}">
                  ${e.compulsory ? "必修" : "選修"} ${e.point} 學分
                </p>
                <p><a href="${detailUrl}"  target="_blank">
                  原始課程資料 <i class="fas fa-external-link-alt"></i>
                </a></p>
          `;
          let content = `
              <a class="resultCard" data-toggle="tooltip" data-html="true" title='${detail}'>
                <span class="classID">${e.dept + e.id}</span>
                <span class="className">${e.name}</span>
                <span class="teacher">${e.teacher}</span>
                <span class="location">上課地點:${e.location}</span>
                <span class="${e.compulsory ? "compulsory" : "choose"}">
                  ${e.point}學分
                </span>
              </a>`;
          $(".query .result").append(content);
        });
      })
      .catch(error => {
        $(".query .result").html(`
                <div class="resultCard first">    
                    <i class="fas fa-exclamation-triangle"></i>    
                    取得資料錯誤:${error.message}
                </div>`);
      })
      .finally(() => {
        $('[data-toggle="tooltip"]').tooltip({ html: true, trigger: "manual" });
        $('[data-toggle="tooltip"]').each(function() {
          //防止Body的click事件把tooltip清掉
          // $(this).click(function(e) {
          //   e.stopPropagation();
          // });
          //等價於Desktop上的hover, mobile上的click
          $(this).mouseenter(function(e) {
            let that = this;
            $('[data-toggle="tooltip"]').each(function() {
              if (this != that) {
                $(this).tooltip("hide");
              }
            });
            $(this).tooltip("show");
          });
        });
        $(".query .result").slideDown(200);
        $(".query .loading").hide();
        //gtag("event", "search", { search_term: `${type}/${target}` });
      });
  });
}

// $("body").click(function() {
//   hideAllTooltip();
// });

$(".result").mouseleave(function() {
  hideAllTooltip();
});

function hideAllTooltip(){
  $('[data-toggle="tooltip"]').each(function() {
    $(this).tooltip("hide");
  });
}