$(document).ready(function () {
    var pu = $("#PU").text();
    var url = baseUrl + "/ShowBoardItem/getUrlList?ObjectName=ShowBoardItem&Type=getURLList&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    iniDataTable("myDataTable", JSON.parse(result), false, 15, false);
});
