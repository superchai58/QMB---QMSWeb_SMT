
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

    $('#filePath').filebox({
        buttonText: '浏览文件',
        buttonAlign: 'left',
    });
    if ($("#list").combobox('getValue') == "BaseData") {
        $("#Station").textbox({ disabled: true })
    };
    if ($("#list").combobox('getValue') == "Q_LostLabel") {
        var height = $(window).height() - 120;
        $("#myDataTable_Filter_DIV").height(height);
        $("#myDataTable_DIV").height(height);
    }
    if ($("#list").combobox('getValue') == "ReleaseWO") {
        var height = $(window).height() - 120;
        $("#myDataTable_DIV").height(height);
    }
    //setLayoutHeight();
})

function btnWIPWO_click(idvalue) {
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    if (idvalue == "submitQ") {
        $("#WOdetail").val('');
        var strjson = getparaWIPWO();
        strjson = encodeURIComponent(strjson)
        $("#tree").tree({
            url: baseUrl + "/QueryData/GetTreeJson?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu,
            animate: true,
            onClick: function (node) {
                if ($(this).tree('getParent', node.target) == null) {
                    return;
                }
                var ParenNode = $(this).tree("getParent", node.target);
                if (node.text == "NOData") {
                    return;
                }
                else {
                    var strWO = node.text.split(',');
                    getSummaryinfo(ParenNode.text, strWO[0], pu, item[0].ObjectSP, item[0].DBName);
                }

            }
        });
    }
    else {
        strjson = $("#WOdetail").val();
        if (strjson == "") {
            qmsEasyUIalertMessage("Warning","请先查询后再导出!");
            return;
        }
        strjson = encodeURIComponent(strjson);
        var url = baseUrl + "/QueryData/DownLoadFile?ObjectName=''" + "&ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;;
        url = encodeURI(url);
        qmsJQueryDownloadFile(url)
    }
}

function btnRW_click(idvalue) {
    if ($("#WO").textbox('getText') == "") {
        qmsEasyUIalertMessage("Warning", "工单未输入!");
        return
    }
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    //var strjson = getparaRW();
    var strjson = getXMLList();
    strjson = encodeURIComponent(strjson)
    if (idvalue == "submitQ") {
        var url = baseUrl + "/QueryData/getQueryData?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
        var result = qmsJQueryAjaxJson(url);
        iniDataTable_scrollY("myDataTable", JSON.parse(result), $("#myDataTable_DIV").height() - 80);
        //strjson = getparaRW("ReworkQty");
        //url = baseUrl + "/QueryData/getQueryData?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
        //result = qmsJQueryAjaxJson(url);
        //var strQty = JSON.parse(result);
        //$("#ReworkQty").val(strQty[0]["Qty"].toString());
    }
    else {
        var url = baseUrl + "/QueryData/DownLoadFile?ObjectName=''" + "&ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;;
        url = encodeURI(url);
        qmsJQueryDownloadFile(url)
    }
}

function btn_click(idvalue) {
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    
    if (checkInterval() == false) {
        return;
    }
    var strjson = getpara(idvalue);
    strjson = encodeURIComponent(strjson)
    if (idvalue == "submitQ") {
        var url = baseUrl + "/QueryData/getQueryData?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
        var result = qmsJQueryAjaxJson(url);
        var arraywidth = [20, 50];
        EasyUILoadDataGrid("myDataTableSum", "", result, 150, arraywidth, true, false, null, null, getDetailinfo)
    }
    else {
        var url = baseUrl + "/QueryData/DownLoadFile?ObjectName=''" + "&ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;;
        url = encodeURI(url);
        qmsJQueryDownloadFile(url)
    }
}

function btnLost_click(idvalue) {
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    var strjson = getparaLost(idvalue);
    strjson = encodeURIComponent(strjson)
    if (idvalue == "submitF") {
        var url = baseUrl + "/QueryData/getQueryData?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
        var result = qmsJQueryAjaxJson(url);
        iniDataTable_scrollY("myDataTable_Filter", JSON.parse(result), $("#myDataTable_DIV").height() - 80);
        return;
    }
    if (idvalue == "submitQ") {
        var url = baseUrl + "/QueryData/getQueryData?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
        var result = qmsJQueryAjaxJson(url);
        iniDataTable_scrollY("myDataTable", JSON.parse(result), $("#myDataTable_DIV").height() - 80);
    }
    else {
        var url = baseUrl + "/QueryData/DownLoadFile?ObjectName=''" + "&ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;;
        url = encodeURI(url);
        qmsJQueryDownloadFile(url)
    }
}

