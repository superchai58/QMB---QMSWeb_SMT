
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

$("#SNDID").textbox({
    inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
        keyup: function (event) {
            if (event.keyCode == 13) {
                getLaserData("");
            }
        }
    })
});

function getLaserData(action) {
    var itemVal = $("#hidOpenMenuName").val();
    var pu = $("#PU").text();
    var obj = {};
    if ($("#SNDID").textbox('getText') == "") {
        qmsEasyUIalertWarning("Warning", "SNID IS NULL");
        return;
    }
    obj["SNDID"] = $("#SNDID").textbox('getText');
    var itemDBName = JSON.parse($("#xmlList").val());
    var strjson = encodeURIComponent(JSON.stringify(obj));
   
    var type = "getLaserData";
    var url = baseUrl + "/DeleteData/getLaserData?JsonString=" + strjson + "&DBName=" + itemDBName[0].DBName + "&Item=" + itemVal + "&type=" + type + "&PU=" + pu;
    if (action == "Excel") {
        url = baseUrl + "/DeleteData/DownLoadFile?JsonString=" + strjson + "&DBName=" + itemDBName[0].DBName + "&Item=" + itemVal + "&type=" + type + "&PU=" + pu;
        url = encodeURI(url);
        qmsJQueryDownloadFile(url)
        return
    }
    var result = qmsJQueryAjaxJson(url);
    iniDataTable("myDtTable", JSON.parse(result), true, 15, true);
}

function bt_click(actionid) {
    if ($("#SNDID").textbox('getText') == "") {
        qmsEasyUIalertWarning("Warning", "SNID IS NULL");
        return;
    }
    if (actionid == "Excel") {
        getLaserData("Excel");
        return;
    }
    $('#divmsg').html("");
    var strjson = getXMLList();
    var pu = $("#PU").text();
    var xmlList = JSON.parse($("#xmlList").val());
    var url = baseUrl + "/DeleteData/DeleteData_SP?ObjectSP=" + xmlList[0].ObjectSP + "&DBName=" + xmlList[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    var data = qmsJQueryAjax(url)
    $('#divmsg').html(data);
}
