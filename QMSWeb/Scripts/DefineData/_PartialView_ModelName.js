
$(document).ready(function () {
    refData("Model", "", "Model");
    var item = JSON.parse($("#xmlList").val());
    //for (var i = 0; i < item.length; i++) {
    //    var id = item[i].Item;
    //    if (id != "") {
    //        if (item[i].ItemType == "combobox") {
    //            if (item[i].DataType == "string") {
    //                var arr = item[i].DataSource.split(";");
    //                for (var j = 0; j < arr.length; j++) {
    //                    $("#" + id).append("<option value=" + arr[j] + ">" + arr[j] + "</option>");
    //                }
    //                refreshData("", id);
    //            }
    //            if (item[i].DataType == "sql") {
    //                iniSelectOptionValue(id, item[i].DataSource)
    //                refreshData("", id);
    //            }
    //        }
    //    }
    //}
    for (var i = 0; i < item.length; i++) {
        var id = item[i].Item;
        if (id != "") {
            if (item[i].ItemType == "combobox" && item[i].LinkPara == "") {
                refData(id, item[i].DataSource, item[i].DataType, item[0].DBName);
            }
            if (item[i].ItemType == "combobox" && item[i].LinkPara != "") {
                refData(id, item[i].DataSource, item[i].DataType, item[0].DBName);
            }
        }
    }
    $("#ProductType").combobox('setValue',"NB")
    refreshtable("ini_Data", true, 5, false);
    table_tr_click();
});

