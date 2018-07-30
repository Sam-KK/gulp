/**
 * @Author : YSH7765
 * @createTime: 2018/7/12 15:24
 **/

$(function () {
    let w = window.w || {},
        resizeW = 1024,
        $header = $('#header'),
        $nav = $('#nav');
    // 阻止移动端浏览器滑动
    w.preventHandler = function() {
        event.preventDefault();
    };
    w.preventScroll = function (flag) {
        let supportsPassive = false;
            //flag = flag ? flag : false;
        // 判断浏览器是否支持 passive特性
        try {
            let opts = Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassive = true;
                }
            });
            window.addEventListener('prevent-scroll', null, opts);
        } catch (e) {}

        if (flag) {
            document.addEventListener(
                'touchmove',
                w.preventHandler,
                supportsPassive ? { passive: false } : false
            );
        } else {
            document.removeEventListener(
                'touchmove',
                w.preventHandler,
                false
            );
        }
    }
    // mobile 点击菜单图标打开横向菜单
    $('.event-nav-trigger').on('click', function (e) {
        w.preventScroll(true);
        event.preventDefault();
        if ($('.event-container').hasClass('nav-is-visible')) {
            closeNav();
        } else {
            $(this).addClass('nav-is-visible');
            $header.addClass('nav-is-visible');
            $nav.addClass('nav-is-visible');
            toggleSearch('close');
        }
    });

    //open search form
    $('.event-search-trigger').on('click', function (event) {
        event.preventDefault();
        toggleSearch();
        closeNav();
    });
    // open submenu
    $('.has-children').children('a').on('click', function (event) {
        if (!checkWindowWidth()) event.preventDefault();
        let selected = $(this);
        if (selected.next('ul').hasClass('is-hidden')) {
            // desktop version only
            selected.addClass('selected').next('ul').removeClass('is-hidden').end().parent('.has-children').parent('ul').addClass('moves-out');
            selected.parent('.has-children').siblings('.has-children').children('ul').addClass('is-hidden').end().children('a').removeClass('selected');
            $('.cd-overlay').addClass('is-visible');
        } else {
            selected.removeClass('selected').next('ul').addClass('is-hidden').end().parent('.has-children').parent('ul').removeClass('moves-out');
            $('.cd-overlay').removeClass('is-visible');
        }
        toggleSearch('close');
    });

    //submenu items - go back link
    $('.go-back').on('click', function(){
        $(this).parent('ul').addClass('is-hidden').parent('.has-children').parent('ul').removeClass('moves-out');
    });

    // closeNav
    function closeNav() {
        $('.event-nav-trigger').removeClass('nav-is-visible');
        $('.cd-main-header').removeClass('nav-is-visible');
        $('.cd-primary-nav').removeClass('nav-is-visible');
        $('.has-children ul').addClass('is-hidden');
        $('.has-children a').removeClass('selected');
        $('.moves-out').removeClass('moves-out');
        $('.cd-main-content').removeClass('nav-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
            $('body').removeClass('overflow-hidden');
        });
    }

    //
    function toggleSearch(type) {
        if (type == "close") {
            //close serach
            $('.event-search-form').removeClass('is-visible');
            $('.event-search-trigger').removeClass('search-is-visible');
        } else {
            //toggle search visibility
            $('.event-search-form').toggleClass('is-visible');
            $('.event-search-trigger').toggleClass('search-is-visible');
            if ($(window).width() > resizeW && $('.event-search-form').hasClass('is-visible')) $('.cd-search').find('input[type="search"]').focus();
            ($('.event-search-form').hasClass('is-visible')) ? $('.cd-overlay').addClass('is-visible') : $('.cd-overlay').removeClass('is-visible');
        }
    }

    //
    function checkWindowWidth() {
        // check window width (scrollbar included)
        var e = window,
            a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        if (e[a + 'Width'] >= resizeW) {
            return true;
        } else {
            return false;
        }
    }
});
