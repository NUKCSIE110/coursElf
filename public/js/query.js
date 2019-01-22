$(document).ready(() => {
  $(".query a.dropdown-item").each(function(i) {
    $(this).click(function(e){
        $(".query .dropdown button").text($(this).text());
        $(".query .loading").show();
        $(".query .result").slideUp();
    });
  });
  $(".query .loading").hide();
});
