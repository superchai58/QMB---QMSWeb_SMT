$(document).ready(function () {
    var item = JSON.parse($("#xmlList").val());
    for (var i = 0; i < item.length; i++) {
        var id = item[i].Item;
        if (item[i].ItemType == "combobox" && item[i].LinkPara == "") {
            refData(id, item[i].DataSource, item[i].DataType, item[i].DBName);
        }
        if (item[i].ItemType == "combobox" && item[i].LinkPara != "") {
            refData(id, "", item[i].DataType, item[i].DBName);
        }
    }
    refreshtable("refreshData", true, 12, true);
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
            if ($("#" + id).length <= 0) {
                continue;
            }
            if (id == "PassWord") {
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
        editable: false,
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
        refreshtable("refreshData", true, 12, true);
        table_tr_click();
    }
    else {
        qmsEasyUIalertError("Error", data);
    }
} 

function UserNameLostFocus() {
    var UID = $("#Username").textbox('getValue');
    var itemVal = $("#hidOpenMenuName").val();
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    type = "CheckEmployeeID";
    var obj = {};
    obj["UID"] = UID;
    var strjson = encodeURIComponent(JSON.stringify(obj))
    var url = baseUrl + "/DefineData/getData_Json?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + itemVal + "&Type=" + type + "&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    result = JSON.parse(result)
    if (result[0]["Result"] == "1") {
        $("#CHName").textbox('setValue', result[0]["EmployeeName"]);
        $("#Department").textbox('setValue', result[0]["Department"]);
        $("#TelNumber").textbox('setValue', result[0]["Phone"]);
        $("#EmailAddress").textbox('setValue', result[0]["Mail"]);
        $("#IsEmployeeID").textbox('setValue', "Y");
    }
    else {
        $.messager.confirm("Confirm", "This EmployeeID does not exist in HR system,Re-Enter EmployeeID?", function (r) {
            if (!r) {
                $("#IsEmployeeID").textbox('setValue', "N");
            }
            else {
                $("#Username").textbox('setValue', "");
                $("#IsEmployeeID").textbox('setValue', "");
            }
            
        });
    }
}
