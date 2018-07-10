$(function () {
    function previewFixed() {
        var t,
            e, a = 0,
            n = $(".prod-container-left"),
            s = n.outerHeight(!0),
            i = $(".prod-container").offset().top,
            e = $(".prod-container").outerHeight(!0),
            o = 0,
            r = !1;
        console.log(i);
        console.log(s);
        console.log(e);
        console.log(r);
        $(window).on({
            scroll: function () {
                o = $(this).scrollLeft(),
                    t = $(this).scrollTop(),
                    e = $(".prod-container").outerHeight(!0),
                    e + i > t + s ? (a = Math.max($(".prod-container-left").offset().top, 0),
                            $("#prod-container-left").css({
                                position: "fixed",
                                top: a,
                                left: r ? -o : $(".prod-container-left").offset().left
                            })
                    ) : (a = e - s,
                        $("#prod-container-left").css({
                            position: "absolute",
                            top: a,
                            left: 0
                        }))
            }, resize: function () {
                r = document.documentElement.clientWidth < 1200 ? !0 : !1, $(this).trigger("scroll")
            }
        }).trigger("resize")

    }

    previewFixed();
});
