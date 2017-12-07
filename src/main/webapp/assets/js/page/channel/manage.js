$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	var websiteId = $(e.target).parent().find('.websiteId').val();
	console.log($('#chanelFrame'+websiteId)[0]);
	$('#chanelFrame'+websiteId)[0].contentWindow.mainModule.prototype.autowindow();
})

var websiteId= $('#myTab9 .active .websiteId').val();
var defalutTreeId = $('.tab-content ').find('div:visible').find('.ztree').attr('id');
var channelTreePath='';
function onClick(event, treeId, treeNode) {
	channelTreePath=getCheckedNodeLocation(treeId);
	websiteId= $('#myTab9 .active .websiteId').val();
	$('#'+treeId).parent().parent().parent().parent().parent().find('.header.site.name').html(treeNode.name);
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    var nodes = zTree.getSelectedNodes();
    if(treeNode.disable === true){
        zTree.cancelSelectedNode(nodes[0]);
    }
    var url = '';
    if(treeNode.level === 0)
    {
    	url="/article/system/channel/websiteDetail?websiteId=" + websiteId+"&channelPath="+channelTreePath;
    }
    else
    {
    	url="/article/system/channel/channelDetail?channelId=" + treeNode.id + "&channelPath="+channelTreePath;
    }
	$('#chanelFrame'+websiteId).attr("src",url);
}
//频道树设置
var setting = {
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onClick: onClick
    }
};
bootbox.setDefaults({
    locale: "zh_CN",
});

$(document).ready(function(){
	var pageChannelId = $('#pageChannelId').val();
	$.ajax({
	       type: "POST",
	       url: "/article/system/channel/queryChannelTree",
	       async: false,
	       success: function(result){
	    	 if(result.status == "200"){
		         for(var i=0; i<result.data.length; i ++)
	        	 {
		        	 var obj = result.data[i];
		        	 gztree.treeNodes[obj.name] = obj.data;
		        	 gztree.filterTreeNodes[obj.name] = obj.filterData;
		        	 
		        	 var tree = gztree.initZtree(obj.name, setting, obj.data);
		        	 var treeObj = $.fn.zTree.getZTreeObj(obj.name);
		        	 if("" === pageChannelId || pageChannelId == 0){
		        		 var nodes = treeObj.getNodes();
			        	 if (nodes.length>0) {
			        	 	treeObj.selectNode(nodes[0]);
			        	 }
		        	 }
		        	 else{
		        		 var node = treeObj.getNodeByParam("id", pageChannelId);
		        		 treeObj.selectNode(node);
		        	 }
	        	 }
	    	 }else{
					bootbox.alert("获取树失败！status:"+result.status+"  msg:" + result.msg);
			  }
	       }
		});
	channelTreePath=getCheckedNodeLocation(defalutTreeId);
	$('#chanelFrame'+websiteId).attr('src',$('#chanelFrame'+websiteId).attr('src')+"&channelPath="+channelTreePath);

        //隐藏频道
        $(".bootbox-confirm").on('click', function () {
        	var treeId = $(this).parent().parent().find(".ztree").attr("id");
            if($(this).hasClass("showed")){
                $(this).text("隐藏停用").removeClass("showed");
                gztree.initZtree(treeId, setting, gztree.treeNodes[treeId]);
            }else{
                $(this).text("显示全部").addClass("showed")
                gztree.initZtree(treeId, setting, gztree.filterTreeNodes[treeId]);
            }
            $(this).closest('div').next().find('.search-value-js').trigger("input");
            
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            var nodes = treeObj.getNodes();
            treeObj.selectNode(nodes[0]);
	       	$('#'+treeId).parent().parent().parent().parent().parent().find('.header.site.name').html(nodes[0].name);
	       	var url = "/article/system/channel/websiteDetail?websiteId=" + websiteId;
	    	$('#chanelFrame'+websiteId).attr("src",url);
        });
        //选择站点
        $("#sitechange .dropdown-menu a").on("click",function(){
            var _text = $(this).text();
            $(this).parents(".btn-group").find("a").first().text(_text);
            alert(_text);
        })
    });

function getCheckedNodeLocation(treeId){
	var curLocation="";//当前位置
	var treeObj = $.fn.zTree.getZTreeObj(treeId);
	var nodes = treeObj.getSelectedNodes()
	
	if(nodes.length>0){
		var currentNodeName = nodes[0]['name'];//获取当前选中节点
		var parentNode = nodes[0].getParentNode();
		getParentNodes(parentNode, currentNodeName);
	}
	function getParentNodes(parentNode,currentNodeName){
		if(parentNode!=null){
			currentNodeName = parentNode['name'] + "/" + currentNodeName;
			curNode = parentNode.getParentNode();
			getParentNodes(curNode,currentNodeName);
		}else{
			//根节点
			curLocation = currentNodeName;
		}
	}
	
	if(curLocation.split("").length > 0){
		curLocation += "/";
	}
	return curLocation;
}
