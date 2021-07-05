var formOption = {
    ReplaceContainer:'.replace-container'
};
$(function () {
    $("form").ajaxForm({
        beforeSubmit: function () {
            //alert('提交');
            window.document.body.style.cursor = "wait";
            if (formOption.onBeforeSubmit) {
                var checkResult = formOption.onBeforeSubmit.call();
                if (!checkResult) {
                    window.document.body.style.cursor = "default";
                }
                return checkResult;
            }

            layer.load(1);
        },
        success: function (html) {
            window.document.body.style.cursor = "default";
            layer.closeAll('loading');
            $(formOption.ReplaceContainer).html(html);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            ShowAjaxError(jqXHR, textStatus, errorThrown)
            window.document.body.style.cursor = "default";
            layer.closeAll('loading');
        },
        data: { "X-Requested-With": "XMLHttpRequest" }
    });
})

/***Ajax默认错误函数***/
function ShowAjaxError(jqXHR, textStatus, errorThrown) {
    switch (jqXHR.status) {
        case (500):
            layer.alert("服务器系统内部错误！");
            break;
        case (511):
            layer.alert("当前页面不允许输入特殊字符或html标签！");
            break;
        case (401):
            layer.alert("无权限执行此操作！");
            break;
        case (404):
            layer.alert("请求路径不存在！");
            break;
        case (408):
            layer.alert("请求超时！");
            break;
        default:
            layer.alert("系统发生异常，请联系系统管理员！");
    }
};