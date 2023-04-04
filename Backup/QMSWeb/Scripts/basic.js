if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function 
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () { },
        fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis
            ? this
            : oThis,
            aArgs.concat(Array.prototype.slice.call(arguments)));
        };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}
function Login() {
    window.location.href = baseUrl + "/Home/Index"
}

function getXMLList() {
    var xmlList = JSON.parse($("#xmlList").val());
    var obj = {};
    var UID = $("#UserID").text();
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
    obj["UID"] = UID;
    return JSON.stringify(obj);
}

function getXMLList_Upload() {
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
    return JSON.stringify(obj);
}

function refreshtable(type, scrollX, iDisplayLength, searching) {
    var strjson = getXMLList();
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var itemVal = $("#hidOpenMenuName").val();
    var url = baseUrl + "/DefineData/getData_Json?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + itemVal + "&Type=" + type + "&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    iniDataTable("myDtTable", JSON.parse(result), scrollX, iDisplayLength, searching);
}

function onSelectFun(id) {
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    for (var i = 0; i < item.length; i++) {
        if (item[i].LinkPara == id) {
            var ActOpt = item[i].Item;
            var idValue = $("#" + id).combobox('getValue');
            var DataSource = item[i].DataSource;
            DataSource = encodeURIComponent(DataSource);
            $("#" + ActOpt).combobox({
                url: baseUrl + "/QueryData/SelectOptionChg?idValue=" + idValue + "&DataSource=" + DataSource + "&DBName=" + item[0].DBName + "&PU=" + pu,
                valueField: ActOpt,
                textField: ActOpt,
                height: "20px",
                width: "200px",
                editable: false,
            });
        }
    }
}

function refreshData(id, DataSource, type, DBName) {
    var pu = $("#PU").text();
    DataSource = encodeURIComponent(DataSource)
    var url = baseUrl + "/QueryData/iniSelectOptionValue?id=" + id + "&DataSource=" + DataSource + "&type=" + type + "&DBName=" + DBName + "&PU=" + pu;
    if (DataSource == "") {
        url = "";
    }
    //var editable = false;
    //if (id == "WO" || id == "WorkOrder" || id == "Work_Order") {
    //    editable = true;
    //}
    $("#" + id).combobox({
        url: url,
        valueField: id,
        textField: id,
        height: "20px",
        width: "200px",
        editable: true,
        onSelect: function () {
            onSelectFun(id);
        },
        formatter: function (row) {
            var opts = $(this).combobox('options');
            return row[opts.valueField];
        }
    });
}

function add_EventListener(id) {
    document.getElementById(id).addEventListener("change", function optSelectChanged() {
        var item = JSON.parse($("#xmlList").val());
        for (var i = 0; i < item.length; i++) {
            if (item[i].LinkPara == id) {
                
                var ActOpt = item[i].Item;
                var idValue = document.getElementById(id).value;
                $.ajax({
                    async: false,
                    type: "POST",
                    url: baseUrl + "/QueryData/SelectOptionChg?idValue=" + idValue + "&DataSource=" + item[i].DataSource,
                    data: "",
                    success: function (OptionValue) {
                        if (OptionValue == "No Data") {
                            qmsEasyUIalertWarning("Warning", "No Data");
                            $("#" + ActOpt).empty();
                        }
                        else {
                            var ItemVal = JSON.parse(OptionValue);
                            $("#" + ActOpt).empty();
                            $("#" + ActOpt).append("<option></option>");
                            for (var j = 0; j < ItemVal.length; j++) {
                                var itemValue = ItemVal[j];
                                for (var val in itemValue) {
                                    $("#" + ActOpt).append("<option value=" + itemValue[val] + ">" + itemValue[val] + "</option>");
                                }
                            }
                        }
                    },
                    error: function (msg) {
                        qmsEasyUIalertError("Error", msg);
                    }
                });
            }
        }
    }, false);
}

