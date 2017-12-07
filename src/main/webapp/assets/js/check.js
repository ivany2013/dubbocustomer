String.prototype.IsPicture = function()
    {
        //判断是否是图片 - strFilter必须是小写列举
        var strFilter=".jpeg|.gif|.jpg|.png|.pic|"
        if(this.indexOf(".")>-1)
        {
            var p = this.lastIndexOf(".");
            //alert(p);
            //alert(this.length);
            var strPostfix=this.substring(p,this.length) + '|';        
            strPostfix = strPostfix.toLowerCase();
            //alert(strPostfix);
            if(strFilter.indexOf(strPostfix)>-1)
            {
                //alert("True");
                return true;
            }
        }        
        //alert('False');
        return false;            
    }