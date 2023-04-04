
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
    }
    $('#filePath').filebox({
        buttonText: '浏览文件',
        buttonAlign: 'left',
    });
    getdata();
    table_tr_click();
})

function table_tr_click() {
    $('#myDataTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        var Dtable = $('#myDataTable').DataTable();
        var Rowdata = Dtable.row(this).data();
        var item = JSON.parse($("#xmlList").val());
        for (var i = 0; i < item.length; i++) {
            var id = item[i].Item;
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
        editable: false,
    });
}

function bt_click(actionid) {
    var strjson = getXMLList_Upload();
    var pu = $("#PU").text();
    var uid = $("#UserID").text();
    var limitQty = $("#limitQty").val();
    var itemDBName = JSON.parse($("#xmlList").val());
    var ObjectName = $("#list").combobox('getValue');
    DBName = itemDBName[0].DBName;
    strjson = encodeURIComponent(strjson)
    if ($("#delALL").is(':checked')) {
        if (actionid == "Delete") {
            actionid = "delALL";
        }
    }
    if (actionid == "Excel") {
        url = baseUrl + "/UploadData/DownLoadFile?DBName=" + DBName + "&ObjectName=" + ObjectName + "&PU=" + pu;
        url = encodeURI(url);
        qmsJQueryDownloadFile(url)
        return
    }
    var url = baseUrl + "/UploadData/QMS_UploadData?JsonString=" + strjson + "&DBName=" + DBName + "&ObjectName=" + ObjectName + "&Type=" + actionid + "&LimitQty=" + limitQty + "&PU=" + pu + "&uid=" + uid;  
    var data = qmsJQueryAjax(url)
    if (data == "OK") {
        getdata();
        table_tr_click();
        qmsEasyUIalertInfo("OK", "OK," + actionid + " data sucessfully!");
    }
    else {
        qmsEasyUIalertError("Error", data);
    }
}

function dowloadTemplate() {
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var ObjectName = $("#list").combobox('getValue');
    var url = baseUrl + "/UploadData/DownTemplateFile?DBName=" + DBName + "&ObjectName=" + ObjectName + "&PU=" + pu;
    url = encodeURI(url);
    qmsJQueryDownloadFile(url)
} 

function btUpload() {
    var file = $('#filePath').filebox('getValue');
    if (file == "") {
        qmsEasyUIalertWarning("Warning", "Please choose file Path!");
        return;
    }
    var ObjectName = $("#list").combobox('getValue');
    var item_T = JSON.parse($("#xmlList").val());
    var DBName = item_T[0].DBName;
    var uid = $("#UserID").text();
    var pu = $("#PU").text();
    var limitQty = $("#limitQty").val();
    if (limitQty == "") {
        qmsEasyUIalertWarning("Warning", "Please define limitQty,call QMS!");
        return;
    }
    $("#lblmsg").text("Uploading Data....");
    var files = $("#filePath").next().find('input[type=file]')[0].files;
    var formData = new FormData(); // FormData 对象
    formData.append("Filedata", files[0]); // 文件对象
    $.ajax({
        type: "POST",
        url: baseUrl + "/UploadData/QMS_UploadData?JsonString=&DBName=" + DBName + "&ObjectName=" + ObjectName + "&Type=Upload&LimitQty=" + limitQty + "&PU=" + pu + "&uid=" + uid,
        cache: false,
        processData: false,
        contentType: false,
        data: formData,
        success: function (data) {
            $('#filePath').filebox('setValue', '')
            $("#lblmsg").text(data);
            getdata();
            table_tr_click();
        },
        error: function (data) {
            $('#filePath').filebox('setValue', '')
            qmsEasyUIalertError("Upload", JSON.stringify(data));
        }
    });
}

function getdata() {
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    var ObjectName = $("#list").combobox('getValue');
    var DBName = item[0].DBName;
    var url = baseUrl + "/UploadData/getData?DBName=" + DBName + "&ObjectName=" + ObjectName + "&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    iniDataTable("myDataTable", JSON.parse(result), false, 15, true);
}
