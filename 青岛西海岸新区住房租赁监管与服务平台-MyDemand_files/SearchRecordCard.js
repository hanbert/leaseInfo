function autoFocus(objId) {
    var currentid = "#SequenceID" + (objId);
    var nextid = "#SequenceID" + (objId + 1);
    if ($(currentid).val().length >= 4 && $(nextid) != undefined) {
        $(nextid).focus();
    }
}

$(document).ready(function () {
    if ($.trim($("#SequenceID").val()) != "")
    {
        var str = $.trim($("#SequenceID").val());

        $("#SequenceID1").val(str.substring(0, 4));
        $("#SequenceID2").val(str.substring(4, 8));
        $("#SequenceID3").val(str.substring(8, 12));
        $("#SequenceID4").val(str.substring(12, 16));

        debugger;
        if ($("#SequenceID1").val().length == 4 && $("#SequenceID2").val().length == 4 && $("#SequenceID3").val().length == 4 && $("#SequenceID4").val().length >= 1) {
            {
                debugger;
                SearchRecordCard();
                $("#SequenceID").val("");
            }
        }
    }
       

    $(":input[id^='SequenceID']").bind('keyup', handleAddr);

    $(":input[id^='SequenceID']").keydown(function (event) {
        if (event.keyCode == 8) {//keycode为8表示退格键
            var current = this;
            var currvalue = current.value;
            var index = parseInt(current.id.substring(10));
            var currentid = "#SequenceID" + (index);
            var preid = "#SequenceID" + (index - 1);
            if ($(currentid).val().length == 0 && $(preid) != undefined) {
                $(preid).focus();
            }
        }
    });

    $('input[id^="SequenceID"]').bind('paste', function (e) { 
        var pastedText = undefined;
        if (window.clipboardData && window.clipboardData.getData) { // IE
            pastedText = window.clipboardData.getData('Text');
        } else {
            pastedText = e.originalEvent.clipboardData.getData('Text');//e.clipboardData.getData('text/plain');
        }
        //alert(pastedText);
        var index = parseInt($(this).attr("id").replace('SequenceID', ''));
        pasteRemaind(index, index,pastedText);
        
    });
});

function pasteRemaind(index,startIndex,text){
    index++;
    if (text.length<(index-startIndex)*4)
        return;
    var partText='';
    if (text.length<(index-startIndex)*4+4){
         partText = text.substr((index-startIndex)*4,text.length-(index-startIndex)*4);      
    }
    else{
        partText = text.substr((index-startIndex)*4,4);
    }
    $("#SequenceID"+index).val(partText);
    if(index<4){
        pasteRemaind(index,startIndex,text);
    }
}

function ClearSearch() {
    $("#SequenceID1").val("");
    $("#SequenceID2").val("");
    $("#SequenceID3").val("");
    $("#SequenceID4").val("");
    $("#searchnameID").val("");
    $("#searchnumID").val("");

    clearSearchResult();
}


function clearSearchResult() {
    $("#txtTransactor").html("");
    $("#txtCertificateType").html("");
    $("#txtCertificateNum").html("");
    $("#txtRentDate").html("");
    $("#txtArea").html("");

    $("#txtSubmitDate").html("");
    $("#txtRegisterNum").html("");
    $("#txtRemark").html("");
}

function handleAddr() {
    var current = this;
    var currvalue = current.value;
    var index = parseInt(current.id.substring(10));
    autoFocus(index);
}

function SearchRecordCard() {
   
    
    var name = $("#searchnameID").val();
    var sfz = $("#searchnumID").val();
       
    if ($("#SequenceID1").val().length == 0 && $("#SequenceID2").val().length == 0 && $("#SequenceID3").val().length == 0 && $("#SequenceID4").val().length == 0 && name == "" && sfz == "") {
        layer.msg('请先输入完整的统一查询号或姓名+身份证进行查询！');
        return false;
    }
    else if ($("#SequenceID1").val().length == 0 && $("#SequenceID2").val().length == 0 && $("#SequenceID3").val().length == 0 && $("#SequenceID4").val().length == 0)
    {
        
        if (name != "" && sfz == "") {
            layer.msg('姓名或身份证不完整，请先输入完整的姓名和身份证进行查询！');
            clearSearchResult();
            return false;
        }
        else if (name == "" && sfz != "") {
            layer.msg('姓名或身份证不完整，请先输入完整的姓名和身份证进行查询！');
            clearSearchResult();
            return false;
        }
        
    }
    else if ($("#SequenceID1").val().length < 4 || $("#SequenceID2").val().length < 4 || $("#SequenceID3").val().length < 4 || $("#SequenceID4").val().length < 4 && name == "" && sfz == "") {
        layer.msg('请先输入完整的统一查询号进行查询！');
        clearSearchResult();
        return false;
    }
    var SequenceID = $("#SequenceID1").val() + $("#SequenceID2").val() + $("#SequenceID3").val() + $("#SequenceID4").val();
   


    $.ajax({
        url: '/House/SearchRecord/GetRecordCard?t=' + new Date(),
        type: "GET",
        dataType: 'Json',
        data: {'SequenceID': SequenceID,'name': name,'sfz':sfz},
        success: function (rsp) {
            if (!rsp.data.ErrorMessage) {
                //$("#searchResult").show();
                $("#txtTransactor").html(rsp.data.Transactor);
                $("#txtCertificateType").html(rsp.data.CertificateType);
                $("#txtCertificateNum").html(rsp.data.CertificateNum);
                $("#txtRentDate").html(rsp.data.RentDate);
                $("#txtArea").html(rsp.data.Area);

                $("#txtSubmitDate").html(rsp.data.SubmitDate);
                $("#txtRegisterNum").html(rsp.data.RegisterNum);
                $("#txtRemark").html(rsp.data.Remark);

            }
            else {
                //layer.alert(rsp.data.ErrorMessage);
                //$("#searchResult").hide();
                clearSearchResult();
                layer.msg(rsp.data.ErrorMessage);
            }
        },
        error: function (e) {
            clearSearchResult();
            layer.msg('查询异常！');
        }
    })








}


