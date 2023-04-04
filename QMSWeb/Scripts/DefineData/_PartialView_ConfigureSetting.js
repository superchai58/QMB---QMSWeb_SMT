
$(document).ready(function () {
    var itemVal = $("#hidOpenMenuName").val();
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    $("#tree").tree({
        url: baseUrl + "/DefineData/GetTreeJson?DBName=" + item[0].DBName + "&Item=" + itemVal + "&Type=ParentNodeList" + "&PU=" + pu,
        animate:true,
        onClick: function (node) {
            if ($(this).tree('getParent', node.target) == null) {
                return;
            }
            var ParenNode = $(this).tree("getParent", node.target);
            refKeyinfo(ParenNode.text, node.text, pu);
        }
    });
    for (var i = 0; i < item.length; i++) {
        var id = item[i].Item;
        if (item[i].ItemType == "combobox" && item[i].LinkPara == "") {
            refData(id, item[i].DataSource, item[i].DBName, item[i].DataType);
        }
        if (item[i].ItemType == "combobox" && item[i].LinkPara != "") {
            refData(id, "",item[i].DBName, item[i].DataType);
        }
    }
})

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
        width: "193px",
        editable: false,
        prompt: "<拷贝>请选择"
    });
}

function refKeyinfo(line, station, pu) {
    var item = JSON.parse($("#xmlList").val());
    for (var i = 0; i < item.length; i++) {
        var id = item[i].Item;
        if ($("#" + id).length <= 0) {
            continue;
        }
        var type = document.getElementById(id).type;
        if (type == "select-one") {
            $('#' + id).combobox('clear');
        }
        else {
            $("#" + id).textbox('setValue', "");
        }
    }
    $("#Line").textbox('setValue', line);
    $("#Station").textbox('setValue', station);
    ref_tableData("myDtTable_define", "defined_Keyinfo", pu, item[0].DBName);
    ref_tableData("myDtTable_undefine", "undefined_Keyinfo", pu, item[0].DBName)
}

function ref_tableData(tableid, type, pu, DBName) {
    var strjson = getXMLList();
    strjson = encodeURIComponent(strjson)
    var item = $("#hidOpenMenuName").val();
    var arraywidth = [80, 100];
    url = baseUrl + "/DefineData/getData_Json?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + item + "&Type=" + type + "&PU=" + pu;
    var data = qmsJQueryAjax(url)
    EasyUILoadDataGrid(tableid, "", data, 180, arraywidth, true, false, null, get_rowdata, null)
}

function get_rowdata(id,index, data) {
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
}

function bt_click(actionid) {
    var item = $("#hidOpenMenuName").val();
    var strjson = getXMLList();
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    strjson = encodeURIComponent(strjson)
    var url = baseUrl + "/DefineData/QMS_DefineData?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + item + "&Type=" + actionid + "&PU=" + pu;
    var data = qmsJQueryAjax(url)
    if (data == "OK") {
        qmsEasyUIalertInfo("OK", "OK," + actionid + " data sucessfully!");
        ref_tableData("myDtTable_define", "defined_Keyinfo", pu, DBName);
        ref_tableData("myDtTable_undefine", "undefined_Keyinfo", pu, DBName)
    }
    else {
        qmsEasyUIalertError("Error", data);
    }
}