$(document).ready(function () {
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    var obj = {};
    obj["BarCode"] = $("#hidBarCode").val();
    obj["Type"] = "StationData";
    obj["Station"] = $("#Station").text();
    obj["ObjectName"] = "SNTrace";
    var strjson = JSON.stringify(obj);
    strjson = encodeURIComponent(strjson);
    var url = baseUrl + "/QueryData/getQueryData?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    iniDataTable("dtStationDada", JSON.parse(result), false, 10, false);
    //var arraywidth = [80, 100];
    if ($("#Station").text() == "ICT") {
        //document.getElementById("ICTTestData").style.display = "block";
        $("#ICTTestData").attr("style", "display:block;");
        $("#ICTTestData").text("");
        var ICTTestData = JSON.parse(result)
        var strICTTestData = ICTTestData[0]["ICTTestData"]
        $("#ICTTestData").text(strICTTestData);
    }
    else {
        $("#ICTTestData").attr("style", "display:none;");
    }
    //EasyUILoadDataGrid("dtStationDada", "", result, 370, arraywidth, true, false, null, null, null)
})
