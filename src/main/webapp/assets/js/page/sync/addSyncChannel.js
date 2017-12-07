(function() {
    addSyncChannel = {
    	currentSelectNodeId : "",
        init: function() {
            this.bindEvent();
        },
        logic: {
        	addSyncChannelTr : function(event){
        		$(event.target).parent().siblings().find('.fa-minus').show();
                var thisparent = $(event.target).parents("tr");
                var thisdome = thisparent.clone(true);
                thisdome.find(".channel a").text("选择").removeAttr("sourcewebsiteid");
                thisdome.find("td").removeAttr("nodeid nodename nodeids nodenames nameid").find('.select').removeClass("addEdite").css("opacity","0.3").text("选择");
                thisdome.insertAfter(thisparent);
        	},
        	
        	delSyncChannel : function(event){
        		if($(event.target).parents('tr').siblings().length==2){
                    $(event.target).parents('tr').siblings().find('.fa-minus').hide();
                    var thisdome = $(event.target).parents("tr");
                    thisdome.remove();
                }else{
                    var thisdome = $(event.target).parents("tr");
                    thisdome.remove();
                }
        	},
        	
        	createSyncChannel : function(event){
        		var _this = event.target;
        		var index=$(_this).parents('td').index();
                var tit=$(_this).parents('table').find('th').eq(index).text().substring(0, 2);
                var baseType = $(_this).attr("type");
                var selecedNodeId = $(_this).closest("td").attr("nodeid");
                if(typeof selecedNodeId != "undefined"){
                	addSyncChannel.currentSelectNodeId = selecedNodeId;
                }else{
                	addSyncChannel.currentSelectNodeId = "";
                }
                var nameIds = $(_this).closest("td").attr("nameid");
                if("channel" == baseType){
                	bootbox.dialog({
                        message: $("#addEditeModalChannel").html(),
                        title: "选择"+tit,
                        className: "modal-inverse",
                        buttons: {
                            success: {
                                label: "确认",
                                className: "btn-primary",
                                callback: function () { 
                                	var treeObj = $.fn.zTree.getZTreeObj("treeChannel");
                    				var node = treeObj.getCheckedNodes()[0];
                    				if(typeof node != "undefined"){
                    					var location = getCheckedNodeLocation(treeObj, "", "checked");
                        				$(_this).closest("td").attr({
                        					"nodeId" : node.id,
                        					"nodeName" : location
                        				}).find("a").text(location);
                        				$(_this).attr("sourcewebsiteid", $("#changeWebsite").find("option:selected").attr("id"));
                        				if($("#editorType").val() == 0){
                        					$(_this).closest("tr").find(".breed,.city,.factory,.port").find("a").removeAttr("style").addClass("addEdite");
                        					$(_this).closest("tr").find(".breed").find("a").text("全部品种");
                        					$(_this).closest("tr").find(".city").find("a").text("全部城市");
                        					$(_this).closest("tr").find(".factory").find("a").text("全部钢厂");
                        					$(_this).closest("tr").find(".port").find("a").text("全部港口");
                        				}
                        				
                    				}else{
                    					$.err("请至少选择一个频道");
                    					return;
                    				}
                                }
                            },
                            cancel: {
                                label: "取消",
                                className: "btn-primary"

                            }
                        }
                    });
                	var websiteId = $(_this).attr("sourcewebsiteid");
            		if(typeof websiteId == "undefined" || websiteId == ""){
            			websiteId = $("#websiteId").val();
            		}
            		//选中之前选中的select
            		$("#changeWebsite").val($("#changeWebsite").find("#" + websiteId).text());
                	addSyncChannel.logic.querySyncChannelTree(selecedNodeId, websiteId);
                }else{
                    bootbox.dialog({
                        message: $("#addEditeModalBase").html(),
                        title: "选择"+tit,
                        className: "modal-inverse",
                        buttons: {
                            success: {
                                label: "确认",
                                className: "btn-primary",
                                callback: function () {
                                	//添加当前选中节点到点击对象所在的td
                                	var newIdArr = new Array();
                                	var newNameArr = "";
                                	var nameId = "";//当选中再次点击进来后让name和id对应起来
                    				$("#syncChannelChoose .showcy").each(function(){
                    					var name = $(this).find(".base-name-js").text();
                    					var id = $(this).find(".remove-node-js").attr("id");
                    					newNameArr +=  name + ";";
                                		newIdArr.push(id);
                                		nameId += name + "_" + id + ";";
                    				});
                    				var nodeNames = newNameArr.substring(0, newNameArr.length-1);
                    				if(newIdArr.length > 0){
                    					$(_this).closest("td").attr({
                        					"nodeIds" : newIdArr.toString(),
                        					"nodeNames" : nodeNames,
                        					"nameId" : nameId.substring(0, nameId.length-1)
                        				}).find("a").text(nodeNames);
                    				}else{
                    					$(_this).text("全部" + tit).closest("td").removeAttr("nodeids nodenames nameid");
                    				}
                                }
                            },
                            cancel: {
                                label: "取消",
                                className: "btn-primary"

                            }
                        }
                    });
                    
                    addSyncChannel.logic.queryBaseDataTreeForCreate(baseType, nameIds);
                }
        	},
        	
        	querySyncChannelTree : function(selecedNodeId, websiteId){
        		//发送ajax 请求初始化ztree
        		var currentChannelId = $("#currentChannelId").val();
                $.ajax({
            		type : "post",
            		url : "/sync/queryWebsiteChannelTree",
            		data : {
            			websiteId : websiteId,
            			editorType : $("#editorType").val(),
            			currentChannelId: currentChannelId
            		},
            		success : function(response){
            			if("200" != response.status){
            				$.err(response.msg);
            				return;
            			}
            			var treeObj = addSyncChannel.initChannelZtree(response.data);
            			setTimeout(function(){
                			//1. 选中之前选中的节点(如果之前有选中过)
                			if(typeof selecedNodeId != "undefined"){
                				var selectedNode = treeObj.getNodesByParam("id", selecedNodeId, null);
                				if(selectedNode.length > 0){
                					treeObj.selectNode(selectedNode[0]);
                					treeObj.checkNode(selectedNode[0], true, true);
                				}
                			}
            			},50);
            		}
            	});
        	},
        	
        	queryBaseDataTreeForCreate : function(baseType, nameIds){
        		//发送ajax 请求初始化ztree
                $.ajax({
            		type : "post",
            		url : "/sync/queryBaseDataTree",
            		data : {
            			baseType : baseType
            		},
            		success : function(response){
            			if("200" != response.status){
            				$.err(response.msg);
            				return;
            			}
            			var treeObj = addSyncChannel.initBaseDataZtree(baseType, response.data);
            			setTimeout(function(){
                			//1. 选中之前选中的节点(如果之前有选中过)
                			if(typeof nameIds != "undefined"){
                				addSyncChannel.reSelectSyncChannel(treeObj, nameIds);
                			}
                			if("city" == baseType){
                				addSyncChannel.logic.removeParentCheckBox(treeObj);
                		    }
            			},50);
            		}
            	});
        	},
        	
        	
        	queryBaseDataTreeForModify : function(baseType, selectdTemp, selectedIds){
        		//发送ajax 请求初始化ztree
                $.ajax({
            		type : "post",
            		url : "/sync/queryBaseDataTree",
            		data : {
            			baseType : baseType
            		},
            		success : function(response){
            			if("200" != response.status){
            				$.err(response.msg);
            				return;
            			}
            			var treeObj = addSyncChannel.initBaseDataZtree(baseType, response.data);
            			setTimeout(function(){
            				//之前选中的没有check box
            				var ids = selectedIds.split(",");
            				for(var i = 0, l = ids.length;i < l; i++){
            					var selectedNode = treeObj.getNodesByParam("id", ids[i], null);
            					if(selectedNode.length > 0){
            						selectedNode[0].nocheck = true;
            						treeObj.updateNode(selectedNode[0], true);
            					}
            				}

            				if("city" == baseType){
                				addSyncChannel.logic.removeParentCheckBox(treeObj);
                		    }
            			},50);
            		}
            	});
        	},
        	
        	//切换网站站点
        	changeWebsite : function(event){
        		 var selectedWebsiteId = $('#changeWebsite option:selected').attr("id");
        		 var currentChannelId = $("#currentChannelId").val();
        		 var masterChannelId = $("#masterChannelId").val();
        		 if(addSyncChannel.currentSelectNodeId == ""){
        			 addSyncChannel.currentSelectNodeId = masterChannelId
        		 }
        		 $.ajax({
             		type : "post",
             		url : "/sync/queryWebsiteChannelTree",
             		data : {
             			websiteId : selectedWebsiteId,
             			currentChannelId : currentChannelId,
             			editorType : $("#editorType").val()
             		},
             		success : function(response){
             			if("200" != response.status){
            				$.err(response.msg);
            				return;
            			}
             			var treeObj = addSyncChannel.initChannelZtree(response.data);
        				//1.去除当前频道下的所有频道(包含自身)
            			var nodes1 = treeObj.getNodesByParam("id", currentChannelId, null);
            			treeObj.removeNode(nodes1[0]);
            			//2.出去禁用频道下的所有频道(包含自身)
            			var nodes2 = treeObj.getNodesByParam("disable", true, null);
            			for (var i=0, l=nodes2.length; i < l; i++) {
            				treeObj.removeNode(nodes2[i]);
            			}
            			//3.选中之前选中节点
            			if(addSyncChannel.currentSelectNodeId != ""){
            				var selectedNode = treeObj.getNodesByParam("id", addSyncChannel.currentSelectNodeId, null);
            				if(selectedNode.length > 0){
            					treeObj.checkNode(selectedNode[0], true, true);
            				}
            			}
             		}
             	});
        	},
        	            
        	//在添加和编辑页面删除所选节点
            removeNode : function(event){
            	var _this = $(event.target);
            	var nodeId = _this.attr("id");
            	var treeObj = $.fn.zTree.getZTreeObj("treeBase");
            	var treeNode = treeObj.getNodesByParam("id", nodeId, null);
            	
            	//1.删除已选节点并删除其子节点  并在树上取消选中该节点
        		var nodes = new Array();
        		var childenNodes = getChildren(nodes, treeNode[0]);
        		for (var i=0, l=childenNodes.length; i<l; i++) {
        			treeObj.checkNode(childenNodes[i], false, false);
        			$("#syncChannelChoose").find("button[id='" + childenNodes[i].id +"']").closest(".showcy").remove();
        		}
        		
        		//2.得到父节点    如果父节点为半选则删除  已选父节点
            	/*var parents = new Array();
        		var parentNodes = getParentNodes(parents, treeNode[0].getParentNode());
        		for (var j=0, l=parentNodes.length; j<l; j++) {
        			var status = parentNodes[j].getCheckStatus();
        			if(status != null && (status.half == true || status.checked == false)){
						$("#syncChannelChoose").find("button[id='" + parentNodes[j].id +"']").closest(".showcy").remove();
        			}
        		}*/
        		
        		//3. 删除已选节点后   位于树上的该节点取消勾选,并关联父级
        		//var node = $.fn.zTree.getZTreeObj("treeBase").getNodesByParam("id", nodeId, null);
        		//$.fn.zTree.getZTreeObj("treeBase").checkNode(node[0], false, true);
        		
        		_this.closest("div").remove();
        		//treeObj.checkNode(treeNode[0], false, false);
        		
            },
            
            saveSyncChannel : function(event){
            	var syncChannels = new Array();
            	$("#addSyncTable .sync-data-js").each(function(){
            		var syc = {};
            		var _this = this;
            		var channelIds = $(_this).find(".channel").attr("nodeid");
            		if(typeof channelIds != "undefined"){
            			syc.masterChannelId = channelIds.replace(/;/gm,',');
                		syc.masterChannelName = $(_this).find(".channel").attr("nodename");
            		}else{
            			return;
            		}
            		var breedsIds = $(_this).find(".breed").attr("nodeids");
            		if(typeof breedsIds != "undefined"){
            			syc.masterBreedsIds = breedsIds.replace(/;/gm,',');
                		syc.masterBreeds = $(_this).find(".breed").attr("nodenames");
            		}
            		var citysIds = $(_this).find(".city").attr("nodeids");
            		if(typeof citysIds != "undefined"){
            			syc.masterCitysIds = citysIds.replace(/;/gm,',');
            			syc.masterCitys = $(_this).find(".city").attr("nodenames");
            		}
            		
            		var factorysIds = $(_this).find(".factory").attr("nodeids");
            		if(typeof factorysIds != "undefined"){
            			syc.masterFactorysIds = factorysIds.replace(/;/gm,',');
            			syc.masterFactorys = $(_this).find(".factory").attr("nodenames");
            		}
            		
            		var portIds = $(_this).find(".port").attr("nodeids");
            		if(typeof portIds != "undefined"){
            			syc.masterPortsIds = portIds.replace(/;/gm,',');
                		syc.masterPorts = $(_this).find(".port").attr("nodenames");
            		}
            		syc.websiteId = $("#websiteId").val();
            		syc.channelId = $("#currentChannelId").val();
            		syncChannels.push(syc);
            	});
            	if(syncChannels.length > 0){
            		$("#saveSyncChannel").attr("disabled","ture");
            		addSyncChannel.logic.saveSyncChannelQuery(syncChannels, "create");
            	}else{
            		$.err("请至少选择一个频道!");
            	}
            },
            
            saveSyncChannelQuery : function(syncChannels, type){
            	$.ajax({
             		type : "post",
             		url : "/sync/saveSyncChannel",
             		data : {
             			syncChannels : encodeURIComponent(JSON.stringify(syncChannels)),
             			type : type
             		},
             		success : function(response){
             			if("200" == response.status){
             				$("#saveSyncChannel,#eidtSaveSyncChannel").removeAttr("disabled");
             				$.msg("保存成功!");
             				//跳转到之前选择频道
             				var fromWebsiteId = $("#websiteId").val();
             				var fromChannelId = $("#currentChannelId").val();
             				location.href = "/sync/syncManage?fromWebsiteId=" + fromWebsiteId + "&fromChannelId=" + fromChannelId;
             			}else{
             				$.err("保存失败!");
             			}
             		}
             	});
            },
            
            editSelectSyncTree : function(event){
            	var _this = event.target;
        		var tit=$(_this).text().substring(2, 4);
                bootbox.dialog({
                    message: $("#addEditeModal").html(),
                    title: "选择"+tit,
                    className: "modal-inverse",
                    buttons: {
                        success: {
                            label: "确认",
                            className: "btn-primary",
                            callback: function () {
                            	if('选择频道' == $(_this).text()){
                            		var treeObj = $.fn.zTree.getZTreeObj("treeChannel");
                            		if(treeObj.getCheckedNodes().length > 0){
                            			var nodeId = treeObj.getCheckedNodes()[0].id;
                            			var location = getCheckedNodeLocation(treeObj, "", "checked");
                            			var selectedWebsiteId = $("#changeWebsite").find("option:selected").attr("id");
                            			$(_this).attr({"channelid":nodeId,"sourcewebsiteid":selectedWebsiteId}).closest("td").find(".selected-channel-data-js").attr({
                            				"id" : nodeId,
                            				"name" : location
                            			}).text(location);
                            		}else{
                            			return;
                            		}
                            	}else{
                            		var newIdArr = new Array();
                                	var newNameArr = "";
                    				$("#syncChannelChoose .showcy").each(function(){
                    					newNameArr += $(this).find(".base-name-js").text() + ";";
                                		newIdArr.push($(this).find(".remove-node-js").attr("id"));
                    				});
                    				$("#syncChannelChoose").find(".remove-node-js").removeClass("remove-node-js").addClass("delete-node-js remove_popup")
                    				var dataTemp = $(_this).closest("td").find(".selected-base-data-js");
                    				var oldIds = dataTemp.attr("ids");
                    				var oldNames = dataTemp.attr("names");
                    				var newIds = "", newNames = "";
                    				if(oldIds == ""){
                    					newIds = newIdArr.toString();
                    				}else{
                    					if(newIdArr.toString() != ""){
                    						newIds = newIdArr.toString() + "," + oldIds;
                    					}else{
                    						newIds = oldIds;
                    					}
                    				}
                    				if(oldNames == ""){
                    					newNames = newNameArr.substring(0, newNameArr.length-1);
                    				}else{
                    					newNames = newNameArr + oldNames;
                    				}
                    				dataTemp.attr({
                    					ids: newIds,
                    					names: newNames 
                    				}).prepend($("#syncChannelChoose").html());
                            	}	
                            }
                        },
                        cancel: {
                            label: "取消",
                            className: "btn-primary",
                        }
                    }
                });
                var temp = $(_this).closest("div").find(".selected-base-data-js");
                var selectTemp = temp.html();
                var ids = temp.attr("ids");
                switch($(_this).text()){
                    case '选择频道':
                        $('.text1').text('频道')
                        $('.pd_hide').removeClass('show');
                        $('.search').parent().removeClass('col-xs-offset-5');
                        $(".tree-channel").show();
                        var selecedNodeId = $(_this).attr("channelId");
                        //当弹出编辑频道modal的时候 当前选中的id为隐藏的属性值
                        if(typeof selecedNodeId != "undefined"){
                        	addSyncChannel.currentSelectNodeId = selecedNodeId;
                        }
                        var websiteId = $(_this).attr("sourcewebsiteid");
                		if(websiteId == ""){
                			websiteId = $("#websiteId").val();
                		}
                		//选中之前选中的select
                		$("#changeWebsite").val($("#changeWebsite").find("#" + websiteId).text());
                        addSyncChannel.logic.querySyncChannelTree(selecedNodeId, websiteId);
                        break;
                    case '选择品种':
                        $('.text1').text('品种');
                        $('.site').removeClass('show');
                        $('.search').parent().addClass('col-xs-offset-5');
                        $(".base-channel").show();
                        addSyncChannel.logic.queryBaseDataTreeForModify("breed", selectTemp, ids);
                      	break;
                    case '选择城市':
                        $('.text1').text('城市');
                        $('.site').removeClass('show');
                        $('.search').parent().addClass('col-xs-offset-5');
                        $(".base-channel").show();
                        addSyncChannel.logic.queryBaseDataTreeForModify("city", selectTemp, ids);
                      	break;
                    case '选择钢厂':
                        $('.text1').text('钢厂');
                        $('.site').removeClass('show');
                        $('.search').parent().addClass('col-xs-offset-5');
                        $(".base-channel").show();
                        addSyncChannel.logic.queryBaseDataTreeForModify("factory", selectTemp, ids);
                      	break;
                    case '选择港口':
                        $('.text1').text('港口');
                        $('.site').removeClass('show');
                        $('.search').parent().addClass('col-xs-offset-5');
                        $(".base-channel").show();
                        addSyncChannel.logic.queryBaseDataTreeForModify("port", selectTemp, ids);
                    	break;
                    default:;
                }     
            },
            
            eidtSaveSyncChannel : function(){
            	$("#eidtSaveSyncChannel").attr("disabled","ture");
            	var syncChannel = {};
            	var syncChannels = new Array();
            	var channel = $("#editTable .selected-channel-data-js");
            	syncChannel.masterChannelId = channel.attr("id");
            	syncChannel.masterChannelName = channel.attr("name");
            	
            	var breed = $("#editTable .breed .selected-base-data-js");
            	syncChannel.masterBreedsIds = breed.attr("ids");
            	syncChannel.masterBreeds = breed.attr("names");
            	
            	var city = $("#editTable .city .selected-base-data-js");
            	syncChannel.masterCitysIds = city.attr("ids");
            	syncChannel.masterCitys = city.attr("names");
            	
            	var factory = $("#editTable .factory .selected-base-data-js");
            	syncChannel.masterFactorysIds = factory.attr("ids");
            	syncChannel.masterFactorys = factory.attr("names");
            	
            	var port = $("#editTable .port .selected-base-data-js");
            	syncChannel.masterPortsIds = port.attr("ids");
            	syncChannel.masterPorts = port.attr("names");
            	syncChannel.websiteId = $("#websiteId").val();
            	syncChannel.channelId = $("#currentChannelId").val();
            	syncChannel.id = $("#syncChannelId").val();
            	syncChannel.version = $("#version").val();
            	syncChannel.status = $("input[name='form-field-radio']:checked").val();
            	syncChannels.push(syncChannel);
            	if(syncChannel.masterChannelId){
            		addSyncChannel.logic.saveSyncChannelQuery(syncChannels, "update");
            	}else{
            		 window.parent.bootbox.alert("请选择频道!");
            	}
            },
            
            deleteNode : function(event){
            	var _this = event.target;
                if($(_this).hasClass('remove_popup')){
                    bootbox.confirm("确认移除?", function (result) {
                        if (result) {
                        	$(_this).parents(".showcy").hide();
                        	var newIdArr = new Array();
                        	var newNameArr = "";
                        	$(_this).closest(".selected-base-data-js").find(".showcy:visible").each(function(){
                        		newNameArr += $(this).find(".base-name-js").text() + ";";
                        		newIdArr.push($(this).find(".delete-node-js").attr("id"));
                        	});
                        	$(_this).closest(".selected-base-data-js").attr({
                        		"ids": newIdArr.toString(),
                        		"names": newNameArr.substring(0, newNameArr.length-1)
                        	});
                        	$(_this).parents(".showcy").remove();
                        }
                    });
                    bootbox.setDefaults({
                        locale: "zh_CN",
                    });
                }else{
                     $(_this).parents(".showcy").remove();
                }
            },
            
            //取消check box
            removeParentCheckBox : function(treeObj){
            	var nodes1 = treeObj.getNodes();
    			var allNodes = treeObj.transformToArray(nodes1);
        		for(var i = 0, l = allNodes.length;i < l; i++){
        			if(allNodes[i].isParent){
        				allNodes[i].nocheck = true;
    					treeObj.updateNode(allNodes[i], true);
        			}
        		}
            } 
        	
        },
        bindEvent: function() {
            $("body").on("click", ".fa-plus", this.logic.addSyncChannelTr);
            $("body").on("click", ".fa-minus", this.logic.delSyncChannel);
            $("body").on("click", ".addEdite", this.logic.createSyncChannel);
            $("body").on("change", "#changeWebsite", this.logic.changeWebsite);
            $("body").on("click", ".remove-node-js", this.logic.removeNode);
            $("body").on("click", "#saveSyncChannel", this.logic.saveSyncChannel);
            $("body").on("click", ".edit-select-js", this.logic.editSelectSyncTree);
            $("body").on("click", "#eidtSaveSyncChannel", this.logic.eidtSaveSyncChannel);
            $("body").on("click", ".delete-node-js", this.logic.deleteNode);
        },
        
        initChannelZtree: function(jsonData, treeId) {
          var setting = {
  		    check: {
  		      enable: true,
  		      chkStyle: "radio",
  		      radioType: "all"
  		    },
	  		data: {
  			  simpleData: {
  				enable: true
  			  }
	  		},
	  		callback: {
	  			onCheck : onCheckRadio
	  		}
  		  };
          
  		  var zNodes = jsonData;
  		  return addSyncChannelZtree.initZtree("treeChannel", setting, zNodes);
        },
        
        initBaseDataZtree : function(baseType, jsonData){
          var setting = {
		    check: {
	          enable: true,
	          chkStyle: "checkbox",
	          chkboxType: { "Y": "", "N": "" }
	        },
	  		data: {
  			  simpleData: {
  				enable: true
  			  }
	  		},
	  		callback: {
	  			onCheck : onCheck
	  		}
	  	  };
	      if("breed" == baseType){
	    	  setting.check.chkboxType = { "Y" : "s", "N" : "s" };
	    	  setting.callback = {onCheck : onCheckBreed};
	      }
          
  		  var zNodes = jsonData;
  		  return addSyncChannelZtree.initZtree("treeBase", setting, zNodes);
        },
        
        reSelectSyncChannel : function(treeObj, nameIds){
        	var nameIds = nameIds.split(";");
        	var html = "";
			for(var i = 0, l = nameIds.length;i < l; i++){
				var name = nameIds[i].split("_")[0];
				var id = nameIds[i].split("_")[1];
				html += '<div class="input-group showcy"><span class="form-control base-name-js">'+name+'</span><span class="input-group-btn"><button class="btn btn-default blue_color remove_popup remove-node-js" type="button" id="'+id+'" >移除</button></span></div>';
				var selectedNode = treeObj.getNodesByParam("id", id, null);
				if(selectedNode.length > 0){
					treeObj.checkNode(selectedNode[0], true, true);
				}
			}
    		$("#syncChannelChoose").html(html);
        }
        
    };
    
    function onCheck(event, treeId, treeNode) {
		if(treeNode.checked){
			html = '<div class="input-group showcy"><span class="form-control base-name-js">'+treeNode.name+'</span><span class="input-group-btn"><button class="btn btn-default blue_color remove-node-js" type="button" id="'+treeNode.id+'">移除</button></span></div>';
			$("#syncChannelChoose").prepend(html);
		}else{
			var removeTem = treeNode.id;
			$("#syncChannelChoose").find("button[id='" + removeTem +"']").closest(".showcy").remove();
		}
	};
	
	//选中品种checkbox后执行
	function onCheckBreed(event, treeId, treeNode){
		var treeObj = $.fn.zTree.getZTreeObj("treeBase");
		var nodes = new Array();
		var parents = new Array();
		var childenNodes = getChildren(nodes, treeNode);
		var parentNodes = getParentNodes(parents, treeNode.getParentNode());
		//var parentStatus = treeNode.getParentNode().getCheckStatus();
		if(treeNode.checked){
			if(treeNode.isParent){
				treeObj.expandNode(treeNode, true, true, true);
			}
			for(var i = 0;i < childenNodes.length; i++){
				if(!childenNodes[i].nocheck){
					var hasNum = $("#syncChannelChoose").find("button[id='" + childenNodes[i].id + "']").length;
					if(hasNum < 1){
						var html = '<div class="input-group showcy"><span class="form-control base-name-js">'+childenNodes[i].name+'</span><span class="input-group-btn"><button class="btn btn-default blue_color remove-node-js" type="button" id="'+childenNodes[i].id+'">移除</button></span></div>';
						$("#syncChannelChoose").prepend(html);
					}
					
				}
			}
			
		}else{
			for(var i = 0;i < childenNodes.length; i++){
				if(!childenNodes[i].nocheck){
					$("#syncChannelChoose").find("button[id='" + childenNodes[i].id +"']").closest(".showcy").remove();
				}
			}
		}
	};
	
	function getChildren(nodes, treeNode){
		nodes.push(treeNode);
        if (treeNode.isParent){
            for(var obj in treeNode.children){
                getChildren(nodes, treeNode.children[obj]);
            }
        }
        return nodes;
    };
    
    function getParentNodes(nodes, parentNode){
		if(parentNode != null){
			nodes.push(parentNode);
			curNode = parentNode.getParentNode();
			getParentNodes(nodes, curNode);
		}
		return nodes;
	}
	
	function onCheckRadio(event, treeId, treeNode){
		addSyncChannel.currentSelectNodeId = treeNode.id;
	};
	
	bootbox.setDefaults({
        locale: "zh_CN",
    });
	
	$(function(){
		addSyncChannel.init();
	});				    
})();