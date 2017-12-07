(function() {
    mySteelZTree = {
    	element : "",
    	setting : "",
    	jsonData : "",	
    	key : $("#searchValue"),
        init: function() {
            this.bindEvent();
            this.keyUp();
        },
        logic: {
        	
        },
        bindEvent: function() {
        	//$("body").on("click", "#searchBtn", this.searchNode);
        	$("#searchBtn").on("click", this.searchNode);
        	$("#searchValue").bind("focus", this.focusKey)
        	.bind("blur", this.blurKey)
        	//.bind("input", this.searchNode);
        	//.bind("propertychange", this.searchNode)
        },
        
        initZtree: function(ele,setting,jsonData) {
        	this.element = ele;
        	this.setting = setting;
        	this.jsonData = jsonData;
        	setting.view = {
        	  fontCss: mySteelZTree.setHighlight // 高亮一定要设置，setHighlight是自定义方法
        	}
        	var tree = $.fn.zTree.init($("#" + ele), setting, jsonData);
        	return tree;
        },
        
		searchNode : function (e) {
			$.fn.zTree.init($("#" + mySteelZTree.element), mySteelZTree.setting, mySteelZTree.jsonData);
			
			var lastValue = "", nodeList = [];
			
			var zTree = $.fn.zTree.getZTreeObj(mySteelZTree.element);
			var value = $.trim($("#searchValue").val());
			var keyType = "name";
			if (mySteelZTree.key.hasClass("empty")) {
				value = "";
			}
			if (value === ""){
				return;
			}
			if (lastValue === value) return;
			lastValue = value;
			
			mySteelZTree.updateNodes(false, nodeList);
			nodeList = zTree.getNodesByParamFuzzy(keyType, value);
			mySteelZTree.updateNodes(true, nodeList);
		},
		
		/**
		 * 搜索内容高亮
		 */
		updateNodes : function(highlight, nodeList) {
			var zTree = $.fn.zTree.getZTreeObj(mySteelZTree.element);
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
			if (mySteelZTree.key.hasClass("empty")) {
				mySteelZTree.key.removeClass("empty");
			}
		},
		blurKey : function (e) {
			if (mySteelZTree.key.get(0).value === "") {
				mySteelZTree.key.addClass("empty");
			}
		}
		
    };

	$(function(){
		mySteelZTree.init();
	});				    
})();