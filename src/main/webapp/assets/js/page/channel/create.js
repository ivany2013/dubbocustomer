$(document).ready(function () {
    $("#channnelForm").bootstrapValidator();
});

$('#channelSubmit').click(function(){
	 var bootstrapValidator = $("#channnelForm").data('bootstrapValidator');
	   bootstrapValidator.validate();
	   if(!bootstrapValidator.isValid()) return;
	   
	$('#channelSubmit').attr('disabled',true);   
	
	if($('#accessScore').val() == ''){
		$('#accessScore').val(0);
	}
	$('.input-group.showcy.channelEditors').each(function(index){
	
		var id=$(this).find('.editorId');
		var version=$(this).find('.version');
		var editorId=$(this).find('.channelEditorId');
		var editorName=$(this).find('.channelEditorName');
		
		if(id){
			$(id).attr('name', id.attr('name').replace(/0/,index));
		}
		if(version){
			$(version).attr('name', version.attr('name').replace(/0/,index));
		}
		$(editorId).attr('name', editorId.attr('name').replace(/0/,index));
		$(editorName).attr('name', editorName.attr('name').replace(/0/,index));
		
	});
	var data = $('#channnelForm').serialize();
	
	bootbox.setDefaults({
        locale: "zh_CN",
    });
	
	$.ajax({
       type: "POST",
       url: "/article/system/channel/addChannel",
       data: data,
       success: function(result){
         if(result.status == "200")
    	 {
        	$.msg("新增成功！");
        	setTimeout(function(){
        		var mainFrame = document.getElementById("main_frame") || top.document.getElementById("main_frame");
	     		if(mainFrame){
	     			var websiteId = $('#websiteId').val();
	     			mainFrame.src="/article/system/channel/toChannelManage?websiteId="+websiteId+"&id="+result.data.id;
	     		}
	     		else
	 			{
	     			bootbox.alert("新增成功！mainFrame对象不存在，无法实现跳转");
	 			}
	     		},1000) ;
    	 }
         else
    	 {
        	 bootbox.alert("新增失败！status:"+result.status+"  msg:" + result.msg);
        	 $('#channelSubmit').attr('disabled',false);
    	 }
       }
    });
})

$("#bootbox-options,#bootbox-options2").on('click', function () {
    bootbox.dialog({
        message: $("#myModal").html(),
        title: "选择模板",
        lage:true,
        className: "modal-inverse",
        buttons: {
            success: {
                label: "确认",
                className: "btn-primary",
                callback: function () { }
            },
            cancel: {
                label: "取消",
                className: "btn-primary"

            }
        }
    });
});
$("#addEdite").on('click', function () {
    bootbox.dialog({
        message: $("#addEditeModal").html(),
        title: "选择编辑员",
        lage:true,
        className: "modal-inverse",
        buttons: {
            success: {
                label: "确认",
                className: "btn-primary",
                callback: function () { 
                	$('#currentEditors').prepend($('#temp_Editors').html());
                	$('#temp_Editors').html('');
                }
            },
            cancel: {
                label: "取消",
                className: "btn-primary"

            }
        }
    });
});
$("#sflx").on('click', function () {
    bootbox.dialog({
        message: $("#sflxModal").html(),
        title: "选择业务",
        lage:true,
        className: "modal-inverse",
        buttons: {
            success: {
                label: "确认",
                className: "btn-primary",
                callback: function () { }
            },
            cancel: {
                label: "取消",
                className: "btn-primary"

            }
        }
    });
});
//$("#return").on("click",function(){
//    //mainjs.changeLevel();
//    window.history.go(-1)
//})
bootbox.setDefaults({
    locale: "zh_CN",
});
$("body").on("click",".showcy .btn-default",function(){
    var _this = this
    bootbox.confirm("确认移除?", function (result) {
        if (result) {
            $(_this).parents(".showcy").remove();
        }
    });
})

$("body").on("click",".bjyl",function(){
    var editorType = parseInt($('#editorType').val());
    var src="";
    switch(editorType){
	    case 0 : src="http://a.mysteelcdn.com/libs/article/assets/img/xzwz.png"; break;
	    case 1 : src="http://a.mysteelcdn.com/libs/article/assets/img/kbwz.png"; break;
	    case 2 : src="http://a.mysteelcdn.com/libs/article/assets/img/ksrb.png"; break;
	    case 3 : src="http://a.mysteelcdn.com/libs/article/assets/img/xztw.png"; break;
    }
    
    bootbox.dialog({
        message: '<img width="100%" src="'+src+'" />',
        title: "编辑器预览",
        lage:true,
        className: "modal-inverse",
        buttons: {
            success: {
                label: "确认",
                className: "btn-primary",
                callback: function () { }
            },
            cancel: {
                label: "取消",
                className: "btn-primary"

            }
        }
    });
})
        
$("body").on("click","#reload",function(){
    var _this = this
    bootbox.confirm("确认重置?", function (result) {
        if (result) {
            window.location.reload();
            document.getElementById("channnelForm").reset();
        }
    });
})
