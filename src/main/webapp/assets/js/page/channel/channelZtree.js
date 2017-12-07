
 var   gztree = {
    	setting : "",
    	treeNodes : {},	
    	filterTreeNodes : {},
        init: function() {
            this.bindEvent();
            this.keyUp();
        },
        logic: {
        	
        },
        bindEvent: function() {
        	$(".searchBtn").on("click", this.searchNodeBtn);
        	$(".search-value-js").bind("focus", this.focusKey)
        	.bind("blur", this.blurKey)
        	.bind("propertychange", this.searchNode)
        	.bind("input", this.searchNode);
        },
        
        initZtree: function(ele,setting,jsonData) {
        	gztree.setting = setting;
        	setting.view = {
        	  fontCss: gztree.setHighlight // 高亮一定要设置，setHighlight是自定义方法
        	}
        	var tree = $.fn.zTree.init($("#" + ele), this.setting, jsonData);
        	return tree;
        },
        
        searchNodeBtn : function (e) {
        	var lastValue = "", nodeList = [];
			var treeId = $(e.target).closest("div").nextAll("div:visible").find("ul").attr("id");
			var zTree = $.fn.zTree.getZTreeObj(treeId);
			
			var allNodes = gztree.getAllNodes(zTree);
			gztree.updateNodes(false, allNodes, treeId,false);
			
			var value = $.trim($(e.target).closest("div").find('#searchChannel').val());
			
			var keyType = "name";
			
			if (value === ""){
				return;
			}
			if (lastValue === value) return;
			lastValue = value;
			
			nodeList = zTree.getNodesByParamFuzzy(keyType, value);
			gztree.updateNodes(true, nodeList, treeId, true);
		},
		
		searchNode : function (e) {
			var treeId = $(e.target).closest("div").nextAll("div:visible").find("ul").attr("id");
			
			var zTree = $.fn.zTree.getZTreeObj(treeId);
			var allNodes = gztree.getAllNodes(zTree);
			gztree.updateNodes(false, allNodes, treeId, false);
			
			var lastValue = "", nodeList = [];
			
			var value = $.trim($(e.target).val());
			
			var keyType = "name";
			if ($(e.target).hasClass("empty")) {
				value = "";
			}
			if (value === ""){
				return;
			}
			if (lastValue === value) return;
			lastValue = value;
			
			nodeList = zTree.getNodesByParamFuzzy(keyType, value);
			gztree.updateNodes(true, nodeList, treeId, true);
		},
		
		/**
		 * 搜索内容高亮
		 */
		updateNodes : function(highlight, nodeList, treeId, isExpand) {
			var zTree = $.fn.zTree.getZTreeObj(treeId);
			for( var i=0, l=nodeList.length; i<l; i++) {
				if(nodeList[i].parentTId == null){
					continue;
				}
				nodeList[i].highlight = highlight;
				zTree.updateNode(nodeList[i]);
				if(isExpand){
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
  	    
  	    focusKey : function (e) {
			if ($(e.target).hasClass("empty")) {
				$(e.target).removeClass("empty");
			}
		},
		blurKey : function (e) {
			if ($(e.target).value === "") {
				$(e.target).addClass("empty");
			}
		},
		getAllNodes : function (zTree){
			return zTree.transformToArray(zTree.getNodes());
		}
    };

	$(function(){
		gztree.init();
	});				    
