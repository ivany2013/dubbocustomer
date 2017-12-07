/**
 * Created by kobe on 2015-1-4.
 */


/**
 * args is a string or object
 * if string, it is the message content
 * if object, {
 *   content: // msg content
 *   time: // display time
 *   type: // msg, err default is msg
 * }
 */


var msg = function(args) {
    var msgContent = "";
    var displayTime = 2000;
    var type = "msg";
    var top = 0;
    if (typeof (args) == 'string') {
        msgContent = args;
    } else if (typeof (args) == 'object') {
        msgContent = args.content;
        displayTime = args.time || 2000;
        type = args.type || "msg";
    }else if(typeof (args) == 'number'){
    	msgContent = args;
    }
    var msgObj = $(".dctUtilMsg");
    if($(".dctUtilErr").size()!=0){
        $(".dctUtilErr").remove();
    }
    if (msgObj.size() == 0) {
        $(document.body).append("<div class='dctUtilMsg'></div>");
        msgObj = $(".dctUtilMsg");
    }
    msgObj.html(msgContent);
    //msgObj.css("top", 0 + "px");
    msgObj.css("top", "45%");
    msgObj.css("margin-left", (- msgObj.width()/2) + "px");
    msgObj.show();
    setTimeout(function() {
        msgObj.fadeOut(400);
    }, displayTime);
};
var err = function(args) {
    var msgContent = "";
    var displayTime = 3000;
    var type = "msg";
    var top = 0;
    if (typeof (args) == 'string') {
        msgContent = args;
    } else if (typeof (args) == 'object') {
        msgContent = args.content;
        displayTime = args.time || 1000;
        type = args.type || "msg";
    }else if(typeof (args) == 'number'){
    	msgContent = args;
    }
    var msgObj = $(".dctUtilErr");
    if($(".dctUtilMsg").size()!=0){
        $(".dctUtilMsg").remove();
    }
    if (msgObj.size() == 0) {
        $(document.body).append("<div class='dctUtilErr'></div>");
        msgObj = $(".dctUtilErr");
    }
    msgObj.html(msgContent);
    //msgObj.css("top", 0 + "px");
    msgObj.css("top", "45%");
    msgObj.css("margin-left", (- msgObj.width()/2) + "px");
    msgObj.show();
    setTimeout(function() {
        msgObj.fadeOut(400);
    }, displayTime);
};

$.extend({
	msg:msg,
	err:err
	});
