function bt_click(actionid) {
    $('#divmsg').html("");
    var obj = {};
    obj["SerialNumber"] = $("#SN").textbox('getText');
    obj["OPID"] = $("#UserID").text();
    obj["Type"] = actionid;
    var strjson = encodeURIComponent(JSON.stringify(obj));
    var pu = $("#PU").text();
    var xmlList = JSON.parse($("#xmlList").val());
    var url = baseUrl + "/DeleteData/DeleteData_SP?ObjectSP=" + xmlList[0].ObjectSP + "&DBName=" + xmlList[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    if (actionid == "Query") {
        url = baseUrl + "/DeleteData/getDeleteData?ObjectSP=" + xmlList[0].ObjectSP + "&DBName=" + xmlList[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
        var result = qmsJQueryAjaxJson(url);
        iniDataTable("myDtTable", JSON.parse(result), true, 15, true);
        return;
    }
    var data = qmsJQueryAjax(url)
    $('#divmsg').html(data);
}