function btnBase_click(idvalue) {
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    var strjson = getparaBase();
    strjson = encodeURIComponent(strjson)
    if (idvalue == "submitQ") {
        var url = baseUrl + "/QueryData/getQueryData?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
        var result = qmsJQueryAjaxJson(url);
        iniDataTable("myDataTable", JSON.parse(result), true, 20, false);
    }
    else {
        var url = baseUrl + "/QueryData/DownLoadFile?ObjectName=''" + "&ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;;
        url = encodeURI(url);
        qmsJQueryDownloadFile(url)
    }
}

function btnFVS_click(idvalue) {
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    var strjson = getparaFVS();
    strjson = encodeURIComponent(strjson)
    if (idvalue == "submitQ") {
        var url = baseUrl + "/QueryData/getQueryData?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
        var result = qmsJQueryAjaxJson(url);
        iniDataTable("myDataTable", JSON.parse(result), true, 15, false);
        if ($("#OPID").textbox('getText') == "") {
            table_tr_dblclick();
        }
    }
    else {
        var url = baseUrl + "/QueryData/DownLoadFile?ObjectName=''" + "&ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;;
        url = encodeURI(url);
        qmsJQueryDownloadFile(url)
    }
}

function table_tr_dblclick() {
    $('#myDataTable tbody').on('dblclick', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        var Dtable = $('#myDataTable').DataTable();
        var Rowdata = Dtable.row(this).data();
        var obj = {};
        obj["GroupOption"] = $('input:radio[name="radioGroupOption"]:checked').val();
        obj["stage"] = "";
        obj["Model"] = $("#Model").textbox('getText');
        obj["Station"] = Rowdata["Line"].toString();
        if ($('input:radio[name="radioGroupOption"]:checked').val() == "OPID") {
            obj["strvalue"] = Rowdata["OPID"].toString();
        }
        else if ($('input:radio[name="radioGroupOption"]:checked').val() == "TestStation") {
            obj["strvalue"] = Rowdata["TestStation"].toString();
        }
        else if ($('input:radio[name="radioGroupOption"]:checked').val() == "Machine") {
            obj["strvalue"] = Rowdata["StanFlag"].toString();
        }
        else {
            obj["strvalue"] = "";
        }
        if ($("#list").combobox('getValue') == "QCReport") {
            if ($('input:radio[name="radioGroupOption"]:checked').val() == "OPID") {
                obj["TStation"] = Rowdata["Station"].toString();
            }
            else {
                obj["TStation"] = Rowdata["TestStation"].toString();
            }
        }
        var idValue = $("#BeginDate").datebox("getValue");
        idValue = formatter(idValue, "datetime")
        obj["DtpBegin"] = idValue;
        idValue = $("#EndDate").datebox("getValue");
        idValue = formatter(idValue, "datetime");
        obj["DtpEnd"] = idValue;
        var item = JSON.parse($("#xmlList").val());
        var pu = $("#PU").text();
        var strjson = JSON.stringify(obj);
        strjson = encodeURIComponent(strjson);
        var url = baseUrl + "/QueryData/DownLoadFile?ObjectName=''" + "&ObjectSP=Rpt_FvsReport_TestDetail&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;;
        if ($("#list").combobox('getValue') == "QCReport") {
            url = baseUrl + "/QueryData/DownLoadFile?ObjectName=''" + "&ObjectSP=Rpt_QCReport_TestDetail&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;;
        }
        url = encodeURI(url);
        qmsJQueryDownloadFile(url)
    });

}

function getDetailinfo(id, index, data) {
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    var row = $(id).datagrid('getRows')[index];
    $(id).datagrid("unselectRow", index);
    for (var col in row) {
        if ($("#" + col).length <= 0) {
            continue;
        }
        var type = document.getElementById(col).type;
        if (type == "select-one") {
            $("#" + col).combobox('setValue', row[col]);
        }
        else {
            $("#" + col).textbox('setValue', row[col]);
        }
    }
    var strjson = getpara("submitE");
    strjson = encodeURIComponent(strjson);
    var url = baseUrl + "/QueryData/getQueryData?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    iniDataTable("myDataTableDetail", JSON.parse(result), true, 8, false);
    //clearData();
}

