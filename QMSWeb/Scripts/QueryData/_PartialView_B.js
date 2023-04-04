
$(document).ready(function () {
    $('#filePath').filebox({
        //buttonText: 'Choose File',
        buttonText: '浏览文件',
        buttonAlign: 'left',
    })
})

function btn_click(idvalue) {
    //var filePath = $('#filePath').filebox('getValue');
    //if (filePath == "") {
    //    qmsEasyUIalertWarning("Warning", "Please choose file Path!");
    //    return;
    //}
    var lblmsg = $("#lblmsg").html();
    if (lblmsg.indexOf("OK,Upload completed,Qty:") == -1) {
        qmsEasyUIalertWarning("Warning", "Data hasn't been uploaded yet ,Please wait!");
        return;
    }
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    var strjson = getXMLList();
    strjson = encodeURIComponent(strjson)
    if (idvalue == "submitQ") {
        var url = baseUrl + "/QueryData/getQueryData?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
        var result = qmsJQueryAjaxJson(url);
        iniDataTable("myDataTable", JSON.parse(result), true,10,false);
        //var tourl = baseUrl + "/QueryData/getQueryData?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson,
        //tourl = encodeURI(tourl);
        //var checkValue = $('input:radio[name="QueryType"]:checked').val();
        //var arraywidth = null;
        //arraywidth = [80, 100];
        //qmsEasyUILoadDataGrid("DataTable", "", tourl, 400, arraywidth, true, false, null, null, null);
    }
    else {
        if (item.length > 0) {
            var url = baseUrl + "/QueryData/DownLoadFile?ObjectName=''&ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
            url = encodeURI(url);
            qmsJQueryDownloadFile(url)
        }
    }
}

function btnUpload() {
    var file = $('#filePath').filebox('getValue');
    if (file == "") {
        qmsEasyUIalertWarning("Warning", "Please choose file Path!");
        return;
    }
    $('#submitU').attr("disabled", true);
    $("#lblmsg").text("Uploading Data....");
    var files = $("#filePath").next().find('input[type=file]')[0].files;

    var formData = new FormData(); // FormData 对象
    formData.append("Filedata", files[0]); // 文件对象

    var item_T = JSON.parse($("#xmlList").val());
    //var obj = {};
    //for (var i = 0; i < item.length; i++) {
    //    var id = item[i].Item;
    //    if (id != "") {
    //        var idValue = document.getElementById(id).value;
    //        if (idValue == "") {
    //            qmsEasyUIalertWarning("Warning", id + " is empty!");
    //            return;
    //        }
    //        idValue = document.getElementById(id).value;
    //        obj[id] = idValue;
    //    }
    //}
    //var strjson = JSON.stringify(obj);
    var DBName = item_T[0].DBName;
    var item = $("#ObjectName").val();
    var uid = $("#UserID").text();
    var limitQty = $("#limitQty").html();
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
            if (data.indexOf("OK,Upload completed,Qty:") == 0) {
                $('#submitU').attr("disabled", false);
            }
        },
        error: function (data) {
            $('#filePath').filebox('setValue', '')
            $('#submitU').attr("disabled", false);
            qmsEasyUIalertError("Upload", JSON.stringify(data));
        }
    });
}

function dowloadTemplate() {
    var pu = $("#PU").text();
    var url = baseUrl + "/QueryData/DownTemplateFile?ObjectName=QueryData&Type=Template&PU=" + pu;
    url = encodeURI(url);
    qmsJQueryDownloadFile(url)
}

