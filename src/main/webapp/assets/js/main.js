var mainModule = function () {
	Date.prototype.dateformat = function (format) {
	    var o = {
	        "M+": this.getMonth() + 1,
	        "d+": this.getDate(),
	        "h+": this.getHours(),
	        "m+": this.getMinutes(),
	        "s+": this.getSeconds(),
	        "q+": Math.floor((this.getMonth() + 3) / 3),
	        "S": this.getMilliseconds()
	    };
	    if (/(y+)/.test(format)) {
	        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    };
	    for (var k in o) {
	        if (new RegExp("(" + k + ")").test(format)) {
	            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	        }
	    };
	    return format;
	};
}
mainModule.prototype = {
	init: function () {
		this.showtab();
		this.autowindow();
		//this.frameclick();
	},
	frameclick:function(){
		$(function() {
			var _parent = $(window.top.document);
			if($("#main_frame",_parent).length>0){
		        $(document).on('click', function(event) {
		            $("#main_frame",_parent).trigger("click")
		        });
	    	}
		});
	},
	changemain:function(dom){
		var _dom = dom || window.event.target;
		var thishref = _dom.href;
		if(thishref == ("javascript:void(0);" || "" || "#")){
			thishref = _dom.getAttribute("datahref");
		}else if(typeof thishref === "undefined" && _dom.parentNode.tagName.toUpperCase() === 'A') {
			thishref = _dom.parentNode.href || _dom.parentNode.getAttribute("datahref");
		}else if(typeof thishref === "undefined" && _dom.parentNode.parentNode.tagName.toUpperCase() === 'A') {
			thishref = _dom.parentNode.parentNode.href || _dom.parentNode.parentNode.getAttribute("datahref");
		}else {
			thishref = _dom.href
		}
		var mainFrame = document.getElementById("main_frame") || top.document.getElementById("main_frame");
		if(thishref && mainFrame){
			//var lastlive = $(top.document.getElementById("breadcrumb"));
			//lastlive.find(".lastlive").remove();
			//lastlive.append('<li class="lastlive">'+$(_dom).text()+'</li>')
			//top.document.getElementById("breadcrumb").appendChild('<li>'+_dom.innerHTML+'</li>')
			mainFrame.src = thishref;
			return false;
		}
	},
	getQueryString:function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},
	showtab:function(){
		var _this = this;
		var localhash = _this.getQueryString("site");
		if(localhash){
			$(".nav-tabs li").removeClass('active');
			$(".tab-content .tab-pane").removeClass('active');
			var nav_tabs = $(".nav-tabs li a[href='#"+localhash+"']").parent();
			var nav_cont = $(".tab-content .tab-pane[id='"+localhash+"']");
			nav_tabs.addClass('active');
			nav_cont.addClass("active");
		}
	},
	changeLevel:function(){
		$(top.document).find(".lastlive").remove();
	},
	autowindow:function(){
	    var _parent = $(window.parent.document);
		if(_parent.length>0 && $(".chanel_frame",_parent).length>0 && $(".ztree",_parent).length>0){
		    var _index = $("#myTab9 li",_parent).index($("#myTab9 .active",_parent));
		    var mainFrame = $(".chanel_frame",_parent).eq(_index);
		    var ztree = $(".ztree",_parent).eq(_index);
		    var _height = $("body").height();
		    var tb = 0;
		    if(ztree.prevAll(".topsearch").length > 1){tb = 34;}
		    mainFrame.height(_height+34);
		    ztree.height(_height-tb);
		    $(function() {
			    $(window).resize(function(){
			        var _height = $("body").height();
			        var _index = $("#myTab9 li",_parent).index($("#myTab9 .active",_parent));
			        var mainFrame = $(".chanel_frame",_parent).eq(_index);
			        var ztree = $(".ztree",_parent).eq(_index);
			        _parent.find(".chanel_frame").height(_height+34);
			        _parent.find(".ztree").height(_height-tb);
			    });
		    });
		}
	}
}
var mainjs = new mainModule();
mainjs.init();