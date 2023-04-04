
$(document).ready(function () {
    if (document.referrer == "") {
        $(window).attr('location', baseUrl + "/Home/Index");
        return;
    }
    topmenuClick();
    topmenuliClick();
});

function topmenuClick() {
    $(".sf_topmenu a").click(function () {
        var pu = $("#PU").text();
        var tourl = baseUrl + "/SpecialItem/getPartialMenu?id=" + $(this).text() + "&PU=" + pu;
        qmsEasyUIopTab($(this).text(), tourl);
    });
}

function topmenuliClick() {
    $(".sf_topmenu li").click(function () {
        $(".sf_topmenu li").each(function () {
            $(this).removeClass("sf_topmenu_active");
        });
        $(this).addClass("sf_topmenu_active");
    });
}