function iniSelectOptionValue(id, DataSource) {
    $.ajax({
        async: false,
        type: "POST",
        url: baseUrl + "/QueryData/iniSelectOptionValue?DataSource=" + DataSource,
        data: "",
        success: function (OptionValue) {
            var item = JSON.parse(OptionValue);
            $("#" + id).append("<option></option>");
            for (var i = 0; i < item.length; i++) {
                var itemValue = item[i];
                for (var val in itemValue) {
                    $("#" + id).append("<option value=" + itemValue[val] + ">" + itemValue[val] + "</option>");
                }
            }
        },
        error: function (msg) {
            qmsEasyUIalertError("Error", msg);
        }
    });
}

Function.prototype.bind = function () {
    var __method = this;
    var arg = arguments;
    return function () {
        __method.apply(window, arg);
    }
}

Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    str = str.replace(/MM/, this.getMonth() > 9 ? this.getMonth().toString() : '0' + this.getMonth());
    str = str.replace(/M/g, this.getMonth());

    str = str.replace(/w|W/g, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
}

function iniDataTable(dataTableid, data, scrollX, iDisplayLength, searching) {
    var aocolumns = "";
    var trStr = "<thead><tr>";
    var columnValue = data[0];
    //if (data == "") {
    //    $("#" + dataTableid).dataTable().fnClearTable()
    //    return
    //}
    for (var val in columnValue) {
        trStr = trStr + '<th>' + val + '</th>';
        aocolumns = aocolumns + "{\"data\":\"" + val + "\"},";
    }
    trStr = trStr + "</tr></thead>";
 
    aocolumns = aocolumns.substr(0, aocolumns.length-1);
    aocolumns = "[" + aocolumns + "]";
    aocolumns = JSON.parse(aocolumns);
    //aocolumns = eval(aocolumns)
    $("#" + dataTableid).html(trStr);
    var dttable = $("#" + dataTableid).dataTable();
    dttable.fnClearTable();
    dttable.fnDestroy();
    $("#" + dataTableid).html(trStr);
    dttable = $("#" + dataTableid).dataTable({
        "processing": true,
        "serverSide": false,
        "data": data,
        "columns": aocolumns,
        //"lengthMenu": [10,12,14,16,18],
        "autoWidth": false,
        "scrollX": scrollX,
        //"scrollY": "380px",
        "paging": true,
        "searching": searching,//搜索功能
        "bLengthChange": false,//每页显示多少条记录选项
        "iDisplayLength": iDisplayLength,//每页显示多少条记录
        //"oLanguage": {   			
        //    "sLengthMenu": "每页显示 _MENU_ 条记录",
        //    "sZeroRecords": "没有检索到数据",
        //    "sInfo": "当前为第 _START_ 到第 _END_ 条数据；共 _TOTAL_ 条记录",
        //    "sInfoEmtpy": "没有数据",
        //    "sProcessing": "正在加载数据...",
        //    "oPaginate": {
        //        "sFirst": "首页",
        //        "sPrevious": "前页",
        //        "sNext": "后页",
        //        "sLast": "尾页"
        //    }
        //}
    });
}

function iniDataTable_scrollY(dataTableid, data, scrollY) {
    var aocolumns = "";
    var trStr = "<thead><tr>";
    var columnValue = data[0];
    for (var val in columnValue) {
        trStr = trStr + '<th>' + val + '</th>';
        aocolumns = aocolumns + "{\"data\":\"" + val + "\"},";
    }
    trStr = trStr + "</tr></thead>";

    aocolumns = aocolumns.substr(0, aocolumns.length - 1);
    aocolumns = "[" + aocolumns + "]";
    aocolumns = JSON.parse(aocolumns);
    $("#" + dataTableid).html(trStr);
    var dttable = $("#" + dataTableid).dataTable();
    dttable.fnClearTable();
    dttable.fnDestroy();
    $("#" + dataTableid).html(trStr);
    dttable = $("#" + dataTableid).dataTable({
        "processing": true,
        "serverSide": false,
        "data": data,
        "columns": aocolumns,
        "autoWidth": false,
        "scrollY": scrollY,
        "scrollX": true,
        "paging": false,
        "searching": false,//搜索功能
        "bLengthChange": false,//每页显示多少条记录选项
    });
}

function daysBetween(DateOne, DateTwo) {
    DateOne = formatter(DateOne,"date")
    DateTwo = formatter(DateTwo,"date")
    var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
    var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
    var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

    var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
    var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
    var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

    var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
    return Math.abs(cha);
}

