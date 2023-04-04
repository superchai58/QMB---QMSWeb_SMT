
$(document).ready(function () {
    if (document.referrer == "") {
        $(window).attr('location', baseUrl + "/Home/Index");
        return;
    }
    getlistData("UploadData")
})

function getPartialMenu(ObjectName) {
    var pu = $("#PU").text();
    $.ajax({
        type: "POST",
        url: baseUrl + "/UploadData/getPartialMenu?ObjectName=" + ObjectName + "&PU=" + pu,
        data: "",
        success: function (partialView) {
            $("#PartialView").html(partialView);
        },
        error: function (msg) {
            qmsEasyUIalertError("", msg);
        }
    });
}

function getlistData(ObjectName) {
    var pu = $("#PU").text();
    var uid = $("#UserID").text();
    var url = baseUrl + "/UploadData/getListData?DBName=&ObjectName=" + ObjectName + "&PU=" + pu + "&UID=" + uid;
    $("#list").combobox({
        url: url,
        valueField: "ObjectName",
        textField: "Descr",
        height: "20px",
        width: "350px",
        mode: "local",
        prompt: "输入关键字搜索",
        editable: true,
        onSelect: function () {
            onSelectFunction();
        },
        filter: function (q, row) {
            if (row["PinYin"]) {
                var opts = $(this).combobox('options');
                var tmp = q.toLowerCase();
                return row["PinYin"].indexOf(tmp) >= 0 || row[opts.textField].indexOf(tmp) >= 0;
            }
            else {
                var opts = $(this).combobox('options');
                return row[opts.textField].indexOf(q) >= 0;
            }
        }
    });
}

function onSelectFunction() {
    var objvalue = $("#list").combobox('getValue');
    var pu = $("#PU").text();
    $.ajax({
        type: "POST",
        url: baseUrl + "/UploadData/getPartialMenu?ObjectName=" + objvalue + "&PU=" + pu,
        data: "",
        success: function (partialView) {
            $("#PartialView").html(partialView);
        },
        error: function (msg) {
            qmsEasyUIalertError("", msg);
        }
    });
}
