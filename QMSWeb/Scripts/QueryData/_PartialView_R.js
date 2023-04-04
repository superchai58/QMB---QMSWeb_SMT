function btn_click(actionid) {
    var listval = $("#list").combobox('getValue');
    if (listval == "RTMS_Pickinfo") {
        if ($("#Line").combobox('getValue') == "") {
            qmsEasyUIalertWarning("Warning","Line is empty!");
            return;
        }
        if (actionid == "submitQ") {
            if ($("#Type").combobox('getText') != "") {
                $("#Type").combobox('setValue','');
            }
        }
        else {
            if ($("#Type").combobox('getText') == "") {
                $("#Type").combobox('setValue', 'Report');
            }
        }
    }
    var pu = $("#PU").text();
    var item = JSON.parse($("#xmlList").val());
    var obj = {};
    for (var i = 0; i < item.length; i++) {
        var id = item[i].Item;
        if (id != "") {
            var idValue
            if (item[i].ItemType == "date" || item[i].ItemType == "datetime") {
                idValue = $("#" + id).datebox("getValue")
                if (idValue == "") {
                    qmsEasyUIalertWarning("Warning", id + " is empty!");
                    return;
                }
                if (id == "BeginDate") {
                    id = "Date1";
                    obj[id] = formatter(idValue, "date_c");
                    id = "Time1";
                    obj[id] = formatter(idValue, "time_c");
                }
                if (id == "EndDate") {
                    id = "Date2";
                    obj[id] = formatter(idValue, "date_c");
                    id = "Time2";
                    obj[id] = formatter(idValue, "time_c");
                }
            }
            else if (item[i].ItemType == "combobox") {
                idValue = $("#" + id).combobox('getText');
                if (actionid == "submitE") {
                    if (id == "Station" && idValue == "") {
                        idValue = listval.substr(5);
                    }
                }
                obj[id] = idValue;
            }
            else {
                if (id == "ExcludedLine") {
                    idValue = document.getElementById(id).value;
                    id = "strSplit";
                    obj[id] = idValue;
                }
                else {
                    idValue = document.getElementById(id).value;
                    obj[id] = idValue;
                }
            }
        }
    }
    if (checkInterval()==false) {
        return;
    }
    var ObjectSP = new Array();
    ObjectSP = item[0].ObjectSP.split(";");
    var strjson = JSON.stringify(obj);
    strjson = encodeURIComponent(strjson);
    if (actionid == "submitQ") {
        $.ajax({
            type: "POST",
            url: baseUrl + "/QueryData/getStationData?ObjectName=" + listval + "&ObjectSP=" + ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu,
            data: "",
            success: function (data) {
                obj_hide("N");
                var arraywidth = [80, 100];
                if (data.length==1) {
                //if (listval == "RTMS_SP" || listval == "RTMS_SP2" || listval == "RTMS_Packing") {
                    obj_hide("Y");
                    //EasyUILoadDataGrid("dtList", "", data[0], 440, arraywidth, true, false, null, null, null)
                    iniDataTable("dtList", JSON.parse(data[0]), true, 15, false);
                    return
                }
                if (listval == "RTMS_Pickinfo") {
                    inicharts("Top5ErrCode", "", "Top5Slot", data[0])
                    inicharts("Top5Location", "", "Top5PartNumber", data[2])
                    EasyUILoadDataGrid("dtList", "", data[1], 50, arraywidth, true, false, null, null, null)
                    EasyUILoadDataGrid("dtErrCodeList", "", data[0], 120, arraywidth, true, false, null, null, null)
                    return
                }
                //if (listval == "RTMS_SPI") {
                //    inicharts("Top5ErrCode", "", "Top5Location", data[1])
                //    inicharts("Top5Location", "", "Top5PartNumber", data[2])
                //}
                EasyUILoadDataGrid("dtList", "", data[0], 50, arraywidth, true, false, null, null, null)
                EasyUILoadDataGrid("dtErrCodeList", "", data[3], 120, arraywidth, true, false, null, null, null)
                //iniDataTable("dtList", JSON.parse(data[0]), false, 1, false);
                //iniDataTable("dtErrCodeList", JSON.parse(data[3]), false, 1, false);
                if (listval == "RTMS_SPI") {
                    inicharts("Top5ErrCode", "", "Top5Location", data[1])
                    inicharts("Top5Location", "", "Top5Feature", data[2])
                    return
                }
                inicharts("Top5ErrCode", "", "Top5ErrCode", data[1])
                inicharts("Top5Location", "", "Top5Location", data[2])
                if (listval == "RTMS_AOI") {
                    inicharts("Top5FalseCall", "", "Top5FalseCall", data[4])
                }
                else if (listval == "RTMS_ICT") {
                    EasyUILoadDataGrid("dtdesc", "", data[4], 50, arraywidth, true, false, null, null, null)
                    //iniDataTable("dtdesc", JSON.parse(data[4]), false, 1, false);
                }
            },
            error: function (msg) {
                qmsEasyUIalertError("", JSON.stringify(msg));
            }
        });
    }
    else {
        if (item.length > 0) {
            var url = baseUrl + "/QueryData/DownLoadFile?ObjectName=" + listval + "&ObjectSP=" + ObjectSP + "&DBName=" + item[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
            url = encodeURI(url);
            qmsJQueryDownloadFile(url)
        }
    }
    
}

function inicharts(id, text,name,chartsdata) {
    var item = JSON.parse(chartsdata);
    var categories = [];
    var dataArry = [];//需转换成数字,不然不显示
    if (name == "Top5Slot") {
        for (var i = 0; i < item.length; i++) {
            var itemValue = item[i];
            var McName;
            for (var val in itemValue) {
                if (val == "McName") {
                    McName = itemValue[val];
                }
                if (val == "StageAddress") {
                    categories.push(McName + " " + itemValue[val]);
                }
                if (val == "DPPM") {
                    dataArry.push(parseInt(itemValue[val]));
                }
            }
        }
    }
    else {
        for (var i = 0; i < item.length; i++) {
            var itemValue = item[i];
            for (var val in itemValue) {
                if (val == "ErrCode") {
                    categories.push(itemValue[val].substring(itemValue[val].indexOf(',') + 1, itemValue[val].length));
                }
                else if (val == "PartNumber") {
                    categories.push(itemValue[val]);
                }
                else if (val == "Location") {
                    categories.push(itemValue[val]);
                }
                else if (val == "Feature") {
                    categories.push(itemValue[val]);
                }
                else if (val == "ErrorCode") {
                    categories.push(itemValue[val]);
                }
                else {
                    dataArry.push(parseInt(itemValue[val]));
                }
            }
        }
    }
    var chart = Highcharts.chart(id, {
        chart: {
            type: 'column'
        },
        title: {
            text: text
        },
        //subtitle: {
        //    text: '数据来源:实时生产数据'
        //},
        xAxis: {
            categories: categories,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Qty(pcs)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:5px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}:</td>' +
            '<td style="padding:0"><b>{point.y:.1f} pcs</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: false
        },
        plotOptions: {
            column: {
                borderWidth: 0
            }
        },
        series: [
            { name: name, data: dataArry }
        ]
    });
}

function checkInterval() {
    var QueryInterval = $("#QueryInterval").val();
    if (QueryInterval == "") {
        QueryInterval = 30;
    }
    var QueryInterval_a = daysBetween($("#BeginDate").datebox("getValue"), $("#EndDate").datebox("getValue"));
    if (QueryInterval_a > QueryInterval) {
        qmsEasyUIalertWarning("Warning", "Query period cannot exceed " + QueryInterval + " Days!");
        return false;
    }
    return true;
}

function obj_hide(value) {
    if (value == "Y") {
        $('#Top5ErrCode').hide();
        $('#Top5Location').hide();
        $('#Top5FalseCall').hide();
    }
    else {
        $('#Top5ErrCode').show();
        $('#Top5Location').show();
        $('#Top5FalseCall').show();
    }
}

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
        }
    }
})