function IsValidDate(DateStr) {
    var sDate = DateStr.replace(/(^\s+|\s+$)/g, ''); //去两边空格;
    if (sDate == '') return true;
    //如果格式满足YYYY-(/)MM-(/)DD或YYYY-(/)M-(/)DD或YYYY-(/)M-(/)D或YYYY-(/)MM-(/)D就替换为''
    //数据库中，合法日期可以是:YYYY-MM/DD(2003-3/21),数据库会自动转换为YYYY-MM-DD格式
    var s = sDate.replace(/[\d]{ 4,4 }[\-/]{ 1 }[\d]{ 1,2 }[\-/]{ 1 }[\d]{ 1,2 }/g, '');
    if (s == '') //说明格式满足YYYY-MM-DD或YYYY-M-DD或YYYY-M-D或YYYY-MM-D
    {
        var t = new Date(sDate.replace(/\-/g, '/'));
        var ar = sDate.split(/[-/:]/);
        if (ar[0] != t.getYear() || ar[1] != t.getMonth() + 1 || ar[2] != t.getDate()) {
            //alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。');
            return false;
        }
    }
    else {
        //alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。');
        return false;
    }
    return true;
}

function CheckDateTime(str) {
    var reg = /^(\d+)-(\d{ 1,2 })-(\d{ 1,2 }) (\d{ 1,2 }):(\d{ 1,2 }):(\d{ 1,2 })$/;
    var r = str.match(reg);
    if (r == null) return false;
    r[2] = r[2] - 1;
    var d = new Date(r[1], r[2], r[3], r[4], r[5], r[6]);
    if (d.getFullYear() != r[1]) return false;
    if (d.getMonth() != r[2]) return false;
    if (d.getDate() != r[3]) return false;
    if (d.getHours() != r[4]) return false;
    if (d.getMinutes() != r[5]) return false;
    if (d.getSeconds() != r[6]) return false;
    return true;
}

function PlaySound(soundType) {
    var audiopath
    if (soundType == "OK") {
        var vod = new Audio(baseUrl + '/WaveAudio/OK.mp3');
    }
    else if (soundType == "OO") {
        var vod = new Audio(baseUrl + '/WaveAudio/OO.mp3');
    }
    else if (soundType == "NG") {
        var vod = new Audio(baseUrl + '/WaveAudio/NG.mp3');
    }
    else {
        var vod = new Audio(baseUrl + '/WaveAudio/' + soundType + '.mp3');
    }
    vod.play();
}

function qmsJQueryJsonToSelect(url, Id, completeFunc) {
    Id = qmsFormatId(Id);
    $(Id).empty();
    $.getJSON(url, function (data) {
        $(Id).empty();
        $.each(data, function (i, item) {
            qmsAddOptionToSelect(Id, item["Value"]);
        });
    }).complete(completeFunc);
}

function qmsJQueryJsonToSelect_Sync(url, Id) {
    Id = qmsFormatId(Id);
    $(Id).empty();
    var json = qmsJQueryAjaxJson(url);
    $.each(json, function (i, item) {
        qmsAddOptionToSelect(Id, item["Value"]);
    });
}

function qmsJQueryJsonToSelect(url,Id) {
    Id = qmsFormatId(Id);
    $(Id).empty();
    var json = qmsJQueryAjaxJson(url);
    var item = JSON.stringify(json);
    alert(item);
    $(Id).append("<option></option>");
    alert(item[0]);
    var itemValue = item[0];
    for (var val in itemValue) {
        alert(itemValue[val]);
    }
    //for (var i = 0; i < item.length;i++) {
    //    var itemValue = item[i];
    //    for (var val in itemValue) {
    //        $(Id).append("<option value=" + itemValue[val] + ">" + itemValue[val] + "</option>");
    //    }
    //}
}

function qmsJQueryAjaxJson(url) {
    var rel;
    $.ajax({
        type:"post",
        async:false,
        url:url,
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        data:"",
        success: function (result) {
            rel = result
        },
        error:function (result) {
            rel = result
        }
    });
    return rel;
}

function qmsJQueryAjax(url) {
    var rel;
    $.ajax({
        type: "post",
        async: false,
        url: url,
        success: function (result) {
            rel = result
        },
        error: function (result) {
            rel = result
        }
    });
    return rel;
}

