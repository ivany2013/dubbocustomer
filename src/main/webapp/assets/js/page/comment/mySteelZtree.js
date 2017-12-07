(function() {
    mySteelZTree = {
    	element : "",
    	setting : "",
    	jsonData : "",
    	parentNodes : [],
		childNodes : [],
		allNodes:[],
		partmentValue : "",
		value:"",
    	key : $("#searchValue"),
    	keyPartment:$("#searchPartmentValue"),
        init: function() {
            this.bindEvent();
            this.keyUp();
        },
        logic: {
        	
        },
        bindEvent: function() {
        	//$("body").on("click", "#searchBtn", this.searchNode);
        	$("#searchBtn").on("click", mySteelZTree.searchNode);
//        	$("#searchValue").bind("focus", this.focusKey)
//        	.bind("blur", this.blurKey)
//        	.bind("propertychange", this.searchNode)
//        	.bind("input", this.searchNode);
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
			debugger
//			$.fn.zTree.init($("#" + mySteelZTree.element), mySteelZTree.setting, mySteelZTree.jsonData);
			nodeList = [];
			var zTree = $.fn.zTree.getZTreeObj(mySteelZTree.element);
//			zTree.expandAll(false);
			mySteelZTree.getAllNodes(zTree);
			var value = $.trim(mySteelZTree.key.val());
			var partmentValue = $.trim(mySteelZTree.keyPartment.val());
			var keyType = "name";
			
			if(mySteelZTree.value == value && mySteelZTree.partmentValue == partmentValue){
				return;
			}
			mySteelZTree.updateNodes(false, mySteelZTree.allNodes,false);
			mySteelZTree.value = value;
			mySteelZTree.partmentValue = partmentValue;
			if(partmentValue == "" && value == ""){
				zTree.expandAll(false);
			}
			if(partmentValue != "" && value == ""){
				nodeList = zTree.getNodesByFilter(mySteelZTree.filterParentNodesByParamFuzzy);
			}
			if(partmentValue == "" && value != ""){
				nodeList =zTree.getNodesByFilter(mySteelZTree.filterLeafNodesByParamFuzzy);
			}
			if(partmentValue != "" && value != ""){
				subNodeList = zTree.getNodesByParamFuzzy(keyType, partmentValue);
//				nodeList = zTree.getNodesByFilter(mySteelZTree.filterParentNodesByParamFuzzy);
				var nodeList =[];
				for(var j = 0 ; j<subNodeList.length; j++){
					var tempSubNodeList = zTree.getNodesByParamFuzzy(keyType, value ,subNodeList[j]);
					if(tempSubNodeList.length != 0){
						nodeList.push(subNodeList[j]);
						nodeList.push.apply(nodeList, tempSubNodeList);
					}
				}
//				if(subNodeList.length == 0){
//					nodeList = [];
//				}else{
//					nodeList.push.apply(nodeList, subNodeList);
//				}
			}
			
			mySteelZTree.updateNodes(true, nodeList,true);
		},
		
		/**
		 * 搜索内容高亮
		 */
		updateNodes : function(highlight, nodeList,boo) {
			var zTree = $.fn.zTree.getZTreeObj(mySteelZTree.element);
			for( var i=0, l=nodeList.length; i<l; i++) {
				nodeList[i].highlight = highlight;
				zTree.updateNode(nodeList[i]);
				if(boo){
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
	      }else if(treeNode.disable === false){
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
		},
		getAllNodes : function (zTree){
			var parentNodesTemp = [];
			var childNodesTemp = [];
			var nodes1 = zTree.getNodes();
			var nodes2 = zTree.transformToArray(nodes1);
			for(var i=0;i<nodes2.length;i++){
				if(nodes2[i].adminId == undefined){
					parentNodesTemp.push(nodes2[i]);
				}else{
					childNodesTemp.push(nodes2[i]);
				}
			 }
			mySteelZTree.allNodes = nodes2;
			mySteelZTree.parentNodes = parentNodesTemp;
			mySteelZTree.childNodes = childNodesTemp;
		},
		filterParentNodesByParamFuzzy:function(node){
			if(node.isParent && node.name.indexOf(mySteelZTree.partmentValue)>=0) return true;
			return false;
		},
		filterLeafNodesByParamFuzzy : function(node){
			 if(node.isParent || node.name.indexOf(mySteelZTree.value)< 0) return false;
			 return true;
		}
		
    };

	$(function(){
		mySteelZTree.init();
	});				    
})();