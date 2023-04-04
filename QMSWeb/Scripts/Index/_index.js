$(document).ready(function () {
    $("#BU").combobox({
        url: baseUrl + "/Home/GetBU",
        valueField: "BU",
        textField: "BU",
        height: "30px",
        width: "250px",
        mode: "local",
        editable: false,
        formatter: function (row) {
            var opts = $(this).combobox('options');
            return row[opts.valueField];
        }
    });
    var chkboxstatus = document.getElementById("chkboxstatus").value;
    if (chkboxstatus == "Y") {
        $("#remember").attr("checked", true);
    }
});

function keydown(e) {
    var evt = window.event || e;
    if (evt.keyCode == 13) {
        btsubmit();
    }
}

function btsubmit() {
    var PU = $("#BU").combobox('getValue');
    //PU = "PU3";
    if (PU == "") {
        qmsEasyUIalertWarning("Login", "Please select PU!");
        return;
    }
    var remember = "N";
    if ($("#remember").is(':checked')) {
        remember = "Y";
    }
    var UID = document.getElementById('username').value;
    var PassWord = document.getElementById('password').value;
    //UID = "A1082696";
    //PassWord = "ubuntu20.10";
    if (UID == "" || PassWord == "") {
        qmsEasyUIalertWarning("Login", "PassWord or UserName is empty!");
        return;
    }
    var UserRight = "Login";
    var url = baseUrl + "/Home/MainMenuUI?UID=" + UID + "&PU=" + PU;
    $.ajax({
        type: "POST",
        url: baseUrl + "/Home/Login?UID=" + encodeURIComponent(UID) + "&PassWord=" + encodeURIComponent(PassWord) + "&UserRight=" + UserRight + "&remember=" + remember + "&PU=" + PU,
        data: "",
        success: function (msg) {
            if (msg == "PASS") {
                //$(window).attr('location', url);
                //window.location(url);
                window.location.href = url;
            }
            else {
                qmsEasyUIalertError("Login", JSON.stringify(msg));
            }
        },
        error: function (msg) {
            qmsEasyUIalertError("Login", JSON.stringify(msg));
        }
    });
}
 
//function remeberNameAndPwd() {//这里是当页面是从注册页面注册成功过来       
//    var remFlag = $("#remember").is(':checked');
//    if (remFlag == true) {
//        checkFlag = true;
//    }        //当在login.html页面点击是否记住z      
//    $("#remember").click(function () {
//        var remFlag = $("#remember").is(':checked');
//        if (remFlag == true) {
//            $("#remember").attr("checked", true);
//            checkFlag = true;
//        }
//        else {
//            $("#remember").attr("checked", false);
//            checkFlag = false;
//        }
//    })
//}


//$.ajax({
//    async: false,
//    type: "POST",
//    url: baseUrl + "/Home/GetBU",
//    data: "",
//    success: function (OptionValue) {
//        var item = JSON.parse(OptionValue);
//        $("#BU").append("<option></option>");
//        for (var i = 0; i < item.length; i++) {
//            var itemValue = item[i];
//            for (var val in itemValue) {
//                $("#BU").append("<option value=" + itemValue[val] + ">" + itemValue[val] + "</option>");
//            }
//        }
//    },
//    error: function (msg) {
//        qmsEasyUIalertError("Error", msg);
//    }
//});