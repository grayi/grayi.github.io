$(function () {
    $('.lyFunInput').click(function () {
        var functionBottomOn = $('.functionBottomOn').html();
        var functionBottomOff = $('.functionBottomOff').html();
        var blocks = $(this).parent('.lyFuncionTop').next();
        if (blocks.is(':visible')) {
            blocks.stop().slideUp();
            $(this).text(functionBottomOn);
        } else {
            blocks.stop().slideDown();
            $(this).text(functionBottomOff);
        }
    })
})