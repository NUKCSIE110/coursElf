function init() {
  $(".titleBar .burger").click(e => {
    $(".titleBar nav").slideToggle();
    e.stopPropagation();
  });
  $(".titleBar h1").click(() => {
    window.location = "/";
  });
  $(".titleBar nav a").each(function() {
    $(this).click(function() {
      if (window.innerWidth <= 560) $(".titleBar nav").slideUp();
    });
  });
  $("body").click(() => {
    if (window.innerWidth <= 560) $(".titleBar nav").slideUp();
  });
  setTimeout(function() {
    window.scrollTo(0, 1);
  }, 100);
  $(window).resize(function() {
    window.scrollTo(0, 1);
  });
}
init();
