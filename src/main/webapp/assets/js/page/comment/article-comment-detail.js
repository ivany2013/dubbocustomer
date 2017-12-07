function GetQueryString(name)
{
var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
var r = window.location.search.substr(1).match(reg);
if(r!=null)return unescape(r[2]); return null;
}

// 调用方法
var articleCommentDetail = new Vue({
	el:"#articleCommentDetail",
	data:{
		comment:{
			pageSize:4,
			pageNum:1,
			id:null,
			articleId:GetQueryString("articleId"),
			publisherId:null,
			writerId:null,
			replyerId:null,
			websiteId:null,
			articleTitle:null,
			commentTime:null,
			status:GetQueryString("type"),
			idsParam:null,
			version:null,
			idString:null
		}
	},
	methods:{
		getArticleCommentDetail:function(){
			var urll="/comment/getArticleCommentDetail";
			var temp = this;
			$("#articleCommentDetailDiv").pagination({
				url: urll,
				paramJson:temp.comment,
				callback:function(){
					var num= $("#articleCommentDetailDiv").find(".paginator").attr("p_totalsize");
					if(temp.comment.status == 2){
						html='<p class="t_form_style no-padding text-center no-margin">本文评论共<span class="num_style">'+num+'</span>条</p>';
						$("#commentNum").html(html);
					}
					if(temp.comment.status == 1){
						html='<p class="t_form_style no-padding text-center no-margin">本文已处理评论共<span class="num_style">'+num+'</span>条</p>';
						$("#commentNum").html(html);
					}
					if(temp.comment.status == 0){
						html='<p class="t_form_style no-padding text-center no-margin">本文未处理评论共<span class="num_style">'+num+'</span>条</p>';
						$("#commentNum").html(html);
					}
				}
			});
		},
		getTreated:function(){
			var url="/comment/getTreated";
			var temp = this;
			$.ajax({
				type:"post",
				url:url,
				data:temp.comment,
				success:function(msg){
					$("#treatedDiv").html(msg);
				}
			});
		},
		getUntreatedAgain:function(id){
			var urll="/comment/getUntreatedAgain";
			var temp = this;
			$.ajax({
				type:"post",
				url:urll,
				data:{
					"id":id,
					"type":"article"
				},
				success:function(msg){
					bootbox.dialog({
			            message: msg,
			            title: "处理评论",
			            className: "modal-dispose"
			        });
				}
			});
		},
		replyType:function(param,eve){
			
			var replyContent = $(eve).closest(".list").find(".context-js").val().trim();
			var id = $(eve).closest(".list").find(".id-js").val();
			var version = $(eve).closest(".list").find(".version-js").val();
			var urll="/comment/modifyComment";
			var temp = this;
			if(param == 1){
				if(replyContent == "" || replyContent == null){
					 $.err("请先填写回复内容！");
					return;
				}else if(replyContent.length > 500){
					$.err("回复内容不能多于500字！");
					return;
				}else{
					bootbox.hideAll();
				}
			}
			$.ajax({
				type:"post",
				url:urll,
				data:{
					"param":param,
					"replyContent":replyContent,
					"id":id,
					"version":version
				},
				success:function(msg){
					$("#articleCommentDetailDiv").pagination("refresh");
					if(msg.status == "200"){
						if(param == 1){
							$.msg("回复成功！");
						}
					}else{
						$.err(msg.msg);
					}
				}
			});
	},
	getPerson:function(){
		var urll="/comment/getPerson";
		var temp = this;
		$.ajax({
			type:"post",
			url:urll,
			data:{
				"idString":temp.comment.idString
			},
			success:function(msg){
				bootbox.dialog({
		            message: msg,
		            title: "选择处理人",
		            className: "modal-inverse",
		            buttons: {
		                success: {
		                    label: "确认",
		                    className: "btn-primary",
		                    callback: function () {
		                    	selectChecked();
		                    	temp.comment.idString = personIds.substring(0,personIds.length - 1);
		                    	personNames = personNames.substring(0,personNames.length - 1);
		                    	$(".personNames").val(personNames);
		                    }
		                },
		                cancel: {
		                    label: "取消",
		                    className: "btn-primary"
		                    	
		                }
		            }
		        });
			}
		});
		}
	},
	mounted:function(){
		this.getArticleCommentDetail();
	}
})

