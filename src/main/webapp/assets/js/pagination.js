(function($) {
	var PAGINATION_INSTANCES = {};
	var Pagination = function(EL, option) {
		this.EL = EL;
		this.selector = EL.selector;
		this.options = option;
		this.init();
	}
	Pagination.prototype = {
		init : function() {
	        var resultJson=$.extend(Pagination.defaults,this.options.paramJson);
		    this.loadContent(resultJson);
		    this.bandEvent();
		},
	    loadContent:function(paramJson){
	     var url = this.options.url;
	     var self=this;
	     $.ajax({
	 		type : 'POST',
	 		url : url,
	 		data : paramJson,
	 		success : function(result) {
	 			self.EL.html(result);
	 			if(self.options.callback&&typeof self.options.callback=='function'){
	 				self.options.callback();
	 			}
	 			if(self.options.paramJson.sort&&self.options.paramJson.sort==true){
	 				self.sortTable();
	 			}
	 		},
	 		dataType : "html"
	 	});
            
	    },
	    bandEvent:function(){
	      var self=this;
	      self.EL.delegate(".toTargetPage","click",function(e){
	       self.toTargetPage($(e.currentTarget).attr("pageNum"));	
	      });
	      self.EL.delegate(".toPrePage","click",function(e){
		       self.toTargetPage($(e.currentTarget).attr("pageNum"));	
		   });
	      self.EL.delegate(".toNextPage","click",function(e){
		       self.toTargetPage($(e.currentTarget).attr("pageNum"));	
		   });
	      self.EL.delegate(".toLastPage","click",function(e){
		       self.toTargetPage($(e.currentTarget).attr("pageNum"));	
		   });
	      self.EL.delegate(".toFirstPage","click",function(e){
		       self.toTargetPage($(e.currentTarget).attr("pageNum"));	
		   });
	      self.EL.delegate(".toTargetPageBtn","click",function(e){
	    	  var toPageNum = self.EL.find("#pageNation_pageNum").val();
	    	  var maxNum=self.EL.find(".paginator").attr("p_totalpagesnum");
	    	  if(!/^[0-9]{0,}[1-9][0-9]{0,}$/.test(toPageNum)){//格式错误
	    		  return;
	    	  }
	    	  if(parseInt(toPageNum)>parseInt(maxNum)){//超过最大页
	    		  return;
	    	  }else{
	    		 self.toTargetPage(toPageNum);	
	    	  }
		   });
	    },
	    toTargetPage:function(pageNum){
	       var resultJson=this.options.paramJson;
	       resultJson.pageNum=pageNum;
	       this.loadContent(resultJson);
	    },
	    reloadContent :function(paramJson){
	    	this.options.paramJson=$.extend({}, this.options.paramJson, paramJson);
	    	this.loadContent(this.options.paramJson);
	    	
	    },
	    sortTable:function(){
	    	var sortStr = this.options.paramJson.aaSorting;
	    	var aoColumnDefs =this.options.paramJson.aoColumnDefs;
	    	if(!sortStr){
	    		sortStr=[[0, "asc"]];
	    	}
	    	if(!aoColumnDefs){
	    		aoColumnDefs=[];
	    	}
	    	if(this.EL.find("table").length>0&&Number(this.EL.find(".paginator").attr("p_currentpagenum"))>0){
	    		this.EL.find("table").dataTable({
		    	    "sDom": "t",
		    	    "paging":false,
		    	    "aoColumnDefs": aoColumnDefs,
		    	    "aaSorting": sortStr
		    	});
	    		if(this.options.sortCallback&&typeof this.options.sortCallback=='function'){
	    			this.options.sortCallback();
	    		}
	    		//"aoColumnDefs": [ { "bSortable": false, "aTargets": [0,4] }],
    		    //"aaSorting": [[1, "desc"]]
	    	}
	    	
	    }

	};
	Pagination.defaults={
		pageNum:1,
		pageSize:10
	},
	$.fn.pagination = function(option) {
		if (this.length == 0) {
			throw new Error("Pagination template element is not exist.");
		}
		var paginationObj = PAGINATION_INSTANCES[this.selector], options = $.extend({},option);
		if (paginationObj) {
			paginationObj.reloadContent(option.paramJson); 	
		} else if (typeof option == 'object') {
			PAGINATION_INSTANCES[this.selector] = (paginationObj = new Pagination(
					this, options));
		}

	}

})(jQuery);