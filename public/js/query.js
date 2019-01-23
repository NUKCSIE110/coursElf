function init(){
  console.log('a')
  $(".selType a").each(function() {
    console.log($(this));
    $(this).click(function() {
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
};
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
      $(".selTarget .dropdown-menu").html('');
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
        $(".query .result").html("");
        d.forEach(e => {
          let content = `
              <div class="resultCard">
                <span class="classID">${e.dept + e.id}</span>
                <span class="className">${e.name}</span>
                <span class="teacher">${e.teacher}</span>
                <span class="location">上課地點:${e.location}</span>
                <span class="${e.compulsory ? "compulsory" : "choose"}">${
            e.point
          }學分</span>
              </div>`;
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
        $(".query .result").slideDown(200);
        $(".query .loading").hide();
      });
  });
}
