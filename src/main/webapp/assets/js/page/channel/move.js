var channelId = $('#channelId').val();
var websiteId = $('#website').val();
Cookies.set('ydWebsiteId', websiteId);

$('#website').change(function(){
	var temp = $(this).val();
	Cookies.set('ydWebsiteId', temp);
	$('.channelTreeDiv').hide();
	
	$.fn.zTree.init($("#channelTree" + temp), gztree.setting, gztree.filterTreeNodes["channelTree" + temp]);
	
	$('#website'+temp).show();
	
	Cookies.remove('ydChannelId');
	
});

function onCheck(event, treeId, treeNode) {
	if(treeNode.checked)
	{
		Cookies.set('ydChannelId', treeNode.level == 0 ? 0 : treeNode.id);
	}
	else
	{
		Cookies.remove('ydChannelId');
	}
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
		chkStyle: "radio",
		radioType : "all"
	}
};

bootbox.setDefaults({
    locale: "zh_CN",
});

$(document).ready(function() {
	$.ajax({
		type : "POST",
		url : "/article/system/channel/queryFilterChannelTree",
		data : {id:channelId,websiteId:websiteId},
		success : function(result) {
			if(result.status == "200"){
				gztree.treeNodes = result.data;
				for (var i=0; i<result.data.length; i ++) {
					var obj = result.data[i];
		        	gztree.filterTreeNodes[obj.name] = obj.filterData;
					var tree = gztree.initZtree(obj.name, setting, obj.filterData);
				}
			}else{
				bootbox.alert("获取树失败！status:"+result.status+"  msg:" + result.msg);
			}
		}
	});
});