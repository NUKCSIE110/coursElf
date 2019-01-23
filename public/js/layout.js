$(document).ready(() => {
  $(".titleBar .burger").click(() => {
    $(".titleBar nav").slideToggle();
  });
  $(".titleBar h1").click(()=>{
    window.location = "/";
  });
  $(".titleBar nav a").each(function(){
    $(this).click(function(){
      if(window.innerWidth<=560)
        $(".titleBar nav").slideUp();
    });
  })
});
