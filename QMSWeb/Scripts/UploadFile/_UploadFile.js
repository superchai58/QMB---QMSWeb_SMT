$(document).ready(function () {
    if (document.referrer == "") {
        $(window).attr('location', baseUrl + "/Home/Index");
        return;
    }
    var pu = $("#PU").text();
    var uid = $("#UserID").text();
    $("#tree").tree({
        url: baseUrl + "/UploadFile/getTreeJson?PU=" + pu + "&uid=" + uid,
        animate: true,
        onClick: function (node) {
            var NodeObj = $(this).tree("getSelected", node.target);
            //var NodeObj = $(this).tree("getSelected");
            NodeObj = NodeObj.attributes;
            getMenuList(NodeObj);
        }
    });
})

function getMenuList(ObjectName) {
    var pu = $("#PU").text();
    $.ajax({
        type: "POST",
        url: baseUrl + "/UploadFile/getMenuList?ObjectName=" + ObjectName + "&PU=" + pu,
        data: "",
        success: function (partialView) {
            $("#PartialView").html(partialView);
        },
        error: function (msg) {
            qmsEasyUIalertError("", msg);
        }
    });
}