function refData(id, DataSource, type, DBName) {
    var pu = $("#PU").text();
    var url = baseUrl + "/QueryData/iniSelectOptionValue?id=" + id + "&DataSource=" + DataSource + "&type=" + type + "&DBName=" + DBName + "&PU=" + pu;
    if (DataSource == "") {
        url = "";
    }
    if (id == "Model") {
        var obj = {};
        obj["Model"] = id;
        var item = $("#hidOpenMenuName").val();
        var strjson = JSON.stringify(obj);
        strjson = encodeURIComponent(strjson);
        url = baseUrl + "/DefineData/getData?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + item + "&Type=" + type + "&PU=" + pu;
        $("#" + id).combobox({
            url: url,
            valueField: id,
            textField: id,
            height: "20px",
            width: "163px",
            editable: true,
            prompt: "输入关键字敲回车搜索",
            onSelect: function () {
                onSelectChg(id);
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
        keyDownEventFun(id);
    }
    else {
        if (id == "Stage") {
            $("#" + id).combobox({
                url: url,
                valueField: id,
                textField: id,
                height: "20px",
                width: "165px",
                editable: false,
                onSelect: function () {
                    StageonSelectChg();
                }
            });
        }
        else {
            $("#" + id).combobox({
                url: url,
                valueField: id,
                textField: id,
                height: "20px",
                width: "165px",
                editable: false,
            });
        }
    }
}

function StageonSelectChg() {
    if ($("#PN").textbox('getText') == "") {
        return;
    }
    if ($("#Stage").combobox('getText') == "") {
        return;
    }
    var pu = $("#PU").text();
    var strxml = JSON.parse($("#xmlList").val());
    var obj = {};
    obj["PN"] = $("#PN").textbox('getText');
    obj["Stage"] = $("#Stage").combobox('getText');
    var item = $("#hidOpenMenuName").val();
    var strjson = JSON.stringify(obj);
    strjson = encodeURIComponent(strjson);
    url = baseUrl + "/DefineData/getData?JsonString=" + strjson + "&DBName=" + strxml[0].DBName + "&Item=" + item + "&Type=getGroup&PU=" + pu;
    $("#GroupName").combobox({
        url: url,
        valueField: "GroupName",
        textField: "GroupName",
        height: "20px",
        width: "165px",
        editable: false
    });
}

function onSelectChg(id) {
    var obj = {};
    var value;
    if (id == "Model") {
        value = $("#" + id).combobox('getValue');
    }
    else {
        value = $("#" + id).textbox('getText');
    }
    if (value == "") {
        return;
    }
    clearData();
    var item_T = JSON.parse($("#xmlList").val());
    var item = $("#hidOpenMenuName").val();
    obj["Model"] = value;
    var strjson = JSON.stringify(obj);
    var pu = $("#PU").text();
    var url = baseUrl + "/DefineData/getData_Json?JsonString=" + strjson + "&DBName=" + item_T[0].DBName + "&Item=" + item + "&Type=onSelect" + "&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    var resultItem = JSON.parse(result)
    for (var i = 0; i < item_T.length; i++) {
        var id = item_T[i].Item;
        for (var val in resultItem[0]) {
            if (val = id) {
                if (item_T[i].ItemType == "button") {
                    continue;
                }
                if ($("#" + id).length <= 0) {
                    continue;
                }
                if (id == "ProductType") {
                    continue;
                }
                var type = document.getElementById(id).type;
                if (type == "select-one") {
                    $("#" + id).combobox('setValue', resultItem[0][val].toString());
                }
                else {
                    $("#" + id).textbox('setValue', resultItem[0][val].toString());
                }
            }
        }
    }
    refdataList("");
    //iniDataTable("myDtTable",JSON.parse(result),true,10,false);
    table_tr_click();
}

function keyDownEventFun(id) {  
    $('#' + id).textbox('textbox').keydown(function (event) {
        if (event.keyCode == 13) {
            var value = $('#' + id).combobox('getText');
            if (value == "") {
                qmsEasyUIalertMessage("Warning", id + " is empty!");
                return;
            }
            var obj = {};
            var item = $("#hidOpenMenuName").val();
            var item_T = JSON.parse($("#xmlList").val());
            obj[id] = value;
            var strjson = JSON.stringify(obj);
            var pu = $("#PU").text();
            $.ajax({
                async: false,
                type: "POST",
                url: baseUrl + "/DefineData/getData?JsonString=" + strjson + "&DBName=" + item_T[0].DBName + "&Item=" + item + "&Type=keyDown" + "&PU=" + pu,
                data: "",
                success: function (data) {
                    $('#' + id).combobox('loadData', {});//清空下拉框
                    $('#' + id).combobox('clear');//清空输入框
                    $('#' + id).combobox('loadData',JSON.parse(data));
                },
                error: function (msg) {
                    qmsEasyUIalertError("Error", msg);
                }
            });
            refdataList(value);
            table_tr_click();
        }
    });
}

function bt_click(actionid) {
    var item = $("#hidOpenMenuName").val();
    var strjson
    if (actionid == "Excel") {
        var obj = {};
        obj["Model"] = $("#Model").combobox('getText');
        strjson = JSON.stringify(obj);
    }
    else {
        strjson = getXMLList();
    }
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    strjson = encodeURIComponent(strjson);
    var url = baseUrl + "/DefineData/QMS_DefineData?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + item + "&Type=" + actionid + "&PU=" + pu;
    if (actionid == "Excel") {
        url = baseUrl + "/DefineData/DownLoadFile?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + item + "&Type=" + actionid + "&PU=" + pu;
        url = encodeURI(url);
        qmsJQueryDownloadFile(url)
        return
    }
    var data = qmsJQueryAjax(url)
    if (data == "OK") {
        //clearData();
        qmsEasyUIalertInfo("OK", "OK," + actionid + " data sucessfully!");
        //refreshtable("refreshData", true, 5, false);
        if (actionid == "AddNew" || actionid == "Update") {
            onSelectChg("ModelName");
        }
        else {
            clearData();
        }
        refreshtable("refreshData", true, 5, false);
        table_tr_click();
    }
    else {
        qmsEasyUIalertError("Error", data);
    }
}

function table_tr_click() {
    $('#myDtTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        var Dtable = $('#myDtTable').DataTable();
        var Rowdata = Dtable.row(this).data();
        var item = JSON.parse($("#xmlList").val());
        clearData();
        for (var i = 0; i < item.length; i++) {
            var id = item[i].Item;
            if (id.indexOf('[') == 0 && id.indexOf(']') == 2) {
                id = id.substring(3);
            }
            if (item[i].ItemType == "button") {
                continue;
            }
            if ($("#" + id).length <= 0) {
                continue;
            }
            if (id == "ProductType") {
                continue;
            }
            var type = document.getElementById(id).type;
            if (type == "select-one") {
                $("#" + id).combobox('setValue', Rowdata[id].toString());
            }
            else {
                $("#" + id).textbox('setValue', Rowdata[id].toString());
            }
        }
    });
}

function clearData() {
    var item = JSON.parse($("#xmlList").val());

    for (var i = 0; i < item.length; i++) {
        var id = item[i].Item;
        if (id.indexOf('[') == 0 && id.indexOf(']') == 2) {
            id = id.substring(3);
        }
        if (item[i].ItemType == "button") {
            continue;
        }
        if (id == "ProductType") {
            continue;
        }
        if ($("#" + id).length <= 0) {
            continue;
        }
        var type = document.getElementById(id).type;
        if (type == "select-one") {
            $("#" + id).combobox('setValue', '');
        }
        else {
            $("#" + id).textbox('setValue', '');
        }
    }
}

$('#Stage').combobox('textbox').bind('focus', function () {
    if ($("#PN").textbox('getText') == "") {
        return;
    }
    var pu = $("#PU").text();
    var strxml = JSON.parse($("#xmlList").val());
    var obj = {};
    obj["PN"] = $("#PN").textbox('getText');
    obj["Stage"] = "Stage";
    var item = $("#hidOpenMenuName").val();
    var strjson = JSON.stringify(obj);
    strjson = encodeURIComponent(strjson);
    url = baseUrl + "/DefineData/getData?JsonString=" + strjson + "&DBName=" + strxml[0].DBName + "&Item=" + item + "&Type=getStage&PU=" + pu;
    $("#Stage").combobox({
        url: url,
        valueField: "Stage",
        textField: "Stage",
        height: "20px",
        width: "165px",
        editable: false
    });
});

function refdataList(value) {
    if (value == "") {
        value = $('#Model').combobox('getText');
    }
    var obj = {};
    var item = $("#hidOpenMenuName").val();
    var item_T = JSON.parse($("#xmlList").val());
    obj["Model"] = value;
    var strjson = JSON.stringify(obj);
    var pu = $("#PU").text();
    var url = baseUrl + "/DefineData/getData_Json?JsonString=" + strjson + "&DBName=" + item_T[0].DBName + "&Item=" + item + "&Type=refList" + "&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    iniDataTable("myDtTable", JSON.parse(result), true, 5, false);
}