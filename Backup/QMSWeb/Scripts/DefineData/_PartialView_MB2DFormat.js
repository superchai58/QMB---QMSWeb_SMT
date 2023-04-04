
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
    }
    refreshtable("ini_Data", false, 12, true);
})

function refData(id, DataSource, DBName, type) {
    var pu = $("#PU").text();
    var url = baseUrl + "/QueryData/iniSelectOptionValue?id=" + id + "&DataSource=" + DataSource + "&type=" + type + "&DBName=" + DBName + "&PU=" + pu;
    if (DataSource == "") {
        url = "";
    }
    var itemVal = $("#hidOpenMenuName").val();
    if (id == "ModelName") {
        $("#" + id).combobox({
            url: url,
            valueField: id,
            textField: id,
            height: "20px",
            width: "193px",
            editable: true,
            prompt: "输入关键子敲回车搜索",
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
        keyDownEventFun(id);
    }
    else {
        $("#" + id).combobox({
            url: url,
            valueField: id,
            textField: id,
            height: "20px",
            width: "193px",
            editable: false,
        });
    }

}

function bt_click(actionid) {
    var item = $("#hidOpenMenuName").val();
    var strjson = getXMLList();
    strjson = encodeURIComponent(strjson);
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var url = baseUrl + "/DefineData/QMS_DefineData?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + item + "&Type=" + actionid + "&PU=" + pu;
    var data = qmsJQueryAjax(url)
    if (data == "OK") {
        qmsEasyUIalertInfo("OK", "OK," + actionid + " data sucessfully!");
        refreshtable("refreshData", false, 12, true);
    }
    else {
        qmsEasyUIalertError("Error", data);
    }
}

function keyDownEventFun(id) {
    $('#' + id).textbox('textbox').keydown(function (event) {
        if (event.keyCode == 13) {
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
            var strjson = encodeURIComponent(JSON.stringify(obj));
            var pu = $("#PU").text();
            $.ajax({
                async: false,
                type: "POST",
                url: baseUrl + "/DefineData/getData?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + item + "&Type=keyDown" + "&PU=" + pu,
                data: "",
                success: function (data) {
                    $('#' + id).combobox('loadData', {});//清空下拉框
                    $('#' + id).combobox('clear');//清空输入框
                    $('#' + id).combobox('loadData', JSON.parse(data));
                },
                error: function (msg) {
                    qmsEasyUIalertError("Error", msg);
                }
            });
        }
    });
}

