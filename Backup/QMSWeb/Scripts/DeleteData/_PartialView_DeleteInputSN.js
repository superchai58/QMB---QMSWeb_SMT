
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
    $('#filePath').filebox({
        buttonText: '浏览文件',
        buttonAlign: 'left'
    });
})

$("#SN").textbox({
    inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
        keyup: function (event) {
            if (event.keyCode == 13) {
                deleteInputSN();
            }
        }
    })
});

function bt_click() {
    if ($("#SN").textbox('getText') == "") {
        qmsEasyUIalertWarning("Warning", "SN IS NULL");
        return;
    }
    deleteInputSN($("#SN").textbox('getText'));
    $("#SN").textbox('setValue', '');
}

function dowloadTemplate() {
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var url = baseUrl + "/DefineData/DownTemplateFile?ObjectName=SpecialItem&DBName=" + DBName + "&type=Template&PU=" + pu;
    url = encodeURI(url);
    qmsJQueryDownloadFile(url)
}

function btUpload() {
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
            deleteInputSN(strValue[val]);
        }
    }
    $('#filePath').filebox('setValue', '');
}

function deleteInputSN(SN) {
    var DeleteFlag = "0";
    if ($("#chkQSMS_AOI").is(':checked')) {
        DeleteFlag = "1";
    }
    var obj = {};
    obj["sysName"] = "QMSWeb";
    obj["SN"] = SN;
    obj["DeleteFlag"] = DeleteFlag;
    obj["UID"] = $("#UserID").text();
    var strjson = JSON.stringify(obj);
    var pu = $("#PU").text();
    var xmlList = JSON.parse($("#xmlList").val());
    var url = baseUrl + "/DeleteData/DeleteData_SP?ObjectSP=" + xmlList[0].ObjectSP + "&DBName=" + xmlList[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    var data = qmsJQueryAjax(url)
    var divmsg = $('#divmsg').html();
    divmsg = divmsg + '<br/>' + data
    $('#divmsg').html(divmsg);
}