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
  $(document).ready(() => {
    if (typeof Homepage === "undefined")
      $(".titleBar .allCourses").addClass("selected");
  }, 10);
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
      Object.keys(d).forEach(e => {
        let newA = document.createElement("a");
        $(newA).addClass("dropdown-item");
        $(newA).text(d[e]);
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
          e.time = e.time.map(x => `${x[0]}${x[1]}`);
          let detail = `
                <h5 class="classID">${e.dept + e.id}</h5>
                <p class="className">${e.name}</p>
                <p class="teacher">教授: ${e.teacher}</p>
                <p class="time">上課時間: ${e.time.join(", ")}</p>
                <p class="location">上課地點: ${e.location}</p>
                <p class="${e.compulsory ? "compulsory" : "choose"}">
                  ${e.compulsory ? "必修" : "選修"} ${e.point} 學分
                </p>
                <p><a href="${e.detailUrl}"  target="_blank">
                  原始課程資料 <i class="fas fa-external-link-alt"></i>
                </a></p>
          `;
          let content = `
              <a class="resultCard"
                data-class-type="${e.dept}" data-class-id="${e.id}"
                data-toggle="tooltip" data-html="true" title='${detail}'>
                <span class="classID">${e.dept + e.id}</span>
                <span class="className">${e.name}</span>
                <span class="teacher">${e.teacher}</span>
                <span class="time">${e.time.join(",")}</span>
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
          //等價於Desktop上的hover, mobile上的click
          $(this).mouseenter(function(e) {
            hideAllTooltip();
            $(this).tooltip("show");
            $(this).addClass("clicked");
            gtag("event", $(this).data("classType"), {
              event_category: "show_detail",
              event_label: $(this).data("classId")
            });

            setTimeout(
              function() {
                $(this).on("click", function() {
                  $(this).tooltip("toggle");
                  $(this).toggleClass("clicked");
                });
              }.bind(this),
              100
            );
          });
        });
        $(".query .result").slideDown(200);
        $(".query .loading").hide();
        gtag("event", "search", {
          search_term: `${type} ${target}`
        });
      });
  });
}

$(".result").mouseleave(function(event) {
  let resultBox = $(".result")[0].getBoundingClientRect();
  let el = document.elementFromPoint(event.screenX, event.screenY);
  if (
    event.pageX < resultBox.right +window.scrollX &&
    event.pageX > resultBox.left + window.screenX &&
    event.pageY < resultBox.bottom + window.scrollY &&
    event.pageY > retultBox.top + window.screenY
  )
    return;
  hideAllTooltip();
});

function hideAllTooltip() {
  $('[data-toggle="tooltip"]').each(function() {
    $(this).off("click");
    $(this).tooltip("hide");
    $(this).removeClass("clicked");
  });
}
