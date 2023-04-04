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
        buttonAlign: 'left',
    });
})

function bt_click() {
    if ($("#SNDID").textbox('getText') == "") {
        qmsEasyUIalertWarning("Warning", "SNID IS NULL");
        return;
    }
    $("#lblmsg").text(data);
    var strjson = getPara("");
    var pu = $("#PU").text();
    var xmlList = JSON.parse($("#xmlList").val());
    var url = baseUrl + "/DeleteData/DeleteData_SP?ObjectSP=" + xmlList[0].ObjectSP + "&DBName=" + xmlList[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    var data = qmsJQueryAjax(url)
    $("#lblmsg").text(data);
    $("#SNDID").textbox('setValue', '');
}

function btUpload() {
    var files = $('#filePath').filebox('getValue');
    if (files == "") {
        qmsEasyUIalertWarning("Warning", "Please choose file Path!");
        return;
    }
    $("#lblmsg").text("Uploading Data....");
    var files = $("#filePath").next().find('input[type=file]')[0].files;
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
            $('#filePath').filebox('setValue', '')
            $("#lblmsg").text(data);
            deletedata();
        },
        error: function (data) {
            $('#filePath').filebox('setValue', '')
            qmsEasyUIalertError("Upload", JSON.stringify(data));
        }
    });
    
}

function getPara(type) {
    var obj = {};
    obj["SNDID"] = $("#SNDID").textbox('getText');
    obj["UID"] = $("#UserID").text();
    obj["Type"] = type;
    return JSON.stringify(obj);
}

function deletedata() {
    var strjson = getPara("batch");
    var pu = $("#PU").text();
    var xmlList = JSON.parse($("#xmlList").val());
    var url = baseUrl + "/DeleteData/DeleteData_SP?ObjectSP=" + xmlList[0].ObjectSP + "&DBName=" + xmlList[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    var data = qmsJQueryAjax(url)
    $("#lblmsg").text(data);
}

function dowloadTemplate() {
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var url = baseUrl + "/DefineData/DownTemplateFile?ObjectName=SpecialItem&DBName=" + DBName + "&type=Template&PU=" + pu;
    url = encodeURI(url);
    qmsJQueryDownloadFile(url)
}