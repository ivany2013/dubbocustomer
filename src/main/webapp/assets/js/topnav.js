!function() {
	navconfig = window.navconfig || {};
	var defaultnav = [
		{
	        name: "工作台",
            href:"",
	        icon: "fa fa-desktop"
		}
		,{
            name: "资讯",
            href:"",
            icon: "fa fa-globe",
            dropdown: true,
            data:[
                {
                    gray:true,
                    name:"短信管理",
                    icon:"D",
                    href:""
                }
                ,{
                    gray: true,
                    name:"行情管理",
                    icon:"H",
                    href:""
                }
                ,{
                    name:"黑色产业链调研",
                    icon:"H",
                    href:"http://mgr.mysteelcms.com/black-mgt/myWorkbench/gotoWorkTask"
                }
                ,{
                    gray: true,
                    name:"库存管理",
                    icon:"K",
                    href:""
                }
                ,{
                    name:"文章采集管理",
                    icon:"W",
                    href:"http://mgt.mysteelcms.com/wzcjgl/"
                }
                ,{
                    gray: true,
                    name:"文章管理",
                    icon:"W",
                    href:""
                }
                ,{
                    gray: true,
                    name:"专题管理",
                    icon:"Z",
                    href:""
                }
                ,{
                    gray: true,
                    name:"指数管理",
                    icon:"Z",
                    href:""
                }
            ]
		}
        ,{
            name: "业务",
            href:"",
            icon: "fa fa-list-alt",
            dropdown: true,
            data:[
                {
                    gray:true,
                    name:"合同管理",
                    icon:"H",
                    href:""
                }
                ,{
                    name:"VIP信息服务",
                    icon:"V",
                    href:"http://mgt-gt.mysteelcms.com/tksweixin/norights.ms?type=3"
                }
                ,{
                    gray: true,
                    name:"用户管理",
                    icon:"Y",
                    href:""
                }
            ]
        }
        ,{
            name: "运营",
            href:"",
            icon: "fa fa-envelope",
            dropdown: true,
            data:[
                {
                    gray:true,
                    name:"广告管理",
                    icon:"G",
                    href:""
                }
                ,{
                    name:"钢银可视化项目",
                    icon:"G",
                    href:"http://mgt-gt.mysteelcms.com/trade/fail"
                }
                ,{
                    name:"工作管理",
                    icon:"G",
                    href:"http://mgt-yy.mysteelcms.com/dailywork/dailywork-list.ms?original=original"
                }
                ,{
                    gray: true,
                    name:"黑名单管理",
                    icon:"H",
                    href:""
                }
                ,{
                    name:"流量统计-百度",
                    icon:"L",
                    href:"http://mgt-gt.mysteelcms.com/visit/daily-analyse-report/daily-report"
                }
                ,{
                    name:"流量统计-手机版",
                    icon:"L",
                    href:"http://mgt-yy.mysteelcms.com/mobile/overview-data"
                }
                ,{
                    name:"流量统计-网站",
                    icon:"L",
                    href:"http://mgt-gt.mysteelcms.com/cmsweb/desktop.ms"
                }
                ,{
                    name:"收入统计报表",
                    icon:"S",
                    href:"http://mgr.mysteelcms.com/income/ "
                }
                ,{
                    gray: true,
                    name:"投票管理",
                    icon:"T",
                    href:""
                }
                ,{
                    name:"意见反馈",
                    icon:"Y",
                    href:"http://mgt.mysteelcms.com/yjfk/"
                }
            ]
        }
        ,{
            name: "产品",
            href:"",
            icon: "fa fa-sitemap",
            dropdown: true,
            data:[
                {
                    name:"钢联数据",
                    icon:"G",
                    href:"http://dc.mgt.mysteel.com/"
                }
                ,{
                    name:"会展系统",
                    icon:"H",
                    href:"http://mgt-hz.mysteelcms.com/index.htm"
                }
                ,{
                    gray: true,
                    name:"手机版",
                    icon:"S",
                    href:""
                }
                ,{
                    name:"搜搜钢",
                    icon:"S",
                    href:"http://mgt-soso.mysteelcms.com/index.htm"
                }
                ,{
                    name:"英文站",
                    icon:"Y",
                    href:"http://www.mysteel.net/manager/"
                }
            ]
        }
        ,{
            name: "财务",
            href:"",
            icon: "fa fa-money",
            dropdown: true,
            gray: true,
            data:[
                {
                    gray:true,
                    name:"收入",
                    icon:"S",
                    href:""
                }
                ,{
                    gray: true,
                    name:"预算",
                    icon:"Y",
                    href:""
                }
                ,{
                    gray: true,
                    name:"支出",
                    icon:"Z",
                    href:""
                }
            ]
        }
        ,{
            name: "人事",
            href:"",
            icon: "fa fa-group",
            dropdown: true,
            gray: true,
            data:[
                {
                    gray:true,
                    name:"考勤管理",
                    icon:"K",
                    href:""
                }
                ,{
                    gray: true,
                    name:"培训分享",
                    icon:"P",
                    href:""
                }
                ,{
                    gray: true,
                    name:"组织结构",
                    icon:"Z",
                    href:""
                }
            ]
        }
        ,{
            name: "行政",
            href:"",
            icon: "fa fa-suitcase",
            dropdown: true,
            gray: true,
            data:[
                {
                    gray:true,
                    name:"固定资产管理",
                    icon:"G",
                    href:""
                }
            ]
        }
        ,{
            name: "系统",
            href:"",
            icon: "fa fa-wrench",
            dropdown: false,
            gray: true
        }
	];
    var resault = [];
    $.each( defaultnav, function(i, n){
        var _thishtml = '<li>',subitem = '',gray='',href='',dropdown='',dropdownicon='';
        if(defaultnav[i].gray){gray='gray'}
        if(defaultnav[i].href=='' || defaultnav[i].href=='#'){href='javascript:void(0);'}
        else{href=defaultnav[i].href}
        if(defaultnav[i].dropdown){
            dropdown = 'data-toggle="dropdown"';
            dropdownicon = '<i class="dropdownicon fa fa-angle-down"></i>';
            subitem += '<ul class="dropdown-menu dropdown-danger themeprimary dropdown-arrow">';
            $.each( defaultnav[i].data, function(j, m){
                var thisgray = '',thishref='';
                if(defaultnav[i].data[j].gray){thisgray='gray'}
                if(defaultnav[i].data[j].href=="" || defaultnav[i].data[j].href=='#'){thishref='javascript:void(0);'}
                else{thishref=defaultnav[i].data[j].href}
                subitem += '<li><a class="'+thisgray+'" href="'+thishref+'"><i class="newicon">'+defaultnav[i].data[j].icon+'</i>'+defaultnav[i].data[j].name+'</a></li>';
            });
            subitem += '</ul>';
        }
        _thishtml += '<a class="dropdown-toggle" '+dropdown+' title="'+defaultnav[i].name+'" href="'+href+'"><i data-original-title="'+defaultnav[i].name+'" class="icon '+defaultnav[i].icon+' '+gray+'"></i><span class="text '+gray+'">'+defaultnav[i].name+'</span>'+dropdownicon+'</a>';
        _thishtml += subitem;
        _thishtml += '</li>';
        resault.push(_thishtml);
    });
    resault = resault.join("");
    $("#topnav").html(resault);
}();
