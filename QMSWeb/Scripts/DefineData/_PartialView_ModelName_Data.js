
$(document).ready(function () {
    var item = JSON.parse($("#xmlList").val());
    for (var i = 0; i < item.length; i++) {
        var id = item[i].Item;
        if (item[i].ItemType == "combobox" && item[i].LinkPara == "") {
            refData(id, item[i].DataSource, item[i].DataType, item[i].DBName);
        }
        if (item[i].ItemType == "combobox" && item[i].LinkPara != "") {
            refData(id, "", item[i].DataType,item[i].DBName);
        }
    }
    $('#filePath').filebox({
        buttonText: '浏览文件',
        buttonAlign: 'left',
    })
    refreshtable("ini_Data", false, 8, false);
    table_tr_click();
    refFunctypeDesc();
})

function onSelectFunction(id) {
    var item = JSON.parse($("#xmlList").val());
    var pu = $("#PU").text();
    for (var i = 0; i < item.length; i++) {
        if (item[i].LinkPara == id) {
            var ActOpt = item[i].Item;
            var idValue = $("#" + id).combobox('getValue');
            var url = baseUrl + "/QueryData/SelectOptionChg?idValue=" + idValue + "&DataSource=" + item[i].DataSource + "&DBName=" + item[0].DBName + "&PU=" + pu;
            $("#" + ActOpt).combobox({
                url: url,
                valueField: ActOpt,
                textField: ActOpt,
                height: "20px",
                editable: true,
                //onHidePanel: function () {
                //    refreshtable("refreshData", false, 13, false);
                //}
            });
            $("#Value").textbox('setValue', "");
        }
    }
    refreshtable("refreshData", false, 8, false);
}

function refData(id, DataSource, type, DBName) {
    var pu = $("#PU").text();
    var url = baseUrl + "/QueryData/iniSelectOptionValue?id=" + id + "&DataSource=" + DataSource + "&type=" + type + "&DBName=" + DBName + "&PU=" + pu;
    if (DataSource == "") {
        url = "";
    }
    var itemVal = $("#hidOpenMenuName").val();
    if (id == "SourceModelName" || id == "DestModelName") {
        var prompt = "";
        if (id == "DestModelName") {
            prompt = "关键字敲回车搜索(拷贝)";
        }
        if (id == "SourceModelName") {
            prompt = "关键字敲回车搜索(拷贝)";
        }
        $("#" + id).combobox({
            url: url,
            valueField: id,
            textField: id,
            height: "20px",
            width: "193px",
            editable: true,
            prompt: prompt,
            filter: function (q, row) {
                if (row["PinYin"]) {
                    var opts = $(this).combobox('options');
                    var tmp = q.toLowerCase();
                    return row["PinYin"].indexOf(tmp) >= 0 || row[opts.textField].indexOf(tmp) >= 0;
                }
                else {
                    var opts = $(this).combobox('options');
                    return row[opts.textField].indexOf(q) >= 0;
                }
            },
            onHidePanel: function () {
                //refreshtable("refreshData", false, 13, false);
                reftable(id);
            }
        });
        keyDownEventFun(id);
    }
    else {
        $("#" + id).combobox({
            url: url,
            valueField: id,
            textField: id,
            height: "20px",
            width: "193px",
            editable: true,
            //prompt: "输入关键字搜索",
            onSelect: function () {
                onSelectFunction(id);
            },
            onHidePanel: function () {
                //refreshtable("refreshData", false, 13, false);
                reftable(id);
            }
        });
    }
}

function keyDownEventFun(id) {
    $('#' + id).textbox('textbox').keydown(function (event) {
        if (event.keyCode == 13) {
            if (id == "ModelName") {
                reftable(id);
                return;
            }
            var value = $("#" + id).combobox('getText');
            if (value == "") {
                qmsEasyUIalertMessage("Warning", id + " is empty!");
                return;
            }
            var obj = {};
            var item = $("#hidOpenMenuName").val();
            var itemDBName = JSON.parse($("#xmlList").val());
            DBName = itemDBName[0].DBName;
            obj[id] = value;
            var strjson = JSON.stringify(obj);
            var pu = $("#PU").text();
            $.ajax({
                async: false,
                type: "POST",
                url: baseUrl + "/DefineData/getData?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + item + "&Type="+id+"_keyDown"+ "&PU=" + pu,
                data: "",
                success: function (data) {
                    $('#' + id).combobox('loadData', {});//清空下拉框
                    $('#' + id).combobox('clear');//清空输入框
                    $('#' + id).combobox('loadData', JSON.parse(data));
                },
                error: function (msg) {
                    qmsEasyUIalertError("Error", msg);
                }
            });
            
        }
    });
}

