function GotoPage(url) {
    $.ajax({
        url: url,
        type: 'GET',
        success: function(html) {
            $("#replace-part").html(html)
        }
    })
}

function GetLastOpenWindow(windowName) {
    var index = parseInt(top.layer.getFrameIndex(windowName)); //先得到当前iframe层的索引
    var lastIndex = 0;
    $(".layui-layer-iframe").each(function(i, e) {
        var cIndex = parseInt($(this).attr("times"));
        if (cIndex > lastIndex && cIndex < index)
            lastIndex = cIndex;
    });
    var iframe = $("#layui-layer-iframe" + lastIndex);
    if (iframe && iframe.length > 0) {
        return $("#layui-layer-iframe" + lastIndex)[0].contentWindow;
    }
    return window;
}

function changeIdentity(id) {
    $.ajax({
        url: '/Home/ChangeIndentity',
        type: 'POST',
        data: 'id=' + id,
        dataType: 'Json',
        success: function(rsp) {
            if (rsp.Success) {
                window.location.reload();
            }
            else {
                layer.alert(rsp.Message);
            }
        }
    })
}

function changeSizeTofit(img) {
    var imgWidth = img.naturalWidth;
    var imgHeight = img.naturalHeight;
    var $img = $(img);
    var frameWidth = $img.parent().width();
    var frameHeight = $img.parent().height();
    if (imgWidth && imgHeight) {
        if ((imgHeight / imgWidth) > (frameHeight / frameWidth)) {
            $img.width("100%");
            $img.height("auto");
            $img.css("margin-top", (-((imgHeight / imgWidth) - (frameHeight / frameWidth)) / 2 * frameHeight) + "px");
        }
        else {
            $img.height("100%");
            $img.width("auto");
            $img.css("margin-left", (-((imgWidth / imgHeight) - (frameWidth / frameHeight)) / 2 * frameHeight) + "px");
        }
    }
}

function changePassword() {
    layer.open({
        type: 2,
        title: '修改密码',
        shadeClose: true,
        shade: false,
        maxmin: false, //开启最大化最小化按钮
        area: ['600px', '400px'],
        content: '/Member/Account/ChangePasswordDialog'
    });
}

function initialImgSize(content) {
    if (!content) {
        content = $("body");
    }
    $("img", content).each(function(i, e) {
        if (e.complete) {
            changeSizeTofit(e);
        }
        else {
            e.onload = function() {
                if (e.naturalWidth) {
                    changeSizeTofit(e);
                }
                else {
                    e.onload = function() {
                        changeSizeTofit(e);
                    }
                }
            }
        }

    });
}

function openNewPage(url) {
    var link = $("#openlink_h");
    if (!link || link.length == 0) {
        link = $("<a id='openlink_h' style='display:none' target='_blank'></a>").appendTo($("body"));
    }
    link.attr("href", url);
    link[0].click();
}

function checkboxInitial(content) {
    if (navigator.userAgent.indexOf("MSIE 8.0") > 0) {
        return;
    }
    if (!content)
        content = "body";
    content = $(content);
    var random = Math.round(Math.random() * 100);
    var rid = 0;
    $("input[type='checkbox']").each(function(i, e) {
        dealinput(e, random, rid);
        rid++;
    })
    $("input[type='radio']").each(function(i, e) {
        dealinput(e, random, rid);
        rid++;
    })
}

function dealinput(e, random, rid) {
    var input = $(e);
    if (!input.attr("id")) {
        input.attr("id", "rid" + random.toString() + rid.toString());
    }
    var span = input.next();
    var label = null;
    if (span && span.length > 0 && span[0].tagName == "LABEL") {
        var name = span.html();
        label = span.html(e).append('<i class="fa fa-check"></i>').addClass("switch-item").append('<span>' + name + '</span>');
        if (label.attr("for")) {
            input.attr("id", label.attr("for"));
        }
    }
    else {
        label = $('<label class="switch-item" for="' + input.attr("id") + '"></label>').insertBefore(e).append(e).append('<i class="fa fa-check"></i>');
        if (span && span.length > 0 && span[0].tagName == "SPAN") {
            span.appendTo(label);
        }
    }
}

