
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
    };
    $('#filePath').filebox({
        buttonText: '浏览文件',
        buttonAlign: 'left',
    });
    //reftable();
    refreshdttable("ini_Data", false, 14, true);
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
        prompt: "请先选择Type",
        editable: false,
    });
}

function dowloadTemplate() {
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var url = baseUrl + "/DefineData/DownTemplateFile?ObjectName=SpecialItem&DBName=" + DBName + "&type=Template&PU=" + pu;
    url = encodeURI(url);
    qmsJQueryDownloadFile(url)
}

function bt_click(id) {
   
    if ($("#Reason").textbox('getText') == "") {
        qmsEasyUIalertWarning("Warning", "Reason IS NULL");
        return;
    }
    if (id == "Lockbatch" || id == "UnLockbatch") {
        $("#LockSNFail").val("");
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
                readWorkbook(workbook,id);
            };
        }
        else {
            alert('请先选择文件');
            return;
        }
    }
    else if (id == "Lock" || id == "UnLock") {
        if ($("#SN").textbox('getText') == "") {
            qmsEasyUIalertWarning("Warning", "SN IS NULL");
            return;
        }
        LockSN(id, "");
        $("#SN").textbox('setValue', "");
        $("#Reason").textbox('setValue', "");
    }
    else {
        return;
    }
    refreshdttable("ini_Data", false, 14, true);
}

function readWorkbook(workbook,id) {
    var sheetNames = workbook.SheetNames; //工作表名称集合
    var worksheet = workbook.Sheets[sheetNames[0]]; //这里我们只读取第一张sheet的内容
    var json = XLSX.utils.sheet_to_json(worksheet);
    if ($("#limitQty").val() < json.length) {
        qmsEasyUIalertWarning("Warning", "Upload Qty(" + json.length + ") exceed the Maximum allowed Qty(" + $("#limitQty").val() + ")");
        return;
    }
    for (var i = 0; i < json.length; i++) {
        var strValue = json[i];
        for (var val in strValue) {
            LockSN(id, strValue[val]);            
        }
    }
    if ($("#LockSNFail").val() != "") {
        DownLoadLockFailSN();
    }
    $('#filePath').filebox('setValue', '');
}

function LockSN(id, SN) {
    var obj = {};
    var type = "Lock";
    var pu = $("#PU").text();
    var checkValue = $('input:radio[name="Lockradio"]:checked').val();
    if (checkValue == "Lock") {
        type = "Lock";
        if (id == "UnLockbatch" || id == "UnLock") {
            type = "UnLock";
        }
    }
    if (checkValue == "LockModel") {
        type = "LockModel";
        if (id == "UnLockbatch" || id == "UnLock") {
            type = "UnLockModel";
        }
    }
    if (checkValue == "LockPacking") {
        type = "LockPacking";
        if (id == "UnLockbatch" || id == "UnLock") {
            type = "UnLockPacking";
        }
    }
    if (SN == "") {
        SN = $("#SN").textbox('getText');
    }
    obj["type"] = type;
    obj["SN"] = SN;
    obj["Reason"] = $("#Reason").textbox('getText');
    obj["UID"] = $("#UserID").text();
    var strjson = encodeURIComponent(JSON.stringify(obj));
    var xmlList = JSON.parse($("#xmlList").val());
    var url = baseUrl + "/SpecialItem/LockSN?ObjectSP=" + xmlList[0].ObjectSP + "&DBName=" + xmlList[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    var data = qmsJQueryAjax(url);
    if (id == "Lockbatch" || id == "UnLockbatch") {
        if (data != "OK") {
            var failList = $("#LockSNFail").val();
            failList = failList + "{\"SN\":\"" + SN + "\",\"Reason\":\"" + data + "\"},";
            $("#LockSNFail").val(failList);
        }
        
    }
    var divmsg = $('#divmsg').html();
    divmsg = divmsg + '[' + SN + ']' + data + '<br/>'
    $('#divmsg').html(divmsg);
}

function DownLoadLockFailSN() {
    var dataSource = $("#LockSNFail").val();
    dataSource = dataSource.substr(0, dataSource.length - 1);
    dataSource = "[" + dataSource + "]";
    dataSource = JSON.parse(dataSource);
    var ws = XLSX.utils.json_to_sheet(dataSource);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "People");
    XLSX.writeFile(wb, "FailSN.xlsx");
}

function refreshdttable(type, scrollX, iDisplayLength, searching) {
    var obj = {};
    obj["LockType"] = $('input:radio[name="Lockradio"]:checked').val();
    var strjson = JSON.stringify(obj);
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var itemVal = $("#hidOpenMenuName").val();
    var url = baseUrl + "/DefineData/getData_Json?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + itemVal + "&Type=" + type + "&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    iniDataTable("myDtTable", JSON.parse(result), scrollX, iDisplayLength, searching);
}

function radio_Click(val) {
    refreshdttable("ini_Data", false, 14, true);
}