function qmsJQueryAjaxString(url, postJsonObj, failureFunc) {
    var json = JSON.stringify(postJsonObj);
    var rel;
    $.ajax({
        type: "post",
        async: false,
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        data: json,
        cache: false,
        success: function (result) { rel = result },
        error: failureFunc
    });
    return rel;
}

function qmsJQueryDownloadFile(url) {
    $('<form action="' + decodeURI(url) + '" method="POST"></form>')
        .appendTo('body').submit().remove();
}

function qmsJQueryAjaxJsonData(url, postJsonObj, succesFunc, failureFunc) {
    var json = JSON.stringify(postJsonObj);
    $.ajax({
        type: "post",
        async: false,
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: json,
        cache: false,
        success: function (jsonData) { if (succesFunc != null) succesFunc(jsonData); },
        error: failureFunc
    });
}

function ajaxfailureFunc(step) {
    alert(step + " AJAX Fail");
}

function qmsOpenPostWindow(url, data, argsname, name) {
    var tempForm = document.createElement("form");
    tempForm.id = "tempForm1";
    tempForm.method = "post";
    tempForm.action = url;
    tempForm.target = name;

    var hideInput = document.createElement("input");
    hideInput.type = "hidden";
    hideInput.name = argsname
    hideInput.value = data;
    tempForm.appendChild(hideInput);
    if (window.attachEvent) {
        tempForm.attachEvent("onsubmit", function () { openWindow(name); });//IE
    }
    else {
        window.addEventListener("submit", function () { openWindow(name); });//FF用这种
    }

    //tempForm.attachEvent("onsubmit", function () { openWindow(name); });
    document.body.appendChild(tempForm);
    if (window.attachEvent) {
        tempForm.fireEvent("onsubmit");
    }
    else {
        window.removeEventListener("submit", function () { openWindow(name); });
    }

    //tempForm.fireEvent("onsubmit");

    tempForm.submit();
    document.body.removeChild(tempForm);
}

function openWindow(name) {
    window.open('about:blank', name, 'height=400, width=500, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes');
}

function qmsFormatId(Id) {
    if (Id.substring(0, 1) != "#") {
        Id = "#" + Id;
    }
    return Id;
}

function qmsSetOnFocus(Id) {
    Id = qmsFormatId(Id);
    $(Id)[0].focus();
}

function qmsEnter(Id, doFunc) {
    Id = qmsFormatId(Id);
    $(Id).keypress(function (e) {
        var ev = e || event;
        var keycode = ev.which || ev.keyCode;
        if (keycode == 13) {

            if ($.browser.msie) {
                window.event.returnValue = false;
            }
            else {
                ev.preventDefault();
            }
            //do some of your things
            if (typeof (doFunc) == "undefined") {

            }
            else {
                doFunc();
            }
        }
    });
}

function qmsEnterWithCallBackHaveParameter(Id, doFunc) {
    Id = qmsFormatId(Id);
    $(Id).keypress(function (e) {
        var ev = e || event;
        var keycode = ev.which || ev.keyCode;
        if (keycode == 13) {
            ev.preventDefault();
            if ($.browser.msie) {
                window.event.returnValue = false;
            }
            //do some of your things
            if (typeof (doFunc) == "undefined") {

            }
            else {
                // doFunc();
                doFunc.func();
            }
        }
    });
}

function qmsEasyUIopTab(menuName, targetUrl) {
    targetUrl = encodeURI(targetUrl);
    if ($("#tabs").tabs("exists", menuName)) {
        qmsEasyUIupdateTab(menuName, targetUrl);
    }
    else {
        if ($("#tabs").tabs("exists", $("#hidOpenMenuName").val())) {
            $("#tabs").tabs("close", $("#hidOpenMenuName").val());
        }
        qmsEasyUIaddTab(menuName, targetUrl);
    }
}

function qmsEasyUITab(menuName, targetUrl) {
    targetUrl = encodeURI(targetUrl);
        if ($("#tabs").tabs("exists", $("#hidOpenMenuName").val())) {
            $("#tabs").tabs("close", $("#hidOpenMenuName").val());
        }
        qmsEasyUIaddTab(menuName, targetUrl);
        $("#hidOpenMenuName").val(menuName);

}

