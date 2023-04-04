$(document).ready(function () {
    var item = JSON.parse($("#xmlList").val());
    for (var i = 0; i < item.length; i++) {
        var id = item[i].Item;
        if (id.indexOf('[') == 0 && id.indexOf(']') == 2) {
            id = id.substring(3);
        }
        if (item[i].ItemType == "combobox" && item[i].LinkPara == "") {
            refData(id, item[i].DataSource, item[i].DataType, item[i].DBName);
        }
        if (item[i].ItemType == "combobox" && item[i].LinkPara != "") {
            refData(id, "", item[i].DataType, item[i].DBName);
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
    }

    refreshtable("ini_Data", true, 13, true);
    table_tr_click();
})

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
            var type = document.getElementById(id).type;
            if (type == "select-one") {
                $("#" + id).combobox('setValue', Rowdata[id]);
            }
            else {
                $("#" + id).textbox('setValue', Rowdata[id]);
            }
        }
    });
}

function refData(id, DataSource, type, DBName) {
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
        width: '163px',
        editable: true,
        prompt: "输入关键字搜索",
        onSelect: function () {
            onSelectFunction(id);
        },
    });
}

function bt_click(actionid) {
    var item = $("#hidOpenMenuName").val();
    var strjson = getXMLList();
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    strjson = encodeURIComponent(strjson)
    var url = baseUrl + "/DefineData/QMS_DefineData?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + item + "&Type=" + actionid + "&PU=" + pu;
    if (actionid == "Excel") {
        url = baseUrl + "/DefineData/DownLoadFile?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + item + "&Type=" + actionid + "&PU=" + pu;
        url = encodeURI(url);
        qmsJQueryDownloadFile(url)
        return
    }
    var data = qmsJQueryAjax(url)
    if (data == "OK") {
        qmsEasyUIalertInfo("OK", "OK," + actionid + " data sucessfully!");
        refreshtable("refreshData", true, 13, true);
        table_tr_click();
    }
    else {
        qmsEasyUIalertError("Error", data);
    }
}

function onSelectFunction(id) {
    //refreshtable("refreshData", false, 13, false);
    //table_tr_click();
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    for (var i = 0; i < item.length; i++) {
        if (item[i].LinkPara == id) {
            var ActOpt = item[i].Item;
            var idValue = $("#" + id).combobox('getValue');
            var url = baseUrl + "/QueryData/SelectOptionChg?idValue=" + idValue + "&DataSource=" + item[i].DataSource + "&DBName=" + item[0].DBName + "&PU=" + pu;
            $("#" + ActOpt).combobox({
                url: url,
                valueField: ActOpt,
                textField: ActOpt,
                height: "20px",
                editable: true,
                prompt: "输入关键字搜索",
                onHidePanel: function () {
                    refreshtable("refreshData", true, 10, true);
                    table_tr_click();
                }
            });
        }
    }
}

