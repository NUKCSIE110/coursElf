$(document).ready(() => {
  $(".query a.dropdown-item").each(function(i) {
    $(this).click(function(e) {
      $(".query .dropdown button").text($(this).text());
      $(".query .loading").show();
      $(".query .result").slideUp(200, () => {
        fetch(`/api/courses/${$(this).data("code")}`)
          .then(r => r.json())
          .then(d => {
            $(".query .loading").hide();
            console.log(d);
            $(".query .result").html("");
            d.forEach(e => {
              let content = `
              <div class="resultCard">
                <span class="classID">${e.dept+e.id}</span>
                <span class="className">${e.name}</span>
                <span class="teacher">教授:${e.teacher}</span>
                <span class="location">上課地點:${e.location}</span>
                <span class="${(e.compulsory ? "compulsory" : "choose")}">${e.point}學分</span>
              </div>`;
              $(".query .result").append(content);
            });
            $(".query .result").slideDown(200);
          });
      });
    });
  });
  $(".query .loading").hide();
});