function qmsEasyUIaddTab(menuName, targetUrl) {
    $('#tabs').tabs('add', {
        title: menuName,
        href: targetUrl,
        closable: true,
        closed: true
    });
    $("#hidOpenMenuName").val(menuName);
}

function qmsEasyUIupdateTab(menuName, targetUrl) {
    //var tab = $('#tabs').tabs('getSelected');   //获取当前panal
    //针对MyFavourites和MenuList始终保持刷新，其他页面如果有就直接切换不刷新
    if (menuName == "MyFavourites" || menuName == "MenuList") {
        var tab = $('#tabs').tabs("getTab", menuName);   //获取指定panal
        $("#tabs").tabs('update', {
            tab: tab,
            options: {
                href: targetUrl
            }
        });
        tab.panel('refresh');
    }
    $("#tabs").tabs("select", menuName);   //跳转到指定panal
    $("#hidOpenMenuName").val(menuName);
}

var hasRIGHT = false;

function qmsEasyUILoadDataGrid(id, title, url, height, columnWidthArray, singleSelect, checkBox, loadSuccessFunc, clickFunc, dbClickFunc) {
    hasRIGHT = false;
    setTimeout(function () {
        subEasyUILoadDataGrid(id, title, url, height, singleSelect, checkBox, loadSuccessFunc, clickFunc, dbClickFunc, columnWidthArray);
    }, 100);
}

function subEasyUIDataGridSetCheckBox(id) {
    var rows = $(id).datagrid("getRows");
    $.each(rows, function (index, data) {
        if (data.RIGHT == "Y") {
            $(id).datagrid("checkRow", index);
        }
    })
}

function EasyUILoadDataGrid(id, title, data, height, columnWidthArray,singleSelect, checkBox, loadSuccessFunc, clickFunc, dbClickFunc) {
    var id = "#" + id;
    var json = data;
    if (json == null || json == "") {
        var f2 = "[[{field:'错误', title:'错误',align:'left'},{field:'ERROR', title:'ERROR',align:'left'}]]";
        f2 = eval(f2);
        var j2 = "[{\"错误\":\"无返回结果\",\"ERROR\":\"None row return\"}]";
        j2 = $.parseJSON(j2);
        $(id).datagrid({
            //view: scrollview,
            autoRowHeight: false,
            fitCloumns: true,
            width: 'auto',
            height: 'auto',
            columns: f2
        });
        $(id).datagrid("loadData", j2);
        return;
    }
    //
    json = $.parseJSON(json);
    //得到json的列数
    var jsonColumnQty = 0;
    for (var x in json[0]) {
        jsonColumnQty++;
    }
    //得到表头Json字符串
    var fields = subEasyUIGetColumnField(json, jsonColumnQty, checkBox, columnWidthArray);
   
    $(id).datagrid({
        autoRowHeight: false,
        fitCloumns: false,
        width: 'auto',
        height: height,
        striped: true,
        title: title,
        remoteSort: false,
        singleSelect: singleSelect,
        loadMsg: '数据加载中请稍后……',
        rownumbers: true,
        //checkOnSelect: false,
        //selectOnCheck: false,
        columns: fields,
        onLoadSuccess: function () {
            $(".eutitletxtcenter").parent().parent().css("text-align", "center");
            if (hasRIGHT) {
                subEasyUIDataGridSetCheckBox(id);
            }
            if (loadSuccessFunc != null) {
                loadSuccessFunc()
            }
        },
        onClickRow: function (index, data) { if (clickFunc != null) { clickFunc(id,index, data) } },
        onDblClickRow: function (index, data) { if (dbClickFunc != null) { dbClickFunc(id,index, data) } }
    });
    $(id).datagrid("loadData", json);
    //$(id).datagrid("resize");
}