function initializeDecimal() {
    var commonInstance = this;
    $('.decimal').each(
        function() {
            var digit = 2;
            if ($(this).attr("digit")) {
                digit = parseInt($(this).attr("digit"));
            }
            if (isNaN(digit)) {
                digit = 2;
            }
            $(this).val(commonInstance.formatNumber($(this).val(), digit));
        }
    );
    $(".number").forceNumeric();
    $(".decimal").forceDecimal();
}

/* 文本框只允许输入浮点数
----------------------------------------------------------*/
$.fn.forceDecimal = function() {
    return this.each(function() {
        $(this).keydown(function(e) {
            var key = e.which || e.keyCode;
            var arrVal = $(this).val().split(".");
            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                // numbers   
                (key >= 48 && key <= 57) ||
                // Numeric keypad
                (key >= 96 && key <= 105) ||
                // comma, period and minus, . on keypad
                key == 188 || key == 109 ||
                // Backspace and Tab and Enter
                key == 8 || key == 9 || key == 13 ||
                // Home and End
                key == 35 || key == 36 ||
                // left and right arrows
                key == 37 || key == 39 ||
                // Del and Ins
                key == 46 || key == 45 || ((key == 190 || key == 110) && arrVal.length <= 1) || key == 229) {
                return true;
            }
            return false;
        });
        $(this).keyup(function() {
            $(this).val($(this).val().replace(/[^0-9.]/g, ''));
            var digit = $(this).attr("digit");
            var arrVal = $(this).val().split(".");
            if (digit && arrVal.length == 2 && arrVal[1].length > parseInt(digit)) {
                $(this).val(arrVal[0] + "." + arrVal[1].substr(0, parseInt(digit)));
            }
        }).css("ime-mode", "disabled");
    });
};

/* 让文本框只允许输入数字
----------------------------------------------------------*/
$.fn.forceNumeric = function() {
    return this.each(function() {
        $(this).keydown(function(e) {
            var key = e.which || e.keyCode;
            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                // numbers   
                (key >= 48 && key <= 57) ||
                // Home and End
                key == 35 || key == 36 ||
                // Numeric keypad
                (key >= 96 && key <= 105) ||
                // left and right arrows
                key == 37 || key == 39 ||
                // Backspace and Tab and Enter
                key == 8 || key == 46 || key == 13 || key == 9 || key == 229)
                return true;
            //alert(e.which + '|' + e.keyCode);
            return false;
        });
        $(this).keyup(function() {
            $(this).val($(this).val().replace(/\D|/g, ''));
        }).css("ime-mode", "disabled");
    });
};

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

var url = "/Member/Message/GetNewMsg?temptag=" + new Date();
$(function() {
    setInterval(function() {
        CheckingNewMsg();
    }, 10000);
})
function CheckingNewMsg() {
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'JSON',
        success: function(model) {
            if (model == false) {
                return;
            }
            if (parseInt(model.Message) > 0) {
                $("#divNewMsg").text(model.Message).show();
                $("#linewmsg").addClass('circle')
            }
            else
                $("#divNewMsg").hide();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //ShowAjaxError(jqXHR, textStatus, errorThrown)
        }
    });
}

/**************************************时间格式化处理************************************/
function dateFtt(fmt, date) { //author: meizz   
    var o = {
        "M+": date.getMonth() + 1,                 //月份   
        "d+": date.getDate(),                    //日   
        "h+": date.getHours(),                   //小时   
        "m+": date.getMinutes(),                 //分   
        "s+": date.getSeconds(),                 //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//创建时间格式化显示
function crtTimeFtt(value, format) {
    var crtTime = new Date(value);
    return dateFtt(format, crtTime);//直接调用公共JS里面的时间类处理的办法     
}

function initialTextArea() {
    $("textarea").each(function (i, e) {
        var ta= $(e);
        var maxLength = ta.attr("data-val-length-max");
        if (maxLength) {
            var container = $("<div/>", { class: "ta-container", style: "width:" + e.style.width + ";height:" + ta.css("height") }).insertBefore(ta).append(ta);
            $("<div/>", { class: "ta-counter" }).appendTo(container).html(ta.val().length + "/" + maxLength);
            ta.css("width","100%");
            ta.height("height","100%");
        }
    });

    $("textarea").keyup(function() {
        $(".ta-counter", $(this).closest(".ta-container")).html($(this).val().length + "/" + $(this).attr("data-val-length-max"))
    });
}