$(document).ready(function () {
    var item = JSON.parse($("#xmlList").val());
    for (var i = 0; i < item.length; i++) {
        var id = item[i].Item;
        if (id != "") {
            if (item[i].ItemType == "combobox" && item[i].LinkPara == "") {
                refreshData(id, item[i].DataSource, item[i].DataType, item[i].DBName);
            }
            if (item[i].ItemType == "combobox" && item[i].LinkPara != "") {
                refreshData(id, "", item[i].DataType, item[i].DBName);
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
        }
    };
})

function btn_click(idvalue) {
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    var obj = {};
    for (var i = 0; i < item.length; i++) {
        var id = item[i].Item;
        if (id != "") {
            var idValue;
            if (item[i].ItemType == "date" || item[i].ItemType == "datetime") {
                idValue = $("#" + id).datebox("getValue")
                if (idValue != "") {
                    idValue = formatter($("#" + id).datebox("getValue"), item[i].ItemType)
                }
            }
            else if (item[i].ItemType == "combobox") {
                idValue = $("#" + id).combobox('getText');
            }
            else {
                idValue = document.getElementById(id).value;
            }
            //if (idValue == "") {
            //    qmsEasyUIalertWarning("Warning", id + " is empty!");
            //    return;
            //}
            obj[id] = idValue;
        }
    }
    if (checkInterval() == false) {
        return;
    }
    var strjson = JSON.stringify(obj);
    strjson = encodeURIComponent(strjson)
    if (idvalue == "submitQ") {
        var url = baseUrl + "/QueryData/getQueryData?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
        var result = qmsJQueryAjaxJson(url);
        iniDataTable("myDataTable", JSON.parse(result), true, 14, false);
    }
    else {
        var ObjectName = $("#list").combobox('getValue')
        var url = baseUrl + "/QueryData/DownLoadFile?ObjectName=" + ObjectName + "&ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;;
            url = encodeURI(url);
            qmsJQueryDownloadFile(url)
    }

}

function checkInterval() {
    var QueryInterval = $("#QueryInterval").val();
    if (QueryInterval == "") {
        QueryInterval = 30;
    }
    if ($("#BeginDate").length <= 0) {
        if ($("#BeginTime").length <= 0) {
            return true;
        }
    }
    if ($("#BeginTime").length > 0) {
        if ($("#BeginTime").datebox("getValue") == "" && $("#EndTime").datebox("getValue") == "") {
            return true
        }
        if ($("#BeginTime").datebox("getValue") != "" && $("#EndTime").datebox("getValue") != "") {
            var QueryInterval_a = daysBetween($("#BeginTime").datebox("getValue"), $("#EndTime").datebox("getValue"));
            if (QueryInterval_a > QueryInterval) {
                qmsEasyUIalertWarning("Warning", "Query period cannot exceed " + QueryInterval + " Days!");
                return false;
            }
        }
        else {
            qmsEasyUIalertWarning("Warning", "BeginTime/EndTime is null!");
            return false;
        }
    }
    if ($("#BeginDate").length > 0) {
        if ($("#BeginDate").datebox("getValue") == "" && $("#EndDate").datebox("getValue") == "") {
            return true
        }
        if ($("#BeginDate").datebox("getValue") != "" && $("#EndDate").datebox("getValue") != "") {
            var QueryInterval_a = daysBetween($("#BeginDate").datebox("getValue"), $("#EndDate").datebox("getValue"));
            if (QueryInterval_a > QueryInterval) {
                qmsEasyUIalertWarning("Warning", "Query period cannot exceed " + QueryInterval + " Days!");
                return false;
            }
        }
        else {
            qmsEasyUIalertWarning("Warning", "BeginDate/EndDate is null!");
            return false;
        }
    }
    
}

//$(document).ready(function () {
//    $(function () {
//        $('#myDataTable').DataTable();
//    });
//})
//$.ajax({
//    async: false,
//    type: "POST",
//    url: baseUrl + "/QueryData/getQueryData?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson,
//    data: "",
//    success: function (data) {
//        if (data == "No Data") {
//            qmsEasyUIalertWarning("Warning", "No Data");
//        }
//        else {
//            var item = JSON.parse(data);
//            var trStr = "<tr>";
//            var itemValue = item[0];
//            for (var val in itemValue) {
//                trStr = trStr + '<th>' + val + '</th>';
//            }
//            trStr = trStr + "</tr>";
//            for (var i = 0; i < item.length; i++) {
//                var itemValue = item[i];
//                trStr = trStr + "<tr>";
//                for (var val in itemValue) {
//                    trStr = trStr + '<td>' + itemValue[val] + '</td>';
//                }
//                trStr = trStr + "</tr>";
//            }
//            $("#DataTable").html(trStr);
//        }
//    },
//    error: function (msg) {
//        qmsEasyUIalertError("Error", msg);
//    }
//});



