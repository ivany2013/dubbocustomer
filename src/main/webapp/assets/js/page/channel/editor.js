$("body").on("click",".showcy .btn-default",function(){
	var treeNodeId = $(this).parents(".showcy").find('.channelEditorId').val();
	var treeObj = $.fn.zTree.getZTreeObj("adminTree");
	
	var nodes = treeObj.getCheckedNodes(true);
	for(var i = 0 ; i < nodes.length ; i ++){
		if(nodes[i].id == treeNodeId)
		{
			treeObj.checkNode(nodes[i], false, false);
		}
	}
	
    $(this).parents(".showcy").remove();
})

function onCheck(event, treeId, treeNode) {
	var adminIds=[];
	var adminNames=[];
	
	if(treeNode.checked)
	{
		var adminTreeHTML = '<div class="input-group showcy channelEditors">'
						+ '<input type="hidden" class="editorId" name="editorList[0].id"/>'
						+ '<input type="hidden" class="version" name="editorList[0].version"/>'
						+ '<input type="hidden" class="channelEditorId" '
						+ 'name="editorList[0].editorId" value="' + treeNode.id + '"/>'
						+ '<input type="hidden" class="channelEditorName" '
						+ 'name="editorList[0].editorName" value="' + treeNode.name +'"/>'
						+ '<span class="form-control">' + treeNode.name + '</span>'
						+ '<span class="input-group-btn"><button class="btn btn-default blue_color admin_btn' + treeNode.id + '" type="button">移除</button></span></div>';
		$('#currentEditors').prepend(adminTreeHTML);
	}
	else
	{
		$(".admin_btn"+treeNode.id).click();
	}
	parent.document.getElementById('temp_Editors').innerHTML=$('#currentEditors').html();
}

// 频道树设置
var setting = {
	data : {
		simpleData : {
			enable : true
		}
	},
	callback : {
		onCheck: onCheck
	},
	check: {
		enable: true,
		chkboxType: {"Y":"", "N":""}
	}
};

bootbox.setDefaults({
    locale: "zh_CN",
});

$(document).ready(function() {
	var channelEditorIds = '';
	var channelForm = parent.document.getElementById('channnelForm');
	$(channelForm).find('.channelEditorId').each(function(index){
		if(index > 0){
			channelEditorIds += ',';
		}
		channelEditorIds += $(this).val();
	})
	$.ajax({
		type : "POST",
		url : "/queryAdminTree",
		data : {selectIds:channelEditorIds,isFilter:true},
		async : false,
		success : function(result) {
			if(result.status == "200"){
				var topNode = {id:"depart0",pId:"0",name:"上海钢联组织架构",isParent:true,open:true,nocheck:true}
				result.data.unshift(topNode);
				adminZtree.treeNodes=result.data;
				adminZtree.initZtree('adminTree', setting, result.data);
			}
			else{
				bootbox.alert("获取树失败！status:"+result.status+"  msg:" + result.msg);
			}
		}
	});
});