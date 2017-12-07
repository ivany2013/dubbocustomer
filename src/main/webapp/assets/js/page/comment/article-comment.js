var articleCommentApp = new Vue({
	el:"#articleCommentApp",
	data:{
		comment:{
			pageSize:10,
			pageNum:1,
			id:null,
			articleId:null,
			publisherId:null,
			publishTime:null,
			maxCommentTime:null,
			sumHandered:null,
			unSumHandered:null,
			articleTitle:null,
			editorId:null,
			editorIdList:null,
			editorIds:null,
			editorName:null,
			startTime:null,
			endTime:null,
			idString:null
		}
	},
	methods:{
		getArticleAll:function(){
			var urll="/comment/getArticleAll";
			var temp = this;
			$("#articleCommentDiv1").pagination({
				url: urll,
				paramJson:temp.comment,
				callback:function(){
					
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
		this.getArticleAll();
	}
})