function getDetailinfoWIPWO(id, index, data) {
    var strtree = $("#tree").tree('getSelected').text;
    var strWO = strtree.split(',');
    var obj = {};
    obj["ObjectName"] = "WIPQuery";
    obj["Type"] = "NormalDetail";
    var strBeginDate = $("#BeginDate").datebox("getValue")
    if (strBeginDate != "") {
        strBeginDate = formatter($("#BeginDate").datebox("getValue"), 'datetime')
    }
    var strEndDate = $("#EndDate").datebox("getValue")
    if (strEndDate != "") {
        strEndDate = formatter($("#EndDate").datebox("getValue"), 'datetime')
    }
    obj["BeginDate"] = strBeginDate;
    obj["EndDate"] = strEndDate;
    obj["WO"] = strWO[0];
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    var row = $(id).datagrid('getRows')[index];
    $(id).datagrid("unselectRow", index);
    for (var col in row) {
        if (col == "Line") {
            if (row[col] == "NoData") {
                $("#WOdetail").val('');
                return;
            }
        }
        if (col == "Status") {
            obj["Status"] = row[col];
        }
    }
    
    var strjson = JSON.stringify(obj);
    $("#WOdetail").val(strjson);
    strjson = encodeURIComponent(strjson);
    var url = baseUrl + "/QueryData/getQueryData?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    iniDataTable("myDataTableDetail", JSON.parse(result), true, 8, false);
    //clearData();
}

function getSummaryinfo(line, WO, pu, ObjectSP, DBName) {
    var obj = {};
    obj["ObjectName"] = "WIPQuery";
    obj["Type"] = "NormalSummary";
    var strBeginDate = $("#BeginDate").datebox("getValue")
    if (strBeginDate != "") {
        strBeginDate = formatter($("#BeginDate").datebox("getValue"), 'datetime')
    }
    var strEndDate = $("#EndDate").datebox("getValue")
    if (strEndDate != "") {
        strEndDate = formatter($("#EndDate").datebox("getValue"), 'datetime')
    }
    obj["BeginDate"] = strBeginDate;
    obj["EndDate"] = strEndDate;
    obj["WO"] = WO;
    obj["Line"] = line;
    var strjson = JSON.stringify(obj);
    var url = baseUrl + "/QueryData/getQueryData?ObjectSP=" + ObjectSP + "&DBName=" + DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    var arraywidth = [20, 50];
    EasyUILoadDataGrid("myDataTableSum", "", result, 150, arraywidth, true, false, null, null, getDetailinfoWIPWO)
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

function getpara(idvalue) {
    var item = JSON.parse($("#xmlList").val());
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
            obj[id] = idValue;
            var type = "NormalSummary";
            if ($("#list").combobox('getValue') == "WIPQuery" && idvalue == "submitQ") {
                if ($("#chkRCTO").is(':checked')) {
                    type = "chkRCTOSummary";
                }
                if ($("#chkQC").is(':checked')) {
                    type = "chkQCSummary";
                }
                obj["Type"] = type;
            }
            if ($("#list").combobox('getValue') == "WIPQuery" && idvalue == "submitE") {
                type = "NormalDetail";
                if ($("#chkRCTO").is(':checked')) {
                    type = "chkRCTODetail";
                    obj["Station"] = document.getElementById("Station").value;
                }
                obj["Type"] = type;
            }
        }
    }
    var strjson = JSON.stringify(obj);
    return strjson;
}

function getparaLost(idvalue) {
    var obj = {};
    obj["WO"] = $("#WO").textbox('getText');
    if (idvalue == "submitF") {
        obj["Duration"] = $("#Duration").textbox('getText');
        obj["Status"] = $("#Status").combobox('getText');
    }
    var strjson = JSON.stringify(obj);
    return strjson;
}

function getparaRW() {
    var obj = {};
    obj["WO"] = $("#WO").textbox('getText');
    obj["ObjectName"] = document.getElementById("ObjectName").value
    //obj["Type"] = type;
    var strjson = JSON.stringify(obj);
    return strjson;
}

