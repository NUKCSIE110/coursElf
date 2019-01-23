const Homepage=true
$(".titleBar .allCourses").click(function(){
    $(this).addClass('selected');
    $('ul.timeline').hide();
    $('.query').show();
    window.history.pushState({},'','/query');
});