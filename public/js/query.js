$(document).ready(() => {
  $(".query a.dropdown-item").each(function(i) {
    $(this).click(function(e) {
      $(".query .dropdown button").text($(this).text());
    });
  });
  $(".query .selType a.dropdown-item").each(function(i) {
    $(this).click(function(e) {
      fetchResult($(this).data('code'), 'all');
    });
  });
  $(".query .loading").hide();
  if (typeof Homepage === "undefined")
    $(".titleBar .allCourses").addClass("selected");
});

function fetchResult(type, target){
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
                <span class="teacher">教授:${e.teacher}</span>
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
          .finally(()=>{
            $(".query .result").slideDown(200);
            $(".query .loading").hide();
          })
      });
}
