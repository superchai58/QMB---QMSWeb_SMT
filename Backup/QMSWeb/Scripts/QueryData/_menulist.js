$(document).ready(function () {
    //$("#list").combobox({
    //    url: "",
    //    valueField: "",
    //    textField: "",
    //    height: "20px",
    //    prompt: "",
    //    editable: false,
    //});
    //getMenuList("SNTrace");
    getlistData("General")
})

function radio_Click(val) {
    var checkValue = $('input:radio[name="QueryType"]:checked').val();
    if (checkValue == "SNTrace") {
        getMenuList(checkValue)
        return
    }
    $('#list').next(".combo").show();
    getlistData(checkValue);
    $("#PartialView").html("");
}

function onSelectFunction() {
    var checkValue = $('input:radio[name="QueryType"]:checked').val();
    var objvalue = $("#list").combobox('getValue');
    var uid = $("#UserID").text();
    var pu = $("#PU").text();
    $.ajax({
        type: "POST",
        url: baseUrl + "/QueryData/getMenuList?ObjectName=" + objvalue + "&type=" + checkValue + "&UID=" + uid + "&PU=" + pu,
        data: "",
        success: function (partialView) {
            $("#PartialView").html(partialView);
        },
        error: function (msg) {
            qmsEasyUIalertError("", msg);
        }
    });
}

function getlistData(type) {
    var pu = $("#PU").text();
    var url = baseUrl + "/QueryData/getlistData?type=" + type + "&PU=" + pu;
    $("#list").combobox({
        url: url,
        valueField: "ObjectName",
        textField: "Descr",
        height: "20px",
        mode: "local",
        width: "350px",
        prompt:"输入关键字搜索",
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

function getMenuList(ObjectName) {
    $('#list').next(".combo").hide();
    var pu = $("#PU").text();
    $.ajax({
        type: "POST",
        url: baseUrl + "/QueryData/getMenuList?ObjectName=" + ObjectName + "&type=" + ObjectName + "&UID=&PU=" + pu,
        data: "",
        success: function (partialView) {
            $("#PartialView").html(partialView);
        },
        error: function (msg) {
            qmsEasyUIalertError("", msg);
        }
    });
}



