! function () {
    function getListener(obj, type, force) {
        var allListeners;
        return type = type.toLowerCase(), (allListeners = obj.__allListeners || force && (obj.__allListeners = {})) &&
            (allListeners[type] || force && (allListeners[type] = []))
    }
    function getDomNode(node, start, ltr, startFromChild, fn, guard) {
        var parent, tmpNode = startFromChild && node[start];
        for (!tmpNode && (tmpNode = node[ltr]); !tmpNode && (parent = (parent || node).parentNode);) {
            if ("BODY" == parent.tagName || guard && !guard(parent)) return null;
            tmpNode = parent[ltr]
        }
        return tmpNode && fn && !fn(tmpNode) ? getDomNode(tmpNode, start, ltr, !1, fn) : tmpNode
    }
    UEDITOR_CONFIG = window.UEDITOR_CONFIG || {};
    var baidu = window.baidu || {};
    window.baidu = baidu, window.UE = baidu.editor = window.UE || {}, UE.plugins = {}, UE.commands = {}, UE.instants = {},
        UE.I18N = {}, UE._customizeUI = {}, UE.version = "1.4.3";
    var dom = UE.dom = {}, browser = UE.browser = function () {
            var agent = navigator.userAgent.toLowerCase(),
                opera = window.opera,
                browser = {
                    ie: /(msie\s|trident.*rv:)([\w.]+)/.test(agent),
                    opera: !! opera && opera.version,
                    webkit: agent.indexOf(" applewebkit/") > -1,
                    mac: agent.indexOf("macintosh") > -1,
                    quirks: "BackCompat" == document.compatMode
                };
            browser.gecko = "Gecko" == navigator.product && !browser.webkit && !browser.opera && !browser.ie;
            var version = 0;
            if (browser.ie) {
                var v1 = agent.match(/(?:msie\s([\w.]+))/),
                    v2 = agent.match(/(?:trident.*rv:([\w.]+))/);
                version = v1 && v2 && v1[1] && v2[1] ? Math.max(1 * v1[1], 1 * v2[1]) : v1 && v1[1] ? 1 * v1[1] : v2 &&
                    v2[1] ? 1 * v2[1] : 0, browser.ie11Compat = 11 == document.documentMode, browser.ie9Compat = 9 ==
                    document.documentMode, browser.ie8 = !! document.documentMode, browser.ie8Compat = 8 == document.documentMode,
                    browser.ie7Compat = 7 == version && !document.documentMode || 7 == document.documentMode, browser.ie6Compat =
                    7 > version || browser.quirks, browser.ie9above = version > 8, browser.ie9below = 9 > version,
                    browser.ie11above = version > 10, browser.ie11below = 11 > version
            }
            if (browser.gecko) {
                var geckoRelease = agent.match(/rv:([\d\.]+)/);
                geckoRelease && (geckoRelease = geckoRelease[1].split("."), version = 1e4 * geckoRelease[0] + 100 * (
                    geckoRelease[1] || 0) + 1 * (geckoRelease[2] || 0))
            }
            return /chrome\/(\d+\.\d)/i.test(agent) && (browser.chrome = +RegExp.$1),
                /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent) && (browser.safari = +
                (RegExp.$1 || RegExp.$2)), browser.opera && (version = parseFloat(opera.version())), browser.webkit &&
                (version = parseFloat(agent.match(/ applewebkit\/(\d+)/)[1])), browser.version = version, browser.isCompatible = !
                browser.mobile && (browser.ie && version >= 6 || browser.gecko && version >= 10801 || browser.opera &&
                version >= 9.5 || browser.air && version >= 1 || browser.webkit && version >= 522 || !1), browser
        }(),
        ie = browser.ie,
        webkit = browser.webkit,
        gecko = browser.gecko,
        opera = browser.opera,
        utils = UE.utils = {
            each: function (obj, iterator, context) {
                if (null != obj) if (obj.length === +obj.length) {
                        for (var i = 0, l = obj.length; l > i; i++) if (iterator.call(context, obj[i], i, obj) === !1)
                                return !1
                    } else for (var key in obj) if (obj.hasOwnProperty(key) && iterator.call(context, obj[key], key,
                                obj) === !1) return !1
            },
            makeInstance: function (obj) {
                var noop = new Function;
                return noop.prototype = obj, obj = new noop, noop.prototype = null, obj
            },
            extend: function (t, s, b) {
                if (s) for (var k in s) b && t.hasOwnProperty(k) || (t[k] = s[k]);
                return t
            },
            extend2: function (t) {
                for (var a = arguments, i = 1; i < a.length; i++) {
                    var x = a[i];
                    for (var k in x) t.hasOwnProperty(k) || (t[k] = x[k])
                }
                return t
            },
            inherits: function (subClass, superClass) {
                var oldP = subClass.prototype,
                    newP = utils.makeInstance(superClass.prototype);
                return utils.extend(newP, oldP, !0), subClass.prototype = newP, newP.constructor = subClass
            },
            bind: function (fn, context) {
                return function () {
                    return fn.apply(context, arguments)
                }
            },
            defer: function (fn, delay, exclusion) {
                var timerID;
                return function () {
                    exclusion && clearTimeout(timerID), timerID = setTimeout(fn, delay)
                }
            },
            indexOf: function (array, item, start) {
                var index = -1;
                return start = this.isNumber(start) ? start : 0, this.each(array, function (v, i) {
                    return i >= start && v === item ? (index = i, !1) : void 0
                }), index
            },
            removeItem: function (array, item) {
                for (var i = 0, l = array.length; l > i; i++) array[i] === item && (array.splice(i, 1), i--)
            },
            trim: function (str) {
                return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, "")
            },
            listToMap: function (list) {
                if (!list) return {};
                list = utils.isArray(list) ? list : list.split(",");
                for (var ci, i = 0, obj = {}; ci = list[i++];) obj[ci.toUpperCase()] = obj[ci] = 1;
                return obj
            },
            unhtml: function (str, reg) {
                return str ? str.replace(reg || /[&<">'](?:(amp|lt|quot|gt|#39|nbsp|#\d+);)?/g, function (a, b) {
                    return b ? a : {
                        "<": "<",
                        "&": "&",
                        '"': '"'"",
                        ">": ">",
                        "'": "'"
                    }[a]
                }) : ""
            },
            html: function (str) {
                return str ? str.replace(/&((g|l|quo)t|amp|#39|nbsp);/g, function (m) {
                    return {
                        "<": "<",
                        "&": "&",
                        '"': '"',
                        ">": ">",
                        "'": "'",
                        " ": " "
                    }[m]
                }) : ""
            },
            cssStyleToDomStyle: function () {
                var test = document.createElement("div").style,
                    cache = {
                        "float": void 0 != test.cssFloat ? "cssFloat" : void 0 != test.styleFloat ? "styleFloat" : "float"
                    };
                return function (cssName) {
                    return cache[cssName] || (cache[cssName] = cssName.toLowerCase().replace(/-./g, function (match) {
                        return match.charAt(1).toUpperCase()
                    }))
                }
            }(),
            loadFile: function () {
                function getItem(doc, obj) {
                    try {
                        for (var ci, i = 0; ci = tmpList[i++];) if (ci.doc === doc && ci.url == (obj.src || obj.href))
                                return ci
                    } catch (e) {
                        return null
                    }
                }
                var tmpList = [];
                return function (doc, obj, fn) {
                    var item = getItem(doc, obj);
                    if (item) return void(item.ready ? fn && fn() : item.funs.push(fn));
                    if (tmpList.push({
                        doc: doc,
                        url: obj.src || obj.href,
                        funs: [fn]
                    }), !doc.body) {
                        var html = [];
                        for (var p in obj) "tag" != p && html.push(p + '="' + obj[p] + '"');
                        return void doc.write("<" + obj.tag + " " + html.join(" ") + " ></" + obj.tag + ">")
                    }
                    if (!obj.id || !doc.getElementById(obj.id)) {
                        var element = doc.createElement(obj.tag);
                        delete obj.tag;
                        for (var p in obj) element.setAttribute(p, obj[p]);
                        element.onload = element.onreadystatechange = function () {
                            if (!this.readyState || /loaded|complete/.test(this.readyState)) {
                                if (item = getItem(doc, obj), item.funs.length > 0) {
                                    item.ready = 1;
                                    for (var fi; fi = item.funs.pop();) fi()
                                }
                                element.onload = element.onreadystatechange = null
                            }
                        }, element.onerror = function () {
                            throw Error("The load " + (obj.href || obj.src) +
                                " fails,check the url settings of file ueditor.config.js ")
                        }, doc.getElementsByTagName("head")[0].appendChild(element)
                    }
                }
            }(),
            isEmptyObject: function (obj) {
                if (null == obj) return !0;
                if (this.isArray(obj) || this.isString(obj)) return 0 === obj.length;
                for (var key in obj) if (obj.hasOwnProperty(key)) return !1;
                return !0
            },
            fixColor: function (name, value) {
                if (/color/i.test(name) && /rgba?/.test(value)) {
                    var array = value.split(",");
                    if (array.length > 3) return "";
                    value = "#";
                    for (var color, i = 0; color = array[i++];) color = parseInt(color.replace(/[^\d]/gi, ""), 10).toString(
                            16), value += 1 == color.length ? "0" + color : color;
                    value = value.toUpperCase()
                }
                return value
            },
            optCss: function (val) {
                function opt(obj, name) {
                    if (!obj) return "";
                    var t = obj.top,
                        b = obj.bottom,
                        l = obj.left,
                        r = obj.right,
                        val = "";
                    if (t && l && b && r) val += ";" + name + ":" + (t == b && b == l && l == r ? t : t == b && l == r ?
                            t + " " + l : l == r ? t + " " + l + " " + b : t + " " + r + " " + b + " " + l) + ";";
                    else for (var p in obj) val += ";" + name + "-" + p + ":" + obj[p] + ";";
                    return val
                }
                var padding, margin;
                return val = val.replace(/(padding|margin|border)\-([^:]+):([^;]+);?/gi, function (str, key, name, val) {
                    if (1 == val.split(" ").length) switch (key) {
                        case "padding":
                            return !padding && (padding = {}), padding[name] = val, "";
                        case "margin":
                            return !margin && (margin = {}), margin[name] = val, "";
                        case "border":
                            return "initial" == val ? "" : str
                    }
                    return str
                }), val += opt(padding, "padding") + opt(margin, "margin"), val.replace(/^[ \n\r\t;]*|[ \n\r\t]*$/, "")
                    .replace(/;([ \n\r\t]+)|\1;/g, ";").replace(/(&((l|g)t|quot|#39))?;{2,}/g, function (a, b) {
                    return b ? b + ";;" : ";"
                })
            },
            clone: function (source, target) {
                var tmp;
                target = target || {};
                for (var i in source) source.hasOwnProperty(i) && (tmp = source[i], "object" == typeof tmp ? (target[i] =
                        utils.isArray(tmp) ? [] : {}, utils.clone(source[i], target[i])) : target[i] = tmp);
                return target
            },
            transUnitToPx: function (val) {
                if (!/(pt|cm)/.test(val)) return val;
                var unit;
                switch (val.replace(/([\d.]+)(\w+)/, function (str, v, u) {
                    val = v, unit = u
                }), unit) {
                case "cm":
                    val = 25 * parseFloat(val);
                    break;
                case "pt":
                    val = Math.round(96 * parseFloat(val) / 72)
                }
                return val + (val ? "px" : "")
            },
            domReady: function () {
                function doReady(doc) {
                    doc.isReady = !0;
                    for (var ci; ci = fnArr.pop(); ci());
                }
                var fnArr = [];
                return function (onready, win) {
                    win = win || window;
                    var doc = win.document;
                    onready && fnArr.push(onready), "complete" === doc.readyState ? doReady(doc) : (doc.isReady &&
                        doReady(doc), browser.ie && 11 != browser.version ? (! function () {
                        if (!doc.isReady) {
                            try {
                                doc.documentElement.doScroll("left")
                            } catch (error) {
                                return void setTimeout(arguments.callee, 0)
                            }
                            doReady(doc)
                        }
                    }(), win.attachEvent ? win.attachEvent("onload", function () {
                        doReady(doc)
                    }) : win.addEventListener("load", function () {
                        doReady(doc)
                    }, !1)) : (doc.addEventListener("DOMContentLoaded", function () {
                        doc.removeEventListener("DOMContentLoaded", arguments.callee, !1), doReady(doc)
                    }, !1), win.addEventListener("load", function () {
                        doReady(doc)
                    }, !1)))
                }
            }(),
            cssRule: browser.ie && 11 != browser.version ? function (key, style, doc) {
                var indexList, index;
                return void 0 === style || style && style.nodeType && 9 == style.nodeType ? (doc = style && style.nodeType &&
                    9 == style.nodeType ? style : doc || document, indexList = doc.indexList || (doc.indexList = {}),
                    index = indexList[key], void 0 !== index ? doc.styleSheets[index].cssText : void 0) : (doc = doc ||
                    document, indexList = doc.indexList || (doc.indexList = {}), index = indexList[key], "" === style ?
                    void 0 !== index ? (doc.styleSheets[index].cssText = "", delete indexList[key], !0) : !1 : (void 0 !==
                    index ? sheetStyle = doc.styleSheets[index] : (sheetStyle = doc.createStyleSheet("", index = doc.styleSheets
                    .length), indexList[key] = index), void(sheetStyle.cssText = style)))
            } : function (key, style, doc) {
                var node;
                return void 0 === style || style && style.nodeType && 9 == style.nodeType ? (doc = style && style.nodeType &&
                    9 == style.nodeType ? style : doc || document, node = doc.getElementById(key), node ? node.innerHTML :
                    void 0) : (doc = doc || document, node = doc.getElementById(key), "" === style ? node ? (node.parentNode
                    .removeChild(node), !0) : !1 : void(node ? node.innerHTML = style : (node = doc.createElement(
                    "style"), node.id = key, node.innerHTML = style, doc.getElementsByTagName("head")[0].appendChild(
                    node))))
            },
            sort: function (array, compareFn) {
                compareFn = compareFn || function (item1, item2) {
                    return item1.localeCompare(item2)
                };
                for (var i = 0, len = array.length; len > i; i++) for (var j = i, length = array.length; length > j; j++)
                        if (compareFn(array[i], array[j]) > 0) {
                            var t = array[i];
                            array[i] = array[j], array[j] = t
                        }
                return array
            },
            serializeParam: function (json) {
                var strArr = [];
                for (var i in json) if ("method" != i && "timeout" != i && "async" != i) if ("function" != (typeof json[
                            i]).toLowerCase() && "object" != (typeof json[i]).toLowerCase()) strArr.push(
                                encodeURIComponent(i) + "=" + encodeURIComponent(json[i]));
                        else if (utils.isArray(json[i])) for (var j = 0; j < json[i].length; j++) strArr.push(
                            encodeURIComponent(i) + "[]=" + encodeURIComponent(json[i][j]));
                return strArr.join("&")
            },
            formatUrl: function (url) {
                var u = url.replace(/&&/g, "&");
                return u = u.replace(/\?&/g, "?"), u = u.replace(/&$/g, ""), u = u.replace(/&#/g, "#"), u = u.replace(
                    /&+/g, "&")
            },
            isCrossDomainUrl: function (url) {
                var a = document.createElement("a");
                return a.href = url, browser.ie && (a.href = a.href), !(a.protocol == location.protocol && a.hostname ==
                    location.hostname && (a.port == location.port || "80" == a.port && "" == location.port || "" == a.port &&
                    "80" == location.port))
            },
            clearEmptyAttrs: function (obj) {
                for (var p in obj) "" === obj[p] && delete obj[p];
                return obj
            },
            str2json: function (s) {
                return utils.isString(s) ? window.JSON ? JSON.parse(s) : new Function("return " + utils.trim(s || ""))() :
                    null
            },
            json2str: function () {
                function encodeString(source) {
                    return /["\\\x00-\x1f]/.test(source) && (source = source.replace(/["\\\x00-\x1f]/g, function (match) {
                        var c = escapeMap[match];
                        return c ? c : (c = match.charCodeAt(), "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(
                            16))
                    })), '"' + source + '"'
                }
                function encodeArray(source) {
                    var preComma, i, item, result = ["["],
                        l = source.length;
                    for (i = 0; l > i; i++) switch (item = source[i], typeof item) {
                        case "undefined":
                        case "function":
                        case "unknown":
                            break;
                        default:
                            preComma && result.push(","), result.push(utils.json2str(item)), preComma = 1
                    }
                    return result.push("]"), result.join("")
                }
                function pad(source) {
                    return 10 > source ? "0" + source : source
                }
                function encodeDate(source) {
                    return '"' + source.getFullYear() + "-" + pad(source.getMonth() + 1) + "-" + pad(source.getDate()) +
                        "T" + pad(source.getHours()) + ":" + pad(source.getMinutes()) + ":" + pad(source.getSeconds()) +
                        '"'
                }
                if (window.JSON) return JSON.stringify;
                var escapeMap = {
                    "\b": "\\b",
                    "   ": "\\t",
                    "\n": "\\n",
                    "\f": "\\f",
                    "\r": "\\r",
                    '"': '\\"',
                    "\\": "\\\\"
                };
                return function (value) {
                    switch (typeof value) {
                    case "undefined":
                        return "undefined";
                    case "number":
                        return isFinite(value) ? String(value) : "null";
                    case "string":
                        return encodeString(value);
                    case "boolean":
                        return String(value);
                    default:
                        if (null === value) return "null";
                        if (utils.isArray(value)) return encodeArray(value);
                        if (utils.isDate(value)) return encodeDate(value);
                        var preComma, item, result = ["{"],
                            encode = utils.json2str;
                        for (var key in value) if (Object.prototype.hasOwnProperty.call(value, key)) switch (item =
                                    value[key], typeof item) {
                                case "undefined":
                                case "unknown":
                                case "function":
                                    break;
                                default:
                                    preComma && result.push(","), preComma = 1, result.push(encode(key) + ":" + encode(
                                        item))
                            }
                        return result.push("}"), result.join("")
                    }
                }
            }()
        };
    utils.each(["String", "Function", "Array", "Number", "RegExp", "Object", "Date"], function (v) {
        UE.utils["is" + v] = function (obj) {
            return Object.prototype.toString.apply(obj) == "[object " + v + "]"
        }
    });
    var EventBase = UE.EventBase = function () {};
    EventBase.prototype = {
        addListener: function (types, listener) {
            types = utils.trim(types).split(/\s+/);
            for (var ti, i = 0; ti = types[i++];) getListener(this, ti, !0).push(listener)
        },
        on: function (types, listener) {
            return this.addListener(types, listener)
        },
        off: function (types, listener) {
            return this.removeListener(types, listener)
        },
        trigger: function () {
            return this.fireEvent.apply(this, arguments)
        },
        removeListener: function (types, listener) {
            types = utils.trim(types).split(/\s+/);
            for (var ti, i = 0; ti = types[i++];) utils.removeItem(getListener(this, ti) || [], listener)
        },
        fireEvent: function () {
            var types = arguments[0];
            types = utils.trim(types).split(" ");
            for (var ti, i = 0; ti = types[i++];) {
                var r, t, k, listeners = getListener(this, ti);
                if (listeners) for (k = listeners.length; k--;) if (listeners[k]) {
                            if (t = listeners[k].apply(this, arguments), t === !0) return t;
                            void 0 !== t && (r = t)
                        }(t = this["on" + ti.toLowerCase()]) && (r = t.apply(this, arguments))
            }
            return r
        }
    };
    var dtd = dom.dtd = function () {
        function _(s) {
            for (var k in s) s[k.toUpperCase()] = s[k];
            return s
        }
        var X = utils.extend2,
            A = _({
                isindex: 1,
                fieldset: 1
            }),
            B = _({
                input: 1,
                button: 1,
                select: 1,
                textarea: 1,
                label: 1
            }),
            C = X(_({
                a: 1
            }), B),
            D = X({
                iframe: 1
            }, C),
            E = _({
                hr: 1,
                ul: 1,
                menu: 1,
                div: 1,
                blockquote: 1,
                noscript: 1,
                table: 1,
                center: 1,
                address: 1,
                dir: 1,
                pre: 1,
                h5: 1,
                dl: 1,
                h4: 1,
                noframes: 1,
                h6: 1,
                ol: 1,
                h1: 1,
                h3: 1,
                h2: 1
            }),
            F = _({
                ins: 1,
                del: 1,
                script: 1,
                style: 1
            }),
            G = X(_({
                b: 1,
                acronym: 1,
                bdo: 1,
                "var": 1,
                "#": 1,
                abbr: 1,
                code: 1,
                br: 1,
                i: 1,
                cite: 1,
                kbd: 1,
                u: 1,
                strike: 1,
                s: 1,
                tt: 1,
                strong: 1,
                q: 1,
                samp: 1,
                em: 1,
                dfn: 1,
                span: 1
            }), F),
            H = X(_({
                sub: 1,
                img: 1,
                embed: 1,
                object: 1,
                sup: 1,
                basefont: 1,
                map: 1,
                applet: 1,
                font: 1,
                big: 1,
                small: 1
            }), G),
            I = X(_({
                p: 1
            }), H),
            J = X(_({
                iframe: 1
            }), H, B),
            K = _({
                img: 1,
                embed: 1,
                noscript: 1,
                br: 1,
                kbd: 1,
                center: 1,
                button: 1,
                basefont: 1,
                h5: 1,
                h4: 1,
                samp: 1,
                h6: 1,
                ol: 1,
                h1: 1,
                h3: 1,
                h2: 1,
                form: 1,
                font: 1,
                "#": 1,
                select: 1,
                menu: 1,
                ins: 1,
                abbr: 1,
                label: 1,
                code: 1,
                table: 1,
                script: 1,
                cite: 1,
                input: 1,
                iframe: 1,
                strong: 1,
                textarea: 1,
                noframes: 1,
                big: 1,
                small: 1,
                span: 1,
                hr: 1,
                sub: 1,
                bdo: 1,
                "var": 1,
                div: 1,
                object: 1,
                sup: 1,
                strike: 1,
                dir: 1,
                map: 1,
                dl: 1,
                applet: 1,
                del: 1,
                isindex: 1,
                fieldset: 1,
                ul: 1,
                b: 1,
                acronym: 1,
                a: 1,
                blockquote: 1,
                i: 1,
                u: 1,
                s: 1,
                tt: 1,
                address: 1,
                q: 1,
                pre: 1,
                p: 1,
                em: 1,
                dfn: 1
            }),
            L = X(_({
                a: 0
            }), J),
            M = _({
                tr: 1
            }),
            N = _({
                "#": 1
            }),
            O = X(_({
                param: 1
            }), K),
            P = X(_({
                form: 1
            }), A, D, E, I),
            Q = _({
                li: 1,
                ol: 1,
                ul: 1
            }),
            R = _({
                style: 1,
                script: 1
            }),
            S = _({
                base: 1,
                link: 1,
                meta: 1,
                title: 1
            }),
            T = X(S, R),
            U = _({
                head: 1,
                body: 1
            }),
            V = _({
                html: 1
            }),
            block = _({
                address: 1,
                blockquote: 1,
                center: 1,
                dir: 1,
                div: 1,
                dl: 1,
                fieldset: 1,
                form: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1,
                hr: 1,
                isindex: 1,
                menu: 1,
                noframes: 1,
                ol: 1,
                p: 1,
                pre: 1,
                table: 1,
                ul: 1
            }),
            empty = _({
                area: 1,
                base: 1,
                basefont: 1,
                br: 1,
                col: 1,
                command: 1,
                dialog: 1,
                embed: 1,
                hr: 1,
                img: 1,
                input: 1,
                isindex: 1,
                keygen: 1,
                link: 1,
                meta: 1,
                param: 1,
                source: 1,
                track: 1,
                wbr: 1
            });
        return _({
            $nonBodyContent: X(V, U, S),
            $block: block,
            $inline: L,
            $inlineWithA: X(_({
                a: 1
            }), L),
            $body: X(_({
                script: 1,
                style: 1
            }), block),
            $cdata: _({
                script: 1,
                style: 1
            }),
            $empty: empty,
            $nonChild: _({
                iframe: 1,
                textarea: 1
            }),
            $listItem: _({
                dd: 1,
                dt: 1,
                li: 1
            }),
            $list: _({
                ul: 1,
                ol: 1,
                dl: 1
            }),
            $isNotEmpty: _({
                table: 1,
                ul: 1,
                ol: 1,
                dl: 1,
                iframe: 1,
                area: 1,
                base: 1,
                col: 1,
                hr: 1,
                img: 1,
                embed: 1,
                input: 1,
                link: 1,
                meta: 1,
                param: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1
            }),
            $removeEmpty: _({
                a: 1,
                abbr: 1,
                acronym: 1,
                address: 1,
                b: 1,
                bdo: 1,
                big: 1,
                cite: 1,
                code: 1,
                del: 1,
                dfn: 1,
                em: 1,
                font: 1,
                i: 1,
                ins: 1,
                label: 1,
                kbd: 1,
                q: 1,
                s: 1,
                samp: 1,
                small: 1,
                span: 1,
                strike: 1,
                strong: 1,
                sub: 1,
                sup: 1,
                tt: 1,
                u: 1,
                "var": 1
            }),
            $removeEmptyBlock: _({
                p: 1,
                div: 1
            }),
            $tableContent: _({
                caption: 1,
                col: 1,
                colgroup: 1,
                tbody: 1,
                td: 1,
                tfoot: 1,
                th: 1,
                thead: 1,
                tr: 1,
                table: 1
            }),
            $notTransContent: _({
                pre: 1,
                script: 1,
                style: 1,
                textarea: 1
            }),
            html: U,
            head: T,
            style: N,
            script: N,
            body: P,
            base: {},
            link: {},
            meta: {},
            title: N,
            col: {},
            tr: _({
                td: 1,
                th: 1
            }),
            img: {},
            embed: {},
            colgroup: _({
                thead: 1,
                col: 1,
                tbody: 1,
                tr: 1,
                tfoot: 1
            }),
            noscript: P,
            td: P,
            br: {},
            th: P,
            center: P,
            kbd: L,
            button: X(I, E),
            basefont: {},
            h5: L,
            h4: L,
            samp: L,
            h6: L,
            ol: Q,
            h1: L,
            h3: L,
            option: N,
            h2: L,
            form: X(A, D, E, I),
            select: _({
                optgroup: 1,
                option: 1
            }),
            font: L,
            ins: L,
            menu: Q,
            abbr: L,
            label: L,
            table: _({
                thead: 1,
                col: 1,
                tbody: 1,
                tr: 1,
                colgroup: 1,
                caption: 1,
                tfoot: 1
            }),
            code: L,
            tfoot: M,
            cite: L,
            li: P,
            input: {},
            iframe: P,
            strong: L,
            textarea: N,
            noframes: P,
            big: L,
            small: L,
            span: _({
                "#": 1,
                br: 1,
                b: 1,
                strong: 1,
                u: 1,
                i: 1,
                em: 1,
                sub: 1,
                sup: 1,
                strike: 1,
                span: 1
            }),
            hr: L,
            dt: L,
            sub: L,
            optgroup: _({
                option: 1
            }),
            param: {},
            bdo: L,
            "var": L,
            div: P,
            object: O,
            sup: L,
            dd: P,
            strike: L,
            area: {},
            dir: Q,
            map: X(_({
                area: 1,
                form: 1,
                p: 1
            }), A, F, E),
            applet: O,
            dl: _({
                dt: 1,
                dd: 1
            }),
            del: L,
            isindex: {},
            fieldset: X(_({
                legend: 1
            }), K),
            thead: M,
            ul: Q,
            acronym: L,
            b: L,
            a: X(_({
                a: 1
            }), J),
            blockquote: X(_({
                td: 1,
                tr: 1,
                tbody: 1,
                li: 1
            }), P),
            caption: L,
            i: L,
            u: L,
            tbody: M,
            s: L,
            address: X(D, I),
            tt: L,
            legend: L,
            q: L,
            pre: X(G, C),
            p: X(_({
                a: 1
            }), L),
            em: L,
            dfn: L
        })
    }(),
        attrFix = ie && browser.version < 9 ? {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder"
        } : {
            tabindex: "tabIndex",
            readonly: "readOnly"
        }, styleBlock = utils.listToMap(["-webkit-box", "-moz-box", "block", "list-item", "table", "table-row-group",
                "table-header-group", "table-footer-group", "table-row", "table-column-group", "table-column",
                "table-cell", "table-caption"]),
        domUtils = dom.domUtils = {
            NODE_ELEMENT: 1,
            NODE_DOCUMENT: 9,
            NODE_TEXT: 3,
            NODE_COMMENT: 8,
            NODE_DOCUMENT_FRAGMENT: 11,
            POSITION_IDENTICAL: 0,
            POSITION_DISCONNECTED: 1,
            POSITION_FOLLOWING: 2,
            POSITION_PRECEDING: 4,
            POSITION_IS_CONTAINED: 8,
            POSITION_CONTAINS: 16,
            fillChar: ie && "6" == browser.version ? "\ufeff" : "​",
            keys: {
                8: 1,
                46: 1,
                16: 1,
                17: 1,
                18: 1,
                37: 1,
                38: 1,
                39: 1,
                40: 1,
                13: 1
            },
            getPosition: function (nodeA, nodeB) {
                if (nodeA === nodeB) return 0;
                var node, parentsA = [nodeA],
                    parentsB = [nodeB];
                for (node = nodeA; node = node.parentNode;) {
                    if (node === nodeB) return 10;
                    parentsA.push(node)
                }
                for (node = nodeB; node = node.parentNode;) {
                    if (node === nodeA) return 20;
                    parentsB.push(node)
                }
                if (parentsA.reverse(), parentsB.reverse(), parentsA[0] !== parentsB[0]) return 1;
                for (var i = -1; i++, parentsA[i] === parentsB[i];);
                for (nodeA = parentsA[i], nodeB = parentsB[i]; nodeA = nodeA.nextSibling;) if (nodeA === nodeB) return 4;
                return 2
            },
            getNodeIndex: function (node, ignoreTextNode) {
                for (var preNode = node, i = 0; preNode = preNode.previousSibling;) ignoreTextNode && 3 == preNode.nodeType ?
                        preNode.nodeType != preNode.nextSibling.nodeType && i++ : i++;
                return i
            },
            inDoc: function (node, doc) {
                return 10 == domUtils.getPosition(node, doc)
            },
            findParent: function (node, filterFn, includeSelf) {
                if (node && !domUtils.isBody(node)) for (node = includeSelf ? node : node.parentNode; node;) {
                        if (!filterFn || filterFn(node) || domUtils.isBody(node)) return filterFn && !filterFn(node) &&
                                domUtils.isBody(node) ? null : node;
                        node = node.parentNode
                }
                return null
            },
            findParentByTagName: function (node, tagNames, includeSelf, excludeFn) {
                return tagNames = utils.listToMap(utils.isArray(tagNames) ? tagNames : [tagNames]), domUtils.findParent(
                    node, function (node) {
                    return tagNames[node.tagName] && !(excludeFn && excludeFn(node))
                }, includeSelf)
            },
            findParents: function (node, includeSelf, filterFn, closerFirst) {
                for (var parents = includeSelf && (filterFn && filterFn(node) || !filterFn) ? [node] : []; node =
                    domUtils.findParent(node, filterFn);) parents.push(node);
                return closerFirst ? parents : parents.reverse()
            },
            insertAfter: function (node, newNode) {
                return node.nextSibling ? node.parentNode.insertBefore(newNode, node.nextSibling) : node.parentNode.appendChild(
                    newNode)
            },
            remove: function (node, keepChildren) {
                var child, parent = node.parentNode;
                if (parent) {
                    if (keepChildren && node.hasChildNodes()) for (; child = node.firstChild;) parent.insertBefore(
                                child, node);
                    parent.removeChild(node)
                }
                return node
            },
            getNextDomNode: function (node, startFromChild, filterFn, guard) {
                return getDomNode(node, "firstChild", "nextSibling", startFromChild, filterFn, guard)
            },
            getPreDomNode: function (node, startFromChild, filterFn, guard) {
                return getDomNode(node, "lastChild", "previousSibling", startFromChild, filterFn, guard)
            },
            isBookmarkNode: function (node) {
                return 1 == node.nodeType && node.id && /^_baidu_bookmark_/i.test(node.id)
            },
            getWindow: function (node) {
                var doc = node.ownerDocument || node;
                return doc.defaultView || doc.parentWindow
            },
            getCommonAncestor: function (nodeA, nodeB) {
                if (nodeA === nodeB) return nodeA;
                for (var parentsA = [nodeA], parentsB = [nodeB], parent = nodeA, i = -1; parent = parent.parentNode;) {
                    if (parent === nodeB) return parent;
                    parentsA.push(parent)
                }
                for (parent = nodeB; parent = parent.parentNode;) {
                    if (parent === nodeA) return parent;
                    parentsB.push(parent)
                }
                for (parentsA.reverse(), parentsB.reverse(); i++, parentsA[i] === parentsB[i];);
                return 0 == i ? null : parentsA[i - 1]
            },
            clearEmptySibling: function (node, ignoreNext, ignorePre) {
                function clear(next, dir) {
                    for (var tmpNode; next && !domUtils.isBookmarkNode(next) && (domUtils.isEmptyInlineElement(next) || !
                        new RegExp("[^  \n\r" + domUtils.fillChar + "]").test(next.nodeValue));) tmpNode = next[dir],
                            domUtils.remove(next), next = tmpNode
                }!ignoreNext && clear(node.nextSibling, "nextSibling"), !ignorePre && clear(node.previousSibling,
                    "previousSibling")
            },
            split: function (node, offset) {
                var doc = node.ownerDocument;
                if (browser.ie && offset == node.nodeValue.length) {
                    var next = doc.createTextNode("");
                    return domUtils.insertAfter(node, next)
                }
                var retval = node.splitText(offset);
                if (browser.ie8) {
                    var tmpNode = doc.createTextNode("");
                    domUtils.insertAfter(retval, tmpNode), domUtils.remove(tmpNode)
                }
                return retval
            },
            isWhitespace: function (node) {
                return !new RegExp("[^  \n\r" + domUtils.fillChar + "]").test(node.nodeValue)
            },
            getXY: function (element) {
                for (var x = 0, y = 0; element.offsetParent;) y += element.offsetTop, x += element.offsetLeft, element =
                        element.offsetParent;
                return {
                    x: x,
                    y: y
                }
            },
            on: function (element, type, handler) {
                var types = utils.isArray(type) ? type : utils.trim(type).split(/\s+/),
                    k = types.length;
                if (k) for (; k--;) if (type = types[k], element.addEventListener) element.addEventListener(type,
                                handler, !1);
                        else {
                            handler._d || (handler._d = {
                                els: []
                            });
                            var key = type + handler.toString(),
                                index = utils.indexOf(handler._d.els, element);
                            handler._d[key] && -1 != index || (-1 == index && handler._d.els.push(element), handler._d[
                                key] || (handler._d[key] = function (evt) {
                                return handler.call(evt.srcElement, evt || window.event)
                            }), element.attachEvent("on" + type, handler._d[key]))
                        }
                element = null
            },
            un: function (element, type, handler) {
                var types = utils.isArray(type) ? type : utils.trim(type).split(/\s+/),
                    k = types.length;
                if (k) for (; k--;) if (type = types[k], element.removeEventListener) element.removeEventListener(type,
                                handler, !1);
                        else {
                            var key = type + handler.toString();
                            try {
                                element.detachEvent("on" + type, handler._d ? handler._d[key] : handler)
                            } catch (e) {}
                            if (handler._d && handler._d[key]) {
                                var index = utils.indexOf(handler._d.els, element); - 1 != index && handler._d.els.splice(
                                    index, 1), 0 == handler._d.els.length && delete handler._d[key]
                            }
                        }
            },
            isSameElement: function (nodeA, nodeB) {
                if (nodeA.tagName != nodeB.tagName) return !1;
                var thisAttrs = nodeA.attributes,
                    otherAttrs = nodeB.attributes;
                if (!ie && thisAttrs.length != otherAttrs.length) return !1;
                for (var attrA, attrB, al = 0, bl = 0, i = 0; attrA = thisAttrs[i++];) {
                    if ("style" == attrA.nodeName) {
                        if (attrA.specified && al++, domUtils.isSameStyle(nodeA, nodeB)) continue;
                        return !1
                    }
                    if (ie) {
                        if (!attrA.specified) continue;
                        al++, attrB = otherAttrs.getNamedItem(attrA.nodeName)
                    } else attrB = nodeB.attributes[attrA.nodeName]; if (!attrB.specified || attrA.nodeValue != attrB.nodeValue)
                        return !1
                }
                if (ie) {
                    for (i = 0; attrB = otherAttrs[i++];) attrB.specified && bl++;
                    if (al != bl) return !1
                }
                return !0
            },
            isSameStyle: function (nodeA, nodeB) {
                var styleA = nodeA.style.cssText.replace(/( ?; ?)/g, ";").replace(/( ?: ?)/g, ":"),
                    styleB = nodeB.style.cssText.replace(/( ?; ?)/g, ";").replace(/( ?: ?)/g, ":");
                if (browser.opera) {
                    if (styleA = nodeA.style, styleB = nodeB.style, styleA.length != styleB.length) return !1;
                    for (var p in styleA) if (!/^(\d+|csstext)$/i.test(p) && styleA[p] != styleB[p]) return !1;
                    return !0
                }
                if (!styleA || !styleB) return styleA == styleB;
                if (styleA = styleA.split(";"), styleB = styleB.split(";"), styleA.length != styleB.length) return !1;
                for (var ci, i = 0; ci = styleA[i++];) if (-1 == utils.indexOf(styleB, ci)) return !1;
                return !0
            },
            isBlockElm: function (node) {
                return 1 == node.nodeType && (dtd.$block[node.tagName] || styleBlock[domUtils.getComputedStyle(node,
                    "display")]) && !dtd.$nonChild[node.tagName]
            },
            isBody: function (node) {
                return node && 1 == node.nodeType && "body" == node.tagName.toLowerCase()
            },
            breakParent: function (node, parent) {
                var tmpNode, leftNodes, rightNodes, parentClone = node,
                    clone = node;
                do {
                    for (parentClone = parentClone.parentNode, leftNodes ? (tmpNode = parentClone.cloneNode(!1),
                        tmpNode.appendChild(leftNodes), leftNodes = tmpNode, tmpNode = parentClone.cloneNode(!1),
                        tmpNode.appendChild(rightNodes), rightNodes = tmpNode) : (leftNodes = parentClone.cloneNode(!1),
                        rightNodes = leftNodes.cloneNode(!1)); tmpNode = clone.previousSibling;) leftNodes.insertBefore(
                            tmpNode, leftNodes.firstChild);
                    for (; tmpNode = clone.nextSibling;) rightNodes.appendChild(tmpNode);
                    clone = parentClone
                } while (parent !== parentClone);
                return tmpNode = parent.parentNode, tmpNode.insertBefore(leftNodes, parent), tmpNode.insertBefore(
                    rightNodes, parent), tmpNode.insertBefore(node, rightNodes), domUtils.remove(parent), node
            },
            isEmptyInlineElement: function (node) {
                if (1 != node.nodeType || !dtd.$removeEmpty[node.tagName]) return 0;
                for (node = node.firstChild; node;) {
                    if (domUtils.isBookmarkNode(node)) return 0;
                    if (1 == node.nodeType && !domUtils.isEmptyInlineElement(node) || 3 == node.nodeType && !domUtils.isWhitespace(
                        node)) return 0;
                    node = node.nextSibling
                }
                return 1
            },
            trimWhiteTextNode: function (node) {
                function remove(dir) {
                    for (var child;
                    (child = node[dir]) && 3 == child.nodeType && domUtils.isWhitespace(child);) node.removeChild(child)
                }
                remove("firstChild"), remove("lastChild")
            },
            mergeChild: function (node, tagName, attrs) {
                for (var ci, list = domUtils.getElementsByTagName(node, node.tagName.toLowerCase()), i = 0; ci = list[i++];)
                    if (ci.parentNode && !domUtils.isBookmarkNode(ci)) if ("span" != ci.tagName.toLowerCase()) domUtils
                                .isSameElement(node, ci) && domUtils.remove(ci, !0);
                        else {
                            if (node === ci.parentNode && (domUtils.trimWhiteTextNode(node), 1 == node.childNodes.length)) {
                                node.style.cssText = ci.style.cssText + ";" + node.style.cssText, domUtils.remove(ci, !
                                    0);
                                continue
                            }
                            if (ci.style.cssText = node.style.cssText + ";" + ci.style.cssText, attrs) {
                                var style = attrs.style;
                                if (style) {
                                    style = style.split(";");
                                    for (var s, j = 0; s = style[j++];) ci.style[utils.cssStyleToDomStyle(s.split(":")[
                                            0])] = s.split(":")[1]
                                }
                            }
                            domUtils.isSameStyle(ci, node) && domUtils.remove(ci, !0)
                        }
            },
            getElementsByTagName: function (node, name, filter) {
                if (filter && utils.isString(filter)) {
                    var className = filter;
                    filter = function (node) {
                        return domUtils.hasClass(node, className)
                    }
                }
                name = utils.trim(name).replace(/[ ]{2,}/g, " ").split(" ");
                for (var ni, arr = [], n = 0; ni = name[n++];) for (var ci, list = node.getElementsByTagName(ni), i = 0; ci =
                        list[i++];)(!filter || filter(ci)) && arr.push(ci);
                return arr
            },
            mergeToParent: function (node) {
                for (var parent = node.parentNode; parent && dtd.$removeEmpty[parent.tagName];) {
                    if (parent.tagName == node.tagName || "A" == parent.tagName) {
                        if (domUtils.trimWhiteTextNode(parent), "SPAN" == parent.tagName && !domUtils.isSameStyle(
                            parent, node) || "A" == parent.tagName && "SPAN" == node.tagName) {
                            if (parent.childNodes.length > 1 || parent !== node.parentNode) {
                                node.style.cssText = parent.style.cssText + ";" + node.style.cssText, parent = parent.parentNode;
                                continue
                            }
                            parent.style.cssText += ";" + node.style.cssText, "A" == parent.tagName && (parent.style.textDecoration =
                                "underline")
                        }
                        if ("A" != parent.tagName) {
                            parent === node.parentNode && domUtils.remove(node, !0);
                            break
                        }
                    }
                    parent = parent.parentNode
                }
            },
            mergeSibling: function (node, ignorePre, ignoreNext) {
                function merge(rtl, start, node) {
                    var next;
                    if ((next = node[rtl]) && !domUtils.isBookmarkNode(next) && 1 == next.nodeType && domUtils.isSameElement(
                        node, next)) {
                        for (; next.firstChild;) "firstChild" == start ? node.insertBefore(next.lastChild, node.firstChild) :
                                node.appendChild(next.firstChild);
                        domUtils.remove(next)
                    }
                }!ignorePre && merge("previousSibling", "firstChild", node), !ignoreNext && merge("nextSibling",
                    "lastChild", node)
            },
            unSelectable: ie && browser.ie9below || browser.opera ? function (node) {
                node.onselectstart = function () {
                    return !1
                }, node.onclick = node.onkeyup = node.onkeydown = function () {
                    return !1
                }, node.unselectable = "on", node.setAttribute("unselectable", "on");
                for (var ci, i = 0; ci = node.all[i++];) switch (ci.tagName.toLowerCase()) {
                    case "iframe":
                    case "textarea":
                    case "input":
                    case "select":
                        break;
                    default:
                        ci.unselectable = "on", node.setAttribute("unselectable", "on")
                }
            } : function (node) {
                node.style.MozUserSelect = node.style.webkitUserSelect = node.style.msUserSelect = node.style.KhtmlUserSelect =
                    "none"
            },
            removeAttributes: function (node, attrNames) {
                attrNames = utils.isArray(attrNames) ? attrNames : utils.trim(attrNames).replace(/[ ]{2,}/g, " ").split(
                    " ");
                for (var ci, i = 0; ci = attrNames[i++];) {
                    switch (ci = attrFix[ci] || ci) {
                    case "className":
                        node[ci] = "";
                        break;
                    case "style":
                        node.style.cssText = "";
                        var val = node.getAttributeNode("style");
                        !browser.ie && val && node.removeAttributeNode(val)
                    }
                    node.removeAttribute(ci)
                }
            },
            createElement: function (doc, tag, attrs) {
                return domUtils.setAttributes(doc.createElement(tag), attrs)
            },
            setAttributes: function (node, attrs) {
                for (var attr in attrs) if (attrs.hasOwnProperty(attr)) {
                        var value = attrs[attr];
                        switch (attr) {
                        case "class":
                            node.className = value;
                            break;
                        case "style":
                            node.style.cssText = node.style.cssText + ";" + value;
                            break;
                        case "innerHTML":
                            node[attr] = value;
                            break;
                        case "value":
                            node.value = value;
                            break;
                        default:
                            node.setAttribute(attrFix[attr] || attr, value)
                        }
                    }
                return node
            },
            getComputedStyle: function (element, styleName) {
                var pros = "width height top left";
                if (pros.indexOf(styleName) > -1) return element["offset" + styleName.replace(/^\w/, function (s) {
                        return s.toUpperCase()
                    })] + "px";
                if (3 == element.nodeType && (element = element.parentNode), browser.ie && browser.version < 9 &&
                    "font-size" == styleName && !element.style.fontSize && !dtd.$empty[element.tagName] && !dtd.$nonChild[
                    element.tagName]) {
                    var span = element.ownerDocument.createElement("span");
                    span.style.cssText = "padding:0;border:0;font-family:simsun;", span.innerHTML = ".", element.appendChild(
                        span);
                    var result = span.offsetHeight;
                    return element.removeChild(span), span = null, result + "px"
                }
                try {
                    var value = domUtils.getStyle(element, styleName) || (window.getComputedStyle ? domUtils.getWindow(
                        element).getComputedStyle(element, "").getPropertyValue(styleName) : (element.currentStyle ||
                        element.style)[utils.cssStyleToDomStyle(styleName)])
                } catch (e) {
                    return ""
                }
                return utils.transUnitToPx(utils.fixColor(styleName, value))
            },
            removeClasses: function (elm, classNames) {
                classNames = utils.isArray(classNames) ? classNames : utils.trim(classNames).replace(/[ ]{2,}/g, " ").split(
                    " ");
                for (var ci, i = 0, cls = elm.className; ci = classNames[i++];) cls = cls.replace(new RegExp("\\b" + ci +
                        "\\b"), "");
                cls = utils.trim(cls).replace(/[ ]{2,}/g, " "), cls ? elm.className = cls : domUtils.removeAttributes(
                    elm, ["class"])
            },
            addClass: function (elm, classNames) {
                if (elm) {
                    classNames = utils.trim(classNames).replace(/[ ]{2,}/g, " ").split(" ");
                    for (var ci, i = 0, cls = elm.className; ci = classNames[i++];) new RegExp("\\b" + ci + "\\b").test(
                            cls) || (cls += " " + ci);
                    elm.className = utils.trim(cls)
                }
            },
            hasClass: function (element, className) {
                var classNameTarget = "string" == typeof element ? element : element.className;
                if (utils.isRegExp(className)) return className.test(classNameTarget);
                className = utils.trim(className).replace(/[ ]{2,}/g, " ").split(" ");
                for (var ci, i = 0, cls = classNameTarget; ci = className[i++];) if (!new RegExp("\\b" + ci + "\\b",
                        "i").test(cls)) return !1;
                return i - 1 == className.length
            },
            preventDefault: function (evt) {
                evt.preventDefault ? evt.preventDefault() : evt.returnValue = !1
            },
            removeStyle: function (element, name) {
                browser.ie ? ("color" == name && (name = "(^|;)" + name), element.style.cssText = element.style.cssText
                    .replace(new RegExp(name + "[^:]*:[^;]+;?", "ig"), "")) : element.style.removeProperty ? element.style
                    .removeProperty(name) : element.style.removeAttribute(utils.cssStyleToDomStyle(name)), element.style
                    .cssText || domUtils.removeAttributes(element, ["style"])
            },
            getStyle: function (element, name) {
                var value = element.style[utils.cssStyleToDomStyle(name)];
                return utils.fixColor(name, value)
            },
            setStyle: function (element, name, value) {
                element.style[utils.cssStyleToDomStyle(name)] = value,
                utils.trim(element.style.cssText) || this.removeAttributes(element, "style")
            },
            setStyles: function (element, styles) {
                for (var name in styles) styles.hasOwnProperty(name) && domUtils.setStyle(element, name, styles[name])
            },
            removeDirtyAttr: function (node) {
                for (var ci, i = 0, nodes = node.getElementsByTagName("*"); ci = nodes[i++];) ci.removeAttribute(
                        "_moz_dirty");
                node.removeAttribute("_moz_dirty")
            },
            getChildCount: function (node, fn) {
                var count = 0,
                    first = node.firstChild;
                for (fn = fn || function () {
                    return 1
                }; first;) fn(first) && count++, first = first.nextSibling;
                return count
            },
            isEmptyNode: function (node) {
                return !node.firstChild || 0 == domUtils.getChildCount(node, function (node) {
                    return !domUtils.isBr(node) && !domUtils.isBookmarkNode(node) && !domUtils.isWhitespace(node)
                })
            },
            clearSelectedArr: function (nodes) {
                for (var node; node = nodes.pop();) domUtils.removeAttributes(node, ["class"])
            },
            scrollToView: function (node, win, offsetTop) {
                var getViewPaneSize = function () {
                    var doc = win.document,
                        mode = "CSS1Compat" == doc.compatMode;
                    return {
                        width: (mode ? doc.documentElement.clientWidth : doc.body.clientWidth) || 0,
                        height: (mode ? doc.documentElement.clientHeight : doc.body.clientHeight) || 0
                    }
                }, getScrollPosition = function (win) {
                        if ("pageXOffset" in win) return {
                                x: win.pageXOffset || 0,
                                y: win.pageYOffset || 0
                        };
                        var doc = win.document;
                        return {
                            x: doc.documentElement.scrollLeft || doc.body.scrollLeft || 0,
                            y: doc.documentElement.scrollTop || doc.body.scrollTop || 0
                        }
                    }, winHeight = getViewPaneSize().height,
                    offset = -1 * winHeight + offsetTop;
                offset += node.offsetHeight || 0;
                var elementPosition = domUtils.getXY(node);
                offset += elementPosition.y;
                var currentScroll = getScrollPosition(win).y;
                (offset > currentScroll || currentScroll - winHeight > offset) && win.scrollTo(0, offset + (0 > offset ? -
                    20 : 20))
            },
            isBr: function (node) {
                return 1 == node.nodeType && "BR" == node.tagName
            },
            isFillChar: function (node, isInStart) {
                if (3 != node.nodeType) return !1;
                var text = node.nodeValue;
                return isInStart ? new RegExp("^" + domUtils.fillChar).test(text) : !text.replace(new RegExp(domUtils.fillChar,
                    "g"), "").length
            },
            isStartInblock: function (range) {
                var tmp, tmpRange = range.cloneRange(),
                    flag = 0,
                    start = tmpRange.startContainer;
                if (1 == start.nodeType && start.childNodes[tmpRange.startOffset]) {
                    start = start.childNodes[tmpRange.startOffset];
                    for (var pre = start.previousSibling; pre && domUtils.isFillChar(pre);) start = pre, pre = pre.previousSibling
                }
                for (this.isFillChar(start, !0) && 1 == tmpRange.startOffset && (tmpRange.setStartBefore(start), start =
                    tmpRange.startContainer); start && domUtils.isFillChar(start);) tmp = start, start = start.previousSibling;
                for (tmp && (tmpRange.setStartBefore(tmp), start = tmpRange.startContainer), 1 == start.nodeType &&
                    domUtils.isEmptyNode(start) && 1 == tmpRange.startOffset && tmpRange.setStart(start, 0).collapse(!0); !
                    tmpRange.startOffset;) {
                    if (start = tmpRange.startContainer, domUtils.isBlockElm(start) || domUtils.isBody(start)) {
                        flag = 1;
                        break
                    }
                    var tmpNode, pre = tmpRange.startContainer.previousSibling;
                    if (pre) {
                        for (; pre && domUtils.isFillChar(pre);) tmpNode = pre, pre = pre.previousSibling;
                        tmpRange.setStartBefore(tmpNode ? tmpNode : tmpRange.startContainer)
                    } else tmpRange.setStartBefore(tmpRange.startContainer)
                }
                return flag && !domUtils.isBody(tmpRange.startContainer) ? 1 : 0
            },
            isEmptyBlock: function (node, reg) {
                if (1 != node.nodeType) return 0;
                if (reg = reg || new RegExp("[     \r\n" + domUtils.fillChar + "]", "g"), node[browser.ie ? "innerText" :
                    "textContent"].replace(reg, "").length > 0) return 0;
                for (var n in dtd.$isNotEmpty) if (node.getElementsByTagName(n).length) return 0;
                return 1
            },
            setViewportOffset: function (element, offset) {
                var left = 0 | parseInt(element.style.left),
                    top = 0 | parseInt(element.style.top),
                    rect = element.getBoundingClientRect(),
                    offsetLeft = offset.left - rect.left,
                    offsetTop = offset.top - rect.top;
                offsetLeft && (element.style.left = left + offsetLeft + "px"), offsetTop && (element.style.top = top +
                    offsetTop + "px")
            },
            fillNode: function (doc, node) {
                var tmpNode = browser.ie ? doc.createTextNode(domUtils.fillChar) : doc.createElement("br");
                node.innerHTML = "", node.appendChild(tmpNode)
            },
            moveChild: function (src, tag, dir) {
                for (; src.firstChild;) dir && tag.firstChild ? tag.insertBefore(src.lastChild, tag.firstChild) : tag.appendChild(
                        src.firstChild)
            },
            hasNoAttributes: function (node) {
                return browser.ie ? /^<\w+\s*?>/.test(node.outerHTML) : 0 == node.attributes.length
            },
            isCustomeNode: function (node) {
                return 1 == node.nodeType && node.getAttribute("_ue_custom_node_")
            },
            isTagNode: function (node, tagNames) {
                return 1 == node.nodeType && new RegExp("\\b" + node.tagName + "\\b", "i").test(tagNames)
            },
            filterNodeList: function (nodelist, filter, forAll) {
                var results = [];
                if (!utils.isFunction(filter)) {
                    var str = filter;
                    filter = function (n) {
                        return -1 != utils.indexOf(utils.isArray(str) ? str : str.split(" "), n.tagName.toLowerCase())
                    }
                }
                return utils.each(nodelist, function (n) {
                    filter(n) && results.push(n)
                }), 0 == results.length ? null : 1 != results.length && forAll ? results : results[0]
            },
            isInNodeEndBoundary: function (rng, node) {
                var start = rng.startContainer;
                if (3 == start.nodeType && rng.startOffset != start.nodeValue.length) return 0;
                if (1 == start.nodeType && rng.startOffset != start.childNodes.length) return 0;
                for (; start !== node;) {
                    if (start.nextSibling) return 0;
                    start = start.parentNode
                }
                return 1
            },
            isBoundaryNode: function (node, dir) {
                for (var tmp; !domUtils.isBody(node);) if (tmp = node, node = node.parentNode, tmp !== node[dir]) return !
                            1;
                return !0
            },
            fillHtml: browser.ie11below ? " " : "<br/>"
        }, fillCharReg = new RegExp(domUtils.fillChar, "g");
    ! function () {
        function updateCollapse(range) {
            range.collapsed = range.startContainer && range.endContainer && range.startContainer === range.endContainer &&
                range.startOffset == range.endOffset
        }
        function selectOneNode(rng) {
            return !rng.collapsed && 1 == rng.startContainer.nodeType && rng.startContainer === rng.endContainer && rng
                .endOffset - rng.startOffset == 1
        }
        function setEndPoint(toStart, node, offset, range) {
            return 1 == node.nodeType && (dtd.$empty[node.tagName] || dtd.$nonChild[node.tagName]) && (offset =
                domUtils.getNodeIndex(node) + (toStart ? 0 : 1), node = node.parentNode), toStart ? (range.startContainer =
                node, range.startOffset = offset, range.endContainer || range.collapse(!0)) : (range.endContainer =
                node, range.endOffset = offset, range.startContainer || range.collapse(!1)), updateCollapse(range),
                range
        }
        function execContentsAction(range, action) {
            var tmpStart, tmpEnd, start = range.startContainer,
                end = range.endContainer,
                startOffset = range.startOffset,
                endOffset = range.endOffset,
                doc = range.document,
                frag = doc.createDocumentFragment();
            if (1 == start.nodeType && (start = start.childNodes[startOffset] || (tmpStart = start.appendChild(doc.createTextNode(
                "")))), 1 == end.nodeType && (end = end.childNodes[endOffset] || (tmpEnd = end.appendChild(doc.createTextNode(
                "")))), start === end && 3 == start.nodeType) return frag.appendChild(doc.createTextNode(start.substringData(
                    startOffset, endOffset - startOffset))), action && (start.deleteData(startOffset, endOffset -
                    startOffset), range.collapse(!0)), frag;
            for (var current, currentLevel, clone = frag, startParents = domUtils.findParents(start, !0), endParents =
                    domUtils.findParents(end, !0), i = 0; startParents[i] == endParents[i];) i++;
            for (var si, j = i; si = startParents[j]; j++) {
                for (current = si.nextSibling, si == start ? tmpStart || (3 == range.startContainer.nodeType ? (clone.appendChild(
                    doc.createTextNode(start.nodeValue.slice(startOffset))), action && start.deleteData(startOffset,
                    start.nodeValue.length - startOffset)) : clone.appendChild(action ? start : start.cloneNode(!0))) :
                    (currentLevel = si.cloneNode(!1), clone.appendChild(currentLevel)); current && current !== end &&
                    current !== endParents[j];) si = current.nextSibling, clone.appendChild(action ? current : current.cloneNode(!
                        0)), current = si;
                clone = currentLevel
            }
            clone = frag, startParents[i] || (clone.appendChild(startParents[i - 1].cloneNode(!1)), clone = clone.firstChild);
            for (var ei, j = i; ei = endParents[j]; j++) {
                if (current = ei.previousSibling, ei == end ? tmpEnd || 3 != range.endContainer.nodeType || (clone.appendChild(
                    doc.createTextNode(end.substringData(0, endOffset))), action && end.deleteData(0, endOffset)) : (
                    currentLevel = ei.cloneNode(!1), clone.appendChild(currentLevel)), j != i || !startParents[i]) for (; current &&
                        current !== start;) ei = current.previousSibling, clone.insertBefore(action ? current : current
                            .cloneNode(!0), clone.firstChild), current = ei;
                clone = currentLevel
            }
            return action && range.setStartBefore(endParents[i] ? startParents[i] ? endParents[i] : startParents[i - 1] :
                endParents[i - 1]).collapse(!0), tmpStart && domUtils.remove(tmpStart), tmpEnd && domUtils.remove(
                tmpEnd), frag
        }
        function removeFillData(doc, excludeNode) {
            try {
                if (fillData && domUtils.inDoc(fillData, doc)) if (fillData.nodeValue.replace(fillCharReg, "").length)
                        fillData.nodeValue = fillData.nodeValue.replace(fillCharReg, "");
                    else {
                        var tmpNode = fillData.parentNode;
                        for (domUtils.remove(fillData); tmpNode && domUtils.isEmptyInlineElement(tmpNode) && (browser.safari ? !
                            (domUtils.getPosition(tmpNode, excludeNode) & domUtils.POSITION_CONTAINS) : !tmpNode.contains(
                            excludeNode));) fillData = tmpNode.parentNode, domUtils.remove(tmpNode), tmpNode = fillData
                    }
            } catch (e) {}
        }
        function mergeSibling(node, dir) {
            var tmpNode;
            for (node = node[dir]; node && domUtils.isFillChar(node);) tmpNode = node[dir], domUtils.remove(node), node =
                    tmpNode
        }
        var fillData, guid = 0,
            fillChar = domUtils.fillChar,
            Range = dom.Range = function (document) {
                var me = this;
                me.startContainer = me.startOffset = me.endContainer = me.endOffset = null, me.document = document, me.collapsed = !
                    0
            };
        Range.prototype = {
            cloneContents: function () {
                return this.collapsed ? null : execContentsAction(this, 0)
            },
            deleteContents: function () {
                var txt;
                return this.collapsed || execContentsAction(this, 1), browser.webkit && (txt = this.startContainer, 3 !=
                    txt.nodeType || txt.nodeValue.length || (this.setStartBefore(txt).collapse(!0), domUtils.remove(txt))),
                    this
            },
            extractContents: function () {
                return this.collapsed ? null : execContentsAction(this, 2)
            },
            setStart: function (node, offset) {
                return setEndPoint(!0, node, offset, this)
            },
            setEnd: function (node, offset) {
                return setEndPoint(!1, node, offset, this)
            },
            setStartAfter: function (node) {
                return this.setStart(node.parentNode, domUtils.getNodeIndex(node) + 1)
            },
            setStartBefore: function (node) {
                return this.setStart(node.parentNode, domUtils.getNodeIndex(node))
            },
            setEndAfter: function (node) {
                return this.setEnd(node.parentNode, domUtils.getNodeIndex(node) + 1)
            },
            setEndBefore: function (node) {
                return this.setEnd(node.parentNode, domUtils.getNodeIndex(node))
            },
            setStartAtFirst: function (node) {
                return this.setStart(node, 0)
            },
            setStartAtLast: function (node) {
                return this.setStart(node, 3 == node.nodeType ? node.nodeValue.length : node.childNodes.length)
            },
            setEndAtFirst: function (node) {
                return this.setEnd(node, 0)
            },
            setEndAtLast: function (node) {
                return this.setEnd(node, 3 == node.nodeType ? node.nodeValue.length : node.childNodes.length)
            },
            selectNode: function (node) {
                return this.setStartBefore(node).setEndAfter(node)
            },
            selectNodeContents: function (node) {
                return this.setStart(node, 0).setEndAtLast(node)
            },
            cloneRange: function () {
                var me = this;
                return new Range(me.document).setStart(me.startContainer, me.startOffset).setEnd(me.endContainer, me.endOffset)
            },
            collapse: function (toStart) {
                var me = this;
                return toStart ? (me.endContainer = me.startContainer, me.endOffset = me.startOffset) : (me.startContainer =
                    me.endContainer, me.startOffset = me.endOffset), me.collapsed = !0, me
            },
            shrinkBoundary: function (ignoreEnd) {
                function check(node) {
                    return 1 == node.nodeType && !domUtils.isBookmarkNode(node) && !dtd.$empty[node.tagName] && !dtd.$nonChild[
                        node.tagName]
                }
                for (var child, me = this, collapsed = me.collapsed; 1 == me.startContainer.nodeType && (child = me.startContainer
                    .childNodes[me.startOffset]) && check(child);) me.setStart(child, 0);
                if (collapsed) return me.collapse(!0);
                if (!ignoreEnd) for (; 1 == me.endContainer.nodeType && me.endOffset > 0 && (child = me.endContainer.childNodes[
                        me.endOffset - 1]) && check(child);) me.setEnd(child, child.childNodes.length);
                return me
            },
            getCommonAncestor: function (includeSelf, ignoreTextNode) {
                var me = this,
                    start = me.startContainer,
                    end = me.endContainer;
                return start === end ? includeSelf && selectOneNode(this) && (start = start.childNodes[me.startOffset],
                    1 == start.nodeType) ? start : ignoreTextNode && 3 == start.nodeType ? start.parentNode : start :
                    domUtils.getCommonAncestor(start, end)
            },
            trimBoundary: function (ignoreEnd) {
                this.txtToElmBoundary();
                var start = this.startContainer,
                    offset = this.startOffset,
                    collapsed = this.collapsed,
                    end = this.endContainer;
                if (3 == start.nodeType) {
                    if (0 == offset) this.setStartBefore(start);
                    else if (offset >= start.nodeValue.length) this.setStartAfter(start);
                    else {
                        var textNode = domUtils.split(start, offset);
                        start === end ? this.setEnd(textNode, this.endOffset - offset) : start.parentNode === end && (
                            this.endOffset += 1), this.setStartBefore(textNode)
                    } if (collapsed) return this.collapse(!0)
                }
                return ignoreEnd || (offset = this.endOffset, end = this.endContainer, 3 == end.nodeType && (0 ==
                    offset ? this.setEndBefore(end) : (offset < end.nodeValue.length && domUtils.split(end, offset),
                    this.setEndAfter(end)))), this
            },
            txtToElmBoundary: function (ignoreCollapsed) {
                function adjust(r, c) {
                    var container = r[c + "Container"],
                        offset = r[c + "Offset"];
                    3 == container.nodeType && (offset ? offset >= container.nodeValue.length && r["set" + c.replace(
                        /(\w)/, function (a) {
                        return a.toUpperCase()
                    }) + "After"](container) : r["set" + c.replace(/(\w)/, function (a) {
                        return a.toUpperCase()
                    }) + "Before"](container))
                }
                return (ignoreCollapsed || !this.collapsed) && (adjust(this, "start"), adjust(this, "end")), this
            },
            insertNode: function (node) {
                var first = node,
                    length = 1;
                11 == node.nodeType && (first = node.firstChild, length = node.childNodes.length), this.trimBoundary(!0);
                var start = this.startContainer,
                    offset = this.startOffset,
                    nextNode = start.childNodes[offset];
                return nextNode ? start.insertBefore(node, nextNode) : start.appendChild(node), first.parentNode ===
                    this.endContainer && (this.endOffset = this.endOffset + length), this.setStartBefore(first)
            },
            setCursor: function (toEnd, noFillData) {
                return this.collapse(!toEnd).select(noFillData)
            },
            createBookmark: function (serialize, same) {
                var endNode, startNode = this.document.createElement("span");
                return startNode.style.cssText = "display:none;line-height:0px;", startNode.appendChild(this.document.createTextNode(
                    "‍")), startNode.id = "_baidu_bookmark_start_" + (same ? "" : guid++), this.collapsed || (endNode =
                    startNode.cloneNode(!0), endNode.id = "_baidu_bookmark_end_" + (same ? "" : guid++)), this.insertNode(
                    startNode), endNode && this.collapse().insertNode(endNode).setEndBefore(endNode), this.setStartAfter(
                    startNode), {
                    start: serialize ? startNode.id : startNode,
                    end: endNode ? serialize ? endNode.id : endNode : null,
                    id: serialize
                }
            },
            moveToBookmark: function (bookmark) {
                var start = bookmark.id ? this.document.getElementById(bookmark.start) : bookmark.start,
                    end = bookmark.end && bookmark.id ? this.document.getElementById(bookmark.end) : bookmark.end;
                return this.setStartBefore(start), domUtils.remove(start), end ? (this.setEndBefore(end), domUtils.remove(
                    end)) : this.collapse(!0), this
            },
            enlarge: function (toBlock, stopFn) {
                var pre, node, isBody = domUtils.isBody,
                    tmp = this.document.createTextNode("");
                if (toBlock) {
                    for (node = this.startContainer, 1 == node.nodeType ? node.childNodes[this.startOffset] ? pre =
                        node = node.childNodes[this.startOffset] : (node.appendChild(tmp), pre = node = tmp) : pre =
                        node;;) {
                        if (domUtils.isBlockElm(node)) {
                            for (node = pre;
                            (pre = node.previousSibling) && !domUtils.isBlockElm(pre);) node = pre;
                            this.setStartBefore(node);
                            break
                        }
                        pre = node, node = node.parentNode
                    }
                    for (node = this.endContainer, 1 == node.nodeType ? ((pre = node.childNodes[this.endOffset]) ? node
                        .insertBefore(tmp, pre) : node.appendChild(tmp), pre = node = tmp) : pre = node;;) {
                        if (domUtils.isBlockElm(node)) {
                            for (node = pre;
                            (pre = node.nextSibling) && !domUtils.isBlockElm(pre);) node = pre;
                            this.setEndAfter(node);
                            break
                        }
                        pre = node, node = node.parentNode
                    }
                    tmp.parentNode === this.endContainer && this.endOffset--, domUtils.remove(tmp)
                }
                if (!this.collapsed) {
                    for (; !(0 != this.startOffset || stopFn && stopFn(this.startContainer) || isBody(this.startContainer));)
                        this.setStartBefore(this.startContainer);
                    for (; !(this.endOffset != (1 == this.endContainer.nodeType ? this.endContainer.childNodes.length :
                        this.endContainer.nodeValue.length) || stopFn && stopFn(this.endContainer) || isBody(this.endContainer));)
                        this.setEndAfter(this.endContainer)
                }
                return this
            },
            enlargeToBlockElm: function (ignoreEnd) {
                for (; !domUtils.isBlockElm(this.startContainer);) this.setStartBefore(this.startContainer);
                if (!ignoreEnd) for (; !domUtils.isBlockElm(this.endContainer);) this.setEndAfter(this.endContainer);
                return this
            },
            adjustmentBoundary: function () {
                if (!this.collapsed) {
                    for (; !domUtils.isBody(this.startContainer) && this.startOffset == this.startContainer[3 == this.startContainer
                        .nodeType ? "nodeValue" : "childNodes"].length && this.startContainer[3 == this.startContainer.nodeType ?
                        "nodeValue" : "childNodes"].length;) this.setStartAfter(this.startContainer);
                    for (; !domUtils.isBody(this.endContainer) && !this.endOffset && this.endContainer[3 == this.endContainer
                        .nodeType ? "nodeValue" : "childNodes"].length;) this.setEndBefore(this.endContainer)
                }
                return this
            },
            applyInlineStyle: function (tagName, attrs, list) {
                if (this.collapsed) return this;
                this.trimBoundary().enlarge(!1, function (node) {
                    return 1 == node.nodeType && domUtils.isBlockElm(node)
                }).adjustmentBoundary();
                for (var node, pre, bookmark = this.createBookmark(), end = bookmark.end, filterFn = function (node) {
                        return 1 == node.nodeType ? "br" != node.tagName.toLowerCase() : !domUtils.isWhitespace(node)
                    }, current = domUtils.getNextDomNode(bookmark.start, !1, filterFn), range = this.cloneRange(); current &&
                    domUtils.getPosition(current, end) & domUtils.POSITION_PRECEDING;) if (3 == current.nodeType || dtd[
                        tagName][current.tagName]) {
                        for (range.setStartBefore(current), node = current; node && (3 == node.nodeType || dtd[tagName][
                                node.tagName]) && node !== end;) pre = node, node = domUtils.getNextDomNode(node, 1 ==
                                node.nodeType, null, function (parent) {
                                return dtd[tagName][parent.tagName]
                            });
                        var elm, frag = range.setEndAfter(pre).extractContents();
                        if (list && list.length > 0) {
                            var level, top;
                            top = level = list[0].cloneNode(!1);
                            for (var ci, i = 1; ci = list[i++];) level.appendChild(ci.cloneNode(!1)), level = level.firstChild;
                            elm = level
                        } else elm = range.document.createElement(tagName);
                        attrs && domUtils.setAttributes(elm, attrs), elm.appendChild(frag), range.insertNode(list ? top :
                            elm);
                        var aNode;
                        if ("span" == tagName && attrs.style && /text\-decoration/.test(attrs.style) && (aNode =
                            domUtils.findParentByTagName(elm, "a", !0)) ? (domUtils.setAttributes(aNode, attrs),
                            domUtils.remove(elm, !0), elm = aNode) : (domUtils.mergeSibling(elm), domUtils.clearEmptySibling(
                            elm)), domUtils.mergeChild(elm, attrs), current = domUtils.getNextDomNode(elm, !1, filterFn),
                            domUtils.mergeToParent(elm), node === end) break
                    } else current = domUtils.getNextDomNode(current, !0, filterFn);
                return this.moveToBookmark(bookmark)
            },
            removeInlineStyle: function (tagNames) {
                if (this.collapsed) return this;
                tagNames = utils.isArray(tagNames) ? tagNames : [tagNames], this.shrinkBoundary().adjustmentBoundary();
                for (var start = this.startContainer, end = this.endContainer;;) {
                    if (1 == start.nodeType) {
                        if (utils.indexOf(tagNames, start.tagName.toLowerCase()) > -1) break;
                        if ("body" == start.tagName.toLowerCase()) {
                            start = null;
                            break
                        }
                    }
                    start = start.parentNode
                }
                for (;;) {
                    if (1 == end.nodeType) {
                        if (utils.indexOf(tagNames, end.tagName.toLowerCase()) > -1) break;
                        if ("body" == end.tagName.toLowerCase()) {
                            end = null;
                            break
                        }
                    }
                    end = end.parentNode
                }
                var frag, tmpRange, bookmark = this.createBookmark();
                start && (tmpRange = this.cloneRange().setEndBefore(bookmark.start).setStartBefore(start), frag =
                    tmpRange.extractContents(), tmpRange.insertNode(frag), domUtils.clearEmptySibling(start, !0), start
                    .parentNode.insertBefore(bookmark.start, start)), end && (tmpRange = this.cloneRange().setStartAfter(
                    bookmark.end).setEndAfter(end), frag = tmpRange.extractContents(), tmpRange.insertNode(frag),
                    domUtils.clearEmptySibling(end, !1, !0), end.parentNode.insertBefore(bookmark.end, end.nextSibling));
                for (var next, current = domUtils.getNextDomNode(bookmark.start, !1, function (node) {
                        return 1 == node.nodeType
                    }); current && current !== bookmark.end;) next = domUtils.getNextDomNode(current, !0, function (
                        node) {
                        return 1 == node.nodeType
                    }), utils.indexOf(tagNames, current.tagName.toLowerCase()) > -1 && domUtils.remove(current, !0),
                        current = next;
                return this.moveToBookmark(bookmark)
            },
            getClosedNode: function () {
                var node;
                if (!this.collapsed) {
                    var range = this.cloneRange().adjustmentBoundary().shrinkBoundary();
                    if (selectOneNode(range)) {
                        var child = range.startContainer.childNodes[range.startOffset];
                        child && 1 == child.nodeType && (dtd.$empty[child.tagName] || dtd.$nonChild[child.tagName]) &&
                            (node = child)
                    }
                }
                return node
            },
            select: browser.ie ? function (noFillData, textRange) {
                var nativeRange;
                this.collapsed || this.shrinkBoundary();
                var node = this.getClosedNode();
                if (node && !textRange) {
                    try {
                        nativeRange = this.document.body.createControlRange(), nativeRange.addElement(node),
                            nativeRange.select()
                    } catch (e) {}
                    return this
                }
                var end, bookmark = this.createBookmark(),
                    start = bookmark.start;
                if (nativeRange = this.document.body.createTextRange(), nativeRange.moveToElementText(start),
                    nativeRange.moveStart("character", 1), this.collapsed) {
                    if (!noFillData && 3 != this.startContainer.nodeType) {
                        var tmpText = this.document.createTextNode(fillChar),
                            tmp = this.document.createElement("span");
                        tmp.appendChild(this.document.createTextNode(fillChar)), start.parentNode.insertBefore(tmp,
                            start), start.parentNode.insertBefore(tmpText, start), removeFillData(this.document,
                            tmpText), fillData = tmpText, mergeSibling(tmp, "previousSibling"), mergeSibling(start,
                            "nextSibling"), nativeRange.moveStart("character", -1), nativeRange.collapse(!0)
                    }
                } else {
                    var nativeRangeEnd = this.document.body.createTextRange();
                    end = bookmark.end, nativeRangeEnd.moveToElementText(end), nativeRange.setEndPoint("EndToEnd",
                        nativeRangeEnd)
                }
                this.moveToBookmark(bookmark), tmp && domUtils.remove(tmp);
                try {
                    nativeRange.select()
                } catch (e) {}
                return this
            } : function (notInsertFillData) {
                function checkOffset(rng) {
                    function check(node, offset, dir) {
                        3 == node.nodeType && node.nodeValue.length < offset && (rng[dir + "Offset"] = node.nodeValue.length)
                    }
                    check(rng.startContainer, rng.startOffset, "start"), check(rng.endContainer, rng.endOffset, "end")
                }
                var txtNode, win = domUtils.getWindow(this.document),
                    sel = win.getSelection();
                if (browser.gecko ? this.document.body.focus() : win.focus(), sel) {
                    if (sel.removeAllRanges(), this.collapsed && !notInsertFillData) {
                        var start = this.startContainer,
                            child = start;
                        1 == start.nodeType && (child = start.childNodes[this.startOffset]), 3 == start.nodeType &&
                            this.startOffset || (child ? child.previousSibling && 3 == child.previousSibling.nodeType :
                            start.lastChild && 3 == start.lastChild.nodeType) || (txtNode = this.document.createTextNode(
                            fillChar), this.insertNode(txtNode), removeFillData(this.document, txtNode), mergeSibling(
                            txtNode, "previousSibling"), mergeSibling(txtNode, "nextSibling"), fillData = txtNode, this
                            .setStart(txtNode, browser.webkit ? 1 : 0).collapse(!0))
                    }
                    var nativeRange = this.document.createRange();
                    if (this.collapsed && browser.opera && 1 == this.startContainer.nodeType) {
                        var child = this.startContainer.childNodes[this.startOffset];
                        if (child) {
                            for (; child && domUtils.isBlockElm(child) && 1 == child.nodeType && child.childNodes[0];)
                                child = child.childNodes[0];
                            child && this.setStartBefore(child).collapse(!0)
                        } else child = this.startContainer.lastChild, child && domUtils.isBr(child) && this.setStartBefore(
                                child).collapse(!0)
                    }
                    checkOffset(this), nativeRange.setStart(this.startContainer, this.startOffset), nativeRange.setEnd(
                        this.endContainer, this.endOffset), sel.addRange(nativeRange)
                }
                return this
            },
            scrollToView: function (win, offset) {
                win = win ? window : domUtils.getWindow(this.document);
                var me = this,
                    span = me.document.createElement("span");
                return span.innerHTML = " ", me.cloneRange().insertNode(span), domUtils.scrollToView(span, win,
                    offset), domUtils.remove(span), me
            },
            inFillChar: function () {
                var start = this.startContainer;
                return this.collapsed && 3 == start.nodeType && start.nodeValue.replace(new RegExp("^" + domUtils.fillChar),
                    "").length + 1 == start.nodeValue.length ? !0 : !1
            },
            createAddress: function (ignoreEnd, ignoreTxt) {
                function getAddress(isStart) {
                    for (var ci, node = isStart ? me.startContainer : me.endContainer, parents = domUtils.findParents(
                            node, !0, function (node) {
                            return !domUtils.isBody(node)
                        }), addrs = [], i = 0; ci = parents[i++];) addrs.push(domUtils.getNodeIndex(ci, ignoreTxt));
                    var firstIndex = 0;
                    if (ignoreTxt) if (3 == node.nodeType) {
                            for (var tmpNode = node.previousSibling; tmpNode && 3 == tmpNode.nodeType;) firstIndex +=
                                    tmpNode.nodeValue.replace(fillCharReg, "").length, tmpNode = tmpNode.previousSibling;
                            firstIndex += isStart ? me.startOffset : me.endOffset
                        } else if (node = node.childNodes[isStart ? me.startOffset : me.endOffset]) firstIndex =
                            domUtils.getNodeIndex(node, ignoreTxt);
                    else {
                        node = isStart ? me.startContainer : me.endContainer;
                        for (var first = node.firstChild; first;) if (domUtils.isFillChar(first)) first = first.nextSibling;
                            else if (firstIndex++, 3 == first.nodeType) for (; first && 3 == first.nodeType;) first =
                                    first.nextSibling;
                        else first = first.nextSibling
                    } else firstIndex = isStart ? domUtils.isFillChar(node) ? 0 : me.startOffset : me.endOffset;
                    return 0 > firstIndex && (firstIndex = 0), addrs.push(firstIndex), addrs
                }
                var addr = {}, me = this;
                return addr.startAddress = getAddress(!0), ignoreEnd || (addr.endAddress = me.collapsed ? [].concat(
                    addr.startAddress) : getAddress()), addr
            },
            moveToAddress: function (addr, ignoreEnd) {
                function getNode(address, isStart) {
                    for (var parentNode, offset, ci, tmpNode = me.document.body, i = 0, l = address.length; l > i; i++)
                        if (ci = address[i], parentNode = tmpNode, tmpNode = tmpNode.childNodes[ci], !tmpNode) {
                            offset = ci;
                            break
                        }
                    isStart ? tmpNode ? me.setStartBefore(tmpNode) : me.setStart(parentNode, offset) : tmpNode ? me.setEndBefore(
                        tmpNode) : me.setEnd(parentNode, offset)
                }
                var me = this;
                return getNode(addr.startAddress, !0), !ignoreEnd && addr.endAddress && getNode(addr.endAddress), me
            },
            equals: function (rng) {
                for (var p in this) if (this.hasOwnProperty(p) && this[p] !== rng[p]) return !1;
                return !0
            },
            traversal: function (doFn, filterFn) {
                if (this.collapsed) return this;
                for (var bookmark = this.createBookmark(), end = bookmark.end, current = domUtils.getNextDomNode(
                        bookmark.start, !1, filterFn); current && current !== end && domUtils.getPosition(current, end) &
                    domUtils.POSITION_PRECEDING;) {
                    var tmpNode = domUtils.getNextDomNode(current, !1, filterFn);
                    doFn(current), current = tmpNode
                }
                return this.moveToBookmark(bookmark)
            }
        }
    }(),
    function () {
        function getBoundaryInformation(range, start) {
            var getIndex = domUtils.getNodeIndex;
            range = range.duplicate(), range.collapse(start);
            var parent = range.parentElement();
            if (!parent.hasChildNodes()) return {
                    container: parent,
                    offset: 0
            };
            for (var child, distance, siblings = parent.children, testRange = range.duplicate(), startIndex = 0,
                    endIndex = siblings.length - 1, index = -1; endIndex >= startIndex;) {
                index = Math.floor((startIndex + endIndex) / 2), child = siblings[index], testRange.moveToElementText(
                    child);
                var position = testRange.compareEndPoints("StartToStart", range);
                if (position > 0) endIndex = index - 1;
                else {
                    if (!(0 > position)) return {
                            container: parent,
                            offset: getIndex(child)
                    };
                    startIndex = index + 1
                }
            }
            if (-1 == index) {
                if (testRange.moveToElementText(parent), testRange.setEndPoint("StartToStart", range), distance =
                    testRange.text.replace(/(\r\n|\r)/g, "\n").length, siblings = parent.childNodes, !distance) return child =
                        siblings[siblings.length - 1], {
                        container: child,
                        offset: child.nodeValue.length
                };
                for (var i = siblings.length; distance > 0;) distance -= siblings[--i].nodeValue.length;
                return {
                    container: siblings[i],
                    offset: -distance
                }
            }
            if (testRange.collapse(position > 0), testRange.setEndPoint(position > 0 ? "StartToStart" : "EndToStart",
                range), distance = testRange.text.replace(/(\r\n|\r)/g, "\n").length, !distance) return dtd.$empty[
                    child.tagName] || dtd.$nonChild[child.tagName] ? {
                    container: parent,
                    offset: getIndex(child) + (position > 0 ? 0 : 1)
            }: {
                container: child,
                offset: position > 0 ? 0 : child.childNodes.length
            };
            for (; distance > 0;) try {
                    var pre = child;
                    child = child[position > 0 ? "previousSibling" : "nextSibling"], distance -= child.nodeValue.length
            } catch (e) {
                return {
                    container: parent,
                    offset: getIndex(pre)
                }
            }
            return {
                container: child,
                offset: position > 0 ? -distance : child.nodeValue.length + distance
            }
        }
        function transformIERangeToRange(ieRange, range) {
            if (ieRange.item) range.selectNode(ieRange.item(0));
            else {
                var bi = getBoundaryInformation(ieRange, !0);
                range.setStart(bi.container, bi.offset), 0 != ieRange.compareEndPoints("StartToEnd", ieRange) && (bi =
                    getBoundaryInformation(ieRange, !1), range.setEnd(bi.container, bi.offset))
            }
            return range
        }
        function _getIERange(sel) {
            var ieRange;
            try {
                ieRange = sel.getNative().createRange()
            } catch (e) {
                return null
            }
            var el = ieRange.item ? ieRange.item(0) : ieRange.parentElement();
            return (el.ownerDocument || el) === sel.document ? ieRange : null
        }
        var Selection = dom.Selection = function (doc) {
            var iframe, me = this;
            me.document = doc, browser.ie9below && (iframe = domUtils.getWindow(doc).frameElement, domUtils.on(iframe,
                "beforedeactivate", function () {
                me._bakIERange = me.getIERange()
            }), domUtils.on(iframe, "activate", function () {
                try {
                    !_getIERange(me) && me._bakIERange && me._bakIERange.select()
                } catch (ex) {}
                me._bakIERange = null
            })), iframe = doc = null
        };
        Selection.prototype = {
            rangeInBody: function (rng, txtRange) {
                var node = browser.ie9below || txtRange ? rng.item ? rng.item() : rng.parentElement() : rng.startContainer;
                return node === this.document.body || domUtils.inDoc(node, this.document)
            },
            getNative: function () {
                var doc = this.document;
                try {
                    return doc ? browser.ie9below ? doc.selection : domUtils.getWindow(doc).getSelection() : null
                } catch (e) {
                    return null
                }
            },
            getIERange: function () {
                var ieRange = _getIERange(this);
                return !ieRange && this._bakIERange ? this._bakIERange : ieRange
            },
            cache: function () {
                this.clear(), this._cachedRange = this.getRange(), this._cachedStartElement = this.getStart(), this._cachedStartElementPath =
                    this.getStartElementPath()
            },
            getStartElementPath: function () {
                if (this._cachedStartElementPath) return this._cachedStartElementPath;
                var start = this.getStart();
                return start ? domUtils.findParents(start, !0, null, !0) : []
            },
            clear: function () {
                this._cachedStartElementPath = this._cachedRange = this._cachedStartElement = null
            },
            isFocus: function () {
                try {
                    if (browser.ie9below) {
                        var nativeRange = _getIERange(this);
                        return !(!nativeRange || !this.rangeInBody(nativeRange))
                    }
                    return !!this.getNative().rangeCount
                } catch (e) {
                    return !1
                }
            },
            getRange: function () {
                function optimze(range) {
                    for (var child = me.document.body.firstChild, collapsed = range.collapsed; child && child.firstChild;)
                        range.setStart(child, 0), child = child.firstChild;
                    range.startContainer || range.setStart(me.document.body, 0), collapsed && range.collapse(!0)
                }
                var me = this;
                if (null != me._cachedRange) return this._cachedRange;
                var range = new baidu.editor.dom.Range(me.document);
                if (browser.ie9below) {
                    var nativeRange = me.getIERange();
                    if (nativeRange) try {
                            transformIERangeToRange(nativeRange, range)
                    } catch (e) {
                        optimze(range)
                    } else optimze(range)
                } else {
                    var sel = me.getNative();
                    if (sel && sel.rangeCount) {
                        var firstRange = sel.getRangeAt(0),
                            lastRange = sel.getRangeAt(sel.rangeCount - 1);
                        range.setStart(firstRange.startContainer, firstRange.startOffset).setEnd(lastRange.endContainer,
                            lastRange.endOffset), range.collapsed && domUtils.isBody(range.startContainer) && !range.startOffset &&
                            optimze(range)
                    } else {
                        if (this._bakRange && domUtils.inDoc(this._bakRange.startContainer, this.document)) return this
                                ._bakRange;
                        optimze(range)
                    }
                }
                return this._bakRange = range
            },
            getStart: function () {
                if (this._cachedStartElement) return this._cachedStartElement;
                var tmpRange, start, tmp, parent, range = browser.ie9below ? this.getIERange() : this.getRange();
                if (browser.ie9below) {
                    if (!range) return this.document.body.firstChild;
                    if (range.item) return range.item(0);
                    for (tmpRange = range.duplicate(), tmpRange.text.length > 0 && tmpRange.moveStart("character", 1),
                        tmpRange.collapse(1), start = tmpRange.parentElement(), parent = tmp = range.parentElement(); tmp =
                        tmp.parentNode;) if (tmp == start) {
                            start = parent;
                            break
                        }
                } else if (range.shrinkBoundary(), start = range.startContainer, 1 == start.nodeType && start.hasChildNodes() &&
                    (start = start.childNodes[Math.min(start.childNodes.length - 1, range.startOffset)]), 3 == start.nodeType)
                    return start.parentNode;
                return start
            },
            getText: function () {
                var nativeSel, nativeRange;
                return this.isFocus() && (nativeSel = this.getNative()) ? (nativeRange = browser.ie9below ? nativeSel.createRange() :
                    nativeSel.getRangeAt(0), browser.ie9below ? nativeRange.text : nativeRange.toString()) : ""
            },
            clearRange: function () {
                this.getNative()[browser.ie9below ? "empty" : "removeAllRanges"]()
            }
        }
    }(),
    function () {
        function setValue(form, editor) {
            var textarea;
            if (editor.textarea) if (utils.isString(editor.textarea)) {
                    for (var ti, i = 0, tis = domUtils.getElementsByTagName(form, "textarea"); ti = tis[i++];) if (ti.id ==
                            "ueditor_textarea_" + editor.options.textarea) {
                            textarea = ti;
                            break
                        }
                } else textarea = editor.textarea;
            textarea || (form.appendChild(textarea = domUtils.createElement(document, "textarea", {
                name: editor.options.textarea,
                id: "ueditor_textarea_" + editor.options.textarea,
                style: "display:none"
            })), editor.textarea = textarea), !textarea.getAttribute("name") && textarea.setAttribute("name", editor.options
                .textarea), textarea.value = editor.hasContents() ? editor.options.allHtmlEnabled ? editor.getAllHtml() :
                editor.getContent(null, null, !0) : ""
        }
        function checkCurLang(I18N) {
            for (var lang in I18N) return lang
        }
        function langReadied(me) {
            me.langIsReady = !0, me.fireEvent("langReady")
        }
        var _selectionChangeTimer, uid = 0,
            Editor = UE.Editor = function (options) {
                var me = this;
                me.uid = uid++, EventBase.call(me), me.commands = {}, me.options = utils.extend(utils.clone(options || {}),
                    UEDITOR_CONFIG, !0), me.shortcutkeys = {}, me.inputRules = [], me.outputRules = [], me.setOpt(
                    Editor.defaultOptions(me)), me.loadServerConfig(),
                utils.isEmptyObject(UE.I18N) ? utils.loadFile(document, {
                    src: me.options.langPath + me.options.lang + "/" + me.options.lang + ".js",
                    tag: "script",
                    type: "text/javascript",
                    defer: "defer"
                }, function () {
                    UE.plugin.load(me), langReadied(me)
                }) : (me.options.lang = checkCurLang(UE.I18N), UE.plugin.load(me), langReadied(me)), UE.instants[
                    "ueditorInstant" + me.uid] = me
            };
        Editor.prototype = {
            registerCommand: function (name, obj) {
                this.commands[name] = obj
            },
            ready: function (fn) {
                var me = this;
                fn && (me.isReady ? fn.apply(me) : me.addListener("ready", fn))
            },
            setOpt: function (key, val) {
                var obj = {};
                utils.isString(key) ? obj[key] = val : obj = key, utils.extend(this.options, obj, !0)
            },
            getOpt: function (key) {
                return this.options[key]
            },
            destroy: function () {
                var me = this;
                me.fireEvent("destroy");
                var container = me.container.parentNode,
                    textarea = me.textarea;
                textarea ? textarea.style.display = "" : (textarea = document.createElement("textarea"), container.parentNode
                    .insertBefore(textarea, container)), textarea.style.width = me.iframe.offsetWidth + "px", textarea.style
                    .height = me.iframe.offsetHeight + "px", textarea.value = me.getContent(), textarea.id = me.key,
                    container.innerHTML = "", domUtils.remove(container);
                var key = me.key;
                for (var p in me) me.hasOwnProperty(p) && delete this[p];
                UE.delEditor(key)
            },
            render: function (container) {
                var me = this,
                    options = me.options,
                    getStyleValue = function (attr) {
                        return parseInt(domUtils.getComputedStyle(container, attr))
                    };
                if (utils.isString(container) && (container = document.getElementById(container)), container) {
                    options.minFrameWidth = options.initialFrameWidth ? options.initialFrameWidth : options.initialFrameWidth =
                        container.offsetWidth, options.initialFrameHeight ? options.minFrameHeight = options.initialFrameHeight :
                        options.initialFrameHeight = options.minFrameHeight = container.offsetHeight, container.style.width =
                        /%$/.test(options.initialFrameWidth) ? "100%" : options.initialFrameWidth - getStyleValue(
                        "padding-left") - getStyleValue("padding-right") + "px", container.style.height = /%$/.test(
                        options.initialFrameHeight) ? "100%" : options.initialFrameHeight - getStyleValue("padding-top") -
                        getStyleValue("padding-bottom") + "px", container.style.zIndex = options.zIndex;
                    var html = (ie && browser.version < 9 ? "" : "<!DOCTYPE html>") +
                        "<html xmlns='http://www.w3.org/1999/xhtml' class='view' ><head><style type='text/css'>.view{padding:0;word-wrap:break-word;cursor:text;height:90%;}\nbody{margin:8px;font-family:sans-serif;font-size:16px;}p{margin:5px 0;}</style>" +
                        (options.iframeCssUrl ? "<link rel='stylesheet' type='text/css' href='" + utils.unhtml(options.iframeCssUrl) +
                        "'/>" : "") + (options.initialStyle ? "<style>" + options.initialStyle + "</style>" : "") +
                        "</head><body class='view' ></body><script type='text/javascript' " + (ie ? "defer='defer'" :
                        "") +
                        " id='_initialScript'>setTimeout(function(){editor = window.parent.UE.instants['ueditorInstant" +
                        me.uid +
                        "'];editor._setup(document);},0);var _tmpScript = document.getElementById('_initialScript');_tmpScript.parentNode.removeChild(_tmpScript);</script></html>";
                    container.appendChild(domUtils.createElement(document, "iframe", {
                        id: "ueditor_" + me.uid,
                        width: "100%",
                        height: "100%",
                        frameborder: "0",
                        src: "javascript:void(function(){document.open();" + (options.customDomain && document.domain !=
                            location.hostname ? 'document.domain="' + document.domain + '";' : "") + 'document.write("' + html + '");document.close();}())'
                    })), container.style.overflow = "hidden", setTimeout(function () {
                        /%$/.test(options.initialFrameWidth) && (options.minFrameWidth = options.initialFrameWidth =
                            container.offsetWidth), /%$/.test(options.initialFrameHeight) && (options.minFrameHeight =
                            options.initialFrameHeight = container.offsetHeight, container.style.height = options.initialFrameHeight +
                            "px")
                    })
                }
            },
            _setup: function (doc) {
                var me = this,
                    options = me.options;
                ie ? (doc.body.disabled = !0, doc.body.contentEditable = !0, doc.body.disabled = !1) : doc.body.contentEditable = !
                    0, doc.body.spellcheck = !1, me.document = doc, me.window = doc.defaultView || doc.parentWindow, me
                    .iframe = me.window.frameElement, me.body = doc.body, me.selection = new dom.Selection(doc);
                var geckoSel;
                browser.gecko && (geckoSel = this.selection.getNative()) && geckoSel.removeAllRanges(), this._initEvents();
                for (var form = this.iframe.parentNode; !domUtils.isBody(form); form = form.parentNode) if ("FORM" ==
                        form.tagName) {
                        me.form = form, me.options.autoSyncData ? domUtils.on(me.window, "blur", function () {
                            setValue(form, me)
                        }) : domUtils.on(form, "submit", function () {
                            setValue(this, me)
                        });
                        break
                    }
                if (options.initialContent) if (options.autoClearinitialContent) {
                        var oldExecCommand = me.execCommand;
                        me.execCommand = function () {
                            return me.fireEvent("firstBeforeExecCommand"), oldExecCommand.apply(me, arguments)
                        }, this._setDefaultContent(options.initialContent)
                    } else this.setContent(options.initialContent, !1, !0);
                domUtils.isEmptyNode(me.body) && (me.body.innerHTML = "<p>" + (browser.ie ? "" : "<br/>") + "</p>"),
                    options.focus && setTimeout(function () {
                    me.focus(me.options.focusInEnd), !me.options.autoClearinitialContent && me._selectionChange()
                }, 0), me.container || (me.container = this.iframe.parentNode), options.fullscreen && me.ui && me.ui.setFullScreen(!
                    0);
                try {
                    me.document.execCommand("2D-position", !1, !1)
                } catch (e) {}
                try {
                    me.document.execCommand("enableInlineTableEditing", !1, !1)
                } catch (e) {}
                try {
                    me.document.execCommand("enableObjectResizing", !1, !1)
                } catch (e) {}
                me._bindshortcutKeys(), me.isReady = 1, me.fireEvent("ready"), options.onready && options.onready.call(
                    me), browser.ie9below || domUtils.on(me.window, ["blur", "focus"], function (e) {
                    if ("blur" == e.type) {
                        me._bakRange = me.selection.getRange();
                        try {
                            me._bakNativeRange = me.selection.getNative().getRangeAt(0), me.selection.getNative().removeAllRanges()
                        } catch (e) {
                            me._bakNativeRange = null
                        }
                    } else try {
                            me._bakRange && me._bakRange.select()
                    } catch (e) {}
                }), browser.gecko && browser.version <= 10902 && (me.body.contentEditable = !1, setTimeout(function () {
                    me.body.contentEditable = !0
                }, 100), setInterval(function () {
                    me.body.style.height = me.iframe.offsetHeight - 20 + "px"
                }, 100)), !options.isShow && me.setHide(), options.readonly && me.setDisabled()
            },
            sync: function (formId) {
                var me = this,
                    form = formId ? document.getElementById(formId) : domUtils.findParent(me.iframe.parentNode, function (
                        node) {
                        return "FORM" == node.tagName
                    }, !0);
                form && setValue(form, me)
            },
            setHeight: function (height, notSetHeight) {
                height !== parseInt(this.iframe.parentNode.style.height) && (this.iframe.parentNode.style.height =
                    height + "px"), !notSetHeight && (this.options.minFrameHeight = this.options.initialFrameHeight =
                    height), this.body.style.height = height + "px", !notSetHeight && this.trigger("setHeight")
            },
            addshortcutkey: function (cmd, keys) {
                var obj = {};
                keys ? obj[cmd] = keys : obj = cmd, utils.extend(this.shortcutkeys, obj)
            },
            _bindshortcutKeys: function () {
                var me = this,
                    shortcutkeys = this.shortcutkeys;
                me.addListener("keydown", function (type, e) {
                    var keyCode = e.keyCode || e.which;
                    for (var i in shortcutkeys) for (var ti, tmp = shortcutkeys[i].split(","), t = 0; ti = tmp[t++];) {
                            ti = ti.split(":");
                            var key = ti[0],
                                param = ti[1];
                            (/^(ctrl)(\+shift)?\+(\d+)$/.test(key.toLowerCase()) || /^(\d+)$/.test(key)) && (("ctrl" ==
                                RegExp.$1 ? e.ctrlKey || e.metaKey : 0) && ("" != RegExp.$2 ? e[RegExp.$2.slice(1) +
                                "Key"] : 1) && keyCode == RegExp.$3 || keyCode == RegExp.$1) && (-1 != me.queryCommandState(
                                i, param) && me.execCommand(i, param), domUtils.preventDefault(e))
                    }
                })
            },
            getContent: function (cmd, fn, notSetCursor, ignoreBlank, formatter) {
                var me = this;
                if (cmd && utils.isFunction(cmd) && (fn = cmd, cmd = ""), fn ? !fn() : !this.hasContents()) return "";
                me.fireEvent("beforegetcontent");
                var root = UE.htmlparser(me.body.innerHTML, ignoreBlank);
                return me.filterOutputRule(root), me.fireEvent("aftergetcontent", cmd, root), root.toHtml(formatter)
            },
            getAllHtml: function () {
                var me = this,
                    headHtml = [];
                if (me.fireEvent("getAllHtml", headHtml), browser.ie && browser.version > 8) {
                    var headHtmlForIE9 = "";
                    utils.each(me.document.styleSheets, function (si) {
                        headHtmlForIE9 += si.href ? '<link rel="stylesheet" type="text/css" href="' + si.href + '" />' :
                            "<style>" + si.cssText + "</style>"
                    }), utils.each(me.document.getElementsByTagName("script"), function (si) {
                        headHtmlForIE9 += si.outerHTML
                    })
                }
                return "<html><head>" + (me.options.charset ?
                    '<meta http-equiv="Content-Type" content="text/html; charset=' + me.options.charset + '"/>' : "") +
                    (headHtmlForIE9 || me.document.getElementsByTagName("head")[0].innerHTML) + headHtml.join("\n") +
                    "</head><body " + (ie && browser.version < 9 ? 'class="view"' : "") + ">" + me.getContent(null,
                    null, !0) + "</body></html>"
            },
            getPlainTxt: function () {
                var reg = new RegExp(domUtils.fillChar, "g"),
                    html = this.body.innerHTML.replace(/[\n\r]/g, "");
                return html = html.replace(/<(p|div)[^>]*>(<br\/?>| )<\/\1>/gi, "\n").replace(/<br\/?>/gi, "\n").replace(
                    /<[^>\/]+>/g, "").replace(/(\n)?<\/([^>]+)>/g, function (a, b, c) {
                    return dtd.$block[c] ? "\n" : b ? b : ""
                }), html.replace(reg, "").replace(/\u00a0/g, " ").replace(/ /g, " ")
            },
            getContentTxt: function () {
                var reg = new RegExp(domUtils.fillChar, "g");
                return this.body[browser.ie ? "innerText" : "textContent"].replace(reg, "").replace(/\u00a0/g, " ")
            },
            setContent: function (html, isAppendTo, notFireSelectionchange) {
                function isCdataDiv(node) {
                    return "DIV" == node.tagName && node.getAttribute("cdata_tag")
                }
                var me = this;
                me.fireEvent("beforesetcontent", html);
                var root = UE.htmlparser(html);
                if (me.filterInputRule(root), html = root.toHtml(), me.body.innerHTML = (isAppendTo ? me.body.innerHTML :
                    "") + html, "p" == me.options.enterTag) {
                    var tmpNode, child = this.body.firstChild;
                    if (!child || 1 == child.nodeType && (dtd.$cdata[child.tagName] || isCdataDiv(child) || domUtils.isCustomeNode(
                        child)) && child === this.body.lastChild) this.body.innerHTML = "<p>" + (browser.ie ? " " :
                            "<br/>") + "</p>" + this.body.innerHTML;
                    else for (var p = me.document.createElement("p"); child;) {
                            for (; child && (3 == child.nodeType || 1 == child.nodeType && dtd.p[child.tagName] && !dtd
                                .$cdata[child.tagName]);) tmpNode = child.nextSibling, p.appendChild(child), child =
                                    tmpNode;
                            if (p.firstChild) {
                                if (!child) {
                                    me.body.appendChild(p);
                                    break
                                }
                                child.parentNode.insertBefore(p, child), p = me.document.createElement("p")
                            }
                            child = child.nextSibling
                    }
                }
                me.fireEvent("aftersetcontent"), me.fireEvent("contentchange"), !notFireSelectionchange && me._selectionChange(),
                    me._bakRange = me._bakIERange = me._bakNativeRange = null;
                var geckoSel;
                browser.gecko && (geckoSel = this.selection.getNative()) && geckoSel.removeAllRanges(), me.options.autoSyncData &&
                    me.form && setValue(me.form, me)
            },
            focus: function (toEnd) {
                try {
                    var me = this,
                        rng = me.selection.getRange();
                    if (toEnd) {
                        var node = me.body.lastChild;
                        node && 1 == node.nodeType && !dtd.$empty[node.tagName] && (domUtils.isEmptyBlock(node) ? rng.setStartAtFirst(
                            node) : rng.setStartAtLast(node), rng.collapse(!0)), rng.setCursor(!0)
                    } else {
                        if (!rng.collapsed && domUtils.isBody(rng.startContainer) && 0 == rng.startOffset) {
                            var node = me.body.firstChild;
                            node && 1 == node.nodeType && !dtd.$empty[node.tagName] && rng.setStartAtFirst(node).collapse(!
                                0)
                        }
                        rng.select(!0)
                    }
                    this.fireEvent("focus selectionchange")
                } catch (e) {}
            },
            isFocus: function () {
                return this.selection.isFocus()
            },
            blur: function () {
                var sel = this.selection.getNative();
                if (sel.empty && browser.ie) {
                    var nativeRng = document.body.createTextRange();
                    nativeRng.moveToElementText(document.body), nativeRng.collapse(!0), nativeRng.select(), sel.empty()
                } else sel.removeAllRanges()
            },
            _initEvents: function () {
                var me = this,
                    doc = me.document,
                    win = me.window;
                me._proxyDomEvent = utils.bind(me._proxyDomEvent, me), domUtils.on(doc, ["click", "mousedown",
                        "keydown", "keyup", "keypress", "mouseup", "mouseover", "mouseout", "selectstart"], me._proxyDomEvent),
                    domUtils.on(win, ["focus", "blur"], me._proxyDomEvent), domUtils.on(me.body, "drop", function (e) {
                    browser.gecko && e.stopPropagation && e.stopPropagation(), me.fireEvent("contentchange")
                }), domUtils.on(doc, ["mouseup", "keydown"], function (evt) {
                    "keydown" == evt.type && (evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.altKey) || 2 != evt.button &&
                        me._selectionChange(250, evt)
                })
            },
            _proxyDomEvent: function (evt) {
                return this.fireEvent("before" + evt.type.replace(/^on/, "").toLowerCase()) === !1 ? !1 : this.fireEvent(
                    evt.type.replace(/^on/, ""), evt) === !1 ? !1 : this.fireEvent("after" + evt.type.replace(/^on/, "")
                    .toLowerCase())
            },
            _selectionChange: function (delay, evt) {
                var mouseX, mouseY, me = this,
                    hackForMouseUp = !1;
                if (browser.ie && browser.version < 9 && evt && "mouseup" == evt.type) {
                    var range = this.selection.getRange();
                    range.collapsed || (hackForMouseUp = !0, mouseX = evt.clientX, mouseY = evt.clientY)
                }
                clearTimeout(_selectionChangeTimer), _selectionChangeTimer = setTimeout(function () {
                    if (me.selection && me.selection.getNative()) {
                        var ieRange;
                        if (hackForMouseUp && "None" == me.selection.getNative().type) {
                            ieRange = me.document.body.createTextRange();
                            try {
                                ieRange.moveToPoint(mouseX, mouseY)
                            } catch (ex) {
                                ieRange = null
                            }
                        }
                        var bakGetIERange;
                        ieRange && (bakGetIERange = me.selection.getIERange, me.selection.getIERange = function () {
                            return ieRange
                        }), me.selection.cache(), bakGetIERange && (me.selection.getIERange = bakGetIERange), me.selection
                            ._cachedRange && me.selection._cachedStartElement && (me.fireEvent("beforeselectionchange"),
                            me.fireEvent("selectionchange", !! evt), me.fireEvent("afterselectionchange"), me.selection
                            .clear())
                    }
                }, delay || 50)
            },
            _callCmdFn: function (fnName, args) {
                var cmd, cmdFn, cmdName = args[0].toLowerCase();
                return cmd = this.commands[cmdName] || UE.commands[cmdName], cmdFn = cmd && cmd[fnName], cmd && cmdFn ||
                    "queryCommandState" != fnName ? cmdFn ? cmdFn.apply(this, args) : void 0 : 0
            },
            execCommand: function (cmdName) {
                cmdName = cmdName.toLowerCase();
                var result, me = this,
                    cmd = me.commands[cmdName] || UE.commands[cmdName];
                return cmd && cmd.execCommand ? (cmd.notNeedUndo || me.__hasEnterExecCommand ? (result = this._callCmdFn(
                    "execCommand", arguments), !me.__hasEnterExecCommand && !cmd.ignoreContentChange && !me._ignoreContentChange &&
                    me.fireEvent("contentchange")) : (me.__hasEnterExecCommand = !0, -1 != me.queryCommandState.apply(
                    me, arguments) && (me.fireEvent("saveScene"), me.fireEvent.apply(me, ["beforeexeccommand", cmdName]
                    .concat(arguments)), result = this._callCmdFn("execCommand", arguments), me.fireEvent.apply(me, [
                        "afterexeccommand", cmdName].concat(arguments)), me.fireEvent("saveScene")), me.__hasEnterExecCommand = !
                    1), !me.__hasEnterExecCommand && !cmd.ignoreContentChange && !me._ignoreContentChange && me._selectionChange(),
                    result) : null
            },
            queryCommandState: function () {
                return this._callCmdFn("queryCommandState", arguments)
            },
            queryCommandValue: function () {
                return this._callCmdFn("queryCommandValue", arguments)
            },
            hasContents: function (tags) {
                if (tags) for (var ci, i = 0; ci = tags[i++];) if (this.document.getElementsByTagName(ci).length > 0)
                            return !0;
                if (!domUtils.isEmptyBlock(this.body)) return !0;
                for (tags = ["div"], i = 0; ci = tags[i++];) for (var cn, nodes = domUtils.getElementsByTagName(this.document,
                            ci), n = 0; cn = nodes[n++];) if (domUtils.isCustomeNode(cn)) return !0;
                return !1
            },
            reset: function () {
                this.fireEvent("reset")
            },
            setEnabled: function () {
                var range, me = this;
                if ("false" == me.body.contentEditable) {
                    me.body.contentEditable = !0, range = me.selection.getRange();
                    try {
                        range.moveToBookmark(me.lastBk), delete me.lastBk
                    } catch (e) {
                        range.setStartAtFirst(me.body).collapse(!0)
                    }
                    range.select(!0), me.bkqueryCommandState && (me.queryCommandState = me.bkqueryCommandState, delete me
                        .bkqueryCommandState), me.bkqueryCommandValue && (me.queryCommandValue = me.bkqueryCommandValue,
                        delete me.bkqueryCommandValue), me.fireEvent("selectionchange")
                }
            },
            enable: function () {
                return this.setEnabled()
            },
            setDisabled: function (except) {
                var me = this;
                except = except ? utils.isArray(except) ? except : [except] : [], "true" == me.body.contentEditable &&
                    (me.lastBk || (me.lastBk = me.selection.getRange().createBookmark(!0)), me.body.contentEditable = !
                    1, me.bkqueryCommandState = me.queryCommandState, me.bkqueryCommandValue = me.queryCommandValue, me
                    .queryCommandState = function (type) {
                    return -1 != utils.indexOf(except, type) ? me.bkqueryCommandState.apply(me, arguments) : -1
                }, me.queryCommandValue = function (type) {
                    return -1 != utils.indexOf(except, type) ? me.bkqueryCommandValue.apply(me, arguments) : null
                }, me.fireEvent("selectionchange"))
            },
            disable: function (except) {
                return this.setDisabled(except)
            },
            _setDefaultContent: function () {
                function clear() {
                    var me = this;
                    me.document.getElementById("initContent") && (me.body.innerHTML = "<p>" + (ie ? "" : "<br/>") +
                        "</p>", me.removeListener("firstBeforeExecCommand focus", clear), setTimeout(function () {
                        me.focus(), me._selectionChange()
                    }, 0))
                }
                return function (cont) {
                    var me = this;
                    me.body.innerHTML = '<p id="initContent">' + cont + "</p>", me.addListener(
                        "firstBeforeExecCommand focus", clear)
                }
            }(),
            setShow: function () {
                var me = this,
                    range = me.selection.getRange();
                if ("none" == me.container.style.display) {
                    try {
                        range.moveToBookmark(me.lastBk), delete me.lastBk
                    } catch (e) {
                        range.setStartAtFirst(me.body).collapse(!0)
                    }
                    setTimeout(function () {
                        range.select(!0)
                    }, 100), me.container.style.display = ""
                }
            },
            show: function () {
                return this.setShow()
            },
            setHide: function () {
                var me = this;
                me.lastBk || (me.lastBk = me.selection.getRange().createBookmark(!0)), me.container.style.display =
                    "none"
            },
            hide: function () {
                return this.setHide()
            },
            getLang: function (path) {
                var lang = UE.I18N[this.options.lang];
                if (!lang) throw Error("not import language file");
                path = (path || "").split(".");
                for (var ci, i = 0;
                (ci = path[i++]) && (lang = lang[ci], lang););
                return lang
            },
            getContentLength: function (ingoneHtml, tagNames) {
                var count = this.getContent(!1, !1, !0).length;
                if (ingoneHtml) {
                    tagNames = (tagNames || []).concat(["hr", "img", "iframe"]), count = this.getContentTxt().replace(
                        /[\t\r\n]+/g, "").length;
                    for (var ci, i = 0; ci = tagNames[i++];) count += this.document.getElementsByTagName(ci).length
                }
                return count
            },
            addInputRule: function (rule) {
                this.inputRules.push(rule)
            },
            filterInputRule: function (root) {
                for (var ci, i = 0; ci = this.inputRules[i++];) ci.call(this, root)
            },
            addOutputRule: function (rule) {
                this.outputRules.push(rule)
            },
            filterOutputRule: function (root) {
                for (var ci, i = 0; ci = this.outputRules[i++];) ci.call(this, root)
            },
            getActionUrl: function (action) {
                var actionName = this.getOpt(action) || action,
                    imageUrl = this.getOpt("imageUrl"),
                    serverUrl = this.getOpt("serverUrl");
                return !serverUrl && imageUrl && (serverUrl = imageUrl.replace(/^(.*[\/]).+([\.].+)$/, "$1controller$2")),
                    serverUrl ? (serverUrl = serverUrl + (-1 == serverUrl.indexOf("?") ? "?" : "&") + "action=" + (
                    actionName || ""), utils.formatUrl(serverUrl)) : ""
            }
        }, utils.inherits(Editor, EventBase)
    }(), UE.Editor.defaultOptions = function (editor) {
        var _url = editor.options.UEDITOR_HOME_URL;
        return {
            isShow: !0,
            initialContent: "",
            initialStyle: "",
            autoClearinitialContent: !1,
            iframeCssUrl: _url + "themes/iframe.css",
            textarea: "editorValue",
            focus: !1,
            focusInEnd: !0,
            autoClearEmptyNode: !0,
            fullscreen: !1,
            readonly: !1,
            zIndex: 999,
            imagePopup: !0,
            enterTag: "p",
            customDomain: !1,
            lang: "zh-cn",
            langPath: _url + "lang/",
            theme: "default",
            themePath: _url + "themes/",
            allHtmlEnabled: !1,
            scaleEnabled: !1,
            tableNativeEditInFF: !1,
            autoSyncData: !0,
            fileNameFormat: "{time}{rand:6}"
        }
    },
    function () {
        UE.Editor.prototype.loadServerConfig = function () {
            function showErrorMsg(msg) {
                console && console.error(msg)
            }
            var me = this;
            setTimeout(function () {
                try {
                    me.options.imageUrl && me.setOpt("serverUrl", me.options.imageUrl.replace(/^(.*[\/]).+([\.].+)$/,
                        "$1controller$2"));
                    var configUrl = me.getActionUrl("config"),
                        isJsonp = utils.isCrossDomainUrl(configUrl);
                    me._serverConfigLoaded = !1, configUrl && UE.ajax.request(configUrl, {
                        method: "GET",
                        dataType: isJsonp ? "jsonp" : "",
                        onsuccess: function (r) {
                            try {
                                var config = isJsonp ? r : eval("(" + r.responseText + ")");
                                utils.extend(me.options, config), me.fireEvent("serverConfigLoaded"), me._serverConfigLoaded = !
                                    0
                            } catch (e) {
                                showErrorMsg(me.getLang("loadconfigFormatError"))
                            }
                        },
                        onerror: function () {
                            showErrorMsg(me.getLang("loadconfigHttpError"))
                        }
                    })
                } catch (e) {
                    showErrorMsg(me.getLang("loadconfigError"))
                }
            })
        }, UE.Editor.prototype.isServerConfigLoaded = function () {
            var me = this;
            return me._serverConfigLoaded || !1
        }, UE.Editor.prototype.afterConfigReady = function (handler) {
            if (handler && utils.isFunction(handler)) {
                var me = this,
                    readyHandler = function () {
                        handler.apply(me, arguments), me.removeListener("serverConfigLoaded", readyHandler)
                    };
                me.isServerConfigLoaded() ? handler.call(me, "serverConfigLoaded") : me.addListener(
                    "serverConfigLoaded", readyHandler)
            }
        }
    }(), UE.ajax = function () {
        function json2str(json) {
            var strArr = [];
            for (var i in json) if ("method" != i && "timeout" != i && "async" != i && "dataType" != i && "callback" !=
                    i && void 0 != json[i] && null != json[i]) if ("function" != (typeof json[i]).toLowerCase() &&
                        "object" != (typeof json[i]).toLowerCase()) strArr.push(encodeURIComponent(i) + "=" +
                            encodeURIComponent(json[i]));
                    else if (utils.isArray(json[i])) for (var j = 0; j < json[i].length; j++) strArr.push(
                        encodeURIComponent(i) + "[]=" + encodeURIComponent(json[i][j]));
            return strArr.join("&")
        }
        function doAjax(url, ajaxOptions) {
            var xhr = creatAjaxRequest(),
                timeIsOut = !1,
                defaultAjaxOptions = {
                    method: "POST",
                    timeout: 5e3,
                    async: !0,
                    data: {},
                    onsuccess: function () {},
                    onerror: function () {}
                };
            if ("object" == typeof url && (ajaxOptions = url, url = ajaxOptions.url), xhr && url) {
                var ajaxOpts = ajaxOptions ? utils.extend(defaultAjaxOptions, ajaxOptions) : defaultAjaxOptions,
                    submitStr = json2str(ajaxOpts);
                utils.isEmptyObject(ajaxOpts.data) || (submitStr += (submitStr ? "&" : "") + json2str(ajaxOpts.data));
                var timerID = setTimeout(function () {
                    4 != xhr.readyState && (timeIsOut = !0, xhr.abort(), clearTimeout(timerID))
                }, ajaxOpts.timeout),
                    method = ajaxOpts.method.toUpperCase(),
                    str = url + (-1 == url.indexOf("?") ? "?" : "&") + ("POST" == method ? "" : submitStr + "&noCache=" + +
                        new Date);
                xhr.open(method, str, ajaxOpts.async), xhr.onreadystatechange = function () {
                    4 == xhr.readyState && (timeIsOut || 200 != xhr.status ? ajaxOpts.onerror(xhr) : ajaxOpts.onsuccess(
                        xhr))
                }, "POST" == method ? (xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), xhr.send(
                    submitStr)) : xhr.send(null)
            }
        }
        function doJsonp(url, opts) {
            function createScriptTag(scr, url, charset) {
                scr.setAttribute("type", "text/javascript"), scr.setAttribute("defer", "defer"), charset && scr.setAttribute(
                    "charset", charset), scr.setAttribute("src", url), document.getElementsByTagName("head")[0].appendChild(
                    scr)
            }
            function getCallBack(onTimeOut) {
                return function () {
                    try {
                        if (onTimeOut) options.onerror && options.onerror();
                        else try {
                                clearTimeout(timer), successhandler.apply(window, arguments)
                        } catch (e) {}
                    } catch (exception) {
                        options.onerror && options.onerror.call(window, exception)
                    } finally {
                        options.oncomplete && options.oncomplete.apply(window, arguments), scr.parentNode && scr.parentNode
                            .removeChild(scr), window[callbackFnName] = null;
                        try {
                            delete window[callbackFnName]
                        } catch (e) {}
                    }
                }
            }
            var callbackFnName, timer, matches, successhandler = opts.onsuccess || function () {}, scr = document.createElement(
                    "SCRIPT"),
                options = opts || {}, charset = options.charset,
                callbackField = options.jsonp || "callback",
                timeOut = options.timeOut || 0,
                reg = new RegExp("(\\?|&)" + callbackField + "=([^&]*)");
            utils.isFunction(successhandler) ? (callbackFnName = "bd__editor__" + Math.floor(2147483648 * Math.random())
                .toString(36), window[callbackFnName] = getCallBack(0)) : utils.isString(successhandler) ?
                callbackFnName = successhandler : (matches = reg.exec(url)) && (callbackFnName = matches[2]), url = url
                .replace(reg, "$1" + callbackField + "=" + callbackFnName), url.search(reg) < 0 && (url += (url.indexOf(
                "?") < 0 ? "?" : "&") + callbackField + "=" + callbackFnName);
            var queryStr = json2str(opts);
            utils.isEmptyObject(opts.data) || (queryStr += (queryStr ? "&" : "") + json2str(opts.data)), queryStr && (
                url = url.replace(/\?/, "?" + queryStr + "&")), scr.onerror = getCallBack(1), timeOut && (timer =
                setTimeout(getCallBack(1), timeOut)), createScriptTag(scr, url, charset)
        }
        var fnStr = "XMLHttpRequest()";
        try {
            new ActiveXObject("Msxml2.XMLHTTP"), fnStr = "ActiveXObject('Msxml2.XMLHTTP')"
        } catch (e) {
            try {
                new ActiveXObject("Microsoft.XMLHTTP"), fnStr = "ActiveXObject('Microsoft.XMLHTTP')"
            } catch (e) {}
        }
        var creatAjaxRequest = new Function("return new " + fnStr);
        return {
            request: function (url, opts) {
                opts && "jsonp" == opts.dataType ? doJsonp(url, opts) : doAjax(url, opts)
            },
            getJSONP: function (url, data, fn) {
                var opts = {
                    data: data,
                    oncomplete: fn
                };
                doJsonp(url, opts)
            }
        }
    }();
    var filterWord = UE.filterWord = function () {
        function isWordDocument(str) {
            return /(class="?Mso|style="[^"]*\bmso\-|w:WordDocument|<(v|o):|lang=)/gi.test(str)
        }
        function transUnit(v) {
            return v = v.replace(/[\d.]+\w+/g, function (m) {
                return utils.transUnitToPx(m)
            })
        }
        function filterPasteWord(str) {
            return str.replace(/[\t\r\n]+/g, " ").replace(/<!--[\s\S]*?-->/gi, "").replace(
                /<v:shape [^>]*>[\s\S]*?.<\/v:shape>/gi, function (str) {
                if (browser.opera) return "";
                try {
                    if (/Bitmap/i.test(str)) return "";
                    var width = str.match(/width:([ \d.]*p[tx])/i)[1],
                        height = str.match(/height:([ \d.]*p[tx])/i)[1],
                        src = str.match(/src=\s*"([^"]*)"/i)[1];
                    return '<img width="' + transUnit(width) + '" height="' + transUnit(height) + '" src="' + src +
                        '" />'
                } catch (e) {
                    return ""
                }
            }).replace(/<\/?div[^>]*>/g, "").replace(/v:\w+=(["']?)[^'"]+\1/g, "").replace(
                /<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|xml|meta|link|style|\w+:\w+)(?=[\s\/>]))[^>]*>/gi,
                "").replace(/<p [^>]*class="?MsoHeading"?[^>]*>(.*?)<\/p>/gi, "<p><strong>$1</strong></p>").replace(
                /\s+(class|lang|align)\s*=\s*(['"]?)([\w-]+)\2/gi, function (str, name, marks, val) {
                return "class" == name && "MsoListParagraph" == val ? str : ""
            }).replace(/<(font|span)[^>]*>(\s*)<\/\1>/gi, function (a, b, c) {
                return c.replace(/[\t\r\n ]+/g, " ")
            }).replace(/(<[a-z][^>]*)\sstyle=(["'])([^\2]*?)\2/gi, function (str, tag, tmp, style) {
                for (var v, n = [], s = style.replace(/^\s+|\s+$/, "").replace(/'/g, "'").replace(/"/gi, "'").replace(
                        /[\d.]+(cm|pt)/g, function (str) {
                        return utils.transUnitToPx(str)
                    }).split(/;\s*/g), i = 0; v = s[i]; i++) {
                    var name, value, parts = v.split(":");
                    if (2 == parts.length) {
                        if (name = parts[0].toLowerCase(), value = parts[1].toLowerCase(), /^(background)\w*/.test(name) &&
                            0 == value.replace(/(initial|\s)/g, "").length || /^(margin)\w*/.test(name) && /^0\w+$/.test(
                            value)) continue;
                        switch (name) {
                        case "mso-padding-alt":
                        case "mso-padding-top-alt":
                        case "mso-padding-right-alt":
                        case "mso-padding-bottom-alt":
                        case "mso-padding-left-alt":
                        case "mso-margin-alt":
                        case "mso-margin-top-alt":
                        case "mso-margin-right-alt":
                        case "mso-margin-bottom-alt":
                        case "mso-margin-left-alt":
                        case "mso-height":
                        case "mso-width":
                        case "mso-vertical-align-alt":
                            /<table/.test(tag) || (n[i] = name.replace(/^mso-|-alt$/g, "") + ":" + transUnit(value));
                            continue;
                        case "horiz-align":
                            n[i] = "text-align:" + value;
                            continue;
                        case "vert-align":
                            n[i] = "vertical-align:" + value;
                            continue;
                        case "font-color":
                        case "mso-foreground":
                            n[i] = "color:" + value;
                            continue;
                        case "mso-background":
                        case "mso-highlight":
                            n[i] = "background:" + value;
                            continue;
                        case "mso-default-height":
                            n[i] = "min-height:" + transUnit(value);
                            continue;
                        case "mso-default-width":
                            n[i] = "min-width:" + transUnit(value);
                            continue;
                        case "mso-padding-between-alt":
                            n[i] = "border-collapse:separate;border-spacing:" + transUnit(value);
                            continue;
                        case "text-line-through":
                            ("single" == value || "double" == value) && (n[i] = "text-decoration:line-through");
                            continue;
                        case "mso-zero-height":
                            "yes" == value && (n[i] = "display:none");
                            continue;
                        case "margin":
                            if (!/[1-9]/.test(value)) continue
                        }
                        if (
                            /^(mso|column|font-emph|lang|layout|line-break|list-image|nav|panose|punct|row|ruby|sep|size|src|tab-|table-border|text-(?:decor|trans)|top-bar|version|vnd|word-break)/
                            .test(name) || /text\-indent|padding|margin/.test(name) && /\-[\d.]+/.test(value)) continue;
                        n[i] = name + ":" + parts[1]
                    }
                }
                return tag + (n.length ? ' style="' + n.join(";").replace(/;{2,}/g, ";") + '"' : "")
            })
        }
        return function (html) {
            return isWordDocument(html) ? filterPasteWord(html) : html
        }
    }();
    ! function () {
        function insertLine(arr, current, begin) {
            return arr.push(breakChar), current + (begin ? 1 : -1)
        }
        function insertIndent(arr, current) {
            for (var i = 0; current > i; i++) arr.push(indentChar)
        }
        function nodeToHtml(node, arr, formatter, current) {
            switch (node.type) {
            case "root":
                for (var ci, i = 0; ci = node.children[i++];) formatter && "element" == ci.type && !dtd.$inlineWithA[ci
                        .tagName] && i > 1 && (insertLine(arr, current, !0), insertIndent(arr, current)), nodeToHtml(ci,
                        arr, formatter, current);
                break;
            case "text":
                isText(node, arr);
                break;
            case "element":
                isElement(node, arr, formatter, current);
                break;
            case "comment":
                isComment(node, arr, formatter)
            }
            return arr
        }
        function isText(node, arr) {
            arr.push("pre" == node.parentNode.tagName ? node.data : notTransTagName[node.parentNode.tagName] ? utils.html(
                node.data) : node.data.replace(/[ ]{2}/g, "  "))
        }
        function isElement(node, arr, formatter, current) {
            var attrhtml = "";
            if (node.attrs) {
                attrhtml = [];
                var attrs = node.attrs;
                for (var a in attrs) attrhtml.push(a + (void 0 !== attrs[a] ? '="' + (notTransAttrs[a] ? utils.html(
                        attrs[a]).replace(/["]/g, function () {
                        return '"'
                    }) : utils.unhtml(attrs[a])) + '"' : ""));
                attrhtml = attrhtml.join(" ")
            }
            if (arr.push("<" + node.tagName + (attrhtml ? " " + attrhtml : "") + (dtd.$empty[node.tagName] ? "/" : "") +
                ">"), formatter && !dtd.$inlineWithA[node.tagName] && "pre" != node.tagName && node.children && node.children
                .length && (current = insertLine(arr, current, !0), insertIndent(arr, current)), node.children && node.children
                .length) for (var ci, i = 0; ci = node.children[i++];) formatter && "element" == ci.type && !dtd.$inlineWithA[
                        ci.tagName] && i > 1 && (insertLine(arr, current), insertIndent(arr, current)), nodeToHtml(ci,
                        arr, formatter, current);
            dtd.$empty[node.tagName] || (formatter && !dtd.$inlineWithA[node.tagName] && "pre" != node.tagName && node.children &&
                node.children.length && (current = insertLine(arr, current), insertIndent(arr, current)), arr.push("</" +
                node.tagName + ">"))
        }
        function isComment(node, arr) {
            arr.push("<!--" + node.data + "-->")
        }
        function getNodeById(root, id) {
            var node;
            if ("element" == root.type && root.getAttr("id") == id) return root;
            if (root.children && root.children.length) for (var ci, i = 0; ci = root.children[i++];) if (node =
                        getNodeById(ci, id)) return node
        }
        function getNodesByTagName(node, tagName, arr) {
            if ("element" == node.type && node.tagName == tagName && arr.push(node), node.children && node.children.length)
                for (var ci, i = 0; ci = node.children[i++];) getNodesByTagName(ci, tagName, arr)
        }
        function getNodesByClassName(node, classNames, arr) {
            if ("element" == node.type) {
                var nodeCls = node.attrs && node.attrs["class"];
                nodeCls && domUtils.hasClass(nodeCls, classNames) && arr.push(node)
            }
            node.children && node.children.length && utils.each(node.children, function (child) {
                getNodesByClassName(child, classNames, arr)
            })
        }
        function nodeTraversal(root, fn) {
            if (root.children && root.children.length) for (var ci, i = 0; ci = root.children[i];) nodeTraversal(ci, fn),
                        ci.parentNode && (ci.children && ci.children.length && fn(ci), ci.parentNode && i++);
            else fn(root)
        }
        var uNode = UE.uNode = function (obj) {
            this.type = obj.type, this.data = obj.data, this.tagName = obj.tagName, this.parentNode = obj.parentNode,
                this.attrs = obj.attrs || {}, this.children = obj.children
        }, notTransAttrs = {
                href: 1,
                src: 1,
                _src: 1,
                _href: 1,
                cdata_data: 1
            }, notTransTagName = {
                style: 1,
                script: 1
            }, indentChar = "    ",
            breakChar = "\n";
        uNode.createElement = function (html) {
            return /[<>]/.test(html) ? UE.htmlparser(html).children[0] : new uNode({
                type: "element",
                children: [],
                tagName: html
            })
        }, uNode.createText = function (data, noTrans) {
            return new UE.uNode({
                type: "text",
                data: noTrans ? data : utils.unhtml(data || "")
            })
        }, uNode.prototype = {
            toHtml: function (formatter) {
                var arr = [];
                return nodeToHtml(this, arr, formatter, 0), arr.join("")
            },
            innerHTML: function (htmlstr) {
                if ("element" != this.type || dtd.$empty[this.tagName]) return this;
                if (utils.isString(htmlstr)) {
                    if (this.children) for (var ci, i = 0; ci = this.children[i++];) ci.parentNode = null;
                    this.children = [];
                    for (var ci, tmpRoot = UE.htmlparser(htmlstr), i = 0; ci = tmpRoot.children[i++];) this.children.push(
                            ci), ci.parentNode = this;
                    return this
                }
                var tmpRoot = new UE.uNode({
                    type: "root",
                    children: this.children
                });
                return tmpRoot.toHtml()
            },
            innerText: function (textStr, noTrans) {
                if ("element" != this.type || dtd.$empty[this.tagName]) return this;
                if (textStr) {
                    if (this.children) for (var ci, i = 0; ci = this.children[i++];) ci.parentNode = null;
                    return this.children = [], this.appendChild(uNode.createText(textStr, noTrans)), this
                }
                return this.toHtml().replace(/<[^>]+>/g, "")
            },
            getData: function () {
                return "element" == this.type ? "" : this.data
            },
            firstChild: function () {
                return this.children ? this.children[0] : null
            },
            lastChild: function () {
                return this.children ? this.children[this.children.length - 1] : null
            },
            previousSibling: function () {
                for (var ci, parent = this.parentNode, i = 0; ci = parent.children[i]; i++) if (ci === this) return 0 ==
                            i ? null : parent.children[i - 1]
            },
            nextSibling: function () {
                for (var ci, parent = this.parentNode, i = 0; ci = parent.children[i++];) if (ci === this) return parent
                            .children[i]
            },
            replaceChild: function (target, source) {
                if (this.children) {
                    target.parentNode && target.parentNode.removeChild(target);
                    for (var ci, i = 0; ci = this.children[i]; i++) if (ci === source) return this.children.splice(i, 1,
                                target), source.parentNode = null, target.parentNode = this, target
                }
            },
            appendChild: function (node) {
                if ("root" == this.type || "element" == this.type && !dtd.$empty[this.tagName]) {
                    this.children || (this.children = []), node.parentNode && node.parentNode.removeChild(node);
                    for (var ci, i = 0; ci = this.children[i]; i++) if (ci === node) {
                            this.children.splice(i, 1);
                            break
                        }
                    return this.children.push(node), node.parentNode = this, node
                }
            },
            insertBefore: function (target, source) {
                if (this.children) {
                    target.parentNode && target.parentNode.removeChild(target);
                    for (var ci, i = 0; ci = this.children[i]; i++) if (ci === source) return this.children.splice(i, 0,
                                target), target.parentNode = this, target
                }
            },
            insertAfter: function (target, source) {
                if (this.children) {
                    target.parentNode && target.parentNode.removeChild(target);
                    for (var ci, i = 0; ci = this.children[i]; i++) if (ci === source) return this.children.splice(i +
                                1, 0, target), target.parentNode = this, target
                }
            },
            removeChild: function (node, keepChildren) {
                if (this.children) for (var ci, i = 0; ci = this.children[i]; i++) if (ci === node) {
                            if (this.children.splice(i, 1), ci.parentNode = null, keepChildren && ci.children && ci.children
                                .length) for (var cj, j = 0; cj = ci.children[j]; j++) this.children.splice(i + j, 0,
                                        cj), cj.parentNode = this;
                            return ci
                        }
            },
            getAttr: function (attrName) {
                return this.attrs && this.attrs[attrName.toLowerCase()]
            },
            setAttr: function (attrName, attrVal) {
                if (!attrName) return void delete this.attrs;
                if (this.attrs || (this.attrs = {}), utils.isObject(attrName)) for (var a in attrName) attrName[a] ?
                            this.attrs[a.toLowerCase()] = attrName[a] : delete this.attrs[a];
                else attrVal ? this.attrs[attrName.toLowerCase()] = attrVal : delete this.attrs[attrName]
            },
            getIndex: function () {
                for (var ci, parent = this.parentNode, i = 0; ci = parent.children[i]; i++) if (ci === this) return i;
                return -1
            },
            getNodeById: function (id) {
                var node;
                if (this.children && this.children.length) for (var ci, i = 0; ci = this.children[i++];) if (node =
                            getNodeById(ci, id)) return node
            },
            getNodesByTagName: function (tagNames) {
                tagNames = utils.trim(tagNames).replace(/[ ]{2,}/g, " ").split(" ");
                var arr = [],
                    me = this;
                return utils.each(tagNames, function (tagName) {
                    if (me.children && me.children.length) for (var ci, i = 0; ci = me.children[i++];) getNodesByTagName(
                                ci, tagName, arr)
                }), arr
            },
            getNodesByClassName: function (classNames) {
                var arr = [],
                    me = this;
                return me.children && me.children.length && utils.each(me.children, function (child) {
                    getNodesByClassName(child, classNames, arr)
                }), arr
            },
            getStyle: function (name) {
                var cssStyle = this.getAttr("style");
                if (!cssStyle) return "";
                var reg = new RegExp("(^|;)\\s*" + name + ":([^;]+)", "i"),
                    match = cssStyle.match(reg);
                return match && match[0] ? match[2] : ""
            },
            setStyle: function (name, val) {
                function exec(name, val) {
                    var reg = new RegExp("(^|;)\\s*" + name + ":([^;]+;?)", "gi");
                    cssStyle = cssStyle.replace(reg, "$1"), val && (cssStyle = name + ":" + utils.unhtml(val) + ";" +
                        cssStyle)
                }
                var cssStyle = this.getAttr("style");
                if (cssStyle || (cssStyle = ""), utils.isObject(name)) for (var a in name) exec(a, name[a]);
                else exec(name, val);
                this.setAttr("style", utils.trim(cssStyle))
            },
            traversal: function (fn) {
                return this.children && this.children.length && nodeTraversal(this, fn), this
            }
        }
    }();
    var htmlparser = UE.htmlparser = function (htmlstr, ignoreBlank) {
        function text(parent, data) {
            if (needChild[parent.tagName]) {
                var tmpNode = uNode.createElement(needChild[parent.tagName]);
                parent.appendChild(tmpNode), tmpNode.appendChild(uNode.createText(data)), parent = tmpNode
            } else parent.appendChild(uNode.createText(data))
        }
        function element(parent, tagName, htmlattr) {
            var needParentTag;
            if (needParentTag = needParentNode[tagName]) {
                for (var hasParent, tmpParent = parent;
                "root" != tmpParent.type;) {
                    if (utils.isArray(needParentTag) ? -1 != utils.indexOf(needParentTag, tmpParent.tagName) :
                        needParentTag == tmpParent.tagName) {
                        parent = tmpParent, hasParent = !0;
                        break
                    }
                    tmpParent = tmpParent.parentNode
                }
                hasParent || (parent = element(parent, utils.isArray(needParentTag) ? needParentTag[0] : needParentTag))
            }
            var elm = new uNode({
                parentNode: parent,
                type: "element",
                tagName: tagName.toLowerCase(),
                children: dtd.$empty[tagName] ? null : []
            });
            if (htmlattr) {
                for (var match, attrs = {}; match = re_attr.exec(htmlattr);) attrs[match[1].toLowerCase()] =
                        notTransAttrs[match[1].toLowerCase()] ? match[2] || match[3] || match[4] : utils.unhtml(match[2] ||
                        match[3] || match[4]);
                elm.attrs = attrs
            }
            return parent.children.push(elm), dtd.$empty[tagName] ? parent : elm
        }
        function comment(parent, data) {
            parent.children.push(new uNode({
                type: "comment",
                data: data,
                parentNode: parent
            }))
        }
        var re_tag =
            /<(?:(?:\/([^>]+)>)|(?:!--([\S|\s]*?)-->)|(?:([^\s\/<>]+)\s*((?:(?:"[^"]*")|(?:'[^']*')|[^"'<>])*)\/?>))/g,
            re_attr = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g,
            allowEmptyTags = {
                b: 1,
                code: 1,
                i: 1,
                u: 1,
                strike: 1,
                s: 1,
                tt: 1,
                strong: 1,
                q: 1,
                samp: 1,
                em: 1,
                span: 1,
                sub: 1,
                img: 1,
                sup: 1,
                font: 1,
                big: 1,
                small: 1,
                iframe: 1,
                a: 1,
                br: 1,
                pre: 1
            };
        htmlstr = htmlstr.replace(new RegExp(domUtils.fillChar, "g"), ""), ignoreBlank || (htmlstr = htmlstr.replace(
            new RegExp("[\\r\\t\\n" + (ignoreBlank ? "" : " ") + "]*</?(\\w+)\\s*(?:[^>]*)>[\\r\\t\\n" + (ignoreBlank ?
            "" : " ") + "]*", "g"), function (a, b) {
            return b && allowEmptyTags[b.toLowerCase()] ? a.replace(/(^[\n\r]+)|([\n\r]+$)/g, "") : a.replace(new RegExp(
                "^[\\r\\n" + (ignoreBlank ? "" : " ") + "]+"), "").replace(new RegExp("[\\r\\n" + (ignoreBlank ? "" :
                " ") + "]+$"), "")
        }));
        for (var match, notTransAttrs = {
                href: 1,
                src: 1
            }, uNode = UE.uNode, needParentNode = {
                td: "tr",
                tr: ["tbody", "thead", "tfoot"],
                tbody: "table",
                th: "tr",
                thead: "table",
                tfoot: "table",
                caption: "table",
                li: ["ul", "ol"],
                dt: "dl",
                dd: "dl",
                option: "select"
            }, needChild = {
                ol: "li",
                ul: "li"
            }, currentIndex = 0, nextIndex = 0, root = new uNode({
                type: "root",
                children: []
            }), currentParent = root; match = re_tag.exec(htmlstr);) {
            currentIndex = match.index;
            try {
                if (currentIndex > nextIndex && text(currentParent, htmlstr.slice(nextIndex, currentIndex)), match[3])
                    dtd.$cdata[currentParent.tagName] ? text(currentParent, match[0]) : currentParent = element(
                        currentParent, match[3].toLowerCase(), match[4]);
                else if (match[1]) {
                    if ("root" != currentParent.type) if (dtd.$cdata[currentParent.tagName] && !dtd.$cdata[match[1]])
                            text(currentParent, match[0]);
                        else {
                            for (var tmpParent = currentParent;
                            "element" == currentParent.type && currentParent.tagName != match[1].toLowerCase();) if (
                                    currentParent = currentParent.parentNode, "root" == currentParent.type) throw currentParent =
                                        tmpParent, "break";
                            currentParent = currentParent.parentNode
                        }
                } else match[2] && comment(currentParent, match[2])
            } catch (e) {}
            nextIndex = re_tag.lastIndex
        }
        return nextIndex < htmlstr.length && text(currentParent, htmlstr.slice(nextIndex)), root
    }, filterNode = UE.filterNode = function () {
            function filterNode(node, rules) {
                switch (node.type) {
                case "text":
                    break;
                case "element":
                    var val;
                    if (val = rules[node.tagName]) if ("-" === val) node.parentNode.removeChild(node);
                        else if (utils.isFunction(val)) {
                        var parentNode = node.parentNode,
                            index = node.getIndex();
                        if (val(node), node.parentNode) {
                            if (node.children) for (var ci, i = 0; ci = node.children[i];) filterNode(ci, rules), ci.parentNode &&
                                        i++
                        } else for (var ci, i = index; ci = parentNode.children[i];) filterNode(ci, rules), ci.parentNode &&
                                    i++
                    } else {
                        var attrs = val.$;
                        if (attrs && node.attrs) {
                            var tmpVal, tmpAttrs = {};
                            for (var a in attrs) {
                                if (tmpVal = node.getAttr(a), "style" == a && utils.isArray(attrs[a])) {
                                    var tmpCssStyle = [];
                                    utils.each(attrs[a], function (v) {
                                        var tmp;
                                        (tmp = node.getStyle(v)) && tmpCssStyle.push(v + ":" + tmp)
                                    }), tmpVal = tmpCssStyle.join(";")
                                }
                                var attrPicker = attrs[a];
                                "function" == typeof attrPicker && (tmpVal = attrPicker(tmpVal, a, node)), tmpVal && (
                                    tmpAttrs[a] = tmpVal)
                            }
                            node.attrs = tmpAttrs
                        }
                        if (node.children) for (var ci, i = 0; ci = node.children[i];) filterNode(ci, rules), ci.parentNode &&
                                    i++
                    } else if (dtd.$cdata[node.tagName]) node.parentNode.removeChild(node);
                    else {
                        var parentNode = node.parentNode,
                            index = node.getIndex();
                        node.parentNode.removeChild(node, !0);
                        for (var ci, i = index; ci = parentNode.children[i];) filterNode(ci, rules), ci.parentNode && i++
                    }
                    break;
                case "comment":
                    node.parentNode.removeChild(node)
                }
            }
            return function (root, rules) {
                if (utils.isEmptyObject(rules)) return root;
                var val;
                (val = rules["-"]) && utils.each(val.split(" "), function (k) {
                    rules[k] = "-"
                });
                for (var ci, i = 0; ci = root.children[i];) filterNode(ci, rules), ci.parentNode && i++;
                return root
            }
        }();
    UE.plugin = function () {
        var _plugins = {};
        return {
            register: function (pluginName, fn, oldOptionName, afterDisabled) {
                oldOptionName && utils.isFunction(oldOptionName) && (afterDisabled = oldOptionName, oldOptionName =
                    null), _plugins[pluginName] = {
                    optionName: oldOptionName || pluginName,
                    execFn: fn,
                    afterDisabled: afterDisabled
                }
            },
            load: function (editor) {
                utils.each(_plugins, function (plugin) {
                    var _export = plugin.execFn.call(editor);
                    editor.options[plugin.optionName] !== !1 ? _export && utils.each(_export, function (v, k) {
                        switch (k.toLowerCase()) {
                        case "shortcutkey":
                            editor.addshortcutkey(v);
                            break;
                        case "bindevents":
                            utils.each(v, function (fn, eventName) {
                                editor.addListener(eventName, fn)
                            });
                            break;
                        case "bindmultievents":
                            utils.each(utils.isArray(v) ? v : [v], function (event) {
                                var types = utils.trim(event.type).split(/\s+/);
                                utils.each(types, function (eventName) {
                                    editor.addListener(eventName, event.handler)
                                })
                            });
                            break;
                        case "commands":
                            utils.each(v, function (execFn, execName) {
                                editor.commands[execName] = execFn
                            });
                            break;
                        case "outputrule":
                            editor.addOutputRule(v);
                            break;
                        case "inputrule":
                            editor.addInputRule(v);
                            break;
                        case "defaultoptions":
                            editor.setOpt(v)
                        }
                    }) : plugin.afterDisabled && plugin.afterDisabled.call(editor)
                }), utils.each(UE.plugins, function (plugin) {
                    plugin.call(editor)
                })
            },
            run: function (pluginName, editor) {
                var plugin = _plugins[pluginName];
                plugin && plugin.exeFn.call(editor)
            }
        }
    }();
    var keymap = UE.keymap = {
        Backspace: 8,
        Tab: 9,
        Enter: 13,
        Shift: 16,
        Control: 17,
        Alt: 18,
        CapsLock: 20,
        Esc: 27,
        Spacebar: 32,
        PageUp: 33,
        PageDown: 34,
        End: 35,
        Home: 36,
        Left: 37,
        Up: 38,
        Right: 39,
        Down: 40,
        Insert: 45,
        Del: 46,
        NumLock: 144,
        Cmd: 91,
        "=": 187,
        "-": 189,
        b: 66,
        i: 73,
        z: 90,
        y: 89,
        v: 86,
        x: 88,
        s: 83,
        n: 78
    }, LocalStorage = UE.LocalStorage = function () {
            function getUserData() {
                var container = document.createElement("div");
                return container.style.display = "none", container.addBehavior ? (container.addBehavior(
                    "#default#userdata"), {
                    getItem: function (key) {
                        var result = null;
                        try {
                            document.body.appendChild(container), container.load(LOCAL_FILE), result = container.getAttribute(
                                key), document.body.removeChild(container)
                        } catch (e) {}
                        return result
                    },
                    setItem: function (key, value) {
                        document.body.appendChild(container), container.setAttribute(key, value), container.save(
                            LOCAL_FILE), document.body.removeChild(container)
                    },
                    removeItem: function (key) {
                        document.body.appendChild(container), container.removeAttribute(key), container.save(LOCAL_FILE),
                            document.body.removeChild(container)
                    }
                }) : null
            }
            var storage = window.localStorage || getUserData() || null,
                LOCAL_FILE = "localStorage";
            return {
                saveLocalData: function (key, data) {
                    return storage && data ? (storage.setItem(key, data), !0) : !1
                },
                getLocalData: function (key) {
                    return storage ? storage.getItem(key) : null
                },
                removeItem: function (key) {
                    storage && storage.removeItem(key)
                }
            }
        }();
    ! function () {
        var ROOTKEY = "ueditor_preference";
        UE.Editor.prototype.setPreferences = function (key, value) {
            var obj = {};
            utils.isString(key) ? obj[key] = value : obj = key;
            var data = LocalStorage.getLocalData(ROOTKEY);
            data && (data = utils.str2json(data)) ? utils.extend(data, obj) : data = obj, data && LocalStorage.saveLocalData(
                ROOTKEY, utils.json2str(data))
        }, UE.Editor.prototype.getPreferences = function (key) {
            var data = LocalStorage.getLocalData(ROOTKEY);
            return data && (data = utils.str2json(data)) ? key ? data[key] : data : null
        }, UE.Editor.prototype.removePreferences = function (key) {
            var data = LocalStorage.getLocalData(ROOTKEY);
            data && (data = utils.str2json(data)) && (data[key] = void 0, delete data[key]), data && LocalStorage.saveLocalData(
                ROOTKEY, utils.json2str(data))
        }
    }(), UE.plugins.defaultfilter = function () {
        var me = this;
        me.setOpt({
            allowDivTransToP: !0,
            disabledTableInTable: !0
        }), me.addInputRule(function (root) {
            function tdParent(node) {
                for (; node && "element" == node.type;) {
                    if ("td" == node.tagName) return !0;
                    node = node.parentNode
                }
                return !1
            }
            var val, allowDivTransToP = this.options.allowDivTransToP;
            root.traversal(function (node) {
                if ("element" == node.type) {
                    if (!dtd.$cdata[node.tagName] && me.options.autoClearEmptyNode && dtd.$inline[node.tagName] && !dtd
                        .$empty[node.tagName] && (!node.attrs || utils.isEmptyObject(node.attrs))) return void(node.firstChild() ?
                            "span" != node.tagName || node.attrs && !utils.isEmptyObject(node.attrs) || node.parentNode
                            .removeChild(node, !0) : node.parentNode.removeChild(node));
                    switch (node.tagName) {
                    case "style":
                    case "script":
                        node.setAttr({
                            cdata_tag: node.tagName,
                            cdata_data: node.innerHTML() || "",
                            _ue_custom_node_: "true"
                        }), node.tagName = "div", node.innerHTML("");
                        break;
                    case "a":
                        (val = node.getAttr("href")) && node.setAttr("_href", val);
                        break;
                    case "img":
                        if ((val = node.getAttr("src")) && /^data:/.test(val)) {
                            node.parentNode.removeChild(node);
                            break
                        }
                        node.setAttr("_src", node.getAttr("src"));
                        break;
                    case "span":
                        browser.webkit && (val = node.getStyle("white-space")) && /nowrap|normal/.test(val) && (node.setStyle(
                            "white-space", ""), me.options.autoClearEmptyNode && utils.isEmptyObject(node.attrs) &&
                            node.parentNode.removeChild(node, !0)), val = node.getAttr("id"), val &&
                            /^_baidu_bookmark_/i.test(val) && node.parentNode.removeChild(node);
                        break;
                    case "p":
                        (val = node.getAttr("align")) && (node.setAttr("align"), node.setStyle("text-align", val)),
                            utils.each(node.children, function (n) {
                            if ("element" == n.type && "p" == n.tagName) {
                                var next = n.nextSibling();
                                node.parentNode.insertAfter(n, node);
                                for (var last = n; next;) {
                                    var tmp = next.nextSibling();
                                    node.parentNode.insertAfter(next, last), last = next, next = tmp
                                }
                                return !1
                            }
                        }), node.firstChild() || node.innerHTML(browser.ie ? " " : "<br/>");
                        break;
                    case "div":
                        if (node.getAttr("cdata_tag")) break;
                        if (val = node.getAttr("class"), val && /^line number\d+/.test(val)) break;
                        if ("pgc-img-container" === val) break;
                        if (!allowDivTransToP) break;
                        for (var tmpNode, p = UE.uNode.createElement("p"); tmpNode = node.firstChild();) "text" !=
                                tmpNode.type && UE.dom.dtd.$block[tmpNode.tagName] ? p.firstChild() ? (node.parentNode.insertBefore(
                                p, node), p = UE.uNode.createElement("p")) : node.parentNode.insertBefore(tmpNode, node) :
                                p.appendChild(tmpNode);
                        p.firstChild() && node.parentNode.insertBefore(p, node), node.parentNode.removeChild(node);
                        break;
                    case "dl":
                        node.tagName = "ul";
                        break;
                    case "dt":
                    case "dd":
                        node.tagName = "li";
                        break;
                    case "li":
                        var className = node.getAttr("class");
                        className && /list\-/.test(className) || node.setAttr();
                        var tmpNodes = node.getNodesByTagName("ol ul");
                        UE.utils.each(tmpNodes, function (n) {
                            node.parentNode.insertAfter(n, node)
                        });
                        break;
                    case "td":
                    case "th":
                    case "caption":
                        node.children && node.children.length || node.appendChild(browser.ie11below ? UE.uNode.createText(
                            " ") : UE.uNode.createElement("br"));
                        break;
                    case "table":
                        me.options.disabledTableInTable && tdParent(node) && (node.parentNode.insertBefore(UE.uNode.createText(
                            node.innerText()), node), node.parentNode.removeChild(node))
                    }
                }
            })
        }), me.addOutputRule(function (root) {
            var val;
            root.traversal(function (node) {
                if ("element" == node.type) {
                    if (me.options.autoClearEmptyNode && dtd.$inline[node.tagName] && !dtd.$empty[node.tagName] && (!
                        node.attrs || utils.isEmptyObject(node.attrs))) return void(node.firstChild() ? "span" != node.tagName ||
                            node.attrs && !utils.isEmptyObject(node.attrs) || node.parentNode.removeChild(node, !0) :
                            node.parentNode.removeChild(node));
                    switch (node.tagName) {
                    case "div":
                        (val = node.getAttr("cdata_tag")) && (node.tagName = val, node.appendChild(UE.uNode.createText(
                            node.getAttr("cdata_data"))), node.setAttr({
                            cdata_tag: "",
                            cdata_data: "",
                            _ue_custom_node_: ""
                        }));
                        break;
                    case "a":
                        (val = node.getAttr("_href")) && node.setAttr({
                            href: utils.html(val),
                            _href: ""
                        });
                        break;
                    case "span":
                        val = node.getAttr("id"), val && /^_baidu_bookmark_/i.test(val) && node.parentNode.removeChild(
                            node);
                        break;
                    case "img":
                        (val = node.getAttr("_src")) && node.setAttr({
                            src: node.getAttr("_src"),
                            _src: ""
                        })
                    }
                }
            })
        })
    }, UE.commands.inserthtml = {
        execCommand: function (command, html, notNeedFilter) {
            var range, div, me = this;
            if (html && me.fireEvent("beforeinserthtml", html) !== !0) {
                if (range = me.selection.getRange(), div = range.document.createElement("div"), div.style.display =
                    "inline", !notNeedFilter) {
                    var root = UE.htmlparser(html);
                    me.options.filterRules && UE.filterNode(root, me.options.filterRules), me.filterInputRule(root),
                        html = root.toHtml()
                }
                if (div.innerHTML = utils.trim(html), !range.collapsed) {
                    var tmpNode = range.startContainer;
                    if (domUtils.isFillChar(tmpNode) && range.setStartBefore(tmpNode), tmpNode = range.endContainer,
                        domUtils.isFillChar(tmpNode) && range.setEndAfter(tmpNode), range.txtToElmBoundary(), range.endContainer &&
                        1 == range.endContainer.nodeType && (tmpNode = range.endContainer.childNodes[range.endOffset],
                        tmpNode && domUtils.isBr(tmpNode) && range.setEndAfter(tmpNode)), 0 == range.startOffset && (
                        tmpNode = range.startContainer, domUtils.isBoundaryNode(tmpNode, "firstChild") && (tmpNode =
                        range.endContainer, range.endOffset == (3 == tmpNode.nodeType ? tmpNode.nodeValue.length :
                        tmpNode.childNodes.length) && domUtils.isBoundaryNode(tmpNode, "lastChild") && (me.body.innerHTML =
                        "<p>" + (browser.ie ? "" : "<br/>") + "</p>", range.setStart(me.body.firstChild, 0).collapse(!0)))), !
                        range.collapsed && range.deleteContents(), 1 == range.startContainer.nodeType) {
                        var pre, child = range.startContainer.childNodes[range.startOffset];
                        if (child && domUtils.isBlockElm(child) && (pre = child.previousSibling) && domUtils.isBlockElm(
                            pre)) {
                            for (range.setEnd(pre, pre.childNodes.length).collapse(); child.firstChild;) pre.appendChild(
                                    child.firstChild);
                            domUtils.remove(child)
                        }
                    }
                }
                var child, parent, pre, tmp, nextNode, hadBreak = 0;
                range.inFillChar() && (child = range.startContainer, domUtils.isFillChar(child) ? (range.setStartBefore(
                    child).collapse(!0), domUtils.remove(child)) : domUtils.isFillChar(child, !0) && (child.nodeValue =
                    child.nodeValue.replace(fillCharReg, ""), range.startOffset--, range.collapsed && range.collapse(!0)));
                var li = domUtils.findParentByTagName(range.startContainer, "li", !0);
                if (li) {
                    for (var next, last; child = div.firstChild;) {
                        for (; child && (3 == child.nodeType || !domUtils.isBlockElm(child) || "HR" == child.tagName);)
                            next = child.nextSibling, range.insertNode(child).collapse(), last = child, child = next;
                        if (child) if (/^(ol|ul)$/i.test(child.tagName)) {
                                for (; child.firstChild;) last = child.firstChild, domUtils.insertAfter(li, child.firstChild),
                                        li = li.nextSibling;
                                domUtils.remove(child)
                            } else {
                                var tmpLi;
                                next = child.nextSibling, tmpLi = me.document.createElement("li"), domUtils.insertAfter(
                                    li, tmpLi), tmpLi.appendChild(child), last = child, child = next, li = tmpLi
                            }
                    }
                    li = domUtils.findParentByTagName(range.startContainer, "li", !0), domUtils.isEmptyBlock(li) &&
                        domUtils.remove(li), last && range.setStartAfter(last).collapse(!0).select(!0)
                } else {
                    for (; child = div.firstChild;) {
                        if (hadBreak) {
                            for (var p = me.document.createElement("p"); child && (3 == child.nodeType || !dtd.$block[
                                child.tagName]);) nextNode = child.nextSibling, p.appendChild(child), child = nextNode;
                            p.firstChild && (child = p)
                        }
                        if (range.insertNode(child), nextNode = child.nextSibling, !hadBreak && child.nodeType ==
                            domUtils.NODE_ELEMENT && domUtils.isBlockElm(child) && (parent = domUtils.findParent(child, function (
                            node) {
                            return domUtils.isBlockElm(node)
                        }), parent && "body" != parent.tagName.toLowerCase() && (!dtd[parent.tagName][child.nodeName] ||
                            child.parentNode !== parent))) {
                            if (dtd[parent.tagName][child.nodeName]) for (tmp = child.parentNode; tmp !== parent;) pre =
                                        tmp, tmp = tmp.parentNode;
                            else pre = parent;
                            domUtils.breakParent(child, pre || tmp);
                            var pre = child.previousSibling;
                            domUtils.trimWhiteTextNode(pre), pre.childNodes.length || domUtils.remove(pre), !browser.ie &&
                                (next = child.nextSibling) && domUtils.isBlockElm(next) && next.lastChild && !domUtils.isBr(
                                next.lastChild) && next.appendChild(me.document.createElement("br")), hadBreak = 1
                        }
                        var next = child.nextSibling;
                        if (!div.firstChild && next && domUtils.isBlockElm(next)) {
                            range.setStart(next, 0).collapse(!0);
                            break
                        }
                        range.setEndAfter(child).collapse()
                    }
                    if (child = range.startContainer, nextNode && domUtils.isBr(nextNode) && domUtils.remove(nextNode),
                        domUtils.isBlockElm(child) && domUtils.isEmptyNode(child)) if (nextNode = child.nextSibling)
                            domUtils.remove(child), 1 == nextNode.nodeType && dtd.$block[nextNode.tagName] && range.setStart(
                                nextNode, 0).collapse(!0).shrinkBoundary();
                        else try {
                                child.innerHTML = browser.ie ? domUtils.fillChar : "<br/>"
                        } catch (e) {
                        range.setStartBefore(child), domUtils.remove(child)
                    }
                    try {
                        range.select(!0)
                    } catch (e) {}
                }
                setTimeout(function () {
                    range = me.selection.getRange(), range.scrollToView(me.autoHeightEnabled, me.autoHeightEnabled ?
                        domUtils.getXY(me.iframe).y : 0), me.fireEvent("afterinserthtml", html)
                }, 200)
            }
        }
    }, UE.plugins.autotypeset = function () {
        function isLine(node, notEmpty) {
            return node && 3 != node.nodeType ? domUtils.isBr(node) ? 1 : node && node.parentNode && tags[node.tagName.toLowerCase()] ?
                highlightCont && highlightCont.contains(node) || node.getAttribute("pagebreak") ? 0 : notEmpty ? !
                domUtils.isEmptyBlock(node) : domUtils.isEmptyBlock(node, new RegExp("[\\s" + domUtils.fillChar + "]",
                "g")) : void 0 : 0
        }
        function removeNotAttributeSpan(node) {
            node.style.cssText || (domUtils.removeAttributes(node, ["style"]), "span" == node.tagName.toLowerCase() &&
                domUtils.hasNoAttributes(node) && domUtils.remove(node, !0))
        }
        function autotype(type, html) {
            var cont, me = this;
            if (html) {
                if (!opt.pasteFilter) return;
                cont = me.document.createElement("div"), cont.innerHTML = html.html
            } else cont = me.document.body;
            for (var ci, nodes = domUtils.getElementsByTagName(cont, "*"), i = 0; ci = nodes[i++];) if (me.fireEvent(
                    "excludeNodeinautotype", ci) !== !0) {
                    if (opt.clearFontSize && ci.style.fontSize && (domUtils.removeStyle(ci, "font-size"),
                        removeNotAttributeSpan(ci)), opt.clearFontFamily && ci.style.fontFamily && (domUtils.removeStyle(
                        ci, "font-family"), removeNotAttributeSpan(ci)), isLine(ci)) {
                        if (opt.mergeEmptyline) for (var tmpNode, next = ci.nextSibling, isBr = domUtils.isBr(ci); isLine(
                                next) && (tmpNode = next, next = tmpNode.nextSibling, !isBr || next && (!next ||
                                domUtils.isBr(next)));) domUtils.remove(tmpNode);
                        if (opt.removeEmptyline && domUtils.inDoc(ci, cont) && !remainTag[ci.parentNode.tagName.toLowerCase()]) {
                            if (domUtils.isBr(ci) && (next = ci.nextSibling, next && !domUtils.isBr(next))) continue;
                            domUtils.remove(ci);
                            continue
                        }
                    }
                    if (isLine(ci, !0) && "SPAN" != ci.tagName && (opt.indent && (ci.style.textIndent = opt.indentValue),
                        opt.textAlign && (ci.style.textAlign = opt.textAlign)), opt.removeClass && ci.className && !
                        remainClass[ci.className.toLowerCase()]) {
                        if (highlightCont && highlightCont.contains(ci)) continue;
                        domUtils.removeAttributes(ci, ["class"])
                    }
                    if (opt.imageBlockLine && "img" == ci.tagName.toLowerCase() && !ci.getAttribute("emotion")) if (
                            html) {
                            var img = ci;
                            switch (opt.imageBlockLine) {
                            case "left":
                            case "right":
                            case "none":
                                for (var tmpNode, pre, next, pN = img.parentNode; dtd.$inline[pN.tagName] || "A" == pN.tagName;)
                                    pN = pN.parentNode;
                                if (tmpNode = pN, "P" == tmpNode.tagName && "center" == domUtils.getStyle(tmpNode,
                                    "text-align") && !domUtils.isBody(tmpNode) && 1 == domUtils.getChildCount(tmpNode, function (
                                    node) {
                                    return !domUtils.isBr(node) && !domUtils.isWhitespace(node)
                                })) if (pre = tmpNode.previousSibling, next = tmpNode.nextSibling, pre && next && 1 ==
                                        pre.nodeType && 1 == next.nodeType && pre.tagName == next.tagName && domUtils.isBlockElm(
                                        pre)) {
                                        for (pre.appendChild(tmpNode.firstChild); next.firstChild;) pre.appendChild(
                                                next.firstChild);
                                        domUtils.remove(tmpNode), domUtils.remove(next)
                                    } else domUtils.setStyle(tmpNode, "text-align", "");
                                domUtils.setStyle(img, "float", opt.imageBlockLine);
                                break;
                            case "center":
                                if ("center" != me.queryCommandValue("imagefloat")) {
                                    for (pN = img.parentNode, domUtils.setStyle(img, "float", "none"), tmpNode = img; pN &&
                                        1 == domUtils.getChildCount(pN, function (node) {
                                        return !domUtils.isBr(node) && !domUtils.isWhitespace(node)
                                    }) && (dtd.$inline[pN.tagName] || "A" == pN.tagName);) tmpNode = pN, pN = pN.parentNode;
                                    var pNode = me.document.createElement("p");
                                    domUtils.setAttributes(pNode, {
                                        style: "text-align:center"
                                    }), tmpNode.parentNode.insertBefore(pNode, tmpNode), pNode.appendChild(tmpNode),
                                        domUtils.setStyle(tmpNode, "float", "")
                                }
                            }
                        } else {
                            var range = me.selection.getRange();
                            range.selectNode(ci).select(), me.execCommand("imagefloat", opt.imageBlockLine)
                        }
                    opt.removeEmptyNode && opt.removeTagNames[ci.tagName.toLowerCase()] && domUtils.hasNoAttributes(ci) &&
                        domUtils.isEmptyBlock(ci) && domUtils.remove(ci)
                }
            if (opt.tobdc) {
                var root = UE.htmlparser(cont.innerHTML);
                root.traversal(function (node) {
                    "text" == node.type && (node.data = ToDBC(node.data))
                }), cont.innerHTML = root.toHtml()
            }
            if (opt.bdc2sb) {
                var root = UE.htmlparser(cont.innerHTML);
                root.traversal(function (node) {
                    "text" == node.type && (node.data = DBC2SB(node.data))
                }), cont.innerHTML = root.toHtml()
            }
            html && (html.html = cont.innerHTML)
        }
        function DBC2SB(str) {
            for (var result = "", i = 0; i < str.length; i++) {
                var code = str.charCodeAt(i);
                result += code >= 65281 && 65373 >= code ? String.fromCharCode(str.charCodeAt(i) - 65248) : 12288 ==
                    code ? String.fromCharCode(str.charCodeAt(i) - 12288 + 32) : str.charAt(i)
            }
            return result
        }
        function ToDBC(txtstring) {
            txtstring = utils.html(txtstring);
            for (var tmp = "", i = 0; i < txtstring.length; i++) tmp += 32 == txtstring.charCodeAt(i) ? String.fromCharCode(
                    12288) : txtstring.charCodeAt(i) < 127 ? String.fromCharCode(txtstring.charCodeAt(i) + 65248) :
                    txtstring.charAt(i);
            return tmp
        }
        function readLocalOpts() {
            var cookieOpt = me.getPreferences("autotypeset");
            utils.extend(me.options.autotypeset, cookieOpt)
        }
        this.setOpt({
            autotypeset: {
                mergeEmptyline: !0,
                removeClass: !0,
                removeEmptyline: !0,
                textAlign: "left",
                imageBlockLine: "center",
                pasteFilter: !0,
                clearFontSize: !0,
                clearFontFamily: !0,
                removeEmptyNode: !0,
                leftTrim: !0,
                removeTagNames: utils.extend({
                    div: 1
                }, dtd.$removeEmpty),
                indent: !1,
                indentValue: "2em",
                bdc2sb: !1,
                tobdc: !1
            }
        });
        var highlightCont, me = this,
            opt = me.options.autotypeset,
            remainClass = {
                selectTdClass: 1,
                pagebreak: 1,
                anchorclass: 1
            }, remainTag = {
                li: 1
            }, tags = {
                div: 1,
                p: 1,
                blockquote: 1,
                center: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1,
                span: 1
            };
        opt && (readLocalOpts(), opt.pasteFilter && me.addListener("beforepaste", autotype), me.commands.autotypeset = {
            execCommand: function () {
                me.removeListener("beforepaste", autotype), opt.pasteFilter && me.addListener("beforepaste", autotype),
                    autotype.call(me)
            }
        })
    }, UE.plugin.register("autosubmit", function () {
        return {
            shortcutkey: {
                autosubmit: "ctrl+13"
            },
            commands: {
                autosubmit: {
                    execCommand: function () {
                        var me = this,
                            form = domUtils.findParentByTagName(me.iframe, "form", !1);
                        if (form) {
                            if (me.fireEvent("beforesubmit") === !1) return;
                            me.sync(), form.submit()
                        }
                    }
                }
            }
        }
    }), UE.plugin.register("background", function () {
        function stringToObj(str) {
            var obj = {}, styles = str.split(";");
            return utils.each(styles, function (v) {
                var index = v.indexOf(":"),
                    key = utils.trim(v.substr(0, index)).toLowerCase();
                key && (obj[key] = utils.trim(v.substr(index + 1) || ""))
            }), obj
        }
        function setBackground(obj) {
            if (obj) {
                var styles = [];
                for (var name in obj) obj.hasOwnProperty(name) && styles.push(name + ":" + obj[name] + "; ");
                utils.cssRule(cssRuleId, styles.length ? "body{" + styles.join("") + "}" : "", me.document)
            } else utils.cssRule(cssRuleId, "", me.document)
        }
        var isSetColored, me = this,
            cssRuleId = "editor_background",
            reg = new RegExp("body[\\s]*\\{(.+)\\}", "i"),
            orgFn = me.hasContents;
        return me.hasContents = function () {
            return me.queryCommandValue("background") ? !0 : orgFn.apply(me, arguments)
        }, {
            bindEvents: {
                getAllHtml: function (type, headHtml) {
                    var body = this.body,
                        su = domUtils.getComputedStyle(body, "background-image"),
                        url = "";
                    url = su.indexOf(me.options.imagePath) > 0 ? su.substring(su.indexOf(me.options.imagePath), su.length -
                        1).replace(/"|\(|\)/gi, "") : "none" != su ? su.replace(/url\("?|"?\)/gi, "") : "";
                    var html = '<style type="text/css">body{',
                        bgObj = {
                            "background-color": domUtils.getComputedStyle(body, "background-color") || "#ffffff",
                            "background-image": url ? "url(" + url + ")" : "",
                            "background-repeat": domUtils.getComputedStyle(body, "background-repeat") || "",
                            "background-position": browser.ie ? domUtils.getComputedStyle(body, "background-position-x") + " " + domUtils
                                .getComputedStyle(body, "background-position-y") : domUtils.getComputedStyle(body,
                                "background-position"),
                            height: domUtils.getComputedStyle(body, "height")
                        };
                    for (var name in bgObj) bgObj.hasOwnProperty(name) && (html += name + ":" + bgObj[name] + "; ");
                    html += "}</style> ", headHtml.push(html)
                },
                aftersetcontent: function () {
                    0 == isSetColored && setBackground()
                }
            },
            inputRule: function (root) {
                isSetColored = !1, utils.each(root.getNodesByTagName("p"), function (p) {
                    var styles = p.getAttr("data-background");
                    styles && (isSetColored = !0, setBackground(stringToObj(styles)), p.parentNode.removeChild(p))
                })
            },
            outputRule: function (root) {
                var me = this,
                    styles = (utils.cssRule(cssRuleId, me.document) || "").replace(/[\n\r]+/g, "").match(reg);
                styles && root.appendChild(UE.uNode.createElement('<p style="display:none;" data-background="' + utils.trim(
                    styles[1].replace(/"/g, "").replace(/[\s]+/g, " ")) + '"><br/></p>'))
            },
            commands: {
                background: {
                    execCommand: function (cmd, obj) {
                        setBackground(obj)
                    },
                    queryCommandValue: function () {
                        var me = this,
                            styles = (utils.cssRule(cssRuleId, me.document) || "").replace(/[\n\r]+/g, "").match(reg);
                        return styles ? stringToObj(styles[1]) : null
                    },
                    notNeedUndo: !0
                }
            }
        }
    }), UE.commands.imagefloat = {
        execCommand: function (cmd, align) {
            var me = this,
                range = me.selection.getRange();
            if (!range.collapsed) {
                var img = range.getClosedNode();
                if (img && "IMG" == img.tagName) switch (align) {
                    case "left":
                    case "right":
                    case "none":
                        for (var tmpNode, pre, next, pN = img.parentNode; dtd.$inline[pN.tagName] || "A" == pN.tagName;)
                            pN = pN.parentNode;
                        if (tmpNode = pN, "P" == tmpNode.tagName && "center" == domUtils.getStyle(tmpNode, "text-align")) {
                            if (!domUtils.isBody(tmpNode) && 1 == domUtils.getChildCount(tmpNode, function (node) {
                                return !domUtils.isBr(node) && !domUtils.isWhitespace(node)
                            })) if (pre = tmpNode.previousSibling, next = tmpNode.nextSibling, pre && next && 1 == pre.nodeType &&
                                    1 == next.nodeType && pre.tagName == next.tagName && domUtils.isBlockElm(pre)) {
                                    for (pre.appendChild(tmpNode.firstChild); next.firstChild;) pre.appendChild(next.firstChild);
                                    domUtils.remove(tmpNode), domUtils.remove(next)
                                } else domUtils.setStyle(tmpNode, "text-align", "");
                            range.selectNode(img).select()
                        }
                        domUtils.setStyle(img, "float", "none" == align ? "" : align), "none" == align && domUtils.removeAttributes(
                            img, "align");
                        break;
                    case "center":
                        if ("center" != me.queryCommandValue("imagefloat")) {
                            for (pN = img.parentNode, domUtils.setStyle(img, "float", ""), domUtils.removeAttributes(
                                img, "align"), tmpNode = img; pN && 1 == domUtils.getChildCount(pN, function (node) {
                                return !domUtils.isBr(node) && !domUtils.isWhitespace(node)
                            }) && (dtd.$inline[pN.tagName] || "A" == pN.tagName);) tmpNode = pN, pN = pN.parentNode;
                            range.setStartBefore(tmpNode).setCursor(!1), pN = me.document.createElement("div"), pN.appendChild(
                                tmpNode), domUtils.setStyle(tmpNode, "float", ""), me.execCommand("insertHtml",
                                '<p id="_img_parent_tmp" style="text-align:center">' + pN.innerHTML + "</p>"), tmpNode =
                                me.document.getElementById("_img_parent_tmp"), tmpNode.removeAttribute("id"), tmpNode =
                                tmpNode.firstChild, range.selectNode(tmpNode).select(), next = tmpNode.parentNode.nextSibling,
                                next && domUtils.isEmptyNode(next) && domUtils.remove(next)
                        }
                }
            }
        },
        queryCommandValue: function () {
            var startNode, floatStyle, range = this.selection.getRange();
            return range.collapsed ? "none" : (startNode = range.getClosedNode(), startNode && 1 == startNode.nodeType &&
                "IMG" == startNode.tagName ? (floatStyle = domUtils.getComputedStyle(startNode, "float") || startNode.getAttribute(
                "align"), "none" == floatStyle && (floatStyle = "center" == domUtils.getComputedStyle(startNode.parentNode,
                "text-align") ? "center" : floatStyle), {
                left: 1,
                right: 1,
                center: 1
            }[floatStyle] ? floatStyle : "none") : "none")
        },
        queryCommandState: function () {
            var startNode, range = this.selection.getRange();
            return range.collapsed ? -1 : (startNode = range.getClosedNode(), startNode && 1 == startNode.nodeType &&
                "IMG" == startNode.tagName ? 0 : -1)
        }
    }, UE.commands.insertimage = {
        execCommand: function (cmd, opt) {
            if (opt = utils.isArray(opt) ? opt : [opt], opt.length) {
                var me = this,
                    range = me.selection.getRange(),
                    img = range.getClosedNode();
                if (me.fireEvent("beforeinsertimage", opt) !== !0) {
                    if (!img || !/img/i.test(img.tagName) || "edui-faked-video" == img.className && -1 == img.className
                        .indexOf("edui-upload-video") || img.getAttribute("word_img")) {
                        var ci, html = [],
                            str = "";
                        if (ci = opt[0], 1 == opt.length) str =
                                '<img onload="editor.fireEvent(\'contentchange\')" src="' + ci.src + '" ' + (ci._src ?
                                ' _src="' + ci._src + '" ' : "") + (ci.width ? 'width="' + ci.width + '" ' : "") + (ci.height ?
                                ' height="' + ci.height + '" ' : "") + ("left" == ci.floatStyle || "right" == ci.floatStyle ?
                                ' style="float:' + ci.floatStyle + ';"' : "") + (ci.title && "" != ci.title ?
                                ' title="' + ci.title + '"' : "") + (ci.border && "0" != ci.border ? ' border="' + ci.border +
                                '"' : "") + (ci.alt && "" != ci.alt ? ' alt="' + ci.alt + '"' : "") + (ci.hspace && "0" !=
                                ci.hspace ? ' hspace = "' + ci.hspace + '"' : "") + (ci.vspace && "0" != ci.vspace ?
                                ' vspace = "' + ci.vspace + '"' : "") + "/>", "center" == ci.floatStyle && (str =
                                '<p style="text-align: center">' + str + "</p>"), html.push(str);
                        else for (var i = 0; ci = opt[i++];) str = "<p " + ("center" == ci.floatStyle ?
                                    'style="text-align: center" ' : "") +
                                    '><img onload="editor.fireEvent(\'contentchange\')" src="' + ci.src + '" ' + (ci.width ?
                                    'width="' + ci.width + '" ' : "") + (ci._src ? ' _src="' + ci._src + '" ' : "") + (
                                    ci.height ? ' height="' + ci.height + '" ' : "") + ' style="' + (ci.floatStyle &&
                                    "center" != ci.floatStyle ? "float:" + ci.floatStyle + ";" : "") + (ci.border || "") +
                                    '" ' + (ci.title ? ' title="' + ci.title + '"' : "") + " /></p>", html.push(str);
                        me.execCommand("insertHtml", html.join(""))
                    } else {
                        var first = opt.shift(),
                            floatStyle = first.floatStyle;
                        delete first.floatStyle, domUtils.setAttributes(img, first), me.execCommand("imagefloat",
                            floatStyle), opt.length > 0 && (range.setStartAfter(img).setCursor(!1, !0), me.execCommand(
                            "insertimage", opt))
                    }
                    me.fireEvent("afterinsertimage", opt)
                }
            }
        }
    }, UE.plugins.insertimagewithcaption = function () {
        function createImgClass() {
            return "edui-inserted-image-" + _imgClassId++
        }
        function fireContentChangeOnImgLoaded() {
            function handleImgLoaded(img, cls) {
                domUtils.removeClasses(img, cls), loadedCount++, total === loadedCount && editor.fireEvent(
                    "contentchange")
            }
            var total = waitToLoadQueue.length,
                loadedCount = 0;
            utils.each(waitToLoadQueue, function (className) {
                var img = editor.document.querySelector("." + className);
                img && (img.complete && "undefined" != typeof img.naturalWidth && 0 !== img.naturalWidth ?
                    handleImgLoaded(img, className) : domUtils.on(img, "load", function () {
                    handleImgLoaded(img, className)
                }))
            }), waitToLoadQueue = []
        }
        function getPopup() {
            return _popup || (_popup = new InputAttachPopup("code", editor, {
                className: "edui-img-caption-popup",
                view: {
                    top: -1,
                    bottom: -1
                }
            })), _popup
        }
        var editor = this,
            emptyPlaceholder = "请点击输入图片描述",
            ui = UE.ui,
            imgContainerCls = ui.imgContainerCls = "pgc-img-container",
            imgCaptionCls = ui.imgCaptionCls = "pgc-img-caption",
            _imgClassId = 1,
            waitToLoadQueue = [],
            buildImgHtml = ui.uiUtils.buildImgHtml = function (src, attrs, placeholder, notPushQueue) {
                placeholder = placeholder || emptyPlaceholder;
                var imgClass = createImgClass();
                notPushQueue || waitToLoadQueue.push(imgClass);
                var dataStrArr = [];
                attrs && attrs.data && utils.each(attrs.data, function (val, key) {
                    val && dataStrArr.push("data-" + key + '="' + val + '"')
                });
                var cls = [imgClass];
                attrs && attrs.className && cls.push(attrs.className);
                var safeSrc = encodeURI(src);
                return '<div class="' + imgContainerCls + '" contenteditable="false"><p><img ' + (attrs && attrs.id ?
                    'id="' + attrs.id + '" ' : "") + 'class="' + cls.join(" ") + '" src="' + safeSrc + '" ' +
                    dataStrArr.join("") + ' /></p><p class="' + imgCaptionCls + '">' + placeholder + "</p></div>"
            }, AttachPopup = ui.AttachPopup,
            InputAttachPopup = ui.InputAttachPopup = function (name, editor, options) {
                this["super"] = AttachPopup, this.superPro = AttachPopup.prototype;
                var opts = {
                    maxLength: 50,
                    type: "text",
                    id: "edui-inputap-inputid",
                    position: {
                        top: "before",
                        left: "middle"
                    },
                    width: "424px",
                    height: "42px",
                    marginTop: -10
                };
                utils.extend(opts, options), opts.className = (opts.className || "") + " edui-inputap", opts.tpl =
                    '<div class="edui-inputap-body"><input id="' + opts.id + '" type="' + opts.type + '" maxlength="' +
                    opts.maxLength +
                    '" /><div class="edui-inputap-close">×</div><div class="edui-inputap-arrow"></div>', this["super"].call(
                    this, name, editor, opts)
            };
        InputAttachPopup.prototype = {
            bindEvents: function () {
                this.superPro.bindEvents.apply(this, arguments)
            },
            queryAutoHide: function (el) {
                return el && domUtils.hasClass(el, imgCaptionCls) ? !1 : this.superPro.queryAutoHide.apply(this,
                    arguments)
            },
            onpostrender: function () {
                var dom = this.getDom(),
                    input = domUtils.getElementsByTagName(dom, "input")[0],
                    closeBtn = dom.querySelector(".edui-inputap-close");
                this.input = input, this.closeBtn = closeBtn, this.bindInputEvent(), this.bindCloseEvent()
            },
            bindInputEvent: function () {
                var it = this;
                domUtils.on(this.input, "keyup", function (e) {
                    if (13 === e.keyCode) return void it.hide();
                    var val = e.target.value,
                        opts = it.options;
                    "text" === opts.type && val.length > opts.maxLength && (val = val.slice(0, opts.maxLength), e.target
                        .value = val), it.target.innerHTML = 0 === val.length ? emptyPlaceholder : val, it.fireEvent(
                        "change")
                })
            },
            bindCloseEvent: function () {
                var it = this;
                domUtils.on(this.closeBtn, "click", function () {
                    it.hide()
                })
            },
            onhide: function () {
                this.input.value = ""
            },
            onshow: function () {
                var val = this.target[browser.id ? "textContent" : "innerText"] || "";
                val = val.replace(/[\u200B-\u200D\uFEFF\r\n]/g, ""), val === emptyPlaceholder && (val = ""), this.input
                    .value = val, this.input.focus()
            }
        }, utils.inherits(InputAttachPopup, AttachPopup);
        var _popup;
        UE.commands.insertimagewithcaption = {
            execCommand: function (cmd, opt) {
                function isEmpty(body) {
                    if (1 !== body.childNodes.length) return !1;
                    var text = body[browser.ie ? "textContent" : "innerText"].replace(/[\u200B-\u200D\uFEFF\r\n]/g, "");
                    return 0 === text.length
                }
                if (opt = utils.isArray(opt) ? opt : [opt], opt.length) {
                    var me = this,
                        range = me.selection.getRange(),
                        img = range.getClosedNode();
                    if (me.fireEvent("beforeinsertimagewithcaption", opt) !== !0) {
                        if (!img || !/img/i.test(img.tagName) || "edui-faked-video" == img.className && -1 == img.className
                            .indexOf("edui-upload-video") || img.getAttribute("word_img")) {
                            var ci, html = [],
                                str = "";
                            if (ci = opt[0], 1 == opt.length) str = buildImgHtml(ci.src, {
                                    data: {
                                        ic: ci["data-ic"]
                                    }
                                }), html.push(str);
                            else for (var i = 0; ci = opt[i++];) str = buildImgHtml(ci.src, {
                                        data: {
                                            ic: ci["data-ic"]
                                        }
                                    }), html.push(str);
                            isEmpty(editor.body) && html.unshift("<p><br></p>"), me.execCommand("insertHtml", html.join(
                                ""))
                        } else {
                            var first = opt.shift(),
                                floatStyle = first.floatStyle;
                            delete first.floatStyle, domUtils.setAttributes(img, first), me.execCommand("imagefloat",
                                floatStyle), opt.length > 0 && (range.setStartAfter(img).setCursor(!1, !0), me.execCommand(
                                "insertimagewithcaption", opt))
                        }
                        fireContentChangeOnImgLoaded(), me.fireEvent("afterinsertimagewithcaption", opt)
                    }
                }
            }
        }, editor.addInputRule(function (root) {
            var imgContainers = root.getNodesByClassName(imgContainerCls);
            utils.each(imgContainers, function (container) {
                container.attrs.contenteditable = "false";
                var caption = container.getNodesByClassName(imgCaptionCls);
                if (0 === caption.length) {
                    var captionNode = new UE.uNode({
                        type: "element",
                        tagName: "p",
                        attrs: {
                            "class": imgCaptionCls
                        }
                    });
                    captionNode.innerHTML(emptyPlaceholder), container.appendChild(captionNode)
                }
            });
            var imgs = root.getNodesByTagName("img");
            utils.each(imgs, function (img) {
                try {
                    if (img.parentNode && img.parentNode.parentNode) {
                        var container = img.parentNode.parentNode,
                            containerCls = container && container.attrs && container.attrs["class"];
                        if (containerCls && domUtils.hasClass(containerCls, imgContainerCls)) return
                    }
                    var newImgNode = UE.htmlparser(buildImgHtml(img.attrs.src, {
                        data: {
                            ic: img.attrs && img.attrs["data-ic"]
                        },
                        id: img.attrs && img.attrs.id
                    }, null, !1));
                    img.parentNode.replaceChild(newImgNode.children[0], img)
                } catch (ex) {}
            })
        }), editor.addOutputRule(function (root) {
            root.traversal(function (node) {
                var cls = node.attrs["class"];
                cls && domUtils.hasClass(cls, imgCaptionCls) && node.innerText() === emptyPlaceholder && node.parentNode
                    .removeChild(node)
            })
        }), editor.on("ready", function () {
            domUtils.on(editor.body, "click", function (e) {
                "pgc-img-caption" === e.target.className && getPopup().show(e.target)
            })
        }), editor.on("catchRemoteImageError", function (evtName, img) {
            var parentNode = img.parentNode;
            if (parentNode) {
                var captionNode = parentNode.nextSibling;
                captionNode && domUtils.hasClass(captionNode, imgCaptionCls) && domUtils.remove(captionNode)
            }
        })
    }, UE.plugins.justify = function () {
        var block = domUtils.isBlockElm,
            defaultValue = {
                left: 1,
                right: 1,
                center: 1,
                justify: 1
            }, doJustify = function (range, style) {
                var bookmark = range.createBookmark(),
                    filterFn = function (node) {
                        return 1 == node.nodeType ? "br" != node.tagName.toLowerCase() && !domUtils.isBookmarkNode(node) : !
                            domUtils.isWhitespace(node)
                    };
                range.enlarge(!0);
                for (var tmpNode, bookmark2 = range.createBookmark(), current = domUtils.getNextDomNode(bookmark2.start, !
                        1, filterFn), tmpRange = range.cloneRange(); current && !(domUtils.getPosition(current,
                    bookmark2.end) & domUtils.POSITION_FOLLOWING);) if (3 != current.nodeType && block(current)) current =
                            domUtils.getNextDomNode(current, !0, filterFn);
                    else {
                        for (tmpRange.setStartBefore(current); current && current !== bookmark2.end && !block(current);)
                            tmpNode = current, current = domUtils.getNextDomNode(current, !1, null, function (node) {
                                return !block(node)
                            });
                        tmpRange.setEndAfter(tmpNode);
                        var common = tmpRange.getCommonAncestor();
                        if (!domUtils.isBody(common) && block(common)) domUtils.setStyles(common, utils.isString(style) ? {
                                "text-align": style
                            } : style), current = common;
                        else {
                            var p = range.document.createElement("p");
                            domUtils.setStyles(p, utils.isString(style) ? {
                                "text-align": style
                            } : style);
                            var frag = tmpRange.extractContents();
                            p.appendChild(frag), tmpRange.insertNode(p), current = p
                        }
                        current = domUtils.getNextDomNode(current, !1, filterFn)
                    }
                return range.moveToBookmark(bookmark2).moveToBookmark(bookmark)
            };
        UE.commands.justify = {
            execCommand: function (cmdName, align) {
                var txt, range = this.selection.getRange();
                return range.collapsed && (txt = this.document.createTextNode("p"), range.insertNode(txt)), doJustify(
                    range, align), txt && (range.setStartBefore(txt).collapse(!0), domUtils.remove(txt)), range.select(), !
                    0
            },
            queryCommandValue: function () {
                var startNode = this.selection.getStart(),
                    value = domUtils.getComputedStyle(startNode, "text-align");
                return defaultValue[value] ? value : "left"
            },
            queryCommandState: function () {
                var start = this.selection.getStart(),
                    cell = start && domUtils.findParentByTagName(start, ["td", "th", "caption"], !0);
                return cell ? -1 : 0
            }
        }
    }, UE.plugins.font = function () {
        function mergeWithParent(node) {
            for (var parent;
            (parent = node.parentNode) && "SPAN" == parent.tagName && 1 == domUtils.getChildCount(parent, function (
                child) {
                return !domUtils.isBookmarkNode(child) && !domUtils.isBr(child)
            });) parent.style.cssText += node.style.cssText, domUtils.remove(node, !0), node = parent
        }
        function mergeChild(rng, cmdName, value) {
            if (needSetChild[cmdName] && (rng.adjustmentBoundary(), !rng.collapsed && 1 == rng.startContainer.nodeType)) {
                var start = rng.startContainer.childNodes[rng.startOffset];
                if (start && domUtils.isTagNode(start, "span")) {
                    var bk = rng.createBookmark();
                    utils.each(domUtils.getElementsByTagName(start, "span"), function (span) {
                        span.parentNode && !domUtils.isBookmarkNode(span) && ("backcolor" != cmdName || domUtils.getComputedStyle(
                            span, "background-color").toLowerCase() !== value) && (domUtils.removeStyle(span,
                            needSetChild[cmdName]), 0 == span.style.cssText.replace(/^\s+$/, "").length && domUtils.remove(
                            span, !0))
                    }), rng.moveToBookmark(bk)
                }
            }
        }
        function mergesibling(rng, cmdName, value) {
            var common, collapsed = rng.collapsed,
                bk = rng.createBookmark();
            if (collapsed) for (common = bk.start.parentNode; dtd.$inline[common.tagName];) common = common.parentNode;
            else common = domUtils.getCommonAncestor(bk.start, bk.end);
            utils.each(domUtils.getElementsByTagName(common, "span"), function (span) {
                if (span.parentNode && !domUtils.isBookmarkNode(span)) {
                    if (/\s*border\s*:\s*none;?\s*/i.test(span.style.cssText)) return void(
                            /^\s*border\s*:\s*none;?\s*$/.test(span.style.cssText) ? domUtils.remove(span, !0) :
                            domUtils.removeStyle(span, "border"));
                    if (/border/i.test(span.style.cssText) && "SPAN" == span.parentNode.tagName && /border/i.test(span.parentNode
                        .style.cssText) && (span.style.cssText = span.style.cssText.replace(/border[^:]*:[^;]+;?/gi, "")),
                        "fontborder" != cmdName || "none" != value) for (var next = span.nextSibling; next && 1 == next
                            .nodeType && "SPAN" == next.tagName;) if (domUtils.isBookmarkNode(next) && "fontborder" ==
                                cmdName) span.appendChild(next), next = span.nextSibling;
                            else {
                                if (next.style.cssText == span.style.cssText && (domUtils.moveChild(next, span),
                                    domUtils.remove(next)), span.nextSibling === next) break;
                                next = span.nextSibling
                            }
                    if (mergeWithParent(span), browser.ie && browser.version > 8) {
                        var parent = domUtils.findParent(span, function (n) {
                            return "SPAN" == n.tagName && /background-color/.test(n.style.cssText)
                        });
                        parent && !/background-color/.test(span.style.cssText) && (span.style.backgroundColor = parent.style
                            .backgroundColor)
                    }
                }
            }), rng.moveToBookmark(bk), mergeChild(rng, cmdName, value)
        }
        var me = this,
            fonts = {
                forecolor: "color",
                backcolor: "background-color",
                fontsize: "font-size",
                fontfamily: "font-family",
                underline: "text-decoration",
                strikethrough: "text-decoration",
                fontborder: "border"
            }, needCmd = {
                underline: 1,
                strikethrough: 1,
                fontborder: 1
            }, needSetChild = {
                forecolor: "color",
                backcolor: "background-color",
                fontsize: "font-size",
                fontfamily: "font-family"
            };
        me.setOpt({
            fontfamily: [{
                    name: "songti",
                    val: "宋体,SimSun"
                }, {
                    name: "yahei",
                    val: "微软雅黑,Microsoft YaHei"
                }, {
                    name: "kaiti",
                    val: "楷体,楷体_GB2312, SimKai"
                }, {
                    name: "heiti",
                    val: "黑体, SimHei"
                }, {
                    name: "lishu",
                    val: "隶书, SimLi"
                }, {
                    name: "andaleMono",
                    val: "andale mono"
                }, {
                    name: "arial",
                    val: "arial, helvetica,sans-serif"
                }, {
                    name: "arialBlack",
                    val: "arial black,avant garde"
                }, {
                    name: "comicSansMs",
                    val: "comic sans ms"
                }, {
                    name: "impact",
                    val: "impact,chicago"
                }, {
                    name: "timesNewRoman",
                    val: "times new roman"
                }],
            fontsize: [10, 11, 12, 14, 16, 18, 20, 24, 36]
        }), me.addInputRule(function (root) {
            utils.each(root.getNodesByTagName("u s del font strike"), function (node) {
                if ("font" == node.tagName) {
                    var cssStyle = [];
                    for (var p in node.attrs) switch (p) {
                        case "size":
                            cssStyle.push("font-size:" + ({
                                1: "10",
                                2: "12",
                                3: "16",
                                4: "18",
                                5: "24",
                                6: "32",
                                7: "48"
                            }[node.attrs[p]] || node.attrs[p]) + "px");
                            break;
                        case "color":
                            cssStyle.push("color:" + node.attrs[p]);
                            break;
                        case "face":
                            cssStyle.push("font-family:" + node.attrs[p]);
                            break;
                        case "style":
                            cssStyle.push(node.attrs[p])
                    }
                    node.attrs = {
                        style: cssStyle.join(";")
                    }
                } else {
                    var val = "u" == node.tagName ? "underline" : "line-through";
                    node.attrs = {
                        style: (node.getAttr("style") || "") + "text-decoration:" + val + ";"
                    }
                }
                node.tagName = "span"
            })
        });
        for (var p in fonts)! function (cmd, style) {
            UE.commands[cmd] = {
                execCommand: function (cmdName, value) {
                    value = value || (this.queryCommandState(cmdName) ? "none" : "underline" == cmdName ? "underline" :
                        "fontborder" == cmdName ? "1px solid #000" : "line-through");
                    var text, me = this,
                        range = this.selection.getRange();
                    if ("default" == value) range.collapsed && (text = me.document.createTextNode("font"), range.insertNode(
                            text).select()), me.execCommand("removeFormat", "span,a", style), text && (range.setStartBefore(
                            text).collapse(!0), domUtils.remove(text)), mergesibling(range, cmdName, value), range.select();
                    else if (range.collapsed) {
                        var span = domUtils.findParentByTagName(range.startContainer, "span", !0);
                        if (text = me.document.createTextNode("font"), !span || span.children.length || span[browser.ie ?
                            "innerText" : "textContent"].replace(fillCharReg, "").length) {
                            if (range.insertNode(text), range.selectNode(text).select(), span = range.document.createElement(
                                "span"), needCmd[cmd]) {
                                if (domUtils.findParentByTagName(text, "a", !0)) return range.setStartBefore(text).setCursor(),
                                        void domUtils.remove(text);
                                me.execCommand("removeFormat", "span,a", style)
                            }
                            if (span.style.cssText = style + ":" + value, text.parentNode.insertBefore(span, text), !
                                browser.ie || browser.ie && 9 == browser.version) for (var spanParent = span.parentNode; !
                                    domUtils.isBlockElm(spanParent);) "SPAN" == spanParent.tagName && (span.style.cssText =
                                        spanParent.style.cssText + ";" + span.style.cssText), spanParent = spanParent.parentNode;
                            opera ? setTimeout(function () {
                                range.setStart(span, 0).collapse(!0), mergesibling(range, cmdName, value), range.select()
                            }) : (range.setStart(span, 0).collapse(!0), mergesibling(range, cmdName, value), range.select())
                        } else range.insertNode(text), needCmd[cmd] && (range.selectNode(text).select(), me.execCommand(
                                "removeFormat", "span,a", style, null), span = domUtils.findParentByTagName(text,
                                "span", !0), range.setStartBefore(text)), span && (span.style.cssText += ";" + style +
                                ":" + value), range.collapse(!0).select();
                        domUtils.remove(text)
                    } else needCmd[cmd] && me.queryCommandValue(cmd) && me.execCommand("removeFormat", "span,a", style),
                            range = me.selection.getRange(), range.applyInlineStyle("span", {
                            style: style + ":" + value
                        }), mergesibling(range, cmdName, value), range.select();
                    return !0
                },
                queryCommandValue: function (cmdName) {
                    var startNode = this.selection.getStart();
                    if ("underline" == cmdName || "strikethrough" == cmdName) {
                        for (var value, tmpNode = startNode; tmpNode && !domUtils.isBlockElm(tmpNode) && !domUtils.isBody(
                            tmpNode);) {
                            if (1 == tmpNode.nodeType && (value = domUtils.getComputedStyle(tmpNode, style), "none" !=
                                value)) return value;
                            tmpNode = tmpNode.parentNode
                        }
                        return "none"
                    }
                    if ("fontborder" == cmdName) {
                        for (var val, tmp = startNode; tmp && dtd.$inline[tmp.tagName];) {
                            if ((val = domUtils.getComputedStyle(tmp, "border")) && /1px/.test(val) && /solid/.test(val))
                                return val;
                            tmp = tmp.parentNode
                        }
                        return ""
                    }
                    if ("FontSize" == cmdName) {
                        var styleVal = domUtils.getComputedStyle(startNode, style),
                            tmp = /^([\d\.]+)(\w+)$/.exec(styleVal);
                        return tmp ? Math.floor(tmp[1]) + tmp[2] : styleVal
                    }
                    return domUtils.getComputedStyle(startNode, style)
                },
                queryCommandState: function (cmdName) {
                    if (!needCmd[cmdName]) return 0;
                    var val = this.queryCommandValue(cmdName);
                    return "fontborder" == cmdName ? /1px/.test(val) && /solid/.test(val) : "underline" == cmdName ?
                        /underline/.test(val) : /line\-through/.test(val)
                }
            }
        }(p, fonts[p])
    }, UE.plugins.link = function () {
        function optimize(range) {
            var start = range.startContainer,
                end = range.endContainer;
            (start = domUtils.findParentByTagName(start, "a", !0)) && range.setStartBefore(start), (end = domUtils.findParentByTagName(
                end, "a", !0)) && range.setEndAfter(end)
        }
        function doLink(range, opt, me) {
            var rngClone = range.cloneRange(),
                link = me.queryCommandValue("link");
            optimize(range = range.adjustmentBoundary());
            var start = range.startContainer;
            if (1 == start.nodeType && link && (start = start.childNodes[range.startOffset], start && 1 == start.nodeType &&
                "A" == start.tagName && /^(?:https?|ftp|file)\s*:\s*\/\//.test(start[browser.ie ? "innerText" :
                "textContent"]) && (start[browser.ie ? "innerText" : "textContent"] = utils.html(opt.textValue || opt.href))), (!
                rngClone.collapsed || link) && (range.removeInlineStyle("a"), rngClone = range.cloneRange()), rngClone.collapsed) {
                var a = range.document.createElement("a"),
                    text = "";
                opt.textValue ? (text = utils.html(opt.textValue), delete opt.textValue) : text = utils.html(opt.href),
                    domUtils.setAttributes(a, opt), start = domUtils.findParentByTagName(rngClone.startContainer, "a", !
                    0), start && domUtils.isInNodeEndBoundary(rngClone, start) && range.setStartAfter(start).collapse(!
                    0), a[browser.ie ? "innerText" : "textContent"] = text, range.insertNode(a).selectNode(a)
            } else range.applyInlineStyle("a", opt)
        }
        UE.commands.unlink = {
            execCommand: function () {
                var bookmark, range = this.selection.getRange();
                (!range.collapsed || domUtils.findParentByTagName(range.startContainer, "a", !0)) && (bookmark = range.createBookmark(),
                    optimize(range), range.removeInlineStyle("a").moveToBookmark(bookmark).select())
            },
            queryCommandState: function () {
                return !this.highlight && this.queryCommandValue("link") ? 0 : -1
            }
        }, UE.commands.link = {
            execCommand: function (cmdName, opt) {
                var range;
                opt._href && (opt._href = utils.unhtml(opt._href, /[<">]/g)), opt.href && (opt.href = utils.unhtml(opt.href,
                    /[<">]/g)), opt.textValue && (opt.textValue = utils.unhtml(opt.textValue, /[<">]/g)), doLink(range =
                    this.selection.getRange(), opt, this), range.collapse().select(!0)
            },
            queryCommandValue: function () {
                var node, range = this.selection.getRange();
                if (!range.collapsed) {
                    range.shrinkBoundary();
                    var start = 3 != range.startContainer.nodeType && range.startContainer.childNodes[range.startOffset] ?
                        range.startContainer.childNodes[range.startOffset] : range.startContainer,
                        end = 3 == range.endContainer.nodeType || 0 == range.endOffset ? range.endContainer : range.endContainer
                            .childNodes[range.endOffset - 1],
                        common = range.getCommonAncestor();
                    if (node = domUtils.findParentByTagName(common, "a", !0), !node && 1 == common.nodeType) for (var ps,
                                pe, ci, as = common.getElementsByTagName("a"), i = 0; ci = as[i++];) if (ps = domUtils.getPosition(
                                ci, start), pe = domUtils.getPosition(ci, end), (ps & domUtils.POSITION_FOLLOWING || ps &
                                domUtils.POSITION_CONTAINS) && (pe & domUtils.POSITION_PRECEDING || pe & domUtils.POSITION_CONTAINS)) {
                                node = ci;
                                break
                            }
                    return node
                }
                return node = range.startContainer, node = 1 == node.nodeType ? node : node.parentNode, node && (node =
                    domUtils.findParentByTagName(node, "a", !0)) && !domUtils.isInNodeEndBoundary(range, node) ? node :
                    void 0
            },
            queryCommandState: function () {
                var img = this.selection.getRange().getClosedNode(),
                    flag = img && ("edui-faked-video" == img.className || -1 != img.className.indexOf(
                        "edui-upload-video"));
                return flag ? -1 : 0
            }
        }
    }, UE.plugins.insertframe = function () {
        function deleteIframe() {
            me._iframe && delete me._iframe
        }
        var me = this;
        me.addListener("selectionchange", function () {
            deleteIframe()
        })
    }, UE.commands.scrawl = {
        queryCommandState: function () {
            return browser.ie && browser.version <= 8 ? -1 : 0
        }
    }, UE.plugins.removeformat = function () {
        var me = this;
        me.setOpt({
            removeFormatTags: "b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var",
            removeFormatAttributes: "class,style,lang,width,height,align,hspace,valign"
        }), me.commands.removeformat = {
            execCommand: function (cmdName, tags, style, attrs, notIncludeA) {
                function isRedundantSpan(node) {
                    if (3 == node.nodeType || "span" != node.tagName.toLowerCase()) return 0;
                    if (browser.ie) {
                        var attrs = node.attributes;
                        if (attrs.length) {
                            for (var i = 0, l = attrs.length; l > i; i++) if (attrs[i].specified) return 0;
                            return 1
                        }
                    }
                    return !node.attributes.length
                }
                function doRemove(range) {
                    var bookmark1 = range.createBookmark();
                    if (range.collapsed && range.enlarge(!0), !notIncludeA) {
                        var aNode = domUtils.findParentByTagName(range.startContainer, "a", !0);
                        aNode && range.setStartBefore(aNode), aNode = domUtils.findParentByTagName(range.endContainer,
                            "a", !0), aNode && range.setEndAfter(aNode)
                    }
                    for (bookmark = range.createBookmark(), node = bookmark.start;
                    (parent = node.parentNode) && !domUtils.isBlockElm(parent);) domUtils.breakParent(node, parent),
                            domUtils.clearEmptySibling(node);
                    if (bookmark.end) {
                        for (node = bookmark.end;
                        (parent = node.parentNode) && !domUtils.isBlockElm(parent);) domUtils.breakParent(node, parent),
                                domUtils.clearEmptySibling(node);
                        for (var next, current = domUtils.getNextDomNode(bookmark.start, !1, filter); current &&
                            current != bookmark.end;) next = domUtils.getNextDomNode(current, !0, filter), dtd.$empty[
                                current.tagName.toLowerCase()] || domUtils.isBookmarkNode(current) || (tagReg.test(
                                current.tagName) ? style ? (domUtils.removeStyle(current, style), isRedundantSpan(
                                current) && "text-decoration" != style && domUtils.remove(current, !0)) : domUtils.remove(
                                current, !0) : dtd.$tableContent[current.tagName] || dtd.$list[current.tagName] || (
                                domUtils.removeAttributes(current, removeFormatAttributes), isRedundantSpan(current) &&
                                domUtils.remove(current, !0))), current = next
                    }
                    var pN = bookmark.start.parentNode;
                    !domUtils.isBlockElm(pN) || dtd.$tableContent[pN.tagName] || dtd.$list[pN.tagName] || domUtils.removeAttributes(
                        pN, removeFormatAttributes), pN = bookmark.end.parentNode, bookmark.end && domUtils.isBlockElm(
                        pN) && !dtd.$tableContent[pN.tagName] && !dtd.$list[pN.tagName] && domUtils.removeAttributes(pN,
                        removeFormatAttributes), range.moveToBookmark(bookmark).moveToBookmark(bookmark1);
                    for (var tmp, node = range.startContainer, collapsed = range.collapsed; 1 == node.nodeType &&
                        domUtils.isEmptyNode(node) && dtd.$removeEmpty[node.tagName];) tmp = node.parentNode, range.setStartBefore(
                            node), range.startContainer === range.endContainer && range.endOffset--, domUtils.remove(
                            node), node = tmp;
                    if (!collapsed) for (node = range.endContainer; 1 == node.nodeType && domUtils.isEmptyNode(node) &&
                            dtd.$removeEmpty[node.tagName];) tmp = node.parentNode, range.setEndBefore(node), domUtils.remove(
                                node), node = tmp
                }
                var bookmark, parent, tagReg = new RegExp("^(?:" + (tags || this.options.removeFormatTags).replace(/,/g,
                        "|") + ")$", "i"),
                    removeFormatAttributes = style ? [] : (attrs || this.options.removeFormatAttributes).split(","),
                    range = new dom.Range(this.document),
                    filter = function (node) {
                        return 1 == node.nodeType
                    };
                range = this.selection.getRange(), doRemove(range), range.select()
            }
        }
    }, UE.plugins.blockquote = function () {
        function getObj(editor) {
            return domUtils.filterNodeList(editor.selection.getStartElementPath(), "blockquote")
        }
        var me = this;
        me.commands.blockquote = {
            execCommand: function (cmdName, attrs) {
                var range = this.selection.getRange(),
                    obj = getObj(this),
                    blockquote = dtd.blockquote,
                    bookmark = range.createBookmark();
                if (obj) {
                    var start = range.startContainer,
                        startBlock = domUtils.isBlockElm(start) ? start : domUtils.findParent(start, function (node) {
                            return domUtils.isBlockElm(node)
                        }),
                        end = range.endContainer,
                        endBlock = domUtils.isBlockElm(end) ? end : domUtils.findParent(end, function (node) {
                            return domUtils.isBlockElm(node)
                        });
                    startBlock = domUtils.findParentByTagName(startBlock, "li", !0) || startBlock, endBlock = domUtils.findParentByTagName(
                        endBlock, "li", !0) || endBlock, "LI" == startBlock.tagName || "TD" == startBlock.tagName ||
                        startBlock === obj || domUtils.isBody(startBlock) ? domUtils.remove(obj, !0) : domUtils.breakParent(
                        startBlock, obj), startBlock !== endBlock && (obj = domUtils.findParentByTagName(endBlock,
                        "blockquote"), obj && ("LI" == endBlock.tagName || "TD" == endBlock.tagName || domUtils.isBody(
                        endBlock) ? obj.parentNode && domUtils.remove(obj, !0) : domUtils.breakParent(endBlock, obj)));
                    for (var bi, blockquotes = domUtils.getElementsByTagName(this.document, "blockquote"), i = 0; bi =
                        blockquotes[i++];) bi.childNodes.length ? domUtils.getPosition(bi, startBlock) & domUtils.POSITION_FOLLOWING &&
                            domUtils.getPosition(bi, endBlock) & domUtils.POSITION_PRECEDING && domUtils.remove(bi, !0) :
                            domUtils.remove(bi)
                } else {
                    for (var tmpRange = range.cloneRange(), node = 1 == tmpRange.startContainer.nodeType ? tmpRange.startContainer :
                            tmpRange.startContainer.parentNode, preNode = node, doEnd = 1;;) {
                        if (domUtils.isBody(node)) {
                            preNode !== node ? range.collapsed ? (tmpRange.selectNode(preNode), doEnd = 0) : tmpRange.setStartBefore(
                                preNode) : tmpRange.setStart(node, 0);
                            break
                        }
                        if (!blockquote[node.tagName]) {
                            range.collapsed ? tmpRange.selectNode(preNode) : tmpRange.setStartBefore(preNode);
                            break
                        }
                        preNode = node, node = node.parentNode
                    }
                    if (doEnd) for (preNode = node = node = 1 == tmpRange.endContainer.nodeType ? tmpRange.endContainer :
                            tmpRange.endContainer.parentNode;;) {
                            if (domUtils.isBody(node)) {
                                preNode !== node ? tmpRange.setEndAfter(preNode) : tmpRange.setEnd(node, node.childNodes
                                    .length);
                                break
                            }
                            if (!blockquote[node.tagName]) {
                                tmpRange.setEndAfter(preNode);
                                break
                            }
                            preNode = node, node = node.parentNode
                    }
                    node = range.document.createElement("blockquote"), domUtils.setAttributes(node, attrs), node.appendChild(
                        tmpRange.extractContents()), tmpRange.insertNode(node);
                    for (var ci, childs = domUtils.getElementsByTagName(node, "blockquote"), i = 0; ci = childs[i++];)
                        ci.parentNode && domUtils.remove(ci, !0)
                }
                range.moveToBookmark(bookmark).select()
            },
            queryCommandState: function () {
                return getObj(this) ? 1 : 0
            }
        }
    }, UE.commands.touppercase = UE.commands.tolowercase = {
        execCommand: function (cmd) {
            var me = this,
                rng = me.selection.getRange();
            if (rng.collapsed) return rng;
            for (var bk = rng.createBookmark(), bkEnd = bk.end, filterFn = function (node) {
                    return !domUtils.isBr(node) && !domUtils.isWhitespace(node)
                }, curNode = domUtils.getNextDomNode(bk.start, !1, filterFn); curNode && domUtils.getPosition(curNode,
                bkEnd) & domUtils.POSITION_PRECEDING && (3 == curNode.nodeType && (curNode.nodeValue = curNode.nodeValue[
                "touppercase" == cmd ? "toUpperCase" : "toLowerCase"]()), curNode = domUtils.getNextDomNode(curNode, !0,
                filterFn), curNode !== bkEnd););
            rng.moveToBookmark(bk).select()
        }
    }, UE.commands.indent = {
        execCommand: function () {
            var me = this,
                value = me.queryCommandState("indent") ? "0em" : me.options.indentValue || "2em";
            me.execCommand("Paragraph", "p", {
                style: "text-indent:" + value
            })
        },
        queryCommandState: function () {
            var pN = domUtils.filterNodeList(this.selection.getStartElementPath(), "p h1 h2 h3 h4 h5 h6");
            return pN && pN.style.textIndent && parseInt(pN.style.textIndent) ? 1 : 0
        }
    }, UE.commands.print = {
        execCommand: function () {
            this.window.print()
        },
        notNeedUndo: 1
    }, UE.commands.preview = {
        execCommand: function () {
            var w = window.open("", "_blank", ""),
                d = w.document;
            d.open(), d.write('<!DOCTYPE html><html><head><meta charset="utf-8"/><script src="' + this.options.UEDITOR_HOME_URL +
                "ueditor.parse.js\"></script><script>setTimeout(function(){uParse('div',{rootPath: '" + this.options.UEDITOR_HOME_URL +
                "'})},300)</script></head><body><div>" + this.getContent(null, null, !0) + "</div></body></html>"), d.close()
        },
        notNeedUndo: 1
    }, UE.plugins.selectall = function () {
        var me = this;
        me.commands.selectall = {
            execCommand: function () {
                var me = this,
                    body = me.body,
                    range = me.selection.getRange();
                range.selectNodeContents(body), domUtils.isEmptyBlock(body) && (browser.opera && body.firstChild && 1 ==
                    body.firstChild.nodeType && range.setStartAtFirst(body.firstChild), range.collapse(!0)), range.select(!
                    0)
            },
            notNeedUndo: 1
        }, me.addshortcutkey({
            selectAll: "ctrl+65"
        })
    }, UE.plugins.paragraph = function () {
        var me = this,
            block = domUtils.isBlockElm,
            notExchange = ["TD", "LI", "PRE"],
            doParagraph = function (range, style, attrs, sourceCmdName) {
                var para, bookmark = range.createBookmark(),
                    filterFn = function (node) {
                        return 1 == node.nodeType ? "br" != node.tagName.toLowerCase() && !domUtils.isBookmarkNode(node) : !
                            domUtils.isWhitespace(node)
                    };
                range.enlarge(!0);
                for (var tmpNode, bookmark2 = range.createBookmark(), current = domUtils.getNextDomNode(bookmark2.start, !
                        1, filterFn), tmpRange = range.cloneRange(); current && !(domUtils.getPosition(current,
                    bookmark2.end) & domUtils.POSITION_FOLLOWING);) if (3 != current.nodeType && block(current)) current =
                            domUtils.getNextDomNode(current, !0, filterFn);
                    else {
                        for (tmpRange.setStartBefore(current); current && current !== bookmark2.end && !block(current);)
                            tmpNode = current, current = domUtils.getNextDomNode(current, !1, null, function (node) {
                                return !block(node)
                            });
                        tmpRange.setEndAfter(tmpNode), para = range.document.createElement(style), attrs && (domUtils.setAttributes(
                            para, attrs), sourceCmdName && "customstyle" == sourceCmdName && attrs.style && (para.style
                            .cssText = attrs.style)), para.appendChild(tmpRange.extractContents()), domUtils.isEmptyNode(
                            para) && domUtils.fillChar(range.document, para), tmpRange.insertNode(para);
                        var parent = para.parentNode;
                        block(parent) && !domUtils.isBody(para.parentNode) && -1 == utils.indexOf(notExchange, parent.tagName) &&
                            (sourceCmdName && "customstyle" == sourceCmdName || (parent.getAttribute("dir") && para.setAttribute(
                            "dir", parent.getAttribute("dir")), parent.style.cssText && (para.style.cssText = parent.style
                            .cssText + ";" + para.style.cssText), parent.style.textAlign && !para.style.textAlign && (
                            para.style.textAlign = parent.style.textAlign), parent.style.textIndent && !para.style.textIndent &&
                            (para.style.textIndent = parent.style.textIndent), parent.style.padding && !para.style.padding &&
                            (para.style.padding = parent.style.padding)), attrs && /h\d/i.test(parent.tagName) && !
                            /h\d/i.test(para.tagName) ? (domUtils.setAttributes(parent, attrs), sourceCmdName &&
                            "customstyle" == sourceCmdName && attrs.style && (parent.style.cssText = attrs.style),
                            domUtils.remove(para, !0), para = parent) : domUtils.remove(para.parentNode, !0)), current = -
                            1 != utils.indexOf(notExchange, parent.tagName) ? parent : para, current = domUtils.getNextDomNode(
                            current, !1, filterFn)
                    }
                return range.moveToBookmark(bookmark2).moveToBookmark(bookmark)
            };
        me.setOpt("paragraph", {
            p: "",
            h1: "",
            h2: "",
            h3: "",
            h4: "",
            h5: "",
            h6: ""
        }), me.commands.paragraph = {
            execCommand: function (cmdName, style, attrs, sourceCmdName) {
                var range = this.selection.getRange();
                if (range.collapsed) {
                    var txt = this.document.createTextNode("p");
                    if (range.insertNode(txt), browser.ie) {
                        var node = txt.previousSibling;
                        node && domUtils.isWhitespace(node) && domUtils.remove(node), node = txt.nextSibling, node &&
                            domUtils.isWhitespace(node) && domUtils.remove(node)
                    }
                }
                if (range = doParagraph(range, style, attrs, sourceCmdName), txt && (range.setStartBefore(txt).collapse(!
                    0), pN = txt.parentNode, domUtils.remove(txt), domUtils.isBlockElm(pN) && domUtils.isEmptyNode(pN) &&
                    domUtils.fillNode(this.document, pN)), browser.gecko && range.collapsed && 1 == range.startContainer
                    .nodeType) {
                    var child = range.startContainer.childNodes[range.startOffset];
                    child && 1 == child.nodeType && child.tagName.toLowerCase() == style && range.setStart(child, 0).collapse(!
                        0)
                }
                return range.select(), !0
            },
            queryCommandValue: function () {
                var node = domUtils.filterNodeList(this.selection.getStartElementPath(), "p h1 h2 h3 h4 h5 h6");
                return node ? node.tagName.toLowerCase() : ""
            }
        }
    },
    function () {
        var block = domUtils.isBlockElm,
            getObj = function (editor) {
                return domUtils.filterNodeList(editor.selection.getStartElementPath(), function (n) {
                    return n && 1 == n.nodeType && n.getAttribute("dir")
                })
            }, doDirectionality = function (range, editor, forward) {
                var bookmark, filterFn = function (node) {
                        return 1 == node.nodeType ? !domUtils.isBookmarkNode(node) : !domUtils.isWhitespace(node)
                    }, obj = getObj(editor);
                if (obj && range.collapsed) return obj.setAttribute("dir", forward), range;
                bookmark = range.createBookmark(), range.enlarge(!0);
                for (var tmpNode, bookmark2 = range.createBookmark(), current = domUtils.getNextDomNode(bookmark2.start, !
                        1, filterFn), tmpRange = range.cloneRange(); current && !(domUtils.getPosition(current,
                    bookmark2.end) & domUtils.POSITION_FOLLOWING);) if (3 != current.nodeType && block(current)) current =
                            domUtils.getNextDomNode(current, !0, filterFn);
                    else {
                        for (tmpRange.setStartBefore(current); current && current !== bookmark2.end && !block(current);)
                            tmpNode = current, current = domUtils.getNextDomNode(current, !1, null, function (node) {
                                return !block(node)
                            });
                        tmpRange.setEndAfter(tmpNode);
                        var common = tmpRange.getCommonAncestor();
                        if (!domUtils.isBody(common) && block(common)) common.setAttribute("dir", forward), current =
                                common;
                        else {
                            var p = range.document.createElement("p");
                            p.setAttribute("dir", forward);
                            var frag = tmpRange.extractContents();
                            p.appendChild(frag), tmpRange.insertNode(p), current = p
                        }
                        current = domUtils.getNextDomNode(current, !1, filterFn)
                    }
                return range.moveToBookmark(bookmark2).moveToBookmark(bookmark)
            };
        UE.commands.directionality = {
            execCommand: function (cmdName, forward) {
                var range = this.selection.getRange();
                if (range.collapsed) {
                    var txt = this.document.createTextNode("d");
                    range.insertNode(txt)
                }
                return doDirectionality(range, this, forward), txt && (range.setStartBefore(txt).collapse(!0), domUtils
                    .remove(txt)), range.select(), !0
            },
            queryCommandValue: function () {
                var node = getObj(this);
                return node ? node.getAttribute("dir") : "ltr"
            }
        }
    }(), UE.plugins.horizontal = function () {
        var me = this;
        me.commands.horizontal = {
            execCommand: function (cmdName) {
                var me = this;
                if (-1 !== me.queryCommandState(cmdName)) {
                    me.execCommand("insertHtml", "<hr>");
                    var range = me.selection.getRange(),
                        start = range.startContainer;
                    if (1 == start.nodeType && !start.childNodes[range.startOffset]) {
                        var tmp;
                        (tmp = start.childNodes[range.startOffset - 1]) && 1 == tmp.nodeType && "HR" == tmp.tagName &&
                            ("p" == me.options.enterTag ? (tmp = me.document.createElement("p"), range.insertNode(tmp),
                            range.setStart(tmp, 0).setCursor()) : (tmp = me.document.createElement("br"), range.insertNode(
                            tmp), range.setStartBefore(tmp).setCursor()))
                    }
                    return !0
                }
            },
            queryCommandState: function () {
                return domUtils.filterNodeList(this.selection.getStartElementPath(), "table") ? -1 : 0
            }
        }, me.addListener("delkeydown", function (name, evt) {
            var rng = this.selection.getRange();
            if (rng.txtToElmBoundary(!0), domUtils.isStartInblock(rng)) {
                var tmpNode = rng.startContainer,
                    pre = tmpNode.previousSibling;
                if (pre && domUtils.isTagNode(pre, "hr")) return domUtils.remove(pre), rng.select(), domUtils.preventDefault(
                        evt), !0
            }
        })
    }, UE.commands.time = UE.commands.date = {
        execCommand: function (cmd, format) {
            function formatTime(date, format) {
                var hh = ("0" + date.getHours()).slice(-2),
                    ii = ("0" + date.getMinutes()).slice(-2),
                    ss = ("0" + date.getSeconds()).slice(-2);
                return format = format || "hh:ii:ss", format.replace(/hh/gi, hh).replace(/ii/gi, ii).replace(/ss/gi, ss)
            }
            function formatDate(date, format) {
                var yyyy = ("000" + date.getFullYear()).slice(-4),
                    yy = yyyy.slice(-2),
                    mm = ("0" + (date.getMonth() + 1)).slice(-2),
                    dd = ("0" + date.getDate()).slice(-2);
 
                return format = format || "yyyy-mm-dd", format.replace(/yyyy/gi, yyyy).replace(/yy/gi, yy).replace(
                    /mm/gi, mm).replace(/dd/gi, dd)
            }
            var date = new Date;
            this.execCommand("insertHtml", "time" == cmd ? formatTime(date, format) : formatDate(date, format))
        }
    }, UE.plugins.rowspacing = function () {
        var me = this;
        me.setOpt({
            rowspacingtop: ["5", "10", "15", "20", "25"],
            rowspacingbottom: ["5", "10", "15", "20", "25"]
        }), me.commands.rowspacing = {
            execCommand: function (cmdName, value, dir) {
                return this.execCommand("paragraph", "p", {
                    style: "margin-" + dir + ":" + value + "px"
                }), !0
            },
            queryCommandValue: function (cmdName, dir) {
                var value, pN = domUtils.filterNodeList(this.selection.getStartElementPath(), function (node) {
                        return domUtils.isBlockElm(node)
                    });
                return pN ? (value = domUtils.getComputedStyle(pN, "margin-" + dir).replace(/[^\d]/g, ""), value ?
                    value : 0) : 0
            }
        }
    }, UE.plugins.lineheight = function () {
        var me = this;
        me.setOpt({
            lineheight: ["1", "1.5", "1.75", "2", "3", "4", "5"]
        }), me.commands.lineheight = {
            execCommand: function (cmdName, value) {
                return this.execCommand("paragraph", "p", {
                    style: "line-height:" + ("1" == value ? "normal" : value + "em")
                }), !0
            },
            queryCommandValue: function () {
                var pN = domUtils.filterNodeList(this.selection.getStartElementPath(), function (node) {
                    return domUtils.isBlockElm(node)
                });
                if (pN) {
                    var value = domUtils.getComputedStyle(pN, "line-height");
                    return "normal" == value ? 1 : value.replace(/[^\d.]*/gi, "")
                }
            }
        }
    }, UE.plugins.insertcode = function () {
        var me = this;
        me.ready(function () {
            utils.cssRule("pre", "pre{margin:.5em 0;padding:.4em .6em;border-radius:8px;background:#f8f8f8;}", me.document)
        }), me.setOpt("insertcode", {
            as3: "ActionScript3",
            bash: "Bash/Shell",
            cpp: "C/C++",
            css: "Css",
            cf: "CodeFunction",
            "c#": "C#",
            delphi: "Delphi",
            diff: "Diff",
            erlang: "Erlang",
            groovy: "Groovy",
            html: "Html",
            java: "Java",
            jfx: "JavaFx",
            js: "Javascript",
            pl: "Perl",
            php: "Php",
            plain: "Plain Text",
            ps: "PowerShell",
            python: "Python",
            ruby: "Ruby",
            scala: "Scala",
            sql: "Sql",
            vb: "Vb",
            xml: "Xml"
        }), me.commands.insertcode = {
            execCommand: function (cmd, lang) {
                var me = this,
                    rng = me.selection.getRange(),
                    pre = domUtils.findParentByTagName(rng.startContainer, "pre", !0);
                if (pre) pre.className = "brush:" + lang + ";toolbar:false;";
                else {
                    var code = "";
                    if (rng.collapsed) code = browser.ie && browser.ie11below ? browser.version <= 8 ? " " : "" :
                            "<br/>";
                    else {
                        var frag = rng.extractContents(),
                            div = me.document.createElement("div");
                        div.appendChild(frag), utils.each(UE.filterNode(UE.htmlparser(div.innerHTML.replace(/[\r\t]/g,
                            "")), me.options.filterTxtRules).children, function (node) {
                            if (browser.ie && browser.ie11below && browser.version > 8) "element" == node.type ? "br" ==
                                    node.tagName ? code += "\n" : dtd.$empty[node.tagName] || (utils.each(node.children, function (
                                    cn) {
                                    "element" == cn.type ? "br" == cn.tagName ? code += "\n" : dtd.$empty[node.tagName] ||
                                        (code += cn.innerText()) : code += cn.data
                                }), /\n$/.test(code) || (code += "\n")) : code += node.data + "\n", !node.nextSibling() &&
                                    /\n$/.test(code) && (code = code.replace(/\n$/, ""));
                            else if (browser.ie && browser.ie11below) "element" == node.type ? "br" == node.tagName ?
                                    code += "<br>" : dtd.$empty[node.tagName] || (utils.each(node.children, function (
                                    cn) {
                                    "element" == cn.type ? "br" == cn.tagName ? code += "<br>" : dtd.$empty[node.tagName] ||
                                        (code += cn.innerText()) : code += cn.data
                                }), /br>$/.test(code) || (code += "<br>")) : code += node.data + "<br>", !node.nextSibling() &&
                                    /<br>$/.test(code) && (code = code.replace(/<br>$/, ""));
                            else if (code += "element" == node.type ? dtd.$empty[node.tagName] ? "" : node.innerText() :
                                node.data, !/br\/?\s*>$/.test(code)) {
                                if (!node.nextSibling()) return;
                                code += "<br>"
                            }
                        })
                    }
                    me.execCommand("inserthtml", '<pre id="coder"class="brush:' + lang + ';toolbar:false">' + code +
                        "</pre>", !0), pre = me.document.getElementById("coder"), domUtils.removeAttributes(pre, "id");
                    var tmpNode = pre.previousSibling;
                    tmpNode && (3 == tmpNode.nodeType && 1 == tmpNode.nodeValue.length && browser.ie && 6 == browser.version ||
                        domUtils.isEmptyBlock(tmpNode)) && domUtils.remove(tmpNode);
                    var rng = me.selection.getRange();
                    domUtils.isEmptyBlock(pre) ? rng.setStart(pre, 0).setCursor(!1, !0) : rng.selectNodeContents(pre).select()
                }
            },
            queryCommandValue: function () {
                var path = this.selection.getStartElementPath(),
                    lang = "";
                return utils.each(path, function (node) {
                    if ("PRE" == node.nodeName) {
                        var match = node.className.match(/brush:([^;]+)/);
                        return lang = match && match[1] ? match[1] : "", !1
                    }
                }), lang
            }
        }, me.addInputRule(function (root) {
            utils.each(root.getNodesByTagName("pre"), function (pre) {
                var brs = pre.getNodesByTagName("br");
                if (brs.length) return void(browser.ie && browser.ie11below && browser.version > 8 && utils.each(brs, function (
                        br) {
                        var txt = UE.uNode.createText("\n");
                        br.parentNode.insertBefore(txt, br), br.parentNode.removeChild(br)
                    }));
                if (!(browser.ie && browser.ie11below && browser.version > 8)) {
                    var code = pre.innerText().split(/\n/);
                    pre.innerHTML(""), utils.each(code, function (c) {
                        c.length && pre.appendChild(UE.uNode.createText(c)), pre.appendChild(UE.uNode.createElement(
                            "br"))
                    })
                }
            })
        }), me.addOutputRule(function (root) {
            utils.each(root.getNodesByTagName("pre"), function (pre) {
                var code = "";
                utils.each(pre.children, function (n) {
                    code += "text" == n.type ? n.data.replace(/[ ]/g, " ").replace(/\n$/, "") : "br" == n.tagName ?
                        "\n" : dtd.$empty[n.tagName] ? n.innerText() : ""
                }), pre.innerText(code.replace(/( |\n)+$/, ""))
            })
        }), me.notNeedCodeQuery = {
            help: 1,
            undo: 1,
            redo: 1,
            source: 1,
            print: 1,
            searchreplace: 1,
            fullscreen: 1,
            preview: 1,
            insertparagraph: 1,
            elementpath: 1,
            insertcode: 1,
            inserthtml: 1,
            selectall: 1
        };
        me.queryCommandState;
        me.queryCommandState = function (cmd) {
            var me = this;
            return !me.notNeedCodeQuery[cmd.toLowerCase()] && me.selection && me.queryCommandValue("insertcode") ? -1 :
                UE.Editor.prototype.queryCommandState.apply(this, arguments)
        }, me.addListener("beforeenterkeydown", function () {
            var rng = me.selection.getRange(),
                pre = domUtils.findParentByTagName(rng.startContainer, "pre", !0);
            if (pre) {
                if (me.fireEvent("saveScene"), rng.collapsed || rng.deleteContents(), !browser.ie || browser.ie9above) {
                    var pre, tmpNode = me.document.createElement("br");
                    rng.insertNode(tmpNode).setStartAfter(tmpNode).collapse(!0);
                    var next = tmpNode.nextSibling;
                    next || browser.ie && !(browser.version > 10) ? rng.setStartAfter(tmpNode) : rng.insertNode(tmpNode
                        .cloneNode(!1)), pre = tmpNode.previousSibling;
                    for (var tmp; pre;) if (tmp = pre, pre = pre.previousSibling, !pre || "BR" == pre.nodeName) {
                            pre = tmp;
                            break
                        }
                    if (pre) {
                        for (var str = ""; pre && "BR" != pre.nodeName && new RegExp("^[\\s" + domUtils.fillChar +
                            "]*$").test(pre.nodeValue);) str += pre.nodeValue, pre = pre.nextSibling;
                        if ("BR" != pre.nodeName) {
                            var match = pre.nodeValue.match(new RegExp("^([\\s" + domUtils.fillChar + "]+)"));
                            match && match[1] && (str += match[1])
                        }
                        str && (str = me.document.createTextNode(str), rng.insertNode(str).setStartAfter(str))
                    }
                    rng.collapse(!0).select(!0)
                } else if (browser.version > 8) {
                    var txt = me.document.createTextNode("\n"),
                        start = rng.startContainer;
                    if (0 == rng.startOffset) {
                        var preNode = start.previousSibling;
                        if (preNode) {
                            rng.insertNode(txt);
                            var fillchar = me.document.createTextNode(" ");
                            rng.setStartAfter(txt).insertNode(fillchar).setStart(fillchar, 0).collapse(!0).select(!0)
                        }
                    } else {
                        rng.insertNode(txt).setStartAfter(txt);
                        var fillchar = me.document.createTextNode(" ");
                        start = rng.startContainer.childNodes[rng.startOffset], start && !/^\n/.test(start.nodeValue) &&
                            rng.setStartBefore(txt), rng.insertNode(fillchar).setStart(fillchar, 0).collapse(!0).select(!
                            0)
                    }
                } else {
                    var tmpNode = me.document.createElement("br");
                    rng.insertNode(tmpNode), rng.insertNode(me.document.createTextNode(domUtils.fillChar)), rng.setStartAfter(
                        tmpNode), pre = tmpNode.previousSibling;
                    for (var tmp; pre;) if (tmp = pre, pre = pre.previousSibling, !pre || "BR" == pre.nodeName) {
                            pre = tmp;
                            break
                        }
                    if (pre) {
                        for (var str = ""; pre && "BR" != pre.nodeName && new RegExp("^[ " + domUtils.fillChar + "]*$")
                            .test(pre.nodeValue);) str += pre.nodeValue, pre = pre.nextSibling;
                        if ("BR" != pre.nodeName) {
                            var match = pre.nodeValue.match(new RegExp("^([ " + domUtils.fillChar + "]+)"));
                            match && match[1] && (str += match[1])
                        }
                        str = me.document.createTextNode(str), rng.insertNode(str).setStartAfter(str)
                    }
                    rng.collapse(!0).select()
                }
                return me.fireEvent("saveScene"), !0
            }
        }), me.addListener("tabkeydown", function (cmd, evt) {
            var rng = me.selection.getRange(),
                pre = domUtils.findParentByTagName(rng.startContainer, "pre", !0);
            if (pre) {
                if (me.fireEvent("saveScene"), evt.shiftKey);
                else if (rng.collapsed) {
                    var tmpNode = me.document.createTextNode("    ");
                    rng.insertNode(tmpNode).setStartAfter(tmpNode).collapse(!0).select(!0)
                } else {
                    for (var bk = rng.createBookmark(), start = bk.start.previousSibling; start;) {
                        if (pre.firstChild === start && !domUtils.isBr(start)) {
                            pre.insertBefore(me.document.createTextNode("    "), start);
                            break
                        }
                        if (domUtils.isBr(start)) {
                            pre.insertBefore(me.document.createTextNode("    "), start.nextSibling);
                            break
                        }
                        start = start.previousSibling
                    }
                    var end = bk.end;
                    for (start = bk.start.nextSibling, pre.firstChild === bk.start && pre.insertBefore(me.document.createTextNode(
                        "    "), start.nextSibling); start && start !== end;) {
                        if (domUtils.isBr(start) && start.nextSibling) {
                            if (start.nextSibling === end) break;
                            pre.insertBefore(me.document.createTextNode("    "), start.nextSibling)
                        }
                        start = start.nextSibling
                    }
                    rng.moveToBookmark(bk).select()
                }
                return me.fireEvent("saveScene"), !0
            }
        }), me.addListener("beforeinserthtml", function (evtName, html) {
            var me = this,
                rng = me.selection.getRange(),
                pre = domUtils.findParentByTagName(rng.startContainer, "pre", !0);
            if (pre) {
                rng.collapsed || rng.deleteContents();
                var htmlstr = "";
                if (browser.ie && browser.version > 8) {
                    utils.each(UE.filterNode(UE.htmlparser(html), me.options.filterTxtRules).children, function (node) {
                        "element" == node.type ? "br" == node.tagName ? htmlstr += "\n" : dtd.$empty[node.tagName] || (
                            utils.each(node.children, function (cn) {
                            "element" == cn.type ? "br" == cn.tagName ? htmlstr += "\n" : dtd.$empty[node.tagName] || (
                                htmlstr += cn.innerText()) : htmlstr += cn.data
                        }), /\n$/.test(htmlstr) || (htmlstr += "\n")) : htmlstr += node.data + "\n", !node.nextSibling() &&
                            /\n$/.test(htmlstr) && (htmlstr = htmlstr.replace(/\n$/, ""))
                    });
                    var tmpNode = me.document.createTextNode(utils.html(htmlstr.replace(/ /g, " ")));
                    rng.insertNode(tmpNode).selectNode(tmpNode).select()
                } else {
                    var frag = me.document.createDocumentFragment();
                    utils.each(UE.filterNode(UE.htmlparser(html), me.options.filterTxtRules).children, function (node) {
                        "element" == node.type ? "br" == node.tagName ? frag.appendChild(me.document.createElement("br")) :
                            dtd.$empty[node.tagName] || (utils.each(node.children, function (cn) {
                            "element" == cn.type ? "br" == cn.tagName ? frag.appendChild(me.document.createElement("br")) :
                                dtd.$empty[node.tagName] || frag.appendChild(me.document.createTextNode(utils.html(cn.innerText()
                                .replace(/ /g, " ")))) : frag.appendChild(me.document.createTextNode(utils.html(cn
                                .data.replace(/ /g, " "))))
                        }), "BR" != frag.lastChild.nodeName && frag.appendChild(me.document.createElement("br"))) :
                            frag.appendChild(me.document.createTextNode(utils.html(node.data.replace(/ /g, " ")))),
                            node.nextSibling() || "BR" != frag.lastChild.nodeName || frag.removeChild(frag.lastChild)
                    }), rng.insertNode(frag).select()
                }
                return !0
            }
        }), me.addListener("keydown", function (cmd, evt) {
            var me = this,
                keyCode = evt.keyCode || evt.which;
            if (40 == keyCode) {
                var pre, rng = me.selection.getRange(),
                    start = rng.startContainer;
                if (rng.collapsed && (pre = domUtils.findParentByTagName(rng.startContainer, "pre", !0)) && !pre.nextSibling) {
                    for (var last = pre.lastChild; last && "BR" == last.nodeName;) last = last.previousSibling;
                    (last === start || rng.startContainer === pre && rng.startOffset == pre.childNodes.length) && (me.execCommand(
                        "insertparagraph"), domUtils.preventDefault(evt))
                }
            }
        }), me.addListener("delkeydown", function (type, evt) {
            var rng = this.selection.getRange();
            rng.txtToElmBoundary(!0);
            var start = rng.startContainer;
            if (domUtils.isTagNode(start, "pre") && rng.collapsed && domUtils.isStartInblock(rng)) {
                var p = me.document.createElement("p");
                return domUtils.fillNode(me.document, p), start.parentNode.insertBefore(p, start), domUtils.remove(
                    start), rng.setStart(p, 0).setCursor(!1, !0), domUtils.preventDefault(evt), !0
            }
        })
    }, UE.commands.cleardoc = {
        execCommand: function () {
            var me = this,
                enterTag = me.options.enterTag,
                range = me.selection.getRange();
            "br" == enterTag ? (me.body.innerHTML = "<br/>", range.setStart(me.body, 0).setCursor()) : (me.body.innerHTML =
                "<p>" + (ie ? "" : "<br/>") + "</p>", range.setStart(me.body.firstChild, 0).setCursor(!1, !0)),
                setTimeout(function () {
                me.fireEvent("clearDoc")
            }, 0)
        }
    }, UE.plugin.register("anchor", function () {
        return {
            bindEvents: {
                ready: function () {
                    utils.cssRule("anchor", ".anchorclass{background: url('" + this.options.themePath + this.options.theme +
                        "/images/anchor.gif') no-repeat scroll left center transparent;cursor: auto;display: inline-block;height: 16px;width: 15px;}",
                        this.document)
                }
            },
            outputRule: function (root) {
                utils.each(root.getNodesByTagName("img"), function (a) {
                    var val;
                    (val = a.getAttr("anchorname")) && (a.tagName = "a", a.setAttr({
                        anchorname: "",
                        name: val,
                        "class": ""
                    }))
                })
            },
            inputRule: function (root) {
                utils.each(root.getNodesByTagName("a"), function (a) {
                    var val;
                    (val = a.getAttr("name")) && !a.getAttr("href") && (a.tagName = "img", a.setAttr({
                        anchorname: a.getAttr("name"),
                        "class": "anchorclass"
                    }), a.setAttr("name"))
                })
            },
            commands: {
                anchor: {
                    execCommand: function (cmd, name) {
                        var range = this.selection.getRange(),
                            img = range.getClosedNode();
                        if (img && img.getAttribute("anchorname")) name ? img.setAttribute("anchorname", name) : (range
                                .setStartBefore(img).setCursor(), domUtils.remove(img));
                        else if (name) {
                            var anchor = this.document.createElement("img");
                            range.collapse(!0), domUtils.setAttributes(anchor, {
                                anchorname: name,
                                "class": "anchorclass"
                            }), range.insertNode(anchor).setStartAfter(anchor).setCursor(!1, !0)
                        }
                    }
                }
            }
        }
    }), UE.plugins.wordcount = function () {
        var me = this;
        me.setOpt("wordCount", !0), me.addListener("contentchange", function () {
            me.fireEvent("wordcount")
        });
        var timer;
        me.addListener("ready", function () {
            var me = this;
            domUtils.on(me.body, "keyup", function (evt) {
                var code = evt.keyCode || evt.which,
                    ignores = {
                        16: 1,
                        18: 1,
                        20: 1,
                        37: 1,
                        38: 1,
                        39: 1,
                        40: 1
                    };
                code in ignores || (clearTimeout(timer), timer = setTimeout(function () {
                    me.fireEvent("wordcount")
                }, 200))
            })
        })
    }, UE.plugins.pagebreak = function () {
        function fillNode(node) {
            if (domUtils.isEmptyBlock(node)) {
                for (var tmpNode, firstChild = node.firstChild; firstChild && 1 == firstChild.nodeType && domUtils.isEmptyBlock(
                    firstChild);) tmpNode = firstChild, firstChild = firstChild.firstChild;
                !tmpNode && (tmpNode = node), domUtils.fillNode(me.document, tmpNode)
            }
        }
        function isHr(node) {
            return node && 1 == node.nodeType && "HR" == node.tagName && "pagebreak" == node.className
        }
        var me = this,
            notBreakTags = ["td"];
        me.setOpt("pageBreakTag", "_ueditor_page_break_tag_"), me.ready(function () {
            utils.cssRule("pagebreak",
                ".pagebreak{display:block;clear:both !important;cursor:default !important;width: 100% !important;margin:0;}",
                me.document)
        }), me.addInputRule(function (root) {
            root.traversal(function (node) {
                if ("text" == node.type && node.data == me.options.pageBreakTag) {
                    var hr = UE.uNode.createElement(
                        '<hr class="pagebreak" noshade="noshade" size="5" style="-webkit-user-select: none;">');
                    node.parentNode.insertBefore(hr, node), node.parentNode.removeChild(node)
                }
            })
        }), me.addOutputRule(function (node) {
            utils.each(node.getNodesByTagName("hr"), function (n) {
                if ("pagebreak" == n.getAttr("class")) {
                    var txt = UE.uNode.createText(me.options.pageBreakTag);
                    n.parentNode.insertBefore(txt, n), n.parentNode.removeChild(n)
                }
            })
        }), me.commands.pagebreak = {
            execCommand: function () {
                var range = me.selection.getRange(),
                    hr = me.document.createElement("hr");
                domUtils.setAttributes(hr, {
                    "class": "pagebreak",
                    noshade: "noshade",
                    size: "5"
                }), domUtils.unSelectable(hr);
                var pN, node = domUtils.findParentByTagName(range.startContainer, notBreakTags, !0),
                    parents = [];
                if (node) switch (node.tagName) {
                    case "TD":
                        if (pN = node.parentNode, pN.previousSibling) pN.parentNode.insertBefore(hr, pN), parents =
                                domUtils.findParents(hr);
                        else {
                            var table = domUtils.findParentByTagName(pN, "table");
                            table.parentNode.insertBefore(hr, table), parents = domUtils.findParents(hr, !0)
                        }
                        pN = parents[1], hr !== pN && domUtils.breakParent(hr, pN), me.fireEvent("afteradjusttable", me
                            .document)
                } else {
                    if (!range.collapsed) {
                        range.deleteContents();
                        for (var start = range.startContainer; !domUtils.isBody(start) && domUtils.isBlockElm(start) &&
                            domUtils.isEmptyNode(start);) range.setStartBefore(start).collapse(!0), domUtils.remove(
                                start), start = range.startContainer
                    }
                    range.insertNode(hr);
                    for (var nextNode, pN = hr.parentNode; !domUtils.isBody(pN);) domUtils.breakParent(hr, pN),
                            nextNode = hr.nextSibling, nextNode && domUtils.isEmptyBlock(nextNode) && domUtils.remove(
                            nextNode), pN = hr.parentNode;
                    nextNode = hr.nextSibling;
                    var pre = hr.previousSibling;
                    if (isHr(pre) ? domUtils.remove(pre) : pre && fillNode(pre), nextNode) isHr(nextNode) ? domUtils.remove(
                            nextNode) : fillNode(nextNode), range.setEndAfter(hr).collapse(!1);
                    else {
                        var p = me.document.createElement("p");
                        hr.parentNode.appendChild(p), domUtils.fillNode(me.document, p), range.setStart(p, 0).collapse(!
                            0)
                    }
                    range.select(!0)
                }
            }
        }
    }, UE.plugin.register("wordimage", function () {
        var me = this,
            images = [];
        return {
            commands: {
                wordimage: {
                    execCommand: function () {
                        for (var ci, images = domUtils.getElementsByTagName(me.body, "img"), urlList = [], i = 0; ci =
                            images[i++];) {
                            var url = ci.getAttribute("word_img");
                            url && urlList.push(url)
                        }
                        return urlList
                    },
                    queryCommandState: function () {
                        images = domUtils.getElementsByTagName(me.body, "img");
                        for (var ci, i = 0; ci = images[i++];) if (ci.getAttribute("word_img")) return 1;
                        return -1
                    },
                    notNeedUndo: !0
                }
            },
            inputRule: function (root) {
                utils.each(root.getNodesByTagName("img"), function (img) {
                    var attrs = img.attrs,
                        flag = parseInt(attrs.width) < 128 || parseInt(attrs.height) < 43,
                        opt = me.options,
                        src = opt.UEDITOR_HOME_URL + "themes/default/images/spacer.gif";
                    attrs.src && /^(?:(file:\/+))/.test(attrs.src) && img.setAttr({
                        width: attrs.width,
                        height: attrs.height,
                        alt: attrs.alt,
                        word_img: attrs.src,
                        src: src,
                        style: "background:url(" + (flag ? opt.themePath + opt.theme + "/images/word.gif" : opt.langPath +
                            opt.lang + "/images/localimage.png") + ") no-repeat center center;border:1px solid #ddd"
                    })
                })
            }
        }
    }), UE.plugins.dragdrop = function () {
        var me = this;
        me.ready(function () {
            domUtils.on(this.body, "dragend", function () {
                var rng = me.selection.getRange(),
                    node = rng.getClosedNode() || me.selection.getStart();
                if (node && "IMG" == node.tagName) {
                    for (var next, pre = node.previousSibling;
                    (next = node.nextSibling) && 1 == next.nodeType && "SPAN" == next.tagName && !next.firstChild;)
                        domUtils.remove(next);
                    (!pre || 1 != pre.nodeType || domUtils.isEmptyBlock(pre)) && pre || next && (!next || domUtils.isEmptyBlock(
                        next)) || (pre && "P" == pre.tagName && !domUtils.isEmptyBlock(pre) ? (pre.appendChild(node),
                        domUtils.moveChild(next, pre), domUtils.remove(next)) : next && "P" == next.tagName && !
                        domUtils.isEmptyBlock(next) && next.insertBefore(node, next.firstChild), pre && "P" == pre.tagName &&
                        domUtils.isEmptyBlock(pre) && domUtils.remove(pre), next && "P" == next.tagName && domUtils.isEmptyBlock(
                        next) && domUtils.remove(next), rng.selectNode(node).select(), me.fireEvent("saveScene"))
                }
            })
        }), me.addListener("keyup", function (type, evt) {
            var keyCode = evt.keyCode || evt.which;
            if (13 == keyCode) {
                var node, rng = me.selection.getRange();
                (node = domUtils.findParentByTagName(rng.startContainer, "p", !0)) && "center" == domUtils.getComputedStyle(
                    node, "text-align") && domUtils.removeStyle(node, "text-align")
            }
        })
    }, UE.plugins.undo = function () {
        function compareAddr(indexA, indexB) {
            if (indexA.length != indexB.length) return 0;
            for (var i = 0, l = indexA.length; l > i; i++) if (indexA[i] != indexB[i]) return 0;
            return 1
        }
        function compareRangeAddress(rngAddrA, rngAddrB) {
            return rngAddrA.collapsed != rngAddrB.collapsed ? 0 : compareAddr(rngAddrA.startAddress, rngAddrB.startAddress) &&
                compareAddr(rngAddrA.endAddress, rngAddrB.endAddress) ? 1 : 0
        }
        function UndoManager() {
            this.list = [], this.index = 0, this.hasUndo = !1, this.hasRedo = !1, this.undo = function () {
                if (this.hasUndo) {
                    if (!this.list[this.index - 1] && 1 == this.list.length) return void this.reset();
                    for (; this.list[this.index].content == this.list[this.index - 1].content;) if (this.index--, 0 ==
                            this.index) return this.restore(0);
                    this.restore(--this.index)
                }
            }, this.redo = function () {
                if (this.hasRedo) {
                    for (; this.list[this.index].content == this.list[this.index + 1].content;) if (this.index++, this.index ==
                            this.list.length - 1) return this.restore(this.index);
                    this.restore(++this.index)
                }
            }, this.restore = function () {
                var me = this.editor,
                    scene = this.list[this.index],
                    root = UE.htmlparser(scene.content.replace(fillchar, ""));
                me.options.autoClearEmptyNode = !1, me.filterInputRule(root), me.options.autoClearEmptyNode = orgState,
                    me.document.body.innerHTML = root.toHtml(), me.fireEvent("afterscencerestore"), browser.ie && utils
                    .each(domUtils.getElementsByTagName(me.document, "td th caption p"), function (node) {
                    domUtils.isEmptyNode(node) && domUtils.fillNode(me.document, node)
                });
                try {
                    var rng = new dom.Range(me.document).moveToAddress(scene.address);
                    rng.select(noNeedFillCharTags[rng.startContainer.nodeName.toLowerCase()])
                } catch (e) {}
                this.update(), this.clearKey(), me.fireEvent("reset", !0)
            }, this.getScene = function () {
                var me = this.editor,
                    rng = me.selection.getRange(),
                    rngAddress = rng.createAddress(!1, !0);
                me.fireEvent("beforegetscene");
                var root = UE.htmlparser(me.body.innerHTML);
                me.options.autoClearEmptyNode = !1, me.filterOutputRule(root), me.options.autoClearEmptyNode = orgState;
                var cont = root.toHtml();
                return me.fireEvent("aftergetscene"), {
                    address: rngAddress,
                    content: cont
                }
            }, this.save = function (notCompareRange, notSetCursor) {
                clearTimeout(saveSceneTimer);
                var currentScene = this.getScene(notSetCursor),
                    lastScene = this.list[this.index];
                lastScene && lastScene.content != currentScene.content && me.trigger("contentchange"), lastScene &&
                    lastScene.content == currentScene.content && (notCompareRange ? 1 : compareRangeAddress(lastScene.address,
                    currentScene.address)) || (this.list = this.list.slice(0, this.index + 1), this.list.push(
                    currentScene), this.list.length > maxUndoCount && this.list.shift(), this.index = this.list.length -
                    1, this.clearKey(), this.update())
            }, this.update = function () {
                this.hasRedo = !! this.list[this.index + 1], this.hasUndo = !! this.list[this.index - 1]
            }, this.reset = function () {
                this.list = [], this.index = 0, this.hasUndo = !1, this.hasRedo = !1, this.clearKey()
            }, this.clearKey = function () {
                keycont = 0, lastKeyCode = null
            }
        }
        var saveSceneTimer, me = this,
            maxUndoCount = me.options.maxUndoCount || 20,
            maxInputCount = me.options.maxInputCount || 20,
            fillchar = new RegExp(domUtils.fillChar + "|</hr>", "gi"),
            noNeedFillCharTags = {
                ol: 1,
                ul: 1,
                table: 1,
                tbody: 1,
                tr: 1,
                body: 1
            }, orgState = me.options.autoClearEmptyNode;
        me.undoManger = new UndoManager, me.undoManger.editor = me, me.addListener("saveScene", function () {
            var args = Array.prototype.splice.call(arguments, 1);
            this.undoManger.save.apply(this.undoManger, args)
        }), me.addListener("reset", function (type, exclude) {
            exclude || this.undoManger.reset()
        }), me.commands.redo = me.commands.undo = {
            execCommand: function (cmdName) {
                this.undoManger[cmdName]()
            },
            queryCommandState: function (cmdName) {
                return this.undoManger["has" + ("undo" == cmdName.toLowerCase() ? "Undo" : "Redo")] ? 0 : -1
            },
            notNeedUndo: 1
        };
        var lastKeyCode, keys = {
                16: 1,
                17: 1,
                18: 1,
                37: 1,
                38: 1,
                39: 1,
                40: 1
            }, keycont = 0,
            inputType = !1;
        me.addListener("ready", function () {
            domUtils.on(this.body, "compositionstart", function () {
                inputType = !0
            }), domUtils.on(this.body, "compositionend", function () {
                inputType = !1
            })
        }), me.addshortcutkey({
            Undo: "ctrl+90",
            Redo: "ctrl+89"
        });
        var isCollapsed = !0;
        me.addListener("keydown", function (type, evt) {
            function save(cont) {
                cont.undoManger.save(!1, !0), cont.fireEvent("selectionchange")
            }
            var me = this,
                keyCode = evt.keyCode || evt.which;
            if (!(keys[keyCode] || evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.altKey)) {
                if (inputType) return;
                if (!me.selection.getRange().collapsed) return me.undoManger.save(!1, !0), void(isCollapsed = !1);
                0 == me.undoManger.list.length && me.undoManger.save(!0), clearTimeout(saveSceneTimer), saveSceneTimer =
                    setTimeout(function () {
                    if (inputType) var interalTimer = setInterval(function () {
                            inputType || (save(me), clearInterval(interalTimer))
                        }, 300);
                    else save(me)
                }, 200), lastKeyCode = keyCode, keycont++, keycont >= maxInputCount && save(me)
            }
        }), me.addListener("keyup", function (type, evt) {
            var keyCode = evt.keyCode || evt.which;
            if (!(keys[keyCode] || evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.altKey)) {
                if (inputType) return;
                isCollapsed || (this.undoManger.save(!1, !0), isCollapsed = !0)
            }
        }), me.stopCmdUndo = function () {
            me.__hasEnterExecCommand = !0
        }, me.startCmdUndo = function () {
            me.__hasEnterExecCommand = !1
        }
    }, UE.plugins.paste = function () {
        function getClipboardData(callback) {
            var doc = this.document;
            if (!doc.getElementById("baidu_pastebin")) {
                var range = this.selection.getRange(),
                    bk = range.createBookmark(),
                    pastebin = doc.createElement("div");
                pastebin.id = "baidu_pastebin", browser.webkit && pastebin.appendChild(doc.createTextNode(domUtils.fillChar +
                    domUtils.fillChar)), doc.body.appendChild(pastebin), bk.start.style.display = "", pastebin.style.cssText =
                    "position:absolute;width:1px;height:1px;overflow:hidden;left:-1000px;white-space:nowrap;top:" +
                    domUtils.getXY(bk.start).y + "px", range.selectNodeContents(pastebin).select(!0), setTimeout(function () {
                    if (browser.webkit) for (var pi, i = 0, pastebins = doc.querySelectorAll("#baidu_pastebin"); pi =
                            pastebins[i++];) {
                            if (!domUtils.isEmptyNode(pi)) {
                                pastebin = pi;
                                break
                            }
                            domUtils.remove(pi)
                    }
                    try {
                        pastebin.parentNode.removeChild(pastebin)
                    } catch (e) {}
                    range.moveToBookmark(bk).select(!0), callback(pastebin)
                }, 0)
            }
        }
        function getPureHtml(html) {
            return html.replace(/<(\/?)([\w\-]+)([^>]*)>/gi, function (a, b, tagName, attrs) {
                return tagName = tagName.toLowerCase(), {
                    img: 1
                }[tagName] ? a : (attrs = attrs.replace(/([\w\-]*?)\s*=\s*(("([^"]*)")|('([^']*)')|([^\s>]+))/gi, function (
                    str, atr, val) {
                    return {
                        src: 1,
                        href: 1,
                        name: 1
                    }[atr.toLowerCase()] ? atr + "=" + val + " " : ""
                }), {
                    span: 1,
                    div: 1
                }[tagName] ? "" : "<" + b + tagName + " " + utils.trim(attrs) + ">")
            })
        }
        function filter(div) {
            var html;
            if (div.firstChild) {
                for (var ni, nodes = domUtils.getElementsByTagName(div, "span"), i = 0; ni = nodes[i++];)(
                        "_baidu_cut_start" == ni.id || "_baidu_cut_end" == ni.id) && domUtils.remove(ni);
                if (browser.webkit) {
                    for (var bi, brs = div.querySelectorAll("div br"), i = 0; bi = brs[i++];) {
                        var pN = bi.parentNode;
                        "DIV" == pN.tagName && 1 == pN.childNodes.length && (pN.innerHTML = "<p><br/></p>", domUtils.remove(
                            pN))
                    }
                    for (var di, divs = div.querySelectorAll("#baidu_pastebin"), i = 0; di = divs[i++];) {
                        var tmpP = me.document.createElement("p");
                        for (di.parentNode.insertBefore(tmpP, di); di.firstChild;) tmpP.appendChild(di.firstChild);
                        domUtils.remove(di)
                    }
                    for (var ci, metas = div.querySelectorAll("meta"), i = 0; ci = metas[i++];) domUtils.remove(ci);
                    var brs = div.querySelectorAll("br");
                    for (i = 0; ci = brs[i++];){ /^apple-/i.test(ci.className) && domUtils.remove(ci)}
                }
                if (browser.gecko) {
                    var dirtyNodes = div.querySelectorAll("[_moz_dirty]");
                    for (i = 0; ci = dirtyNodes[i++];) ci.removeAttribute("_moz_dirty")
                }
                if (!browser.ie) for (var ci, spans = div.querySelectorAll("span.Apple-style-span"), i = 0; ci = spans[
                        i++];) domUtils.remove(ci, !0);
                html = div.innerHTML, html = UE.filterWord(html);
                var root = UE.htmlparser(html);
                if (me.options.filterRules && UE.filterNode(root, me.options.filterRules), me.filterInputRule(root),
                    browser.webkit) {
                    var br = root.lastChild();
                    br && "element" == br.type && "br" == br.tagName && root.removeChild(br), utils.each(me.body.querySelectorAll(
                        "div"), function (node) {
                        domUtils.isEmptyBlock(node) && domUtils.remove(node, !0)
                    })
                }
                var rootHtml = root.toHtml().replace(/<br[^>]*>/gi, "</p><p>");
                if (rootHtml = rootHtml.replace(/\s*(<img[^>]*>)\s*/gi, "</p><p>$1</p><p>"), rootHtml = rootHtml.replace(
                    /(<p[^>]*>)\s*/gi, "$1"), html = {
                    html: rootHtml
                }, me.fireEvent("beforepaste", html, root), !html.html) return;
                root = UE.htmlparser(html.html, !0), 1 === me.queryCommandState("pasteplain") ? me.execCommand(
                    "insertHtml", UE.filterNode(root, me.options.filterTxtRules).toHtml(), !0) : (UE.filterNode(root,
                    me.options.filterTxtRules), txtContent = root.toHtml(), htmlContent = html.html, address = me.selection
                    .getRange().createAddress(!0), me.execCommand("insertHtml", me.getOpt("retainOnlyLabelPasted") === !
                    0 ? getPureHtml(htmlContent) : htmlContent, !0)), me.fireEvent("afterpaste", html)
            }
        }
        var me = this;
        me.setOpt({
            retainOnlyLabelPasted: !1
        });
        var txtContent, htmlContent, address;
        me.addListener("pasteTransfer", function (cmd, plainType) {
            if (address && txtContent && htmlContent && txtContent != htmlContent) {
                var range = me.selection.getRange();
                if (range.moveToAddress(address, !0), !range.collapsed) {
                    for (; !domUtils.isBody(range.startContainer);) {
                        var start = range.startContainer;
                        if (1 == start.nodeType) {
                            if (start = start.childNodes[range.startOffset], !start) {
                                range.setStartBefore(range.startContainer);
                                continue
                            }
                            var pre = start.previousSibling;
                            pre && 3 == pre.nodeType && new RegExp("^[\n\r   " + domUtils.fillChar + "]*$").test(pre.nodeValue) &&
                                range.setStartBefore(pre)
                        }
                        if (0 != range.startOffset) break;
                        range.setStartBefore(range.startContainer)
                    }
                    for (; !domUtils.isBody(range.endContainer);) {
                        var end = range.endContainer;
                        if (1 == end.nodeType) {
                            if (end = end.childNodes[range.endOffset], !end) {
                                range.setEndAfter(range.endContainer);
                                continue
                            }
                            var next = end.nextSibling;
                            next && 3 == next.nodeType && new RegExp("^[\n\r    " + domUtils.fillChar + "]*$").test(next.nodeValue) &&
                                range.setEndAfter(next)
                        }
                        if (range.endOffset != range.endContainer[3 == range.endContainer.nodeType ? "nodeValue" :
                            "childNodes"].length) break;
                        range.setEndAfter(range.endContainer)
                    }
                }
                range.deleteContents(), range.select(!0), me.__hasEnterExecCommand = !0;
                var html = htmlContent;
                2 === plainType ? html = getPureHtml(html) : plainType && (html = txtContent), me.execCommand(
                    "inserthtml", html, !0), me.__hasEnterExecCommand = !1;
                for (var rng = me.selection.getRange(); !domUtils.isBody(rng.startContainer) && !rng.startOffset && rng
                    .startContainer[3 == rng.startContainer.nodeType ? "nodeValue" : "childNodes"].length;) rng.setStartBefore(
                        rng.startContainer);
                var tmpAddress = rng.createAddress(!0);
                address.endAddress = tmpAddress.startAddress
            }
        }), me.addListener("ready", function () {
            domUtils.on(me.body, "cut", function () {
                var range = me.selection.getRange();
                !range.collapsed && me.undoManger && me.undoManger.save()
            }), domUtils.on(me.body, browser.ie || browser.opera ? "keydown" : "paste", function (e) {
                (!browser.ie && !browser.opera || (e.ctrlKey || e.metaKey) && "86" == e.keyCode) && getClipboardData.call(
                    me, function (div) {
                    filter(div)
                })
            })
        }), me.commands.paste = {
            execCommand: function () {
                browser.ie ? (getClipboardData.call(me, function (div) {
                    filter(div)
                }), me.document.execCommand("paste")) : alert(me.getLang("pastemsg"))
            }
        }
    }, UE.plugins.pasteplain = function () {
        var me = this;
        me.setOpt({
            pasteplain: !1,
            filterTxtRules: function () {
                function transP(node) {
                    node.tagName = "p", node.setStyle()
                }
                function removeNode(node) {
                    node.parentNode.removeChild(node, !0)
                }
                return {
                    "-": "script style object iframe embed input select",
                    p: {
                        $: {}
                    },
                    br: {
                        $: {}
                    },
                    div: function (node) {
                        for (var tmpNode, p = UE.uNode.createElement("p"); tmpNode = node.firstChild();) "text" !=
                                tmpNode.type && UE.dom.dtd.$block[tmpNode.tagName] ? p.firstChild() ? (node.parentNode.insertBefore(
                                p, node), p = UE.uNode.createElement("p")) : node.parentNode.insertBefore(tmpNode, node) :
                                p.appendChild(tmpNode);
                        p.firstChild() && node.parentNode.insertBefore(p, node), node.parentNode.removeChild(node)
                    },
                    ol: removeNode,
                    ul: removeNode,
                    dl: removeNode,
                    dt: removeNode,
                    dd: removeNode,
                    li: removeNode,
                    caption: transP,
                    th: transP,
                    tr: transP,
                    h1: transP,
                    h2: transP,
                    h3: transP,
                    h4: transP,
                    h5: transP,
                    h6: transP,
                    td: function (node) {
                        var txt = !! node.innerText();
                        txt && node.parentNode.insertAfter(UE.uNode.createText("    "), node), node.parentNode
                            .removeChild(node, node.innerText())
                    }
                }
            }()
        });
        var pasteplain = me.options.pasteplain;
        me.commands.pasteplain = {
            queryCommandState: function () {
                return pasteplain ? 1 : 0
            },
            execCommand: function () {
                pasteplain = 0 | !pasteplain
            },
            notNeedUndo: 1
        }
    }, UE.plugins.list = function () {
        function listToArray(list) {
            var arr = [];
            for (var p in list) arr.push(p);
            return arr
        }
        function getStyle(node) {
            var cls = node.className;
            return domUtils.hasClass(node, /custom_/) ? cls.match(/custom_(\w+)/)[1] : domUtils.getStyle(node,
                "list-style-type")
        }
        function adjustListStyle(doc, ignore) {
            utils.each(domUtils.getElementsByTagName(doc, "ol ul"), function (node) {
                if (domUtils.inDoc(node, doc)) {
                    var parent = node.parentNode;
                    if (parent.tagName == node.tagName) {
                        var nodeStyleType = getStyle(node) || ("OL" == node.tagName ? "decimal" : "disc"),
                            parentStyleType = getStyle(parent) || ("OL" == parent.tagName ? "decimal" : "disc");
                        if (nodeStyleType == parentStyleType) {
                            var styleIndex = utils.indexOf(listStyle[node.tagName], nodeStyleType);
                            styleIndex = styleIndex + 1 == listStyle[node.tagName].length ? 0 : styleIndex + 1,
                                setListStyle(node, listStyle[node.tagName][styleIndex])
                        }
                    }
                    var index = 0,
                        type = 2;
                    domUtils.hasClass(node, /custom_/) ? /[ou]l/i.test(parent.tagName) && domUtils.hasClass(parent,
                        /custom_/) || (type = 1) : /[ou]l/i.test(parent.tagName) && domUtils.hasClass(parent, /custom_/) &&
                        (type = 3);
                    var style = domUtils.getStyle(node, "list-style-type");
                    style && (node.style.cssText = "list-style-type:" + style), node.className = utils.trim(node.className
                        .replace(/list-paddingleft-\w+/, "")) + " list-paddingleft-" + type, utils.each(domUtils.getElementsByTagName(
                        node, "li"), function (li) {
                        if (li.style.cssText && (li.style.cssText = ""), !li.firstChild) return void domUtils.remove(li);
                        if (li.parentNode === node) {
                            if (index++, domUtils.hasClass(node, /custom_/)) {
                                var paddingLeft = 1,
                                    currentStyle = getStyle(node);
                                if ("OL" == node.tagName) {
                                    if (currentStyle) switch (currentStyle) {
                                        case "cn":
                                        case "cn1":
                                        case "cn2":
                                            index > 10 && (index % 10 == 0 || index > 10 && 20 > index) ? paddingLeft =
                                                2 : index > 20 && (paddingLeft = 3);
                                            break;
                                        case "num2":
                                            index > 9 && (paddingLeft = 2)
                                    }
                                    li.className = "list-" + customStyle[currentStyle] + index + " list-" +
                                        currentStyle + "-paddingleft-" + paddingLeft
                                } else li.className = "list-" + customStyle[currentStyle] + " list-" + currentStyle +
                                        "-paddingleft";
 
                            } else li.className = li.className.replace(/list-[\w\-]+/gi, "");
                            var className = li.getAttribute("class");
                            null === className || className.replace(/\s/g, "") || domUtils.removeAttributes(li, "class")
                        }
                    }), !ignore && adjustList(node, node.tagName.toLowerCase(), getStyle(node) || domUtils.getStyle(
                        node, "list-style-type"), !0)
                }
            })
        }
        function adjustList(list, tag, style, ignoreEmpty) {
            var nextList = list.nextSibling;
            nextList && 1 == nextList.nodeType && nextList.tagName.toLowerCase() == tag && (getStyle(nextList) ||
                domUtils.getStyle(nextList, "list-style-type") || ("ol" == tag ? "decimal" : "disc")) == style && (
                domUtils.moveChild(nextList, list), 0 == nextList.childNodes.length && domUtils.remove(nextList)),
                nextList && domUtils.isFillChar(nextList) && domUtils.remove(nextList);
            var preList = list.previousSibling;
            preList && 1 == preList.nodeType && preList.tagName.toLowerCase() == tag && (getStyle(preList) || domUtils.getStyle(
                preList, "list-style-type") || ("ol" == tag ? "decimal" : "disc")) == style && domUtils.moveChild(list,
                preList), preList && domUtils.isFillChar(preList) && domUtils.remove(preList), !ignoreEmpty && domUtils
                .isEmptyBlock(list) && domUtils.remove(list), getStyle(list) && adjustListStyle(list.ownerDocument, !0)
        }
        function setListStyle(list, style) {
            customStyle[style] && (list.className = "custom_" + style);
            try {
                domUtils.setStyle(list, "list-style-type", style)
            } catch (e) {}
        }
        function clearEmptySibling(node) {
            var tmpNode = node.previousSibling;
            tmpNode && domUtils.isEmptyBlock(tmpNode) && domUtils.remove(tmpNode), tmpNode = node.nextSibling, tmpNode &&
                domUtils.isEmptyBlock(tmpNode) && domUtils.remove(tmpNode)
        }
        function getLi(start) {
            for (; start && !domUtils.isBody(start);) {
                if ("TABLE" == start.nodeName) return null;
                if ("LI" == start.nodeName) return start;
                start = start.parentNode
            }
        }
        var me = this,
            notExchange = {
                TD: 1,
                PRE: 1,
                BLOCKQUOTE: 1
            }, customStyle = {
                cn: "cn-1-",
                cn1: "cn-2-",
                cn2: "cn-3-",
                num: "num-1-",
                num1: "num-2-",
                num2: "num-3-",
                dash: "dash",
                dot: "dot"
            };
        me.setOpt({
            autoTransWordToList: !1,
            insertorderedlist: {
                num: "",
                num1: "",
                num2: "",
                cn: "",
                cn1: "",
                cn2: "",
                decimal: "",
                "lower-alpha": "",
                "lower-roman": "",
                "upper-alpha": "",
                "upper-roman": ""
            },
            insertunorderedlist: {
                circle: "",
                disc: "",
                square: "",
                dash: "",
                dot: ""
            },
            listDefaultPaddingLeft: "30",
            listiconpath: "http://bs.baidu.com/listicon/",
            maxListLevel: -1,
            disablePInList: !1
        });
        var listStyle = {
            OL: listToArray(me.options.insertorderedlist),
            UL: listToArray(me.options.insertunorderedlist)
        }, liiconpath = me.options.listiconpath;
        for (var s in customStyle) me.options.insertorderedlist.hasOwnProperty(s) || me.options.insertunorderedlist.hasOwnProperty(
                s) || delete customStyle[s];
        me.ready(function () {
            var customCss = [];
            for (var p in customStyle) {
                if ("dash" == p || "dot" == p) customCss.push("li.list-" + customStyle[p] + "{background-image:url(" +
                        liiconpath + customStyle[p] + ".gif)}"), customCss.push("ul.custom_" + p +
                        "{list-style:none;}ul.custom_" + p +
                        " li{background-position:0 3px;background-repeat:no-repeat}");
                else {
                    for (var i = 0; 99 > i; i++) customCss.push("li.list-" + customStyle[p] + i +
                            "{background-image:url(" + liiconpath + "list-" + customStyle[p] + i + ".gif)}");
                    customCss.push("ol.custom_" + p + "{list-style:none;}ol.custom_" + p +
                        " li{background-position:0 3px;background-repeat:no-repeat}")
                }
                switch (p) {
                case "cn":
                    customCss.push("li.list-" + p + "-paddingleft-1{padding-left:25px}"), customCss.push("li.list-" + p +
                        "-paddingleft-2{padding-left:40px}"), customCss.push("li.list-" + p +
                        "-paddingleft-3{padding-left:55px}");
                    break;
                case "cn1":
                    customCss.push("li.list-" + p + "-paddingleft-1{padding-left:30px}"), customCss.push("li.list-" + p +
                        "-paddingleft-2{padding-left:40px}"), customCss.push("li.list-" + p +
                        "-paddingleft-3{padding-left:55px}");
                    break;
                case "cn2":
                    customCss.push("li.list-" + p + "-paddingleft-1{padding-left:40px}"), customCss.push("li.list-" + p +
                        "-paddingleft-2{padding-left:55px}"), customCss.push("li.list-" + p +
                        "-paddingleft-3{padding-left:68px}");
                    break;
                case "num":
                case "num1":
                    customCss.push("li.list-" + p + "-paddingleft-1{padding-left:25px}");
                    break;
                case "num2":
                    customCss.push("li.list-" + p + "-paddingleft-1{padding-left:35px}"), customCss.push("li.list-" + p +
                        "-paddingleft-2{padding-left:40px}");
                    break;
                case "dash":
                    customCss.push("li.list-" + p + "-paddingleft{padding-left:35px}");
                    break;
                case "dot":
                    customCss.push("li.list-" + p + "-paddingleft{padding-left:20px}")
                }
            }
            customCss.push(".list-paddingleft-1{padding-left:0}"), customCss.push(".list-paddingleft-2{padding-left:" +
                me.options.listDefaultPaddingLeft + "px}"), customCss.push(".list-paddingleft-3{padding-left:" + 2 * me
                .options.listDefaultPaddingLeft + "px}"), utils.cssRule("list", "ol,ul{margin:0;pading:0;" + (browser.ie ?
                "" : "width:95%") + "}li{clear:both;}" + customCss.join("\n"), me.document)
        }), me.ready(function () {
            domUtils.on(me.body, "cut", function () {
                setTimeout(function () {
                    var li, rng = me.selection.getRange();
                    if (!rng.collapsed && (li = domUtils.findParentByTagName(rng.startContainer, "li", !0)) && !li.nextSibling &&
                        domUtils.isEmptyBlock(li)) {
                        var node, pn = li.parentNode;
                        if (node = pn.previousSibling) domUtils.remove(pn), rng.setStartAtLast(node).collapse(!0), rng.select(!
                                0);
                        else if (node = pn.nextSibling) domUtils.remove(pn), rng.setStartAtFirst(node).collapse(!0),
                                rng.select(!0);
                        else {
                            var tmpNode = me.document.createElement("p");
                            domUtils.fillNode(me.document, tmpNode), pn.parentNode.insertBefore(tmpNode, pn), domUtils.remove(
                                pn), rng.setStart(tmpNode, 0).collapse(!0), rng.select(!0)
                        }
                    }
                })
            })
        }), me.addListener("beforepaste", function (type, html) {
            var li, me = this,
                rng = me.selection.getRange(),
                root = UE.htmlparser(html.html, !0);
            if (li = domUtils.findParentByTagName(rng.startContainer, "li", !0)) {
                var list = li.parentNode,
                    tagName = "OL" == list.tagName ? "ul" : "ol";
                utils.each(root.getNodesByTagName(tagName), function (n) {
                    if (n.tagName = list.tagName, n.setAttr(), n.parentNode === root) type = getStyle(list) || ("OL" ==
                            list.tagName ? "decimal" : "disc");
                    else {
                        var className = n.parentNode.getAttr("class");
                        type = className && /custom_/.test(className) ? className.match(/custom_(\w+)/)[1] : n.parentNode
                            .getStyle("list-style-type"), type || (type = "OL" == list.tagName ? "decimal" : "disc")
                    }
                    var index = utils.indexOf(listStyle[list.tagName], type);
                    n.parentNode !== root && (index = index + 1 == listStyle[list.tagName].length ? 0 : index + 1);
                    var currentStyle = listStyle[list.tagName][index];
                    customStyle[currentStyle] ? n.setAttr("class", "custom_" + currentStyle) : n.setStyle(
                        "list-style-type", currentStyle)
                })
            }
            html.html = root.toHtml()
        }), me.getOpt("disablePInList") === !0 && me.addOutputRule(function (root) {
            utils.each(root.getNodesByTagName("li"), function (li) {
                var newChildrens = [],
                    index = 0;
                utils.each(li.children, function (n) {
                    if ("p" == n.tagName) {
                        for (var tmpNode; tmpNode = n.children.pop();) newChildrens.splice(index, 0, tmpNode), tmpNode.parentNode =
                                li, lastNode = tmpNode;
                        if (tmpNode = newChildrens[newChildrens.length - 1], !tmpNode || "element" != tmpNode.type ||
                            "br" != tmpNode.tagName) {
                            var br = UE.uNode.createElement("br");
                            br.parentNode = li, newChildrens.push(br)
                        }
                        index = newChildrens.length
                    }
                }), newChildrens.length && (li.children = newChildrens)
            })
        }), me.addInputRule(function (root) {
            function checkListType(content, container) {
                var span = container.firstChild();
                if (span && "element" == span.type && "span" == span.tagName && /Wingdings|Symbol/.test(span.getStyle(
                    "font-family"))) {
                    for (var p in unorderlisttype) if (unorderlisttype[p] == span.data) return p;
                    return "disc"
                }
                for (var p in orderlisttype) if (orderlisttype[p].test(content)) return p
            }
            if (utils.each(root.getNodesByTagName("li"), function (li) {
                for (var ci, tmpP = UE.uNode.createElement("p"), i = 0; ci = li.children[i];) "text" == ci.type || dtd.p[
                        ci.tagName] ? tmpP.appendChild(ci) : tmpP.firstChild() ? (li.insertBefore(tmpP, ci), tmpP = UE.uNode
                        .createElement("p"), i += 2) : i++;
                (tmpP.firstChild() && !tmpP.parentNode || !li.firstChild()) && li.appendChild(tmpP), tmpP.firstChild() ||
                    tmpP.innerHTML(browser.ie ? " " : "<br/>");
                var p = li.firstChild(),
                    lastChild = p.lastChild();
                lastChild && "text" == lastChild.type && /^\s*$/.test(lastChild.data) && p.removeChild(lastChild)
            }), me.options.autoTransWordToList) {
                var orderlisttype = {
                    num1: /^\d+\)/,
                    decimal: /^\d+\./,
                    "lower-alpha": /^[a-z]+\)/,
                    "upper-alpha": /^[A-Z]+\./,
                    cn: /^[\u4E00\u4E8C\u4E09\u56DB\u516d\u4e94\u4e03\u516b\u4e5d]+[\u3001]/,
                    cn2: /^\([\u4E00\u4E8C\u4E09\u56DB\u516d\u4e94\u4e03\u516b\u4e5d]+\)/
                }, unorderlisttype = {
                        square: "n"
                    };
                utils.each(root.getNodesByTagName("p"), function (node) {
                    function appendLi(list, p, type) {
                        if ("ol" == list.tagName) if (browser.ie) {
                                var first = p.firstChild();
                                "element" == first.type && "span" == first.tagName && orderlisttype[type].test(first.innerText()) &&
                                    p.removeChild(first)
                            } else p.innerHTML(p.innerHTML().replace(orderlisttype[type], ""));
                            else p.removeChild(p.firstChild());
                        var li = UE.uNode.createElement("li");
                        li.appendChild(p), list.appendChild(li)
                    }
                    if ("MsoListParagraph" == node.getAttr("class")) {
                        node.setStyle("margin", ""), node.setStyle("margin-left", ""), node.setAttr("class", "");
                        var type, tmp = node,
                            cacheNode = node;
                        if ("li" != node.parentNode.tagName && (type = checkListType(node.innerText(), node))) {
                            var list = UE.uNode.createElement(me.options.insertorderedlist.hasOwnProperty(type) ? "ol" :
                                "ul");
                            for (customStyle[type] ? list.setAttr("class", "custom_" + type) : list.setStyle(
                                "list-style-type", type); node && "li" != node.parentNode.tagName && checkListType(node
                                .innerText(), node);) tmp = node.nextSibling(), tmp || node.parentNode.insertBefore(
                                    list, node), appendLi(list, node, type), node = tmp;
                            !list.parentNode && node && node.parentNode && node.parentNode.insertBefore(list, node)
                        }
                        var span = cacheNode.firstChild();
                        span && "element" == span.type && "span" == span.tagName && /^\s*( )+\s*$/.test(span.innerText()) &&
                            span.parentNode.removeChild(span)
                    }
                })
            }
        }), me.addListener("contentchange", function () {
            adjustListStyle(me.document)
        }), me.addListener("keydown", function (type, evt) {
            function preventAndSave() {
                evt.preventDefault ? evt.preventDefault() : evt.returnValue = !1, me.fireEvent("contentchange"), me.undoManger &&
                    me.undoManger.save()
            }
            function findList(node, filterFn) {
                for (; node && !domUtils.isBody(node);) {
                    if (filterFn(node)) return null;
                    if (1 == node.nodeType && /[ou]l/i.test(node.tagName)) return node;
                    node = node.parentNode
                }
                return null
            }
            var keyCode = evt.keyCode || evt.which;
            if (13 == keyCode && !evt.shiftKey) {
                var rng = me.selection.getRange(),
                    parent = domUtils.findParent(rng.startContainer, function (node) {
                        return domUtils.isBlockElm(node)
                    }, !0),
                    li = domUtils.findParentByTagName(rng.startContainer, "li", !0);
                if (parent && "PRE" != parent.tagName && !li) {
                    var html = parent.innerHTML.replace(new RegExp(domUtils.fillChar, "g"), "");
                    /^\s*1\s*\.[^\d]/.test(html) && (parent.innerHTML = html.replace(/^\s*1\s*\./, ""), rng.setStartAtLast(
                        parent).collapse(!0).select(), me.__hasEnterExecCommand = !0, me.execCommand(
                        "insertorderedlist"), me.__hasEnterExecCommand = !1)
                }
                var range = me.selection.getRange(),
                    start = findList(range.startContainer, function (node) {
                        return "TABLE" == node.tagName
                    }),
                    end = range.collapsed ? start : findList(range.endContainer, function (node) {
                        return "TABLE" == node.tagName
                    });
                if (start && end && start === end) {
                    if (!range.collapsed) {
                        if (start = domUtils.findParentByTagName(range.startContainer, "li", !0), end = domUtils.findParentByTagName(
                            range.endContainer, "li", !0), !start || !end || start !== end) {
                            var tmpRange = range.cloneRange(),
                                bk = tmpRange.collapse(!1).createBookmark();
                            range.deleteContents(), tmpRange.moveToBookmark(bk);
                            var li = domUtils.findParentByTagName(tmpRange.startContainer, "li", !0);
                            return clearEmptySibling(li), tmpRange.select(), void preventAndSave()
                        }
                        if (range.deleteContents(), li = domUtils.findParentByTagName(range.startContainer, "li", !0),
                            li && domUtils.isEmptyBlock(li)) return pre = li.previousSibling, next = li.nextSibling, p =
                                me.document.createElement("p"), domUtils.fillNode(me.document, p), parentList = li.parentNode,
                                pre && next ? (range.setStart(next, 0).collapse(!0).select(!0), domUtils.remove(li)) :
                                ((pre || next) && pre ? li.parentNode.parentNode.insertBefore(p, parentList.nextSibling) :
                                parentList.parentNode.insertBefore(p, parentList), domUtils.remove(li), parentList.firstChild ||
                                domUtils.remove(parentList), range.setStart(p, 0).setCursor()), void preventAndSave()
                    }
                    if (li = domUtils.findParentByTagName(range.startContainer, "li", !0)) {
                        if (domUtils.isEmptyBlock(li)) {
                            bk = range.createBookmark();
                            var parentList = li.parentNode;
                            if (li !== parentList.lastChild ? (domUtils.breakParent(li, parentList), clearEmptySibling(
                                li)) : (parentList.parentNode.insertBefore(li, parentList.nextSibling), domUtils.isEmptyNode(
                                parentList) && domUtils.remove(parentList)), !dtd.$list[li.parentNode.tagName]) if (
                                    domUtils.isBlockElm(li.firstChild)) domUtils.remove(li, !0);
                                else {
                                    for (p = me.document.createElement("p"), li.parentNode.insertBefore(p, li); li.firstChild;)
                                        p.appendChild(li.firstChild);
                                    domUtils.remove(li)
                                }
                            range.moveToBookmark(bk).select()
                        } else {
                            var first = li.firstChild;
                            if (!first || !domUtils.isBlockElm(first)) {
                                var p = me.document.createElement("p");
                                for (!li.firstChild && domUtils.fillNode(me.document, p); li.firstChild;) p.appendChild(
                                        li.firstChild);
                                li.appendChild(p), first = p
                            }
                            var span = me.document.createElement("span");
                            range.insertNode(span), domUtils.breakParent(span, li);
                            var nextLi = span.nextSibling;
                            first = nextLi.firstChild, first || (p = me.document.createElement("p"), domUtils.fillNode(
                                me.document, p), nextLi.appendChild(p), first = p), domUtils.isEmptyNode(first) && (
                                first.innerHTML = "", domUtils.fillNode(me.document, first)), range.setStart(first, 0).collapse(!
                                0).shrinkBoundary().select(), domUtils.remove(span);
                            var pre = nextLi.previousSibling;
                            pre && domUtils.isEmptyBlock(pre) && (pre.innerHTML = "<p></p>", domUtils.fillNode(me.document,
                                pre.firstChild))
                        }
                        preventAndSave()
                    }
                }
            }
            if (8 == keyCode && (range = me.selection.getRange(), range.collapsed && domUtils.isStartInblock(range) &&
                (tmpRange = range.cloneRange().trimBoundary(), li = domUtils.findParentByTagName(range.startContainer,
                "li", !0), li && domUtils.isStartInblock(tmpRange)))) {
                if (start = domUtils.findParentByTagName(range.startContainer, "p", !0), start && start !== li.firstChild) {
                    var parentList = domUtils.findParentByTagName(start, ["ol", "ul"]);
                    return domUtils.breakParent(start, parentList), clearEmptySibling(start), me.fireEvent(
                        "contentchange"), range.setStart(start, 0).setCursor(!1, !0), me.fireEvent("saveScene"), void domUtils
                        .preventDefault(evt)
                }
                if (li && (pre = li.previousSibling)) {
                    if (46 == keyCode && li.childNodes.length) return;
                    if (dtd.$list[pre.tagName] && (pre = pre.lastChild), me.undoManger && me.undoManger.save(), first =
                        li.firstChild, domUtils.isBlockElm(first)) if (domUtils.isEmptyNode(first)) for (pre.appendChild(
                                first), range.setStart(first, 0).setCursor(!1, !0); li.firstChild;) pre.appendChild(li.firstChild);
                        else span = me.document.createElement("span"), range.insertNode(span), domUtils.isEmptyBlock(
                                pre) && (pre.innerHTML = ""), domUtils.moveChild(li, pre), range.setStartBefore(span).collapse(!
                                0).select(!0), domUtils.remove(span);
                        else if (domUtils.isEmptyNode(li)) {
                        var p = me.document.createElement("p");
                        pre.appendChild(p), range.setStart(p, 0).setCursor()
                    } else for (range.setEnd(pre, pre.childNodes.length).collapse().select(!0); li.firstChild;) pre.appendChild(
                                li.firstChild);
                    return domUtils.remove(li), me.fireEvent("contentchange"), me.fireEvent("saveScene"), void domUtils
                        .preventDefault(evt)
                }
                if (li && !li.previousSibling) {
                    var parentList = li.parentNode,
                        bk = range.createBookmark();
                    if (domUtils.isTagNode(parentList.parentNode, "ol ul")) parentList.parentNode.insertBefore(li,
                            parentList), domUtils.isEmptyNode(parentList) && domUtils.remove(parentList);
                    else {
                        for (; li.firstChild;) parentList.parentNode.insertBefore(li.firstChild, parentList);
                        domUtils.remove(li), domUtils.isEmptyNode(parentList) && domUtils.remove(parentList)
                    }
                    return range.moveToBookmark(bk).setCursor(!1, !0), me.fireEvent("contentchange"), me.fireEvent(
                        "saveScene"), void domUtils.preventDefault(evt)
                }
            }
        }), me.addListener("keyup", function (type, evt) {
            var keyCode = evt.keyCode || evt.which;
            if (8 == keyCode) {
                var list, rng = me.selection.getRange();
                (list = domUtils.findParentByTagName(rng.startContainer, ["ol", "ul"], !0)) && adjustList(list, list.tagName
                    .toLowerCase(), getStyle(list) || domUtils.getComputedStyle(list, "list-style-type"), !0)
            }
        }), me.addListener("tabkeydown", function () {
            function checkLevel(li) {
                if (-1 != me.options.maxListLevel) {
                    for (var level = li.parentNode, levelNum = 0;
                    /[ou]l/i.test(level.tagName);) levelNum++, level = level.parentNode;
                    if (levelNum >= me.options.maxListLevel) return !0
                }
            }
            var range = me.selection.getRange(),
                li = domUtils.findParentByTagName(range.startContainer, "li", !0);
            if (li) {
                var bk;
                if (!range.collapsed) {
                    me.fireEvent("saveScene"), bk = range.createBookmark();
                    for (var closeList, ci, i = 0, parents = domUtils.findParents(li); ci = parents[i++];) if (domUtils
                            .isTagNode(ci, "ol ul")) {
                            closeList = ci;
                            break
                        }
                    var current = li;
                    if (bk.end) for (; current && !(domUtils.getPosition(current, bk.end) & domUtils.POSITION_FOLLOWING);)
                            if (checkLevel(current)) current = domUtils.getNextDomNode(current, !1, null, function (
                                    node) {
                                    return node !== closeList
                                });
                            else {
                                var parentLi = current.parentNode,
                                    list = me.document.createElement(parentLi.tagName),
                                    index = utils.indexOf(listStyle[list.tagName], getStyle(parentLi) || domUtils.getComputedStyle(
                                        parentLi, "list-style-type")),
                                    currentIndex = index + 1 == listStyle[list.tagName].length ? 0 : index + 1,
                                    currentStyle = listStyle[list.tagName][currentIndex];
                                for (setListStyle(list, currentStyle), parentLi.insertBefore(list, current); current && !
                                    (domUtils.getPosition(current, bk.end) & domUtils.POSITION_FOLLOWING);) {
                                    if (li = current.nextSibling, list.appendChild(current), !li || domUtils.isTagNode(
                                        li, "ol ul")) {
                                        if (li) for (;
                                            (li = li.firstChild) && "LI" != li.tagName;);
                                        else li = domUtils.getNextDomNode(current, !1, null, function (node) {
                                                return node !== closeList
                                            });
                                        break
                                    }
                                    current = li
                                }
                                adjustList(list, list.tagName.toLowerCase(), currentStyle), current = li
                            }
                    return me.fireEvent("contentchange"), range.moveToBookmark(bk).select(), !0
                }
                if (checkLevel(li)) return !0;
                var parentLi = li.parentNode,
                    list = me.document.createElement(parentLi.tagName),
                    index = utils.indexOf(listStyle[list.tagName], getStyle(parentLi) || domUtils.getComputedStyle(
                        parentLi, "list-style-type"));
                index = index + 1 == listStyle[list.tagName].length ? 0 : index + 1;
                var currentStyle = listStyle[list.tagName][index];
                if (setListStyle(list, currentStyle), domUtils.isStartInblock(range)) return me.fireEvent("saveScene"),
                        bk = range.createBookmark(), parentLi.insertBefore(list, li), list.appendChild(li), adjustList(
                        list, list.tagName.toLowerCase(), currentStyle), me.fireEvent("contentchange"), range.moveToBookmark(
                        bk).select(!0), !0
            }
        }), me.commands.insertorderedlist = me.commands.insertunorderedlist = {
            execCommand: function (command, style) {
                style || (style = "insertorderedlist" == command.toLowerCase() ? "decimal" : "disc");
                var me = this,
                    range = this.selection.getRange(),
                    filterFn = function (node) {
                        return 1 == node.nodeType ? "br" != node.tagName.toLowerCase() : !domUtils.isWhitespace(node)
                    }, tag = "insertorderedlist" == command.toLowerCase() ? "ol" : "ul",
                    frag = me.document.createDocumentFragment();
                range.adjustmentBoundary().shrinkBoundary();
                var startParent, endParent, list, tmp, bko = range.createBookmark(!0),
                    start = getLi(me.document.getElementById(bko.start)),
                    modifyStart = 0,
                    end = getLi(me.document.getElementById(bko.end)),
                    modifyEnd = 0;
                if (start || end) {
                    if (start && (startParent = start.parentNode), bko.end || (end = start), end && (endParent = end.parentNode),
                        startParent === endParent) {
                        for (; start !== end;) {
                            if (tmp = start, start = start.nextSibling, !domUtils.isBlockElm(tmp.firstChild)) {
                                for (var p = me.document.createElement("p"); tmp.firstChild;) p.appendChild(tmp.firstChild);
                                tmp.appendChild(p)
                            }
                            frag.appendChild(tmp)
                        }
                        if (tmp = me.document.createElement("span"), startParent.insertBefore(tmp, end), !domUtils.isBlockElm(
                            end.firstChild)) {
                            for (p = me.document.createElement("p"); end.firstChild;) p.appendChild(end.firstChild);
                            end.appendChild(p)
                        }
                        frag.appendChild(end), domUtils.breakParent(tmp, startParent), domUtils.isEmptyNode(tmp.previousSibling) &&
                            domUtils.remove(tmp.previousSibling), domUtils.isEmptyNode(tmp.nextSibling) && domUtils.remove(
                            tmp.nextSibling);
                        var nodeStyle = getStyle(startParent) || domUtils.getComputedStyle(startParent,
                            "list-style-type") || ("insertorderedlist" == command.toLowerCase() ? "decimal" : "disc");
                        if (startParent.tagName.toLowerCase() == tag && nodeStyle == style) {
                            for (var ci, i = 0, tmpFrag = me.document.createDocumentFragment(); ci = frag.firstChild;)
                                if (domUtils.isTagNode(ci, "ol ul")) tmpFrag.appendChild(ci);
                                else for (; ci.firstChild;) tmpFrag.appendChild(ci.firstChild), domUtils.remove(ci);
                            tmp.parentNode.insertBefore(tmpFrag, tmp)
                        } else list = me.document.createElement(tag), setListStyle(list, style), list.appendChild(frag),
                                tmp.parentNode.insertBefore(list, tmp);
                        return domUtils.remove(tmp), list && adjustList(list, tag, style), void range.moveToBookmark(
                            bko).select()
                    }
                    if (start) {
                        for (; start;) {
                            if (tmp = start.nextSibling, domUtils.isTagNode(start, "ol ul")) frag.appendChild(start);
                            else {
                                for (var tmpfrag = me.document.createDocumentFragment(), hasBlock = 0; start.firstChild;)
                                    domUtils.isBlockElm(start.firstChild) && (hasBlock = 1), tmpfrag.appendChild(start.firstChild);
                                if (hasBlock) frag.appendChild(tmpfrag);
                                else {
                                    var tmpP = me.document.createElement("p");
                                    tmpP.appendChild(tmpfrag), frag.appendChild(tmpP)
                                }
                                domUtils.remove(start)
                            }
                            start = tmp
                        }
                        startParent.parentNode.insertBefore(frag, startParent.nextSibling), domUtils.isEmptyNode(
                            startParent) ? (range.setStartBefore(startParent), domUtils.remove(startParent)) : range.setStartAfter(
                            startParent), modifyStart = 1
                    }
                    if (end && domUtils.inDoc(endParent, me.document)) {
                        for (start = endParent.firstChild; start && start !== end;) {
                            if (tmp = start.nextSibling, domUtils.isTagNode(start, "ol ul")) frag.appendChild(start);
                            else {
                                for (tmpfrag = me.document.createDocumentFragment(), hasBlock = 0; start.firstChild;)
                                    domUtils.isBlockElm(start.firstChild) && (hasBlock = 1), tmpfrag.appendChild(start.firstChild);
                                hasBlock ? frag.appendChild(tmpfrag) : (tmpP = me.document.createElement("p"), tmpP.appendChild(
                                    tmpfrag), frag.appendChild(tmpP)), domUtils.remove(start)
                            }
                            start = tmp
                        }
                        var tmpDiv = domUtils.createElement(me.document, "div", {
                            tmpDiv: 1
                        });
                        domUtils.moveChild(end, tmpDiv), frag.appendChild(tmpDiv), domUtils.remove(end), endParent.parentNode
                            .insertBefore(frag, endParent), range.setEndBefore(endParent), domUtils.isEmptyNode(
                            endParent) && domUtils.remove(endParent), modifyEnd = 1
                    }
                }
                modifyStart || range.setStartBefore(me.document.getElementById(bko.start)), bko.end && !modifyEnd &&
                    range.setEndAfter(me.document.getElementById(bko.end)), range.enlarge(!0, function (node) {
                    return notExchange[node.tagName]
                }), frag = me.document.createDocumentFragment();
                for (var tmpNode, bk = range.createBookmark(), current = domUtils.getNextDomNode(bk.start, !1, filterFn),
                        tmpRange = range.cloneRange(), block = domUtils.isBlockElm; current && current !== bk.end &&
                    domUtils.getPosition(current, bk.end) & domUtils.POSITION_PRECEDING;) if (3 == current.nodeType ||
                        dtd.li[current.tagName]) {
                        if (1 == current.nodeType && dtd.$list[current.tagName]) {
                            for (; current.firstChild;) frag.appendChild(current.firstChild);
                            tmpNode = domUtils.getNextDomNode(current, !1, filterFn), domUtils.remove(current), current =
                                tmpNode;
                            continue
                        }
                        for (tmpNode = current, tmpRange.setStartBefore(current); current && current !== bk.end && (!
                            block(current) || domUtils.isBookmarkNode(current));) tmpNode = current, current = domUtils
                                .getNextDomNode(current, !1, null, function (node) {
                                return !notExchange[node.tagName]
                            });
                        current && block(current) && (tmp = domUtils.getNextDomNode(tmpNode, !1, filterFn), tmp &&
                            domUtils.isBookmarkNode(tmp) && (current = domUtils.getNextDomNode(tmp, !1, filterFn),
                            tmpNode = tmp)), tmpRange.setEndAfter(tmpNode), current = domUtils.getNextDomNode(tmpNode, !
                            1, filterFn);
                        var li = range.document.createElement("li");
                        if (li.appendChild(tmpRange.extractContents()), domUtils.isEmptyNode(li)) {
                            for (var tmpNode = range.document.createElement("p"); li.firstChild;) tmpNode.appendChild(
                                    li.firstChild);
                            li.appendChild(tmpNode)
                        }
                        frag.appendChild(li)
                    } else current = domUtils.getNextDomNode(current, !0, filterFn);
                range.moveToBookmark(bk).collapse(!0), list = me.document.createElement(tag), setListStyle(list, style),
                    list.appendChild(frag), range.insertNode(list), adjustList(list, tag, style);
                for (var ci, i = 0, tmpDivs = domUtils.getElementsByTagName(list, "div"); ci = tmpDivs[i++];) ci.getAttribute(
                        "tmpDiv") && domUtils.remove(ci, !0);
                range.moveToBookmark(bko).select()
            },
            queryCommandState: function (command) {
                for (var ci, tag = "insertorderedlist" == command.toLowerCase() ? "ol" : "ul", path = this.selection.getStartElementPath(),
                        i = 0; ci = path[i++];) {
                    if ("TABLE" == ci.nodeName) return 0;
                    if (tag == ci.nodeName.toLowerCase()) return 1
                }
                return 0
            },
            queryCommandValue: function (command) {
                for (var node, ci, tag = "insertorderedlist" == command.toLowerCase() ? "ol" : "ul", path = this.selection
                        .getStartElementPath(), i = 0; ci = path[i++];) {
                    if ("TABLE" == ci.nodeName) {
                        node = null;
                        break
                    }
                    if (tag == ci.nodeName.toLowerCase()) {
                        node = ci;
                        break
                    }
                }
                return node ? getStyle(node) || domUtils.getComputedStyle(node, "list-style-type") : null
            }
        }
    },
    function () {
        var sourceEditors = {
            textarea: function (editor, holder) {
                var textarea = holder.ownerDocument.createElement("textarea");
                return textarea.style.cssText =
                    "position:absolute;resize:none;width:100%;height:100%;border:0;padding:0;margin:0;overflow-y:auto;",
                    browser.ie && browser.version < 8 && (textarea.style.width = holder.offsetWidth + "px", textarea.style
                    .height = holder.offsetHeight + "px", holder.onresize = function () {
                    textarea.style.width = holder.offsetWidth + "px", textarea.style.height = holder.offsetHeight +
                        "px"
                }), holder.appendChild(textarea), {
                    setContent: function (content) {
                        textarea.value = content
                    },
                    getContent: function () {
                        return textarea.value
                    },
                    select: function () {
                        var range;
                        browser.ie ? (range = textarea.createTextRange(), range.collapse(!0), range.select()) : (
                            textarea.setSelectionRange(0, 0), textarea.focus())
                    },
                    dispose: function () {
                        holder.removeChild(textarea), holder.onresize = null, textarea = null, holder = null
                    }
                }
            },
            codemirror: function (editor, holder) {
                var codeEditor = window.CodeMirror(holder, {
                    mode: "text/html",
                    tabMode: "indent",
                    lineNumbers: !0,
                    lineWrapping: !0
                }),
                    dom = codeEditor.getWrapperElement();
                return dom.style.cssText =
                    'position:absolute;left:0;top:0;width:100%;height:100%;font-family:consolas,"Courier new",monospace;font-size:13px;',
                    codeEditor.getScrollerElement().style.cssText =
                    "position:absolute;left:0;top:0;width:100%;height:100%;", codeEditor.refresh(), {
                    getCodeMirror: function () {
                        return codeEditor
                    },
                    setContent: function (content) {
                        codeEditor.setValue(content)
                    },
                    getContent: function () {
                        return codeEditor.getValue()
                    },
                    select: function () {
                        codeEditor.focus()
                    },
                    dispose: function () {
                        holder.removeChild(dom), dom = null, codeEditor = null
                    }
                }
            }
        };
        UE.plugins.source = function () {
            function createSourceEditor(holder) {
                return sourceEditors["codemirror" == opt.sourceEditor && window.CodeMirror ? "codemirror" : "textarea"](
                    me, holder)
            }
            var sourceEditor, orgSetContent, me = this,
                opt = this.options,
                sourceMode = !1;
            opt.sourceEditor = browser.ie ? "textarea" : opt.sourceEditor || "codemirror", me.setOpt({
                sourceEditorFirst: !1
            });
            var bakCssText, oldGetContent, bakAddress;
            me.commands.source = {
                execCommand: function () {
                    if (sourceMode = !sourceMode) {
                        bakAddress = me.selection.getRange().createAddress(!1, !0), me.undoManger && me.undoManger.save(!
                            0), browser.gecko && (me.body.contentEditable = !1), bakCssText = me.iframe.style.cssText,
                            me.iframe.style.cssText += "position:absolute;left:-32768px;top:-32768px;", me.fireEvent(
                            "beforegetcontent");
                        var root = UE.htmlparser(me.body.innerHTML);
                        me.filterOutputRule(root), root.traversal(function (node) {
                            if ("element" == node.type) switch (node.tagName) {
                                case "td":
                                case "th":
                                case "caption":
                                    node.children && 1 == node.children.length && "br" == node.firstChild().tagName &&
                                        node.removeChild(node.firstChild());
                                    break;
                                case "pre":
                                    node.innerText(node.innerText().replace(/ /g, " "))
                            }
                        }), me.fireEvent("aftergetcontent");
                        var content = root.toHtml(!0);
                        sourceEditor = createSourceEditor(me.iframe.parentNode), sourceEditor.setContent(content),
                            orgSetContent = me.setContent, me.setContent = function (html) {
                            var root = UE.htmlparser(html);
                            me.filterInputRule(root), html = root.toHtml(), sourceEditor.setContent(html)
                        }, setTimeout(function () {
                            sourceEditor.select(), me.addListener("fullscreenchanged", function () {
                                try {
                                    sourceEditor.getCodeMirror().refresh()
                                } catch (e) {}
                            })
                        }), oldGetContent = me.getContent, me.getContent = function () {
                            return sourceEditor.getContent() || "<p>" + (browser.ie ? "" : "<br/>") + "</p>"
                        }
                    } else {
                        me.iframe.style.cssText = bakCssText;
                        var cont = sourceEditor.getContent() || "<p>" + (browser.ie ? "" : "<br/>") + "</p>";
                        cont = cont.replace(new RegExp("[\\r\\t\\n ]*</?(\\w+)\\s*(?:[^>]*)>", "g"), function (a, b) {
                            return b && !dtd.$inlineWithA[b.toLowerCase()] ? a.replace(/(^[\n\r\t ]*)|([\n\r\t ]*$)/g,
                                "") : a.replace(/(^[\n\r\t]*)|([\n\r\t]*$)/g, "")
                        }), me.setContent = orgSetContent, me.setContent(cont), sourceEditor.dispose(), sourceEditor =
                            null, me.getContent = oldGetContent;
                        var first = me.body.firstChild;
                        if (first || (me.body.innerHTML = "<p>" + (browser.ie ? "" : "<br/>") + "</p>", first = me.body
                            .firstChild), me.undoManger && me.undoManger.save(!0), browser.gecko) {
                            var input = document.createElement("input");
                            input.style.cssText = "position:absolute;left:0;top:-32768px", document.body.appendChild(
                                input), me.body.contentEditable = !1, setTimeout(function () {
                                domUtils.setViewportOffset(input, {
                                    left: -32768,
                                    top: 0
                                }), input.focus(), setTimeout(function () {
                                    me.body.contentEditable = !0, me.selection.getRange().moveToAddress(bakAddress).select(!
                                        0), domUtils.remove(input)
                                })
                            })
                        } else try {
                                me.selection.getRange().moveToAddress(bakAddress).select(!0)
                        } catch (e) {}
                    }
                    this.fireEvent("sourcemodechanged", sourceMode)
                },
                queryCommandState: function () {
                    return 0 | sourceMode
                },
                notNeedUndo: 1
            };
            var oldQueryCommandState = me.queryCommandState;
            me.queryCommandState = function (cmdName) {
                return cmdName = cmdName.toLowerCase(), sourceMode ? cmdName in {
                    source: 1,
                    fullscreen: 1
                } ? 1 : -1 : oldQueryCommandState.apply(this, arguments)
            }, "codemirror" == opt.sourceEditor && me.addListener("ready", function () {
                utils.loadFile(document, {
                    src: opt.codeMirrorJsUrl || opt.UEDITOR_HOME_URL + "third-party/codemirror/codemirror.js",
                    tag: "script",
                    type: "text/javascript",
                    defer: "defer"
                }, function () {
                    opt.sourceEditorFirst && setTimeout(function () {
                        me.execCommand("source")
                    }, 0)
                }), utils.loadFile(document, {
                    tag: "link",
                    rel: "stylesheet",
                    type: "text/css",
                    href: opt.codeMirrorCssUrl || opt.UEDITOR_HOME_URL + "third-party/codemirror/codemirror.css"
                })
            })
        }
    }(), UE.plugins.enterkey = function () {
        var hTag, me = this,
            tag = me.options.enterTag;
        me.addListener("keyup", function (type, evt) {
            var keyCode = evt.keyCode || evt.which;
            if (13 == keyCode) {
                var doSave, range = me.selection.getRange(),
                    start = range.startContainer;
                if (browser.ie) me.fireEvent("saveScene", !0, !0);
                else {
                    if (/h\d/i.test(hTag)) {
                        if (browser.gecko) {
                            var h = domUtils.findParentByTagName(start, ["h1", "h2", "h3", "h4", "h5", "h6",
                                    "blockquote", "caption", "table"], !0);
                            h || (me.document.execCommand("formatBlock", !1, "<p>"), doSave = 1)
                        } else if (1 == start.nodeType) {
                            var div, tmp = me.document.createTextNode("");
                            if (range.insertNode(tmp), div = domUtils.findParentByTagName(tmp, "div", !0)) {
                                for (var p = me.document.createElement("p"); div.firstChild;) p.appendChild(div.firstChild);
                                div.parentNode.insertBefore(p, div), domUtils.remove(div), range.setStartBefore(tmp).setCursor(),
                                    doSave = 1
                            }
                            domUtils.remove(tmp)
                        }
                        me.undoManger && doSave && me.undoManger.save()
                    }
                    browser.opera && range.select()
                }
            }
        }), me.addListener("keydown", function (type, evt) {
            var keyCode = evt.keyCode || evt.which;
            if (13 == keyCode) {
                if (me.fireEvent("beforeenterkeydown")) return void domUtils.preventDefault(evt);
                me.fireEvent("saveScene", !0, !0), hTag = "";
                var range = me.selection.getRange();
                if (!range.collapsed) {
                    var start = range.startContainer,
                        end = range.endContainer,
                        startTd = domUtils.findParentByTagName(start, "td", !0),
                        endTd = domUtils.findParentByTagName(end, "td", !0);
                    if (startTd && endTd && startTd !== endTd || !startTd && endTd || startTd && !endTd) return void(
                            evt.preventDefault ? evt.preventDefault() : evt.returnValue = !1)
                }
                if ("p" == tag) browser.ie || (start = domUtils.findParentByTagName(range.startContainer, ["ol", "ul",
                            "p", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "caption"], !0), start || browser.opera ?
                        (hTag = start.tagName, "p" == start.tagName.toLowerCase() && browser.gecko && domUtils.removeDirtyAttr(
                        start)) : (me.document.execCommand("formatBlock", !1, "<p>"), browser.gecko && (range = me.selection
                        .getRange(), start = domUtils.findParentByTagName(range.startContainer, "p", !0), start &&
                        domUtils.removeDirtyAttr(start))));
                else if (evt.preventDefault ? evt.preventDefault() : evt.returnValue = !1, range.collapsed) {
                    br = range.document.createElement("br"), range.insertNode(br);
                    var parent = br.parentNode;
                    parent.lastChild === br ? (br.parentNode.insertBefore(br.cloneNode(!0), br), range.setStartBefore(
                        br)) : range.setStartAfter(br), range.setCursor()
                } else if (range.deleteContents(), start = range.startContainer, 1 == start.nodeType && (start = start.childNodes[
                    range.startOffset])) {
                    for (; 1 == start.nodeType;) {
                        if (dtd.$empty[start.tagName]) return range.setStartBefore(start).setCursor(), me.undoManger &&
                                me.undoManger.save(), !1;
                        if (!start.firstChild) {
                            var br = range.document.createElement("br");
                            return start.appendChild(br), range.setStart(start, 0).setCursor(), me.undoManger && me.undoManger
                                .save(), !1
                        }
                        start = start.firstChild
                    }
                    start === range.startContainer.childNodes[range.startOffset] ? (br = range.document.createElement(
                        "br"), range.insertNode(br).setCursor()) : range.setStart(start, 0).setCursor()
                } else br = range.document.createElement("br"), range.insertNode(br).setStartAfter(br).setCursor()
            }
        })
    }, UE.plugins.keystrokes = function () {
        var me = this,
            collapsed = !0;
        me.addListener("keydown", function (type, evt) {
            var keyCode = evt.keyCode || evt.which,
                rng = me.selection.getRange();
            if (!rng.collapsed && !(evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey) && (keyCode >= 65 && 90 >=
                keyCode || keyCode >= 48 && 57 >= keyCode || keyCode >= 96 && 111 >= keyCode || {
                13: 1,
                8: 1,
                46: 1
            }[keyCode])) {
                var tmpNode = rng.startContainer;
                if (domUtils.isFillChar(tmpNode) && rng.setStartBefore(tmpNode), tmpNode = rng.endContainer, domUtils.isFillChar(
                    tmpNode) && rng.setEndAfter(tmpNode), rng.txtToElmBoundary(), rng.endContainer && 1 == rng.endContainer
                    .nodeType && (tmpNode = rng.endContainer.childNodes[rng.endOffset], tmpNode && domUtils.isBr(
                    tmpNode) && rng.setEndAfter(tmpNode)), 0 == rng.startOffset && (tmpNode = rng.startContainer,
                    domUtils.isBoundaryNode(tmpNode, "firstChild") && (tmpNode = rng.endContainer, rng.endOffset == (3 ==
                    tmpNode.nodeType ? tmpNode.nodeValue.length : tmpNode.childNodes.length) && domUtils.isBoundaryNode(
                    tmpNode, "lastChild")))) return me.fireEvent("saveScene"), me.body.innerHTML = "<p>" + (browser.ie ?
                        "" : "<br/>") + "</p>", rng.setStart(me.body.firstChild, 0).setCursor(!1, !0), void me._selectionChange()
            }
            if (keyCode == keymap.Backspace) {
                if (rng = me.selection.getRange(), collapsed = rng.collapsed, me.fireEvent("delkeydown", evt)) return;
                var start, end;
                if (rng.collapsed && rng.inFillChar() && (start = rng.startContainer, domUtils.isFillChar(start) ? (rng
                    .setStartBefore(start).shrinkBoundary(!0).collapse(!0), domUtils.remove(start)) : (start.nodeValue =
                    start.nodeValue.replace(new RegExp("^" + domUtils.fillChar), ""), rng.startOffset--, rng.collapse(!
                    0).select(!0))), start = rng.getClosedNode()) return me.fireEvent("saveScene"), rng.setStartBefore(
                        start), domUtils.remove(start), rng.setCursor(), me.fireEvent("saveScene"), void domUtils.preventDefault(
                        evt);
                if (!browser.ie && (start = domUtils.findParentByTagName(rng.startContainer, "table", !0), end =
                    domUtils.findParentByTagName(rng.endContainer, "table", !0), start && !end || !start && end ||
                    start !== end)) return void evt.preventDefault()
            }
            if (keyCode == keymap.Tab) {
                var excludeTagNameForTabKey = {
                    ol: 1,
                    ul: 1,
                    table: 1
                };
                if (me.fireEvent("tabkeydown", evt)) return void domUtils.preventDefault(evt);
                var range = me.selection.getRange();
                me.fireEvent("saveScene");
                for (var i = 0, txt = "", tabSize = me.options.tabSize || 4, tabNode = me.options.tabNode || " "; tabSize >
                    i; i++) txt += tabNode;
                var span = me.document.createElement("span");
                if (span.innerHTML = txt + domUtils.fillChar, range.collapsed) range.insertNode(span.cloneNode(!0).firstChild)
                        .setCursor(!0);
                else {
                    var filterFn = function (node) {
                        return domUtils.isBlockElm(node) && !excludeTagNameForTabKey[node.tagName.toLowerCase()]
                    };
                    if (start = domUtils.findParent(range.startContainer, filterFn, !0), end = domUtils.findParent(
                        range.endContainer, filterFn, !0), start && end && start === end) range.deleteContents(), range
                            .insertNode(span.cloneNode(!0).firstChild).setCursor(!0);
                    else {
                        var bookmark = range.createBookmark();
                        range.enlarge(!0);
                        for (var bookmark2 = range.createBookmark(), current = domUtils.getNextDomNode(bookmark2.start, !
                                1, filterFn); current && !(domUtils.getPosition(current, bookmark2.end) & domUtils.POSITION_FOLLOWING);)
                            current.insertBefore(span.cloneNode(!0).firstChild, current.firstChild), current = domUtils
                                .getNextDomNode(current, !1, filterFn);
                        range.moveToBookmark(bookmark2).moveToBookmark(bookmark).select()
                    }
                }
                domUtils.preventDefault(evt)
            }
            if (browser.gecko && 46 == keyCode && (range = me.selection.getRange(), range.collapsed && (start = range.startContainer,
                domUtils.isEmptyBlock(start)))) {
                for (var parent = start.parentNode; 1 == domUtils.getChildCount(parent) && !domUtils.isBody(parent);)
                    start = parent, parent = parent.parentNode;
                return void(start === parent.lastChild && evt.preventDefault())
            }
        }), me.addListener("keyup", function (type, evt) {
            var rng, keyCode = evt.keyCode || evt.which,
                me = this;
            if (keyCode == keymap.Backspace) {
                if (me.fireEvent("delkeyup")) return;
                if (rng = me.selection.getRange(), rng.collapsed) {
                    var tmpNode, autoClearTagName = ["h1", "h2", "h3", "h4", "h5", "h6"];
                    if ((tmpNode = domUtils.findParentByTagName(rng.startContainer, autoClearTagName, !0)) && domUtils.isEmptyBlock(
                        tmpNode)) {
                        var pre = tmpNode.previousSibling;
                        if (pre && "TABLE" != pre.nodeName) return domUtils.remove(tmpNode), void rng.setStartAtLast(
                                pre).setCursor(!1, !0);
                        var next = tmpNode.nextSibling;
                        if (next && "TABLE" != next.nodeName) return domUtils.remove(tmpNode), void rng.setStartAtFirst(
                                next).setCursor(!1, !0)
                    }
                    if (domUtils.isBody(rng.startContainer)) {
                        var tmpNode = domUtils.createElement(me.document, "p", {
                            innerHTML: browser.ie ? domUtils.fillChar : "<br/>"
                        });
                        rng.insertNode(tmpNode).setStart(tmpNode, 0).setCursor(!1, !0)
                    }
                }
                if (!collapsed && (3 == rng.startContainer.nodeType || 1 == rng.startContainer.nodeType && domUtils.isEmptyBlock(
                    rng.startContainer))) if (browser.ie) {
                        var span = rng.document.createElement("span");
                        rng.insertNode(span).setStartBefore(span).collapse(!0), rng.select(), domUtils.remove(span)
                    } else rng.select()
            }
        })
    }, UE.plugins.fiximgclick = function () {
        function Scale() {
            this.editor = null, this.resizer = null, this.cover = null, this.doc = document, this.prePos = {
                x: 0,
                y: 0
            }, this.startPos = {
                x: 0,
                y: 0
            }
        }
        var elementUpdated = !1;
        return function () {
            var rect = [[0, 0, -1, -1], [0, 0, 0, -1], [0, 0, 1, -1], [0, 0, -1, 0], [0, 0, 1, 0], [0, 0, -1, 1], [0, 0,
                        0, 1], [0, 0, 1, 1]];
            Scale.prototype = {
                init: function (editor) {
                    var me = this;
                    me.editor = editor, me.startPos = this.prePos = {
                        x: 0,
                        y: 0
                    }, me.dragId = -1;
                    var hands = [],
                        cover = me.cover = document.createElement("div"),
                        resizer = me.resizer = document.createElement("div");
                    for (cover.id = me.editor.ui.id + "_imagescale_cover", cover.style.cssText =
                        "position:absolute;display:none;z-index:" + me.editor.options.zIndex +
                        ";filter:alpha(opacity=0); opacity:0;background:#CCC;", domUtils.on(cover, "mousedown click", function () {
                        me.hide()
                    }), i = 0; i < 8; i++) hands.push('<span class="edui-editor-imagescale-hand' + i + '"></span>');
                    resizer.id = me.editor.ui.id + "_imagescale", resizer.className = "edui-editor-imagescale", resizer
                        .innerHTML = hands.join(""), resizer.style.cssText +=
                        ";display:none;border:1px solid #3b77ff;z-index:" + me.editor.options.zIndex + ";", me.editor.ui
                        .getDom().appendChild(cover), me.editor.ui.getDom().appendChild(resizer), me.initStyle(), me.initEvents()
                },
                initStyle: function () {
                    utils.cssRule("imagescale",
                        ".edui-editor-imagescale{display:none;position:absolute;border:1px solid #38B2CE;cursor:hand;-webkit-box-sizing: content-box;-moz-box-sizing: content-box;box-sizing: content-box;}.edui-editor-imagescale span{position:absolute;width:6px;height:6px;overflow:hidden;font-size:0px;display:block;background-color:#3C9DD0;}.edui-editor-imagescale .edui-editor-imagescale-hand0{cursor:nw-resize;top:0;margin-top:-4px;left:0;margin-left:-4px;}.edui-editor-imagescale .edui-editor-imagescale-hand1{cursor:n-resize;top:0;margin-top:-4px;left:50%;margin-left:-4px;}.edui-editor-imagescale .edui-editor-imagescale-hand2{cursor:ne-resize;top:0;margin-top:-4px;left:100%;margin-left:-3px;}.edui-editor-imagescale .edui-editor-imagescale-hand3{cursor:w-resize;top:50%;margin-top:-4px;left:0;margin-left:-4px;}.edui-editor-imagescale .edui-editor-imagescale-hand4{cursor:e-resize;top:50%;margin-top:-4px;left:100%;margin-left:-3px;}.edui-editor-imagescale .edui-editor-imagescale-hand5{cursor:sw-resize;top:100%;margin-top:-3px;left:0;margin-left:-4px;}.edui-editor-imagescale .edui-editor-imagescale-hand6{cursor:s-resize;top:100%;margin-top:-3px;left:50%;margin-left:-4px;}.edui-editor-imagescale .edui-editor-imagescale-hand7{cursor:se-resize;top:100%;margin-top:-3px;left:100%;margin-left:-3px;}")
                },
                initEvents: function () {
                    var me = this;
                    me.startPos.x = me.startPos.y = 0, me.isDraging = !1
                },
                _eventHandler: function (e) {
                    var me = this;
                    switch (e.type) {
                    case "mousedown":
                        var hand, hand = e.target || e.srcElement; - 1 != hand.className.indexOf(
                            "edui-editor-imagescale-hand") && -1 == me.dragId && (me.dragId = hand.className.slice(-1),
                            me.startPos.x = me.prePos.x = e.clientX, me.startPos.y = me.prePos.y = e.clientY, domUtils.on(
                            me.doc, "mousemove", me.proxy(me._eventHandler, me)));
                        break;
                    case "mousemove":
                        -1 != me.dragId && (me.updateContainerStyle(me.dragId, {
                            x: e.clientX - me.prePos.x,
                            y: e.clientY - me.prePos.y
                        }), me.prePos.x = e.clientX, me.prePos.y = e.clientY, elementUpdated = !0, me.updateTargetElement());
                        break;
                    case "mouseup":
                        -1 != me.dragId && (me.updateContainerStyle(me.dragId, {
                            x: e.clientX - me.prePos.x,
                            y: e.clientY - me.prePos.y
                        }), me.updateTargetElement(), me.target.parentNode && me.attachTo(me.target), me.dragId = -1),
                            domUtils.un(me.doc, "mousemove", me.proxy(me._eventHandler, me)), elementUpdated && (
                            elementUpdated = !1, me.editor.fireEvent("contentchange"))
                    }
                },
                updateTargetElement: function () {
                    var me = this;
                    domUtils.setStyles(me.target, {
                        width: me.resizer.style.width,
                        height: me.resizer.style.height
                    }), me.target.width = parseInt(me.resizer.style.width), me.target.height = parseInt(me.resizer.style
                        .height), me.attachTo(me.target)
                },
                updateContainerStyle: function (dir, offset) {
                    var tmp, me = this,
                        dom = me.resizer;
                    0 != rect[dir][0] && (tmp = parseInt(dom.style.left) + offset.x, dom.style.left = me._validScaledProp(
                        "left", tmp) + "px"), 0 != rect[dir][1] && (tmp = parseInt(dom.style.top) + offset.y, dom.style
                        .top = me._validScaledProp("top", tmp) + "px"), 0 != rect[dir][2] && (tmp = dom.clientWidth +
                        rect[dir][2] * offset.x, dom.style.width = me._validScaledProp("width", tmp) + "px"), 0 != rect[
                        dir][3] && (tmp = dom.clientHeight + rect[dir][3] * offset.y, dom.style.height = me._validScaledProp(
                        "height", tmp) + "px")
                },
                _validScaledProp: function (prop, value) {
                    var ele = this.resizer,
                        wrap = document;
                    switch (value = isNaN(value) ? 0 : value, prop) {
                    case "left":
                        return 0 > value ? 0 : value + ele.clientWidth > wrap.clientWidth ? wrap.clientWidth - ele.clientWidth :
                            value;
                    case "top":
                        return 0 > value ? 0 : value + ele.clientHeight > wrap.clientHeight ? wrap.clientHeight - ele.clientHeight :
                            value;
                    case "width":
                        return 0 >= value ? 1 : value + ele.offsetLeft > wrap.clientWidth ? wrap.clientWidth - ele.offsetLeft :
                            value;
                    case "height":
                        return 0 >= value ? 1 : value + ele.offsetTop > wrap.clientHeight ? wrap.clientHeight - ele.offsetTop :
                            value
                    }
                },
                hideCover: function () {
                    this.cover.style.display = "none"
                },
                showCover: function () {
                    var me = this,
                        editorPos = domUtils.getXY(me.editor.ui.getDom()),
                        iframePos = domUtils.getXY(me.editor.iframe);
                    domUtils.setStyles(me.cover, {
                        width: me.editor.iframe.offsetWidth + "px",
                        height: me.editor.iframe.offsetHeight + "px",
                        top: iframePos.y - editorPos.y + "px",
                        left: iframePos.x - editorPos.x + "px",
                        position: "absolute",
                        display: ""
                    })
                },
                show: function (targetObj) {
                    var me = this;
                    me.resizer.style.display = "block", targetObj && me.attachTo(targetObj), domUtils.on(this.resizer,
                        "mousedown", me.proxy(me._eventHandler, me)), domUtils.on(me.doc, "mouseup", me.proxy(me._eventHandler,
                        me)), me.showCover(), me.editor.fireEvent("afterscaleshow", me), me.editor.fireEvent(
                        "saveScene")
                },
                hide: function () {
                    var me = this;
                    me.hideCover(), me.resizer.style.display = "none", domUtils.un(me.resizer, "mousedown", me.proxy(me
                        ._eventHandler, me)), domUtils.un(me.doc, "mouseup", me.proxy(me._eventHandler, me)), me.editor
                        .fireEvent("afterscalehide", me)
                },
                proxy: function (fn, context) {
                    return function () {
                        return fn.apply(context || this, arguments)
                    }
                },
                attachTo: function (targetObj) {
                    var me = this,
                        target = me.target = targetObj,
                        resizer = this.resizer,
                        imgPos = domUtils.getXY(target),
                        iframePos = domUtils.getXY(me.editor.iframe),
                        editorPos = domUtils.getXY(resizer.parentNode);
                    domUtils.setStyles(resizer, {
                        width: target.width + "px",
                        height: target.height + "px",
                        left: iframePos.x + imgPos.x - me.editor.document.body.scrollLeft - editorPos.x - parseInt(
                            resizer.style.borderLeftWidth) + "px",
                        top: iframePos.y + imgPos.y - me.editor.document.body.scrollTop - editorPos.y - parseInt(
                            resizer.style.borderTopWidth) + "px"
                    })
                }
            }
        }(),
        function () {
            var imageScale, me = this;
            me.setOpt("imageScaleEnabled", !0), !browser.ie && me.options.imageScaleEnabled && me.addListener("click", function () {
                var range = me.selection.getRange(),
                    img = range.getClosedNode();
                if (img && "IMG" == img.tagName && "false" != me.body.contentEditable) {
                    if (-1 != img.className.indexOf("edui-faked-music") || img.getAttribute("anchorname") || domUtils.hasClass(
                        img, "loadingclass") || domUtils.hasClass(img, "loaderrorclass")) return;
                    if (!imageScale) {
                        imageScale = new Scale, imageScale.init(me), me.ui.getDom().appendChild(imageScale.resizer);
                        var timer, _keyDownHandler = function () {
                                imageScale.hide(), imageScale.target && me.selection.getRange().selectNode(imageScale.target)
                                    .select()
                            }, _mouseDownHandler = function (e) {
                                var ele = e.target || e.srcElement;
                                !ele || void 0 !== ele.className && -1 != ele.className.indexOf(
                                    "edui-editor-imagescale") || _keyDownHandler(e)
                            };
                        me.addListener("afterscaleshow", function () {
                            me.addListener("beforekeydown", _keyDownHandler), me.addListener("beforemousedown",
                                _mouseDownHandler), domUtils.on(document, "keydown", _keyDownHandler), domUtils.on(
                                document, "mousedown", _mouseDownHandler), me.selection.getNative().removeAllRanges()
                        }), me.addListener("afterscalehide", function () {
                            me.removeListener("beforekeydown", _keyDownHandler), me.removeListener("beforemousedown",
                                _mouseDownHandler), domUtils.un(document, "keydown", _keyDownHandler), domUtils.un(
                                document, "mousedown", _mouseDownHandler);
                            var target = imageScale.target;
                            target.parentNode && me.selection.getRange().selectNode(target).select()
                        }), domUtils.on(imageScale.resizer, "mousedown", function (e) {
                            me.selection.getNative().removeAllRanges();
                            var ele = e.target || e.srcElement;
                            ele && -1 == ele.className.indexOf("edui-editor-imagescale-hand") && (timer = setTimeout(function () {
                                imageScale.hide(), imageScale.target && me.selection.getRange().selectNode(ele).select()
                            }, 200))
                        }), domUtils.on(imageScale.resizer, "mouseup", function (e) {
                            var ele = e.target || e.srcElement;
                            ele && -1 == ele.className.indexOf("edui-editor-imagescale-hand") && clearTimeout(timer)
                        })
                    }
                    imageScale.show(img)
                } else imageScale && "none" != imageScale.resizer.style.display && imageScale.hide()
            }), browser.webkit && me.addListener("click", function (type, e) {
                if ("IMG" == e.target.tagName && "false" != me.body.contentEditable) {
                    var range = new dom.Range(me.document);
                    range.selectNode(e.target).select()
                }
            })
        }
    }(), UE.plugins.autoheight = function () {
        function adjustHeight() {
            var me = this;
            clearTimeout(timer), isFullscreen || (!me.queryCommandState || me.queryCommandState && 1 != me.queryCommandState(
                "source")) && (timer = setTimeout(function () {
                for (var node = me.body.lastChild; node && 1 != node.nodeType;) node = node.previousSibling;
                node && 1 == node.nodeType && (node.style.clear = "both", currentHeight = Math.max(domUtils.getXY(node)
                    .y + node.offsetHeight + 25, Math.max(options.minFrameHeight, options.initialFrameHeight)),
                    currentHeight != lastHeight && (currentHeight !== parseInt(me.iframe.parentNode.style.height) && (
                    me.iframe.parentNode.style.height = currentHeight + "px"), me.body.style.height = currentHeight +
                    "px", lastHeight = currentHeight), domUtils.removeStyle(node, "clear"))
            }, 50))
        }
        var me = this;
        if (me.autoHeightEnabled = me.options.autoHeightEnabled !== !1, me.autoHeightEnabled) {
            var bakOverflow, currentHeight, timer, isFullscreen, lastHeight = 0,
                options = me.options;
            me.addListener("fullscreenchanged", function (cmd, f) {
                isFullscreen = f
            }), me.addListener("destroy", function () {
                me.removeListener("contentchange afterinserthtml keyup mouseup", adjustHeight)
            }), me.enableAutoHeight = function () {
                var me = this;
                if (me.autoHeightEnabled) {
                    var doc = me.document;
                    me.autoHeightEnabled = !0, bakOverflow = doc.body.style.overflowY, doc.body.style.overflowY =
                        "hidden", me.addListener("contentchange afterinserthtml keyup mouseup", adjustHeight),
                        setTimeout(function () {
                        adjustHeight.call(me)
                    }, browser.gecko ? 100 : 0), me.fireEvent("autoheightchanged", me.autoHeightEnabled)
                }
            }, me.disableAutoHeight = function () {
                me.body.style.overflowY = bakOverflow || "", me.removeListener("contentchange", adjustHeight), me.removeListener(
                    "keyup", adjustHeight), me.removeListener("mouseup", adjustHeight), me.autoHeightEnabled = !1, me.fireEvent(
                    "autoheightchanged", me.autoHeightEnabled)
            }, me.on("setHeight", function () {
                me.disableAutoHeight()
            }), me.addListener("ready", function () {
                me.enableAutoHeight();
                var timer;
                domUtils.on(browser.ie ? me.body : me.document, browser.webkit ? "dragover" : "drop", function () {
                    clearTimeout(timer), timer = setTimeout(function () {
                        adjustHeight.call(me)
                    }, 100)
                });
                var lastScrollY;
                window.onscroll = function () {
                    null === lastScrollY ? lastScrollY = this.scrollY : 0 == this.scrollY && 0 != lastScrollY && (me.window
                        .scrollTo(0, 0), lastScrollY = null)
                }
            })
        }
    }, UE.plugins.autofloat = function () {
        function checkHasUI() {
            return UE.ui ? 1 : (alert(lang.autofloatMsg), 0)
        }
        function fixIE6FixedPos() {
            var docStyle = document.body.style;
            docStyle.backgroundImage = 'url("about:blank")', docStyle.backgroundAttachment = "fixed"
        }
        function setFloating() {
            var toobarBoxPos = domUtils.getXY(toolbarBox),
                origalFloat = domUtils.getComputedStyle(toolbarBox, "position"),
                origalLeft = domUtils.getComputedStyle(toolbarBox, "left");
            toolbarBox.style.width = toolbarBox.offsetWidth + "px", toolbarBox.style.zIndex = 1 * me.options.zIndex + 1,
                toolbarBox.parentNode.insertBefore(placeHolder, toolbarBox), LteIE6 || quirks && browser.ie ? (
                "absolute" != toolbarBox.style.position && (toolbarBox.style.position = "absolute"), toolbarBox.style.top =
                (document.body.scrollTop || document.documentElement.scrollTop) - orgTop + topOffset + "px") : (browser
                .ie7Compat && flag && (flag = !1, toolbarBox.style.left = domUtils.getXY(toolbarBox).x - document.documentElement
                .getBoundingClientRect().left + 2 + "px"), "fixed" != toolbarBox.style.position && (toolbarBox.style.position =
                "fixed", toolbarBox.style.top = topOffset + "px", ("absolute" == origalFloat || "relative" ==
                origalFloat) && parseFloat(origalLeft) && (toolbarBox.style.left = toobarBoxPos.x + "px")))
        }
        function unsetFloating() {
            flag = !0, placeHolder.parentNode && placeHolder.parentNode.removeChild(placeHolder), toolbarBox.style.cssText =
                bakCssText
        }
        function updateFloating() {
            var rect3 = getPosition(me.container),
                offset = me.options.toolbarTopOffset || 0;
            rect3.top < 0 && rect3.bottom - toolbarBox.offsetHeight > offset ? setFloating() : unsetFloating()
        }
        var me = this,
            lang = me.getLang();
        me.setOpt({
            topOffset: 0
        });
        var optsAutoFloatEnabled = me.options.autoFloatEnabled !== !1,
            topOffset = me.options.topOffset;
        if (optsAutoFloatEnabled) {
            var bakCssText, toolbarBox, orgTop, getPosition, uiUtils = UE.ui.uiUtils,
                LteIE6 = browser.ie && browser.version <= 6,
                quirks = browser.quirks,
                placeHolder = document.createElement("div"),
                flag = !0,
                defer_updateFloating = utils.defer(function () {
                    updateFloating()
                }, browser.ie ? 200 : 100, !0);
            me.addListener("destroy", function () {
                domUtils.un(window, ["scroll", "resize"], updateFloating), me.removeListener("keydown",
                    defer_updateFloating)
            }), me.addListener("ready", function () {
                if (checkHasUI(me)) {
                    if (!me.ui) return;
                    getPosition = uiUtils.getClientRect, toolbarBox = me.ui.getDom("toolbarbox"), orgTop = getPosition(
                        toolbarBox).top, bakCssText = toolbarBox.style.cssText, placeHolder.style.height = toolbarBox.offsetHeight +
                        "px", LteIE6 && fixIE6FixedPos(), domUtils.on(window, ["scroll", "resize"], updateFloating), me
                        .addListener("keydown", defer_updateFloating), me.addListener("beforefullscreenchange", function (
                        t, enabled) {
                        enabled && unsetFloating()
                    }), me.addListener("fullscreenchanged", function (t, enabled) {
                        enabled || updateFloating()
                    }), me.addListener("sourcemodechanged", function () {
                        setTimeout(function () {
                            updateFloating()
                        }, 0)
                    }), me.addListener("clearDoc", function () {
                        setTimeout(function () {
                            updateFloating()
                        }, 0)
                    })
                }
            })
        }
    }, UE.plugins.video = function () {
        function creatInsertStr(url, width, height, id, align, classname, type) {
            var str;
            switch (type) {
            case "image":
                str = "<img " + (id ? 'id="' + id + '"' : "") + ' width="' + width + '" height="' + height + '" _url="' +
                    url + '" class="' + classname.replace(/\bvideo-js\b/, "") + '" src="' + me.options.UEDITOR_HOME_URL +
                    'themes/default/images/spacer.gif" style="background:url(' + me.options.UEDITOR_HOME_URL +
                    "themes/default/images/videologo.gif) no-repeat center center; border:1px solid gray;" + (align ?
                    "float:" + align + ";" : "") + '" />';
                break;
            case "embed":
                str = '<embed type="application/x-shockwave-flash" class="' + classname +
                    '" pluginspage="http://www.macromedia.com/go/getflashplayer" src="' + utils.html(url) + '" width="' +
                    width + '" height="' + height + '"' + (align ? ' style="float:' + align + '"' : "") +
                    ' wmode="transparent" play="true" loop="false" menu="false" allowscriptaccess="never" allowfullscreen="true" >';
                break;
            case "video":
                var ext = url.substr(url.lastIndexOf(".") + 1);
                "ogv" == ext && (ext = "ogg"), str = "<video" + (id ? ' id="' + id + '"' : "") + ' class="' + classname +
                    ' video-js" ' + (align ? ' style="float:' + align + '"' : "") + ' controls preload="none" width="' +
                    width + '" height="' + height + '" src="' + url + '" data-setup="{}"><source src="' + url +
                    '" type="video/' + ext + '" /></video>'
            }
            return str
        }
        function switchImgAndVideo(root, img2video) {
            utils.each(root.getNodesByTagName(img2video ? "img" : "embed video"), function (node) {
                var className = node.getAttr("class");
                if (className && -1 != className.indexOf("edui-faked-video")) {
                    var html = creatInsertStr(node.getAttr(img2video ? "_url" : "src"), node.getAttr("width"), node.getAttr(
                        "height"), null, node.getStyle("float") || "", className, img2video ? "embed" : "image");
                    node.parentNode.replaceChild(UE.uNode.createElement(html), node)
                }
                if (className && -1 != className.indexOf("edui-upload-video")) {
                    var html = creatInsertStr(node.getAttr(img2video ? "_url" : "src"), node.getAttr("width"), node.getAttr(
                        "height"), null, node.getStyle("float") || "", className, img2video ? "video" : "image");
                    node.parentNode.replaceChild(UE.uNode.createElement(html), node)
                }
            })
        }
        var me = this;
        me.addOutputRule(function (root) {
            switchImgAndVideo(root, !0)
        }), me.addInputRule(function (root) {
            switchImgAndVideo(root)
        }), me.commands.insertvideo = {
            execCommand: function (cmd, videoObjs, type) {
                videoObjs = utils.isArray(videoObjs) ? videoObjs : [videoObjs];
                for (var cl, vi, html = [], id = "tmpVedio", i = 0, len = videoObjs.length; len > i; i++) vi =
                        videoObjs[i], cl = "upload" == type ? "edui-upload-video video-js vjs-default-skin" :
                        "edui-faked-video", html.push(creatInsertStr(vi.url, vi.width || 420, vi.height || 280, id + i,
                        null, cl, "image"));
                me.execCommand("inserthtml", html.join(""), !0);
                for (var rng = this.selection.getRange(), i = 0, len = videoObjs.length; len > i; i++) {
                    var img = this.document.getElementById("tmpVedio" + i);
                    domUtils.removeAttributes(img, "id"), rng.selectNode(img).select(), me.execCommand("imagefloat",
                        videoObjs[i].align)
                }
            },
            queryCommandState: function () {
                var img = me.selection.getRange().getClosedNode(),
                    flag = img && ("edui-faked-video" == img.className || -1 != img.className.indexOf(
                        "edui-upload-video"));
                return flag ? 1 : 0
            }
        }
    },
    function () {
        function showError() {}
        var UETable = UE.UETable = function (table) {
            this.table = table, this.indexTable = [], this.selectedTds = [], this.cellsRange = {}, this.update(table)
        };
        UETable.removeSelectedClass = function (cells) {
            utils.each(cells, function (cell) {
                domUtils.removeClasses(cell, "selectTdClass")
            })
        }, UETable.addSelectedClass = function (cells) {
            utils.each(cells, function (cell) {
                domUtils.addClass(cell, "selectTdClass")
            })
        }, UETable.isEmptyBlock = function (node) {
            var reg = new RegExp(domUtils.fillChar, "g");
            if (node[browser.ie ? "innerText" : "textContent"].replace(/^\s*$/, "").replace(reg, "").length > 0) return 0;
            for (var i in dtd.$isNotEmpty) if (dtd.$isNotEmpty.hasOwnProperty(i) && node.getElementsByTagName(i).length)
                    return 0;
            return 1
        }, UETable.getWidth = function (cell) {
            return cell ? parseInt(domUtils.getComputedStyle(cell, "width"), 10) : 0
        }, UETable.getTableCellAlignState = function (cells) {
            !utils.isArray(cells) && (cells = [cells]);
            var result = {}, status = ["align", "valign"],
                tempStatus = null,
                isSame = !0;
            return utils.each(cells, function (cellNode) {
                return utils.each(status, function (currentState) {
                    if (tempStatus = cellNode.getAttribute(currentState), !result[currentState] && tempStatus) result[
                            currentState] = tempStatus;
                    else if (!result[currentState] || tempStatus !== result[currentState]) return isSame = !1, !1
                }), isSame
            }), isSame ? result : null
        }, UETable.getTableItemsByRange = function (editor) {
            var start = editor.selection.getStart();
            start && start.id && 0 === start.id.indexOf("_baidu_bookmark_start_") && start.nextSibling && (start =
                start.nextSibling);
            var cell = start && domUtils.findParentByTagName(start, ["td", "th"], !0),
                tr = cell && cell.parentNode,
                caption = start && domUtils.findParentByTagName(start, "caption", !0),
                table = caption ? caption.parentNode : tr && tr.parentNode.parentNode;
            return {
                cell: cell,
                tr: tr,
                table: table,
                caption: caption
            }
        }, UETable.getUETableBySelected = function (editor) {
            var table = UETable.getTableItemsByRange(editor).table;
            return table && table.ueTable && table.ueTable.selectedTds.length ? table.ueTable : null
        }, UETable.getDefaultValue = function (editor, table) {
            var tableBorder, tdPadding, tdBorder, tmpValue, borderMap = {
                    thin: "0px",
                    medium: "1px",
                    thick: "2px"
                };
            if (table) return td = table.getElementsByTagName("td")[0], tmpValue = domUtils.getComputedStyle(table,
                    "border-left-width"), tableBorder = parseInt(borderMap[tmpValue] || tmpValue, 10), tmpValue =
                    domUtils.getComputedStyle(td, "padding-left"), tdPadding = parseInt(borderMap[tmpValue] || tmpValue,
                    10), tmpValue = domUtils.getComputedStyle(td, "border-left-width"), tdBorder = parseInt(borderMap[
                    tmpValue] || tmpValue, 10), {
                    tableBorder: tableBorder,
                    tdPadding: tdPadding,
                    tdBorder: tdBorder
            };
            table = editor.document.createElement("table"), table.insertRow(0).insertCell(0).innerHTML = "xxx", editor.body
                .appendChild(table);
            var td = table.getElementsByTagName("td")[0];
            return tmpValue = domUtils.getComputedStyle(table, "border-left-width"), tableBorder = parseInt(borderMap[
                tmpValue] || tmpValue, 10), tmpValue = domUtils.getComputedStyle(td, "padding-left"), tdPadding =
                parseInt(borderMap[tmpValue] || tmpValue, 10), tmpValue = domUtils.getComputedStyle(td,
                "border-left-width"), tdBorder = parseInt(borderMap[tmpValue] || tmpValue, 10), domUtils.remove(table), {
                tableBorder: tableBorder,
                tdPadding: tdPadding,
                tdBorder: tdBorder
            }
        }, UETable.getUETable = function (tdOrTable) {
            var tag = tdOrTable.tagName.toLowerCase();
            return tdOrTable = "td" == tag || "th" == tag || "caption" == tag ? domUtils.findParentByTagName(tdOrTable,
                "table", !0) : tdOrTable, tdOrTable.ueTable || (tdOrTable.ueTable = new UETable(tdOrTable)), tdOrTable.ueTable
        }, UETable.cloneCell = function (cell, ignoreMerge, keepPro) {
            if (!cell || utils.isString(cell)) return this.table.ownerDocument.createElement(cell || "td");
            var flag = domUtils.hasClass(cell, "selectTdClass");
            flag && domUtils.removeClasses(cell, "selectTdClass");
            var tmpCell = cell.cloneNode(!0);
            return ignoreMerge && (tmpCell.rowSpan = tmpCell.colSpan = 1), !keepPro && domUtils.removeAttributes(
                tmpCell, "width height"), !keepPro && domUtils.removeAttributes(tmpCell, "style"), tmpCell.style.borderLeftStyle =
                "", tmpCell.style.borderTopStyle = "", tmpCell.style.borderLeftColor = cell.style.borderRightColor,
                tmpCell.style.borderLeftWidth = cell.style.borderRightWidth, tmpCell.style.borderTopColor = cell.style.borderBottomColor,
                tmpCell.style.borderTopWidth = cell.style.borderBottomWidth, flag && domUtils.addClass(cell,
                "selectTdClass"), tmpCell
        }, UETable.prototype = {
            getMaxRows: function () {
                for (var row, rows = this.table.rows, maxLen = 1, i = 0; row = rows[i]; i++) {
                    for (var cj, currentMax = 1, j = 0; cj = row.cells[j++];) currentMax = Math.max(cj.rowSpan || 1,
                            currentMax);
                    maxLen = Math.max(currentMax + i, maxLen)
                }
                return maxLen
            },
            getMaxCols: function () {
                for (var row, rows = this.table.rows, maxLen = 0, cellRows = {}, i = 0; row = rows[i]; i++) {
                    for (var cj, cellsNum = 0, j = 0; cj = row.cells[j++];) if (cellsNum += cj.colSpan || 1, cj.rowSpan &&
                            cj.rowSpan > 1) for (var k = 1; k < cj.rowSpan; k++) cellRows["row_" + (i + k)] ? cellRows[
                                    "row_" + (i + k)]++ : cellRows["row_" + (i + k)] = cj.colSpan || 1;
                    cellsNum += cellRows["row_" + i] || 0, maxLen = Math.max(cellsNum, maxLen)
                }
                return maxLen
            },
            getCellColIndex: function () {},
            getHSideCell: function (cell, right) {
                try {
                    var previewRowIndex, previewColIndex, cellInfo = this.getCellInfo(cell),
                        len = this.selectedTds.length,
                        range = this.cellsRange;
                    return !right && (len ? !range.beginColIndex : !cellInfo.colIndex) || right && (len ? range.endColIndex ==
                        this.colsNum - 1 : cellInfo.colIndex == this.colsNum - 1) ? null : (previewRowIndex = len ?
                        range.beginRowIndex : cellInfo.rowIndex, previewColIndex = right ? len ? range.endColIndex + 1 :
                        cellInfo.colIndex + 1 : len ? range.beginColIndex - 1 : cellInfo.colIndex < 1 ? 0 : cellInfo.colIndex -
                        1, this.getCell(this.indexTable[previewRowIndex][previewColIndex].rowIndex, this.indexTable[
                        previewRowIndex][previewColIndex].cellIndex))
                } catch (e) {
                    showError(e)
                }
            },
            getTabNextCell: function (cell, preRowIndex) {
                var nextCell, cellInfo = this.getCellInfo(cell),
                    rowIndex = preRowIndex || cellInfo.rowIndex,
                    colIndex = cellInfo.colIndex + 1 + (cellInfo.colSpan - 1);
                try {
                    nextCell = this.getCell(this.indexTable[rowIndex][colIndex].rowIndex, this.indexTable[rowIndex][
                            colIndex].cellIndex)
                } catch (e) {
                    try {
                        rowIndex = 1 * rowIndex + 1, colIndex = 0, nextCell = this.getCell(this.indexTable[rowIndex][
                                colIndex].rowIndex, this.indexTable[rowIndex][colIndex].cellIndex)
                    } catch (e) {}
                }
                return nextCell
            },
            getVSideCell: function (cell, bottom, ignoreRange) {
                try {
                    var nextRowIndex, nextColIndex, cellInfo = this.getCellInfo(cell),
                        len = this.selectedTds.length && !ignoreRange,
                        range = this.cellsRange;
                    return !bottom && 0 == cellInfo.rowIndex || bottom && (len ? range.endRowIndex == this.rowsNum - 1 :
                        cellInfo.rowIndex + cellInfo.rowSpan > this.rowsNum - 1) ? null : (nextRowIndex = bottom ? len ?
                        range.endRowIndex + 1 : cellInfo.rowIndex + cellInfo.rowSpan : len ? range.beginRowIndex - 1 :
                        cellInfo.rowIndex - 1, nextColIndex = len ? range.beginColIndex : cellInfo.colIndex, this.getCell(
                        this.indexTable[nextRowIndex][nextColIndex].rowIndex, this.indexTable[nextRowIndex][
                            nextColIndex].cellIndex))
                } catch (e) {
                    showError(e)
                }
            },
            getSameEndPosCells: function (cell, xOrY) {
                try {
                    for (var flag = "x" === xOrY.toLowerCase(), end = domUtils.getXY(cell)[flag ? "x" : "y"] + cell[
                            "offset" + (flag ? "Width" : "Height")], rows = this.table.rows, cells = null, returns = [],
                            i = 0; i < this.rowsNum; i++) {
                        cells = rows[i].cells;
                        for (var tmpCell, j = 0; tmpCell = cells[j++];) {
                            var tmpEnd = domUtils.getXY(tmpCell)[flag ? "x" : "y"] + tmpCell["offset" + (flag ? "Width" :
                                "Height")];
                            if (tmpEnd > end && flag) break;
                            if ((cell == tmpCell || end == tmpEnd) && (1 == tmpCell[flag ? "colSpan" : "rowSpan"] &&
                                returns.push(tmpCell), flag)) break
                        }
                    }
                    return returns
                } catch (e) {
                    showError(e)
                }
            },
            setCellContent: function (cell, content) {
                cell.innerHTML = content || (browser.ie ? domUtils.fillChar : "<br />")
            },
            cloneCell: UETable.cloneCell,
            getSameStartPosXCells: function (cell) {
                try {
                    for (var cells, start = domUtils.getXY(cell).x + cell.offsetWidth, rows = this.table.rows, returns = [],
                            i = 0; i < this.rowsNum; i++) {
                        cells = rows[i].cells;
                        for (var tmpCell, j = 0; tmpCell = cells[j++];) {
                            var tmpStart = domUtils.getXY(tmpCell).x;
                            if (tmpStart > start) break;
                            if (tmpStart == start && 1 == tmpCell.colSpan) {
                                returns.push(tmpCell);
                                break
                            }
                        }
                    }
                    return returns
                } catch (e) {
                    showError(e)
                }
            },
            update: function (table) {
                this.table = table || this.table, this.selectedTds = [], this.cellsRange = {}, this.indexTable = [];
                for (var rows = this.table.rows, rowsNum = this.getMaxRows(), dNum = rowsNum - rows.length, colsNum =
                        this.getMaxCols(); dNum--;) this.table.insertRow(rows.length);
                this.rowsNum = rowsNum, this.colsNum = colsNum;
                for (var i = 0, len = rows.length; len > i; i++) this.indexTable[i] = new Array(colsNum);
                for (var row, rowIndex = 0; row = rows[rowIndex]; rowIndex++) for (var cell, cellIndex = 0, cells = row
                            .cells; cell = cells[cellIndex]; cellIndex++) {
                        cell.rowSpan > rowsNum && (cell.rowSpan = rowsNum);
                        for (var colIndex = cellIndex, rowSpan = cell.rowSpan || 1, colSpan = cell.colSpan || 1; this.indexTable[
                            rowIndex][colIndex];) colIndex++;
                        for (var j = 0; rowSpan > j; j++) for (var k = 0; colSpan > k; k++) this.indexTable[rowIndex +
                                    j][colIndex + k] = {
                                    rowIndex: rowIndex,
                                    cellIndex: cellIndex,
                                    colIndex: colIndex,
                                    rowSpan: rowSpan,
                                    colSpan: colSpan
                        }
                }
                for (j = 0; rowsNum > j; j++) for (k = 0; colsNum > k; k++) void 0 === this.indexTable[j][k] && (row =
                            rows[j], cell = row.cells[row.cells.length - 1], cell = cell ? cell.cloneNode(!0) : this.table
                            .ownerDocument.createElement("td"), this.setCellContent(cell), 1 !== cell.colSpan && (cell.colSpan =
                            1), 1 !== cell.rowSpan && (cell.rowSpan = 1), row.appendChild(cell), this.indexTable[j][k] = {
                            rowIndex: j,
                            cellIndex: cell.cellIndex,
                            colIndex: k,
                            rowSpan: 1,
                            colSpan: 1
                        });
                var tds = domUtils.getElementsByTagName(this.table, "td"),
                    selectTds = [];
                if (utils.each(tds, function (td) {
                    domUtils.hasClass(td, "selectTdClass") && selectTds.push(td)
                }), selectTds.length) {
                    var start = selectTds[0],
                        end = selectTds[selectTds.length - 1],
                        startInfo = this.getCellInfo(start),
                        endInfo = this.getCellInfo(end);
                    this.selectedTds = selectTds, this.cellsRange = {
                        beginRowIndex: startInfo.rowIndex,
                        beginColIndex: startInfo.colIndex,
                        endRowIndex: endInfo.rowIndex + endInfo.rowSpan - 1,
                        endColIndex: endInfo.colIndex + endInfo.colSpan - 1
                    }
                }
                if (!domUtils.hasClass(this.table.rows[0], "firstRow")) {
                    domUtils.addClass(this.table.rows[0], "firstRow");
                    for (var i = 1; i < this.table.rows.length; i++) domUtils.removeClasses(this.table.rows[i],
                            "firstRow")
                }
            },
            getCellInfo: function (cell) {
                if (cell) for (var cellIndex = cell.cellIndex, rowIndex = cell.parentNode.rowIndex, rowInfo = this.indexTable[
                            rowIndex], numCols = this.colsNum, colIndex = cellIndex; numCols > colIndex; colIndex++) {
                        var cellInfo = rowInfo[colIndex];
                        if (cellInfo.rowIndex === rowIndex && cellInfo.cellIndex === cellIndex) return cellInfo
                }
            },
            getCell: function (rowIndex, cellIndex) {
                return rowIndex < this.rowsNum && this.table.rows[rowIndex].cells[cellIndex] || null
            },
            deleteCell: function (cell, rowIndex) {
                rowIndex = "number" == typeof rowIndex ? rowIndex : cell.parentNode.rowIndex;
                var row = this.table.rows[rowIndex];
                row.deleteCell(cell.cellIndex)
            },
            getCellsRange: function (cellA, cellB) {
                function checkRange(beginRowIndex, beginColIndex, endRowIndex, endColIndex) {
                    var cellInfo, colIndex, rowIndex, tmpBeginRowIndex = beginRowIndex,
                        tmpBeginColIndex = beginColIndex,
                        tmpEndRowIndex = endRowIndex,
                        tmpEndColIndex = endColIndex;
                    if (beginRowIndex > 0) for (colIndex = beginColIndex; endColIndex > colIndex; colIndex++) cellInfo =
                                me.indexTable[beginRowIndex][colIndex], rowIndex = cellInfo.rowIndex, beginRowIndex >
                                rowIndex && (tmpBeginRowIndex = Math.min(rowIndex, tmpBeginRowIndex));
 
                    if (endColIndex < me.colsNum) for (rowIndex = beginRowIndex; endRowIndex > rowIndex; rowIndex++)
                            cellInfo = me.indexTable[rowIndex][endColIndex], colIndex = cellInfo.colIndex + cellInfo.colSpan -
                                1, colIndex > endColIndex && (tmpEndColIndex = Math.max(colIndex, tmpEndColIndex));
                    if (endRowIndex < me.rowsNum) for (colIndex = beginColIndex; endColIndex > colIndex; colIndex++)
                            cellInfo = me.indexTable[endRowIndex][colIndex], rowIndex = cellInfo.rowIndex + cellInfo.rowSpan -
                                1, rowIndex > endRowIndex && (tmpEndRowIndex = Math.max(rowIndex, tmpEndRowIndex));
                    if (beginColIndex > 0) for (rowIndex = beginRowIndex; endRowIndex > rowIndex; rowIndex++) cellInfo =
                                me.indexTable[rowIndex][beginColIndex], colIndex = cellInfo.colIndex, beginColIndex >
                                colIndex && (tmpBeginColIndex = Math.min(cellInfo.colIndex, tmpBeginColIndex));
                    return tmpBeginRowIndex != beginRowIndex || tmpBeginColIndex != beginColIndex || tmpEndRowIndex !=
                        endRowIndex || tmpEndColIndex != endColIndex ? checkRange(tmpBeginRowIndex, tmpBeginColIndex,
                        tmpEndRowIndex, tmpEndColIndex) : {
                        beginRowIndex: beginRowIndex,
                        beginColIndex: beginColIndex,
                        endRowIndex: endRowIndex,
                        endColIndex: endColIndex
                    }
                }
                try {
                    var me = this,
                        cellAInfo = me.getCellInfo(cellA);
                    if (cellA === cellB) return {
                            beginRowIndex: cellAInfo.rowIndex,
                            beginColIndex: cellAInfo.colIndex,
                            endRowIndex: cellAInfo.rowIndex + cellAInfo.rowSpan - 1,
                            endColIndex: cellAInfo.colIndex + cellAInfo.colSpan - 1
                    };
                    var cellBInfo = me.getCellInfo(cellB),
                        beginRowIndex = Math.min(cellAInfo.rowIndex, cellBInfo.rowIndex),
                        beginColIndex = Math.min(cellAInfo.colIndex, cellBInfo.colIndex),
                        endRowIndex = Math.max(cellAInfo.rowIndex + cellAInfo.rowSpan - 1, cellBInfo.rowIndex +
                            cellBInfo.rowSpan - 1),
                        endColIndex = Math.max(cellAInfo.colIndex + cellAInfo.colSpan - 1, cellBInfo.colIndex +
                            cellBInfo.colSpan - 1);
                    return checkRange(beginRowIndex, beginColIndex, endRowIndex, endColIndex)
                } catch (e) {}
            },
            getCells: function (range) {
                this.clearSelected();
                for (var cellInfo, rowIndex, colIndex, beginRowIndex = range.beginRowIndex, beginColIndex = range.beginColIndex,
                        endRowIndex = range.endRowIndex, endColIndex = range.endColIndex, tdHash = {}, returnTds = [],
                        i = beginRowIndex; endRowIndex >= i; i++) for (var j = beginColIndex; endColIndex >= j; j++) {
                        cellInfo = this.indexTable[i][j], rowIndex = cellInfo.rowIndex, colIndex = cellInfo.colIndex;
                        var key = rowIndex + "|" + colIndex;
                        if (!tdHash[key]) {
                            if (tdHash[key] = 1, i > rowIndex || j > colIndex || rowIndex + cellInfo.rowSpan - 1 >
                                endRowIndex || colIndex + cellInfo.colSpan - 1 > endColIndex) return null;
                            returnTds.push(this.getCell(rowIndex, cellInfo.cellIndex))
                        }
                }
                return returnTds
            },
            clearSelected: function () {
                UETable.removeSelectedClass(this.selectedTds), this.selectedTds = [], this.cellsRange = {}
            },
            setSelected: function (range) {
                var cells = this.getCells(range);
                UETable.addSelectedClass(cells), this.selectedTds = cells, this.cellsRange = range
            },
            isFullRow: function () {
                var range = this.cellsRange;
                return range.endColIndex - range.beginColIndex + 1 == this.colsNum
            },
            isFullCol: function () {
                var range = this.cellsRange,
                    table = this.table,
                    ths = table.getElementsByTagName("th"),
                    rows = range.endRowIndex - range.beginRowIndex + 1;
                return ths.length ? rows == this.rowsNum || rows == this.rowsNum - 1 : rows == this.rowsNum
            },
            getNextCell: function (cell, bottom, ignoreRange) {
                try {
                    var nextRowIndex, nextColIndex, cellInfo = this.getCellInfo(cell),
                        len = this.selectedTds.length && !ignoreRange,
                        range = this.cellsRange;
                    return !bottom && 0 == cellInfo.rowIndex || bottom && (len ? range.endRowIndex == this.rowsNum - 1 :
                        cellInfo.rowIndex + cellInfo.rowSpan > this.rowsNum - 1) ? null : (nextRowIndex = bottom ? len ?
                        range.endRowIndex + 1 : cellInfo.rowIndex + cellInfo.rowSpan : len ? range.beginRowIndex - 1 :
                        cellInfo.rowIndex - 1, nextColIndex = len ? range.beginColIndex : cellInfo.colIndex, this.getCell(
                        this.indexTable[nextRowIndex][nextColIndex].rowIndex, this.indexTable[nextRowIndex][
                            nextColIndex].cellIndex))
                } catch (e) {
                    showError(e)
                }
            },
            getPreviewCell: function (cell, top) {
                try {
                    var previewRowIndex, previewColIndex, cellInfo = this.getCellInfo(cell),
                        len = this.selectedTds.length,
                        range = this.cellsRange;
                    return !top && (len ? !range.beginColIndex : !cellInfo.colIndex) || top && (len ? range.endColIndex ==
                        this.colsNum - 1 : cellInfo.rowIndex > this.colsNum - 1) ? null : (previewRowIndex = top ? len ?
                        range.beginRowIndex : cellInfo.rowIndex < 1 ? 0 : cellInfo.rowIndex - 1 : len ? range.beginRowIndex :
                        cellInfo.rowIndex, previewColIndex = top ? len ? range.endColIndex + 1 : cellInfo.colIndex :
                        len ? range.beginColIndex - 1 : cellInfo.colIndex < 1 ? 0 : cellInfo.colIndex - 1, this.getCell(
                        this.indexTable[previewRowIndex][previewColIndex].rowIndex, this.indexTable[previewRowIndex][
                            previewColIndex].cellIndex))
                } catch (e) {
                    showError(e)
                }
            },
            moveContent: function (cellTo, cellFrom) {
                if (!UETable.isEmptyBlock(cellFrom)) {
                    if (UETable.isEmptyBlock(cellTo)) return void(cellTo.innerHTML = cellFrom.innerHTML);
                    var child = cellTo.lastChild;
                    for (3 != child.nodeType && dtd.$block[child.tagName] || cellTo.appendChild(cellTo.ownerDocument.createElement(
                        "br")); child = cellFrom.firstChild;) cellTo.appendChild(child)
                }
            },
            mergeRight: function (cell) {
                var cellInfo = this.getCellInfo(cell),
                    rightColIndex = cellInfo.colIndex + cellInfo.colSpan,
                    rightCellInfo = this.indexTable[cellInfo.rowIndex][rightColIndex],
                    rightCell = this.getCell(rightCellInfo.rowIndex, rightCellInfo.cellIndex);
                cell.colSpan = cellInfo.colSpan + rightCellInfo.colSpan, cell.removeAttribute("width"), this.moveContent(
                    cell, rightCell), this.deleteCell(rightCell, rightCellInfo.rowIndex), this.update()
            },
            mergeDown: function (cell) {
                var cellInfo = this.getCellInfo(cell),
                    downRowIndex = cellInfo.rowIndex + cellInfo.rowSpan,
                    downCellInfo = this.indexTable[downRowIndex][cellInfo.colIndex],
                    downCell = this.getCell(downCellInfo.rowIndex, downCellInfo.cellIndex);
                cell.rowSpan = cellInfo.rowSpan + downCellInfo.rowSpan, cell.removeAttribute("height"), this.moveContent(
                    cell, downCell), this.deleteCell(downCell, downCellInfo.rowIndex), this.update()
            },
            mergeRange: function () {
                var range = this.cellsRange,
                    leftTopCell = this.getCell(range.beginRowIndex, this.indexTable[range.beginRowIndex][range.beginColIndex]
                        .cellIndex);
                if ("TH" == leftTopCell.tagName && range.endRowIndex !== range.beginRowIndex) {
                    var index = this.indexTable,
                        info = this.getCellInfo(leftTopCell);
                    leftTopCell = this.getCell(1, index[1][info.colIndex].cellIndex), range = this.getCellsRange(
                        leftTopCell, this.getCell(index[this.rowsNum - 1][info.colIndex].rowIndex, index[this.rowsNum -
                        1][info.colIndex].cellIndex))
                }
                for (var ci, cells = this.getCells(range), i = 0; ci = cells[i++];) ci !== leftTopCell && (this.moveContent(
                        leftTopCell, ci), this.deleteCell(ci));
                if (leftTopCell.rowSpan = range.endRowIndex - range.beginRowIndex + 1, leftTopCell.rowSpan > 1 &&
                    leftTopCell.removeAttribute("height"), leftTopCell.colSpan = range.endColIndex - range.beginColIndex +
                    1, leftTopCell.colSpan > 1 && leftTopCell.removeAttribute("width"), leftTopCell.rowSpan == this.rowsNum &&
                    1 != leftTopCell.colSpan && (leftTopCell.colSpan = 1), leftTopCell.colSpan == this.colsNum && 1 !=
                    leftTopCell.rowSpan) {
                    var rowIndex = leftTopCell.parentNode.rowIndex;
                    if (this.table.deleteRow) for (var i = rowIndex + 1, curIndex = rowIndex + 1, len = leftTopCell.rowSpan; len >
                            i; i++) this.table.deleteRow(curIndex);
                    else for (var i = 0, len = leftTopCell.rowSpan - 1; len > i; i++) {
                            var row = this.table.rows[rowIndex + 1];
                            row.parentNode.removeChild(row)
                    }
                    leftTopCell.rowSpan = 1
                }
                this.update()
            },
            insertRow: function (rowIndex, sourceCell) {
                function replaceTdToTh(colIndex, cell, tableRow) {
                    if (0 == colIndex) {
                        var tr = tableRow.nextSibling || tableRow.previousSibling,
                            th = tr.cells[colIndex];
                        "TH" == th.tagName && (th = cell.ownerDocument.createElement("th"), th.appendChild(cell.firstChild),
                            tableRow.insertBefore(th, cell), domUtils.remove(cell))
                    } else if ("TH" == cell.tagName) {
                        var td = cell.ownerDocument.createElement("td");
                        td.appendChild(cell.firstChild), tableRow.insertBefore(td, cell), domUtils.remove(cell)
                    }
                }
                var cell, numCols = this.colsNum,
                    table = this.table,
                    row = table.insertRow(rowIndex),
                    isInsertTitle = "string" == typeof sourceCell && "TH" == sourceCell.toUpperCase();
                if (0 == rowIndex || rowIndex == this.rowsNum) for (var colIndex = 0; numCols > colIndex; colIndex++)
                        cell = this.cloneCell(sourceCell, !0), this.setCellContent(cell), cell.getAttribute("vAlign") &&
                            cell.setAttribute("vAlign", cell.getAttribute("vAlign")), row.appendChild(cell),
                            isInsertTitle || replaceTdToTh(colIndex, cell, row);
                else {
                    var infoRow = this.indexTable[rowIndex];
                    for (colIndex = 0; numCols > colIndex; colIndex++) {
                        var cellInfo = infoRow[colIndex];
                        cellInfo.rowIndex < rowIndex ? (cell = this.getCell(cellInfo.rowIndex, cellInfo.cellIndex),
                            cell.rowSpan = cellInfo.rowSpan + 1) : (cell = this.cloneCell(sourceCell, !0), this.setCellContent(
                            cell), row.appendChild(cell)), isInsertTitle || replaceTdToTh(colIndex, cell, row)
                    }
                }
                return this.update(), row
            },
            deleteRow: function (rowIndex) {
                for (var row = this.table.rows[rowIndex], infoRow = this.indexTable[rowIndex], colsNum = this.colsNum,
                        count = 0, colIndex = 0; colsNum > colIndex;) {
                    var cellInfo = infoRow[colIndex],
                        cell = this.getCell(cellInfo.rowIndex, cellInfo.cellIndex);
                    if (cell.rowSpan > 1 && cellInfo.rowIndex == rowIndex) {
                        var clone = cell.cloneNode(!0);
                        clone.rowSpan = cell.rowSpan - 1, clone.innerHTML = "", cell.rowSpan = 1;
                        var insertCellIndex, nextRowIndex = rowIndex + 1,
                            nextRow = this.table.rows[nextRowIndex],
                            preMerged = this.getPreviewMergedCellsNum(nextRowIndex, colIndex) - count;
                        colIndex > preMerged ? (insertCellIndex = colIndex - preMerged - 1, domUtils.insertAfter(
                            nextRow.cells[insertCellIndex], clone)) : nextRow.cells.length && nextRow.insertBefore(
                            clone, nextRow.cells[0]), count += 1
                    }
                    colIndex += cell.colSpan || 1
                }
                var deleteTds = [],
                    cacheMap = {};
                for (colIndex = 0; colsNum > colIndex; colIndex++) {
                    var tmpRowIndex = infoRow[colIndex].rowIndex,
                        tmpCellIndex = infoRow[colIndex].cellIndex,
                        key = tmpRowIndex + "_" + tmpCellIndex;
                    cacheMap[key] || (cacheMap[key] = 1, cell = this.getCell(tmpRowIndex, tmpCellIndex), deleteTds.push(
                        cell))
                }
                var mergeTds = [];
                utils.each(deleteTds, function (td) {
                    1 == td.rowSpan ? td.parentNode.removeChild(td) : mergeTds.push(td)
                }), utils.each(mergeTds, function (td) {
                    td.rowSpan--
                }), row.parentNode.removeChild(row), this.update()
            },
            insertCol: function (colIndex, sourceCell, defaultValue) {
                function replaceTdToTh(rowIndex, cell, tableRow) {
                    if (0 == rowIndex) {
                        var th = cell.nextSibling || cell.previousSibling;
                        "TH" == th.tagName && (th = cell.ownerDocument.createElement("th"), th.appendChild(cell.firstChild),
                            tableRow.insertBefore(th, cell), domUtils.remove(cell))
                    } else if ("TH" == cell.tagName) {
                        var td = cell.ownerDocument.createElement("td");
                        td.appendChild(cell.firstChild), tableRow.insertBefore(td, cell), domUtils.remove(cell)
                    }
                }
                var tableRow, cell, preCell, rowsNum = this.rowsNum,
                    rowIndex = 0,
                    backWidth = parseInt((this.table.offsetWidth - 20 * (this.colsNum + 1) - (this.colsNum + 1)) / (
                        this.colsNum + 1), 10),
                    isInsertTitleCol = "string" == typeof sourceCell && "TH" == sourceCell.toUpperCase();
                if (0 == colIndex || colIndex == this.colsNum) for (; rowsNum > rowIndex; rowIndex++) tableRow = this.table
                            .rows[rowIndex], preCell = tableRow.cells[0 == colIndex ? colIndex : tableRow.cells.length],
                            cell = this.cloneCell(sourceCell, !0), this.setCellContent(cell), cell.setAttribute(
                            "vAlign", cell.getAttribute("vAlign")), preCell && cell.setAttribute("width", preCell.getAttribute(
                            "width")), colIndex ? domUtils.insertAfter(tableRow.cells[tableRow.cells.length - 1], cell) :
                            tableRow.insertBefore(cell, tableRow.cells[0]), isInsertTitleCol || replaceTdToTh(rowIndex,
                            cell, tableRow);
                else for (; rowsNum > rowIndex; rowIndex++) {
                        var cellInfo = this.indexTable[rowIndex][colIndex];
                        cellInfo.colIndex < colIndex ? (cell = this.getCell(cellInfo.rowIndex, cellInfo.cellIndex),
                            cell.colSpan = cellInfo.colSpan + 1) : (tableRow = this.table.rows[rowIndex], preCell =
                            tableRow.cells[cellInfo.cellIndex], cell = this.cloneCell(sourceCell, !0), this.setCellContent(
                            cell), cell.setAttribute("vAlign", cell.getAttribute("vAlign")), preCell && cell.setAttribute(
                            "width", preCell.getAttribute("width")), preCell ? tableRow.insertBefore(cell, preCell) :
                            tableRow.appendChild(cell)), isInsertTitleCol || replaceTdToTh(rowIndex, cell, tableRow)
                }
                this.update(), this.updateWidth(backWidth, defaultValue || {
                    tdPadding: 10,
                    tdBorder: 1
                })
            },
            updateWidth: function (width, defaultValue) {
                var table = this.table,
                    tmpWidth = UETable.getWidth(table) - 2 * defaultValue.tdPadding - defaultValue.tdBorder + width;
                if (tmpWidth < table.ownerDocument.body.offsetWidth) return void table.setAttribute("width", tmpWidth);
                var tds = domUtils.getElementsByTagName(this.table, "td th");
                utils.each(tds, function (td) {
                    td.setAttribute("width", width)
                })
            },
            deleteCol: function (colIndex) {
                for (var indexTable = this.indexTable, tableRows = this.table.rows, backTableWidth = this.table.getAttribute(
                        "width"), backTdWidth = 0, rowsNum = this.rowsNum, cacheMap = {}, rowIndex = 0; rowsNum >
                    rowIndex;) {
                    var infoRow = indexTable[rowIndex],
                        cellInfo = infoRow[colIndex],
                        key = cellInfo.rowIndex + "_" + cellInfo.colIndex;
                    if (!cacheMap[key]) {
                        cacheMap[key] = 1;
                        var cell = this.getCell(cellInfo.rowIndex, cellInfo.cellIndex);
                        backTdWidth || (backTdWidth = cell && parseInt(cell.offsetWidth / cell.colSpan, 10).toFixed(0)),
                            cell.colSpan > 1 ? cell.colSpan-- : tableRows[rowIndex].deleteCell(cellInfo.cellIndex),
                            rowIndex += cellInfo.rowSpan || 1
                    }
                }
                this.table.setAttribute("width", backTableWidth - backTdWidth), this.update()
            },
            splitToCells: function (cell) {
                var me = this,
                    cells = this.splitToRows(cell);
                utils.each(cells, function (cell) {
                    me.splitToCols(cell)
                })
            },
            splitToRows: function (cell) {
                var cellInfo = this.getCellInfo(cell),
                    rowIndex = cellInfo.rowIndex,
                    colIndex = cellInfo.colIndex,
                    results = [];
                cell.rowSpan = 1, results.push(cell);
                for (var i = rowIndex, endRow = rowIndex + cellInfo.rowSpan; endRow > i; i++) if (i != rowIndex) {
                        var tableRow = this.table.rows[i],
                            tmpCell = tableRow.insertCell(colIndex - this.getPreviewMergedCellsNum(i, colIndex));
                        tmpCell.colSpan = cellInfo.colSpan, this.setCellContent(tmpCell), tmpCell.setAttribute("vAlign",
                            cell.getAttribute("vAlign")), tmpCell.setAttribute("align", cell.getAttribute("align")),
                            cell.style.cssText && (tmpCell.style.cssText = cell.style.cssText), results.push(tmpCell)
                    }
                return this.update(), results
            },
            getPreviewMergedCellsNum: function (rowIndex, colIndex) {
                for (var indexRow = this.indexTable[rowIndex], num = 0, i = 0; colIndex > i;) {
                    var colSpan = indexRow[i].colSpan,
                        tmpRowIndex = indexRow[i].rowIndex;
                    num += colSpan - (tmpRowIndex == rowIndex ? 1 : 0), i += colSpan
                }
                return num
            },
            splitToCols: function (cell) {
                var backWidth = (cell.offsetWidth / cell.colSpan - 22).toFixed(0),
                    cellInfo = this.getCellInfo(cell),
                    rowIndex = cellInfo.rowIndex,
                    colIndex = cellInfo.colIndex,
                    results = [];
                cell.colSpan = 1, cell.setAttribute("width", backWidth), results.push(cell);
                for (var j = colIndex, endCol = colIndex + cellInfo.colSpan; endCol > j; j++) if (j != colIndex) {
                        var tableRow = this.table.rows[rowIndex],
                            tmpCell = tableRow.insertCell(this.indexTable[rowIndex][j].cellIndex + 1);
                        if (tmpCell.rowSpan = cellInfo.rowSpan, this.setCellContent(tmpCell), tmpCell.setAttribute(
                            "vAlign", cell.getAttribute("vAlign")), tmpCell.setAttribute("align", cell.getAttribute(
                            "align")), tmpCell.setAttribute("width", backWidth), cell.style.cssText && (tmpCell.style.cssText =
                            cell.style.cssText), "TH" == cell.tagName) {
                            var th = cell.ownerDocument.createElement("th");
                            th.appendChild(tmpCell.firstChild), th.setAttribute("vAlign", cell.getAttribute("vAlign")),
                                th.rowSpan = tmpCell.rowSpan, tableRow.insertBefore(th, tmpCell), domUtils.remove(
                                tmpCell)
                        }
                        results.push(tmpCell)
                    }
                return this.update(), results
            },
            isLastCell: function (cell, rowsNum, colsNum) {
                rowsNum = rowsNum || this.rowsNum, colsNum = colsNum || this.colsNum;
                var cellInfo = this.getCellInfo(cell);
                return cellInfo.rowIndex + cellInfo.rowSpan == rowsNum && cellInfo.colIndex + cellInfo.colSpan ==
                    colsNum
            },
            getLastCell: function (cells) {
                cells = cells || this.table.getElementsByTagName("td");
                var rows, me = (this.getCellInfo(cells[0]), this),
                    last = cells[0],
                    tr = last.parentNode,
                    cellsNum = 0,
                    cols = 0;
                return utils.each(cells, function (cell) {
                    cell.parentNode == tr && (cols += cell.colSpan || 1), cellsNum += cell.rowSpan * cell.colSpan || 1
                }), rows = cellsNum / cols, utils.each(cells, function (cell) {
                    return me.isLastCell(cell, rows, cols) ? (last = cell, !1) : void 0
                }), last
            },
            selectRow: function (rowIndex) {
                var indexRow = this.indexTable[rowIndex],
                    start = this.getCell(indexRow[0].rowIndex, indexRow[0].cellIndex),
                    end = this.getCell(indexRow[this.colsNum - 1].rowIndex, indexRow[this.colsNum - 1].cellIndex),
                    range = this.getCellsRange(start, end);
                this.setSelected(range)
            },
            selectTable: function () {
                var tds = this.table.getElementsByTagName("td"),
                    range = this.getCellsRange(tds[0], tds[tds.length - 1]);
                this.setSelected(range)
            },
            setBackground: function (cells, value) {
                if ("string" == typeof value) utils.each(cells, function (cell) {
                        cell.style.backgroundColor = value
                    });
                else if ("object" == typeof value) {
                    value = utils.extend({
                        repeat: !0,
                        colorList: ["#ddd", "#fff"]
                    }, value);
                    for (var cell, rowIndex = this.getCellInfo(cells[0]).rowIndex, count = 0, colors = value.colorList,
                            getColor = function (list, index, repeat) {
                            return list[index] ? list[index] : repeat ? list[index % list.length] : ""
                        }, i = 0; cell = cells[i++];) {
                        var cellInfo = this.getCellInfo(cell);
                        cell.style.backgroundColor = getColor(colors, rowIndex + count == cellInfo.rowIndex ? count : ++
                            count, value.repeat)
                    }
                }
            },
            removeBackground: function (cells) {
                utils.each(cells, function (cell) {
                    cell.style.backgroundColor = ""
                })
            }
        }
    }(),
    function () {
        function resetTdWidth(table, editor) {
            var tds = domUtils.getElementsByTagName(table, "td th");
            utils.each(tds, function (td) {
                td.removeAttribute("width")
            }), table.setAttribute("width", getTableWidth(editor, !0, getDefaultValue(editor, table)));
            var tdsWidths = [];
            setTimeout(function () {
                utils.each(tds, function (td) {
                    1 == td.colSpan && tdsWidths.push(td.offsetWidth)
                }), utils.each(tds, function (td, i) {
                    1 == td.colSpan && td.setAttribute("width", tdsWidths[i] + "")
                })
            }, 0)
        }
        function getTableWidth(editor, needIEHack, defaultValue) {
            var body = editor.body;
            return body.offsetWidth - (needIEHack ? 2 * parseInt(domUtils.getComputedStyle(body, "margin-left"), 10) :
                0) - 2 * defaultValue.tableBorder - (editor.options.offsetWidth || 0)
        }
        function getSelectedArr(editor) {
            var cell = getTableItemsByRange(editor).cell;
            if (cell) {
                var ut = getUETable(cell);
                return ut.selectedTds.length ? ut.selectedTds : [cell]
            }
            return []
        }
        var UT = UE.UETable,
            getTableItemsByRange = function (editor) {
                return UT.getTableItemsByRange(editor)
            }, getUETableBySelected = function (editor) {
                return UT.getUETableBySelected(editor)
            }, getDefaultValue = function (editor, table) {
                return UT.getDefaultValue(editor, table)
            }, getUETable = function (tdOrTable) {
                return UT.getUETable(tdOrTable)
            };
        UE.commands.inserttable = {
            queryCommandState: function () {
                return getTableItemsByRange(this).table ? -1 : 0
            },
            execCommand: function (cmd, opt) {
                function createTable(opt, tdWidth) {
                    for (var html = [], rowsNum = opt.numRows, colsNum = opt.numCols, r = 0; rowsNum > r; r++) {
                        html.push("<tr" + (0 == r ? ' class="firstRow"' : "") + ">");
                        for (var c = 0; colsNum > c; c++) html.push('<td width="' + tdWidth + '"  vAlign="' + opt.tdvalign +
                                '" >' + (browser.ie && browser.version < 11 ? domUtils.fillChar : "<br/>") + "</td>");
                        html.push("</tr>")
                    }
                    return "<table><tbody>" + html.join("") + "</tbody></table>"
                }
                opt || (opt = utils.extend({}, {
                    numCols: this.options.defaultCols,
                    numRows: this.options.defaultRows,
                    tdvalign: this.options.tdvalign
                }));
                var me = this,
                    range = this.selection.getRange(),
                    start = range.startContainer,
                    firstParentBlock = domUtils.findParent(start, function (node) {
                        return domUtils.isBlockElm(node)
                    }, !0) || me.body,
                    defaultValue = getDefaultValue(me),
                    tableWidth = firstParentBlock.offsetWidth,
                    tdWidth = Math.floor(tableWidth / opt.numCols - 2 * defaultValue.tdPadding - defaultValue.tdBorder);
                !opt.tdvalign && (opt.tdvalign = me.options.tdvalign), me.execCommand("inserthtml", createTable(opt,
                    tdWidth))
            }
        }, UE.commands.insertparagraphbeforetable = {
            queryCommandState: function () {
                return getTableItemsByRange(this).cell ? 0 : -1
            },
            execCommand: function () {
                var table = getTableItemsByRange(this).table;
                if (table) {
                    var p = this.document.createElement("p");
                    p.innerHTML = browser.ie ? " " : "<br />", table.parentNode.insertBefore(p, table), this.selection
                        .getRange().setStart(p, 0).setCursor()
                }
            }
        }, UE.commands.create_vote = {
            execCommand: function () {
                create_vote()
            },
            notNeedUndo: 1
        }, UE.commands.upload_video = {
            execCommand: function () {
                upload_video()
            },
            notNeedUndo: 1
        }, UE.commands.groupimages = {
            execCommand: function () {
                create_groupimages()
            },
            notNeedUndo: 1
        }, UE.commands.create_rank = {
            execCommand: function () {
                create_rank()
            },
            notNeedUndo: 1
        }, UE.commands.deletetable = {
            queryCommandState: function () {
                var rng = this.selection.getRange();
                return domUtils.findParentByTagName(rng.startContainer, "table", !0) ? 0 : -1
            },
            execCommand: function (cmd, table) {
                var rng = this.selection.getRange();
                if (table = table || domUtils.findParentByTagName(rng.startContainer, "table", !0)) {
                    var next = table.nextSibling;
                    next || (next = domUtils.createElement(this.document, "p", {
                        innerHTML: browser.ie ? domUtils.fillChar : "<br/>"
                    }), table.parentNode.insertBefore(next, table)), domUtils.remove(table), rng = this.selection.getRange(),
                        3 == next.nodeType ? rng.setStartBefore(next) : rng.setStart(next, 0), rng.setCursor(!1, !0),
                        this.fireEvent("tablehasdeleted")
                }
            }
        }, UE.commands.cellalign = {
            queryCommandState: function () {
                return getSelectedArr(this).length ? 0 : -1
            },
            execCommand: function (cmd, align) {
                var selectedTds = getSelectedArr(this);
                if (selectedTds.length) for (var ci, i = 0; ci = selectedTds[i++];) ci.setAttribute("align", align)
            }
        }, UE.commands.cellvalign = {
            queryCommandState: function () {
                return getSelectedArr(this).length ? 0 : -1
            },
            execCommand: function (cmd, valign) {
                var selectedTds = getSelectedArr(this);
                if (selectedTds.length) for (var ci, i = 0; ci = selectedTds[i++];) ci.setAttribute("vAlign", valign)
            }
        }, UE.commands.insertcaption = {
            queryCommandState: function () {
                var table = getTableItemsByRange(this).table;
                return table && 0 == table.getElementsByTagName("caption").length ? 1 : -1
            },
            execCommand: function () {
                var table = getTableItemsByRange(this).table;
                if (table) {
                    var caption = this.document.createElement("caption");
                    caption.innerHTML = browser.ie ? domUtils.fillChar : "<br/>", table.insertBefore(caption, table.firstChild);
                    var range = this.selection.getRange();
                    range.setStart(caption, 0).setCursor()
                }
            }
        }, UE.commands.deletecaption = {
            queryCommandState: function () {
                var rng = this.selection.getRange(),
                    table = domUtils.findParentByTagName(rng.startContainer, "table");
                return table ? 0 == table.getElementsByTagName("caption").length ? -1 : 1 : -1
            },
            execCommand: function () {
                var rng = this.selection.getRange(),
                    table = domUtils.findParentByTagName(rng.startContainer, "table");
                if (table) {
                    domUtils.remove(table.getElementsByTagName("caption")[0]);
                    var range = this.selection.getRange();
                    range.setStart(table.rows[0].cells[0], 0).setCursor()
                }
            }
        }, UE.commands.inserttitle = {
            queryCommandState: function () {
                var table = getTableItemsByRange(this).table;
                if (table) {
                    var firstRow = table.rows[0];
                    return "th" != firstRow.cells[firstRow.cells.length - 1].tagName.toLowerCase() ? 0 : -1
                }
                return -1
            },
            execCommand: function () {
                var table = getTableItemsByRange(this).table;
                table && getUETable(table).insertRow(0, "th");
                var th = table.getElementsByTagName("th")[0];
                this.selection.getRange().setStart(th, 0).setCursor(!1, !0)
            }
        }, UE.commands.deletetitle = {
            queryCommandState: function () {
                var table = getTableItemsByRange(this).table;
                if (table) {
                    var firstRow = table.rows[0];
                    return "th" == firstRow.cells[firstRow.cells.length - 1].tagName.toLowerCase() ? 0 : -1
                }
                return -1
            },
            execCommand: function () {
                var table = getTableItemsByRange(this).table;
                table && domUtils.remove(table.rows[0]);
                var td = table.getElementsByTagName("td")[0];
                this.selection.getRange().setStart(td, 0).setCursor(!1, !0)
            }
        }, UE.commands.inserttitlecol = {
            queryCommandState: function () {
                var table = getTableItemsByRange(this).table;
                if (table) {
                    var lastRow = table.rows[table.rows.length - 1];
                    return lastRow.getElementsByTagName("th").length ? -1 : 0
                }
                return -1
            },
            execCommand: function () {
                var table = getTableItemsByRange(this).table;
                table && getUETable(table).insertCol(0, "th"), resetTdWidth(table, this);
                var th = table.getElementsByTagName("th")[0];
                this.selection.getRange().setStart(th, 0).setCursor(!1, !0)
            }
        }, UE.commands.deletetitlecol = {
            queryCommandState: function () {
                var table = getTableItemsByRange(this).table;
                if (table) {
                    var lastRow = table.rows[table.rows.length - 1];
                    return lastRow.getElementsByTagName("th").length ? 0 : -1
                }
                return -1
            },
            execCommand: function () {
                var table = getTableItemsByRange(this).table;
                if (table) for (var i = 0; i < table.rows.length; i++) domUtils.remove(table.rows[i].children[0]);
                resetTdWidth(table, this);
                var td = table.getElementsByTagName("td")[0];
                this.selection.getRange().setStart(td, 0).setCursor(!1, !0)
            }
        }, UE.commands.mergeright = {
            queryCommandState: function () {
                var tableItems = getTableItemsByRange(this),
                    table = tableItems.table,
                    cell = tableItems.cell;
                if (!table || !cell) return -1;
                var ut = getUETable(table);
                if (ut.selectedTds.length) return -1;
                var cellInfo = ut.getCellInfo(cell),
                    rightColIndex = cellInfo.colIndex + cellInfo.colSpan;
                if (rightColIndex >= ut.colsNum) return -1;
                var rightCellInfo = ut.indexTable[cellInfo.rowIndex][rightColIndex],
                    rightCell = table.rows[rightCellInfo.rowIndex].cells[rightCellInfo.cellIndex];
                return rightCell && cell.tagName == rightCell.tagName && rightCellInfo.rowIndex == cellInfo.rowIndex &&
                    rightCellInfo.rowSpan == cellInfo.rowSpan ? 0 : -1
            },
            execCommand: function () {
                var rng = this.selection.getRange(),
                    bk = rng.createBookmark(!0),
                    cell = getTableItemsByRange(this).cell,
                    ut = getUETable(cell);
                ut.mergeRight(cell), rng.moveToBookmark(bk).select()
            }
        }, UE.commands.mergedown = {
            queryCommandState: function () {
                var tableItems = getTableItemsByRange(this),
                    table = tableItems.table,
                    cell = tableItems.cell;
                if (!table || !cell) return -1;
                var ut = getUETable(table);
                if (ut.selectedTds.length) return -1;
                var cellInfo = ut.getCellInfo(cell),
                    downRowIndex = cellInfo.rowIndex + cellInfo.rowSpan;
                if (downRowIndex >= ut.rowsNum) return -1;
                var downCellInfo = ut.indexTable[downRowIndex][cellInfo.colIndex],
                    downCell = table.rows[downCellInfo.rowIndex].cells[downCellInfo.cellIndex];
                return downCell && cell.tagName == downCell.tagName && downCellInfo.colIndex == cellInfo.colIndex &&
                    downCellInfo.colSpan == cellInfo.colSpan ? 0 : -1
            },
            execCommand: function () {
                var rng = this.selection.getRange(),
                    bk = rng.createBookmark(!0),
                    cell = getTableItemsByRange(this).cell,
                    ut = getUETable(cell);
                ut.mergeDown(cell), rng.moveToBookmark(bk).select()
            }
        }, UE.commands.mergecells = {
            queryCommandState: function () {
                return getUETableBySelected(this) ? 0 : -1
            },
            execCommand: function () {
                var ut = getUETableBySelected(this);
                if (ut && ut.selectedTds.length) {
                    var cell = ut.selectedTds[0];
                    ut.mergeRange();
                    var rng = this.selection.getRange();
                    domUtils.isEmptyBlock(cell) ? rng.setStart(cell, 0).collapse(!0) : rng.selectNodeContents(cell),
                        rng.select()
                }
            }
        }, UE.commands.insertrow = {
            queryCommandState: function () {
                var tableItems = getTableItemsByRange(this),
                    cell = tableItems.cell;
                return cell && ("TD" == cell.tagName || "TH" == cell.tagName && tableItems.tr !== tableItems.table.rows[
                    0]) && getUETable(tableItems.table).rowsNum < this.options.maxRowNum ? 0 : -1
            },
            execCommand: function () {
                var rng = this.selection.getRange(),
                    bk = rng.createBookmark(!0),
                    tableItems = getTableItemsByRange(this),
                    cell = tableItems.cell,
                    table = tableItems.table,
                    ut = getUETable(table),
                    cellInfo = ut.getCellInfo(cell);
                if (ut.selectedTds.length) for (var range = ut.cellsRange, i = 0, len = range.endRowIndex - range.beginRowIndex +
                            1; len > i; i++) ut.insertRow(range.beginRowIndex, cell);
                else ut.insertRow(cellInfo.rowIndex, cell);
                rng.moveToBookmark(bk).select(), "enabled" === table.getAttribute("interlaced") && this.fireEvent(
                    "interlacetable", table)
            }
        }, UE.commands.insertrownext = {
            queryCommandState: function () {
                var tableItems = getTableItemsByRange(this),
                    cell = tableItems.cell;
                return cell && "TD" == cell.tagName && getUETable(tableItems.table).rowsNum < this.options.maxRowNum ?
                    0 : -1
            },
            execCommand: function () {
                var rng = this.selection.getRange(),
                    bk = rng.createBookmark(!0),
                    tableItems = getTableItemsByRange(this),
                    cell = tableItems.cell,
                    table = tableItems.table,
                    ut = getUETable(table),
                    cellInfo = ut.getCellInfo(cell);
                if (ut.selectedTds.length) for (var range = ut.cellsRange, i = 0, len = range.endRowIndex - range.beginRowIndex +
                            1; len > i; i++) ut.insertRow(range.endRowIndex + 1, cell);
                else ut.insertRow(cellInfo.rowIndex + cellInfo.rowSpan, cell);
                rng.moveToBookmark(bk).select(), "enabled" === table.getAttribute("interlaced") && this.fireEvent(
                    "interlacetable", table)
            }
        }, UE.commands.deleterow = {
            queryCommandState: function () {
                var tableItems = getTableItemsByRange(this);
                return tableItems.cell ? 0 : -1
            },
            execCommand: function () {
                var cell = getTableItemsByRange(this).cell,
                    ut = getUETable(cell),
                    cellsRange = ut.cellsRange,
                    cellInfo = ut.getCellInfo(cell),
                    preCell = ut.getVSideCell(cell),
                    nextCell = ut.getVSideCell(cell, !0),
                    rng = this.selection.getRange();
                if (utils.isEmptyObject(cellsRange)) ut.deleteRow(cellInfo.rowIndex);
                else for (var i = cellsRange.beginRowIndex; i < cellsRange.endRowIndex + 1; i++) ut.deleteRow(
                            cellsRange.beginRowIndex);
                var table = ut.table;
                if (table.getElementsByTagName("td").length) if (1 == cellInfo.rowSpan || cellInfo.rowSpan ==
                        cellsRange.endRowIndex - cellsRange.beginRowIndex + 1)(nextCell || preCell) && rng.selectNodeContents(
                            nextCell || preCell).setCursor(!1, !0);
                    else {
                        var newCell = ut.getCell(cellInfo.rowIndex, ut.indexTable[cellInfo.rowIndex][cellInfo.colIndex]
                            .cellIndex);
                        newCell && rng.selectNodeContents(newCell).setCursor(!1, !0)
                    } else {
                        var nextSibling = table.nextSibling;
                        domUtils.remove(table), nextSibling && rng.setStart(nextSibling, 0).setCursor(!1, !0)
                    }
                    "enabled" === table.getAttribute("interlaced") && this.fireEvent("interlacetable", table)
            }
        }, UE.commands.insertcol = {
            queryCommandState: function () {
                var tableItems = getTableItemsByRange(this),
                    cell = tableItems.cell;
                return cell && ("TD" == cell.tagName || "TH" == cell.tagName && cell !== tableItems.tr.cells[0]) &&
                    getUETable(tableItems.table).colsNum < this.options.maxColNum ? 0 : -1
            },
            execCommand: function (cmd) {
                var rng = this.selection.getRange(),
                    bk = rng.createBookmark(!0);
                if (-1 != this.queryCommandState(cmd)) {
                    var cell = getTableItemsByRange(this).cell,
                        ut = getUETable(cell),
                        cellInfo = ut.getCellInfo(cell);
                    if (ut.selectedTds.length) for (var range = ut.cellsRange, i = 0, len = range.endColIndex - range.beginColIndex +
                                1; len > i; i++) ut.insertCol(range.beginColIndex, cell);
                    else ut.insertCol(cellInfo.colIndex, cell);
                    rng.moveToBookmark(bk).select(!0)
                }
            }
        }, UE.commands.insertcolnext = {
            queryCommandState: function () {
                var tableItems = getTableItemsByRange(this),
                    cell = tableItems.cell;
                return cell && getUETable(tableItems.table).colsNum < this.options.maxColNum ? 0 : -1
            },
            execCommand: function () {
                var rng = this.selection.getRange(),
                    bk = rng.createBookmark(!0),
                    cell = getTableItemsByRange(this).cell,
                    ut = getUETable(cell),
                    cellInfo = ut.getCellInfo(cell);
                if (ut.selectedTds.length) for (var range = ut.cellsRange, i = 0, len = range.endColIndex - range.beginColIndex +
                            1; len > i; i++) ut.insertCol(range.endColIndex + 1, cell);
                else ut.insertCol(cellInfo.colIndex + cellInfo.colSpan, cell);
                rng.moveToBookmark(bk).select()
            }
        }, UE.commands.deletecol = {
            queryCommandState: function () {
                var tableItems = getTableItemsByRange(this);
                return tableItems.cell ? 0 : -1
            },
            execCommand: function () {
                var cell = getTableItemsByRange(this).cell,
                    ut = getUETable(cell),
                    range = ut.cellsRange,
                    cellInfo = ut.getCellInfo(cell),
                    preCell = ut.getHSideCell(cell),
                    nextCell = ut.getHSideCell(cell, !0);
                if (utils.isEmptyObject(range)) ut.deleteCol(cellInfo.colIndex);
                else for (var i = range.beginColIndex; i < range.endColIndex + 1; i++) ut.deleteCol(range.beginColIndex);
                var table = ut.table,
                    rng = this.selection.getRange();
                if (table.getElementsByTagName("td").length) domUtils.inDoc(cell, this.document) ? rng.setStart(cell, 0)
                        .setCursor(!1, !0) : nextCell && domUtils.inDoc(nextCell, this.document) ? rng.selectNodeContents(
                        nextCell).setCursor(!1, !0) : preCell && domUtils.inDoc(preCell, this.document) && rng.selectNodeContents(
                        preCell).setCursor(!0, !0);
                else {
                    var nextSibling = table.nextSibling;
                    domUtils.remove(table), nextSibling && rng.setStart(nextSibling, 0).setCursor(!1, !0)
                }
            }
        }, UE.commands.splittocells = {
            queryCommandState: function () {
                var tableItems = getTableItemsByRange(this),
                    cell = tableItems.cell;
                if (!cell) return -1;
                var ut = getUETable(tableItems.table);
                return ut.selectedTds.length > 0 ? -1 : cell && (cell.colSpan > 1 || cell.rowSpan > 1) ? 0 : -1
            },
            execCommand: function () {
                var rng = this.selection.getRange(),
                    bk = rng.createBookmark(!0),
                    cell = getTableItemsByRange(this).cell,
                    ut = getUETable(cell);
                ut.splitToCells(cell), rng.moveToBookmark(bk).select()
            }
        }, UE.commands.splittorows = {
            queryCommandState: function () {
                var tableItems = getTableItemsByRange(this),
                    cell = tableItems.cell;
                if (!cell) return -1;
                var ut = getUETable(tableItems.table);
                return ut.selectedTds.length > 0 ? -1 : cell && cell.rowSpan > 1 ? 0 : -1
            },
            execCommand: function () {
                var rng = this.selection.getRange(),
                    bk = rng.createBookmark(!0),
                    cell = getTableItemsByRange(this).cell,
                    ut = getUETable(cell);
                ut.splitToRows(cell), rng.moveToBookmark(bk).select()
            }
        }, UE.commands.splittocols = {
            queryCommandState: function () {
                var tableItems = getTableItemsByRange(this),
                    cell = tableItems.cell;
                if (!cell) return -1;
                var ut = getUETable(tableItems.table);
                return ut.selectedTds.length > 0 ? -1 : cell && cell.colSpan > 1 ? 0 : -1
            },
            execCommand: function () {
                var rng = this.selection.getRange(),
                    bk = rng.createBookmark(!0),
                    cell = getTableItemsByRange(this).cell,
                    ut = getUETable(cell);
                ut.splitToCols(cell), rng.moveToBookmark(bk).select()
            }
        }, UE.commands.adaptbytext = UE.commands.adaptbywindow = {
            queryCommandState: function () {
                return getTableItemsByRange(this).table ? 0 : -1
            },
            execCommand: function (cmd) {
                var tableItems = getTableItemsByRange(this),
                    table = tableItems.table;
                if (table) if ("adaptbywindow" == cmd) resetTdWidth(table, this);
                    else {
                        var cells = domUtils.getElementsByTagName(table, "td th");
                        utils.each(cells, function (cell) {
                            cell.removeAttribute("width")
                        }), table.removeAttribute("width")
                    }
            }
        }, UE.commands.averagedistributecol = {
            queryCommandState: function () {
                var ut = getUETableBySelected(this);
                return ut && (ut.isFullRow() || ut.isFullCol()) ? 0 : -1;
 
            },
            execCommand: function () {
                function getAverageWidth() {
                    var averageWidth, tb = ut.table,
                        sumWidth = 0,
                        colsNum = 0,
                        tbAttr = getDefaultValue(me, tb);
                    if (ut.isFullRow()) sumWidth = tb.offsetWidth, colsNum = ut.colsNum;
                    else for (var node, begin = ut.cellsRange.beginColIndex, end = ut.cellsRange.endColIndex, i = begin; end >=
                            i;) node = ut.selectedTds[i], sumWidth += node.offsetWidth, i += node.colSpan, colsNum += 1;
                    return averageWidth = Math.ceil(sumWidth / colsNum) - 2 * tbAttr.tdBorder - 2 * tbAttr.tdPadding
                }
                function setAverageWidth(averageWidth) {
                    utils.each(domUtils.getElementsByTagName(ut.table, "th"), function (node) {
                        node.setAttribute("width", "")
                    });
                    var cells = ut.isFullRow() ? domUtils.getElementsByTagName(ut.table, "td") : ut.selectedTds;
                    utils.each(cells, function (node) {
                        1 == node.colSpan && node.setAttribute("width", averageWidth)
                    })
                }
                var me = this,
                    ut = getUETableBySelected(me);
                ut && ut.selectedTds.length && setAverageWidth(getAverageWidth())
            }
        }, UE.commands.averagedistributerow = {
            queryCommandState: function () {
                var ut = getUETableBySelected(this);
                return ut ? ut.selectedTds && /th/gi.test(ut.selectedTds[0].tagName) ? -1 : ut.isFullRow() || ut.isFullCol() ?
                    0 : -1 : -1
            },
            execCommand: function () {
                function getAverageHeight() {
                    var averageHeight, rowNum, sumHeight = 0,
                        tb = ut.table,
                        tbAttr = getDefaultValue(me, tb),
                        tdpadding = parseInt(domUtils.getComputedStyle(tb.getElementsByTagName("td")[0], "padding-top"));
                    if (ut.isFullCol()) {
                        var captionHeight, thHeight, captionArr = domUtils.getElementsByTagName(tb, "caption"),
                            thArr = domUtils.getElementsByTagName(tb, "th");
                        captionArr.length > 0 && (captionHeight = captionArr[0].offsetHeight), thArr.length > 0 && (
                            thHeight = thArr[0].offsetHeight), sumHeight = tb.offsetHeight - (captionHeight || 0) - (
                            thHeight || 0), rowNum = 0 == thArr.length ? ut.rowsNum : ut.rowsNum - 1
                    } else {
                        for (var begin = ut.cellsRange.beginRowIndex, end = ut.cellsRange.endRowIndex, count = 0, trs =
                                domUtils.getElementsByTagName(tb, "tr"), i = begin; end >= i; i++) sumHeight += trs[i].offsetHeight,
                                count += 1;
                        rowNum = count
                    }
                    return averageHeight = browser.ie && browser.version < 9 ? Math.ceil(sumHeight / rowNum) : Math.ceil(
                        sumHeight / rowNum) - 2 * tbAttr.tdBorder - 2 * tdpadding
                }
                function setAverageHeight(averageHeight) {
                    var cells = ut.isFullCol() ? domUtils.getElementsByTagName(ut.table, "td") : ut.selectedTds;
                    utils.each(cells, function (node) {
                        1 == node.rowSpan && node.setAttribute("height", averageHeight)
                    })
                }
                var me = this,
                    ut = getUETableBySelected(me);
                ut && ut.selectedTds.length && setAverageHeight(getAverageHeight())
            }
        }, UE.commands.cellalignment = {
            queryCommandState: function () {
                return getTableItemsByRange(this).table ? 0 : -1
            },
            execCommand: function (cmd, data) {
                var me = this,
                    ut = getUETableBySelected(me);
                if (ut) utils.each(ut.selectedTds, function (cell) {
                        domUtils.setAttributes(cell, data)
                    });
                else {
                    var start = me.selection.getStart(),
                        cell = start && domUtils.findParentByTagName(start, ["td", "th", "caption"], !0);
                    /caption/gi.test(cell.tagName) ? (cell.style.textAlign = data.align, cell.style.verticalAlign =
                        data.vAlign) : domUtils.setAttributes(cell, data), me.selection.getRange().setCursor(!0)
                }
            },
            queryCommandValue: function () {
                var activeMenuCell = getTableItemsByRange(this).cell;
                if (activeMenuCell || (activeMenuCell = getSelectedArr(this)[0]), activeMenuCell) {
                    var cells = UE.UETable.getUETable(activeMenuCell).selectedTds;
                    return !cells.length && (cells = activeMenuCell), UE.UETable.getTableCellAlignState(cells)
                }
                return null
            }
        }, UE.commands.tablealignment = {
            queryCommandState: function () {
                return browser.ie && browser.version < 8 ? -1 : getTableItemsByRange(this).table ? 0 : -1
            },
            execCommand: function (cmd, value) {
                var me = this,
                    start = me.selection.getStart(),
                    table = start && domUtils.findParentByTagName(start, ["table"], !0);
                table && table.setAttribute("align", value)
            }
        }, UE.commands.edittable = {
            queryCommandState: function () {
                return getTableItemsByRange(this).table ? 0 : -1
            },
            execCommand: function (cmd, color) {
                var rng = this.selection.getRange(),
                    table = domUtils.findParentByTagName(rng.startContainer, "table");
                if (table) {
                    var arr = domUtils.getElementsByTagName(table, "td").concat(domUtils.getElementsByTagName(table,
                        "th"), domUtils.getElementsByTagName(table, "caption"));
                    utils.each(arr, function (node) {
                        node.style.borderColor = color
                    })
                }
            }
        }, UE.commands.edittd = {
            queryCommandState: function () {
                return getTableItemsByRange(this).table ? 0 : -1
            },
            execCommand: function (cmd, bkColor) {
                var me = this,
                    ut = getUETableBySelected(me);
                if (ut) utils.each(ut.selectedTds, function (cell) {
                        cell.style.backgroundColor = bkColor
                    });
                else {
                    var start = me.selection.getStart(),
                        cell = start && domUtils.findParentByTagName(start, ["td", "th", "caption"], !0);
                    cell && (cell.style.backgroundColor = bkColor)
                }
            }
        }, UE.commands.settablebackground = {
            queryCommandState: function () {
                return getSelectedArr(this).length > 1 ? 0 : -1
            },
            execCommand: function (cmd, value) {
                var cells, ut;
                cells = getSelectedArr(this), ut = getUETable(cells[0]), ut.setBackground(cells, value)
            }
        }, UE.commands.cleartablebackground = {
            queryCommandState: function () {
                var cells = getSelectedArr(this);
                if (!cells.length) return -1;
                for (var cell, i = 0; cell = cells[i++];) if ("" !== cell.style.backgroundColor) return 0;
                return -1
            },
            execCommand: function () {
                var cells = getSelectedArr(this),
                    ut = getUETable(cells[0]);
                ut.removeBackground(cells)
            }
        }, UE.commands.interlacetable = UE.commands.uninterlacetable = {
            queryCommandState: function (cmd) {
                var table = getTableItemsByRange(this).table;
                if (!table) return -1;
                var interlaced = table.getAttribute("interlaced");
                return "interlacetable" == cmd ? "enabled" === interlaced ? -1 : 0 : interlaced && "disabled" !==
                    interlaced ? 0 : -1
            },
            execCommand: function (cmd, classList) {
                var table = getTableItemsByRange(this).table;
                "interlacetable" == cmd ? (table.setAttribute("interlaced", "enabled"), this.fireEvent("interlacetable",
                    table, classList)) : (table.setAttribute("interlaced", "disabled"), this.fireEvent(
                    "uninterlacetable", table))
            }
        }, UE.commands.setbordervisible = {
            queryCommandState: function () {
                var table = getTableItemsByRange(this).table;
                return table ? 0 : -1
            },
            execCommand: function () {
                var table = getTableItemsByRange(this).table;
                utils.each(domUtils.getElementsByTagName(table, "td"), function (td) {
                    td.style.borderWidth = "1px", td.style.borderStyle = "solid"
                })
            }
        }
    }(), UE.plugins.table = function () {
        function showError() {}
        function removeStyleSize(obj) {
            removeStyle(obj, "width", !0), removeStyle(obj, "height", !0)
        }
        function removeStyle(obj, styleName, replaceToProperty) {
            obj.style[styleName] && (replaceToProperty && obj.setAttribute(styleName, parseInt(obj.style[styleName], 10)),
                obj.style[styleName] = "")
        }
        function getParentTdOrTh(ele) {
            if ("TD" == ele.tagName || "TH" == ele.tagName) return ele;
            var td;
            return (td = domUtils.findParentByTagName(ele, "td", !0) || domUtils.findParentByTagName(ele, "th", !0)) ?
                td : null
        }
        function isEmptyBlock(node) {
            var reg = new RegExp(domUtils.fillChar, "g");
            if (node[browser.ie ? "innerText" : "textContent"].replace(/^\s*$/, "").replace(reg, "").length > 0) return 0;
            for (var n in dtd.$isNotEmpty) if (node.getElementsByTagName(n).length) return 0;
            return 1
        }
        function mouseCoords(evt) {
            return evt.pageX || evt.pageY ? {
                x: evt.pageX,
                y: evt.pageY
            } : {
                x: evt.clientX + me.document.body.scrollLeft - me.document.body.clientLeft,
                y: evt.clientY + me.document.body.scrollTop - me.document.body.clientTop
            }
        }
        function mouseMoveEvent(evt) {
            if (!isEditorDisabled()) try {
                    var pos, target = getParentTdOrTh(evt.target || evt.srcElement);
                    if (isInResizeBuffer && (me.body.style.webkitUserSelect = "none", (Math.abs(userActionStatus.x -
                        evt.clientX) > offsetOfTableCell || Math.abs(userActionStatus.y - evt.clientY) >
                        offsetOfTableCell) && (clearTableDragTimer(), isInResizeBuffer = !1, singleClickState = 0,
                        tableBorderDrag(evt))), onDrag && dragTd) return singleClickState = 0, me.body.style.webkitUserSelect =
                            "none", me.selection.getNative()[browser.ie9below ? "empty" : "removeAllRanges"](), pos =
                            mouseCoords(evt), toggleDraggableState(me, !0, onDrag, pos, target), void("h" == onDrag ?
                            dragLine.style.left = getPermissionX(dragTd, evt) + "px" : "v" == onDrag && (dragLine.style
                            .top = getPermissionY(dragTd, evt) + "px"));
                    if (target) {
                        if (me.fireEvent("excludetable", target) === !0) return;
                        pos = mouseCoords(evt);
                        var state = getRelation(target, pos),
                            table = domUtils.findParentByTagName(target, "table", !0);
                        if (inTableSide(table, target, evt, !0)) {
                            if (me.fireEvent("excludetable", table) === !0) return;
                            me.body.style.cursor = "url(" + me.options.cursorpath + "h.png),pointer"
                        } else if (inTableSide(table, target, evt)) {
                            if (me.fireEvent("excludetable", table) === !0) return;
                            me.body.style.cursor = "url(" + me.options.cursorpath + "v.png),pointer"
                        } else {
                            me.body.style.cursor = "text";
                            /\d/.test(state) && (state = state.replace(/\d/, ""), target = getUETable(target).getPreviewCell(
                                target, "v" == state)), toggleDraggableState(me, target ? !! state : !1, target ? state :
                                "", pos, target)
                        }
                    } else toggleDragButton(!1, table, me)
            } catch (e) {
                showError(e)
            }
        }
        function toggleDragButton(show, table, editor) {
            if (show) createDragButton(table, editor);
            else {
                if (dragOver) return;
                dragButtonTimer = setTimeout(function () {
                    !dragOver && dragButton && dragButton.parentNode && dragButton.parentNode.removeChild(dragButton)
                }, 2e3)
            }
        }
        function createDragButton(table, editor) {
            function doClick(evt, button) {
                clearTimeout(timer), timer = setTimeout(function () {
                    editor.fireEvent("tableClicked", table, button)
                }, 300)
            }
            function doDblClick() {
                clearTimeout(timer);
                var ut = getUETable(table),
                    start = table.rows[0].cells[0],
                    end = ut.getLastCell(),
                    range = ut.getCellsRange(start, end);
                editor.selection.getRange().setStart(start, 0).setCursor(!1, !0), ut.setSelected(range)
            }
            var pos = domUtils.getXY(table),
                doc = table.ownerDocument;
            if (dragButton && dragButton.parentNode) return dragButton;
            dragButton = doc.createElement("div"), dragButton.contentEditable = !1, dragButton.innerHTML = "",
                dragButton.style.cssText = "width:15px;height:15px;background-image:url(" + editor.options.UEDITOR_HOME_URL +
                "dialogs/table/dragicon.png);position: absolute;cursor:move;top:" + (pos.y - 15) + "px;left:" + pos.x +
                "px;", domUtils.unSelectable(dragButton), dragButton.onmouseover = function () {
                dragOver = !0
            }, dragButton.onmouseout = function () {
                dragOver = !1
            }, domUtils.on(dragButton, "click", function (type, evt) {
                doClick(evt, this)
            }), domUtils.on(dragButton, "dblclick", function (type, evt) {
                doDblClick(evt)
            }), domUtils.on(dragButton, "dragstart", function (type, evt) {
                domUtils.preventDefault(evt)
            });
            var timer;
            doc.body.appendChild(dragButton)
        }
        function inTableSide(table, cell, evt, top) {
            var pos = mouseCoords(evt),
                state = getRelation(cell, pos);
            if (top) {
                var caption = table.getElementsByTagName("caption")[0],
                    capHeight = caption ? caption.offsetHeight : 0;
                return "v1" == state && pos.y - domUtils.getXY(table).y - capHeight < 8
            }
            return "h1" == state && pos.x - domUtils.getXY(table).x < 8
        }
        function getPermissionX(dragTd, evt) {
            var ut = getUETable(dragTd);
            if (ut) {
                var preTd = ut.getSameEndPosCells(dragTd, "x")[0],
                    nextTd = ut.getSameStartPosXCells(dragTd)[0],
                    mouseX = mouseCoords(evt).x,
                    left = (preTd ? domUtils.getXY(preTd).x : domUtils.getXY(ut.table).x) + 20,
                    right = nextTd ? domUtils.getXY(nextTd).x + nextTd.offsetWidth - 20 : me.body.offsetWidth + 5 ||
                        parseInt(domUtils.getComputedStyle(me.body, "width"), 10);
                return left += cellMinWidth, right -= cellMinWidth, left > mouseX ? left : mouseX > right ? right :
                    mouseX
            }
        }
        function getPermissionY(dragTd, evt) {
            try {
                var top = domUtils.getXY(dragTd).y,
                    mousePosY = mouseCoords(evt).y;
                return top > mousePosY ? top : mousePosY
            } catch (e) {
                showError(e)
            }
        }
        function toggleDraggableState(editor, draggable, dir, mousePos, cell) {
            try {
                editor.body.style.cursor = "h" == dir ? "col-resize" : "v" == dir ? "row-resize" : "text", browser.ie &&
                    (!dir || mousedown || getUETableBySelected(editor) ? hideDragLine(editor) : (getDragLine(editor,
                    editor.document), showDragLineAt(dir, cell))), onBorder = draggable
            } catch (e) {
                showError(e)
            }
        }
        function getRelation(ele, mousePos) {
            var elePos = domUtils.getXY(ele);
            return elePos ? elePos.x + ele.offsetWidth - mousePos.x < cellBorderWidth ? "h" : mousePos.x - elePos.x <
                cellBorderWidth ? "h1" : elePos.y + ele.offsetHeight - mousePos.y < cellBorderWidth ? "v" : mousePos.y -
                elePos.y < cellBorderWidth ? "v1" : "" : ""
        }
        function mouseDownEvent(type, evt) {
            if (!isEditorDisabled()) if (userActionStatus = {
                    x: evt.clientX,
                    y: evt.clientY
                }, 2 == evt.button) {
                    var ut = getUETableBySelected(me),
                        flag = !1;
                    if (ut) {
                        var td = getTargetTd(me, evt);
                        utils.each(ut.selectedTds, function (ti) {
                            ti === td && (flag = !0)
                        }), flag ? (td = ut.selectedTds[0], setTimeout(function () {
                            me.selection.getRange().setStart(td, 0).setCursor(!1, !0)
                        }, 0)) : (removeSelectedClass(domUtils.getElementsByTagName(me.body, "th td")), ut.clearSelected())
                    }
                } else tableClickHander(evt)
        }
        function tableDbclickHandler(evt) {
            singleClickState = 0, evt = evt || me.window.event;
            var target = getParentTdOrTh(evt.target || evt.srcElement);
            if (target) {
                var h;
                if (h = getRelation(target, mouseCoords(evt))) {
                    if (hideDragLine(me), "h1" == h) if (h = "h", inTableSide(domUtils.findParentByTagName(target,
                            "table"), target, evt)) me.execCommand("adaptbywindow");
                        else if (target = getUETable(target).getPreviewCell(target)) {
                        var rng = me.selection.getRange();
                        rng.selectNodeContents(target).setCursor(!0, !0)
                    }
                    if ("h" == h) {
                        var ut = getUETable(target),
                            table = ut.table,
                            cells = getCellsByMoveBorder(target, table, !0);
                        cells = extractArray(cells, "left"), ut.width = ut.offsetWidth;
                        var oldWidth = [],
                            newWidth = [];
                        utils.each(cells, function (cell) {
                            oldWidth.push(cell.offsetWidth)
                        }), utils.each(cells, function (cell) {
                            cell.removeAttribute("width")
                        }), window.setTimeout(function () {
                            var changeable = !0;
                            utils.each(cells, function (cell, index) {
                                var width = cell.offsetWidth;
                                return width > oldWidth[index] ? (changeable = !1, !1) : void newWidth.push(width)
                            });
                            var change = changeable ? newWidth : oldWidth;
                            utils.each(cells, function (cell, index) {
                                cell.width = change[index] - getTabcellSpace()
                            })
                        }, 0)
                    }
                }
            }
        }
        function tableClickHander(evt) {
            if (removeSelectedClass(domUtils.getElementsByTagName(me.body, "td th")), utils.each(me.document.getElementsByTagName(
                "table"), function (t) {
                t.ueTable = null
            }), startTd = getTargetTd(me, evt)) {
                var table = domUtils.findParentByTagName(startTd, "table", !0);
                ut = getUETable(table), ut && ut.clearSelected(), onBorder ? borderActionHandler(evt) : (me.document.body
                    .style.webkitUserSelect = "", mousedown = !0, me.addListener("mouseover", mouseOverEvent))
            }
        }
        function borderActionHandler(evt) {
            browser.ie && (evt = reconstruct(evt)), clearTableDragTimer(), isInResizeBuffer = !0, tableDragTimer =
                setTimeout(function () {
                tableBorderDrag(evt)
            }, dblclickTime)
        }
        function extractArray(originArr, key) {
            for (var result = [], tmp = null, i = 0, len = originArr.length; len > i; i++) tmp = originArr[i][key], tmp &&
                    result.push(tmp);
            return result
        }
        function clearTableDragTimer() {
            tableDragTimer && clearTimeout(tableDragTimer), tableDragTimer = null
        }
        function reconstruct(obj) {
            var attrs = ["pageX", "pageY", "clientX", "clientY", "srcElement", "target"],
                newObj = {};
            if (obj) for (var key, val, i = 0; key = attrs[i]; i++) val = obj[key], val && (newObj[key] = val);
            return newObj
        }
        function tableBorderDrag(evt) {
            if (isInResizeBuffer = !1, startTd = evt.target || evt.srcElement) {
                var state = getRelation(startTd, mouseCoords(evt));
                /\d/.test(state) && (state = state.replace(/\d/, ""), startTd = getUETable(startTd).getPreviewCell(
                    startTd, "v" == state)), hideDragLine(me), getDragLine(me, me.document), me.fireEvent("saveScene"),
                    showDragLineAt(state, startTd), mousedown = !0, onDrag = state, dragTd = startTd
            }
        }
        function mouseUpEvent(type, evt) {
            if (!isEditorDisabled()) {
                if (clearTableDragTimer(), isInResizeBuffer = !1, onBorder && (singleClickState = ++singleClickState %
                    3, userActionStatus = {
                    x: evt.clientX,
                    y: evt.clientY
                }, tableResizeTimer = setTimeout(function () {
                    singleClickState > 0 && singleClickState--
                }, dblclickTime), 2 === singleClickState)) return singleClickState = 0, void tableDbclickHandler(evt);
                if (2 != evt.button) {
                    var me = this,
                        range = me.selection.getRange(),
                        start = domUtils.findParentByTagName(range.startContainer, "table", !0),
                        end = domUtils.findParentByTagName(range.endContainer, "table", !0);
                    if ((start || end) && (start === end ? (start = domUtils.findParentByTagName(range.startContainer, [
                            "td", "th", "caption"], !0), end = domUtils.findParentByTagName(range.endContainer, ["td",
                            "th", "caption"], !0), start !== end && me.selection.clearRange()) : me.selection.clearRange()),
                        mousedown = !1, me.document.body.style.webkitUserSelect = "", onDrag && dragTd && (me.selection
                        .getNative()[browser.ie9below ? "empty" : "removeAllRanges"](), singleClickState = 0, dragLine =
                        me.document.getElementById("ue_tableDragLine"))) {
                        var dragTdPos = domUtils.getXY(dragTd),
                            dragLinePos = domUtils.getXY(dragLine);
                        switch (onDrag) {
                        case "h":
                            changeColWidth(dragTd, dragLinePos.x - dragTdPos.x);
                            break;
                        case "v":
                            changeRowHeight(dragTd, dragLinePos.y - dragTdPos.y - dragTd.offsetHeight)
                        }
                        return onDrag = "", dragTd = null, hideDragLine(me), void me.fireEvent("saveScene")
                    }
                    if (startTd) {
                        var ut = getUETable(startTd),
                            cell = ut ? ut.selectedTds[0] : null;
                        if (cell) range = new dom.Range(me.document), domUtils.isEmptyBlock(cell) ? range.setStart(cell,
                                0).setCursor(!1, !0) : range.selectNodeContents(cell).shrinkBoundary().setCursor(!1, !0);
                        else if (range = me.selection.getRange().shrinkBoundary(), !range.collapsed) {
                            var start = domUtils.findParentByTagName(range.startContainer, ["td", "th"], !0),
                                end = domUtils.findParentByTagName(range.endContainer, ["td", "th"], !0);
                            (start && !end || !start && end || start && end && start !== end) && range.setCursor(!1, !0)
                        }
                        startTd = null, me.removeListener("mouseover", mouseOverEvent)
                    } else {
                        var target = domUtils.findParentByTagName(evt.target || evt.srcElement, "td", !0);
                        if (target || (target = domUtils.findParentByTagName(evt.target || evt.srcElement, "th", !0)),
                            target && ("TD" == target.tagName || "TH" == target.tagName)) {
                            if (me.fireEvent("excludetable", target) === !0) return;
                            range = new dom.Range(me.document), range.setStart(target, 0).setCursor(!1, !0)
                        }
                    }
                    me._selectionChange(250, evt)
                }
            }
        }
        function mouseOverEvent(type, evt) {
            if (!isEditorDisabled()) {
                var me = this,
                    tar = evt.target || evt.srcElement;
                if (currentTd = domUtils.findParentByTagName(tar, "td", !0) || domUtils.findParentByTagName(tar, "th", !
                    0), startTd && currentTd && ("TD" == startTd.tagName && "TD" == currentTd.tagName || "TH" ==
                    startTd.tagName && "TH" == currentTd.tagName) && domUtils.findParentByTagName(startTd, "table") ==
                    domUtils.findParentByTagName(currentTd, "table")) {
                    var ut = getUETable(currentTd);
                    if (startTd != currentTd) {
                        me.document.body.style.webkitUserSelect = "none", me.selection.getNative()[browser.ie9below ?
                            "empty" : "removeAllRanges"]();
                        var range = ut.getCellsRange(startTd, currentTd);
                        ut.setSelected(range)
                    } else me.document.body.style.webkitUserSelect = "", ut.clearSelected()
                }
                evt.preventDefault ? evt.preventDefault() : evt.returnValue = !1
            }
        }
        function setCellHeight(cell, height, backHeight) {
            var lineHight = parseInt(domUtils.getComputedStyle(cell, "line-height"), 10),
                tmpHeight = backHeight + height;
            height = lineHight > tmpHeight ? lineHight : tmpHeight, cell.style.height && (cell.style.height = ""), 1 ==
                cell.rowSpan ? cell.setAttribute("height", height) : cell.removeAttribute && cell.removeAttribute(
                "height")
        }
        function changeColWidth(cell, changeValue) {
            var ut = getUETable(cell);
            if (ut) {
                var table = ut.table,
                    cells = getCellsByMoveBorder(cell, table);
                if (table.style.width = "", table.removeAttribute("width"), changeValue = correctChangeValue(
                    changeValue, cell, cells), cell.nextSibling) {
                    utils.each(cells, function (cellGroup) {
                        cellGroup.left.width = +cellGroup.left.width + changeValue, cellGroup.right && (cellGroup.right
                            .width = +cellGroup.right.width - changeValue)
                    })
                } else utils.each(cells, function (cellGroup) {
                        cellGroup.left.width -= -changeValue
                    })
            }
        }
        function isEditorDisabled() {
            return "false" === me.body.contentEditable
        }
        function changeRowHeight(td, changeValue) {
            if (!(Math.abs(changeValue) < 10)) {
                var ut = getUETable(td);
                if (ut) for (var cell, cells = ut.getSameEndPosCells(td, "y"), backHeight = cells[0] ? cells[0].offsetHeight :
                            0, i = 0; cell = cells[i++];) setCellHeight(cell, changeValue, backHeight)
            }
        }
        function getCellsByMoveBorder(cell, table, isContainMergeCell) {
            if (table || (table = domUtils.findParentByTagName(cell, "table")), !table) return null;
            for (var temp = (domUtils.getNodeIndex(cell), cell), rows = table.rows, colIndex = 0; temp;) 1 === temp.nodeType &&
                    (colIndex += temp.colSpan || 1), temp = temp.previousSibling;
            temp = null;
            var borderCells = [];
            return utils.each(rows, function (tabRow) {
                var cells = tabRow.cells,
                    currIndex = 0;
                utils.each(cells, function (tabCell) {
                    return currIndex += tabCell.colSpan || 1, currIndex === colIndex ? (borderCells.push({
                        left: tabCell,
                        right: tabCell.nextSibling || null
                    }), !1) : currIndex > colIndex ? (isContainMergeCell && borderCells.push({
                        left: tabCell
                    }), !1) : void 0
                })
            }), borderCells
        }
        function correctChangeValue(changeValue, relatedCell, cells) {
            if (changeValue -= getTabcellSpace(), 0 > changeValue) return 0;
            changeValue -= getTableCellWidth(relatedCell);
            var direction = 0 > changeValue ? "left" : "right";
            return changeValue = Math.abs(changeValue), utils.each(cells, function (cellGroup) {
                var curCell = cellGroup[direction];
                curCell && (changeValue = Math.min(changeValue, getTableCellWidth(curCell) - cellMinWidth))
            }), changeValue = 0 > changeValue ? 0 : changeValue, "left" === direction ? -changeValue : changeValue
        }
        function getTableCellWidth(cell) {
            var width = 0,
                width = cell.offsetWidth - getTabcellSpace();
            cell.nextSibling || (width -= getTableCellOffset(cell)), width = 0 > width ? 0 : width;
            try {
                cell.width = width
            } catch (e) {}
            return width
        }
        function getTableCellOffset(cell) {
            if (tab = domUtils.findParentByTagName(cell, "table", !1), void 0 === tab.offsetVal) {
                var prev = cell.previousSibling;
                tab.offsetVal = prev && cell.offsetWidth - prev.offsetWidth === UT.borderWidth ? UT.borderWidth : 0
            }
            return tab.offsetVal
        }
        function getTabcellSpace() {
            if (void 0 === UT.tabcellSpace) {
                var tab = me.document.createElement("table"),
                    tbody = me.document.createElement("tbody"),
                    trow = me.document.createElement("tr"),
                    tabcell = me.document.createElement("td"),
                    mirror = null;
                tabcell.style.cssText = "border: 0;", tabcell.width = 1, trow.appendChild(tabcell), trow.appendChild(
                    mirror = tabcell.cloneNode(!1)), tbody.appendChild(trow), tab.appendChild(tbody), tab.style.cssText =
                    "visibility: hidden;", me.body.appendChild(tab), UT.paddingSpace = tabcell.offsetWidth - 1;
                var tmpTabWidth = tab.offsetWidth;
                tabcell.style.cssText = "", mirror.style.cssText = "", UT.borderWidth = (tab.offsetWidth - tmpTabWidth) /
                    3, UT.tabcellSpace = UT.paddingSpace + UT.borderWidth, me.body.removeChild(tab)
            }
            return getTabcellSpace = function () {
                return UT.tabcellSpace
            }, UT.tabcellSpace
        }
        function getDragLine(editor) {
            mousedown || (dragLine = editor.document.createElement("div"), domUtils.setAttributes(dragLine, {
                id: "ue_tableDragLine",
                unselectable: "on",
                contenteditable: !1,
                onresizestart: "return false",
                ondragstart: "return false",
                onselectstart: "return false",
                style: "background-color:blue;position:absolute;padding:0;margin:0;background-image:none;border:0px none;opacity:0;filter:alpha(opacity=0)"
            }), editor.body.appendChild(dragLine))
        }
        function hideDragLine(editor) {
            if (!mousedown) for (var line; line = editor.document.getElementById("ue_tableDragLine");) domUtils.remove(
                        line)
        }
        function showDragLineAt(state, cell) {
            if (cell) {
                var css, table = domUtils.findParentByTagName(cell, "table"),
                    caption = table.getElementsByTagName("caption"),
                    width = table.offsetWidth,
                    height = table.offsetHeight - (caption.length > 0 ? caption[0].offsetHeight : 0),
                    tablePos = domUtils.getXY(table),
                    cellPos = domUtils.getXY(cell);
                switch (state) {
                case "h":
                    css = "height:" + height + "px;top:" + (tablePos.y + (caption.length > 0 ? caption[0].offsetHeight :
                        0)) + "px;left:" + (cellPos.x + cell.offsetWidth), dragLine.style.cssText = css +
                        "px;position: absolute;display:block;background-color:blue;width:1px;border:0; color:blue;opacity:.3;filter:alpha(opacity=30)";
                    break;
                case "v":
                    css = "width:" + width + "px;left:" + tablePos.x + "px;top:" + (cellPos.y + cell.offsetHeight),
                        dragLine.style.cssText = css +
                        "px;overflow:hidden;position: absolute;display:block;background-color:blue;height:1px;border:0;color:blue;opacity:.2;filter:alpha(opacity=20)"
                }
            }
        }
        function switchBorderColor(editor, flag) {
            for (var color, node, tableArr = domUtils.getElementsByTagName(editor.body, "table"), i = 0; node =
                tableArr[i++];) {
                var td = domUtils.getElementsByTagName(node, "td");
                td[0] && (flag ? (color = td[0].style.borderColor.replace(/\s/g, ""),
                    /(#ffffff)|(rgb\(255,255,255\))/gi.test(color) && domUtils.addClass(node, "noBorderTable")) :
                    domUtils.removeClasses(node, "noBorderTable"))
            }
        }
        function getTableWidth(editor, needIEHack, defaultValue) {
            var body = editor.body;
            return body.offsetWidth - (needIEHack ? 2 * parseInt(domUtils.getComputedStyle(body, "margin-left"), 10) :
                0) - 2 * defaultValue.tableBorder - (editor.options.offsetWidth || 0)
        }
        function getTargetTd(editor, evt) {
            var target = domUtils.findParentByTagName(evt.target || evt.srcElement, ["td", "th"], !0),
                dir = null;
            if (!target) return null;
            if (dir = getRelation(target, mouseCoords(evt)), !target) return null;
            if ("h1" === dir && target.previousSibling) {
                var position = domUtils.getXY(target),
                    cellWidth = target.offsetWidth;
                Math.abs(position.x + cellWidth - evt.clientX) > cellWidth / 3 && (target = target.previousSibling)
            } else if ("v1" === dir && target.parentNode.previousSibling) {
                var position = domUtils.getXY(target),
                    cellHeight = target.offsetHeight;
                Math.abs(position.y + cellHeight - evt.clientY) > cellHeight / 3 && (target = target.parentNode.previousSibling
                    .firstChild)
            }
            return target && editor.fireEvent("excludetable", target) !== !0 ? target : null
        }
        var me = this,
            tableDragTimer = null,
            tableResizeTimer = null,
            cellMinWidth = 5,
            isInResizeBuffer = !1,
            cellBorderWidth = 5,
            offsetOfTableCell = 10,
            singleClickState = 0,
            userActionStatus = null,
            dblclickTime = 360,
            UT = UE.UETable,
            getUETable = function (tdOrTable) {
                return UT.getUETable(tdOrTable)
            }, getUETableBySelected = function (editor) {
                return UT.getUETableBySelected(editor)
            }, getDefaultValue = function (editor, table) {
                return UT.getDefaultValue(editor, table)
            }, removeSelectedClass = function (cells) {
                return UT.removeSelectedClass(cells)
            };
        me.ready(function () {
            var me = this,
                orgGetText = me.selection.getText;
            me.selection.getText = function () {
                var table = getUETableBySelected(me);
                if (table) {
                    var str = "";
                    return utils.each(table.selectedTds, function (td) {
                        str += td[browser.ie ? "innerText" : "textContent"]
                    }), str
                }
                return orgGetText.call(me.selection)
            }
        });
        var startTd = null,
            currentTd = null,
            onDrag = "",
            onBorder = !1,
            dragButton = null,
            dragOver = !1,
            dragLine = null,
            dragTd = null,
            mousedown = !1,
            needIEHack = !0;
        me.setOpt({
            maxColNum: 20,
            maxRowNum: 100,
            defaultCols: 5,
            defaultRows: 5,
            tdvalign: "top",
            cursorpath: me.options.UEDITOR_HOME_URL + "themes/default/images/cursor_",
            tableDragable: !1,
            classList: ["ue-table-interlace-color-single", "ue-table-interlace-color-double"]
        }), me.getUETable = getUETable;
        var commands = {
            deletetable: 1,
            inserttable: 1,
            cellvalign: 1,
            insertcaption: 1,
            deletecaption: 1,
            inserttitle: 1,
            deletetitle: 1,
            mergeright: 1,
            mergedown: 1,
            mergecells: 1,
            insertrow: 1,
            insertrownext: 1,
            deleterow: 1,
            insertcol: 1,
            insertcolnext: 1,
            deletecol: 1,
            splittocells: 1,
            splittorows: 1,
            splittocols: 1,
            adaptbytext: 1,
            adaptbywindow: 1,
            adaptbycustomer: 1,
            insertparagraph: 1,
            insertparagraphbeforetable: 1,
            averagedistributecol: 1,
            averagedistributerow: 1
        };
        me.ready(function () {
            utils.cssRule("table",
                ".selectTdClass{background-color:#edf5fa !important}table.noBorderTable td,table.noBorderTable th,table.noBorderTable caption{border:1px dashed #ddd !important}table{margin-bottom:10px;border-collapse:collapse;display:table;}td,th{padding: 5px 10px;border: 1px solid #DDD;}caption{border:1px dashed #DDD;border-bottom:0;padding:3px;text-align:center;}th{border-top:1px solid #BBB;background-color:#F7F7F7;}table tr.firstRow th{border-top-width:2px;}.ue-table-interlace-color-single{ background-color: #fcfcfc; } .ue-table-interlace-color-double{ background-color: #f7faff; }td p{margin:0;padding:0;}",
                me.document);
            var tableCopyList, isFullCol, isFullRow;
            me.addListener("keydown", function (cmd, evt) {
                var me = this,
                    keyCode = evt.keyCode || evt.which;
                if (8 == keyCode) {
                    var ut = getUETableBySelected(me);
                    ut && ut.selectedTds.length && (ut.isFullCol() ? me.execCommand("deletecol") : ut.isFullRow() ? me.execCommand(
                        "deleterow") : me.fireEvent("delcells"), domUtils.preventDefault(evt));
                    var caption = domUtils.findParentByTagName(me.selection.getStart(), "caption", !0),
                        range = me.selection.getRange();
                    if (range.collapsed && caption && isEmptyBlock(caption)) {
                        me.fireEvent("saveScene");
                        var table = caption.parentNode;
                        domUtils.remove(caption), table && range.setStart(table.rows[0].cells[0], 0).setCursor(!1, !0),
                            me.fireEvent("saveScene")
                    }
                }
                if (46 == keyCode && (ut = getUETableBySelected(me))) {
                    me.fireEvent("saveScene");
                    for (var ci, i = 0; ci = ut.selectedTds[i++];) domUtils.fillNode(me.document, ci);
                    me.fireEvent("saveScene"), domUtils.preventDefault(evt)
                }
                if (13 == keyCode) {
                    var rng = me.selection.getRange(),
                        caption = domUtils.findParentByTagName(rng.startContainer, "caption", !0);
                    if (caption) {
                        var table = domUtils.findParentByTagName(caption, "table");
                        return rng.collapsed ? caption && rng.setStart(table.rows[0].cells[0], 0).setCursor(!1, !0) : (
                            rng.deleteContents(), me.fireEvent("saveScene")), void domUtils.preventDefault(evt)
                    }
                    if (rng.collapsed) {
                        var table = domUtils.findParentByTagName(rng.startContainer, "table");
                        if (table) {
                            var cell = table.rows[0].cells[0],
                                start = domUtils.findParentByTagName(me.selection.getStart(), ["td", "th"], !0),
                                preNode = table.previousSibling;
                            if (cell === start && (!preNode || 1 == preNode.nodeType && "TABLE" == preNode.tagName) &&
                                domUtils.isStartInblock(rng)) {
                                var first = domUtils.findParent(me.selection.getStart(), function (n) {
                                    return domUtils.isBlockElm(n)
                                }, !0);
                                first && (/t(h|d)/i.test(first.tagName) || first === start.firstChild) && (me.execCommand(
                                    "insertparagraphbeforetable"), domUtils.preventDefault(evt))
                            }
                        }
                    }
                }
                if ((evt.ctrlKey || evt.metaKey) && "67" == evt.keyCode) {
                    tableCopyList = null;
                    var ut = getUETableBySelected(me);
                    if (ut) {
                        var tds = ut.selectedTds;
                        isFullCol = ut.isFullCol(), isFullRow = ut.isFullRow(), tableCopyList = [[ut.cloneCell(tds[0],
                                    null, !0)]];
                        for (var ci, i = 1; ci = tds[i]; i++) ci.parentNode !== tds[i - 1].parentNode ? tableCopyList.push([
                                    ut.cloneCell(ci, null, !0)]) : tableCopyList[tableCopyList.length - 1].push(ut.cloneCell(
                                ci, null, !0))
                    }
                }
            }), me.addListener("tablehasdeleted", function () {
                toggleDraggableState(this, !1, "", null), dragButton && domUtils.remove(dragButton)
            }), me.addListener("beforepaste", function (cmd, html) {
                var me = this,
                    rng = me.selection.getRange();
                if (domUtils.findParentByTagName(rng.startContainer, "caption", !0)) {
                    var div = me.document.createElement("div");
                    return div.innerHTML = html.html, void(html.html = div[browser.ie9below ? "innerText" :
                        "textContent"])
                }
                var table = getUETableBySelected(me);
                if (tableCopyList) {
                    me.fireEvent("saveScene");
                    var tmpNode, preNode, rng = me.selection.getRange(),
                        td = domUtils.findParentByTagName(rng.startContainer, ["td", "th"], !0);
                    if (td) {
                        var ut = getUETable(td);
                        if (isFullRow) {
                            var rowIndex = ut.getCellInfo(td).rowIndex;
                            "TH" == td.tagName && rowIndex++;
                            for (var ci, i = 0; ci = tableCopyList[i++];) {
                                for (var cj, tr = ut.insertRow(rowIndex++, "td"), j = 0; cj = ci[j]; j++) {
                                    var cell = tr.cells[j];
                                    cell || (cell = tr.insertCell(j)), cell.innerHTML = cj.innerHTML, cj.getAttribute(
                                        "width") && cell.setAttribute("width", cj.getAttribute("width")), cj.getAttribute(
                                        "vAlign") && cell.setAttribute("vAlign", cj.getAttribute("vAlign")), cj.getAttribute(
                                        "align") && cell.setAttribute("align", cj.getAttribute("align")), cj.style.cssText &&
                                        (cell.style.cssText = cj.style.cssText)
                                }
                                for (var cj, j = 0;
                                (cj = tr.cells[j]) && ci[j]; j++) cj.innerHTML = ci[j].innerHTML, ci[j].getAttribute(
                                        "width") && cj.setAttribute("width", ci[j].getAttribute("width")), ci[j].getAttribute(
                                        "vAlign") && cj.setAttribute("vAlign", ci[j].getAttribute("vAlign")), ci[j].getAttribute(
                                        "align") && cj.setAttribute("align", ci[j].getAttribute("align")), ci[j].style.cssText &&
                                        (cj.style.cssText = ci[j].style.cssText)
                            }
                        } else {
                            if (isFullCol) {
                                cellInfo = ut.getCellInfo(td);
                                for (var cj, maxColNum = 0, j = 0, ci = tableCopyList[0]; cj = ci[j++];) maxColNum +=
                                        cj.colSpan || 1;
                                for (me.__hasEnterExecCommand = !0, i = 0; maxColNum > i; i++) me.execCommand(
                                        "insertcol");
                                me.__hasEnterExecCommand = !1, td = ut.table.rows[0].cells[cellInfo.cellIndex], "TH" ==
                                    td.tagName && (td = ut.table.rows[1].cells[cellInfo.cellIndex])
                            }
                            for (var ci, i = 0; ci = tableCopyList[i++];) {
                                tmpNode = td;
                                for (var cj, j = 0; cj = ci[j++];) if (td) td.innerHTML = cj.innerHTML, cj.getAttribute(
                                            "width") && td.setAttribute("width", cj.getAttribute("width")), cj.getAttribute(
                                            "vAlign") && td.setAttribute("vAlign", cj.getAttribute("vAlign")), cj.getAttribute(
                                            "align") && td.setAttribute("align", cj.getAttribute("align")), cj.style.cssText &&
                                            (td.style.cssText = cj.style.cssText), preNode = td, td = td.nextSibling;
                                    else {
                                        var cloneTd = cj.cloneNode(!0);
                                        domUtils.removeAttributes(cloneTd, ["class", "rowSpan", "colSpan"]), preNode.parentNode
                                            .appendChild(cloneTd)
                                    }
                                if (td = ut.getNextCell(tmpNode, !0, !0), !tableCopyList[i]) break;
                                if (!td) {
                                    var cellInfo = ut.getCellInfo(tmpNode);
                                    ut.table.insertRow(ut.table.rows.length), ut.update(), td = ut.getVSideCell(tmpNode, !
                                        0)
                                }
                            }
                        }
                        ut.update()
                    } else {
                        table = me.document.createElement("table");
                        for (var ci, i = 0; ci = tableCopyList[i++];) {
                            for (var cj, tr = table.insertRow(table.rows.length), j = 0; cj = ci[j++];) cloneTd = UT.cloneCell(
                                    cj, null, !0), domUtils.removeAttributes(cloneTd, ["class"]), tr.appendChild(
                                    cloneTd);
                            2 == j && cloneTd.rowSpan > 1 && (cloneTd.rowSpan = 1)
                        }
                        var defaultValue = getDefaultValue(me),
                            width = me.body.offsetWidth - (needIEHack ? 2 * parseInt(domUtils.getComputedStyle(me.body,
                                "margin-left"), 10) : 0) - 2 * defaultValue.tableBorder - (me.options.offsetWidth || 0);
                        me.execCommand("insertHTML", "<table  " + (isFullCol && isFullRow ? 'width="' + width + '"' :
                            "") + ">" + table.innerHTML.replace(/>\s*</g, "><").replace(/\bth\b/gi, "td") + "</table>")
                    }
                    return me.fireEvent("contentchange"), me.fireEvent("saveScene"), html.html = "", !0
                }
                var tables, div = me.document.createElement("div");
                div.innerHTML = html.html, tables = div.getElementsByTagName("table"), domUtils.findParentByTagName(me.selection
                    .getStart(), "table") ? (utils.each(tables, function (t) {
                    domUtils.remove(t)
                }), domUtils.findParentByTagName(me.selection.getStart(), "caption", !0) && (div.innerHTML = div[
                    browser.ie ? "innerText" : "textContent"])) : utils.each(tables, function (table) {
                    removeStyleSize(table, !0), domUtils.removeAttributes(table, ["style", "border"]), utils.each(
                        domUtils.getElementsByTagName(table, "td"), function (td) {
                        isEmptyBlock(td) && domUtils.fillNode(me.document, td), removeStyleSize(td, !0)
                    })
                }), html.html = div.innerHTML
            }), me.addListener("afterpaste", function () {
                utils.each(domUtils.getElementsByTagName(me.body, "table"), function (table) {
                    if (table.offsetWidth > me.body.offsetWidth) {
                        var defaultValue = getDefaultValue(me, table);
                        table.style.width = me.body.offsetWidth - (needIEHack ? 2 * parseInt(domUtils.getComputedStyle(
                            me.body, "margin-left"), 10) : 0) - 2 * defaultValue.tableBorder - (me.options.offsetWidth ||
                            0) + "px"
                    }
                })
            }), me.addListener("blur", function () {
                tableCopyList = null
            });
            var timer;
            me.addListener("keydown", function () {
                clearTimeout(timer), timer = setTimeout(function () {
                    var rng = me.selection.getRange(),
                        cell = domUtils.findParentByTagName(rng.startContainer, ["th", "td"], !0);
                    if (cell) {
                        var table = cell.parentNode.parentNode.parentNode;
                        table.offsetWidth > table.getAttribute("width") && (cell.style.wordBreak = "break-all")
                    }
                }, 100)
            }), me.addListener("selectionchange", function () {
                toggleDraggableState(me, !1, "", null)
            }), me.addListener("contentchange", function () {
                var me = this;
                if (hideDragLine(me), !getUETableBySelected(me)) {
                    var rng = me.selection.getRange(),
                        start = rng.startContainer;
                    start = domUtils.findParentByTagName(start, ["td", "th"], !0), utils.each(domUtils.getElementsByTagName(
                        me.document, "table"), function (table) {
                        me.fireEvent("excludetable", table) !== !0 && (table.ueTable = new UT(table), table.onmouseover = function () {
                            me.fireEvent("tablemouseover", table)
                        }, table.onmousemove = function () {
                            me.fireEvent("tablemousemove", table), me.options.tableDragable && toggleDragButton(!0,
                                this, me), utils.defer(function () {
                                me.fireEvent("contentchange", 50)
                            }, !0)
                        }, table.onmouseout = function () {
                            me.fireEvent("tablemouseout", table), toggleDraggableState(me, !1, "", null), hideDragLine(
                                me)
                        }, table.onclick = function (evt) {
                            evt = me.window.event || evt;
                            var target = getParentTdOrTh(evt.target || evt.srcElement);
                            if (target) {
                                var cellsRange, ut = getUETable(target),
                                    table = ut.table,
                                    cellInfo = ut.getCellInfo(target),
                                    rng = me.selection.getRange();
                                if (inTableSide(table, target, evt, !0)) {
                                    var endTdCol = ut.getCell(ut.indexTable[ut.rowsNum - 1][cellInfo.colIndex].rowIndex,
                                        ut.indexTable[ut.rowsNum - 1][cellInfo.colIndex].cellIndex);
                                    return void(evt.shiftKey && ut.selectedTds.length ? ut.selectedTds[0] !== endTdCol ?
                                        (cellsRange = ut.getCellsRange(ut.selectedTds[0], endTdCol), ut.setSelected(
                                        cellsRange)) : rng && rng.selectNodeContents(endTdCol).select() : target !==
                                        endTdCol ? (cellsRange = ut.getCellsRange(target, endTdCol), ut.setSelected(
                                        cellsRange)) : rng && rng.selectNodeContents(endTdCol).select())
                                }
                                if (inTableSide(table, target, evt)) {
                                    var endTdRow = ut.getCell(ut.indexTable[cellInfo.rowIndex][ut.colsNum - 1].rowIndex,
                                        ut.indexTable[cellInfo.rowIndex][ut.colsNum - 1].cellIndex);
                                    evt.shiftKey && ut.selectedTds.length ? ut.selectedTds[0] !== endTdRow ? (
                                        cellsRange = ut.getCellsRange(ut.selectedTds[0], endTdRow), ut.setSelected(
                                        cellsRange)) : rng && rng.selectNodeContents(endTdRow).select() : target !==
                                        endTdRow ? (cellsRange = ut.getCellsRange(target, endTdRow), ut.setSelected(
                                        cellsRange)) : rng && rng.selectNodeContents(endTdRow).select()
                                }
                            }
                        })
                    }), switchBorderColor(me, !0)
                }
            }), domUtils.on(me.document, "mousemove", mouseMoveEvent), domUtils.on(me.document, "mouseout", function (
                evt) {
                var target = evt.target || evt.srcElement;
                "TABLE" == target.tagName && toggleDraggableState(me, !1, "", null)
            }), me.addListener("interlacetable", function (type, table, classList) {
                if (table) for (var me = this, rows = table.rows, len = rows.length, getClass = function (list, index,
                            repeat) {
                            return list[index] ? list[index] : repeat ? list[index % list.length] : ""
                        }, i = 0; len > i; i++) rows[i].className = getClass(classList || me.options.classList, i, !0)
            }), me.addListener("uninterlacetable", function (type, table) {
                if (table) for (var me = this, rows = table.rows, classList = me.options.classList, len = rows.length,
                            i = 0; len > i; i++) domUtils.removeClasses(rows[i], classList)
            }), me.addListener("mousedown", mouseDownEvent), me.addListener("mouseup", mouseUpEvent), domUtils.on(me.body,
                "dragstart", function (evt) {
                mouseUpEvent.call(me, "dragstart", evt)
            }), me.addOutputRule(function (root) {
                utils.each(root.getNodesByTagName("div"), function (n) {
                    "ue_tableDragLine" == n.getAttr("id") && n.parentNode.removeChild(n)
                })
            });
            var currentRowIndex = 0;
            me.addListener("mousedown", function () {
                currentRowIndex = 0
            }), me.addListener("tabkeydown", function () {
                var range = this.selection.getRange(),
                    common = range.getCommonAncestor(!0, !0),
                    table = domUtils.findParentByTagName(common, "table");
                if (table) {
                    if (domUtils.findParentByTagName(common, "caption", !0)) {
                        var cell = domUtils.getElementsByTagName(table, "th td");
                        cell && cell.length && range.setStart(cell[0], 0).setCursor(!1, !0)
                    } else {
                        var cell = domUtils.findParentByTagName(common, ["td", "th"], !0),
                            ua = getUETable(cell);
                        currentRowIndex = cell.rowSpan > 1 ? currentRowIndex : ua.getCellInfo(cell).rowIndex;
                        var nextCell = ua.getTabNextCell(cell, currentRowIndex);
                        nextCell ? isEmptyBlock(nextCell) ? range.setStart(nextCell, 0).setCursor(!1, !0) : range.selectNodeContents(
                            nextCell).select() : (me.fireEvent("saveScene"), me.__hasEnterExecCommand = !0, this.execCommand(
                            "insertrownext"), me.__hasEnterExecCommand = !1, range = this.selection.getRange(), range.setStart(
                            table.rows[table.rows.length - 1].cells[0], 0).setCursor(), me.fireEvent("saveScene"))
                    }
                    return !0
                }
            }), browser.ie && me.addListener("selectionchange", function () {
                toggleDraggableState(this, !1, "", null)
            }), me.addListener("keydown", function (type, evt) {
                var me = this,
                    keyCode = evt.keyCode || evt.which;
                if (8 != keyCode && 46 != keyCode) {
                    var notCtrlKey = !(evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.altKey);
                    notCtrlKey && removeSelectedClass(domUtils.getElementsByTagName(me.body, "td"));
                    var ut = getUETableBySelected(me);
                    ut && notCtrlKey && ut.clearSelected()
                }
            }), me.addListener("beforegetcontent", function () {
                switchBorderColor(this, !1), browser.ie && utils.each(this.document.getElementsByTagName("caption"), function (
                    ci) {
                    domUtils.isEmptyNode(ci) && (ci.innerHTML = " ")
                })
            }), me.addListener("aftergetcontent", function () {
                switchBorderColor(this, !0)
            }), me.addListener("getAllHtml", function () {
                removeSelectedClass(me.document.getElementsByTagName("td"))
            }), me.addListener("fullscreenchanged", function (type, fullscreen) {
                if (!fullscreen) {
                    var ratio = this.body.offsetWidth / document.body.offsetWidth,
                        tables = domUtils.getElementsByTagName(this.body, "table");
                    utils.each(tables, function (table) {
                        if (table.offsetWidth < me.body.offsetWidth) return !1;
                        var tds = domUtils.getElementsByTagName(table, "td"),
                            backWidths = [];
                        utils.each(tds, function (td) {
                            backWidths.push(td.offsetWidth)
                        });
                        for (var td, i = 0; td = tds[i]; i++) td.setAttribute("width", Math.floor(backWidths[i] * ratio));
                        table.setAttribute("width", Math.floor(getTableWidth(me, needIEHack, getDefaultValue(me))))
                    })
                }
            });
            var oldExecCommand = me.execCommand;
            me.execCommand = function (cmd) {
                {
                    var me = this;
                    arguments
                }
                cmd = cmd.toLowerCase();
                var tds, result, ut = getUETableBySelected(me),
                    range = new dom.Range(me.document),
                    cmdFun = me.commands[cmd] || UE.commands[cmd];
                if (cmdFun) {
                    if (!ut || commands[cmd] || cmdFun.notNeedUndo || me.__hasEnterExecCommand) result = oldExecCommand
                            .apply(me, arguments);
                    else {
                        me.__hasEnterExecCommand = !0, me.fireEvent("beforeexeccommand", cmd), tds = ut.selectedTds;
                        for (var value, state, td, lastState = -2, lastValue = -2, i = 0; td = tds[i]; i++) isEmptyBlock(
                                td) ? range.setStart(td, 0).setCursor(!1, !0) : range.selectNode(td).select(!0), state =
                                me.queryCommandState(cmd), value = me.queryCommandValue(cmd), -1 != state && ((
                                lastState !== state || lastValue !== value) && (me._ignoreContentChange = !0, result =
                                oldExecCommand.apply(me, arguments), me._ignoreContentChange = !1), lastState = me.queryCommandState(
                                cmd), lastValue = me.queryCommandValue(cmd), domUtils.isEmptyBlock(td) && domUtils.fillNode(
                                me.document, td));
                        range.setStart(tds[0], 0).shrinkBoundary(!0).setCursor(!1, !0), me.fireEvent("contentchange"),
                            me.fireEvent("afterexeccommand", cmd), me.__hasEnterExecCommand = !1, me._selectionChange()
                    }
                    return result
                }
            }
        });
        var dragButtonTimer
    }, UE.UETable.prototype.sortTable = function (sortByCellIndex, compareFn) {
        var table = this.table,
            rows = table.rows,
            trArray = [],
            flag = "TH" === rows[0].cells[0].tagName,
            lastRowIndex = 0;
        if (this.selectedTds.length) {
            for (var range = this.cellsRange, len = range.endRowIndex + 1, i = range.beginRowIndex; len > i; i++)
                trArray[i] = rows[i];
            trArray.splice(0, range.beginRowIndex), lastRowIndex = range.endRowIndex + 1 === this.rowsNum ? 0 : range.endRowIndex +
                1
        } else for (var i = 0, len = rows.length; len > i; i++) trArray[i] = rows[i];
        var Fn = {
            reversecurrent: function () {
                return 1
            },
            orderbyasc: function (td1, td2) {
                var value1 = td1.innerText || td1.textContent,
                    value2 = td2.innerText || td2.textContent;
                return value1.localeCompare(value2)
            },
            reversebyasc: function (td1, td2) {
                var value1 = td1.innerHTML,
                    value2 = td2.innerHTML;
                return value2.localeCompare(value1)
            },
            orderbynum: function (td1, td2) {
                var value1 = td1[browser.ie ? "innerText" : "textContent"].match(/\d+/),
                    value2 = td2[browser.ie ? "innerText" : "textContent"].match(/\d+/);
                return value1 && (value1 = +value1[0]), value2 && (value2 = +value2[0]), (value1 || 0) - (value2 || 0)
            },
            reversebynum: function (td1, td2) {
                var value1 = td1[browser.ie ? "innerText" : "textContent"].match(/\d+/),
                    value2 = td2[browser.ie ? "innerText" : "textContent"].match(/\d+/);
                return value1 && (value1 = +value1[0]), value2 && (value2 = +value2[0]), (value2 || 0) - (value1 || 0)
            }
        };
        table.setAttribute("data-sort-type", compareFn && "string" == typeof compareFn && Fn[compareFn] ? compareFn :
            ""), flag && trArray.splice(0, 1), trArray = utils.sort(trArray, function (tr1, tr2) {
            var result;
            return result = compareFn && "function" == typeof compareFn ? compareFn.call(this, tr1.cells[
                sortByCellIndex], tr2.cells[sortByCellIndex]) : compareFn && "number" == typeof compareFn ? 1 :
                compareFn && "string" == typeof compareFn && Fn[compareFn] ? Fn[compareFn].call(this, tr1.cells[
                sortByCellIndex], tr2.cells[sortByCellIndex]) : Fn.orderbyasc.call(this, tr1.cells[sortByCellIndex],
                tr2.cells[sortByCellIndex])
        });
        for (var fragment = table.ownerDocument.createDocumentFragment(), j = 0, len = trArray.length; len > j; j++)
            fragment.appendChild(trArray[j]);
        var tbody = table.getElementsByTagName("tbody")[0];
        lastRowIndex ? tbody.insertBefore(fragment, rows[lastRowIndex - range.endRowIndex + range.beginRowIndex - 1]) :
            tbody.appendChild(fragment)
    }, UE.plugins.tablesort = function () {
        var me = this,
            UT = UE.UETable,
            getUETable = function (tdOrTable) {
                return UT.getUETable(tdOrTable)
            }, getTableItemsByRange = function (editor) {
                return UT.getTableItemsByRange(editor)
            };
        me.ready(function () {
            utils.cssRule("tablesort",
                "table.sortEnabled tr.firstRow th,table.sortEnabled tr.firstRow td{padding-right:20px;background-repeat: no-repeat;background-position: center right;   background-image:url(" +
                me.options.themePath + me.options.theme + "/images/sortable.png);}", me.document), me.addListener(
                "afterexeccommand", function (type, cmd) {
                ("mergeright" == cmd || "mergedown" == cmd || "mergecells" == cmd) && this.execCommand("disablesort")
            })
        }), UE.commands.sorttable = {
            queryCommandState: function () {
                var me = this,
                    tableItems = getTableItemsByRange(me);
                if (!tableItems.cell) return -1;
                for (var cell, table = tableItems.table, cells = table.getElementsByTagName("td"), i = 0; cell = cells[
                    i++];) if (1 != cell.rowSpan || 1 != cell.colSpan) return -1;
                return 0
            },
            execCommand: function (cmd, fn) {
                var me = this,
                    range = me.selection.getRange(),
                    bk = range.createBookmark(!0),
                    tableItems = getTableItemsByRange(me),
                    cell = tableItems.cell,
                    ut = getUETable(tableItems.table),
                    cellInfo = ut.getCellInfo(cell);
                ut.sortTable(cellInfo.cellIndex, fn), range.moveToBookmark(bk);
                try {
                    range.select()
                } catch (e) {}
            }
        }, UE.commands.enablesort = UE.commands.disablesort = {
            queryCommandState: function (cmd) {
                var table = getTableItemsByRange(this).table;
                if (table && "enablesort" == cmd) for (var cells = domUtils.getElementsByTagName(table, "th td"), i = 0; i <
                        cells.length; i++) if (cells[i].getAttribute("colspan") > 1 || cells[i].getAttribute("rowspan") >
                            1) return -1;
                return table ? "enablesort" == cmd ^ "sortEnabled" != table.getAttribute("data-sort") ? -1 : 0 : -1
            },
            execCommand: function (cmd) {
                var table = getTableItemsByRange(this).table;
                table.setAttribute("data-sort", "enablesort" == cmd ? "sortEnabled" : "sortDisabled"), "enablesort" ==
                    cmd ? domUtils.addClass(table, "sortEnabled") : domUtils.removeClasses(table, "sortEnabled")
            }
        }
    }, UE.plugins.contextmenu = function () {
        var me = this;
        if (me.setOpt("enableContextMenu", !0), me.getOpt("enableContextMenu") !== !1) {
            var menu, lang = me.getLang("contextMenu"),
                items = me.options.contextMenu || [{
                        label: lang.selectall,
                        cmdName: "selectall"
                    }, {
                        label: lang.cleardoc,
                        cmdName: "cleardoc",
                        exec: function () {
                            confirm(lang.confirmclear) && this.execCommand("cleardoc")
                        }
                    }, "-", {
                        label: lang.unlink,
                        cmdName: "unlink"
                    }, "-", {
                        group: lang.paragraph,
                        icon: "justifyjustify",
                        subMenu: [{
                                label: lang.justifyleft,
                                cmdName: "justify",
                                value: "left"
                            }, {
                                label: lang.justifyright,
                                cmdName: "justify",
                                value: "right"
                            }, {
                                label: lang.justifycenter,
                                cmdName: "justify",
                                value: "center"
                            }, {
                                label: lang.justifyjustify,
                                cmdName: "justify",
                                value: "justify"
                            }]
                    }, "-", {
                        group: lang.table,
                        icon: "table",
                        subMenu: [{
                                label: lang.inserttable,
                                cmdName: "inserttable"
                            }, {
                                label: lang.deletetable,
                                cmdName: "deletetable"
                            }, "-", {
                                label: lang.deleterow,
                                cmdName: "deleterow"
                            }, {
                                label: lang.deletecol,
                                cmdName: "deletecol"
                            }, {
                                label: lang.insertcol,
                                cmdName: "insertcol"
                            }, {
                                label: lang.insertcolnext,
                                cmdName: "insertcolnext"
                            }, {
                                label: lang.insertrow,
                                cmdName: "insertrow"
                            }, {
                                label: lang.insertrownext,
                                cmdName: "insertrownext"
                            }, "-", {
                                label: lang.insertcaption,
                                cmdName: "insertcaption"
                            }, {
                                label: lang.deletecaption,
                                cmdName: "deletecaption"
                            }, {
                                label: lang.inserttitle,
                                cmdName: "inserttitle"
                            }, {
                                label: lang.deletetitle,
                                cmdName: "deletetitle"
                            }, {
                                label: lang.inserttitlecol,
                                cmdName: "inserttitlecol"
                            }, {
                                label: lang.deletetitlecol,
                                cmdName: "deletetitlecol"
                            }, "-", {
                                label: lang.mergecells,
                                cmdName: "mergecells"
                            }, {
                                label: lang.mergeright,
                                cmdName: "mergeright"
                            }, {
                                label: lang.mergedown,
                                cmdName: "mergedown"
                            }, "-", {
                                label: lang.splittorows,
                                cmdName: "splittorows"
                            }, {
                                label: lang.splittocols,
                                cmdName: "splittocols"
                            }, {
                                label: lang.splittocells,
                                cmdName: "splittocells"
                            }, "-", {
                                label: lang.averageDiseRow,
                                cmdName: "averagedistributerow"
                            }, {
                                label: lang.averageDisCol,
                                cmdName: "averagedistributecol"
                            }, "-", {
                                label: lang.edittd,
                                cmdName: "edittd",
                                exec: function () {
                                    UE.ui.edittd && new UE.ui.edittd(this), this.getDialog("edittd").open()
                                }
                            }, {
                                label: lang.edittable,
                                cmdName: "edittable",
                                exec: function () {
                                    UE.ui.edittable && new UE.ui.edittable(this), this.getDialog("edittable").open()
                                }
                            }, {
                                label: lang.setbordervisible,
                                cmdName: "setbordervisible"
                            }]
                    }, {
                        group: lang.tablesort,
                        icon: "tablesort",
                        subMenu: [{
                                label: lang.enablesort,
                                cmdName: "enablesort"
                            }, {
                                label: lang.disablesort,
                                cmdName: "disablesort"
                            }, "-", {
                                label: lang.reversecurrent,
                                cmdName: "sorttable",
                                value: "reversecurrent"
                            }, {
                                label: lang.orderbyasc,
                                cmdName: "sorttable",
                                value: "orderbyasc"
                            }, {
                                label: lang.reversebyasc,
                                cmdName: "sorttable",
                                value: "reversebyasc"
                            }, {
                                label: lang.orderbynum,
                                cmdName: "sorttable",
                                value: "orderbynum"
                            }, {
                                label: lang.reversebynum,
                                cmdName: "sorttable",
                                value: "reversebynum"
                            }]
                    }, {
                        group: lang.borderbk,
                        icon: "borderBack",
                        subMenu: [{
                                label: lang.setcolor,
                                cmdName: "interlacetable",
                                exec: function () {
                                    this.execCommand("interlacetable")
                                }
                            }, {
                                label: lang.unsetcolor,
                                cmdName: "uninterlacetable",
                                exec: function () {
                                    this.execCommand("uninterlacetable")
                                }
                            }, {
                                label: lang.setbackground,
                                cmdName: "settablebackground",
                                exec: function () {
                                    this.execCommand("settablebackground", {
                                        repeat: !0,
                                        colorList: ["#bbb", "#ccc"]
                                    })
                                }
                            }, {
                                label: lang.unsetbackground,
                                cmdName: "cleartablebackground",
                                exec: function () {
                                    this.execCommand("cleartablebackground")
                                }
                            }, {
                                label: lang.redandblue,
                                cmdName: "settablebackground",
                                exec: function () {
                                    this.execCommand("settablebackground", {
                                        repeat: !0,
                                        colorList: ["red", "blue"]
                                    })
                                }
                            }, {
                                label: lang.threecolorgradient,
                                cmdName: "settablebackground",
                                exec: function () {
                                    this.execCommand("settablebackground", {
                                        repeat: !0,
                                        colorList: ["#aaa", "#bbb", "#ccc"]
                                    })
                                }
                            }]
                    }, {
                        group: lang.aligntd,
                        icon: "aligntd",
                        subMenu: [{
                                cmdName: "cellalignment",
                                value: {
                                    align: "left",
                                    vAlign: "top"
                                }
                            }, {
                                cmdName: "cellalignment",
                                value: {
                                    align: "center",
                                    vAlign: "top"
                                }
                            }, {
                                cmdName: "cellalignment",
                                value: {
                                    align: "right",
                                    vAlign: "top"
                                }
                            }, {
                                cmdName: "cellalignment",
                                value: {
                                    align: "left",
                                    vAlign: "middle"
                                }
                            }, {
                                cmdName: "cellalignment",
                                value: {
                                    align: "center",
                                    vAlign: "middle"
                                }
                            }, {
                                cmdName: "cellalignment",
                                value: {
                                    align: "right",
                                    vAlign: "middle"
                                }
                            }, {
                                cmdName: "cellalignment",
                                value: {
                                    align: "left",
                                    vAlign: "bottom"
                                }
                            }, {
                                cmdName: "cellalignment",
                                value: {
                                    align: "center",
                                    vAlign: "bottom"
                                }
                            }, {
                                cmdName: "cellalignment",
                                value: {
                                    align: "right",
                                    vAlign: "bottom"
                                }
                            }]
                    }, {
                        group: lang.aligntable,
                        icon: "aligntable",
                        subMenu: [{
                                cmdName: "tablealignment",
                                className: "left",
                                label: lang.tableleft,
                                value: "left"
                            }, {
                                cmdName: "tablealignment",
                                className: "center",
                                label: lang.tablecenter,
                                value: "center"
                            }, {
                                cmdName: "tablealignment",
                                className: "right",
                                label: lang.tableright,
                                value: "right"
                            }]
                    }, "-", {
                        label: lang.insertparagraphbefore,
                        cmdName: "insertparagraph",
                        value: !0
                    }, {
                        label: lang.insertparagraphafter,
                        cmdName: "insertparagraph"
                    }, {
                        label: lang.copy,
                        cmdName: "copy"
                    }, {
                        label: lang.paste,
                        cmdName: "paste"
                    }];
            if (items.length) {
                var uiUtils = UE.ui.uiUtils;
                me.addListener("contextmenu", function (type, evt) {
                    var offset = uiUtils.getViewportOffsetByEvent(evt);
                    me.fireEvent("beforeselectionchange"), menu && menu.destroy();
                    for (var ti, i = 0, contextItems = []; ti = items[i]; i++) {
                        var last;
                        ! function (item) {
                            function getLabel() {
                                switch (item.icon) {
                                case "table":
                                    return me.getLang("contextMenu.table");
                                case "justifyjustify":
                                    return me.getLang("contextMenu.paragraph");
                                case "aligntd":
                                    return me.getLang("contextMenu.aligntd");
                                case "aligntable":
                                    return me.getLang("contextMenu.aligntable");
                                case "tablesort":
                                    return lang.tablesort;
                                case "borderBack":
                                    return lang.borderbk;
                                default:
                                    return ""
                                }
                            }
                            if ("-" == item)(last = contextItems[contextItems.length - 1]) && "-" !== last &&
                                    contextItems.push("-");
                            else if (item.hasOwnProperty("group")) {
                                for (var cj, j = 0, subMenu = []; cj = item.subMenu[j]; j++)! function (subItem) {
                                    "-" == subItem ? (last = subMenu[subMenu.length - 1]) && "-" !== last ? subMenu.push(
                                        "-") : subMenu.splice(subMenu.length - 1) : (me.commands[subItem.cmdName] || UE
                                        .commands[subItem.cmdName] || subItem.query) && (subItem.query ? subItem.query() :
                                        me.queryCommandState(subItem.cmdName)) > -1 && subMenu.push({
                                        label: subItem.label || me.getLang("contextMenu." + subItem.cmdName + (subItem.value ||
                                            "")) || "",
                                        className: "edui-for-" + subItem.cmdName + (subItem.className ? " edui-for-" +
                                            subItem.cmdName + "-" + subItem.className : ""),
                                        onclick: subItem.exec ? function () {
                                            subItem.exec.call(me)
                                        } : function () {
                                            me.execCommand(subItem.cmdName, subItem.value)
                                        }
                                    })
                                }(cj);
                                subMenu.length && contextItems.push({
                                    label: getLabel(),
                                    className: "edui-for-" + item.icon,
                                    subMenu: {
                                        items: subMenu,
                                        editor: me
                                    }
                                })
                            } else(me.commands[item.cmdName] || UE.commands[item.cmdName] || item.query) && (item.query ?
                                    item.query.call(me) : me.queryCommandState(item.cmdName)) > -1 && contextItems.push({
                                    label: item.label || me.getLang("contextMenu." + item.cmdName),
                                    className: "edui-for-" + (item.icon ? item.icon : item.cmdName + (item.value || "")),
                                    onclick: item.exec ? function () {
                                        item.exec.call(me)
                                    } : function () {
                                        me.execCommand(item.cmdName, item.value)
                                    }
                                })
                        }(ti)
                    }
                    if ("-" == contextItems[contextItems.length - 1] && contextItems.pop(), menu = new UE.ui.Menu({
                        items: contextItems,
                        className: "edui-contextmenu",
                        editor: me
                    }), menu.render(), menu.showAt(offset), me.fireEvent("aftershowcontextmenu", menu), domUtils.preventDefault(
                        evt), browser.ie) {
                        var ieRange;
                        try {
                            ieRange = me.selection.getNative().createRange()
                        } catch (e) {
                            return
                        }
                        if (ieRange.item) {
                            var range = new dom.Range(me.document);
                            range.selectNode(ieRange.item(0)).select(!0, !0)
                        }
                    }
                }), me.addListener("aftershowcontextmenu", function (type, menu) {
                    if (me.zeroclipboard) {
                        var items = menu.items;
                        for (var key in items) "edui-for-copy" == items[key].className && me.zeroclipboard.clip(items[
                                key].getDom())
                    }
                })
            }
        }
    }, UE.plugins.shortcutmenu = function () {
        var menu, me = this,
            items = me.options.shortcutMenu || [];
        items.length && (me.addListener("contextmenu mouseup", function (type, e) {
            var me = this,
                customEvt = {
                    type: type,
                    target: e.target || e.srcElement,
                    screenX: e.screenX,
                    screenY: e.screenY,
                    clientX: e.clientX,
                    clientY: e.clientY
                };
            if (setTimeout(function () {
                var rng = me.selection.getRange();
                (rng.collapsed === !1 || "contextmenu" == type) && (menu || (menu = new baidu.editor.ui.ShortCutMenu({
                    editor: me,
                    items: items,
                    theme: me.options.theme,
                    className: "edui-shortcutmenu"
                }), menu.render(), me.fireEvent("afterrendershortcutmenu", menu)), menu.show(customEvt, !! UE.plugins.contextmenu))
            }), "contextmenu" == type && (domUtils.preventDefault(e), browser.ie9below)) {
                var ieRange;
                try {
                    ieRange = me.selection.getNative().createRange()
                } catch (e) {
                    return
                }
                if (ieRange.item) {
                    var range = new dom.Range(me.document);
                    range.selectNode(ieRange.item(0)).select(!0, !0)
                }
            }
        }), me.addListener("keydown", function (type) {
            "keydown" == type && menu && !menu.isHidden && menu.hide()
        }))
    }, UE.plugins.basestyle = function () {
        var basestyles = {
            bold: ["strong", "b"],
            italic: ["em", "i"],
            subscript: ["sub"],
            superscript: ["sup"]
        }, getObj = function (editor, tagNames) {
                return domUtils.filterNodeList(editor.selection.getStartElementPath(), tagNames)
            }, me = this;
        me.addshortcutkey({
            Bold: "ctrl+66",
            Italic: "ctrl+73",
            Underline: "ctrl+85"
        }), me.addInputRule(function (root) {
            utils.each(root.getNodesByTagName("b i"), function (node) {
                switch (node.tagName) {
                case "b":
                    node.tagName = "strong";
                    break;
                case "i":
                    node.tagName = "em"
                }
            })
        });
        for (var style in basestyles)! function (cmd, tagNames) {
            me.commands[cmd] = {
                execCommand: function (cmdName) {
                    var range = me.selection.getRange(),
                        obj = getObj(this, tagNames);
                    if (range.collapsed) {
                        if (obj) {
                            var tmpText = me.document.createTextNode("");
                            range.insertNode(tmpText).removeInlineStyle(tagNames), range.setStartBefore(tmpText),
                                domUtils.remove(tmpText)
                        } else {
                            var tmpNode = range.document.createElement(tagNames[0]);
                            ("superscript" == cmdName || "subscript" == cmdName) && (tmpText = me.document.createTextNode(
                                ""), range.insertNode(tmpText).removeInlineStyle(["sub", "sup"]).setStartBefore(tmpText)
                                .collapse(!0)), range.insertNode(tmpNode).setStart(tmpNode, 0)
                        }
                        range.collapse(!0)
                    } else("superscript" == cmdName || "subscript" == cmdName) && (obj && obj.tagName.toLowerCase() ==
                            cmdName || range.removeInlineStyle(["sub", "sup"])), obj ? range.removeInlineStyle(tagNames) :
                            range.applyInlineStyle(tagNames[0]);
                    range.select()
                },
                queryCommandState: function () {
                    return getObj(this, tagNames) ? 1 : 0
                }
            }
        }(style, basestyles[style])
    }, UE.plugins.elementpath = function () {
        var currentLevel, tagNames, me = this;
        me.setOpt("elementPathEnabled", !0), me.options.elementPathEnabled && (me.commands.elementpath = {
            execCommand: function (cmdName, level) {
                var start = tagNames[level],
                    range = me.selection.getRange();
                currentLevel = 1 * level, range.selectNode(start).select()
            },
            queryCommandValue: function () {
                var parents = [].concat(this.selection.getStartElementPath()).reverse(),
                    names = [];
                tagNames = parents;
                for (var ci, i = 0; ci = parents[i]; i++) if (3 != ci.nodeType) {
                        var name = ci.tagName.toLowerCase();
                        if ("img" == name && ci.getAttribute("anchorname") && (name = "anchor"), names[i] = name,
                            currentLevel == i) {
                            currentLevel = -1;
                            break
                        }
                    }
                return names
            }
        })
    }, UE.plugins.formatmatch = function () {
        function addList(type, evt) {
            function addFormat(range) {
                return text && range.selectNode(text), range.applyInlineStyle(list[list.length - 1].tagName, null, list)
            }
            if (browser.webkit) var target = "IMG" == evt.target.tagName ? evt.target : null;
            me.undoManger && me.undoManger.save();
            var range = me.selection.getRange(),
                imgT = target || range.getClosedNode();
            if (img && imgT && "IMG" == imgT.tagName) imgT.style.cssText += ";float:" + (img.style.cssFloat || img.style
                    .styleFloat || "none") + ";display:" + (img.style.display || "inline"), img = null;
            else if (!img) {
                var collapsed = range.collapsed;
                if (collapsed) {
                    var text = me.document.createTextNode("match");
                    range.insertNode(text).select()
                }
                me.__hasEnterExecCommand = !0;
                var removeFormatAttributes = me.options.removeFormatAttributes;
                me.options.removeFormatAttributes = "", me.execCommand("removeformat"), me.options.removeFormatAttributes =
                    removeFormatAttributes, me.__hasEnterExecCommand = !1, range = me.selection.getRange(), list.length &&
                    addFormat(range), text && range.setStartBefore(text).collapse(!0), range.select(), text && domUtils
                    .remove(text)
            }
            me.undoManger && me.undoManger.save(), me.removeListener("mouseup", addList), flag = 0
        }
        var img, me = this,
            list = [],
            flag = 0;
        me.addListener("reset", function () {
            list = [], flag = 0
        }), me.commands.formatmatch = {
            execCommand: function () {
                if (flag) return flag = 0, list = [], void me.removeListener("mouseup", addList);
                var range = me.selection.getRange();
                if (img = range.getClosedNode(), !img || "IMG" != img.tagName) {
                    range.collapse(!0).shrinkBoundary();
                    var start = range.startContainer;
                    list = domUtils.findParents(start, !0, function (node) {
                        return !domUtils.isBlockElm(node) && 1 == node.nodeType
                    });
                    for (var ci, i = 0; ci = list[i]; i++) if ("A" == ci.tagName) {
                            list.splice(i, 1);
                            break
                        }
                }
                me.addListener("mouseup", addList), flag = 1
            },
            queryCommandState: function () {
                return flag
            },
            notNeedUndo: 1
        }
    }, UE.plugin.register("searchreplace", function () {
        function findTextInString(textContent, opt, currentIndex) {
            var str = opt.searchStr; - 1 == opt.dir && (textContent = textContent.split("").reverse().join(""), str =
                str.split("").reverse().join(""), currentIndex = textContent.length - currentIndex);
            for (var match, reg = new RegExp(str, "g" + (opt.casesensitive ? "" : "i")); match = reg.exec(textContent);)
                if (match.index >= currentIndex) return -1 == opt.dir ? textContent.length - match.index - opt.searchStr
                        .length : match.index;
            return -1
        }
        function findTextBlockElm(node, currentIndex, opt) {
            var textContent, index, methodName = opt.all || 1 == opt.dir ? "getNextDomNode" : "getPreDomNode";
            domUtils.isBody(node) && (node = node.firstChild);
            for (var first = 1; node;) {
                if (textContent = 3 == node.nodeType ? node.nodeValue : node[browser.ie ? "innerText" : "textContent"],
                    index = findTextInString(textContent, opt, currentIndex), first = 0, -1 != index) return {
                        node: node,
                        index: index
                };
                for (node = domUtils[methodName](node); node && _blockElm[node.nodeName.toLowerCase()];) node =
                        domUtils[methodName](node, !0);
                node && (currentIndex = -1 == opt.dir ? (3 == node.nodeType ? node.nodeValue : node[browser.ie ?
                    "innerText" : "textContent"]).length : 0)
            }
        }
        function findNTextInBlockElm(node, index, str) {
            for (var result, currentIndex = 0, currentNode = node.firstChild, currentNodeLength = 0; currentNode;) {
                if (3 == currentNode.nodeType) {
                    if (currentNodeLength = currentNode.nodeValue.replace(/(^[\t\r\n]+)|([\t\r\n]+$)/, "").length,
                        currentIndex += currentNodeLength, currentIndex >= index) return {
                            node: currentNode,
                            index: currentNodeLength - (currentIndex - index)
                    }
                } else if (!dtd.$empty[currentNode.tagName] && (currentNodeLength = currentNode[browser.ie ?
                    "innerText" : "textContent"].replace(/(^[\t\r\n]+)|([\t\r\n]+$)/, "").length, currentIndex +=
                    currentNodeLength, currentIndex >= index && (result = findNTextInBlockElm(currentNode,
                    currentNodeLength - (currentIndex - index), str)))) return result;
                currentNode = domUtils.getNextDomNode(currentNode)
            }
        }
        function searchReplace(me, opt) {
            var startBlockNode, rng = me.selection.getRange(),
                searchStr = opt.searchStr,
                span = me.document.createElement("span");
            if (span.innerHTML = "$$ueditor_searchreplace_key$$", rng.shrinkBoundary(!0), !rng.collapsed) {
                rng.select();
                var rngText = me.selection.getText();
                if (new RegExp("^" + opt.searchStr + "$", opt.casesensitive ? "" : "i").test(rngText)) {
                    if (void 0 != opt.replaceStr) return replaceText(rng, opt.replaceStr), rng.select(), !0;
                    rng.collapse(-1 == opt.dir)
                }
            }
            rng.insertNode(span), rng.enlargeToBlockElm(!0), startBlockNode = rng.startContainer;
            var currentIndex = startBlockNode[browser.ie ? "innerText" : "textContent"].indexOf(
                "$$ueditor_searchreplace_key$$");
            rng.setStartBefore(span), domUtils.remove(span);
            var result = findTextBlockElm(startBlockNode, currentIndex, opt);
            if (result) {
                var rngStart = findNTextInBlockElm(result.node, result.index, searchStr),
                    rngEnd = findNTextInBlockElm(result.node, result.index + searchStr.length, searchStr);
                return rng.setStart(rngStart.node, rngStart.index).setEnd(rngEnd.node, rngEnd.index), void 0 !== opt.replaceStr &&
                    replaceText(rng, opt.replaceStr), rng.select(), !0
            }
            rng.setCursor()
        }
        function replaceText(rng, str) {
            str = me.document.createTextNode(str), rng.deleteContents().insertNode(str)
        }
        var me = this,
            _blockElm = {
                table: 1,
                tbody: 1,
                tr: 1,
                ol: 1,
                ul: 1
            };
        return {
            commands: {
                searchreplace: {
                    execCommand: function (cmdName, opt) {
                        utils.extend(opt, {
                            all: !1,
                            casesensitive: !1,
                            dir: 1
                        }, !0);
                        var num = 0;
                        if (opt.all) {
                            var rng = me.selection.getRange(),
                                first = me.body.firstChild;
                            for (first && 1 == first.nodeType ? (rng.setStart(first, 0), rng.shrinkBoundary(!0)) : 3 ==
                                first.nodeType && rng.setStartBefore(first), rng.collapse(!0).select(!0), void 0 !==
                                opt.replaceStr && me.fireEvent("saveScene"); searchReplace(this, opt);) num++;
                            num && me.fireEvent("saveScene")
                        } else void 0 !== opt.replaceStr && me.fireEvent("saveScene"), searchReplace(this, opt) && num++,
                                num && me.fireEvent("saveScene");
                        return num
                    },
                    notNeedUndo: 1
                }
            }
        }
    }), UE.plugins.customstyle = function () {
        var me = this;
        me.setOpt({
            customstyle: [{
                    tag: "h1",
                    name: "tc",
                    style: "font-size:32px;font-weight:bold;border-bottom:#ccc 2px solid;padding:0 4px 0 0;text-align:center;margin:0 0 20px 0;"
                }, {
                    tag: "h1",
                    name: "tl",
                    style: "font-size:32px;font-weight:bold;border-bottom:#ccc 2px solid;padding:0 4px 0 0;text-align:left;margin:0 0 10px 0;"
                }, {
                    tag: "span",
                    name: "im",
                    style: "font-size:16px;font-style:italic;font-weight:bold;line-height:18px;"
                }, {
                    tag: "span",
                    name: "hi",
                    style: "font-size:16px;font-style:italic;font-weight:bold;color:rgb(51, 153, 204);line-height:18px;"
                }]
        }), me.commands.customstyle = {
            execCommand: function (cmdName, obj) {
                var range, bk, me = this,
                    tagName = obj.tag,
                    node = domUtils.findParent(me.selection.getStart(), function (node) {
                        return node.getAttribute("label")
                    }, !0),
                    tmpObj = {};
                for (var p in obj) void 0 !== obj[p] && (tmpObj[p] = obj[p]);
                if (delete tmpObj.tag, node && node.getAttribute("label") == obj.label) {
                    if (range = this.selection.getRange(), bk = range.createBookmark(), range.collapsed) if (dtd.$block[
                            node.tagName]) {
                            var fillNode = me.document.createElement("p");
                            domUtils.moveChild(node, fillNode), node.parentNode.insertBefore(fillNode, node), domUtils.remove(
                                node)
                        } else domUtils.remove(node, !0);
                        else {
                            var common = domUtils.getCommonAncestor(bk.start, bk.end),
                                nodes = domUtils.getElementsByTagName(common, tagName);
                            new RegExp(tagName, "i").test(common.tagName) && nodes.push(common);
                            for (var ni, i = 0; ni = nodes[i++];) if (ni.getAttribute("label") == obj.label) {
                                    var ps = domUtils.getPosition(ni, bk.start),
                                        pe = domUtils.getPosition(ni, bk.end);
                                    if ((ps & domUtils.POSITION_FOLLOWING || ps & domUtils.POSITION_CONTAINS) && (pe &
                                        domUtils.POSITION_PRECEDING || pe & domUtils.POSITION_CONTAINS) && dtd.$block[
                                        tagName]) {
                                        var fillNode = me.document.createElement("p");
                                        domUtils.moveChild(ni, fillNode), ni.parentNode.insertBefore(fillNode, ni)
                                    }
                                    domUtils.remove(ni, !0)
                                }
                            node = domUtils.findParent(common, function (node) {
                                return node.getAttribute("label") == obj.label
                            }, !0), node && domUtils.remove(node, !0)
                        }
                    range.moveToBookmark(bk).select()
                } else if (dtd.$block[tagName]) {
                    if (this.execCommand("paragraph", tagName, tmpObj, "customstyle"), range = me.selection.getRange(), !
                        range.collapsed) {
                        range.collapse(), node = domUtils.findParent(me.selection.getStart(), function (node) {
                            return node.getAttribute("label") == obj.label
                        }, !0);
                        var pNode = me.document.createElement("p");
                        domUtils.insertAfter(node, pNode), domUtils.fillNode(me.document, pNode), range.setStart(pNode,
                            0).setCursor()
                    }
                } else {
                    if (range = me.selection.getRange(), range.collapsed) return node = me.document.createElement(
                            tagName), domUtils.setAttributes(node, tmpObj), void range.insertNode(node).setStart(node,
                            0).setCursor();
                    bk = range.createBookmark(), range.applyInlineStyle(tagName, tmpObj).moveToBookmark(bk).select()
                }
            },
            queryCommandValue: function () {
                var parent = domUtils.filterNodeList(this.selection.getStartElementPath(), function (node) {
                    return node.getAttribute("label")
                });
                return parent ? parent.getAttribute("label") : ""
            }
        }, me.addListener("keyup", function (type, evt) {
            var keyCode = evt.keyCode || evt.which;
            if (32 == keyCode || 13 == keyCode) {
                var range = me.selection.getRange();
                if (range.collapsed) {
                    var node = domUtils.findParent(me.selection.getStart(), function (node) {
                        return node.getAttribute("label")
                    }, !0);
                    if (node && dtd.$block[node.tagName] && domUtils.isEmptyNode(node)) {
                        var p = me.document.createElement("p");
                        domUtils.insertAfter(node, p), domUtils.fillNode(me.document, p), domUtils.remove(node), range.setStart(
                            p, 0).setCursor()
                    }
                }
            }
        })
    }, UE.plugins.catchremoteimage = function () {
        var me = this,
            ajax = UE.ajax,
            failedImageCount = 0,
            successImageCount = 0,
            allImageCount = 0,
            catchFailedImg = UE.ui.catchFailedImg = "http://s0.pstatp.com/site/image/pgc/upload_fail.png";
        me.options.catchRemoteImageEnable !== !1 && (me.setOpt({
            catchRemoteImageEnable: !1
        }), me.addListener("afterpaste", function () {
            me.fireEvent("catchRemoteImage")
        }), me.addListener("catchremotedone", function () {
            successImageCount + failedImageCount === allImageCount && me.fireEvent("catchRemoteImageEnd", {
                successImageCount: successImageCount,
                failedImageCount: failedImageCount,
                allImageCount: allImageCount
            }), failedImageCount && successImageCount + failedImageCount == allImageCount && alert(failedImageCount +
                "张图片粘贴失败，请手动上传")
        }), me.addListener("catchRemoteImage", function () {
            function remoteImageErrorPlaceholder(ci) {
                domUtils.setAttributes(ci, {
                    src: catchFailedImg,
                    style: "background:url(" + me.options.UEDITOR_HOME_URL + "themes/default/images/remoteimage.png) no-repeat center center;border:1px solid #ddd",
                    _src: "",
                    width: 400,
                    height: 300,
                    "class": "remoteImageErrorPlaceholder"
                })
            }
            function catchremoteimage(imgs, callbacks) {
                var params = utils.serializeParam(me.queryCommandValue("serverparam")) || "",
                    url = utils.formatUrl(catcherActionUrl + (-1 == catcherActionUrl.indexOf("?") ? "?" : "&") + params),
                    isJsonp = utils.isCrossDomainUrl(url),
                    opt = {
                        method: "POST",
                        dataType: isJsonp ? "jsonp" : "",
                        timeout: 4e3,
                        onsuccess: callbacks.success,
                        onerror: function () {
                            callbacks.error(imgs)
                        }
                    };
                opt[catcherFieldName] = imgs, ajax.request(url, opt)
            }
            failedImageCount = 0, successImageCount = 0, allImageCount = 0;
            for (var catcherLocalDomain = me.getOpt("catcherLocalDomain"), catcherActionUrl = me.getOpt("catcherUrl"),
                    catcherUrlPrefix = me.getOpt("catcherUrlPrefix"), catcherFieldName = me.getOpt("catcherFieldName"),
                    catcherSeparater = me.getOpt("separater") || "|", remoteImages = [], imgs = domUtils.getElementsByTagName(
                    me.document, "img"), isCached = function (src, urls) {
                    if (-1 != src.indexOf(location.host) || /(^\.)|(^\/)/.test(src)) return !0;
                    if (urls) for (var url, j = 0; url = urls[j++];) if (-1 !== src.indexOf(url)) return !0;
                    return !1
                }, i = 0, ci; ci = imgs[i++];) if (!ci.getAttribute("word_img")) {
                    var src = ci.getAttribute("_src") || ci.src || "";
                    /^(https?|ftp):/i.test(src) || src.startsWith(me.options.UEDITOR_HOME_URL) ? isCached(src,
                        catcherLocalDomain) || remoteImages.push(src) : domUtils.remove(ci)
                }
            allImageCount = remoteImages.length, 0 !== allImageCount && me.fireEvent("catchRemoteImageStart");
            for (var i = 0; i < remoteImages.length; i++) catchremoteimage(remoteImages[i], {
                    success: function (r) {
                        try {
                            var info = void 0 !== r.state ? r : eval("(" + r.responseText + ")")
                        } catch (e) {
                            return
                        }
                        var i, j, ci, cj, oldSrc, newSrc, info_srcurl = info.srcUrl.split(catcherSeparater),
                            info_url = info.url.split(catcherSeparater);
                        for (i = 0; ci = imgs[i++];) for (oldSrc = ci.getAttribute("_src") || ci.src || "", j = 0; cj =
                                info_srcurl[j++];) {
                                var tmp_url = info_url[j - 1];
                                if (oldSrc == cj && tmp_url.length) {
                                    newSrc = catcherUrlPrefix + tmp_url, domUtils.setAttributes(ci, {
                                        src: newSrc,
                                        _src: newSrc
                                    }), successImageCount += 1;
                                    break
                                }
                                if (oldSrc == cj && !tmp_url.length) {
                                    failedImageCount++, remoteImageErrorPlaceholder(ci);
                                    break
                                }
                        }
                        me.fireEvent("catchremotedone")
                    },
                    error: function (imgStr) {
                        for (var ci, i = 0; ci = imgs[i++];) {
                            var src = ci.getAttribute("_src") || ci.src || "";
                            src == imgStr && (remoteImageErrorPlaceholder(ci), me.fireEvent("catchRemoteImageError", ci))
                        }
                        failedImageCount += 1, me.fireEvent("catchremotedone")
                    }
                })
        }))
    }, UE.plugin.register("snapscreen", function () {
        function getLocation(url) {
            var search, a = document.createElement("a"),
                params = utils.serializeParam(me.queryCommandValue("serverparam")) || "";
            return a.href = url, browser.ie && (a.href = a.href), search = a.search, params && (search = search + (-1 ==
                search.indexOf("?") ? "?" : "&") + params, search = search.replace(/[&]+/gi, "&")), {
                port: a.port,
                hostname: a.hostname,
                path: a.pathname + search || +a.hash
            }
        }
        var me = this,
            snapplugin;
        return {
            commands: {
                snapscreen: {
                    execCommand: function (cmd) {
                        function onSuccess(rs) {
                            try {
                                if (rs = eval("(" + rs + ")"), "SUCCESS" == rs.state) {
                                    var opt = me.options;
                                    me.execCommand("insertimage", {
                                        src: opt.snapscreenUrlPrefix + rs.url,
                                        _src: opt.snapscreenUrlPrefix + rs.url,
                                        alt: rs.title || "",
                                        floatStyle: opt.snapscreenImgAlign
                                    })
                                } else alert(rs.state)
                            } catch (e) {
                                alert(lang.callBackErrorMsg)
                            }
                        }
                        var url, local, res, lang = me.getLang("snapScreen_plugin");
                        if (!snapplugin) {
                            var container = me.container,
                                doc = me.container.ownerDocument || me.container.document;
                            snapplugin = doc.createElement("object");
                            try {
                                snapplugin.type = "application/x-pluginbaidusnap"
                            } catch (e) {
                                return
                            }
                            snapplugin.style.cssText = "position:absolute;left:-9999px;width:0;height:0;", snapplugin.setAttribute(
                                "width", "0"), snapplugin.setAttribute("height", "0"), container.appendChild(snapplugin)
                        }
                        url = me.getActionUrl(me.getOpt("snapscreenActionName")), local = getLocation(url), setTimeout(function () {
                            try {
                                res = snapplugin.saveSnapshot(local.hostname, local.path, local.port)
                            } catch (e) {
                                return void me.ui._dialogs.snapscreenDialog.open()
                            }
                            onSuccess(res)
                        }, 50)
                    },
                    queryCommandState: function () {
                        return -1 != navigator.userAgent.indexOf("Windows", 0) ? 0 : -1
                    }
                }
            }
        }
    }), UE.commands.insertparagraph = {
        execCommand: function (cmdName, front) {
            for (var tmpNode, me = this, range = me.selection.getRange(), start = range.startContainer; start && !
                domUtils.isBody(start);) tmpNode = start, start = start.parentNode;
            if (tmpNode) {
                var p = me.document.createElement("p");
                front ? tmpNode.parentNode.insertBefore(p, tmpNode) : tmpNode.parentNode.insertBefore(p, tmpNode.nextSibling),
                    domUtils.fillNode(me.document, p), range.setStart(p, 0).setCursor(!1, !0)
            }
        }
    }, UE.plugin.register("webapp", function () {
        function createInsertStr(obj, toEmbed) {
            return toEmbed ? '<iframe class="edui-faked-webapp" title="' + obj.title + '" ' + (obj.align && !obj.cssfloat ?
                'align="' + obj.align + '"' : "") + (obj.cssfloat ? 'style="float:' + obj.cssfloat + '"' : "") +
                'width="' + obj.width + '" height="' + obj.height + '"  scrolling="no" frameborder="0" src="' + obj.url +
                '" logo_url = "' + obj.logo + '"></iframe>' : '<img title="' + obj.title + '" width="' + obj.width +
                '" height="' + obj.height + '" src="' + me.options.UEDITOR_HOME_URL +
                'themes/default/images/spacer.gif" _logo_url="' + obj.logo + '" style="background:url(' + obj.logo +
                ') no-repeat center center; border:1px solid gray;" class="edui-faked-webapp" _url="' + obj.url + '" ' +
                (obj.align && !obj.cssfloat ? 'align="' + obj.align + '"' : "") + (obj.cssfloat ? 'style="float:' + obj
                .cssfloat + '"' : "") + "/>"
        }
        var me = this;
        return {
            outputRule: function (root) {
                utils.each(root.getNodesByTagName("img"), function (node) {
                    var html;
                    if ("edui-faked-webapp" == node.getAttr("class")) {
                        html = createInsertStr({
                            title: node.getAttr("title"),
                            width: node.getAttr("width"),
                            height: node.getAttr("height"),
                            align: node.getAttr("align"),
                            cssfloat: node.getStyle("float"),
                            url: node.getAttr("_url"),
                            logo: node.getAttr("_logo_url")
                        }, !0);
                        var embed = UE.uNode.createElement(html);
                        node.parentNode.replaceChild(embed, node)
                    }
                })
            },
            inputRule: function (root) {
                utils.each(root.getNodesByTagName("iframe"), function (node) {
                    if ("edui-faked-webapp" == node.getAttr("class")) {
                        var img = UE.uNode.createElement(createInsertStr({
                            title: node.getAttr("title"),
                            width: node.getAttr("width"),
                            height: node.getAttr("height"),
                            align: node.getAttr("align"),
                            cssfloat: node.getStyle("float"),
                            url: node.getAttr("src"),
                            logo: node.getAttr("logo_url")
                        }));
                        node.parentNode.replaceChild(img, node)
                    }
                })
            },
            commands: {
                webapp: {
                    execCommand: function (cmd, obj) {
                        var me = this,
                            str = createInsertStr(utils.extend(obj, {
                                align: "none"
                            }), !1);
                        me.execCommand("inserthtml", str)
                    },
                    queryCommandState: function () {
                        var me = this,
                            img = me.selection.getRange().getClosedNode(),
                            flag = img && "edui-faked-webapp" == img.className;
                        return flag ? 1 : 0
                    }
                }
            }
        }
    }), UE.plugins.template = function () {
        UE.commands.template = {
            execCommand: function (cmd, obj) {
                obj.html && this.execCommand("inserthtml", obj.html)
            }
        }, this.addListener("click", function (type, evt) {
            var el = evt.target || evt.srcElement,
                range = this.selection.getRange(),
                tnode = domUtils.findParent(el, function (node) {
                    return node.className && domUtils.hasClass(node, "ue_t") ? node : void 0
                }, !0);
            tnode && range.selectNode(tnode).shrinkBoundary().select()
        }), this.addListener("keydown", function (type, evt) {
            var range = this.selection.getRange();
            if (!range.collapsed && !(evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.altKey)) {
                var tnode = domUtils.findParent(range.startContainer, function (node) {
                    return node.className && domUtils.hasClass(node, "ue_t") ? node : void 0
                }, !0);
                tnode && domUtils.removeClasses(tnode, ["ue_t"])
            }
        })
    }, UE.plugin.register("music", function () {
        function creatInsertStr(url, width, height, align, cssfloat, toEmbed) {
            return toEmbed ?
                '<embed type="application/x-shockwave-flash" class="edui-faked-music" pluginspage="http://www.macromedia.com/go/getflashplayer" src="' +
                url + '" width="' + width + '" height="' + height + '" ' + (align && !cssfloat ? 'align="' + align +
                '"' : "") + (cssfloat ? 'style="float:' + cssfloat + '"' : "") +
                ' wmode="transparent" play="true" loop="false" menu="false" allowscriptaccess="never" allowfullscreen="true" >' :
                "<img " + (align && !cssfloat ? 'align="' + align + '"' : "") + (cssfloat ? 'style="float:' + cssfloat +
                '"' : "") + ' width="' + width + '" height="' + height + '" _url="' + url +
                '" class="edui-faked-music" src="' + me.options.langPath + me.options.lang + '/images/music.png" />'
        }
        var me = this;
        return {
            outputRule: function (root) {
                utils.each(root.getNodesByTagName("img"), function (node) {
                    var html;
                    if ("edui-faked-music" == node.getAttr("class")) {
                        var cssfloat = node.getStyle("float"),
                            align = node.getAttr("align");
                        html = creatInsertStr(node.getAttr("_url"), node.getAttr("width"), node.getAttr("height"),
                            align, cssfloat, !0);
                        var embed = UE.uNode.createElement(html);
                        node.parentNode.replaceChild(embed, node)
                    }
                })
            },
            inputRule: function (root) {
                utils.each(root.getNodesByTagName("embed"), function (node) {
                    if ("edui-faked-music" == node.getAttr("class")) {
                        var cssfloat = node.getStyle("float"),
                            align = node.getAttr("align");
                        html = creatInsertStr(node.getAttr("src"), node.getAttr("width"), node.getAttr("height"), align,
                            cssfloat, !1);
                        var img = UE.uNode.createElement(html);
                        node.parentNode.replaceChild(img, node)
                    }
                })
            },
            commands: {
                music: {
                    execCommand: function (cmd, musicObj) {
                        var me = this,
                            str = creatInsertStr(musicObj.url, musicObj.width || 400, musicObj.height || 95, "none", !1);
                        me.execCommand("inserthtml", str)
                    },
                    queryCommandState: function () {
                        var me = this,
                            img = me.selection.getRange().getClosedNode(),
                            flag = img && "edui-faked-music" == img.className;
                        return flag ? 1 : 0
                    }
                }
            }
        }
    }), UE.plugin.register("autoupload", function () {
        function sendAndInsertFile(file, editor) {
            var fieldName, urlPrefix, maxSize, allowFiles, actionUrl, loadingHtml, errorHandler, successHandler, me =
                    editor,
                filetype = /image\/\w+/i.test(file.type) ? "image" : "file",
                loadingId = "loading_" + (+new Date).toString(36);
            fieldName = me.getOpt(filetype + "FieldName"), urlPrefix = me.getOpt(filetype + "UrlPrefix"), maxSize = me.getOpt(
                filetype + "MaxSize"), allowFiles = me.getOpt(filetype + "AllowFiles"), actionUrl = me.getActionUrl(me.getOpt(
                filetype + "ActionName")), errorHandler = function (title) {
                var loader = me.document.getElementById(loadingId);
                loader && domUtils.remove(loader), me.fireEvent("showmessage", {
                    id: loadingId,
                    content: title,
                    type: "error",
                    timeout: 4e3
                })
            };
            var spacerSrc = me.options.themePath + me.options.theme + "/images/spacer.gif";
            if ("image" == filetype ? (loadingHtml = UE.ui.uiUtils.buildImgHtml(spacerSrc, {
                id: loadingId,
                className: "loadingclass"
            }), successHandler = function (data) {
                var link = urlPrefix + data.url,
                    loader = me.document.getElementById(loadingId);
                loader && (loader.setAttribute("src", link), loader.setAttribute("_src", link), loader.setAttribute(
                    "title", data.title || ""), loader.setAttribute("alt", data.original || ""), loader.removeAttribute(
                    "id"), domUtils.removeClasses(loader, "loadingclass"))
            }) : (loadingHtml = '<p><img class="loadingclass" id="' + loadingId + '" src="' + spacerSrc + '" title="' +
                (me.getLang("autoupload.loading") || "") + '" ></p>', successHandler = function (data) {
                var link = urlPrefix + data.url,
                    loader = me.document.getElementById(loadingId),
                    rng = me.selection.getRange(),
                    bk = rng.createBookmark();
                rng.selectNode(loader).select(), me.execCommand("insertfile", {
                    url: link
                }), rng.moveToBookmark(bk).select()
            }), me.execCommand("inserthtml", loadingHtml), !me.getOpt(filetype + "ActionName")) return void errorHandler(
                    me.getLang("autoupload.errorLoadConfig"));
            if (file.size > maxSize) return void errorHandler(me.getLang("autoupload.exceedSizeError"));
            var fileext = file.name ? file.name.substr(file.name.lastIndexOf(".")) : "";
            if (fileext && "image" != filetype || allowFiles && -1 == (allowFiles.join("") + ".").indexOf(fileext.toLowerCase() +
                ".")) return void errorHandler(me.getLang("autoupload.exceedTypeError"));
            var xhr = new XMLHttpRequest,
                fd = new FormData,
                params = utils.serializeParam(me.queryCommandValue("serverparam")) || "",
                url = utils.formatUrl(actionUrl + (-1 == actionUrl.indexOf("?") ? "?" : "&") + params);
            fd.append(fieldName, file, file.name || "blob." + file.type.substr("image/".length)), fd.append("type",
                "ajax"), xhr.open("post", url, !0), xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"), xhr.addEventListener(
                "load", function (e) {
                try {
                    var json = new Function("return " + utils.trim(e.target.response))();
                    "SUCCESS" == json.state && json.url ? successHandler(json) : errorHandler(json.state)
                } catch (er) {
                    errorHandler(me.getLang("autoupload.loadError"))
                }
            }), xhr.send(fd)
        }
        function getPasteImage(e) {
            return e.clipboardData && e.clipboardData.items && 1 == e.clipboardData.items.length && /^image\//.test(e.clipboardData
                .items[0].type) ? e.clipboardData.items : null
        }
        function getDropImage(e) {
            return e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files : null
        }
        return {
            outputRule: function (root) {
                utils.each(root.getNodesByTagName("img"), function (n) {
                    /\b(loaderrorclass)|(bloaderrorclass)\b/.test(n.getAttr("class")) && n.parentNode.removeChild(n)
                }), utils.each(root.getNodesByTagName("p"), function (n) {
                    /\bloadpara\b/.test(n.getAttr("class")) && n.parentNode.removeChild(n)
                })
            },
            bindEvents: {
                ready: function () {
                    var me = this;
                    window.FormData && window.FileReader && (domUtils.on(me.body, "paste drop", function (e) {
                        var items, hasImg = !1;
                        if (items = "paste" == e.type ? getPasteImage(e) : getDropImage(e)) {
                            for (var file, len = items.length; len--;) file = items[len], file.getAsFile && (file =
                                    file.getAsFile()), file && file.size > 0 && (sendAndInsertFile(file, me), hasImg = !
                                    0);
                            hasImg && e.preventDefault()
                        }
                    }), domUtils.on(me.body, "dragover", function (e) {
                        "Files" == e.dataTransfer.types[0] && e.preventDefault()
                    }), utils.cssRule("loading", ".loadingclass{display:inline-block;cursor:default;background: url('" +
                        this.options.themePath + this.options.theme +
                        "/images/loading.gif') no-repeat center center transparent;border:1px solid #cccccc;margin-left:1px;height: 22px;width: 22px;}\n.loaderrorclass{display:inline-block;cursor:default;background: url('" +
                        this.options.themePath + this.options.theme +
                        "/images/loaderror.png') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;}",
                        this.document))
                }
            }
        }
    }), UE.plugin.register("autosave", function () {
        function save(editor) {
            var saveData;
            if (!(new Date - lastSaveTime < MIN_TIME)) {
                if (!editor.hasContents()) return void(saveKey && me.removePreferences(saveKey));
                lastSaveTime = new Date, editor._saveFlag = null, saveData = me.body.innerHTML, editor.fireEvent(
                    "beforeautosave", {
                    content: saveData
                }) !== !1 && (me.setPreferences(saveKey, saveData), editor.fireEvent("afterautosave", {
                    content: saveData
                }))
            }
        }
        var me = this,
            lastSaveTime = new Date,
            MIN_TIME = 20,
            saveKey = null;
        return {
            defaultOptions: {
                saveInterval: 500
            },
            bindEvents: {
                ready: function () {
                    var _suffix = "-drafts-data",
                        key = null;
                    key = me.key ? me.key + _suffix : (me.container.parentNode.id || "ue-common") + _suffix, saveKey =
                        (location.protocol + location.host + location.pathname).replace(/[.:\/]/g, "_") + key
                },
                contentchange: function () {
                    saveKey && (me._saveFlag && window.clearTimeout(me._saveFlag), me.options.saveInterval > 0 ? me._saveFlag =
                        window.setTimeout(function () {
                        save(me)
                    }, me.options.saveInterval) : save(me))
                }
            },
            commands: {
                clearlocaldata: {
                    execCommand: function () {
                        saveKey && me.getPreferences(saveKey) && me.removePreferences(saveKey)
                    },
                    notNeedUndo: !0,
                    ignoreContentChange: !0
                },
                getlocaldata: {
                    execCommand: function () {
                        return saveKey ? me.getPreferences(saveKey) || "" : ""
                    },
                    notNeedUndo: !0,
                    ignoreContentChange: !0
                },
                drafts: {
                    execCommand: function () {
                        saveKey && (me.body.innerHTML = me.getPreferences(saveKey) || "<p>" + domUtils.fillHtml +
                            "</p>", me.focus(!0))
                    },
                    queryCommandState: function () {
                        return saveKey ? null === me.getPreferences(saveKey) ? -1 : 0 : -1
                    },
                    notNeedUndo: !0,
                    ignoreContentChange: !0
                }
            }
        }
    }), UE.plugin.register("charts", function () {
        function validData(table) {
            var firstRows = null,
                cellCount = 0;
            if (table.rows.length < 2) return !1;
            if (table.rows[0].cells.length < 2) return !1;
            firstRows = table.rows[0].cells, cellCount = firstRows.length;
            for (var cell, i = 0; cell = firstRows[i]; i++) if ("th" !== cell.tagName.toLowerCase()) return !1;
            for (var row, i = 1; row = table.rows[i]; i++) {
                if (row.cells.length != cellCount) return !1;
                if ("th" !== row.cells[0].tagName.toLowerCase()) return !1;
                for (var cell, j = 1; cell = row.cells[j]; j++) {
                    var value = utils.trim(cell.innerText || cell.textContent || "");
                    if (value = value.replace(new RegExp(UE.dom.domUtils.fillChar, "g"), "").replace(/^\s+|\s+$/g, ""), !
                        /^\d*\.?\d+$/.test(value)) return !1
                }
            }
            return !0
        }
        var me = this;
        return {
            bindEvents: {
                chartserror: function () {}
            },
            commands: {
                charts: {
                    execCommand: function (cmd, data) {
                        var tableNode = domUtils.findParentByTagName(this.selection.getRange().startContainer, "table", !
                            0),
                            flagText = [],
                            config = {};
                        if (!tableNode) return !1;
                        if (!validData(tableNode)) return me.fireEvent("chartserror"), !1;
                        config.title = data.title || "", config.subTitle = data.subTitle || "", config.xTitle = data.xTitle ||
                            "", config.yTitle = data.yTitle || "", config.suffix = data.suffix || "", config.tip = data
                            .tip || "", config.dataFormat = data.tableDataFormat || "", config.chartType = data.chartType ||
                            0;
                        for (var key in config) config.hasOwnProperty(key) && flagText.push(key + ":" + config[key]);
                        tableNode.setAttribute("data-chart", flagText.join(";")), domUtils.addClass(tableNode,
                            "edui-charts-table")
                    },
                    queryCommandState: function () {
                        var tableNode = domUtils.findParentByTagName(this.selection.getRange().startContainer, "table", !
                            0);
                        return tableNode && validData(tableNode) ? 0 : -1
                    }
                }
            },
            inputRule: function (root) {
                utils.each(root.getNodesByTagName("table"), function (tableNode) {
                    void 0 !== tableNode.getAttr("data-chart") && tableNode.setAttr("style")
                })
            },
            outputRule: function (root) {
                utils.each(root.getNodesByTagName("table"), function (tableNode) {
                    void 0 !== tableNode.getAttr("data-chart") && tableNode.setAttr("style", "display: none;")
                })
            }
        }
    }), UE.plugin.register("section", function () {
        function Section() {
            this.tag = "", this.level = -1, this.dom = null, this.nextSection = null, this.previousSection = null, this
                .parentSection = null, this.startAddress = [], this.endAddress = [], this.children = []
        }
        function getSection(option) {
            var section = new Section;
            return utils.extend(section, option)
        }
        function getNodeFromAddress(startAddress, root) {
            for (var current = root, i = 0; i < startAddress.length; i++) {
                if (!current.childNodes) return null;
                current = current.childNodes[startAddress[i]]
            }
            return current
        }
        var me = this;
        return {
            bindMultiEvents: {
                type: "aftersetcontent afterscencerestore",
                handler: function () {
                    me.fireEvent("updateSections")
                }
            },
            bindEvents: {
                ready: function () {
                    me.fireEvent("updateSections"), domUtils.on(me.body, "drop paste", function () {
                        me.fireEvent("updateSections")
                    })
                },
                afterexeccommand: function (type, cmd) {
                    "paragraph" == cmd && me.fireEvent("updateSections")
                },
                keyup: function (type, e) {
                    var me = this,
                        range = me.selection.getRange();
                    if (1 != range.collapsed) me.fireEvent("updateSections");
                    else {
                        var keyCode = e.keyCode || e.which;
                        (13 == keyCode || 8 == keyCode || 46 == keyCode) && me.fireEvent("updateSections")
                    }
                }
            },
            commands: {
                getsections: {
                    execCommand: function (cmd, levels) {
                        function getSectionLevel(node) {
                            for (var i = 0; i < levelFn.length; i++) if (levelFn[i](node)) return i;
                            return -1
                        }
                        function traversal(node, Directory) {
                            for (var level, parent, child, tmpSection = null, children = node.childNodes, i = 0, len =
                                    children.length; len > i; i++) if (child = children[i], level = getSectionLevel(
                                    child), level >= 0) {
                                    var address = me.selection.getRange().selectNode(child).createAddress(!0).startAddress,
                                        current = getSection({
                                            tag: child.tagName,
                                            title: child.innerText || child.textContent || "",
                                            level: level,
                                            dom: child,
                                            startAddress: utils.clone(address, []),
                                            endAddress: utils.clone(address, []),
                                            children: []
                                        });
                                    for (previous.nextSection = current, current.previousSection = previous, parent =
                                        previous; level <= parent.level;) parent = parent.parentSection;
                                    current.parentSection = parent, parent.children.push(current), tmpSection =
                                        previous = current
                                } else 1 === child.nodeType && traversal(child, Directory), tmpSection && tmpSection.endAddress[
                                        tmpSection.endAddress.length - 1]++
                        }
                        for (var levelFn = levels || ["h1", "h2", "h3", "h4", "h5", "h6"], i = 0; i < levelFn.length; i++)
                            "string" == typeof levelFn[i] ? levelFn[i] = function (fn) {
                                return function (node) {
                                    return node.tagName == fn.toUpperCase()
                                }
                        }(levelFn[i]): "function" != typeof levelFn[i] && (levelFn[i] = function () {
                            return null
                        });
                        var me = this,
                            Directory = getSection({
                                level: -1,
                                title: "root"
                            }),
                            previous = Directory;
                        return traversal(me.body, Directory), Directory
                    },
                    notNeedUndo: !0
                },
                movesection: {
                    execCommand: function (cmd, sourceSection, targetSection, isAfter) {
                        function isContainsAddress(startAddress, endAddress, addressTarget) {
                            for (var isAfterStartAddress = !1, isBeforeEndAddress = !1, i = 0; i < startAddress.length && !
                                (i >= addressTarget.length); i++) {
                                if (addressTarget[i] > startAddress[i]) {
                                    isAfterStartAddress = !0;
                                    break
                                }
                                if (addressTarget[i] < startAddress[i]) break
                            }
                            for (var i = 0; i < endAddress.length && !(i >= addressTarget.length); i++) {
                                if (addressTarget[i] < startAddress[i]) {
                                    isBeforeEndAddress = !0;
                                    break
                                }
                                if (addressTarget[i] > startAddress[i]) break
                            }
                            return isAfterStartAddress && isBeforeEndAddress
                        }
                        var targetAddress, target, me = this;
                        if (sourceSection && targetSection && -1 != targetSection.level && (targetAddress = isAfter ?
                            targetSection.endAddress : targetSection.startAddress, target = getNodeFromAddress(
                            targetAddress, me.body), targetAddress && target && !isContainsAddress(sourceSection.startAddress,
                            sourceSection.endAddress, targetAddress))) {
                            var current, nextNode, startNode = getNodeFromAddress(sourceSection.startAddress, me.body),
                                endNode = getNodeFromAddress(sourceSection.endAddress, me.body);
                            if (isAfter) for (current = endNode; current && !(domUtils.getPosition(startNode, current) &
                                    domUtils.POSITION_FOLLOWING) && (nextNode = current.previousSibling, domUtils.insertAfter(
                                    target, current), current != startNode);) current = nextNode;
                            else for (current = startNode; current && !(domUtils.getPosition(current, endNode) &
                                    domUtils.POSITION_FOLLOWING) && (nextNode = current.nextSibling, target.parentNode.insertBefore(
                                    current, target), current != endNode);) current = nextNode;
                            me.fireEvent("updateSections")
                        }
                    }
                },
                deletesection: {
                    execCommand: function (cmd, section, keepChildren) {
                        function getNodeFromAddress(startAddress) {
                            for (var current = me.body, i = 0; i < startAddress.length; i++) {
                                if (!current.childNodes) return null;
                                current = current.childNodes[startAddress[i]]
                            }
                            return current
                        }
                        var me = this;
                        if (section) {
                            var nextNode, startNode = getNodeFromAddress(section.startAddress),
                                endNode = getNodeFromAddress(section.endAddress),
                                current = startNode;
                            if (keepChildren) domUtils.remove(current);
                            else for (; current && domUtils.inDoc(endNode, me.document) && !(domUtils.getPosition(
                                    current, endNode) & domUtils.POSITION_FOLLOWING);) nextNode = current.nextSibling,
                                        domUtils.remove(current), current = nextNode;
                            me.fireEvent("updateSections")
                        }
                    }
                },
                selectsection: {
                    execCommand: function (cmd, section) {
                        if (!section && !section.dom) return !1;
                        var me = this,
                            range = me.selection.getRange(),
                            address = {
                                startAddress: utils.clone(section.startAddress, []),
                                endAddress: utils.clone(section.endAddress, [])
                            };
                        return address.endAddress[address.endAddress.length - 1]++, range.moveToAddress(address).select()
                            .scrollToView(), !0
                    },
                    notNeedUndo: !0
                },
                scrolltosection: {
                    execCommand: function (cmd, section) {
                        if (!section && !section.dom) return !1;
                        var me = this,
                            range = me.selection.getRange(),
                            address = {
                                startAddress: section.startAddress,
                                endAddress: section.endAddress
                            };
                        return address.endAddress[address.endAddress.length - 1]++, range.moveToAddress(address).scrollToView(), !
                            0
                    },
                    notNeedUndo: !0
                }
            }
        }
    }), UE.plugin.register("simpleupload", function () {
        function initUploadBtn() {
            var w = containerBtn.offsetWidth || 20,
                h = containerBtn.offsetHeight || 20,
                btnIframe = document.createElement("iframe"),
                btnStyle = "display:block;width:" + w + "px;height:" + h +
                    "px;overflow:hidden;border:0;margin:0;padding:0;position:absolute;top:0;left:0;filter:alpha(opacity=0);-moz-opacity:0;-khtml-opacity: 0;opacity: 0;cursor:pointer;";
            domUtils.on(btnIframe, "load", function () {
                var wrapper, btnIframeDoc, btnIframeBody, timestrap = (+new Date).toString(36);
                btnIframeDoc = btnIframe.contentDocument || btnIframe.contentWindow.document, btnIframeBody =
                    btnIframeDoc.body, wrapper = btnIframeDoc.createElement("div"), wrapper.innerHTML =
                    '<form id="edui_form_' + timestrap + '" target="edui_iframe_' + timestrap +
                    '" method="POST" enctype="multipart/form-data" action="' + me.getOpt("serverUrl") + '" style="' +
                    btnStyle + '"><input id="edui_input_' + timestrap + '" type="file" accept="image/*" name="' + me.options
                    .imageFieldName + '" style="' + btnStyle + '"></form><iframe id="edui_iframe_' + timestrap +
                    '" name="edui_iframe_' + timestrap +
                    '" style="display:none;width:0;height:0;border:0;margin:0;padding:0;position:absolute;"></iframe>',
                    wrapper.className = "edui-" + me.options.theme, wrapper.id = me.ui.id + "_iframeupload",
                    btnIframeBody.style.cssText = btnStyle, btnIframeBody.style.width = w + "px", btnIframeBody.style.height =
                    h + "px", btnIframeBody.appendChild(wrapper), btnIframeBody.parentNode && (btnIframeBody.parentNode
                    .style.width = w + "px", btnIframeBody.parentNode.style.height = w + "px");
                var form = btnIframeDoc.getElementById("edui_form_" + timestrap),
                    input = btnIframeDoc.getElementById("edui_input_" + timestrap),
                    iframe = btnIframeDoc.getElementById("edui_iframe_" + timestrap);
                domUtils.on(input, "change", function () {
                    function callback() {
                        try {
                            var link, json, loader, body = (iframe.contentDocument || iframe.contentWindow.document).body,
                                result = body.innerText || body.textContent || "";
                            json = new Function("return " + result)(), link = me.options.imageUrlPrefix + json.url,
                                "SUCCESS" == json.state && json.url ? (loader = me.document.getElementById(loadingId),
                                loader.setAttribute("src", link), loader.setAttribute("_src", link), loader.setAttribute(
                                "title", json.title || ""), loader.setAttribute("alt", json.original || ""), loader.removeAttribute(
                                "id"), domUtils.removeClasses(loader, "loadingclass")) : showErrorLoader &&
                                showErrorLoader(json.state)
                        } catch (er) {
                            showErrorLoader && showErrorLoader(me.getLang("simpleupload.loadError"))
                        }
                        form.reset(), domUtils.un(iframe, "load", callback)
                    }
                    function showErrorLoader(title) {
                        if (loadingId) {
                            var loader = me.document.getElementById(loadingId);
                            loader && domUtils.remove(loader), me.fireEvent("showmessage", {
                                id: loadingId,
                                content: title,
                                type: "error",
                                timeout: 4e3
                            })
                        }
                    }
                    if (input.value) {
                        var loadingId = "loading_" + (+new Date).toString(36),
                            params = utils.serializeParam(me.queryCommandValue("serverparam")) || "",
                            imageActionUrl = me.getActionUrl(me.getOpt("imageActionName")),
                            allowFiles = me.getOpt("imageAllowFiles");
                        if (me.focus(), me.execCommand("inserthtml", '<img class="loadingclass" id="' + loadingId +
                            '" src="' + me.options.themePath + me.options.theme + '/images/spacer.gif" title="' + (me.getLang(
                            "simpleupload.loading") || "") + '" >'), !me.getOpt("imageActionName")) return void errorHandler(
                                me.getLang("autoupload.errorLoadConfig"));
                        var filename = input.value,
                            fileext = filename ? filename.substr(filename.lastIndexOf(".")) : "";
                        if (!fileext || allowFiles && -1 == (allowFiles.join("") + ".").indexOf(fileext.toLowerCase() +
                            ".")) return void showErrorLoader(me.getLang("simpleupload.exceedTypeError"));
                        domUtils.on(iframe, "load", callback), form.action = utils.formatUrl(imageActionUrl + (-1 ==
                            imageActionUrl.indexOf("?") ? "?" : "&") + params), form.submit()
                    }
                });
                var stateTimer;
                me.addListener("selectionchange", function () {
                    clearTimeout(stateTimer), stateTimer = setTimeout(function () {
                        var state = me.queryCommandState("simpleupload");
                        input.disabled = -1 == state ? "disabled" : !1
                    }, 400)
                }), isLoaded = !0
            }), btnIframe.style.cssText = btnStyle, containerBtn.appendChild(btnIframe)
        }
        var containerBtn, me = this,
            isLoaded = !1;
        return {
            bindEvents: {
                ready: function () {
                    utils.cssRule("loading", ".loadingclass{display:inline-block;cursor:default;background: url('" +
                        this.options.themePath + this.options.theme +
                        "/images/loading.gif') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;}\n.loaderrorclass{display:inline-block;cursor:default;background: url('" +
                        this.options.themePath + this.options.theme +
                        "/images/loaderror.png') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;}",
                        this.document)
                },
                simpleuploadbtnready: function (type, container) {
                    containerBtn = container, me.afterConfigReady(initUploadBtn)
                }
            },
            outputRule: function (root) {
                utils.each(root.getNodesByTagName("img"), function (n) {
                    /\b(loaderrorclass)|(bloaderrorclass)\b/.test(n.getAttr("class")) && n.parentNode.removeChild(n)
                })
            },
            commands: {
                simpleupload: {
                    queryCommandState: function () {
                        return isLoaded ? 0 : -1
                    }
                }
            }
        }
    }), UE.plugin.register("serverparam", function () {
        var serverParam = {};
        return {
            commands: {
                serverparam: {
                    execCommand: function (cmd, key, value) {
                        void 0 === key || null === key ? serverParam = {} : utils.isString(key) ? void 0 === value ||
                            null === value ? delete serverParam[key] : serverParam[key] = value : utils.isObject(key) ?
                            utils.extend(serverParam, key, !0) : utils.isFunction(key) && utils.extend(serverParam, key(), !
                            0)
                    },
                    queryCommandValue: function () {
                        return serverParam || {}
                    }
                }
            }
        }
    }), UE.plugin.register("insertfile", function () {
        function getFileIcon(url) {
            var ext = url.substr(url.lastIndexOf(".") + 1).toLowerCase(),
                maps = {
                    rar: "icon_rar.gif",
                    zip: "icon_rar.gif",
                    tar: "icon_rar.gif",
                    gz: "icon_rar.gif",
                    bz2: "icon_rar.gif",
                    doc: "icon_doc.gif",
                    docx: "icon_doc.gif",
                    pdf: "icon_pdf.gif",
                    mp3: "icon_mp3.gif",
                    xls: "icon_xls.gif",
                    chm: "icon_chm.gif",
                    ppt: "icon_ppt.gif",
                    pptx: "icon_ppt.gif",
                    avi: "icon_mv.gif",
                    rmvb: "icon_mv.gif",
                    wmv: "icon_mv.gif",
                    flv: "icon_mv.gif",
                    swf: "icon_mv.gif",
                    rm: "icon_mv.gif",
                    exe: "icon_exe.gif",
                    psd: "icon_psd.gif",
                    txt: "icon_txt.gif",
                    jpg: "icon_jpg.gif",
                    png: "icon_jpg.gif",
                    jpeg: "icon_jpg.gif",
                    gif: "icon_jpg.gif",
                    ico: "icon_jpg.gif",
                    bmp: "icon_jpg.gif"
                };
            return maps[ext] ? maps[ext] : maps.txt
        }
        var me = this;
        return {
            commands: {
                insertfile: {
                    execCommand: function (command, filelist) {
                        filelist = utils.isArray(filelist) ? filelist : [filelist];
                        var i, item, icon, title, html = "",
                            URL = me.getOpt("UEDITOR_HOME_URL"),
                            iconDir = URL + ("/" == URL.substr(URL.length - 1) ? "" : "/") +
                                "dialogs/attachment/fileTypeImages/";
                        for (i = 0; i < filelist.length; i++) item = filelist[i], icon = iconDir + getFileIcon(item.url),
                                title = item.title || item.url.substr(item.url.lastIndexOf("/") + 1), html +=
                                '<p style="line-height: 16px;"><img style="vertical-align: middle; margin-right: 2px;" src="' +
                                icon + '" _src="' + icon + '" /><a style="font-size:12px; color:#0066cc;" href="' +
                                item.url + '" title="' + title + '">' + title + "</a></p>";
                        me.execCommand("insertHtml", html)
                    }
                }
            }
        }
    });
    var baidu = baidu || {};
    baidu.editor = baidu.editor || {}, UE.ui = baidu.editor.ui = {},
    function () {
        function updateFixedOffset() {
            var layer = document.getElementById("edui_fixedlayer");
            uiUtils.setViewportOffset(layer, {
                left: 0,
                top: 0
            })
        }
        function bindFixedLayer() {
            domUtils.on(window, "scroll", updateFixedOffset), domUtils.on(window, "resize", baidu.editor.utils.defer(
                updateFixedOffset, 0, !0))
        }
        var browser = baidu.editor.browser,
            domUtils = baidu.editor.dom.domUtils,
            magic = "$EDITORUI",
            root = window[magic] = {}, uidMagic = "ID" + magic,
            uidCount = 0,
            uiUtils = baidu.editor.ui.uiUtils = {
                uid: function (obj) {
                    return obj ? obj[uidMagic] || (obj[uidMagic] = ++uidCount) : ++uidCount
                },
                hook: function (fn, callback) {
                    var dg;
                    return fn && fn._callbacks ? dg = fn : (dg = function () {
                        var q;
                        fn && (q = fn.apply(this, arguments));
                        for (var callbacks = dg._callbacks, k = callbacks.length; k--;) {
                            var r = callbacks[k].apply(this, arguments);
                            void 0 === q && (q = r)
                        }
                        return q
                    }, dg._callbacks = []), dg._callbacks.push(callback), dg
                },
                createElementByHtml: function (html) {
                    var el = document.createElement("div");
                    return el.innerHTML = html, el = el.firstChild, el.parentNode.removeChild(el), el
                },
                getViewportElement: function () {
                    return browser.ie && browser.quirks ? document.body : document.documentElement
                },
                getClientRect: function (element) {
                    var bcr;
                    try {
                        bcr = element.getBoundingClientRect()
                    } catch (e) {
                        bcr = {
                            left: 0,
                            top: 0,
                            height: 0,
                            width: 0
                        }
                    }
                    for (var doc, rect = {
                            left: Math.round(bcr.left),
                            top: Math.round(bcr.top),
                            height: Math.round(bcr.bottom - bcr.top),
                            width: Math.round(bcr.right - bcr.left)
                        };
                    (doc = element.ownerDocument) !== document && (element = domUtils.getWindow(doc).frameElement);) bcr =
                            element.getBoundingClientRect(), rect.left += bcr.left, rect.top += bcr.top;
                    return rect.bottom = rect.top + rect.height, rect.right = rect.left + rect.width, rect
                },
                getViewportRect: function () {
                    var viewportEl = uiUtils.getViewportElement(),
                        width = 0 | (window.innerWidth || viewportEl.clientWidth),
                        height = 0 | (window.innerHeight || viewportEl.clientHeight);
                    return {
                        left: 0,
                        top: 0,
                        height: height,
                        width: width,
                        bottom: height,
                        right: width
                    }
                },
                setViewportOffset: function (element, offset) {
                    var fixedLayer = uiUtils.getFixedLayer();
                    element.parentNode === fixedLayer ? (element.style.left = offset.left + "px", element.style.top =
                        offset.top + "px") : domUtils.setViewportOffset(element, offset)
                },
                getEventOffset: function (evt) {
                    var el = evt.target || evt.srcElement,
                        rect = uiUtils.getClientRect(el),
                        offset = uiUtils.getViewportOffsetByEvent(evt);
                    return {
                        left: offset.left - rect.left,
                        top: offset.top - rect.top
                    }
                },
                getViewportOffsetByEvent: function (evt) {
                    var el = evt.target || evt.srcElement,
                        frameEl = domUtils.getWindow(el).frameElement,
                        offset = {
                            left: evt.clientX,
                            top: evt.clientY
                        };
                    if (frameEl && el.ownerDocument !== document) {
                        var rect = uiUtils.getClientRect(frameEl);
                        offset.left += rect.left, offset.top += rect.top
                    }
                    return offset
                },
                setGlobal: function (id, obj) {
                    return root[id] = obj, magic + '["' + id + '"]'
                },
                unsetGlobal: function (id) {
                    delete root[id]
                },
                copyAttributes: function (tgt, src) {
                    for (var attributes = src.attributes, k = attributes.length; k--;) {
                        var attrNode = attributes[k];
                        "style" == attrNode.nodeName || "class" == attrNode.nodeName || browser.ie && !attrNode.specified ||
                            tgt.setAttribute(attrNode.nodeName, attrNode.nodeValue)
                    }
                    src.className && domUtils.addClass(tgt, src.className), src.style.cssText && (tgt.style.cssText +=
                        ";" + src.style.cssText)
                },
                removeStyle: function (el, styleName) {
                    if (el.style.removeProperty) el.style.removeProperty(styleName);
                    else {
                        if (!el.style.removeAttribute) throw "";
                        el.style.removeAttribute(styleName)
                    }
                },
                contains: function (elA, elB) {
                    return elA && elB && (elA === elB ? !1 : elA.contains ? elA.contains(elB) : 16 & elA.compareDocumentPosition(
                        elB))
                },
                startDrag: function (evt, callbacks, doc) {
                    function handleMouseMove(evt) {
                        var x = evt.clientX - startX,
                            y = evt.clientY - startY;
                        callbacks.ondragmove(x, y, evt), evt.stopPropagation ? evt.stopPropagation() : evt.cancelBubble = !
                            0;
 
                    }
                    function handleMouseUp() {
                        doc.removeEventListener("mousemove", handleMouseMove, !0), doc.removeEventListener("mouseup",
                            handleMouseUp, !0), window.removeEventListener("mouseup", handleMouseUp, !0), callbacks.ondragstop()
                    }
                    function releaseCaptrue() {
                        elm.releaseCapture(), elm.detachEvent("onmousemove", handleMouseMove), elm.detachEvent(
                            "onmouseup", releaseCaptrue), elm.detachEvent("onlosecaptrue", releaseCaptrue), callbacks.ondragstop()
                    }
                    var doc = doc || document,
                        startX = evt.clientX,
                        startY = evt.clientY;
                    if (doc.addEventListener) doc.addEventListener("mousemove", handleMouseMove, !0), doc.addEventListener(
                            "mouseup", handleMouseUp, !0), window.addEventListener("mouseup", handleMouseUp, !0), evt.preventDefault();
                    else {
                        var elm = evt.srcElement;
                        elm.setCapture(), elm.attachEvent("onmousemove", handleMouseMove), elm.attachEvent("onmouseup",
                            releaseCaptrue), elm.attachEvent("onlosecaptrue", releaseCaptrue), evt.returnValue = !1
                    }
                    callbacks.ondragstart()
                },
                getFixedLayer: function () {
                    var layer = document.getElementById("edui_fixedlayer");
                    return null == layer && (layer = document.createElement("div"), layer.id = "edui_fixedlayer",
                        document.body.appendChild(layer), browser.ie && browser.version <= 8 ? (layer.style.position =
                        "absolute", bindFixedLayer(), setTimeout(updateFixedOffset)) : layer.style.position = "fixed",
                        layer.style.left = "0", layer.style.top = "0", layer.style.width = "0", layer.style.height =
                        "0"), layer
                },
                makeUnselectable: function (element) {
                    if (browser.opera || browser.ie && browser.version < 9) {
                        if (element.unselectable = "on", element.hasChildNodes()) for (var i = 0; i < element.childNodes
                                .length; i++) 1 == element.childNodes[i].nodeType && uiUtils.makeUnselectable(element.childNodes[
                                    i])
                    } else void 0 !== element.style.MozUserSelect ? element.style.MozUserSelect = "none" : void 0 !==
                            element.style.WebkitUserSelect ? element.style.WebkitUserSelect = "none" : void 0 !==
                            element.style.KhtmlUserSelect && (element.style.KhtmlUserSelect = "none")
                }
            }
    }(),
    function () {
        var utils = baidu.editor.utils,
            uiUtils = baidu.editor.ui.uiUtils,
            EventBase = baidu.editor.EventBase,
            UIBase = baidu.editor.ui.UIBase = function () {};
        UIBase.prototype = {
            className: "",
            uiName: "",
            initOptions: function (options) {
                var me = this;
                for (var k in options) me[k] = options[k];
                this.id = this.id || "edui" + uiUtils.uid()
            },
            initUIBase: function () {
                this._globalKey = utils.unhtml(uiUtils.setGlobal(this.id, this))
            },
            render: function (holder) {
                for (var node, html = this.renderHtml(), el = uiUtils.createElementByHtml(html), list = domUtils.getElementsByTagName(
                        el, "*"), theme = "edui-" + (this.theme || this.editor.options.theme), layer = document.getElementById(
                        "edui_fixedlayer"), i = 0; node = list[i++];) domUtils.addClass(node, theme);
                domUtils.addClass(el, theme), layer && (layer.className = "", domUtils.addClass(layer, theme));
                var seatEl = this.getDom();
                null != seatEl ? (seatEl.parentNode.replaceChild(el, seatEl), uiUtils.copyAttributes(el, seatEl)) : (
                    "string" == typeof holder && (holder = document.getElementById(holder)), holder = holder || uiUtils
                    .getFixedLayer(), domUtils.addClass(holder, theme), holder.appendChild(el)), this.postRender()
            },
            getDom: function (name) {
                return document.getElementById(name ? this.id + "_" + name : this.id)
            },
            postRender: function () {
                this.fireEvent("postrender")
            },
            getHtmlTpl: function () {
                return ""
            },
            formatHtml: function (tpl) {
                var prefix = "edui-" + this.uiName;
                return tpl.replace(/##/g, this.id).replace(/%%-/g, this.uiName ? prefix + "-" : "").replace(/%%/g, (
                    this.uiName ? prefix : "") + " " + this.className).replace(/\$\$/g, this._globalKey)
            },
            renderHtml: function () {
                return this.formatHtml(this.getHtmlTpl())
            },
            dispose: function () {
                var box = this.getDom();
                box && baidu.editor.dom.domUtils.remove(box), uiUtils.unsetGlobal(this.id)
            }
        }, utils.inherits(UIBase, EventBase)
    }(),
    function () {
        var utils = baidu.editor.utils,
            UIBase = baidu.editor.ui.UIBase,
            Separator = baidu.editor.ui.Separator = function (options) {
                this.initOptions(options), this.initSeparator()
            };
        Separator.prototype = {
            uiName: "separator",
            initSeparator: function () {
                this.initUIBase()
            },
            getHtmlTpl: function () {
                return '<div id="##" class="edui-box %%"></div>'
            }
        }, utils.inherits(Separator, UIBase)
    }(),
    function () {
        var utils = baidu.editor.utils,
            domUtils = baidu.editor.dom.domUtils,
            UIBase = baidu.editor.ui.UIBase,
            uiUtils = baidu.editor.ui.uiUtils,
            Mask = baidu.editor.ui.Mask = function (options) {
                this.initOptions(options), this.initUIBase()
            };
        Mask.prototype = {
            getHtmlTpl: function () {
                return '<div id="##" class="edui-mask %%" onclick="return $$._onClick(event, this);" onmousedown="return $$._onMouseDown(event, this);"></div>'
            },
            postRender: function () {
                var me = this;
                domUtils.on(window, "resize", function () {
                    setTimeout(function () {
                        me.isHidden() || me._fill()
                    })
                })
            },
            show: function (zIndex) {
                this._fill(), this.getDom().style.display = "", this.getDom().style.zIndex = zIndex
            },
            hide: function () {
                this.getDom().style.display = "none", this.getDom().style.zIndex = ""
            },
            isHidden: function () {
                return "none" == this.getDom().style.display
            },
            _onMouseDown: function () {
                return !1
            },
            _onClick: function (e, target) {
                this.fireEvent("click", e, target)
            },
            _fill: function () {
                var el = this.getDom(),
                    vpRect = uiUtils.getViewportRect();
                el.style.width = vpRect.width + "px", el.style.height = vpRect.height + "px"
            }
        }, utils.inherits(Mask, UIBase)
    }(),
    function () {
        function closeAllPopup(evt, el) {
            for (var i = 0; i < allPopups.length; i++) {
                var pop = allPopups[i];
                if (!pop.isHidden() && pop.queryAutoHide(el) !== !1) {
                    if (evt && /scroll/gi.test(evt.type) && "edui-wordpastepop" == pop.className) return;
                    pop.hide()
                }
            }
            allPopups.length && pop.editor.fireEvent("afterhidepop")
        }
        var utils = baidu.editor.utils,
            uiUtils = baidu.editor.ui.uiUtils,
            domUtils = baidu.editor.dom.domUtils,
            UIBase = baidu.editor.ui.UIBase,
            Popup = baidu.editor.ui.Popup = function (options) {
                this.initOptions(options), this.initPopup()
            }, allPopups = [];
        Popup.postHide = closeAllPopup;
        var ANCHOR_CLASSES = ["edui-anchor-topleft", "edui-anchor-topright", "edui-anchor-bottomleft",
                "edui-anchor-bottomright"];
        Popup.prototype = {
            SHADOW_RADIUS: 5,
            content: null,
            _hidden: !1,
            autoRender: !0,
            canSideLeft: !0,
            canSideUp: !0,
            initPopup: function () {
                this.initUIBase(), allPopups.push(this)
            },
            getHtmlTpl: function () {
                return '<div id="##" class="edui-popup %%" onmousedown="return false;"> <div id="##_body" class="edui-popup-body"> <iframe style="position:absolute;z-index:-1;left:0;top:0;background-color: transparent;" frameborder="0" width="100%" height="100%" src="about:blank"></iframe> <div class="edui-shadow"></div> <div id="##_content" class="edui-popup-content">' +
                    this.getContentHtmlTpl() + "  </div> </div></div>"
            },
            getContentHtmlTpl: function () {
                return this.content ? "string" == typeof this.content ? this.content : this.content.renderHtml() : ""
            },
            _UIBase_postRender: UIBase.prototype.postRender,
            postRender: function () {
                if (this.content instanceof UIBase && this.content.postRender(), this.captureWheel && !this.captured) {
                    this.captured = !0;
                    var winHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 80,
                        _height = this.getDom().offsetHeight,
                        _top = uiUtils.getClientRect(this.combox.getDom()).top,
                        content = this.getDom("content"),
                        ifr = this.getDom("body").getElementsByTagName("iframe"),
                        me = this;
                    for (ifr.length && (ifr = ifr[0]); _top + _height > winHeight;) _height -= 30;
                    content.style.height = _height + "px", ifr && (ifr.style.height = _height + "px"), window.XMLHttpRequest ?
                        domUtils.on(content, "onmousewheel" in document.body ? "mousewheel" : "DOMMouseScroll", function (
                        e) {
                        e.preventDefault ? e.preventDefault() : e.returnValue = !1, content.scrollTop -= e.wheelDelta ?
                            e.wheelDelta / 120 * 60 : e.detail / -3 * 60
                    }) : domUtils.on(this.getDom(), "mousewheel", function (e) {
                        e.returnValue = !1, me.getDom("content").scrollTop -= e.wheelDelta / 120 * 60
                    })
                }
                this.fireEvent("postRenderAfter"), this.hide(!0), this._UIBase_postRender()
            },
            _doAutoRender: function () {
                !this.getDom() && this.autoRender && this.render()
            },
            mesureSize: function () {
                var box = this.getDom("content");
                return uiUtils.getClientRect(box)
            },
            fitSize: function () {
                if (this.captureWheel && this.sized) return this.__size;
                this.sized = !0;
                var popBodyEl = this.getDom("body");
                popBodyEl.style.width = "", popBodyEl.style.height = "";
                var size = this.mesureSize();
                if (this.captureWheel) {
                    popBodyEl.style.width = -(-20 - size.width) + "px";
                    var height = parseInt(this.getDom("content").style.height, 10);
                    !window.isNaN(height) && (size.height = height)
                } else popBodyEl.style.width = size.width + "px";
                return popBodyEl.style.height = size.height + "px", this.__size = size, this.captureWheel && (this.getDom(
                    "content").style.overflow = "auto"), size
            },
            showAnchor: function (element, hoz) {
                this.showAnchorRect(uiUtils.getClientRect(element), hoz)
            },
            showAnchorRect: function (rect, hoz) {
                this._doAutoRender();
                var vpRect = uiUtils.getViewportRect();
                this.getDom().style.visibility = "hidden", this._show();
                var sideLeft, sideUp, left, top, popSize = this.fitSize();
                hoz ? (sideLeft = this.canSideLeft && rect.right + popSize.width > vpRect.right && rect.left > popSize.width,
                    sideUp = this.canSideUp && rect.top + popSize.height > vpRect.bottom && rect.bottom > popSize.height,
                    left = sideLeft ? rect.left - popSize.width : rect.right, top = sideUp ? rect.bottom - popSize.height :
                    rect.top) : (sideLeft = this.canSideLeft && rect.right + popSize.width > vpRect.right && rect.left >
                    popSize.width, sideUp = this.canSideUp && rect.top + popSize.height > vpRect.bottom && rect.bottom >
                    popSize.height, left = sideLeft ? rect.right - popSize.width : rect.left, top = sideUp ? rect.top -
                    popSize.height : rect.bottom);
                var popEl = this.getDom();
                uiUtils.setViewportOffset(popEl, {
                    left: left,
                    top: top
                }), domUtils.removeClasses(popEl, ANCHOR_CLASSES), popEl.className += " " + ANCHOR_CLASSES[2 * (sideUp ?
                    1 : 0) + (sideLeft ? 1 : 0)], this.editor && (popEl.style.zIndex = 1 * this.editor.container.style.zIndex +
                    10, baidu.editor.ui.uiUtils.getFixedLayer().style.zIndex = popEl.style.zIndex - 1), this.getDom().style
                    .visibility = "visible"
            },
            showAt: function (offset) {
                var left = offset.left,
                    top = offset.top,
                    rect = {
                        left: left,
                        top: top,
                        right: left,
                        bottom: top,
                        height: 0,
                        width: 0
                    };
                this.showAnchorRect(rect, !1, !0)
            },
            _show: function () {
                if (this._hidden) {
                    var box = this.getDom();
                    box.style.display = "", this._hidden = !1, this.fireEvent("show")
                }
            },
            isHidden: function () {
                return this._hidden
            },
            show: function () {
                this._doAutoRender(), this._show()
            },
            hide: function (notNofity) {
                !this._hidden && this.getDom() && (this.getDom().style.display = "none", this._hidden = !0, notNofity ||
                    this.fireEvent("hide"))
            },
            queryAutoHide: function (el) {
                return !el || !uiUtils.contains(this.getDom(), el)
            }
        }, utils.inherits(Popup, UIBase), domUtils.on(document, "mousedown", function (evt) {
            var el = evt.target || evt.srcElement;
            closeAllPopup(evt, el)
        }), domUtils.on(window, "scroll", function (evt, el) {
            closeAllPopup(evt, el)
        })
    }(),
    function () {
        function genColorPicker(noColorText, editor) {
            for (var html =
                '<div id="##" class="edui-colorpicker %%"><div class="edui-colorpicker-topbar edui-clearfix"><div unselectable="on" id="##_preview" class="edui-colorpicker-preview"></div><div unselectable="on" class="edui-colorpicker-nocolor" onclick="$$._onPickNoColor(event, this);">' +
                noColorText +
                '</div></div><table  class="edui-box" style="border-collapse: collapse;" onmouseover="$$._onTableOver(event, this);" onmouseout="$$._onTableOut(event, this);" onclick="return $$._onTableClick(event, this);" cellspacing="0" cellpadding="0"><tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;padding-top: 2px"><td colspan="10">' +
                editor.getLang("themeColor") + '</td> </tr><tr class="edui-colorpicker-tablefirstrow" >', i = 0; i <
                COLORS.length; i++) i && i % 10 === 0 && (html += "</tr>" + (60 == i ?
                    '<tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;"><td colspan="10">' +
                    editor.getLang("standardColor") + "</td></tr>" : "") + "<tr" + (60 == i ?
                    ' class="edui-colorpicker-tablefirstrow"' : "") + ">"), html += 70 > i ?
                    '<td style="padding: 0 2px;"><a hidefocus title="' + COLORS[i] +
                    '" onclick="return false;" href="javascript:" unselectable="on" class="edui-box edui-colorpicker-colorcell" data-color="#' +
                    COLORS[i] + '" style="background-color:#' + COLORS[i] + ";border:solid #ccc;" + (10 > i || i >= 60 ?
                    "border-width:1px;" : i >= 10 && 20 > i ? "border-width:1px 1px 0 1px;" :
                    "border-width:0 1px 0 1px;") + '"></a></td>' : "";
            return html += "</tr></table></div>"
        }
        var utils = baidu.editor.utils,
            UIBase = baidu.editor.ui.UIBase,
            ColorPicker = baidu.editor.ui.ColorPicker = function (options) {
                this.initOptions(options), this.noColorText = this.noColorText || this.editor.getLang("clearColor"),
                    this.initUIBase()
            };
        ColorPicker.prototype = {
            getHtmlTpl: function () {
                return genColorPicker(this.noColorText, this.editor)
            },
            _onTableClick: function (evt) {
                var tgt = evt.target || evt.srcElement,
                    color = tgt.getAttribute("data-color");
                color && this.fireEvent("pickcolor", color)
            },
            _onTableOver: function (evt) {
                var tgt = evt.target || evt.srcElement,
                    color = tgt.getAttribute("data-color");
                color && (this.getDom("preview").style.backgroundColor = color)
            },
            _onTableOut: function () {
                this.getDom("preview").style.backgroundColor = ""
            },
            _onPickNoColor: function () {
                this.fireEvent("picknocolor")
            }
        }, utils.inherits(ColorPicker, UIBase);
        var COLORS =
            "ffffff,000000,eeece1,1f497d,4f81bd,c0504d,9bbb59,8064a2,4bacc6,f79646,f2f2f2,7f7f7f,ddd9c3,c6d9f0,dbe5f1,f2dcdb,ebf1dd,e5e0ec,dbeef3,fdeada,d8d8d8,595959,c4bd97,8db3e2,b8cce4,e5b9b7,d7e3bc,ccc1d9,b7dde8,fbd5b5,bfbfbf,3f3f3f,938953,548dd4,95b3d7,d99694,c3d69b,b2a2c7,92cddc,fac08f,a5a5a5,262626,494429,17365d,366092,953734,76923c,5f497a,31859b,e36c09,7f7f7f,0c0c0c,1d1b10,0f243e,244061,632423,4f6128,3f3151,205867,974806,c00000,ff0000,ffc000,ffff00,92d050,00b050,00b0f0,0070c0,002060,7030a0,"
            .split(",")
    }(),
    function () {
        var utils = baidu.editor.utils,
            uiUtils = baidu.editor.ui.uiUtils,
            UIBase = baidu.editor.ui.UIBase,
            TablePicker = baidu.editor.ui.TablePicker = function (options) {
                this.initOptions(options), this.initTablePicker()
            };
        TablePicker.prototype = {
            defaultNumRows: 10,
            defaultNumCols: 10,
            maxNumRows: 20,
            maxNumCols: 20,
            numRows: 10,
            numCols: 10,
            lengthOfCellSide: 22,
            initTablePicker: function () {
                this.initUIBase()
            },
            getHtmlTpl: function () {
                return '<div id="##" class="edui-tablepicker %%"><div class="edui-tablepicker-body"><div class="edui-infoarea"><span id="##_label" class="edui-label"></span></div><div class="edui-pickarea" onmousemove="$$._onMouseMove(event, this);" onmouseover="$$._onMouseOver(event, this);" onmouseout="$$._onMouseOut(event, this);" onclick="$$._onClick(event, this);"><div id="##_overlay" class="edui-overlay"></div></div></div></div>'
            },
            _UIBase_render: UIBase.prototype.render,
            render: function (holder) {
                this._UIBase_render(holder), this.getDom("label").innerHTML = "0" + this.editor.getLang("t_row") +
                    " x 0" + this.editor.getLang("t_col")
            },
            _track: function (numCols, numRows) {
                var style = this.getDom("overlay").style,
                    sideLen = this.lengthOfCellSide;
                style.width = numCols * sideLen + "px", style.height = numRows * sideLen + "px";
                var label = this.getDom("label");
                label.innerHTML = numCols + this.editor.getLang("t_col") + " x " + numRows + this.editor.getLang(
                    "t_row"), this.numCols = numCols, this.numRows = numRows
            },
            _onMouseOver: function (evt, el) {
                var rel = evt.relatedTarget || evt.fromElement;
                uiUtils.contains(el, rel) || el === rel || (this.getDom("label").innerHTML = "0" + this.editor.getLang(
                    "t_col") + " x 0" + this.editor.getLang("t_row"), this.getDom("overlay").style.visibility = "")
            },
            _onMouseOut: function (evt, el) {
                var rel = evt.relatedTarget || evt.toElement;
                uiUtils.contains(el, rel) || el === rel || (this.getDom("label").innerHTML = "0" + this.editor.getLang(
                    "t_col") + " x 0" + this.editor.getLang("t_row"), this.getDom("overlay").style.visibility =
                    "hidden")
            },
            _onMouseMove: function (evt) {
                var offset = (this.getDom("overlay").style, uiUtils.getEventOffset(evt)),
                    sideLen = this.lengthOfCellSide,
                    numCols = Math.ceil(offset.left / sideLen),
                    numRows = Math.ceil(offset.top / sideLen);
                this._track(numCols, numRows)
            },
            _onClick: function () {
                this.fireEvent("picktable", this.numCols, this.numRows)
            }
        }, utils.inherits(TablePicker, UIBase)
    }(),
    function () {
        var browser = baidu.editor.browser,
            domUtils = baidu.editor.dom.domUtils,
            uiUtils = baidu.editor.ui.uiUtils,
            TPL_STATEFUL =
                'onmousedown="$$.Stateful_onMouseDown(event, this);" onmouseup="$$.Stateful_onMouseUp(event, this);"' +
                (browser.ie ?
                ' onmouseenter="$$.Stateful_onMouseEnter(event, this);" onmouseleave="$$.Stateful_onMouseLeave(event, this);"' :
                ' onmouseover="$$.Stateful_onMouseOver(event, this);" onmouseout="$$.Stateful_onMouseOut(event, this);"');
        baidu.editor.ui.Stateful = {
            alwalysHoverable: !1,
            target: null,
            Stateful_init: function () {
                this._Stateful_dGetHtmlTpl = this.getHtmlTpl, this.getHtmlTpl = this.Stateful_getHtmlTpl
            },
            Stateful_getHtmlTpl: function () {
                var tpl = this._Stateful_dGetHtmlTpl();
                return tpl.replace(/stateful/g, function () {
                    return TPL_STATEFUL
                })
            },
            Stateful_onMouseEnter: function (evt, el) {
                this.target = el, (!this.isDisabled() || this.alwalysHoverable) && (this.addState("hover"), this.fireEvent(
                    "over"))
            },
            Stateful_onMouseLeave: function () {
                (!this.isDisabled() || this.alwalysHoverable) && (this.removeState("hover"), this.removeState("active"),
                    this.fireEvent("out"))
            },
            Stateful_onMouseOver: function (evt, el) {
                var rel = evt.relatedTarget;
                uiUtils.contains(el, rel) || el === rel || this.Stateful_onMouseEnter(evt, el)
            },
            Stateful_onMouseOut: function (evt, el) {
                var rel = evt.relatedTarget;
                uiUtils.contains(el, rel) || el === rel || this.Stateful_onMouseLeave(evt, el)
            },
            Stateful_onMouseDown: function () {
                this.isDisabled() || this.addState("active")
            },
            Stateful_onMouseUp: function () {
                this.isDisabled() || this.removeState("active")
            },
            Stateful_postRender: function () {
                this.disabled && !this.hasState("disabled") && this.addState("disabled")
            },
            hasState: function (state) {
                return domUtils.hasClass(this.getStateDom(), "edui-state-" + state)
            },
            addState: function (state) {
                this.hasState(state) || (this.getStateDom().className += " edui-state-" + state)
            },
            removeState: function (state) {
                this.hasState(state) && domUtils.removeClasses(this.getStateDom(), ["edui-state-" + state])
            },
            getStateDom: function () {
                return this.getDom("state")
            },
            isChecked: function () {
                return this.hasState("checked")
            },
            setChecked: function (checked) {
                !this.isDisabled() && checked ? this.addState("checked") : this.removeState("checked")
            },
            isDisabled: function () {
                return this.hasState("disabled")
            },
            setDisabled: function (disabled) {
                disabled ? (this.removeState("hover"), this.removeState("checked"), this.removeState("active"), this.addState(
                    "disabled")) : this.removeState("disabled")
            }
        }
    }(),
    function () {
        var utils = baidu.editor.utils,
            UIBase = baidu.editor.ui.UIBase,
            Stateful = baidu.editor.ui.Stateful,
            Button = baidu.editor.ui.Button = function (options) {
                if (options.name) {
                    var btnName = options.name,
                        cssRules = options.cssRules;
                    options.className || (options.className = "edui-for-" + btnName), options.cssRules =
                        ".edui-default  .edui-for-" + btnName + " .edui-icon {" + cssRules + "}"
                }
                this.initOptions(options), this.initButton()
            };
        Button.prototype = {
            uiName: "button",
            label: "",
            title: "",
            showIcon: !0,
            showText: !0,
            cssRules: "",
            initButton: function () {
                this.initUIBase(), this.Stateful_init(), this.cssRules && utils.cssRule("edui-customize-" + this.name +
                    "-style", this.cssRules)
            },
            getHtmlTpl: function () {
                return '<div id="##" class="edui-box %%"><div id="##_state" stateful><div class="%%-wrap"><div id="##_body" unselectable="on" ' +
                    (this.title ? 'title="' + this.title + '"' : "") +
                    ' class="%%-body" onmousedown="return $$._onMouseDown(event, this);" onclick="return $$._onClick(event, this);">' +
                    (this.showIcon ? '<div class="edui-box edui-icon"></div>' : "") + (this.showText ?
                    '<div class="edui-box edui-label">' + this.label + "</div>" : "") + "</div></div></div></div>"
            },
            postRender: function () {
                this.Stateful_postRender(), this.setDisabled(this.disabled)
            },
            _onMouseDown: function (e) {
                var target = e.target || e.srcElement,
                    tagName = target && target.tagName && target.tagName.toLowerCase();
                return "input" == tagName || "object" == tagName || "object" == tagName ? !1 : void 0
            },
            _onClick: function () {
                this.isDisabled() || this.fireEvent("click")
            },
            setTitle: function (text) {
                var label = this.getDom("label");
                label.innerHTML = text
            }
        }, utils.inherits(Button, UIBase), utils.extend(Button.prototype, Stateful)
    }(),
    function () {
        var utils = baidu.editor.utils,
            uiUtils = baidu.editor.ui.uiUtils,
            UIBase = (baidu.editor.dom.domUtils, baidu.editor.ui.UIBase),
            Stateful = baidu.editor.ui.Stateful,
            SplitButton = baidu.editor.ui.SplitButton = function (options) {
                this.initOptions(options), this.initSplitButton()
            };
        SplitButton.prototype = {
            popup: null,
            uiName: "splitbutton",
            title: "",
            initSplitButton: function () {
                this.initUIBase(), this.Stateful_init();
                if (null != this.popup) {
                    var popup = this.popup;
                    this.popup = null, this.setPopup(popup)
                }
            },
            _UIBase_postRender: UIBase.prototype.postRender,
            postRender: function () {
                this.Stateful_postRender(), this._UIBase_postRender()
            },
            setPopup: function (popup) {
                this.popup !== popup && (null != this.popup && this.popup.dispose(), popup.addListener("show", utils.bind(
                    this._onPopupShow, this)), popup.addListener("hide", utils.bind(this._onPopupHide, this)), popup.addListener(
                    "postrender", utils.bind(function () {
                    popup.getDom("body").appendChild(uiUtils.createElementByHtml('<div id="' + this.popup.id +
                        '_bordereraser" class="edui-bordereraser edui-background" style="width:' + (uiUtils.getClientRect(
                        this.getDom()).width + 20) + 'px"></div>')), popup.getDom().className += " " + this.className
                }, this)), this.popup = popup)
            },
            _onPopupShow: function () {
                this.addState("opened")
            },
            _onPopupHide: function () {
                this.removeState("opened")
            },
            getHtmlTpl: function () {
                return '<div id="##" class="edui-box %%"><div ' + (this.title ? 'title="' + this.title + '"' : "") +
                    ' id="##_state" stateful><div class="%%-body"><div id="##_button_body" class="edui-box edui-button-body" onclick="$$._onButtonClick(event, this);"><div class="edui-box edui-icon"></div></div><div class="edui-box edui-splitborder"></div><div class="edui-box edui-arrow" onclick="$$._onArrowClick();"></div></div></div></div>'
            },
            showPopup: function () {
                var rect = uiUtils.getClientRect(this.getDom());
                rect.top -= this.popup.SHADOW_RADIUS, rect.height += this.popup.SHADOW_RADIUS, this.popup.showAnchorRect(
                    rect)
            },
            _onArrowClick: function () {
                this.isDisabled() || this.showPopup()
            },
            _onButtonClick: function () {
                this.isDisabled() || this.fireEvent("buttonclick")
            }
        }, utils.inherits(SplitButton, UIBase), utils.extend(SplitButton.prototype, Stateful, !0)
    }(),
    function () {
        var utils = baidu.editor.utils,
            uiUtils = baidu.editor.ui.uiUtils,
            ColorPicker = baidu.editor.ui.ColorPicker,
            Popup = baidu.editor.ui.Popup,
            SplitButton = baidu.editor.ui.SplitButton,
            ColorButton = baidu.editor.ui.ColorButton = function (options) {
                this.initOptions(options), this.initColorButton()
            };
        ColorButton.prototype = {
            initColorButton: function () {
                var me = this;
                this.popup = new Popup({
                    content: new ColorPicker({
                        noColorText: me.editor.getLang("clearColor"),
                        editor: me.editor,
                        onpickcolor: function (t, color) {
                            me._onPickColor(color)
                        },
                        onpicknocolor: function (t, color) {
                            me._onPickNoColor(color)
                        }
                    }),
                    editor: me.editor
                }), this.initSplitButton()
            },
            _SplitButton_postRender: SplitButton.prototype.postRender,
            postRender: function () {
                this._SplitButton_postRender(), this.getDom("button_body").appendChild(uiUtils.createElementByHtml(
                    '<div id="' + this.id + '_colorlump" class="edui-colorlump"></div>')), this.getDom().className +=
                    " edui-colorbutton"
            },
            setColor: function (color) {
                this.getDom("colorlump").style.backgroundColor = color, this.color = color
            },
            _onPickColor: function (color) {
                this.fireEvent("pickcolor", color) !== !1 && (this.setColor(color), this.popup.hide())
            },
            _onPickNoColor: function () {
                this.fireEvent("picknocolor") !== !1 && this.popup.hide()
            }
        }, utils.inherits(ColorButton, SplitButton)
    }(),
    function () {
        var utils = baidu.editor.utils,
            Popup = baidu.editor.ui.Popup,
            TablePicker = baidu.editor.ui.TablePicker,
            SplitButton = baidu.editor.ui.SplitButton,
            TableButton = baidu.editor.ui.TableButton = function (options) {
                this.initOptions(options), this.initTableButton()
            };
        TableButton.prototype = {
            initTableButton: function () {
                var me = this;
                this.popup = new Popup({
                    content: new TablePicker({
                        editor: me.editor,
                        onpicktable: function (t, numCols, numRows) {
                            me._onPickTable(numCols, numRows)
                        }
                    }),
                    editor: me.editor
                }), this.initSplitButton()
            },
            _onPickTable: function (numCols, numRows) {
                this.fireEvent("picktable", numCols, numRows) !== !1 && this.popup.hide()
            }
        }, utils.inherits(TableButton, SplitButton)
    }(),
    function () {
        var utils = baidu.editor.utils,
            UIBase = baidu.editor.ui.UIBase,
            AutoTypeSetPicker = baidu.editor.ui.AutoTypeSetPicker = function (options) {
                this.initOptions(options), this.initAutoTypeSetPicker()
            };
        AutoTypeSetPicker.prototype = {
            initAutoTypeSetPicker: function () {
                this.initUIBase()
            },
            getHtmlTpl: function () {
                var me = this.editor,
                    opt = me.options.autotypeset,
                    lang = me.getLang("autoTypeSet"),
                    textAlignInputName = "textAlignValue" + me.uid,
                    imageBlockInputName = "imageBlockLineValue" + me.uid,
                    symbolConverInputName = "symbolConverValue" + me.uid;
                return '<div id="##" class="edui-autotypesetpicker %%"><div class="edui-autotypesetpicker-body"><table ><tr><td nowrap><input type="checkbox" name="mergeEmptyline" ' +
                    (opt.mergeEmptyline ? "checked" : "") + ">" + lang.mergeLine +
                    '</td><td colspan="2"><input type="checkbox" name="removeEmptyline" ' + (opt.removeEmptyline ?
                    "checked" : "") + ">" + lang.delLine +
                    '</td></tr><tr><td nowrap><input type="checkbox" name="removeClass" ' + (opt.removeClass ?
                    "checked" : "") + ">" + lang.removeFormat +
                    '</td><td colspan="2"><input type="checkbox" name="indent" ' + (opt.indent ? "checked" : "") + ">" +
                    lang.indent + '</td></tr><tr><td nowrap><input type="checkbox" name="textAlign" ' + (opt.textAlign ?
                    "checked" : "") + ">" + lang.alignment + '</td><td colspan="2" id="' + textAlignInputName +
                    '"><input type="radio" name="' + textAlignInputName + '" value="left" ' + (opt.textAlign && "left" ==
                    opt.textAlign ? "checked" : "") + ">" + me.getLang("justifyleft") + '<input type="radio" name="' +
                    textAlignInputName + '" value="center" ' + (opt.textAlign && "center" == opt.textAlign ? "checked" :
                    "") + ">" + me.getLang("justifycenter") + '<input type="radio" name="' + textAlignInputName +
                    '" value="right" ' + (opt.textAlign && "right" == opt.textAlign ? "checked" : "") + ">" + me.getLang(
                    "justifyright") + '</td></tr><tr><td nowrap><input type="checkbox" name="imageBlockLine" ' + (opt.imageBlockLine ?
                    "checked" : "") + ">" + lang.imageFloat + '</td><td nowrap id="' + imageBlockInputName +
                    '"><input type="radio" name="' + imageBlockInputName + '" value="none" ' + (opt.imageBlockLine &&
                    "none" == opt.imageBlockLine ? "checked" : "") + ">" + me.getLang("default") +
                    '<input type="radio" name="' + imageBlockInputName + '" value="left" ' + (opt.imageBlockLine &&
                    "left" == opt.imageBlockLine ? "checked" : "") + ">" + me.getLang("justifyleft") +
                    '<input type="radio" name="' + imageBlockInputName + '" value="center" ' + (opt.imageBlockLine &&
                    "center" == opt.imageBlockLine ? "checked" : "") + ">" + me.getLang("justifycenter") +
                    '<input type="radio" name="' + imageBlockInputName + '" value="right" ' + (opt.imageBlockLine &&
                    "right" == opt.imageBlockLine ? "checked" : "") + ">" + me.getLang("justifyright") +
                    '</td></tr><tr><td nowrap><input type="checkbox" name="clearFontSize" ' + (opt.clearFontSize ?
                    "checked" : "") + ">" + lang.removeFontsize +
                    '</td><td colspan="2"><input type="checkbox" name="clearFontFamily" ' + (opt.clearFontFamily ?
                    "checked" : "") + ">" + lang.removeFontFamily +
                    '</td></tr><tr><td nowrap colspan="3"><input type="checkbox" name="removeEmptyNode" ' + (opt.removeEmptyNode ?
                    "checked" : "") + ">" + lang.removeHtml +
                    '</td></tr><tr><td nowrap colspan="3"><input type="checkbox" name="pasteFilter" ' + (opt.pasteFilter ?
                    "checked" : "") + ">" + lang.pasteFilter +
                    '</td></tr><tr><td nowrap><input type="checkbox" name="symbolConver" ' + (opt.bdc2sb || opt.tobdc ?
                    "checked" : "") + ">" + lang.symbol + '</td><td id="' + symbolConverInputName +
                    '"><input type="radio" name="bdc" value="bdc2sb" ' + (opt.bdc2sb ? "checked" : "") + ">" + lang.bdc2sb +
                    '<input type="radio" name="bdc" value="tobdc" ' + (opt.tobdc ? "checked" : "") + ">" + lang.tobdc +
                    '</td><td nowrap align="right"><button >' + lang.run + "</button></td></tr></table></div></div>"
            },
            _UIBase_render: UIBase.prototype.render
        }, utils.inherits(AutoTypeSetPicker, UIBase)
    }(),
    function () {
        function getPara(me) {
            for (var ipt, opt = {}, cont = me.getDom(), editorId = me.editor.uid, inputType = null, attrName = null,
                    ipts = domUtils.getElementsByTagName(cont, "input"), i = ipts.length - 1; ipt = ipts[i--];) if (
                    inputType = ipt.getAttribute("type"), "checkbox" == inputType) if (attrName = ipt.getAttribute(
                        "name"), opt[attrName] && delete opt[attrName], ipt.checked) {
                        var attrValue = document.getElementById(attrName + "Value" + editorId);
                        if (attrValue) {
                            if (/input/gi.test(attrValue.tagName)) opt[attrName] = attrValue.value;
                            else for (var iptchild, iptChilds = attrValue.getElementsByTagName("input"), j = iptChilds.length -
                                        1; iptchild = iptChilds[j--];) if (iptchild.checked) {
                                        opt[attrName] = iptchild.value;
                                        break
                                    }
                        } else opt[attrName] = !0
                    } else opt[attrName] = !1;
                    else opt[ipt.getAttribute("value")] = ipt.checked;
            for (var si, selects = domUtils.getElementsByTagName(cont, "select"), i = 0; si = selects[i++];) {
                var attr = si.getAttribute("name");
                opt[attr] = opt[attr] ? si.value : ""
            }
            utils.extend(me.editor.options.autotypeset, opt), me.editor.setPreferences("autotypeset", opt)
        }
        var utils = baidu.editor.utils,
            Popup = baidu.editor.ui.Popup,
            AutoTypeSetPicker = baidu.editor.ui.AutoTypeSetPicker,
            SplitButton = baidu.editor.ui.SplitButton,
            AutoTypeSetButton = baidu.editor.ui.AutoTypeSetButton = function (options) {
                this.initOptions(options), this.initAutoTypeSetButton()
            };
        AutoTypeSetButton.prototype = {
            initAutoTypeSetButton: function () {
                var me = this;
                this.popup = new Popup({
                    content: new AutoTypeSetPicker({
                        editor: me.editor
                    }),
                    editor: me.editor,
                    hide: function () {
                        !this._hidden && this.getDom() && (getPara(this), this.getDom().style.display = "none", this._hidden = !
                            0, this.fireEvent("hide"))
                    }
                });
                var flag = 0;
                this.popup.addListener("postRenderAfter", function () {
                    var popupUI = this;
                    if (!flag) {
                        var cont = this.getDom(),
                            btn = cont.getElementsByTagName("button")[0];
                        btn.onclick = function () {
                            getPara(popupUI), me.editor.execCommand("autotypeset"), popupUI.hide()
                        }, domUtils.on(cont, "click", function (e) {
                            var target = e.target || e.srcElement,
                                editorId = me.editor.uid;
                            if (target && "INPUT" == target.tagName) {
                                if ("imageBlockLine" == target.name || "textAlign" == target.name || "symbolConver" ==
                                    target.name) for (var checked = target.checked, radioTd = document.getElementById(
                                            target.name + "Value" + editorId), radios = radioTd.getElementsByTagName(
                                            "input"), defalutSelect = {
                                            imageBlockLine: "none",
                                            textAlign: "left",
                                            symbolConver: "tobdc"
                                        }, i = 0; i < radios.length; i++) checked ? radios[i].value == defalutSelect[
                                            target.name] && (radios[i].checked = "checked") : radios[i].checked = !1;
                                if (target.name == "imageBlockLineValue" + editorId || target.name == "textAlignValue" +
                                    editorId || "bdc" == target.name) {
                                    var checkboxs = target.parentNode.previousSibling.getElementsByTagName("input");
                                    checkboxs && (checkboxs[0].checked = !0)
                                }
                                getPara(popupUI)
                            }
                        }), flag = 1
                    }
                }), this.initSplitButton()
            }
        }, utils.inherits(AutoTypeSetButton, SplitButton)
    }(),
    function () {
        var utils = baidu.editor.utils,
            Popup = baidu.editor.ui.Popup,
            Stateful = baidu.editor.ui.Stateful,
            UIBase = baidu.editor.ui.UIBase,
            CellAlignPicker = baidu.editor.ui.CellAlignPicker = function (options) {
                this.initOptions(options), this.initSelected(), this.initCellAlignPicker()
            };
        CellAlignPicker.prototype = {
            initSelected: function () {
                var status = {
                    valign: {
                        top: 0,
                        middle: 1,
                        bottom: 2
                    },
                    align: {
                        left: 0,
                        center: 1,
                        right: 2
                    },
                    count: 3
                };
                this.selected && (this.selectedIndex = status.valign[this.selected.valign] * status.count + status.align[
                    this.selected.align])
            },
            initCellAlignPicker: function () {
                this.initUIBase(), this.Stateful_init()
            },
            getHtmlTpl: function () {
                for (var alignType = ["left", "center", "right"], COUNT = 9, tempClassName = null, tempIndex = -1, tmpl = [],
                        i = 0; COUNT > i; i++) tempClassName = this.selectedIndex === i ?
                        ' class="edui-cellalign-selected" ' : "", tempIndex = i % 3, 0 === tempIndex && tmpl.push(
                        "<tr>"), tmpl.push('<td index="' + i + '" ' + tempClassName +
                        ' stateful><div class="edui-icon edui-' + alignType[tempIndex] + '"></div></td>'), 2 ===
                        tempIndex && tmpl.push("</tr>");
                return '<div id="##" class="edui-cellalignpicker %%"><div class="edui-cellalignpicker-body"><table onclick="$$._onClick(event);">' +
                    tmpl.join("") + "</table></div></div>"
            },
            getStateDom: function () {
                return this.target
            },
            _onClick: function (evt) {
                var target = evt.target || evt.srcElement;
                /icon/.test(target.className) && (this.items[target.parentNode.getAttribute("index")].onclick(), Popup.postHide(
                    evt))
            },
            _UIBase_render: UIBase.prototype.render
        }, utils.inherits(CellAlignPicker, UIBase), utils.extend(CellAlignPicker.prototype, Stateful, !0)
    }(),
    function () {
        var utils = baidu.editor.utils,
            Stateful = baidu.editor.ui.Stateful,
            uiUtils = baidu.editor.ui.uiUtils,
            UIBase = baidu.editor.ui.UIBase,
            PastePicker = baidu.editor.ui.PastePicker = function (options) {
                this.initOptions(options), this.initPastePicker()
            };
        PastePicker.prototype = {
            initPastePicker: function () {
                this.initUIBase(), this.Stateful_init()
            },
            getHtmlTpl: function () {
                return '<div class="edui-pasteicon" onclick="$$._onClick(this)"></div><div class="edui-pastecontainer"><div class="edui-title">' +
                    this.editor.getLang("pasteOpt") + '</div><div class="edui-button"><div title="' + this.editor.getLang(
                    "pasteSourceFormat") +
                    '" onclick="$$.format(false)" stateful><div class="edui-richtxticon"></div></div><div title="' +
                    this.editor.getLang("tagFormat") +
                    '" onclick="$$.format(2)" stateful><div class="edui-tagicon"></div></div><div title="' + this.editor
                    .getLang("pasteTextFormat") +
                    '" onclick="$$.format(true)" stateful><div class="edui-plaintxticon"></div></div></div></div></div>'
            },
            getStateDom: function () {
                return this.target
            },
            format: function (param) {
                this.editor.ui._isTransfer = !0, this.editor.fireEvent("pasteTransfer", param)
            },
            _onClick: function (cur) {
                var node = domUtils.getNextDomNode(cur),
                    screenHt = uiUtils.getViewportRect().height,
                    subPop = uiUtils.getClientRect(node);
 
                node.style.top = subPop.top + subPop.height > screenHt ? -subPop.height - cur.offsetHeight + "px" : "",
                    /hidden/gi.test(domUtils.getComputedStyle(node, "visibility")) ? (node.style.visibility = "visible",
                    domUtils.addClass(cur, "edui-state-opened")) : (node.style.visibility = "hidden", domUtils.removeClasses(
                    cur, "edui-state-opened"))
            },
            _UIBase_render: UIBase.prototype.render
        }, utils.inherits(PastePicker, UIBase), utils.extend(PastePicker.prototype, Stateful, !0)
    }(),
    function () {
        var utils = baidu.editor.utils,
            uiUtils = baidu.editor.ui.uiUtils,
            UIBase = baidu.editor.ui.UIBase,
            Toolbar = baidu.editor.ui.Toolbar = function (options) {
                this.initOptions(options), this.initToolbar()
            };
        Toolbar.prototype = {
            items: null,
            initToolbar: function () {
                this.items = this.items || [], this.initUIBase()
            },
            add: function (item, index) {
                void 0 === index ? this.items.push(item) : this.items.splice(index, 0, item)
            },
            getHtmlTpl: function () {
                for (var buff = [], i = 0; i < this.items.length; i++) buff[i] = this.items[i].renderHtml();
                return '<div id="##" class="edui-toolbar %%" onselectstart="return false;" onmousedown="return $$._onMouseDown(event, this);">' +
                    buff.join("") + "</div>"
            },
            postRender: function () {
                for (var box = this.getDom(), i = 0; i < this.items.length; i++) this.items[i].postRender();
                uiUtils.makeUnselectable(box)
            },
            _onMouseDown: function (e) {
                var target = e.target || e.srcElement,
                    tagName = target && target.tagName && target.tagName.toLowerCase();
                return "input" == tagName || "object" == tagName || "object" == tagName ? !1 : void 0
            }
        }, utils.inherits(Toolbar, UIBase)
    }(),
    function () {
        var utils = baidu.editor.utils,
            domUtils = baidu.editor.dom.domUtils,
            uiUtils = baidu.editor.ui.uiUtils,
            UIBase = baidu.editor.ui.UIBase,
            Popup = baidu.editor.ui.Popup,
            Stateful = baidu.editor.ui.Stateful,
            CellAlignPicker = baidu.editor.ui.CellAlignPicker,
            Menu = baidu.editor.ui.Menu = function (options) {
                this.initOptions(options), this.initMenu()
            }, menuSeparator = {
                renderHtml: function () {
                    return '<div class="edui-menuitem edui-menuseparator"><div class="edui-menuseparator-inner"></div></div>'
                },
                postRender: function () {},
                queryAutoHide: function () {
                    return !0
                }
            };
        Menu.prototype = {
            items: null,
            uiName: "menu",
            initMenu: function () {
                this.items = this.items || [], this.initPopup(), this.initItems()
            },
            initItems: function () {
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    "-" == item ? this.items[i] = this.getSeparator() : item instanceof MenuItem || (item.editor = this
                        .editor, item.theme = this.editor.options.theme, this.items[i] = this.createItem(item))
                }
            },
            getSeparator: function () {
                return menuSeparator
            },
            createItem: function (item) {
                return item.menu = this, new MenuItem(item)
            },
            _Popup_getContentHtmlTpl: Popup.prototype.getContentHtmlTpl,
            getContentHtmlTpl: function () {
                if (0 == this.items.length) return this._Popup_getContentHtmlTpl();
                for (var buff = [], i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    buff[i] = item.renderHtml()
                }
                return '<div class="%%-body">' + buff.join("") + "</div>"
            },
            _Popup_postRender: Popup.prototype.postRender,
            postRender: function () {
                for (var me = this, i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    item.ownerMenu = this, item.postRender()
                }
                domUtils.on(this.getDom(), "mouseover", function (evt) {
                    evt = evt || event;
                    var rel = evt.relatedTarget || evt.fromElement,
                        el = me.getDom();
                    uiUtils.contains(el, rel) || el === rel || me.fireEvent("over")
                }), this._Popup_postRender()
            },
            queryAutoHide: function (el) {
                if (el) {
                    if (uiUtils.contains(this.getDom(), el)) return !1;
                    for (var i = 0; i < this.items.length; i++) {
                        var item = this.items[i];
                        if (item.queryAutoHide(el) === !1) return !1
                    }
                }
            },
            clearItems: function () {
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    clearTimeout(item._showingTimer), clearTimeout(item._closingTimer), item.subMenu && item.subMenu.destroy()
                }
                this.items = []
            },
            destroy: function () {
                this.getDom() && domUtils.remove(this.getDom()), this.clearItems()
            },
            dispose: function () {
                this.destroy()
            }
        }, utils.inherits(Menu, Popup);
        var MenuItem = baidu.editor.ui.MenuItem = function (options) {
            if (this.initOptions(options), this.initUIBase(), this.Stateful_init(), this.subMenu && !(this.subMenu instanceof Menu))
                if (options.className && -1 != options.className.indexOf("aligntd")) {
                    var me = this;
                    this.subMenu.selected = this.editor.queryCommandValue("cellalignment"), this.subMenu = new Popup({
                        content: new CellAlignPicker(this.subMenu),
                        parentMenu: me,
                        editor: me.editor,
                        destroy: function () {
                            this.getDom() && domUtils.remove(this.getDom())
                        }
                    }), this.subMenu.addListener("postRenderAfter", function () {
                        domUtils.on(this.getDom(), "mouseover", function () {
                            me.addState("opened")
                        })
                    })
                } else this.subMenu = new Menu(this.subMenu)
        };
        MenuItem.prototype = {
            label: "",
            subMenu: null,
            ownerMenu: null,
            uiName: "menuitem",
            alwalysHoverable: !0,
            getHtmlTpl: function () {
                return '<div id="##" class="%%" stateful onclick="$$._onClick(event, this);"><div class="%%-body">' +
                    this.renderLabelHtml() + "</div></div>"
            },
            postRender: function () {
                var me = this;
                this.addListener("over", function () {
                    me.ownerMenu.fireEvent("submenuover", me), me.subMenu && me.delayShowSubMenu()
                }), this.subMenu && (this.getDom().className += " edui-hassubmenu", this.subMenu.render(), this.addListener(
                    "out", function () {
                    me.delayHideSubMenu()
                }), this.subMenu.addListener("over", function () {
                    clearTimeout(me._closingTimer), me._closingTimer = null, me.addState("opened")
                }), this.ownerMenu.addListener("hide", function () {
                    me.hideSubMenu()
                }), this.ownerMenu.addListener("submenuover", function (t, subMenu) {
                    subMenu !== me && me.delayHideSubMenu()
                }), this.subMenu._bakQueryAutoHide = this.subMenu.queryAutoHide, this.subMenu.queryAutoHide = function (
                    el) {
                    return el && uiUtils.contains(me.getDom(), el) ? !1 : this._bakQueryAutoHide(el)
                }), this.getDom().style.tabIndex = "-1", uiUtils.makeUnselectable(this.getDom()), this.Stateful_postRender()
            },
            delayShowSubMenu: function () {
                var me = this;
                me.isDisabled() || (me.addState("opened"), clearTimeout(me._showingTimer), clearTimeout(me._closingTimer),
                    me._closingTimer = null, me._showingTimer = setTimeout(function () {
                    me.showSubMenu()
                }, 250))
            },
            delayHideSubMenu: function () {
                var me = this;
                me.isDisabled() || (me.removeState("opened"), clearTimeout(me._showingTimer), me._closingTimer || (me._closingTimer =
                    setTimeout(function () {
                    me.hasState("opened") || me.hideSubMenu(), me._closingTimer = null
                }, 400)))
            },
            renderLabelHtml: function () {
                return '<div class="edui-arrow"></div><div class="edui-box edui-icon"></div><div class="edui-box edui-label %%-label">' +
                    (this.label || "") + "</div>"
            },
            getStateDom: function () {
                return this.getDom()
            },
            queryAutoHide: function (el) {
                return this.subMenu && this.hasState("opened") ? this.subMenu.queryAutoHide(el) : void 0
            },
            _onClick: function (event, this_) {
                this.hasState("disabled") || this.fireEvent("click", event, this_) !== !1 && (this.subMenu ? this.showSubMenu() :
                    Popup.postHide(event))
            },
            showSubMenu: function () {
                var rect = uiUtils.getClientRect(this.getDom());
                rect.right -= 5, rect.left += 2, rect.width -= 7, rect.top -= 4, rect.bottom += 4, rect.height += 8,
                    this.subMenu.showAnchorRect(rect, !0, !0)
            },
            hideSubMenu: function () {
                this.subMenu.hide()
            }
        }, utils.inherits(MenuItem, UIBase), utils.extend(MenuItem.prototype, Stateful, !0)
    }(),
    function () {
        var utils = baidu.editor.utils,
            uiUtils = baidu.editor.ui.uiUtils,
            Menu = baidu.editor.ui.Menu,
            SplitButton = baidu.editor.ui.SplitButton,
            Combox = baidu.editor.ui.Combox = function (options) {
                this.initOptions(options), this.initCombox()
            };
        Combox.prototype = {
            uiName: "combox",
            onbuttonclick: function () {
                this.showPopup()
            },
            initCombox: function () {
                var me = this;
                this.items = this.items || [];
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    item.uiName = "listitem", item.index = i, item.onclick = function () {
                        me.selectByIndex(this.index)
                    }
                }
                this.popup = new Menu({
                    items: this.items,
                    uiName: "list",
                    editor: this.editor,
                    captureWheel: !0,
                    combox: this
                }), this.initSplitButton()
            },
            _SplitButton_postRender: SplitButton.prototype.postRender,
            postRender: function () {
                this._SplitButton_postRender(), this.setLabel(this.label || ""), this.setValue(this.initValue || "")
            },
            showPopup: function () {
                var rect = uiUtils.getClientRect(this.getDom());
                rect.top += 1, rect.bottom -= 1, rect.height -= 2, this.popup.showAnchorRect(rect)
            },
            getValue: function () {
                return this.value
            },
            setValue: function (value) {
                var index = this.indexByValue(value); - 1 != index ? (this.selectedIndex = index, this.setLabel(this.items[
                    index].label), this.value = this.items[index].value) : (this.selectedIndex = -1, this.setLabel(this
                    .getLabelForUnknowValue(value)), this.value = value)
            },
            setLabel: function (label) {
                this.getDom("button_body").innerHTML = label, this.label = label
            },
            getLabelForUnknowValue: function (value) {
                return value
            },
            indexByValue: function (value) {
                for (var i = 0; i < this.items.length; i++) if (value == this.items[i].value) return i;
                return -1
            },
            getItem: function (index) {
                return this.items[index]
            },
            selectByIndex: function (index) {
                index < this.items.length && this.fireEvent("select", index) !== !1 && (this.selectedIndex = index,
                    this.value = this.items[index].value, this.setLabel(this.items[index].label))
            }
        }, utils.inherits(Combox, SplitButton)
    }(),
    function () {
        var modalMask, dragMask, activeDialog, utils = baidu.editor.utils,
            domUtils = baidu.editor.dom.domUtils,
            uiUtils = baidu.editor.ui.uiUtils,
            Mask = baidu.editor.ui.Mask,
            UIBase = baidu.editor.ui.UIBase,
            Button = baidu.editor.ui.Button,
            Dialog = baidu.editor.ui.Dialog = function (options) {
                if (options.name) {
                    var name = options.name,
                        cssRules = options.cssRules;
                    options.className || (options.className = "edui-for-" + name), cssRules && (options.cssRules =
                        ".edui-default .edui-for-" + name + " .edui-dialog-content  {" + cssRules + "}")
                }
                this.initOptions(utils.extend({
                    autoReset: !0,
                    draggable: !0,
                    onok: function () {},
                    oncancel: function () {},
                    onclose: function (t, ok) {
                        return ok ? this.onok() : this.oncancel()
                    },
                    holdScroll: !1
                }, options)), this.initDialog()
            };
        Dialog.prototype = {
            draggable: !1,
            uiName: "dialog",
            initDialog: function () {
                var me = this,
                    theme = this.editor.options.theme;
                if (this.cssRules && utils.cssRule("edui-customize-" + this.name + "-style", this.cssRules), this.initUIBase(),
                    this.modalMask = modalMask || (modalMask = new Mask({
                    className: "edui-dialog-modalmask",
                    theme: theme,
                    onclick: function () {
                        activeDialog && activeDialog.close(!1)
                    }
                })), this.dragMask = dragMask || (dragMask = new Mask({
                    className: "edui-dialog-dragmask",
                    theme: theme
                })), this.closeButton = new Button({
                    className: "edui-dialog-closebutton",
                    title: me.closeDialog,
                    theme: theme,
                    onclick: function () {
                        me.close(!1)
                    }
                }), this.fullscreen && this.initResizeEvent(), this.buttons) for (var i = 0; i < this.buttons.length; i++)
                        this.buttons[i] instanceof Button || (this.buttons[i] = new Button(utils.extend(this.buttons[i], {
                            editor: this.editor
                        }, !0)))
            },
            initResizeEvent: function () {
                var me = this;
                domUtils.on(window, "resize", function () {
                    me._hidden || void 0 === me._hidden || (me.__resizeTimer && window.clearTimeout(me.__resizeTimer),
                        me.__resizeTimer = window.setTimeout(function () {
                        me.__resizeTimer = null;
                        var dialogWrapNode = me.getDom(),
                            contentNode = me.getDom("content"),
                            wrapRect = UE.ui.uiUtils.getClientRect(dialogWrapNode),
                            contentRect = UE.ui.uiUtils.getClientRect(contentNode),
                            vpRect = uiUtils.getViewportRect();
                        contentNode.style.width = vpRect.width - wrapRect.width + contentRect.width + "px", contentNode
                            .style.height = vpRect.height - wrapRect.height + contentRect.height + "px", dialogWrapNode
                            .style.width = vpRect.width + "px", dialogWrapNode.style.height = vpRect.height + "px", me.fireEvent(
                            "resize")
                    }, 100))
                })
            },
            fitSize: function () {
                var popBodyEl = this.getDom("body"),
                    size = this.mesureSize();
                return popBodyEl.style.width = size.width + "px", popBodyEl.style.height = size.height + "px", size
            },
            safeSetOffset: function (offset) {
                var me = this,
                    el = me.getDom(),
                    vpRect = uiUtils.getViewportRect(),
                    rect = uiUtils.getClientRect(el),
                    left = offset.left;
                left + rect.width > vpRect.right && (left = vpRect.right - rect.width);
                var top = offset.top;
                top + rect.height > vpRect.bottom && (top = vpRect.bottom - rect.height), el.style.left = Math.max(left,
                    0) + "px", el.style.top = Math.max(top, 0) + "px"
            },
            showAtCenter: function () {
                var vpRect = uiUtils.getViewportRect();
                if (this.fullscreen) {
                    var dialogWrapNode = this.getDom(),
                        contentNode = this.getDom("content");
                    dialogWrapNode.style.display = "block";
                    var wrapRect = UE.ui.uiUtils.getClientRect(dialogWrapNode),
                        contentRect = UE.ui.uiUtils.getClientRect(contentNode);
                    dialogWrapNode.style.left = "-100000px", contentNode.style.width = vpRect.width - wrapRect.width +
                        contentRect.width + "px", contentNode.style.height = vpRect.height - wrapRect.height +
                        contentRect.height + "px", dialogWrapNode.style.width = vpRect.width + "px", dialogWrapNode.style
                        .height = vpRect.height + "px", dialogWrapNode.style.left = 0, this._originalContext = {
                        html: {
                            overflowX: document.documentElement.style.overflowX,
                            overflowY: document.documentElement.style.overflowY
                        },
                        body: {
                            overflowX: document.body.style.overflowX,
                            overflowY: document.body.style.overflowY
                        }
                    }, document.documentElement.style.overflowX = "hidden", document.documentElement.style.overflowY =
                        "hidden", document.body.style.overflowX = "hidden", document.body.style.overflowY = "hidden"
                } else {
                    this.getDom().style.display = "";
                    var popSize = this.fitSize(),
                        titleHeight = 0 | this.getDom("titlebar").offsetHeight,
                        left = vpRect.width / 2 - popSize.width / 2,
                        top = vpRect.height / 2 - (popSize.height - titleHeight) / 2 - titleHeight,
                        popEl = this.getDom();
                    this.safeSetOffset({
                        left: Math.max(0 | left, 0),
                        top: Math.max(0 | top, 0)
                    }), domUtils.hasClass(popEl, "edui-state-centered") || (popEl.className += " edui-state-centered")
                }
                this._show()
            },
            getContentHtml: function () {
                var contentHtml = "";
                return "string" == typeof this.content ? contentHtml = this.content : this.iframeUrl && (contentHtml =
                    '<span id="' + this.id + '_contmask" class="dialogcontmask"></span><iframe id="' + this.id +
                    '_iframe" class="%%-iframe" height="100%" width="100%" frameborder="0" src="' + this.iframeUrl +
                    '"></iframe>'), contentHtml
            },
            getHtmlTpl: function () {
                var footHtml = "";
                if (this.buttons) {
                    for (var buff = [], i = 0; i < this.buttons.length; i++) buff[i] = this.buttons[i].renderHtml();
                    footHtml = '<div class="%%-foot"><div id="##_buttons" class="%%-buttons">' + buff.join("") +
                        "</div></div>"
                }
                return '<div id="##" class="%%"><div ' + (this.fullscreen ?
                    'class="%%-wrap edui-dialog-fullscreen-flag"' : 'class="%%"') +
                    '><div id="##_body" class="%%-body"><div class="%%-shadow"></div><div id="##_titlebar" class="%%-titlebar"><div class="%%-draghandle" onmousedown="$$._onTitlebarMouseDown(event, this);"><span class="%%-caption">' +
                    (this.title || "") + "</span></div>" + this.closeButton.renderHtml() +
                    '</div><div id="##_content" class="%%-content">' + (this.autoReset ? "" : this.getContentHtml()) +
                    "</div>" + footHtml + "</div></div></div>"
            },
            postRender: function () {
                this.modalMask.getDom() || (this.modalMask.render(), this.modalMask.hide()), this.dragMask.getDom() ||
                    (this.dragMask.render(), this.dragMask.hide());
                var me = this;
                if (this.addListener("show", function () {
                    me.modalMask.show(this.getDom().style.zIndex - 2)
                }), this.addListener("hide", function () {
                    me.modalMask.hide()
                }), this.buttons) for (var i = 0; i < this.buttons.length; i++) this.buttons[i].postRender();
                domUtils.on(window, "resize", function () {
                    setTimeout(function () {
                        me.isHidden() || me.safeSetOffset(uiUtils.getClientRect(me.getDom()))
                    })
                }), this._hide()
            },
            mesureSize: function () {
                var body = this.getDom("body"),
                    width = uiUtils.getClientRect(this.getDom("content")).width,
                    dialogBodyStyle = body.style;
                return dialogBodyStyle.width = width, uiUtils.getClientRect(body)
            },
            _onTitlebarMouseDown: function (evt) {
                if (this.draggable) {
                    var rect, me = (uiUtils.getViewportRect(), this);
                    uiUtils.startDrag(evt, {
                        ondragstart: function () {
                            rect = uiUtils.getClientRect(me.getDom()), me.getDom("contmask").style.visibility =
                                "visible", me.dragMask.show(me.getDom().style.zIndex - 1)
                        },
                        ondragmove: function (x, y) {
                            var left = rect.left + x,
                                top = rect.top + y;
                            me.safeSetOffset({
                                left: left,
                                top: top
                            })
                        },
                        ondragstop: function () {
                            me.getDom("contmask").style.visibility = "hidden", domUtils.removeClasses(me.getDom(), [
                                    "edui-state-centered"]), me.dragMask.hide()
                        }
                    })
                }
            },
            reset: function () {
                this.getDom("content").innerHTML = this.getContentHtml(), this.fireEvent("dialogafterreset")
            },
            _show: function () {
                this._hidden && (this.getDom().style.display = "", this.editor.container.style.zIndex && (this.getDom()
                    .style.zIndex = 1 * this.editor.container.style.zIndex + 10), this._hidden = !1, this.fireEvent(
                    "show"), baidu.editor.ui.uiUtils.getFixedLayer().style.zIndex = this.getDom().style.zIndex - 4)
            },
            isHidden: function () {
                return this._hidden
            },
            _hide: function () {
                if (!this._hidden) {
                    var wrapNode = this.getDom();
                    wrapNode.style.display = "none", wrapNode.style.zIndex = "", wrapNode.style.width = "", wrapNode.style
                        .height = "", this._hidden = !0, this.fireEvent("hide")
                }
            },
            open: function () {
                if (this.autoReset) try {
                        this.reset()
                } catch (e) {
                    this.render(), this.open()
                }
                if (this.showAtCenter(), this.iframeUrl) try {
                        this.getDom("iframe").focus()
                } catch (ex) {}
                activeDialog = this
            },
            _onCloseButtonClick: function () {
                this.close(!1)
            },
            close: function (ok) {
                if (this.fireEvent("close", ok) !== !1) {
                    this.fullscreen && (document.documentElement.style.overflowX = this._originalContext.html.overflowX,
                        document.documentElement.style.overflowY = this._originalContext.html.overflowY, document.body.style
                        .overflowX = this._originalContext.body.overflowX, document.body.style.overflowY = this._originalContext
                        .body.overflowY, delete this._originalContext), this._hide();
                    var content = this.getDom("content"),
                        iframe = this.getDom("iframe");
                    if (content && iframe) {
                        var doc = iframe.contentDocument || iframe.contentWindow.document;
                        doc && (doc.body.innerHTML = ""), domUtils.remove(content)
                    }
                }
            }
        }, utils.inherits(Dialog, UIBase)
    }(),
    function () {
        var utils = baidu.editor.utils,
            Menu = baidu.editor.ui.Menu,
            SplitButton = baidu.editor.ui.SplitButton,
            MenuButton = baidu.editor.ui.MenuButton = function (options) {
                this.initOptions(options), this.initMenuButton()
            };
        MenuButton.prototype = {
            initMenuButton: function () {
                var me = this;
                this.uiName = "menubutton", this.popup = new Menu({
                    items: me.items,
                    className: me.className,
                    editor: me.editor
                }), this.popup.addListener("show", function () {
                    for (var list = this, i = 0; i < list.items.length; i++) list.items[i].removeState("checked"), list
                            .items[i].value == me._value && (list.items[i].addState("checked"), this.value = me._value)
                }), this.initSplitButton()
            },
            setValue: function (value) {
                this._value = value
            }
        }, utils.inherits(MenuButton, SplitButton)
    }(),
    function () {
        var utils = baidu.editor.utils,
            Popup = baidu.editor.ui.Popup,
            SplitButton = baidu.editor.ui.SplitButton,
            MultiMenuPop = baidu.editor.ui.MultiMenuPop = function (options) {
                this.initOptions(options), this.initMultiMenu()
            };
        MultiMenuPop.prototype = {
            initMultiMenu: function () {
                var me = this;
                this.popup = new Popup({
                    content: "",
                    editor: me.editor,
                    iframe_rendered: !1,
                    onshow: function () {
                        this.iframe_rendered || (this.iframe_rendered = !0, this.getDom("content").innerHTML =
                            '<iframe id="' + me.id + '_iframe" src="' + me.iframeUrl + '" frameborder="0"></iframe>',
                            me.editor.container.style.zIndex && (this.getDom().style.zIndex = 1 * me.editor.container.style
                            .zIndex + 1))
                    }
                }), this.onbuttonclick = function () {
                    this.showPopup()
                }, this.initSplitButton()
            }
        }, utils.inherits(MultiMenuPop, SplitButton)
    }(),
    function () {
        function hideAllMenu(e) {
            var tgt = e.target || e.srcElement,
                cur = domUtils.findParent(tgt, function (node) {
                    return domUtils.hasClass(node, "edui-shortcutmenu") || domUtils.hasClass(node, "edui-popup")
                }, !0);
            if (!cur) for (var menu, i = 0; menu = allMenus[i++];) menu.hide()
        }
        var timeID, UI = baidu.editor.ui,
            UIBase = UI.UIBase,
            uiUtils = UI.uiUtils,
            utils = baidu.editor.utils,
            domUtils = baidu.editor.dom.domUtils,
            allMenus = [],
            isSubMenuShow = !1,
            ShortCutMenu = UI.ShortCutMenu = function (options) {
                this.initOptions(options), this.initShortCutMenu()
            };
        ShortCutMenu.postHide = hideAllMenu, ShortCutMenu.prototype = {
            isHidden: !0,
            SPACE: 5,
            initShortCutMenu: function () {
                this.items = this.items || [], this.initUIBase(), this.initItems(), this.initEvent(), allMenus.push(
                    this)
            },
            initEvent: function () {
                var me = this,
                    doc = me.editor.document;
                domUtils.on(doc, "mousemove", function (e) {
                    if (me.isHidden === !1) {
                        if (me.getSubMenuMark() || "contextmenu" == me.eventType) return;
                        var flag = !0,
                            el = me.getDom(),
                            wt = el.offsetWidth,
                            ht = el.offsetHeight,
                            distanceX = wt / 2 + me.SPACE,
                            distanceY = ht / 2,
                            x = Math.abs(e.screenX - me.left),
                            y = Math.abs(e.screenY - me.top);
                        clearTimeout(timeID), timeID = setTimeout(function () {
                            y > 0 && distanceY > y ? me.setOpacity(el, "1") : y > distanceY && distanceY + 70 > y ? (me
                                .setOpacity(el, "0.5"), flag = !1) : y > distanceY + 70 && distanceY + 140 > y && me.hide(),
                                flag && x > 0 && distanceX > x ? me.setOpacity(el, "1") : x > distanceX && distanceX +
                                70 > x ? me.setOpacity(el, "0.5") : x > distanceX + 70 && distanceX + 140 > x && me.hide()
                        })
                    }
                }), browser.chrome && domUtils.on(doc, "mouseout", function (e) {
                    var relatedTgt = e.relatedTarget || e.toElement;
                    (null == relatedTgt || "HTML" == relatedTgt.tagName) && me.hide()
                }), me.editor.addListener("afterhidepop", function () {
                    me.isHidden || (isSubMenuShow = !0)
                })
            },
            initItems: function () {
                if (utils.isArray(this.items)) for (var i = 0, len = this.items.length; len > i; i++) {
                        var item = this.items[i].toLowerCase();
                        UI[item] && (this.items[i] = new UI[item](this.editor), this.items[i].className +=
                            " edui-shortcutsubmenu ")
                }
            },
            setOpacity: function (el, value) {
                browser.ie && browser.version < 9 ? el.style.filter = "alpha(opacity = " + 100 * parseFloat(value) +
                    ");" : el.style.opacity = value
            },
            getSubMenuMark: function () {
                isSubMenuShow = !1;
                for (var node, layerEle = uiUtils.getFixedLayer(), list = domUtils.getElementsByTagName(layerEle, "div", function (
                        node) {
                        return domUtils.hasClass(node, "edui-shortcutsubmenu edui-popup")
                    }), i = 0; node = list[i++];) "none" != node.style.display && (isSubMenuShow = !0);
                return isSubMenuShow
            },
            show: function (e, hasContextmenu) {
                function setPos(offset) {
                    offset.left < 0 && (offset.left = 0), offset.top < 0 && (offset.top = 0), el.style.cssText =
                        "position:absolute;left:" + offset.left + "px;top:" + offset.top + "px;"
                }
                function setPosByCxtMenu(menu) {
                    menu.tagName || (menu = menu.getDom()), offset.left = parseInt(menu.style.left), offset.top =
                        parseInt(menu.style.top), offset.top -= el.offsetHeight + 15, setPos(offset)
                }
                var me = this,
                    offset = {}, el = this.getDom(),
                    fixedlayer = uiUtils.getFixedLayer();
                if (me.eventType = e.type, el.style.cssText = "display:block;left:-9999px", "contextmenu" == e.type &&
                    hasContextmenu) {
                    var menu = domUtils.getElementsByTagName(fixedlayer, "div", "edui-contextmenu")[0];
                    menu ? setPosByCxtMenu(menu) : me.editor.addListener("aftershowcontextmenu", function (type, menu) {
                        setPosByCxtMenu(menu)
                    })
                } else offset = uiUtils.getViewportOffsetByEvent(e), offset.top -= el.offsetHeight + me.SPACE, offset.left +=
                        me.SPACE + 20, setPos(offset), me.setOpacity(el, .2);
                me.isHidden = !1, me.left = e.screenX + el.offsetWidth / 2 - me.SPACE, me.top = e.screenY - el.offsetHeight /
                    2 - me.SPACE, me.editor && (el.style.zIndex = 1 * me.editor.container.style.zIndex + 10, fixedlayer
                    .style.zIndex = el.style.zIndex - 1)
            },
            hide: function () {
                this.getDom() && (this.getDom().style.display = "none"), this.isHidden = !0
            },
            postRender: function () {
                if (utils.isArray(this.items)) for (var item, i = 0; item = this.items[i++];) item.postRender()
            },
            getHtmlTpl: function () {
                var buff;
                if (utils.isArray(this.items)) {
                    buff = [];
                    for (var i = 0; i < this.items.length; i++) buff[i] = this.items[i].renderHtml();
                    buff = buff.join("")
                } else buff = this.items;
                return '<div id="##" class="%% edui-toolbar" data-src="shortcutmenu" onmousedown="return false;" onselectstart="return false;" >' +
                    buff + "</div>"
            }
        }, utils.inherits(ShortCutMenu, UIBase), domUtils.on(document, "mousedown", function (e) {
            hideAllMenu(e)
        }), domUtils.on(window, "scroll", function (e) {
            hideAllMenu(e)
        })
    }(),
    function () {
        var utils = baidu.editor.utils,
            UIBase = baidu.editor.ui.UIBase,
            Breakline = baidu.editor.ui.Breakline = function (options) {
                this.initOptions(options), this.initSeparator()
            };
        Breakline.prototype = {
            uiName: "Breakline",
            initSeparator: function () {
                this.initUIBase()
            },
            getHtmlTpl: function () {
                return "<br/>"
            }
        }, utils.inherits(Breakline, UIBase)
    }(),
    function () {
        var utils = baidu.editor.utils,
            domUtils = baidu.editor.dom.domUtils,
            UIBase = baidu.editor.ui.UIBase,
            Message = baidu.editor.ui.Message = function (options) {
                this.initOptions(options), this.initMessage()
            };
        Message.prototype = {
            initMessage: function () {
                this.initUIBase()
            },
            getHtmlTpl: function () {
                return '<div id="##" class="edui-message %%"> <div id="##_closer" class="edui-message-closer">×</div> <div id="##_body" class="edui-message-body edui-message-type-info"> <iframe style="position:absolute;z-index:-1;left:0;top:0;background-color: transparent;" frameborder="0" width="100%" height="100%" src="about:blank"></iframe> <div class="edui-shadow"></div> <div id="##_content" class="edui-message-content">  </div> </div></div>'
            },
            reset: function (opt) {
                var me = this;
                opt.keepshow || (clearTimeout(this.timer), me.timer = setTimeout(function () {
                    me.hide()
                }, opt.timeout || 4e3)), void 0 !== opt.content && me.setContent(opt.content), void 0 !== opt.type &&
                    me.setType(opt.type), me.show()
            },
            postRender: function () {
                var me = this,
                    closer = this.getDom("closer");
                closer && domUtils.on(closer, "click", function () {
                    me.hide()
                })
            },
            setContent: function (content) {
                this.getDom("content").innerHTML = content
            },
            setType: function (type) {
                type = type || "info";
                var body = this.getDom("body");
                body.className = body.className.replace(/edui-message-type-[\w-]+/, "edui-message-type-" + type)
            },
            getContent: function () {
                return this.getDom("content").innerHTML
            },
            getType: function () {
                var arr = this.getDom("body").match(/edui-message-type-([\w-]+)/);
                return arr ? arr[1] : ""
            },
            show: function () {
                this.getDom().style.display = "block"
            },
            hide: function () {
                var dom = this.getDom();
                dom && (dom.style.display = "none", dom.parentNode && dom.parentNode.removeChild(dom))
            }
        }, utils.inherits(Message, UIBase)
    }(),
    function () {
        var utils = baidu.editor.utils,
            editorui = baidu.editor.ui,
            _Dialog = editorui.Dialog;
        editorui.buttons = {}, editorui.Dialog = function (options) {
            var dialog = new _Dialog(options);
            return dialog.addListener("hide", function () {
                if (dialog.editor) {
                    var editor = dialog.editor;
                    try {
                        if (browser.gecko) {
                            var y = editor.window.scrollY,
                                x = editor.window.scrollX;
                            editor.body.focus(), editor.window.scrollTo(x, y)
                        } else editor.focus()
                    } catch (ex) {}
                }
            }), dialog
        };
        for (var ci, iframeUrlMap = UEDITOR_CONFIG.iframeUrlMap, btnCmds = ["undo", "redo", "formatmatch", "bold",
                    "italic", "underline", "fontborder", "touppercase", "tolowercase", "strikethrough", "subscript",
                    "superscript", "source", "indent", "outdent", "blockquote", "pasteplain", "pagebreak", "selectall",
                    "print", "horizontal", "removeformat", "time", "date", "unlink", "insertparagraphbeforetable",
                    "insertrow", "insertcol", "mergeright", "mergedown", "deleterow", "deletecol", "splittorows",
                    "splittocols", "splittocells", "mergecells", "deletetable", "drafts", "create_rank", "create_vote",
                    "upload_video", "groupimages"], i = 0; ci = btnCmds[i++];) ci = ci.toLowerCase(), editorui[ci] = function (
                cmd) {
                return function (editor) {
                    var ui = new editorui.Button({
                        className: "edui-for-" + cmd,
                        title: editor.options.labelMap[cmd] || editor.getLang("labelMap." + cmd) || "",
                        onclick: function () {
                            editor.execCommand(cmd)
                        },
                        theme: editor.options.theme,
                        showText: !1
                    });
                    return editorui.buttons[cmd] = ui, editor.addListener("selectionchange", function (type, causeByUi,
                        uiReady) {
                        var state = editor.queryCommandState(cmd); - 1 == state ? (ui.setDisabled(!0), ui.setChecked(!1)) :
                            uiReady || (ui.setDisabled(!1), ui.setChecked(state))
                    }), ui
                }
        }(ci);
        editorui.cleardoc = function (editor) {
            var ui = new editorui.Button({
                className: "edui-for-cleardoc",
                title: editor.options.labelMap.cleardoc || editor.getLang("labelMap.cleardoc") || "",
                theme: editor.options.theme,
                onclick: function () {
                    confirm(editor.getLang("confirmClear")) && editor.execCommand("cleardoc")
                }
            });
            return editorui.buttons.cleardoc = ui, editor.addListener("selectionchange", function () {
                ui.setDisabled(-1 == editor.queryCommandState("cleardoc"))
            }), ui
        };
        var typeset = {
            justify: ["left", "right", "center", "justify"],
            imagefloat: ["none", "left", "center", "right"],
            directionality: ["ltr", "rtl"]
        };
        for (var p in typeset)! function (cmd, val) {
            for (var ci, i = 0; ci = val[i++];)! function (cmd2) {
                editorui[cmd.replace("float", "") + cmd2] = function (editor) {
                    var ui = new editorui.Button({
                        className: "edui-for-" + cmd.replace("float", "") + cmd2,
                        title: editor.options.labelMap[cmd.replace("float", "") + cmd2] || editor.getLang("labelMap." +
                            cmd.replace("float", "") + cmd2) || "",
                        theme: editor.options.theme,
                        onclick: function () {
                            editor.execCommand(cmd, cmd2)
                        }
                    });
                    return editorui.buttons[cmd] = ui, editor.addListener("selectionchange", function (type, causeByUi,
                        uiReady) {
                        ui.setDisabled(-1 == editor.queryCommandState(cmd)), ui.setChecked(editor.queryCommandValue(cmd) ==
                            cmd2 && !uiReady)
                    }), ui
                }
            }(ci)
        }(p, typeset[p]);
        for (var ci, i = 0; ci = ["backcolor", "forecolor"][i++];) editorui[ci] = function (cmd) {
                return function (editor) {
                    var ui = new editorui.ColorButton({
                        className: "edui-for-" + cmd,
                        color: "default",
                        title: editor.options.labelMap[cmd] || editor.getLang("labelMap." + cmd) || "",
                        editor: editor,
                        onpickcolor: function (t, color) {
                            editor.execCommand(cmd, color)
                        },
                        onpicknocolor: function () {
                            editor.execCommand(cmd, "default"), this.setColor("transparent"), this.color = "default"
                        },
                        onbuttonclick: function () {
                            editor.execCommand(cmd, this.color)
                        }
                    });
                    return editorui.buttons[cmd] = ui, editor.addListener("selectionchange", function () {
                        ui.setDisabled(-1 == editor.queryCommandState(cmd))
                    }), ui
                }
        }(ci);
        var dialogBtns = {
            noOk: ["searchreplace", "help", "spechars", "webapp", "preview"],
            ok: ["attachment", "anchor", "link", "insertimage", "map", "gmap", "insertframe", "wordimage",
                    "insertvideo", "insertframe", "edittip", "edittable", "edittd", "scrawl", "template", "music",
                    "background", "charts"]
        };
        for (var p in dialogBtns)! function (type, vals) {
            for (var ci, i = 0; ci = vals[i++];) browser.opera && "searchreplace" === ci || ! function (cmd) {
                    editorui[cmd] = function (editor, iframeUrl, title) {
                        iframeUrl = iframeUrl || (editor.options.iframeUrlMap || {})[cmd] || iframeUrlMap[cmd], title =
                            editor.options.labelMap[cmd] || editor.getLang("labelMap." + cmd) || "";
                        var dialog;
                        iframeUrl && (dialog = new editorui.Dialog(utils.extend({
                            iframeUrl: editor.ui.mapUrl(iframeUrl),
                            editor: editor,
                            className: "edui-for-" + cmd,
                            title: title,
                            holdScroll: "insertimage" === cmd,
                            fullscreen: /charts|preview/.test(cmd),
                            closeDialog: editor.getLang("closeDialog")
                        }, "ok" == type ? {
                            buttons: [{
                                    className: "edui-okbutton",
                                    label: editor.getLang("ok"),
                                    editor: editor,
                                    onclick: function () {
                                        dialog.close(!0)
                                    }
                                }, {
                                    className: "edui-cancelbutton",
                                    label: editor.getLang("cancel"),
                                    editor: editor,
                                    onclick: function () {
                                        dialog.close(!1)
                                    }
                                }]
                        } : {})), editor.ui._dialogs[cmd + "Dialog"] = dialog);
                        var ui = new editorui.Button({
                            className: "edui-for-" + cmd,
                            title: title,
                            onclick: function () {
                                if (dialog) switch (cmd) {
                                    case "wordimage":
                                        var images = editor.execCommand("wordimage");
                                        images && images.length && (dialog.render(), dialog.open());
                                        break;
                                    case "scrawl":
                                        -1 != editor.queryCommandState("scrawl") && (dialog.render(), dialog.open());
                                        break;
                                    default:
                                        dialog.render(), dialog.open()
                                }
                            },
                            theme: editor.options.theme,
                            disabled: "scrawl" == cmd && -1 == editor.queryCommandState("scrawl") || "charts" == cmd
                        });
                        return editorui.buttons[cmd] = ui, editor.addListener("selectionchange", function () {
                            var unNeedCheckState = {
                                edittable: 1
                            };
                            if (!(cmd in unNeedCheckState)) {
                                var state = editor.queryCommandState(cmd);
                                ui.getDom() && (ui.setDisabled(-1 == state), ui.setChecked(state))
                            }
                        }), ui
                    }
            }(ci.toLowerCase())
        }(p, dialogBtns[p]);
        editorui.snapscreen = function (editor, iframeUrl, title) {
            title = editor.options.labelMap.snapscreen || editor.getLang("labelMap.snapscreen") || "";
            var ui = new editorui.Button({
                className: "edui-for-snapscreen",
                title: title,
                onclick: function () {
                    editor.execCommand("snapscreen")
                },
                theme: editor.options.theme
            });
            if (editorui.buttons.snapscreen = ui, iframeUrl = iframeUrl || (editor.options.iframeUrlMap || {}).snapscreen ||
                iframeUrlMap.snapscreen) {
                var dialog = new editorui.Dialog({
                    iframeUrl: editor.ui.mapUrl(iframeUrl),
                    editor: editor,
                    className: "edui-for-snapscreen",
                    title: title,
                    buttons: [{
                            className: "edui-okbutton",
                            label: editor.getLang("ok"),
                            editor: editor,
                            onclick: function () {
                                dialog.close(!0)
                            }
                        }, {
                            className: "edui-cancelbutton",
                            label: editor.getLang("cancel"),
                            editor: editor,
                            onclick: function () {
                                dialog.close(!1)
                            }
                        }]
                });
                dialog.render(), editor.ui._dialogs.snapscreenDialog = dialog
            }
            return editor.addListener("selectionchange", function () {
                ui.setDisabled(-1 == editor.queryCommandState("snapscreen"))
            }), ui
        }, editorui.insertcode = function (editor, list, title) {
            list = editor.options.insertcode || [], title = editor.options.labelMap.insertcode || editor.getLang(
                "labelMap.insertcode") || "";
            var items = [];
            utils.each(list, function (key, val) {
                items.push({
                    label: key,
                    value: val,
                    theme: editor.options.theme,
                    renderLabelHtml: function () {
                        return '<div class="edui-label %%-label" >' + (this.label || "") + "</div>"
                    }
                })
            });
            var ui = new editorui.Combox({
                editor: editor,
                items: items,
                onselect: function (t, index) {
                    editor.execCommand("insertcode", this.items[index].value)
                },
                onbuttonclick: function () {
                    this.showPopup()
                },
                title: title,
                initValue: title,
                className: "edui-for-insertcode",
                indexByValue: function (value) {
                    if (value) for (var ci, i = 0; ci = this.items[i]; i++) if (-1 != ci.value.indexOf(value)) return i;
                    return -1
                }
            });
            return editorui.buttons.insertcode = ui, editor.addListener("selectionchange", function (type, causeByUi,
                uiReady) {
                if (!uiReady) {
                    var state = editor.queryCommandState("insertcode");
                    if (-1 == state) ui.setDisabled(!0);
                    else {
                        ui.setDisabled(!1);
                        var value = editor.queryCommandValue("insertcode");
                        if (!value) return void ui.setValue(title);
                        value && (value = value.replace(/['"]/g, "").split(",")[0]), ui.setValue(value)
                    }
                }
            }), ui
        }, editorui.fontfamily = function (editor, list, title) {
            if (list = editor.options.fontfamily || [], title = editor.options.labelMap.fontfamily || editor.getLang(
                "labelMap.fontfamily") || "", list.length) {
                for (var ci, i = 0, items = []; ci = list[i]; i++) {
                    var langLabel = editor.getLang("fontfamily")[ci.name] || "";
                    ! function (key, val) {
                        items.push({
                            label: key,
                            value: val,
                            theme: editor.options.theme,
                            renderLabelHtml: function () {
                                return '<div class="edui-label %%-label" style="font-family:' + utils.unhtml(this.value) +
                                    '">' + (this.label || "") + "</div>";
 
                            }
                        })
                    }(ci.label || langLabel, ci.val)
                }
                var ui = new editorui.Combox({
                    editor: editor,
                    items: items,
                    onselect: function (t, index) {
                        editor.execCommand("FontFamily", this.items[index].value)
                    },
                    onbuttonclick: function () {
                        this.showPopup()
                    },
                    title: title,
                    initValue: title,
                    className: "edui-for-fontfamily",
                    indexByValue: function (value) {
                        if (value) for (var ci, i = 0; ci = this.items[i]; i++) if (-1 != ci.value.indexOf(value))
                                    return i;
                        return -1
                    }
                });
                return editorui.buttons.fontfamily = ui, editor.addListener("selectionchange", function (type,
                    causeByUi, uiReady) {
                    if (!uiReady) {
                        var state = editor.queryCommandState("FontFamily");
                        if (-1 == state) ui.setDisabled(!0);
                        else {
                            ui.setDisabled(!1);
                            var value = editor.queryCommandValue("FontFamily");
                            value && (value = value.replace(/['"]/g, "").split(",")[0]), ui.setValue(value)
                        }
                    }
                }), ui
            }
        }, editorui.fontsize = function (editor, list, title) {
            if (title = editor.options.labelMap.fontsize || editor.getLang("labelMap.fontsize") || "", list = list ||
                editor.options.fontsize || [], list.length) {
                for (var items = [], i = 0; i < list.length; i++) {
                    var size = list[i] + "px";
                    items.push({
                        label: size,
                        value: size,
                        theme: editor.options.theme,
                        renderLabelHtml: function () {
                            return '<div class="edui-label %%-label" style="line-height:1;font-size:' + this.value +
                                '">' + (this.label || "") + "</div>"
                        }
                    })
                }
                var ui = new editorui.Combox({
                    editor: editor,
                    items: items,
                    title: title,
                    initValue: title,
                    onselect: function (t, index) {
                        editor.execCommand("FontSize", this.items[index].value)
                    },
                    onbuttonclick: function () {
                        this.showPopup()
                    },
                    className: "edui-for-fontsize"
                });
                return editorui.buttons.fontsize = ui, editor.addListener("selectionchange", function (type, causeByUi,
                    uiReady) {
                    if (!uiReady) {
                        var state = editor.queryCommandState("FontSize"); - 1 == state ? ui.setDisabled(!0) : (ui.setDisabled(!
                            1), ui.setValue(editor.queryCommandValue("FontSize")))
                    }
                }), ui
            }
        }, editorui.paragraph = function (editor, list, title) {
            if (title = editor.options.labelMap.paragraph || editor.getLang("labelMap.paragraph") || "", list = editor.options
                .paragraph || [], !utils.isEmptyObject(list)) {
                var items = [];
                for (var i in list) items.push({
                        value: i,
                        label: list[i] || editor.getLang("paragraph")[i],
                        theme: editor.options.theme,
                        renderLabelHtml: function () {
                            return '<div class="edui-label %%-label"><span class="edui-for-' + this.value + '">' + (
                                this.label || "") + "</span></div>"
                        }
                    });
                var ui = new editorui.Combox({
                    editor: editor,
                    items: items,
                    title: title,
                    initValue: title,
                    className: "edui-for-paragraph",
                    onselect: function (t, index) {
                        editor.execCommand("Paragraph", this.items[index].value)
                    },
                    onbuttonclick: function () {
                        this.showPopup()
                    }
                });
                return editorui.buttons.paragraph = ui, editor.addListener("selectionchange", function (type, causeByUi,
                    uiReady) {
                    if (!uiReady) {
                        var state = editor.queryCommandState("Paragraph");
                        if (-1 == state) ui.setDisabled(!0);
                        else {
                            ui.setDisabled(!1);
                            var value = editor.queryCommandValue("Paragraph"),
                                index = ui.indexByValue(value);
                            ui.setValue(-1 != index ? value : ui.initValue)
                        }
                    }
                }), ui
            }
        }, editorui.customstyle = function (editor) {
            var list = editor.options.customstyle || [],
                title = editor.options.labelMap.customstyle || editor.getLang("labelMap.customstyle") || "";
            if (list.length) {
                for (var t, langCs = editor.getLang("customstyle"), i = 0, items = []; t = list[i++];)! function (t) {
                    var ck = {};
                    ck.label = t.label ? t.label : langCs[t.name], ck.style = t.style, ck.className = t.className, ck.tag =
                        t.tag, items.push({
                        label: ck.label,
                        value: ck,
                        theme: editor.options.theme,
                        renderLabelHtml: function () {
                            return '<div class="edui-label %%-label"><' + ck.tag + " " + (ck.className ? ' class="' +
                                ck.className + '"' : "") + (ck.style ? ' style="' + ck.style + '"' : "") + ">" + ck.label +
                                "</" + ck.tag + "></div>"
                        }
                    })
                }(t);
                var ui = new editorui.Combox({
                    editor: editor,
                    items: items,
                    title: title,
                    initValue: title,
                    className: "edui-for-customstyle",
                    onselect: function (t, index) {
                        editor.execCommand("customstyle", this.items[index].value)
                    },
                    onbuttonclick: function () {
                        this.showPopup()
                    },
                    indexByValue: function (value) {
                        for (var ti, i = 0; ti = this.items[i++];) if (ti.label == value) return i - 1;
                        return -1
                    }
                });
                return editorui.buttons.customstyle = ui, editor.addListener("selectionchange", function (type,
                    causeByUi, uiReady) {
                    if (!uiReady) {
                        var state = editor.queryCommandState("customstyle");
                        if (-1 == state) ui.setDisabled(!0);
                        else {
                            ui.setDisabled(!1);
                            var value = editor.queryCommandValue("customstyle"),
                                index = ui.indexByValue(value);
                            ui.setValue(-1 != index ? value : ui.initValue)
                        }
                    }
                }), ui
            }
        }, editorui.inserttable = function (editor, iframeUrl, title) {
            title = editor.options.labelMap.inserttable || editor.getLang("labelMap.inserttable") || "";
            var ui = new editorui.TableButton({
                editor: editor,
                title: title,
                className: "edui-for-inserttable",
                onpicktable: function (t, numCols, numRows) {
                    editor.execCommand("InsertTable", {
                        numRows: numRows,
                        numCols: numCols,
                        border: 1
                    })
                },
                onbuttonclick: function () {
                    this.showPopup()
                }
            });
            return editorui.buttons.inserttable = ui, editor.addListener("selectionchange", function () {
                ui.setDisabled(-1 == editor.queryCommandState("inserttable"))
            }), ui
        }, editorui.lineheight = function (editor) {
            var val = editor.options.lineheight || [];
            if (val.length) {
                for (var ci, i = 0, items = []; ci = val[i++];) items.push({
                        label: ci,
                        value: ci,
                        theme: editor.options.theme,
                        onclick: function () {
                            editor.execCommand("lineheight", this.value)
                        }
                    });
                var ui = new editorui.MenuButton({
                    editor: editor,
                    className: "edui-for-lineheight",
                    title: editor.options.labelMap.lineheight || editor.getLang("labelMap.lineheight") || "",
                    items: items,
                    onbuttonclick: function () {
                        var value = editor.queryCommandValue("LineHeight") || this.value;
                        editor.execCommand("LineHeight", value)
                    }
                });
                return editorui.buttons.lineheight = ui, editor.addListener("selectionchange", function () {
                    var state = editor.queryCommandState("LineHeight");
                    if (-1 == state) ui.setDisabled(!0);
                    else {
                        ui.setDisabled(!1);
                        var value = editor.queryCommandValue("LineHeight");
                        value && ui.setValue((value + "").replace(/cm/, "")), ui.setChecked(state)
                    }
                }), ui
            }
        };
        for (var ri, rowspacings = ["top", "bottom"], r = 0; ri = rowspacings[r++];)! function (cmd) {
            editorui["rowspacing" + cmd] = function (editor) {
                var val = editor.options["rowspacing" + cmd] || [];
                if (!val.length) return null;
                for (var ci, i = 0, items = []; ci = val[i++];) items.push({
                        label: ci,
                        value: ci,
                        theme: editor.options.theme,
                        onclick: function () {
                            editor.execCommand("rowspacing", this.value, cmd)
                        }
                    });
                var ui = new editorui.MenuButton({
                    editor: editor,
                    className: "edui-for-rowspacing" + cmd,
                    title: editor.options.labelMap["rowspacing" + cmd] || editor.getLang("labelMap.rowspacing" + cmd) || "",
                    items: items,
                    onbuttonclick: function () {
                        var value = editor.queryCommandValue("rowspacing", cmd) || this.value;
                        editor.execCommand("rowspacing", value, cmd)
                    }
                });
                return editorui.buttons[cmd] = ui, editor.addListener("selectionchange", function () {
                    var state = editor.queryCommandState("rowspacing", cmd);
                    if (-1 == state) ui.setDisabled(!0);
                    else {
                        ui.setDisabled(!1);
                        var value = editor.queryCommandValue("rowspacing", cmd);
                        value && ui.setValue((value + "").replace(/%/, "")), ui.setChecked(state)
                    }
                }), ui
            }
        }(ri);
        for (var cl, lists = ["insertorderedlist", "insertunorderedlist"], l = 0; cl = lists[l++];)! function (cmd) {
            editorui[cmd] = function (editor) {
                var vals = editor.options[cmd],
                    _onMenuClick = function () {
                        editor.execCommand(cmd, this.value)
                    }, items = [];
                for (var i in vals) items.push({
                        label: vals[i] || editor.getLang()[cmd][i] || "",
                        value: i,
                        theme: editor.options.theme,
                        onclick: _onMenuClick
                    });
                var ui = new editorui.MenuButton({
                    editor: editor,
                    className: "edui-for-" + cmd,
                    title: editor.getLang("labelMap." + cmd) || "",
                    items: items,
                    onbuttonclick: function () {
                        var value = editor.queryCommandValue(cmd) || this.value;
                        editor.execCommand(cmd, value)
                    }
                });
                return editorui.buttons[cmd] = ui, editor.addListener("selectionchange", function () {
                    var state = editor.queryCommandState(cmd);
                    if (-1 == state) ui.setDisabled(!0);
                    else {
                        ui.setDisabled(!1);
                        var value = editor.queryCommandValue(cmd);
                        ui.setValue(value), ui.setChecked(state)
                    }
                }), ui
            }
        }(cl);
        editorui.fullscreen = function (editor, title) {
            title = editor.options.labelMap.fullscreen || editor.getLang("labelMap.fullscreen") || "";
            var ui = new editorui.Button({
                className: "edui-for-fullscreen",
                title: title,
                theme: editor.options.theme,
                onclick: function () {
                    editor.ui && editor.ui.setFullScreen(!editor.ui.isFullScreen()), this.setChecked(editor.ui.isFullScreen())
                }
            });
            return editorui.buttons.fullscreen = ui, editor.addListener("selectionchange", function () {
                var state = editor.queryCommandState("fullscreen");
                ui.setDisabled(-1 == state), ui.setChecked(editor.ui.isFullScreen())
            }), ui
        }, editorui.emotion = function (editor, iframeUrl) {
            var cmd = "emotion",
                ui = new editorui.MultiMenuPop({
                    title: editor.options.labelMap[cmd] || editor.getLang("labelMap." + cmd) || "",
                    editor: editor,
                    className: "edui-for-" + cmd,
                    iframeUrl: editor.ui.mapUrl(iframeUrl || (editor.options.iframeUrlMap || {})[cmd] || iframeUrlMap[
                        cmd])
                });
            return editorui.buttons[cmd] = ui, editor.addListener("selectionchange", function () {
                ui.setDisabled(-1 == editor.queryCommandState(cmd))
            }), ui
        }, editorui.autotypeset = function (editor) {
            var ui = new editorui.AutoTypeSetButton({
                editor: editor,
                title: editor.options.labelMap.autotypeset || editor.getLang("labelMap.autotypeset") || "",
                className: "edui-for-autotypeset",
                onbuttonclick: function () {
                    editor.execCommand("autotypeset")
                }
            });
            return editorui.buttons.autotypeset = ui, editor.addListener("selectionchange", function () {
                ui.setDisabled(-1 == editor.queryCommandState("autotypeset"))
            }), ui
        }, editorui.simpleupload = function (editor) {
            var name = "simpleupload",
                ui = new editorui.Button({
                    className: "edui-for-" + name,
                    title: editor.options.labelMap[name] || editor.getLang("labelMap." + name) || "",
                    onclick: function () {},
                    theme: editor.options.theme,
                    showText: !1
                });
            return editorui.buttons[name] = ui, editor.addListener("ready", function () {
                var b = ui.getDom("body"),
                    iconSpan = b.children[0];
                editor.fireEvent("simpleuploadbtnready", iconSpan)
            }), editor.addListener("selectionchange", function (type, causeByUi, uiReady) {
                var state = editor.queryCommandState(name); - 1 == state ? (ui.setDisabled(!0), ui.setChecked(!1)) :
                    uiReady || (ui.setDisabled(!1), ui.setChecked(state))
            }), ui
        }
    }(),
    function () {
        function EditorUI(options) {
            this.initOptions(options), this.initEditorUI()
        }
        var utils = baidu.editor.utils,
            uiUtils = baidu.editor.ui.uiUtils,
            UIBase = baidu.editor.ui.UIBase,
            domUtils = baidu.editor.dom.domUtils,
            nodeStack = [];
        EditorUI.prototype = {
            uiName: "editor",
            initEditorUI: function () {
                function setCount(editor, ui) {
                    editor.setOpt({
                        wordCount: !0,
                        maximumWords: 1e4,
                        wordCountMsg: editor.options.wordCountMsg || editor.getLang("wordCountMsg"),
                        wordOverFlowMsg: editor.options.wordOverFlowMsg || editor.getLang("wordOverFlowMsg")
                    });
                    var opt = editor.options,
                        max = opt.maximumWords,
                        msg = opt.wordCountMsg,
                        errMsg = opt.wordOverFlowMsg,
                        countDom = ui.getDom("wordcount");
                    if (opt.wordCount) {
                        var count = editor.getContentLength(!0);
                        count > max ? (countDom.innerHTML = errMsg, editor.fireEvent("wordcountoverflow")) : countDom.innerHTML =
                            msg.replace("{#leave}", max - count).replace("{#count}", count)
                    }
                }
                this.editor.ui = this, this._dialogs = {}, this.initUIBase(), this._initToolbars();
                var editor = this.editor,
                    me = this;
                editor.addListener("ready", function () {
                    function countFn() {
                        setCount(editor, me), domUtils.un(editor.document, "click", arguments.callee)
                    }
                    editor.getDialog = function (name) {
                        return editor.ui._dialogs[name + "Dialog"]
                    }, domUtils.on(editor.window, "scroll", function (evt) {
                        baidu.editor.ui.Popup.postHide(evt)
                    }), editor.ui._actualFrameWidth = editor.options.initialFrameWidth, UE.browser.ie && 6 === UE.browser
                        .version && editor.container.ownerDocument.execCommand("BackgroundImageCache", !1, !0), editor.options
                        .elementPathEnabled && (editor.ui.getDom("elementpath").innerHTML =
                        '<div class="edui-editor-breadcrumb">' + editor.getLang("elementPathTip") + ":</div>"), editor.options
                        .wordCount && (domUtils.on(editor.document, "click", countFn), editor.ui.getDom("wordcount").innerHTML =
                        editor.getLang("wordCountTip")), editor.ui._scale(), editor.options.scaleEnabled ? (editor.autoHeightEnabled &&
                        editor.disableAutoHeight(), me.enableScale()) : me.disableScale(), editor.options.elementPathEnabled ||
                        editor.options.wordCount || editor.options.scaleEnabled || (editor.ui.getDom("elementpath").style
                        .display = "none", editor.ui.getDom("wordcount").style.display = "none", editor.ui.getDom(
                        "scale").style.display = "none"), editor.selection.isFocus() && editor.fireEvent(
                        "selectionchange", !1, !0)
                }), editor.addListener("mousedown", function (t, evt) {
                    var el = evt.target || evt.srcElement;
                    baidu.editor.ui.Popup.postHide(evt, el), baidu.editor.ui.ShortCutMenu.postHide(evt)
                }), editor.addListener("delcells", function () {
                    UE.ui.edittip && new UE.ui.edittip(editor), editor.getDialog("edittip").open()
                });
                var pastePop, timer, isPaste = !1;
                editor.addListener("afterpaste", function () {
                    editor.queryCommandState("pasteplain") || (baidu.editor.ui.PastePicker && (pastePop = new baidu.editor
                        .ui.Popup({
                        content: new baidu.editor.ui.PastePicker({
                            editor: editor
                        }),
                        editor: editor,
                        className: "edui-wordpastepop"
                    }), pastePop.render()), isPaste = !0)
                }), editor.addListener("afterinserthtml", function () {
                    clearTimeout(timer), timer = setTimeout(function () {
                        if (pastePop && (isPaste || editor.ui._isTransfer)) {
                            if (pastePop.isHidden()) {
                                var span = domUtils.createElement(editor.document, "span", {
                                    style: "line-height:0px;",
                                    innerHTML: "\ufeff"
                                }),
                                    range = editor.selection.getRange();
                                range.insertNode(span);
                                var tmp = getDomNode(span, "firstChild", "previousSibling");
                                tmp && pastePop.showAnchor(3 == tmp.nodeType ? tmp.parentNode : tmp), domUtils.remove(
                                    span)
                            } else pastePop.show();
                            delete editor.ui._isTransfer, isPaste = !1
                        }
                    }, 200)
                }), editor.addListener("contextmenu", function (t, evt) {
                    baidu.editor.ui.Popup.postHide(evt)
                }), editor.addListener("keydown", function (t, evt) {
                    pastePop && pastePop.dispose(evt);
                    var keyCode = evt.keyCode || evt.which;
                    evt.altKey && 90 == keyCode && UE.ui.buttons.fullscreen.onclick()
                }), editor.addListener("wordcount", function () {
                    setCount(this, me)
                }), editor.addListener("selectionchange", function () {
                    editor.options.elementPathEnabled && me[(-1 == editor.queryCommandState("elementpath") ? "dis" :
                        "en") + "ableElementPath"](), editor.options.scaleEnabled && me[(-1 == editor.queryCommandState(
                        "scale") ? "dis" : "en") + "ableScale"]()
                });
                var popup = new baidu.editor.ui.Popup({
                    editor: editor,
                    content: "",
                    className: "edui-bubble",
                    _onEditButtonClick: function () {
                        this.hide(), editor.ui._dialogs.linkDialog.open()
                    },
                    _onImgEditButtonClick: function (name) {
                        this.hide(), editor.ui._dialogs[name] && editor.ui._dialogs[name].open()
                    },
                    _onImgSetFloat: function (value) {
                        this.hide(), editor.execCommand("imagefloat", value)
                    },
                    _setIframeAlign: function (value) {
                        var frame = popup.anchorEl,
                            newFrame = frame.cloneNode(!0);
                        switch (value) {
                        case -2:
                            newFrame.setAttribute("align", "");
                            break;
                        case -1:
                            newFrame.setAttribute("align", "left");
                            break;
                        case 1:
                            newFrame.setAttribute("align", "right")
                        }
                        frame.parentNode.insertBefore(newFrame, frame), domUtils.remove(frame), popup.anchorEl =
                            newFrame, popup.showAnchor(popup.anchorEl)
                    },
                    _updateIframe: function () {
                        var frame = editor._iframe = popup.anchorEl;
                        domUtils.hasClass(frame, "ueditor_baidumap") ? (editor.selection.getRange().selectNode(frame).select(),
                            editor.ui._dialogs.mapDialog.open(), popup.hide()) : (editor.ui._dialogs.insertframeDialog.open(),
                            popup.hide())
                    },
                    _onRemoveButtonClick: function (cmdName) {
                        editor.execCommand(cmdName), this.hide()
                    },
                    queryAutoHide: function (el) {
                        return el && el.ownerDocument == editor.document && ("img" == el.tagName.toLowerCase() ||
                            domUtils.findParentByTagName(el, "a", !0)) ? el !== popup.anchorEl : baidu.editor.ui.Popup.prototype
                            .queryAutoHide.call(this, el)
                    }
                });
                popup.render(), editor.options.imagePopup && (editor.addListener("mouseover", function (t, evt) {
                    evt = evt || window.event;
                    var el = evt.target || evt.srcElement;
                    if (editor.ui._dialogs.insertframeDialog && /iframe/gi.test(el.tagName)) {
                        var html = popup.formatHtml("<nobr>" + editor.getLang("property") +
                            ': <span onclick=$$._setIframeAlign(-2) class="edui-clickable">' + editor.getLang("default") +
                            '</span>  <span onclick=$$._setIframeAlign(-1) class="edui-clickable">' + editor.getLang(
                            "justifyleft") +
                            '</span>  <span onclick=$$._setIframeAlign(1) class="edui-clickable">' + editor.getLang(
                            "justifyright") +
                            '</span>   <span onclick="$$._updateIframe( this);" class="edui-clickable">' +
                            editor.getLang("modify") + "</span></nobr>");
                        html ? (popup.getDom("content").innerHTML = html, popup.anchorEl = el, popup.showAnchor(popup.anchorEl)) :
                            popup.hide()
                    }
                }), editor.addListener("selectionchange", function (t, causeByUi) {
                    if (causeByUi) {
                        var html = "",
                            str = "",
                            img = editor.selection.getRange().getClosedNode(),
                            dialogs = editor.ui._dialogs;
                        if (img && "IMG" == img.tagName) {
                            var dialogName = "insertimageDialog";
                            if ((-1 != img.className.indexOf("edui-faked-video") || -1 != img.className.indexOf(
                                "edui-upload-video")) && (dialogName = "insertvideoDialog"), -1 != img.className.indexOf(
                                "edui-faked-webapp") && (dialogName = "webappDialog"), -1 != img.src.indexOf(
                                "http://api.map.baidu.com") && (dialogName = "mapDialog"), -1 != img.className.indexOf(
                                "edui-faked-music") && (dialogName = "musicDialog"), -1 != img.src.indexOf(
                                "http://maps.google.com/maps/api/staticmap") && (dialogName = "gmapDialog"), img.getAttribute(
                                "anchorname") && (dialogName = "anchorDialog", html = popup.formatHtml("<nobr>" +
                                editor.getLang("property") +
                                ': <span onclick=$$._onImgEditButtonClick("anchorDialog") class="edui-clickable">' +
                                editor.getLang("modify") +
                                "</span>  <span onclick=$$._onRemoveButtonClick('anchor') class=\"edui-clickable\">" +
                                editor.getLang("delete") + "</span></nobr>")), img.getAttribute("word_img") && (editor.word_img = [
                                    img.getAttribute("word_img")], dialogName = "wordimageDialog"), (domUtils.hasClass(
                                img, "loadingclass") || domUtils.hasClass(img, "loaderrorclass")) && (dialogName = ""), !
                                dialogs[dialogName]) return;
                            str = "<nobr>" + editor.getLang("property") +
                                ': <span onclick=$$._onImgSetFloat("none") class="edui-clickable">' + editor.getLang(
                                "default") +
                                '</span>  <span onclick=$$._onImgSetFloat("left") class="edui-clickable">' +
                                editor.getLang("justifyleft") +
                                '</span>  <span onclick=$$._onImgSetFloat("right") class="edui-clickable">' +
                                editor.getLang("justifyright") +
                                '</span>  <span onclick=$$._onImgSetFloat("center") class="edui-clickable">' +
                                editor.getLang("justifycenter") +
                                "</span>  <span onclick=\"$$._onImgEditButtonClick('" + dialogName +
                                '\');" class="edui-clickable">' + editor.getLang("modify") + "</span></nobr>", !html &&
                                (html = popup.formatHtml(str))
                        }
                        if (editor.ui._dialogs.linkDialog) {
                            var url, link = editor.queryCommandValue("link");
                            if (link && (url = link.getAttribute("_href") || link.getAttribute("href", 2))) {
                                var txt = url;
                                url.length > 30 && (txt = url.substring(0, 20) + "..."), html && (html +=
                                    '<div style="height:5px;"></div>'), html += popup.formatHtml("<nobr>" + editor.getLang(
                                    "anthorMsg") + ': <a target="_blank" href="' + url + '" title="' + url + '" >' +
                                    txt + '</a> <span class="edui-clickable" onclick="$$._onEditButtonClick();">' +
                                    editor.getLang("modify") +
                                    '</span> <span class="edui-clickable" onclick="$$._onRemoveButtonClick(\'unlink\');"> ' +
                                    editor.getLang("clear") + "</span></nobr>"), popup.showAnchor(link)
                            }
                        }
                        html ? (popup.getDom("content").innerHTML = html, popup.anchorEl = img || link, popup.showAnchor(
                            popup.anchorEl)) : popup.hide()
                    }
                }))
            },
            _initToolbars: function () {
                var editor = this.editor,
                    toolbars = this.toolbars || [];
                /iphone|ipad|ipod|android/gi.test(navigator.userAgent) && this.toolbarsForMobile && (toolbars = this.toolbarsForMobile);
                for (var toolbarUis = [], i = 0; i < toolbars.length; i++) {
                    for (var toolbar = toolbars[i], toolbarUi = new baidu.editor.ui.Toolbar({
                            theme: editor.options.theme
                        }), j = 0; j < toolbar.length; j++) {
                        var toolbarItem = toolbar[j],
                            toolbarItemUi = null;
                        if ("string" == typeof toolbarItem) {
                            if (toolbarItem = toolbarItem.toLowerCase(), "|" == toolbarItem && (toolbarItem =
                                "Separator"), "||" == toolbarItem && (toolbarItem = "Breakline"), baidu.editor.ui[
                                toolbarItem] && (toolbarItemUi = new baidu.editor.ui[toolbarItem](editor)),
                                "fullscreen" == toolbarItem) {
                                toolbarUis && toolbarUis[0] ? toolbarUis[0].items.splice(0, 0, toolbarItemUi) :
                                    toolbarItemUi && toolbarUi.items.splice(0, 0, toolbarItemUi);
                                continue
                            }
                        } else toolbarItemUi = toolbarItem;
                        toolbarItemUi && toolbarItemUi.id && toolbarUi.add(toolbarItemUi)
                    }
                    toolbarUis[i] = toolbarUi
                }
                utils.each(UE._customizeUI, function (obj, key) {
                    var itemUI, index;
                    return obj.id && obj.id != editor.key ? !1 : (itemUI = obj.execFn.call(editor, editor, key), void(
                        itemUI && (index = obj.index, void 0 === index && (index = toolbarUi.items.length), toolbarUi.add(
                        itemUI, index))))
                }), this.toolbars = toolbarUis
            },
            getHtmlTpl: function () {
                return '<div id="##" class="%%"><div id="##_toolbarbox" class="%%-toolbarbox">' + (this.toolbars.length ?
                    '<div id="##_toolbarboxouter" class="%%-toolbarboxouter"><div class="%%-toolbarboxinner">' + this.renderToolbarBoxHtml() +
                    "</div></div>" : "") +
                    '<div id="##_toolbarmsg" class="%%-toolbarmsg" style="display:none;"><div id = "##_upload_dialog" class="%%-toolbarmsg-upload" onclick="$$.showWordImageDialog();">' +
                    this.editor.getLang("clickToUpload") +
                    '</div><div class="%%-toolbarmsg-close" onclick="$$.hideToolbarMsg();">x</div><div id="##_toolbarmsg_label" class="%%-toolbarmsg-label"></div><div style="height:0;overflow:hidden;clear:both;"></div></div><div id="##_message_holder" class="%%-messageholder"></div></div><div id="##_iframeholder" class="%%-iframeholder"></div><div id="##_bottombar" class="%%-bottomContainer"><table><tr><td id="##_elementpath" class="%%-bottombar"></td><td id="##_wordcount" class="%%-wordcount"></td><td id="##_scale" class="%%-scale"><div class="%%-icon"></div></td></tr></table></div><div id="##_scalelayer"></div></div>'
            },
            showWordImageDialog: function () {
                this._dialogs.wordimageDialog.open()
            },
            renderToolbarBoxHtml: function () {
                for (var buff = [], i = 0; i < this.toolbars.length; i++) buff.push(this.toolbars[i].renderHtml());
                return buff.join("")
            },
            setFullScreen: function (fullscreen) {
                var editor = this.editor,
                    container = editor.container.parentNode.parentNode;
                if (this._fullscreen != fullscreen) {
                    if (this._fullscreen = fullscreen, this.editor.fireEvent("beforefullscreenchange", fullscreen),
                        baidu.editor.browser.gecko) var bk = editor.selection.getRange().createBookmark();
                    if (fullscreen) {
                        for (;
                        "BODY" != container.tagName;) {
                            var position = baidu.editor.dom.domUtils.getComputedStyle(container, "position");
                            nodeStack.push(position), container.style.position = "static", container = container.parentNode
                        }
                        this._bakHtmlOverflow = document.documentElement.style.overflow, this._bakBodyOverflow =
                            document.body.style.overflow, this._bakAutoHeight = this.editor.autoHeightEnabled, this._bakScrollTop =
                            Math.max(document.documentElement.scrollTop, document.body.scrollTop), this._bakEditorContaninerWidth =
                            editor.iframe.parentNode.offsetWidth, this._bakAutoHeight && (editor.autoHeightEnabled = !1,
                            this.editor.disableAutoHeight()), document.documentElement.style.overflow = "hidden",
                            window.scrollTo(0, window.scrollY), this._bakCssText = this.getDom().style.cssText, this._bakCssText1 =
                            this.getDom("iframeholder").style.cssText, editor.iframe.parentNode.style.width = "", this._updateFullScreen()
                    } else {
                        for (;
                        "BODY" != container.tagName;) container.style.position = nodeStack.shift(), container =
                                container.parentNode;
                        this.getDom().style.cssText = this._bakCssText, this.getDom("iframeholder").style.cssText =
                            this._bakCssText1, this._bakAutoHeight && (editor.autoHeightEnabled = !0, this.editor.enableAutoHeight()),
                            document.documentElement.style.overflow = this._bakHtmlOverflow, document.body.style.overflow =
                            this._bakBodyOverflow, editor.iframe.parentNode.style.width = this._bakEditorContaninerWidth +
                            "px", window.scrollTo(0, this._bakScrollTop)
                    } if (browser.gecko && "true" === editor.body.contentEditable) {
                        var input = document.createElement("input");
                        document.body.appendChild(input), editor.body.contentEditable = !1, setTimeout(function () {
                            input.focus(), setTimeout(function () {
                                editor.body.contentEditable = !0, editor.fireEvent("fullscreenchanged", fullscreen),
                                    editor.selection.getRange().moveToBookmark(bk).select(!0), baidu.editor.dom.domUtils
                                    .remove(input), fullscreen && window.scroll(0, 0)
                            }, 0)
                        }, 0)
                    }
                    "true" === editor.body.contentEditable && (this.editor.fireEvent("fullscreenchanged", fullscreen),
                        this.triggerLayout())
                }
            },
            _updateFullScreen: function () {
                if (this._fullscreen) {
                    var vpRect = uiUtils.getViewportRect();
                    if (this.getDom().style.cssText = "border:0;position:absolute;left:0;top:" + (this.editor.options.topOffset ||
                        0) + "px;width:" + vpRect.width + "px;height:" + vpRect.height + "px;z-index:" + (1 * this.getDom()
                        .style.zIndex + 100), uiUtils.setViewportOffset(this.getDom(), {
                        left: 0,
                        top: this.editor.options.topOffset || 0
                    }), this.editor.setHeight(vpRect.height - this.getDom("toolbarbox").offsetHeight - this.getDom(
                        "bottombar").offsetHeight - (this.editor.options.topOffset || 0), !0), browser.gecko) try {
                            window.onresize()
                    } catch (e) {}
                }
            },
            _updateElementPath: function () {
                var list, bottom = this.getDom("elementpath");
                if (this.elementPathEnabled && (list = this.editor.queryCommandValue("elementpath"))) {
                    for (var ci, buff = [], i = 0; ci = list[i]; i++) buff[i] = this.formatHtml(
                            '<span unselectable="on" onclick="$$.editor.execCommand("elementpath", "' +
                            i + '");">' + ci + "</span>");
                    bottom.innerHTML = '<div class="edui-editor-breadcrumb" onmousedown="return false;">' + this.editor
                        .getLang("elementPathTip") + ": " + buff.join(" > ") + "</div>"
                } else bottom.style.display = "none"
            },
            disableElementPath: function () {
                var bottom = this.getDom("elementpath");
                bottom.innerHTML = "", bottom.style.display = "none", this.elementPathEnabled = !1
            },
            enableElementPath: function () {
                var bottom = this.getDom("elementpath");
                bottom.style.display = "", this.elementPathEnabled = !0, this._updateElementPath()
            },
            _scale: function () {
                function down() {
                    position = domUtils.getXY(editorHolder), minEditorHeight || (minEditorHeight = editor.options.minFrameHeight +
                        toolbarBox.offsetHeight + bottombar.offsetHeight), scalelayer.style.cssText =
                        "position:absolute;left:0;display:;top:0;background-color:#41ABFF;opacity:0.4;filter: Alpha(opacity=40);width:" +
                        editorHolder.offsetWidth + "px;height:" + editorHolder.offsetHeight + "px;z-index:" + (editor.options
                        .zIndex + 1), domUtils.on(doc, "mousemove", move), domUtils.on(editorDocument, "mouseup", up),
                        domUtils.on(doc, "mouseup", up)
                }
                function move(event) {
                    clearSelection();
                    var e = event || window.event;
                    pageX = e.pageX || doc.documentElement.scrollLeft + e.clientX, pageY = e.pageY || doc.documentElement
                        .scrollTop + e.clientY, scaleWidth = pageX - position.x, scaleHeight = pageY - position.y,
                        scaleWidth >= minEditorWidth && (isMouseMove = !0, scalelayer.style.width = scaleWidth + "px"),
                        scaleHeight >= minEditorHeight && (isMouseMove = !0, scalelayer.style.height = scaleHeight +
                        "px")
                }
                function up() {
                    isMouseMove && (isMouseMove = !1, editor.ui._actualFrameWidth = scalelayer.offsetWidth - 2,
                        editorHolder.style.width = editor.ui._actualFrameWidth + "px", editor.setHeight(scalelayer.offsetHeight -
                        bottombar.offsetHeight - toolbarBox.offsetHeight - 2, !0)), scalelayer && (scalelayer.style.display =
                        "none"), clearSelection(), domUtils.un(doc, "mousemove", move), domUtils.un(editorDocument,
                        "mouseup", up), domUtils.un(doc, "mouseup", up)
                }
                function clearSelection() {
                    browser.ie ? doc.selection.clear() : window.getSelection().removeAllRanges()
                }
                var doc = document,
                    editor = this.editor,
                    editorHolder = editor.container,
                    editorDocument = editor.document,
                    toolbarBox = this.getDom("toolbarbox"),
                    bottombar = this.getDom("bottombar"),
                    scale = this.getDom("scale"),
                    scalelayer = this.getDom("scalelayer"),
                    isMouseMove = !1,
                    position = null,
                    minEditorHeight = 0,
                    minEditorWidth = editor.options.minFrameWidth,
                    pageX = 0,
                    pageY = 0,
                    scaleWidth = 0,
                    scaleHeight = 0,
                    me = this;
                this.editor.addListener("fullscreenchanged", function (e, fullScreen) {
                    if (fullScreen) me.disableScale();
                    else if (me.editor.options.scaleEnabled) {
                        me.enableScale();
                        var tmpNode = me.editor.document.createElement("span");
                        me.editor.body.appendChild(tmpNode), me.editor.body.style.height = Math.max(domUtils.getXY(
                            tmpNode).y, me.editor.iframe.offsetHeight - 20) + "px", domUtils.remove(tmpNode)
                    }
                }), this.enableScale = function () {
                    1 != editor.queryCommandState("source") && (scale.style.display = "", this.scaleEnabled = !0,
                        domUtils.on(scale, "mousedown", down))
                }, this.disableScale = function () {
                    scale.style.display = "none", this.scaleEnabled = !1, domUtils.un(scale, "mousedown", down)
                }
            },
            isFullScreen: function () {
                return this._fullscreen
            },
            postRender: function () {
                UIBase.prototype.postRender.call(this);
                for (var i = 0; i < this.toolbars.length; i++) this.toolbars[i].postRender();
                var timerId, me = this,
                    domUtils = baidu.editor.dom.domUtils,
                    updateFullScreenTime = function () {
                        clearTimeout(timerId), timerId = setTimeout(function () {
                            me._updateFullScreen()
                        })
                    };
                domUtils.on(window, "resize", updateFullScreenTime), me.addListener("destroy", function () {
                    domUtils.un(window, "resize", updateFullScreenTime), clearTimeout(timerId)
                })
            },
            showToolbarMsg: function (msg, flag) {
                if (this.getDom("toolbarmsg_label").innerHTML = msg, this.getDom("toolbarmsg").style.display = "", !
                    flag) {
                    var w = this.getDom("upload_dialog");
                    w.style.display = "none"
                }
            },
            hideToolbarMsg: function () {
                this.getDom("toolbarmsg").style.display = "none"
            },
            mapUrl: function (url) {
                return url ? url.replace("~/", this.editor.options.UEDITOR_HOME_URL || "") : ""
            },
            triggerLayout: function () {
                var dom = this.getDom();
                dom.style.zoom = "1" == dom.style.zoom ? "100%" : "1"
            }
        }, utils.inherits(EditorUI, baidu.editor.ui.UIBase);
        var instances = {};
        UE.ui.Editor = function (options) {
            var editor = new UE.Editor(options);
            editor.options.editor = editor, utils.loadFile(document, {
                href: editor.options.themePath + editor.options.theme + "/css/ueditor.css?_=20150626",
                tag: "link",
                type: "text/css",
                rel: "stylesheet"
            });
            var oldRender = editor.render;
            return editor.render = function (holder) {
                holder.constructor === String && (editor.key = holder, instances[holder] = editor), utils.domReady(function () {
                    function renderUI() {
                        if (editor.setOpt({
                            labelMap: editor.options.labelMap || editor.getLang("labelMap")
                        }), new EditorUI(editor.options), holder && (holder.constructor === String && (holder =
                            document.getElementById(holder)), holder && holder.getAttribute("name") && (editor.options.textarea =
                            holder.getAttribute("name")), holder && /script|textarea/gi.test(holder.tagName))) {
                            var newDiv = document.createElement("div");
                            holder.parentNode.insertBefore(newDiv, holder);
                            var cont = holder.value || holder.innerHTML;
                            editor.options.initialContent = /^[\t\r\n ]*$/.test(cont) ? editor.options.initialContent :
                                cont.replace(/>[\n\r\t]+([ ]{4})+/g, ">").replace(/[\n\r\t]+([ ]{4})+</g, "<").replace(
                                />[\n\r\t]+</g, "><"), holder.className && (newDiv.className = holder.className),
                                holder.style.cssText && (newDiv.style.cssText = holder.style.cssText), /textarea/i.test(
                                holder.tagName) ? (editor.textarea = holder, editor.textarea.style.display = "none") :
                                holder.parentNode.removeChild(holder), holder.id && (newDiv.id = holder.id, domUtils.removeAttributes(
                                holder, "id")), holder = newDiv, holder.innerHTML = ""
                        }
                        domUtils.addClass(holder, "edui-" + editor.options.theme), editor.ui.render(holder);
                        var opt = editor.options;
                        editor.container = editor.ui.getDom();
                        for (var ci, parents = domUtils.findParents(holder, !0), displays = [], i = 0; ci = parents[i]; i++)
                            displays[i] = ci.style.display, ci.style.display = "block";
                        if (opt.initialFrameWidth) opt.minFrameWidth = opt.initialFrameWidth;
                        else {
                            opt.minFrameWidth = opt.initialFrameWidth = holder.offsetWidth;
                            var styleWidth = holder.style.width;
                            /%$/.test(styleWidth) && (opt.initialFrameWidth = styleWidth)
                        }
                        opt.initialFrameHeight ? opt.minFrameHeight = opt.initialFrameHeight : opt.initialFrameHeight =
                            opt.minFrameHeight = holder.offsetHeight;
                        for (var ci, i = 0; ci = parents[i]; i++) ci.style.display = displays[i];
                        holder.style.height && (holder.style.height = ""), editor.container.style.width = opt.initialFrameWidth +
                            (/%$/.test(opt.initialFrameWidth) ? "" : "px"), editor.container.style.zIndex = opt.zIndex,
                            oldRender.call(editor, editor.ui.getDom("iframeholder")), editor.fireEvent("afteruiready")
                    }
                    editor.langIsReady ? renderUI() : editor.addListener("langReady", renderUI)
                })
            }, editor
        }, UE.getEditor = function (id, opt) {
            var editor = instances[id];
            return editor || (editor = instances[id] = new UE.ui.Editor(opt), editor.render(id)), editor
        }, UE.delEditor = function (id) {
            var editor;
            (editor = instances[id]) && (editor.key && editor.destroy(), delete instances[id])
        }, UE.registerUI = function (uiName, fn, index, editorId) {
            utils.each(uiName.split(/\s+/), function (name) {
                UE._customizeUI[name] = {
                    id: editorId,
                    execFn: fn,
                    index: index
                }
            })
        }
    }(), UE.registerUI("message", function (editor) {
        function updateHolderPos() {
            var toolbarbox = me.ui.getDom("toolbarbox");
            toolbarbox && (holder.style.top = toolbarbox.offsetHeight + 3 + "px"), holder.style.zIndex = Math.max(me.options
                .zIndex, me.iframe.style.zIndex) + 1
        }
        var holder, editorui = baidu.editor.ui,
            Message = editorui.Message,
            _messageItems = [],
            me = editor;
        me.addListener("ready", function () {
            holder = document.getElementById(me.ui.id + "_message_holder"), updateHolderPos(), setTimeout(function () {
                updateHolderPos()
            }, 500)
        }), me.addListener("showmessage", function (type, opt) {
            opt = utils.isString(opt) ? {
                content: opt
            } : opt;
            var message = new Message({
                timeout: opt.timeout,
                type: opt.type,
                content: opt.content,
                keepshow: opt.keepshow,
                editor: me
            }),
                mid = opt.id || "msg_" + (+new Date).toString(36);
            return message.render(holder), _messageItems[mid] = message, message.reset(opt), updateHolderPos(), mid
        }), me.addListener("updatemessage", function (type, id, opt) {
            opt = utils.isString(opt) ? {
                content: opt
            } : opt;
            var message = _messageItems[id];
            message.render(holder), message && message.reset(opt)
        }), me.addListener("hidemessage", function (type, id) {
            var message = _messageItems[id];
            message && message.hide()
        })
    }),
    function () {
        function closeAllPopup(evt, el, type) {
            utils.each(allPopups, function (popup) {
                popup.isHidden() || popup.queryAutoHide(el, type) !== !1 && popup.hide();
 
            })
        }
        function autoHideListen(editor) {
            _autoHideListened || (_autoHideListened = !0, domUtils.on(document, "mousedown", function (evt) {
                var el = evt.target || evt.srcElement;
                closeAllPopup(evt, el, "mousedown")
            }), domUtils.on(window, "scroll", function (evt, el) {
                closeAllPopup(evt, el, "scroll")
            }), domUtils.on(editor.body, "mousedown", function (evt) {
                var el = evt.target || evt.srcElement;
                closeAllPopup(evt, el, "mousedown")
            }), domUtils.on(editor.body, "scroll", function (evt, el) {
                closeAllPopup(evt, el, "scroll")
            }))
        }
        var editorui = UE.ui,
            uiUtil = editorui.uiUtils,
            domUtils = UE.dom.domUtils,
            utils = UE.utils,
            allPopups = [],
            pushPopup = function (item, editor) {
                allPopups.push(item), autoHideListen(editor)
            }, AttachPopup = editorui.AttachPopup = function (name, editor, options) {
                this.name = name, this.editor = editor, options.hideOnBlur = "undefined" == typeof options.hideOnBlur ? !
                    0 : options.hideOnBlur, options.hideOnScroll = "undefined" == typeof options.hideOnScroll ? !1 :
                    options.hideOnScroll, this.options = options || {}, this.init(), pushPopup(this, editor)
            };
        AttachPopup.prototype.init = function () {
            this.initOptions({}), this.el = this.render(), this.bindEvents()
        }, AttachPopup.prototype.render = function () {
            var html = this.formatHtml(this.getHtml()),
                el = uiUtil.createElementByHtml(html);
            return uiUtil.getFixedLayer().appendChild(el), domUtils.setStyles(el, {
                position: "absolute",
                "z-index": "1",
                width: this.options.width || "auto",
                height: this.options.height || "auto"
            }), this.postRender(), el
        }, AttachPopup.prototype.bindEvents = function () {
            var refresh = this.refresh.bind(this);
            domUtils.on(this.editor.body, "keyup", refresh), domUtils.on(this.editor.window, "scroll", refresh),
                domUtils.on(window, "scroll", refresh), domUtils.on(window, "resize", refresh)
        }, AttachPopup.prototype.getHtml = function () {
            var options = this.options;
            return '<div id="##" class="edui-popup ' + (options.className || "") + " %%" + (options.containerClass ||
                "") +
                '" > <div id="##_body" class="edui-popup-body"> <div class="edui-shadow"></div> <div id="##_content" class="edui-popup-content">' +
                ("function" == typeof options.tpl ? options.tpl() : options.tpl) + "  </div> </div></div>"
        }, AttachPopup.prototype.setDisplay = function (isShow) {
            this.isShow = !! isShow, this.el.style.display = isShow ? "block" : "none", this.el.style.visibility =
                "visible"
        }, AttachPopup.prototype.displayInvisible = function (isShow) {
            this.setDisplay(isShow), this.el.style.visibility = "hidden"
        }, AttachPopup.prototype.show = function (target) {
            this.isShow && this.target === target || (this.target = target, this.active = !0, this.displayInvisible(!0),
                this.refresh(), this.setDisplay(!0), this.fireEvent("show"))
        }, AttachPopup.prototype.hide = function () {
            this.setDisplay(!1), this.active = !1, this.fireEvent("hide")
        }, AttachPopup.prototype.refresh = function () {
            function getPosition(position, start, width, popupWidth, margin) {
                switch (position) {
                case "before":
                    return start - popupWidth + margin;
                case "top":
                    return start + margin;
                case "middle":
                    return start + (width - popupWidth) / 2 + margin;
                case "bottom":
                    return start + width - popupWidth + margin;
                case "after":
                    return start + width + margin
                }
            }
            if (this.active) {
                var styles, editor = this.editor,
                    options = this.options,
                    targetRect = uiUtil.getClientRect(this.target),
                    popupRect = uiUtil.getClientRect(this.el),
                    editorRect = uiUtil.getClientRect(this.editor.iframe),
                    marginTop = options.marginTop || 0,
                    marginLeft = options.marginLeft || 0;
                if ("function" == typeof options.position) styles = options.position(targetRect, popupRect);
                else {
                    var position = options.position || {};
                    styles = {
                        top: getPosition(position.top || "after", targetRect.top, targetRect.height, popupRect.height,
                            marginTop),
                        left: getPosition(position.left || "bottom", targetRect.left, targetRect.width, popupRect.width,
                            marginLeft)
                    }
                } if (!this.lastStyle || this.lastStyle.top !== styles.top || this.lastStyle.left !== styles.left) {
                    if (options.view && "undefined" != typeof options.view.top) {
                        if (-1 !== options.view.top && options.view.top > styles.top) return void(this.isShow && this.setDisplay(!
                                1));
                        if (-1 === options.view.top) {
                            var toolbar = editor.ui.toolbars[0];
                            if (toolbar && (toolbar = toolbar.getDom().parentNode)) {
                                var toolbarRect = uiUtil.getClientRect(toolbar);
                                if (toolbarRect.bottom > styles.top) return void(this.isShow && this.setDisplay(!1))
                            }
                        }
                    }
                    if (options.view && "undefined" != typeof options.view.bottom) {
                        if (-1 !== options.view.bottom && options.view.bottom < styles.top + popupRect.height) return void(
                                this.isShow && this.setDisplay(!1));
                        if (-1 === options.view.bottom && editorRect.bottom < styles.top) return void(this.isShow &&
                                this.setDisplay(!1))
                    }
                    styles.top = styles.top + "px", styles.left = styles.left + "px", UE.dom.domUtils.setStyles(this.el,
                        styles), this.lastStyle = styles, this.isShow || this.show(this.target)
                }
            }
        }, AttachPopup.prototype.destroy = function () {}, AttachPopup.prototype.isHidden = function () {
            return !this.isShow
        }, AttachPopup.prototype.queryAutoHide = function (el, type) {
            var contains = el && uiUtil.contains(this.getDom(), el);
            return contains ? !1 : "scroll" === type ? this.options.hideOnScroll : "mousedonw" === type ? this.options.hideOnBlur : !
                0
        }, UE.utils.inherits(AttachPopup, editorui.UIBase);
        var _autoHideListened = !1
    }()
}();