function subEasyUILoadDataGrid(id, title, url, height, singleSelect, checkBox, loadSuccessFunc, clickFunc, dbClickFunc, columnWidthArray) {
    var id = "#" + id;
    var json = qmsJQueryAjaxJson(url);
    if (json == null || json == "") {
        var f2 = "[[{field:'错误', title:'错误',align:'left'},{field:'ERROR', title:'ERROR',align:'left'}]]";
        f2 = eval(f2);
        var j2 = "[{\"错误\":\"无返回结果\",\"ERROR\":\"None row return\"}]";
        j2 = $.parseJSON(j2);
        $(id).datagrid({
            autoRowHeight: false,
            fitCloumns: true,
            width: 'auto',
            height: 'auto',
            columns: f2
        });
        $(id).datagrid("loadData", j2);
        return;
    }
    //
    json = $.parseJSON(json);
    //得到json的列数
    var jsonColumnQty = 0;
    for (var x in json[0]) {
        jsonColumnQty++;
    }
    //得到表头Json字符串
    var fields = subEasyUIGetColumnField(json, jsonColumnQty, checkBox,columnWidthArray);
    $(id).datagrid({
        autoRowHeight: false,
        fitCloumns: true,
        width: 'auto',
        height: height,
        striped: true,
        title: title,
        remoteSort: true,
        singleSelect: singleSelect,
        loadMsg: '数据加载中请稍后……',
        rownumbers: true,
        checkOnSelect: false,
        pagination: true,
        pageList: [30, 40, 50, 100],
        pageSize: 30,
        selectOnCheck: true,
        columns: fields,
        onLoadSuccess: function () {
            $(".eutitletxtcenter").parent().parent().css("text-align", "center");
            if (hasRIGHT) {
                subEasyUIDataGridSetCheckBox(id);
            }
            if (loadSuccessFunc != null) {
                loadSuccessFunc()
            }
        },
        onClickRow: function (index, data) { if (clickFunc != null) { clickFunc(index, data) } },
        onDblClickRow: function (index, data) { if (dbClickFunc != null) { dbClickFunc(index, data) } }
    });
    $(id).datagrid("loadData", json);
    //$(id).datagrid("resize");
}

function subEasyUIGetColumnField(json, jsonColumnQty, checkBox, columnWidthArray) {
    var j = 0;
    var fields = "[[";
    if (checkBox) {
        fields = "[[{field:'ck',checkbox:true},";
    }
    hasRIGHT = false;
    //alert(columnWidthArray.length)
    if (columnWidthArray == null || columnWidthArray.length != jsonColumnQty) {
        for (var i in json[0]) {
            if (checkBox && i == "RIGHT") {
                hasRIGHT = true;
                fields += "{field:'" + i + "', title:'" + i + "',align:'left',hidden:true}";
            }
            else {
                fields += "{field:'" + i + "', title:'<span class=\"eutitletxtcenter\">" + i + "</span>',align:'left',sortable:true}";
            }
            if (j < jsonColumnQty - 1) {
                fields += ",";
            }
            j++;
        }
    }
    else {
        for (var i in json[0]) {
            if (checkBox && i == "RIGHT") {
                hasRIGHT = true;
                fields += "{field:'" + i + "', title:'" + i + "',align:'left',hidden:true, width:" + columnWidthArray[j] + "}";
            }
            else {
                fields += "{field:'" + i + "', title:'<span class=\"eutitletxtcenter\">" + i + "</span>',align:'left',sortable:true,width:" + columnWidthArray[j] + "}";
            }
            if (j < jsonColumnQty - 1) {
                fields += ",";
            }
            j++;
        }
    }
    fields += "]]";
    fields = eval(fields);
    return fields;
}

function qmsEasyUIalertMessage(title, message) {
    $.messager.alert(title, message);
}

function qmsEasyUIalertError(title, message) {
    $.messager.alert(title, message, 'error');
}

function qmsEasyUIalertInfo(title, message) {
    $.messager.alert(title, message, 'info');
}

function qmsEasyUIalertQuestion(title, message) {
    $.messager.alert(title, message, 'question');
}

function qmsEasyUIalertWarning(title, message) {
    $.messager.alert(title, message, 'warning');
}

function qmsEasyUIconfirm(title, message, confirmFuc) {
    
    $.messager.confirm(title, message, function (r) {
        if (r) {
            confirmFuc();
        }
    });
}

//function qmsEasyUIconfirm(title, message) {
//    $.messager.confirm(title, message, function (r) {
//        if (r) {
//            $(window).attr('location', baseUrl + "/Home/Index");
//        }
//    });
//}

