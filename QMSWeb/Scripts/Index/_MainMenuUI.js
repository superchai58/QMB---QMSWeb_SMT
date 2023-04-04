$(document).ready(function () {
    if (document.referrer == "") {
        qmsEasyUIalertWarning("Notice", "Please Login in!");
        $(window).attr('location', baseUrl + "/Home/Index");
    }
});