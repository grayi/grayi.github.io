/*导航*/
$(document).ready(function() {
  $(window).scroll(function(){
    if($(window).scrollTop() > 0){
      $('.dropdown').show();
    }else if($(window).scrollTop() == 0){
      $('.dropdown').hide();
    }
  });
  /*滑动和显示下拉*/
  $(".ly_active_down").hover(function() {
    $(".ly_hr").show();
    $(".nav_down").addClass("nav_bgcolor");
    // $('.nav_down').slideDown(249);
    $(".nav_down").height("450px");
  });


  $(".nav").mouseleave(function() {
    // $('.nav_down').slideUp(249);
    $(".ly_hr").hide();
    $(".nav_down").height("");
    $(".nav_down").removeClass("nav_bgcolor");
  });

});
