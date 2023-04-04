$(document).ready(function () {
    var item = JSON.parse($("#xmlList").val());
    for (var i = 0; i < item.length; i++) {
        var id = item[i].Item;
        if (id.indexOf('[') == 0 && id.indexOf(']') == 2) {
            id = id.substring(3);
        }
        if (item[i].ItemType == "combobox" && item[i].LinkPara == "") {
            refData(id, item[i].DataSource, item[i].DataType, item[i].DBName);
        }
        if (item[i].ItemType == "combobox" && item[i].LinkPara != "") {
            refData(id, "", item[i].DataType, item[i].DBName);
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
})

function refData(id, DataSource, type, DBName) {
    var pu = $("#PU").text();
    var url = baseUrl + "/QueryData/iniSelectOptionValue?id=" + id + "&DataSource=" + DataSource + "&type=" + type + "&DBName=" + DBName + "&PU=" + pu;
    if (DataSource == "") {
        url = "";
    }
    $("#" + id).combobox({
        url: url,
        valueField: id,
        textField: id,
        height: "20px",
        width: '253px',
        editable: false,
    });
}

function bt_click(id) {
    var item = $("#hidOpenMenuName").val();
    var strjson = getXMLList();
    strjson = encodeURIComponent(strjson)
    var pu = $("#PU").text();
    var xmlList = JSON.parse($("#xmlList").val());
    if (id == "ReAllocate") {
        url = baseUrl + "/SpecialItem/ReAllocateKey?ObjectSP=" + xmlList[0].ObjectSP + "&DBName=" + xmlList[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
        data = qmsJQueryAjax(url)
        $("#lblmsg").text(data);
        return;
    }
    var url = baseUrl + "/DefineData/getData?JsonString=" + strjson + "&DBName=" + xmlList[0].DBName + "&Item=" + item + "&Type=chkSNStatus&PU=" + pu;
    var data = qmsJQueryAjax(url)
    data = JSON.parse(data);
    var qty = data[0]["Qty"];
    url = baseUrl + "/SpecialItem/RecoverKey?ObjectSP=" + xmlList[0].ObjectSP + "&DBName=" + xmlList[0].DBName + "&sqlPara=" + strjson + "&PU=" + pu;
    if (qty != "0") {
        $.messager.confirm("Confirm", "There are " + qty + " MB have in product line,continue?", function (r) {
            if (!r) {
                return;
            }
            else {
                
                data = qmsJQueryAjax(url)
                $("#lblmsg").text(data);
            }
        });
    }
    else {
        data = qmsJQueryAjax(url)
        $("#lblmsg").text(data);
    }
}

