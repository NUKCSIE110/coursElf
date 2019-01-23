const Homepage = true;
$(".titleBar .allCourses").click(function() {
  $(this).addClass("selected");
  $(".content").css("align-items", "flex-start");
  $("ul.timeline").hide();
  $(".query").show();
  window.history.pushState({}, "", "/query");
});