function getparaFVS() {
    var obj = {};
    obj["GroupOption"] = $('input:radio[name="radioGroupOption"]:checked').val();
    obj["Model"] = $("#Model").textbox('getText');
    obj["StrOPID"] = $("#OPID").textbox('getText');
    obj["Line"] = $("#Line").combobox('getText');
    var idValue = $("#BeginDate").datebox("getValue");
    idValue = formatter(idValue, "datetime")
    obj["BeginDate"] = idValue;
    idValue = $("#EndDate").datebox("getValue");
    idValue = formatter(idValue, "datetime");
    obj["EndDate"] = idValue;
    var strjson = JSON.stringify(obj);
    return strjson;
}

function getparaBase() {
    var obj = {};
    obj["DB"] = $('input:radio[name="radioDB"]:checked').val();
    obj["BatchOne"] = $('input:radio[name="radioSN"]:checked').val();
    obj["Mode"] = $('input:radio[name="radioOption"]:checked').val();
    obj["SN"] = $("#SN").textbox('getText');
    obj["Table"] = $("#Station").combobox('getText');
    obj["UID"] = $("#UserID").text();
    var strjson = JSON.stringify(obj);
    return strjson;
}

function getparaWIPWO() {
    var xmlList = JSON.parse($("#xmlList").val());
    var obj = {};
    for (var i = 0; i < xmlList.length; i++) {
        var id = xmlList[i].Item;
        if (id.indexOf('[') == 0 && id.indexOf(']') == 2) {
            id = id.substring(3);
        }
        if ($("#" + id).length <= 0) {//排除不存在的标签
            continue;
        }
        if (xmlList[i].ItemType == "button") {//排除button标签
            continue;
        }
        var idValue;
        if (xmlList[i].ItemType == "date" || xmlList[i].ItemType == "datetime") {
            idValue = $("#" + id).datebox("getValue")
            if (idValue == "") {
                qmsEasyUIalertWarning("Warning", id + " is empty!");
                return;
            }
            idValue = formatter(idValue, xmlList[i].ItemType)
        }
        else if (xmlList[i].ItemType == "combobox") {
            idValue = $("#" + id).combobox('getText');
        }
        else {
            idValue = document.getElementById(id).value;
        }
        obj[id] = idValue;
    }
    obj["Type"] = "ParentNodeList";
    return JSON.stringify(obj);
}

function dowloadTemplate() {
    var pu = $("#PU").text();
    var url = baseUrl + "/QueryData/DownTemplateFile?ObjectName=QueryData&Type=Template&PU=" + pu;
    url = encodeURI(url);
    qmsJQueryDownloadFile(url)
}

function radioOPT_Click(id) {
    var checkValue = $('input:radio[name="radioOption"]:checked').val();
    if (checkValue == "Station") {
        $("#Station").textbox({ disabled: false })
    }
    else {
        $("#Station").textbox({ disabled: true })
    }
}

function btnUpload() {
    var file = $('#filePath').filebox('getValue');
    if (file == "") {
        qmsEasyUIalertWarning("Warning", "Please choose file Path!");
        return;
    }
    $("#lblmsg").text("Uploading Data....");
    var files = $("#filePath").next().find('input[type=file]')[0].files;

    var formData = new FormData(); // FormData 对象
    formData.append("Filedata", files[0]); // 文件对象

    var item_T = JSON.parse($("#xmlList").val());
    var DBName = item_T[0].DBName;
    var uid = $("#UserID").text();
    var limitQty = $("#limitQty").val();
    var pu = $("#PU").text();
    $.ajax({
        type: "POST",
        url: baseUrl + "/QueryData/UploadData?Item=QueryBySN&DBName=" + DBName + "&UID=" + uid + "&LimitQty=" + limitQty + "&PU=" + pu,
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

function clearData() {
    var item = JSON.parse($("#xmlList").val());

    for (var i = 0; i < item.length; i++) {
        var id = item[i].Item;
        if ($("#" + id).length <= 0) {
            continue;
        }
        if (id == "ObjectName" || id == "BeginDate" || id == "EndDate" || id=="WO") {
            continue;
        }
        var type = document.getElementById(id).type;
        if (type == "select-one") {
            $("#" + id).combobox('setValue', '');
        }
        else {
            $("#" + id).textbox('setValue', '');
        }
    }
}

function setLayoutHeight() {
    var height = $(window).height() - 20;
    $('#el').attr('style', 'width:100%;height:' + height + 'px');
    $('#el').layout('resize', {
        width: '100%',
        height: height + 'px'
    });
}

//$(window).resize(function () {
//    setLayoutHeight();
//});