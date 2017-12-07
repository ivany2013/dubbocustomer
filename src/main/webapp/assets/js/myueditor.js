
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
    //'insertframe',
    //'testwin',
    //'images',
    //'attachment',
    'insertimage',
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
window.UEDITOR_HOME_URL = '/';
window.UEDITOR_CONFIG.autoHeightEnabled=false;
window.UEDITOR_CONFIG.spellcheckStatus = "0";
window.UEDITOR_CONFIG.pasteplain = true;
window.UEDITOR_CONFIG.initialFrameHeight = 400;
window.UEDITOR_CONFIG.serverUrl = '/article/file/upload';



//var ue = UE.getEditor('editor',{serverUrl:'/article/file/upload'});
var ueContent;
var option={serverUrl:'/article/file/upload'};
var ue = new baidu.editor.ui.Editor(option);
ue.render('editor');
ue.ready(function() {
	if(ueContent){
		ue.setContent(ueContent);  //赋值给UEditor
	}
});
	

/*ue.addListener('selectionchange',function(){
    if(ue.selection.getStart().tagName.toUpperCase() === 'IMG'){
        console.log(ue.selection.getStart());
        //ue.fireEvent("catchRemoteImage");
 ue.execCommand( 'insertimage', {
     src:'/manage/ueditor/net/upload/image/20170321/6362571958898226638236006.jpg',
     width:'100',
     height:'100'
 } );
        
    }
})*/
function getContent() {

    var arr = [];
    var uehtml = ue.getContent();
    arr.push(uehtml);
    alert(arr.join("\n"));
    console.log(uehtml);
}