
window.UEDITOR_CONFIG.toolbars[0]=[
    //'h1',
    'bold',
    'forecolor',
    //'backcolor',
    //'blockquote',
    //'horizontal',
    '|',
    'link',
    'inserttable',
    'insertimage',
    //'testwin',
    //'insertframe',
    //'images',
    //'attachment',
    '|',
    //'removeformat',
    'undo',
    'redo',
    'myautosave',
    'fullscreen' 
];
// 为触摸设备打开无限高
if(/\b(Android|Mobile)\b/.test(navigator.userAgent)){
    window.UEDITOR_CONFIG.autoHeightEnabled=true;
}

window.UEDITOR_CONFIG.spellcheckStatus = "0";
window.UEDITOR_CONFIG.autoHeightEnabled=false;
window.UEDITOR_CONFIG.spellcheckStatus = "0";
window.UEDITOR_CONFIG.pasteplain = true;
window.UEDITOR_CONFIG.initialFrameHeight = 400;
window.UEDITOR_CONFIG.serverUrl = '/manage/ueditor/net/controller.ashx';

var ue = UE.getEditor('editor');
function getContent() {
    var arr = [];
    // arr.push("使用editor.getContent()方法可以获得编辑器的内容");
    // arr.push("内容为：");
    var uehtml = ue.getContent();
    arr.push(uehtml);
    alert(arr.join("\n"));
    console.log(uehtml);
    //var htmlroot = UE.htmlparser(uehtml, true);
    //var htmlroot = ue.execCommand('removeformat', 'td','*','*');
    //ue.queryCommandState( 'insertunorderedlist' );
/*    var resaultData = '[';
    for(var i=0;i<htmlroot.length;i++){
        resaultData += '{"times":"'+thisData[i]+'"'+',"data":['
        var _Data = [];
        for(var j=0;j<data.data.length;j++){
            if(data.data[j].time == thisData[i]){
                var strarry = '{"content":"'+data.data[j].content+'","time":"'+data.data[j].time+'", "time1":"'+data.data[j].time1+'","type":"1","id":"'+data.data[j].id+'","title":"'+data.data[j].title+'"}'
                _Data.push(strarry);
            }
        }
        resaultData += _Data.join(",");
        if(i === thisData.length-1){resaultData += ']}'}
        else{resaultData += ']},'}
    }
    resaultData += ']';
    resaultData = jQuery.parseJSON(resaultData);*/

/*article_bt
article_title
article_style
一稿多投:article_ygdt
关联品种:article_glpz
关联城市:article_glcs
关联钢厂:article_glgc
关联港口:article_glgk
是否置顶:article_sfzd
推荐程度:article_tjcd
标签:article_bq
显示时间:article_sssj
信息来源:article_xxly
文章作者:article_wzzz
关键字:article_kw
版权说明:article_bqsm
免责说明:article_mzsm
责任编辑:article_zrbj
资讯监督:article_zxjd
是否选择大模板:article_moban
副标题:article_fbt
短标题:article_dbt
标题图片:article_bttp
文章摘要:article_wzzy
编者按:article_bza
外部链接地址:article_wblj
显示产品终端:article_xscpzd
上传附件:photoCover
var article_bt = $("#article_bt").val()
,article_title = $("#article_title").val()
,article_style = $("#article_style").val()
,article_ygdt = $("#article_ygdt").val()
,article_glpz = $("#article_glpz").val()
,article_glcs = $("#article_glcs").val()
,article_glgc = $("#article_glgc").val()
,article_glgk = $("#article_glgk").val()
,article_sfzd = $("#article_sfzd").val()
,article_tjcd = $("#article_tjcd").val()
,article_bq = $("#article_bq").val()
,article_sssj = $("#article_sssj").val()
,article_xxly = $("#article_xxly").val()
,article_wzzz = $("#article_wzzz").val()
,article_kw = $("#article_kw").val()
,article_bqsm = $("#article_bqsm").val()
,article_mzsm = $("#article_mzsm").val()
,article_zrbj = $("#article_zrbj").val()
,article_zxjd = $("#article_zxjd").val()
,article_moban = $("#article_moban").val()
,article_fbt = $("#article_fbt").val()
,article_dbt = $("#article_dbt").val()
,article_bttp = $("#article_bttp").val()
,article_wzzy = $("#article_wzzy").val()
,article_bza = $("#article_bza").val()
,article_wblj = $("#article_wblj").val()
,article_xscpzd = $("#article_xscpzd").val()
,photoCover = $("#photoCover").val();
var articleData = {'article_bt':article_bt,'article_title':article_title,}
    console.log(htmlroot);
    // var obj = jQuery.parseJSON(htmlroot);
    // alert(htmlroot);*/
}
