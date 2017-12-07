var adminZtree = {
    	setting : "",
    	treeNodes : "",
    	departmentSearchValue : "",
    	adminSearchValue : "",
        init: function() {
            this.bindEvent();
            this.keyUp();
        },
        logic: {
        	
        },
        bindEvent: function() {
        	$(".searchBtn").on("click", this.searchNodeBtn);
        },
        
        initZtree: function(ele,setting,jsonData) {
        	adminZtree.setting = setting;
        	setting.view = {
        	  fontCss: adminZtree.setHighlight // 高亮一定要设置，setHighlight是自定义方法
        	}
        	var tree = $.fn.zTree.init($("#" + ele), this.setting, jsonData);
        	return tree;
        },
        
        searchNodeBtn : function (e) {
			var treeId = 'adminTree';
			var nodeList = [];
			
			var zTree = $.fn.zTree.getZTreeObj(treeId);
			var allNodes = adminZtree.getAllNodes(zTree);
			
			adminZtree.updateNodes(false, allNodes, treeId, false);
			
			departmentSearchValue = $.trim($(e.target).closest("div").parent().find('.department').val());
			adminSearchValue = $.trim($(e.target).closest("div").parent().find('.admin').val());
			
			var keyType = "name";
			if (departmentSearchValue != "" && adminSearchValue == ""){
				nodeList = zTree.getNodesByFilter(adminZtree.filterParentNodesByParamFuzzy);
			}
			
			if (departmentSearchValue == "" && adminSearchValue != ""){
				nodeList = zTree.getNodesByFilter(adminZtree.filterLeafNodesByParamFuzzy);
			}
			
			if (departmentSearchValue != "" && adminSearchValue != ""){
				nodeList = zTree.getNodesByFilter(adminZtree.filterParentNodesByParamFuzzy);
				var subNodeList =[];
				for(var j = nodeList.length - 1 ; j >= 0; j--){
					var tempSubNodeList = zTree.getNodesByParamFuzzy(keyType, adminSearchValue ,nodeList[j]);
					if(tempSubNodeList.length == 0){
						nodeList.splice(j,1);
					}else{
						subNodeList.push.apply(subNodeList, tempSubNodeList);
					}
				}
				nodeList.push.apply(nodeList, subNodeList);
			}
			adminZtree.updateNodes(true, nodeList, treeId,true);
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
		filterParentNodesByParamFuzzy : function(node){
			 if(node.isParent && node.name.indexOf(departmentSearchValue)>=0) return true;
			 return false;
		},
		filterLeafNodesByParamFuzzy : function(node){
			 if(node.isParent || node.name.indexOf(adminSearchValue)< 0) return false;
			 return true;
		},
		getAllNodes : function (zTree){
			return zTree.transformToArray(zTree.getNodes());
		}
    };

	$(function(){
		adminZtree.init();
	});				    
