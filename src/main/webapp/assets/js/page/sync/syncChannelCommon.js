function getCheckedNodeLocation(treeObj, websiteName, type){
	var curLocation="";//当前位置
	//var treeObj = $.fn.zTree.getZTreeObj(treeId);
	var nodes = null;
	if("selected" == type){
		nodes = treeObj.getSelectedNodes()
	}else if("checked" == type){
		nodes = treeObj.getCheckedNodes();
	}
	
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
	
	var location = "";
	var nodeArrs = curLocation.split("-");
	for(var i = nodeArrs.length-1;i >= 0;i--){
		location += nodeArrs[i] + "/";
	}
	if(websiteName != "" && websiteName != null){
		location = websiteName + "/" + location.substring(0, location.lastIndexOf("/"));
	}else{
		location = location.substring(0, location.lastIndexOf("/"))
	}
	return location;
}