/*
* @Author: xianghong.yan
* @Date:   2017-09-19 18:01:00
* @Last Modified by:   YSH7765
* @Last Modified time: 2018-07-09 17:58:29
*/
$(function () {
    let swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 1,
        paginationClickable: true,
        loop: true
    });

    [1, 3, 4].map(x => x + 1);
});
