var ztreeTool={
		//后端json树转ztree数据结构
		formatJson:function(resultList,websiteName){
			var jsonArr=[];
			if(!resultList){
				return false;
			}
			if(websiteName!=null||websiteName!=''){
				var json={};
				json.id='all';
				json.name=websiteName;
				json.isParent=true;
				json.open=true;
				jsonArr.push(json);
			}
			for(var i=0;i<resultList.length;i++){
				var result=resultList[i];
				var json={};
				if(result.parentId!=0){
					json.pId=result.parentId;
				}else{
					json.pId='all';
				}
				if(result.status==0){
					json.disable=false;
				}else{
					json.disable=true;
				}
				json.id=result.id;
				json.name=result.name;
				jsonArr.push(json);
			}
			console.log(jsonArr);
			return jsonArr;
		},
		formatRadioJson:function(resultList,websiteName,nowChannelId){
			var jsonArr=[];
			if(!resultList){
				return false;
			}
			if(websiteName!=null||websiteName!=''){
				var json={};
				json.id='all';
				json.name=websiteName;
				json.isParent="true";
				json.open=true;
				json.nocheck=true;
				json.doCheck=false
				jsonArr.push(json);
			}
			for(var i=0;i<resultList.length;i++){
				var result=resultList[i];
				var json={};
				if(result.parentId!=0){
					json.pId=result.parentId;
				}else{
					json.pId='all';
				}
				if(result.status==0){
					json.disable=false;
				}else{
					json.disable=true;
					continue;
				}
				if(result.id==nowChannelId){
					json.nocheck=true;
					json.doCheck=false
				}
				json.id=result.id;
				json.name=result.name;
				jsonArr.push(json);
			}
			console.log(jsonArr);
			return jsonArr;
		},
		init :function (dom,setting,zNodes,clickCallBack){
			var setting={
					callback: {
						onClick: clickCallBack
					}	
			}
			$.fn.zTree.init(dom, setting, zNodes);
		},
		//过滤所有禁用的频道
		filterDisable:function(treeObj,zNodes){
			for(var i=0;i<zNodes.length;i++){
			  	if(zNodes[i].disable==true){
					var node=treeObj.getNodeByParam("id",zNodes[i].id,null);
					treeObj.removeNode(node);
				}
			  }
		},
}