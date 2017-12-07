/**
 * Date: 14-04-08
 * Time: 下午16:34
 * 上传图片对话框逻辑代码,包括tab: 远程图片/上传图片/在线图片/搜索图片
 */

(function () {

    var remoteImage;

    window.onload = function () {
        //initTabs();
        remoteImage = new RemoteImage();
        //initAlign();
        initButtons();
    };


    /* 初始化onok事件 */
    function initButtons() {

        dialog.onok = function () {
            var list = remoteImage.getInsertList(),remote = true;
            console.log(remoteImage.dom,list);
            var nopic="http://a.mysteelcdn.com/images/noimg.png";
            if(list[0].src==nopic){
            	return false;	
            }
           // if(!window.imgupload) {
                //editor.execCommand('insertimage', list);
                //remote && editor.fireEvent("catchRemoteImage");
            var imgstr="<img src='"+list[0].src+"'  class='myimg' title='"+list[0].title+"' url='"+list[0].url+"' source='"+list[0].source+"'/>" ;
                UE.getEditor('editor').focus();
               UE.getEditor('editor').execCommand('inserthtml',imgstr);
            //}else{
            //    alert(0)
            //}
        };
    }

    /* 初始化对其方式的点击事件 */
    function initAlign(){
        /* 点击align图标 */
        domUtils.on($G("alignIcon"), 'click', function(e){
            var target = e.target || e.srcElement;
            if(target.className && target.className.indexOf('-align') != -1) {
                setAlign(target.getAttribute('data-align'));
            }
        });
    }

    /* 设置对齐方式 */
    function setAlign(align){
        align = align || 'none';
        var aligns = $G("alignIcon").children;
        for(i = 0; i < aligns.length; i++){
            if(aligns[i].getAttribute('data-align') == align) {
                domUtils.addClass(aligns[i], 'focus');
                $G("align").value = aligns[i].getAttribute('data-align');
            } else {
                domUtils.removeClasses(aligns[i], 'focus');
            }
        }
    }
    /* 获取对齐方式 */
    function getAlign(){
        var align = $G("align").value || 'none';
        return align == 'none' ? '':align;
    }


    /* 在线图片 */
    function RemoteImage(target) {
    	console.log("RemoteImage:"+target);
    	console.log(target);
        this.container = utils.isString(target) ? document.getElementById(target) : target;
        this.init();
    }
    RemoteImage.prototype = {
        init: function () {
            this.initContainer();
            this.initEvents();
        },
        initContainer: function () {

            var img = editor.selection.getRange().getClosedNode();
            
            this.dom = {
                'url': $G('url'),
                'width': $G('width'),
                'height': $G('height'),
                //'border': $G('border'),
                //'vhSpace': $G('vhSpace'),
                //'title': $G('title'),
                //'source': $G('source'),
                //'src': $G('photoCover')
                'src': $('#show_img').attr("src"),
                'title':$("#title").val(),
                'source':$("#source").val(),
                'url':$("#url").val()
            };
            if (img) {
                this.setImage(img);
            }
        },
        initEvents: function () {
            var _this = this,
                locker = $G('lock');

            /* 改变url */
            domUtils.on($G("url"), 'keyup', updatePreview);
            //domUtils.on($G("border"), 'keyup', updatePreview);
            domUtils.on($G("title"), 'keyup', updatePreview);
            domUtils.on($G("source"), 'keyup', updatePreview);
            domUtils.on($G("photoCover"), 'change', function(){
                updatePreview();
            });
            domUtils.on($G("width"), 'keyup', function(){
                updatePreview();
                if(locker.checked) {
                    var proportion =locker.getAttribute('data-proportion');
                    $G('height').value = Math.round(this.value / proportion);
                } else {
                    _this.updateLocker();
                }
            });
            domUtils.on($G("height"), 'keyup', function(){
                updatePreview();
                if(locker.checked) {
                    var proportion =locker.getAttribute('data-proportion');
                    $G('width').value = Math.round(this.value * proportion);
                } else {
                    _this.updateLocker();
                }
            });
            domUtils.on($G("lock"), 'change', function(){
                var proportion = parseInt($G("width").value) /parseInt($G("height").value);
                locker.setAttribute('data-proportion', proportion);
            });

            function updatePreview(){
                var img = editor.selection.getRange().getClosedNode();
                _this.setPreview(img);
            }
        },
        updateLocker: function(){
            var width = $G('width').value,
                height = $G('height').value,
                locker = $G('lock');
            if(width && height && width == parseInt(width) && height == parseInt(height)) {
                locker.disabled = false;
                locker.title = '';
                locker.source = '';
            } else {
                locker.checked = false;
                locker.disabled = 'disabled';
                locker.title = lang.remoteLockError;
                locker.source = lang.remoteLockError;
            }
        },
        setImage: function(img){
            /* 不是正常的图片 */
            if (!img.tagName || img.tagName.toLowerCase() != 'img' && !img.getAttribute("src") || !img.src) return;

            var wordImgFlag = img.getAttribute("word_img"),
                src = wordImgFlag ? wordImgFlag.replace("&amp;", "&") : (img.getAttribute('_src') || img.getAttribute("src", 2).replace("&amp;", "&"));

            /* 防止onchange事件循环调用 */
            //if (src !== $G("url").value) $G("url").value = src;
            if(src) {
                /* 设置表单内容 */
                $G("width").value = img.width || '';
                $G("height").value = img.height || '';
                //$G("border").value = img.getAttribute("border") || '0';
                //$G("vhSpace").value = img.getAttribute("vspace") || '0';
                //$G("title").value = img.title || img.alt || '';
                //$G("source").value = img.getAttribute("source") || '';
                //$G("photoCover").value = img.getAttribute("src") || '';
                //setAlign(align);
                
//                $G("src").value=$("#show_img").attr("src")||'';
                var picAttr=UE.dom.domUtils.getNextDomNode(editor.selection.getRange().getClosedNode());
                $G("url").value=img.getAttribute("url")||'';
                $G("title").value=img.getAttribute("title")||'';
                $G("source").value=img.getAttribute("source")||'';
                $("#show_img").attr("src",$(img).attr("src"));
                this.setPreview(img);
                this.updateLocker();
            }
        },
        getData: function(){
            var data = {};
            for(var k in this.dom){
                data[k] = this.dom[k].value;
            }
            data.src=$("#show_img").attr("src");
            data.url=$("#url").val();
            data.title=$("#title").val();
            data.source=$("#source").val();
            return data;
        },
        setPreview: function(img){
            var //url = $G('url').value,
                ow = parseInt($G('width').value, 10) || 0,
                oh = parseInt($G('height').value, 10) || 0;
                //border = parseInt($G('border').value, 10) || 0,
                //预览的时候，改成上传后图片地址
                preview = $G('preview'),
                width,
                height;
            //如果是修改
            if(img){
            	 var src = $("#show_img").attr("src")|| '',
                 url=img.url||'',
                 source=img.source||'',
                 title=img.title||'';
            }else{
            	//否则是新增操作
            	var src = $("#show_img").attr("src")|| '',
                url=$G('url').value,
                title = $G('title').value,
                source = $G('source').value;
            }    	
            if(src.trim()==""){
            	src="http://a.mysteelcdn.com/images/noimg.png";
            }
            //url = utils.unhtmlForUrl(url);
            //title = utils.unhtml(title);
            //source = utils.unhtml(source);
            //src = utils.unhtml(src);

            width = preview.offsetWidth;
            height = (!ow || !oh) ? '':width*oh/ow;

            if(url) {
                //preview.innerHTML = '<a  href="' + url + '" target="_blank" title="' + title + '"><img class="img noimg" id="show_img" src="' + src + '" width="184" border="0" title="' + title + '" source="' + source + '" url="' + url + ' /></a>';
                preview.innerHTML ="<img class='img noimg' id='show_img' src='" + src + "' border='0' width='184' title='" + title + "' source='" + source + "' url='" + url + "' />";

            }else {
                //preview.innerHTML = '<img class="img noimg" id="show_img" src="' + src + '" width="184" border="0" title="' + title + '" source="' + source + '"url="' + url + ' />';
            	preview.innerHTML ="<img class='img noimg' id='show_img' src='" + src + "' border='0' width='184' title='" + title + "' source='" + source + "' url='" + url + "' />";
            }
        },
        getInsertList: function () {
            var data = this.getData();
        	var img = editor.selection.getRange().getClosedNode();
            if(data['src']) {
                return [{
                    src: data['src'] || "",
                    url: data['url'] || '',
                    width: data['width'] || '',
                    height: data['height'] || '',
                    //border: data['border'] || '',
                    //floatStyle: data['align'] || '',
                    //vspace: data['vhSpace'] || '',
                    title: data['title'] || '',
                    source: data['source'] || '',
                    alt: data['title'] || '',
                    style: "width:" + data['width'] + "px;height:" + data['height'] + "px;"
                }];
            } else {
                return [];
            }
        }
    };

})();
