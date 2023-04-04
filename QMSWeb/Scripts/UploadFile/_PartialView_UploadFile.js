$(document).ready(function () {
    var item = JSON.parse($("#xmlList").val());
    for (var i = 0; i < item.length; i++) {
        var id = item[i].Item;
        $("#" + id).text(item[i].DataSource)
    }
    $('#filePath').filebox({
        buttonText: '浏览文件',
        buttonAlign: 'left',
    });
    refreshFilelist();
});

function refreshFilelist() {
    var pu = $("#PU").text();
    var obj = {};
    obj["FilePath"] = $("#FilePath").text();
    obj["FileFormat"] = $("#FileFormat").text();
    obj["UID"] = $("#UserID").text();
    var strjson = encodeURIComponent(JSON.stringify(obj));
    var xmlList = JSON.parse($("#xmlList").val());
    var url = baseUrl + "/UploadFile/getFileList?XMLString=" + strjson + "&DBName=" + xmlList[0].DBName + "&ObjectName=UploadFile&Type=getFileList&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    iniDataTable("myDataTable", JSON.parse(result), false, 10, true);
    table_tr_click();
}

function table_tr_click() {
    $('#myDataTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#myDataTable tbody').on('click', 'td:nth-child(2)', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        var Dtable = $('#myDataTable').DataTable();
        var Rowdata = Dtable.row(this).data();
        var filename = $("#FilePath").text() + Rowdata["FileName"];
        var pu = $("#PU").text();
        var obj = {};
        obj["FilePath"] = filename;
        obj["UID"] = $("#UserID").text();
        var strjson = encodeURIComponent(JSON.stringify(obj));
        var xmlList = JSON.parse($("#xmlList").val());
        //var url = baseUrl + "/UploadFile/DownLoadFile?XMLString=" + strjson + "&DBName=" + xmlList[0].DBName + "&ObjectName=UploadFile&Type=copyFile&PU=" + pu;
        var url = baseUrl + "/UploadFile/DownLoadFile?filePath=" + $("#FilePath").text() + "&fileName=" + Rowdata["FileName"];
        url = encodeURI(url);
        qmsJQueryDownloadFile(url);
        refreshFilelist();
    });

    $('#myDataTable tbody').on('click', 'td:nth-child(3)', function () {
        var Dtable = $('#myDataTable').DataTable();
        var Rowdata = Dtable.row(this).data();
        $.messager.confirm("Confirm", "Are you sure you want to delete?", function (r) {
            if (!r) {
                return;
            }
            else {
               
                var pu = $("#PU").text();
                var obj = {};
                obj["FilePath"] = $("#FilePath").text() + Rowdata["FileName"];
                obj["UID"] = $("#UserID").text();
                var strjson = encodeURIComponent(JSON.stringify(obj));
                var xmlList = JSON.parse($("#xmlList").val());
                var url = baseUrl + "/UploadFile/delFile?XMLString=" + strjson + "&DBName=" + xmlList[0].DBName + "&ObjectName=UploadFile&Type=delFile&PU=" + pu;
                var result = qmsJQueryAjax(url);
                if (result == "OK") {
                    qmsEasyUIalertInfo("OK", "OK,delete file sucessfully!");
                }
                else {
                    qmsEasyUIalertError("Error", result);
                }
                refreshFilelist();
            }
        });        
    });
}

function btnUpload() {
    var files = $('#filePath').filebox('getValue');
    if (files == "") {
        qmsEasyUIalertWarning("Warning", "Please choose file Path!");
        return;
    }
    var files = $("#filePath").next().find('input[type=file]')[0].files;
    var formData = new FormData();
    formData.append("Filedata", files[0]);
    var filePathName = $("#FilePath").text();
    var fileFormat = $("#FileFormat").text();
    var uid = $("#UserID").text();
    var pu = $("#PU").text();
    var xmlList = JSON.parse($("#xmlList").val());
    $.ajax({
        type: "POST",
        url: baseUrl + "/UploadFile/UploadFile_Insert?filePath=" + filePathName + "&fileFormat=" + fileFormat + "&PU=" + pu + "&UID=" + uid + "&DBName=" + xmlList[0].DBName,
        processData: false,
        contentType: false,
        data: formData,
        success: function (data) {
            $('#filePath').filebox('setValue', '')
            if (data == "OK") {
                qmsEasyUIalertInfo("OK", "OK,Upload file sucessfully!");
                refreshFilelist();
            }
            else {
                qmsEasyUIalertError("Error", data);
            }
        },
        error: function (data) {
            $('#filePath').filebox('setValue', '')
            qmsEasyUIalertError("Upload", JSON.stringify(data));
        }
    });
   
}

