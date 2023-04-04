$(document).ready(function () {
    var item = JSON.parse($("#xmlList").val());
    for (var i = 0; i < item.length; i++) {
        var id = item[i].Item;
        if (item[i].ItemType == "combobox" && item[i].LinkPara == "") {
            refData(id, item[i].DataSource, item[i].DBName, item[i].DataType);
        }
        if (item[i].ItemType == "combobox" && item[i].LinkPara != "") {
            refData(id, "", item[i].DBName, item[i].DataType);
        }
        if (item[i].ItemType == "varchar" && item[i].DataSource != "") {
            $("#" + id).val(item[i].DataSource);
        }
        if (item[i].ItemType == "varchar" && item[i].DataSource == "") {
            var strprompt = item[i].PromptValue;
            if (strprompt != "") {
                $("#" + id).textbox({
                    prompt: strprompt,
                });
            }
        }
    };
})

function refData(id, DataSource, DBName, type) {
    var pu = $("#PU").text();
    var url = baseUrl + "/QueryData/iniSelectOptionValue?id=" + id + "&DataSource=" + DataSource + "&type=" + type + "&DBName=" + DBName + "&PU=" + pu;
    if (DataSource == "") {
        url = "";
    }
    $("#" + id).combobox({
        url: url,
        valueField: id,
        textField: id,
        height: "20px",
        width: "193px",
        editable: true,
        onSelect: function () {
            getWOinfo(id);
        },
    });
    keyDownEventFun(id);
}

function keyDownEventFun(id) {
    $('#' + id).textbox('textbox').keydown(function (event) {
        if (event.keyCode == 13) {
            getWOinfo(id);
    }
  });
}

function getWOinfo(id) {
    var value = $("#" + id).combobox('getText');
    if (value == "") {
        qmsEasyUIalertMessage("Warning", id + " is empty!");
        return;
    }
    var obj = {};
    var item = $("#hidOpenMenuName").val();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    obj[id] = value;
    var strjson = JSON.stringify(obj);
    var pu = $("#PU").text();
    var url = baseUrl + "/DefineData/getData_Json?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + item + "&Type=" + id + "_keyDown" + "&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    result = JSON.parse(result)
    $("#WOinfo").text(result[0]["WOinfo"]);
}

function bt_click() {
    var item = $("#hidOpenMenuName").val();
    var obj = {};
    obj["WO"] = $("#WO").combobox('getText');
    if ($("#DelQSMS").is(':checked')) {
        obj["DelQSMS"] = "0";
    }
    else {
        obj["DelQSMS"] = "1";
    }
    obj["UID"] = $("#UserID").text();
    var strjson = JSON.stringify(obj);
    strjson = encodeURIComponent(strjson)
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var url = baseUrl + "/DefineData/QMS_DefineData?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + item + "&Type=DelWO&PU=" + pu;
    var data = qmsJQueryAjax(url)
    if (data == "OK") {
        qmsEasyUIalertInfo("OK", "OK,Delete WO sucessfully!");
    }
    else {
        qmsEasyUIalertError("Error", data);
    }
}