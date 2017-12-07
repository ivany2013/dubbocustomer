(function() {
    syncZtree = {
    	setting : "",
    	jsonData : "",	
        init: function() {
            this.bindEvent();
            this.keyUp();
        },
        logic: {
        	
        },
        bindEvent: function() {
        	$(".search-value-js").bind("focus", this.focusKey)
        	.bind("blur", this.blurKey)
        	.bind("propertychange", this.searchNode)
        	.bind("input", this.searchNode);
        },
        
        initZtree: function(ele,setting,jsonData) {
        	syncZtree.setting = setting;
        	syncZtree.jsonData = jsonData;
        	setting.view = {
        	  fontCss: syncZtree.setHighlight // 高亮一定要设置，setHighlight是自定义方法
        	}
        	var tree = $.fn.zTree.init($("#" + ele), setting, jsonData);
        	return tree;
        },
        
		searchNode : function (e) {
			var treeId = $(e.target).closest("div").next("ul").attr("id");
			var num = $(e.target).closest(".page-body").find("#syncWebsiteTab li.active a").attr("num");
			
			$.fn.zTree.init($("#" + treeId), syncZtree.setting, jsonArrayAll[num-1].jsonArray);
			var lastValue = "", nodeList = [];
			
			var zTree = $.fn.zTree.getZTreeObj(treeId);
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
			
			syncZtree.updateNodes(false, nodeList, treeId);
			
			console.log(value);
			nodeList = zTree.getNodesByParamFuzzy(keyType, value);
			syncZtree.updateNodes(true, nodeList, treeId);
		},
		
		/**
		 * 搜索内容高亮
		 */
		updateNodes : function(highlight, nodeList, treeId) {
			var zTree = $.fn.zTree.getZTreeObj(treeId);
			zTree.expandNode(zTree.getNodes()[0],true);
			for( var i=0, l=nodeList.length; i<l; i++) {
				nodeList[i].highlight = highlight;
				zTree.updateNode(nodeList[i]);
				zTree.expandNode(nodeList[i].getParentNode(),true);
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
		}
		
    };

	$(function(){
		syncZtree.init();
	});				    
})();