function myformatter(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}

function formatter(value, type) {
   
    var date = new Date(value);
    //alert(date)
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var mins = date.getMinutes();
    var sec = date.getSeconds();
    if (type == "date_c") {
        //alert(y)
        //alert(m)
        //alert(d)
        return y.toString() + (m < 10 ? ('0' + m) : m).toString() + (d < 10 ? ('0' + d) : d).toString();
    }
    else if (type == "time_c") {
        return (h < 10 ? ('0' + h) : h).toString() + (mins < 10 ? ('0' + mins) : mins).toString();
    }
    else if (type == "date") {
        return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
    }
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d) + ' ' + (h < 10 ? ('0' + h) : h) + ':' + (mins < 10 ? ('0' + mins) : mins) + ':' + (sec < 10 ? ('0' + sec) : sec);
}

function myparser(s) {
    if (!s) return new Date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0], 10);
    var m = parseInt(ss[1], 10);
    var d = parseInt(ss[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m - 1, d);
    } else {
        return new Date();
    }
}

var EasyUIInput_Id = "";
var EasyUIInput_inputId = "";
var EasyUIInput_returnId = "";
var EasyUIInput_infoId = "";
function qmsEasyUIInput(Id, TitleInfo, doFuncAfterClose) {
    Id = qmsFormatId(Id);
    var IdInfo = Id + "_info";
    if (TitleInfo != null && TitleInfo != "") {
        $(IdInfo).text(TitleInfo);
    }
    $(Id).window({
        onOpen: function () {
            EasyUIInput_Id = Id;
            EasyUIInput_inputId = Id + "_input";
            EasyUIInput_returnId = Id + "_return";
            EasyUIInput_infoId = IdInfo;
            $(EasyUIInput_inputId)[0].focus();
        },
        onClose: function () {
            var retval = $(EasyUIInput_returnId).val();
            EasyUIInput_Id = "";
            EasyUIInput_inputId = "";
            EasyUIInput_returnId = ""
            EasyUIInput_infoId = "";
            if (doFuncAfterClose != null) {
                doFuncAfterClose(retval);
            }
        }
    });
    $(Id).window('open');
}

function qmsEasyUIInput_keypress(e) {
    var ev = e || event; var keycode = ev.which || ev.keyCode;
    $(EasyUIInput_returnId).val("");
    if (keycode == 13) {
        if ($.browser.msie) {
            window.event.returnValue = false;
        }
        else {
            ev.preventDefault();
        }
        $(EasyUIInput_returnId).val($(EasyUIInput_inputId).val());
        $(EasyUIInput_inputId).val('');
        $(EasyUIInput_Id).window('close');
    }
}

var EasyUIPassword_Id = "";
var EasyUIPassword_Uid = "";
var EasyUIPassword_Pwd = "";
var EasyUIPassword_CloseType = "";
function qmsEasyUIPassword(Id, doFuncAfterClose) {
    Id = qmsFormatId(Id);
    $(Id).window({
        onOpen: function () {
            EasyUIPassword_Id = Id;
            EasyUIPassword_Uid = Id + "_input_uid";
            EasyUIPassword_Pwd = Id + "_input_pwd";
            EasyUIPassword_CloseType = Id + "_hid_closetype";

            $(EasyUIPassword_Uid).textbox('setText', "");
            $(EasyUIPassword_Pwd).textbox('setText', "");
            $(EasyUIPassword_CloseType).val("cancel");
        },
        onClose: function () {
            var uid = $(EasyUIPassword_Uid).textbox('getText');
            var pwd = $(EasyUIPassword_Pwd).textbox('getText');
            var cancel = $(EasyUIPassword_CloseType).val();
            EasyUIPassword_Uid = "";
            EasyUIPassword_Pwd = "";
            EasyUIPassword_CloseType = ""
            if (doFuncAfterClose != null) {
                if (cancel == "normal") {
                    doFuncAfterClose(uid, pwd);
                }
            }
        }
    });
    $(Id).window('open');
}

function qmsEasyUIPassword_login_click() {
    $(EasyUIPassword_CloseType).val("normal");
    $(EasyUIPassword_Id).window('close');
}


