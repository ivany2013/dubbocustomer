(function(){
	userCustom = {
		beforeIds : [],
		afterIds : [],
		init: function(){
			this.bindEvent();
		},
		logic:{
			removeCustom:function(event){
				var _this = event.target;
		        bootbox.confirm("确认移除?", function (result) {
		            if (result) {
		                $(_this).parents(".showcy").remove();
		                $.ajax({
		    				type:"post",
		    				url:"/userCustom/removeCustom",
		    				data:{
		    					"id":$(_this).data("id")
		    				},
		    				success:function(data){
		    					if(data.status==200){
		    						$.msg("操作成功");
		    					}else{
		    						$.msg("操作失敗");
		    					}
		    					location.reload();
		    				}
		    			});
		            }
		        });
			},
			queryTree:function(event){
				var _this = event.target;
				var tit=$(this).text().substring(2, 4);
				var type;
				var dom;
				 switch(tit){
				 	case '频道':
				 		type = 0;
				 		dom =".channel";
		                break;
		            case '品种':
		            	type = 1;
		            	dom =".breed";
		                break;
		            case '城市':
		            	type = 2;
		            	dom =".city";
		                break;
		            case '钢厂':
		            	type = 3;
		            	dom =".factory";
		                break;
		            case '港口':
		            	type = 4;
		            	dom =".port";
		                break;
				 }
		        bootbox.dialog({
		            message: $("#addEditeModal").html(),
		            title: "选择"+tit,
		            lage:true,
		            className: "modal-inverse",
		            buttons: {
		                success: {
		                    label: "确认",
		                    className: "btn-primary",
		                    callback: function () {
		                    	var customList = new Array();
		                    	//1. 得到所有选中节点
		                    	var treeObj = $.fn.zTree.getZTreeObj("subscribeTree");
		        		        //var nodes = treeObj.getCheckedNodes(true);
		                    	/*var nodes = treeObj.getNodesByFilter(function filter(node) {
		                    	    return (node.checked==true);
		                    	});*/
		                    	$("#currentTemp .showcy").each(function(){
		                    		var custom = {};
			                    	custom.employeeId = $("#userId").val();
			                    	custom.type = type;
			                    	custom.itemId = $(this).find(".remove-node-js").attr("id");
			                    	custom.itemName = $(this).find(".channel-name-js").text();
			                    	customList.push(custom);
		                    	});
		                    	
		                    	/*for(var i=0, l=nodes.length; i<l; i++){
		                    		var custom = {};
			                    	custom.employeeId = $("#userId").val();
			                    	custom.type = type;
			                    	custom.itemId = nodes[i].id;
			                    	custom.itemName = nodes[i].name;
			                    	customList.push(custom);
		                    	}*/
		                    	/*if(customList.length==$(dom+" .showcy").length){
		                    		$.err("请选择"+tit);
		                    		return false;
		                    	}*/
		                    	if(customList.length>0){
		                    		$.ajax({
		                    			type: "POST",  
		                    			url: "/userCustom/saveCustom",  
		                    			data: {
		                    				userCustomListStr : encodeURIComponent(JSON.stringify(customList)),
		                    			},
		                    			success: function(response){  
		                    				if("200" == response.status){
		                    					$.msg("操作成功");
		                    					location.href = "/userCustom/toPage";
		                    				}else{
		                    					$.err("操作失败");
		                    				}
		                    			}
		                    		});
		                    	}
		                    	
		                    }
		                },
		                cancel: {
		                    label: "取消",
		                    className: "btn-primary",
		                }
		            }
		        });
		        var jsonData = "";
		        switch($(_this).text()){
		            case '新增频道':
		                $('.inputrow').removeClass('show').eq(0).addClass('show');
		                $('.text1').text('频道');
		                var selectTemp = $(_this).closest(".subscribe-type-js").find(".select-temp-js").html();
		                var ids = $(_this).closest(".subscribe-type-js").data("ids");
		                $("#subscribeTree").attr("selectedid", ids);
		                userCustom.logic.querySubscribeTree("channel", selectTemp, ids);
		                break;
		            case '申请频道':
		            $('.text1').text('频道');
		                $('.inputrow').removeClass('show').eq(0).addClass('show');
		              break;
		            case '新增品种':
		                $('.inputrow').removeClass('show').eq(1).addClass('show');
		                $('.text1').text('品种');
		                var selectTemp = $(_this).closest(".subscribe-type-js").find(".select-temp-js").html();
		                var ids = $(_this).closest(".subscribe-type-js").data("ids");
		                $("#subscribeTree").attr("selectedid", ids);
		                userCustom.logic.querySubscribeTree("breed", selectTemp, ids);
		              break;
		            case '申请品种':
		                $('.inputrow').removeClass('show').eq(1).addClass('show');
		                $('.text1').text('品种')
		              break;
		            case '新增城市':
		                $('.inputrow').removeClass('show').eq(1).addClass('show');
		                $('.text1').text('城市');
		                var selectTemp = $(_this).closest(".subscribe-type-js").find(".select-temp-js").html();
		                var ids = $(_this).closest(".subscribe-type-js").data("ids");
		                $("#subscribeTree").attr("selectedid", ids);
		                userCustom.logic.querySubscribeTree("city", selectTemp, ids);
		              break;
		            case '申请城市':
		                $('.inputrow').removeClass('show').eq(1).addClass('show');
		                $('.text1').text('城市')
		              break;
		            case '新增钢厂':
		                $('.inputrow').removeClass('show').eq(1).addClass('show');
		                $('.text1').text('钢厂');
		                var selectTemp = $(_this).closest(".subscribe-type-js").find(".select-temp-js").html();
		                var ids = $(_this).closest(".subscribe-type-js").data("ids");
		                $("#subscribeTree").attr("selectedid", ids);
		                userCustom.logic.querySubscribeTree("factory", selectTemp, ids);
		              break;
		            case '申请钢厂':
		                $('.inputrow').removeClass('show').eq(1).addClass('show');
		                $('.text1').text('钢厂')
		              break;
		            case '新增港口':
		                $('.inputrow').removeClass('show').eq(1).addClass('show');
		                $('.text1').text('港口');
		                var selectTemp = $(_this).closest(".subscribe-type-js").find(".select-temp-js").html();
		                var ids = $(_this).closest(".subscribe-type-js").data("ids");
		                $("#subscribeTree").attr("selectedid", ids);
		                userCustom.logic.querySubscribeTree("port", selectTemp, ids);
		              break;
		            case '申请港口':
		                $('.inputrow').removeClass('show').eq(1).addClass('show');
		                $('.text1').text('港口')
		              break;
		            default:;
		        };
				//$.fn.zTree.init($("#subscribeTree"), setting, zNodes);
			},
			checkedNodes:function(ids,treeObj){
				for(var i = 0, l = ids.length;i < l; i++){
  					var selectedNode = treeObj.getNodesByParam("id", ids[i], null);
  					if(selectedNode.length > 0){
  						//selectedNode[0].nocheck = true;
  						treeObj.checkNode(selectedNode[0],true);
  						//treeObj.updateNode(selectedNode[0]);
  						treeObj.setChkDisabled(selectedNode[0],true);
  						//selectedNode[0].chkDisabled=true;
  					}
  				}
				
				
			},
			removeChechedNodes:function(nodeId,event){
				$(event).parents(".showcy").remove();
				var treeObj = $.fn.zTree.getZTreeObj("subscribeTree");
		        var nodes = treeObj.getCheckedNodes(true);
				for (var i=0, l=nodes.length; i<l; i++) {
						if(nodeId == nodes[i].id ){
							treeObj.checkNode(nodes[i], false, false);
						}
					}
			},
			querySubscribeTree : function(baseType, selectTemp, ids){
			  var treeObj = null;
			  var zNodes=[];
			  if("channel" == baseType){
				  var key = $("#changeWebsite").find("option:selected").attr("id");
				  console.log(jsonArrayAll);
				  $.each(jsonArrayAll,function(k, v){
					 if(jsonArrayAll[k].websiteId == key){
						 zNodes=jsonArrayAll[k].jsonArray;
						 treeObj = addSyncChannelZtree.initZtree("subscribeTree", setting, zNodes);
						 $("#subscribeTree").attr("selectedid", ids);
					 } 
				  })
				  
				  for(var i=0;i<zNodes.length;i++){
					  if(zNodes[i].disable==true){
						  var node=treeObj.getNodeByParam("id",zNodes[i].id,null);
						  treeObj.removeNode(node);
					  }
				  }
				  ids = ids.substring(0,ids.length - 1);
				  ids = ids.split(",");
				  if(typeof treeObj != "undefined"){
    			      userCustom.logic.checkedNodes(ids,treeObj);
    			  }
				  //onCheck();
			  }else{
				  $.ajax({
		      		type : "post",
		      		url : "/sync/queryBaseDataTree",
		      		data : {
		      			baseType : baseType
		      		},
		      		success : function(response){
		      			var data=response.data;
		      			var cityParentIds=[];
		      			if(baseType=='city'){
		      				for(var i=0;i<data.length;i++){
		      					if(data[i].pId){
		      						if($.inArray(data[i].pId,cityParentIds)==-1){
		      							cityParentIds.push(data[i].pId);
		      						}
		      					}
		      				}
		      			}
		      			treeObj = addSyncChannelZtree.initZtree("subscribeTree", setting, data);
		      			ids = ids.substring(0,ids.length - 1);
	      				ids = ids.split(",");
	      				userCustom.beforeIds = ids;
	      				if(typeof treeObj != "undefined"){
	      					userCustom.logic.checkedNodes(ids,treeObj);
	      					
	      				}
	      				if(baseType=='city'){
		      				for(var i=0;i<cityParentIds.length;i++){
		      					var selectedNode = treeObj.getNodesByParam("id", cityParentIds[i], null);
		      					if(selectedNode.length > 0){
		      						selectedNode[0].nocheck = true;
		      						treeObj.updateNode(selectedNode[0]);
		      					}
		      				}
		      			}
	      				//onCheck();
		      		}
		      	  }); 
			  }
			   
	        },
	        
	        changeWebsite: function(){
	        	var key = $("#changeWebsite").find("option:selected").attr("id");
				$.each(jsonArrayAll,function(k, v){
					if(jsonArrayAll[k].websiteId == key){
					    treeObj = addSyncChannelZtree.initZtree("subscribeTree", setting, jsonArrayAll[k].jsonArray);
					    var ids =  $("#subscribeTree").attr("selectedid");
					    if(ids.endsWith(",")){
					    	ids = ids.substring(0,ids.length - 1);
					    }
	      				ids = ids.split(",");
	      				if(typeof treeObj != "undefined" && ids.length > 0){
	      					userCustom.logic.checkedNodes(ids,treeObj);
	      				}
					} 
				});
	        }
	        	        
		},
		
		bindEvent: function() {
            $(".remove-js").on("click", this.logic.removeCustom);
            $(".addEdite").on("click", this.logic.queryTree);
            $("body").on("change", "#changeWebsite",this.logic.changeWebsite);
        }
	};
    function onCheck(event, treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj("subscribeTree");
		var nodes = zTree.getCheckedNodes(true);
		var ids= "";
		var currentSelectedId = $("#subscribeTree").attr("selectedid").split(",");
		var selectedIds = $.grep(currentSelectedId, function(n) {return $.trim(n).length > 0;});
		
		if(!treeNode.checked){
			selectedIds.pop(treeNode.id);
			$("#currentTemp").find("button[id='" +treeNode.id +"']").closest(".showcy").remove();
		}else{
			selectedIds.push(treeNode.id);
			
			var html=$("#currentTemp").html();
			if(html.trim()=="无"){
				html="";
			}
			var clickHtml='<div class="input-group showcy "><span class="form-control channel-name-js">'+treeNode.name+'</span><span class="input-group-btn"><button onclick="userCustom.logic.removeChechedNodes('+treeNode.id+',this)" class="btn btn-default blue_color remove-node-js" type="button" id="'+treeNode.id+'">移除</button></span></div>';
			$("#currentTemp").html(clickHtml+html);
			ids += treeNode.id+",";
		}
		$("#subscribeTree").attr("selectedid", selectedIds.toString());
		return ids;
	};
	
	bootbox.setDefaults({
        locale: "zh_CN",
    });
	
	
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
	$(function(){
		userCustom.init();
	});
})();
