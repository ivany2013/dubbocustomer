

var commentApp = new Vue({
	el:"#commentApp",
	data:{
		comment:{
			pageSize:2,
			pageNum:1,
			id:null,
			articleId:null,
			publisherId:null,
			writerId:null,
			replyerId:null,
			websiteId:null,
			articleTitle:null,
			commentTime:null,
			status:0,
			ids:null,
			idsParam:null,
			version:null,
			idString:null,
			startTime:null,
			endTime:null
		}
		
	},
	methods:{
		getUntreated:function(){
			this.comment.status = 0;
			this.comment.startTime = null;
			this.comment.endTime = null;
			$("#date01").val("");
			var urll="/comment/getUntreated";
			var temp = this;
			$.ajax({
				type:"post",
				url:urll,
				data:temp.comment,
				success:function(msg){
					$("#untreatedDiv").html(msg);
				}
			});
		},
		showMore:function(){
			this.comment.pageSize = this.comment.pageSize + 2;
			this.getUntreated();
		},
		replyType:function(param,eve){
				var replyContent = $(eve).closest(".list").find(".context-js").val().trim();
				var id = $(eve).closest(".list").find(".id-js").val();
				var version = $(eve).closest(".list").find(".version-js").val();
				var urll="/comment/modifyComment";
				var temp = this;
				console.log(param+"--"+replyContent+"--"+id+"--"+version);
				if(param == 1){
					if(replyContent == "" || replyContent == null){
						$.err("请先填写回复内容！");
						return;
					}else if(replyContent.length > 500){
						$.err("回复内容不能多于500字！");
						return;
					}else {
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
						$("#treatedDiv").pagination("refresh");
						temp.comment.status = 0;
						temp.getUntreated();
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
		getTreated:function(){
			var urll="/comment/getTreated";
			var temp = this;
			this.comment.status = 1;
			this.comment.pageSize = 4;
	    	$("#treatedDiv").pagination({
				url: urll,
				paramJson:temp.comment,
				callback:function(){
					
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
					"id":id
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
		this.getUntreated();
	}
});