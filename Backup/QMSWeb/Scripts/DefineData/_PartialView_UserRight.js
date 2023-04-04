
$(document).ready(function () {
    var item = JSON.parse($("#xmlList").val());
    for (var i = 0; i < item.length; i++) {
        var id = item[i].Item;
        if (item[i].ItemType == "combobox" && item[i].LinkPara == "") {
            refData(id, item[i].DataSource,item[i].DBName,item[i].DataType);
        }
        if (item[i].ItemType == "combobox" && item[i].LinkPara != "") {
            refData(id, "", item[i].DBName, item[i].DataType);
        }
    }
})

function onSelectFunction(id) {
    if (id == "UserName") {
        getundefined_Right();
        getdefined_Right();
        return;
    }
    var item = JSON.parse($("#xmlList").val());
    for (var i = 0; i < item.length; i++) {
        if (item[i].LinkPara == id) {
            var ActOpt = item[i].Item;
            DBName = item[i].DBName;
            var idValue = $("#" + id).combobox('getValue');
            var pu = $("#PU").text();
            var url = baseUrl + "/QueryData/SelectOptionChg?idValue=" + idValue + "&DataSource=" + item[i].DataSource + "&DBName=" + DBName + "&PU=" + pu;
            $("#" + ActOpt).combobox({
                url: url,
                valueField: ActOpt,
                textField: ActOpt,
                height: "20px",
                editable: false,
                onSelect: function () {
                    refAppNameInfo();
                },
            });
        }
    }
}

function refData(id, DataSource,DBName,type) {
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
        width: "173px",
        editable: true,
        prompt: "输入关键字搜索",
        onSelect: function () {
            onSelectFunction(id);
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
    if (id == "UserName") {
        keyDownEventFun(id);
    }
}

function keyDownEventFun(id) {
    $('#' + id).textbox('textbox').keydown(function (event) {
        if (event.keyCode == 13) {
            if ($("#UserName").combobox('getText') == "") {
                return
            }
            getundefined_Right();
            getdefined_Right();
        }
    });
}

function bt_click(actionid) {
    if (actionid == "Refresh") {
        getundefined_Right();
        getdefined_Right();
        return;
    }
    var item = $("#hidOpenMenuName").val();
    var strjson = getXMLList();
    if (actionid == "Copy") {
        strjson = getpara();
    }
    strjson = encodeURIComponent(strjson)
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var url = baseUrl + "/DefineData/QMS_DefineData?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + item + "&Type=" + actionid + "&PU=" + pu;
    var data = qmsJQueryAjax(url)
    if (data == "OK") {
        qmsEasyUIalertInfo("OK", "OK," + actionid + " data sucessfully!");
    }
    else {
        qmsEasyUIalertError("Error", data);
    }
}

function refAppNameInfo() {
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var strjson = getXMLList();
    strjson = encodeURIComponent(strjson);
    var itemVal = $("#hidOpenMenuName").val();
    var url = baseUrl + "/DefineData/getData_Json?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + itemVal + "&Type=refreshAppNameInfo&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    var arraywidth = [100, 80];
    EasyUILoadDataGrid("dtAppNameInfo", "", result, 350, arraywidth, true, false, null, null, null)
}

function getdefined_Right() {
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var strjson = getXMLList();
    strjson = encodeURIComponent(strjson);
    var itemVal = $("#hidOpenMenuName").val();
    var url = baseUrl + "/DefineData/getData_Json?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + itemVal + "&Type=defined_Right&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    var arraywidth = [50, 80];
    EasyUILoadDataGrid("dtdefinedRight", "", result, 200, arraywidth, true, false, null, get_rowdata, null)
}

function getundefined_Right() {
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var strjson = getXMLList();
    strjson = encodeURIComponent(strjson);
    var itemVal = $("#hidOpenMenuName").val();
    var url = baseUrl + "/DefineData/getData_Json?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + itemVal + "&Type=undefined_Right&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    var arraywidth = [50, 80];
    EasyUILoadDataGrid("dtundefinedRight", "", result, 180, arraywidth, true, false, null, get_rowdata, null)
}

function get_rowdata(id, index, data) {
    var row = $(id).datagrid('getRows')[index];
    $(id).datagrid("unselectRow", index);
    for (var col in row) {
        if ($("#" + col).length <= 0) {
            continue;
        }
        var type = document.getElementById(col).type;
        if (type == "select-one") {
            $("#" + col).combobox('setValue', row[col]);
        }
        else {
            $("#" + col).textbox('setValue', row[col]);
        }
    }
    refAppNameInfo();
}

function getpara() {
    var obj = {};
    obj["SourceID"] = $("#SourceID").textbox('getText');
    obj["TargetID"] = $("#TargetID").textbox('getText');
    obj["UID"] = $("#UserID").text();
    var strjson = JSON.stringify(obj);
    return strjson;
}

