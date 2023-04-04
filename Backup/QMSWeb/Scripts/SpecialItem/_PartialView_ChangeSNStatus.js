
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
        if (item[i].ItemType == "varchar" && item[i].DataSource == "") {
            var strprompt = item[i].PromptValue;
            if (strprompt != "") {
                $("#" + id).textbox({
                    prompt: strprompt,
                });
            }
        }
    };
    $('#filePath').filebox({
        buttonText: '浏览文件',
        buttonAlign: 'left'
    });
});

function refData(id, DataSource, DBName, type) {
    var pu = $("#PU").text();
    var url = baseUrl + "/QueryData/iniSelectOptionValue?id=" + id + "&DataSource=" + DataSource + "&type=" + type + "&DBName=" + DBName + "&PU=" + pu;
    if (DataSource == "") {
        url = "";
    }
    var itemVal = $("#hidOpenMenuName").val();
    $("#" + id).combobox({
        url: url,
        valueField: id,
        textField: id,
        height: "20px",
        width: "253px",
        editable: true,
        prompt: "请选择"
    });
}


$("#SN").textbox({
    inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
        keyup: function (event) {
            if (event.keyCode == 13) {
                getSPData();
            }
        }
    })
});

function dowloadTemplate() {
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var url = baseUrl + "/DefineData/DownTemplateFile?ObjectName=SpecialItem&DBName=" + DBName + "&type=Template&PU=" + pu;
    url = encodeURI(url);
    qmsJQueryDownloadFile(url)
}

function getSPData() {
    var itemVal = $("#hidOpenMenuName").val();
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var strjson = $("#SN").textbox('getText');
    //var url = baseUrl + "/DefineData/getData_Json?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + itemVal + "&Type=getSPData&PU=" + pu;
    var url = baseUrl + "/SpecialItem/getSPData?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + itemVal + "&Type=getSPData&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    result = JSON.parse(result)
    $("#Line").textbox('setValue', result[0]["MFGLine"]);
    $("#WO").textbox('setValue', result[0]["WorkOrder"]);
    $("#ModelName").textbox('setValue', result[0]["ModelName"]);
    $("#CurrentStatus").textbox('setValue', result[0]["Status"]);
   
}

function bt_click() {
    if ($("#SN").textbox('getText') == "") {
        qmsEasyUIalertWarning("Warning", "SN is null");
        return;
    }
    UpdateSNStatus($("#SN").textbox('getText'));
    $("#SN").textbox('setValue', '');
}

function btUpload() {
    var UpdStatus = $("#ToStatus").combobox('getText');
    if (UpdStatus == "") {
        qmsEasyUIalertWarning("Warning", "ToStatus is null");
        return;
    }
    if ($('#filePath').filebox('getValue') == "") {
        qmsEasyUIalertWarning("Warning", "Please choose file!");
        return;
    }
    var file = $("#filePath").next().find('input[type=file]')[0].files;
    if (file) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(file[0]);
        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: 'array' });
            readWorkbook(workbook);
        };
    }
    else {
        alert('请先选择文件');
    }
}

function readWorkbook(workbook) {
    var sheetNames = workbook.SheetNames; //工作表名称集合
    var worksheet = workbook.Sheets[sheetNames[0]]; //这里我们只读取第一张sheet的内容
    var json = XLSX.utils.sheet_to_json(worksheet);
    for (var i = 0; i < json.length; i++) {
        var strValue = json[i];
        for (var val in strValue) {
            UpdateSNStatus(strValue[val]);
        }
    }
    $('#filePath').filebox('setValue', '');
}

function UpdateSNStatus(SN) {
    var item = $("#hidOpenMenuName").val();
    var pu = $("#PU").text();
    var CurStatus = $("#CurrentStatus").textbox('getText');
    var UpdStatus = $("#ToStatus").combobox('getText');
    if (UpdStatus == "") {
        qmsEasyUIalertError("Error", "ToStatus is null");
        return;
    }
    var Reason = $("#Reason").textbox('getText');
    if (Reason == "") {
        qmsEasyUIalertError("Error", "Reason is null");
        return;
    }
    var obj = {};
    obj["UserName"] = $("#UserID").text();
    obj["SN"] = SN;
    obj["CurStatus"] = CurStatus;
    obj["UpdStatus"] = UpdStatus;
    obj["Reason"] = Reason;
    strjson = JSON.stringify(obj);
    strjson = encodeURIComponent(strjson)
    var xmlList = JSON.parse($("#xmlList").val());
    var url = baseUrl + "/SpecialItem/UpdateSNStatus?ObjectSP=" + xmlList[0].ObjectSP + "&DBName=" + xmlList[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    var data = qmsJQueryAjax(url)
    var divmsg = $('#divmsg').html();
    divmsg = divmsg + '<br/>' + data
    $('#divmsg').html(divmsg);
}

function dowloadTemplate() {
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var url = baseUrl + "/DefineData/DownTemplateFile?ObjectName=SpecialItem&DBName=" + DBName + "&type=Template&PU=" + pu;
    url = encodeURI(url);
    qmsJQueryDownloadFile(url)
}
