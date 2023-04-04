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
    refDataQSMS("Customer", "SELECT DISTINCT Customer FROM CustomerList", item[0].DBName, "sql");
    $('#filePath').filebox({
        buttonText: '浏览文件',
        buttonAlign: 'left',
    });
    $('#filePathQSMS').filebox({
        buttonText: '浏览文件',
        buttonAlign: 'left',
    });
})

function refDataQSMS(id, DataSource, DBName, type) {
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
        prompt: "PU3选择",
        editable: false,
    });
}

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
        width: "253px",
        prompt: "请先选择Type",
        editable: false,
    });
}

$("#QSMCSN").textbox({
    inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
        keyup: function (event) {
            if (event.keyCode == 13) {
                if ($("#QSMCSN").textbox('getText') == "") {
                    $("#lblmsg").text("SN is null");
                    return;
                }
                if ($("#Customer").combobox('getText') == "") {
                    $("#lblmsg").text("Customer is null");
                    return;
                }
                transQSMSData();
            }
        }
    })
});

$("#SN").textbox({
    inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
        keyup: function (event) {
            if (event.keyCode == 13) {
                if ($("#SN").textbox('getText') == "") {
                    $("#lblmsg").text("SN is null");
                    return;
                }
                if ($("#Type").combobox('getText') == "") {
                    $("#lblmsg").text("Type is null");
                    return;
                }
                transHisData();
            }
        }
    })
});

function transHisData() {
    var obj = {};
    obj["UID"] = $("#UserID").text();
    obj["SN"] = $("#SN").textbox('getText');
    obj["Type"] = $("#Type").combobox('getText');
    var pu = $("#PU").text();
    var item = JSON.parse($("#xmlList").val());
    var arr = item[0].ObjectSP.split(';');
    strjson = encodeURIComponent(JSON.stringify(obj));
    var url = baseUrl + "/SpecialItem/transData?ObjectSP=" + arr[0] + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    var data = qmsJQueryAjax(url);
    $("#lblmsg").text(data);
    $("#SN").textbox('setValue', '');
}

function transQSMSData() {
    var obj = {};
    obj["UID"] = $("#UserID").text();
    obj["SN"] = $("#QSMCSN").textbox('getText')
    obj["Customer"] = $("#Customer").combobox('getText');
    var pu = $("#PU").text();
    var item = JSON.parse($("#xmlList").val());
    var arr = item[0].ObjectSP.split(';');
    strjson = encodeURIComponent(JSON.stringify(obj));
    var url = baseUrl + "/SpecialItem/transData?ObjectSP=" + arr[1] + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    var data = qmsJQueryAjax(url);
    $("#lblmsg").text(data);
    $("#QSMCSN").textbox('setValue', '');
}

function dowloadTemplate() {
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var url = baseUrl + "/DefineData/DownTemplateFile?ObjectName=SpecialItem&DBName=" + DBName + "&type=Template&PU=" + pu;
    url = encodeURI(url);
    qmsJQueryDownloadFile(url)
}

function btUpload(id) {
    if (id == "Upload") {
        var file = $('#filePath').filebox('getValue');
        if (file == "") {
            qmsEasyUIalertWarning("Warning", "Please choose file Path!");
            return;
        }
        if ($("#Type").combobox('getText') == "") {
            $("#lblmsg").text("Type is null");
            return;
        }
    }
    else {
        var file = $('#filePathQSMS').filebox('getValue');
        if (file == "") {
            qmsEasyUIalertWarning("Warning", "Please choose file Path!");
            return;
        }
        if ($("#Customer").combobox('getText') == "") {
            $("#lblmsg").text("Customer is null");
            return;
        }
    }
    
    $("#lblmsg").text("Uploading Data....");
    var files = $("#filePathQSMS").next().find('input[type=file]')[0].files;
    if (id == "Upload") {
        files = $("#filePath").next().find('input[type=file]')[0].files;
    }
    var formData = new FormData(); // FormData 对象
    formData.append("Filedata", files[0]); // 文件对象

    var item_T = JSON.parse($("#xmlList").val());
    var DBName = item_T[0].DBName;
    var item = $("#hidOpenMenuName").val();
    var uid = $("#UserID").text();
    var limitQty = $("#limitQty").val();
    var pu = $("#PU").text();
    $.ajax({
        type: "POST",
        url: baseUrl + "/QueryData/UploadData?Item=" + item + "&DBName=" + DBName + "&UID=" + uid + "&LimitQty=" + limitQty + "&PU=" + pu,
        processData: false,
        contentType: false,
        data: formData,
        success: function (data) {
            $("#lblmsg").text("Exporting Data....");
            $('#filePath').filebox('setValue', '')
            $('#filePathQSMS').filebox('setValue', '')
            $("#lblmsg").text(data);
            if (id == "Upload") {
                transHisData();
            }
            else {
                transQSMSData();
            }
        },
        error: function (data) {
            $('#filePath').filebox('setValue', '')
            qmsEasyUIalertError("Upload", JSON.stringify(data));
        }
    });
}