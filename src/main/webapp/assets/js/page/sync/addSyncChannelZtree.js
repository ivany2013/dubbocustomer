(function() {
    addSyncChannelZtree = {
    	element : "",
    	setting : "",
    	jsonData : "",	
    	//key : ,
        init: function() {
            this.bindEvent();
            this.keyUp();
        },
        logic: {
        	
        },
        bindEvent: function() {
        	//$("body").on("click", "#searchBtn", this.searchNode);
        	$("body").on("click", "#searchBtn",this.searchNode);
        },
        
        initZtree: function(ele,setting,jsonData) {
        	this.element = ele;
        	this.setting = setting;
        	this.jsonData = jsonData;
        	setting.view = {
        	  fontCss: addSyncChannelZtree.setHighlight // 高亮一定要设置，setHighlight是自定义方法
        	}
        	var tree = $.fn.zTree.init($("#" + ele), setting, jsonData);
        	return tree;
        },
        
		searchNode : function (e) {
			var key = $("#searchValue");
			var lastValue = "", nodeList = [];
			var zTree = $.fn.zTree.getZTreeObj(addSyncChannelZtree.element);
			var allNodes = addSyncChannelZtree.getAllNodes(zTree);
			addSyncChannelZtree.updateNodes(false, allNodes, false);
			
			var value = $.trim($("#searchValue").val());
			if(value.trim()==""){
				value=$.trim($("#searchValue1").val());
			}
			var keyType = "name";
			if (key.hasClass("empty")) {
				value = "";
			}
			if (value === ""){
				return;
			}
			if (lastValue === value) return;
			lastValue = value;
			
			nodeList = zTree.getNodesByParamFuzzy(keyType, value);
			addSyncChannelZtree.updateNodes(true, nodeList, true);
		},
		
		/**
		 * 搜索内容高亮
		 */
		updateNodes : function(highlight, nodeList, isExpand) {
			var zTree = $.fn.zTree.getZTreeObj(addSyncChannelZtree.element);
			for( var i=0, l=nodeList.length; i<l; i++) {
				if(nodeList[i].parentTId == null){
					continue;
				}
				nodeList[i].highlight = highlight;
				zTree.updateNode(nodeList[i]);
				if(isExpand){
					//zTree.expandNode(zTree.getNodes()[0],true);
					zTree.expandNode(nodeList[i].getParentNode(),true);
				}
			}
		},
		
		/**
		 * 键盘 enter 键
		 */
		keyUp : function(){
			$(document).keydown(function(event){
				if(event.keyCode==13){
					$("body #searchBtn").trigger("click");
				}
			});	
		},
		
		setHighlight : function (treeId, treeNode) {
		   if(treeNode.highlight){
			  return {color:"#A60000", "font-weight":"bold"};
	       }else if(treeNode.disable === true){
	    	  return {'color':'#ccc'};
	       }else{
	    	  return {color:"#333", "font-weight":"normal"};
	       }
  	    },
  	    
  	    getAllNodes : function (zTree){
			var nodes1 = zTree.getNodes();
			var nodes2 = zTree.transformToArray(nodes1);
			return nodes2;
		}
		
    };

	$(function(){
		addSyncChannelZtree.init();
	});				    
})();