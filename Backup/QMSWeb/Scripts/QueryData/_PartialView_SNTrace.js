
$(document).ready(function () {
    $("#SerialNumber").combobox({
        url: "",
        valueField: "SerialNumber",
        textField: "SerialNumber",
        height: "20px",
        width: "255px",
        editable: false,
        prompt: "All SN of AOI",
        onSelect: function () {
            onSelectFun();
        },
    });
    $("#BarCode").searchbox({
        prompt: '输入SN或AOI查询...',
        searcher: function (e) {
            getSNinfo("");
        }
    });
    topmenuClick();
    topmenuliClick();
})

function getSNinfo(id) {
    //value = $("#BarCode").searchbox('getValue');
    //$("#BarCode").searchbox('setValue', '');
    //$("#hidBarCode").val(value);
    //if (value == "") {
    //    qmsEasyUIalertWarning("Waring", "BarCode is null");
    //    return
    //}
    var value = $("#BarCode").searchbox('getValue');
    if (value == "") {
        value = $("#hidBarCode").val();
        if (value == "") {
            qmsEasyUIalertWarning("Waring", "BarCode is null");
            return
        }
    }
    else {
        $("#BarCode").searchbox('setValue', '');
        $("#hidBarCode").val(value);
    }
    if (id == "submitE") {
        getTraceinfo(value, id);
        return
    }
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    var obj = {};
    obj["BarCode"] = value;
    obj["Type"] = "getSNinfo";
    obj["ObjectName"] = "SNTrace";
    var strjson = JSON.stringify(obj);
    strjson = encodeURIComponent(strjson);
    var url = baseUrl + "/QueryData/getSNinfo?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    $("#SerialNumber").combobox({
        url: url,
        valueField: "SerialNumber",
        textField: "SerialNumber",
        height: "20px",
        editable: false,
        prompt: "All SN of AOI",
    });
    getTraceinfo(value,id);
}

function onSelectFun() {
    var value = $("#SerialNumber").combobox('getValue');
    $("#hidBarCode").val(value);
    getTraceinfo(value,"");
}

function getTraceinfo(val,id) {
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    var obj = {};
    obj["BarCode"] = val;
    obj["Type"] = "getTraceinfo";
    obj["ObjectName"] = "SNTrace";
    var strjson = JSON.stringify(obj);
    strjson = encodeURIComponent(strjson);
    var url = baseUrl + "/QueryData/getQueryData?ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    if (id == "submitE") {
        var url = baseUrl + "/QueryData/DownLoadFile?ObjectName=''" + "&ObjectSP=" + item[0].ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;;
        url = encodeURI(url);
        qmsJQueryDownloadFile(url);
        return;
    }
    var result = qmsJQueryAjaxJson(url);
    iniDataTable("dtTraceinfo", JSON.parse(result), false, 15, false);
    //var arraywidth = [80, 100];
    //EasyUILoadDataGrid("dtTraceinfo", "", result, 450, arraywidth, true, false, null, null, null)

    var hidOpenMenuName = $("#hidOpenMenuName").val();
    if (hidOpenMenuName == "") {
        hidOpenMenuName = "SP";
    }
    var tourl = baseUrl + "/QueryData/getMenuList?ObjectName=" + hidOpenMenuName + "&type=StationData&UID=&PU=" + pu;
    qmsEasyUITab(hidOpenMenuName, tourl);

}

function btn_click(id) {

    getSNinfo(id);
}

function topmenuClick() {
    $(".sf_topmenu a").click(function () {
        var value = $("#hidBarCode").val();
        if (value == "") {
            qmsEasyUIalertWarning("Waring", "BarCode is null");
            return
        }
        var pu = $("#PU").text();
        var tourl = baseUrl + "/QueryData/getMenuList?ObjectName=" + $(this).text() + "&type=StationData&UID=&PU=" + pu;
        qmsEasyUIopTab($(this).text(), tourl);
    });
}

function topmenuliClick() {
    $(".sf_topmenu li").click(function () {
        $(".sf_topmenu li").each(function () {
            $(this).removeClass("sf_topmenu_active");
        });
        $(this).addClass("sf_topmenu_active");
    });
}