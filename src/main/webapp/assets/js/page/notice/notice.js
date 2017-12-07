var copyright_="";
var escapeClause_="";
var articleReprint_="";
var noticeApp = new Vue({
	el:"#noticeApp",
	data:{
		websiteId:$("#myTab9").find(".active").val(),
		comment:{
			id:"",
			websiteId:"",
			copyright:"",//原创
			escapeClause:"",//免责
			articleReprint:"",//转载
			version:"",
			type:""
		}
	},
	methods:{
		changeChannel:function(id){
			this.websiteId = id;
			this.getData();
			$('.content_2').removeClass('show').siblings().addClass('show');//.text(text)
			$('.btn_2').removeClass('show').siblings('.btn_1').addClass('show');
		},
		getData:function(){
			var url="/notice/get";
			var temp = this;
			temp.comment.websiteId = temp.websiteId;
			$.ajax({
			   type: "post",
			   url: url,
			   data:temp.comment,
			   dataType:"json",
			   success: function(msg){
				   if(msg.status != "200"){
					   $.err(msg.msg);
				   }else{
					   temp.comment = msg.data;
					   temp.comment.websiteId = temp.websiteId;
				   }
			   }
			});
		},
		saveChangeEscapeClause:function(type){
			var url="/notice/modify";
			var temp = this;
			temp.comment.type = type;
			console.log(this.comment.websiteId);
			if(temp.comment.escapeClause.length > 300){
				$.err("输入内容不能多于300！");
				return;
			}
			$.ajax({
			   type: "post",
			   url: url,
			   data:temp.comment,
			   dataType:"json",
			   success: function(msg){
				   if(msg.status != "200"){
					   $.err(msg.msg);
				   }else{
					   $.msg("修改成功！");
				   }
				   temp.getData();
			   }
			});
		},
		saveChangeArticleReprint:function(type){
			var url="/notice/modify";
			var temp = this;
			temp.comment.type = type;
			console.log(this.comment.websiteId);
			if(temp.comment.articleReprint.length > 300){
				$.err("输入内容不能大于300！");
				return;
			}
			$.ajax({
			   type: "post",
			   url: url,
			   data:temp.comment,
			   dataType:"json",
			   success: function(msg){
				   if(msg.status != "200"){
					   $.err(msg.msg);
				   }else{
					   $.msg("修改成功！");
				   }
				   temp.getData();
			   }
			});
		},
		saveChangeCopyright:function(type){
			var url="/notice/modify";
			var temp = this;
			temp.comment.type = type;
			console.log(this.comment.websiteId);
			if(temp.comment.copyright.length > 300){
				$.err("输入内容不能大于300！");
				return false;
			}
			$.ajax({
			   type: "post",
			   url: url,
			   data:temp.comment,
			   dataType:"json",
			   success: function(msg){
				   if(msg.status != "200"){
					   $.err(msg.msg);
				   }else{
					   $.msg("修改成功！");
				   }
				   temp.getData();
			   }
			});
		},
		cancel:function(param){
			switch (param){
				case "copyright":
					noticeApp.comment.copyright=copyright_;
					break;
				case "escapeClause":
					noticeApp.comment.escapeClause=escapeClause_;
					break;
				case "articleReprint":
					noticeApp.comment.articleReprint=articleReprint_;
					break;	
			}
		},
		modify:function(param){
			switch (param){
				case "copyright":
					copyright_=noticeApp.comment.copyright;
					break;
				case "escapeClause":
					escapeClause_=noticeApp.comment.escapeClause;
					break;
				case "articleReprint":
					articleReprint_=noticeApp.comment.articleReprint;
					break;	
			}
		}
	},
	mounted:function(){
		this.getData();
	}
});