!function() {
    var e = UE.dom.domUtils, t = (baidu.editor.ui.uiUtils, UE.utils);
    e.getTextContent = function(e) {
        return "undefined" != typeof e.textContent ? e.textContent :e.innerText;
    }, e.getPreviousNode = function(e, t) {
        for (var r, n = function(e) {
            ("function" != typeof t || t(e)) && (r = e);
        }; ;) {
            if ("function" == typeof t && !t(e)) break;
            if (e.previousSibling) {
                n(e.previousSibling);
                break;
            }
            if (!e.parentNode) break;
            if (e.parentNode.previousSibling) {
                n(e.parentNode.previousSibling);
                break;
            }
            e = e.parentNode;
        }
        return r;
    }, e.deepTraversal = function(e, t, r, n, o) {
        if (e === t) return void (e && n(e));
        var i, l, a, p, u, s = [], d = [], c = function(e) {
            return e && -1 === d.indexOf(e) && ("function" != typeof r || r(e)) ? (d.push(e), 
            e && s.push(e), t === e ? !0 :void 0) :void 0;
        };
        for (c(e); s.length; ) {
            if (i = s.pop(), p = i.nextSibling, u = i.parentNode, "function" == typeof o && o(i)) return;
            if (i.childNodes.length) for (l = 0, a = i.childNodes.length; a > l && !c(i.childNodes[l]); l++) ;
            p ? c(p) :u && c(u);
        }
        for (l = 0, a = d.length; a > l; l++) n(d[l]);
    }, e.splitNode = function(t, r) {
        for (var n, o, i, l = e.getNodeIndex(t), a = t; a.parentNode && a !== r; ) {
            for (o = a.parentNode, i = n, n = o.cloneNode(), i && 0 !== i.childNodes.length && n.appendChild(i); o.childNodes[l + 1]; ) n.appendChild(o.childNodes[l + 1]);
            e.isEmptyContentNode(o) && e.remove(o), a = a.parentNode, l = e.getNodeIndex(a);
        }
        n && 0 !== n.childNodes.length && e.insertAfter(r, n), e.insertAfter(r, t);
    }, e.renameNode = function(e, t) {
        var r = document.createElement(t);
        for (var n in e.attributes) e.attributes.hasOwnproperty && r.setAttribute(n, e.attributes[n]);
        for (;e.firstChild; ) r.appendChild(e.firstChild);
        return r;
    }, e.isZeroWidthSpace = function(e) {
        return 1 === e.length && 8203 === e.charCodeAt(0);
    }, e.isEmptyContentNode = function(t) {
        var r = e.getTextContent(t);
        return "undefined" == typeof r || null === r ? !0 :(r = r.trim(), 0 === r.length || e.isZeroWidthSpace(r));
    }, e.isEmptyUNode = function(t) {
        var r = [ "iframe", "img", "hr" ].some(function(e) {
            return 0 !== t.getNodesByTagName(e).length;
        });
        if (!r) {
            var n = t.innerText();
            r = 0 !== n.length && !e.isZeroWidthSpace(n);
        }
        return !r;
    }, e.isFirstChild = function(e, t) {
        for (;e.firstChild; ) {
            if (e.firstChild === t) return !0;
            e = e.firstChild;
        }
        return !1;
    }, e.getElementsByClassName = function(e, t) {
        var r;
        return e.querySelectorAll ? r = e.querySelectorAll("." + t) :e.getElementsByClassName && (r = e.getElementsByClassName(t)), 
        r && (r = Array.prototype.slice.call(r)), r;
    }, UE.uNode.prototype.hasClass = function(e) {
        var t = this.getAttr("class"), r = new RegExp("(^|\\s+)" + e + "(\\s+|$)");
        return r.test(t);
    }, t.htmlEncode = function(e) {
        var t = "";
        return 0 == e.length ? "" :(t = e.replace(/&/g, "&gt;"), t = t.replace(/</g, "&lt;"), 
        t = t.replace(/>/g, "&gt;"), t = t.replace(/ /g, "&nbsp;"), t = t.replace(/\'/g, "&#39;"), 
        t = t.replace(/\"/g, "&quot;"), t = t.replace(/\n/g, "<br>"));
    }, t.htmlDecode = function(e) {
        var t = "";
        return 0 == e.length ? "" :(t = e.replace(/&gt;/g, "&"), t = t.replace(/&lt;/g, "<"), 
        t = t.replace(/&gt;/g, ">"), t = t.replace(/&nbsp;/g, " "), t = t.replace(/&#39;/g, "'"), 
        t = t.replace(/&quot;/g, '"'), t = t.replace(/&amp;/g, "&"), t = t.replace(/<br>/g, "\n"));
    }, String.prototype.trim || (String.prototype.trim = function() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    }), Array.prototype.some || (Array.prototype.some = function(e) {
        "use strict";
        if (null == this) throw new TypeError("Array.prototype.some called on null or undefined");
        if ("function" != typeof e) throw new TypeError();
        for (var t = Object(this), r = t.length >>> 0, n = arguments.length >= 2 ? arguments[1] :void 0, o = 0; r > o; o++) if (o in t && e.call(n, t[o], o, t)) return !0;
        return !1;
    });
}();

!function() {
    var t = UE.ui, i = (t.uiUtils, UE.dom.domUtils, UE.utils), n = t.Button, o = t.SplitButton, p = t.Popup, s = t.PopupMenu = function(t, i) {
        this.opts = i || {}, this.editor = t, this.init();
    };
    s.prototype = {
        mainCls:"edui-popupmenu",
        init:function() {
            var t = this.opts;
            t.showOn = t.showOn || "click", this.initPopup(), n.call(this, t);
        },
        showPopup:o.prototype.showPopup,
        hidePopup:function() {
            this.popup.hide();
        },
        getContent:function(n, o) {
            var p = this, s = this.editor, e = [];
            return i.each(n, function(i) {
                "string" == typeof i && (i = new t[i](s, p)), e.push('<div class="' + o + '-item">' + i.renderHtml() + "</div>");
            }), e.join("");
        },
        initPopup:function() {
            var t = this.opts, n = {};
            i.extend(n, t.popupOpts);
            var o = n.mainCls || this.mainCls, s = this.getContent(t.items, o);
            i.extend(n, {
                editor:this.editor,
                content:s,
                className:(n.independentCls ? "" :o + "-popup " + o + "-" + this.opts.name + "-content ") + (n.className || "")
            }), this.popup = new p(n), this.popup.render();
        },
        _onClick:function() {
            this.showPopup();
        }
    }, UE.utils.inherits(s, n);
    var e = t.DropdownMenu = function() {
        s.apply(this, arguments);
    };
    e.prototype = {
        mainCls:"edui-dropdown"
    }, UE.utils.inherits(e, s);
}();

!function() {
    function e(e) {
        var n = [ "IFRAME" ];
        return -1 !== n.indexOf(e.tagName) ? !0 :t.isBlockElm(e);
    }
    var t = UE.dom.domUtils, n = baidu.editor.ui.uiUtils, r = UE.utils, a = {
        iframe:{
            selectBeforeCheck:function(e) {
                return 1 !== e.parentNode.children.length ? e.parentNode :e.parentNode;
            }
        },
        p:{
            checker:function(e, t) {
                var n = a["*"].checker(e, t);
                return n && "P" === n.tagName ? n :null;
            }
        },
        hr:{
            filter:!0
        },
        ol:{
            checker:function(e, t) {
                var n = a["*"].checker(e, t);
                return n && "BLOCKQUOTE" === n.tagName ? null :n;
            }
        },
        ul:{
            checker:function(e, t) {
                var n = a["*"].checker(e, t);
                return n && "BLOCKQUOTE" === n.tagName ? null :n;
            }
        },
        li:{
            checker:function(e, t) {
                var n = a["*"].checker(e, t);
                return n && -1 !== [ "UL", "OL" ].indexOf(n.tagName) ? null :n;
            }
        },
        "*":{
            filter:function(t) {
                return e(t);
            },
            checker:function(r, a) {
                var o = t.findParent(r, function(t) {
                    return e(t) && n.contains(a.body, t);
                });
                return o;
            },
            handle:function(e, t, n, r, o) {
                var i = a["*"], d = i.cmdTagMap[n[0]];
                "function" == typeof d && (d = d(n[0], n[1]));
                var s;
                return i.notAllowHandleNode.some(function(t) {
                    return "function" == typeof t ? t(e, r) :e.tagName === t.toUpperCase();
                }) ? void 0 :(i.notAllowReplaceNode.some(function(t) {
                    return "function" == typeof t ? t(e, r) :e.tagName === t.toUpperCase();
                }) ? s = "extract" :"*" === d || e.tagName.toLowerCase() === d ? s = "extract" :t.tagName.toLowerCase() === d && (s = "replace"), 
                "function" == typeof i[s] ? i[s](e, t, n, r, o) :void 0);
            },
            extract:function(e, n) {
                function r(e) {
                    for (;"BODY" !== e.parentNode.tagName; ) e = e.parentNode;
                    return e;
                }
                var a = r(n);
                return t.splitNode(e, a), {
                    removedNodeList:[ n ]
                };
            },
            replace:function(e, n, r, a, o) {
                var i = t.renameNode(e, "p");
                e.parentNode.insertBefore(i, e), o(e, i, !0);
            },
            cmdTagMap:{
                blockquote:"blockquote",
                paragraph:function(e, t) {
                    return t[1];
                },
                commodity:"div",
                insertimage:"p",
                horizontal:"hr",
                insertunorderedlist:"li",
                insertorderedlist:"li"
            },
            notAllowReplaceNode:[ "div", "iframe", "ul", "ol", function(e) {
                return 0 !== e.getElementsByTagName("img").length;
            }, function(e) {
                return 0 !== e.getElementsByTagName("iframe").length;
            } ],
            notAllowHandleNode:[ function(e) {
                return t.findParent(e, function(e) {
                    return "false" === e.getAttribute("contenteditable") || /(^|\s+)audio[_a-zA-Z]*(\s+|$)/.test(e.className);
                });
            } ]
        }
    };
    UE.plugins.reformat = function() {
        function e(e, a, o, d, s) {
            function c(e, t) {
                var r = "start" === t ? e.startContainer :e.endContainer, a = "start" === t ? e.startOffset :e.endOffset;
                if (e.startContainer === e.endContainer) {
                    if (r.nodeType === r.TEXT_NODE) return r.parentNode;
                    var o = r.childNodes.length, i = e.endOffset - e.startOffset;
                    if (0 === i) return r;
                    if (0 === e.startOffset && 1 === i) {
                        if (o === i && e.startContainer.childNodes[0].nodeType === e.startContainer.TEXT_NODE) return r;
                        if (2 === o && e.startContainer.lastChild && "<br>" === e.startContainer.lastChild.outerHTML) return r;
                    }
                }
                return n.contains(e.startContainer, e.endContainer) ? "start" === t ? e.startContainer.childNodes[0] :e.endContainer :(r = e.collapsed ? r :r.nodeType === r.TEXT_NODE ? r :0 === r.childNodes.length ? r :r.childNodes[0 === a ? 0 :a - 1], 
                0 !== r.childNodes.length ? "start" === t ? r.firstChild :r.lastChild :r);
            }
            var f = s["*"];
            o = {
                startContainer:o.startContainer,
                endContainer:o.endContainer,
                startOffset:o.startOffset,
                endOffset:o.endOffset,
                collapsed:o.collapsed
            };
            var l = !1, u = !1, h = function(e, n, r) {
                function a(e) {
                    return e.nodeType === e.TEXT_NODE ? e.length :e.childNodes.length;
                }
                if (e === o.startContainer) {
                    l = !0;
                    {
                        o.startContainer;
                    }
                    o.startContainer = n ? n :t.getNextDomNode(e), r || (o.startOffset = 0);
                }
                e === o.endContainer && (l = !0, o.endContainer = n ? n :t.getPreviousNode(o.endContainer, function(e) {
                    return i.body.contains(e) && i.body !== e;
                }), r || (o.endOffset = a(o.endContainer))), t.remove(e);
            };
            r.each(a, function(a) {
                var o = c(a, "start"), i = c(a, "end");
                t.deepTraversal(o, i, function(e) {
                    return n.contains(d.body, e);
                }, function(n) {
                    var a = n.nodeType === n.TEXT_NODE ? "text" :n.tagName.toLowerCase(), o = s[a] || f, i = o.filter || f.filter, c = o.checker || f.checker, l = o.handle || f.handle, p = o.selectBeforeCheck || f.selectBeforeCheck, C = o.selectAfterCheck || f.selectAfterCheck;
                    if (i !== !1 && (i === !0 || (("function" == typeof i || "string" == typeof i) && (i = [ i ]), 
                    i.some(function(e) {
                        return "function" == typeof e ? e(n, d) :n.tagName === e.toUpperCase();
                    })))) {
                        "function" == typeof p && (n = p(n, d));
                        var m = c(n, d);
                        if (m) {
                            "function" == typeof C && (n = C(n, d)), u = !0;
                            var N = l(n, m, e, d, h);
                            N && N.removedNodeList && r.each(N.removedNodeList, function(e) {
                                for (var n; e && "BODY" !== e.tagName && t.isEmptyContentNode(e); ) n = e, e = e.parentNode, 
                                h(n);
                            });
                        }
                    }
                });
            });
            var p = [ function(e) {
                return !e.isContentEditable;
            }, function(e) {
                return 0 !== e.getElementsByTagName("iframe").length;
            } ];
            if (p.some(function(e) {
                return "function" == typeof e ? e(d.body.lastChild) :d.body.lastChild.tagName === e.toUpperCase();
            })) {
                var C = t.createElement(d.document, "p");
                C.innerHTML = "<br>", d.body.appendChild(C);
            }
            u && (d.fireEvent("autoAppendEmptyLine"), d.selection.clearRange(), range = new UE.dom.Range(d.document), 
            range.setStart(o.startContainer, o.startOffset), range.setEnd(o.endContainer, o.endOffset), 
            range.select());
        }
        function o() {
            d = [], s = !1;
        }
        var i = this, d = [], s = !1;
        i.addListener("beforeExecCommand", function() {
            var e = i.selection.getRange().cloneRange();
            d.push(e);
            var n = t.getNextDomNode(e.endContainer);
            n && n && d.push({
                startContainer:n,
                endContainer:n,
                startOffset:0,
                endOffset:n.childNodes.length,
                collapsed:!0
            });
            var r = i.document.body, a = r.childNodes.length;
            1 === a && t.isEmptyContentNode(r) && (s = !0);
        }), i.addListener("afterExecCommand", function() {
            try {
                var r = i.selection.getRange().cloneRange();
                d.push(r);
                var c = t.getPreviousNode(r.startContainer, function(e) {
                    return n.contains(i.body, e);
                });
                if (c && c && d.push({
                    startContainer:c,
                    endContainer:c,
                    startOffset:0,
                    endOffset:c.childNodes.length,
                    collapsed:!0
                }), s) {
                    var f = i.document.body;
                    d.push({
                        startContainer:f.firstChild,
                        endContainer:f.lastChild,
                        startOffset:0,
                        endOffset:f.lastChild.childNodes.length,
                        collapsed:f.firstChild === f.lastChild
                    });
                }
                e([].slice.call(arguments, 1), d, r, i, a);
            } catch (l) {} finally {
                o();
            }
        });
    };
}();

!function() {
    var n = UE.dom.domUtils, e = baidu.editor.ui.uiUtils, t = (UE.utils, {
        "*":{
            inStrictP:!0,
            noIframe:!0
        },
        insertimage:{
            onlyTopLevel:!0,
            onlyInP:!0
        },
        insertimagewithcaption:{
            onlyTopLevel:!0,
            onlyInP:!0
        },
        ic:{
            onlyTopLevel:!0,
            onlyInP:!0
        },
        upload_video:{
            onlyTopLevel:!0,
            onlyInP:!0
        },
        audio:{
            onlyTopLevel:!0,
            onlyInP:!0
        },
        commodity:{
            onlyTopLevel:!0,
            onlyInP:!0
        },
        create_vote:{
            onlyTopLevel:!0,
            onlyInP:!0
        },
        undo:{
            inStrictP:!1
        },
        redo:{
            inStrictP:!1
        },
        inserthtml:{
            inStrictP:!1
        },
        insertcode:{
            onlyTopLevel:!0,
            onlyInP:!0
        }
    }), o = [ "insertcode", "redo", "undo" ];
    UE.plugins.queryCommandStateWrap = function() {
        var i = this, r = i.queryCommandState;
        i.queryCommandState = function(a) {
            function l(n) {
                return 0 === n.className.length;
            }
            function u(n) {
                var e = t[a];
                return e && "undefined" != typeof e[n] ? e[n] :t["*"][n];
            }
            try {
                var c = r.call(this, a);
                if (0 !== c) return c;
                var y = t[a] || t["*"];
                if (!y) return c;
                var d = u("notAllowMultipleRange"), m = u("onlyTopLevel"), f = u("inStrictP"), s = u("onlyInP"), v = u("noIframe"), P = u("check"), p = i.selection.getRange();
                if (d && !p.collapsed) return -1;
                var g = n.findParent(p.startContainer, function(t) {
                    return n.isBlockElm(t) && e.contains(i.body, t);
                }, !0);
                if (m && g && "BODY" !== g.parentNode.tagName) return -1;
                if (v && g && 0 !== g.getElementsByTagName("iframe").length) return -1;
                if (f) {
                    var I = n.findParent(p.startContainer, function(n) {
                        return "P" === n.tagName && e.contains(i.body, n);
                    }, !0);
                    if (I && !l(I) || s && !I) return -1;
                }
                return g && "PRE" === g.tagName && -1 === o.indexOf(a) ? -1 :P ? y(c) :c;
            } catch (T) {}
        };
    };
}();

!function() {
    var t = UE.ui, e = (t.uiUtils, UE.dom.domUtils, UE.utils, t.Button);
    t.autocorrect = function(t) {
        var n = !1, a = new e({
            name:"h1",
            className:"edui-forh1",
            label:"错别字检查",
            showIcon:!1,
            _onClick:function() {
                this.changeStatus(!n);
            },
            changeStatus:function(e) {
                n = e, this.setChecked(n), t.fireEvent("autocorrect-status-change", n);
            },
            setTitle:function(t) {
                var e = this.getDom("body"), n = e.getElementsByClassName("edui-label");
                n && (n = n[0], n.innerHTML = t);
            }
        });
        return t.on("autocorrect-set-status", function(t, e) {
            a.changeStatus(e);
        }), a;
    };
}();

!function() {
    var i = UE.utils, t = baidu.editor.ui.UIBase, a = baidu.editor.ui.myautosave = function(i) {
        this.initOptions(i), this.initSeparator();
    };
    a.prototype = {
        uiName:"myautosave",
        initSeparator:function() {
            this.initUIBase();
        },
        getHtmlTpl:function() {
            return '<div id="myautosave" class="myautosave on"></div>';
        }
    }, i.inherits(a, t);
}();

!function() {
    UE.dom.domUtils, baidu.editor.ui.uiUtils, UE.utils;
    UE.plugins["blockquote-enter"] = function() {
        var e = this;
        e.addListener("keydown", function(n, t) {
            if (13 === t.keyCode) {
                var i = UE.dom.domUtils, a = i.findParentByTagName(e.selection.getRange().startContainer, "p", !0);
                if (a && i.isEmptyContentNode(a)) {
                    var o = i.findParentByTagName(a, "blockquote");
                    if (o) {
                        t.preventDefault();
                        var r = o.nextSibling;
                        r || (r = document.createElement("p"), r.innerHTML = "<br>", o.parentNode.appendChild(r)), 
                        i.isEmptyContentNode(o) && i.remove(o), e.selection.clearRange(), range = new UE.dom.Range(e.document), 
                        range.setStart(r, 0), range.setEnd(r, 0), range.select(), i.remove(a);
                    }
                }
            }
        });
    };
}();

!function() {
    function e(e, n) {
        n = n || {}, t[e] = function(i) {
            var a = new t.Button({
                className:"edui-for-" + e,
                title:n.title || i.options.labelMap[e] || i.getLang("labelMap." + e) || "",
                onclick:function() {
                    i.execCommand(e);
                }
            });
            return t.buttons[e] = a, i.addListener("selectionchange", function(t, n, o) {
                var s = i.queryCommandState(e);
                -1 == s ? (a.setDisabled(!0), a.setChecked(!1)) :o || (a.setDisabled(!1), a.setChecked(s));
            }), a;
        };
    }
    {
        var t = UE.ui;
        baidu.editor.utils, baidu.editor.ui.UIBase;
    }
    e("horizontal", {
        title:"分割线"
    }), t.audio = function(e, n, i) {
        i = "音频";
        var a = "audio", o = new t.Button({
            className:"edui-for-" + a,
            title:i,
            onclick:function() {
                e.fireEvent("for_" + a);
            }
        });
        return t.buttons[a] = o, e.addListener("selectionchange", function(t, n, i) {
            var s = e.queryCommandState(a);
            -1 == s ? (o.setDisabled(!0), o.setChecked(!1)) :i || (o.setDisabled(!1), o.setChecked(s));
        }), o;
    }, t.h1 = function(e, n, i) {
        i = "H1标题";
        var a = "h1", o = new t.Button({
            className:"edui-for-" + a,
            title:i,
            onclick:function() {
                e.execCommand("paragraph", o.isChecked() ? "p" :"h1");
            }
        });
        return t.buttons[a] = o, e.addListener("selectionchange", function(t, n, i) {
            if (!i) {
                var a = e.queryCommandState("Paragraph");
                if (-1 == a) o.setDisabled(!0), o.setChecked(!1); else {
                    o.setDisabled(!1);
                    var s = e.queryCommandValue("Paragraph");
                    o.setChecked("h1" === s);
                }
            }
        }), o;
    }, t.article_link = function(e, n, i) {
        i = "文章链接";
        var a = "article_link", o = new t.Button({
            className:"edui-for-" + a,
            title:i,
            onclick:function() {
                o.isChecked() ? e.execCommand("unlink", o.isChecked() ? "p" :"h1") :"function" == typeof e.fireEvent && e.fireEvent("for_" + a);
            }
        });
        return t.buttons[a] = o, e.addListener("selectionchange", function(t, n, i) {
            if (!i) {
                var a = e.queryCommandState("link");
                if (-1 == a) o.setDisabled(!0), o.setChecked(!1); else {
                    o.setDisabled(!1);
                    var s = e.queryCommandValue("link");
                    o.setChecked(!!s);
                }
            }
        }), o;
    };
}();

var editorui = UE.ui, utils = UE.utils, domUtils = UE.dom.domUtils, uiUtils = UE.ui.uiUtils, request = UE.ajax.request, UIBase = baidu.editor.ui.UIBase;

!function() {
    var e = {
        check_url:"/article/spell_check_apply/",
        check_switch:"/article/spell_check_switch/",
        check_feedback:"/article/spell_check_feedback/"
    }, t = !1, n = $.cookie("currentMediaId"), c = UEDITOR_CONFIG.toolbars[0].indexOf("morebtn");
    c && (UE.plugins.wordcheck = function() {
        function c(e, t, n) {
            E.document.getSelection().collapseToEnd(), domUtils.remove(t[0], !0), i(n, !1), 
            b[n.sent] = !0, d();
        }
        function r(e, t, n) {
            var r, o = e;
            if (v && v[o] && (r = v[o].correct_word[0]), r) {
                {
                    var a = '<ul class="checkword-popup-container">                <li class="checkword-title">词组纠错</li>                <li class="checkword-option">' + r + '</li>                <li class="checkword-seprate"></li>                <li class="checkword-ignore">忽略</li></ul>', s = new UE.ui.Popup({
                        content:a,
                        editor:E,
                        className:"check-word"
                    }), u = uiUtils.getClientRect(t.target), l = uiUtils.getViewportOffsetByEvent(t);
                    t.target;
                }
                return s.addListener("postRenderAfter", function() {
                    var e = this.getDom(), t = e.getElementsByClassName("checkword-option")[0], r = e.getElementsByClassName("checkword-ignore")[0];
                    t.onclick = function() {
                        E.execCommand("inserthtml", t.innerText), s.hide(), d(), i(v[o], !0);
                    }, r.onclick = function() {
                        c(o, n, v[o]), s.hide();
                    };
                }), l = {
                    top:u.bottom + 5,
                    left:u.right - u.width / 2 - 58
                }, s.showAt(l), s;
            }
        }
        function o(t, c, r, o) {
            var i, a = {};
            e[t] && (i = e[t]), w && (a.article_id = w), n && (a.media_id = n), a.content = c, 
            request(i, {
                method:"post",
                data:a,
                onsuccess:function(e) {
                    try {
                        r(JSON.parse(e.responseText));
                    } catch (t) {
                        console.log("解析异常");
                    }
                },
                onerror:function() {
                    o("接口调用异常");
                }
            });
        }
        function i(t, c) {
            var r, o = c ? 1 :0, i = {
                sent:t.sent,
                word:t.word,
                correct_word:t.correct_word[0],
                word_pos:t.word_pos,
                correct_id:t.correct_id,
                feedback:o
            };
            w && (i.article_id = w), n && (i.media_id = n), r = e.check_feedback, request(r, {
                method:"post",
                data:i,
                onsuccess:function() {},
                onerror:function() {}
            });
        }
        function a(t, n) {
            var c, r = t ? 1 :2, o = {
                status:r
            };
            c = e.check_switch, request(c, {
                method:"post",
                data:o,
                onsuccess:function(e) {
                    var t = JSON.parse(e.responseText);
                    "success" === t.message && n.call(E, r);
                },
                onerror:function() {}
            });
        }
        function s() {
            return u().reset(), E.textMatcher = null, g ? (g = !1, E.fireEvent("SpellcheckEnd"), 
            !0) :void 0;
        }
        function d() {
            E.document.querySelectorAll("span.check-word").length || s();
        }
        function u() {
            return E.textMatcher || (E.textMatcher = new CheckWord(E.body, E)), E.textMatcher;
        }
        function l() {
            function e() {
                s(), E.setEnabled();
            }
            _ && (s() || o("check_url", u().text, m, e));
        }
        function f() {
            return new RegExp("[^\\s!,.!/:;\n，。！？]+", "g");
        }
        function h(e) {
            for (var t in e) return !1;
            return !0;
        }
        function p(e) {
            var t = e.getAttribute("data-checkword-index");
            return "number" == typeof t ? "" + t :t;
        }
        function k(e) {
            var t, n = [];
            if (t = y.toArray(E.document.getElementsByTagName("span")), t.length) for (var c = 0; c < t.length; c++) {
                var r = p(t[c]);
                null !== r && r.length && r === e.toString() && n.push(t[c]);
            }
            return n;
        }
        function m(e) {
            var t = {};
            if ("success" === e.message && e.data.content) {
                if (e.data.content.map(function(e) {
                    t[e.sent] = e;
                }), E.setEnabled(), h(t)) return void (g = !1);
                E.fireEvent("spellchek_tips"), e.data.article_id && (w = e.data.article_id), v = t, 
                u().find(f()).filter(function(e) {
                    return b[e.text] ? void 0 :t[e.text];
                }).wrap(function(e) {
                    var t = E.document.createElement("span");
                    return t.setAttribute("class", "check-word"), t.setAttribute("data-checkword-bogus", 0), 
                    t.setAttribute("data-checkword", e.text), t.setAttribute("data-sent", e.data.sent), 
                    t;
                }), g = !0, E.fireEvent("SpellcheckStart");
            }
        }
        var g, v, w, _, E = this, b = {};
        E.addListener("ready", function() {
            1 == window.UEDITOR_CONFIG.spellcheckStatus ? (_ = !0, E.fireEvent("autocorrect-set-status", !0)) :(_ = !1, 
            E.fireEvent("autocorrect-set-status", !1));
        }), E.addListener("SpellcheckEnd SpellcheckStart", function(e) {
            "SpellcheckEnd" === e && l();
        });
        var y = {};
        y.toArray = function(e) {
            return Array.prototype.slice.call(e);
        }, E.registerCommand("pgc-spellcheck", {
            execCommand:function() {
                l();
            }
        }), E.ready(function() {});
        E.addListener("contentChange", function() {
            d();
        }), E.addListener("keyup", function(e, t) {
            var n = [ 8, 9, 13, 190, 188, 186, 32 ];
            -1 !== n.indexOf(t.keyCode) && l();
        }), E.addListener("click", function(e, t) {
            var n = t.target;
            if ("check-word" == n.className) {
                t.preventDefault(), t.stopPropagation();
                var c = k(p(n));
                if (c.length > 0) {
                    var o = E.document.createRange();
                    o.setStartBefore(c[0]), o.setEndAfter(c[c.length - 1]), E.document.getSelection().removeAllRanges(), 
                    E.document.getSelection().addRange(o), r(n.getAttribute("data-sent"), t, c);
                }
            }
        }), window.uetest = E, E.addListener("autocorrect-status-change", function(e, t) {
            a(t, function(e) {
                1 === e ? (_ = !0, l()) :(_ = !1, s());
            });
        }), E.addListener("ready", function() {
            E.body.addEventListener("paste", function() {
                setTimeout(function() {
                    l();
                }, 200);
            });
        }), E.addOutputRule(function(e) {
            e.traversal(function(e) {
                if ("span" == e.tagName && "check-word" == e.attrs["class"]) {
                    var t = e.parentNode;
                    t.insertBefore(e.firstChild(), e), t.removeChild(e);
                }
            });
        }), window.uef = E, E.addListener("spellchek_tips", function() {
            var e = $("#edit_body .edui-for-morebtn"), n = $.cookie("spellcheck_cookie");
            t || "on" != n && (t = !0, e.spellPopover(function() {
                $.cookie("spellcheck_cookie", "on", {
                    expires:365,
                    path:"/"
                });
            }));
        });
    });
}();

!function() {
    function e(e) {
        var a = new o("code", e, {
            tpl:i,
            className:"edui-code-popup",
            width:"160px",
            height:"36px",
            view:{
                top:-1,
                bottom:-1
            }
        });
        return a.select = a.el.getElementsByTagName("select")[0], n.on(a.select, "change", function() {
            var a = t(e);
            if (a) {
                var l = this.value;
                a.className = "brush:" + l + ";toolbar:false", n.setAttributes(a, {
                    lang:l || c
                });
            }
        }), a.parseLang = function(e) {
            var t = e.getAttribute("lang");
            a.select.value = t || c;
        }, a.showCodeSelect = function(e) {
            a.show(e), this.parseLang(e);
        }, a;
    }
    function t(e) {
        var t, a = e.selection.getStartElementPath();
        return l.each(a, function(e) {
            return "PRE" == e.nodeName ? (t = e, !1) :void 0;
        }), t;
    }
    var a = UE.ui, l = UE.utils, n = UE.dom.domUtils, o = a.AttachPopup, u = "code", c = "-1", s = [ {
        value:c,
        label:"请选择语言"
    }, {
        value:"C/C++"
    }, {
        value:"Css",
        label:"CSS"
    }, {
        value:"C#",
        label:"C#"
    }, {
        value:"Html",
        label:"html"
    }, {
        value:"Java",
        label:"Java"
    }, {
        value:"Javascript",
        label:"Javascript"
    }, {
        value:"Php",
        label:"PHP"
    }, {
        value:"Python",
        label:"Python"
    }, {
        value:"Go",
        label:"Go"
    }, {
        value:"Scale",
        label:"Scale"
    }, {
        value:"Sql",
        label:"SQL"
    }, {
        value:"Shell",
        label:"Shell"
    } ], i = '<div class="code-popup-select"><select>' + s.map(function(e) {
        return '<option value="' + e.value + '">' + (e.label || e.value) + "</option>";
    }).join("") + "</select></div>";
    a[u] = function(l) {
        function n() {
            return o || (o = e(l)), o;
        }
        var o, c = new a.Button({
            className:"edui-for-" + u,
            title:"代码",
            onclick:function() {
                l.execCommand("insertcode", ""), l.execCommand(u), n().showCodeSelect(t(l));
            }
        });
        return a.buttons[u] = c, l.addListener("selectionchange", function(e, a, o) {
            var u = l.queryCommandState("insertcode");
            -1 == u ? (c.setDisabled(!0), c.setChecked(!1)) :o || (c.setDisabled(!1), c.setChecked(u)), 
            1 === u ? n().showCodeSelect(t(l)) :n().hide();
        }), c;
    }, UE.plugins.insertcodeQueryState = function() {
        var e = this;
        e.commands.insertcode.queryCommandState = function() {
            var e = t(this);
            return e ? 1 :0;
        };
    };
}();

!function() {
    function e(e) {
        "string" != typeof e && (e = "");
        var e = o.htmlDecode(e).replace(c, "$1");
        return JSON.parse(e);
    }
    function t(e) {
        var t = '<div contenteditable="false" style="display:block; position: relative; margin: 10px; height:150px; line-height: 1.5" data-commodity=\'' + o.htmlEncode(JSON.stringify(e)) + '\'><div style="position: absolute; width: 150px; height: 100%; background-color: #cacaca;"><img style="height:100%; min-height: 100%; width:100%;" src="' + e.img_url + '"></div><div style="margin-left: 150px; box-sizing: border-box; height: 100%; overflow:hidden; padding:38px 20px; background-color: #f4f5f6;"><div style="font-size: 19px; color: #000;text-overflow: ellipsis; white-space: nowrap; overflow: hidden">' + e.title + '</div><div style="margin-top: 10px;font-size: 19px; color: #777"><span class="commodity-card-label">价格:</span><span style="margin-left: 10px;">' + e.price + "</span></div></div></div>";
        return t;
    }
    for (var i, n = UE.ui, o = baidu.editor.utils, a = (baidu.editor.ui.UIBase, [ [ "ul", "无序列表", "insertunorderedlist" ], [ "ol", "有序列表", "insertorderedlist" ] ]), r = 0; i = a[r++]; ) !function(e, t, i) {
        n[e] = function(o) {
            var a = new n.Button({
                className:"edui-for-" + e,
                title:t,
                onclick:function() {
                    o.execCommand(i);
                }
            });
            return n.buttons[e] = a, o.addListener("selectionchange", function() {
                var e = o.queryCommandState(i);
                -1 == e ? a.setDisabled(!0) :(a.setDisabled(!1), a.setChecked(e));
            }), a;
        };
    }(i[0], i[1], i[2]);
    var d = UEDITOR_CONFIG.toolbars[0].indexOf("commodity"), c = /{!-- PGC_COMMODITY:(.*?) --}/g;
    -1 !== d && UE.registerUI("commodity", function(i, n) {
        function a(e) {
            e.title = o.htmlEncode(e.title);
            var t = JSON.stringify(e);
            return "{!-- PGC_COMMODITY:" + t + " --}";
        }
        var r = new UE.ui.Dialog({
            iframeUrl:i.ui.mapUrl(i.options.iframeUrlMap[n]) + "?" + Math.random(),
            editor:i,
            className:"",
            title:"添加商品",
            name:n + "Dialog",
            cssRules:"width:640px;height:472px;"
        }), d = new UE.ui.Button({
            name:"commodity",
            title:"商品",
            onclick:function() {
                r.render(), r.open();
            }
        });
        return i.addListener("selectionchange", function(e, t, n) {
            var o = i.queryCommandState("commodity");
            -1 == o ? (d.setDisabled(!0), d.setChecked(!1)) :n || (d.setDisabled(!1), d.setChecked(o));
        }), i.registerCommand(n, {
            execCommand:function(e, t) {
                var i, n = this;
                "[object Array]" === Object.prototype.toString.call(t) ? $.each(t, function(e, t) {
                    setTimeout(function() {
                        n.execCommand("insertHTML", "<p>" + a(t) + "</p>");
                    }, 100 * e);
                }) :(i = a(t), this.execCommand("insertHTML", "<p>" + i + "</p>")), r.close();
            }
        }), i.registerCommand("commoditycancel", {
            execCommand:function() {
                r.close();
            }
        }), i.addOutputRule(function(e) {
            e.traversal(function(t) {
                if (t.getAttr("data-commodity")) {
                    var i = "<p>{!-- PGC_COMMODITY:" + o.htmlDecode(t.getAttr("data-commodity")) + " --}</p>", n = UE.htmlparser(i);
                    t.setAttr("data-commodity", ""), e.replaceChild(n, t);
                }
            });
        }), i.addInputRule(function(i) {
            i.traversal(function(i) {
                if (i.data && i.data.match(c)) {
                    var n = e(i.data), o = UE.htmlparser(t(n));
                    i.parentNode.parentNode.replaceChild(o.firstChild(), i.parentNode);
                }
            });
        }), ue.ready(function() {
            var e;
            $(i.document).delegate("[data-commodity]", "click", function(t) {
                t.stopPropagation(), document.createRange && (e = document.createRange(), e.selectNode($(this)[0]));
            }), $(i.document).bind("keyup", function(t) {
                (46 === t.keyCode || 8 === t.keyCode) && e && e.deleteContents();
            }).bind("selectionchange", function() {
                e = null;
            });
        }), d;
    }, d);
}();

function CheckWord(e, t) {
    function n(e) {
        var t;
        if (3 === e.nodeType) return e.data;
        if (a(e)) return "\n";
        if (t = "", (o(e.tagName) || i(e.tagName)) && (t += "\n"), e = e.firstChild) do t += n(e); while (e = e.nextSibling);
        return t;
    }
    function r(e, t) {
        if (v && e.global) for (;m = e.exec(v); ) b.push(l(m, t));
        return this;
    }
    function i(e) {
        return -1 !== [ "br", "img", "hr", "area", "base", "basefont", "col", "frame", "hr", "img", "input", "isindex", "link" ].indexOf(e.toLowerCase());
    }
    function o(e) {
        return -1 !== [ "div", "p", "table", "tr", "td", "li", "ol", "ul", "h1", "h2", "pre", "form" ].indexOf(e.toLowerCase());
    }
    function a(e) {
        return e && 1 == e.nodeType && "false" === e.contentEditable;
    }
    function d(e) {
        var t, n = [];
        return s(function(r, i) {
            (t = e(r, i)) && (r.data = t, r.start += t.word_pos, r.end = r.start + t.word.length, 
            r.text = t.word, n.push(r));
        }), b = n, console.log("filter matches:", b), this;
    }
    function s(e) {
        for (var t = 0, n = b.length; n > t && e(b[t], t) !== !1; t++) ;
        return this;
    }
    function l(e, t) {
        if (!e[0]) throw "findAndReplaceDOMText cannot handle zero-length matches";
        return {
            start:e.index,
            end:e.index + e[0].length,
            text:e[0],
            data:t
        };
    }
    function f(t) {
        return b.length && u(e, b, c(t)), this;
    }
    function u(e, t, n) {
        var r, d, s, l, f, u = [], c = 0, h = e, g = 0;
        t = t.slice(0), t.sort(function(e, t) {
            return e.start - t.start;
        }), f = t.shift();
        e:for (;;) {
            if ((o(h.nodeName) || i(h.nodeName) || a(h)) && c++, 3 === h.nodeType && (!d && h.length + c >= f.end ? (d = h, 
            l = f.end - c) :r && u.push(h), !r && h.length + c > f.start && (r = h, s = f.start - c), 
            c += h.length), r && d) {
                if (h = n({
                    startNode:r,
                    startNodeIndex:s,
                    endNode:d,
                    endNodeIndex:l,
                    innerNodes:u,
                    match:f.text,
                    matchIndex:g
                }), c -= d.length - l, r = null, d = null, u = [], f = t.shift(), g++, !f) break;
            } else if (h.firstChild) {
                if (!a(h)) {
                    h = h.firstChild;
                    continue;
                }
            } else if (h.nextSibling) {
                h = h.nextSibling;
                continue;
            }
            for (;;) {
                if (h.nextSibling) {
                    h = h.nextSibling;
                    break;
                }
                if (h.parentNode === e) break e;
                h = h.parentNode;
            }
        }
    }
    function c(e) {
        function t(t, n) {
            var r = b[n];
            r.stencil || (r.stencil = e(r));
            var i = r.stencil.cloneNode(!1);
            return i.setAttribute("data-checkword-index", n), t && i.appendChild(C.createTextNode(t)), 
            i;
        }
        return function(e) {
            var n, r, i, o = e.startNode, a = e.endNode, d = e.matchIndex;
            if (o === a) {
                var s = o;
                i = s.parentNode, e.startNodeIndex > 0 && (n = C.createTextNode(s.data.substring(0, e.startNodeIndex)), 
                i.insertBefore(n, s));
                var l = t(e.match, d);
                return i.insertBefore(l, s), e.endNodeIndex < s.length && (r = C.createTextNode(s.data.substring(e.endNodeIndex)), 
                i.insertBefore(r, s)), s.parentNode.removeChild(s), l;
            }
            n = C.createTextNode(o.data.substring(0, e.startNodeIndex)), r = C.createTextNode(a.data.substring(0));
            for (var f = t(o.data.substring(e.startNodeIndex), d), u = [], c = 0, h = e.innerNodes.length; h > c; ++c) {
                var g = e.innerNodes[c], N = t(g.data, d);
                g.parentNode.replaceChild(N, g), u.push(N);
            }
            var x = t(e.match, d);
            return i = o.parentNode, i.insertBefore(n, o), i.insertBefore(f, o), i.removeChild(o), 
            i = a.parentNode, i.insertBefore(x, a), i.insertBefore(r, a), i.removeChild(a), 
            x;
        };
    }
    function h(e) {
        for (var t = b.length; t--; ) if (b[t] === e) return t;
        return -1;
    }
    function g(e) {
        var t = e.parentNode;
        try {
            t.insertBefore(e.firstChild, e), t.removeChild(e);
        } catch (n) {
            console.log("节点被异常改变~~~");
        }
    }
    function N(e) {
        var t, n = x(e ? h(e) :null);
        for (t = n.length; t--; ) g(n[t]);
        return this;
    }
    function x(t) {
        var n = e.getElementsByTagName("*"), r = [];
        t = "number" == typeof t ? "" + t :null;
        for (var i = 0; i < n.length; i++) {
            var o = n[i], a = o.getAttribute("data-checkword-index");
            null !== a && a.length && (a === t || null === t) && r.push(o);
        }
        return r;
    }
    function p() {
        return b.splice(0, b.length), N(), this;
    }
    var v, b = [], C = t.document;
    return v = n(e), {
        text:v,
        reset:p,
        find:r,
        filter:d,
        wrap:f,
        unwrap:N
    };
}

!function() {
    function e(e, i) {
        $.get("/article/get_dongfangIC_uri/", {
            ic_id:e.id,
            term:e.term
        }, function(e) {
            i.call(this, e);
        });
    }
    var i = (UE.ui, baidu.editor.utils, baidu.editor.ui.UIBase, UEDITOR_CONFIG.toolbars[0].indexOf("ic"));
    -1 !== i && UE.registerUI("ic", function(i, t) {
        var n = new UE.ui.Dialog({
            iframeUrl:i.ui.mapUrl(i.options.iframeUrlMap[t]) + "?" + Math.random(),
            editor:i,
            className:"",
            title:"正版图库",
            name:t + "Dialog",
            cssRules:"width:656px;height:190px;"
        }), a = new UE.ui.Button({
            name:t,
            title:"正版图库",
            onclick:function() {
                n.render(), n.open();
            }
        });
        return i.addListener("selectionchange", function(e, t, n) {
            var o = i.queryCommandState("ic");
            -1 == o ? (a.setDisabled(!0), a.setChecked(!1)) :n || (a.setDisabled(!1), a.setChecked(o));
        }), "undefined" == typeof ic_map && (ic_map = {}), i.registerCommand("insertic", {
            execCommand:function(t, a) {
                e(a, function(e) {
                    i.execCommand("insertimagewithcaption", {
                        src:"https://p.pstatp.com/large/" + e,
                        "data-ic":e
                    }), n.close();
                });
            }
        }), i.addOutputRule(function(e) {
            var i = {};
            e.traversal(function(e) {
                if ("img" === e.tagName) {
                    var t = e.attrs["data-ic"], n = "";
                    if (t) i[t] = t; else {
                        if (n = e.attrs.src, !n) return;
                        n = n.split("/").pop(), ic_map[n] && (i[n] = n);
                    }
                }
            }), ic_map = i;
        }), ue.ready(function() {
            var e = $("#edit_body .edui-for-ic"), i = $.cookie("seen_ic_cookie");
            i && "seen" == i || !$(".edui-for-ic").length || setTimeout(function() {
                e.popover(function() {
                    i && "seen" == i || $.cookie("seen_ic_cookie", "seen", {
                        expires:365,
                        path:"/"
                    });
                });
            }, 50);
        }), a;
    }, i);
}();

!function() {
    UE.plugins["iframe-loader"] = function() {
        var e = UE.ui, t = (e.uiUtils, UE.dom.domUtils), n = UE.utils, i = 1, r = [], o = this, a = "iframe-hide", s = e.iframeLoader = function(e, t, i) {
            var o = this.getId();
            t = n.extend({}, t), t = n.extend(t, {
                src:"javascript:void(0);",
                id:o,
                type:e
            });
            var s = new UE.uNode({
                type:"element",
                tagName:"iframe",
                attrs:t,
                "class":a
            }), c = n.extend({}, i);
            return c.id = o, r.push(c), s;
        };
        s.prototype.getId = function() {
            return "ueditor-iframe-" + i++;
        }, s.execAll = function() {
            var e = this;
            n.each(n.extend([], r), function(t) {
                e.exec(t);
            });
        }, s.exec = function(e) {
            var i = o.document.getElementById(e.id);
            if (i) {
                var s = i.contentWindow, c = s.document, d = function() {
                    t.removeClasses(i, a);
                    var r = UE.browser, o = r.ie, s = (e.css || []).map(function(e) {
                        return "<link rel='stylesheet' type='text/css' href='" + n.unhtml(e) + "'/>";
                    }).join(""), d = (e.js || []).map(function(e) {
                        return "<script type='text/javascript' src='" + n.unhtml(e) + "'></script>";
                    }).join(""), l = (o && r.version < 9 ? "" :"<!DOCTYPE html>") + "<html xmlns='http://www.w3.org/1999/xhtml' class='view' ><head>" + s + "</head><body>" + (e.body || "") + "</body>" + d + "</html>";
                    c.write(l);
                };
                "complete" === c.readyState ? d() :t.on(i, "load", d);
                var l = r.indexOf(e);
                -1 !== l && r.splice(l, 1);
            }
        };
    };
}();

!function() {
    var i = UE.dom.domUtils, t = (baidu.editor.ui.uiUtils, UE.utils);
    UE.plugins["image-caption"] = function() {
        var n = this, o = UE.ui.imgCaptionCls, e = UE.ui.imgContainerCls;
        n.on("afterSetContent removeOldCaption", function() {
            try {
                var r = n.body.querySelectorAll("." + o);
                if (!r) return;
                t.each(r, function(t) {
                    var n = i.findParent(t, function(t) {
                        return i.hasClass(t, e);
                    });
                    n || i.remove(t);
                });
            } catch (a) {}
        });
    };
}();

!function() {
    UE.dom.domUtils, baidu.editor.ui.uiUtils, UE.utils;
}();

!function() {
    function e(e, i) {
        $.get("/article/get_dongfangIC_uri/", {
            ic_id:e.id,
            term:e.term
        }, function(e) {
            i.call(this, e);
        });
    }
    UE.ui, baidu.editor.utils, baidu.editor.ui.UIBase;
    UE.plugins.images = function() {
        var i = UEDITOR_CONFIG.toolbars[0].indexOf("images");
        i && UE.registerUI("images", function(i, t) {
            var a = new UE.ui.Dialog({
                iframeUrl:i.ui.mapUrl(i.options.iframeUrlMap[t]) + "?" + Math.random(),
                editor:i,
                className:"",
                title:"图片",
                name:"insertimage",
                cssRules:"width:660px;height:460px;"
            }), n = new UE.ui.Button({
                name:t,
                title:"插入图片",
                onclick:function() {
                    a.render(), a.open();
                }
            });
            return i.addListener("selectionchange", function(e, t, a) {
                var r = i.queryCommandState("ic");
                -1 == r ? (n.setDisabled(!0), n.setChecked(!1)) :a || (n.setDisabled(!1), n.setChecked(r));
            }), "undefined" == typeof ic_map && (ic_map = {}), i.registerCommand("inserticnew", {
                execCommand:function(t, n) {
                    e(n, function(e) {
                        i.execCommand("insertimagewithcaption", {
                            src:"https://p.pstatp.com/large/" + e,
                            "data-ic":e
                        }), a.close();
                    });
                }
            }), i.addOutputRule(function(e) {
                var i = {};
                e.traversal(function(e) {
                    if ("img" === e.tagName) {
                        var t = e.attrs["data-ic"], a = "";
                        if (t) i[t] = t; else {
                            if (a = e.attrs.src, !a) return;
                            a = a.split("/").pop(), ic_map[a] && (i[a] = a);
                        }
                    }
                }), ic_map = i;
            }), n;
        }, i);
    };
    UE.plugins.testwin = function() {
        var i = UEDITOR_CONFIG.toolbars[0].indexOf("testwin");
        i && UE.registerUI("testwin", function(i, t) {
            var a = new UE.ui.Dialog({
                iframeUrl:i.ui.mapUrl(i.options.iframeUrlMap[t]) + "?" + Math.random(),
                editor:i,
                className:"",
                title:"测试窗口",
                name:"insertimage",
                cssRules:"width:660px;height:460px;"
            }), n = new UE.ui.Button({
                name:t,
                title:"测试窗口",
                onclick:function() {
                    a.render(), a.open();
                }
            });
            return n;
        }, i);
    };
}();

!function() {
    var t = UE.ui, o = (t.uiUtils, UE.dom.domUtils, UE.utils, t.PopupMenu, t.DropdownMenu), e = "morebtn";
    t.morebtn = function(n) {
        var u = new o(n, {
            name:e,
            className:"edui-for-" + e,
            title:"更多",
            popupOpts:{
                className:"edui-dropdown-bottomright"
            },
            items:[ "autocorrect" ]
        });
        return t.buttons[e] = u, u;
    };
}();

!function() {
    var e = (UE.dom.domUtils, baidu.editor.ui.uiUtils, UE.utils), t = UE.ui, n = "telephone";
    t.telephone = function(e, n, o) {
        o = "电话";
        var a = "telephone", r = new t.Button({
            className:"edui-for-" + a,
            title:o,
            onclick:function() {
                r.isChecked() ? e.execCommand("unlink", r.isChecked() ? "p" :"h1") :"function" == typeof e.fireEvent && e.fireEvent("for_" + a);
            }
        });
        return t.buttons[a] = r, e.addListener("selectionchange", function(t, n, o) {
            if (!o) {
                var a = e.queryCommandState("link");
                if (-1 == a) r.setDisabled(!0), r.setChecked(!1); else {
                    r.setDisabled(!1);
                    var c = e.queryCommandValue("link");
                    r.setChecked(!!c);
                }
            }
        }), r;
    };
    var o = function(e, t, n) {
        return '<a class="editor-phone-btn ' + e + '" target="_blank" href="' + n + '">' + t + "</a>";
    }, a = function(e) {
        var t = [];
        return e["book-name"] && t.push(o("editor-phone-btn-book", e["book-name"], e["book-url"])), 
        e["contact-name"] && t.push(o("editor-phone-btn-contact", e["contact-name"], "tel:" + e["contact-phone"])), 
        '<div class="editor-phone-btn-group">' + t.join("") + "</div>";
    };
    UE.plugins.telephone = function() {
        function o(e) {
            "string" != typeof e && (e = "");
            var e = e.replace(c, "$1");
            return e = JSON.parse(e), i.input(e);
        }
        var r = this, c = /{!-- PGC_PHONE:(.*?) --}/g, i = {
            input:function(e) {
                return {
                    "contact-name":e.contact_name,
                    "contact-phone":e.contact_phone,
                    "book-name":e.book_name,
                    "book-url":e.book_url
                };
            },
            output:function(e) {
                return {
                    contact_name:e["contact-name"],
                    contact_phone:e["contact-phone"],
                    book_name:e["book-name"],
                    book_url:e["book-url"]
                };
            }
        };
        r.addInputRule(function(r) {
            function i(t) {
                var o = e.extend({}, t);
                return o.style = "height: 37px;", new u(n, o, {
                    css:[ "//s2.pstatp.com/pgc/v2/resource/pgc_web/static/ueditor/iframe.766d68a.css" ],
                    body:a(t)
                });
            }
            var u = t.iframeLoader;
            e.each(r.getNodesByTagName("tt-phone-group"), function(e) {
                try {
                    var t = i(e.attrs);
                    e.parentNode.replaceChild(t, e);
                } catch (n) {
                    console.log(n);
                }
            }), e.each(r.getNodesByTagName("p"), function(t) {
                if (t = t.children[0], t && t.data && t.data.match(c)) {
                    var n = o(e.htmlDecode(t.data)), a = i(n);
                    t.parentNode.replaceChild(a, t);
                }
            });
        }), r.addOutputRule(function(t) {
            var o = t.getNodesByTagName("iframe").filter(function(e) {
                return e.attrs.type === n;
            });
            e.each(o, function(e) {
                try {
                    var t = e.attrs, n = new UE.uNode({
                        type:"element",
                        tagName:"p"
                    }), o = i.output(t);
                    n.innerHTML("{!-- PGC_PHONE:" + JSON.stringify(o) + " --}"), "p" === e.parentNode.tagName && e.parentNode.parentNode && 1 === e.parentNode.children.length ? e.parentNode.parentNode.replaceChild(n, e.parentNode) :e.parentNode.replaceChild(n, e);
                } catch (a) {
                    console.log(a);
                }
            });
        });
        var u = function() {
            var e = t.iframeLoader;
            e.execAll();
        };
        r.addListener("contentchange", function() {
            setTimeout(function() {
                u();
            }, 0);
        });
    };
}();

!function() {
    {
        var e = (UE.ui, baidu.editor.utils);
        baidu.editor.ui.UIBase;
    }
    UE.plugins.temai = function() {
        function t(t) {
            t.title = e.htmlEncode(t.title);
            var i = JSON.stringify(t);
            return "{!-- PGC_COMMODITY:" + i + " --}";
        }
        function i(t) {
            "string" != typeof t && (t = "");
            var t = e.htmlDecode(t).replace(o, "$1");
            return JSON.parse(t);
        }
        function n(t) {
            var i = '<div contenteditable="false" style="display:block; position: relative; margin: 10px; height:150px; line-height: 1.5" data-commodity=\'' + e.htmlEncode(JSON.stringify(t)) + '\'>        <div style="position: absolute; width: 150px; height: 100%; background-color: #cacaca;"><img style="height:100%; min-height: 100%; width:100%;" src="' + t.img_url + '"></div>        <div style="margin-left: 150px; box-sizing: border-box; height: 100%; overflow:hidden; padding:38px 20px; background-color: #f4f5f6;">        <div style="font-size: 19px; color: #000;text-overflow: ellipsis; white-space: nowrap; overflow: hidden">' + t.title + '</div>        <div style="margin-top: 10px;font-size: 19px; color: #777">        <span class="commodity-card-label">价格:</span><span style="margin-left: 10px;">' + t.price + "</span>        </div></div></div>";
            return i;
        }
        var o = /{!-- PGC_COMMODITY:(.*?) --}/g, a = UEDITOR_CONFIG.toolbars[0].indexOf("temai"), r = !1;
        -1 !== a && (r = !0), r && UE.registerUI("temai", function(a, r) {
            var d = new UE.ui.Dialog({
                iframeUrl:a.ui.mapUrl(a.options.iframeUrlMap.temai) + "?" + Math.random(),
                editor:a,
                className:"",
                title:"商品",
                name:r + "Dialog",
                cssRules:"width:640px;height:560px;"
            }), c = new UE.ui.Button({
                name:r,
                title:"商品",
                onclick:function() {
                    d.render(), d.open();
                }
            });
            return a.addListener("selectionchange", function(e, t, i) {
                var n = a.queryCommandState("commodity");
                -1 == n ? (c.setDisabled(!0), c.setChecked(!1)) :i || (c.setDisabled(!1), c.setChecked(n));
            }), a.registerCommand(r, {
                execCommand:function(e, i) {
                    var n, o = this;
                    "[object Array]" === Object.prototype.toString.call(i) ? $.each(i, function(e, i) {
                        setTimeout(function() {
                            o.execCommand("insertHTML", "<p>" + t(i) + "</p>");
                        }, 100 * e);
                    }) :(n = t(i), this.execCommand("insertHTML", "<p>" + n + "</p>")), d.close();
                }
            }), a.registerCommand("commoditycancel", {
                execCommand:function() {
                    d.close();
                }
            }), a.addOutputRule(function(t) {
                t.traversal(function(i) {
                    if (i.getAttr("data-commodity")) {
                        var n = "<p>{!-- PGC_COMMODITY:" + e.htmlDecode(i.getAttr("data-commodity")) + " --}</p>", o = UE.htmlparser(n);
                        i.setAttr("data-commodity", ""), t.replaceChild(o, i);
                    }
                });
            }), a.addInputRule(function(e) {
                e.traversal(function(e) {
                    if (e.data && e.data.match(o)) {
                        var t = i(e.data), a = UE.htmlparser(n(t));
                        e.parentNode.parentNode.replaceChild(a.firstChild(), e.parentNode);
                    }
                });
            }), ue.ready(function() {
                var e;
                $(a.document).delegate("[data-commodity]", "click", function(t) {
                    t.stopPropagation(), document.createRange && (e = document.createRange(), e.selectNode($(this)[0]));
                }), $(a.document).bind("keyup", function(t) {
                    (46 === t.keyCode || 8 === t.keyCode) && e && e.deleteContents();
                }).bind("selectionchange", function() {
                    e = null;
                });
            }), c;
        }, a);
    };
}();

!function() {
    var e = UE.dom.domUtils, t = UE.utils;
    UE.plugins.trimEnd = function() {
        var n = this, i = UE.uNode;
        n.addOutputRule(function(n) {
            var o = n.getNodesByTagName("p h1 blockquote");
            t.each(o, function(t) {
                if (-1 !== [ "p", "h1", "blockquote" ].indexOf(t.tagName) && e.isEmptyUNode(t)) {
                    var o = new i({
                        tagName:"p",
                        type:"element"
                    });
                    o.innerHTML("<br/>"), n.insertBefore(o, t), n.removeChild(t);
                }
            });
            for (var a; ;) {
                if (a = n.lastChild(), !a || !e.isEmptyUNode(a)) break;
                n.removeChild(a);
            }
        }), n.on("afterSetContent autoAppendEmptyLine", function() {
            var t = n.body.lastChild;
            if (t && "false" === t.contentEditable) {
                var i = e.createElement(n.document, "p");
                i.innerHTML = "<br/>", n.body.appendChild(i);
            }
        });
    };
}();