var contentCommand=(function(){
	var Action={
			/**
			 * 请求“版权说明”和“免责声明”数据
			 * @property copyright 原创版版权申明
			 * @property articleReprint 转摘版版权申明
			 * @property escapeClause 免责申明
			 */
			queryNotice:function(param){
				var data={websiteId:param.websiteId};
				$.ajax({
	    			url:'/notice/get',
	    			data:data,
	    			success:function(data){
	    				param.vm.copyright=data.data.copyright;
	    				param.vm.articleReprint=data.data.articleReprint;
	    				param.vm.escapeClause=data.data.escapeClause;
	    			}
	    		})
			},
			/**
			 * 表单检查
			 */
			checkForm:function(){
				var bootstrapValidator = $("#registrationForm").data('bootstrapValidator');
				bootstrapValidator.validate();
				if(!$("#article_glpz input").length){
					$.err("请先到定制管理中新增品种");
					return false;
				}
				if(bootstrapValidator.isValid()){
					return true;
				}else{
					$.err("有表单必填项未填写");
					return false;
				}
			},
			getArticleTime:function(){
				var currArticleTime=new moment($("#article_sssj").val(),"YYYY/MM/DD HH:mm").format("x");
				//如果用户选择了时间，就会和进入新增页面的时间不相等，就使用用户选择的时间
				if(currArticleTime!=articleTime){
					articleTime=currArticleTime;
				}else{
					//否则选择当前的计算机时间
					articleTime=new moment().format("x");
				}
				return articleTime;
			},
			getLimitTerminal:function(){
				var nodes=$("[name='limitTerminal']:checked");
				var str="";
				for(var i=0;i<nodes.length;i++){
					str+=$(nodes[i]).val();
					str+=",";
				}
				return str;
			},
			getPortList:function(){
				var nodes=$("[name='portList']:checked");
				var jsonArr=[];
				for(var i=0;i<nodes.length;i++){
					var node=$(nodes.eq(i));
					jsonArr.push({portId:node.attr("portId"),portName:node.attr("portName")});
				}
				return jsonArr;
			},
			getFactoryList:function(){
				var nodes=$("[name='factoryList']:checked");
				var jsonArr=[];
				for(var i=0;i<nodes.length;i++){
					var node=$(nodes.eq(i));
					jsonArr.push({factoryId:node.attr("factoryId"),factoryName:node.attr("factoryName")});
				}
				return jsonArr;
			},
			getCityList:function(){
				var nodes=$("[name='cityList']:checked");
				var jsonArr=[];
				for(var i=0;i<nodes.length;i++){
					var node=$(nodes.eq(i));
					jsonArr.push({cityId:node.attr("cityId"),cityName:node.attr("cityName")});
				}
				return jsonArr;
			},
			getChannelList:function(){
				var nodes=$("[name='channelList']:checked");
				var jsonArr=[];
				for(var i=0;i<nodes.length;i++){
					var node=$(nodes.eq(i));
					jsonArr.push({channelId:node.attr("channelId"),channelName:node.attr("channelName")});
				}
				return jsonArr;
			},
			getBreedList:function(){
				var nodes=$("[name='breedList']:checked");
				var jsonArr=[];
				for(var i=0;i<nodes.length;i++){
					var node=$(nodes.eq(i));
					jsonArr.push({breedId:node.attr("breedId"),breedName:node.attr("breedName")});
				}
				return jsonArr;
			},
			pdfUpload:function(param){
				$.loading.start();
				var path=$("#fileCover").val();
				if(path.trim()==""||path.trim()=="未选择任何文件"){
					$.err("请上传文件");
					$.loading.end();
					return false;
				}
				var suffix=path.substr(path.lastIndexOf(".")+1,path.length);
				if(suffix!='pdf'){
					$.err("只能上传pdf文件");
					$.loading.end();
					return false;
				}	
				$.ajaxFileUpload
	            (
	                {
						type:"POST",
	                    url: '/article/file/uploadPDF', //用于文件上传的服务器端请求地址
	                    secureuri: false, //是否需要安全协议，一般设置为false
	                    fileElementId: "upfile", //文件上传域的ID
	                    dataType: 'json', //返回值类型 一般设置为json
	                    success: function (data, status)  //服务器成功响应处理函数
	                    {	
							$.loading.end();
							if(data.status=="200"){
								var url=data.data.url;
								var fileId=data.data.fileId;
								pdfInit(url);
								$("#pdfEdit").show();
								$(".ueEditor").hide();
								param.vm.pdfVisible=true;
								param.vm.pdfUrl=fileId;
								//0内容类型为富文本编辑器 1代表pdf
								param.vm.contentType=1;
							}else{
								$.err("文章上传失败");
							}
						}
					}	
				)		
		},
		resetPdf:function(param){
			$("#pdfEdit").hide();
			$(".ueEditor").show();
			$("#fileCover").val("");
			$("#upfile").val("");
			$("#pdfFileId").val("");
			param.vm.pdfUrl="";
			param.vm.pdfVisible=false;
			//0内容类型为富文本编辑器 1代表pdf
			param.vm.contentType=0;
		},
		upload:function(param){
			var fileId=param.fileId;
			var vm=param.vm;
			var isZip="";
			var fileName="";
			if(fileId=="lefile"){
				fileName=$("#photoCover").val().split('\\')[$("#photoCover").val().split('\\').length-1]
				isZip=true;
				if(fileName.trim()==""||fileName.trim()=="未选择任何文件"){
					$.err("请上传文件");
					return false;
				}
			}else if(fileId="upimg"){
				fileName=$("#fileimg").val().split('\\')[$("#fileimg").val().split('\\').length-1];
				isZip=false;
				if(fileName.trim()==""||fileName.trim()=="未选择任何文件"){
					$.err("请上传文件");
					return false;
				}
				if(!fileName.IsPicture()){
					$.err("上传的必须是图片");
					$.loading.end();
					return false;
				}
			}
				$.loading.start();
			$.ajaxFileUpload
            (
                {
					type:"POST",
                    url: '/article/file/upload', //用于文件上传的服务器端请求地址
					data:{fileName:fileName,isZip:isZip},
                    secureuri: false, //是否需要安全协议，一般设置为false
                    fileElementId: fileId, //文件上传域的ID
                    dataType: 'json', //返回值类型 一般设置为json
                    success: function (data, status)  //服务器成功响应处理函数
                    {
						if(data.status=="200"){
							 if(fileId=="upimg"){
								var dom="<a href='"+data.data.url+"' target='blank'>"+data.data.fileName+"</a>"
								vm.titlePic=data.data.url;
								$("#imgStatus").html(dom);
								vm.upimgVisable=true;
							}else if(fileId="lefile"){
								var dom="<a href='#' fileId='"+data.data.fileId+"' class='download'>"+data.data.fileName+"</a>"
								vm.attachment=data.data.fileId;
								vm.attachmentName=data.data.fileName;
								$("#attachmentStatus").html(dom);
								vm.lefileVisable=true;
							}
						}else{
							 if(fileId=="upimg"){
								vm.titlePic="";
								$("#imgStatus").html("");
								vm.upimgVisable=false;
							}else if(fileId="lefile"){
								vm.attachment="";
								vm.attachmentName="";
								$("#attachmentStatus").html("");
								vm.lefileVisable=false;
							}
						}
							$.loading.end();
                    },
                    error: function (data, status, e)//服务器响应失败处理函数
                    {
						vm.attachment="";
						$("#fileStatus").val("文件上传失败");
                    }
                }
            )
		}
	}
	return {
		excute:function(msg){
			if(!msg){
				return ;     
			}
			if(msg.length){
				for(var i=0;i<msg.length;i++){
					arguments.callee(msg[i]);
				}
			}else{
				msg.param=Object.prototype.toString.call(msg.param)==='[Object Array]'?msg.param:[msg.param];
				return Action[msg.command].apply(Action,msg.param);
			}
		}
	}
})();