(function() {
    syncChannel = {
        defaultChannelId : null,
        channelNumTree : {},	
        channelTree : {},	
        init: function() {
            this.bindEvent();
            this.initZtree(jsonArrayAll);
        },
        logic: {
        	showChannelNum : function(event){
        		//重新加载树结构
    			var currentWebsite = $("#syncWebsiteTab li.active a");
				var websiteId = currentWebsite.attr("id");
				var nodeId = "";
        		var treeObj = $.fn.zTree.getZTreeObj("websiteChannelTree" + websiteId);
        		if(treeObj.getSelectedNodes().length > 0){
        			nodeId = treeObj.getSelectedNodes()[0].id;
        		}
        		if(!$(event.target).hasClass("off")){
        			var syncNumTree = syncZtree.initZtree("websiteChannelTree" + websiteId, setting, syncChannel.channelNumTree[websiteId]);
        			var nodes = syncNumTree.getNodesByParam("disable", true, null);
        			if($("#profile" + websiteId).find(".bootbox-confirm").hasClass("showed")){
        				treeObj.hideNodes(nodes);
        			}
        			var node = syncNumTree.getNodeByParam("id", nodeId);
        			syncNumTree.selectNode(node);
            		$(event.target).addClass("off");
                }else{
            		var defaultTree = syncZtree.initZtree("websiteChannelTree" + websiteId, setting, syncChannel.channelTree[websiteId]);
            		var nodes = defaultTree.getNodesByParam("disable", true, null);
            		if($("#profile" + websiteId).find(".bootbox-confirm").hasClass("showed")){
        				treeObj.hideNodes(nodes);
        			}
            		var node = defaultTree.getNodeByParam("id", nodeId);
            		defaultTree.selectNode(node);
            		$(event.target).removeClass("off");
                }
        	},
        	
        	hideChannel : function(event){
        		var websiteId = $("#syncWebsiteTab li.active a").attr("id");
        		var treeObj = $.fn.zTree.getZTreeObj("websiteChannelTree" + websiteId);
                //得打当前选中节点    如果当前节点是隐藏节点,默认跳转选中第一个
                var node = treeObj.getSelectedNodes();
                //显示隐藏
                var nodes = treeObj.getNodesByParam("disable", true, null);
                if($(event.target).hasClass("showed")){
                    $(event.target).text("隐藏停用").removeClass("showed");
                    treeObj.showNodes(nodes);
                    
                    //等显示完全过后 1.有子节点定位第一个子点  2.若没有子节点不做处理
                    var treeObjNew = $.fn.zTree.getZTreeObj("websiteChannelTree" + websiteId);
                    var nodes1 = treeObjNew.getNodes();
        			var allNodes = treeObjNew.transformToArray(nodes1);
                    if(allNodes.length > 1){
                    	$("#profile" + websiteId).find(".sync-channel-list-js").show();
                    	if(treeObjNew.getSelectedNodes().length < 1){
                    		var selectedNode = treeObjNew.getNodeByTId("websiteChannelTree" + websiteId + "_2");
                    		treeObjNew.selectNode(selectedNode);
                    		syncChannel.getWebsiteSyncChannelList(selectedNode, websiteId);
                    	}
                    }
                }else{
                    $(event.target).text("显示全部").addClass("showed")
                    treeObj.hideNodes(nodes);
                    
                    var treeObj2 = $.fn.zTree.getZTreeObj("websiteChannelTree" + websiteId);
                    var isHidden = syncChannel.logic.nodeIsHidden(treeObj2, node[0]);
                    
                    var hasShow = false, num = 1;
                    //如果当前节点被隐藏 则自动选中第一个未禁用的节点，若全部节点都是禁用节点，右侧全部隐藏
                    if(isHidden){
                    	var nodes1 = treeObj2.getNodes();
            			var allNodes = treeObj2.transformToArray(nodes1);
                		for(var i = 0, l = allNodes.length;i < l; i++){
                			var isHidden2 = syncChannel.logic.nodeIsHidden(treeObj2, allNodes[i]);
                			if(allNodes[i].id.indexOf("website") < 0 && !isHidden2){
                				var selectedNode = treeObj2.getNodesByParam("id", allNodes[i].id, null);
                				treeObj2.selectNode(selectedNode[0]);
                            	syncChannel.getWebsiteSyncChannelList(selectedNode[0], websiteId);
                            	num ++;
            					break;
                			}
                		}
                		if(num == 1){
                        	$("#profile" + websiteId).find(".sync-channel-list-js").hide();
                        }
                    }
                }
        	},
        	
        	//批量启用
        	batchOpen : function(event){
        		var ckeck = $("#editabledatatable .checkbox input:checked");
                if(ckeck.length > 0){
                    var _this = this
                    window.parent.bootbox.confirm("确认批量启用?", function (result) {
                        if (result) {
                        	var ids = new Array();
                        	ckeck.each(function(k,v){
                        		ids.push($(v).attr("id"));
                        	});
                    		syncChannel.logic.changeSyncStatus($(event.target), ids.toString(), 0, true, "");
                        }
                    });
                }
        	},
        	//批量停用
        	batchClose : function(event){
        		var ckeck = $("#editabledatatable .checkbox input:checked");
                if(ckeck.length > 0){
                    var _this = this
                    window.parent.bootbox.confirm("确认批量停用?", function (result) {
                        if (result) {
                        	var ids = new Array();
                        	ckeck.each(function(k,v){
                        		ids.push($(v).attr("id"));
                        	});
                    		syncChannel.logic.changeSyncStatus($(event.target), ids.toString(), 1, true, "");
                        }
                    });
                }
        	},
        	//批量删除
        	batchRemove : function(event){
        		var _this = event.target;
        		var ckeck = $("#editabledatatable .checkbox input:checked");
                if(ckeck.length>0){
                    var _this = this;
                    window.parent.bootbox.confirm("确认批量删除?", function (result) {
                        if (result) {
                        	var ids = new Array();
                        	ckeck.each(function(k,v){
                        		ids.push($(v).attr("id"));
                        	});
                        	$.ajax({
                        		type : "post",
                        		url : "/sync/removeSyncChannel",
                        		data : {
                        			syncChannelId : ids.toString(),
                        			isBatch : true,
                        			syncChannelVersion : ""
                        		},
                        		success : function(response){
                        			if("200" == response.status){
                        				syncChannel.logic.reloadCurrentWebSiteSyncChannel();
                        				$(_this).closest("div").find("input[type='checkbox']").removeAttr('check','1').prop("checked",false);
                        				$.msg("删除成功!");
                        			}else{
                        				$.err(response.msg);
                        			}
                        			//重新加载页面
                        			syncChannel.logic.reloadMangePage();
                        		}
                    		});
                        }
                    });
                }
        	},
        	
        	//单个删除
        	singleRemove : function(event){
        		var _this = this;
                window.parent.bootbox.confirm("确认删除?", function (result) {
                    if (result) {
                    	var Tr = $(event.target).closest("tr");
                    	var id = Tr.attr("id");
                    	var syncChannelVersion = Tr.attr("version");
                    	$.ajax({
                    		type : "post",
                    		url : "/sync/removeSyncChannel",
                    		data : {
                    			syncChannelId : id,
                    			isBatch : false,
                    			syncChannelVersion : syncChannelVersion
                    		},
                    		success : function(response){
                    			if("200" == response.status){
                    				syncChannel.logic.reloadCurrentWebSiteSyncChannel();
                    				$.msg("删除成功!");
                    			}else{
                    				$.err(response.msg);
                    			}
                    			//重新加载页面
                    			syncChannel.logic.reloadMangePage();
                    		}
                		});
                    }
                });
        	},
        	checkAll : function(event){
        		if($(event.target).is(':checked')){
        	        $(event.target).parents('.with-header').find('input[type="checkbox"]').each(function(i,v){
        	            if($(v).attr("disabled") == undefined) {
        	                $(v).prop('checked','true');
        	                $(v).attr('check','1');
        	            }
        	        })
        	    }else{
        	        $(event.target).parents('.sync-channel-list-js').find('input[type="checkbox"]').removeAttr('checked check');
        	    }
        	},
        	
        	checkSingle : function(event){
        		if($(event.target).is(':checked')){
        	        $(event.target).attr('check','1');
        	    }else{
        	        $(event.target).removeAttr('check','1');
        	    }
        	},
        	
        	//单个启用禁用
        	changeSingleSyncStatus : function(event){
        		var currentEle = $(event.target);
        		var syncChannelType = currentEle.attr("status");
        		var msg = "",origin = "";
        		if(syncChannelType == "1"){
        			msg = "确认停用?";
        			origin = 0;
        		}else{
        			msg = "确认启用?";
        			origin = 1;
        		}
        		window.parent.bootbox.confirm(msg, function (result) {
        			if (result) {
        				var syncChannelId = currentEle.attr("id");
                		var syncChannelVersion = currentEle.attr("version");
                		syncChannel.logic.changeSyncStatus(currentEle, syncChannelId, syncChannelType, false, syncChannelVersion);
        			}else{
        				$(currentEle).closest("td").find("input[status='" + origin + "']").prop("checked",true);
        			}
        		});
        	},
        	
        	/**
        	 *type 0 启用；1禁用
        	 *ids id "," 分割
        	 *isBatch 是否批量
        	 *version 乐观锁
        	 */
        	changeSyncStatus : function(currentEle, ids, type, isBatch, version){
        		$.ajax({
            		type : "post",
            		url : "/sync/modifySyncChannelStatus",
            		data : {
            			syncChannelId : ids,
            			syncChannelType : type,
            			syncChannelVersion : version,
            			isBatch : isBatch
            		},
            		success : function(response){
            			if("200" == response.status){
            				if(isBatch == false){
                				currentEle.closest("tr").find(".sync-channel-status-js").text(type == '0' ? "启用" : "停用");
                			}else if(isBatch == true){
                				syncChannel.logic.reloadCurrentWebSiteSyncChannel();
                				//全选checkbox 取消
                				currentEle.closest("div").find("input[type='checkbox']").removeAttr('check','1').prop("checked",false);
                			}
            				$.msg("更新成功!");
            			}else{
            				$.err(response.msg);
            			}
            		}
        		});	
        	},
        	
        	//重新加载当前站点下,当前选中频道的同步频道
        	reloadCurrentWebSiteSyncChannel : function(){
        		var currentWebsite = $("#syncWebsiteTab li.active a");
				var websiteId = currentWebsite.attr("id");
				var treeObj = $.fn.zTree.getZTreeObj("websiteChannelTree" + websiteId);
				var node = treeObj.getSelectedNodes();
				syncChannel.getWebsiteSyncChannelList(node[0], websiteId);
        	},
        	
        	createSyncChannel : function(){
        		var currentWebsite = $("#syncWebsiteTab li.active a");
				var websiteId = currentWebsite.attr("id");
				var websiteName = currentWebsite.attr("name");
				var treeObj = $.fn.zTree.getZTreeObj("websiteChannelTree" + websiteId);
				var node = treeObj.getSelectedNodes();
				var channelId =  node[0].id;
				var editorType = treeObj.getSelectedNodes()[0].editorType;
				
				var channelAllName = getCheckedNodeLocation(treeObj, "", "selected");
				
        		location.href = "/sync/syncChannelCreatePage?channelId=" + channelId + "&websiteId=" + websiteId + 
        						"&channelAllName=" + channelAllName + "&websiteName=" + websiteName + "&editorType=" + editorType;
        	},
        	
        	modifySyncChannel : function(event){
        		var currentWebsite = $("#syncWebsiteTab li.active a");
				var websiteId = currentWebsite.attr("id");
				var websiteName = currentWebsite.attr("name");
        		var treeObj = $.fn.zTree.getZTreeObj("websiteChannelTree" + websiteId);
				var channelId = treeObj.getSelectedNodes()[0].id;
				var channelAllName = getCheckedNodeLocation(treeObj, "", "selected");
				var editorType = treeObj.getSelectedNodes()[0].editorType;
        		var channelSyncId = $(event.target).closest("tr").attr("id");	
				
        		location.href = "/sync/syncChannelModifyPage?channelSyncId=" + channelSyncId + "&websiteId=" + websiteId + 
        		"&websiteName=" + websiteName + "&channelId=" + channelId + "&channelAllName=" + channelAllName + "&editorType=" + editorType;
        	},
        	
        	goSyncArticlePage : function(event){
        		var syncChannelId = $(event.target).closest("tr").attr("id");
        		var currentWebsite = $("#syncWebsiteTab li.active a");
				var websiteId = currentWebsite.attr("id");
				var websiteName = currentWebsite.attr("name");
        		var treeObj = $.fn.zTree.getZTreeObj("websiteChannelTree" + websiteId);
        		var channelId = treeObj.getSelectedNodes()[0].id;
        		var toChannelAllName = getCheckedNodeLocation(treeObj, "", "selected");
        		var fromChannelAllName = $(event.target).closest("tr").find("#masterChannelName").text();
        		var editorType = treeObj.getSelectedNodes()[0].editorType;
        		location.href="/sync/syncArticleListPage?syncChannelId=" + syncChannelId + "&toChannelAllName=" + toChannelAllName + 
        		"&fromChannelAllName=" + fromChannelAllName + "&websiteId=" + websiteId + "&channelId=" + channelId + "&editorType" + editorType;
        	},
        	
        	getCurrentTree : function(){
        		var currentWebsite = $("#syncWebsiteTab li.active a");
				var websiteId = currentWebsite.attr("id");
				var websiteName = currentWebsite.attr("name");
        		var treeObj = $.fn.zTree.getZTreeObj("websiteChannelTree" + websiteId);
        		return treeObj;
        	},
        	
        	reloadMangePage : function(){
        		//重新加载树结构
    			var websiteId = $("#syncWebsiteTab li.active a").attr("id"), nodeId = "";
    			var treeObj = $.fn.zTree.getZTreeObj("websiteChannelTree" + websiteId);
        		if(treeObj.getSelectedNodes().length > 0){
        			nodeId = treeObj.getSelectedNodes()[0].id;
        		}
    			location.href = "/sync/syncManage?fromWebsiteId="+ websiteId+ "&fromChannelId=" + nodeId;
        	},
        	
        	getParentNodes : function(nodes, parentNode){
        		if(parentNode != null){
        			nodes.push(parentNode);
        			curNode = parentNode.getParentNode();
        			syncChannel.logic.getParentNodes(nodes, curNode);
        		}
        		return nodes;
        	},
        	
        	nodeIsHidden : function(treeObj, node){
        		if(typeof node != "undefined"){
        			if(node.isHidden){
        				return true;
        			}
        			var isHidden = false;
                    var oldSelectedNode = treeObj.getNodesByParam("id", node.id, null);
                    var parents = new Array();
            		var parentNodes = syncChannel.logic.getParentNodes(parents, oldSelectedNode[0].getParentNode());
            		for (var j=0, l=parentNodes.length; j<l; j++) {
            			if(parentNodes[j].isHidden){
            				isHidden = true;
            				break;
            			}
            		}
            		return isHidden;
        		}
        	}
        	
        },
        bindEvent: function() {
            $(".show-num-js").on("click", this.logic.showChannelNum);
            $(".bootbox-confirm").on("click", this.logic.hideChannel);
            $(".change-website-js").on("click", this.logic.chooseWibsite);
            $("body").on("click",".createSyncChannel", this.logic.createSyncChannel);
            $("body").on("click", ".batch-open-js", this.logic.batchOpen);
            $("body").on("click", ".batch-close-js", this.logic.batchClose);
            $("body").on("click", ".batch-remove-js", this.logic.batchRemove);
            $("body").on("click", ".remove", this.logic.singleRemove);
            $("body").on("click", ".all_checked input[type='checkbox']", this.logic.checkAll);
            $("body").on("click", "input[type='checkbox']", this.logic.checkSingle);
            $("body").on("click", ".change-status-js", this.logic.changeSingleSyncStatus);
            $("body").on("click", "#modifySyncChannel", this.logic.modifySyncChannel);
            $("body").on("click", "#syncArticlePage", this.logic.goSyncArticlePage);
        },
        
        getWebsiteSyncChannelList: function(node, websiteId) {
        	//如果该节点为禁用节点,则不能新增同步频道
        	if(node.disable == true){
        		$("#profile" + websiteId).find(".createSyncChannel").hide();
        	}else{
        		$("#profile" + websiteId).find(".createSyncChannel").show();
        	}
        	var channelName = node.name;
        	var channelId = node.id;
        	if(channelName != ""){
        		$(".website-channelName-js" + websiteId).text(channelName + "-同步频道");
        	}else{
        		$(".website-channelName-js" + websiteId).text("无");
        	}
        	var jsonParam={
			  pageSize:10,
			  pageNum:1,
			  channelId:channelId,
			  channelName:channelName,
			  websiteId:websiteId
		    };
        	$("#channelList" + websiteId).pagination({
    			url: "/sync/syncChannelListPagination",
    			paramJson:jsonParam,
    			callback:function(){
    			}
    		});	
        },
        
        initZtree : function(jsonArrayAll){
            for(var i = 0;i < jsonArrayAll.length; i++){
            	//初始化Ztree
            	var websiteId = jsonArrayAll[i].websiteId;
            	
            	//存储每棵树的tree
            	syncChannel.channelNumTree[websiteId] = jsonArrayAll[i].channelNumTreeList;
            	syncChannel.channelTree[websiteId] = jsonArrayAll[i].channelTreeList;
            	
            	var tree = syncZtree.initZtree("websiteChannelTree" + websiteId, setting, jsonArrayAll[i].channelNumTreeList);
            	var selectedNode = tree.getNodeByTId("websiteChannelTree" + websiteId + "_2");
            	if(websiteId == fromWebsiteId && fromChannelId != 0){
            		selectedNode = tree.getNodeByParam("id", fromChannelId);
            	}
            	if(null != selectedNode){
            		//1.默认选中第一个子节点
            		tree.selectNode(selectedNode);
            		
            		//2.展开当前节点
            		//tree.expandNode(tree.getNodeByTId("websiteChannelTree" + websiteId + "_2"), true, false);
            		
            		//3.初始化右侧table表格
            		syncChannel.getWebsiteSyncChannelList(selectedNode, websiteId);
            	}else{
            		$("#profile" + websiteId).find(".sync-channel-list-js").hide();
            	}
            }
            
            //当添加.修改 等完成后 回到此页面的时候定位之前的tab
            if(fromWebsiteId != 0){
            	$("#syncWebsiteTab li").removeClass("active").find("#" + fromWebsiteId).closest("li").addClass("active");
            	$(".website-tab-js").removeClass("active");
            	$("#profile" + fromWebsiteId).addClass("active");
            }
        }
    };
    
    function onSyncClick(event, treeId, treeNode) {
    	//当前选中tab
     	var currentWebsite = $("#syncWebsiteTab li.active a");
		var websiteId = currentWebsite.attr("id");
        //根据选中树的节点 重新请求右侧table列表的数据,跟节点(website)节点除外
        syncChannel.getWebsiteSyncChannelList(treeNode, websiteId);
        $("#profile" + websiteId).find(".sync-channel-list-js").show().find(".all_checked input[type='checkbox']").removeAttr('check','1').prop("checked",false);
    }
    
    function beforeClick(treeId, treeNode, clickFlag){
    	//站点名称不能点击
    	return (treeNode.click != false);
	};
	
	 //频道树设置
	var setting = {
       data: {
           key: {
               dataurl:"t"
           },
           simpleData: {
               enable: true
           }
       },
       callback: {
    	   beforeClick: beforeClick,
           onClick: onSyncClick
       }
    };
    
	$(function(){
		window.parent.bootbox.setDefaults({
	        locale: "zh_CN",
	    });
		syncChannel.init();
	});				    
})();