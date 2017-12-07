(function() {
    syncChannelArticle = {
        init: function() {
            this.bindEvent();
            this.initTable();
            this.initPdf();
        },
        logic: {
        	//单选点击事件
        	//单选事件 添加属性
        	selectCheckbox : function(event){
        		var _this = event.target;
        		if($(_this).is(':checked')){
    		       $(_this).attr('check','1')
    		    }else{
    		       $(_this).removeAttr('check','1')
    		    }
        	},
        	
        	//全选功能
        	selectAll : function(event){
        		var _this = event.target;
        		if($(_this).is(':checked')){
        		    $(_this).parents('body').find('input[type="checkbox"]').each(function(i,v){
        		        if($(v).attr("disabled")==undefined) {
        		            $(v).prop('checked','true');
        		            $(v).attr('check','1');
        		        }
        		    })
        		}else{
        		    $(_this).parents('body').find('input[type="checkbox"]').removeAttr('checked');
        		    $(_this).parents('body').find('input[type="checkbox"]').removeAttr('check','1')
        		}
        	},
        	
        	//单个删除
        	singleDelete : function(event){
        		var _this = event.target;
        		var syncId = $(_this).closest("tr").attr("syncchannelid");
        		var articleId = $(_this).closest("tr").attr("articleid");
    		    bootbox.confirm("确认删除该选项?", function (result) {
    		        if (result) {
    		        	syncChannelArticle.logic.queryDeleteArticle(syncId, articleId, _this);
    		        }
    		    });
        	},
        	        	
        	//批量删除
        	batchDelete : function(event){
        		var _this = event.target;
        		var syncIds = new Array();
        		var articleIds = new Array();
        		syncChannelArticle.logic.getCheckedIds(syncIds, articleIds);
        		if("" != articleIds){
        			bootbox.confirm("确认删除选中项?", function (result) {
        		        if (result) {
        		        	syncChannelArticle.logic.queryDeleteArticle(syncIds, articleIds, _this);
        		        }
        		    });	
        		}
        	},
        	
        	queryDeleteArticle : function(syncIds, articleIds, _this){
        		$.ajax({
             		type : "post",
             		url : "/sync/deleteSyncArticle",
             		data : {
             			syncIds: syncIds.toString(),
             			targetArticleIds: articleIds.toString()
             		},
             		success : function(response){
             			if("200" == response.status){
             				$.msg("删除成功!");
             				if($(_this).hasClass("single-delete-js") || $(_this).hasClass("batch-delete-js")){
             					syncChannelArticle.initTable();
             				}else{
             					syncChannelArticle.logic.backArticleList();
             				}
             				$(".batch-delete-js").parent("div").find("input[type='checkbox']").prop("checked",false);
             			}else{
             				$.err(response.msg);
             			}
             		}
             	});
        	},
        	
        	getCheckedIds : function(syncIds, articleIds){
        		$("#syncArticleTable input[type='checkbox']").each(function(){
        			if($(this).prop("checked")){
        				syncIds.push($(this).closest("tr").attr("syncchannelid"));
        				articleIds.push($(this).closest("tr").attr("articleid"));
        			}
        		});
        	},
        	
        	queryArticleDetail: function(event){
        		var _this = event.target;
        		var articleId = $(_this).closest("tr").attr("articleid");
        		var syncChannelId = $(_this).closest("tr").attr("syncChannelid");
        		var fromChannelAllName = $("#fromChannelAllName").text();
        		var toChannelAllName = $("#toChannelAllName").text();
        		var fromChannelId = $("#fromChannelId").val();
        		var fromWebsiteId = $("#fromWebsiteId").val();
        		location.href = "/sync/syncArticleDetailPage?articleId=" + articleId + "&syncChannelId=" + syncChannelId + 
        						"&toChannelAllName=" + toChannelAllName + "&fromChannelAllName=" + fromChannelAllName + "&fromChannelId=" + fromChannelId + "&fromWebsiteId=" + fromWebsiteId;
        	},
        	
        	backArticleList: function(){
        		var fromChannelAllName = $("#fromChannelAllName").val();
        		var toChannelAllName = $("#toChannelAllName").val();
        		var syncChannelId = $("#syncChannelId").val();
        		var fromChannelId = $("#fromChannelId").val();
        		var fromWebsiteId = $("#fromWebsiteId").val();
        		location.href="/sync/syncArticleListPage?syncChannelId=" + syncChannelId + "&fromChannelAllName=" + fromChannelAllName + 
        		"&toChannelAllName=" + toChannelAllName + "&channelId=" + fromChannelId + "&websiteId=" + fromWebsiteId;
        	},
        	
        	backSyncMain : function(){
        		var fromWebsiteId = $("#fromWebsiteId").val();
        		var fromChannelId = $("#fromChannelId").val();
        		location.href="/sync/syncManage?fromChannelId=" + fromChannelId + "&fromWebsiteId=" + fromWebsiteId;
        	}
        },
        bindEvent: function() {
            $("body").on("click", "input[type='checkbox']", this.logic.selectCheckbox);
            $("body").on("click", ".all_checked input[type='checkbox']", this.logic.selectAll);
            $("body").on("click", ".batch-delete-js", this.logic.batchDelete);
            $("body").on("click", ".single-delete-js,.single-delete-detail-js", this.logic.singleDelete);
            $("body").on("click", "#queryArticleDetail", this.logic.queryArticleDetail);
            $("body").on("click", "#backArticleList", this.logic.backArticleList);
            $("body").on("click", "#backSyncMain", this.logic.backSyncMain);
        },
        
        
        initTable : function(){
        	if($("#syncDataList").length > 0){
        		var jsonParam={
        				pageSize:10,
        				pageNum:1,
        				syncChannelId: $("#syncChannelId").val(),
        				editorType: $("#editorType").val()
        		};
        		$("#syncDataList").pagination({
        			url: "/sync/syncArticleListPagination",
        			paramJson:jsonParam,
        			callback:function(){
        				
        			}
        		});
        	}
        },
        
        initPdf : function(){
        	if($("#pdfContext").html()){
				pdfInit($("#pdfContext").html());
        	}
        }
           
    };
    
    bootbox.setDefaults({
        locale: "zh_CN",
    });
    
	$(function(){
		syncChannelArticle.init();
	});				    
})();