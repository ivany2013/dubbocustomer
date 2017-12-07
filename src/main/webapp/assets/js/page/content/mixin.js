var inputMixin={
		computed:{
			keywords:function(){
				var str="";
				if(this.kw1!=""){
					str+=this.kw1+",";
				}
				if(this.kw2!=""){
					str+=this.kw2+",";
				}
				if(this.kw3!=""){
					str+=this.kw3+",";
				}
				if(this.kw4!=""){
					str+=this.kw4+",";
				}
				if(this.kw5!=""){
					str+=this.kw5+",";
				}
				if(this.kw6!=""){
					str+=this.kw6+",";
				}
				return str;
			},
			articleTime:function(){
				new moment(articleTime   ,"YYYY/MM/DD HH:mm").format("x");
			},
			bqsm:function(){
				if(this.canOriginal==0){
					return this.copyright;
				}
				if(this.canOriginal==1){
					return this.articleReprint;
				}
			}
		},
	methods:{
		queryNotice:function(){
			contentCommand.excute({command:"queryNotice",param:{vm:this,websiteId:this.websiteId}});
		},
		checkForm:function(){
			return 	contentCommand.excute({command:"checkForm"});
		},
		getArticleTime:function(){
			return contentCommand.excute({command:"getArticleTime"});
		},
		getLimitTerminal:function(){
			return contentCommand.excute({command:"getLimitTerminal"});
		},
		getPortList:function(){
			return contentCommand.excute({command:"getPortList"});
		},
		getFactoryList:function(){
			return contentCommand.excute({command:"getFactoryList"});
		},
		getCityList:function(){
			return contentCommand.excute({command:"getCityList"});
		},
		getChannelList:function(){
			return contentCommand.excute({command:"getChannelList"});
		},
		getBreedList:function(){
			return contentCommand.excute({command:"getBreedList"});
		},
		pdfUpload:function(){
			contentCommand.excute({command:"pdfUpload",param:{vm:this}});
		},
		resetPdf:function(){
			contentCommand.excute({command:"resetPdf",param:{vm:this}});
		},
		upload:function(fileId){
			contentCommand.excute({command:"upload",param:{vm:this,fileId:fileId}});
		}
	}	
}