function bt_click(actionid) {
    var item = $("#hidOpenMenuName").val();
    var strjson = getXMLList();
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    strjson = encodeURIComponent(strjson)
    var url = baseUrl + "/DefineData/QMS_DefineData?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + item + "&Type=" + actionid + "&PU=" + pu;
    if (actionid == "Excel") {
        url = baseUrl + "/DefineData/DownLoadFile?JsonString=" + strjson + "&DBName=" + DBName + "&Item=" + item + "&Type=" + actionid + "&PU=" + pu;
        url = encodeURI(url);
        qmsJQueryDownloadFile(url)
        return
    }
    var data = qmsJQueryAjax(url)
    if (data == "OK") {
        qmsEasyUIalertInfo("OK", "OK," + actionid + " data sucessfully!");
        if (actionid != "Copy") {
            refreshtable("refreshData", false, 8, false);
        }
        table_tr_click();
    }
    else {
        qmsEasyUIalertError("Error", data);
    }
}

function dowloadTemplate() {
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var url = baseUrl + "/DefineData/DownTemplateFile?ObjectName=ModelName_Data&DBName=" + DBName + "&Type=Template&PU=" + pu;
    url = encodeURI(url);
    qmsJQueryDownloadFile(url)
}

function buttonUpload() {
    var file = $('#filePath').filebox('getValue');
    if (file == "") {
        qmsEasyUIalertWarning("Warning", "Please choose file!");
        return;
    }
    $("#lblmsg").text("Uploading Data....");
    var files = $("#filePath").next().find('input[type=file]')[0].files;
    var formData = new FormData(); // FormData 对象
    formData.append("Filedata", files[0]); // 文件对象

    var item_T = JSON.parse($("#xmlList").val());
    var DBName = item_T[0].DBName;
    var item = $("#hidOpenMenuName").val();
    var uid = $("#UserID").text();
    var limitQty = $("#limitQty").val();
    if (limitQty == "") {
        qmsEasyUIalertWarning("Warning", "Please define limitQty,call QMS!");
        return;
    }
    var pu = $("#PU").text();
    var type = "batch";
    $.ajax({
        type: "POST",
        url: baseUrl + "/DefineData/UploadData?Item=" + item + "&DBName=" + DBName + "&UID=" + uid + "&Type=" + type + "&LimitQty=" + limitQty + "&PU=" + pu,
        processData: false,
        contentType: false,
        data: formData,
        success: function (data) {
            $('#filePath').filebox('setValue','')
            $("#lblmsg").text(data);
        },
        error: function (data) {
            $('#filePath').filebox('setValue', '')
            qmsEasyUIalertError("Error", JSON.stringify(data));
        }
    });
}

function reftable(id) {
    if (id == "SourceModelName" || id == "DestModelName") {
        return
    }
    if ($("#" + id).combobox('getText') == "") {
        return
    }
    refreshtable("refreshData", false, 8, false);
}

function refFunctypeDesc() {
    var pu = $("#PU").text();
    var itemDBName = JSON.parse($("#xmlList").val());
    DBName = itemDBName[0].DBName;
    var itemVal = $("#hidOpenMenuName").val();
    if (itemVal == "WO_Data") {
        return;
    }
    var url = baseUrl + "/DefineData/getData_Json?JsonString=&DBName=" + DBName + "&Item=" + itemVal + "&Type=FuncTypeDesc&PU=" + pu;
    var result = qmsJQueryAjaxJson(url);
    var arraywidth = [20, 50];
    EasyUILoadDataGrid("dtFunctypeDesc", "", result, 200, arraywidth, true, false, null, get_rowdata, null)
}

function get_rowdata(id, index, data) {
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
    refreshtable("refreshData", false, 8, false);
    table_tr_click();
}

function table_tr_click() {
    $('#myDtTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        var Dtable = $('#myDtTable').DataTable();
        var Rowdata = Dtable.row(this).data();
        var item = JSON.parse($("#xmlList").val());
        for (var i = 0; i < item.length; i++) {
            var id = item[i].Item;
            if ($("#" + id).length <= 0) {
                continue;
            }
            if (id == "DestModelName" || id == "SourceModelName") {
                continue;
            }
            var type = document.getElementById(id).type;
            if (type == "select-one") {
                $("#" + id).combobox('setValue', Rowdata[id].toString());
            }
            else {
                $("#" + id).textbox('setValue', Rowdata[id].toString());
            }
        }

    });
}