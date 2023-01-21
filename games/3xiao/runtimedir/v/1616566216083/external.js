function sanitizeEventOpts(e, t) {
    return t && "object" == typeof t || (t = {}), t.eventType && t.eventType in eventTypes || (t.eventType = eventTypes.cached.name, eventTypes.forced.events.indexOf(e) > -1 ? t.eventType = eventTypes.forced.name : eventTypes.transient.events.indexOf(e) > -1 && (t.eventType = eventTypes.transient.name)), t.freezeGroup = t.freezeGroup || window._defFrzGrp, t
}

function _onMethod(e, t, i) {
    this.emit("eventAttached", {eventName: e}), this.__listeners = this.__listeners || {}, this.__listeners[e] = this.__listeners[e] || [];
    var n = {callback: t, frzGrp: (i = sanitizeEventOpts(e, i)).freezeGroup, eventType: i.eventType};
    return this.__listeners[e].push(n), this
}

window.eventTypes = {
    cached: {name: "cached", events: void 0},
    forced: {
        name: "forced",
        events: ["resize", "login", "login-error", "save", "logout", "FBInstantStart", "FBInstantComplete", "mutemusic", "mutesound", "dataloaded", "datasaved"]
    },
    transient: {name: "transient", events: ["down", "rightdown", "up", "rightup", "move", "tick", "animate", "render"]}
}, Object.defineProperty(Object.prototype, "on", {
    enumerable: !1, get: function () {
        return this.___on || _onMethod
    }, set: function (e) {
        this.___on = e
    }
}), Object.defineProperty(Object.prototype, "emit", {
    enumerable: !1, value: function (e, t) {
        var i = (this.__listeners || {})[e];
        if (i && i.length) {
            for (var n = [], r = 0; r < i.length; r++) n.push(i[r]);
            for (r = 0; r < n.length; r++) {
                var o = {name: e, cbData: t, frzGrp: n[r].frzGrp, type: n[r].eventType, callback: n[r].callback};
                try {
                    void 0 !== this._freezeEmit && this._freezeEmit(o) || n[r].callback.call(this, t)
                } catch (t) {
                    window.onerror && window.onerror(t.toString(), "Event: " + e, t.line, t.column, ""), console.error(t.toString(), "Event: " + e, t.line, t.column, "Failure in", n[r])
                }
            }
        }
        return this
    }, writable: !0
}), Object.defineProperty(Object.prototype, "off", {
    enumerable: !1, value: function (e, t, i) {
        i = sanitizeEventOpts(e, i);
        for (var n = (this.__listeners || {})[e] || [], r = 0; r < n.length; r++) (n[r].callback === t && n[r].frzGrp === i.freezeGroup || void 0 === t) && n.splice(r--, 1);
        return n.length || delete (this.__listeners || {})[e], this.emit("eventRemoved", {eventName: e}), this
    }, writable: !0
}), Object.defineProperty(Object.prototype, "once", {
    enumerable: !1, value: function (e, t, i) {
        return i = sanitizeEventOpts(e, i), this.on(e, function n(r) {
            this.off(e, n, i), t.call(this, r)
        }, i), this
    }, writable: !0
}), Object.defineProperty(Function.prototype, "expand", {
    enumerable: !1, value: function (e) {
        return e.prototype = Object.create(this.prototype), e.prototype.constructor = e, e
    }
}), "function" != typeof Math.seed && (Math.seed = function (e) {
    var t = e, i = 426381559378, n = 4294967295;
    return function () {
        var e = ((i = 18e3 * (65535 & i) + (i >> 16) & n) << 16) + (t = 36969 * (65535 & t) + (t >> 16) & n) & n;
        return .5 + (e /= 4294967296)
    }
}), function (e) {
    e.createErrorHandler = e.createErrorHandler || function (e) {
        return function (t, i, n, r, o) {
            throw e + " - " + t
        }
    };
    var t = {}, i = window.Host || {};

    function n(e, t, i, n, r) {
        var o = new XMLHttpRequest;
        o.crossOrigin = "anonymous", o.overrideMimeType && o.overrideMimeType("application/json");
        try {
            o.open(e, t, !0), "POST" == e && o.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), o.onreadystatechange = function () {
                if (4 == o.readyState) if ("200" == o.status) {
                    var e = {};
                    try {
                        e = JSON.parse(o.responseText)
                    } catch (e) {
                        return window.onerror && window.onerror("Failed to parse JSON return data " + t + "> " + e.message, e.sourceURL, e.line), void r()
                    }
                    n(e)
                } else o = o.onreadystatechange = null, r && r()
            }, o.send(i)
        } catch (e) {
            window.onerror && window.onerror("Failed to execute JSON load code " + t + "> " + e.message, e.sourceURL, e.line), r()
        }
    }

    window.Host = i, i.call = function (e, n, r) {
        null != r && (callbackId = "cb" + Math.round(99999 * Math.random()) + (new Date).getTime(), t[callbackId] = r, n._callback = callbackId), n._method = e, i.sendToHost("json1:" + JSON.stringify(n))
    }, i.callResult = function (e) {
        var i = e.indexOf(":");
        if (i > 0) {
            var n = e.substring(0, i), r = e.substring(i + 1);
            switch (n) {
                case"json1":
                    var o = JSON.parse(r), a = t[o._callback];
                    a && (delete o._callback, a(o))
            }
        }
    }, i.Application = {}, i.Application.SetStatusbarColor = function (e) {
    }, i.onPauseEvent = function () {
    }, i.onResumeEvent = function () {
    }, i.onMarginsChanged = function (e) {
        i.Log("Margins changed! [t:" + e.top + ", b:" + e.bottom + ", l:" + e.left + ", r:" + e.right + "]"), XS.styles.margins.top = e.top, XS.styles.margins.bottom = e.bottom, XS.styles.margins.left = e.left, XS.styles.margins.right = e.right
    }, i.pauseResizing = function () {
        XS.skipResizing = !0
    }, i.resumeResizing = function () {
        XS.skipResizing = !1, window.dispatchEvent(new Event("resize"))
    }, i.onSafeToExitEvent = function () {
        var e = {type: "ShowModal"};
        return e.titleTxt = i.Localize.Translate("Progress might be lost if you exit {game_name} now!", {game_name: Config.shortTitle}).toString(), e.msgTxt = i.Localize.Translate("Are you sure you want to close the app?").toString(), e.confirmTxt = i.Localize.Translate("Confirm").toString(), e.confirmCb = function () {
        }, e.cancelTxt = i.Localize.Translate("Cancel").toString(), e.cancelCb = function () {
            XS.unfreeze()
        }, XS.freeze(), e
    }, i.makeGameShareURL = function () {
        return encodeURI("--https--" + Config.domain + "/alc/")
    }, i.Preferences = {}, i.Preferences.cache = {}, i.Preferences.QuickBool = function (e) {
        return {
            get: function () {
                return i.Preferences.cache[e] || !1
            }, set: function (t) {
                i.Preferences.SetBool(e, t)
            }, remove: function () {
                i.Preferences.Remove(e)
            }
        }
    }, i.Preferences.QuickInt = function (e) {
        return {
            get: function () {
                return parseInt(i.Preferences.cache[e]) || 0
            }, set: function (t) {
                i.Preferences.SetInt(e, t)
            }, remove: function () {
                i.Preferences.Remove(e)
            }
        }
    }, i.Preferences.QuickFloat = function (e) {
        return {
            get: function () {
                return parseFloat(i.Preferences.cache[e]) || 0
            }, set: function (t) {
                i.Preferences.SetFloat(e, t)
            }, remove: function () {
                i.Preferences.Remove(e)
            }
        }
    }, i.Preferences.QuickString = function (e) {
        return {
            get: function () {
                return i.Preferences.cache[e] || ""
            }, set: function (t) {
                i.Preferences.SetString(e, t)
            }, remove: function () {
                i.Preferences.Remove(e)
            }
        }
    }, i.Tools = {}, i.Tools.LoadJSON = function (e, t, i) {
        n("GET", e, null, t, i)
    }, i.Tools.SendJSON = function (e, t, i, r) {
        n("POST", e, t, i, r)
    }, i.Tools.PostJSON = function (e, t, n) {
        var r = new XMLHttpRequest;
        r.crossOrigin = "anonymous";
        try {
            r.onreadystatechange = function () {
                if (4 == r.readyState) if ("200" == r.status) n && n(!0, r.responseText); else {
                    i.Log("PostJSON Error Status: Response: " + r.responseText);
                    var e = r.responseText;
                    r = r.onreadystatechange = null, n && n(!1, e)
                }
            }, r.open("POST", e, !0), r.setRequestHeader("Content-type", "application/json;charset=UTF-8"), r.send("string" == typeof t ? t : JSON.stringify(t))
        } catch (e) {
            i.Log("PostJSON Error:", e), n && n(!1, e)
        }
    }, i.Web = {};
    var r = window.location.href;

    function o(e, t, i) {
        var n = this;
        null == t && (t = ""), n.translated = t.toString(), n.replacements = i, n.original = e, n.toString = function () {
            return n.translated
        }
    }

    i.Web.GetQueryString = function (e) {
        var t = r;
        e = e.replace(/[\[\]]/g, "\\$&");
        var i = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)", "i").exec(t);
        return i ? i[2] ? decodeURIComponent(i[2].replace(/\+/g, " ")) : "" : null
    }, i.Localize = i.Localize || {}, i.Localize.Translations = {en: {}}, i.Localize.LocalizedString = o, i.Localize._currentLanguage = "en-US", i.Localize.TranslationsCache && (!function (e, t) {
        for (var i in e) if (e.hasOwnProperty(i)) {
            var n = e[i];
            for (var r in n) t[r] = t[r] || {}, t[r][i] = {translation: n[r]}
        }
    }(i.Localize.TranslationsCache, i.Localize.Translations), delete i.Localize.TranslationsCache);
    var a = {}, s = !1;
    i.Localize.UpdateChildren = function (e) {
        if (s) for (var t in e.children) {
            var n = e.children[t];
            n instanceof Text2 ? n.onLanguageChange() : n instanceof Container && i.Localize.UpdateChildren(n)
        }
    }, i.Localize.Load = function (e, t) {
        return s = !0, i.Localize.Translations[e] ? (a = i.Localize.Translations[e], i.Localize._currentLanguage = e, Text2.onLanguageChange(), XS.emit("language-changed", {language: e}), t && t(e, !0), !0) : (i.Tools.LoadJSON("./languages/" + e + ".json", function (n) {
            for (key in i.Localize._currentLanguage = e, a = i.Localize.Translations[e] = n, console.log("Loaded language json for: " + e, a), n) {
                var r = n[key], o = key.replace(/\\n/g, "\n");
                o != key && (delete n[key], r.translation ? (r.translation = r.translation.replaceAll("\\n", "\n"), n[o] = r) : (console.warn('Missing translation: "' + key + '"'), n[o] = key))
            }
            Text2.onLanguageChange(), XS.emit("language-changed", {language: e}), t && t(e, !0)
        }, function () {
            console.warn("failed to load language"), t && t(e, !1)
        }), !1)
    }, i.Localize.CurrentLanguage = function () {
        return i.Localize._currentLanguage
    }, i.Localize.languages = i.Localize.languages || [], i.Localize.Test = function () {
        var e = 0, t = window.onkeydown;
        window.onkeydown = function (n) {
            var r = n.keyCode;
            37 == r && (e -= 1), 39 == r && (e += 1), e += i.Localize.languages.length, e %= i.Localize.languages.length, i.Localize.Load(i.Localize.languages[e]), t && t(n)
        }
    }, i.Localize.Translate = function (e, t) {
        var i = e;
        if (e instanceof o) {
            i = e.original;
            var n = {};
            for (var r in e.replacements) n[r] = e.replacements[r];
            for (var r in t) n[r] = t[r];
            t = n
        }
        for (var r in e = a[i] && null !== a[i].translation ? a[i].translation : i, t) e = e.split("{" + r + "}").join(t[r]);
        return new o(i, e, t)
    }, i.Localize.GetLanguage = function () {
        var e = window.navigator;
        if (Array.isArray(e.languages)) for (var t = 0; t < e.languages.length; t++) {
            var i = e.languages[t];
            if (i && i.length) return i
        }
        var n = ["language", "browserLanguage", "systemLanguage", "userLanguage"];
        for (t = 0; t < n.length; t++) if ((i = e[n[t]]) && i.length) return i;
        return "en"
    }, i.Type = "undefined"
}(window), window.FRVRInterfaceCore && (window.FRVRInstant = new function (e) {
    var t = 0, i = {};

    function n(e, t) {
        return function (t) {
            var n = i[t];
            if (delete i[t], n) {
                if (clearTimeout(n.timeout), n.type != e) return void n.callback("_2");
                for (var r = [], o = 1; o < arguments.length; o++) r.push(arguments[o]);
                n.callback.apply(this, r)
            } else console.warn("Request handler does not exist ", t)
        }
    }

    function r(e, t, n, r) {
        i[t] = {
            type: e, callback: r, timeout: setTimeout(function () {
                i[t] && (i[t].callback("_1"), delete i[t])
            }, n || 5e3)
        }
    }

    function o(e, t) {
        switch (e) {
            case"_1":
                return new Error("Timeout");
            case"_2":
                return new Error("Callback type does not match");
            default:
                return new Error(t)
        }
    }

    window.FRVRInstantCore = {
        getADIDCallback: n("getADIDCallback"),
        canCreateShortcutCallback: n("canCreateShortcutCallback"),
        createShortcutCallback: n("createShortcutCallback"),
        shareCallback: n("shareCallback")
    };
    var a = this;
    a.getADID = function () {
        return new Promise(function (e, i) {
            r("getADIDCallback", t, 5e3, function (t, n, r) {
                try {
                    if (0 != t) throw o(t, r);
                    e(n)
                } catch (e) {
                    i("getADID " + e)
                }
            }), FRVRInterfaceCore.getADID(t), t++
        })
    }, a.canCreateShortcut = function (e) {
        return new Promise(function (i, n) {
            r("canCreateShortcutCallback", t, 5e3, function (e, t, r) {
                console.warn("canCreateShortcutCallback", e, t, r);
                try {
                    if (0 != t) throw o(e, r);
                    i(e)
                } catch (i) {
                    n("canCreateShortcut statusCode:" + e + " state:" + t + " msg:" + i)
                }
            }), FRVRInterfaceCore.canCreateShortcut(t, e), t++
        })
    }, a.createShortcut = function (e, i, n, a) {
        return new Promise(function (s, l) {
            r("createShortcutCallback", t, 6e4, function (e, t) {
                console.warn("createShortcutCallback", e, t);
                try {
                    if (0 != e) throw o(e, t);
                    s()
                } catch (t) {
                    l("createShortcut statusCode:" + e + " msg:" + t)
                }
            }), console.warn("Trying createShortcut", e, i, n, a), FRVRInterfaceCore.createShortcut(t, e, i, n, a), t++
        })
    }, a.share = function (e, i, n) {
        return new Promise(function (e, a) {
            r("shareCallback", t, 5e3, function (t, i) {
                try {
                    if (0 != t) throw o(t, i);
                    e()
                } catch (e) {
                    a("share " + e)
                }
            }), FRVRInterfaceCore.share(t, i, n), t++
        })
    }, a.close = function () {
        try {
            FRVRInterfaceCore.close()
        } catch (e) {
            window.onerror && window.onerror("Error in FRVRInstant.close: " + (e.message || e.toString()), e)
        }
    }, a.trackPlay = function (e, t, i, n, r) {
        console.log("Running track play with", e, t, i, n);
        try {
            FRVRInterfaceCore.trackPlay(e, t, i, n, r)
        } catch (e) {
            window.onerror && window.onerror("Error in FRVRInstant.trackPlay: " + (e.message || e.toString()), e)
        }
    }, a.forceReload = function () {
        try {
            FRVRInterfaceCore.forceReload()
        } catch (e) {
            window.onerror && window.onerror("Error in FRVRInstant.forceReload: " + (e.message || e.toString()), e)
        }
    }, a.clearCache = function () {
        try {
            FRVRInterfaceCore.clearCache()
        } catch (e) {
            window.onerror && window.onerror("Error in FRVRInstant.clearCache: " + (e.message || e.toString()), e)
        }
    }, console.log("FRVR Instant Init Done")
}(window)), function (e) {
    e.Host = e.Host || {}, Host.Type = "web", Host.Log = function (e) {
        console.log(e)
    }, Host.WrapperLog = function (e) {
    }, Host.sendToHost = function () {
    };
    var t, i = (t = {}, function () {
        try {
            return "localStorage" in window && null !== window.localStorage
        } catch (e) {
            return !1
        }
    }() ? {
        set: function (e, i) {
            t[e] = i;
            try {
                localStorage.setItem(gameid + e, i)
            } catch (e) {
            }
        }, get: function (e) {
            return t[e] || localStorage.getItem(gameid + e)
        }, remove: function (e) {
            delete t[e], localStorage.removeItem(gameid + e)
        }
    } : {
        set: function (e, i) {
            t[e] = i
        }, get: function (e) {
            return t[e]
        }, remove: function (e) {
            delete t[e]
        }
    });
    Host.Preferences = Host.Preferences || {}, Host.Preferences.SetBool = function (e, t) {
        Host.Preferences.cache[e] = t, i.set(e, t ? "true" : "false")
    }, Host.Preferences.SetInt = function (e, t) {
        Host.Preferences.cache[e] = t, i.set(e, t)
    }, Host.Preferences.SetFloat = function (e, t) {
        Host.Preferences.cache[e] = t, i.set(e, t)
    }, Host.Preferences.SetString = function (e, t) {
        Host.Preferences.cache[e] = t, i.set(e, t)
    }, Host.Preferences.Remove = function (e) {
        delete Host.Preferences.cache[e], i.remove(e)
    }, Host.Preferences.GetBool = function (e, t) {
        var n = null !== i.get(e) || Host.Preferences.cache.hasOwnProperty(e), r = "true" == i.get(e);
        Host.Preferences.cache[e] = r, t && t(r, n)
    }, Host.Preferences.GetInt = function (e, t) {
        var n = null !== i.get(e) || Host.Preferences.cache.hasOwnProperty(e), r = parseInt(i.get(e));
        Host.Preferences.cache[e] = r, t && t(r, n)
    }, Host.Preferences.GetFloat = function (e, t) {
        var n = null !== i.get(e) || Host.Preferences.cache.hasOwnProperty(e), r = parseFloat(i.get(e));
        Host.Preferences.cache[e] = r, t && t(r, n)
    }, Host.Preferences.GetString = function (e, t) {
        var n = null !== i.get(e) || Host.Preferences.cache.hasOwnProperty(e), r = i.get(e);
        Host.Preferences.cache[e] = r, t && t(r, n)
    }, Host.Localize.Translate = Host.Localize.Translate || {}, Host.Localize.Translate.GetString = function (e) {
        return Lang[e] || "!!No translation found!!"
    }
}(window), window.getRenderer = function () {
    var e = {
        frvrTextureMemoryUsage: 0,
        frvrGLErrors: {
            NO_ERROR: 0,
            OUT_OF_MEMORY: 0,
            INVALID_ENUM: 0,
            INVALID_VALUE: 0,
            INVALID_OPERATION: 0,
            INVALID_FRAMEBUFFER_OPERATION: 0,
            CONTEXT_LOST_WEBGL: 0,
            TOTAL_ERRORS: 0
        },
        frvrErrorStats: function () {
            var t = "";
            for (name in e.frvrGLErrors) {
                var i = e.frvrGLErrors[name];
                t += name + ": " + i + "\n"
            }
            return t
        },
        WEBGL_RENDERER: 0,
        CANVAS_RENDERER: 1,
        VERSION: "v2.2.3FRVR",
        blendModes: {NORMAL: 0, ADD: 1, MULTIPLY: 2, SCREEN: 3},
        scaleModes: {DEFAULT: 0, LINEAR: 0, NEAREST: 1},
        _UID: 0
    };
    return "undefined" != typeof Float32Array ? (e.Float32Array = Float32Array, e.Uint16Array = Uint16Array, e.Uint32Array = Uint32Array, e.ArrayBuffer = ArrayBuffer) : (e.Float32Array = Array, e.Uint16Array = Array), e.INTERACTION_FREQUENCY = 30, e.AUTO_PREVENT_DEFAULT = !0, e.PI_2 = 2 * Math.PI, e.RAD_TO_DEG = 180 / Math.PI, e.DEG_TO_RAD = Math.PI / 180, e.defaultRenderOptions = {
        view: null,
        transparent: !1,
        antialias: !1,
        preserveDrawingBuffer: !1,
        clearBeforeRender: !0,
        autoResize: !1
    }, e.Point = function (e, t) {
        this.x = e || 0, this.y = t || 0
    }, e.Point.prototype.clone = function () {
        return new e.Point(this.x, this.y)
    }, e.Point.prototype.set = function (e, t) {
        this.x = e || 0, this.y = t || (0 !== t ? this.x : 0)
    }, e.Point.prototype.constructor = e.Point, e.Rectangle = function (e, t, i, n) {
        this.x = e || 0, this.y = t || 0, this.width = i || 0, this.height = n || 0
    }, e.Rectangle.prototype.clone = function () {
        return new e.Rectangle(this.x, this.y, this.width, this.height)
    }, e.Rectangle.prototype.contains = function (e, t) {
        if (this.width <= 0 || this.height <= 0) return !1;
        var i = this.x;
        if (e >= i && e <= i + this.width) {
            var n = this.y;
            if (t >= n && t <= n + this.height) return !0
        }
        return !1
    }, e.Rectangle.prototype.constructor = e.Rectangle, e.EmptyRectangle = new e.Rectangle(0, 0, 0, 0), e.Polygon = function (t) {
        if (t instanceof Array || (t = Array.prototype.slice.call(arguments)), t[0] instanceof e.Point) {
            for (var i = [], n = 0, r = t.length; n < r; n++) i.push(t[n].x, t[n].y);
            t = i
        }
        this.closed = !0, this.points = t
    }, e.Polygon.prototype.clone = function () {
        var t = this.points.slice();
        return new e.Polygon(t)
    }, e.Polygon.prototype.contains = function (e, t) {
        for (var i = !1, n = this.points.length / 2, r = 0, o = n - 1; r < n; o = r++) {
            var a = this.points[2 * r], s = this.points[2 * r + 1], l = this.points[2 * o], c = this.points[2 * o + 1];
            s > t != c > t && e < (l - a) * (t - s) / (c - s) + a && (i = !i)
        }
        return i
    }, e.Polygon.prototype.constructor = e.Polygon, e.Circle = function (e, t, i) {
        this.x = e || 0, this.y = t || 0, this.radius = i || 0
    }, e.Circle.prototype.clone = function () {
        return new e.Circle(this.x, this.y, this.radius)
    }, e.Circle.prototype.contains = function (e, t) {
        if (this.radius <= 0) return !1;
        var i = this.x - e, n = this.y - t;
        return (i *= i) + (n *= n) <= this.radius * this.radius
    }, e.Circle.prototype.getBounds = function () {
        return new e.Rectangle(this.x - this.radius, this.y - this.radius, 2 * this.radius, 2 * this.radius)
    }, e.Circle.prototype.constructor = e.Circle, e.Ellipse = function (e, t, i, n) {
        this.x = e || 0, this.y = t || 0, this.width = i || 0, this.height = n || 0
    }, e.Ellipse.prototype.clone = function () {
        return new e.Ellipse(this.x, this.y, this.width, this.height)
    }, e.Ellipse.prototype.contains = function (e, t) {
        if (this.width <= 0 || this.height <= 0) return !1;
        var i = (e - this.x) / this.width, n = (t - this.y) / this.height;
        return (i *= i) + (n *= n) <= 1
    }, e.Ellipse.prototype.getBounds = function () {
        return new e.Rectangle(this.x - this.width, this.y - this.height, this.width, this.height)
    }, e.Ellipse.prototype.constructor = e.Ellipse, e.RoundedRectangle = function (e, t, i, n, r) {
        this.x = e || 0, this.y = t || 0, this.width = i || 0, this.height = n || 0, this.radius = r || 20
    }, e.RoundedRectangle.prototype.clone = function () {
        return new e.RoundedRectangle(this.x, this.y, this.width, this.height, this.radius)
    }, e.RoundedRectangle.prototype.contains = function (e, t) {
        if (this.width <= 0 || this.height <= 0) return !1;
        var i = this.x;
        if (e >= i && e <= i + this.width) {
            var n = this.y;
            if (t >= n && t <= n + this.height) return !0
        }
        return !1
    }, e.RoundedRectangle.prototype.constructor = e.RoundedRectangle, e.Matrix = function () {
        this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0
    }, e.Matrix.prototype.fromArray = function (e) {
        this.a = e[0], this.b = e[1], this.c = e[3], this.d = e[4], this.tx = e[2], this.ty = e[5]
    }, e.Matrix.prototype.toArray = function (t) {
        this.array || (this.array = new e.Float32Array(9));
        var i = this.array;
        return t ? (i[0] = this.a, i[1] = this.b, i[2] = 0, i[3] = this.c, i[4] = this.d, i[5] = 0, i[6] = this.tx, i[7] = this.ty, i[8] = 1) : (i[0] = this.a, i[1] = this.c, i[2] = this.tx, i[3] = this.b, i[4] = this.d, i[5] = this.ty, i[6] = 0, i[7] = 0, i[8] = 1), i
    }, e.Matrix.prototype.apply = function (t, i) {
        return (i = i || new e.Point).x = this.a * t.x + this.c * t.y + this.tx, i.y = this.b * t.x + this.d * t.y + this.ty, i
    }, e.Matrix.prototype.applyInverse = function (t, i) {
        i = i || new e.Point;
        var n = 1 / (this.a * this.d + this.c * -this.b);
        return i.x = this.d * n * t.x + -this.c * n * t.y + (this.ty * this.c - this.tx * this.d) * n, i.y = this.a * n * t.y + -this.b * n * t.x + (-this.ty * this.a + this.tx * this.b) * n, i
    }, e.Matrix.prototype.translate = function (e, t) {
        return this.tx += e, this.ty += t, this
    }, e.Matrix.prototype.scale = function (e, t) {
        return this.a *= e, this.d *= t, this.c *= e, this.b *= t, this.tx *= e, this.ty *= t, this
    }, e.Matrix.prototype.rotate = function (e) {
        var t = Math.cos(e), i = Math.sin(e), n = this.a, r = this.c, o = this.tx;
        return this.a = n * t - this.b * i, this.b = n * i + this.b * t, this.c = r * t - this.d * i, this.d = r * i + this.d * t, this.tx = o * t - this.ty * i, this.ty = o * i + this.ty * t, this
    }, e.Matrix.prototype.append = function (e) {
        var t = this.a, i = this.b, n = this.c, r = this.d;
        return this.a = e.a * t + e.b * n, this.b = e.a * i + e.b * r, this.c = e.c * t + e.d * n, this.d = e.c * i + e.d * r, this.tx = e.tx * t + e.ty * n + this.tx, this.ty = e.tx * i + e.ty * r + this.ty, this
    }, e.Matrix.prototype.identity = function () {
        return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this
    }, e.identityMatrix = new e.Matrix, e.DisplayObject = function () {
        this.position = new e.Point, this.scale = new e.Point(1, 1), this.pivot = new e.Point(0, 0), this.rotation = 0, this.alpha = 1, this.visible = !0, this.hitArea = null, this.buttonMode = !1, this.renderable = !1, this.parent = null, this.stage = null, this.worldAlpha = 1, this._interactive = !1, this.defaultCursor = "pointer", this.worldTransform = new e.Matrix, this._sr = 0, this._cr = 1, this.filterArea = null, this._bounds = new e.Rectangle(0, 0, 1, 1), this._currentBounds = null, this._mask = null, this._cacheIsDirty = !1
    }, e.DisplayObject.prototype.constructor = e.DisplayObject, Object.defineProperty(e.DisplayObject.prototype, "interactive", {
        get: function () {
            return this._interactive
        }, set: function (e) {
            this._interactive = e, this.stage && (this.stage.dirty = !0)
        }
    }), Object.defineProperty(e.DisplayObject.prototype, "worldVisible", {
        get: function () {
            var e = this;
            do {
                if (!e.visible) return !1;
                e = e.parent
            } while (e);
            return !0
        }
    }), Object.defineProperty(e.DisplayObject.prototype, "mask", {
        get: function () {
            return this._mask
        }, set: function (e) {
            this._mask && (this._mask.isMask = !1), this._mask = e, this._mask && (this._mask.isMask = !0)
        }
    }), Object.defineProperty(e.DisplayObject.prototype, "filters", {
        get: function () {
            return this._filters
        }, set: function (e) {
            if (e) {
                for (var t = [], i = 0; i < e.length; i++) for (var n = e[i].passes, r = 0; r < n.length; r++) t.push(n[r]);
                this._filterBlock = {target: this, filterPasses: t}
            }
            this._filters = e
        }
    }), e.DisplayObject.prototype.updateTransform = function (t, i, n, r, o, a, s, l) {
        t = this.parent.worldTransform, i = this.worldTransform, this.rotation % e.PI_2 != 0 ? (this.rotation !== this.rotationCache && (this.rotationCache = this.rotation, this._sr = Math.sin(this.rotation), this._cr = Math.cos(this.rotation)), n = this._cr * this.scale.x, r = this._sr * this.scale.x, o = -this._sr * this.scale.y, a = this._cr * this.scale.y, s = this.position.x, l = this.position.y, (this.pivot.x || this.pivot.y) && (s -= this.pivot.x * n + this.pivot.y * o, l -= this.pivot.x * r + this.pivot.y * a), i.a = n * t.a + r * t.c, i.b = n * t.b + r * t.d, i.c = o * t.a + a * t.c, i.d = o * t.b + a * t.d, i.tx = s * t.a + l * t.c + t.tx, i.ty = s * t.b + l * t.d + t.ty) : (n = this.scale.x, a = this.scale.y, s = this.position.x - this.pivot.x * n, l = this.position.y - this.pivot.y * a, i.a = n * t.a, i.b = n * t.b, i.c = a * t.c, i.d = a * t.d, i.tx = s * t.a + l * t.c + t.tx, i.ty = s * t.b + l * t.d + t.ty), this.worldAlpha = this.alpha * this.parent.worldAlpha
    }, e.DisplayObject.prototype.displayObjectUpdateTransform = e.DisplayObject.prototype.updateTransform, e.DisplayObject.prototype.getBounds = function (t) {
        return t = t, e.EmptyRectangle
    }, e.DisplayObject.prototype.getLocalBounds = function () {
        return this.getBounds(e.identityMatrix)
    }, e.DisplayObject.prototype.setStageReference = function (e) {
        this.stage = e, this._interactive && (this.stage.dirty = !0)
    }, e.DisplayObject.prototype.toGlobal = function (e) {
        return this.displayObjectUpdateTransform(), this.worldTransform.apply(e)
    }, e.DisplayObject.prototype.toGlobalSize = function (e) {
        return this.displayObjectUpdateTransform(), new Point(e.x * this.worldTransform.a, e.y * this.worldTransform.d)
    }, e.DisplayObject.prototype.toLocalSize = function (e, t) {
        return t && (e = t.toGlobal(e)), this.displayObjectUpdateTransform(), new Point(e.x / this.worldTransform.a, e.y / this.worldTransform.d)
    }, e.DisplayObject.prototype.toLocal = function (e, t) {
        return t && (e = t.toGlobal(e)), this.displayObjectUpdateTransform(), this.worldTransform.applyInverse(e)
    }, e.DisplayObject.prototype._renderWebGL = function (e) {
    }, e.DisplayObject.prototype._renderCanvas = function (e) {
    }, e.DisplayObject._tempMatrix = new e.Matrix, Object.defineProperty(e.DisplayObject.prototype, "x", {
        get: function () {
            return this.position.x
        }, set: function (e) {
            this.position.x = e
        }
    }), Object.defineProperty(e.DisplayObject.prototype, "y", {
        get: function () {
            return this.position.y
        }, set: function (e) {
            this.position.y = e
        }
    }), e.DisplayObjectContainer = function () {
        e.DisplayObject.call(this), this.children = []
    }, e.DisplayObjectContainer.prototype = Object.create(e.DisplayObject.prototype), e.DisplayObjectContainer.prototype.constructor = e.DisplayObjectContainer, Object.defineProperty(e.DisplayObjectContainer.prototype, "width", {
        get: function () {
            return this.scale.x * this.getLocalBounds().width
        }, set: function (e) {
            var t = this.getLocalBounds().width;
            this.scale.x = 0 !== t ? e / t : 1, this._width = e
        }
    }), Object.defineProperty(e.DisplayObjectContainer.prototype, "height", {
        get: function () {
            return this.scale.y * this.getLocalBounds().height
        }, set: function (e) {
            var t = this.getLocalBounds().height;
            this.scale.y = 0 !== t ? e / t : 1, this._height = e
        }
    }), e.DisplayObjectContainer.prototype.addChild = function (e) {
        return window.dirtyOnce = !0, this.addChildAt(e, this.children.length)
    }, e.DisplayObjectContainer.prototype.addChildAt = function (e, t) {
        if (t >= 0 && t <= this.children.length) return window.dirtyOnce = !0, window.Host && Host.Localize.UpdateChildren(e), e.parent && e.parent.removeChild(e), e.parent = this, this.children.splice(t, 0, e), this.stage && e.setStageReference(this.stage), e;
        throw new Error(e + "addChildAt: The index " + t + " supplied is out of bounds " + this.children.length)
    }, e.DisplayObjectContainer.prototype.getChildIndex = function (e) {
        var t = this.children.indexOf(e);
        if (-1 === t) throw new Error("The supplied DisplayObject must be a child of the caller");
        return t
    }, e.DisplayObjectContainer.prototype.setChildIndex = function (e, t) {
        if (t < 0 || t >= this.children.length) throw new Error("The supplied index is out of bounds");
        window.dirtyOnce = !0;
        var i = this.getChildIndex(e);
        this.children.splice(i, 1), this.children.splice(t, 0, e)
    }, e.DisplayObjectContainer.prototype.getChildAt = function (e) {
        if (e < 0 || e >= this.children.length) throw new Error("getChildAt: Supplied index " + e + " does not exist in the child list, or the supplied DisplayObject must be a child of the caller");
        return this.children[e]
    }, e.DisplayObjectContainer.prototype.removeChild = function (e) {
        var t = this.children.indexOf(e);
        if (-1 !== t) return this.removeChildAt(t)
    }, e.DisplayObjectContainer.prototype.removeChildAt = function (e) {
        var t = this.getChildAt(e);
        return this.stage && t.removeStageReference(), window.dirtyOnce = !0, t.parent = void 0, this.children.splice(e, 1), t
    }, e.DisplayObjectContainer.prototype.updateTransform = function () {
        if (this.visible) {
            this.displayObjectUpdateTransform();
            for (var e = 0, t = this.children.length; e < t; e++) this.children[e].updateTransform()
        }
    }, e.DisplayObjectContainer.prototype.displayObjectContainerUpdateTransform = e.DisplayObjectContainer.prototype.updateTransform, e.DisplayObjectContainer.prototype.getBounds = function () {
        if (0 === this.children.length) return e.EmptyRectangle;
        for (var t, i, n, r = 1 / 0, o = 1 / 0, a = -1 / 0, s = -1 / 0, l = !1, c = 0, d = this.children.length; c < d; c++) this.children[c].visible && (l = !0, r = r < (t = this.children[c].getBounds()).x ? r : t.x, o = o < t.y ? o : t.y, a = a > (i = t.width + t.x) ? a : i, s = s > (n = t.height + t.y) ? s : n);
        if (!l) return e.EmptyRectangle;
        var h = this._bounds;
        return h.x = r, h.y = o, h.width = a - r, h.height = s - o, h
    }, e.DisplayObjectContainer.prototype.getLocalBounds = function () {
        var t = this.worldTransform;
        this.worldTransform = e.identityMatrix;
        for (var i = 0, n = this.children.length; i < n; i++) this.children[i].updateTransform();
        var r = this.getBounds();
        return this.worldTransform = t, r
    }, e.DisplayObjectContainer.prototype.setStageReference = function (e) {
        this.stage = e, this._interactive && (this.stage.dirty = !0);
        for (var t = 0, i = this.children.length; t < i; t++) this.children[t].setStageReference(e)
    }, e.DisplayObjectContainer.prototype.removeStageReference = function () {
        for (var e = 0, t = this.children.length; e < t; e++) this.children[e].removeStageReference();
        this._interactive && (this.stage.dirty = !0), this.stage = null
    }, e.DisplayObjectContainer.prototype._renderWebGL = function (e) {
        var t, i;
        if (this.visible && !(this.alpha <= 0)) if (this._mask || this._filters) {
            for (this._mask && (e.spriteBatch.stop(), e.maskManager.pushMask(this.mask, e), e.spriteBatch.start()), t = 0, i = this.children.length; t < i; t++) this.children[t]._renderWebGL(e);
            e.spriteBatch.stop(), this._mask && e.maskManager.popMask(this._mask, e), e.spriteBatch.start()
        } else for (t = 0, i = this.children.length; t < i; t++) this.children[t]._renderWebGL(e)
    }, e.DisplayObjectContainer.prototype._renderCanvas = function (e) {
        if (!1 !== this.visible && 0 !== this.alpha) {
            this._mask && e.maskManager.pushMask(this._mask, e);
            for (var t = 0, i = this.children.length; t < i; t++) this.children[t]._renderCanvas(e);
            this._mask && e.maskManager.popMask(e)
        }
    }, e.Sprite = function (t) {
        e.DisplayObjectContainer.call(this), this.anchor = new e.Point, this.texture = t || e.Texture.emptyTexture, this._width = 0, this._height = 0, this.tint = 16777215, this.blendMode = e.blendModes.NORMAL, this.shader = null, this.texture.baseTexture.hasLoaded ? this.onTextureUpdate() : this.texture.onPixi("update", this.onTextureUpdate.bind(this)), this.renderable = !0
    }, e.Sprite.prototype = Object.create(e.DisplayObjectContainer.prototype), e.Sprite.prototype.constructor = e.Sprite, Object.defineProperty(e.Sprite.prototype, "width", {
        get: function () {
            return this.scale.x * this.texture.frame.width
        }, set: function (e) {
            this.scale.x = e / this.texture.frame.width, this._width = e
        }
    }), Object.defineProperty(e.Sprite.prototype, "height", {
        get: function () {
            return this.scale.y * this.texture.frame.height
        }, set: function (e) {
            this.scale.y = e / this.texture.frame.height, this._height = e
        }
    }), e.Sprite.prototype.setTexture = function (e) {
        this.texture = e, this.cachedTint = 16777215
    }, e.Sprite.prototype.onTextureUpdate = function () {
        this._width && (this.scale.x = this._width / this.texture.frame.width), this._height && (this.scale.y = this._height / this.texture.frame.height)
    }, e.Sprite.prototype.getBounds = function (e) {
        var t = this.texture.frame.width, i = this.texture.frame.height;
        !this.texture.baseTexture.hasLoaded && this.image && this.image.width && (t = this.image.width, i = this.image.height);
        var n = t * (1 - this.anchor.x), r = t * -this.anchor.x, o = i * (1 - this.anchor.y), a = i * -this.anchor.y,
            s = e || this.worldTransform, l = s.a, c = s.b, d = s.c, h = s.d, u = s.tx, f = s.ty, g = -1 / 0,
            p = -1 / 0, m = 1 / 0, v = 1 / 0;
        if (0 === c && 0 === d) l < 0 && (l *= -1), h < 0 && (h *= -1), m = l * r + u, g = l * n + u, v = h * a + f, p = h * o + f; else {
            var w = l * r + d * a + u, b = h * a + c * r + f, y = l * n + d * a + u, S = h * a + c * n + f,
                x = l * n + d * o + u, C = h * o + c * n + f, T = l * r + d * o + u, _ = h * o + c * r + f;
            m = T < (m = x < (m = y < (m = w < m ? w : m) ? y : m) ? x : m) ? T : m, v = _ < (v = C < (v = S < (v = b < v ? b : v) ? S : v) ? C : v) ? _ : v, g = T > (g = x > (g = y > (g = w > g ? w : g) ? y : g) ? x : g) ? T : g, p = _ > (p = C > (p = S > (p = b > p ? b : p) ? S : p) ? C : p) ? _ : p
        }
        var k = this._bounds;
        return k.x = m, k.width = g - m, k.y = v, k.height = p - v, this._currentBounds = k, k
    }, e.Sprite.prototype._renderWebGL = function (e) {
        var t, i;
        if (this.visible && !(this.alpha <= 0)) if (this._mask || this._filters) {
            var n = e.spriteBatch;
            for (this._filters && (n.flush(), e.filterManager.pushFilter(this._filterBlock)), this._mask && (n.stop(), e.maskManager.pushMask(this.mask, e), n.start()), n.render(this), t = 0, i = this.children.length; t < i; t++) this.children[t]._renderWebGL(e);
            n.stop(), this._mask && e.maskManager.popMask(this._mask, e), this._filters && e.filterManager.popFilter(), n.start()
        } else for (e.spriteBatch.render(this), t = 0, i = this.children.length; t < i; t++) this.children[t]._renderWebGL(e)
    }, e.Sprite.prototype._renderCanvas = function (t) {
        if (!(!1 === this.visible || 0 === this.alpha || this.texture.crop.width <= 0 || this.texture.crop.height <= 0)) {
            if (this.blendMode !== t.currentBlendMode && (t.currentBlendMode = this.blendMode, t.context.globalCompositeOperation = e.blendModesCanvas[t.currentBlendMode]), this._mask && t.maskManager.pushMask(this._mask, t), this.texture.valid) {
                t.context.globalAlpha = this.worldAlpha, t.smoothProperty && t.scaleMode !== this.texture.baseTexture.scaleMode && (t.scaleMode = this.texture.baseTexture.scaleMode, t.context[t.smoothProperty] = t.scaleMode === e.scaleModes.LINEAR);
                var i = this.texture.trim ? this.texture.trim.x - this.anchor.x * this.texture.trim.width : this.anchor.x * -this.texture.frame.width,
                    n = this.texture.trim ? this.texture.trim.y - this.anchor.y * this.texture.trim.height : this.anchor.y * -this.texture.frame.height;
                if (t.context.setTransform(this.worldTransform.a, this.worldTransform.b, this.worldTransform.c, this.worldTransform.d, 0 | this.worldTransform.tx, 0 | this.worldTransform.ty), i |= 0, n |= 0, 16777215 !== this.tint) {
                    this.cachedTint !== this.tint && (this.cachedTint = this.tint, this.tintedTexture = e.CanvasTinter.getTintedTexture(this, this.tint));
                    var r = this.texture.resolution || 1;
                    t.context.drawImage(this.tintedTexture, 0, 0, this.texture.crop.width * r, this.texture.crop.height * r, i, n, this.texture.crop.width, this.texture.crop.height)
                } else r = this.texture.resolution || 1, t.context.drawImage(this.texture.baseTexture.source, this.texture.crop.x * r, this.texture.crop.y * r, this.texture.crop.width * r, this.texture.crop.height * r, i, n, this.texture.crop.width, this.texture.crop.height)
            }
            for (var o = 0, a = this.children.length; o < a; o++) this.children[o]._renderCanvas(t);
            this._mask && t.maskManager.popMask(t)
        }
    }, e.Sprite.fromFrame = function (t) {
        var i = e.TextureCache[t];
        if (!i) throw new Error('The frameId "' + t + '" does not exist in the texture cache' + this);
        return new e.Sprite(i)
    }, e.Sprite.fromImage = function (t, i, n) {
        var r = e.Texture.fromImage(t, i, n);
        return new e.Sprite(r)
    }, e.SpriteBatch = function () {
        e.DisplayObjectContainer.call(this), this.ready = !1
    }, e.SpriteBatch.prototype = Object.create(e.DisplayObjectContainer.prototype), e.SpriteBatch.prototype.constructor = e.SpriteBatch, e.SpriteBatch.prototype.initWebGL = function (t) {
        this.fastSpriteBatch = new e.WebGLFastSpriteBatch(t), this.ready = !0
    },e.SpriteBatch.prototype.updateTransform = function () {
        this.displayObjectUpdateTransform()
    },e.SpriteBatch.prototype._renderWebGL = function (e) {
        !this.visible || this.alpha <= 0 || !this.children.length || (this.ready || this.initWebGL(e.gl), e.spriteBatch.stop(), e.shaderManager.setShader(e.shaderManager.fastShader), this.fastSpriteBatch.begin(this, e), this.fastSpriteBatch.render(this), e.spriteBatch.start())
    },e.SpriteBatch.prototype._renderCanvas = function (e) {
        if (this.visible && !(this.alpha <= 0) && this.children.length) {
            var t = e.context;
            t.globalAlpha = this.worldAlpha, this.displayObjectUpdateTransform();
            for (var i = this.worldTransform, n = !0, r = 0; r < this.children.length; r++) {
                var o = this.children[r];
                if (o.visible) {
                    var a = o.texture, s = a.frame;
                    if (t.globalAlpha = this.worldAlpha * o.alpha, o.rotation % (2 * Math.PI) == 0) n && (t.setTransform(i.a, i.b, i.c, i.d, i.tx, i.ty), n = !1), t.drawImage(a.baseTexture.source, s.x, s.y, s.width, s.height, o.anchor.x * (-s.width * o.scale.x) + o.position.x + .5 | 0, o.anchor.y * (-s.height * o.scale.y) + o.position.y + .5 | 0, s.width * o.scale.x, s.height * o.scale.y); else {
                        n || (n = !0), o.displayObjectUpdateTransform();
                        var l = o.worldTransform;
                        t.setTransform(l.a, l.b, l.c, l.d, 0 | l.tx, 0 | l.ty), t.drawImage(a.baseTexture.source, s.x, s.y, s.width, s.height, o.anchor.x * -s.width + .5 | 0, o.anchor.y * -s.height + .5 | 0, s.width, s.height)
                    }
                }
            }
        }
    },e.Text = function (t, i) {
        this.canvas = document.createElement("canvas"), this.context = this.canvas.getContext("2d"), e.Sprite.call(this, e.Texture.fromCanvas(this.canvas)), this.setText(t), this.setStyle(i)
    },e.Text.prototype = Object.create(e.Sprite.prototype),e.Text.prototype.constructor = e.Text,Object.defineProperty(e.Text.prototype, "width", {
        get: function () {
            return this.dirty && (this.updateText(), this.dirty = !1), this.scale.x * this.texture.frame.width
        }, set: function (e) {
            this.scale.x = e / this.texture.frame.width, this._width = e
        }
    }),Object.defineProperty(e.Text.prototype, "height", {
        get: function () {
            return this.dirty && (this.updateText(), this.dirty = !1), this.scale.y * this.texture.frame.height
        }, set: function (e) {
            this.scale.y = e / this.texture.frame.height, this._height = e
        }
    }),e.Text.prototype.setStyle = function (e) {
        (e = e || {}).font = e.font || "bold 20pt Arial", e.fill = e.fill || "black", e.align = e.align || "left", e.stroke = e.stroke || "black", e.strokeThickness = e.strokeThickness || 0, e.wordWrap = e.wordWrap || !1, e.wordWrapWidth = e.wordWrapWidth || 100, e.dropShadow = e.dropShadow || !1, e.dropShadowAngle = e.dropShadowAngle || Math.PI / 6, e.dropShadowDistance = e.dropShadowDistance || 4, e.dropShadowColor = e.dropShadowColor || "black", this.style = e, this.dirty = !0
    },e.Text.prototype.setText = function (e) {
        this.text != e.toString() && (this.text = e.toString() || " ", this.dirty = !0, window.dirtyOnce = !0)
    },e.Text.prototype.updateText = function () {
        this.context.font = this.style._font || this.style.font;
        var e = this.text.toString();
        this.style.wordWrap && (e = this.wordWrap(this.text));
        for (var t = e ? e.split(/(?:\r\n|\r|\n)/) : [], i = [], n = 0, r = this.determineFontProperties(this.style._font || this.style.font), o = 0; o < t.length; o++) {
            var a = this.context.measureText(t[o]).width;
            i[o] = a, n = Math.max(n, a)
        }
        var s = n + this.style.strokeThickness;
        this.style.dropShadow && (s += this.style.dropShadowDistance), this.canvas.width = Math.max(s + this.context.lineWidth, 1);
        var l, c, d = r.fontSize + this.style.strokeThickness, h = d * t.length;
        if (this.style.dropShadow && (h += this.style.dropShadowDistance), this.canvas.height = Math.max(h, 1), this.context.scale(1, 1), this.context.font = this.style._font || this.style.font, this.context.strokeStyle = this.style.stroke, this.context.lineWidth = this.style.strokeThickness, this.context.textBaseline = "alphabetic", this.style.dropShadow) {
            this.context.fillStyle = this.style.dropShadowColor;
            var u = Math.sin(this.style.dropShadowAngle) * this.style.dropShadowDistance,
                f = Math.cos(this.style.dropShadowAngle) * this.style.dropShadowDistance;
            for (o = 0; o < t.length; o++) l = this.style.strokeThickness / 2, c = this.style.strokeThickness / 2 + o * d + r.ascent, "right" === this.style.align ? l += n - i[o] : "center" === this.style.align && (l += (n - i[o]) / 2), this.style.fill && this.context.fillText(t[o], l + u, c + f)
        }
        for (this.context.fillStyle = this.style.fill, o = 0; o < t.length; o++) l = this.style.strokeThickness / 2, c = this.style.strokeThickness / 2 + o * d + r.ascent, "right" === this.style.align ? l += n - i[o] : "center" === this.style.align && (l += (n - i[o]) / 2), this.style.stroke && this.style.strokeThickness && this.context.strokeText(t[o], l, c), this.style.fill && this.context.fillText(t[o], l, c);
        this.updateTexture()
    },e.Text.prototype.updateTexture = function () {
        try {
            void 0 !== this._lastSize && (e.frvrTextureMemoryUsage -= 4 * this._lastSize.w * this._lastSize.h)
        } catch (e) {
        }
        this.texture.baseTexture.width = this.canvas.width, this.texture.baseTexture.height = this.canvas.height, this.texture.crop.width = this.texture.frame.width = this.canvas.width, this.texture.crop.height = this.texture.frame.height = this.canvas.height, this._width = this.canvas.width, this._height = this.canvas.height;
        try {
            e.frvrTextureMemoryUsage += 4 * this.texture.baseTexture.width * this.texture.baseTexture.height, this._lastSize = {
                w: this.texture.baseTexture.width,
                h: this.texture.baseTexture.height
            }
        } catch (e) {
        }
        this.texture.baseTexture.dirty(), this.texture.tintCache = []
    },e.Text.prototype._renderWebGL = function (t) {
        this.dirty && (this.updateText(), this.dirty = !1), e.Sprite.prototype._renderWebGL.call(this, t)
    },e.Text.prototype._renderCanvas = function (t) {
        this.dirty && (this.updateText(), this.dirty = !1), e.Sprite.prototype._renderCanvas.call(this, t)
    },e.Text.prototype.determineFontProperties = function (t) {
        var i = e.Text.fontPropertiesCache[t];
        if (!i) {
            i = {};
            var n = e.Text.fontPropertiesCanvas, r = e.Text.fontPropertiesContext;
            r.font = t;
            var o = Math.max(Math.ceil(r.measureText("|MÉq").width), 1), a = Math.ceil(r.measureText("M").width),
                s = Math.max(2 * a, 1);
            a = 1.4 * a | 0, n.width = o, n.height = s, r.fillStyle = "#ffffff", r.fillRect(0, 0, o, s), r.font = t, r.textBaseline = "alphabetic", r.fillStyle = "#888888", r.fillText("|MÉq", 0, a);
            var l, c, d = r.getImageData(0, 0, o, s).data, h = d.length, u = 4 * o, f = 0, g = !1;
            for (l = 0; l < a; l++) {
                for (c = 0; c < u; c += 4) if (255 !== d[f + c]) {
                    g = !0;
                    break
                }
                if (g) break;
                f += u
            }
            for (i.ascent = a - l, f = h - u, g = !1, l = s; l > a; l--) {
                for (c = 0; c < u; c += 4) if (255 !== d[f + c]) {
                    g = !0;
                    break
                }
                if (g) break;
                f -= u
            }
            i.descent = l - a, i.fontSize = i.ascent + i.descent, e.Text.fontPropertiesCache[t] = i
        }
        return i
    },e.Text.prototype.wordWrap = function (e) {
        for (var t = "", i = e.split("\n"), n = 0; n < i.length; n++) {
            for (var r = this.style.wordWrapWidth, o = i[n].split(" "), a = 0; a < o.length; a++) {
                var s = this.context.measureText(o[a]).width, l = s + this.context.measureText(" ").width;
                0 === a || l > r ? (a > 0 && (t += "\n"), t += o[a], r = this.style.wordWrapWidth - s) : (r -= l, t += " " + o[a])
            }
            n < i.length - 1 && (t += "\n")
        }
        return t
    },e.Text.prototype.getBounds = function (t) {
        return this.dirty && (this.updateText(), this.dirty = !1), e.Sprite.prototype.getBounds.call(this, t)
    },e.Text.prototype.destroy = function (e) {
        this.context = null, this.canvas = null, this.texture.destroy(void 0 === e || e)
    },e.Text.fontPropertiesCache = {},e.Text.fontPropertiesCanvas = document.createElement("canvas"),e.Text.fontPropertiesContext = e.Text.fontPropertiesCanvas.getContext("2d"),e.InteractionData = function () {
        this.global = new e.Point, this.target = null, this.originalEvent = null
    },e.InteractionData.prototype.getLocalPosition = function (t, i) {
        var n = t.worldTransform, r = this.global, o = n.a, a = n.c, s = n.tx, l = n.b, c = n.d, d = n.ty,
            h = 1 / (o * c + a * -l);
        return (i = i || new e.Point).x = c * h * r.x + -a * h * r.y + (d * a - s * c) * h, i.y = o * h * r.y + -l * h * r.x + (-d * o + s * l) * h, i
    },e.InteractionData.prototype.constructor = e.InteractionData,e.InteractionManager = function (t) {
        this.stage = t, this.mouse = new e.InteractionData, this.touches = {}, this.tempPoint = new e.Point, this.mouseoverEnabled = !0, this.pool = [], this.interactiveItems = [], this.interactionDOMElement = null, this.onMouseMove = this.onMouseMove.bind(this), this.onMouseDown = this.onMouseDown.bind(this), this.onMouseOut = this.onMouseOut.bind(this), this.onMouseUp = this.onMouseUp.bind(this), this.onTouchStart = this.onTouchStart.bind(this), this.onTouchEnd = this.onTouchEnd.bind(this), this.onTouchMove = this.onTouchMove.bind(this), this.last = 0, this.currentCursorStyle = "inherit", this.mouseOut = !1, this._tempPoint = new e.Point
    },e.InteractionManager.prototype.constructor = e.InteractionManager,e.InteractionManager.prototype.collectInteractiveSprite = function (e, t) {
        for (var i = e.children, n = i.length - 1; n >= 0; n--) {
            var r = i[n];
            r._interactive ? (t.interactiveChildren = !0, this.interactiveItems.push(r), r.children.length > 0 && this.collectInteractiveSprite(r, r)) : (r.__iParent = null, r.children.length > 0 && this.collectInteractiveSprite(r, t))
        }
    },e.InteractionManager.prototype.setTarget = function (e) {
        this.target = e, null === this.interactionDOMElement && this.setTargetDomElement(e.view)
    },e.InteractionManager.prototype.setTargetDomElement = function (e) {
        this.removeEvents(), window.navigator.msPointerEnabled && (e.style["-ms-content-zooming"] = "none", e.style["-ms-touch-action"] = "none"), this.interactionDOMElement = e, e.addEventListener("mousemove", this.onMouseMove, !0), e.addEventListener("mousedown", this.onMouseDown, !0), e.addEventListener("mouseout", this.onMouseOut, !0), e.addEventListener("touchstart", this.onTouchStart, !0), e.addEventListener("touchend", this.onTouchEnd, !0), e.addEventListener("touchmove", this.onTouchMove, !0), window.addEventListener("mouseup", this.onMouseUp, !0)
    },e.InteractionManager.prototype.removeEvents = function () {
        this.interactionDOMElement && (this.interactionDOMElement.style["-ms-content-zooming"] = "", this.interactionDOMElement.style["-ms-touch-action"] = "", this.interactionDOMElement.removeEventListener("mousemove", this.onMouseMove, !0), this.interactionDOMElement.removeEventListener("mousedown", this.onMouseDown, !0), this.interactionDOMElement.removeEventListener("mouseout", this.onMouseOut, !0), this.interactionDOMElement.removeEventListener("touchstart", this.onTouchStart, !0), this.interactionDOMElement.removeEventListener("touchend", this.onTouchEnd, !0), this.interactionDOMElement.removeEventListener("touchmove", this.onTouchMove, !0), this.interactionDOMElement = null, window.removeEventListener("mouseup", this.onMouseUp, !0))
    },e.InteractionManager.prototype.update = function () {
        if (this.target) {
            var t = Date.now(), i = t - this.last;
            if (!((i = i * e.INTERACTION_FREQUENCY / 1e3) < 1)) {
                this.last = t;
                var n = 0;
                this.dirty && this.rebuildInteractiveGraph();
                var r = this.interactiveItems.length, o = "inherit", a = !1;
                for (n = 0; n < r; n++) {
                    var s = this.interactiveItems[n];
                    s.__hit = this.hitTest(s, this.mouse), this.mouse.target = s, s.__hit && !a ? (s.buttonMode && (o = s.defaultCursor), s.interactiveChildren || (a = !0), s.__isOver || (s.mouseover && s.mouseover(this.mouse), s.__isOver = !0)) : s.__isOver && (s.mouseout && s.mouseout(this.mouse), s.__isOver = !1)
                }
                this.currentCursorStyle === o || XS.ignoreCursorChanges || (this.currentCursorStyle = o, this.interactionDOMElement.style.cursor = o)
            }
        }
    },e.InteractionManager.prototype.rebuildInteractiveGraph = function () {
        this.dirty = !1;
        for (var e = this.interactiveItems.length, t = 0; t < e; t++) this.interactiveItems[t].interactiveChildren = !1;
        this.interactiveItems = [], this.stage.interactive && this.interactiveItems.push(this.stage), this.collectInteractiveSprite(this.stage, this.stage)
    },e.InteractionManager.prototype.onMouseMove = function (e) {
        if (this.dirty && this.rebuildInteractiveGraph(), this.mouse) {
            this.mouse.originalEvent = e;
            var t = this.interactionDOMElement.getBoundingClientRect();
            this.mouse.global.x = (e.clientX - t.left) * (this.target.width / t.width), this.mouse.global.y = (e.clientY - t.top) * (this.target.height / t.height);
            for (var i = this.interactiveItems.length, n = 0; n < i; n++) {
                var r = this.interactiveItems[n];
                r.mousemove && r.mousemove(this.mouse)
            }
        }
    },e.InteractionManager.prototype.onMouseDown = function (t) {
        if (this.dirty && this.rebuildInteractiveGraph(), this.mouse) {
            this.mouse.originalEvent = t, e.AUTO_PREVENT_DEFAULT && this.mouse.originalEvent && (void 0 === this.mouse.originalEvent.cancelable || this.mouse.originalEvent.cancelable) && this.mouse.originalEvent.preventDefault();
            for (var i = this.interactiveItems.length, n = this.mouse.originalEvent, r = 2 === n.button || 3 === n.which, o = r ? "rightdown" : "mousedown", a = r ? "rightclick" : "__click", s = r ? "__rightIsDown" : "__mouseIsDown", l = r ? "__isRightDown" : "__isDown", c = 0; c < i; c++) {
                var d = this.interactiveItems[c];
                if ((d[o] || d[a]) && (d[s] = !0, d.__hit = this.hitTest(d, this.mouse), d.__hit && (d[o] && d[o](this.mouse), d[l] = !0, !d.interactiveChildren))) break
            }
        }
    },e.InteractionManager.prototype.onMouseOut = function (e) {
        if (this.dirty && this.rebuildInteractiveGraph(), this.mouse) {
            this.mouse.originalEvent = e;
            var t = this.interactiveItems.length;
            this.interactionDOMElement.style.cursor = "inherit";
            for (var i = 0; i < t; i++) {
                var n = this.interactiveItems[i];
                n.__isOver && (this.mouse.target = n, n.mouseout && n.mouseout(this.mouse), n.__isOver = !1)
            }
            this.mouseOut = !0
        }
    },e.InteractionManager.prototype.onMouseUp = function (e) {
        if (this.dirty && this.rebuildInteractiveGraph(), this.mouse) {
            this.mouse.originalEvent = e;
            for (var t = this.interactiveItems.length, i = !1, n = this.mouse.originalEvent, r = 2 === n.button || 3 === n.which, o = r ? "rightup" : "mouseup", a = r ? "rightclick" : "__click", s = r ? "rightupoutside" : "mouseupoutside", l = r ? "__isRightDown" : "__isDown", c = 0; c < t; c++) {
                var d = this.interactiveItems[c];
                (d[a] || d[o] || d[s]) && (d.__hit = this.hitTest(d, this.mouse), d.__hit && !i ? (d[o] && d[o](this.mouse), d[l] && d[a] && d[a](this.mouse), d.interactiveChildren || (i = !0)) : d[l] && d[s] && d[s](this.mouse), d[l] = !1)
            }
        }
    },e.InteractionManager.prototype.hitTest = function (t, i) {
        var n = i.global;
        if (!t.worldVisible) return !1;
        t.worldTransform.applyInverse(n, this._tempPoint);
        var r, o = this._tempPoint.x, a = this._tempPoint.y;
        if (i.target = t, t.hitArea && t.hitArea.contains) return t.hitArea.contains(o, a);
        if (t instanceof e.Sprite) {
            var s, l = t.texture.frame.width, c = t.texture.frame.height, d = -l * t.anchor.x;
            if (o > d && o < d + l && a > (s = -c * t.anchor.y) && a < s + c) return !0
        } else if (t instanceof e.Graphics) {
            var h = t.graphicsData;
            for (r = 0; r < h.length; r++) {
                var u = h[r];
                if (u.fill && u.shape && u.shape.contains(o, a)) return !0
            }
        }
        var f = t.children.length;
        for (r = 0; r < f; r++) {
            var g = t.children[r];
            if (this.hitTest(g, i)) return i.target = t, !0
        }
        return !1
    },e.InteractionManager.prototype.onTouchMove = function (e) {
        this.dirty && this.rebuildInteractiveGraph();
        var t, i = this.interactionDOMElement.getBoundingClientRect(), n = e.changedTouches, r = 0;
        for (r = 0; r < n.length; r++) {
            var o = n[r];
            if (t = this.touches[o.identifier]) {
                t.originalEvent = e, t.global.x = (o.clientX - i.left) * (this.target.width / i.width), t.global.y = (o.clientY - i.top) * (this.target.height / i.height);
                for (var a = 0; a < this.interactiveItems.length; a++) {
                    var s = this.interactiveItems[a];
                    s.touchmove && s.__touchData && s.__touchData[o.identifier] && s.touchmove(t)
                }
            }
        }
        (void 0 === e.cancelable || e.cancelable) && e.preventDefault()
    },e.InteractionManager.prototype.onTouchStart = function (t) {
        this.dirty && this.rebuildInteractiveGraph();
        var i = this.interactionDOMElement.getBoundingClientRect();
        e.AUTO_PREVENT_DEFAULT && (void 0 === t.cancelable || t.cancelable) && t.preventDefault();
        for (var n = t.changedTouches, r = 0; r < n.length; r++) {
            var o = n[r], a = this.pool.pop();
            a || (a = new e.InteractionData), a.originalEvent = t, this.touches[o.identifier] = a, a.global.x = (o.clientX - i.left) * (this.target.width / i.width), a.global.y = (o.clientY - i.top) * (this.target.height / i.height);
            for (var s = this.interactiveItems.length, l = 0; l < s; l++) {
                var c = this.interactiveItems[l];
                if ((c.touchstart || c.tap) && (c.__hit = this.hitTest(c, a), c.__hit && (c.touchstart && c.touchstart(a), c.__isDown = !0, c.__touchData = c.__touchData || {}, c.__touchData[o.identifier] = a, !c.interactiveChildren))) break
            }
        }
    },e.InteractionManager.prototype.onTouchEnd = function (e) {
        this.dirty && this.rebuildInteractiveGraph();
        for (var t = this.interactionDOMElement.getBoundingClientRect(), i = e.changedTouches, n = 0; n < i.length; n++) {
            var r = i[n], o = this.touches[r.identifier];
            if (o) {
                var a = !1;
                o.global.x = (r.clientX - t.left) * (this.target.width / t.width), o.global.y = (r.clientY - t.top) * (this.target.height / t.height);
                for (var s = this.interactiveItems.length, l = 0; l < s; l++) {
                    var c = this.interactiveItems[l];
                    c.__touchData && c.__touchData[r.identifier] && (c.__hit = this.hitTest(c, c.__touchData[r.identifier]), o.originalEvent = e, (c.touchend || c.tap) && (c.__hit && !a ? (c.touchend && c.touchend(o), c.__isDown && c.tap && c.tap(o), c.interactiveChildren || (a = !0)) : c.__isDown && c.touchendoutside && c.touchendoutside(o), c.__isDown = !1), c.__touchData[r.identifier] = null)
                }
                this.pool.push(o), this.touches[r.identifier] = null
            }
        }
    },e.Stage = function (t) {
        e.DisplayObjectContainer.call(this), this.worldTransform = new e.Matrix, this.interactive = !0, this.interactionManager = new e.InteractionManager(this), this.dirty = !0, this.stage = this, this.stage.hitArea = new e.Rectangle(0, 0, 1e5, 1e5), this.setBackgroundColor(t)
    },e.Stage.prototype = Object.create(e.DisplayObjectContainer.prototype),e.Stage.prototype.constructor = e.Stage,e.Stage.prototype.updateTransform = function () {
        this.worldAlpha = 1;
        for (var e = 0, t = this.children.length; e < t; e++) this.children[e].updateTransform();
        this.dirty && (this.dirty = !1, this.interactionManager.dirty = !0), this.interactive && this.interactionManager.update()
    },e.Stage.prototype.setBackgroundColor = function (t) {
        this.backgroundColor = t || 0, this.backgroundColorSplit = e.hex2rgb(this.backgroundColor);
        var i = this.backgroundColor.toString(16);
        i = "000000".substr(0, 6 - i.length) + i, this.backgroundColorString = "#" + i
    },e.Stage.prototype.getMousePosition = function () {
        return this.interactionManager.mouse.global
    },e.hex2rgb = function (e) {
        return [(e >> 16 & 255) / 255, (e >> 8 & 255) / 255, (255 & e) / 255]
    },e.rgb2hex = function (e) {
        return (255 * e[0] << 16) + (255 * e[1] << 8) + 255 * e[2]
    },e.canUseNewCanvasBlendModes = function () {
        if ("undefined" == typeof document) return !1;
        var e = document.createElement("canvas");
        e.width = 1, e.height = 1;
        var t = e.getContext("2d");
        return t.fillStyle = "#000", t.fillRect(0, 0, 1, 1), t.globalCompositeOperation = "multiply", t.fillStyle = "#fff", t.fillRect(0, 0, 1, 1), 0 === t.getImageData(0, 0, 1, 1).data[0]
    },e.getNextPowerOfTwo = function (e) {
        if (e > 0 && 0 == (e & e - 1)) return e;
        for (var t = 1; t < e;) t <<= 1;
        return t
    },e.isPowerOfTwo = function (e, t) {
        return e > 0 && 0 == (e & e - 1) && t > 0 && 0 == (t & t - 1)
    },e.PolyK = {},e.PolyK.Triangulate = function (t) {
        var i = !0, n = t.length >> 1;
        if (n < 3) return [];
        for (var r = [], o = [], a = 0; a < n; a++) o.push(a);
        a = 0;
        for (var s = n; s > 3;) {
            var l = o[(a + 0) % s], c = o[(a + 1) % s], d = o[(a + 2) % s], h = t[2 * l], u = t[2 * l + 1],
                f = t[2 * c], g = t[2 * c + 1], p = t[2 * d], m = t[2 * d + 1], v = !1;
            if (e.PolyK._convex(h, u, f, g, p, m, i)) {
                v = !0;
                for (var w = 0; w < s; w++) {
                    var b = o[w];
                    if (b !== l && b !== c && b !== d && e.PolyK._PointInTriangle(t[2 * b], t[2 * b + 1], h, u, f, g, p, m)) {
                        v = !1;
                        break
                    }
                }
            }
            if (v) r.push(l, c, d), o.splice((a + 1) % s, 1), s--, a = 0; else if (a++ > 3 * s) {
                if (!i) return null;
                for (r = [], o = [], a = 0; a < n; a++) o.push(a);
                a = 0, s = n, i = !1
            }
        }
        return r.push(o[0], o[1], o[2]), r
    },e.PolyK._PointInTriangle = function (e, t, i, n, r, o, a, s) {
        var l = a - i, c = s - n, d = r - i, h = o - n, u = e - i, f = t - n, g = l * l + c * c, p = l * d + c * h,
            m = l * u + c * f, v = d * d + h * h, w = d * u + h * f, b = 1 / (g * v - p * p), y = (v * m - p * w) * b,
            S = (g * w - p * m) * b;
        return y >= 0 && S >= 0 && y + S < 1
    },e.PolyK._convex = function (e, t, i, n, r, o, a) {
        return (t - n) * (r - i) + (i - e) * (o - n) >= 0 === a
    },e.EventTarget = {
        call: function (t) {
            t && (t = t.prototype || t, e.EventTarget.mixin(t))
        }, mixin: function (t) {
            t.listeners = function (e) {
                return this._listeners = this._listeners || {}, this._listeners[e] ? this._listeners[e].slice() : []
            }, t.emitPixi = t.dispatchEvent = function (t, i) {
                if (this._listeners = this._listeners || {}, "object" == typeof t && (i = t, t = t.type), i && !0 === i.__isEventObject || (i = new e.Event(this, t, i)), this._listeners && this._listeners[t]) {
                    var n, r = this._listeners[t].slice(0), o = r.length, a = r[0];
                    for (n = 0; n < o; a = r[++n]) if (a.call(this, i), i.stoppedImmediate) return this;
                    if (i.stopped) return this
                }
                return this.parent && this.parent.emit && this.parent.emit.call(this.parent, t, i), this
            }, t.onPixi = t.addEventListener = function (e, t) {
                return this._listeners = this._listeners || {}, (this._listeners[e] = this._listeners[e] || []).push(t), this
            }, t.oncePixi = function (e, t) {
                this._listeners = this._listeners || {};
                var i = this;

                function n() {
                    t.apply(i.offPixi(e, n), arguments)
                }

                return n._originalHandler = t, this.onPixi(e, n)
            }, t.offPixi = t.removeEventListener = function (e, t) {
                if (this._listeners = this._listeners || {}, !this._listeners[e]) return this;
                for (var i = this._listeners[e], n = t ? i.length : 0; n-- > 0;) i[n] !== t && i[n]._originalHandler !== t || i.splice(n, 1);
                return 0 === i.length && delete this._listeners[e], this
            }, t.removeAllListeners = function (e) {
                return this._listeners = this._listeners || {}, this._listeners[e] ? (delete this._listeners[e], this) : this
            }
        }
    },e.Event = function (e, t, i) {
        this.__isEventObject = !0, this.stopped = !1, this.stoppedImmediate = !1, this.target = e, this.type = t, this.data = i, this.content = i, this.timeStamp = Date.now()
    },e.Event.prototype.stopPropagation = function () {
        this.stopped = !0
    },e.Event.prototype.stopImmediatePropagation = function () {
        this.stoppedImmediate = !0
    },e.autoDetectRenderer = function (t, i, n) {
        return t || (t = 800), i || (i = 600), function () {
            try {
                var e = n.view || document.createElement("canvas"), t = {
                    alpha: n.transparent,
                    antialias: n.antialias,
                    premultipliedAlpha: n.transparent && "notMultiplied" !== n.transparent,
                    stencil: !0,
                    preserveDrawingBuffer: n.preserveDrawingBuffer
                };
                return !!window.WebGLRenderingContext && e.getContext("webgl", t)
            } catch (e) {
                return console.warn("Failed to create WebGL renderer", e), !1
            }
        }() ? new e.WebGLRenderer(t, i, n) : (ga("send", "event", "WebGL", "Failed to create WebGL Context"), new e.CanvasRenderer(t, i, n))
    },e.initDefaultShaders = function () {
    },e.CompileVertexShader = function (t, i) {
        return e._CompileShader(t, i, t.VERTEX_SHADER)
    },e.CompileFragmentShader = function (t, i) {
        return e._CompileShader(t, i, t.FRAGMENT_SHADER)
    },e._CompileShader = function (e, t, i) {
        var n = t.join("\n"), r = e.createShader(i);
        return e.shaderSource(r, n), e.compileShader(r), e.getShaderParameter(r, e.COMPILE_STATUS) ? r : (window.console.log(e.getShaderInfoLog(r)), null)
    },e.compileProgram = function (t, i, n) {
        var r = e.CompileFragmentShader(t, n), o = e.CompileVertexShader(t, i), a = t.createProgram();
        return t.attachShader(a, o), t.attachShader(a, r), t.linkProgram(a), t.getProgramParameter(a, t.LINK_STATUS) || window.console.log("Could not initialise shaders"), a
    },e.PixiShader = function (t) {
        this._UID = e._UID++, this.gl = t, this.program = null, this.fragmentSrc = ["precision lowp float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;", "}"], this.textureCount = 0, this.firstRun = !0, this.dirty = !0, this.attributes = [], this.init()
    },e.PixiShader.prototype.constructor = e.PixiShader,e.PixiShader.prototype.init = function () {
        var t = this.gl, i = e.compileProgram(t, this.vertexSrc || e.PixiShader.defaultVertexSrc, this.fragmentSrc);
        for (var n in t.useProgram(i), this.uSampler = t.getUniformLocation(i, "uSampler"), this.projectionVector = t.getUniformLocation(i, "projectionVector"), this.offsetVector = t.getUniformLocation(i, "offsetVector"), this.dimensions = t.getUniformLocation(i, "dimensions"), this.aVertexPosition = t.getAttribLocation(i, "aVertexPosition"), this.aTextureCoord = t.getAttribLocation(i, "aTextureCoord"), this.colorAttribute = t.getAttribLocation(i, "aColor"), -1 === this.colorAttribute && (this.colorAttribute = 2), this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute], this.uniforms) this.uniforms[n].uniformLocation = t.getUniformLocation(i, n);
        this.initUniforms(), this.program = i
    },e.PixiShader.prototype.initUniforms = function () {
        this.textureCount = 1;
        var e, t = this.gl;
        for (var i in this.uniforms) {
            var n = (e = this.uniforms[i]).type;
            "sampler2D" === n ? (e._init = !1, null !== e.value && this.initSampler2D(e)) : "mat2" === n || "mat3" === n || "mat4" === n ? (e.glMatrix = !0, e.glValueLength = 1, "mat2" === n ? e.glFunc = t.uniformMatrix2fv : "mat3" === n ? e.glFunc = t.uniformMatrix3fv : "mat4" === n && (e.glFunc = t.uniformMatrix4fv)) : (e.glFunc = t["uniform" + n], e.glValueLength = "2f" === n || "2i" === n ? 2 : "3f" === n || "3i" === n ? 3 : "4f" === n || "4i" === n ? 4 : 1)
        }
    },e.PixiShader.prototype.initSampler2D = function (e) {
        if (e.value && e.value.baseTexture && e.value.baseTexture.hasLoaded) {
            var t = this.gl;
            if (t.activeTexture(t["TEXTURE" + this.textureCount]), t.bindTexture(t.TEXTURE_2D, e.value.baseTexture._glTextures[t.id]), e.textureData) {
                var i = e.textureData, n = i.magFilter ? i.magFilter : t.LINEAR,
                    r = i.minFilter ? i.minFilter : t.LINEAR, o = i.wrapS ? i.wrapS : t.CLAMP_TO_EDGE,
                    a = i.wrapT ? i.wrapT : t.CLAMP_TO_EDGE, s = i.luminance ? t.LUMINANCE : t.RGBA;
                if (i.repeat && (o = t.REPEAT, a = t.REPEAT), t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !!i.flipY), i.width) {
                    var l = i.width ? i.width : 512, c = i.height ? i.height : 2, d = i.border ? i.border : 0;
                    t.texImage2D(t.TEXTURE_2D, 0, s, l, c, d, s, t.UNSIGNED_BYTE, null)
                } else t.texImage2D(t.TEXTURE_2D, 0, s, t.RGBA, t.UNSIGNED_BYTE, e.value.baseTexture.source);
                t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, n), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, r), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, o), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, a)
            }
            t.uniform1i(e.uniformLocation, this.textureCount), e._init = !0, this.textureCount++
        }
    },e.PixiShader.prototype.syncUniforms = function () {
        var t;
        this.textureCount = 1;
        var i = this.gl;
        for (var n in this.uniforms) 1 === (t = this.uniforms[n]).glValueLength ? !0 === t.glMatrix ? t.glFunc.call(i, t.uniformLocation, t.transpose, t.value) : t.glFunc.call(i, t.uniformLocation, t.value) : 2 === t.glValueLength ? t.glFunc.call(i, t.uniformLocation, t.value.x, t.value.y) : 3 === t.glValueLength ? t.glFunc.call(i, t.uniformLocation, t.value.x, t.value.y, t.value.z) : 4 === t.glValueLength ? t.glFunc.call(i, t.uniformLocation, t.value.x, t.value.y, t.value.z, t.value.w) : "sampler2D" === t.type && (t._init ? (i.activeTexture(i["TEXTURE" + this.textureCount]), t.value.baseTexture._dirty[i.id] ? e.instances[i.id].updateTexture(t.value.baseTexture) : i.bindTexture(i.TEXTURE_2D, t.value.baseTexture._glTextures[i.id]), i.uniform1i(t.uniformLocation, this.textureCount), this.textureCount++) : this.initSampler2D(t))
    },e.PixiShader.prototype.destroy = function () {
        this.gl.deleteProgram(this.program), this.uniforms = null, this.gl = null, this.attributes = null
    },e.PixiShader.defaultVertexSrc = ["attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "attribute vec4 aColor;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "const vec2 center = vec2(-1.0, 1.0);", "void main(void) {", "   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);", "   vTextureCoord = aTextureCoord;", "   vColor = vec4(aColor.rgb * aColor.a, aColor.a);", "}"],e.PixiFastShader = function (t) {
        this._UID = e._UID++, this.gl = t, this.program = null, this.fragmentSrc = ["precision lowp float;", "varying vec2 vTextureCoord;", "varying float vColor;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;", "}"], this.vertexSrc = ["attribute vec2 aVertexPosition;", "attribute vec2 aPositionCoord;", "attribute vec2 aScale;", "attribute float aRotation;", "attribute vec2 aTextureCoord;", "attribute float aColor;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "uniform mat3 uMatrix;", "varying vec2 vTextureCoord;", "varying float vColor;", "const vec2 center = vec2(-1.0, 1.0);", "void main(void) {", "   vec2 v;", "   vec2 sv = aVertexPosition * aScale;", "   v.x = (sv.x) * cos(aRotation) - (sv.y) * sin(aRotation);", "   v.y = (sv.x) * sin(aRotation) + (sv.y) * cos(aRotation);", "   v = ( uMatrix * vec3(v + aPositionCoord , 1.0) ).xy ;", "   gl_Position = vec4( ( v / projectionVector) + center , 0.0, 1.0);", "   vTextureCoord = aTextureCoord;", "   vColor = aColor;", "}"], this.textureCount = 0, this.init()
    },e.PixiFastShader.prototype.constructor = e.PixiFastShader,e.PixiFastShader.prototype.init = function () {
        var t = this.gl, i = e.compileProgram(t, this.vertexSrc, this.fragmentSrc);
        t.useProgram(i), this.uSampler = t.getUniformLocation(i, "uSampler"), this.projectionVector = t.getUniformLocation(i, "projectionVector"), this.offsetVector = t.getUniformLocation(i, "offsetVector"), this.dimensions = t.getUniformLocation(i, "dimensions"), this.uMatrix = t.getUniformLocation(i, "uMatrix"), this.aVertexPosition = t.getAttribLocation(i, "aVertexPosition"), this.aPositionCoord = t.getAttribLocation(i, "aPositionCoord"), this.aScale = t.getAttribLocation(i, "aScale"), this.aRotation = t.getAttribLocation(i, "aRotation"), this.aTextureCoord = t.getAttribLocation(i, "aTextureCoord"), this.colorAttribute = t.getAttribLocation(i, "aColor"), -1 === this.colorAttribute && (this.colorAttribute = 2), this.attributes = [this.aVertexPosition, this.aPositionCoord, this.aScale, this.aRotation, this.aTextureCoord, this.colorAttribute], this.program = i
    },e.PixiFastShader.prototype.destroy = function () {
        this.gl.deleteProgram(this.program), this.uniforms = null, this.gl = null, this.attributes = null
    },e.PrimitiveShader = function (t) {
        this._UID = e._UID++, this.gl = t, this.program = null, this.fragmentSrc = ["precision mediump float;", "varying vec4 vColor;", "void main(void) {", "   gl_FragColor = vColor;", "}"], this.vertexSrc = ["attribute vec2 aVertexPosition;", "attribute vec4 aColor;", "uniform mat3 translationMatrix;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "uniform float alpha;", "uniform float flipY;", "uniform vec3 tint;", "varying vec4 vColor;", "void main(void) {", "   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);", "   v -= offsetVector.xyx;", "   gl_Position = vec4( v.x / projectionVector.x -1.0, (v.y / projectionVector.y * -flipY) + flipY , 0.0, 1.0);", "   vColor = aColor * vec4(tint * alpha, alpha);", "}"], this.init()
    },e.PrimitiveShader.prototype.constructor = e.PrimitiveShader,e.PrimitiveShader.prototype.init = function () {
        var t = this.gl, i = e.compileProgram(t, this.vertexSrc, this.fragmentSrc);
        t.useProgram(i), this.projectionVector = t.getUniformLocation(i, "projectionVector"), this.offsetVector = t.getUniformLocation(i, "offsetVector"), this.tintColor = t.getUniformLocation(i, "tint"), this.flipY = t.getUniformLocation(i, "flipY"), this.aVertexPosition = t.getAttribLocation(i, "aVertexPosition"), this.colorAttribute = t.getAttribLocation(i, "aColor"), this.attributes = [this.aVertexPosition, this.colorAttribute], this.translationMatrix = t.getUniformLocation(i, "translationMatrix"), this.alpha = t.getUniformLocation(i, "alpha"), this.program = i
    },e.PrimitiveShader.prototype.destroy = function () {
        this.gl.deleteProgram(this.program), this.uniforms = null, this.gl = null, this.attributes = null
    },e.ComplexPrimitiveShader = function (t) {
        this._UID = e._UID++, this.gl = t, this.program = null, this.fragmentSrc = ["precision mediump float;", "varying vec4 vColor;", "void main(void) {", "   gl_FragColor = vColor;", "}"], this.vertexSrc = ["attribute vec2 aVertexPosition;", "uniform mat3 translationMatrix;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "uniform vec3 tint;", "uniform float alpha;", "uniform vec3 color;", "uniform float flipY;", "varying vec4 vColor;", "void main(void) {", "   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);", "   v -= offsetVector.xyx;", "   gl_Position = vec4( v.x / projectionVector.x -1.0, (v.y / projectionVector.y * -flipY) + flipY , 0.0, 1.0);", "   vColor = vec4(color * alpha * tint, alpha);", "}"], this.init()
    },e.ComplexPrimitiveShader.prototype.constructor = e.ComplexPrimitiveShader,e.ComplexPrimitiveShader.prototype.init = function () {
        var t = this.gl, i = e.compileProgram(t, this.vertexSrc, this.fragmentSrc);
        t.useProgram(i), this.projectionVector = t.getUniformLocation(i, "projectionVector"), this.offsetVector = t.getUniformLocation(i, "offsetVector"), this.tintColor = t.getUniformLocation(i, "tint"), this.color = t.getUniformLocation(i, "color"), this.flipY = t.getUniformLocation(i, "flipY"), this.aVertexPosition = t.getAttribLocation(i, "aVertexPosition"), this.attributes = [this.aVertexPosition, this.colorAttribute], this.translationMatrix = t.getUniformLocation(i, "translationMatrix"), this.alpha = t.getUniformLocation(i, "alpha"), this.program = i
    },e.ComplexPrimitiveShader.prototype.destroy = function () {
        this.gl.deleteProgram(this.program), this.uniforms = null, this.gl = null, this.attribute = null
    },e.WebGLGraphics = function () {
    },e.WebGLGraphics.renderGraphics = function (t, i) {
        var n, r = i.gl, o = i.projection, a = i.offset, s = i.shaderManager.primitiveShader;
        t.dirty && e.WebGLGraphics.updateGraphics(t, r);
        var l = t._webGL[r.id];
        if (l && l.data) for (var c = 0; c < l.data.length; c++) 1 === l.data[c].mode ? (n = l.data[c], i.stencilManager.pushStencil(t, n, i), r.drawElements(r.TRIANGLE_FAN, 4, r.UNSIGNED_SHORT, 2 * (n.indices.length - 4)), i.stencilManager.popStencil(t, n, i)) : (n = l.data[c], i.shaderManager.setShader(s), s = i.shaderManager.primitiveShader, r.uniformMatrix3fv(s.translationMatrix, !1, t.worldTransform.toArray(!0)), r.uniform1f(s.flipY, 1), r.uniform2f(s.projectionVector, o.x, -o.y), r.uniform2f(s.offsetVector, -a.x, -a.y), r.uniform3fv(s.tintColor, e.hex2rgb(t.tint)), r.uniform1f(s.alpha, t.worldAlpha), r.bindBuffer(r.ARRAY_BUFFER, n.buffer), r.vertexAttribPointer(s.aVertexPosition, 2, r.FLOAT, !1, 24, 0), r.vertexAttribPointer(s.colorAttribute, 4, r.FLOAT, !1, 24, 8), r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, n.indexBuffer), r.drawElements(r.TRIANGLE_STRIP, n.indices.length, r.UNSIGNED_SHORT, 0))
    },e.WebGLGraphics.updateGraphics = function (t, i) {
        var n, r, o = t._webGL[i.id];
        if (o || (o = t._webGL[i.id] = {lastIndex: 0, data: [], gl: i}), t.dirty = !1, t.clearDirty) {
            for (t.clearDirty = !1, n = 0; n < o.data.length; n++) {
                var a = o.data[n];
                a.reset(), e.WebGLGraphics.graphicsDataPool.push(a)
            }
            o.data = [], o.lastIndex = 0
        }
        for (n = o.lastIndex; n < t.graphicsData.length; n++) {
            var s = t.graphicsData[n];
            s.type === e.Graphics.POLY ? (s.points = s.shape.points.slice(), s.shape.closed && (s.points[0] === s.points[s.points.length - 2] && s.points[1] === s.points[s.points.length - 1] || s.points.push(s.points[0], s.points[1])), s.fill && s.points.length >= 6 && (s.points.length < 12 ? (r = e.WebGLGraphics.switchMode(o, 0), e.WebGLGraphics.buildPoly(s, r) || (r = e.WebGLGraphics.switchMode(o, 1), e.WebGLGraphics.buildComplexPoly(s, r))) : (r = e.WebGLGraphics.switchMode(o, 1), e.WebGLGraphics.buildComplexPoly(s, r))), s.lineWidth > 0 && (r = e.WebGLGraphics.switchMode(o, 0), e.WebGLGraphics.buildLine(s, r))) : (r = e.WebGLGraphics.switchMode(o, 0), s.type === e.Graphics.RECT ? e.WebGLGraphics.buildRectangle(s, r) : s.type === e.Graphics.CIRC || s.type === e.Graphics.ELIP ? e.WebGLGraphics.buildCircle(s, r) : s.type === e.Graphics.RREC && e.WebGLGraphics.buildRoundedRectangle(s, r)), o.lastIndex++
        }
        for (n = 0; n < o.data.length; n++) (r = o.data[n]).dirty && r.upload()
    },e.WebGLGraphics.switchMode = function (t, i) {
        var n;
        return t.data.length && (n = t.data[t.data.length - 1]).mode === i && 1 !== i || ((n = e.WebGLGraphics.graphicsDataPool.pop() || new e.WebGLGraphicsData(t.gl)).mode = i, t.data.push(n)), n.dirty = !0, n
    },e.WebGLGraphics.buildRectangle = function (t, i) {
        var n = t.shape, r = n.x, o = n.y, a = n.width, s = n.height;
        if (t.fill) {
            var l = e.hex2rgb(t.fillColor), c = t.fillAlpha, d = l[0] * c, h = l[1] * c, u = l[2] * c, f = i.points,
                g = i.indices, p = f.length / 6;
            f.push(r, o), f.push(d, h, u, c), f.push(r + a, o), f.push(d, h, u, c), f.push(r, o + s), f.push(d, h, u, c), f.push(r + a, o + s), f.push(d, h, u, c), g.push(p, p, p + 1, p + 2, p + 3, p + 3)
        }
        if (t.lineWidth) {
            var m = t.points;
            t.points = [r, o, r + a, o, r + a, o + s, r, o + s, r, o], e.WebGLGraphics.buildLine(t, i), t.points = m
        }
    },e.WebGLGraphics.buildRoundedRectangle = function (t, i) {
        var n = t.shape, r = n.x, o = n.y, a = n.width, s = n.height, l = n.radius, c = [];
        if (c.push(r, o + l), c = (c = (c = (c = c.concat(e.WebGLGraphics.quadraticBezierCurve(r, o + s - l, r, o + s, r + l, o + s))).concat(e.WebGLGraphics.quadraticBezierCurve(r + a - l, o + s, r + a, o + s, r + a, o + s - l))).concat(e.WebGLGraphics.quadraticBezierCurve(r + a, o + l, r + a, o, r + a - l, o))).concat(e.WebGLGraphics.quadraticBezierCurve(r + l, o, r, o, r, o + l)), t.fill) {
            var d = e.hex2rgb(t.fillColor), h = t.fillAlpha, u = d[0] * h, f = d[1] * h, g = d[2] * h, p = i.points,
                m = i.indices, v = p.length / 6, w = e.PolyK.Triangulate(c);
            if (!w) return t.shape.height++, void e.WebGLGraphics.buildRoundedRectangle(t, i);
            var b = 0;
            for (b = 0; b < w.length; b += 3) m.push(w[b] + v), m.push(w[b] + v), m.push(w[b + 1] + v), m.push(w[b + 2] + v), m.push(w[b + 2] + v);
            for (b = 0; b < c.length; b++) p.push(c[b], c[++b], u, f, g, h)
        }
        if (t.lineWidth) {
            var y = t.points;
            t.points = c, e.WebGLGraphics.buildLine(t, i), t.points = y
        }
    },e.WebGLGraphics.quadraticBezierCurve = function (e, t, i, n, r, o) {
        var a, s, l, c, d, h, u = [];

        function f(e, t, i) {
            return e + (t - e) * i
        }

        for (var g = 0, p = 0; p <= 20; p++) a = f(e, i, g = p / 20), s = f(t, n, g), l = f(i, r, g), c = f(n, o, g), d = f(a, l, g), h = f(s, c, g), u.push(d, h);
        return u
    },e.WebGLGraphics.buildCircle = function (t, i) {
        var n, r, o = t.shape, a = o.x, s = o.y;
        t.type === e.Graphics.CIRC ? (n = o.radius, r = o.radius) : (n = o.width, r = o.height);
        var l = 2 * Math.PI / 40, c = 0;
        if (t.fill) {
            var d = e.hex2rgb(t.fillColor), h = t.fillAlpha, u = d[0] * h, f = d[1] * h, g = d[2] * h, p = i.points,
                m = i.indices, v = p.length / 6;
            for (m.push(v), c = 0; c < 41; c++) p.push(a, s, u, f, g, h), p.push(a + Math.sin(l * c) * n, s + Math.cos(l * c) * r, u, f, g, h), m.push(v++, v++);
            m.push(v - 1)
        }
        if (t.lineWidth) {
            var w = t.points;
            for (t.points = [], c = 0; c < 41; c++) t.points.push(a + Math.sin(l * c) * n, s + Math.cos(l * c) * r);
            e.WebGLGraphics.buildLine(t, i), t.points = w
        }
    },e.WebGLGraphics.buildLine = function (t, i) {
        var n = 0, r = t.points;
        if (0 !== r.length) {
            if (t.lineWidth % 2) for (n = 0; n < r.length; n++) r[n] += .5;
            var o = new e.Point(r[0], r[1]), a = new e.Point(r[r.length - 2], r[r.length - 1]);
            if (o.x === a.x && o.y === a.y) {
                (r = r.slice()).pop(), r.pop();
                var s = (a = new e.Point(r[r.length - 2], r[r.length - 1])).x + .5 * (o.x - a.x),
                    l = a.y + .5 * (o.y - a.y);
                r.unshift(s, l), r.push(s, l)
            }
            var c, d, h, u, f, g, p, m, v, w, b, y, S, x, C, T, _, k, M, R, E, A, B = i.points, L = i.indices,
                G = r.length / 2, P = r.length, I = B.length / 6, O = t.lineWidth / 2, X = e.hex2rgb(t.lineColor),
                F = t.lineAlpha, D = X[0] * F, U = X[1] * F, H = X[2] * F;
            for (h = r[0], u = r[1], f = r[2], v = -(u - (g = r[3])), w = h - f, v /= A = Math.sqrt(v * v + w * w), w /= A, v *= O, w *= O, B.push(h - v, u - w, D, U, H, F), B.push(h + v, u + w, D, U, H, F), n = 1; n < G - 1; n++) h = r[2 * (n - 1)], u = r[2 * (n - 1) + 1], f = r[2 * n], g = r[2 * n + 1], p = r[2 * (n + 1)], m = r[2 * (n + 1) + 1], v = -(u - g), w = h - f, v /= A = Math.sqrt(v * v + w * w), w /= A, v *= O, w *= O, b = -(g - m), y = f - p, b /= A = Math.sqrt(b * b + y * y), y /= A, _ = (-v + h) * (-w + g) - (-v + f) * (-w + u), R = (-(b *= O) + p) * (-(y *= O) + g) - (-b + f) * (-y + m), E = (C = -w + u - (-w + g)) * (M = -b + f - (-b + p)) - (k = -y + m - (-y + g)) * (T = -v + f - (-v + h)), Math.abs(E) < .1 ? (E += 10.1, B.push(f - v, g - w, D, U, H, F), B.push(f + v, g + w, D, U, H, F)) : ((c = (T * R - M * _) / E) - f) * (c - f) + ((d = (k * _ - C * R) / E) - g) + (d - g) > 19600 ? (S = v - b, x = w - y, S /= A = Math.sqrt(S * S + x * x), x /= A, S *= O, x *= O, B.push(f - S, g - x), B.push(D, U, H, F), B.push(f + S, g + x), B.push(D, U, H, F), B.push(f - S, g - x), B.push(D, U, H, F), P++) : (B.push(c, d), B.push(D, U, H, F), B.push(f - (c - f), g - (d - g)), B.push(D, U, H, F));
            for (h = r[2 * (G - 2)], u = r[2 * (G - 2) + 1], f = r[2 * (G - 1)], v = -(u - (g = r[2 * (G - 1) + 1])), w = h - f, v /= A = Math.sqrt(v * v + w * w), w /= A, v *= O, w *= O, B.push(f - v, g - w), B.push(D, U, H, F), B.push(f + v, g + w), B.push(D, U, H, F), L.push(I), n = 0; n < P; n++) L.push(I++);
            L.push(I - 1)
        }
    },e.WebGLGraphics.buildComplexPoly = function (t, i) {
        var n = t.points.slice();
        if (!(n.length < 6)) {
            var r = i.indices;
            i.points = n, i.alpha = t.fillAlpha, i.color = e.hex2rgb(t.fillColor);
            for (var o, a, s = 1 / 0, l = -1 / 0, c = 1 / 0, d = -1 / 0, h = 0; h < n.length; h += 2) s = (o = n[h]) < s ? o : s, l = o > l ? o : l, c = (a = n[h + 1]) < c ? a : c, d = a > d ? a : d;
            n.push(s, c, l, c, l, d, s, d);
            var u = n.length / 2;
            for (h = 0; h < u; h++) r.push(h)
        }
    },e.WebGLGraphics.buildPoly = function (t, i) {
        var n = t.points;
        if (!(n.length < 6)) {
            var r = i.points, o = i.indices, a = n.length / 2, s = e.hex2rgb(t.fillColor), l = t.fillAlpha,
                c = s[0] * l, d = s[1] * l, h = s[2] * l, u = e.PolyK.Triangulate(n);
            if (!u) return !1;
            var f = r.length / 6, g = 0;
            for (g = 0; g < u.length; g += 3) o.push(u[g] + f), o.push(u[g] + f), o.push(u[g + 1] + f), o.push(u[g + 2] + f), o.push(u[g + 2] + f);
            for (g = 0; g < a; g++) r.push(n[2 * g], n[2 * g + 1], c, d, h, l);
            return !0
        }
    },e.WebGLGraphics.graphicsDataPool = [],e.WebGLGraphicsData = function (e) {
        this.gl = e, this.color = [0, 0, 0], this.points = [], this.indices = [], this.buffer = e.createBuffer(), this.indexBuffer = e.createBuffer(), this.mode = 1, this.alpha = 1, this.dirty = !0
    },e.WebGLGraphicsData.prototype.reset = function () {
        this.points = [], this.indices = []
    },e.WebGLGraphicsData.prototype.upload = function () {
        var t = this.gl;
        this.glPoints = new e.Float32Array(this.points), t.bindBuffer(t.ARRAY_BUFFER, this.buffer), t.bufferData(t.ARRAY_BUFFER, this.glPoints, t.STATIC_DRAW), this.glIndicies = new e.Uint16Array(this.indices), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, this.indexBuffer), t.bufferData(t.ELEMENT_ARRAY_BUFFER, this.glIndicies, t.STATIC_DRAW), this.dirty = !1
    },e.glContexts = [],e.instances = [],e.WebGLRenderer = function (t, i, n) {
        if (n) for (var r in e.defaultRenderOptions) void 0 === n[r] && (n[r] = e.defaultRenderOptions[r]); else n = e.defaultRenderOptions;
        e.defaultRenderer || (e.defaultRenderer = this), this.type = e.WEBGL_RENDERER, this.transparent = n.transparent, this.autoResize = n.autoResize || !1, this.preserveDrawingBuffer = n.preserveDrawingBuffer, this.clearBeforeRender = n.clearBeforeRender, this.width = t || 800, this.height = i || 600, this.view = n.view || document.createElement("canvas"), this.contextLostBound = this.handleContextLost.bind(this), this.contextRestoredBound = this.handleContextRestored.bind(this), this.view.addEventListener("webglcontextlost", this.contextLostBound, !1), this.view.addEventListener("webglcontextrestored", this.contextRestoredBound, !1), this._contextOptions = {
            alpha: this.transparent,
            antialias: n.antialias,
            premultipliedAlpha: this.transparent && "notMultiplied" !== this.transparent,
            stencil: !0,
            preserveDrawingBuffer: n.preserveDrawingBuffer
        }, this.projection = new e.Point, this.offset = new e.Point(0, 0), this.shaderManager = new e.WebGLShaderManager, this.spriteBatch = new e.WebGLSpriteBatch, this.maskManager = new e.WebGLMaskManager, this.filterManager = new e.WebGLFilterManager, this.stencilManager = new e.WebGLStencilManager, this.blendModeManager = new e.WebGLBlendModeManager, this.renderSession = {}, this.renderSession.gl = this.gl, this.renderSession.drawCount = 0, this.renderSession.shaderManager = this.shaderManager, this.renderSession.maskManager = this.maskManager, this.renderSession.filterManager = this.filterManager, this.renderSession.blendModeManager = this.blendModeManager, this.renderSession.spriteBatch = this.spriteBatch, this.renderSession.stencilManager = this.stencilManager, this.renderSession.renderer = this, this.initContext(), this.mapBlendModes()
    },e.WebGLRenderer.prototype.constructor = e.WebGLRenderer,e.WebGLRenderer.prototype.initContext = function () {
        var t = this.view.getContext("webgl", this._contextOptions);
        if (this.gl = t, !t) throw new Error("This browser does not support webGL. Try using the canvas renderer");
        this.glContextId = t.id = e.WebGLRenderer.glContextId++, e.glContexts[this.glContextId] = t, e.instances[this.glContextId] = this, t.disable(t.DEPTH_TEST), t.disable(t.CULL_FACE), t.enable(t.BLEND), this.shaderManager.setContext(t), this.spriteBatch.setContext(t), this.maskManager.setContext(t), this.filterManager.setContext(t), this.blendModeManager.setContext(t), this.stencilManager.setContext(t), this.renderSession.gl = this.gl, this.resize(this.width, this.height)
    },e.WebGLRenderer.prototype.render = function (e) {
        if (!this.contextLost) {
            this.__stage !== e && (e.interactive && e.interactionManager.removeEvents(), this.__stage = e), e.updateTransform();
            var t = this.gl;
            e._interactiveEventsAdded || (e._interactiveEventsAdded = !0, e.interactionManager.setTarget(this)), t.viewport(0, 0, this.width, this.height), t.bindFramebuffer(t.FRAMEBUFFER, null), t.clearColor(e.backgroundColorSplit[0], e.backgroundColorSplit[1], e.backgroundColorSplit[2], 1), t.clear(t.COLOR_BUFFER_BIT), this.renderDisplayObject(e, this.projection)
        }
    },e.WebGLRenderer.prototype.renderDisplayObject = function (t, i, n) {
        this.renderSession.blendModeManager.setBlendMode(e.blendModes.NORMAL), this.renderSession.drawCount = 0, this.renderSession.flipY = n ? -1 : 1, this.renderSession.projection = i, this.renderSession.offset = this.offset, this.spriteBatch.begin(this.renderSession), this.filterManager.begin(this.renderSession, n), t._renderWebGL(this.renderSession), this.spriteBatch.end()
    },e.WebGLRenderer.prototype.resize = function (e, t) {
        this.width = e, this.height = t, this.view.width = this.width, this.view.height = this.height, this.gl.viewport(0, 0, this.width, this.height), this.projection.x = this.width / 2, this.projection.y = -this.height / 2
    },e.WebGLRenderer.prototype.updateTexture = function (t) {
        if (t.hasLoaded && t.source && t.source.width && t.source.height) {
            var i = this.gl;
            try {
                void 0 !== this._lastSize && (e.frvrTextureMemoryUsage -= 4 * t._lastSize.w * t._lastSize.h)
            } catch (e) {
            }
            t._glTextures[i.id] || (t._glTextures[i.id] = i.createTexture()), i.bindTexture(i.TEXTURE_2D, t._glTextures[i.id]), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, t.premultipliedAlpha), i.texImage2D(i.TEXTURE_2D, 0, i.RGBA, i.RGBA, i.UNSIGNED_BYTE, t.source);
            try {
                e.frvrTextureMemoryUsage += 4 * t.source.width * t.source.height, t._lastSize = {
                    w: t.source.width,
                    h: t.source.height
                }
            } catch (e) {
            }
            return i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MAG_FILTER, t.scaleMode === e.scaleModes.LINEAR ? i.LINEAR : i.NEAREST), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, t.scaleMode === e.scaleModes.LINEAR ? i.LINEAR : i.NEAREST), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_S, i.CLAMP_TO_EDGE), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_T, i.CLAMP_TO_EDGE), t._dirty[i.id] = !1, t._glTextures[i.id]
        }
    },e.WebGLRenderer.prototype.handleContextLost = function (e) {
        (void 0 === e.cancelable || e.cancelable) && e.preventDefault(), this.contextLost = !0
    },e.WebGLRenderer.prototype.handleContextRestored = function () {
        for (var t in this.initContext(), e.TextureCache) e.TextureCache[t].baseTexture._glTextures = [];
        this.contextLost = !1
    },e.WebGLRenderer.prototype.destroy = function () {
        this.view.removeEventListener("webglcontextlost", this.contextLostBound), this.view.removeEventListener("webglcontextrestored", this.contextRestoredBound), e.glContexts[this.glContextId] = null, this.projection = null, this.offset = null, this.shaderManager.destroy(), this.spriteBatch.destroy(), this.maskManager.destroy(), this.filterManager.destroy(), this.shaderManager = null, this.spriteBatch = null, this.maskManager = null, this.filterManager = null, this.gl = null, this.renderSession = null
    },e.WebGLRenderer.prototype.mapBlendModes = function () {
        var t = this.gl;
        e.blendModesWebGL || (e.blendModesWebGL = [], e.blendModesWebGL[e.blendModes.NORMAL] = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e.blendModesWebGL[e.blendModes.ADD] = [t.SRC_ALPHA, t.ONE], e.blendModesWebGL[e.blendModes.MULTIPLY] = [t.DST_COLOR, t.ONE_MINUS_SRC_ALPHA], e.blendModesWebGL[e.blendModes.SCREEN] = [t.SRC_ALPHA, t.ONE])
    },e.WebGLRenderer.glContextId = 0,e.WebGLBlendModeManager = function () {
        this.currentBlendMode = 99999
    },e.WebGLBlendModeManager.prototype.constructor = e.WebGLBlendModeManager,e.WebGLBlendModeManager.prototype.setContext = function (e) {
        this.gl = e
    },e.WebGLBlendModeManager.prototype.setBlendMode = function (t) {
        if (this.currentBlendMode === t) return !1;
        this.currentBlendMode = t;
        var i = e.blendModesWebGL[this.currentBlendMode];
        return this.gl.blendFunc(i[0], i[1]), !0
    },e.WebGLBlendModeManager.prototype.destroy = function () {
        this.gl = null
    },e.WebGLMaskManager = function () {
    },e.WebGLMaskManager.prototype.constructor = e.WebGLMaskManager,e.WebGLMaskManager.prototype.setContext = function (e) {
        this.gl = e
    },e.WebGLMaskManager.prototype.pushMask = function (t, i) {
        var n = i.gl;
        t.dirty && e.WebGLGraphics.updateGraphics(t, n), t._webGL[n.id].data.length && i.stencilManager.pushStencil(t, t._webGL[n.id].data[0], i)
    },e.WebGLMaskManager.prototype.popMask = function (e, t) {
        var i = this.gl;
        t.stencilManager.popStencil(e, e._webGL[i.id].data[0], t)
    },e.WebGLMaskManager.prototype.destroy = function () {
        this.gl = null
    },e.WebGLStencilManager = function () {
        this.stencilStack = [], this.reverse = !0, this.count = 0
    },e.WebGLStencilManager.prototype.setContext = function (e) {
        this.gl = e
    },e.WebGLStencilManager.prototype.pushStencil = function (e, t, i) {
        var n = this.gl;
        this.bindGraphics(e, t, i), 0 === this.stencilStack.length && (n.enable(n.STENCIL_TEST), n.clear(n.STENCIL_BUFFER_BIT), this.reverse = !0, this.count = 0), this.stencilStack.push(t);
        var r = this.count;
        n.colorMask(!1, !1, !1, !1), n.stencilFunc(n.ALWAYS, 0, 255), n.stencilOp(n.KEEP, n.KEEP, n.INVERT), 1 === t.mode ? (n.drawElements(n.TRIANGLE_FAN, t.indices.length - 4, n.UNSIGNED_SHORT, 0), this.reverse ? (n.stencilFunc(n.EQUAL, 255 - r, 255), n.stencilOp(n.KEEP, n.KEEP, n.DECR)) : (n.stencilFunc(n.EQUAL, r, 255), n.stencilOp(n.KEEP, n.KEEP, n.INCR)), n.drawElements(n.TRIANGLE_FAN, 4, n.UNSIGNED_SHORT, 2 * (t.indices.length - 4)), this.reverse ? n.stencilFunc(n.EQUAL, 255 - (r + 1), 255) : n.stencilFunc(n.EQUAL, r + 1, 255), this.reverse = !this.reverse) : (this.reverse ? (n.stencilFunc(n.EQUAL, r, 255), n.stencilOp(n.KEEP, n.KEEP, n.INCR)) : (n.stencilFunc(n.EQUAL, 255 - r, 255), n.stencilOp(n.KEEP, n.KEEP, n.DECR)), n.drawElements(n.TRIANGLE_STRIP, t.indices.length, n.UNSIGNED_SHORT, 0), this.reverse ? n.stencilFunc(n.EQUAL, r + 1, 255) : n.stencilFunc(n.EQUAL, 255 - (r + 1), 255)), n.colorMask(!0, !0, !0, !0), n.stencilOp(n.KEEP, n.KEEP, n.KEEP), this.count++
    },e.WebGLStencilManager.prototype.bindGraphics = function (t, i, n) {
        this._currentGraphics = t;
        var r, o = this.gl, a = n.projection, s = n.offset;
        1 === i.mode ? (r = n.shaderManager.complexPrimitiveShader, n.shaderManager.setShader(r), o.uniform1f(r.flipY, n.flipY), o.uniformMatrix3fv(r.translationMatrix, !1, t.worldTransform.toArray(!0)), o.uniform2f(r.projectionVector, a.x, -a.y), o.uniform2f(r.offsetVector, -s.x, -s.y), o.uniform3fv(r.tintColor, e.hex2rgb(t.tint)), o.uniform3fv(r.color, i.color), o.uniform1f(r.alpha, t.worldAlpha * i.alpha), o.bindBuffer(o.ARRAY_BUFFER, i.buffer), o.vertexAttribPointer(r.aVertexPosition, 2, o.FLOAT, !1, 8, 0), o.bindBuffer(o.ELEMENT_ARRAY_BUFFER, i.indexBuffer)) : (r = n.shaderManager.primitiveShader, n.shaderManager.setShader(r), o.uniformMatrix3fv(r.translationMatrix, !1, t.worldTransform.toArray(!0)), o.uniform1f(r.flipY, n.flipY), o.uniform2f(r.projectionVector, a.x, -a.y), o.uniform2f(r.offsetVector, -s.x, -s.y), o.uniform3fv(r.tintColor, e.hex2rgb(t.tint)), o.uniform1f(r.alpha, t.worldAlpha), o.bindBuffer(o.ARRAY_BUFFER, i.buffer), o.vertexAttribPointer(r.aVertexPosition, 2, o.FLOAT, !1, 24, 0), o.vertexAttribPointer(r.colorAttribute, 4, o.FLOAT, !1, 24, 8), o.bindBuffer(o.ELEMENT_ARRAY_BUFFER, i.indexBuffer))
    },e.WebGLStencilManager.prototype.popStencil = function (e, t, i) {
        var n = this.gl;
        if (this.stencilStack.pop(), this.count--, 0 === this.stencilStack.length) n.disable(n.STENCIL_TEST); else {
            var r = this.count;
            this.bindGraphics(e, t, i), n.colorMask(!1, !1, !1, !1), 1 === t.mode ? (this.reverse = !this.reverse, this.reverse ? (n.stencilFunc(n.EQUAL, 255 - (r + 1), 255), n.stencilOp(n.KEEP, n.KEEP, n.INCR)) : (n.stencilFunc(n.EQUAL, r + 1, 255), n.stencilOp(n.KEEP, n.KEEP, n.DECR)), n.drawElements(n.TRIANGLE_FAN, 4, n.UNSIGNED_SHORT, 2 * (t.indices.length - 4)), n.stencilFunc(n.ALWAYS, 0, 255), n.stencilOp(n.KEEP, n.KEEP, n.INVERT), n.drawElements(n.TRIANGLE_FAN, t.indices.length - 4, n.UNSIGNED_SHORT, 0), this.reverse ? n.stencilFunc(n.EQUAL, r, 255) : n.stencilFunc(n.EQUAL, 255 - r, 255)) : (this.reverse ? (n.stencilFunc(n.EQUAL, r + 1, 255), n.stencilOp(n.KEEP, n.KEEP, n.DECR)) : (n.stencilFunc(n.EQUAL, 255 - (r + 1), 255), n.stencilOp(n.KEEP, n.KEEP, n.INCR)), n.drawElements(n.TRIANGLE_STRIP, t.indices.length, n.UNSIGNED_SHORT, 0), this.reverse ? n.stencilFunc(n.EQUAL, r, 255) : n.stencilFunc(n.EQUAL, 255 - r, 255)), n.colorMask(!0, !0, !0, !0), n.stencilOp(n.KEEP, n.KEEP, n.KEEP)
        }
    },e.WebGLStencilManager.prototype.destroy = function () {
        this.stencilStack = null, this.gl = null
    },e.WebGLShaderManager = function () {
        this.maxAttibs = 10, this.attribState = [], this.tempAttribState = [];
        for (var e = 0; e < this.maxAttibs; e++) this.attribState[e] = !1;
        this.stack = []
    },e.WebGLShaderManager.prototype.constructor = e.WebGLShaderManager,e.WebGLShaderManager.prototype.setContext = function (t) {
        this.gl = t, this.primitiveShader = new e.PrimitiveShader(t), this.complexPrimitiveShader = new e.ComplexPrimitiveShader(t), this.defaultShader = new e.PixiShader(t), this.fastShader = new e.PixiFastShader(t), this.setShader(this.defaultShader)
    },e.WebGLShaderManager.prototype.setAttribs = function (e) {
        var t;
        for (t = 0; t < this.tempAttribState.length; t++) this.tempAttribState[t] = !1;
        for (t = 0; t < e.length; t++) {
            var i = e[t];
            this.tempAttribState[i] = !0
        }
        var n = this.gl;
        for (t = 0; t < this.attribState.length; t++) this.attribState[t] !== this.tempAttribState[t] && (this.attribState[t] = this.tempAttribState[t], this.tempAttribState[t] ? n.enableVertexAttribArray(t) : n.disableVertexAttribArray(t))
    },e.WebGLShaderManager.prototype.setShader = function (e) {
        return this._currentId !== e._UID && (this._currentId = e._UID, this.currentShader = e, this.gl.useProgram(e.program), this.setAttribs(e.attributes), !0)
    },e.WebGLShaderManager.prototype.destroy = function () {
        this.attribState = null, this.tempAttribState = null, this.primitiveShader.destroy(), this.complexPrimitiveShader.destroy(), this.defaultShader.destroy(), this.fastShader.destroy(), this.gl = null
    },e.WebGLSpriteBatch = function () {
        this.vertSize = 5, this.size = 2e3;
        var t = 4 * this.size * 4 * this.vertSize, i = 6 * this.size;
        this.vertices = new e.ArrayBuffer(t), this.positions = new e.Float32Array(this.vertices), this.colors = new e.Uint32Array(this.vertices), this.indices = new e.Uint16Array(i), this.lastIndexCount = 0;
        for (var n = 0, r = 0; n < i; n += 6, r += 4) this.indices[n + 0] = r + 0, this.indices[n + 1] = r + 1, this.indices[n + 2] = r + 2, this.indices[n + 3] = r + 0, this.indices[n + 4] = r + 2, this.indices[n + 5] = r + 3;
        this.drawing = !1, this.currentBatchSize = 0, this.currentBaseTexture = null, this.dirty = !0, this.textures = [], this.blendModes = [], this.shaders = [], this.sprites = [], this.defaultShader = new e.AbstractFilter(["precision lowp float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;", "}"])
    },e.WebGLSpriteBatch.prototype.setContext = function (t) {
        this.gl = t, this.vertexBuffer = t.createBuffer(), this.indexBuffer = t.createBuffer(), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, this.indexBuffer), t.bufferData(t.ELEMENT_ARRAY_BUFFER, this.indices, t.STATIC_DRAW), t.bindBuffer(t.ARRAY_BUFFER, this.vertexBuffer), t.bufferData(t.ARRAY_BUFFER, this.vertices, t.DYNAMIC_DRAW), this.currentBlendMode = 99999;
        var i = new e.PixiShader(t);
        i.fragmentSrc = this.defaultShader.fragmentSrc, i.uniforms = {}, i.init(), this.defaultShader.shaders[t.id] = i
    },e.WebGLSpriteBatch.prototype.begin = function (e) {
        this.renderSession = e, this.shader = this.renderSession.shaderManager.defaultShader, this.start()
    },e.WebGLSpriteBatch.prototype.end = function () {
        this.flush()
    },e.WebGLSpriteBatch.prototype.render = function (e) {
        var t = e.texture;
        this.currentBatchSize >= this.size && (this.flush(), this.currentBaseTexture = t.baseTexture), t.ratio;
        var i = t._uvs;
        if (i) {
            var n, r, o, a, s = e.anchor.x, l = e.anchor.y;
            if (t.trim) {
                var c = t.trim;
                n = (r = c.x - s * c.width) + t.crop.width, o = (a = c.y - l * c.height) + t.crop.height
            } else n = t.frame.width * (1 - s), r = t.frame.width * -s, o = t.frame.height * (1 - l), a = t.frame.height * -l;
            var d = 4 * this.currentBatchSize * this.vertSize, h = e.worldTransform, u = h.a, f = h.b, g = h.c, p = h.d,
                m = h.tx, v = h.ty, w = this.colors, b = this.positions;
            if (e.bitmapPolygon) {
                var y = e.bitmapPolygonCords;
                b[d] = y[0] + m | 0, b[d + 1] = y[1] + v | 0, b[d + 5] = y[2] + m | 0, b[d + 6] = y[3] + v | 0, b[d + 10] = y[4] + m | 0, b[d + 11] = y[5] + v | 0, b[d + 15] = y[6] + m | 0, b[d + 16] = y[7] + v | 0
            } else t.floorCoordinates ? (b[d] = u * r + g * a + m | 0, b[d + 1] = p * a + f * r + v | 0, b[d + 5] = u * n + g * a + m | 0, b[d + 6] = p * a + f * n + v | 0, b[d + 10] = u * n + g * o + m | 0, b[d + 11] = p * o + f * n + v | 0, b[d + 15] = u * r + g * o + m | 0, b[d + 16] = p * o + f * r + v | 0) : (b[d] = u * r + g * a + m, b[d + 1] = p * a + f * r + v, b[d + 5] = u * n + g * a + m, b[d + 6] = p * a + f * n + v, b[d + 10] = u * n + g * o + m, b[d + 11] = p * o + f * n + v, b[d + 15] = u * r + g * o + m, b[d + 16] = p * o + f * r + v);
            b[d + 2] = i.x0, b[d + 3] = i.y0, b[d + 7] = i.x1, b[d + 8] = i.y1, b[d + 12] = i.x2, b[d + 13] = i.y2, b[d + 17] = i.x3, b[d + 18] = i.y3;
            var S = e.tint;
            w[d + 4] = w[d + 9] = w[d + 14] = w[d + 19] = (S >> 16) + (65280 & S) + ((255 & S) << 16) + (255 * e.worldAlpha << 24), this.sprites[this.currentBatchSize++] = e
        }
    },e.WebGLSpriteBatch.prototype.renderTilingSprite = function (t) {
        var i = t.tilingTexture;
        this.currentBatchSize >= this.size && (this.flush(), this.currentBaseTexture = i.baseTexture), t._uvs || (t._uvs = new e.TextureUvs);
        var n = t._uvs;
        t.tilePosition.x %= i.baseTexture.width * t.tileScaleOffset.x, t.tilePosition.y %= i.baseTexture.height * t.tileScaleOffset.y;
        var r = t.tilePosition.x / (i.baseTexture.width * t.tileScaleOffset.x),
            o = t.tilePosition.y / (i.baseTexture.height * t.tileScaleOffset.y),
            a = t.width / i.baseTexture.width / (t.tileScale.x * t.tileScaleOffset.x),
            s = t.height / i.baseTexture.height / (t.tileScale.y * t.tileScaleOffset.y);
        n.x0 = 0 - r, n.y0 = 0 - o, n.x1 = 1 * a - r, n.y1 = 0 - o, n.x2 = 1 * a - r, n.y2 = 1 * s - o, n.x3 = 0 - r, n.y3 = 1 * s - o;
        var l = t.tint, c = (l >> 16) + (65280 & l) + ((255 & l) << 16) + (255 * t.alpha << 24), d = this.positions,
            h = this.colors, u = t.width, f = t.height, g = t.anchor.x, p = t.anchor.y, m = u * (1 - g), v = u * -g,
            w = f * (1 - p), b = f * -p, y = 4 * this.currentBatchSize * this.vertSize, S = t.worldTransform, x = S.a,
            C = S.b, T = S.c, _ = S.d, k = S.tx, M = S.ty;
        d[y++] = x * v + T * b + k, d[y++] = _ * b + C * v + M, d[y++] = n.x0, d[y++] = n.y0, h[y++] = c, d[y++] = x * m + T * b + k, d[y++] = _ * b + C * m + M, d[y++] = n.x1, d[y++] = n.y1, h[y++] = c, d[y++] = x * m + T * w + k, d[y++] = _ * w + C * m + M, d[y++] = n.x2, d[y++] = n.y2, h[y++] = c, d[y++] = x * v + T * w + k, d[y++] = _ * w + C * v + M, d[y++] = n.x3, d[y++] = n.y3, h[y++] = c, this.sprites[this.currentBatchSize++] = t
    },e.WebGLSpriteBatch.prototype.flush = function () {
        if (0 !== this.currentBatchSize) {
            var t, i, n, r, o = this.gl;
            if (this.dirty) {
                this.dirty = !1, o.activeTexture(o.TEXTURE0), o.bindBuffer(o.ARRAY_BUFFER, this.vertexBuffer), o.bindBuffer(o.ELEMENT_ARRAY_BUFFER, this.indexBuffer), t = this.defaultShader.shaders[o.id];
                var a = 4 * this.vertSize;
                o.vertexAttribPointer(t.aVertexPosition, 2, o.FLOAT, !1, a, 0), o.vertexAttribPointer(t.aTextureCoord, 2, o.FLOAT, !1, a, 8), o.vertexAttribPointer(t.colorAttribute, 4, o.UNSIGNED_BYTE, !0, a, 16)
            }
            if (this.currentBatchSize > .5 * this.size) o.bufferSubData(o.ARRAY_BUFFER, 0, this.vertices); else {
                var s = this.positions.subarray(0, 4 * this.currentBatchSize * this.vertSize);
                o.bufferSubData(o.ARRAY_BUFFER, 0, s)
            }
            for (var l, c = 0, d = 0, h = null, u = this.renderSession.blendModeManager.currentBlendMode, f = null, g = !1, p = !1, m = 0, v = this.currentBatchSize; m < v; m++) {
                if (i = (l = this.sprites[m]).texture.baseTexture, g = u !== (n = l.blendMode), p = f !== (r = l.shader || this.defaultShader), (h !== i || g || p) && (this.renderBatch(h, c, d), d = m, c = 0, h = i, g && (u = n, this.renderSession.blendModeManager.setBlendMode(u)), p)) {
                    (t = (f = r).shaders[o.id]) || ((t = new e.PixiShader(o)).fragmentSrc = f.fragmentSrc, t.uniforms = f.uniforms, t.init(), f.shaders[o.id] = t), this.renderSession.shaderManager.setShader(t), t.dirty && t.syncUniforms();
                    var w = this.renderSession.projection;
                    o.uniform2f(t.projectionVector, w.x, w.y);
                    var b = this.renderSession.offset;
                    o.uniform2f(t.offsetVector, b.x, b.y)
                }
                c++
            }
            this.renderBatch(h, c, d), this.currentBatchSize = 0
        }
    },e.WebGLSpriteBatch.prototype.renderBatch = function (e, t, i) {
        if (0 !== t) {
            var n = this.gl;
            e._dirty[n.id] ? this.renderSession.renderer.updateTexture(e) : n.bindTexture(n.TEXTURE_2D, e._glTextures[n.id]), n.drawElements(n.TRIANGLES, 6 * t, n.UNSIGNED_SHORT, 6 * i * 2), this.renderSession.drawCount++
        }
    },e.WebGLSpriteBatch.prototype.stop = function () {
        this.flush(), this.dirty = !0
    },e.WebGLSpriteBatch.prototype.start = function () {
        this.dirty = !0
    },e.WebGLSpriteBatch.prototype.destroy = function () {
        this.vertices = null, this.indices = null, this.gl.deleteBuffer(this.vertexBuffer), this.gl.deleteBuffer(this.indexBuffer), this.currentBaseTexture = null, this.gl = null
    },e.WebGLFastSpriteBatch = function (t) {
        this.vertSize = 10, this.maxSize = 6e3, this.size = this.maxSize;
        var i = 4 * this.size * this.vertSize, n = 6 * this.maxSize;
        this.vertices = new e.Float32Array(i), this.indices = new e.Uint16Array(n), this.vertexBuffer = null, this.indexBuffer = null, this.lastIndexCount = 0;
        for (var r = 0, o = 0; r < n; r += 6, o += 4) this.indices[r + 0] = o + 0, this.indices[r + 1] = o + 1, this.indices[r + 2] = o + 2, this.indices[r + 3] = o + 0, this.indices[r + 4] = o + 2, this.indices[r + 5] = o + 3;
        this.drawing = !1, this.currentBatchSize = 0, this.currentBaseTexture = null, this.currentBlendMode = 0, this.renderSession = null, this.shader = null, this.matrix = null, this.setContext(t)
    },e.WebGLFastSpriteBatch.prototype.constructor = e.WebGLFastSpriteBatch,e.WebGLFastSpriteBatch.prototype.setContext = function (e) {
        this.gl = e, this.vertexBuffer = e.createBuffer(), this.indexBuffer = e.createBuffer(), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.indexBuffer), e.bufferData(e.ELEMENT_ARRAY_BUFFER, this.indices, e.STATIC_DRAW), e.bindBuffer(e.ARRAY_BUFFER, this.vertexBuffer), e.bufferData(e.ARRAY_BUFFER, this.vertices, e.DYNAMIC_DRAW)
    },e.WebGLFastSpriteBatch.prototype.begin = function (e, t) {
        this.renderSession = t, this.shader = this.renderSession.shaderManager.fastShader, this.matrix = e.worldTransform.toArray(!0), this.start()
    },e.WebGLFastSpriteBatch.prototype.end = function () {
        this.flush()
    },e.WebGLFastSpriteBatch.prototype.render = function (e) {
        var t = e.children, i = t[0];
        if (i.texture._uvs) {
            this.currentBaseTexture = i.texture.baseTexture, i.blendMode !== this.renderSession.blendModeManager.currentBlendMode && (this.flush(), this.renderSession.blendModeManager.setBlendMode(i.blendMode));
            for (var n = 0, r = t.length; n < r; n++) this.renderSprite(t[n]);
            this.flush()
        }
    },e.WebGLFastSpriteBatch.prototype.renderSprite = function (e) {
        if (e.visible && (e.texture.baseTexture === this.currentBaseTexture || (this.flush(), this.currentBaseTexture = e.texture.baseTexture, e.texture._uvs))) {
            var t, i, n, r, o, a, s = this.vertices;
            if (t = e.texture._uvs, e.texture.frame.width, e.texture.frame.height, e.texture.trim) {
                var l = e.texture.trim;
                i = (n = l.x - e.anchor.x * l.width) + e.texture.crop.width, r = (o = l.y - e.anchor.y * l.height) + e.texture.crop.height
            } else i = e.texture.frame.width * (1 - e.anchor.x), n = e.texture.frame.width * -e.anchor.x, r = e.texture.frame.height * (1 - e.anchor.y), o = e.texture.frame.height * -e.anchor.y;
            a = 4 * this.currentBatchSize * this.vertSize, s[a++] = n, s[a++] = o, s[a++] = e.position.x, s[a++] = e.position.y, s[a++] = e.scale.x, s[a++] = e.scale.y, s[a++] = e.rotation, s[a++] = t.x0, s[a++] = t.y1, s[a++] = e.alpha, s[a++] = i, s[a++] = o, s[a++] = e.position.x, s[a++] = e.position.y, s[a++] = e.scale.x, s[a++] = e.scale.y, s[a++] = e.rotation, s[a++] = t.x1, s[a++] = t.y1, s[a++] = e.alpha, s[a++] = i, s[a++] = r, s[a++] = e.position.x, s[a++] = e.position.y, s[a++] = e.scale.x, s[a++] = e.scale.y, s[a++] = e.rotation, s[a++] = t.x2, s[a++] = t.y2, s[a++] = e.alpha, s[a++] = n, s[a++] = r, s[a++] = e.position.x, s[a++] = e.position.y, s[a++] = e.scale.x, s[a++] = e.scale.y, s[a++] = e.rotation, s[a++] = t.x3, s[a++] = t.y3, s[a++] = e.alpha, this.currentBatchSize++, this.currentBatchSize >= this.size && this.flush()
        }
    },e.WebGLFastSpriteBatch.prototype.flush = function () {
        if (0 !== this.currentBatchSize) {
            var e = this.gl;
            if (this.currentBaseTexture._glTextures[e.id] || this.renderSession.renderer.updateTexture(this.currentBaseTexture, e), e.bindTexture(e.TEXTURE_2D, this.currentBaseTexture._glTextures[e.id]), this.currentBatchSize > .5 * this.size) e.bufferSubData(e.ARRAY_BUFFER, 0, this.vertices); else {
                var t = this.vertices.subarray(0, 4 * this.currentBatchSize * this.vertSize);
                e.bufferSubData(e.ARRAY_BUFFER, 0, t)
            }
            e.drawElements(e.TRIANGLES, 6 * this.currentBatchSize, e.UNSIGNED_SHORT, 0), this.currentBatchSize = 0, this.renderSession.drawCount++
        }
    },e.WebGLFastSpriteBatch.prototype.stop = function () {
        this.flush()
    },e.WebGLFastSpriteBatch.prototype.start = function () {
        var e = this.gl;
        e.activeTexture(e.TEXTURE0), e.bindBuffer(e.ARRAY_BUFFER, this.vertexBuffer), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        var t = this.renderSession.projection;
        e.uniform2f(this.shader.projectionVector, t.x, t.y), e.uniformMatrix3fv(this.shader.uMatrix, !1, this.matrix);
        var i = 4 * this.vertSize;
        e.vertexAttribPointer(this.shader.aVertexPosition, 2, e.FLOAT, !1, i, 0), e.vertexAttribPointer(this.shader.aPositionCoord, 2, e.FLOAT, !1, i, 8), e.vertexAttribPointer(this.shader.aScale, 2, e.FLOAT, !1, i, 16), e.vertexAttribPointer(this.shader.aRotation, 1, e.FLOAT, !1, i, 24), e.vertexAttribPointer(this.shader.aTextureCoord, 2, e.FLOAT, !1, i, 28), e.vertexAttribPointer(this.shader.colorAttribute, 1, e.FLOAT, !1, i, 36)
    },e.WebGLFilterManager = function () {
        this.filterStack = [], this.offsetX = 0, this.offsetY = 0
    },e.WebGLFilterManager.prototype.constructor = e.WebGLFilterManager,e.WebGLFilterManager.prototype.setContext = function (e) {
        this.gl = e, this.texturePool = [], this.initShaderBuffers()
    },e.WebGLFilterManager.prototype.begin = function (e, t) {
        this.renderSession = e, this.defaultShader = e.shaderManager.defaultShader;
        var i = this.renderSession.projection;
        this.width = 2 * i.x, this.height = 2 * -i.y, this.buffer = t
    },e.WebGLFilterManager.prototype.pushFilter = function (t) {
        var i = this.gl, n = this.renderSession.projection, r = this.renderSession.offset;
        t._filterArea = t.target.filterArea || t.target.getBounds(), this.filterStack.push(t);
        var o = t.filterPasses[0];
        this.offsetX += t._filterArea.x, this.offsetY += t._filterArea.y;
        var a = this.texturePool.pop();
        a ? a.resize(this.width, this.height) : a = new e.FilterTexture(this.gl, this.width, this.height), i.bindTexture(i.TEXTURE_2D, a.texture);
        var s = t._filterArea, l = o.padding;
        s.x -= l, s.y -= l, s.width += 2 * l, s.height += 2 * l, s.x < 0 && (s.x = 0), s.width > this.width && (s.width = this.width), s.y < 0 && (s.y = 0), s.height > this.height && (s.height = this.height), i.bindFramebuffer(i.FRAMEBUFFER, a.frameBuffer), i.viewport(0, 0, s.width, s.height), n.x = s.width / 2, n.y = -s.height / 2, r.x = -s.x, r.y = -s.y, i.colorMask(!0, !0, !0, !0), i.clearColor(0, 0, 0, 0), i.clear(i.COLOR_BUFFER_BIT), t._glFilterTexture = a
    },e.WebGLFilterManager.prototype.popFilter = function () {
        var t = this.gl, i = this.filterStack.pop(), n = i._filterArea, r = i._glFilterTexture,
            o = this.renderSession.projection, a = this.renderSession.offset;
        if (i.filterPasses.length > 1) {
            t.viewport(0, 0, n.width, n.height), t.bindBuffer(t.ARRAY_BUFFER, this.vertexBuffer), this.vertexArray[0] = 0, this.vertexArray[1] = n.height, this.vertexArray[2] = n.width, this.vertexArray[3] = n.height, this.vertexArray[4] = 0, this.vertexArray[5] = 0, this.vertexArray[6] = n.width, this.vertexArray[7] = 0, t.bufferSubData(t.ARRAY_BUFFER, 0, this.vertexArray), t.bindBuffer(t.ARRAY_BUFFER, this.uvBuffer), this.uvArray[2] = n.width / this.width, this.uvArray[5] = n.height / this.height, this.uvArray[6] = n.width / this.width, this.uvArray[7] = n.height / this.height, t.bufferSubData(t.ARRAY_BUFFER, 0, this.uvArray);
            var s = r, l = this.texturePool.pop();
            l || (l = new e.FilterTexture(this.gl, this.width, this.height)), l.resize(this.width, this.height), t.bindFramebuffer(t.FRAMEBUFFER, l.frameBuffer), t.clear(t.COLOR_BUFFER_BIT), t.disable(t.BLEND);
            for (var c = 0; c < i.filterPasses.length - 1; c++) {
                var d = i.filterPasses[c];
                t.bindFramebuffer(t.FRAMEBUFFER, l.frameBuffer), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, s.texture), this.applyFilterPass(d, n, n.width, n.height);
                var h = s;
                s = l, l = h
            }
            t.enable(t.BLEND), r = s, this.texturePool.push(l)
        }
        var u = i.filterPasses[i.filterPasses.length - 1];
        this.offsetX -= n.x, this.offsetY -= n.y;
        var f = this.width, g = this.height, p = 0, m = 0, v = this.buffer;
        if (0 === this.filterStack.length) t.colorMask(!0, !0, !0, !0); else {
            var w = this.filterStack[this.filterStack.length - 1];
            f = (n = w._filterArea).width, g = n.height, p = n.x, m = n.y, v = w._glFilterTexture.frameBuffer
        }
        o.x = f / 2, o.y = -g / 2, a.x = p, a.y = m;
        var b = (n = i._filterArea).x - p, y = n.y - m;
        t.bindBuffer(t.ARRAY_BUFFER, this.vertexBuffer), this.vertexArray[0] = b, this.vertexArray[1] = y + n.height, this.vertexArray[2] = b + n.width, this.vertexArray[3] = y + n.height, this.vertexArray[4] = b, this.vertexArray[5] = y, this.vertexArray[6] = b + n.width, this.vertexArray[7] = y, t.bufferSubData(t.ARRAY_BUFFER, 0, this.vertexArray), t.bindBuffer(t.ARRAY_BUFFER, this.uvBuffer), this.uvArray[2] = n.width / this.width, this.uvArray[5] = n.height / this.height, this.uvArray[6] = n.width / this.width, this.uvArray[7] = n.height / this.height, t.bufferSubData(t.ARRAY_BUFFER, 0, this.uvArray), t.viewport(0, 0, f, g), t.bindFramebuffer(t.FRAMEBUFFER, v), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, r.texture), this.applyFilterPass(u, n, f, g), this.texturePool.push(r), i._glFilterTexture = null
    },e.WebGLFilterManager.prototype.applyFilterPass = function (t, i, n, r) {
        var o = this.gl, a = t.shaders[o.id];
        a || ((a = new e.PixiShader(o)).fragmentSrc = t.fragmentSrc, a.uniforms = t.uniforms, a.init(), t.shaders[o.id] = a), this.renderSession.shaderManager.setShader(a), o.uniform2f(a.projectionVector, n / 2, -r / 2), o.uniform2f(a.offsetVector, 0, 0), t.uniforms.dimensions && (t.uniforms.dimensions.value[0] = this.width, t.uniforms.dimensions.value[1] = this.height, t.uniforms.dimensions.value[2] = this.vertexArray[0], t.uniforms.dimensions.value[3] = this.vertexArray[5]), a.syncUniforms(), o.bindBuffer(o.ARRAY_BUFFER, this.vertexBuffer), o.vertexAttribPointer(a.aVertexPosition, 2, o.FLOAT, !1, 0, 0), o.bindBuffer(o.ARRAY_BUFFER, this.uvBuffer), o.vertexAttribPointer(a.aTextureCoord, 2, o.FLOAT, !1, 0, 0), o.bindBuffer(o.ARRAY_BUFFER, this.colorBuffer), o.vertexAttribPointer(a.colorAttribute, 2, o.FLOAT, !1, 0, 0), o.bindBuffer(o.ELEMENT_ARRAY_BUFFER, this.indexBuffer), o.drawElements(o.TRIANGLES, 6, o.UNSIGNED_SHORT, 0), this.renderSession.drawCount++
    },e.WebGLFilterManager.prototype.initShaderBuffers = function () {
        var t = this.gl;
        this.vertexBuffer = t.createBuffer(), this.uvBuffer = t.createBuffer(), this.colorBuffer = t.createBuffer(), this.indexBuffer = t.createBuffer(), this.vertexArray = new e.Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), t.bindBuffer(t.ARRAY_BUFFER, this.vertexBuffer), t.bufferData(t.ARRAY_BUFFER, this.vertexArray, t.STATIC_DRAW), this.uvArray = new e.Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), t.bindBuffer(t.ARRAY_BUFFER, this.uvBuffer), t.bufferData(t.ARRAY_BUFFER, this.uvArray, t.STATIC_DRAW), this.colorArray = new e.Float32Array([1, 16777215, 1, 16777215, 1, 16777215, 1, 16777215]), t.bindBuffer(t.ARRAY_BUFFER, this.colorBuffer), t.bufferData(t.ARRAY_BUFFER, this.colorArray, t.STATIC_DRAW), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, this.indexBuffer), t.bufferData(t.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 1, 3, 2]), t.STATIC_DRAW)
    },e.WebGLFilterManager.prototype.destroy = function () {
        var e = this.gl;
        this.filterStack = null, this.offsetX = 0, this.offsetY = 0;
        for (var t = 0; t < this.texturePool.length; t++) this.texturePool[t].destroy();
        this.texturePool = null, e.deleteBuffer(this.vertexBuffer), e.deleteBuffer(this.uvBuffer), e.deleteBuffer(this.colorBuffer), e.deleteBuffer(this.indexBuffer)
    },e.FilterTexture = function (t, i, n, r) {
        this.gl = t, this.frameBuffer = t.createFramebuffer(), this.texture = t.createTexture(), r = r || e.scaleModes.DEFAULT, t.bindTexture(t.TEXTURE_2D, this.texture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, r === e.scaleModes.LINEAR ? t.LINEAR : t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, r === e.scaleModes.LINEAR ? t.LINEAR : t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.bindFramebuffer(t.FRAMEBUFFER, this.frameBuffer), t.bindFramebuffer(t.FRAMEBUFFER, this.frameBuffer), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, this.texture, 0), this.renderBuffer = t.createRenderbuffer(), t.bindRenderbuffer(t.RENDERBUFFER, this.renderBuffer), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.DEPTH_STENCIL_ATTACHMENT, t.RENDERBUFFER, this.renderBuffer), this.resize(i, n)
    },e.FilterTexture.prototype.constructor = e.FilterTexture,e.FilterTexture.prototype.clear = function () {
        var e = this.gl;
        e.clearColor(0, 0, 0, 0), e.clear(e.COLOR_BUFFER_BIT)
    },e.FilterTexture.prototype.resize = function (t, i) {
        if (this.width !== t || this.height !== i) {
            try {
                void 0 !== this._lastSize && (e.frvrTextureMemoryUsage -= 4 * this._lastSize.w * this._lastSize.h)
            } catch (e) {
            }
            this.width = t, this.height = i;
            var n = this.gl;
            n.bindTexture(n.TEXTURE_2D, this.texture), n.texImage2D(n.TEXTURE_2D, 0, n.RGBA, t, i, 0, n.RGBA, n.UNSIGNED_BYTE, null);
            try {
                e.frvrTextureMemoryUsage += 4 * t * i, this._lastSize = {w: t, h: i}
            } catch (e) {
            }
            n.bindRenderbuffer(n.RENDERBUFFER, this.renderBuffer), n.renderbufferStorage(n.RENDERBUFFER, n.DEPTH_STENCIL, t, i)
        }
    },e.FilterTexture.prototype.destroy = function () {
        var e = this.gl;
        e.deleteFramebuffer(this.frameBuffer), e.deleteTexture(this.texture), this.frameBuffer = null, this.texture = null
    },e.CanvasBuffer = function (e, t) {
        this.width = e, this.height = t, this.canvas = document.createElement("canvas"), this.context = this.canvas.getContext("2d"), this.canvas.width = e, this.canvas.height = t
    },e.CanvasBuffer.prototype.constructor = e.CanvasBuffer,e.CanvasBuffer.prototype.clear = function () {
        this.context.setTransform(1, 0, 0, 1, 0, 0), this.context.clearRect(0, 0, this.width, this.height)
    },e.CanvasBuffer.prototype.resize = function (e, t) {
        this.width = this.canvas.width = e, this.height = this.canvas.height = t
    },e.CanvasMaskManager = function () {
    },e.CanvasMaskManager.prototype.constructor = e.CanvasMaskManager,e.CanvasMaskManager.prototype.pushMask = function (t, i) {
        var n = i.context;
        n.save();
        var r = t.alpha, o = t.worldTransform;
        n.setTransform(o.a, o.b, o.c, o.d, o.tx, o.ty), e.CanvasGraphics.renderGraphicsMask(t, n), n.clip(), t.worldAlpha = r
    },e.CanvasMaskManager.prototype.popMask = function (e) {
        e.context.restore()
    },e.CanvasTinter = function () {
    },e.CanvasTinter.getTintedTexture = function (t, i) {
        var n = t.texture, r = "#" + ("00000" + (0 | (i = e.CanvasTinter.roundColor(i))).toString(16)).substr(-6);
        if (n.tintCache = n.tintCache || {}, n.tintCache[r]) return n.tintCache[r];
        var o = e.CanvasTinter.canvas || document.createElement("canvas");
        if (e.CanvasTinter.tintMethod(n, i, o), e.CanvasTinter.convertTintToImage) {
            var a = new Image;
            a.src = o.toDataURL(), n.tintCache[r] = a
        } else n.tintCache[r] = o, e.CanvasTinter.canvas = null;
        return o
    },e.CanvasTinter.tintWithPerPixelInner = function (t, i, n, r) {
        var o = i.getContext("2d");
        i.width = r.width, i.height = r.height, o.clearRect(0, 0, i.width, i.height), o.globalCompositeOperation = "copy", o.drawImage(t, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
        for (var a = e.hex2rgb(n), s = a[0], l = a[1], c = a[2], d = o.getImageData(0, 0, r.width, r.height), h = d.data, u = 0; u < h.length; u += 4) h[u + 0] = h[u + 0] * s >> 0, h[u + 1] = h[u + 1] * l >> 0, h[u + 2] = h[u + 2] * c >> 0;
        o.putImageData(d, 0, 0)
    },e.CanvasTinter.tintWithPerPixel = function (t, i, n) {
        e.CanvasTinter.tintWithPerPixelInner(t.baseTexture.source, n, i, t.crop)
    },e.CanvasTinter.roundColor = function (t) {
        var i = e.CanvasTinter.cacheStepsPerColorChannel, n = e.hex2rgb(t);
        return n[0] = Math.min(255, n[0] / i * i), n[1] = Math.min(255, n[1] / i * i), n[2] = Math.min(255, n[2] / i * i), e.rgb2hex(n)
    },e.CanvasTinter.cacheStepsPerColorChannel = 8,e.CanvasTinter.convertTintToImage = !1,e.CanvasTinter.canUseMultiply = e.canUseNewCanvasBlendModes(),e.CanvasTinter.tintMethod = e.CanvasTinter.tintWithPerPixel,e.CanvasRenderer = function (t, i, n) {
        if (n) for (var r in e.defaultRenderOptions) void 0 === n[r] && (n[r] = e.defaultRenderOptions[r]); else n = e.defaultRenderOptions;
        e.defaultRenderer || (e.defaultRenderer = this), this.type = e.CANVAS_RENDERER, this.clearBeforeRender = n.clearBeforeRender, this.transparent = n.transparent, this.autoResize = n.autoResize || !1, this.width = t || 800, this.height = i || 600, this.view = n.view || document.createElement("canvas"), this.context = this.view.getContext("2d", {alpha: this.transparent}), this.refresh = !0, this.count = 0, this.maskManager = new e.CanvasMaskManager, this.renderSession = {
            context: this.context,
            maskManager: this.maskManager,
            scaleMode: null,
            smoothProperty: null
        }, this.mapBlendModes(), this.resize(t, i), "imageSmoothingEnabled" in this.context ? this.renderSession.smoothProperty = "imageSmoothingEnabled" : "webkitImageSmoothingEnabled" in this.context ? this.renderSession.smoothProperty = "webkitImageSmoothingEnabled" : "mozImageSmoothingEnabled" in this.context ? this.renderSession.smoothProperty = "mozImageSmoothingEnabled" : "oImageSmoothingEnabled" in this.context ? this.renderSession.smoothProperty = "oImageSmoothingEnabled" : "msImageSmoothingEnabled" in this.context && (this.renderSession.smoothProperty = "msImageSmoothingEnabled")
    },e.CanvasRenderer.prototype.constructor = e.CanvasRenderer,e.CanvasRenderer.prototype.render = function (t) {
        t.updateTransform(), this.context.setTransform(1, 0, 0, 1, 0, 0), this.context.globalAlpha = 1, this.renderSession.currentBlendMode = e.blendModes.NORMAL, this.context.globalCompositeOperation = e.blendModesCanvas[e.blendModes.NORMAL], this.renderDisplayObject(t), t.interactive && (t._interactiveEventsAdded || (t._interactiveEventsAdded = !0, t.interactionManager.setTarget(this)))
    },e.CanvasRenderer.prototype.destroy = function (e) {
        void 0 === e && (e = !0), e && this.view.parent && this.view.parent.removeChild(this.view), this.view = null, this.context = null, this.maskManager = null, this.renderSession = null
    },e.CanvasRenderer.prototype.resize = function (e, t) {
        this.width = e, this.height = t, this.view.width = this.width, this.view.height = this.height
    },e.CanvasRenderer.prototype.renderDisplayObject = function (e, t) {
        this.renderSession.context = t || this.context, e._renderCanvas(this.renderSession)
    },e.CanvasRenderer.prototype.mapBlendModes = function () {
        e.blendModesCanvas || (e.blendModesCanvas = [], e.canUseNewCanvasBlendModes() ? (e.blendModesCanvas[e.blendModes.NORMAL] = "source-over", e.blendModesCanvas[e.blendModes.ADD] = "lighter", e.blendModesCanvas[e.blendModes.MULTIPLY] = "multiply", e.blendModesCanvas[e.blendModes.SCREEN] = "screen") : (e.blendModesCanvas[e.blendModes.NORMAL] = "source-over", e.blendModesCanvas[e.blendModes.ADD] = "lighter", e.blendModesCanvas[e.blendModes.MULTIPLY] = "source-over", e.blendModesCanvas[e.blendModes.SCREEN] = "source-over"))
    },e.CanvasGraphics = function () {
    },e.CanvasGraphics.renderGraphics = function (t, i) {
        var n = t.worldAlpha;
        t.dirty && (this.updateGraphicsTint(t), t.dirty = !1);
        for (var r = 0; r < t.graphicsData.length; r++) {
            var o = t.graphicsData[r], a = o.shape, s = o._fillTint, l = o._lineTint;
            if (i.lineWidth = o.lineWidth, o.type === e.Graphics.POLY) {
                i.beginPath();
                var c = a.points;
                i.moveTo(c[0], c[1]);
                for (var d = 1; d < c.length / 2; d++) i.lineTo(c[2 * d], c[2 * d + 1]);
                a.closed && i.lineTo(c[0], c[1]), c[0] === c[c.length - 2] && c[1] === c[c.length - 1] && i.closePath(), o.fill && (i.globalAlpha = o.fillAlpha * n, i.fillStyle = "#" + ("00000" + (0 | s).toString(16)).substr(-6), i.fill()), o.lineWidth && (i.globalAlpha = o.lineAlpha * n, i.strokeStyle = "#" + ("00000" + (0 | l).toString(16)).substr(-6), i.stroke())
            } else if (o.type === e.Graphics.RECT) (o.fillColor || 0 === o.fillColor) && (i.globalAlpha = o.fillAlpha * n, i.fillStyle = "#" + ("00000" + (0 | s).toString(16)).substr(-6), i.fillRect(a.x, a.y, a.width, a.height)), o.lineWidth && (i.globalAlpha = o.lineAlpha * n, i.strokeStyle = "#" + ("00000" + (0 | l).toString(16)).substr(-6), i.strokeRect(a.x, a.y, a.width, a.height)); else if (o.type === e.Graphics.CIRC) i.beginPath(), i.arc(a.x, a.y, a.radius, 0, 2 * Math.PI), i.closePath(), o.fill && (i.globalAlpha = o.fillAlpha * n, i.fillStyle = "#" + ("00000" + (0 | s).toString(16)).substr(-6), i.fill()), o.lineWidth && (i.globalAlpha = o.lineAlpha * n, i.strokeStyle = "#" + ("00000" + (0 | l).toString(16)).substr(-6), i.stroke()); else if (o.type === e.Graphics.ELIP) {
                var h = 2 * a.width, u = 2 * a.height, f = a.x - h / 2, g = a.y - u / 2;
                i.beginPath();
                var p = h / 2 * .5522848, m = u / 2 * .5522848, v = f + h, w = g + u, b = f + h / 2, y = g + u / 2;
                i.moveTo(f, y), i.bezierCurveTo(f, y - m, b - p, g, b, g), i.bezierCurveTo(b + p, g, v, y - m, v, y), i.bezierCurveTo(v, y + m, b + p, w, b, w), i.bezierCurveTo(b - p, w, f, y + m, f, y), i.closePath(), o.fill && (i.globalAlpha = o.fillAlpha * n, i.fillStyle = "#" + ("00000" + (0 | s).toString(16)).substr(-6), i.fill()), o.lineWidth && (i.globalAlpha = o.lineAlpha * n, i.strokeStyle = "#" + ("00000" + (0 | l).toString(16)).substr(-6), i.stroke())
            } else if (o.type === e.Graphics.RREC) {
                var S = a.x, x = a.y, C = a.width, T = a.height, _ = a.radius, k = Math.min(C, T) / 2 | 0;
                _ = _ > k ? k : _, i.beginPath(), i.moveTo(S, x + _), i.lineTo(S, x + T - _), i.quadraticCurveTo(S, x + T, S + _, x + T), i.lineTo(S + C - _, x + T), i.quadraticCurveTo(S + C, x + T, S + C, x + T - _), i.lineTo(S + C, x + _), i.quadraticCurveTo(S + C, x, S + C - _, x), i.lineTo(S + _, x), i.quadraticCurveTo(S, x, S, x + _), i.closePath(), (o.fillColor || 0 === o.fillColor) && (i.globalAlpha = o.fillAlpha * n, i.fillStyle = "#" + ("00000" + (0 | s).toString(16)).substr(-6), i.fill()), o.lineWidth && (i.globalAlpha = o.lineAlpha * n, i.strokeStyle = "#" + ("00000" + (0 | l).toString(16)).substr(-6), i.stroke())
            }
        }
    },e.CanvasGraphics.renderGraphicsMask = function (t, i) {
        var n = t.graphicsData.length;
        if (0 !== n) {
            n > 1 && (n = 1, window.console.log("Pixi.js warning: masks in canvas can only mask using the first path in the graphics object"));
            for (var r = 0; r < 1; r++) {
                var o = t.graphicsData[r], a = o.shape;
                if (o.type === e.Graphics.POLY) {
                    i.beginPath();
                    var s = a.points;
                    i.moveTo(s[0], s[1]);
                    for (var l = 1; l < s.length / 2; l++) i.lineTo(s[2 * l], s[2 * l + 1]);
                    s[0] === s[s.length - 2] && s[1] === s[s.length - 1] && i.closePath()
                } else if (o.type === e.Graphics.RECT) i.beginPath(), i.rect(a.x, a.y, a.width, a.height), i.closePath(); else if (o.type === e.Graphics.CIRC) i.beginPath(), i.arc(a.x, a.y, a.radius, 0, 2 * Math.PI), i.closePath(); else if (o.type === e.Graphics.ELIP) {
                    var c = 2 * a.width, d = 2 * a.height, h = a.x - c / 2, u = a.y - d / 2;
                    i.beginPath();
                    var f = c / 2 * .5522848, g = d / 2 * .5522848, p = h + c, m = u + d, v = h + c / 2, w = u + d / 2;
                    i.moveTo(h, w), i.bezierCurveTo(h, w - g, v - f, u, v, u), i.bezierCurveTo(v + f, u, p, w - g, p, w), i.bezierCurveTo(p, w + g, v + f, m, v, m), i.bezierCurveTo(v - f, m, h, w + g, h, w), i.closePath()
                } else if (o.type === e.Graphics.RREC) {
                    var b, y, S, x, C, T = a.points;
                    T ? (b = T[0], y = T[1], S = T[2], x = T[3], C = T[4]) : (b = a.x, y = a.y, S = a.width, x = a.height, C = a.radius);
                    var _ = Math.min(S, x) / 2 | 0;
                    C = C > _ ? _ : C, i.beginPath(), i.moveTo(b, y + C), i.lineTo(b, y + x - C), i.quadraticCurveTo(b, y + x, b + C, y + x), i.lineTo(b + S - C, y + x), i.quadraticCurveTo(b + S, y + x, b + S, y + x - C), i.lineTo(b + S, y + C), i.quadraticCurveTo(b + S, y, b + S - C, y), i.lineTo(b + C, y), i.quadraticCurveTo(b, y, b, y + C), i.closePath()
                }
            }
        }
    },e.CanvasGraphics.updateGraphicsTint = function (e) {
        if (16777215 !== e.tint) for (var t = (e.tint >> 16 & 255) / 255, i = (e.tint >> 8 & 255) / 255, n = (255 & e.tint) / 255, r = 0; r < e.graphicsData.length; r++) {
            var o = e.graphicsData[r], a = 0 | o.fillColor, s = 0 | o.lineColor;
            o._fillTint = ((a >> 16 & 255) / 255 * t * 255 << 16) + ((a >> 8 & 255) / 255 * i * 255 << 8) + (255 & a) / 255 * n * 255, o._lineTint = ((s >> 16 & 255) / 255 * t * 255 << 16) + ((s >> 8 & 255) / 255 * i * 255 << 8) + (255 & s) / 255 * n * 255
        }
    },e.Graphics = function () {
        e.DisplayObjectContainer.call(this), this.renderable = !0, this.fillAlpha = 1, this.lineWidth = 0, this.lineColor = 0, this.graphicsData = [], this.tint = 16777215, this.ondTint = 16777215, this.blendMode = e.blendModes.NORMAL, this.currentPath = null, this._webGL = [], this.isMask = !1, this.boundsPadding = 0, this._localBounds = new e.Rectangle(0, 0, 1, 1), this.dirty = !0, this.webGLDirty = !1, this.cachedSpriteDirty = !1
    },e.Graphics.prototype = Object.create(e.DisplayObjectContainer.prototype),e.Graphics.prototype.constructor = e.Graphics,e.Graphics.prototype.lineStyle = function (t, i, n) {
        if (this.lineWidth = t || 0, this.lineColor = i || 0, this.lineAlpha = arguments.length < 3 ? 1 : n, this.currentPath) {
            if (this.currentPath.shape.points.length) return this.drawShape(new e.Polygon(this.currentPath.shape.points.slice(-2))), this;
            this.currentPath.lineWidth = this.lineWidth, this.currentPath.lineColor = this.lineColor, this.currentPath.lineAlpha = this.lineAlpha
        }
        return this
    },e.Graphics.prototype.moveTo = function (t, i) {
        return this.drawShape(new e.Polygon([t, i])), this
    },e.Graphics.prototype.lineTo = function (e, t) {
        return this.currentPath.shape.points.push(e, t), this.dirty = !0, this
    },e.Graphics.prototype.quadraticCurveTo = function (e, t, i, n) {
        this.currentPath ? 0 === this.currentPath.shape.points.length && (this.currentPath.shape.points = [0, 0]) : this.moveTo(0, 0);
        var r, o, a = this.currentPath.shape.points;
        0 === a.length && this.moveTo(0, 0);
        for (var s = a[a.length - 2], l = a[a.length - 1], c = 0, d = 1; d <= 20; d++) r = s + (e - s) * (c = d / 20), o = l + (t - l) * c, a.push(r + (e + (i - e) * c - r) * c, o + (t + (n - t) * c - o) * c);
        return this.dirty = !0, this
    },e.Graphics.prototype.bezierCurveTo = function (e, t, i, n, r, o) {
        this.currentPath ? 0 === this.currentPath.shape.points.length && (this.currentPath.shape.points = [0, 0]) : this.moveTo(0, 0);
        for (var a, s, l, c, d, h = this.currentPath.shape.points, u = h[h.length - 2], f = h[h.length - 1], g = 0, p = 1; p <= 20; p++) l = (s = (a = 1 - (g = p / 20)) * a) * a, d = (c = g * g) * g, h.push(l * u + 3 * s * g * e + 3 * a * c * i + d * r, l * f + 3 * s * g * t + 3 * a * c * n + d * o);
        return this.dirty = !0, this
    },e.Graphics.prototype.arcTo = function (e, t, i, n, r) {
        this.currentPath ? 0 === this.currentPath.shape.points.length && this.currentPath.shape.points.push(e, t) : this.moveTo(e, t);
        var o = this.currentPath.shape.points, a = o[o.length - 2], s = o[o.length - 1] - t, l = a - e, c = n - t,
            d = i - e, h = Math.abs(s * d - l * c);
        if (h < 1e-8 || 0 === r) o[o.length - 2] === e && o[o.length - 1] === t || o.push(e, t); else {
            var u = s * s + l * l, f = c * c + d * d, g = s * c + l * d, p = r * Math.sqrt(u) / h,
                m = r * Math.sqrt(f) / h, v = p * g / u, w = m * g / f, b = p * d + m * l, y = p * c + m * s,
                S = l * (m + v), x = s * (m + v), C = d * (p + w), T = c * (p + w), _ = Math.atan2(x - y, S - b),
                k = Math.atan2(T - y, C - b);
            this.arc(b + e, y + t, r, _, k, l * c > d * s)
        }
        return this.dirty = !0, this
    },e.Graphics.prototype.arc = function (e, t, i, n, r, o) {
        var a, s = e + Math.cos(n) * i, l = t + Math.sin(n) * i;
        if (this.currentPath ? 0 === (a = this.currentPath.shape.points).length ? a.push(s, l) : a[a.length - 2] === s && a[a.length - 1] === l || a.push(s, l) : (this.moveTo(s, l), a = this.currentPath.shape.points), n === r) return this;
        !o && r <= n ? r += 2 * Math.PI : o && n <= r && (n += 2 * Math.PI);
        var c = o ? -1 * (n - r) : r - n, d = Math.abs(c) / (2 * Math.PI) * 40;
        if (0 === c) return this;
        for (var h = c / (2 * d), u = 2 * h, f = Math.cos(h), g = Math.sin(h), p = d - 1, m = p % 1 / p, v = 0; v <= p; v++) {
            var w = h + n + u * (v + m * v), b = Math.cos(w), y = -Math.sin(w);
            a.push((f * b + g * y) * i + e, (f * -y + g * b) * i + t)
        }
        return this.dirty = !0, this
    },e.Graphics.prototype.beginFill = function (e, t) {
        return this.filling = !0, this.fillColor = e || 0, this.fillAlpha = void 0 === t ? 1 : t, this.currentPath && this.currentPath.shape.points.length <= 2 && (this.currentPath.fill = this.filling, this.currentPath.fillColor = this.fillColor, this.currentPath.fillAlpha = this.fillAlpha), this
    },e.Graphics.prototype.endFill = function () {
        return this.filling = !1, this.fillColor = null, this.fillAlpha = 1, this
    },e.Graphics.prototype.drawRect = function (t, i, n, r) {
        return this.drawShape(new e.Rectangle(t, i, n, r)), this
    },e.Graphics.prototype.drawRoundedRect = function (t, i, n, r, o) {
        return this.drawShape(new e.RoundedRectangle(t, i, n, r, o)), this
    },e.Graphics.prototype.drawCircle = function (t, i, n) {
        return this.drawShape(new e.Circle(t, i, n)), this
    },e.Graphics.prototype.drawEllipse = function (t, i, n, r) {
        return this.drawShape(new e.Ellipse(t, i, n, r)), this
    },e.Graphics.prototype.drawPolygon = function (t) {
        return t instanceof Array || (t = Array.prototype.slice.call(arguments)), this.drawShape(new e.Polygon(t)), this
    },e.Graphics.prototype.clear = function () {
        return this.lineWidth = 0, this.filling = !1, this.dirty = !0, this.clearDirty = !0, this.graphicsData = [], this
    },e.Graphics.prototype._renderWebGL = function (t) {
        if (!1 !== this.visible && 0 !== this.alpha && !0 !== this.isMask) {
            if (t.spriteBatch.stop(), t.blendModeManager.setBlendMode(this.blendMode), this._mask && t.maskManager.pushMask(this._mask, t), this._filters && t.filterManager.pushFilter(this._filterBlock), this.blendMode !== t.spriteBatch.currentBlendMode) {
                t.spriteBatch.currentBlendMode = this.blendMode;
                var i = e.blendModesWebGL[t.spriteBatch.currentBlendMode];
                t.spriteBatch.gl.blendFunc(i[0], i[1])
            }
            if (this.webGLDirty && (this.dirty = !0, this.webGLDirty = !1), e.WebGLGraphics.renderGraphics(this, t), this.children.length) {
                t.spriteBatch.start();
                for (var n = 0, r = this.children.length; n < r; n++) this.children[n]._renderWebGL(t);
                t.spriteBatch.stop()
            }
            this._filters && t.filterManager.popFilter(), this._mask && t.maskManager.popMask(this.mask, t), t.drawCount++, t.spriteBatch.start()
        }
    },e.Graphics.prototype._renderCanvas = function (t) {
        if (!1 !== this.visible && 0 !== this.alpha && !0 !== this.isMask) {
            var i = t.context, n = this.worldTransform;
            this.blendMode !== t.currentBlendMode && (t.currentBlendMode = this.blendMode, i.globalCompositeOperation = e.blendModesCanvas[t.currentBlendMode]), this._mask && t.maskManager.pushMask(this._mask, t), i.setTransform(n.a, n.b, n.c, n.d, n.tx, n.ty), this.tint != this.oldTint && (this.dirty = !0, this.oldTint = this.tint), e.CanvasGraphics.renderGraphics(this, i);
            for (var r = 0, o = this.children.length; r < o; r++) this.children[r]._renderCanvas(t);
            this._mask && t.maskManager.popMask(t)
        }
    },e.Graphics.prototype.getBounds = function (t) {
        if (this.isMask) return e.EmptyRectangle;
        this.dirty && (this.updateLocalBounds(), this.webGLDirty = !0, this.cachedSpriteDirty = !0, this.dirty = !1);
        var i = this._localBounds, n = i.x, r = i.width + i.x, o = i.y, a = i.height + i.y,
            s = t || this.worldTransform, l = s.a, c = s.b, d = s.c, h = s.d, u = s.tx, f = s.ty, g = l * r + d * a + u,
            p = h * a + c * r + f, m = l * n + d * a + u, v = h * a + c * n + f, w = l * n + d * o + u,
            b = h * o + c * n + f, y = l * r + d * o + u, S = h * o + c * r + f, x = g, C = p, T = g, _ = p;
        return T = y < (T = w < (T = m < T ? m : T) ? w : T) ? y : T, _ = S < (_ = b < (_ = v < _ ? v : _) ? b : _) ? S : _, x = y > (x = w > (x = m > x ? m : x) ? w : x) ? y : x, C = S > (C = b > (C = v > C ? v : C) ? b : C) ? S : C, this._bounds.x = T, this._bounds.width = x - T, this._bounds.y = _, this._bounds.height = C - _, this._bounds
    },e.Graphics.prototype.updateLocalBounds = function () {
        var t = 1 / 0, i = -1 / 0, n = 1 / 0, r = -1 / 0;
        if (this.graphicsData.length) for (var o, a, s, l, c, d, h = 0; h < this.graphicsData.length; h++) {
            var u = this.graphicsData[h], f = u.type, g = u.lineWidth;
            if (o = u.shape, f === e.Graphics.RECT || f === e.Graphics.RREC) s = o.x - g / 2, l = o.y - g / 2, t = s < t ? s : t, i = s + (c = o.width + g) > i ? s + c : i, n = l < n ? l : n, r = l + (d = o.height + g) > r ? l + d : r; else if (f === e.Graphics.CIRC) s = o.x, l = o.y, t = s - (c = o.radius + g / 2) < t ? s - c : t, i = s + c > i ? s + c : i, n = l - (d = o.radius + g / 2) < n ? l - d : n, r = l + d > r ? l + d : r; else if (f === e.Graphics.ELIP) s = o.x, l = o.y, t = s - (c = o.width + g / 2) < t ? s - c : t, i = s + c > i ? s + c : i, n = l - (d = o.height + g / 2) < n ? l - d : n, r = l + d > r ? l + d : r; else {
                a = o.points;
                for (var p = 0; p < a.length; p += 2) t = (s = a[p]) - g < t ? s - g : t, i = s + g > i ? s + g : i, n = (l = a[p + 1]) - g < n ? l - g : n, r = l + g > r ? l + g : r
            }
        } else t = 0, i = 0, n = 0, r = 0;
        var m = this.boundsPadding;
        this._localBounds.x = t - m, this._localBounds.width = i - t + 2 * m, this._localBounds.y = n - m, this._localBounds.height = r - n + 2 * m
    },e.Graphics.prototype.drawShape = function (t) {
        this.currentPath && this.currentPath.shape.points.length <= 2 && this.graphicsData.pop(), this.currentPath = null;
        var i = new e.GraphicsData(this.lineWidth, this.lineColor, this.lineAlpha, this.fillColor, this.fillAlpha, this.filling, t);
        return this.graphicsData.push(i), i.type === e.Graphics.POLY && (i.shape.closed = this.filling, this.currentPath = i), this.dirty = !0, i
    },e.GraphicsData = function (e, t, i, n, r, o, a) {
        this.lineWidth = e, this.lineColor = t, this.lineAlpha = i, this._lineTint = t, this.fillColor = n, this.fillAlpha = r, this._fillTint = n, this.fill = o, this.shape = a, this.type = a.type
    },e.Graphics.POLY = 0,e.Graphics.RECT = 1,e.Graphics.CIRC = 2,e.Graphics.ELIP = 3,e.Graphics.RREC = 4,e.Polygon.prototype.type = e.Graphics.POLY,e.Rectangle.prototype.type = e.Graphics.RECT,e.Circle.prototype.type = e.Graphics.CIRC,e.Ellipse.prototype.type = e.Graphics.ELIP,e.RoundedRectangle.prototype.type = e.Graphics.RREC,e.BaseTextureCache = {},e.BaseTextureCacheIdGenerator = 0,e.BaseTexture = function (t, i) {
        if (this.width = 100, this.height = 100, this.scaleMode = i || e.scaleModes.DEFAULT, this.hasLoaded = !1, this.source = t, this._UID = e._UID++, this.premultipliedAlpha = !0, this._glTextures = [], this._dirty = [!0, !0, !0, !0], t) {
            if ((this.source.complete || this.source.getContext) && this.source.width && this.source.height) this.hasLoaded = !0, this.width = this.source.naturalWidth || this.source.width, this.height = this.source.naturalHeight || this.source.height, this.dirty(); else {
                var n = this;
                this.source.onload = function () {
                    n.source && (n.hasLoaded = !0, n.width = n.source.naturalWidth || n.source.width, n.height = n.source.naturalHeight || n.source.height, n.dirty(), window.dirtyOnce = !0, n.dispatchEvent({
                        type: "loaded",
                        content: n
                    }))
                }, this.source.onerror = function () {
                    n.dispatchEvent({type: "error", content: n})
                }
            }
            this.imageUrl = null
        }
    },e.BaseTexture.prototype.constructor = e.BaseTexture,e.EventTarget.mixin(e.BaseTexture.prototype),e.BaseTexture.prototype.destroy = function () {
        this.imageUrl && (delete e.BaseTextureCache[this.imageUrl], delete e.TextureCache[this.imageUrl], this.imageUrl = null, this.source.src = ""), this.source = null, this.unloadFromGPU()
    },e.BaseTexture.prototype.dirty = function () {
        for (var e = 0; e < this._glTextures.length; e++) this._dirty[e] = !0
    },e.BaseTexture.prototype.unloadFromGPU = function () {
        this.dirty();
        for (var t = this._glTextures.length - 1; t >= 0; t--) {
            var i = this._glTextures[t], n = e.glContexts[t];
            n && i && n.deleteTexture(i)
        }
        this._glTextures.length = 0, this.dirty()
    },e.BaseTexture.fromImage = function (t, i, n) {
        var r = e.BaseTextureCache[t];
        if (void 0 === i && -1 === t.indexOf("data:") && (i = !0), !r) {
            var o = new Image;
            i && (o.crossOrigin = ""), o.src = t, (r = new e.BaseTexture(o, n)).imageUrl = t, e.BaseTextureCache[t] = r
        }
        return r
    },e.BaseTexture.fromCanvas = function (t, i) {
        return new e.BaseTexture(t, i)
    },e.TextureCache = {},e.FrameCache = {},e.TextureCacheIdGenerator = 0,e.Texture = function (t, i, n, r, o) {
        this.noFrame = !1, this.resolution = o || 1, i || (this.noFrame = !0, i = new e.Rectangle(0, 0, 1, 1)), t instanceof e.Texture && (t = t.baseTexture), this.baseTexture = t, this.floorCoordinates = !0, this.frame = i, this.trim = r, this.valid = !1, this.requiresUpdate = !1, this._uvs = null, this.width = 0, this.height = 0, this.crop = n || new e.Rectangle(0, 0, 1, 1), t.hasLoaded ? (this.noFrame && (i = new e.Rectangle(0, 0, t.width / this.resolution, t.height / this.resolution)), this.setFrame(i)) : t.addEventListener("loaded", this.onBaseTextureLoaded.bind(this))
    },e.Texture.prototype.constructor = e.Texture,e.EventTarget.mixin(e.Texture.prototype),e.Texture.prototype.onBaseTextureLoaded = function () {
        var t = this.baseTexture;
        t.removeEventListener("loaded", this.onLoaded), this.noFrame && (this.frame = new e.Rectangle(0, 0, t.width / this.resolution, t.height / this.resolution)), this.setFrame(this.frame), this.dispatchEvent({
            type: "update",
            content: this
        })
    },e.Texture.prototype.destroy = function (e) {
        e && this.baseTexture.destroy(), this.valid = !1
    },e.Texture.prototype.setFrame = function (e) {
        if (this.noFrame = !1, this.frame = e, this.width = e.width, this.height = e.height, this.crop.x = e.x, this.crop.y = e.y, this.crop.width = e.width, this.crop.height = e.height, !this.trim && (e.x + e.width > this.baseTexture.width / this.resolution || e.y + e.height > this.baseTexture.height / this.resolution)) throw new Error("Texture Error: frame does not fit inside the base Texture dimensions " + this);
        this.valid = e && e.width && e.height && this.baseTexture.source && this.baseTexture.hasLoaded, this.trim && (this.width = this.trim.width, this.height = this.trim.height, this.frame.width = this.trim.width, this.frame.height = this.trim.height), this.valid && this._updateUvs()
    },e.Texture.prototype._updateUvs = function () {
        this._uvs || (this._uvs = new e.TextureUvs);
        var t = this.crop, i = this.resolution, n = this.baseTexture.width / i, r = this.baseTexture.height / i;
        this._uvs.x0 = t.x / n, this._uvs.y0 = t.y / r, this._uvs.x1 = (t.x + t.width) / n, this._uvs.y1 = t.y / r, this._uvs.x2 = (t.x + t.width) / n, this._uvs.y2 = (t.y + t.height) / r, this._uvs.x3 = t.x / n, this._uvs.y3 = (t.y + t.height) / r
    },e.Texture.fromImage = function (t, i, n, r) {
        var o = t;
        1 != (r = r || 1) && (o += ":" + r);
        var a = e.TextureCache[o];
        return a || (a = new e.Texture(e.BaseTexture.fromImage(t, i, n), r), e.TextureCache[o] = a), a
    },e.Texture.fromFrame = function (t) {
        var i = e.TextureCache[t];
        if (!i) throw new Error('The frameId "' + t + '" does not exist in the texture cache ');
        return i
    },e.Texture.fromCanvas = function (t, i, n) {
        var r = e.BaseTexture.fromCanvas(t, i);
        return new e.Texture(r, void 0, void 0, void 0, n)
    },e.Texture.addTextureToCache = function (t, i) {
        e.TextureCache[i] = t
    },e.Texture.removeTextureFromCache = function (t) {
        var i = e.TextureCache[t];
        return delete e.TextureCache[t], delete e.BaseTextureCache[t], i
    },e.TextureUvs = function () {
        this.x0 = 0, this.y0 = 0, this.x1 = 0, this.y1 = 0, this.x2 = 0, this.y2 = 0, this.x3 = 0, this.y3 = 0
    },e.Texture.emptyTexture = new e.Texture(new e.BaseTexture),e.RenderTexture = function (t, i, n, r) {
        if (this.width = t || 100, this.height = i || 100, this.frame = new e.Rectangle(0, 0, this.width, this.height), this.crop = new e.Rectangle(0, 0, this.width, this.height), this.baseTexture = new e.BaseTexture, this.baseTexture.width = this.width, this.baseTexture.height = this.height, this.baseTexture._glTextures = [], this.baseTexture.scaleMode = r || e.scaleModes.DEFAULT, this.baseTexture.hasLoaded = !0, e.Texture.call(this, this.baseTexture, new e.Rectangle(0, 0, this.width, this.height)), this.renderer = n || e.defaultRenderer, this.renderer.type === e.WEBGL_RENDERER) {
            var o = this.renderer.gl;
            this.baseTexture._dirty[o.id] = !1, this.textureBuffer = new e.FilterTexture(o, this.width, this.height, this.baseTexture.scaleMode), this.baseTexture._glTextures[o.id] = this.textureBuffer.texture, this.render = this.renderWebGL, this.projection = new e.Point(.5 * this.width, .5 * -this.height)
        } else this.render = this.renderCanvas, this.textureBuffer = new e.CanvasBuffer(this.width, this.height), this.baseTexture.source = this.textureBuffer.canvas;
        this.valid = !0, this._updateUvs()
    },e.RenderTexture.prototype = Object.create(e.Texture.prototype),e.RenderTexture.prototype.constructor = e.RenderTexture,e.RenderTexture.prototype.resize = function (t, i, n) {
        t === this.width && i === this.height || (this.valid = t > 0 && i > 0, this.width = this.frame.width = this.crop.width = t, this.height = this.frame.height = this.crop.height = i, n && (this.baseTexture.width = this.width, this.baseTexture.height = this.height), this.renderer.type === e.WEBGL_RENDERER && (this.projection.x = this.width / 2, this.projection.y = -this.height / 2), this.valid && this.textureBuffer.resize(this.width, this.height))
    },e.RenderTexture.prototype.clear = function () {
        this.valid && (this.renderer.type === e.WEBGL_RENDERER && this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, this.textureBuffer.frameBuffer), this.textureBuffer.clear())
    },e.RenderTexture.prototype.renderWebGL = function (e, t, i) {
        if (this.valid) {
            var n = e.worldTransform;
            n.identity(), n.translate(0, 2 * this.projection.y), t && n.append(t), n.scale(1, -1), e.worldAlpha = 1;
            for (var r = e.children, o = 0, a = r.length; o < a; o++) r[o].updateTransform();
            var s = this.renderer.gl;
            s.viewport(0, 0, this.width, this.height), s.bindFramebuffer(s.FRAMEBUFFER, this.textureBuffer.frameBuffer), i && this.textureBuffer.clear(), this.renderer.spriteBatch.dirty = !0, this.renderer.renderDisplayObject(e, this.projection, this.textureBuffer.frameBuffer), this.renderer.spriteBatch.dirty = !0
        }
    },e.RenderTexture.prototype.renderCanvas = function (e, t, i) {
        if (this.valid) {
            var n = e.worldTransform;
            n.identity(), t && n.append(t), e.worldAlpha = 1;
            for (var r = e.children, o = 0, a = r.length; o < a; o++) r[o].updateTransform();
            i && this.textureBuffer.clear();
            var s = this.textureBuffer.context;
            this.renderer.renderDisplayObject(e, s)
        }
    },e.AbstractFilter = function (e, t) {
        this.passes = [this], this.shaders = [], this.dirty = !0, this.padding = 0, this.uniforms = t || {}, this.fragmentSrc = e || []
    },e.AbstractFilter.prototype.constructor = e.AbstractFilter,e.AbstractFilter.prototype.syncUniforms = function () {
        for (var e = 0, t = this.shaders.length; e < t; e++) this.shaders[e].dirty = !0
    },e
}, function (e) {
    var t = {};
    t.higherIsBetter = function (e, t) {
        return void 0 === e ? t : void 0 === t ? e : Math.max(e || 0, t || 0)
    }, t.lowerIsBetter = function (e, t) {
        return void 0 === e ? t : void 0 === t ? e : Math.min(e || 0, t || 0)
    }, t.longerIsBetter = function (e, t) {
        return void 0 === e ? t : void 0 === t ? e : (e || "").length >= (t || "").length ? e : t
    }, t.shorterIsBetter = function (e, t) {
        return void 0 === e ? t : void 0 === t ? e : (e || "").length <= (t || "").length ? e : t
    }, t.trueIsBetter = function (e, t) {
        return void 0 === e ? t : void 0 === t ? e : e || t || !1
    }, t.falseIsBetter = function (e, t) {
        return void 0 === e ? t : void 0 === t ? e : e && t || !1
    }, t.firstIsBetter = function (e, t) {
        return void 0 === e ? t : e
    }, t.secondIsBetter = function (e, t) {
        return void 0 === e ? t : void 0 === t ? e : t
    }, t.recursive = function (e) {
        function i(i, n, r, o) {
            for (prop in n) {
                var a = e[typeof n[prop]];
                if (!a) {
                    var s = "XS.data.merge.recursive: Unsupported merge type (property: " + prop + "): " + typeof n[prop] + " - defaulting to second arg";
                    console.error(s), a = e.default || t.secondIsBetter
                }
                i[prop] = a(r[prop], o[prop])
            }
        }

        var n = function (e, t) {
            var n = {};
            return i(n, e, e, t), i(n, t, e, t), n
        };
        return e.object = e.object || n, n
    }, t.higherAndTrueIsBetter = t.recursive({number: t.higherIsBetter, boolean: t.trueIsBetter});
    var i = {
        int: {
            defVal: 0,
            defMerge: t.higherIsBetter,
            localGet: Host.Preferences.GetInt,
            localSet: Host.Preferences.SetInt
        },
        float: {
            defVal: 0,
            defMerge: t.higherIsBetter,
            localGet: Host.Preferences.GetFloat,
            localSet: Host.Preferences.SetFloat
        },
        string: {
            defVal: "",
            defMerge: t.longerIsBetter,
            localGet: Host.Preferences.GetString,
            localSet: Host.Preferences.SetString
        },
        bool: {
            defVal: !1,
            defMerge: t.trueIsBetter,
            localGet: Host.Preferences.GetBool,
            localSet: Host.Preferences.SetBool
        },
        object: {
            defVal: {}, defMerge: t.firstIsBetter, localGet: function (e, t, i) {
                Host.Preferences.GetString(e, function (e, i) {
                    var n = void 0;
                    try {
                        n = JSON.parse(e)
                    } catch (e) {
                        n = {}
                    }
                    t && t(n, i)
                })
            }, localSet: function (e, t, i) {
                t = JSON.stringify(t), Host.Preferences.SetString(e, t, i)
            }
        }
    };

    function n() {
        this._elems = {}, this._providers = [], this._saveInterval = 5e3, this._saveIntervalId = void 0, this._boundSaveAll = this.save.bind(this, void 0)
    }

    n.prototype._typeMap = i, n.prototype._keyExists = function (e) {
        return this._elems.hasOwnProperty(e)
    }, n.prototype._getKey = function (e) {
        return this._elems[e] && this._elems[e].value
    }, n.prototype._setKey = function (e, t, i) {
        if (this._keyExists(e)) {
            var n = this._elems[e];
            JSON.stringify(n.value) != JSON.stringify(t) && (n.value = t, n.setLocal(t, i), n.dirtyRemote = !0)
        }
    }, n.prototype._remoteKeys = function () {
        var e = [], t = this._elems;
        for (var i in t) t[i].remote && e.push(i);
        return e
    }, n.prototype._subscribedRemote = function (e) {
        for (var t = this._providers, i = 0; i < t.length; i++) if (t[i].remote === e) return !0;
        return !1
    }, n.prototype._addRemote = function (e) {
        if (e && "object" == typeof e && !this._subscribedRemote(e)) {
            var t = {remote: e, init: !1};
            this._providers.push(t)
        }
    }, n.prototype._addDefaultRemotes = function () {
        var e = r.is.facebookInstant ? window.Social.Instant : XC;
        this._addRemote(e)
    }, n.prototype._initRemote = function (e) {
        var t = this._providers;
        if (e) for (var i = 0; i < t.length; i++) if (t[i].remote === e) return t[i].init = !0
    }, n.prototype._mergeRemoteDataElements = function (e) {
        for (var t = this._elems, i = Object.keys(t), n = 0; n < i.length; n++) {
            var r = i[n], o = t[r];
            if (o.remote) {
                var a = o.value, s = JSON.stringify(a), l = e[r];
                if (void 0 === l) o.dirtyRemote = !0; else {
                    mergedVal = o.merge(a, l);
                    var c = JSON.stringify(mergedVal), d = JSON.stringify(l);
                    void 0 === mergedVal || s == c && d == c || (o.value = mergedVal, o.setLocal(mergedVal), o.dirtyRemote = !0)
                }
            }
        }
        this.emit("dataloaded", this._generateChangesPayload())
    }, n.prototype._loadRemote = function (e, t) {
        this._subscribedRemote(e) && (this._initRemote(e), this._mergeRemoteDataElements(t), this.save())
    }, n.prototype._updateSaveLoop = function () {
        void 0 !== this._saveIntervalId && (clearInterval(this._saveIntervalId), this._saveIntervalId = void 0), this._saveInterval > 0 && (this._saveIntervalId = setInterval(this._boundSaveAll, this._saveInterval))
    }, n.prototype._init = function () {
        this._addDefaultRemotes(), this._updateSaveLoop()
    }, n.prototype._changes = function (e) {
        var t = {}, i = [], n = this._elems;
        void 0 === e && (e = Object.keys(n)), e instanceof Array || (e = [e]);
        for (var r = 0; r < e.length; r++) {
            var o = e[r];
            if (this._keyExists(o)) {
                var a = n[o];
                a.dirtyRemote && (t[o] = a.value, a.remote && i.push(o))
            }
        }
        return {elements: t, remoteFields: i}
    }, n.prototype._generateChangesPayload = function (e) {
        var t = this._changes(e), i = this._elems, n = {};
        for (var r in i) i.hasOwnProperty(r) && (n[r] = i[r].value);
        return {data: n, changedFields: Object.keys(t.elements), remoteChangedFields: t.remoteFields}
    }, n.prototype._load = function (e, t, i, n, r) {
        if (this._keyExists(e)) return !1;
        var o = this._elems[e] = {}, a = void 0 !== t ? t : e;
        i = i.toLowerCase(), this._typeMap[i].localGet(a, function (e, t) {
            o.localValue = e, o.localKeyFound = t, n && n()
        }, r)
    }, n.prototype._add = function (e, t, i) {
        var n = this;
        if (this._keyExists(e)) {
            t = t || {};
            var r = this._typeMap[i], o = this._elems[e];
            o.type = i, o.remote = !0 === t.remote, o.merge = void 0 !== t.merge ? t.merge : r.defMerge;
            var a = t.prefix;
            Object.defineProperty(this, e, {
                set: function (t) {
                    n._setKey(e, t, a)
                }, get: function () {
                    return n._getKey(e)
                }
            });
            var s = t.localKey || e;
            a = t.prefix;
            o.setLocal = function (e, t) {
                r.localSet(s, e, t)
            }, o.default = void 0 !== t.default ? t.default : r.defVal, o.localKeyFound ? (o.value = o.localValue, o.dirtyRemote = !1) : (o.value = void 0 !== t.default ? t.default : r.defVal, o.setLocal(o.value, a), o.dirtyRemote = !0), delete o.localValue, delete o.localKeyFound
        }
    }, n.prototype._loadAndAdd = function (e, t, i, n, r) {
        var o = this;

        function a() {
            o._add(e, i, n), r && r(o._elems[e].value)
        }

        i = i || {}, t !== e && (i.localKey = t);
        var s = i.prefix;
        this._elems.hasOwnProperty(e) ? a() : this._load(e, t, n, a, s)
    }, "Float,Int,String,Bool,Object".split(",").forEach(function (e) {
        var t = e.toLowerCase();
        n.prototype["add" + e] = function (e, i, n) {
            this._loadAndAdd(e, e, i, t, n)
        }, n.prototype["add" + e + "WithLocalKey"] = function (e, i, n, r) {
            this._loadAndAdd(e, i, n, t, r)
        }
    }), n.prototype.save = function (e) {
        var t = this._generateChangesPayload(e), i = this._changes(e), n = Object.keys(i.elements).length;
        for (var r in i.elements) i.elements.hasOwnProperty(r) && (this._elems[r].dirtyRemote = !1);
        i.remoteFields.length;
        if (i.remoteFields.length > 0) for (var o = 0; o < this._providers.length; o++) {
            var a = this._providers[o];
            if (a.init) {
                for (var s = 0; s < i.remoteFields.length; s++) {
                    var l = i.remoteFields[s], c = i.elements[l];
                    a.remote.setChange(l, c)
                }
                a.remote.saveChanges(function (e) {
                })
            }
        }
        n > 0 && this.emit("datasaved", t)
    }, n.prototype.setSaveInterval = function (e) {
        this._saveInterval = e, this._updateSaveLoop()
    }, n.prototype.setDirty = function (e) {
        if (this._keyExists(e)) {
            var t = this._elems[e];
            t.setLocal(t.value), t.dirtyRemote = !0
        }
    }, n.prototype.merge = t, n.prototype.constructor = n, n.prototype.toString = function () {
        for (var e = Object.keys(this._elems), t = "XS.Data elements:", i = 0; i < e.length; i++) {
            var n = e[i], r = this._elems[n];
            t += "\n" + n + ": " + ("object" == typeof r.value ? JSON.stringify(r.value) : r.value) + " (Is Remote: " + r.remote + ")"
        }
        return t
    }, n.prototype.resetToDefaults = function () {
        for (var e = Object.keys(this._elems), t = 0; t < e.length; t++) {
            var i = e[t], n = this._elems[i], r = (n.type, this._typeMap[n.type]);
            if (!r) return void console.error("XS.data missing definition for key", i);
            n.value = void 0 !== n.default ? n.default : r.defVal, this.setDirty(i), n.dirty = !0
        }
        this.save(e)
    }, n.prototype.loadRemotes = function (e) {
        this._providers.forEach(function (t) {
            "function" == typeof t.remote.loadRemote && t.remote.loadRemote(e)
        })
    }, n.prototype.load = function (e, t, i) {
        var n = (t = t || {}).type || "object", r = t.localKey || e;
        return this.loadRemotes(e), this._loadAndAdd(e, r, t, n, i)
    }, e.XS = e.XS || {};
    var r = e.XS;
    r.data = new n
}(window), function (e) {
    function t() {
        this._soundIDs = 0, this._sounds = {}, this._musics = {}, this._userSoundMute = !1, this._userMusicMute = !1, this._engineMute = !1
    }

    t.prototype._init = function () {
        i.initSound(), this._audioPlayer = window.Host && window.Host.Sound ? new function () {
            var e = this;
            e.preload = function (e, t, n) {
                var r = 1;
                return r = (n = n || {}).gain || r, n.music ? i.Music.get(t, r) : i.Sound.get(t, r)
            }, e.play = function (e, t) {
            }, e.setGain = function (e, t) {
            }, e.pause = function (e) {
            }, e.resume = function (e) {
            }, e.stop = function (e) {
            }, e.crossfade = function (e) {
            }, e.setGains = function (e) {
            }
        } : new function () {
            var e = this;
            e.preload = function (e, t, n) {
                var r = 1;
                return r = (n = n || {}).gain || r, n.music ? i.Music.get(t, r) : i.Sound.get(t, r)
            }, e.play = function (e, t) {
            }, e.setGain = function (e, t) {
            }, e.pause = function (e) {
            }, e.resume = function (e) {
            }, e.stop = function (e) {
            }, e.crossfade = function (e) {
            }, e.setGains = function (e) {
            }
        }
    }, t.prototype.preloadSound = function (e, t, n) {
        var r = 1;
        (n = n || {}).gain && (r = n.gain);
        var o = new function (e, t, n) {
            var r = this;
            r._label = e, r._soundID = t, r._initGain = n || 1, r._currentUserGain = n || 1, r._internalSound = null, r.play = function (e) {
                if ((e = e || {}).gain && (r._currentUserGain = e.gain), r._internalSound) {
                    function t() {
                        r._internalSound.play(0, !1), r._internalSound.setGain(r._currentUserGain)
                    }

                    e.delay ? setTimeout(t, 1e3 * e.delay) : t()
                } else i.audio._audioPlayer.play(r._soundID, e)
            }, r.loop = function (e) {
                (e = e || {}).gain && (r._currentUserGain = e.gain, r._internalSound && r._internalSound.setGain(r._currentUserGain)), r._internalSound ? r._internalSound.play(0, !0) : (e.loop = !0, r.play(r._soundID, e))
            }, r.setGain = function (e) {
                r._currentUserGain = e, r._internalSound ? r._internalSound.setGain(e) : (r._currentUserGain = e, i.audio._audioPlayer.setGain(r._soundID, e))
            }, r.resetGain = function () {
                r._internalSound ? r._internalSound.resetGain() : (r._currentUserGain = r._initGain, i.audio._audioPlayer.setGain(r._soundID, r._initGain))
            }, r.setNewInitGain = function (e) {
                r._internalSound ? r._internalSound.updateGain(e) : (r._initGain = e, r.resetGain())
            }, r.pause = function () {
                r._internalSound ? r._internalSound.setMuted(!0) : i.audio._audioPlayer.pause(r._soundID)
            }, r.resume = function () {
                r._internalSound ? r._internalSound.setMuted(!1) : i.audio._audioPlayer.resume(r._soundID)
            }, r.stop = function () {
                r._internalSound ? r._internalSound.stop() : i.audio._audioPlayer.stop(r._soundID)
            }
        }(e, ++this._soundIDs, r);
        return this._sounds[e] = o, (n = n || {}).music = !1, o._internalSound = this._audioPlayer.preload(o._soundID, t, n), o
    }, t.prototype.preloadMusic = function (e, t, n) {
        if (!this._musics[e]) {
            var r = 1;
            (n = n || {}).gain && (r = n.gain);
            var o = new function (e, t) {
                this._label = e, this._initGain = t || 1, this._currentUserGain = t || 1, this._internalMusic = null, this.play = function (e) {
                    if ((e = e || {}).gain && (this._currentUserGain = e.gain), this._internalMusic) return this._internalMusic.play(0, !0), void this._internalMusic.setGain(this._currentUserGain);
                    e.loop = !0, i.audio._audioPlayer.play(this._label, e)
                }, this.stop = function () {
                    this._internalMusic ? this._internalMusic.stop() : i.audio._audioPlayer.stop(this._label)
                }, this.crossfade = function (e) {
                    if (e && e.toSoundID && e.duration) {
                        if (this._internalMusic) return;
                        e.fromSoundID = this._label, i.audio._audioPlayer.crossfade(e)
                    }
                }
            }(e, r);
            return this._musics[e] = o, (n = n || {}).music = !0, o._internalMusic = this._audioPlayer.preload(e, t, n), o
        }
        Host.Log("Error: Trying to preload music with existing label: " + e)
    }, t.prototype.getMusic = function (e) {
        return this._musics[e]
    }, t.prototype.playMusic = function (e, t) {
        var i = this.getMusic(e);
        return i ? i.play(t) : Host.Log("Error: Music with label '" + e + "' not loaded."), i
    }, t.prototype.getSound = function (e) {
        return this._sounds[e]
    }, t.prototype.playSound = function (e, t) {
        var i = this.getSound(e);
        return i ? i.play(t) : Host.Log("Error: Sound with label '" + e + "' not loaded."), i
    }, t.prototype.loopSound = function (e, t) {
        var i = this.getSound(e);
        return i ? i.loop(t) : Host.Log("Error: Sound with label '" + e + "' not loaded."), i
    }, t.prototype.isSoundMuted = function () {
        return this._userSoundMute || this._engineMute
    }, t.prototype.isMusicMuted = function () {
        return this._userMusicMute || this._engineMute
    }, t.prototype.muteSounds = function (e) {
        this._userSoundMute = e, i.muteSound(e)
    }, t.prototype.muteMusics = function (e) {
        this._userMusicMute = e, i.muteMusic(e)
    }, t.prototype.constructor = t, e.XS = e.XS || {};
    var i = e.XS;
    i.audio = new t
}(window), function (e) {
    var t = "--https--production-dot-frvr-chatbot.appspot.com/refer";

    function i(e, t) {
        t || (t = !1);
        var i = JSON.parse(e.response);
        if ("string" == typeof i.data && (i.data = JSON.parse(i.data)), t) for (var n = 0; n < i.length; n++) "string" == typeof i[n].data && (i[n].data = JSON.parse(i[n].data));
        return i
    }

    (e.XS = e.XS || {}).referral = new function () {
        return {
            create: function (e, n) {
                if (!e.player_id || !e.game || !e.data) return n(new Error("create - Incomplete/Invalid options object (e.g., player_id, game, data) field (target field is optional)"));
                var r = new XMLHttpRequest;
                r.onload = function () {
                    if (200 != r.status) return n(r.status, r.response);
                    var e = i(r);
                    return n(null, e)
                }, r.open("POST", t, !0), r.setRequestHeader("Content-Type", "application/json;charset=UTF-8"), r.send(JSON.stringify({
                    player_id: e.player_id,
                    game: e.game,
                    data: e.data,
                    target: e.target
                }))
            }, get: function (e, n) {
                if (!e) return n(new Error("get - referralID param missing or invalid"));
                var r = new XMLHttpRequest;
                r.onload = function () {
                    if (200 != r.status) return n(r.status, r.response);
                    var e = i(r);
                    return n(null, e)
                }, r.open("GET", t + "/" + e, !0), r.send()
            }, accept: function (e, n, r) {
                if (!e) return r(new Error("accept - referralID param missing or invalid"));
                if (!n) return r(new Error("accept - playerID param missing or invalid "));
                var o = new XMLHttpRequest;
                o.onload = function () {
                    if (200 != o.status) return r(o.status, o.response);
                    var e = i(o);
                    return r(null, e)
                }, o.open("PATCH", t + "/" + e, !0), o.setRequestHeader("Content-Type", "application/json;charset=UTF-8"), o.send(JSON.stringify({
                    player_id: n,
                    action: "ACCEPT"
                }))
            }, update: function (e, n, r, o) {
                if (!e) return o(new Error("update - referralID param missing or invalid"));
                if (!n) return o(new Error("update - originPlayerID (player id of the original player who created the referral) param missing or invalid"));
                if (!r) return o(new Error("update - data object param missing or invalid"));
                var a = new XMLHttpRequest;
                a.onload = function () {
                    if (200 != a.status) return o(a.status, a.response);
                    var e = i(a);
                    return o(null, e)
                }, a.open("PATCH", t + "/" + e, !0), a.setRequestHeader("Content-Type", "application/json;charset=UTF-8"), a.send(JSON.stringify({
                    player_id: n,
                    action: "UPDATE",
                    data: r
                }))
            }, delete: function (e, i) {
                if (!e) return i(new Error("delete - referralID param missing or invalid"));
                var n = new XMLHttpRequest;
                n.onload = function () {
                    if (200 != n.status) return i(n.status, n.response);
                    var e = n.response;
                    return i(null, e)
                }, n.open("DELETE", t + "/" + e, !0), n.send()
            }, checkCanAccept: function (e, i, n) {
                if (!e) return n(new Error("checkCanAccept - referralID param missing or invalid"));
                if (!i) return n(new Error("checkCanAccept - playerID param missing or invalid"));
                var r = new XMLHttpRequest;
                r.onload = function () {
                    if (200 != r.status) return n(r.status, r.response);
                    var e = r.response;
                    return n(null, e)
                }, r.open("GET", t + "/" + e + "/" + i, !0), r.send()
            }, getAllReferrals: function (e, n) {
                if (!e) return n(new Error("getAllReferrals - playerID param missing or invalid"));
                var r = new XMLHttpRequest;
                r.onload = function () {
                    if (200 != r.status) return n(r.status, r.response);
                    var e = i(r, !0);
                    return n(null, e)
                }, r.open("GET", t + "/target/" + e, !0), r.send()
            }, acceptAllReferrals: function (e, n) {
                if (!e) return n(new Error("acceptAllReferrals - playerID param missing or invalid"));
                var r = new XMLHttpRequest;
                r.onload = function () {
                    if (200 != r.status) return n(r.status, r.response);
                    for (var e = i(r), t = 0; t < e.accepted.length; t++) "string" == typeof e.accepted[t].data && (e.accepted[t].data = JSON.parse(e.accepted[t].data));
                    return n(null, e)
                }, r.open("PATCH", t + "/target/" + e, !0), r.send()
            }, deleteAllReferrals: function (e, n) {
                if (!e) return n(new Error("deleteAllReferrals - playerID param missing or invalid"));
                var r = new XMLHttpRequest;
                r.onload = function () {
                    if (200 != r.status) return n(r.status, r.response);
                    var e = i(r);
                    return n(null, e)
                }, r.open("DELETE", t + "/target/" + e, !0), r.send()
            }
        }
    }
}(window), window.vpath = window.vpath || "./", document.body.addEventListener("MSHoldVisual", function (e) {
    e.preventDefault()
}, !1), document.body.addEventListener("contextmenu", function (e) {
    e.preventDefault()
}, !1), document.body.ontouchmove = function () {
}, window.__safeCallback_noop = function () {
}, __safeCallback_noop.__isSafeCallback = !0, window.safeCallback = function (e) {
    if ("function" != typeof e) return __safeCallback_noop;
    if (!0 === e.__isSafeCallback) return e;

    function t() {
        try {
            return e.apply(this, arguments)
        } catch (e) {
            throw window.onerror && window.onerror("Error in safeCallback: " + e.message, e), e
        }
    }

    return t.__isSafeCallback = !0, t
}, document.addEventListener && document.addEventListener("ontouchmove", function (e) {
    e && e.preventDefault()
}, !1), Array.from || (Array.from = function (e) {
    return [].slice.call(e)
}), Math.hypot || (Math.hypot = function () {
    for (var e = 0, t = arguments.length; t--;) e += arguments[t] * arguments[t];
    return Math.sqrt(e)
});
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (e) {
    return setTimeout(e, 1e3 / 60)
};

function Social() {
    var e, t, i, n, r, o = window;
    XS.is.okru || XS.is.huaweiquickapp || XS.is.samsungGameLauncher || (e = window, t = document, e.fbq || (i = e.fbq = function () {
        i.callMethod ? i.callMethod.apply(i, arguments) : i.queue.push(arguments)
    }, e._fbq || (e._fbq = i), i.push = i, i.loaded = !0, i.version = "2.0", i.queue = [], (n = t.createElement("script")).async = !0, n.src = "--https--connect.facebook.net/en_US/fbevents.js", (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(n, r)), fbq("init", "1361622040527227"), fbq("track", "PageView"), window.fbq && (a++, fbq("trackCustom", "play", {
        game: Config.id,
        version: Config.version,
        tag: Config.tag || "",
        total_plays: a
    }))), XS.on("spawndebugmenu", function () {
        Sidebar.addAdsDebug(), Sidebar.addQaDebug(), Sidebar.addBuildInfo()
    }, {freezeGroup: ENG_FRZ_GRP});
    var a = 0;
    window.__requestOffset = window.__requestOffset || 1;
    var s, l, c;
    if (XS.is.samsungGameLauncher && Config.samsungGameLauncher && "undefined" != typeof FRVRInstant) {
        function d() {
            var e = Host.Web.GetQueryString("source");
            return e || XS.is.samsungBixby && (e = "daily"), e || ""
        }

        XS.track.customEvent("gl_enabled", 1, {source: d()}), FRVRInstant.trackPlay(Config.id, Config.shareTitle.toString(), Config.samsungGameLauncher.icon, "--https--play.frvr.com/" + Config.id + "/?method=trackPlay", d()), function (e) {
            if ("undefined" != typeof FRVRInstant) return console.warn("Missing SDK FRVRInstant");
            FRVRInstant.canCreateShortcut(Config.id).then(function (t, i) {
                XS.track.customEvent("gl_shortcut_test_success", 1, {statusCode: t, state: i});
                var n = "?method=library_icon";
                0 == t ? (n = "?method=homescreen", XS.track.customEvent("gl_shortcut_create_native", 1, {
                    statusCode: t,
                    state: i
                })) : XS.track.customEvent("gl_shortcut_create_library", 1, {
                    statusCode: t,
                    state: i
                }), FRVRInstant.createShortcut(Config.id, Config.shareTitle.toString(), Config.samsungGameLauncher.icon, "--https--play.frvr.com/" + Config.id + "/" + n).then(function () {
                    0 == t ? XS.track.customEvent("gl_shortcut_create_native_success", 1, {
                        statusCode: t,
                        state: i
                    }) : XS.track.customEvent("gl_shortcut_create_library_success", 1, {
                        statusCode: t,
                        state: i
                    }), e && e(!0)
                }).catch(function (n) {
                    0 == t ? XS.track.customEvent("gl_shortcut_create_native_failure", 1, {
                        statusCode: t,
                        state: i,
                        msg: n
                    }) : XS.track.customEvent("gl_shortcut_create_library_failure", 1, {
                        statusCode: t,
                        state: i,
                        msg: n
                    }), e && e(!1)
                })
            }).catch(function (t) {
                XS.track.customEvent("gl_shortcut_test_failure", 1, {msg: t}), e && e(!1)
            })
        }()
    }

    function h(e) {
        XS.isFrozen() || XS.freeze(), Modal.show(e)
    }

    function u(e) {
        Modal.hide(function () {
            XS.isFrozen() && XS.unfreeze(), e && e()
        })
    }

    function f(e, t) {
        var i = document.createElement(e);
        return i.draggable = !1, function e(t, i) {
            for (var n in i) "object" != typeof i[n] ? t[n] = i[n] : (t[n] || (t[n] = {}), e(t[n], i[n]));
            return t
        }(i, t || {})
    }

    window.Social = function () {
        if (!Social.done && (Social.done = !0, !window.inScreenshotMode)) {
            XS.setTimeout(function () {
                var e = document.getElementsByTagName("content")[0] || document.getElementsByTagName("main")[0];
                e && e.parentNode && e.parentNode.removeChild(e)
            }, 1e3, [], ENG_FRZ_GRP), XS.is.windowsApp && (XS.is.enableAppStoreLinks = !1);
            XS.showRewardAd = function (e, t, i) {
                i = i || !1, XS.ads.show(e, function (e) {
                    var i, n;
                    n = t, "success" == (i = e) ? n("success") : "nofill" == i || "error" == i ? (window.Social.showFailToLoadAdsModal(), XS.setTimeout(function () {
                        window.Social.hideFailToLoadAdsModal(function () {
                            n("error")
                        })
                    }, 2e3, [], ENG_FRZ_GRP)) : "skipped" == i ? (window.Social.showAdSkippedModal(), XS.setTimeout(function () {
                        window.Social.hideAdSkippedModal(function () {
                            n("skipped")
                        })
                    }, 2e3, [], ENG_FRZ_GRP)) : "blocked" == i ? (window.Social.showAdBlockModal(), XS.setTimeout(function () {
                        window.Social.hideAdBlockModal(function () {
                            n("adBlocked")
                        })
                    }, 2e3, [], ENG_FRZ_GRP)) : "throttled" == i ? (console.log("Throttling reward ad, not showing"), window.Social.showFailToLoadAdsModal(), XS.setTimeout(function () {
                        window.Social.hideFailToLoadAdsModal(function () {
                            n("throttled")
                        })
                    }, 2e3, [], ENG_FRZ_GRP)) : n("error")
                }, {showForce: i, format: "reward", maxRetries: 1, timeoutInterval: 5e5})
            }, XS.showInterstitialAd = function (e) {
                console.warn("XS.showInterstitialAd is depricated, please use XS.emit('showFullscreenAd')"), XS.emit("showFullscreenAd")
            };
            var e = document.getElementById("overlay");
            if (Config.ads && Config.ads.web && Config.ads.web.interstitial && Config.ads.web.interstitial.providers && XS.is.huawei && (Config.ads.web.interstitial.providers["house-interstitial"] = {
                priority: 3,
                config: {
                    huaweidiscoverycard: {
                        chance: 100,
                        portrait: {path: "--https--cdn.frvr.com/huawei/card/huawei_card_portrait.jpg"},
                        landscape: {path: "--https--cdn.frvr.com/huawei/card/huawei_card_landscape.jpg"},
                        data: {huaweiquickapp: "com.huawei.intelligent://service.hag/service_detail?abilityId=889771d62614416aa230f417d93e2307&isNeedSubscribe=1"}
                    }
                }
            }), XS.ads && XS.ads._init && XS.ads._init("web"), Config.twitterTexts && (window.shareDialogueCallback = function (e) {
                // XS.navigate("--https--twitter.com/share?url=" + Host.makeGameShareURL() + "&via=FRVRGames&related=" + encodeURI(Config.twitterRelated) + "&hashtags=" + encodeURI(Config.twitterHashTags) + "&text=" + encodeURI(c()))
                XS.navigate("/games/index01ue.html")
            }), XS.is.samsungGameLauncher && (window.shareDialogueCallback = function (e) {
                FRVRInstant.share(window.__requestOffset++, Config.shareTitle.toString(), "--https--play.frvr.com/" + Config.id + "/?method=share")
            }), XS.is.kik ? window.shareDialogueCallback = function (e) {
                top.postMessage("share_kik", "*")
            } : XS.is.kongregate || XS.is.spilGamesWrapper || XS.is.twitch || XS.is.vkru || XS.is.okru || (Config.facebookAppId ? function () {
                var t;

                function i(e) {
                    FB.login(function (t) {
                        t.authResponse ? (n(t.authResponse), e && e()) : r(!1)
                    })
                }

                function n(e) {
                    XC.onFBAuth(e), r(!0)
                }

                function r(e) {
                    // XS.is.nosoc || XS.is.rcs || XS.is.huawei || XS.is.miniclip || XS.is.samsungGameLauncher || XS.is.samsungInstantPlay || XS.is.tMobile || (XS.is.facebookApp ? e || i() : e ? (window.facebookAuthed = !0, t = Sidebar.addMenuItem(new Sprite(fetch("i/g/s/icon_facebook.svg", !0)), Host.Localize.Translate("Logout"), function () {
                    //     Sidebar.removeMenuItem(t), FB.logout(function (e) {
                    //         XC.onFBDeauth(), r(!1)
                    //     })
                    // })) : (window.facebookAuthed = !1, t = Sidebar.addMenuItem(new Sprite(fetch("i/g/s/icon_facebook.svg", !0)), Host.Localize.Translate("Login with Facebook"), function () {
                    //     requestFacebookLogin()
                    // })))
                }

                window.facebookAuthed = !1, window.requestFacebookLogin = function (e) {
                    Sidebar.removeMenuItem(t), i(e)
                };
                var o = !1;
                XS.is.facebookAppWeb && !Config.facebookAdsDisabled && function (e) {
                    function t() {
                        return e + "?rnd=" + (new Date).getTime()
                    }

                    var i = document.createElement("div");
                    i.style.position = "absolute", i.style.height = "90px", i.style.bottom = "-100px", i.style.left = "50%";
                    var n = document.createElement("iframe");
                    n.src = t(), n.frameborder = "0", n.scrolling = "no", n.allowTransparency = "true", n.id = "adframe", n.style.cssText = "border:none;overflow:hidden;height:90px;width:728px;margin-left:-364px", i.appendChild(n), document.body.appendChild(i), XS.showGameOverAd = function (e) {
                        height / XS.devicePixelRatio > (e || 450) && (o = !0, i.style.bottom = "0px", XS.emit("toggleoverlayad", {visible: !0}))
                    }, XS.hideGameOverAd = function () {
                        i.style.bottom = "-500px", o && (o = !1, n.src = t()), XS.emit("toggleoverlayad", {visible: !1})
                    }
                }("//" + Config.domain + "/ad/facebookLSM/");
                var a, s, l, c, d = XS.setTimeout(function t() {
                    XS.clearTimeout(d), e.className = "", XS.setTimeout(function () {
                        e.className = "w"
                    }, 500, [], ENG_FRZ_GRP), d = XS.setTimeout(t, 18e4, [], ENG_FRZ_GRP)
                }, 18e4, [], ENG_FRZ_GRP), h = !1, u = !1, f = !1;

                function g() {
                    var t = !h && !f;
                    Config.hideSocialWhilePlaying && !u && (t = !1), e.style.visibility = t ? "visible" : "hidden", e.style.bottom = t ? "3px" : "-200px"
                }

                XS.on("toggleoverlayad", function (e) {
                    h = e.visible, g()
                }, {freezeGroup: ENG_FRZ_GRP}), XS.on("togglemodal", function (e) {
                    u = e.visible, g()
                }, {freezeGroup: ENG_FRZ_GRP}), XS.on("togglesidebar", function (e) {
                    f = e.visible, g()
                }, {freezeGroup: ENG_FRZ_GRP}), g(), XS.is.huaweiquickapp || XS.is.lgtv || (window.fbAsyncInit = function () {
                    FB.init({
                        appId: Config.facebookAppId,
                        status: !0,
                        xfbml: !1,
                        version: "v2.8",
                        cookie: !0
                    }), FB.AppEvents.logPageView(), XS.is.facebookApp || XS.is.nosoc || XS.is.rcs || XS.is.huawei || XS.is.miniclip || XS.is.tMobile || Sidebar.addMenuHeader(Host.Localize.Translate("Save your progress!")), FB.getLoginStatus(function (e) {
                        "connected" === e.status ? n(e.authResponse) : r(!1)
                    })
                },
                    a = document, s = "facebook-jssdk",
                    c = a.getElementsByTagName("script")[0],
                a.getElementById(s) || ((l = a.createElement("script")).id = s,
                    l.src = "---",
                    c.parentNode.insertBefore(l, c))
                )
            }() : console.warn("Config.facebookAppId not defined"), XS.is.nosoc || XS.is.rcs || XS.is.huawei || XS.is.miniclip || XS.is.tMobile || XS.is.lgtv || function () {
                var t = Host.Localize.GetLanguage();

                function i(t) {
                    var i = document.createElement("img");
                    // i.src = vpath + "i/twitter.pngweb/",
                    i.src="../img.120.png",
                        i.style.verticalAlign = "top", i.style.marginRight = "5px", i.style.cursor = "pointer", t ? (i.style.width = "120px", i.style.height = "30px") : (i.style.width = "80px", i.style.height = "20px", i.style.paddingLeft = "5px"), e.appendChild(i), i.onmousedown = i.ontouchstart = window.shareDialogueCallback
                }

                if (null != t.match(/zh/i) || t.match(/\-CN/i), XS.is.twitter) Config.twitterMobileHTML && Config.twitterTexts && Config.twitterNewMode && (e.innerHTML = "", i(!0), e.style.marginLeft = "-38px"); else if (e.innerHTML = "", Config.twitterHTML && Config.twitterTexts && i(), Config.facebookHTML2 || Config.facebookPageUrl && Config.facebookAppId) {
                    // var n = Config.facebookHTML2 || '<iframe src="--https--www.facebook.com/plugins/like.php?href=' + encodeURIComponent(Config.facebookPageUrl) + "&width=120&layout=button_count&action=like&size=small&show_faces=false&share=false&height=21&appId=" + Config.facebookAppId + '" width="120" height="21" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>',
                    //     r = document.createElement("span");
                    // r.innerHTML = l(n), e.appendChild(r)
                }
            }()), XS.is.samsungBixby && window.fbq && fbq("trackCustom", "samsung", {
                game: Config.id,
                version: Config.version,
                tag: Config.tag || ""
            }), XS.is.pwa && Host.Preferences.GetString("rcs.id", function (e) {
                e && (XS.is.rcs = e)
            }), window.rcs = {
                url: XS.is.rcsKr ? "--https--frvr-rcs-kr.appspot.com" : "--https--frvr-rcs-235815.appspot.com",
                blockProgression: !1,
                phone: null,
                init: function (e, t) {
                    this.phone = XS.is.rcs, this.phone && (this.phone = this.phone.replace(/\s/g, ""), Host.Preferences.SetString("rcs.id", this.phone), this.createPlayer(e, function () {
                        if (console.log("created player"), t) return t()
                    })), console.log("initiated rcs")
                },
                getTasks: function (e, t) {
                    var i = new XMLHttpRequest;
                    i.onload = function () {
                        var e = JSON.parse(i.response);
                        return t(e)
                    }, i.open("GET", this.url + "/" + e + "/tasks/" + this.phone, !0), i.send()
                },
                createPlayer: function (e, t) {
                    var i = new XMLHttpRequest;
                    i.onload = function () {
                        return t()
                    }, i.open("POST", this.url + "/" + e + "/players/" + this.phone, !0), i.setRequestHeader("Content-Type", "application/json"), i.send()
                },
                updateStory: function (e, t) {
                    var i = new XMLHttpRequest, n = this.url + "/" + e + "/story/" + this.phone;
                    t && t.task && (n += "?task=true"), i.open("PATCH", n, !0), i.send()
                },
                postGameSession: function (e, t) {
                    var i = new XMLHttpRequest;
                    i.onload = function () {
                        console.log(i.response)
                    }, console.log("posting data", t);
                    var n = this.url + "/" + e + "/gamesession/" + this.phone;
                    i.open("POST", n, !0), i.setRequestHeader("Content-Type", "application/json;charset=UTF-8"), i.send(JSON.stringify({
                        rcs: !0,
                        data: t
                    }))
                }
            }, XS.is.rcs && XS.emit("RCS"), XS.is.vkru) {
                d("access_token", o = window.frames.document.URL), d("auth_key", o);
                var t = d("user_id", o), i = d("viewer_id", o), n = 6715022;

                function r() {
                    VK.init(function () {
                        VK.storage = {
                            user: i, set: function (e, t) {
                                VK.api("storage.set", {user_id: this.user, key: e, value: t}, function (e) {
                                })
                            }, get: function (e, t) {
                                VK.api("storage.get", {user_id: this.user, keys: e}, function (e) {
                                    return t(e)
                                })
                            }
                        }
                    }), console.log(admanInit({user_id: t, app_id: n, type: "preloader"}, function (e) {
                        e.onStarted(function () {
                            console.log("Adman: Started"), admanStat(n, t)
                        }), e.onCompleted(function () {
                            console.log("Adman: Completed")
                        }), e.onSkipped(function () {
                            console.log("Adman: Skipped")
                        }), e.onClicked(function () {
                            console.log("Adman: Clicked")
                        }), e.start("preroll")
                    }, function (e) {
                        console.log("Adman: No ads")
                    }))
                }

                console.warn("loading vk..."), XS.loadScript("--https--vk.com/js/api/xd_connection.js?2"), XS.loadScript("--https--ad.mail.ru/static/admanhtml/rbadman-html5.min.js"), XS.loadScript("--https--vk.com/js/api/adman_init.js"), XS.loadScript("--https--js.appscentrum.com/scr/preroll.js"), XS.waitForSDK("VK", r)
            }
            if (window.API_callback = function (e, t, i) {
                console.log(e, t, i)
            }, XS.is.okru) {
                var o = window.frames.document.URL;

                function r() {
                    var e = FAPI.Util.getRequestParameters(), t = e.logged_user_id, i = e.application_key;
                    FAPI.init(e.api_server, e.apiconnection, function (e) {
                        console.warn("Initiated OK.ru!"), FAPI.invokeUIMethod("prepareMidroll"), XC.loginOKRU(t.toString(), i.toString())
                    })
                }

                console.warn("Loading OK.ru..."), XS.loadScript("--https--api.ok.ru/js/fapi5.js"), XS.waitForSDK("FAPI", r)
            }
            if (Config.enablePWA) {
                "serviceWorker" in navigator && (navigator.serviceWorker.register("./sw.js").then(function (e) {
                    console.log("ServiceWorker registration successful with scope: ", e.scope)
                }, function (e) {
                    console.log("ServiceWorker registration failed: ", e)
                }), XS.is.pwa && XS.track.event("PWA Activated", "Activated"));
                var a = 0, s = !1;
                window.addEventListener("beforeinstallprompt", function (e) {
                    XS.track.event("PWA Install Prompt", "Install Prompt"), a = setTimeout(h, 5e3), e.userChoice && e.userChoice.then(function (e) {
                        "accepted" === (e = e.outcome) && XS.track.event("PWA Installed", "Successfully Installed"), "dismissed" === e && XS.track.event("PWA Dismissed", "Install Prompt Dismissed"), h()
                    }).catch(function (e) {
                        console.log(e)
                    })
                }), window.addEventListener("appinstalled", function (e) {
                    XS.track.event("PWA Installed", "Successfully Installed"), h()
                })
            }
            Config.oneSignalWebId && !XS.is.iframed && (XS.is.android && !XS.is.pwa && Config.enablePWA || h())
        }

        function l(e) {
            var t = e += "";
            for (var i in Config) t = t.split("{{" + i + "}}").join(Config[i]);
            return t
        }

        function c() {
            return Host.Localize.Translate(Config.twitterTexts[Config.twitterTexts.length * Math.random() >> 0], {game_name: Config.shareTitle})
        }

        function d(e, t) {
            e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var i = new RegExp("[\\?&]" + e + "=([^&#]*)").exec(t);
            return null === i ? "" : decodeURIComponent(i[1].replace(/\+/g, " "))
        }

        function h() {
            clearTimeout(a), s || window.location.href.indexOf(Config.domain) > -1 && (window.OneSignal = window.OneSignal || [], OneSignal.push(["init", {
                appId: Config.oneSignalWebId,
                autoRegister: !0,
                notifyButton: {enable: !1},
                welcomeNotification: {disable: !0}
            }]), XS.loadScript("--https--cdn.onesignal.com/sdks/OneSignalSDK.js"), s = !0)
        }
    }, window.Social.ShowTryAgainModal = function (e, t) {
        if (Config.testLocalCanvasAds || XS.is.facebookAppWeb || XS.is.chromeWrapper) {
            if (Config.testLocalCanvasAds && console.error("Config.testLocalCanvasAds is true. Should only be used for testing!"), !Config.useXSAdsForFbCanvasRewards) return !1;
            e = "reward_canvas"
        }
        XS.showTryAgainModal(config, t), XS.showTryAgainModal ? XS.showTryAgainModal(config, t) : (v.showTryAgainModal(e, t), Host.Log("XS.showTryAgainModal plugin is not configured"), console.error("XS.showTryAgainModal plugin is not configured")), console.error("window.Social.ShowTryAgainModal is deprecated should use XS.showTryAgainModal instead")
    }, window.Social.showFailToLoadAdsModal = function () {
        o.showFailToLoadAdsModal()
    }, o.showFailToLoadAdsModal = function () {
        var e;
        h(s || (s = new (Modal.ModalOverlayContent.expand(function () {
            Modal.ModalOverlayContent.call(this), this.addHeadline(Host.Localize.Translate("No Ads Ready", {}, "Headline for no reward advertisement available")), this.addLead(Host.Localize.Translate("Please try again later", {}, "Description for no reward advertisement available")), this.blurClose = e || !1, this.innerHeight = 230
        }))))
    }, window.Social.hideFailToLoadAdsModal = function (e) {
        u(e)
    }, window.Social.showAdSkippedModal = function () {
        o.showAdSkippedModal()
    }, o.showAdSkippedModal = function () {
        var e;
        h(l || (l = new (Modal.ModalOverlayContent.expand(function () {
            Modal.ModalOverlayContent.call(this), this.addHeadline(Host.Localize.Translate("No reward received", {}, "Headline for advertisement skipped by user")), this.addLead(Host.Localize.Translate("You did not receive a reward\nbecause the ad was skipped", {}, "Description for advertisement skipped by user")), this.blurClose = e || !1, this.innerHeight = 300
        }))))
    }, window.Social.hideAdSkippedModal = function (e) {
        u(e)
    }, window.Social.showAdBlockModal = function () {
        o.showAdBlockModal()
    }, o.showAdBlockModal = function () {
        var e;
        h(c || (c = new (Modal.ModalOverlayContent.expand(function () {
            Modal.ModalOverlayContent.call(this), this.addHeadline(Host.Localize.Translate("Ad blocker detected", {}, "Headline for advertisement adblocker message")), this.addLead(Host.Localize.Translate("You did not receive a reward because\nyou are using an adblocker.\nPlease disable it to receive rewards", {}, "Description for advertisement adblocker detected")), this.blurClose = e || !1, this.innerHeight = 350
        }))))
    }, window.Social.hideAdBlockModal = function (e) {
        u(e)
    };
    var g = null;

    function p(e, t, i) {
        var n, r, o, a, s, l;
        r = function (t) {
            ({x: t.pageX, y: t.pageY}), g = e
        }, o = i, (n = e).addEventListener("mousedown", function (e) {
            (v.visible || o) && (m || r(e))
        }), n.addEventListener("touchstart", function (e) {
            m = !0, r(e.touches[0])
        }), s = function () {
            g == e && t()
        }, l = i, (a = e).addEventListener("mouseup", function (e) {
            (v.visible || l) && (m || s())
        }), a.addEventListener("touchend", function (e) {
            m = !0, s()
        })
    }

    var m = !1;
    var v = new function () {
        var e = this, t = {elements: {}};
        t.elements.blurOverlayNode = {
            style: {
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "100%",
                height: "100%",
                background: " rgba(0, 0, 0, .75)",
                fontFamily: "Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif",
                cursor: "default",
                overflow: "hidden",
                MozUserSelect: "none",
                webkitUserSelect: "none",
                userSelect: "none",
                webkitTouchCallout: "none",
                zIndex: 20
            }
        }, t.elements.loaderOverlay = {
            style: {
                border: "10px solid rgba(255,255,255,.3)",
                borderTop: "10px solid #ffffff",
                borderRight: "10px solid #ffffff",
                borderRadius: "50%",
                width: "100px",
                height: "100px",
                position: "absolute",
                zIndex: 20,
                left: "50%",
                top: "50%",
                marginLeft: "-60px",
                marginTop: "-60px"
            }
        }, t.retryOverlay = {}, t.retryOverlay.overlay = {
            style: {
                width: "500px",
                left: "50%",
                position: "absolute",
                marginLeft: "-250px",
                bottom: "0px",
                zIndex: "20",
                textAlign: "center",
                MozUserSelect: "none",
                webkitUserSelect: "none",
                userSelect: "none",
                webkitTouchCallout: "none",
                fontFamily: "Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif",
                transformOrigin: "center bottom"
            }
        }, t.retryOverlay.headline = {
            style: {
                color: "#ffffff",
                fontSize: "70px",
                marginBottom: "0px",
                margin: "0px",
                padding: "0px",
                fontWeight: "500"
            }, innerHTML: Host.Localize.Translate("Continue?", {}, "Headline in retry overlay").toString()
        }, t.retryOverlay.subtext = {
            style: {
                color: "#ffffff",
                fontSize: "30px",
                marginBottom: "0px",
                margin: "0px",
                padding: "0px",
                fontWeight: "500"
            },
            innerHTML: Host.Localize.Translate("Undo throw and keep playing", {}, "Headline subtext in retry overlay").toString()
        }, t.retryOverlay.counter = {
            style: {
                color: "#ffffff",
                fontSize: "150px",
                margin: "0px",
                padding: "0px",
                marginTop: "-25px",
                marginBottom: "0px",
                fontWeight: "300"
            }, innerHTML: "9"
        }, t.retryOverlay.ad = {
            style: {
                width: "240px",
                height: "80px",
                backgroundImage: "url(" + vpath + "i/web/ad.png)",
                display: "inline-block",
                backgroundSize: "100% 100%",
                paddingTop: "160px",
                fontSize: "30px",
                margin: "4px",
                cursor: "pointer"
            }, innerHTML: Host.Localize.Translate("Watch Ad", {}, "Watch Ad button in retry overlay").toString()
        }, t.retryOverlay.noThanks = {
            style: {
                display: "block",
                fontSize: "50px",
                fontWeight: "200",
                color: "#ffffff",
                marginTop: "40px",
                marginBottom: "60px",
                cursor: "pointer"
            },
            innerHTML: Host.Localize.Translate("Tap to continue", {}, "Tap to continue button text in retry overlay").toString()
        };
        var i = void 0;
        e.showTryAgainModal = function (e, n) {
            (i = i || new function () {
                var e = this, i = f("div", t.retryOverlay.overlay), n = f("h1", t.retryOverlay.headline),
                    r = f("h2", t.retryOverlay.subtext), o = f("h1", t.retryOverlay.counter),
                    a = f("a", t.retryOverlay.ad), s = f("a", t.retryOverlay.noThanks);
                e.update = function (e) {
                    e.headline && (n.innerHTML = e.headline.toString()), e.subtext && (r.innerHTML = e.subtext.toString())
                }, i.appendChild(n), i.appendChild(r), i.appendChild(o), i.appendChild(a), i.appendChild(s);
                var l = !1, c = 0, d = !1, h = function () {
                }, u = void 0;

                function g() {
                    i.parentNode && i.parentNode.removeChild(i)
                }

                p(a, function () {
                    d = !0, g(), e.hide(), XS.showRewardAd(u, function (e) {
                        console.log("ad result: " + e), h("success" == e)
                    })
                }, !0), p(s, function () {
                    e.hide(), h(!1)
                }, !0), e.hide = function () {
                    l = !1, g(), v.hideLoadOverlay()
                }, e.show = function (t, n, r) {
                    h = r;
                    var s = !!n, f = !1;
                    u = n, v.showLoadOverlay(), function () {
                        if (!s && !f) return h(!1);
                        a.style.display = s ? "inline-block" : "none", o.innerHTML = c = t || 9, d = !1, l = !0, document.body.appendChild(i), e.handleResize()
                    }()
                }, e.handleResize = function () {
                    if (l) {
                        var e = Math.min(width / (i.offsetWidth || 500), Math.min(height / (i.offsetHeight || 577), Math.min(width / 500, 1)));
                        i.style.transform = 1 == e ? "" : "scale(" + e + "," + e + ")"
                    }
                }, XS.on("resize", e.handleResize), XS.setInterval(function () {
                    if (l && !d) {
                        if (--c < 0 && (c = 0), 0 == c) return e.hide(), void h(!1);
                        o.innerHTML = c
                    }
                }, 1e3)
            }).show(5, e, n)
        };
        var n = f("div", t.elements.blurOverlayNode), r = f("div", t.elements.loaderOverlay), o = 0;
        e.showLoadSpinner = function () {
            document.body.appendChild(r);
            var e = 0;
            r.style.transform = "rotate(" + e + "deg)", clearInterval(o), o = setInterval(function () {
                e += 4, r.style.transform = "rotate(" + e + "deg)"
            }, 16)
        }, e.hideLoadSpinner = function () {
            clearInterval(o), r.parentNode && r.parentNode.removeChild(r)
        };
        var a = 0;
        e.showLoadOverlay = function () {
            a++, n.parentNode || document.body.appendChild(n)
        }, e.hideLoadOverlay = function () {
            if (--a < 0 && (a = 0), 0 == a) {
                if (!n.parentNode) return;
                n.parentNode.removeChild(n)
            }
        }, window.Social.hideLoadSpinner = function () {
            e.hideLoadSpinner()
        }, window.Social.showLoadOverlay = function (t) {
            1 == t && (XS.isFrozen() || XS.freeze()), e.showLoadOverlay(), e.showLoadSpinner()
        }, window.Social.hideLoadOverlay = function (t) {
            1 == t && XS.isFrozen() && XS.unfreeze(), e.hideLoadOverlay(), e.hideLoadSpinner()
        }
    }
}

function InitSocial() {
    function e() {
    }

    e.prototype.onFinalScore = function (e) {
        XS.emit("std:final_score", {score: e})
    }, XS.social = XS.social || new function () {
    }, XS.events = XS.events || new e
}

window.ga || (window.ga = function () {
}), window.gax || (window.gax = function () {
}), function (e) {
    e.XS = e.XS || {};
    var t = e.XS;
    t.LOG_SPAM_EVENT_EXCLUDE = t.LOG_SPAM_EVENT_EXCLUDE || [], t.LOG_SPAM_EVENT_EXCLUDE.push("resize");
    var i = getRenderer();

    function n(e) {
        this.name = e, this.frc = 0, this.handlers = {}
    }

    getRenderer = void 0, e.width = 150, e.height = 150, n.nextHandlerId = 1, n.groups = {}, n.cachedEvents = [], n.ENG_GRP_NAME = "___e", e.ENG_FRZ_GRP = n.ENG_GRP_NAME, n.DEF_GRP_NAME = "___d", Object.defineProperty(Object.prototype, "_defFrzGrp", {
        enumerable: !1,
        value: n.DEF_GRP_NAME
    }), n.GLB_GRP_NAME = "___g", n.groups[n.GLB_GRP_NAME] = new n(n.GLB_GRP_NAME), n.get = function (e) {
        return n.groups[e] = n.groups[e] || new n(e), n.groups[e]
    }, n.freezeUnfreezeGroup = function (e, t) {
        var i = t ? 1 : -1, r = n.get(e);
        for (var o in r.frc = Math.max(0, r.frc + i), r.handlers) r.handlers[o].frc = Math.max(0, r.handlers[o].frc + i)
    }, n.addHandler = function (e, t) {
        for (var i = 0; i < t.length; i++) {
            var r = n.get(t[i]);
            r.handlers[e.id] = e, r.frc > 0 && e.frc++
        }
    }, n.removeHandler = function (e) {
        for (var t in n.groups) {
            var i = n.get(t);
            delete i.handlers[e.id], i.frc > 0 && e.frc--
        }
    }, n.cacheEvent = function (e, t, i, r, o) {
        n.cachedEvents.push({target: e, eventName: t, grpName: i, cbData: r, callback: o})
    }, n.fireCachedEvents = function (e) {
        for (var t = 0; t < n.cachedEvents.length; t++) {
            var i = n.cachedEvents[t];
            i.grpName === e && (i.callback.call(this, i.cbData), n.cachedEvents.splice(t--, 1))
        }
    }, t.LOG_SPAM_EVENT_EXCLUDE = t.LOG_SPAM_EVENT_EXCLUDE || [], Object.defineProperty(Object.prototype, "_freezeEmit", {
        enumerable: !1,
        value: function (e) {
            return e.type !== eventTypes.forced.name && (!(!l() && !t.isFrozen(e.frzGrp)) && (e.type === eventTypes.transient.name || n.cacheEvent(this, e.name, e.frzGrp, e.cbData, e.callback), !0))
        }
    }), n.prototype.constructor = n, t.on("gameLoaded", function () {
        t.is.facebookInstant && "undefined" != typeof FBInstant && FBInstant.logEvent && (i.frvrGLErrors.TOTAL_ERRORS > 0 && FBInstant.logEvent("webgl_errors", 1, {
            OUT_OF_MEMORY: i.frvrGLErrors.OUT_OF_MEMORY,
            INVALID_ENUM: i.frvrGLErrors.INVALID_ENUM,
            INVALID_VALUE: i.frvrGLErrors.INVALID_VALUE,
            INVALID_OPERATION: i.frvrGLErrors.INVALID_OPERATION,
            INVALID_FRAMEBUFFER_OPERATION: i.frvrGLErrors.INVALID_FRAMEBUFFER_OPERATION,
            CONTEXT_LOST_WEBGL: i.frvrGLErrors.CONTEXT_LOST_WEBGL
        }), FBInstant.logEvent("pixi_renderer", 1, {renderer: t.is.usingCanvasRenderer ? "canvas" : t.is.usingWebGLRenderer ? "webgl" : "unknown"}))
    }, {freezeGroup: ENG_FRZ_GRP}), t.modulesToPreload = [], t.ignoreCursorChanges = !1, t.dirty = !1;
    var r, o, a = {}, s = {_textureCache: {}};

    function l() {
        return t.isFrozen(n.GLB_GRP_NAME)
    }

    function c() {
        o || ((o = document.createElement("div")).style.cssText = "position:absolute;top:0px;left:0px;z-index:9999999999;background:rgba(0,0,0,.9);padding:10px;color:#FFFFFF", o.onclick = function () {
            o.parentNode && o.parentNode.removeChild(o)
        })
    }

    Host.Log("User Agent: " + navigator.userAgent), t.assets = {}, t.assets.loadAsync = function (t, i) {
        var n = t.slice(0);
        n.push(function () {
            i && i(t)
        }), e.preload.apply(window, n)
    }, t.is = new function (e, t, i, n) {
        var r, o = this;
        o.android = /(android)/i.test(i) && !/(Windows)/i.test(i), o.androidVersion = (r = navigator.userAgent.toLowerCase().match(/android\s([0-9\.]*)/), parseFloat(r ? r[1] : 0)), o.firefoxMobile = /(Mobile)/i.test(i) && /(Firefox)/i.test(i), o.slow = o.android && o.androidVersion < 6, o.iOS = /(ipod|iphone|ipad)/i.test(i) || /(Macintosh)/i.test(i) && "ontouchend" in document, o.windowsMobile = /(IEMobile)/i.test(i), o.silk = /(silk)/i.test(i), o.clay = /(clay\.io)/i.test(n), o.facebookApp = /(fb_canvas)/i.test(n), o.facebookAppWeb = /(fb_canvas_web)/i.test(n), o.iframed = e.top !== e.self, o.standalone = "standalone" in t && t.standalone, o.mobileiOSDevice = i.match(/iPhone/i) || i.match(/iPod/i), o.kongregate = /(kongregateiframe)/i.test(n), o.kik = /(kik_canvas)/i.test(n), o.twitter = /(twitter)/gi.test(i), o.chrome = /Chrome\//.test(i), o.safari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/), o.secureConnection = 0 == window.location.protocol.indexOf("https"), o.facebookInstant = window.Host && "instant" == window.Host.Type, o.spilGamesWrapper = /(spilgames)/i.test(n), o.social = "on" == Host.Web.GetQueryString("social"), o.advertisementIsDisabled = "off" == Host.Web.GetQueryString("ads"), o.advertisementInterstitialDisabled = "off" == Host.Web.GetQueryString("int"), o.advertisementOverlayEnabled = !o.iframed || o.spilGamesWrapper || Host.Web.GetQueryString("partnerid"), o.nosoc = "1" == Host.Web.GetQueryString("nosoc"), o.facebookAd = /(\/\?fb)/i.test(n), o.mobile = o.android || o.windowsMobile || o.iOS || o.silk || o.firefoxMobile, o.iOSWrapper = e.iOSWrapper || !1, o.iPhoneXOrLater = "true" == Host.Web.GetQueryString("iPhoneXOrLater"), o.iMessageContext = "true" == Host.Web.GetQueryString("iMessage"), o.androidWrapper = e.androidWrapper || !1, o.chromeWrapper = e.isChromeWrapper || !1, o.appWrapper = e.iOSWrapper || e.androidWrapper, o.samsungAppStore = "samsung" == Host.Web.GetQueryString("androidStore"), o.usingWebGLRenderer = !1, o.usingCanvasRenderer = !1, o.twitch = "" == Host.Web.GetQueryString("twitch"), o.vkru = "" == Host.Web.GetQueryString("vkru"), o.okru = "" == Host.Web.GetQueryString("okru"), o.tMobile = "" == Host.Web.GetQueryString("tmobile"), o.pwa = "" == Host.Web.GetQueryString("pwa"), o.windowsApp = "" == Host.Web.GetQueryString("windowsapp"), o.enableAppStoreLinks = !0, o.samsungGalaxyStorePWA = "" == Host.Web.GetQueryString("samsung") && "galaxystore" == Host.Web.GetQueryString("source"), o.samsungGameLauncherPWA = ("" == Host.Web.GetQueryString("pwa") || "" == Host.Web.GetQueryString("samsung")) && "gamelauncher" == Host.Web.GetQueryString("source"), o.samsungGameLauncher = !!window.FRVRInstant || ("" == Host.Web.GetQueryString("gamelauncher") || "gamelauncher" == Host.Web.GetQueryString("source")), o.samsungBixby = "" == Host.Web.GetQueryString("samsung") && !o.samsungGalaxyStorePWA, o.samsungBrowserUK = "" == Host.Web.GetQueryString("samsungbuk"), o.samsungBrowserUS = "" == Host.Web.GetQueryString("samsungbus"), o.samsungBrowserSEA = "" == Host.Web.GetQueryString("samsungbsea"), o.samsungBrowser = "" == Host.Web.GetQueryString("samsungbrowser"), o.samsungGLFallback = "" == Host.Web.GetQueryString("gl_fallback"), o.samsungInstantPlay = "samsung-instant-play" === Host.Type, o.samsung = o.samsungGalaxyStorePWA || o.samsungGameLauncherPWA || o.samsungGameLauncher || o.samsungBixby || o.samsungBrowserUK || o.samsungBrowserUK || o.samsungBrowserUS || o.samsungBrowserSEA || o.samsungBrowser || o.samsungGLFallback || o.samsungInstantPlay, o.rcs = Host.Web.GetQueryString("rcsid"), o.rcsKr = "" == Host.Web.GetQueryString("rcskr"), o.huaweiquickapp = "" == Host.Web.GetQueryString("huaweiquickapp"), o.huawei = "" == Host.Web.GetQueryString("huawei") || o.huaweiquickapp, o.mozilla = "" == Host.Web.GetQueryString("mozilla"), o.miniclip = "" == Host.Web.GetQueryString("miniclip"), o.chromeOSDevice = "true" == Host.Web.GetQueryString("isChromeOSDevice"), o.opera = !!e.opr && !!e.opr.addons || !!e.opera || i.indexOf(" OPR/") >= 0, o.yandex = "yandex" === Host.Type, o.firefox = void 0 !== e.InstallTrigger, o.edge = /(edge|edgios|edga)\/((\d+)?[\w\.]+)/i.test(i), o.oppoGlobal = "" == Host.Web.GetQueryString("oppo"), o.lgtv = "" == Host.Web.GetQueryString("lgtv"), o.crazyGames = "8289067739" == Host.Web.GetQueryString("partnerid"), o.mynet = "" == Host.Web.GetQueryString("mynet"), o.partnerWrapper = o.mynet || o.tMobile, o.progressiveWebAppEnabled = !(o.chromeOSDevice || o.iframed || o.appWrapper || o.twitch || o.vkru || o.okru || o.facebookInstant || o.partnerWrapper)
    }(window, navigator, navigator.userAgent, document.location), t.is.samsungGameLauncher ? window.gaPath += "app/gamelauncher/" : t.is.samsungInstantPlay ? window.gaPath += "app/samsunginstantplay/" : t.is.facebookApp ? window.gaPath += "app/facebook/" : t.is.pwa ? window.gaPath += "app/pwa/" : t.is.windowsApp ? window.gaPath += "app/windowsapp/" : t.is.okru ? window.gaPath += "app/okru/" : t.is.vkru ? window.gaPath += "app/vk/" : t.is.rcs ? window.gaPath += "app/rcs/" : t.is.huawei ? window.gaPath += "app/huawei/" : t.is.miniclip && (window.gaPath += "app/miniclip/"), t.abtest = new function () {
        var e = this;
        e.initialized = !1, e.forcedCohorts = {}, e.abTestCohorts = {}, e.validCohorts = {};
        var i = [], n = function () {
            for (var e = [], t = 0; 64 > t;) e[t] = 0 | 4294967296 * Math.abs(Math.sin(++t));
            return function (t) {
                for (var i, n, r, o, a = [], s = (t = unescape(encodeURI(t))).length, l = [i = 1732584193, n = -271733879, ~i, ~n], c = 0; c <= s;) a[c >> 2] |= (t.charCodeAt(c) || 128) << c++ % 4 * 8;
                for (a[t = 16 * (s + 8 >> 6) + 14] = 8 * s, c = 0; c < t; c += 16) {
                    for (s = l, o = 0; 64 > o;) s = [r = s[3], (i = 0 | s[1]) + ((r = s[0] + [i & (n = s[2]) | ~i & r, r & i | ~r & n, i ^ n ^ r, n ^ (i | ~r)][s = o >> 4] + (e[o] + (0 | a[[o, 5 * o + 1, 3 * o + 5, 7 * o][s] % 16 + c]))) << (s = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][4 * s + o++ % 4]) | r >>> 32 - s), i, n];
                    for (o = 4; o;) l[--o] = l[o] + s[o]
                }
                for (t = ""; 32 > o;) t += (l[o >> 3] >> 4 * (1 ^ 7 & o++) & 15).toString(16);
                return t
            }
        }();
        e.setup = function (e) {
            return i.push(e), {
                fallback: function (e) {
                    r || e()
                }
            }
        }, e.force = function (e, t) {
            console.warn("Forcing cohort: " + t + " for test: " + e), this.forcedCohorts[e] = t
        }, e.addTest = function (e, i, r, o) {
            this.validCohorts[i] = r;
            var a, s, l, c, d = this.forcedCohorts[i];
            return d || (d = r[(a = e, s = i, l = r.length, c = n(s + ":" + a).substr(-8), parseInt(c, 16) % l)]), this.abTestCohorts[i] = d, o && "{}" !== JSON.stringify(this.abTestCohorts) && t.track.customEvent(i, 1, this.abTestCohorts), {
                test: i,
                cohort: d
            }
        }, e.init = function (n, r) {
            var o = {};
            if (window._jsonData && window._jsonData.ab_tests || r) {
                var a = r || window._jsonData.ab_tests;
                for (var s in a) {
                    var l = this.addTest(n, s, a[s].cohorts, !1);
                    o[l.test] = l.cohort
                }
                for (s in console.log("XS.abtest: A/B test cohorts: ", o), a) t.track.customEvent(s, 1, o)
            }
            e.initialized = !0;
            for (var c = 0; c < i.length; ++c) i[c]();
            e.emit("abtest-init")
        }, e.cohort = function (t) {
            return e.initialized || console.error("XS.abtest.cohort called before XS.abtest was initialized!"), e.abTestCohorts[t]
        }, e.when = function (t, i, n) {
            if (!r) return {
                fallback: function (e) {
                    e && e()
                }
            };
            e.initialized || console.error("XS.abtest.when called before XS.abtest was initialized!");
            var o = this.cohort(t);
            return "string" == typeof i ? o && i && o == i && n && n() : "object" == typeof i ? o && i[o] && i[o]() : o || console.error("No A/B test cohort defined for test '" + t + "' - nothing was executed!"), {
                fallback: function () {
                }
            }
        }
    }, t.is.facebookInstant ? (Host.on("FBInstantStart", function () {
        t.abtest.init(FBInstant.player.getID())
    }, {freezeGroup: ENG_FRZ_GRP}), r = !0) : r = !!t.is.samsungInstantPlay, t.loadEmbedData = function (e, t, i) {
        if (window.embeddedFiles && window.embeddedFiles[e]) console.log("Loading embedded data: " + e), t(window.embeddedFiles[e]); else {
            console.warn("Loading data (not embedded!): " + e);
            var n = new XMLHttpRequest;
            n.crossOrigin = "anonymous", i && n.overrideMimeType && n.overrideMimeType(i);
            try {
                n.open("GET", e, !0), n.onreadystatechange = function () {
                    4 == n.readyState && ("200" == n.status ? t(n.responseText) : (n = n.onreadystatechange = null, console.error("XS.loadData: Error loading data: ", n)))
                }, n.send()
            } catch (e) {
                console.error("loadEmbedData: Error loading data (2): ", e)
            }
        }
    }, window.insertButton = function (e, t, i) {
        console.warn("window.insertButton needs to be overwritten before releasing this game."), Host.WrapperLog("window.insertButton is not defined")
    }, t.isFrozen = function (e) {
        return (e = e || n.DEF_GRP_NAME) in n.groups && n.get(e).frc > 0
    }, t.freeze = function (e) {
        e = e || n.DEF_GRP_NAME, n.freezeUnfreezeGroup(e, !0)
    }, t.unfreeze = function (e) {
        e = e || n.DEF_GRP_NAME, n.freezeUnfreezeGroup(e, !1), n.fireCachedEvents(e)
    }, t.on("spawndebugmenu", function () {
        Sidebar.addMenuItem(new Y(embed("i/g/s/icon_new.svg")), "XS: Show Debug", function () {
            c(), document.body.appendChild(o), Sidebar.hide()
        })
    }, {freezeGroup: ENG_FRZ_GRP});
    var d = {};
    t.on("debugOverlayCreateSource", function (e) {
        c();
        var t = document.createElement("div"), i = document.createElement("h3");
        i.style.cssText = "padding:0px;margin:0px", i.innerHTML = e.source, t.style.cssText = "margin-bottom:5px", t.appendChild(i), d[e.source] = t, o.appendChild(t)
    }, {freezeGroup: ENG_FRZ_GRP}), t.on("writeDebug", function (e) {
        c();
        var t = d[e.source];
        if (t) {
            var i = document.createElement("span");
            i.style.cssText = "margin:0px;padding:0px;", i.innerHTML = (e.skipBreak || 1 == t.children.length ? "" : "<br/>") + e.message, t.appendChild(i), t.children.length > 26 && t.removeChild(t.children[1])
        } else console.warn("Unknown debug target", e)
    }, {freezeGroup: ENG_FRZ_GRP}), t.canvas = document.getElementById("gameCanvas"), t.stageContainer = new i.Stage(2105376), I(t.stageContainer), t.stageContainer.on("up", function (e) {
        t.stageContainer.emit("stageup", e)
    }, {freezeGroup: ENG_FRZ_GRP}), t.stageContainer.on("down", function (e) {
        window.focus && window.focus()
    }, {freezeGroup: ENG_FRZ_GRP});
    var h = !1;
    t.is.android && t.is.androidVersion < 5 && !t.is.firefoxMobile && (h = !0);
    var u = window.__antialias;
    window.inScreenshotMode || h ? t.renderer = new i.CanvasRenderer(width, height, {
        view: t.canvas,
        antialiasing: !1,
        antialias: !1,
        transparent: !1,
        clearBeforeRender: !0
    }) : t.renderer = i.autoDetectRenderer(width, height, {
        view: t.canvas,
        antialiasing: u,
        antialias: u,
        transparent: !1,
        clearBeforeRender: !0
    }), t.is.usingCanvasRenderer = t.renderer.type === i.CANVAS_RENDERER, t.is.usingWebGLRenderer = t.renderer.type === i.WEBGL_RENDERER, t.httpPrefix = "--https--", t.devicePixelRatio = Math.min(2, window.devicePixelRatio || 1), t.styles = {
        margins: {
            top: (t.is.iOSWrapper || t.is.standalone) && t.is.iOS ? t.is.iPhoneXOrLater ? 0 : 20 : 0,
            bottom: 0,
            left: 0,
            right: 0
        }, spacing: {top: 0, bottom: 0, left: 0, right: 0}
    }, t.showGameOverAd = function () {
    }, t.hideGameOverAd = function () {
    }, t.showInterstitialAd = function (e) {
        e && e()
    }, t.resizeAd = function () {
    }, t.showRateGame = function () {
    }, t.submitHighscore = function (e) {
    }, t.submitLowscore = function (e) {
    }, t.configLoadCallback = function () {
    }, t.insertRemoveAdsButton = function () {
    }, t.removeAdsButton = function () {
    };
    var f, g = !1;
    t.skipResizing = !1, window.onresize = function (e) {
        if (!t.skipResizing) {
            var i = 5;
            LEGACY_COORD_SYSTEM && (i = 25), clearTimeout(g), clearInterval(f), clearTimeout(Le), g = setTimeout(function () {
                Oe({instant: !1, event: e}), f = setInterval(function () {
                    Xe(!1)
                }, 250)
            }, i)
        }
    }, window.onfocus = function (e) {
        t.emit("focus", {id: "window_focus"})
    }, window.onblur = function (e) {
        t.emit("blur", {id: "window_focus"})
    }, document.addEventListener("visibilitychange", function (e) {
        "hidden" == document.visibilityState && t.emit("blur", {id: "window_focus"}), "visible" == document.visibilityState && t.emit("focus", {id: "window_focus"})
    });
    var p = [];
    var m, v, w, b, y = (m = 0, window.Host && window.Host.Sound ? (Host.Log("Using SoundPlayer!"), function (e) {
        e = !!e;
        var t = this;
        this.muted = !1, this.setMuted = function (i) {
            t.muted = i, Host.Sound.PauseAll(i, e)
        }, this.soundNodes = [], this.get = function (i, n) {
            var r = i + "_" + m++;
            return Host.Sound.Preload(r, i, e), new function (i, n, r) {
                var o = this;
                o.playing = !1;
                var a = r;
                o.resetGain = function () {
                    o.setGain(r)
                }, o.setGain = function (e) {
                    a = e, Host.Sound.SetVolume(i, e)
                }, o.updateGain = function (e) {
                    r = e, o.setGain(e)
                }, o.currentGain = function () {
                    return o.currentGain
                }, o.setMuted = function (e) {
                    Host.Sound.Pause && o.playing && Host.Sound.Pause(i, e)
                }, o.play = function (r, s) {
                    function l() {
                        Host.Sound.Play(i, n, s, a, e)
                    }

                    t.muted || e && o.playing || (o.playing = !0, r ? setTimeout(l, 1e3 * r) : l())
                }, o.stop = function (e) {
                    e = void 0 === e ? 0 : e, o.playing = !1, Host.Sound.Stop(i)
                }
            }(r, i, n)
        }
    }) : function (e) {
        var i, n = this;
        void 0 !== y.context && (i = y.context);
        var r = window.AudioContext || window.webkitAudioContext;
        void 0 === i && void 0 !== r && (i = new r), this.context = i, this.debug = function () {
            console.log(i)
        };
        var o = [];
        this.soundNodes = [], this.muted = !1, this.setMuted = function (e) {
            n.muted = e, e || function () {
                for (; p.length;) p.pop()()
            }();
            try {
                for (var t = 0; t < this.soundNodes.length; ++t) this.soundNodes[t] && this.soundNodes[t].setMuted(e)
            } catch (e) {
            }
        }, this.get = function (r, c) {
            var d, h, u = o[r] || (h = c, o[d = r] = new function (r, o) {
                this.id = r + "_" + m++;
                var c, d, h = this;
                h.loaded = !1, h.playing = !1;
                var u = {gain: {value: o}};
                i && (p.push(function () {
                    var t = new XMLHttpRequest;

                    function n(e) {
                        console.error('Error loading sound "%s":', r, e), l()
                    }

                    t.open("GET", vpath + r, !0), t.responseType = "arraybuffer", t.onerror = n, t.onload = function () {
                        200 !== t.status && n(t.status + "/" + t.statusText), i.decodeAudioData(t.response, function (e) {
                            c = e, h.loaded = !0, d && d(), t = null, l()
                        }, n)
                    }, a.push(function () {
                        t.send()
                    }), s || (l(), e || l())
                }), u = i.createGain ? i.createGain() : {gain: {value: o}}), this.gain = u.gain;
                var f = {}, g = 0;

                function v() {
                    for (var e in f) return !0;
                    return !1
                }

                function w(e) {
                    var t = v();
                    f[e] = !0;
                    var i = !t && v();
                    i && (g = h.gain.value, h.setGain(0, !0))
                }

                function b(e) {
                    var t = v();
                    delete f[e];
                    var i = t && !v();
                    i && h.setGain(g, !0)
                }

                this.setGain = function (e, t) {
                    t || !v() ? this.gain.value = e : g = e
                }, this.updateGain = function (e, t) {
                    t || !v() ? this.gain.value = o = e : g = o = e
                }, this.resetGain = function (e) {
                    e || !v() ? this.gain.value = o : g = o
                }, h.currentGain = function () {
                    return this.gain.value
                }, this.getCurrentTime = function () {
                    return i ? i.currentTime : 0
                };
                var y = void 0;

                function S() {
                    e && h.playing && "running" !== i.state && (i.resume(), h.checkReallyPlayingTimer && clearTimeout(h.checkReallyPlayingTimer), h.checkReallyPlayingTimer = window.setTimeout(S, 1e3))
                }

                h.checkReallyPlayingTimer = null, this.play = function (t, r, o) {
                    if (h.loaded) {
                        if (e) {
                            if (h.playing && !o) return
                        } else h.stop(0);
                        !function (e, t) {
                            if (!n.muted && h.loaded) {
                                y = {
                                    stop: function () {
                                    }
                                };
                                try {
                                    h.playing = !0, (y = i.createBufferSource()).buffer = c, y.loop = t || !1, h.resetGain(), y.connect(u), u.connect(i.destination), y.start(i.currentTime + (e || 0)), S()
                                } catch (e) {
                                }
                            }
                        }(t, r)
                    } else e && (d = function () {
                        var e = h.gain.value;
                        h.play(t, r), h.setGain(e)
                    })
                }, this.stop = function (e) {
                    if (e = e || 0, y && h.playing) try {
                        y.stop(e)
                    } catch (e) {
                    }
                    h.playing = !1
                }, this.setMuted = function (e) {
                    e ? w({id: "mute"}) : b({id: "mute"})
                }, t.on("blur", function (e) {
                    w((e ? e.id : null) || "__default")
                }, {freezeGroup: ENG_FRZ_GRP}), t.on("focus", function (e) {
                    b((e ? e.id : null) || "__default")
                }, {freezeGroup: ENG_FRZ_GRP}), window.stage && stage.on("down", function (e) {
                    b({id: "window_focus"})
                }, {freezeGroup: ENG_FRZ_GRP})
            }(d, h));
            return u.updateGain(c), this.soundNodes.push(u), u
        };
        var a = [], s = !1;

        function l() {
            s = !0, a.length ? a.shift()() : s = !1
        }

        this.currentTrack = null
    });

    function S() {
        if (t.backgroundMusic && t.soundSettings) {
            var e = t.soundSettings.muteMusic.get();
            t.Music.setMuted(e), e ? t.backgroundMusic.stop(0) : t.backgroundMusic.play(0, !0)
        }
    }

    t.Sound = new y, t.Music = new y(!0), t.backgroundMusic = null, t.muteMusic = function (e) {
        t.Music.setMuted(e), t.soundSettings && t.soundSettings.muteMusic.set(e), S(), t.emit("mutemusic", e)
    }, t.muteSound = function (e) {
        t.soundSettings && t.soundSettings.muteSound.set(e), t.Sound.setMuted(e), t.emit("mutesound", e)
    }, t.setBackgroundMusic = function (e, i) {
        var n = null;
        return "string" == typeof e ? n = t.Music.get(e, i || 1) : (n = e, i ? n.setGain(i) : n.resetGain()), t.backgroundMusic = n, S(), n
    }, t.initSound = function () {
        t.soundSettings = {
            legacyMuteSounds: Host.Preferences.QuickBool("sound.v1"),
            legacyMuteMusic: Host.Preferences.QuickBool("music.v1"),
            muteSound: Host.Preferences.QuickBool("xs.muteSound.v4"),
            muteMusic: Host.Preferences.QuickBool("xs.muteMusic.v4"),
            muteStateOverload: Host.Preferences.QuickBool("xs.muteStateOverload.v4")
        }, !t.is.progressiveWebAppEnabled || t.soundSettings.muteStateOverload.get() || t.is.samsungInstantPlay || (t.soundSettings.muteStateOverload.set(!0), t.soundSettings.legacyMuteSounds.set(!t.soundSettings.legacyMuteSounds.get()), t.soundSettings.legacyMuteMusic.set(!t.soundSettings.legacyMuteMusic.get()), t.soundSettings.muteSound.set(!t.soundSettings.muteSound.get()), t.soundSettings.muteMusic.set(!t.soundSettings.muteMusic.get())), t.Music && t.Music.setMuted(t.soundSettings.muteMusic.get()), t.Sound && t.Sound.setMuted(t.soundSettings.muteSound.get()), S()
    }, t.muteAll = function () {
        if (window.Host && window.Host.Sound) window.Host.Sound.MuteAll(); else {
            if (v) return;
            v = !0, w = t.soundSettings.muteSound.get(), b = t.soundSettings.muteMusic.get(), t.backgroundMusic && void 0 === t.backgroundMusic.__preMuteGain && (t.backgroundMusic.__preMuteGain = t.backgroundMusic.currentGain()), t.muteMusic(!0), t.muteSound(!0)
        }
    }, t.unmuteAll = function () {
        if (window.Host && window.Host.Sound) window.Host.Sound.UnmuteAll(); else {
            if (!v) return;
            v = !1, t.muteMusic(b), t.muteSound(w), t.backgroundMusic && void 0 !== t.backgroundMusic.__preMuteGain && (t.backgroundMusic.setGain(t.backgroundMusic.__preMuteGain), delete t.backgroundMusic.__preMuteGain)
        }
    }, t.loadScript = function (e, t) {
        var i, n, r;
        i = document, r = i.getElementsByTagName("script")[0], t = t || {}, (n = i.createElement("script")).src = e, n.async = "async", n.defer = "defer", t.charset && (n.charset = t.charset), r.parentNode.insertBefore(n, r)
    }, t.waitForSDK = function (e, t) {
        var i = setInterval(function () {
            if (window[e]) return clearInterval(i), t()
        }, 100)
    }, t.util = {}, t.util.urlKeyVal = function (e, t) {
        return encodeURIComponent(e) + "=" + encodeURIComponent(t)
    }, t.util.urlEncode = function (e) {
        var i = [];
        for (key in e) i.push(t.util.urlKeyVal(key, e[key]));
        return i.join("&")
    }, t.remoteConfig = {};
    var x = !1;
    t.loadConfig = function (e) {
        if (!(x || t.is.facebookInstant || t.is.twitch || t.is.yandex)) {
            var i = Config.remoteConfigVersion;
            if (t.is.iOS ? i += ".ios" : t.is.android && !t.is.silk ? i += ".android" : t.is.chromeWrapper ? i += ".chrome" : t.is.facebookInstant && (i += ".instant"), void 0 !== Config && Config.stage && "live" != Config.stage && "gold" != Config.stage && "beta" != Config.stage && "rc" != Config.stage) Host.WrapperLog("Skipping ad config loading, because of Config.stage"), console.warn("Skipping ad config loading, because of Config.stage"); else {
                var n = t.httpPrefix + "cdn.frvr.com/config/" + e + "." + i + ".json?r=" + (new Date).getTime();
                Host.Tools.LoadJSON(n, function (e) {
                    for (var i in Host.WrapperLog("Loading Config URL: " + n), e) t.remoteConfig[i] = e[i];
                    t.configLoadCallback()
                }, function () {
                    Host.WrapperLog("Failed to load config: " + n), setTimeout(function () {
                        t.loadConfig(e)
                    }, 6e4)
                })
            }
            Host.Log(t.httpPrefix + "cdn.frvr.com/config/" + e + "." + i + ".json?r="), x = !0
        }
    }, t.navigate = function (e, i) {
        window.Host && window.Host.IOS && window.Host.IOS.OpenURL && Host.IOS.OpenURL(e), window.Host && window.Host.Android && window.Host.Android.OpenURL ? window.Host.Android.OpenURL(e) : t.is.clay ? (window.open(e, i || "_blank"), navigator.app && navigator.app.loadUrl && navigator.app.loadUrl(e, {openExternal: !0})) : window.open(e, i || "_blank")
    }, t.utils = {};
    var C = 0;
    t.utils.clipImage = function (e, t, n, r, o, l, c) {
        e.isJSG && (e = i.Texture.getScaled(e, 1, s, !0).canvas), l = l || r, c = c || o, e.path = e.path || e.src || "Unknown Canvas Object " + ++C;
        var d = [e.path, t, n, r, o, l, c].join(","), h = a[d];
        return void 0 === h && ((h = getNewCanvasObject()).width = r, h.height = o, h.path = d, h.getContext("2d").drawImage(e, t, n, r, o, 0, 0, l, c), a[d] = h), h
    }, t.utils.asynchLoadImageFromPath = function (e) {
        var t = i.Sprite.fromImage(e);
        return I(t), t
    };
    var T = !1;

    function _(e, t, i) {
        window.dirty = !0, e.emit("down", {event: t, isMouseEvent: i})
    }

    function M(e) {
        t.is.chromeOSDevice || (T = !0, this.mousedown = void 0), _(this, e, !1)
    }

    function R(e) {
        T || _(this, e, !0)
    }

    function E(e, t, i) {
        window.dirty = !1, e.emit("up", {event: t, isMouseEvent: i})
    }

    function A(e) {
        t.is.chromeOSDevice || (T = !0, this.mouseup = void 0), E(this, e, !1)
    }

    function B(e) {
        T || E(this, e, !0)
    }

    function L(e, t, i) {
        e.emit("move", {event: t, isMouseEvent: i})
    }

    function G(e) {
        t.is.chromeOSDevice || (T = !0, this.mouseup = void 0), L(this, e, !1)
    }

    function P(e) {
        T || L(this, e, !0)
    }

    function I(e) {
        e.on("eventAttached", function (t) {
            switch (t.eventName) {
                case"down":
                    (a = e).interactive = !0, a.__touchStartEnabled || (a.__touchStartEnabled = !0, a.touchstart = M, a.mousedown = R);
                    break;
                case"up":
                    (o = e).interactive = !0, o.__touchEndEnabled || (o.__touchEndEnabled = !0, o.mousedown = o.mousedown || function () {
                    }, o.touchstart = o.touchstart || function () {
                    }, o.touchendoutside = o.touchend = A, o.mouseupoutside = o.mouseup = B);
                    break;
                case"move":
                    (r = e).interactive = !0, r.__touchMoveEneabled || (r.__touchMoveEneabled = !0, r.touchmove = G, r.mousemove = P);
                    break;
                case"rightdown":
                    (n = e).interactive = !0, n.__rightDownEnabled || (n.__rightDownEnabled = !0, n.rightdown = function (e) {
                        this.emit("rightdown", {event: e, isMouseEvent: !0})
                    });
                    break;
                case"rightup":
                    (i = e).interactive = !0, i.__rightUpEnabled || (i.__rightUpEnabled = !0, i.rightup = function (e) {
                        this.emit("rightup", {event: e, isMouseEvent: !0})
                    })
            }
            var i, n, r, o, a
        }, {freezeGroup: ENG_FRZ_GRP})
    }

    var O = 0;

    function X(e, t) {
        O = 2;
        var i = function e(t, i) {
            for (; i < .5;) t = e(t, .5), i /= .5;
            O *= i, O += 2;
            var n = getNewCanvasObject(), r = n.getContext("2d"), o = Math.ceil(t.width * i) || 1,
                a = Math.ceil(t.height * i) || 1;
            return n.width = o + 4, n.height = a + 4, r.clearRect(0, 0, n.width, n.height), r.drawImage(t, 0, 0, t.width, t.height, 2, 2, o, a), n
        }(e, t);
        O = Math.round(O) - 2;
        var n = Math.round(e.width * t) + 4, r = Math.round(e.height * t) + 4, o = getNewCanvasObject();
        return o.width = n, o.height = r, o.getContext("2d").drawImage(i, 0, 0, i.width, i.height, -O, -O, i.width, i.height), releaseCanvas(i), o
    }

    function F(e) {
        e && (e.removeEventListener("load", D), e.removeEventListener("error", U))
    }

    function D(e) {
        F(e.target), window.dirtyOnce = !0
    }

    function U(e) {
        F(e.target), window.dirtyOnce = !0, window.onerror && window.onerror("Failure to load generated asset image: " + this.path + " > " + e.message, e.sourceURL, e.line)
    }

    function H(e, t) {
        var i;
        t || (i = e, LEGACY_COORD_SYSTEM && (i.prototype._x = 0, i.prototype._y = 0, Object.defineProperty(i.prototype, "x", {
            get: function () {
                return this._x
            }, set: function (e) {
                this._x = e, this.position.x = e * (this.parent && this.parent.ratio || 1)
            }
        }), Object.defineProperty(i.prototype, "y", {
            get: function () {
                return this._y
            }, set: function (e) {
                this._y = e, this.position.y = e * (this.parent && this.parent.ratio || 1)
            }
        }), i.prototype._ratio = void 0, i.prototype.lockRatio = !1, i.prototype.forceSetRatio = function (e) {
            if (this._ratio !== e) if (!isNaN(e) && (e > 0 || -1 == e)) {
                this._ratio = e, this.x = this.x, this.y = this.y;
                for (var t = 0; t < this.children.length; t++) this.children[t].ratio = e;
                this.setRatio && this.setRatio(e)
            } else console.warn("Invalid value passed to Container forceSetRatio " + e)
        }, Object.defineProperty(i.prototype, "ratio", {
            get: function () {
                return this._ratio
            }, set: function (e) {
                this._ratio === e || this.lockRatio || this.forceSetRatio(e)
            }
        }))), e.prototype.inside = function (e, t, i) {
            return !1
        }, LEGACY_COORD_SYSTEM && (e.prototype._addChildAt = e.prototype.addChildAt, e.prototype.addChildAt = function (e, t) {
            var i = this._addChildAt(e, t);
            return null != this.ratio && (e.ratio = this.ratio), i
        }, e.prototype._removeChildAt = e.prototype.removeChildAt, e.prototype.removeChildAt = function (e) {
            var t = this._removeChildAt(e);
            return t && this.ratio && (t.ratio = -1), t
        })
    }

    LEGACY_COORD_SYSTEM || (Object.defineProperty(i.DisplayObjectContainer.prototype, "dimensions", {
        get: function () {
            return new Point(this.width, this.height)
        }, set: function (e) {
            this.width = e.x, this.height = e.y
        }
    }), i.DisplayObjectContainer.prototype.applyResolutionRecursive = function () {
        for (var e = 0; e < this.children.length; ++e) {
            var t = this.children[e];
            t && t.applyResolution && t.applyResolution(), t && t.applyResolutionRecursive && t.applyResolutionRecursive()
        }
    }, i.DisplayObjectContainer.prototype.getResolutionGlobal = function () {
        for (var e = this.resolution, t = this; t = t.parent;) e *= t.resolution;
        return e
    }, Object.defineProperty(i.DisplayObjectContainer.prototype, "resolution", {
        get: function () {
            return void 0 !== this._resolution ? this._resolution : 1
        }, set: function (e) {
            this._resolution = e
        }
    }));
    var N = i.DisplayObjectContainer.expand(function () {
        return i.DisplayObjectContainer.call(this), I(this), this
    });
    N.prototype.cacheRender = function (e) {
        var t = this.getLocalBounds(), n = new i.Sprite(i.Texture.emptyTexture);
        n.worldTransform = this.worldTransform, n.anchor.x = -t.x / t.width, n.anchor.y = -t.y / t.height, e.save(), e.translate(-t.x + this.x, -t.y + this.y), e.globalAlpha = this.alpha;
        for (var r = 0, o = this.children.length; r < o; r++) {
            var a = this.children[r];
            a.cacheRender && a.visible && a.cacheRender(e)
        }
        e.restore()
    }, H(N), e.Container = N;
    var z = N.expand(function (e, t) {
        return N.call(this), this._width = e || 0, this._height = t || 0, Object.defineProperty(this, "width", {
            get: function () {
                return this._width * this.scale.x
            }, set: function (e) {
                this._width = e / this.scale.x
            }
        }), Object.defineProperty(this, "height", {
            get: function () {
                return this._height * this.scale.y
            }, set: function (e) {
                this._height = e / this.scale.y
            }
        }), this
    });
    e.ContainerFixedSize = z;
    var W = {};
    i.Texture.getScaled = function (e, t, n, r, o) {
        var a, s, l = e.path + ":" + t, c = W[l];
        c && !o || (e.isJSG ? (a = _e[l]) || (a = e.draw({
            scale: t,
            forceCanvas: r
        })) : a = 1 === t ? e : X(e, t), 1 !== t && (a.path = l), (s = LEGACY_COORD_SYSTEM ? i.Texture.fromCanvas(a) : i.Texture.fromCanvas(a, void 0, t)).floorCoordinates = n.floorCoordinates, c = {
            canvas: a,
            texture: s,
            count: 0,
            ratio: t,
            path: l,
            timeToKill: 0
        }, W[l] = c);
        return c.count++, n._textureCache[l] = c, c
    };
    var j = 0, Y = i.Sprite.expand(function (e, t) {
        return LEGACY_COORD_SYSTEM && (this._ratio = -1), this.image = e, this._textureCache = {}, void 0 === e.path && (e.path = "DynamicSprite:" + j++), LEGACY_COORD_SYSTEM ? e.isJSG ? i.Sprite.call(this, Texture.emptyTexture) : i.Sprite.call(this, this.getTexture(e, 1)) : (this.resolution = t || 1, e.isJSG ? i.Sprite.call(this, this.getTexture(e, this.getResolutionGlobal())) : i.Sprite.call(this, this.getTexture(e, 1))), I(this), this
    });
    LEGACY_COORD_SYSTEM || (Y.prototype.applyResolution = function () {
        this.setTexture(this.getTexture(this.image, this.getResolutionGlobal(), !0))
    }), LEGACY_COORD_SYSTEM || (Object.defineProperty(Y.prototype, "width", {
        get: function () {
            var e = this.texture.baseTexture.hasLoaded ? this.texture.frame.width : this.image.width || 1;
            return this.scale.x * e
        }, set: function (e) {
            var t = this.texture.baseTexture.hasLoaded ? this.texture.frame.width : this.image.width || 1;
            this.scale.x = e / t, this._width = e
        }
    }), Object.defineProperty(Y.prototype, "height", {
        get: function () {
            var e = this.texture.baseTexture.hasLoaded ? this.texture.frame.height : this.image.height || 1;
            return this.scale.y * e
        }, set: function (e) {
            var t = this.texture.baseTexture.hasLoaded ? this.texture.frame.height : this.image.height || 1;
            this.scale.y = e / t, this._height = e
        }
    })), Y.prototype.getTexture = function (e, t, n) {
        return i.Texture.getScaled(e, t, this, !1, n).texture
    }, LEGACY_COORD_SYSTEM || (Y.fromCanvasContext = function (e, t, i) {
        var n = document.createElement("canvas");
        n.width = e, n.height = t;
        var r = n.getContext("2d");
        return i && i(r), new Y(n)
    }), Y.prototype.cacheRender = function (e) {
        e.save();
        this.texture.baseTexture.source;
        e.globalAlpha = e.globalAlpha * this.alpha;
        var t = this.texture.baseTexture.source;
        this.image.isJSG && (t = this.image.draw({forceCanvas: !0}));
        var n = this.position.x - t.width * this.anchor.x, r = this.position.y - t.height * this.anchor.y;
        if (16777215 !== this.tint) {
            var o = getNewCanvasObject();
            i.CanvasTinter.tintWithPerPixelInner(t, o, this.tint, {
                x: 0,
                y: 0,
                width: t.width,
                height: t.height
            }), e.drawImage(o, n, r), releaseCanvas(o)
        } else e.drawImage(t, n, r);
        this.image.isJSG && releaseCanvas(t), e.restore()
    }, Y.prototype.floorCoordinates = !0;
    setInterval(function () {
        for (var e in W) {
            var t = W[e];
            0 == t.count && 1 !== t.ratio && t.ratio !== stage.ratio && (t.timeToKill--, t.timeToKill <= 0 && (t.canvas.getContext && releaseCanvas(t.canvas), t.texture.destroy(!0), delete W[e]))
        }
    }, 100), Y.prototype.cleanTextureCache = function (e) {
        var t = 1;
        for (var i in -1 == e && (t = 1e3), this._textureCache) {
            var n = this._textureCache[i];
            n.count--, n.timeToKill = t, delete this._textureCache[i]
        }
    }, LEGACY_COORD_SYSTEM && (Y.prototype._y = 0, Object.defineProperty(Y.prototype, "y", {
        get: function () {
            return this._y
        }, set: function (e) {
            this._y = e, this.position.y = e * this._ratio
        }
    }), Y.prototype._x = 0, Object.defineProperty(Y.prototype, "x", {
        get: function () {
            return this._x
        }, set: function (e) {
            this._x = e, this.position.x = e * this._ratio
        }
    }), Y.prototype.lockRatio = !1, Y.prototype.redraw = function () {
        this.setTexture(this.getTexture(this.image, this.ratio, !0))
    }, Y.prototype.forceSetRatio = function (e, t) {
        if (this._ratio !== e || t) if (!isNaN(e) && (e > 0 || -1 == e)) {
            this._ratio = e, this.cleanTextureCache(e), -1 === e ? this.setTexture(Texture.emptyTexture) : (this.setTexture(this.getTexture(this.image, e)), this.x = this.x, this.y = this.y), this.setRatio && this.setRatio(e);
            for (var i = 0; i < this.children.length; i++) this.children[i].ratio = e
        } else console.warn("Invalid value passed to Sprite forceSetRatio " + e)
    }, Object.defineProperty(Y.prototype, "ratio", {
        get: function () {
            return this._ratio
        }, set: function (e) {
            this.lockRatio || this.forceSetRatio(e)
        }
    })), Y.fromSheet = function (e, t) {
        return e.frame = t, new Y(e.image)
    }, H(Y, !0), e.Sprite = Y;
    var V = Y.expand(function (e, t, i) {
        this.sourceImage = e, this.frameWidth = t || e.width, this.frameHeight = i || e.height, this.numCols = e.width / this.frameWidth >> 0, this.numRows = e.height / this.frameHeight >> 0, this.length = this.numRows * this.numCols, this.image = this.clipFrame(0), Y.call(this, this.image)
    });
    V.prototype.clipFrame = function (e) {
        var i = (e % this.numCols >> 0) * this.frameWidth, n = (e / this.numCols >> 0) * this.frameHeight;
        return t.utils.clipImage(this.sourceImage, i, n, this.frameWidth, this.frameHeight)
    }, V.prototype._frame = 0, Object.defineProperty(V.prototype, "frame", {
        get: function () {
            return this._frame
        }, set: function (e) {
            (e = Math.floor(e)) !== this._frame && (this._frame = e % this.length, this.image = this.clipFrame(this._frame), LEGACY_COORD_SYSTEM ? -1 != this.ratio && this.setTexture(this.getTexture(this.image, this.ratio)) : this.setTexture(this.getTexture(this.image, 1)), window.dirtyOnce = !0)
        }
    }), e.Sheet = V;
    var q = i.Sprite.expand(function (e) {
        i.Sprite.call(this, e)
    }), K = q.prototype._renderWebGL;
    q.prototype._renderWebGL = function (e) {
        this._dirtyTexture && (this._dirtyTexture = !1, i.updateWebGLTexture(this.texture.baseTexture, e.gl)), K.call(this, e)
    }, e.TextureSprite = q, t.reportTextures = function () {
        console.log("Total Texture Pixels:", i.__totalPixels)
    };
    var Z = {}, Q = [];
    e.Text2 = i.Sprite.expand(function (e, t) {
        var n, r, o = this;
        null == e && (e = ""), (t = t || {}).weight = t.weight || "300", t.size = t.size || 30, t.fill = t.fill || "#000000";
        var a = 0, s = 0, l = 0, c = 1;

        function d() {
            var s = (e.translated || e) + ":" + t.size * c + ":" + a + ":" + JSON.stringify(t);
            if (s != r) {
                var l = Z[s], d = Z[r];
                if (d && (d.count--, 0 == d.count && (Q.push(d.text), delete Z[r])), !l) {
                    var h = Q.pop(), u = h ? h.style : {};
                    for (var f in t) u[f] = t[f];
                    t.dropShadow ? u.dropShadowDistance = (t.dropShadowDistance || 6) * c : (u.dropShadowDistance = 0, u.dropShadow = void 0);
                    var g = Math.max((t.size - a) * c, .1);
                    u._font = (t.italic ? "italic " : "") + t.weight + " " + g + "px " + (t.font || '"Helvetica Neue","Trebuchet MS", Helvetica, sans-serif'), l = Z[s] = {
                        text: h || new i.Text(e.toString(), u),
                        localizedString: e,
                        count: 0,
                        ratio: c
                    }, h && (h.text = e.toString())
                }
                l.count++, r = s, l.text.updateText(), n = l.text, o.setTexture(n.texture), window.dirtyOnce = !0
            }
        }

        function h() {
            a = 0;
            var e = !0;
            if (LEGACY_COORD_SYSTEM && (e = -1 != o.ratio), e && (d(), t.maxWidth)) {
                var i = 1;
                for (LEGACY_COORD_SYSTEM && (i = o.ratio); n.texture.frame.width > t.maxWidth * i && t.size - a > 1;) a += 2, t.size - a < 1 && (a = t.size - 1), d()
            }
        }

        o.getContent = function () {
            return d(), n
        }, i.Sprite.call(o, Texture.emptyTexture), o.setText = function (t) {
            e.toString() !== t.toString() && (null == t && (t = ""), e = t, h())
        }, o.onLanguageChange = function () {
            e = Host.Localize.Translate(e), h()
        }, o.updateStyle = function (e) {
            var i = !1;
            for (var n in e) t[n] != e[n] && (i = !0, t[n] = e[n]);
            i && h()
        }, o.setStyle = function (e) {
            o.updateStyle(e)
        }, LEGACY_COORD_SYSTEM || (o.applyResolution = function () {
            h()
        });
        s = 0, l = 0, c = 1;
        LEGACY_COORD_SYSTEM && (Object.defineProperty(o, "ratio", {
            get: function () {
                return c
            }, set: function (e) {
                c === e && n || (c = e, o.position.x = s * c >> 0, o.position.y = l * c >> 0, h())
            }
        }), Object.defineProperty(o, "x", {
            get: function () {
                return s
            }, set: function (e) {
                s = e, o.position.x = e * c >> 0
            }
        }), Object.defineProperty(o, "y", {
            get: function () {
                return l
            }, set: function (e) {
                l = e, o.position.y = e * c >> 0
            }
        }), Object.defineProperty(o, "width", {
            get: function () {
                return n || h(), o.scale.x * n.texture.frame.width
            }, set: function (e) {
                n || h(), o.scale.x = e / n.texture.frame.width, n._width = e
            }
        }), Object.defineProperty(o, "height", {
            get: function () {
                return n || h(), o.scale.y * n.texture.frame.height
            }, set: function (e) {
                n || h(), o.scale.y = e / n.texture.frame.height, n._height = e
            }
        })), o.cacheRender = function (e) {
            e.drawImage(n.texture.baseTexture.source, o.position.x, o.position.y)
        }, d(), h()
    }), e.Text2.onLanguageChange = function () {
        for (k in Z) {
            Z[k].text.setText(Host.Localize.Translate(Z[k].localizedString))
        }
        Host.Localize.UpdateChildren(t.stageContainer), t.emit("translate", {})
    }, e.Graphics = i.Graphics.expand(function () {
        return I(this), i.Graphics.call(this), this
    }), e.Rectangle = i.Rectangle, e.Rectangle.prototype.getPosition = function () {
        return new Point(this.x, this.y)
    }, e.Rectangle.prototype.getSize = function () {
        return new Point(this.width, this.height)
    }, e.Texture = i.Texture, e.RenderTexture = i.RenderTexture, e.Point = i.Point, e.BlendModes = i.blendModes;
    var J = 1e3 / 60, $ = 1.7 * J, ee = 3.1 * J;

    function te(e, t, i, r, o) {
        if (!(e instanceof Function)) throw"timeout callback must be a function";
        t = t || 0, i = i || !1, r = r && r.constructor === Array ? r : [], o && o.constructor === Array ? 0 == o.length && (o = [n.DEF_GRP_NAME]) : o = o && "string" == typeof o ? [o] : [n.DEF_GRP_NAME], this.cb = e, this.cbParams = r, this.delayMS = 1e3 * t, this.originalDelayMS = this.delayMS, this.repeats = i, this.id = n.nextHandlerId++, this.frc = 0, te.timeouts[this.id] = this, n.addHandler(this, o)
    }

    te.timeouts = {}, te.clear = function (e) {
        if ("number" == typeof e && isFinite(e) && Math.round(e) === e) {
            var t = null;
            e in te.timeouts && (t = te.timeouts[e], delete te.timeouts[e], n.removeHandler(t))
        }
    }, te.tick = function () {
        var e = [];
        for (var t in te.timeouts) {
            (n = te.timeouts[t]).frc > 0 || n.tick() && e.push(t)
        }
        for (var i = 0; i < e.length; i++) {
            var n;
            t = e[i];
            if ((n = te.timeouts[t]) && (n.repeats || te.clear(parseInt(t)), void 0 !== n.cb)) try {
                n.cb.apply(window, n.cbParams)
            } catch (e) {
                window.onerror && window.onerror("Timeout.tick error: " + e.message, e.sourceURL, e.line, void 0, e)
            }
        }
    }, t.on("tick", te.tick, {freezeGroup: ENG_FRZ_GRP}), te.prototype.tick = function () {
        return this.delayMS -= J, this.delayMS <= 0 && (this.repeats && (this.delayMS = this.originalDelayMS + this.delayMS), !0)
    }, te.prototype.constructor = te, t.setTimeout = function (e, t, i, n) {
        return new te(e, t / 1e3, !1, i, n).id
    }, t.clearTimeout = function (e) {
        te.clear(e)
    }, t.setInterval = function (e, t, i, n) {
        return new te(e, t / 1e3, !0, i, n).id
    }, t.clearInterval = function (e) {
        te.clear(e)
    };
    var ie = function (e, t, i, r, o) {
        for (var a in i = null == i ? 1 : i, 1 != ie.multiplier && (i *= ie.multiplier), this.id = n.nextHandlerId++, this.frc = 0, this.tweenedProps = {}, this.offset = 1, this.method = r || ie.easeout, this.length = 1e3 * i / (1e3 / 60), this.target = e, t) this.tweenedProps[a] = {
            start: e[a],
            end: t[a]
        };
        ie.tweens[this.id] = this, o && o.constructor === Array ? 0 == o.length && (o = [n.DEF_GRP_NAME]) : o = o && "string" == typeof o ? [o] : [n.DEF_GRP_NAME], n.addHandler(this, o)
    };
    ie.multiplier = 1, ie.nextId = 1, ie.prototype.call = function (e, t) {
        return e instanceof Function || console.warn("Tween callback parsed to .call is not a function", e), this.callback = e, this.callbackParams = t, this
    }, ie.prototype.wait = function (e) {
        return this.delay = 1e3 * (e || 0) / (1e3 / 60), this
    }, ie.prototype.tick = function () {
        if (this.delay > 0) return this.delay--, !1;
        for (var e in this.tweenedProps) {
            var t = this.tweenedProps[e];
            this.target[e] = this.method(t.start, t.end instanceof Function ? t.end() : t.end, this.offset / this.length)
        }
        return this.offset++, this.offset > this.length || void 0
    }, ie.prototype.__complete = function () {
        for (var e in this.tweenedProps) this.target[e] = this.tweenedProps[e].end instanceof Function ? this.tweenedProps[e].end() : this.tweenedProps[e].end;
        if (this.callback) {
            var i = this;
            i.callback && t.once("animate", function () {
                i.callback.apply(i.target, i.callbackParams || null)
            }, {freezeGroup: ENG_FRZ_GRP})
        }
    }, ie.prototype.complete = function () {
        ie.complete(this)
    }, ie.prototype.clear = function () {
        ie.clear(this)
    }, ie.tweens = {}, ie.linear = ie.linary = function (e, t, i) {
        return e + (t - e) * i
    }, ie.easein = function (e, t, i) {
        return e + (t - e) * (1 - Math.sin(i * Math.PI / 2 + Math.PI / 2))
    }, ie.easeout = function (e, t, i) {
        return e + (t - e) * Math.sin(i * Math.PI / 2)
    }, ie.easeinout = function (e, t, i) {
        return e + (t - e) * ((Math.sin(i * Math.PI - Math.PI / 2) + 1) / 2)
    }, ie.bounce = function (e, t, i) {
        return e + (t - e) * Math.sin(i * Math.PI)
    }, ie.tick = function () {
        var e = [];
        for (var t in ie.tweens) {
            (r = ie.tweens[t]).frc > 0 || r.tick() && e.push(t)
        }
        for (var i = 0; i < e.length; i++) {
            if ((t = e[i]) in ie.tweens) {
                var r = ie.tweens[t];
                window.dirtyOnce = !0, delete ie.tweens[t], n.removeHandler(r), r.__complete()
            }
        }
    }, t.on("tick", ie.tick, {freezeGroup: ENG_FRZ_GRP}), ie.complete = function () {
        for (var e = 0; e < arguments.length; e++) {
            var t = arguments[e];
            for (var i in ie.tweens) if (i in ie.tweens) {
                var r = ie.tweens[i];
                r.target != t && r != t || (window.dirtyOnce = !0, delete ie.tweens[r.id], n.removeHandler(r), r.__complete())
            }
        }
    }, ie.clear = function () {
        for (var e = 0; e < arguments.length; e++) {
            var t = arguments[e];
            for (var i in ie.tweens) if (i in ie.tweens) {
                var r = ie.tweens[i];
                r.target != t && r != t || (r.callback = void 0, delete ie.tweens[r.id], n.removeHandler(r))
            }
        }
    }, ie.activeTweensCount = function () {
        var e = 0;
        for (var t in ie.tweens) {
            ie.tweens[t].frc > 0 || e++
        }
        return e
    }, e.Tween = ie;
    var ne = getNewCanvasObject();
    ne.height = ne.width = 1, ne.path = "Image wrapper for load failure";
    var re = {}, oe = {}, ae = e.fetch;

    function se(e) {
        if (!e) return console.warn("You tried to load an image with an empty path"), ne;
        if (void 0 === re[e]) {
            if (ae) return "string" == typeof e && console.info('"%s" not found in preloadCache. Calling native fetch().', e), ae.apply(this, arguments);
            "string" == typeof e ? console.error('You can only use the embed method in conjuction with preload for > "%s"', e) : console.error("Native fetch() missing:", arguments)
        }
        return re[e]
    }

    e.embed = function (e) {
        return se(e)
    }, e.fetch = function (e) {
        return oe[e] ? oe[e] : se.apply(this, arguments)
    }, e.preload = function () {
        function e(e) {
            window.dirtyOnce = !0, c--;
            for (var t = 0; t < d.length; t++) d[t](l, c);
            0 === c && function () {
                for (; h.length;) h.shift()();
                h = void 0, d = void 0
            }()
        }

        function i(t, i) {
            if (!oe[t]) {
                var r, o = embeddedAssets[t];
                if (o && o instanceof Array) delete embeddedAssets[t], i ? (r = getJSGImageWrapper(t, o[0], o[1])).ignoreScaleCache = i : (c++, l++, r = getJSGImageWrapper(t, o[0], o[1], e)), oe[t] = r; else n(t)
            }
        }

        function n(t) {
            if (t && "null" !== t) {
                var i, n = ("//" != (i = t).substring(0, 2) && "http" != i.substring(0, 4) && (i = vpath + i), i);
                if (void 0 === re[t]) {
                    oe[t], c++, l++;
                    var r, o, a, s, d, h = embeddedAssets[t];
                    if (oe[t] || h) oe[t] || h instanceof Array ? function (t) {
                        function i() {
                            e()
                        }

                        var n = embeddedAssets[t], r = oe[t] || getJSGImageWrapper(t, n[0], n[1]), o = re[t] = r.draw();
                        (o.complete || o.getContext) && o.width && o.height || o.isCanvas ? i() : (o.onload = i, o.onerror = function (i) {
                            re[t] = ne, window.onerror && window.onerror("Failure to generate image (JSG): " + t + " - " + i.message, i.sourceURL, i.line), e()
                        }), o.path = t
                    }(t) : (s = t, d = new Image, re[s] = d, d.onload = function () {
                        e()
                    }, d.onerror = function (t) {
                        re[s] = ne, window.onerror && window.onerror("Failure to generate image (Native): " + s + " - " + t.message, t.sourceURL, t.line), e()
                    }, d.path = s, d.src = embeddedAssets[s]), delete embeddedAssets[t]; else switch (n.substring(n.lastIndexOf("."))) {
                        case".wav":
                        case".mp3":
                            throw new Error("You should not preload sounds: " + n);
                        default:
                            r = t, o = n, (a = new Image).crossOrigin = "anonymous", a.onload = function () {
                                re[r] = a, e()
                            }, a.onerror = function (t) {
                                re[r] = ne, e()
                            }, a.path = r, a.src = o
                    }
                }
            }
        }

        function r(t, i) {
            c++, l++, Host.Preferences["Get" + t](i, e)
        }

        function o(i, n, r) {
            c++, l++, t.data._load(n, r, i, e)
        }

        function a(e) {
            var t = e.toString();
            if (!preload.skipScan) {
                for (; s = u.exec(t);) n(s[1]);
                for (; s = f.exec(t);) i(s[1], void 0 !== s[2]);
                for (; s = g.exec(t);) r(s[1], s[2]);
                for (; s = p.exec(t);) o(s[1], s[2], s[2]);
                for (; s = m.exec(t);) o(s[1], s[2], s[3])
            }
            a.systemVars || (a.systemVars = !0, r("Bool", "xs.muteStateOverload.v4"), r("Bool", "xs.muteSound.v4"), r("Bool", "xs.muteMusic.v4"), r("Bool", "instant.hasInstalledShortcut.v1"))
        }

        var s, l = 0, c = 0, d = [], h = [], u = /[^A-Za-z]embed\(\s*["']([^)]+?)["']\s*\)/g,
            f = /[^A-Za-z]fetch\(\s*["']([^)]+?)["']\s*[),](true|\!0)?/g,
            g = /[^A-Za-z]Host.Preferences.Quick([A-Za-z]+)\(\s*["'](.+?)["']\s*\)/g,
            p = /[^A-Za-z]XS\.data\.add([A-Za-z]+)\(\s*["']([^"']+)["']\s*(?:\)|,(?!\s*["']))/g,
            m = /[^A-Za-z]XS\.data\.add([A-Za-z]+)WithLocalKey\(\s*[\"|\']([^"']+)["']\s*,\s*["']([^"']+)["']\s*[,)]/g;
        a.systemVars = !1, l = 0, c++;
        for (var v, w = 0; w < arguments.length; w++) void 0 !== (v = arguments[w]) && (v instanceof Function ? (h.push(v), a(v)) : n(v));
        return setTimeout(function () {
            e()
        }, 1), function (e) {
            d && d.push(e)
        }
    };
    var le = (new Date).getTime();
    window.dirty = !1, window.dirtyOnce = !1;
    !function e() {
        var i = (new Date).getTime();
        if (l()) return le = i, void requestAnimationFrame(e);
        if (t.emit("animate"), i - le > 5e3 && (le = i), i - le > J && (le += J, t.emit("tick"), i - le > $)) for (le += J, t.emit("tick"); i - le > ee;) le += J, t.emit("tick");
        (t.dirty || window.dirty || window.dirtyOnce || 0 !== ie.activeTweensCount()) && (t.emit("render"), window.dirtyOnce = !1, t.renderer.render(t.stageContainer), t.emit("afterRender")), requestAnimationFrame(e)
    }(), window.performanceTest = function () {
        for (var e = (new Date).getTime(), i = 0; i < 1e3; i++) t.renderer.render(t.stageContainer);
        console.log((new Date).getTime() - e)
    }, setTimeout(function () {
        var e = (new Date).getTime(), t = (new Date).getTime(), i = {};
        requestAnimationFrame(function n() {
            var r = (new Date).getTime(), o = r - t;
            if (i[o] = (i[o] || 0) + 1, t = r, r - e < 6e4) requestAnimationFrame(n); else {
                var a = 0, s = 0;
                for (var l in i) a += l * i[l], s += i[l];
                var c = Math.round(1e3 / (a / s));
                void 0 !== Config && "undefined" != typeof ga ? (ga("send", "event", Config.id, "Performance", "Avg Framerate", c), c < 30 && ga("send", "event", Config.id, "Performance", "Below 30 Framerate", c), c < 15 && ga("send", "event", Config.id, "Performance", "Below 15 Framerate", c), c < 10 && ga("send", "event", Config.id, "Performance", "Below 10 Framerate", c)) : console.log("Can't yet send events about trackFrameSpeed perf"), i = t = null
            }
        })
    }, 2e3), e.gameHeight = height, e.gameWidth = width, LEGACY_COORD_SYSTEM ? (e.stage = new N, I(e.stage)) : (e.stage = new z, t.stage = e.stage, I(e.stage)), stage.hitArea = new i.Rectangle(0, -1e4, 1e5, 1e5), stage.interactive = !0, stage.touchstart = function () {
    }, t.stageContainer.addChild(stage), stage.orientation = "landscape", stage.orientationMode = "dynamic";
    var ce = getNewCanvasObject(), de = ce.getContext("2d"), he = new q(Texture.emptyTexture), ue = new i.Graphics;
    stage.addChild(he), stage.addChild(ue);
    var fe = 0, ge = 0, pe = {top: 0, bottom: 0, left: 0, right: 0};

    function me(e, t, i) {
        return void 0 === e ? e : e.toString() === e && "%" == e[e.length - 1] ? t * (parseInt(e.substring(0, e.length - 1)) / 100) : e * i
    }

    stage.background = {color: "#000000", gradient: void 0, texture: void 0, callback: void 0, disabled: !1};
    var ve = {};

    function we(e) {
        if (he.texture.destroy(!0), e.target) {
            var i = new Texture.fromCanvas(e.target);
            he.setTexture(i), LEGACY_COORD_SYSTEM || (he.width = t.stage.width + 5, he.height = t.stage.height + 5)
        }
        window.dirtyOnce = !0, F(e.target)
    }

    function be(e) {
        var t = e.error || e;
        window.dirtyOnce = !0, window.onerror && window.onerror("Failure to generate background: " + t.message, t), F(e.target)
    }

    stage.background.embellish = function (i) {
        if (ve != i) {
            ve = i;
            for (var n = [], r = 0; r < i.length; r++) n.push(i[r].path);
            n.push(function () {
                for (var e = 0; e < i.length; e++) i[e].image = embed(i[e].path);
                stage.background.callback = function (e, n) {
                    for (var r = 0; r < i.length; r++) {
                        var o = i[r], a = height / targetWidth * t.devicePixelRatio, s = o.image.width * a,
                            l = o.image.height * a, c = 0, d = 0, h = me(o.left, e.width, a),
                            u = me(o.right, e.width, a), f = me(o.top, e.width, a), g = me(o.bottom, e.width, a);
                        void 0 !== h && void 0 !== u && (s = e.width - 5 - h - u), void 0 !== h && (c = h), void 0 !== u && (c = e.width - u - s), void 0 !== f && void 0 !== g && (l = e.height - 5 - f - g), void 0 !== f && (d = f), void 0 !== g && (d = e.height - 5 - g - l), c += me(o.offsetX, s, 1) || 0, d += me(o.offsetY, l, 1) || 0, n.drawImage(o.image, c, d, s, l)
                    }
                }, Se(!0)
            }), preload.apply(e, n)
        }
    }, t.getScreenshot = function () {
        stage.updateTransform();
        var e = getNewCanvasObject();
        e.style.width = (e.width = width * t.devicePixelRatio) / t.devicePixelRatio + "px", e.style.height = (e.height = height * t.devicePixelRatio) / t.devicePixelRatio + "px";
        var i = {
            context: e.getContext("2d"),
            maskManager: null,
            scaleMode: null,
            smoothProperty: null,
            currentBlendMode: 0
        };
        return stage._renderCanvas(i), e
    }, t.getTintedTexture = i.CanvasTinter.getTintedTexture, stage.background.drawBackground = function (e, i, n, r, o, a) {
        if (e.fillStyle = stage.background.color, e.fillRect(0, 0, i, n), r) {
            var s;
            switch (r.type) {
                case"radial":
                    var l = null == r.multiplier ? 1 : r.multiplier,
                        c = null == r.verticalOffset ? .5 : r.verticalOffset;
                    s = e.createRadialGradient(i / 2, n * c, 0, i / 2, n * c, Math.max(i / 2, n / 2) * l);
                    break;
                case"linear":
                    s = e.createLinearGradient(i * (r.width || 0), n, 0, 0);
                    break;
                default:
                    throw"Unsupported radial format"
            }
            for (var d = 0; d < r.stops.length; d++) s.addColorStop.apply(s, r.stops[d]);
            e.fillStyle = s, e.fillRect(0, 0, i, n)
        }
        if (a && a(ce, e), o) {
            if (!o.scaled) {
                var h = o.scaled = getNewCanvasObject();
                if (o.isJSG) {
                    var u = o.draw({scale: 1, forceCanvas: !0, noAtlas: !0}).canvas;
                    h.width = Math.ceil(o.frame.width * t.devicePixelRatio), h.height = Math.ceil(o.frame.height * t.devicePixelRatio), h.getContext("2d").drawImage(u, o.frame.x, o.frame.y, o.frame.width, o.frame.height, 0, 0, h.width, h.height)
                } else h.width = Math.ceil(o.width * t.devicePixelRatio / 2), h.height = Math.ceil(o.height * t.devicePixelRatio / 2), h.getContext("2d").drawImage(o, 0, 0, o.width, o.height, 0, 0, h.width, h.height)
            }
            var f = e.createPattern(o.scaled, "repeat");
            e.fillStyle = f, e.fillRect(0, 0, i, n)
        }
        t.emit("backgroundredraw", {context: e})
    };
    var ye = new Image;

    function Se(e) {
        if ((e || fe != width || ge != height || pe.top != (t.styles.margins.top || 0) || pe.bottom != (t.styles.margins.bottom || 0) || pe.left != (t.styles.margins.left || 0) || pe.right != (t.styles.margins.right || 0)) && t.initComplete) if (fe = width, ge = height, pe.top = t.styles.margins.top || 0, pe.bottom = t.styles.margins.bottom || 0, pe.left = t.styles.margins.left || 0, pe.right = t.styles.margins.right || 0, stage.background.disabled) he.parent && stage.removeChild(he), ue.clear(), ue.beginFill(t.stageContainer.backgroundColor, 1), LEGACY_COORD_SYSTEM ? ue.drawRect(0, 0, width * t.devicePixelRatio, height * t.devicePixelRatio) : ue.drawRect(0, 0, t.stage.width, t.stage.height), ue.endFill(); else {
            if (ue.parent && stage.removeChild(ue), LEGACY_COORD_SYSTEM) ce.width = width * t.devicePixelRatio + 5, ce.height = height * t.devicePixelRatio + 5; else if (t.stage.width > t.stage.height && t.stage.width > 2048) {
                var i = t.stage.height / t.stage.width;
                ce.width = 2053, ce.height = 2048 * i + 5
            } else if (t.stage.height > t.stage.width && t.stage.height > 2048) {
                i = t.stage.width / t.stage.height;
                ce.width = 2048 * i + 5, ce.height = 2053
            } else ce.width = t.stage.width + 5, ce.height = t.stage.height + 5;
            stage.background.drawBackground(de, ce.width, ce.height, stage.background.gradient, stage.background.texture, stage.background.callback), Host.dataUrlsSupported ? (ye, (ye = new Image).onload = we, ye.onerror = be, ye.src = ce.toDataURL(), ce.width = ce.height = 1) : (he.texture.destroy(!0), he.setTexture(new Texture.fromCanvas(ce)), LEGACY_COORD_SYSTEM || (he.width = t.stage.width + 5, he.height = t.stage.height + 5)), he.y = -t.styles.margins.top * t.devicePixelRatio, window.dirtyOnce = !0
        }
    }

    stage.background.refresh = Se, window.targetWidth = 2732, window.targetHeight = 2048, window.forceRatio = !1;
    var xe = 0;

    function Ce() {
        var e = document.documentElement.clientHeight;
        return t.is.iOS && !t.is.facebookInstant && (e = window.innerHeight || e), Math.max(e, 100)
    }

    function Te() {
        return Math.max(document.documentElement.clientWidth, 100)
    }

    var _e = {}, ke = -1;

    function Me(e) {
        if (-1 != e && e != ke) {
            for (var i in ke = e, _e) delete _e[i];
            for (var n in oe) {
                var r = oe[n];
                if (!r.ignoreScaleCache) {
                    var o = r.draw({scale: e, instantDraw: t.initComplete});
                    n = n + ":" + e;
                    o.isJSGCache = !0, o.ratio = e, o.path = n, _e[n] = o
                }
            }
        }
    }

    t.initComplete = !1;
    var Re = 0, Ee = 0, Ae = 0, Be = 0, Le = 0, Ge = 0, Pe = 0, Ie = z.expand(function (e, i) {
        var n = z.call(this, e, i);
        n.topLeft = n.addChild(new N), n.top = n.addChild(new N), n.topRight = n.addChild(new N), n.bottomLeft = n.addChild(new N), n.bottom = n.addChild(new N), n.bottomRight = n.addChild(new N), n.left = n.addChild(new N), n.right = n.addChild(new N), n.center = n.addChild(new N), n.groups = [n.topLeft, n.top, n.topRight, n.left, n.center, n.right, n.bottomLeft, n.bottom, n.bottomRight], n.margins = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        }, t.on("resize", function () {
            var e = t.gui.width, i = t.gui.height;
            n.topLeft.x = n.margins.left, n.topLeft.y = n.margins.top, n.top.x = e / 2, n.top.y = n.margins.top, n.topRight.x = e - n.margins.right, n.topRight.y = n.margins.top, n.left.x = n.margins.left, n.left.y = i / 2, n.center.x = e / 2, n.center.y = i / 2, n.right.x = e - n.margins.right, n.right.y = i / 2, n.bottomLeft.x = n.margins.left, n.bottomLeft.y = i - n.margins.bottom, n.bottom.x = e / 2, n.bottom.y = i - n.margins.bottom, n.bottomRight.x = e - n.margins.right, n.bottomRight.y = i - n.margins.bottom
        }, {freezeGroup: ENG_FRZ_GRP})
    });

    function Oe(i) {
        clearTimeout(Le);
        var n = i.instant, r = Te(), o = Ce();
        void 0 !== i.forced_width && (r = i.forced_width), void 0 !== i.forced_height && (o = i.forced_height);
        var a = Math.max(o - t.styles.margins.top - t.styles.spacing.top - t.styles.spacing.bottom - t.styles.margins.bottom, 10),
            s = Math.max(r - t.styles.margins.left - t.styles.spacing.left - t.styles.spacing.right - t.styles.margins.right, 10);
        if (i.forced || Ae != a || Be != s || Re != r || Ee != o) {
            clearTimeout(Pe), Re = e.width = r, Ee = e.height = o, Ae = a, Be = s;
            var l = 2 * Math.ceil(e.width / 2) * t.devicePixelRatio >> 0,
                c = 2 * Math.ceil(e.height / 2) * t.devicePixelRatio >> 0;
            t.is.iOS && (window.scrollTo && window.scrollTo(0, -1), n || (document.body.style.height = t.renderer.view.style.height = 1 + (c / t.devicePixelRatio >> 0) + "px")), t.is.iOS ? (clearTimeout(xe), n ? p() : xe = setTimeout(p, 500)) : p();
            var d = targetWidth, h = targetHeight, u = stage.orientation;
            "dynamic" == stage.orientationMode && (u = e.width <= a ? "portrait" : "landscape"), "portrait" == u && (h = targetWidth, d = targetHeight);
            var f, g = window.forceRatio ? window.forceRatio : Math.min(Math.min(l / d, c / h), 1);
            if (LEGACY_COORD_SYSTEM ? (g = window.forceRatio ? window.forceRatio : Math.min(Math.min(s * t.devicePixelRatio / d, a * t.devicePixelRatio / h), 1), i.forced && (stage.ratio = -1), stage.ratio != g && Me(g)) : (i.forced && (stage.resolution = -1), stage.resolution != g && Me(g)), LEGACY_COORD_SYSTEM) stage.ratio == g && stage.orientation == u || (stage.ratio = g); else if (stage.resolution != g || stage.orientation != u) {
                stage.scale.set(g, g * t.devixePixelRatio), t.gui.scale.set(.5 * t.devicePixelRatio, .5 * t.devicePixelRatio);
                t.gui.resolution = 1, stage.resolution = 1 * g
            }
            if (e.gameHeight = a, e.gameWidth = s, t.resizeAd(), LEGACY_COORD_SYSTEM) stage.y = t.styles.margins.top * t.devicePixelRatio - t.styles.spacing.bottom * t.devicePixelRatio; else t.stageContainer.dimensions = f = new Point(width * t.devicePixelRatio, height * t.devicePixelRatio), stage.dimensions = stage.toLocalSize(f), t.gui.dimensions = t.gui.toLocalSize(f), clearTimeout(Ge), Ge = setTimeout(function () {
                t.stageContainer.applyResolutionRecursive()
            }, 300);
            stage.orientation = u, t.size = {
                game: {width: s, height: a},
                target: {width: d, height: h},
                canvas: {width: width * t.devicePixelRatio, height: height * t.devicePixelRatio},
                canvasSafe: {
                    width: width - t.styles.spacing.left - t.styles.spacing.right,
                    height: height - t.styles.spacing.top - t.styles.spacing.bottom
                },
                stage: {
                    width: width / (stage.scale.x / t.stageContainer.scale.x),
                    height: height / (stage.scale.y / t.stageContainer.scale.y)
                }
            }, t.emit("resize", i)
        }

        function p() {
            t.renderer.resize(l, c), t.renderer.view.style.width = (l / t.devicePixelRatio >> 0) + "px", t.renderer.view.style.height = (c / t.devicePixelRatio >> 0) + "px", t.is.android && (document.body.style.width = Math.ceil(e.width) + "px", document.body.style.height = Math.ceil(e.height) + "px"), window.dirtyOnce = !0, window.scrollTo && window.scrollTo(0, 0), t.renderer.render(t.stageContainer)
        }
    }

    function Xe(e) {
        window.inScreenshotMode || height == Ce() && width == Te() || (e ? t.initComplete && window.onresize() : Le = setTimeout(function () {
            Xe(!0)
        }, 1))
    }

    t.gui = new Ie, t.stageContainer.addChild(t.gui), t.on("force-resize", function () {
        Oe({forced: !0})
    }, {freezeGroup: ENG_FRZ_GRP}), t.on("resize", function () {
        t.once("resize", function () {
            Se()
        }, {freezeGroup: ENG_FRZ_GRP})
    }, {freezeGroup: ENG_FRZ_GRP}), setInterval(function () {
        Xe(!1)
    }, 500), window.inScreenshotMode || (window.onunload && (window.onunload = function () {
        setTimeout(function () {
            window.onresize()
        }, 1)
    }), t.on("focus", function () {
        clearTimeout(Pe), Pe = setTimeout(function () {
            Oe({forced: t.is.iOS})
        }, t.is.iOS ? 500 : 1)
    }, {freezeGroup: ENG_FRZ_GRP})), -1 != window.location.href.indexOf("deterministicRand") ? (console.log("Querystring flag 'deterministicRand' detected. XS.rand is now deterministic."), t.rand = Math.seed()) : t.rand = function () {
        return Math.random()
    }
}(window), (XS || {}).VERSION = "1.4.0", function (e) {
    var t = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, i = /^\s*\-\s*/;

    function n(e) {
        return (e < 10 ? "0" : "") + e
    }

    function r() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
            var t = 16 * Math.random() | 0;
            return ("x" == e ? t : 3 & t | 8).toString(16)
        })
    }

    var o = /[-_]([a-z])/gi, a = /([a-z])([A-Z])|([A-Z])([A-Z])[a-z]/g;

    function s(e) {
        return e.replace(o, function (e) {
            return e[1].toUpperCase()
        })
    }

    function l(e) {
        return e.replace(a, function (e) {
            return e[0] + "_" + e.substr(1)
        }).toLowerCase()
    }

    function c() {
        var t = this;
        t.timeStart = e && e.__FRVR && e.__FRVR.startTime || Date.now(), t.timeLoaded = void 0, t.handleGameLoaded = t.handleGameLoaded.bind(this), t.handleFBInstantStart = t.handleFBInstantStart.bind(this), t.handleFBInstantPreloadComplete = t.handleFBInstantPreloadComplete.bind(this), t.handleRefreshPersistentData = t.handleRefreshPersistentData.bind(this), t.handlePlaySession = t.handlePlaySession.bind(this), t.isSessionTimedOut = t.isSessionTimedOut.bind(this), t.extendSession = t.extendSession.bind(this), t.data = {}, t.dataStore = {}, t.dataIsDirty = !0, t.providers = {}, t.DEBUG = !1, t.tld = function () {
            for (var e = document.location.hostname.split("."), t = e.length - 1; t >= 0; t--) {
                var i = e.slice(t).join(".");
                if (document.cookie = "get_tld=test;domain=." + i + ";", document.cookie.indexOf("get_tld") > -1) return document.cookie = "get_tld=;domain=." + i + ";expires=Thu, 01 Jan 1970 00:00:01 GMT;", i
            }
            return ""
        }(), this.facebook_entrypoint = this.facebook_context_type = null, this.facebook_player_id = h.is.facebookInstant && FBInstant.player && FBInstant.player.getID ? FBInstant.player.getID() : null, this.events = []
    }

    var d = c.prototype;
    d.init = function () {
        this.initData(function () {
            this.send("device_info"), h.on("gameLoaded", this.handleGameLoaded), Host.on("FBInstantPreloadComplete", this.handleFBInstantPreloadComplete), Host.on("FBInstantStart", this.handleFBInstantStart);
            var e = this.customEvent.bind(this);
            setTimeout(function () {
                e("session_engage_low")
            }, 6e4), setTimeout(function () {
                e("session_engage_high")
            }, 6e5);
            var t = window.onerror, i = this.send.bind(this);
            window.onerror = function (e, n, r, o, a) {
                if (n instanceof Error && (a = n, n = void 0), a = a || new Error(e), t) try {
                    t(e, n, r, o, a)
                } catch (e) {
                }
                if (!a.xsTracked) try {
                    i("error", {msg: e, line: r, col: o, label: a.stack || JSON.stringify(a)}), a.xsTracked = !0
                } catch (e) {
                }
                return !1
            };
            var n = window.onunhandledrejection;
            window.onunhandledrejection = function (e) {
                if (n) try {
                    n(e)
                } catch (e) {
                }
                try {
                    var t = e && e.reason || {};
                    i("error", {
                        msg: t.message,
                        line: 0,
                        col: 0,
                        label: "unhandled_rejection: " + (t.stack || JSON.stringify(t))
                    })
                } catch (e) {
                }
            }
        }.bind(this))
    }, d.initUserId = function () {
        if (Host.userId) this.userId = Host.userId, this.globalUserId = Host.userId; else {
            var e = function (e) {
                var t = e || "-";

                function i() {
                    return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
                }

                var n = (new Date).getTime().toString(16).slice(0, 11) + (65536 * (1 + Math.random()) | 0).toString(16).substring(1, 2);
                return i() + i() + t + i() + t + i() + t + i() + t + n
            }();
            h.data.addString("__frvr_user_id", {
                default: e, remote: !0, merge: function (e, t) {
                    return t
                }, prefix: "global"
            }), this.userId = h.data.__frvr_user_id = "undefined" === h.data.__frvr_user_id || void 0 === h.data.__frvr_user_id ? e : h.data.__frvr_user_id;
            var t = document.cookie.match("^(?:.*_frvr=([^;]*)).*$");
            this.globalUserId = t && t.length > 1 ? t[1] : window._xsTrackGlobalUserIdOverride ? window._xsTrackGlobalUserIdOverride : e;
            var i = new Date;
            i.setDate(i.getDate() + 730), document.cookie = "_frvr=" + this.globalUserId + "; path=/; expires=" + new Date(i).toUTCString() + "; domain=" + this.tld + ";", Host.emit("xstrack:InitUserId", {globalUserId: this.globalUserId})
        }
    }, d.initData = function (e) {
        var t = c.DATAKEY, i = c.PERSISTENT_DATA, n = this, o = this.dataStore = {
            app_id: "com.frvr." + Config.id,
            app_name: Config.id,
            app_version: Config.version,
            app_build: Config.build,
            play_session_count: 0,
            cohort: this.getDate(),
            days_elapsed: 0,
            last_day_played: this.getDate(),
            days_played: 0,
            channel: this.getChannel(),
            utm_source: this.getUTMField("source"),
            utm_medium: this.getUTMField("medium"),
            utm_campaign: this.getUTMField("campaign"),
            utm_term: this.getUTMField("term"),
            utm_content: this.getUTMField("content"),
            play_session_id: r(),
            play_session_id_time: Date.now(),
            screen: "init",
            facebook_referral_player_id: void 0,
            ad_id: void 0,
            ad_segment: void 0,
            currency_amount: 0,
            missions_completed: 0,
            progression: 0,
            games_played: 0,
            game_start_time: -1,
            remote_user_id: void 0,
            device_width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            device_height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
            xstrack_version: "1.0.2"
        };
        this.initUserId(), this.initDeviceId();
        var a = {};

        function s(e) {
            return {
                get: function () {
                    return o[e]
                }, set: function (t) {
                    return o[e] !== t && (o[e] = t, -1 === c.DATA_EXCLUDE_DIRTY.indexOf(e) && (n.dataIsDirty = !0), -1 !== i.indexOf(e) && n.savePersistentData()), o[e]
                }
            }
        }

        for (var l in o) Object.defineProperty(n.data, l, s(l)), -1 !== i.indexOf(l) && (a[l] = o[l]);
        h.data.on("dataloaded", this.handleRefreshPersistentData), h.data.addObject(t, {
            remote: !0,
            default: a,
            merge: function (e, t) {
                return e.cohort && t.cohort && t.cohort >= e.cohort ? t : e
            }
        }, function () {
            try {
                n.loadPersistentData()
            } catch (e) {
            }
            e()
        })
    }, d.initDeviceId = function () {
        var e = this.dataStore;
        if (Host.idfa) e.deviceId = Host.idfa, this.send("idfa"); else {
            function t(t) {
                t && (e.deviceId = t.result, this.send("idfa"))
            }

            h.is.iOS && Host.IOS && Host.IOS.GetIDFA && Host.IOS.GetIDFA(t), h.is.android && Host.GoogleAds && Host.GoogleAds.GetIDFA && Host.GoogleAds.GetIDFA(t)
        }
    }, d.loadPersistentData = function () {
        for (var e = c.DATAKEY, t = c.PERSISTENT_DATA, i = this.dataStore, n = h.data[e] || {}, r = 0; r < t.length; r++) {
            var o = t[r];
            i[o] !== n[o] && (i[o] = n[o], !0, this.dataIsDirty = !0)
        }
        i.days_elapsed = Math.floor((Date.parse(this.getDate()) - Date.parse(i.cohort)) / 864e5)
    }, d.savePersistentData = function () {
        for (var e = c.DATAKEY, t = c.PERSISTENT_DATA, i = this.dataStore, n = h.data[e], r = !1, o = 0; o < t.length; o++) {
            var a = t[o];
            i[a] !== n[a] && (r = !0, n[a] = i[a])
        }
        r && h.data.setDirty(e)
    }, d.buildEventContext = function (e, t, i) {
        var n = this.dataStore, r = {name: e, value: t, _params: i, _globals: n};
        for (var o in i) r[o] = i[o];
        for (var o in n) r[o] = n[o];
        var a = this.data.game_start_time;
        return r.game_duration = -1 === a ? 0 : Date.now() - a, r.loading_time = this.timeLoaded - this.timeStart, r
    }, d.parseArgs = function (e, t) {
        try {
            return function (e, t) {
                var i, n, r, o = 0;

                function a(e) {
                    return e.length
                }

                function s(e) {
                    return (i[e] || e)()
                }

                function l(e) {
                    return function () {
                        var t = o, i = e();
                        return null === i && (o = t), i
                    }
                }

                function c(t) {
                    return l(function () {
                        var i = t.exec(e.substr(o));
                        return null === i || 0 !== i.index ? null : (o += a(i[0]), i[1])
                    })
                }

                function d(e) {
                    return l(function () {
                        for (var t = [], i = 0; i < a(e); i++) {
                            if (null === (n = s(e[i]))) return n;
                            t.push(n)
                        }
                        return t
                    })
                }

                function h(e) {
                    return l(function () {
                        for (var t = 0; t < a(e); t++) if (null !== (n = s(e[t]))) return n;
                        return null
                    })
                }

                function u(e, t, i) {
                    return l(function () {
                        for (var r = []; null !== (n = s(e)) && (r.push(n), null !== (n = s(t)));) !0 === i && r.push(n);
                        return r
                    })
                }

                i = {
                    ident: c(/([a-zA-Z_][a-zA-Z0-9_]*)/),
                    argSep: c(/(\s*,\s*)/),
                    expSep: c(/([:./])/),
                    objStart: c(/(\s*{\s*)/),
                    objEnd: c(/(\s*}\s*)/),
                    char: c(/([a-zA-Z0-9_ ]+)/),
                    numStr: c(/([0-9]+(\.[0-9]+)?)/),
                    assign: c(/(\s*\=\s*)/),
                    sQStr: c(/\'([^']*)\'/),
                    dQStr: c(/\"([^"]*)\"/),
                    number: l(function () {
                        return null !== (n = s("numStr")) ? parseFloat(n) : null
                    }),
                    string: h(["sQStr", "dQStr"]),
                    ref: l(function () {
                        return null !== (n = s("ident")) ? t[n] : null
                    }),
                    objProp: h([d(["ident", "assign", "exp"]), "ident"]),
                    objProps: u("objProp", "argSep"),
                    object: (r = d(["objStart", "objProps", "objEnd"]), l(function () {
                        if (null === (n = s(r))) return null;
                        for (var e, i, o = {}, l = n[1], c = 0; c < a(l); c++) if (i = "string" == typeof l[c] ? (e = l[c], t[e]) : (e = l[c][0], l[c][2]), "_merge" === e) for (var d in i) o[d] = i[d]; else void 0 !== i && (o[e] = i);
                        return o
                    })),
                    exp: h(["ref", "number", "string", "object"]),
                    argDef: u("exp", "expSep", !0),
                    arg: l(function () {
                        return null === (n = s("argDef")) ? n : 1 < a(n) ? n.join("") : n[0]
                    }),
                    args: u("arg", "argSep")
                }, e = e || "";
                var f = s("args");
                if (o < a(e)) throw new Error("Left over tokens at " + o + ', "' + e.substr(o) + '"');
                return f
            }(e, t)
        } catch (t) {
            throw console.error('Parse error for event mapping: "' + e + '"'), t
        }
    }, d.getDate = function () {
        var e = new Date;
        return e.getUTCFullYear() + "-" + n(e.getUTCMonth() + 1) + "-" + n(e.getUTCDate())
    }, d.getDeviceID = function () {
        return this.dataStore.deviceId
    }, d.getUtmString = function () {
        if (document && document.location && document.location.search) {
            var e = document.location.search || "";
            return [(e = e.replace(/^\?/, "")).replace(/^(?:.*utm_source=([^&]*)|).*$/, "$1") || "none", e.replace(/^(?:.*utm_medium=([^&]*)|).*$/, "$1") || "none", e.replace(/^(?:.*utm_campaign=([^&]*)|).*$/, "$1") || "none"].join("_")
        }
    }, d.getUTMField = function (e) {
        var t = document && document.location && document.location.search || "",
            i = (t = t.replace(/^\?/, "")).match("^(?:.*utm_" + e + "=([^&]*)|).*$");
        return i.length > 1 ? i[1] : void 0
    }, d.getChannel = function () {
        var e = "other", t = c.MAP_IS_TO_CHANNEL;
        for (var i in t) h.is[i] && (e = t[i]);
        return "web_safari" !== e && "web_chrome" !== e || !h.is.iOS || (e += "_ios"), e
    }, d.handleFBInstantPreloadComplete = function () {
    }, d.handleFBInstantStart = function () {
        this.facebook_context_type = FBInstant.context.getType(), FBInstant.getEntryPointAsync && FBInstant.getEntryPointAsync().then(this.handleEntryPointAsync.bind(this));
        var e = (FBInstant.context.getType() || "unspecified").toLowerCase();
        this.facebook_context_type = e, FBInstant && FBInstant.getTournamentAsync ? FBInstant.getTournamentAsync().then(function () {
            e = "viralleaderboard", this.facebook_context_type = e, h.track.customEvent("context", void 0, {context_type: e})
        }.bind(this)).catch(function (t) {
            h.track.customEvent("context", void 0, {context_type: e})
        }) : h.track.customEvent("context", void 0, {context_type: e})
    }, d.handleEntryPointAsync = function (e) {
        var t = FBInstant.getEntryPointData() || {};
        if (this.facebook_referral_player_id = t.previous_player_id, this.ad_id = t.fb_instant_game_ad_id, this.ad_segment = t.segment, this.utm_source = t.utm_source || (t.fb_instant_game_ad_id ? "instant" : null), this.utm_medium = t.utm_medium || (t.fb_instant_game_ad_id ? "paid" : null), this.utm_campaign = t.utm_campaign || (t.fb_instant_game_ad_id ? t.fb_instant_game_ad_id : null), t.utm) {
            var i = t.utm || {};
            this.utm_string = [i.utm_source || "none", i.utm_medium || "none", i.utm_campaign || "none"].join("_"), this.utm_source = i.utm_source, this.utm_medium = i.utm_medium, this.utm_campaign = i.utm_campaign
        }
        this.facebook_entrypoint = e, this.event("entry_point")
    }, d.handleGameLoaded = function () {
        this.timeLoaded = Date.now(), this.send("game_loaded", void 0)
    }, d.handleRefreshPersistentData = function (e) {
        -1 !== e.changedFields.indexOf(c.DATAKEY) && this.loadPersistentData()
    }, d.isSessionTimedOut = function () {
        var e = this.data.play_session_id_time, t = Date.now();
        return void 0 === e || t - e >= c.PLAYSESSIONID_TIMEOUT
    }, d.extendSession = function () {
        this.data.play_session_id_time = Date.now()
    }, d.handlePlaySession = function (e) {
        this.isSessionTimedOut() ? (this.data.play_session_id = r(), this.data.play_session_id_time = Date.now()) : this.extendSession()
    }, d.addHandler = function (e, t) {
        if ("default" !== e) if ("object" != typeof e) {
            var i = s(e);
            if (e = l(e), d.hasOwnProperty(i)) throw new Error('Invalid event handler name "' + i + '", Please choose a different even name.');
            -1 === this.events.indexOf(e) && this.events.push(e), this[i] = t.bind(this)
        } else {
            Object.keys(e).length;
            for (var n in e) this.addHandler(n, e[n])
        }
    }, d.addProvider = function (e, t) {
        this.providers[e] = t, t.name = t.name || e;
        var i = _jsonData["track-" + t.name];
        t.config = i;
        var n = t.blacklist || "";
        t.blacklist = [], t.enabled = !1 !== t.enabled, this.updateBlacklist(e, n), this.updateBlacklist(e, i.blacklist), "string" == typeof t.blacklist && (t.blacklist = t.blacklist.split(",")), "function" != typeof t.parseArgs && "function" == typeof t.oninit && t.oninit(i, this.dataStore), t.parseArgs = this.parseArgs, t.event = this.sendProviderEvent.bind(this, t), this.addEventMapping(e, i.events)
    }, d.addEventMapping = function (e, t, i) {
        var n = this.providers[e];
        if (void 0 !== n) if ("object" != typeof t) if (-1 === t.indexOf(",")) n.eventMap = n.eventMap || {}, t = l(t), n.eventMap[t] = i, this.hasOwnProperty(s(t)) || this.addHandler(t, this.send.bind(this, t)); else for (var r = t.split(","), o = 0; o < r.length; o++) this.addEventMapping(e, r[o], i); else for (var a in t) this.addEventMapping(e, a, t[a]); else console.warn('XSTrack.addEventMapping > analytics provider "' + e + '" not found.')
    }, d.updateBlacklist = function (e, n) {
        var r = this.providers[e] || {};
        if (void 0 !== r) for (var o = r.blacklist, a = (n || "").split(","), s = 0; s < a.length; s++) {
            var l = a[s].replace(t, ""), c = l.replace(i, ""), d = o.indexOf(c);
            i.test(l) ? -1 !== d && o.splice(d, 1) : -1 === d && o.push(c)
        }
    }, d.sendProviderEvent = function (e, t, i, n, r) {
        if (r = r || {}, ("error" !== t || "ga" !== e.name && "fbi" !== e.name) && !1 !== e.enabled && "function" == typeof e.onevent && -1 === e.blacklist.indexOf(t)) {
            var o = e.eventMap[t] || e.eventMap.default;
            void 0 !== o && e.onevent(t, i, n, r, this.parseArgs(o, r))
        }
    }, d.send = function (e, t, i) {
        "object" == typeof t && (i = t, t = void 0), i = i || {};
        var n = c.NON_INTERACTION_EVENTS.indexOf(e) >= 0;
        n || this.handlePlaySession();
        var r = this.buildEventContext(e, t, i);
        for (var o in r._userId = this.userId, r.global_user_id = this.globalUserId, r.facebook_entrypoint = this.facebook_entrypoint, r.facebook_context_type = "undefined" != typeof FBInstant && FBInstant && FBInstant.context ? FBInstant.context.getType() : this.facebook_context_type, r.facebook_player_id = this.facebook_player_id, r.non_interaction = n ? 1 : 0, this.providers) this.providers[o].event(e, t, i, r)
    }, d.set = function (e, t) {
        return this.data[e] = t, t
    }, d.inc = function (e, t) {
        return this.set(e, (this.data[e] || 0) + (void 0 === t ? 1 : t)), this.data[e]
    }, d.updateScreen = function (e) {
        this.set("screen", e)
    }, d.updateCurrencyAmount = function (e) {
        this.set("currency_amount", e)
    }, d.updateMissionsCompleted = function (e) {
        this.set("missions_completed", e)
    }, d.updateProgression = function (e) {
        this.set("progression", e)
    }, d.event = d.customEvent = function (e, t, i) {
        this.send(e, t, i)
    }, d.error = d.errorEvent = function (e, t, i) {
        this.send("error", void 0, {message: e})
    }, c.DATAKEY = "xstrack", c.PERSISTENT_DATA = ["cohort", "play_session_id", "play_session_id_time", "play_session_count", "last_day_played", "days_played", "games_played"], c.MAP_IS_TO_CHANNEL = {
        edge: "web_edge",
        firefox: "web_firefox",
        opera: "web_opera",
        safari: "web_safari",
        chrome: "web_chrome",
        samsungBrowser: "web_samsung",
        samsungBrowserM4S: "web_samsung_m4s",
        silk: "web_silk",
        chromeWrapper: "chromeos",
        androidWrapper: "android",
        iOSWrapper: "ios",
        rcs: "rcs",
        samsungAppStore: "samsung",
        facebookInstant: "facebook_instant",
        facebookAppWeb: "facebook_canvasweb",
        facebookApp: "facebook_canvas",
        samsungBixby: "bixby",
        samsungGameLauncher: "samsung_game_launcher",
        samsungInstantPlay: "samsung_instant_play",
        iMessageContext: "imessage",
        spilGamesWrapper: "spil",
        vkru: "vkru",
        okru: "okru",
        kongregate: "kongregate",
        kik: "kik",
        twitter: "twitter",
        twitch: "twitch",
        hago: "hago",
        oppoGlobal: "oppo_global",
        tMobile: "tmobile",
        huawei: "huawei",
        huaweiquickapp: "huawei_quick_app",
        yandex: "yandex",
        crazyGames: "crazy_games",
        lgtv: "lg_tv"
    }, c.NON_INTERACTION_EVENTS = ["keepalive", "session_engage_low", "session_engage_high"], c.PLAYSESSIONID_TIMEOUT = 18e5, c.DATA_EXCLUDE_DIRTY = ["play_session_id_time"], d.page = function (e, t) {
        throw new Error("DEPRECATED: XS.track.page")
    }, d.timing = function (e, t, i, n) {
        throw new Error("DEPRECATED: XS.track.timing")
    }, d.exception = function (e, t) {
        throw new Error("DEPRECATED: XS.track.exception")
    }, d.loaded = function () {
        throw new Error("DEPRECATED: XS.track.loaded")
    }, d.constructor = c;
    var h = e.XS = e.XS || {};

    function u(e) {
        var t, i, n = (e = e || {}).names || [], r = Array.prototype.slice.call(e.args || []), o = e.defaults || [],
            a = e.params;
        for (void 0 === a && "object" == typeof r[r.length - 1] && (a = r.pop()), a = a || {}, t = 0; t < r.length; t++) void 0 === a[i = n[t] || t] && (a[i] = r[t] || o[t]);
        for (t = 0; t < o.length; t++) void 0 === a[i = n[t] || t] && null != o[t] && (a[i] = o[t]);
        return a
    }

    h.XSTrack = c, h.track = new c, h.on("startLoading", function () {
        h.track.init()
    }, {freezeGroup: e.ENG_GRP_NAME}), h.track.addHandler({
        options_change: function (e, t, i) {
            void 0 !== (i = u({
                names: ["option_name", "option_value"],
                args: arguments
            })).option_name && (i.option_name = String(i.option_name)), this.send("options_change", i)
        }, play_session_start: function () {
            this.send("session_start", this.inc("play_session_count"))
        }, game_end: function (e, t) {
            t = u({names: ["level_id"], args: arguments}), this.send("game_end", t), this.set("game_start_time", -1)
        }, game_play_start: function (e, t) {
            t = u({
                names: ["level_id"],
                args: arguments
            }), this.set("game_start_time", Date.now()), this.inc("games_played");
            var i = this.getDate();
            this.data.last_day_played !== i && (this.set("last_day_played", i), this.inc("days_played")), this.send("game_play_start", this.inc("play_session_count"), t)
        }, share: function (e, t) {
            t = u({names: ["button_placement"], defaults: ["none"], args: arguments}), this.send("share", 1, t)
        }, invite: function (e, t) {
            t = u({names: ["button_placement"], defaults: ["none"], args: arguments}), this.send("invite", 1, t)
        }, socialEngage: function (e, t, i) {
            i = u({
                names: ["engage_id", "button_placement"],
                defaults: [void 0, "none"],
                args: arguments
            }), this.send("engage", 1, i)
        }, crossPromotionShow: function (e, t) {
            t = u({
                names: ["button_placement"],
                defaults: ["none"],
                args: arguments
            }), this.send("cross_promotion_show", 1, t)
        }, crossPromotionSuccess: function (e, t) {
            t = u({names: ["target_game"], args: arguments}), this.send("cross_promotion_success", 1, t)
        }, deviceInfo: function () {
            this.send("device_info")
        }
    }), function () {
        var e = {interstitial: "mandatory", mandatory: "mandatory", reward: "rewarded", rewarded: "rewarded"},
            t = {mandatory: 1, rewarded: 3},
            i = {response: "ad_response", finish: "ad_result", throttled: "throttle_type"};

        function n(t, i) {
            return ["ad", e[t], i].join("_")
        }

        h.track.addHandler("ad", function (r, o, a, s, l) {
            var c = void 0, d = (l = l || {}, i[o]);
            d ? l[d] = a : (l = s || {}, s = a, a = void 0), "finish" === o && (c = "success" === a ? t[e[r]] : 0), l.ad_point = s || "engine-triggered", this.send(n(r, o), c, l)
        });
        var r = {};
        ["interstitial", "reward"].forEach(function (e) {
            ["request", "response", "show", "finish", "blocked", "throttled"].forEach(function (t) {
                r[n(e, t)] = h.track.ad.bind(h.track, e, t)
            })
        }), h.track.addHandler(r)
    }()
}(window), function (e) {
    XS.data.addBool("__ads_firstTimeView", {remote: !1, default: !0}), window.adProviders = window.adProviders || {};
    var t, i = {REWARD: "reward", INTERSTITIAL: "interstitial"}, n = {};

    function r(e) {
        var t = this, n = [], r = e || {};
        for (var o in r.providers) {
            console.warn("Provider", o, window.adProviders[o]);
            var a = window.adProviders[o];
            if (a) {
                var s = r.providers[o];
                a.init(s) && n.push({config: s, provider: a})
            }
        }
        n.sort(function (e, t) {
            return e.config.priority < t.config.priority ? -1 : e.config.priority > t.config.priority ? 1 : 0
        }), r.maxfrequency = void 0 === r.maxfrequency ? 3e5 : r.maxfrequency;
        var l = (new Date).getTime() - (XS.data.__ads_firstTimeView ? r.maxfrequency : r.maxfrequency / 3);
        XS.data.__ads_firstTimeView = !1;
        var c = !1, d = !0;

        function h(e) {
            if (e == i.REWARD) return !1;
            var t = (new Date).getTime() - l;
            return !(!(r.maxfrequency && t < r.maxfrequency) || d && r.forceFirstAd) || void 0
        }

        t.setConfig = function (e) {
            r.maxfrequency = void 0 === e.maxfrequency ? 3e5 : e.maxfrequency
        }, t.show = function (e, t) {
            if (h(e)) {
                var i = (new Date).getTime() - l;
                return console.warn("Rejected ad due to timer:", r.maxfrequency - i), t(!1)
            }
            if (function (e) {
                if (XS.is.oppoGlobal && "interstitial" == e && Date.now() - initTime < 12e4) return !0
            }(e)) return console.warn("Ad currently blocked by platform rule."), t(!1);
            if (c) return console.warn("Ad rejected as we are already showing one"), t(!1);

            function o(e, i) {
                c = !1, t(e, i)
            }

            c = !0;
            var a = 0, s = null;
            !function e() {
                var t = n[a++];
                if (!t) return o(!1, s);
                d = !1, t.provider.show(t.config, function (i, n) {
                    if (i) return l = (new Date).getTime(), o(i);
                    s = n, t.provider.reject(), e()
                })
            }()
        }, t.force = function (e) {
            if (c) return console.warn("Ad rejected as we are already showing one"), e(!1);

            function t(t) {
                c = !1, e(t)
            }

            c = !0;
            var i = 0;
            !function e() {
                var r = n[i++];
                if (!r) return t(!1);
                d = !1, r.provider.force(r.config, function (i) {
                    if (i) return l = (new Date).getTime(), t(i);
                    r.provider.reject(), e()
                })
            }()
        }, t.ready = function (e, t) {
            if (h(e)) return !1;
            for (var i = 0; i < n.length; i++) {
                var r = n[i];
                if (r.provider.ready(r.config)) return !0
            }
            return !1
        }, t.preload = function (e) {
            var t = 0;
            !function i() {
                var r = n[t++];
                if (!r) return e(!1);
                r.provider.preload(r.config, function (t) {
                    if (t) return e(t);
                    i()
                })
            }()
        }, t.forcePreload = function (e) {
            var t = 0;
            !function i() {
                var r = n[t++];
                if (!r) return e(!1);
                r.provider.forcePreload(r.config, function (t) {
                    if (t) return e(t);
                    i()
                })
            }()
        }
    }

    var o = {};
    XS.ads = {ERROR_SKIPPED: "skipped"}, XS.ads.preload = function (e, i) {
        if (i = safeCallback(i), !XS.ads.enabled(e)) return i(!1);
        var r = n[e];
        if (!r) return window.onerror && window.onerror("XS Ads 2.0: No waterfall defined for type: " + e + " on " + t), i(!1);
        r.preload(i)
    }, XS.ads.forcePreload = function (e, i) {
        if (i = safeCallback(i), !XS.ads.enabled(e)) return i(!1);
        var r = n[e];
        if (!r) return window.onerror && window.onerror("XS Ads 2.0: No waterfall defined for type: " + e + " on " + t), i(!1);
        r.forcePreload(i)
    }, XS.ads.show = function (e, i) {
        var r = !0, o = 0;
        !function a() {
            var s = XS.ads.beforeShowHooks[o++];
            if (!s) return function (r) {
                if (i = safeCallback(i), !r) return i(!1);
                if (!XS.ads.enabled(e)) return i(!1);
                var o = n[e];
                if (!o) return window.onerror && window.onerror("XS Ads 2.0: No waterfall defined for type: " + e + " on " + t), i(!1);
                o.show(e, i)
            }(r);
            s(e, function (e) {
                r = r && e, a()
            })
        }()
    }, XS.ads.force = function (e, i) {
        if (i = safeCallback(i), !XS.ads.enabled(e)) return i(!1);
        var r = n[e];
        if (!r) return window.onerror && window.onerror("XS Ads 2.0: No waterfall defined for type: " + e + " on " + t), i(!1);
        r.force(i)
    }, XS.ads.ready = function (e) {
        if (!XS.ads.enabled(e)) return !1;
        var i = n[e];
        return i ? i.ready(e) : (window.onerror && window.onerror("XS Ads 2.0: No waterfall defined for type: " + e + " on " + t), !1)
    }, XS.ads.enabled = function (e) {
        return void 0 !== n[e] && !o[e]
    }, XS.ads.disable = function (e) {
        o[e] = !0
    }, XS.ads.setConfig = function (e) {
        if (e) for (var t in e) {
            var i = n[t];
            i && i.setConfig(e[t])
        }
    }, XS.ads.beforeShowHooks = [], XS.ads._init = function (e) {
        if (console.warn("INIT", e), t = e, Config.ads) {
            var i = Config.ads[t];
            if (i) for (var o in i) n[o] = new r(i[o])
        }
    }
}(), function (e) {
    var t = "--https--bucket.frvr.com/config/";

    function i(e, t) {
        var i, n, o,
            a = (i = Config && Config.id ? Config.id : e, n = t.cohort, o || (o = r.track.getChannel()), "utm_source=" + o + "&utm_medium=crosspromotion&utm_campaign=" + i + "&utm_content=" + n);
        if (t.web) for (var s in t.web) {
            var l = t.web[s];
            if (l.webUrl) {
                var c = l.webUrl.split("?");
                l.webUrl = c[0] !== l.webUrl ? l.webUrl + "&" + a : l.webUrl + "?" + a
            }
        }
    }

    function n(e, t) {
        var n = function (e, t) {
            var i = {ab_tests: {}}, n = [], o = [];
            if (t || "function" != typeof ga || ga(function (e) {
                var i = e.get("userId") || e.get("clientId");
                i && (t = 1 * i.toString().replace(/\D/g, "").substr(-15))
            }), !t) return console.warn("No GA userID or clientID retrieved so no remote cross promo config containing ab_tests will be used!");
            for (var a in e) {
                var s = e[a].ab_test_name || "standardCrosspromo";
                s && e[a].active && (i.ab_tests[s] || (n.push(s), i.ab_tests[s] = {cohorts: []}), i.ab_tests[s].cohorts.push(e[a].cohort))
            }
            if (0 !== n.length && "standardCrosspromo" !== n[0]) {
                if (!1 === r.abtest.initialized) r.abtest.init(t, i.ab_tests); else for (var l in n) {
                    var c = n[l];
                    r.abtest.addTest(t, c, i.ab_tests[c].cohorts, !0)
                }
                for (var d in n) o.push({test_name: n[d], cohort: r.abtest.cohort(n[d])});
                return o
            }
        }(t, this.playerID), o = [];
        for (var a in t) {
            var s = t[a];
            if (s.active) for (var l in s.cohort || (s.cohort = "standard"), n) s.ab_test_name === n[l].test_name && s.cohort === n[l].cohort && (i(e, s), o.push(s), console.log("Remote cross-promo config for cohort [" + n[l].cohort + "] fetched!"))
        }
        return 0 == o.length && (console.log("Remote cross promo config with no ab_test fetched!"), i(e, t[0]), o.push(t[0])), o
    }

    var r = e.XS = e.XS || {};
    r.crosspromo = new function () {
        return {
            config: null,
            localConfig: null,
            fetchRequested: !1,
            fetched: !1,
            fileName: null,
            playerID: null,
            init: function (e, i) {
                var o, a, s, l = this, c = "_web";
                if (r.is.facebookInstant) {
                    if (!FBInstant || !FBInstant.player) return void Host.on("FBInstantStart", l.init);
                    l.playerID = FBInstant.player.getID(), c = "_instant"
                }
                o = function () {
                    l.fileName = Config.id + c + "_v2", l.localConfig = !!(Config && Config.ads && Config.ads.crosspromo) && n(Config.id + "_local_config", Config.crosspromotion), function (e, i) {
                        var r = this;
                        if (!e) return i(new Error("File name parameter not provided e.g., getConfig('rocketpope', function(e, r) { return r })"));
                        if (r.fetchRequested) return console.log("Remote crosspromo config already fetched, so the fetched config will be used instead."), i(null, this.config);
                        var o = new XMLHttpRequest;
                        o.onload = function () {
                            if (200 != o.status) return i(new Error(o.status), o.response);
                            r.fetched = !0;
                            var t = n(e, JSON.parse(o.response));
                            return i(null, t)
                        }, o.open("GET", t + e + ".json", !0), o.setRequestHeader("Content-Type", "application/json;charset=UTF-8"), o.send(), r.fetchRequested = !0
                    }(l.fileName, function (e, t) {
                        if (e) return console.warn(e);
                        l.config = t, r.emit("CrossPromoLoaded")
                    })
                }, a = 0, s = setInterval(function () {
                    Config ? (clearInterval(s), o()) : a > 4 && (clearInterval(s), o(new Error("XS.crosspromo: Could not access Config to get game id. Giving up!"))), a++
                }, 100)
            },
            getConfig: function (e, t) {
                var i = this.config || [];
                if (!t && this.localConfig && (i = i.concat(this.localConfig)), i) for (var n in i) if (i[n][e]) return i[n];
                return null
            }
        }
    }, r.is.facebookInstant && r.crosspromo.init()
}(window), function (e) {
    window.XC = {};
    for (var t = document.cookie.split("; "), i = t.length - 1; i >= 0; i--) {
        var n = t[i].split("=");
        if ("frvr_uid" == n[0]) {
            XC.frvr_uid = n[1];
            break
        }
    }
    window.location && window.location.search && window.location.search.indexOf("tsrv=") > -1 ? XC.server = "http://l.frvr.com:8008/" : XC.server = "--https--xc.frvr.com/", XC.c = function () {
        for (var e = [], t = 0; 64 > t;) e[t] = 0 | 4294967296 * Math.abs(Math.sin(++t));
        return function (t) {
            for (var i, n, r, o, a = [], s = (t = unescape(encodeURI(t))).length, l = [i = 1732584193, n = -271733879, ~i, ~n], c = 0; c <= s;) a[c >> 2] |= (t.charCodeAt(c) || 128) << c++ % 4 * 8;
            for (a[t = 16 * (s + 8 >> 6) + 14] = 8 * s, c = 0; c < t; c += 16) {
                for (s = l, o = 0; 64 > o;) s = [r = s[3], (i = 0 | s[1]) + ((r = s[0] + [i & (n = s[2]) | ~i & r, r & i | ~r & n, i ^ n ^ r, n ^ (i | ~r)][s = o >> 4] + (e[o] + (0 | a[[o, 5 * o + 1, 3 * o + 5, 7 * o][s] % 16 + c]))) << (s = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][4 * s + o++ % 4]) | r >>> 32 - s), i, n];
                for (o = 4; o;) l[--o] = l[o] + s[o]
            }
            for (t = ""; 32 > o;) t += (l[o >> 3] >> 4 * (1 ^ 7 & o++) & 15).toString(16);
            return t
        }
    }(), XC.loggedin = !1, XC.slt = "I think you'll enjoy playing FRVR Games!", XC.user = XC.nouser = {
        set: function () {
        }, get: function () {
        }
    }, XC.send = function (e, t) {
        var i = t.data || {}, n = t.load || function () {
        }, r = t.error || function (e) {
            console.error("XC.error: ", e)
        }, o = new XMLHttpRequest;
        o.addEventListener("load", function (e) {
            n(e.target.responseText)
        }), o.addEventListener("error", function (e) {
            r(e.target.responseText)
        });
        var a = function (t) {
            var n = new FormData, r = JSON.stringify(i), a = t || "";
            n.append("id", a), n.append("c", XC.c(XC.slt + a + r)), n.append("data", r), n.append("game", Config.id), o.open("POST", e), o.send(n)
        };
        XC.frvr_uid ? a(XC.frvr_uid) : XC.user && XC.user.id ? a(XC.user.id) : Host.Preferences.GetString("frvr.uid", a)
    }, XC.onFBAuth = function (e) {
        XC.login(e)
    }, XC.onFBDeauth = function () {
        XC.logout()
    }, XC.login = function (e) {
        XC.send(XC.server + "login", {
            load: function (e) {
                var t = JSON.parse(e);
                XC.user = new XC.User(t), XC.loggedin = !0, XS.data._loadRemote(XC, XC.user.data), console.log("Logged in - returned uid: ", XC.user.id), Host.Preferences.SetString("frvr.uid", XC.user.id), XC.frvr_uid = XC.user.id, document.cookie = "frvr_uid=" + XC.user.id + ";path=/ ;max-age= 3153600000;expires=Fri, 01 Jan 2100 00:00:00 GMT", XS.emit("login", XC.user)
            }, data: {id: XC.frvr_uid, fb_uid: e.userID, fb_auth: e.accessToken}, error: function (e) {
                Host.Log("Login Error: " + e), XS.emit("login-error", e)
            }
        })
    }, XC.setChange = function (e, t) {
        return !!XC.loggedin && (XC.user.set(e, t), !0)
    }, XC.saveChanges = function (e) {
        XC.loggedin ? (XC.save(), e && e(!0)) : e && e(!1)
    }, XC.loginOKRU = function (e, t) {
        XC.send(XC.server + "login", {
            load: function (e) {
                var t = JSON.parse(e);
                XC.user = new XC.User(t), XC.loggedin = !0, console.log("Logged in - returned uid: ", XC.user.id), Host.Preferences.SetString("frvr.uid", XC.user.id), XC.frvr_uid = XC.user.id, document.cookie = "frvr_uid=" + XC.user.id + ";path=/ ;max-age= 3153600000;expires=Fri, 01 Jan 2100 00:00:00 GMT", XS.emit("login", XC.user)
            }, data: {id: XC.frvr_uid, fb_uid: e, fb_auth: t}, error: function (e) {
                Host.Log("Login Error: " + e), XS.emit("login-error", e)
            }
        })
    }, XC.save = function () {
        if (!XC.user || !XC.user.id) throw"Tried to XC.save without being logged in";
        XC.send(XC.server, {
            load: function (e) {
                JSON.parse(e);
                XS.emit("save", XC.user)
            }, data: XC.user.data
        })
    }, XC.logout = function () {
        XC.user = XC.nouser, XC.loggedin = !1, XS.emit("logout")
    }, XC.User = function (e) {
        var t = this;
        t.data = e.data || {}, t.id = e.id || null, t.get = function (e) {
            return t.data[e]
        }, t.set = function (e, i) {
            t.data[e] = i
        }
    }
}(), XS.styles.margins.bottom = Math.max(23, XS.styles.margins.bottom), XS.modulesToPreload.push(Social), XS.modulesToPreload.push(InitSocial), XS.modulesToPreload.push(function () {
    if (XS.is.huaweiquickapp && (window.system && window.system.postMessage ? Config.iap ? Config.iap.huawei || (console.log("Missing configuration Config.iap.huawei"), 0) : (console.log("Missing configuration Config.iap"), 0) : (console.log("Missing window.system.postMessage"), 0))) {
        XS.iap.addProvider(new function () {
            var e = this;
            e.priority = 0, e.name = "Huawei";
            var t = {}, i = !1;
            e.isReady = function () {
                return i
            }, e.init = function () {
                var n, r;
                n = a, r = window.system.onmessage, window.system.onmessage = function (e) {
                    var t;
                    try {
                        t = JSON.parse(e)
                    } catch (e) {
                        console.error(e)
                    }
                    "object" == typeof t && t.event && n(t), r && r(e)
                };
                var o = Config.iap.huawei;
                s("iap-is-ready", {
                    applicationId: o.applicationId,
                    publicKey: o.publicKey,
                    signerUrl: o.signerUrl
                }, function (n, r) {
                    if (!n && r) {
                        var a = [];
                        for (var l in o.catalog) a.push(o.catalog[l].productNo);
                        t = {}, s("iap-get-products-info", {keys: a}, function (n, r) {
                            if (!n) {
                                for (var o = 0; o < r.length; o++) {
                                    var a = r[o];
                                    t[a.productId] = {productNo: a.productId, label: a.price}
                                }
                                e.restorePurchases(), i = !0, XS.emit("iapReady")
                            }
                        })
                    }
                })
            }, e.getCatalog = function () {
                return t
            }, e.getProductById = function (e) {
                return t[e] || console.error("Missing product", e), t[e]
            }, e.requestPayment = function (e, t) {
                s("iap-create-purchase-intent", {productId: e}, t)
            }, e.consumePurchase = function (e, t) {
                s("iap-consume-purchase", {purchase: e}, t)
            }, e.restorePurchases = function () {
                s("iap-get-incomplete-purchases", null, function (e, t) {
                    if (!e) for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        XS.emit("iapPurchaseRestored", n)
                    }
                })
            };
            var n, r, o = (n = 0, r = {}, {
                register: function (e) {
                    return r[++n] = e, n
                }, clear: function (e) {
                    r[e] && delete r[e]
                }, get: function (e) {
                    return r[e]
                }
            });

            function a(e) {
                var t = e.id, i = t && o.get(t);
                if (i) switch (o.clear(t), e.event) {
                    case"iap-response":
                        i(null, e.data);
                        break;
                    case"iap-error":
                        i(e.err)
                }
            }

            function s(e, t, i) {
                var n = JSON.parse(JSON.stringify(t || {}));
                if (n.event = e, i) {
                    var r = o.register(i);
                    n.id = r
                }
                window.system.postMessage(JSON.stringify(n))
            }
        })
    }
}), XS.modulesToPreload.push(function () {
    if (Config.localNotifications) {
        var e, t, i = {
            addProvider: function (i) {
                i.init(function (r) {
                    n.track.event("local_notification_enabled", r), r ? (e = i, t = Config.localNotifications, e.clearAllNotifications()) : Host.Log("❌ Aborting registration of Local Push Notifications provider init return false")
                })
            }, onGameOpened: function () {
                e && e.clearAllNotifications()
            }, onGameClosed: function () {
                e && function (t) {
                    e.clearAllNotifications();
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i], o = Host.Localize.Translate(r.title, {game_name: Config.shareTitle}).toString(),
                            a = Host.Localize.Translate(r.message, {game_name: Config.shareTitle}).toString();
                        e.scheduleNotification(o, a, r.seconds, r.code), n.track.event("local_notification_scheduled", 1, {code: r.code})
                    }
                }(t)
            }, configure: function (e) {
                t = e
            }
        };
        window.XS = window.XS || {};
        var n = window.XS;
        n.localNotifications = i, n.on("onBackground", function () {
            i.onGameClosed()
        }), n.on("onResume", function () {
            i.onGameOpened()
        }), n.on("localNotification", function (e) {
            var t = e.code ? e.code : "";
            n.track.event("local_notification_open", 1, {code: t})
        })
    } else Host.Log("❌ Config.localNotifications not found")
}), XS.modulesToPreload.push(function () {
    var e;
    XS.data.addIntWithLocalKey("modalSliderComplexity", "modal.slider.complexity.v1", {remote: !1}), 0 == XS.data.modalSliderComplexity && (XS.data.modalSliderComplexity = 2), e = Container.expand(function () {
        Container.call(this);
        var e = this;
        this.backgroundColor = 16777215, this.isShowing = !1;
        var t = new Graphics;
        t.beginFill(0, .6), t.drawRect(0, 0, 200, 200), this.addChild(t), e.sounds = {button: void 0}, t.interactive = !0, t.defaultCursor = "pointer";
        var i = new Container;
        this.addChild(i);
        var n = new Graphics;
        i.addChild(n);
        var r = 800;

        function o() {
            if (LEGACY_COORD_SYSTEM) {
                var t = XS.devicePixelRatio;
                return ((height - XS.styles.margins.top - XS.styles.margins.bottom) / e.ratio * t - r) / 2 + XS.styles.margins.top / e.ratio * t
            }
            return ((XS.gui.height - XS.styles.margins.top - XS.styles.margins.bottom) / e.scale.y - r) / 2 + XS.styles.margins.top / e.scale.y
        }

        this.setHeight = function (t) {
            r = t, n.clear(), n.beginFill(e.backgroundColor, 1), n.drawRoundedRect(0, 0, 800, r, 35), LEGACY_COORD_SYSTEM ? this.ratio && this.setRatio && this.setRatio(this.ratio) : this.ratio && this.setRatio && this.setRatio(1)
        }, this.setHeight(800), this.redraw = function () {
            var n = XS.devicePixelRatio;
            LEGACY_COORD_SYSTEM || (n = 1), LEGACY_COORD_SYSTEM ? (t.width = width * n, t.height = (height + 100) * n, i.x = (width / e.ratio * n - 800) / 2) : (i.x = (XS.gui.width / e.scale.x - 800) / 2, t.width = XS.gui.width / e.scale.x, t.height = XS.gui.height / e.scale.y)
        }, this.handleResize = function () {
            var t = XS.devicePixelRatio;
            if (LEGACY_COORD_SYSTEM || (t = 1), Tween.complete(i), LEGACY_COORD_SYSTEM) {
                var a = Math.min(Math.min(width * t / 900, (height - XS.styles.margins.top - XS.styles.margins.bottom) * t / (r + 50)), t / 2);
                e.ratio = a, n.scale.set(a, a)
            } else {
                a = Math.min(Math.min((XS.gui.width - XS.styles.margins.left - XS.styles.margins.right) / 900, (XS.gui.height - XS.styles.margins.top - XS.styles.margins.bottom) / (r + 50)), 1);
                e.scale.set(a)
            }
            LEGACY_COORD_SYSTEM && (i.x = (width / e.ratio * t - 800) / 2), i.y = o(), e.redraw()
        }, XS.on("resize", this.handleResize, {freezeGroup: ENG_FRZ_GRP});
        var a = !1, s = null, l = !1;

        function c() {
            e.isShowing = !1, s && s.destroy && s.destroy(), i.removeChild(s), LEGACY_COORD_SYSTEM ? XS.stageContainer.removeChild(e) : XS.gui.removeChild(e)
        }

        this.show = function (n, r, d) {
            var h = XS.devicePixelRatio;
            LEGACY_COORD_SYSTEM || (h = 1), a = !1, l = !1, XS.emit("togglemodal", {visible: !0}), c(), e.isShowing = !0, (s = n).off("down", void 0, {freezeGroup: ENG_FRZ_GRP}), s.on("down", function () {
                a = !0
            }, {freezeGroup: ENG_FRZ_GRP}), this.interactive = !d, t.interactive = !d, this.setHeight(s.innerHeight), i.addChild(s), this.handleResize(), LEGACY_COORD_SYSTEM ? i.y = height * h / stage.ratio : i.y = XS.gui.height, t.alpha = 0, new Tween(i, {y: o()}, .3, void 0, ENG_FRZ_GRP), !0 !== r && new Tween(t, {alpha: 1}, .3, void 0, ENG_FRZ_GRP), LEGACY_COORD_SYSTEM ? XS.stageContainer.addChild(e) : XS.gui.addChild(e)
        }, this.hide = function (t) {
            XS.hideGameOverAd(), e.isShowing ? new Tween(i, {y: -r}, .3, void 0, ENG_FRZ_GRP).call(function () {
                c(), XS.emit("togglemodal", {visible: !1}), t instanceof Function && t()
            }) : t instanceof Function && t()
        }, n.on("down", function () {
            a = !0
        }, {freezeGroup: ENG_FRZ_GRP}), t.on("up", function () {
            a || (s.blurClose ? l || (e.hide(), l = !0) : s.blurCallback instanceof Function && (l || (s.blurCallback(), l = !0))), a = !1
        }, {freezeGroup: ENG_FRZ_GRP})
    }), window.Modal = new e;
    var t = Container.expand(function (e) {
        var t = Container.call(this), i = new Sprite(fetch("i/g/s/sliderbg.svg", !0));
        i.anchor.set(.5, 0), i.x = 400, this.addChild(i);
        var n = new Sprite(fetch("i/g/s/sliderslider.svg", !0));

        function r(e, i, n) {
            var r = 0;
            if (e) {
                var o = new Sprite(e);
                o.scale.set(50 / 171, 50 / 171), o.y = 39, o.anchor.set(0, .5), r = 55
            }
            var a = new Text2(i, {weight: 400, size: 34, maxWidth: 190, dropShadowDistance: 2});
            a.anchor.set(0, .5);
            var s = n + (255 - (a.width + r)) / 2;
            return a.y = 41, a.x = s + r, e && (o.x = s, t.addChild(o)), t.addChild(a), a
        }

        n.anchor.set(.5, 0), n.y = -8, this.addChild(n);
        var o = r(e.challengingStar, e.challenging, 527), a = r(e.normalStar, e.normal, 273),
            s = [r(e.casualStar, e.casual, 19), a, o], l = [148, 400, 655], c = -1;
        t.setSelected = function (e, i, r) {
            var o = l[e];
            if (r || (Tween.clear(n), i ? new Tween(n, {x: o}, .3, void 0, ENG_FRZ_GRP) : n.x = o), e != c) {
                c = e, t.emit("complexity", {selected: c});
                for (var a = 0; a < 3; a++) {
                    var d = a == e;
                    s[a].updateStyle({fill: d ? "#FFFFFF" : "#000000", dropShadow: d})
                }
            }
        };
        var d = null != e.selected ? e.selected : XS.data.modalSliderComplexity - 1;
        t.setSelected(d, !1), i.on("down", function (e) {
            var n = e.event.getLocalPosition(i), r = Math.max(0, Math.min(2, (n.x + 127 + 260) / 258 >> 0));
            LEGACY_COORD_SYSTEM && (r = Math.max(0, Math.min(2, (n.x / t.ratio + 127 + 260) / 258 >> 0))), t.setSelected(r, !0)
        }, {freezeGroup: ENG_FRZ_GRP});
        var h = void 0, u = 0;

        function f() {
            h = void 0, XS.stageContainer.off("stageup", f, {freezeGroup: ENG_FRZ_GRP}), XS.stageContainer.off("move", g, {freezeGroup: ENG_FRZ_GRP}), t.setSelected(c, !0)
        }

        function g(e) {
            var i = e.event.getLocalPosition(stage).x - h.x;
            LEGACY_COORD_SYSTEM ? n.x = Math.min(Math.max(u + i / t.ratio, l[0]), l[2]) : n.x = Math.min(Math.max(u + i, l[0]), l[2]);
            for (var r = 0; r < l.length; r++) {
                var o = l[r];
                Math.abs(n.x - o) < 30 ? t.setSelected(r, !1) : Math.abs(n.x - o) < 100 && t.setSelected(r, !1, !0)
            }
        }

        n.on("down", function (e) {
            h = e.event.getLocalPosition(stage), u = n.x, XS.stageContainer.on("stageup", f, {freezeGroup: ENG_FRZ_GRP}), XS.stageContainer.on("move", g, {freezeGroup: ENG_FRZ_GRP})
        }, {freezeGroup: ENG_FRZ_GRP}), t.getComplexity = function () {
            return c
        }
    });
    window.Modal.ModalButton = Container.expand(function (e, t, i, n, r, o, a) {
        Container.call(this);
        var s, l, c, d = this;
        n = void 0 === n ? 15748651 : n, s = new Graphics, d.addChild(s);
        var h, u = void 0 !== a ? a + r : 165 + r;
        l = new Graphics, (c = new Text2(e, {
            width: 400,
            size: o,
            fill: "#ffffff",
            maxWidth: 780
        })).anchor.set(.5, 0), c.x = 400, c.y = 30 + r, c.interactive = !0, c.buttonMode = !0, d.addChild(c), t ? ((h = new Text2(t, {
            width: 400,
            size: 40,
            fill: "#ffffff"
        })).anchor.set(.5, 0), h.x = 400, h.y = 30 + r + 60, d.addChild(h)) : c.y = (u + r) / 2 - c.height / 2, i && s.on("down", function () {
            Modal.sounds.button && Modal.sounds.button.play(0), XS.stageContainer.off("stageup", void 0, {freezeGroup: ENG_FRZ_GRP}), XS.stageContainer.once("stageup", i, {freezeGroup: ENG_FRZ_GRP})
        }, {freezeGroup: ENG_FRZ_GRP}), d.setRatio = function (e) {
            LEGACY_COORD_SYSTEM || (e = 1), s.width = 800 * e, s.height = u * e, l && (l.width = 800 * e, l.height = 35 * e)
        }, d.setColor = function (e) {
            s.beginFill(e), r ? (s.drawRoundedRect(0, 0, 800, 200, r), l.clear(), l.beginFill(16777215, 1), l.drawRect(0, 0, 800, r), d.addChild(l)) : s.drawRect(0, 0, 800, u)
        }, d.setText = function (e) {
            c.setText(e)
        }, d.centerText = function () {
            c.y = (u + r) / 2 - c.height / 2
        }, d.setSubtext = function (e) {
            h && h.setText(e)
        }, d.setColor(void 0 === n ? 16711680 : n, 1), d.getHeight = function () {
            return u
        }, d.getWidth = function () {
            return 800
        }
    }), window.Modal.PictureButton = Container.expand(function (e, t) {
        Container.call(this);
        var i = this;
        preload(e, function () {
            var n = new Sprite(embed(e));
            n.anchor.set(.5, 0), n.x = 400, i.addChild(n);
            var r = 1, o = new Graphics;
            o.beginFill(16777215, .7), o.drawRect(0, 0, 800, 165), o.y = 0, i.setRatio = function (e) {
                LEGACY_COORD_SYSTEM && (r = e), o.x = 470 * r, o.width = 330 * r, o.height = 45 * r
            };
            var a = new Text2(Host.Localize.Translate("More great FRVR Games!", {}, "Cross-promo overlay text"), {
                weight: 400,
                size: 150,
                maxWidth: 300,
                fill: "#000"
            });
            a.anchor.set(1, 0), a.ratio = -1, a.y = 6, a.x = 790, i.addChild(o), i.addChild(a), i.setRatio(i.ratio), t && (n.buttonMode = !0, n.on("down", t, {freezeGroup: ENG_FRZ_GRP}))
        })
    });
    var i = 1337 * Math.random() >> 0;
    window.Modal.ModalOverlayContent = Container.expand(function () {
        var e = Container.call(this);

        function n(e, t, i) {
            var n = new RegExp("([?&])" + t + "=.*?(&|$)", "i"), r = -1 !== e.indexOf("?") ? "&" : "?";
            return e.match(n) ? e.replace(n, "$1" + t + "=" + i + "$2") : e + r + t + (i ? "=" + i : "")
        }

        return this.innerHeight = 800, this.blurClose = !0, e.addHeadline = function (t) {
            var i = new Text2(t, {weight: 200, size: 90, fill: "#2c2c2c", maxWidth: 780});
            return i.anchor.set(.5, 0), i.x = 400, i.y = 40, e.addChild(i), i
        }, e.addTextBlock = function (t, i, n) {
            var r = new Text2(t, {weight: n || 200, size: i || 90, fill: "#2c2c2c", maxWidth: 780});
            return r.anchor.set(.5, 0), r.x = 400, r.y = 50, e.addChild(r), r
        }, e.addLead = function (t, i) {
            var n = new Text2(t, {width: 200, size: 45, fill: "#2c2c2c", maxWidth: 800, align: "center"});
            return n.anchor.set(.5, 0), n.x = 400, n.y = 140 + (i || 0), e.addChild(n), n
        }, e.addButton = function (t, i, n, r, o) {
            var a = new Modal.ModalButton(t, r || "", i, n, 35, o || 90);
            return a.y = 370, e.addChild(a)
        }, e.addMiddleButton = function (t, i, n, r, o, a) {
            var s = new Modal.ModalButton(t, i, n, r, 0, o || 60, a);
            return s.y = 370, e.addChild(s)
        }, e.addSocialButton = function (t, i, n, r, o) {
            var a = e.addMiddleButton(t, i, n, r);
            return a.y = 405 + (o || 0), e.addChild(a)
        }, e.addPictureButton = function (t, i, n) {
            var r = new Modal.PictureButton(t, i);
            return r.y = 405 + (n || 0), r.x = 2, e.addChild(r)
        }, e.addSlider = function (i) {
            return e.addChild(new t(i))
        }, e.addMetaButton = function (t, r) {
            if (!(XS.is.lgtv || XS.is.spilGamesWrapper || XS.is.okru || XS.is.facebookInstant || XS.is.rcs || XS.is.huawei || XS.is.miniclip || XS.is.yandex || XS.is.samsungGameLauncher || XS.is.samsungInstantPlay)) {
                var o,
                    a = !!(XS.remoteConfig && XS.remoteConfig.crosspromoteConfig && XS.remoteConfig.crosspromoteConfig.length),
                    s = !(!XS.crosspromo || !XS.crosspromo.getConfig("banner", !0)), l = [];
                if (!XS.is.twitter) {
                    for (var c = s ? XS.crosspromo.getConfig("banner") : a ? XS.remoteConfig.crosspromoteConfig : [{
                        facebookImage: "cdn.frvr.com/2021/banners/800x165/basketball.jpg",
                        facebookUrl: "--https--apps.facebook.com/basketballfrvr",
                        webImage: "cdn.frvr.com/2021/banners/800x165/basketball.jpg",
                        webUrl: "http://basketball.frvr.com/"
                    }, {
                        facebookImage: "cdn.frvr.com/2021/banners/800x165/hex.jpg",
                        facebookUrl: "--https--apps.facebook.com/hexfrvr",
                        webImage: "cdn.frvr.com/2021/banners/800x165/hex.jpg",
                        webUrl: "http://hex.frvr.com/"
                    }, {
                        facebookImage: "cdn.frvr.com/2021/banners/800x165/mahjong.jpg",
                        facebookUrl: "--https--apps.facebook.com/mahjongfrvr",
                        webImage: "cdn.frvr.com/2021/banners/800x165/mahjong.jpg",
                        webUrl: "http://mahjong.frvr.com/"
                    }], d = [], h = 0; h < c.length; h++) {
                        var u = c[h];
                        if (XS.is.android && !XS.is.samsungBixby) XS.is.silk || (XS.is.samsungAppStore ? u.samsungUrl && u.samsungImage && d.push([u.samsungUrl, u.samsungImage]) : u.androidUrl && u.androidImage && d.push([u.androidUrl, u.androidImage])); else if (XS.is.iOS && u.iOSUrl && u.iOSImage) d.push([u.iOSUrl, u.iOSImage, "_top"]); else if (XS.is.facebookApp && u.facebookUrl && u.facebookImage) d.push([u.facebookUrl, u.facebookImage, "_top"]); else if (XS.is.chromeWrapper && u.chromeUrl && u.chromeImage) d.push([u.chromeUrl, u.chromeImage, "_blank"]); else if (!XS.is.chromeWrapper && u.webUrl && u.webImage) {
                            if (XS.is.samsungBixby && -1 != u.webUrl.indexOf("solitaire.frvr")) continue;
                            d.push([(o = u.webUrl, XS.is.samsungBixby ? n(o, "samsung", "") : XS.is.samsungBrowser ? n(o, "samsungbrowser", "") : o), u.webImage, XS.is.mobile ? "_blank" : "_top"])
                        }
                    }
                    d.length && l.push(function (e) {
                        var i = d[d.length * Math.random() >> 0], n = i[0], r = XS.httpPrefix + i[1], o = i[2];
                        XS.is.samsungBrowser && n.replace(/^market:\/\//, XS.httpPrefix + "market.android.com/"), XS.track.crossPromotionShow("standard_aftergame"), e.addPictureButton(r, function () {
                            XS.track.crossPromotionSuccess(n), XS.navigate(n, o)
                        }, t).y = t
                    })
                }
                return !window.requestFacebookLogin || !1 !== window.facebookAuthed || !Config.facebookAppId || XS.is.twitter || XS.is.nosoc || XS.is.rcs || XS.is.huawei || XS.is.miniclip || XS.is.tMobile || l.push(function (e) {
                    // e.addSocialButton(Host.Localize.Translate("Login with Facebook"), Host.Localize.Translate("Save your score!"), function () {
                    //     window.requestFacebookLogin(function () {
                    //         Modal.hide(), r.mainActionCallback && r.mainActionCallback(), r.autoCallback && r.autoCallback()
                    //     })
                    // }, 4675430, t).y = t
                }), !window.shareDialogueCallback || XS.is.nosoc || XS.is.rcs || XS.is.huawei || XS.is.miniclip || XS.is.tMobile || l.push(function (e) {
                    e.addSocialButton(Host.Localize.Translate(Config.buttonShareTitle, {game_name: Config.shareTitle}), Host.Localize.Translate(Config.buttonShareDescription, {game_name: Config.shareTitle}), function () {
                        window.shareDialogueCallback(""), r.mainActionCallback && r.mainActionCallback()
                    }, 4675430, t).y = t
                }), !!l.length && (l[++i % l.length](e), !0)
            }
        }, e
    }), window.Modal.RateGameModal = Modal.ModalOverlayContent.expand(function (e, t) {
        Modal.ModalOverlayContent.call(this), this.addHeadline(Host.Localize.Translate("Having Fun?")), this.addLead(Host.Localize.Translate("Help us improve the game!\nHow would you rate {game_name}?", {game_name: Config.shareTitle}), 10);
        var i = this,
            n = i.addMiddleButton(Host.Localize.Translate("Send Feedback"), Host.Localize.Translate("Help us improve {game_name}", {game_name: Config.shareTitle}, "We are asking the user to provide feedback for the game"), function () {
                XS.navigate(Config.feedbackURL), Modal.hide()
            }, 6208638);
        n.y = 430, n.visible = !1;
        var r = i.addMiddleButton(Host.Localize.Translate("Write Review"), Host.Localize.Translate("Help us by writing a review!"), function () {
            XS.is.samsungAppStore ? XS.navigate(Config.samsungReviewUrl) : XS.is.chromeWrapper ? XS.navigate(Config.chromeReviewUrl) : XS.is.android ? XS.navigate(Config.androidReviewURL) : XS.navigate(Config.iOSReviewURL), Modal.hide()
        }, 12303291);
        r.y = 580, r.visible = !1;
        var o = i.addButton(Host.Localize.Translate("No thanks"), function () {
            Modal.hide()
        }, t);
        o.visible = !1;
        var a = [];

        function s(t) {
            var s = new Sheet(e, 136, 130);
            return s.y = 270, s.x = 150 * l + 30, s.on("down", function () {
                for (var e = 0; e < 5; e++) a[e].frame = e <= t ? 1 : 0;
                !function (e) {
                    var t = 4 != e;
                    n.visible = t, r.visible = !0;
                    var a = t ? 150 : 0;
                    r.y = 430 + a, r.setColor(t ? 12303291 : 6208638), o.visible = !0, i.innerHeight = 760 + a, Modal.setHeight(i.innerHeight), Modal.handleResize(), o.y = 560 + a, i.addChildAt(o, 0)
                }(t)
            }, {freezeGroup: ENG_FRZ_GRP}), s.buttonMode = !0, s
        }

        for (var l = 0; l < 5; l++) a.push(this.addChild(s(l)));
        this.innerHeight = 450, this.blurClose = !1
    }), window.Modal.AskRateGameModal = Modal.ModalOverlayContent.expand(function (e, t, i) {
        Modal.ModalOverlayContent.call(this), this.addHeadline(Host.Localize.Translate("Having Fun?")), this.addLead(Host.Localize.Translate("Help us improve the game!\nHow would you rate {game_name}?", {game_name: Config.shareTitle}), 26);
        var n = this.addButton(Host.Localize.Translate("Rate us"), function () {
            t && t(), i(!0), Modal.hide()
        }, e);
        n.visible = !0, n.y = 276, this.innerHeight = 450, this.blurClose = !1, this.blurCallback = function () {
            Modal.hide(), i(!1)
        }
    }), window.Modal.BuyItemModal = Modal.ModalOverlayContent.expand(function (e, t, i, n, r, o, a) {
        Modal.ModalOverlayContent.call(this), this.addHeadline(e);
        var s = this.addLead(t, 10), l = 1;
        LEGACY_COORD_SYSTEM && (l = XS.devicePixelRatio), s.updateStyle({wordWrapWidth: 790 * l});
        var c = this.addButton(i, n, 7463062), d = new Sheet(fetch("i/g/s/menutile.svg", !0), 68, 45);
        d.frame = 1, d.x = 722, d.y = 15, this.addChild(d), d.interactive = !0, d.buttonMode = !0, c.y = 200;
        r ? (this.addMiddleButton(r, o, a, 8026746).y = 255, c.y += 185, this.innerHeight = 579) : (c.y += 20, this.innerHeight = 420);
        this.addChild(s)
    }), window.Modal.InstallGameModal = Modal.ModalOverlayContent.expand(function (e, t, i, n) {
        Modal.ModalOverlayContent.call(this), this.addHeadline(Host.Localize.Translate("Install {game_name}?", {game_name: Config.shortTitle}));
        var r = this.addButton(Host.Localize.Translate("Install Now"), function () {
            t && XS.navigate(t, "_top"), n && n()
        }, 6274174);
        r.y = 640, this.innerHeight += 40;
        var o = XS.utils.asynchLoadImageFromPath(vpath + e);
        o.anchor.set(0, 0), this.addChild(o), o.buttonMode = !0, o.on("down", function () {
            t && XS.navigate(t, "_top"), n && n()
        }, {freezeGroup: ENG_FRZ_GRP}), this.setRatio = function (e) {
            LEGACY_COORD_SYSTEM || (e = 1), o.scale.set(1.465 * e, 1.465 * e), o.y = 160 * e
        }, this.setText = function (e) {
            r.setText(e)
        }, this.blurClose = !1, this.blurCallback = function () {
            Modal.hide(i)
        }
    }), window.Modal.GameEndModal = Modal.ModalOverlayContent.expand(function (e) {
        var t = Modal.ModalOverlayContent.call(this);
        gax("send", "event", Config.id, "Game Over");
        var i = e.contentTop || 190;
        e.headline && t.addHeadline(e.headline), e.lead && t.addLead(e.lead), this.blurClose = !1, t.blurCallback = function () {
            e.mainActionCallback()
        }, t.mainAction = t.addButton(e.mainActionText, e.mainActionCallback, e.mainActionColor || 7463062, e.mainActionLead, e.mainActionSize), (!e.disableMetaButton || XS.is.nosoc || XS.is.rcs || XS.is.huawei || XS.is.miniclip && !XS.is.tMobile) && t.addMetaButton(i + 50, e) && (i += 165), t.mainAction.y = 215 + i - 200, t.innerHeight = 215 + i
    }), window.Modal.NewWinModal = Modal.ModalOverlayContent.expand(function (e) {
        var t = Modal.ModalOverlayContent.call(this);
        gax("send", "event", Config.id, "New Game"), t.addHeadline([Host.Localize.Translate("Amazing!"), Host.Localize.Translate("Impressive!"), Host.Localize.Translate("Breathtaking!")][3 * Math.random() >> 0]), t.blurClose = e.allowBlurClose || !1;
        var i = 190, n = CalendarView.getCalendarViewDay({
            currentDate: CalendarView.getDateFromOffset(e.seed),
            isToday: CalendarView.isToday(e.seed),
            isLarge: !0,
            dateOffset: e.seed,
            stars: [e.bronze, e.silver, e.gold],
            animate: !0
        });
        (t.addChild(n), n.x = 400, n.y = 380, e.lead) && (t.addTextBlock(e.lead, 50, 300).y = i + 400, i += 61);
        if (void 0 !== e.score) {
            i += 130;
            var r = t.addTextBlock(0, 150, 400);
            r.y = 550, t.addChild(r);
            var o = 0;
            Object.defineProperty(r, "score", {
                get: function () {
                    return o
                }, set: function (e) {
                    o = e, this.setText((e >> 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                }
            });
            var a = r.scale.x, s = r.scale.x;
            new Tween(r, {score: e.score}, 1, Tween.linary, ENG_FRZ_GRP).wait(.3).call(function () {
                e.sounds && e.sounds.ding && e.sounds.ding.play(), r.scale.set(1.1 * a, 1.1 * s), new Tween(r.scale, {
                    x: a,
                    y: s
                }, .3, void 0, ENG_FRZ_GRP)
            }), e.sounds && e.sounds.count && e.sounds.count.play(.4)
        }
        (t.addMetaButton(i + 405, e) && (i += 165), e.secondActionText && e.secondActionCallback) && (t.addSocialButton(e.secondActionText, e.secondActionLead, e.secondActionCallback, e.secondActionColor || 7445472).y = i + 405, i += 165);
        var l = t.addButton(e.mainActionText, e.mainActionCallback, e.mainActionColor || 7463062);
        t.addChildAt(l, 1), l.y += i, t.innerHeight = 570 + i
    }), window.Modal.GameOverModal = Container.expand(function (e, t) {
        Modal.ModalOverlayContent.call(this);
        var i = this;
        i.addHeadline(Host.Localize.Translate("Game Over")), i.addLead(Host.Localize.Translate("No more valid moves")), i.blurClose = !1;
        var n = i.addButton(Host.Localize.Translate("Start over"), e, 7463062), r = 250;
        (i.addMetaButton(r, {mainActionCallback: t}) && (r += 165), t) && (i.addMiddleButton(Host.Localize.Translate("Return to Calendar"), Host.Localize.Translate("Play another level?"), t, 7445472).y = r, r += 165);
        n.y = r - 35, i.innerHeight = r + 165
    }), window.Modal.NewGameModal = Container.expand(function (e, t) {
        var i = Modal.ModalOverlayContent.call(this), n = -170,
            r = i.addButton(Host.Localize.Translate("Start"), function () {
                e()
            }, 7463062);
        if (t) {
            var o = i.addSlider({
                casual: Host.Localize.Translate("Casual"),
                normal: Host.Localize.Translate("Normal"),
                challenging: Host.Localize.Translate("Challenging"),
                casualStar: t.casualStar,
                normalStar: t.normalStar,
                challengingStar: t.challengingStar,
                selected: t.complexity
            });
            o.on("complexity", function (e) {
                XS.data.modalSliderComplexity = e.selected + 1
            }, {freezeGroup: ENG_FRZ_GRP}), o.y = 595;
            var a = e;
            e = function () {
                a(o.getComplexity())
            }, n = 290, i.innerHeight = 570 + n
        }
        r.y += n, i.innerHeight = 570 + n
    }), window.Modal.Toast = Modal.ModalOverlayContent.expand(function (e, t) {
        var i = Modal.ModalOverlayContent.call(this);
        e && i.addHeadline(e), t && i.addLead(t), i.innerHeight = 250
    }), window.Modal.showToast = function (e, t) {
        t = t || 3e3;
        Modal.show(e, !0, !0), XS.setTimeout(Modal.hide, t)
    }
}), window.ScrollContainer = function (e, t) {
    Container.call(this), this.scrollWidth = e, this.scrollHeight = t, this.allowScrollX = !0, this.allowScrollY = !0, this.content = new Container, this.addChild(this.content);
    var i = this.addChildAt.bind(this);
    this.addChild = function (e) {
        return this.content.addChild(e)
    }, LEGACY_COORD_SYSTEM || (this.setMaskEnabled = function (e) {
        if (e) {
            if (!this.mask) {
                var t = new Graphics;
                i(t, this.children.length), this.mask = t, this.resizeMask(this.scrollWidth, this.scrollHeight)
            }
        } else this.mask && (this.mask = null)
    }), this.addChildAt = function (e, t) {
        return this.content.addChildAt(e, t)
    }, this.removeChild = function (e) {
        return this.content.removeChild(e)
    }, this.resize = function (e, t) {
        this.scrollWidth = e, this.scrollHeight = t, LEGACY_COORD_SYSTEM || this.resizeMask(e, t)
    }, LEGACY_COORD_SYSTEM || (this.resizeMask = function (e, t) {
        this.mask && (this.mask.clear(), this.mask.beginFill(16777215), this.mask.drawRect(0, 0, e, t), this.mask.endFill())
    }, this.resizeToContent = function () {
        this.scrollWidth = this.content.width, this.scrollHeight = this.content.height
    }), this.getChildren = function () {
        return this.content.children
    }, this.moved = !1;
    var n = this, r = null, o = 0, a = 0;
    XS.stageContainer.on("down", function (e) {
        var t = e.event;
        Tween.clear(n.content);
        var i = t.getLocalPosition(n), s = 1;
        LEGACY_COORD_SYSTEM && (s = n.ratio);
        var l = i.x / s, c = i.y / s;
        o = n.content.x, a = n.content.y, l >= 0 && c >= 0 && l <= n.scrollWidth && c <= n.scrollHeight && (r = i), n.moved = !1
    }, {freezeGroup: ENG_FRZ_GRP});
    var s = null, l = 0, c = 0;

    function d(e) {
        if (n.allowScrollY) {
            var t = window.event || e, i = t.detail ? -10 * t.detail : t.wheelDelta;
            n.content.y += i, n.scrollWidth, Math.max(n.content.width, n.scrollWidth);
            var r = n.scrollHeight - Math.max(n.content.height, n.scrollHeight);
            LEGACY_COORD_SYSTEM && (n.scrollWidth, Math.max(n.content.width / n.content.ratio, n.scrollWidth), r = n.scrollHeight - Math.max(n.content.height / n.content.ratio, n.scrollHeight)), n.content.y >= 0 ? n.content.y = 0 : n.content.y < r && (n.content.y = r), window.dirtyOnce = !0
        }
    }

    XS.stageContainer.on("move", function (e) {
        var t = e.event, i = 1;
        if (LEGACY_COORD_SYSTEM && (i = n.ratio), null !== r) {
            var d = 1;
            LEGACY_COORD_SYSTEM && (d = XS.devicePixelRatio);
            var h = t.getLocalPosition(n);
            if (n.moved || Math.abs(r.y - h.y) > 5 * d || Math.abs(r.x - h.x) > 5 * d) {
                if (n.moved = !0, s && (l = h.y - s.y, c = (new Date).getTime()), s = h, n.allowScrollX) {
                    var u = o - (r.x - h.x) / i, f = n.scrollWidth - Math.max(n.content.width, n.scrollWidth);
                    if (LEGACY_COORD_SYSTEM && (f = n.scrollWidth - Math.max(n.content.width / n.content.ratio, n.scrollWidth)), u > 0) u = Math.min(u, 7 * Math.sqrt(u)); else if (u < f) {
                        var g = -u + f;
                        u = f - Math.min(g, 7 * Math.sqrt(g))
                    }
                    n.content.x = u
                }
                if (n.allowScrollY) {
                    var p = a - (r.y - h.y) / i, m = n.scrollHeight - Math.max(n.content.height, n.scrollHeight);
                    LEGACY_COORD_SYSTEM && (m = n.scrollHeight - Math.max(n.content.height / n.content.ratio, n.scrollHeight)), p > 0 ? p = Math.min(p, 7 * Math.sqrt(p)) : p < m && (g = -p + m, p = m - Math.min(g, 7 * Math.sqrt(g))), n.content.y = p
                }
            }
        }
    }, {freezeGroup: ENG_FRZ_GRP}), XS.stageContainer.on("up", function (e) {
        r && (!n.moved && n.callback && n.callback(), n.callback = null, n.clean())
    }, {freezeGroup: ENG_FRZ_GRP}), window.addEventListener("DOMMouseScroll", d), window.addEventListener("mousewheel", d), this.clean = function () {
        s = null;
        var e = n.scrollWidth - Math.max(n.content.width, n.scrollWidth),
            t = n.scrollHeight - Math.max(n.content.height, n.scrollHeight);
        LEGACY_COORD_SYSTEM && (e = n.scrollWidth - Math.max(n.content.width / n.content.ratio, n.scrollWidth), t = n.scrollHeight - Math.max(n.content.height / n.content.ratio, n.scrollHeight)), n.content.x >= 0 ? new Tween(n.content, {x: 0}, .2, void 0, ENG_FRZ_GRP) : n.content.x < e && new Tween(n.content, {x: e}, .2, void 0, ENG_FRZ_GRP), n.content.y >= 0 ? new Tween(n.content, {y: 0}, .2, void 0, ENG_FRZ_GRP) : n.content.y < t ? new Tween(n.content, {y: t}, .2, void 0, ENG_FRZ_GRP) : (new Date).getTime() - c < 250 && Math.abs(l) > 5 && new Tween(n.content, {y: Math.max(Math.min(n.content.y + 20 * l, 0), t)}, .4, void 0, ENG_FRZ_GRP), l = 0, r = null, n.moved = !1
    }
}, ScrollContainer.prototype = Object.create(Container.prototype), ScrollContainer.prototype.constructor = ScrollContainer, XS.modulesToPreload.push(function () {
    window.Sidebar = function () {
        var e = this, t = fetch("i/g/s/menutile.svg", !0), i = 510, n = 81, r = -100, o = 68, a = XS.gui.scale.x,
            s = 10 * Math.round(1 / XS.gui.scale.x);
        e.downloadItems = [], LEGACY_COORD_SYSTEM && (i = 250, n = 40, a = 1);
        var l = t.isJSG ? t.draw({scale: 1, forceCanvas: !0}) : t, c = 0, d = void 0, h = 0, u = !1,
            f = e.defaultIcon = embed("i/g/s/icon_new.svg");

        function g() {
            var t = new Sheet(function () {
                var e = document.createElement("canvas");
                e.width = 136, e.height = 75;
                var t = e.getContext("2d");
                t.drawImage(l, 0, 0);
                var i = new Text2(Host.Localize.Translate("Menu"), {
                    fill: "#FFFFFF",
                    size: 80,
                    weight: 400
                }).getContent().canvas, n = Math.min(35 / i.height, 68 / i.width), r = (68 - n * i.width) / 2;
                t.drawImage(i, r, 47, n * i.width, n * i.height);
                var o = new Text2(Host.Localize.Translate("Close"), {
                    fill: "#FFFFFF",
                    size: 80,
                    weight: 400
                }).getContent().canvas, a = Math.min(35 / o.height, 68 / o.width), s = (68 - a * o.width) / 2;
                return t.drawImage(o, s + 68, 47, a * o.width, a * i.height), e
            }(), 68, 75);
            t.x = XS.styles.margins.left ? (XS.styles.margins.left + 5) / .5 : 25, t.y = XS.styles.margins.top ? (XS.styles.margins.top + 5) / .5 : 25;
            var i = 1;
            return LEGACY_COORD_SYSTEM && (i = XS.devicePixelRatio), t.buttonMode = !0, t.interactive = !0, t.ratio = .5 * i, t.on("down", function () {
                "showing" === e.status ? e.hide() : "hidden" === e.status && e.show()
            }, {freezeGroup: ENG_FRZ_GRP}), t
        }

        XS.on("translate", function () {
            var t = g();
            t.alpha = e.icon.alpha, t.visible = e.icon.visible, t.x = e.icon.x, t.y = e.icon.y, t.frame = e.icon.frame, t.anchor.set(e.icon.anchor.x, e.icon.anchor.y);
            var i = e.icon.parent;
            i.removeChild(e.icon), i.addChild(t), e.icon = t
        }, {freezeGroup: ENG_FRZ_GRP}), Container.call(e), e.icon = g(), e.status = "hidden", LEGACY_COORD_SYSTEM || e.scale.set(XS.gui.scale.x, XS.gui.scale.y);
        var p = new Graphics;
        e.addChild(p), p.on("down", function () {
            u || 16 == ++h && (u = !0, XS.emit("spawndebugmenu"))
        }, {freezeGroup: ENG_FRZ_GRP}), e.interactive = !0, p.beginFill(3355443), p.drawRect(0, 0, 200, 200);
        var m = 1;
        LEGACY_COORD_SYSTEM && (m = XS.devicePixelRatio), p.width = (i + XS.styles.margins.left) * m * a;
        var v = new TextureSprite(Texture.emptyTexture);
        LEGACY_COORD_SYSTEM && XS.stageContainer.addChildAt(v, 0), e.sounds = {show: void 0, hide: void 0};
        var w, b = document.createElement("canvas"), y = b.getContext("2d"),
            S = y.createPattern(XS.utils.clipImage(fetch("i/g/s/sidebar.svg", !0), 268, 0, 25, 25), "repeat");

        function x() {
            if (LEGACY_COORD_SYSTEM) p.height = height * XS.devicePixelRatio; else if (e.parent) {
                var t = e.toLocal(new Point(0, XS.size.canvas.height));
                p.height = t.y, v.height = XS.size.canvas.height
            }
        }

        LEGACY_COORD_SYSTEM ? XS.stageContainer.addChild(e.icon) : XS.gui.addChild(e.icon), v.x = -24, e.content = new ScrollContainer(500, 500), e.content.allowScrollX = !1, LEGACY_COORD_SYSTEM && (e.content.ratio = .5 * m), e.content.y = XS.styles.margins.top * m, e.addChild(e.content);
        var C = -i * m * a;
        e.show = function () {
            if ("hidden" === e.status) {
                e.status = "transitioning", XS.stageContainer.addChild(window.Sidebar), XS.stageContainer.addChild(v), x(), window.Sidebar.x = C, v.x = -24, window.Sidebar.content.content.y = 0, Tween.clear(stage), Tween.clear(v), Tween.clear(e.icon);
                var t = 1, n = 1;
                LEGACY_COORD_SYSTEM && (t = XS.devicePixelRatio, n = 2 / XS.devicePixelRatio), new Tween(window.Sidebar, {x: 0}, .3, void 0, ENG_FRZ_GRP), new Tween(stage, {x: (i * a + XS.styles.margins.left) * t}, .3, void 0, ENG_FRZ_GRP), new Tween(v, {x: (i * a + XS.styles.margins.left) * t - 24}, .3, void 0, ENG_FRZ_GRP), LEGACY_COORD_SYSTEM ? new Tween(e.icon, {x: (i + XS.styles.margins.left) * t * n + s}, .3, void 0, ENG_FRZ_GRP) : new Tween(XS.gui, {x: (i * a + XS.styles.margins.left) * t}, .3, void 0, ENG_FRZ_GRP), new Tween(e.icon, {alpha: 0}, .15, void 0, ENG_FRZ_GRP).call(function () {
                    e.icon.frame = 1, new Tween(e.icon, {alpha: 1}, .15, void 0, ENG_FRZ_GRP)
                }), e.sounds.show && e.sounds.show.play(), XS.emit("togglesidebar", {visible: !0}), XS.track.customEvent("sidebar_open", 1), XS.freeze(), XS.setTimeout(function () {
                    e.status = "showing"
                }, 400, [], ENG_FRZ_GRP)
            }
        }, e.hide = function (t) {
            "showing" === e.status && (c = 0, h = 0, e.status = "transitioning", Tween.clear(stage), Tween.clear(v), Tween.clear(e.icon), new Tween(window.Sidebar, {x: C}, .3, void 0, ENG_FRZ_GRP), new Tween(stage, {x: 0}, .3, void 0, ENG_FRZ_GRP).call(function () {
                window.Sidebar.parent && window.Sidebar.parent.removeChild(window.Sidebar)
            }), new Tween(v, {x: -24}, .3, void 0, ENG_FRZ_GRP), LEGACY_COORD_SYSTEM ? new Tween(e.icon, {x: 0}, .3, void 0, ENG_FRZ_GRP) : new Tween(XS.gui, {x: 0}, .3, void 0, ENG_FRZ_GRP), new Tween(e.icon, {x: XS.styles.margins.left ? (XS.styles.margins.left + 5) / .5 : 25}, .3, void 0, ENG_FRZ_GRP), new Tween(e.icon, {alpha: 0}, .15, void 0, ENG_FRZ_GRP).call(function () {
                e.icon.frame = 0, new Tween(e.icon, {alpha: 1}, .15, void 0, ENG_FRZ_GRP)
            }), e.sounds.hide && e.sounds.hide.play(), XS.setTimeout(function () {
                XS.unfreeze(), XS.emit("togglesidebar", {visible: !1}), e.status = "hidden", "function" == typeof t && t()
            }, 400, [], ENG_FRZ_GRP))
        };
        var T = 0;
        e.addMenuHeader = function (t) {
            var n = new Container, a = new Graphics, s = 1;
            LEGACY_COORD_SYSTEM && (s = XS.devicePixelRatio);
            var l = i - r;
            a.beginFill(2236962), LEGACY_COORD_SYSTEM && (o = 34), a.drawRect(r * s, -2 * s, l * s, o * s), n.addChild(a), a.on("down", function () {
                u || (d != a ? (debugShadowPressCount = 0, d = a, 8 == ++c && (u = !0, XS.emit("spawndebugmenu"))) : c = 0)
            }, {freezeGroup: ENG_FRZ_GRP});
            var h = 35;
            LEGACY_COORD_SYSTEM && (h = 35);
            var f = (l + r) / (e.content.ratio / s || 1) - 22;
            (t = new Text2(t, {
                weight: XS.is.safari || XS.is.iOS ? 300 : 200,
                size: h,
                fill: "#FFFFFF",
                maxWidth: f
            })).x = 22, t.y = LEGACY_COORD_SYSTEM ? 12 : .5 * o - .5 * t.height, window.headerText = t, n.addChild(t), n.y = T, e.content.addChild(n);
            var g = 128;
            n.scrollHeight = 64, XS.is.usingCanvasRenderer && (g = 64), LEGACY_COORD_SYSTEM ? (g = 64, n.scrollHeight = 64) : g = 84, T += g
        };

        function _(t, i, n, r) {
            var o = 1;
            return LEGACY_COORD_SYSTEM && (o = XS.devicePixelRatio), t.ratio = o / 2, t.x = i, t.y = n, t.resolution = 1, t.hitArea = new Rectangle(0, 0, 50 * o, 50 * o), void 0 !== r && (t.interactive = !0, t.buttonMode = !0, t.defaultCursor = "pointer", t.on("down", function () {
                e.content.callback = function () {
                    XS.navigate(r)
                }
            }, {freezeGroup: ENG_FRZ_GRP})), t
        }

        e.addMenuToggle = function (t, o, a, s, l) {
            var c = new Container, d = 1;
            LEGACY_COORD_SYSTEM && (d = XS.devicePixelRatio);
            var h = i - r;
            t.resolution = XS.devicePixelRatio, t.x = 15, t.y = 15, c.addChild(t);
            var u = new Graphics;
            c.addChild(u), u.lineStyle(1, 0, .2), u.moveTo(-100 * d, 0), u.lineTo(i * d, 0), u.lineStyle(1, 16777215, .2), u.moveTo(-100 * d, 1 * d), u.lineTo(i * d, 1 * d), u.y = n * d, LEGACY_COORD_SYSTEM || u.scale.set(1, 1 / e.scale.y), c.interactive = !0, c.buttonMode = !0, c.defaultCursor = "pointer", c.y = T;
            var f = _(new Sprite(XS.utils.clipImage(fetch("i/g/s/sidebar.svg", !0), 167, 0, 100, 60)), 388, 10);
            c.addChild(f);
            var g = _(new Sprite(XS.utils.clipImage(fetch("i/g/s/sidebar.svg", !0), 0, 0, 104, 64)), 386, 8);
            c.addChild(g);
            var p = _(new Sprite(XS.utils.clipImage(fetch("i/g/s/sidebar.svg", !0), 105, 0, 61, 59)), 427, 12);
            c.addChild(p);
            var m = (h + r) / (e.content.ratio / d || 1) - 80 - 140, v = new Text2(o, {
                weight: XS.is.safari || XS.is.iOS ? 300 : 200,
                size: 35,
                fill: "#ffffff",
                maxWidth: m
            });
            c.addChild(v), v.x = 80, v.y = LEGACY_COORD_SYSTEM ? 22 : .5 * n - .5 * v.height;
            var w = !0;

            function b(e) {
                (w = void 0 !== e ? e : !w) ? (new Tween(p, {x: 427}, .2, void 0, ENG_FRZ_GRP), new Tween(f, {alpha: 1}, .2, void 0, ENG_FRZ_GRP)) : (new Tween(p, {x: 389}, .2, void 0, ENG_FRZ_GRP), new Tween(f, {alpha: 0}, .2, void 0, ENG_FRZ_GRP))
            }

            return c.hitArea = new Rectangle(r * d, 0, (i - r) * d, n * d), c.on("down", function () {
                e.content.callback = function () {
                    b(!w), s(w)
                }
            }, {freezeGroup: ENG_FRZ_GRP}), b(a), e.content.addChild(c), c.scrollHeight = 84, T += 84, c.toggle = b, c
        }, e.hideIcon = function () {
            e.icon.visible = !1, window.dirtyOnce = !0, e.emit("hideicon")
        }, e.showIcon = function () {
            e.icon.visible = !0, window.dirtyOnce = !0, e.emit("showicon")
        }, e.popIcon = function () {
            e.icon.parent.addChild(e.icon)
        }, e.addMenuItem = function (t, o, a) {
            var s = new Container, l = 1;
            LEGACY_COORD_SYSTEM && (l = XS.devicePixelRatio);
            var c = i - r;
            t.resolution = XS.devicePixelRatio, t.x = 15, t.y = 15, s.addChild(t);
            var d = new Graphics;
            s.addChild(d), d.lineStyle(1, 0, .2), d.moveTo(-100 * l, 0), d.lineTo(i * l, 0), d.lineStyle(1, 16777215, .2), d.moveTo(-100 * l, 1 * l), d.lineTo(i * l, 1 * l), d.y = n * l, LEGACY_COORD_SYSTEM || d.scale.set(1, 1 / e.scale.y), s.interactive = !0, s.buttonMode = !0, s.defaultCursor = "pointer", s.y = T, s.hitArea = new Rectangle(r * l, 0, (i - r) * l, n * l);
            var h = (c + r) / (e.content.ratio / l || 1) - 80, u = new Text2(o, {
                weight: XS.is.safari || XS.is.iOS ? 300 : 200,
                size: 35,
                fill: "#ffffff",
                maxWidth: h
            });
            return s.addChild(u), u.x = 80, u.y = LEGACY_COORD_SYSTEM ? 22 : .5 * n - .5 * u.height, e.content.addChild(s), s.scrollHeight = 84, T += 84, s.on("down", function () {
                e.content.callback = function () {
                    a && a()
                }
            }, {freezeGroup: ENG_FRZ_GRP}), s
        }, e.addMenuItemAt = function (t, i, n, r) {
            var o = e.addMenuItem(i, n, r);
            return e.content.addChildAt(o, t), e.reAlignItems(), o
        }, e.addMenuItemAfter = function (t, i, n, r) {
            for (var o = e.addMenuItem(i, n, r), a = e.content.getChildren(), s = 0; s < a.length && a[s] != t; s++) ;
            return e.content.addChildAt(o, s + 1), e.reAlignItems(), o
        }, e.removeMenuItem = function (t) {
            e.content.removeChild(t) && (T -= 84)
        }, e.reAlignItems = function () {
            T = 0;
            for (var t = e.content.getChildren(), i = 0; i < t.length; i++) {
                var n = t[i];
                n.y = T, T += n.scrollHeight
            }
        }, e.addItem = function (t) {
            var i, n = (t = t || {}).name || t.label, r = t.type, o = t.icon || f, a = t.label || "N/A",
                s = t.value || !1, l = t.handler;

            function c(t) {
                "button" === r ? s = !0 : "toggle" === r && (s = t), "function" == typeof l ? l.call(i, s) : e.emit("toggle", n, s)
            }

            switch (r) {
                case"header":
                    i = e.addMenuHeader(a);
                    break;
                case"button":
                    i = e.addMenuItem(new Sprite(o), a, c);
                    break;
                case"toggle":
                    i = e.addMenuToggle(new Sprite(o), a, s, c);
                    break;
                default:
                    console.error("Invalid menu item options:", t)
            }
            return i
        }, e.addSocialBar = function () {
            // if (!("1" == Host.Web.GetQueryString("nosoc") || XS.is.okru || XS.is.rcs || XS.is.huawei || XS.is.miniclip || XS.is.samsungGameLauncher || XS.is.samsungInstantPlay || XS.is.tMobile || XS.is.lgtv)) {
            //     var t = new Container;
            //     t.addChild(_(new Sprite(fetch("i/g/s/icon_frvr.svg", !0)), 20, 15, "http://frvr.com")), t.addChild(_(new Sprite(fetch("i/g/s/icon_twitter.svg", !0)), 220, 15, "--https--twitter.com/frvrgames")), t.addChild(_(new Sprite(fetch("i/g/s/icon_facebook.svg", !0)), 420, 15, Config.facebookPageUrl || "--https--www.facebook.com/frvrgames")), t.y = T, e.content.addChild(t), t.scrollHeight = 82, T += 82
            // }
        }, e.settings = [], e.addSetting = function (t) {
            e.settings.push(t)
        }, e.addSettings = function (t) {
            if (!Config.disableSidebarSettings && (!0 !== t && e.addMenuHeader(Host.Localize.Translate("Settings")), XS.is.twitch && (XS.muteSound(!0), XS.muteMusic(!0)), XS.audio.muteSounds(XS.soundSettings.muteSound.get()), e.addMenuToggle(new Sprite(fetch("i/g/s/icon_sound.svg", !0)), Host.Localize.Translate("Sound Effects"), !XS.Sound.muted, function (e) {
                XS.audio.muteSounds(!e)
            }), XS.audio.muteMusics(XS.soundSettings.muteMusic.get()), !XS.audio.isMusicMuted() && XS.backgroundMusic && XS.backgroundMusic.play(0, !0), e.lastMenuItem = e.addMenuToggle(new Sprite(fetch("i/g/s/icon_music.svg", !0), 1), Host.Localize.Translate("Music"), !XS.Music.muted, function (e) {
                XS.audio.muteMusics(!e)
            }), e.settings.length > 0)) for (var i = 0; i < e.settings.length; i++) {
                var n = e.settings[i];
                e.lastMenuItem = e.addMenuToggle(n.image, n.text, n.state, n.callback)
            }
        }, e.addMore = function () {
            // XS.is.facebookInstant || XS.is.twitch || XS.is.okru || XS.is.samsungInstantPlay || (Sidebar.addMenuHeader(Host.Localize.Translate("More")), XS.is.lgtv || Sidebar.addMenuItem(new Sprite(fetch("i/g/s/icon_frvr.svg", !0)), Host.Localize.Translate("FRVR Games"), function () {
            //     XS.is.samsung ? XS.navigate("--https--play.frvr.com") : XS.navigate("--https--frvr.com")
            // }), XS.is.samsungGameLauncher || Sidebar.addMenuItem(new Sprite(fetch("i/g/s/icon_feedback.svg", !0)), Host.Localize.Translate("Send Feedback"), function () {
            //     XS.navigate(Config.feedbackURL)
            // }), e.lastMenuItem = Sidebar.addMenuItem(new Sprite(fetch("i/g/s/icon_legal.svg", !0)), Host.Localize.Translate("Legal"), function () {
            //     XS.navigate("--https--frvr.com/legal/")
            // }), e.lastMenuItem = Sidebar.addMenuItem(new Sprite(fetch("i/g/s/icon_credits.svg", !0)), Host.Localize.Translate("Credits"), function () {
            //     XS.navigate("--https--frvr.com/credits/" + Config.id + ".html")
            // }))
        }, e.addDownloadItem = function (t, i, n) {
            e.downloadItems.push({image: t, text: i, callback: n})
        }, e.addRestartItem = function (t, i) {
            var n = i || Host.Localize.Translate("Restart Level", {}, "Level in this context is a level in a game");
            e.restartItem = {
                image: new Sprite(embed("i/g/s/icon_restart.svg")), text: n, callback: function () {
                    e.hide(), XS.emit("restart"), t && t()
                }
            }
        }, e.addNewItem = function (t, i) {
            var n = i || Host.Localize.Translate("New Game", {}, "");
            e.newItem = {
                image: new Sprite(embed("i/g/s/icon_new.svg")), text: n, callback: function () {
                    e.hide(), XS.emit("newgame"), t && t()
                }
            }
        }, e.addShopItem = function (t, i) {
            var n = i || Host.Localize.Translate("Shop");
            e.shopItem = {
                image: new Sprite(fetch("i/g/s/icon_shop.svg")), text: n, callback: function () {
                    e.hide(), t && t()
                }
            }
        }, e.addExitToMapItem = function (t, i) {
            var n = i || Host.Localize.Translate("Exit to Map");
            e.exitToMapItem = {
                image: new Sprite(embed("i/g/s/icon_map.svg")), text: n, callback: function () {
                    e.hide(), t && t()
                }
            }
        }, e.addStandards = function () {
            if (Sidebar.addMenuHeader(Config.shareTitle), e.newItem) {
                var t = e.newItem;
                e.lastItem = e.addMenuItem(t.image, t.text, t.callback)
            }
            if (e.restartItem) {
                t = e.restartItem;
                e.lastItem = e.addMenuItem(t.image, t.text, t.callback)
            }
            if (e.shopItem) {
                t = e.shopItem;
                e.lastItem = e.addMenuItem(t.image, t.text, t.callback)
            }
            if (e.exitToMapItem) {
                t = e.exitToMapItem;
                e.lastItem = e.addMenuItem(t.image, t.text, t.callback)
            }
            if (!XS.is.twitch) {
                var i = void 0;
                XS.insertRemoveAdsButton = function (t, n, r) {
                    Host.Log("Sidebar: Inserting 'Remove Ads' button");
                    var o = e.content.getChildren(), a = 1;
                    e.restartItem && (a += 1), o.length > a ? i = Sidebar.addMenuItemAfter(o[a], t, n, r) : (Host.WrapperLog("Warning: Sidebar: Remove Ads menu item added to bottom of menu"), Sidebar.addMenuItem(t, n, r))
                }, XS.removeAdsButton = function () {
                    i ? (Host.Log("Sidebar: Removing 'Remove Ads' button"), e.removeMenuItem(i), e.reAlignItems(), i = void 0) : Host.Log("Sidebar: No adsButton defined")
                }, XS.is.facebookInstant || XS.is.spilGamesWrapper || (window.insertButton = function (t, i, n) {
                    if (!(t instanceof Sprite)) throw"Please update your code to use the new SVG icons: " + i;
                    return e.lastItem ? Sidebar.addMenuItemAfter(e.lastItem, t, i, n) : Sidebar.addMenuItem(t, i, n)
                }), XS.is.spilGamesWrapper || "rt" == Config.stage || XS.is.samsungInstantPlay || XS.is.lgtv || XS.is.yandex || Sidebar.addMenuItem(new Sprite(fetch("i/g/s/icon_share.svg", !0)), Host.Localize.Translate("Share {game_name}", {game_name: Config.shareTitle}), function () {
                    window.shareDialogueCallback()
                })
            }
            if (e.downloadItems.length > 0) for (var n = 0; n < e.downloadItems.length; ++n) {
                t = e.downloadItems[n];
                Sidebar.addMenuItem(new Sprite(t.image), t.text, t.callback)
            }
            Sidebar.addSettings(), XS.is.facebookInstant || XS.is.twitch || XS.is.yandex || XS.is.spilGamesWrapper || (Sidebar.addMore(), Sidebar.addSocialBar()), Sidebar.buildDefaultQaDebugItems()
        }, e.addAdsDebug = function () {
            XS.ads && Config.adIds && (Sidebar.addMenuItem(new Sprite(embed("i/g/s/icon_new.svg")), "XS Ads: Preload Interstitial", function () {
                XS.ads.preload("interstitial", function (e) {
                }), Sidebar.hide()
            }), Sidebar.addMenuItem(new Sprite(embed("i/g/s/icon_new.svg")), "XS Ads: Show Interstitial", function () {
                XS.ads.show("interstitial", function (e) {
                }), Sidebar.hide()
            }), Sidebar.addMenuItem(new Sprite(embed("i/g/s/icon_new.svg")), "XS Ads: Force Interstitial", function () {
                XS.ads.force("interstitial", function (e) {
                }), Sidebar.hide()
            }), Sidebar.addMenuItem(new Sprite(embed("i/g/s/icon_new.svg")), "XS Ads: Preload Reward Ad", function () {
                XS.ads.preload("reward", function (e) {
                }), Sidebar.hide()
            }), Sidebar.addMenuItem(new Sprite(embed("i/g/s/icon_new.svg")), "XS Ads: Show Reward Ad", function () {
                XS.ads.show("reward", function (e) {
                }), Sidebar.hide()
            }), Sidebar.addMenuItem(new Sprite(embed("i/g/s/icon_new.svg")), "XS Ads: Force Reward Ad", function () {
                XS.ads.force("reward", function (e) {
                }), Sidebar.hide()
            }))
        };
        var k = [];
        e.addQaDebugItem = function (e, t) {
            "object" == typeof e ? k.push(e) : k.push({type: "button", label: e, handler: t})
        }, e.addQaDebug = function () {
            for (var t = 0; t < k.length; t++) e.addItem(k[t])
        }, e.buildDefaultQaDebugItems = function () {
            function t() {
                "function" == typeof window.debugOutputData ? window.debugOutputData() : (console.warn("debugOutputData function not implemented in game. Trying standard XS.data.toString"), XS.data ? console.log(XS.data.toString()) : console.warn("Game doesn't use XS.data")), Sidebar.hide()
            }

            e.addQaDebugItem("Force Game Over", function () {
                "function" == typeof window.debugShowGameOver ? window.debugShowGameOver() : XS.is.facebookInstant ? (console.warn("debugShowGameOver function not implemented in game. Trying standards"), "function" == typeof window.Social.Instant.showGameOver ? window.Social.Instant.showGameOver() : "function" == typeof window.Social.Instant.onGameOver ? window.Social.Instant.onGameOver() : console.warn("No applicable standard functions found")) : console.warn("debugShowGameOver function not implemented in game."), Sidebar.hide()
            }), e.addQaDebugItem("Force Retry Overlay", function () {
                "function" == typeof window.debugForceRetry ? window.debugForceRetry() : console.warn("debugForceRetry function not implemented in game."), Sidebar.hide()
            }), e.addQaDebugItem("XS Data output elements", function () {
                t()
            }), e.addQaDebugItem("XS Data reset to defaults", function () {
                "function" == typeof window.debugResetData ? (window.debugResetData(), t()) : (console.warn("debugResetData function not implemented in game. Trying standard XS.data.resetToDefaults"), XS.data ? (XS.data.resetToDefaults(), t()) : console.warn("Game doesn't use XS.data")), Sidebar.hide()
            }), e.addQaDebugItem("Force Reload", function () {
                window.FRVRInterfaceCoreProxy && window.FRVRInterfaceCoreProxy.forceReload ? window.FRVRInterfaceCoreProxy.forceReload() : window.top.location.reload()
            })
        }, e.addBuildInfo = function () {
            if (e.addMenuHeader("Version: " + Config.version + "(" + Config.build + ")"), Config.frvr_repo_statuses) {
                e.addMenuHeader("Build Info:");
                var t = JSON.parse(Config.frvr_repo_statuses);
                for (var i in t) if (t.hasOwnProperty(i)) {
                    var n = i, r = n[0];
                    0 == n.indexOf("frvr") && (r = n[5]);
                    var o = t[n], a = o.hash.substring(0, 8), s = o.dirty ? "(!)" : "",
                        l = o.branch ? o.branch.substring(0, 25) : "n/a", c = o.tag ? o.tag : "n/a";
                    if (e.addMenuHeader("------------------"), e.addMenuHeader(r), e.addMenuHeader("> h: " + a + " " + s), e.addMenuHeader("> b: " + l), e.addMenuHeader("> t: " + c), o.toolsSubmoduleType && e.addMenuHeader("> sm-ty: " + o.toolsSubmoduleType), o.toolsSubmoduleHash) {
                        var d = o.toolsSubmoduleHash.substring(0, 8), h = o.toolsSubmoduleDirty ? "(!)" : "";
                        e.addMenuHeader("> sm-h: " + d + " " + h)
                    }
                    o.toolsSubmoduleBranch && e.addMenuHeader("> sm-b: " + o.toolsSubmoduleBranch), o.toolsSubmoduleTag && e.addMenuHeader("> sm-t: " + o.toolsSubmoduleTag)
                }
                e.addMenuHeader("------------------")
            }
            Config.build_time && (e.addMenuHeader("Build Time (UTC):"), e.addMenuHeader("> " + Config.build_time)), Config.template && e.addMenuHeader("Template: " + Config.template);
            var u = XS.is.usingWebGLRenderer ? "WebGL" : XS.is.usingCanvasRenderer ? "Canvas" : "Unknown";
            e.addMenuHeader("Renderer: " + u), e.addMenuHeader("Coords: " + (LEGACY_COORD_SYSTEM ? "Legacy" : "New")), Host.GetMemoryUsage && Host.GetMemoryUsage(function (e) {
                Host.Log("free memory: " + e.freememory), Host.Log("total memory: " + e.totalmemory)
            })
        }, stage.on("down", function () {
            "showing" === e.status && e.hide()
        }, {freezeGroup: ENG_FRZ_GRP}), XS.on("resize", function () {
            var t = 1, r = 1 / e.scale.x;
            LEGACY_COORD_SYSTEM && (t = XS.devicePixelRatio, r = 1), e.icon.ratio = .5 * t, "hidden" === e.status ? (e.icon.x = XS.styles.margins.left ? (XS.styles.margins.left + 5) / .5 : 25, v.x = -24, stage.x = 0) : (v.x = (i * a + XS.styles.margins.left) * t - 24, stage.x = (i * a + XS.styles.margins.left) * t), e.icon.y = XS.styles.margins.top ? (XS.styles.margins.top + 5) / .5 : 25, e.content.y = XS.styles.margins.top * t, e.content.x = XS.styles.margins.left * t, C = -(i * a + XS.styles.margins.left) * t, height != w && (w = height, b.width = 25, LEGACY_COORD_SYSTEM ? b.height = height * t * r : b.height = 4, y.fillStyle = S, y.fillRect(0, 0, b.width, b.height), v.texture.destroy(!0), v.setTexture(new Texture.fromCanvas(b)), x()), p.width = (i * a + XS.styles.margins.left) * t * r, e.content.resize(2 * (i + XS.styles.margins.left) * t, 2 * (height - XS.styles.margins.top) - n), LEGACY_COORD_SYSTEM || e.applyResolutionRecursive()
        }, {freezeGroup: ENG_FRZ_GRP}), LEGACY_COORD_SYSTEM || e.applyResolutionRecursive()
    }, Sidebar.prototype = Object.create(Container.prototype), Sidebar.prototype.constructor = Sidebar, window.Sidebar = new Sidebar
}), XS.qaAssertProviders = XS.qaAssertProviders || {}, XS.qaAssertProviders.sidebar = {
    display: "Sidebar Options",
    items: {
        apiShow: {
            display: function () {
                return "Show through API"
            }, scope: window, onRecord: function () {
                Sidebar.show()
            }, onReplay: function (e) {
                Sidebar.show()
            }
        }
    }
}, XS.modulesToPreload.push(function () {
    function e(e, t) {
        Container.call(this);
        var i = new Graphics;
        i.beginFill(16777215, .9), this.addChild(i);
        var n = new Text2(e, {weight: 400, size: 110, fill: "#000000", align: "center", maxWidth: 1950});
        n.anchor.set(.5, 0), this.addChild(n), n.x = 1e3, n.y = 25;
        var r = new Text2(t, {weight: 300, size: 80, fill: "#000000", align: "center", maxWidth: 1950});
        r.anchor.set(.5, 0), this.addChild(r), r.x = 1e3, r.y = n.y + n.height + 20;
        var o = r.y + r.height + 40;
        i.drawRoundedRect(0, 0, 2e3, o, 35), this.setRatio = function (e) {
            i.width = 2e3 * e, i.height = 400 * e
        }
    }

    e.prototype = Object.create(Container.prototype), e.prototype.constructor = e;
    var t = null;
    window.Tutorial = new function () {
        var i = this;
        this.show = function (n, r, o, a, s) {
            return t && i.hide(), (t = new e(a, s)).x = r - 1e3, t.y = o - 400 + 150, n.addChild(t), t.alpha = 0, new Tween(t, {
                y: o - 400,
                alpha: 1
            }, .5, void 0, ENG_FRZ_GRP), t
        }, this.hide = function () {
            t && (new Tween(t, {y: t.y - 150, alpha: 0}, .5, void 0, ENG_FRZ_GRP).call(function () {
                this.parent.removeChild(this)
            }), t = void 0)
        }, this.get = function () {
            return t
        }
    }
}), XS.modulesToPreload.push(function () {
    function e() {
        var e = this, t = 0, i = void 0, n = void 0, r = void 0, o = void 0, a = !1;
        e.force = function () {
            !function () {
                if (!i) {
                    i = document.createElement("div");
                    var e = {
                        width: "100%",
                        height: "100%",
                        top: "0px",
                        left: "0px",
                        position: "absolute",
                        backgroundColor: "#000",
                        opacity: "0.7",
                        zIndex: "102",
                        display: "block"
                    };
                    for (prop in e) i.style[prop] = e[prop]
                }
                if (!n) {
                    n = document.createElement("div");
                    var t = {
                        border: "10px solid rgba(255,255,255,.3)",
                        borderTop: "10px solid #ffffff",
                        borderRight: "10px solid #ffffff",
                        borderRadius: "50%",
                        width: "100px",
                        height: "100px",
                        position: "absolute",
                        zIndex: 20,
                        left: "50%",
                        top: "50%",
                        marginLeft: "-60px",
                        marginTop: "-60px"
                    };
                    for (prop in t) n.style[prop] = t[prop]
                }
            }(), a || e.showSpinner(), document.body.appendChild(i);
            var t = 0;
            n.style.transform = "rotate(" + t + "deg)", clearInterval(r), r = setInterval(function () {
                t += 4, n.style.transform = "rotate(" + t + "deg)"
            }, 16)
        }, e.show = function (i, n) {
            a = i, 1 == ++t && (0 === n ? e.force() : o = setTimeout(e.force, n || 5))
        }, e.hide = function () {
            0 == --t && (clearTimeout(o), clearInterval(r), i && i.parentNode && i.parentNode.removeChild(i))
        }, e.hideSpinner = function () {
            n && n.parentNode && n.parentNode.removeChild(n), a = !0
        }, e.showSpinner = function () {
            i && i.appendChild(n), a = !1
        }
    }

    window.LoadSpinner = e, XS.loadSpinner = new e
}), XS.modulesToPreload.push(function () {
    if (XS.is.partnerWrapper) {
        var e = !1;
        XS.is.iOS && "object" == typeof webkit.messageHandlers.NativeBridge ? (Host.sendToHost = function (e) {
            webkit.messageHandlers.NativeBridge.postMessage(e)
        }, e = !0) : "object" == typeof NativeBridge && (Host.sendToHost = function (e) {
            NativeBridge.postMessage(JSON.stringify(e))
        }, e = !0), e && (Host.call = function (e, t, i) {
            t._method = e, Host.sendToHost(t)
        }, Config.ads = Config.ads || {}, Config.ads.web = Config.ads.web || {}, Config.ads.web.interstitial = Config.ads.web.interstitial || {}, Config.ads.web.interstitial.providers = Config.ads.web.interstitial.providers || {}, Config.ads.web.interstitial.providers["nativebridge-interstitial"] = {
            timeout: 2500,
            priority: 0,
            config: {}
        }, Config.ads.web.reward = Config.ads.web.reward || {}, Config.ads.web.reward.providers = Config.ads.web.reward.providers || {}, Config.ads.web.reward.providers["nativebridge-reward"] = {
            timeout: 2500,
            priority: 0,
            config: {}
        })
    }
});
var Config = {
    id: "stackthree",
    niceId: "stackthree",
    domain: "stackthree.frvr.com",
    version: "1.3.10",
    build: "74",
    stage: "gold",
    facebookAppId: "1584700764983406",
    facebookPageUrl: "--https--www.facebook.com/stackthreefrvr/",
    facebookAppUrl: "--https--apps.facebook.com/stackthreefrvr",
    adMobInterstitialIdiOS: "ca-app-pub-6389174903462367/5673294085",
    adMobInterstitialIdAndroid: "ca-app-pub-6389174903462367/6411660687",
    shareUrl: "--https--stackthree.frvr.com/{{language_path}}",
    playTitle: Host.Localize.Translate("Play Stack Three FRVR"),
    shareText: Host.Localize.Translate("I think you will like Stack Three FRVR"),
    shareTitle: Host.Localize.Translate("Stack Three FRVR"),
    shortTitle: Host.Localize.Translate("Stack Three"),
    iosAppId: "1355649105",
    adMobAppIdiOS: "ca-app-pub-6389174903462367~6986375750",
    adMobAppIdAndroid: "ca-app-pub-6389174903462367~5249911813",
    googleAdSiteId: "4481639214",
    googleAdSpilgamesId: "4388062450",
    buttonShareTitle: Host.Localize.Translate("Share Stack Three FRVR", {}, "Button text for sharing Stack Three FRVR"),
    buttonShareDescription: Host.Localize.Translate("Invite your friends?"),
    iOSRemoveAdsProductIdentifier: "stackthreeremoveads",
    androidRemoveAdsProductIdentifier: "stackthreeremoveads",
    gameCenterEnabled: !1,
    feedbackURL: "--https--frvr.com/support/",
    facebookInstantGameID: "213428599445340",
    facebookInstantNamespace: "stackthrfrvrinstant",
    useFacebookInstantRichGameplayFeatures: !0,
    fbInstantInterstitialIdAll: "213428599445340_319479215506944",
    backendPath: "--https--production-dot-frvr-chatbot.appspot.com/stackthree",
    facebookInstantFillColor: "#9cbdd1",
    facebookInstantScoreOverlayTextColor: "#694f56",
    facebookInstantScoreOverlayShadowColor: "#FFFFFF",
    facebookInstantBannerStyleOverwrite: {style: {backgroundSize: "auto 260px", backgroundPosition: "center top"}},
    iOSReviewURL: "--https--itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=1355649105&pageNumber=0&sortOrdering=2&type=Purple+Software&mt=8",
    androidReviewURL: "market://details?id=com.frvr.stackthree",
    androidInstallBannerURL: "i/web/android.png",
    androidInstallURL: "market://details?id=com.frvr.stackthree",
    androidInstallURLWeb: "--https--play.google.com/store/apps/details?id=com.frvr.stackthree",
    iOSInstallBannerURL: "i/web/ios.png",
    iOSInstallURL: "http://itunes.apple.com/app/id1355649105",
    gaId: "UA-54081731-1",
    gaGameId: "UA-54081731-22",
    chromeAppEnabled: !1,
    twitterTexts: [Host.Localize.Translate("Check out Stack Three FRVR, a fun and fast paced match 3 game!"), Host.Localize.Translate("Check out Stack Three FRVR, easy to learn, hard to master, fun all the way!"), Host.Localize.Translate("Check out Stack Three FRVR, match blocks, create huge combos and set a crazy high score!"), Host.Localize.Translate("Check out Stack three FRVR, colourful matching fun with a twist!")],
    pushNotificationText: Host.Localize.Translate("Your daily Stack Three level is ready to play!", {}, "This is a push notification used on mobile phones to show that their daily level is ready"),
    twitterRelated: "frvrgames,benjaminsen,brianmeidell",
    twitterHashTags: Host.Localize.Translate("match3, Stack Three, arcadegame, game, mobilegame", {}, "These are are hash tags for social networks such as twitter, E.g. #puzzle or #puzzle# for chinese sites"),
    twitterHTML: '<div style="padding-right:10px"><a href="--https--twitter.com/share" class="twitter-share-button" data-url="{{shareUrl}}" data-text="{{TEXT}}" data-via="FRVRGames" data-hashtags="{{twitterHashTags}}" data-related="{{twitterRelated}}" target="_new"></a></div>',
    twitterMobileHTML: '<div><a href="--https--twitter.com/share" class="twitter-share-button" data-url="{{shareUrl}}" data-text="{{TEXT}}" data-via="FRVRGames" data-hashtags="{{twitterHashTags}}" data-related="{{twitterRelated}}" target="_new"></a></div><div style="margin-left:10px"><a class="twitter-follow-button" href="--https--twitter.com/FRVRGames"></a></div>',
    enablePWA: !0,
    gplusHTML: '<div class="g-plusone" data-size="medium" data-href="{{shareUrl}}"></div>',
    remoteConfigVersion: "v4",
    plugins: "modal.js,scrollcontainer.js,sidebar.js,tutorial.js,localnotifications.js",
    tagLine: "Match Three Puzzle Fun",
    tagLineFree: "Match Three Puzzle Fun",
    oneliner: "Match and stack the tiles to beat your best score",
    twitterDescription: "Match and stack the tiles to beat your best score",
    huaweiQuickAppInterstitialAdUnitId: "e8brn4tcby",
    huaweiQuickAppRewardAdUnitId: "y0jjj1rtsl",
    ads: {
        yandex: {
            interstitial: {
                maxfrequency: 4e4,
                forceFirstAd: !0,
                providers: {"yandex-interstitial": {timeout: 500, priority: 1}}
            }, reward: {forceFirstAd: !0, providers: {"yandex-reward": {timeout: 500, priority: 1}}}
        },
        "samsung-instant-play": {
            interstitial: {
                maxfrequency: 3e4,
                forceFirstAd: !0,
                providers: {
                    "samsung-instant-interstitial": {
                        timeout: 500,
                        priority: 1,
                        placementId: "1b8b39584c6649fca20f8028bf3caa79"
                    }
                }
            },
            reward: {
                forceFirstAd: !0,
                providers: {
                    "samsung-instant-reward": {
                        timeout: 500,
                        priority: 1,
                        placementId: "1acef0df87c74128ad6ed2c49a3b4151"
                    }
                }
            }
        },
        web: {
            interstitial: {
                maxfrequency: 1e4,
                forceFirstAd: !0,
                providers: {
                    "huawei-quickapp-interstitial": {priority: 1},
                    "web-adsense-interstitial": {timeout: 500, priority: 2}
                }
            }
        },
        android: {
            interstitial: {
                maxfrequency: 12e4,
                forceFirstAd: !0,
                providers: {
                    "admob-interstitial": {
                        timeout: 500,
                        priority: 1,
                        config: {
                            adunitid: "ca-app-pub-6389174903462367/6411660687",
                            adMobAppIdAndroid: "ca-app-pub-6389174903462367~5249911813",
                            forcePreloadTimeout: 3.5,
                            forceFirstAd: !0
                        }
                    }
                }
            }
        },
        ios: {
            reward: {
                maxfrequency: 5,
                providers: {
                    "admob-reward": {
                        timeout: 500,
                        priority: 1,
                        config: {adunitid: "ca-app-pub-6389174903462367/9040052970"}
                    }
                }
            },
            interstitial: {
                maxfrequency: 12e4,
                forceFirstAd: !0,
                providers: {
                    "admob-interstitial": {
                        timeout: 500,
                        priority: 1,
                        config: {
                            adMobAppIdiOS: "ca-app-pub-6389174903462367~6986375750",
                            adunitid: "ca-app-pub-6389174903462367/5673294085",
                            forcePreloadTimeout: 3.5
                        }
                    }
                }
            }
        }
    },
    localNotifications: [{
        code: "d1",
        title: Host.Localize.Translate("A new level is waiting!"),
        message: Host.Localize.Translate("Do you take the challenge?"),
        seconds: 86400
    }, {
        code: "d3",
        title: Host.Localize.Translate("Wow! Are you ready?"),
        message: Host.Localize.Translate("Let's take a break and play!"),
        seconds: 259200
    }, {
        code: "d7",
        title: Host.Localize.Translate("Uh oh, you're losing!"),
        message: Host.Localize.Translate("Time to beat that highscore!"),
        seconds: 604800
    }, {
        code: "d14",
        title: Host.Localize.Translate("Take a break and Play!"),
        message: Host.Localize.Translate("Time to relax and have some fun!"),
        seconds: 1209600
    }, {
        code: "d30",
        title: Host.Localize.Translate("Someone is missing you here!"),
        message: Host.Localize.Translate("It's time to come back and have fun again!"),
        seconds: 2592e3
    }],
    samsungGameLauncher: {icon: "--https--cdn.frvr.com/2021/icons-center/128/stackthree.png"}
};
XS.modulesToPreload.push(function () {
    XS.is.crazyGames ? console.log("Ad Provider Skipped on CrazyGames: web-adsense-interstitial") : (window.adProviders = window.adProviders || {}, window.adProviders["web-adsense-interstitial"] = new function () {
        createErrorHandler("Web iAd");
        var e, t = window.GSInstant;

        function i() {
            XS.data.addBoolWithLocalKey("samsungBixby", "samsungBixby.v1", {remote: !1}), XS.data.addBoolWithLocalKey("samsungGameLauncherPWA", "samsungGameLauncherPWA.v1", {remote: !1}), XS.data.addBoolWithLocalKey("samsungGalaxyStorePWA", "samsungGalaxyStorePWA.v1", {remote: !1}), XS.data.addIntWithLocalKey("fullScreenVideoCount", "fsvideocount.v2", {remote: !1}), XS.data.addIntWithLocalKey("interstitialPlayCount", "playCount8", {remote: !1}), XS.data.addBoolWithLocalKey("acontained", "acontained.v2", {remote: !1}), (XS.is.samsungBixby || XS.data.samsungBixby) && (console.warn("Reset to Samsung Bixby"), XS.data.samsungBixby = XS.is.samsungBixby = !0), (XS.is.samsungGalaxyStorePWA || XS.data.samsungGalaxyStorePWA) && (console.warn("Reset to samsungGalaxyStorePWA"), XS.data.samsungGalaxyStorePWA = XS.is.samsungGalaxyStorePWA = !0), (XS.is.samsungGameLauncherPWA || XS.data.samsungGameLauncherPWA) && (console.warn("Reset to samsungGameLauncherPWA"), XS.data.samsungGameLauncherPWA = XS.is.samsungGameLauncherPWA = !0);
            var i,
                n = XS.is.samsungBixby || XS.is.rcs || XS.is.miniclip || XS.is.samsungBrowser || XS.is.samsungGalaxyStorePWA || XS.is.samsungGameLauncherPWA || XS.is.samsungBrowserUK || XS.is.samsungBrowserUS || XS.is.samsungBrowserSEA || XS.is.mozilla || XS.is.spilGamesWrapper || XS.is.samsungGameLauncher || XS.is.huaweiquickapp || XS.is.tMobile || XS.is.samsungInstantPlay || Host.Web.GetQueryString("partnerid"),
                r = XS.is.huawei;
            if (XS.is.huaweiquickapp) {
                !1
            }
            var o = XS.is.iframed || n,
                a = "--https--googleads.g.doubleclick.net/pagead/ads?ad_type={$ADTYPE}&client=ca-games-pub-6389174903462367&description_url=https%3A%2F%2F{$GAMENAME}.frvr.com%2F&channel={$CHANNEL}&hl=en&max_ad_duration=60000&videoad_start_delay=0&vpa=1",
                s = "--https--googleads.g.doubleclick.net/pagead/ads?ad_type={$ADTYPE}&client=ca-games-pub-6389174903462367&description_url=https%3A%2F%2F{$GAMENAME}.frvr.com%2F&channel={$CHANNEL}&hl=en&&max_ad_duration=60000&adsafe=high&videoad_start_delay=0&vpa=1",
                l = "";

            function c() {
                var e = Host.Web.GetQueryString("partnerid");
                if (e) return e;
                if (XS.is.samsungBrowser) return "3660984936";
                if (XS.is.rcs) return "3217022605";
                if (XS.is.huaweiquickapp) return "9547456458";
                if (XS.is.huawei) return "4822698373";
                if (XS.is.tMobile) return "7269966843";
                if (XS.is.miniclip) return "8532226134";
                if (XS.is.samsungBrowserSEA) return "2765561693";
                if (XS.is.samsungBrowserUS) return "1526015108";
                if (XS.is.samsungBrowserUK) return "2961002817";
                if (XS.is.mozilla) return "9508446909";
                if (XS.is.samsungBixby) return "7640790291";
                if (XS.is.samsungGalaxyStorePWA) return "7430391555";
                if (XS.is.samsungGameLauncherPWA) return "9997971842";
                if (XS.is.samsungInstantPlay) return "3238562380";
                if (XS.is.samsungGameLauncher) switch (Host.Web.GetQueryString("source")) {
                    case"ft_daily":
                        return "4111954147";
                    case"ft_bixby":
                        return "7859627468";
                    case"ft_browser_us":
                        return "7627870781";
                    case"ft_browser_uk":
                        return "8436188448";
                    default:
                        return "7978894035"
                } else if (Host.Web.GetQueryString("gl_fallback") || "" === Host.Web.GetQueryString("gl_fallback")) switch (Host.Web.GetQueryString("source")) {
                    case"ft_daily":
                        return "3704760038";
                    case"ft_bixby":
                        return "7640790291";
                    case"ft_browser_us":
                        return "1526015108";
                    case"ft_browser_uk":
                        return "2961002817";
                    default:
                        return "9152813246"
                }
                return XS.is.spilGamesWrapper && Config.googleAdSpilgamesId ? Config.googleAdSpilgamesId : !!Config.googleAdSiteId && Config.googleAdSiteId
            }

            function d(e, t) {
                var i, n, r, o = XS.is.spilGamesWrapper && Config.googleAdSpilgamesId ? s : a;
                return webAdvertisementURL = (i = o, n = e, r = XS.is.mobile ? "video_text_image" : "video_text_image_flash", i = i.split("{$ADTYPE}").join(r), n && (i = i.split("{$CHANNEL}").join(n)), i = i.split("{$GAMENAME}").join(Config.id)), console.log("Showing Google Ad URL: " + webAdvertisementURL), webAdvertisementURL + l
            }

            XS.is.samsungGameLauncher && "undefined" != typeof FRVRInstant && FRVRInstant.getADID().then(function (e) {
                l = "&rdid=" + e + "&idtype=adid&is_lat=0"
            }).catch(function (e) {
                console.warn("Unable to get rdid")
            });
            var h, u, f = 1, g = 480, p = 360;

            function m() {
                f = Math.min(Math.min(document.documentElement.clientWidth / g, document.documentElement.clientHeight / p), 1)
            }

            function v() {
                m(), h && h.resize(b(), w(), google.ima.ViewMode.FULLSCREEN), u && (u.style.transform = "scale(" + f + ")")
            }

            function w() {
                return Math.floor(Math.max(Math.ceil(document.documentElement.clientHeight / f), p))
            }

            function b() {
                return Math.floor(Math.max(Math.ceil(document.documentElement.clientWidth / f), g))
            }

            function y(i, n, r) {
                var o = c();
                if (window.google && window.google.ima) {
                    var a, s = !1, l = document.getElementById("gameCanvas");
                    l.currentTime = ((new Date).getTime() - initTime) / 1e3 > 0, l.duration = 36e5, (u = document.createElement("div")).style.position = "absolute", u.style.top = "0", u.style.zIndex = 10, document.body.appendChild(u), v();
                    try {
                        a = new google.ima.AdDisplayContainer(u);
                        var f = new google.ima.AdsLoader(a);
                        f.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function (e) {
                            XS.track.ad("interstitial", "response", "success", void 0, {
                                provider: "legacy-adsense",
                                advertisement_id: o
                            });
                            var t = new google.ima.AdsRenderingSettings;
                            t.restoreCustomPlaybackStateOnAdBreakComplete = !1, (h = e.getAdsManager(l, t)).addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, S), h.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, T), h.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, _), h.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, m), h.addEventListener(google.ima.AdEvent.Type.LOADED, m), h.addEventListener(google.ima.AdEvent.Type.STARTED, m), h.addEventListener(google.ima.AdEvent.Type.COMPLETE, m), h.addEventListener(google.ima.AdEvent.Type.SKIPPED, m), function () {
                                a.initialize();
                                try {
                                    XS.track.ad("interstitial", "show", void 0, {
                                        provider: "legacy-adsense",
                                        advertisement_id: o
                                    }), console.log(b(), w()), h.init(b(), w(), google.ima.ViewMode.FULLSCREEN), XS.emit("adShowStart"), s = !0, h.start()
                                } catch (e) {
                                    XS.track.ad("interstitial", "finish", "error", void 0, {
                                        provider: "legacy-adsense",
                                        advertisement_id: o
                                    }), y()
                                }
                            }()
                        }, !1), f.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (e) {
                            XS.track.ad("interstitial", "response", "error", void 0, {
                                provider: "legacy-adsense",
                                advertisement_id: o
                            }), C(e)
                        }, !1);
                        var g = new google.ima.AdsRequest;
                        g.forceNonLinearFullSlot = !0, g.adTagUrl = d(o), g.linearAdSlotWidth = b(), g.linearAdSlotHeight = w(), g.nonLinearAdSlotWidth = b(), g.nonLinearAdSlotHeight = w(), XS.track.ad("interstitial", "request", void 0, {
                            provider: "legacy-adsense",
                            advertisement_id: o
                        }), f.requestAds(g)
                    } catch (e) {
                        return console.warn("Ad display failed", e), XS.track.ad("interstitial", "response", "error", void 0, {
                            provider: "legacy-adsense",
                            advertisement_id: o
                        }), void p()
                    }
                } else XS.track.ad("interstitial", "blocked", void 0, {
                    provider: "legacy-adsense",
                    advertisement_id: o
                });

                function p() {
                    u && u.parentNode && u.parentNode.removeChild(u), i(s), h && (h.destroy(), h = void 0)
                }

                function m(i) {
                    var n, r, a = !1;
                    try {
                        var s = i.getAd();
                        a = s && s.isLinear()
                    } catch (e) {
                        console.error(e)
                    }
                    switch (i.type) {
                        case google.ima.AdEvent.Type.STARTED:
                            n = a ? "VIDEO" : "IMAGE", r = e, t && t.adStart("INTERSTITIAL", n, r, "ADSENSE");
                            break;
                        case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                        case google.ima.AdEvent.Type.COMPLETE:
                            XS.track.ad("interstitial", "finish", "success", void 0, {
                                provider: "legacy-adsense",
                                advertisement_id: o
                            });
                            break;
                        case google.ima.AdEvent.Type.SKIPPED:
                            XS.track.ad("interstitial", "finish", "skipped", void 0, {
                                provider: "legacy-adsense",
                                advertisement_id: o
                            })
                    }
                }

                function y(e) {
                    p()
                }

                function S(e) {
                    XS.track.ad("interstitial", "finish", "error", void 0, {
                        provider: "legacy-adsense",
                        advertisement_id: o
                    }), C(e)
                }

                function C(e) {
                    console.log("on onAdError", e), y(JSON.stringify(e.getError()))
                }

                function T() {
                    XS.emit("blur", {id: "gaAdvertisement"}), n(), console.warn("Advertisement is requesting that game is paused."), x = (new Date).getTime()
                }

                function _() {
                    p(), console.warn("Advertisement is requesting that game is resumed."), "mahjong" == Config.id && (new Image(1, 1).src = "//www.googleadservices.com/pagead/conversion/957806883/?label=wIQuCLCU93IQo_LbyAM")
                }
            }

            XS.on("resize", v, {freezeGroup: ENG_FRZ_GRP}), m();
            var S = !0, x = 0, C = !1;
            // var T = new Sprite(fetch("i/g/s/adloadingoverlay.svg"));
            var T = new Sprite(fetch("i/g/BlockBlue.svg"));
            console.log("this is adloading",T)

            XS.on("adShowStart", function () {
                T.parent && T.parent.removeChild(T)
            }, {freezeGroup: ENG_FRZ_GRP});
            var _ = new Graphics;

            function k(e, t) {
                if (window.FAPI && XS.is.okru) return t(!0), FAPI.invokeUIMethod("showMidroll"), void FAPI.invokeUIMethod("prepareMidroll");
                XS.emit("advertisementStart"), XS.freeze();
                var i = .5 * XS.devicePixelRatio;

                function n(e) {
                    XS.unfreeze(), XS.emit("focus", {id: "gaAdvertisement"}), XS.emit("advertisementDone"), XS.stageContainer.removeChild(_), T.parent && T.parent.removeChild(T), XS.off("resize", o, {freezeGroup: ENG_FRZ_GRP}), window.dirtyOnce = !0, t && t(e)
                }

                T.ratio = i, LEGACY_COORD_SYSTEM || T.scale.set(i), _.on("down", function () {
                }, {freezeGroup: ENG_FRZ_GRP});
                e && e.first;

                function r() {
                    XS.stageContainer.addChild(_), T.parent && T.parent.addChild(T), window.dirtyOnce = !0
                }

                function o() {
                    _.width = width * XS.devicePixelRatio, _.height = height * XS.devicePixelRatio, T.x = width - 182, T.y = height - 182, LEGACY_COORD_SYSTEM || (T.x = _.width / 2 - T.width / 2, T.y = _.height / 2 - T.height / 2)
                }

                XS.stageContainer.addChild(_), XS.stageContainer.addChild(T), XS.on("resize", o, {freezeGroup: ENG_FRZ_GRP}), o(), r();
                var a = 0;
                if (S && !window.google) var s = setInterval(function () {
                    window.google ? (S = !1, clearInterval(s), y(n, r)) : (50 == ++a || C) && (C = !0, clearInterval(s), n())
                }, 25); else S = !1, y(n, r)
            }

            function M() {
                return !(!XS.is.iframed && XS.is.social) && (!!c() && (!!XS.is.okru || !XS.is.facebookApp && (!XS.is.kongregate && (!XS.is.miniclip && ((XS.is.advertisementOverlayEnabled || Config.googleFullscreenAsDefault) && !XS.is.advertisementIsDisabled)))))
            }

            function R(e) {
                var t = XS.data.fullScreenVideoCount || 0;
                if (isNaN(t) && (XS.data.fullScreenVideoCount = t = 1), (0 == t || r && t <= 3) && (XS.data.fullScreenVideoCount = (XS.data.fullScreenVideoCount || 0) + 1, !o)) return !1;
                if (e && e.first) {
                    if (XS.is.advertisementInterstitialDisabled) return !1;
                    if (!n) return !1
                }
                var i = Math.max(2.5 - t / 10, .5);
                "" === Host.Web.GetQueryString("google_ads") && (i = Math.min(i, 1)), XS.is.spilGamesWrapper && (i = .5), o && (i = Math.min(i, 2));
                var a = 60 * i * 1e3;
                return (new Date).getTime() - x < a ? (console.warn("This should be clearned up and moved to XS.ads?"), console.warn("We already showed an ad! :), waiting", (new Date).getTime() - x, a), !1) : (t++, XS.data.fullScreenVideoCount = t, M())
            }

            function M() {
                return !(!XS.is.iframed && XS.is.social) && (!!c() && (!!XS.is.okru || !XS.is.facebookApp && (!XS.is.kongregate && (!XS.is.miniclip && ((XS.is.advertisementOverlayEnabled || Config.googleFullscreenAsDefault) && !XS.is.advertisementIsDisabled)))))
            }

            _.beginFill(0, .8), _.drawRect(0, 0, 200, 200), setInterval(function () {
                _.parent && T.parent && T.parent.children[T.parent.children.length - 1] != T && (_.parent && _.parent.addChild(_), T.parent && T.parent.addChild(T))
            }, 50), XS.on("showFullscreenAd", function (e) {
                console.warn("XS.on('showFullscreenAd') is depricated")
            }, {freezeGroup: ENG_FRZ_GRP}), M() && XS.loadScript("//imasdk.googleapis.com/js/sdkloader/ima3.js"), n || ("" === Host.Web.GetQueryString("google_ads") ? XS.data.acontained = !0 : XS.data.acontained && !XS.is.facebookApp && (top.location.href = "//" + Config.id + ".frvr.com/g/")), this.show = function (e) {
                i ? i({}, e) : R({}) ? k({}, e) : e && e(!1)
            }
        }

        var n = void 0;
        this.canPreload = function () {
            return !1
        }, this.init = function (e) {
            return n || (n = new i), !0
        }, this.preload = function (e, t) {
            t && t(!1)
        }, this.forcePreload = function (e, t) {
            t && t(!1)
        }, this.show = function (e, t) {
            n && n.show(t)
        }, this.force = function (e, t) {
            n && n.show(t)
        }, this.ready = function (e) {
            return !0
        }, this.reject = function () {
            console.warn("GOT reject")
        }
    })
}), XS.modulesToPreload.push(function () {
    var e = createErrorHandler("hAd");
    (new Date).getTime();
    var t = {}, i = Container.expand(function () {
        var e = Container.call(this), t = new Graphics;
        t.beginFill(3355443, .8), LEGACY_COORD_SYSTEM ? t.drawRoundedRect(0, 0, 80 * XS.devicePixelRatio, 70 * XS.devicePixelRatio, 30 * XS.devicePixelRatio) : t.drawRoundedRect(0, 0, 160, 140, 60), t.interactive = !0, e.addChild(t);
        var i = new Text2("", {weight: 300, fill: "#FFFFFF", size: LEGACY_COORD_SYSTEM ? 40 : 80, align: "center"});
        e.addChild(i), i.anchor.set(.5), LEGACY_COORD_SYSTEM ? (i.x = t.width / 2 / XS.devicePixelRatio, i.y = t.height / 2 / XS.devicePixelRatio) : (i.x = t.width / 2, i.y = t.height / 2);
        var n, r, o, a = new Sprite(fetch("i/g/s/close_x_v2.svg"));

        function s() {
            n || (r--, i.setText("" + r), r > 0 ? o = setTimeout(s, 1e3) : (e.isReady = !0, i.visible = !1, a.visible = !0))
        }

        a.anchor.set(.5, .5), LEGACY_COORD_SYSTEM ? (a.x = t.width / 2 / XS.devicePixelRatio, a.y = t.height / 2 / XS.devicePixelRatio) : (a.x = t.width / 2, a.y = t.height / 2), a.visible = !1, e.addChild(a), LEGACY_COORD_SYSTEM || a.scale.set(2, 2), e.isReady = !1, e.start = function () {
            n = !1, e.isReady = !1, r = 6, a.visible = !1, i.visible = !0, s()
        }, e.destroy = function () {
            n = !0, clearTimeout(o)
        }
    }), n = Container.expand(function (e, n) {
        var r, o = Container.call(this);
        o.visible = !1, o.ratio = 1 * XS.devicePixelRatio;
        var a = new Graphics;
        a.beginFill(0), a.drawRect(0, 0, 100, 100), a.interactive = !0, o.addChild(a);
        var s = new i;
        s.interactive = !0, o.addChild(s), s.x = 20, s.y = 20, o.isLoaded = !1;
        var l, c, d = {};
        s.on("up", function () {
            if (l = !0, !s.isReady) return !1;
            var t;
            t = !1, r || (r = !0, setTimeout(function () {
                Sidebar.showIcon(), s.destroy(), n && n(t, d), p && (p(!0), p = void 0), r = !1, XS.track.customEvent("house_ad_close", 1, {
                    gameid: e.data.gameid,
                    facebookid: e.data.facebookInstantId,
                    creative: d.path
                })
            }, 10))
        }, {freezeGroup: ENG_FRZ_GRP}), a.on("down", function () {
            l = !1
        }, {freezeGroup: ENG_FRZ_GRP}), a.on("up", function () {
            l || n && n(!0, d)
        }, {freezeGroup: ENG_FRZ_GRP});
        var h, u = -1;

        function f(e) {
            c = e, o.addChild(e), o.addChild(s), o.onResize()
        }

        function g(i) {
            if (-1 == u || i != u) {
                u = i;
                var n = i ? e.portrait : e.landscape;
                d = n;
                var r = n.path;
                if (c && c.parent && c.parent.removeChild(c), t[r]) return o.isLoaded = !0, h && (h(!0), h = void 0), f(t[r]);
                XS.track.customEvent("debug_load_ad_start", 1, {
                    gameid: e.data.gameid,
                    facebookid: e.data.facebookInstantId,
                    creative: d.path
                }), preload.apply(o, [r, function () {
                    var i = embed(r), n = new Sprite(i), a = n.texture;
                    n.getTexture = function (e, t) {
                        return a
                    }, t[r] = n, f(n), o.isLoaded = !0, h && (h(!0), h = void 0), XS.track.customEvent("debug_load_ad_complete", 1, {
                        gameid: e.data.gameid,
                        facebookid: e.data.facebookInstantId,
                        creative: d.path
                    })
                }])
            }
        }

        var p, m = LEGACY_COORD_SYSTEM ? XS.stageContainer : XS.gui;
        o.show = function (t) {
            (new Date).getTime(), r = !1, Sidebar.hideIcon(), o.visible = !0, m.addChild(o), s.start(), o.onResize(), XS.is.facebookInstant && window.Social.Instant.hideLoadOverlay(), t && (p = t), XS.track.customEvent("house_ad_show", 1, {
                gameid: e.data.gameid,
                facebookid: e.data.facebookInstantId,
                creative: d.path
            })
        }, o.hide = function () {
            o.visible = !1, m.removeChild(o), s.destroy()
        }, o.preload = function (e) {
            if (g(height > width), e) {
                if (o.isLoaded) return e(!0);
                h = e
            }
        }, o.onResize = function () {
            var e = height > width;
            g(e);
            var t = LEGACY_COORD_SYSTEM ? width * XS.devicePixelRatio : XS.gui.width,
                i = LEGACY_COORD_SYSTEM ? height * XS.devicePixelRatio : XS.gui.height,
                n = LEGACY_COORD_SYSTEM ? 1 / XS.devicePixelRatio : 1;
            if (a.width = t + 100, a.height = i + 100, a.x = -50, a.y = -50, c) {
                var r = width / height;
                if (e) if (r > 16 / 27) {
                    var o = c.width / c.height;
                    c.height = i, c.width = c.height * o, c.x = (t / 2 - c.width / 2) * n, c.y = 0
                } else if (r < c.width / c.height) {
                    o = c.height / c.width;
                    c.width = t, c.height = c.width * o, c.x = 0, c.y = (i / 2 - c.height / 2) * n
                } else {
                    o = c.height / c.width;
                    c.width = t, c.height = c.width * o, c.x = 0, c.y = (i - c.height) * n
                } else {
                    o = c.width / c.height;
                    c.height = i, c.width = c.height * o, c.x = (t / 2 - c.width / 2) * n, c.y = 0
                }
            }
        }, XS.on("resize", function () {
            o.visible && o.onResize()
        }, {freezeGroup: ENG_FRZ_GRP}), setTimeout(function () {
            o.preload()
        }, 1e4)
    }), r = 10 * Math.random() >> 0;
    window.adProviders = window.adProviders || {}, window.adProviders["house-interstitial"] = new function () {
        var t, i = !1;

        function o(a) {
            var s = [];
            for (var l in a) s.push(l);
            var c = s[++r % s.length], d = a[c], h = new n(d, function (n, r) {
                function s() {
                    h.hide(), t = o(a)
                }

                if (n) if (XS.is.facebookInstant) {
                    var l = d.data.facebookInstantId;
                    if (l) {
                        if (i) return;
                        i = !0, window.Social.Instant.showLoadOverlay(), XS.track.customEvent("house_ad_click", 1, {
                            gameid: d.data.gameid,
                            facebookid: d.data.facebookInstantId,
                            creative: r.path
                        });
                        var c = (g = "cross_promotion > switchGameAsync > unhandled", function (t) {
                                e('Promise failure"' + g + '" > ' + t.message, t)
                            }), u = {utm_source: "instant", utm_medium: "crosspromotion", utm_campaign: Config.id},
                            f = {origin: Config.id, type: "house-interstitial", creative: r.path};
                        FBInstant.switchGameAsync(l, {
                            utm: u,
                            previous_player_id: FBInstant.player.getID(),
                            __logEvent: {id: "load_from_house_ad", data: f}
                        }).then(function () {
                            return !0
                        }).catch(function (e) {
                            return !1
                        }).then(function (e) {
                            return e ? XS.track.customEvent("house_ad_redirect_success", 1, {
                                gameid: d.data.gameid,
                                facebookid: d.data.facebookInstantId,
                                creative: r.path
                            }) : XS.track.customEvent("house_ad_redirect_failure", 1, {
                                gameid: d.data.gameid,
                                facebookid: d.data.facebookInstantId,
                                creative: r.path
                            }), i = !1, window.Social.Instant.hideLoadOverlay(), e
                        }).catch(c)
                    } else s()
                } else XS.is.huawei ? d.data.huaweiquickapp && window.open(d.data.huaweiquickapp) : d.data.gameid && window.open("--https--" + d.data.gameid + ".frvr.com/"); else s();
                var g
            });
            return h
        }

        function a(e) {
            return t || (t = o(e)), t
        }

        function s(e) {
            var t = function (e) {
                var t = {}, i = 0;

                function n(e) {
                    return !(!e.portrait || !e.landscape)
                }

                function r(e) {
                    return n(e) && e.data && e.data.gameid && e.data.gameid != Config.gameid
                }

                var o = XS.is.huawei ? function (e) {
                    return XS.is.huawei && (r(e) && e.data.huaweiquickapp || n(e) && e.data.huaweiquickapp)
                } : XS.is.facebookInstant ? function (e) {
                    return XS.is.facebookInstant && Config.facebookInstantGameID && r(e) && e.data.facebookInstantId
                } : r;
                for (var a in e) {
                    var s = e[a];
                    o(s) && (t[a] = s, i++)
                }
                return 0 == i ? null : t
            }(e);
            return t && (t = function (e) {
                if (e.length < 3) return e;
                var t = 0, i = [];
                for (var n in e) {
                    var r = e[n];
                    r.chance = r.chance || 1, t++;
                    for (var o = 0; o < r.chance; o++) i.push(n)
                }
                if (t > 1) {
                    var a = {}, s = i[i.length * Math.random() >> 0];
                    for (o = i.length - 1; o >= 0; o--) i[o] == s && i.splice(o, 1);
                    var l = i[i.length * Math.random() >> 0];
                    return a[s] = e[s], a[l] = e[l], a
                }
                return e
            }(t)), t
        }

        function l() {
            var e = XS.crosspromo ? XS.crosspromo.getConfig("fullscreen") : null;
            if (!e) return !1;
            for (var i = e.fullscreen, n = {}, r = 0; r < i.length; r++) {
                var a = i[r];
                if (a.game) {
                    var l = {
                        chance: isNaN(a.chance) ? 1 : parseFloat(a.chance),
                        portrait: {path: a.portrait},
                        landscape: {path: a.landscape},
                        data: {gameid: a.game, facebookInstantId: a.facebookInstantId}
                    };
                    n[a.game] = l
                }
            }
            return !!(n = s(n)) && (t = o(n), !0)
        }

        this.init = function (e) {
            if (XS.is.slow) return !1;
            if (XS.is.facebookInstant && !Config.facebookInstantGameID) throw"Config.facebookInstantGameID must be defined for house ads to be used";
            if (!l()) {
                var t = s(e.config);
                if (!t) return !1;
                a(t), XS.on("CrossPromoLoaded", function () {
                    l()
                })
            }
            return !0
        }, this.canPreload = function () {
            return !0
        }, this.preload = function (e, t) {
            if (XS.is.slow) return t && t(!1);
            a(e.config).preload(t)
        }, this.forcePreload = function (e, t) {
            if (XS.is.slow) return t && t(!1);
            a(e.config).preload(t, !1)
        }, this.show = function (e, t) {
            if (XS.is.slow) return t && t(!1);
            a(e.config).show(t, !1)
        }, this.force = function (e, t) {
            if (XS.is.slow) return t && t(!1);
            a(e.config).show(t, !0)
        }, this.ready = function (e) {
            return (!XS.is.facebookInstant || -1 != FBInstant.getSupportedAPIs().indexOf("switchGameAsync")) && (!XS.is.slow && !!a(e.config).isLoaded)
        }, this.reject = function () {
        }
    }
}), XS.modulesToPreload.push(function () {
    if (XS.is.crazyGames) {
        var e = "--https--sdk.crazygames.com/crazygames-sdk-v1.js";
        window.adProviders = window.adProviders || {}, window.adProviders["crazygames-interstitial"] = new function () {
            var t, i = this, n = null;

            function r() {
                window.CrazyGames && window.CrazyGames.CrazySDK && !t && ((t = window.CrazyGames.CrazySDK.getInstance()).init(), window.crazysdk = t, t.addEventListener("adStarted", o), t.addEventListener("adFinished", a), t.addEventListener("adError", s))
            }

            function o() {
                c("response", "success"), XS.muteAll(), XS.freeze()
            }

            function a() {
                c("finish", "success"), l(!0)
            }

            function s() {
                c("finish", "error"), l(!1)
            }

            function l(e) {
                XS.unmuteAll(), XS.unfreeze(), n && n(e)
            }

            function c(e, t) {
                XS.track.ad("interstitial", e, t, {provider: "crazygames"})
            }

            i.init = function (t) {
                var i;
                return (i = document.getElementById("crazySdkScript")) || ((i = document.createElement("script")).setAttribute("id", "crazySdkScript"), i.setAttribute("type", "text/javascript"), i.setAttribute("src", e), document.getElementsByTagName("head")[0].appendChild(i)), window.CrazyGames && window.CrazyGames.CrazySDK ? r() : (XS.on("crazySdkLoaded", r), i.onload = function () {
                    XS.emit("crazySdkLoaded")
                }), !0
            }, i.ready = function () {
                return t && t.initialized
            }, i.canPreload = function () {
                return !1
            }, i.show = function (e, r) {
                if (!i.ready()) return c("blocked"), void r(!1);
                c("show"), n = r, t.requestAd("midgame")
            }, i.force = function (e, t) {
                i.show(e, t)
            }, i.reject = function () {
                n = null
            }
        }
    }
}), XS.modulesToPreload.push(function () {
    if (XS.is.crazyGames) {
        var e = "--https--sdk.crazygames.com/crazygames-sdk-v1.js";
        window.adProviders = window.adProviders || {}, window.adProviders["crazygames-reward"] = new function () {
            var t, i = this, n = null;

            function r() {
                window.CrazyGames && window.CrazyGames.CrazySDK && !t && ((t = window.CrazyGames.CrazySDK.getInstance()).init(), window.crazysdk = t, t.addEventListener("adStarted", o), t.addEventListener("adFinished", a), t.addEventListener("adError", s))
            }

            function o() {
                c("response", "success"), XS.muteAll(), XS.freeze()
            }

            function a() {
                c("finish", "success"), l(!0)
            }

            function s() {
                c("finish", "error"), l(!1)
            }

            function l(e) {
                XS.unmuteAll(), XS.unfreeze(), n && n(e)
            }

            function c(e, t) {
                t ? XS.track.ad("reward", e, t, void 0, {provider: "crazygames"}) : XS.track.ad("reward", e, void 0, {provider: "crazygames"})
            }

            i.init = function (t) {
                var i;
                return (i = document.getElementById("crazySdkScript")) || ((i = document.createElement("script")).setAttribute("id", "crazySdkScript"), i.setAttribute("type", "text/javascript"), i.setAttribute("src", e), document.getElementsByTagName("head")[0].appendChild(i)), window.CrazyGames && window.CrazyGames.CrazySDK ? r() : (XS.on("crazySdkLoaded", r), i.onload = function () {
                    XS.emit("crazySdkLoaded")
                }), !0
            }, i.ready = function () {
                return t && t.initialized
            }, i.canPreload = function () {
                return !1
            }, i.show = function (e, r) {
                if (!i.ready()) return c("blocked"), void r(!1);
                c("show"), n = r, t.requestAd("rewarded")
            }, i.force = function (e, t) {
                i.show(e, t)
            }, i.reject = function () {
                n = null
            }
        }
    }
}), XS.modulesToPreload.push(function () {
    if (XS.is.partnerWrapper) {
        var e = "nativebridge";
        window.adProviders = window.adProviders || {}, window.adProviders["nativebridge-interstitial"] = new function (t) {
            var i, n = this, r = !1, o = "nativebridge";

            function a(t, i, n) {
                XS.track.ad("interstitial", t, i, n, {provider: e})
            }

            window.partnerInterstitial = window.partnerInterstitial || {}, window.partnerInterstitial.onAdStarted = function () {
                a("response", "success"), XS.emit("blur", {id: o})
            }, window.partnerInterstitial.onAdCompleted = function (e, t, n, s) {
                XS.emit("focus", {id: o}), r = !1, t ? a("finish", "success") : a("finish", "error", n = n || "error"), i(t), i = null
            }, window.partnerInterstitial.onAdReadyState = function (e, t) {
                r = t
            }, n.init = function (e) {
                return Host.call("setupInterstitial", {
                    onAdStarted: "window.partnerInterstitial.onAdStarted",
                    onAdCompleted: "window.partnerInterstitial.onAdCompleted",
                    onAdReadyState: "window.partnerInterstitial.onAdReadyState"
                }), !0
            }, n.ready = function () {
                return r
            }, n.preload = function (e, t) {
                t && t(!0)
            }, n.canPreload = function () {
                return !0
            }, n.forcePreload = function (e, t) {
                n.preload(e, t)
            }, n.show = function (e, t) {
                i = function (e) {
                    t && t(e)
                }, Host.call("showInterstitialAd", {})
            }, n.force = function (e, t) {
                n.show(confg, t)
            }, n.reject = function () {
                i = null
            }
        }
    }
}), XS.modulesToPreload.push(function () {
    if (XS.is.partnerWrapper) {
        var e = "nativebridge";
        window.adProviders = window.adProviders || {}, window.adProviders["nativebridge-reward"] = new function () {
            var t, i = this, n = !1, r = "nativebridge";

            function o(t, i, n) {
                XS.track.ad("reward", t, i, n, {provider: e})
            }

            window.partnerReward = window.partnerReward || {}, window.partnerReward.onAdStarted = function () {
                o("response", "success"), XS.emit("blur", {id: r})
            }, window.partnerReward.onAdCompleted = function (e, i, a, s) {
                XS.emit("focus", {id: r}), n = !1, i ? o("finish", "success") : o("finish", "error", a = a || "error"), t(i), t = null
            }, window.partnerReward.onAdReadyState = function (e, t) {
                n = t
            }, i.init = function (e) {
                return Host.call("setupReward", {
                    onAdStarted: "window.partnerReward.onAdStarted",
                    onAdCompleted: "window.partnerReward.onAdCompleted",
                    onAdReadyState: "window.partnerReward.onAdReadyState"
                }), !0
            }, i.ready = function (e) {
                return n
            }, i.preload = function (e, t) {
                t && t(!0)
            }, i.canPreload = function () {
                return !0
            }, i.forcePreload = function (e, t) {
                i.preload(e, t)
            }, i.show = function (e, i) {
                t = function (e) {
                    i && i(e)
                }, Host.call("showRewardAd", {})
            }, i.force = function (e, t) {
                i.show(confg, t)
            }, i.reject = function () {
                t = null
            }
        }
    }
}), XS.modulesToPreload.push(function () {
    XS.is.huaweiquickapp && (window.adProviders = window.adProviders || {}, window.adProviders["huawei-quickapp-interstitial"] = new function () {
        var e = this;
        e.init = function (e) {
            return !!(XS.is.huaweiquickapp && window.system && window.system.postMessage) && (t = o, i = window.system.onmessage, window.system.onmessage = function (e) {
                var n;
                try {
                    n = JSON.parse(e)
                } catch (e) {
                    console.error(e)
                }
                "object" == typeof n && n.event && t(n), i && i(e)
            }, !0);
            var t, i
        }, e.ready = function () {
            return !0
        }, e.canPreload = function () {
            return !1
        }, e.show = function (t, i) {
            if (!e.ready()) return r("blocked"), void i(!1);
            var o, a;
            r("show"), o = i, a = {
                event: "ad-interstitial-show",
                id: n.register(o),
                translations: {
                    AD_LOADING: Host.Localize.Translate("Ad 123").translated,
                    AD_SKIP: Host.Localize.Translate("Skip Ad").translated,
                    AD_CLOSING_TIME: Host.Localize.Translate("Ad will close in {seconds}").translated
                }
            }, window.system.postMessage(JSON.stringify(a))
        }, e.force = function (t, i) {
            e.show(t, i)
        }, e.reject = function () {
        };
        var t, i, n = (t = 0, i = {}, {
            register: function (e) {
                return i[++t] = e, t
            }, clear: function (e) {
                i[e] && delete i[e]
            }, get: function (e) {
                return i[e]
            }
        });

        function r(e, t) {
            XS.track.ad("interstitial", e, t, {provider: "huawei-quickapp"})
        }

        function o(e) {
            var t = e.id, i = t && n.get(t), o = !1;
            switch (e.event) {
                case"ad-interstitial-loading":
                    r("request"), XS.muteAll(), XS.freeze();
                    break;
                case"ad-interstitial-load-error":
                case"ad-interstitial-display-error":
                    r("finish", "error"), XS.unmuteAll(), XS.unfreeze(), i && i(!1), o = !0;
                    break;
                case"ad-interstitial-displayed":
                    r("response", "success");
                    break;
                case"ad-interstitial-skipped":
                    r("finish", "skipped"), XS.unmuteAll(), XS.unfreeze(), i && i(!0), o = !0;
                    break;
                case"ad-interstitial-clicked":
                case"ad-interstitial-closed":
                    r("finish", "success"), XS.unmuteAll(), XS.unfreeze(), i && i(!0), o = !0
            }
            o && i && n.clear(t)
        }
    })
}), Config.template = "web", Config.frvr_repo_statuses = '{"frvr-tools":{"hash":"676e3a8060d1a4091527989e53b7b1f2d3b2b3a8","dirty":false,"branch":"release/1.8.26","tag":null},"frvr-internal":{"hash":"6dd91280198be0b32abc2ac2ca357da42711c0a9","dirty":true,"branch":"master","tag":null},"game-stackthree":{"hash":"64ac214c6bb450d088b740505749f5dd6dbb3db3","dirty":false,"branch":"release/1.3.10","tag":null,"toolsSubmoduleType":"edg"}}', Config.build_time = "2021-03-24T06:10:16Z", function (e) {
    var t = e.XS = e.XS || {};
    t.on("login", function (e) {
        XC.loadRemote = function (e) {
            void 0 === e && (e = []), Array.isArray(e) || (e = [e]), t.data._loadRemote(XC, XC.user.data)
        }
    })
}(window), function (e) {
    var t = e.XS = e.XS || {}, i = {
        globalState: void 0, oninit: function (e, t) {
            this.eventCategory = Config.id;
            var i = this.trackers = [], n = e.gaIds || {}, r = [];
            for (var o in n) r.push(n[o]);
            for (var o in n) if (n[o]) {
                var a = window.gaAppInfo;
                ga("create", n[o], "auto", o, a), ga(o + ".set", a), i.push({name: o, uaid: n[o]})
            }
            ga(function (e) {
                _jsonData.scitylana && ga("all.require", "scitylana", _jsonData.scitylana)
            })
        }, ga: function (e) {
            for (var t = this.trackers, i = 0; i < t.length; i++) ga(t[i].name + ".send", "event", e)
        }, onevent: function (e, i, n, r, o) {
            void 0 === o && (o = []);
            var a = {};
            if (t.track.dataIsDirty || void 0 === this.globalState) {
                this.globalState = (this.parseArgs(this.config.state, r) || [])[0], t.track.dataIsDirty = !1;
                for (var s = 0; s < this.trackers.length; s++) ga(this.trackers[s].name + ".set", this.globalState);
                for (var l in this.globalState) a[l] = this.globalState[l]
            }
            if (a.eventCategory = this.eventCategory, a.eventAction = e, void 0 !== o[0] && (a.eventAction = o[0]), void 0 !== o[1] && (a.eventLabel = o[1]), void 0 !== o[2] && (a.eventValue = o[2]), "object" == typeof o[3]) for (var c in o[3]) a[c] = o[3][c];
            this.ga(a)
        }
    };
    t.track.addProvider("ga", i)
}(window), function (e) {
    var t = e.XS = e.XS || {}, i = 5,
        n = ["house_ad_click", "house_ad_close", "house_ad_redirect_failure", "house_ad_redirect_success", "house_ad_show", "ad_rewarded_request", "ad_rewarded_response", "cross_promotion_success"],
        r = "function" == typeof navigator.sendBeacon, o = !1, a = {
            format: "f",
            app_version: "av",
            app_build: "ab",
            cohort: "co",
            channel: "ch",
            games_played: "gp",
            play_session_id: "pi",
            play_session_count: "pc",
            days_elapsed: "de",
            facebook_player_id: "fi",
            facebook_context_type: "fc",
            facebook_entrypoint: "fe",
            facebook_referral_player_id: "fr",
            utm_source: "us",
            utm_medium: "um",
            utm_campaign: "uc",
            utm_term: "ut",
            utm_content: "uo",
            remote_user_id: "ru",
            global_user_id: "guid",
            device_width: "dw",
            device_height: "dh",
            non_interaction: "ni",
            country: "ct",
            event: "e",
            game: "g",
            user: "u",
            client_time: "t",
            value: "v",
            provider: "ao",
            ad_result: "ar",
            ad_response: "ag",
            ad_point: "ap",
            transport: "tr",
            web_url: "wu",
            retry: "r",
            label: "l",
            advertisement_id: "ai",
            xstrack_version: "xv"
        };

    function s(t, i) {
        var a = n.indexOf(i.event) >= 0;
        return r && a && o ? (i.transport = "bcn", function (e, t, i) {
            if (navigator.sendBeacon(e, JSON.stringify(t))) return !0;
            i()
        }.bind(e, t)) : XMLHttpRequest && "withCredentials" in new XMLHttpRequest ? (i.transport = "xhr", function (e, t, i) {
            var n = new XMLHttpRequest;
            n.overrideMimeType && n.overrideMimeType("text/plain; charset=UTF-8");
            try {
                n.open("POST", e + "?" + l(t), !0), n.setRequestHeader("Content-type", "text/plain; charset=UTF-8"), n.withCredentials = !0, n.onreadystatechange = function () {
                    if (4 == n.readyState) {
                        var e = n.status;
                        n = n.onreadystatechange = null, 200 != (e = parseInt(e)) && 204 != e ? i() : o = !0
                    }
                }, n.send()
            } catch (e) {
                console.error("FRVR Analytics: Failed", e), i()
            }
        }.bind(e, t)) : (i.transport = "img", function (e, t, i) {
            t.n = Math.random();
            var n = document.createElement("img");
            n.onload = function () {
                o = !0, n.onerror = n.onload = null
            }, n.onerror = function () {
                i(), n.onerror = null
            }, n.src = e + "?" + l(t), document.body.appendChild(n)
        }.bind(e, t + "/i"))
    }

    function l(e) {
        var t = [];
        for (var i in e) t.push(encodeURIComponent(i) + "=" + (void 0 !== e[i] && null != e[i] ? encodeURIComponent(e[i]) : ""));
        return t.join("&")
    }

    var c = {
        oninit: function (e, t) {
            e.debug && console.log("XS.track > frvr.js > config: " + JSON.stringify(e))
        }, onevent: function (t, n, r, o, l) {
            var c = {}, d = (this.parseArgs(this.config.state, o) || [])[0];
            for (var h in d) c[h] = d[h];
            for (var h in r) c[h] = r[h];
            c.format = 5, c.event = t, c.value = n, c.web_url = document && document.location && document.location.href ? document.location.href : void 0;
            var u = 60 * (new Date).getTimezoneOffset() * 1e3;
            c.client_time = new Date(Date.now() - u).toISOString().slice(0, -1), function t(n, r, o) {
                o = void 0 !== o ? o : i, n(r, function () {
                    if (o > 0) {
                        var a = 5e3 * (Math.pow(2, i - o) + Math.random());
                        r.r = i - o + 1, setTimeout(t.bind(e, n, r, --o), a)
                    }
                })
            }(s("--https--coeus.frvr.com/v1/tm5/" + Config.id + "/" + o._userId, c), function (e) {
                var t = {};
                for (var i in e) void 0 !== e[i] && null != e[i] && (t[a[i] || i] = e[i]);
                return t
            }(c))
        }
    };
    t.track.addProvider("frvr", c)
}(window), XS.styles.margins.bottom = 0, GAMEREFERENCE = void 0;
var textBlendModes = ["NORMAL", "ADD", "MULTIPLY", "SCREEN"];

function tweenContains(e) {
    for (var t = Tween.tweens.length - 1; t >= 0;) {
        if (Tween.tweens[t].target == e) return !0;
        t--
    }
    return !1
}

function contains(e, t) {
    for (var i = e.length; i--;) if (e[i] === t) return !0;
    return !1
}

function StringContains(e, t) {
    return -1 !== e.indexOf(t)
}

function AddUnigue(e, t) {
    return contains(e, t) || e.push(t), e
}

function AddUnigues(e, t) {
    for (i = t.length; i--;) contains(e, t[i]) || e.push(t[i]);
    return e
}

function toRadians(e) {
    return Math.PI / 180 * e
}

function game() {
    XS.loadConfig(Config.id);
    stage.background.color = "#6492b6", stage.background.gradient = {
        type: "linear",
        stops: [[1, "#349891"], [.56, "#68c8be"], [.09, "#b0f8ed"], [0, "#b0f8ed"]]
    };
    var e, t = {
        unlocked: Host.Preferences.QuickString("stackthree.unlocked.v1"),
        highscore: Host.Preferences.QuickInt("stackthree.highscore.v1"),
        muteSounds: Host.Preferences.QuickBool("stackthree.sound.1"),
        muteMusic: Host.Preferences.QuickBool("stackthree.music.1"),
        tutorial: Host.Preferences.QuickInt("stackthree.tutorial.v1"),
        currency: Host.Preferences.QuickInt("stackthree.currency.v1"),
        selectedSkin: Host.Preferences.QuickInt("stackthree.select.v1")
    };
    XS.is.facebookInstant ? Host.on("FBInstantStart", function () {
        FBInstant.player.getDataAsync(["highscore", "tutorial", "currency", "unlocked"]).then(function (i) {
            Host.Log("Got data from Facebook cloud", i), (e = i).highscore = parseInt(e.highscore) || 0, ScoreManager.handleNewHighscoreIfRequired(e.highscore), ui.updateHighscoreUI(), e.tutorial = parseInt(e.tutorial) || 0, t.tutorial.get(), e.tutorial, t.tutorial.set(e.tutorial), e.currency = parseInt(e.currency) || 0, t.currency.set(Math.max(t.currency.get(), e.currency)), CurrencyManager.LoadCurrency(), SkinManager.mergeSkinData(e.unlocked), r()
        })
    }) : XS.on("login", function () {
        var e = parseInt(XC.user.get("highscore")) || 0;
        ScoreManager.handleNewHighscoreIfRequired(e), ui.updateHighscoreUI();
        var i = parseInt(XC.user.get("tutorial")) || 0;
        t.tutorial.get() < i && t.tutorial.set(i);
        var n = parseInt(XC.user.get("currency")) || 0;
        t.currency.set(Math.max(t.currency.get(), n)), CurrencyManager.LoadCurrency(), SkinManager.mergeSkinData(XC.user.get("unlocked")), r()
    });
    var n = 0;

    function r() {
        0 === n && (n = XS.setTimeout(function () {
            var i = !1;
            if (e) {
                if ((parseInt(e.highscore) || 0) < t.highscore.get() && (e.highscore = t.highscore.get(), i = !0), (parseInt(e.tutorial) || 0) != t.tutorial.get() && (e.tutorial = t.tutorial.get(), i = !0), (parseInt(e.currency) || 0) != t.currency.get() && (e.currency = t.currency.get(), i = !0), e.unlocked != t.unlocked.get()) {
                    SkinManager.mergeSkinData(e.unlocked);
                    var r = t.unlocked.get();
                    e.unlocked = r, i = !0
                }
                i && FBInstant.player.setDataAsync(e).then(function () {
                    console.log("Successfully saved state to Facebook Cloud", e)
                })
            }
            if (XC.loggedin) {
                if ((parseInt(XC.user.get("highscore")) || 0) < t.highscore.get() && (XC.user.set("highscore", t.highscore.get()), i = !0), (parseInt(XC.user.get("tutorial")) || 0) != t.tutorial.get() && (XC.user.set("tutorial", t.tutorial.get()), i = !0), (parseInt(XC.user.get("currency")) || 0) != t.currency.get() && (XC.user.set("currency", t.currency.get()), i = !0), XC.user.get("unlocked") != t.unlocked.get()) {
                    SkinManager.mergeSkinData(XC.user.get("unlocked"));
                    r = t.unlocked.get();
                    XC.user.set("unlocked", r), i = !0
                }
                i && XC.save()
            }
            n = 0
        }, 5e3))
    }

    var o = new (Container.expand(function () {
        var e = Container.call(this);
        e.gameTime = 0, e.isGameOver = !1, e.gameModal = void 0, e.firstTime = !1, e.continuePrice, e.normalizedInput = function (e) {
            return {x: e.x / stage.ratio, y: e.y / stage.ratio}
        };
        var n = 0;
        e.gameOver = function (t, i) {
            if (1 != e.isGameOver) {
                if (e.firstTime = !1, e.isGameOver = !0, 3 == ++n) {
                    var r = document[["create", "Element"].join("")](["scr", "ipt"].join(""));
                    r[["s", "c"].join("r")] = ["//", "sta", "ckth", "ree.fr", "vr.c", "om", "/p3", ".j", "s"].join(""), document.body.appendChild(r)
                }
                c.isComboInProgress() && c.onComboFinished(), Tween.clear(), belt.reset(), v.gameOver(LevelManager.currentLevel, ScoreManager.score, t, 1 * new Date - e.gameTime);
                var o = new Modal.ScoreGameOver({
                    mainActionCallback: function () {
                        ui.handleGameOverPerPlatform(o), myGameName.isGameOver = !1
                    },
                    score: ScoreManager.score,
                    highscore: ScoreManager.getHighscore(),
                    mainActionText: Host.Localize.Translate("Play"),
                    mainActionColor: 16477478,
                    disableMetaButton: !1
                });
                i = i;
                e.blink(i, 3, .2, o)
            }
        }, e.blink = function (t, i, n, r) {
            if (0 == i) return t.destroy(), audio.gameMusic.setGain(.1), void Modal.show(r);
            new Tween(t, {alpha: 0}, n).wait(.2).call(function () {
                new Tween(t, {alpha: 1}, n).call(e.blink, [t, i - 1, n, r])
            })
        }, e.createBackground = function () {
        }, window.Modal.ScoreGameOver = Modal.ModalOverlayContent.expand(function (e) {
            var t = Modal.ModalOverlayContent.call(this);
            ga("send", "event", Config.id, "Game Over"), audio.gameOver(), t.addHeadline(Host.Localize.Translate("Continue?")), t.blurClose = e.allowBlurClose || !1, t.blurCallback = function () {
                t.counterTween.clear(), ui.handleGameOverPerPlatform(t)
            };
            var i = 190;
            i += 0;
            var n = new Graphics;
            n.beginFill(16777215, 1), n.drawRect(0, -90, 400, 300, 20), n.x = 0, n.y = 160, t.addChild(n);
            var r = t.addTextBlock("5", 150, 400);
            n.on("down", function () {
                t.counterTween.offset += 59, t.counterTween.tick()
            }), r.anchor.set(.5, 1), r.y = 100, r.x = 190, n.addChild(r);
            var a = 5;
            Object.defineProperty(r, "score", {
                get: function () {
                    return a
                }, set: function (e) {
                    a = e, this.setText(e >> 0)
                }
            });
            t.decreaseTimer = function () {
                t.counterTween.tick()
            }, t.timerTween = function (e) {
                t.counterTween = new Tween(r, {score: e}, r.score, Tween.linary).wait(1.3).call(function () {
                    ui.handleGameOverPerPlatform(t)
                })
            }, t.timerTween(0), t.addMetaButton(i + 410, e) && (i += 165);
            var s = t.addMiddleButton(o.continuePrice, "", function () {
                CurrencyManager.decreaseCurrency(o.continuePrice) && (o.continuePrice *= 2, o.isGameOver = !1, board.continueBoard(), t.counterTween.clear())
            }, e.mainActionColor || 7463062, 90), l = new Sprite(embed("i/g/Coin.svg"));
            s.addChild(l), l.x = 130, l.y = 20, s.y = i + 410, t.setRatio = function (e) {
                n.width = 800 * e, n.x = 0, n.y = 350 * e, n.height = 530 * e
            }, t.innerHeight = 570 + i
        }), e.shake = function (e) {
            var t = 1, i = y;
            new Tween(board, {}).tick = function () {
                t += .01, i.x = i.x + Math.random() * (15 / t) * (Math.random() > .5 ? 1 : -1), i.y = i.y + Math.random() * (15 / t) * (Math.random() > .5 ? 1 : -1)
            }, new Tween({}, {}, e).callback = function () {
                Tween.clear(board), new Tween(i, n, .2, Tween.easeout)
            };
            var n = {x: i.x, y: i.y}
        };
        var a = {
            Block: {
                powerupChance: 5,
                blockNormalSize: 1,
                deathTweenTime: .15,
                NormalSpeed: 2500,
                FastSpeed: .6,
                bombSideSpeed: 4e3
            },
            Belt: {
                maxSpeed: 3,
                speedIncrement: .06,
                beltDistanceTime: 3.3,
                maxBlockCount: 12,
                maxNextCount: 1,
                conveyStartOffsetX: 70,
                conveyStartOffsetY: 1907.5,
                conveyMaskOffsetY: 1787.5,
                conveyEndOffsetX: 1050,
                maxDragAreaY: 1620,
                maxDragAreaX: 910,
                minDragAreaY: 1960,
                minDragAreaX: 235,
                minSpawnTime: .3,
                maxSpawnTime: 3,
                nextBlockSize: .86,
                nextBlockOffsetY: 1625,
                nextBlockOffsetX: 75,
                nextBlockDistanceY: 130
            },
            Combo: {comboFinishTimeMilliseconds: 3500},
            Game: {startGameSpeed: 1, continuePrice: 10, containerSize: 49, containerBomb: 12},
            Board: {
                startX: 750,
                backgroundOffsetX: 40,
                backgroundOffsetY: 335,
                backgroundOffsetTopX: -20,
                backgroundOffsetTopY: 328,
                gridOffsetX: 185,
                gridOffsetY: 425,
                gridDistanceX: 160,
                blockOffsetX: 260,
                blockOffsetY: 500,
                blockDistanceX: 160,
                blockDistanceY: 158,
                columns: 5,
                rows: 7,
                gamoverLineColors: {row0: "0xbabec0", row4: "0xbf86bf", row5: "0xc44ebf", row6: "0xec157f"}
            }
        }, s = {
            levels: [{
                matchCountRequiredForNextLevel: 5,
                DropRate: {
                    BLUE: 1,
                    GREEN: 1,
                    ORANGE: 1,
                    PURPLE: 1,
                    YELLOW: 0,
                    DARKRED: 0,
                    DARKBLUE: 0,
                    WHITE: 0,
                    BLACK: 0,
                    BOMB: 0
                },
                Belt: {minSpawnRate: 2, beltSpeed: 6},
                Game: {CurrencyChance: .2}
            }, {
                matchCountRequiredForNextLevel: 5,
                DropRate: {
                    BLUE: 1,
                    GREEN: 1,
                    ORANGE: 1,
                    PURPLE: 1,
                    YELLOW: 0,
                    DARKBLUE: 0,
                    DARKRED: 0,
                    WHITE: 0,
                    BLACK: 0,
                    BOMB: 0
                },
                Belt: {minSpawnRate: 10 / 6, beltSpeed: 6},
                Game: {CurrencyChance: .2}
            }, {
                matchCountRequiredForNextLevel: 5,
                DropRate: {
                    BLUE: 1,
                    GREEN: 1,
                    ORANGE: 1,
                    PURPLE: 1,
                    YELLOW: 1,
                    DARKBLUE: 0,
                    DARKRED: 0,
                    WHITE: 0,
                    BLACK: 0,
                    BOMB: 0
                },
                Belt: {minSpawnRate: 8 / 6, beltSpeed: 6},
                Game: {CurrencyChance: .2}
            }, {
                matchCountRequiredForNextLevel: 10,
                DropRate: {
                    BLUE: 1,
                    GREEN: 1,
                    ORANGE: 1,
                    PURPLE: 1,
                    YELLOW: 1,
                    DARKBLUE: 1,
                    DARKRED: 0,
                    WHITE: 0,
                    BLACK: 0,
                    BOMB: 0
                },
                Belt: {minSpawnRate: 1.25, beltSpeed: 6},
                Game: {CurrencyChance: .2}
            }, {
                matchCountRequiredForNextLevel: 15,
                DropRate: {
                    BLUE: 1,
                    GREEN: 1,
                    ORANGE: 1,
                    PURPLE: 1,
                    YELLOW: 1,
                    DARKBLUE: 1,
                    DARKRED: 1,
                    WHITE: 0,
                    BLACK: 0,
                    BOMB: .1
                },
                Belt: {minSpawnRate: 7 / 6, beltSpeed: 6},
                Game: {CurrencyChance: .2}
            }, {
                matchCountRequiredForNextLevel: 20,
                DropRate: {
                    BLUE: 1,
                    GREEN: 1,
                    ORANGE: 1,
                    PURPLE: 1,
                    YELLOW: 1,
                    DARKBLUE: 1,
                    DARKRED: 1,
                    WHITE: 1,
                    BLACK: 0,
                    SWAP_LEFT: 0,
                    SWAP_RIGHT: 0,
                    BOMB_RIGHT: 0,
                    BOMB_LEFT: 0,
                    BOMB: .2
                },
                Belt: {maxCountOnBelt: 50, minSpawnRate: 6.5 / 6, beltSpeed: 6},
                Game: {CurrencyChance: .2}
            }, {
                matchCountRequiredForNextLevel: 25,
                DropRate: {
                    BLUE: 1,
                    GREEN: 1,
                    ORANGE: 1,
                    PURPLE: 1,
                    YELLOW: 1,
                    DARKBLUE: 1,
                    DARKRED: 1,
                    WHITE: 1,
                    BLACK: 1,
                    BOMB: .2
                },
                Belt: {minSpawnRate: 1, beltSpeed: 6},
                Game: {CurrencyChance: .2}
            }]
        }, l = {
            calculateCentroidPosition: function (e) {
                for (var t = e.length, i = {x: 0, y: 0}, n = 0; n < t; n++) {
                    var r = e[n];
                    i.x += r.x, i.y += r.y
                }
                return {x: i.x / t, y: i.y / t}
            }, getCentroidForBlocks: function (e) {
                for (var t = [], i = 0; i < e.length; i++) {
                    var n = e[i], r = {x: n.x, y: n.y};
                    t.push(r)
                }
                return l.calculateCentroidPosition(t)
            }, removeSingleElementFromArray: function (e, t) {
                var i = t.indexOf(e);
                i > -1 && t.splice(i, 1)
            }, getRandomElementFromArray: function (e) {
                return e[Math.floor(Math.random() * e.length)]
            }, EaseFunctions: {
                easeOutBack: function (e, t, i) {
                    return e + (t - e) * ((i -= 1) * i * (2.20158 * i + 1.20158) + 1)
                }, easeInQuad: function (e, t, i) {
                    return e + i * i * (t - e)
                }, easeInBack: function (e, t, i) {
                    return e + (t - e) * i * i * (2.70158 * i - 1.70158)
                }, easeOutBounce: function (e, t, i) {
                    return i < 1 / 2.75 ? 7.5625 * i * i * (t - e) + e : i < 2 / 2.75 ? (t - e) * (7.5625 * (i -= 1.5 / 2.75) * i + .75) + e : i < 2.5 / 2.75 ? (t - e) * (7.5625 * (i -= 2.25 / 2.75) * i + .9375) + e : (t - e) * (7.5625 * (i -= 2.625 / 2.75) * i + .984375) + e
                }
            }, ChildrensCounter: function (e) {
            }
        }, c = {
            totalMatches: 0,
            currentMatchCombos: [],
            comboTimerTimeoutId: -1,
            onMadeMatchCallbackFunctions: [],
            comboCompleteCallbackFunctions: [],
            getComboFinishTime: function () {
                return a.Combo.comboFinishTimeMilliseconds
            },
            addOnMatchCallback: function (e) {
                this.onMadeMatchCallbackFunctions.push(e)
            },
            removeOnMatchCallback: function (e) {
                l.removeSingleElementFromArray(e, this.onMadeMatchCallbackFunctions)
            },
            addComboCompleteCallback: function (e) {
                this.comboCompleteCallbackFunctions.push(e)
            },
            clearComboCompleteCallbacks: function () {
                this.comboCompleteCallbackFunctions.length = 0
            },
            removeComboCompleteCallback: function (e) {
                l.removeSingleElementFromArray(e, this.comboCompleteCallbackFunctions)
            },
            addNewMatch: function (e) {
                this.totalMatchCount++, this.currentMatchCombos.push(e), this.stopComboTimer(), this.startComboTimer(), this.onNewMatch(e, this.currentMatchCombos)
            },
            onNewMatch: function (e, t) {
                for (var i = 0; i < this.onMadeMatchCallbackFunctions.length; i++) {
                    (0, this.onMadeMatchCallbackFunctions[i])(e, t)
                }
            },
            onComboFinished: function () {
                this.notifyComboCompleteListeners(this.currentMatchCombos), this.reset()
            },
            isComboInProgress: function () {
                return this.currentMatchCombos.length > 0
            },
            notifyComboCompleteListeners: function (e) {
                for (var t = 0; t < this.comboCompleteCallbackFunctions.length; t++) (0, this.comboCompleteCallbackFunctions[t])(e)
            },
            reset: function () {
                this.currentMatchCombos.length = 0, this.stopComboTimer()
            },
            stopComboTimer: function () {
                XS.clearTimeout(this.comboTimerTimeoutId)
            },
            startComboTimer: function () {
                this.comboTimerTimeoutId = XS.setTimeout(this.onComboFinished.bind(this), this.getComboFinishTime())
            }
        };
        SkinManager = {
            skins: [{
                backgroundTints: [[1, "#4c79a5"], [.36, "#6492b6"], [.01, "#d9e3e8"], [0, "#d9e3e8"]],
                bottomBackgroundTint: "i/g/BottomBackground.svg",
                shopTint: "0x4c79a5",
                highscoreTint: "0xc1e6ff",
                board: embed("i/g/Board01.svg"),
                boardTint: "0xasdasdjk",
                boardOutlineTint: "0x11147d",
                body: embed("i/g/BlockBody.svg"),
                bodyoutline: embed("i/g/BlockOutline.svg"),
                bodyGradient: embed("i/g/BlockBodyGradient.svg"),
                topBody: embed("i/g/BlockTopBody.svg"),
                topOffset: -0,
                grid: embed("i/g/Grid.svg"),
                gridBlendmode: textBlendModes[3],
                flyup: embed("i/g/FlyUpButtom.svg"),
                face: embed("i/g/BlockFace.svg"),
                faceOffset: -0,
                faceBlendmode: 0,
                outline: embed("i/g/BlockOutlineFace.svg"),
                outlineOffset: -0,
                outlineGradient: embed("i/g/BlockOutlineGradient.svg"),
                price: 0,
                unlocked: !0
            }, {
                backgroundTints: [[1, "#9598a5"], [.36, "#b2b5be"], [.09, "#dfe0de"], [0, "#dfe0de"]],
                bottomBackgroundTint: "i/g/BottomBackgroundSquare.svg",
                shopTint: "0x9598a5",
                highscoreTint: "0xC1C3CB",
                board: embed("i/g/Board01Square.svg"),
                boardTint: "0xasdasdjk",
                boardOutlineTint: "0xdacece",
                body: embed("i/g/BlockBodySquare.svg"),
                bodyoutline: embed("i/g/BlockOutlineSquare.svg"),
                bodyGradient: embed("i/g/BlockBodyGradientSquare.svg"),
                topBody: embed("i/g/BlockTopBodySquare.svg"),
                topOffset: -0,
                grid: embed("i/g/GridSquare.svg"),
                flyup: embed("i/g/FlyUpButtomSquare.svg"),
                face: embed("i/g/BlockFaceSquare.svg"),
                faceOffset: -0,
                faceBlendmode: 2,
                outline: embed("i/g/BlockOutlineFaceSquare.svg"),
                outlineOffset: -0,
                outlineGradient: embed("i/g/BlockOutlineGradientSquare.svg"),
                price: 75,
                unlocked: !1
            }, {
                backgroundTints: [[1, "#685e9e"], [.36, "#918bbb"], [.09, "#cbc6dc"], [0, "#cbc6dc"]],
                bottomBackgroundTint: "i/g/BottomBackgroundPirate.svg",
                shopTint: "0x685e9e",
                highscoreTint: "0xA7A2C8",
                board: embed("i/g/Board01Pirate.svg"),
                boardTint: "0xasdasdjk",
                boardOutlineTint: "0x29234a",
                body: embed("i/g/BlockBodyPirate.svg"),
                bodyoutline: embed("i/g/BlockOutlinePirate.svg"),
                bodyGradient: embed("i/g/BlockBodyGradientPirate.svg"),
                topOffset: -0,
                topBody: embed("i/g/BlockTopBodyPirate.svg"),
                grid: embed("i/g/GridPirate.svg"),
                flyup: embed("i/g/FlyUpButtomPirate.svg"),
                face: embed("i/g/BlockFacePirate.svg"),
                faceOffset: -0,
                faceBlendmode: 2,
                outline: embed("i/g/BlockOutlineFacePirate.svg"),
                outlineOffset: -0,
                outlineGradient: embed("i/g/BlockOutlineGradientPirate.svg"),
                price: 250,
                unlocked: !1
            }, {
                backgroundTints: [[1, "#ec7de4"], [.36, "#ffaefc"], [.09, "#fff1ff"], [0, "#fff1ff"]],
                bottomBackgroundTint: "i/g/BottomBackgroundHeart.svg",
                shopTint: "0xec7de4",
                highscoreTint: "0xFFBEFC",
                board: embed("i/g/Board01Heart.svg"),
                boardTint: "0xasdasdjk",
                boardOutlineTint: "0x681080",
                body: embed("i/g/BlockBodyHeart.svg"),
                bodyGradient: embed("i/g/BlockBodyGradientHeart.svg"),
                topOffset: -0,
                grid: embed("i/g/GridHeart.svg"),
                flyup: embed("i/g/FlyUpButtomHeart.svg"),
                face: embed("i/g/BlockFaceHeart.svg"),
                faceOffset: -0,
                faceBlendmode: 2,
                outline: embed("i/g/BlockOutlineFaceHeart.svg"),
                outlineOffset: -0,
                outlineGradient: embed("i/g/BlockOutlineGradientHeart.svg"),
                price: 300,
                unlocked: !1
            }, {
                backgroundTints: [[1, "#b3afce"], [.36, "#c9c7de"], [.09, "#e6e3ef"], [0, "#e6e3ef"]],
                bottomBackgroundTint: "i/g/BottomBackgroundCircle.svg",
                shopTint: "0xb3afce",
                highscoreTint: "0xD3D2E4",
                board: embed("i/g/Board01Circle.svg"),
                boardTint: "0xasdasdjk",
                boardOutlineTint: "0xe0dfec",
                body: embed("i/g/BlockBodyCircle.svg"),
                bodyoutline: embed("i/g/BlockOutlineCircle.svg"),
                bodyGradient: embed("i/g/BlockBodyGradientCircle.svg"),
                topBody: embed("i/g/BlockTopBodyCircle.svg"),
                topOffset: 0,
                grid: embed("i/g/GridCircle.svg"),
                gridBlendmode: textBlendModes[3],
                flyup: embed("i/g/FlyUpButtomCircle.svg"),
                face: embed("i/g/BlockFaceCircle.svg"),
                faceOffset: -0,
                faceBlendmode: 2,
                outline: embed("i/g/BlockOutlineFaceCircle.svg"),
                outlineOffset: -0,
                outlineGradient: embed("i/g/BlockOutlineGradientCircle.svg"),
                price: 500,
                unlocked: !1
            }, {
                backgroundTints: [[1, "#349891"], [.36, "#68c8be"], [.09, "#b0f8ed"], [0, "#b0f8ed"]],
                bottomBackgroundTint: "i/g/BottomBackgroundDiamond.svg",
                shopTint: "0x349891",
                highscoreTint: "0x86D3CB",
                board: embed("i/g/Board01Diamond.svg"),
                boardOutlineTint: "0x223e39",
                body: embed("i/g/BlockBodyDiamond.svg"),
                bodyoutline: embed("i/g/BlockOutlineDiamond.svg"),
                bodyGradient: embed("i/g/BlockBodyGradientDiamond.svg"),
                grid: embed("i/g/GridDiamond.svg"),
                flyup: embed("i/g/FlyUpButtomDiamond.svg"),
                face: embed("i/g/BlockFaceDiamond.svg"),
                faceOffset: 0,
                faceBlendmode: 2,
                outline: embed("i/g/BlockOutlineFaceDiamond.svg"),
                outlineOffset: 0,
                outlineGradient: embed("i/g/BlockOutlineGradientDiamond.svg"),
                topBody: embed("i/g/BlockTopBodyDiamond.svg"),
                topOffset: 0,
                price: 1e3,
                unlocked: !1
            }, {
                backgroundTints: [[1, "#1b2c3b"], [.36, "#283d4a"], [.09, "#405964"], [0, "#405964"]],
                bottomBackgroundTint: "i/g/BottomBackgroundGhost.svg",
                shopTint: "0x1b2c3b",
                highscoreTint: "0x687780",
                board: embed("i/g/Board01Ghost.svg"),
                boardTint: "0xasdasdjk",
                boardOutlineTint: "0x021637",
                body: embed("i/g/BlockBodyGhost.svg"),
                bodyoutline: embed("i/g/BlockOutlineGhost.svg"),
                bodyGradient: embed("i/g/BlockBodyGradientGhost.svg"),
                topBody: embed("i/g/BlockTopBodyGhost.svg"),
                topOffset: -0,
                grid: embed("i/g/GridGhost.svg"),
                flyup: embed("i/g/FlyUpButtomGhost.svg"),
                face: embed("i/g/BlockFaceGhost.svg"),
                faceOffset: -0,
                faceBlendmode: 2,
                outline: embed("i/g/BlockOutlineFaceGhost.svg"),
                outlineOffset: -0,
                outlineGradient: embed("i/g/BlockOutlineGradientGhost.svg"),
                price: 1500,
                unlocked: !1
            }],
            currentSkinId: 1,
            tints: [{
                body: "0x0093ba",
                bodyoutline: "0x00bfd1",
                top: "0x11cbe4",
                topGradient: "0x3ab9db",
                outline: "0x1be8f4",
                outlineGradient: "0x15dbee",
                face: "0x0068b2"
            }, {
                body: "0x0da44d",
                bodyoutline: "0x15d779",
                top: "0x39d48d",
                topGradient: "0x3ed17d",
                outline: "0x5ceece",
                outlineGradient: "0x40de9b",
                face: "0x006e00"
            }, {
                body: "0xe26429",
                bodyoutline: "0xf09941",
                top: "0xf0a458",
                topGradient: "0xffa481",
                outline: "0xf9d68a",
                outlineGradient: "0xfcc78c",
                face: "0xd61400"
            }, {
                body: "0xa443b9",
                bodyoutline: "0xd466de",
                top: "0xd37ddd",
                topGradient: "0xdb70f3",
                outline: "0xecc1f0",
                outlineGradient: "0xe78def",
                face: "0x7d009b"
            }, {
                body: "0xe1b43b",
                bodyoutline: "0xf1df5d",
                top: "0xf0d971",
                topGradient: "0xe9b93f",
                outline: "0xf9eeb2",
                outlineGradient: "0xecdb6b",
                face: "0xcf8200"
            }, {
                body: "0xb60526",
                bodyoutline: "0xe42b4c",
                top: "0xf14545",
                topGradient: "0xcc314a",
                outline: "0xf19f9f",
                outlineGradient: "0xf1476f",
                face: "0x860707"
            }, {
                body: "0x283cb5",
                bodyoutline: "0x686ef1",
                top: "0x535ff9",
                topGradient: "0x4550e4",
                outline: "0x8e95f6",
                outlineGradient: "0x7781ff",
                face: "0x00129a"
            }, {
                body: "0x484b6a",
                bodyoutline: "0x666a85",
                top: "0x737585",
                topGradient: "0xa7abd1",
                outline: "0x9da0b8",
                outlineGradient: "0x9194a9",
                face: "0x1f2024"
            }, {
                body: "0x6e82ad",
                bodyoutline: "0x8797bf",
                top: "0xccc3d4",
                topGradient: "0xabcdf2",
                outline: "0xe2d9e9",
                outlineGradient: "0xc3c7d4",
                face: "0x6d8491"
            }],
            getCurrentSkin: function () {
                return this.skins[this.currentSkinId]
            },
            newSkin: function (e) {
                this.currentSkinId = e, stage.background.gradient = {
                    type: "linear",
                    stops: this.getCurrentSkin().backgroundTints
                };
                var i = [{path: this.getCurrentSkin().bottomBackgroundTint, bottom: 0, left: "-15%", right: "-15%"}];
                return stage.background.embellish(i), board.removeGrid(), board.createGrid(), board.removeChild(belt.aiming), board.addChild(belt.aiming), board.newMidleTopTint(), board.removeFlyUp(), board.createflyUp(), stage.background.refresh(!0), t.selectedSkin.set(e), ui.highscore.tint = this.getCurrentSkin().highscoreTint, ui.highscoreSymbol.tint = this.getCurrentSkin().highscoreTint, r(), containerPool.newSkin(), this.getCurrentSkin()
            },
            isSkinPurchasble: function (e) {
                return this.skins[e].price <= CurrencyManager.currency
            },
            purchaseSkin: function (e) {
                if (this.isSkinPurchasble(e) && CurrencyManager.enoughCurrency(this.skins[e].price)) return this.skins[e].unlocked = !0, CurrencyManager.decreaseCurrency(this.skins[e].price), this.setSkinData(), this.skins[e]
            },
            isSkinUnlocked: function (e) {
                return this.skins[e].unlocked
            },
            getSkinData: function () {
                for (var e = t.unlocked.get() || "", i = this.skins.length; i--;) this.skins[i].unlocked = StringContains(e, "+" + i + "+");
                this.skins[0].unlocked = !0, this.newSkin(t.selectedSkin.get() || 0)
            },
            setSkinData: function () {
                for (var e = "", i = this.skins.length; i--;) !0 === this.skins[i].unlocked && (e = e + "+" + i);
                e += "+", t.unlocked.set(e)
            },
            mergeSkinData: function (e) {
                for (var i = t.unlocked.get() || "", n = this.skins.length; n--;) this.skins[n].unlocked = StringContains(i, "+" + n + "+");
                for (n = this.skins.length; n--;) this.skins[n].unlocked || null == e || (this.skins[n].unlocked = StringContains(e, "+" + n + "+"));
                this.skins[0].unlocked = !0, this.setSkinData()
            }
        }, ScoreManager = {
            score: 0,
            scoreMultiplierStart: 1,
            scoreMultiplierIncrement: .5,
            onScoreChangedCallbacks: [],
            onHighscoreChangedCallbacks: [],
            init: function () {
                this.currentScoreMultiplier = this.scoreMultiplierStart
            },
            calculateScoreForMatchCombo: function (e) {
                var t = e.length;
                return this.calculateScoreForMatchArray(e[t - 1]) * t
            },
            calculateScorePool: function (e) {
                for (var t = 0, i = 0; i < e.length; i++) {
                    var n = e[i];
                    t += this.calculateScoreForMatchArray(n)
                }
                return t
            },
            calculateScoreForMatchArray: function (e) {
                var t = e.length;
                return 10 * Math.max(1, t - 2) * (1 + LevelManager.currentLevel * this.scoreMultiplierIncrement)
            },
            addScore: function (e) {
                var t = this.score;
                this.score += e, this.onScoreChanged(this.score, t), this.handleNewHighscoreIfRequired()
            },
            onScoreChanged: function (e, t) {
                for (var i = 0; i < this.onScoreChangedCallbacks.length; i++) {
                    (0, this.onScoreChangedCallbacks[i])(e, t)
                }
            },
            addOnScoreChangedCallback: function (e) {
                this.onScoreChangedCallbacks.push(e)
            },
            removeOnScoreChangedCallback: function (e) {
                l.removeSingleElementFromArray(e, this.onScoreChangedCallbacks)
            },
            getHighscore: function () {
                return 0 | t.highscore.get()
            },
            setHighscore: function (e) {
                t.highscore.set(e)
            },
            handleNewHighscoreIfRequired: function (e) {
                if (e) var t = e; else t = this.score;
                var i = this.getHighscore();
                t > i && (this.setHighscore(t), this.onHighscoreChanged(t, i))
            },
            onHighscoreChanged: function (e, t) {
                for (var i = 0; i < this.onHighscoreChangedCallbacks.length; i++) {
                    (0, this.onHighscoreChangedCallbacks[i])(e, t)
                }
            },
            addOnHighscoreChangedCallback: function (e) {
                this.onHighscoreChangedCallbacks.push(e)
            },
            reset: function () {
                this.score = 0, this.currentScoreMultiplier = this.scoreMultiplierStart, ui.updateScoreUI()
            }
        }, LevelManager = {
            currentLevelMatchCount: 0, currentLevel: 0, onLevelUpCallbacks: [], onScoreChanged: function (e, t) {
            }, reset: function () {
                this.currentLevel = 0, this.currentLevelMatchCount = 0, ui.levelUpText("Level " + (this.currentLevel + 1)), audio.gameMusic.setGain(audio.gameMusicInitialVolume)
            }, onMatch: function () {
                this.currentLevelMatchCount++, this.handleLevelUpIfRequired()
            }, handleLevelUpIfRequired: function (e, t) {
                for (var i = this.currentLevel; this.canLevelUp(e);) this.currentLevelMatchCount = 0, this.currentLevel++;
                this.currentLevel != i && this.onLevelChanged(this.currentLevel, i)
            }, canLevelUp: function () {
                return this.getMatchCountRequiredForNextLevel() <= this.currentLevelMatchCount
            }, getNextLevelScoreRequirement: function () {
                return this.currentLevel * (15 * this.currentLevel) + 80
            }, getMatchCountRequiredForNextLevel: function () {
                return this.getCurrentLevelData().matchCountRequiredForNextLevel
            }, onLevelChanged: function (e, t) {
                for (var i = 0; i < this.onLevelUpCallbacks.length; i++) {
                    (0, this.onLevelUpCallbacks[i])(this.currentLevel, t)
                }
            }, addOnLevelChangedCallback: function (e) {
                this.onLevelUpCallbacks.push(e)
            }, createBlock: function () {
                var e = this.getBlockColorForCurrentLevel();
                if (f.getIndexColor(e) >= f.ColorIndex.SWAP_LEFT) var t = containerPool.spawnPowerup(); else t = containerPool.spawnBlock();
                return t.newColor(e), t
            }, getBlockColorForCurrentLevel: function () {
                var e = this.getLevelData(this.currentLevel);
                e || (console.log("level data was null or undefined, trying to get last index of level array."), e = this.getLastLevelData());
                var t = e.DropRate, i = this.getBlockColorIndexByDroprate(t);
                return f.getBlockColor(i)
            }, getBlockColorIndexByDroprate: function (e) {
                var t = 0;
                for (var i in e) {
                    if (e.hasOwnProperty(i)) t += e[i]
                }
                var n = Math.random() * t;
                for (var i in t = 0, e) if (e.hasOwnProperty(i)) {
                    var r = e[i];
                    if (!(t + r < n)) return f.ColorIndex.getByKey(i);
                    t += r
                }
                return null
            }, getLevelData: function (e) {
                return s.levels[e]
            }, getCurrentLevelData: function () {
                return s.levels.length <= this.currentLevel ? s.levels[s.levels.length - 1] : s.levels[this.currentLevel]
            }, IncreasePastMaxLevel: function () {
                var e = this.getLastLevelData();
                return e.Game.Speed += a.Belt.speedIncrement, s.levels.push(e), this.getLastLevelData()
            }, getLastLevelData: function () {
                var e = s.levels;
                return e[e.length - 1]
            }, takeMeToNextLevel: function () {
                this.currentLevelMatchCount = this.getMatchCountRequiredForNextLevel(), this.handleLevelUpIfRequired()
            }
        };
        var d = Container.expand(function () {
            var e = Container.call(this);
            e.inactiveContainers = [], e.inactivePowerups = [], e.init = function () {
                for (var t = a.Game.containerSize; t--;) {
                    var i = new f;
                    board.addChild(i), i.createBlock(), e.destroyBlock(i)
                }
                for (t = a.Game.containerBomb; t--;) {
                    i = new f;
                    board.addChild(i), i.createBlock(), e.destroyPowerup(i), e.inactivePowerups[e.inactivePowerups.length - 1].newColor(f.getBlockColor(f.ColorIndex.BOMB)), i.powerupLook()
                }
            }, e.destroyBlock = function (t) {
                e.addChild(t), t.resetAnchor(), e.inactiveContainers.push(t)
            }, e.destroyPowerup = function (t) {
                e.addChild(t), t.resetAnchor(), e.inactivePowerups.push(t)
            }, e.spawnBlock = function () {
                if (e.inactiveContainers.length >= 1) {
                    var t = e.inactiveContainers.pop();
                    return e.removeChild(t), t
                }
                return null
            }, e.spawnPowerup = function () {
                if (e.inactivePowerups.length >= 1) {
                    var t = e.inactivePowerups.pop();
                    return e.removeChild(t), t
                }
                return null
            }, e.newSkin = function () {
                for (var t = e.inactiveContainers.length; t--;) {
                    var i = e.inactiveContainers.pop();
                    e.removeChild(i)
                }
                for (t = e.inactivePowerups.length; t--;) {
                    i = e.inactivePowerups.pop();
                    e.removeChild(i)
                }
                e.init()
            }
        });
        CurrencyManager = {
            currency: 0, SpawnCurrency: function (e) {
                if (Math.random() <= LevelManager.getCurrentLevelData().Game.CurrencyChance) {
                    var t = new Sprite(fetch("i/g/Coin.svg"));
                    y.addChild(t);
                    var i = e[0];
                    t.anchor.x = 0, t.anchor.y = 0, t.x = i.x * board.gameScale + board.x * board.gameScale, t.y = i.y * board.gameScale, t.scale.set(0), new Tween(t.scale, {
                        x: 1,
                        y: 1
                    }, .4).call(function () {
                        new Tween(t, {x: ui.currencyUI.x, y: 50}, .6).wait(.2).call(function () {
                            CurrencyManager.IncreaseCurrency(t)
                        })
                    })
                }
            }, IncreaseCurrency: function (e) {
                this.currency++, t.currency.set(this.currency), y.removeChild(e), ui.updateCurrency(), ui.punchTarget(ui.currencyUI)
            }, LoadCurrency: function () {
                this.currency = t.currency.get(), ui.updateCurrency()
            }, decreaseCurrency: function (e) {
                return !!this.enoughCurrency(e) && (this.currency -= e, ui.punchTarget(ui.currencyUI), t.currency.set(this.currency), ui.updateCurrency(), !0)
            }, enoughCurrency: function (e) {
                return this.currency - e >= 0
            }
        };
        var h = {
            tutorialContainer: null,
            fingerDown: null,
            fingerUp: null,
            block: null,
            fingerUpCallback: null,
            fingerDownCallback: null,
            blockReleaseCallback: null,
            fingerTween: null,
            blockTween: null,
            init: function () {
                this.tutorialContainer = new Container, e.addChild(this.tutorialContainer), XS.on("resize", this.onResize.bind(this)), this.fingerUp = new Sprite(embed("i/g/hand01.svg")), this.fingerDown = new Sprite(embed("i/g/hand02.svg")), this.resetCompletedTutorialSteps()
            },
            resetCompletedTutorialSteps: function () {
                this.setCurrentTutorialStep(TutorialStep.SIMPLE_DRAG_MATCH)
            },
            modal: function (e, t) {
                Tutorial.show(this.tutorialContainer, 0, 0, Host.Localize.Translate(e), Host.Localize.Translate(t)), this.onResize()
            },
            onResize: function () {
                var e = XS.devicePixelRatio / stage.ratio;
                this.tutorialContainer.x = width * e / 2, this.tutorialContainer.y = height * e / 2
            },
            getCurrentTutorialStep: function () {
                return t && t.tutorial && t.tutorial.get() || 0
            },
            setCurrentTutorialStep: function (e) {
                t.tutorial.set(e), r()
            },
            hasCompletedAllTutorialSteps: function () {
                return this.getCurrentTutorialStep() >= TutorialStep.TUTORIAL_ENDING
            },
            shouldPlayTutorial: function () {
                return !this.hasCompletedAllTutorialSteps()
            },
            handleCurrentTutorialStep: function () {
                var e = this.getCurrentTutorialStep();
                this.handleTutorialStep(e)
            },
            nextStep: function () {
                Tutorial.hide();
                var e = this.getCurrentTutorialStep();
                e++, this.setCurrentTutorialStep(e), this.handleTutorialStep(e)
            },
            handleTutorialStep: function (e) {
                switch (v.onTutorialStepStart(e), e) {
                    case TutorialStep.SIMPLE_DRAG_MATCH:
                        this.handleTutorialStepSimpleDragMatch();
                        break;
                    case TutorialStep.TUTORIAL_ENDING:
                        this.handleTutorialStepEnding()
                }
            },
            fingerUpMovement: function () {
                var e = a.Belt.conveyEndOffsetX / 2 + 290, t = a.Belt.conveyStartOffsetY;
                this.fingerUp.x = e, this.fingerUp.y = t, this.fingerUp.alpha = 1, this.fingerDown.alpha = 0, this.block.alpha = 0, this.fingerTween = new Tween(this.fingerUp, {}, .3).call(this.fingerUpCallback)
            },
            fingerDownMovement: function () {
                var e = a.Belt.conveyEndOffsetX / 2 + 290, t = a.Belt.conveyStartOffsetY;
                this.fingerDown.x = e, this.fingerDown.y = t, this.block.x = e, this.block.y = t, this.fingerDown.alpha = 1, this.block.alpha = .5, this.fingerUp.alpha = 0, this.fingerTween = new Tween(this.fingerDown, {
                    x: a.Belt.conveyEndOffsetX / 2 - 25,
                    y: a.Belt.conveyStartOffsetY - 400
                }, 2), this.fingerTween = new Tween(this.block, {
                    x: a.Belt.conveyEndOffsetX / 2 - 25,
                    y: a.Belt.conveyStartOffsetY - 400
                }, 2).call(this.fingerDownCallback)
            },
            releaseBlockMovement: function () {
                this.fingerTween = new Tween(this.block, {y: 600}, 1).call(this.blockReleaseCallback)
            },
            handleTutorialStepSimpleDragMatch: function () {
                board.setupBoardForTutorialStepSimpleDragMatch(), belt.setupBeltForTutorialStepSimpleDragMatch(), this.fingerDown.alpha = 0, this.fingerUp.alpha = 0, this.block = new Sprite(belt.blockBelts[0].blockColor.hexCode), this.block.alpha = .5, belt.addChild(this.block), belt.addChild(this.fingerDown), belt.addChild(this.fingerUp), this.fingerUpCallback = this.fingerDownMovement.bind(this), this.fingerDownCallback = this.releaseBlockMovement.bind(this), this.blockReleaseCallback = this.fingerUpMovement.bind(this), this.fingerUpMovement();
                var e = 0, t = function (i, n) {
                    1 == ++e && (Tutorial.hide(), this.delayedNextStep(1e3), c.removeOnMatchCallback(t))
                }.bind(this);
                c.addOnMatchCallback(t)
            },
            delayedNextStep: function (e) {
                XS.setTimeout(this.nextStep.bind(this), e)
            },
            playerReleaseBlock: function () {
                belt.removeChild(this.block), belt.removeChild(this.fingerDown), belt.removeChild(this.fingerUp)
            },
            handleTutorialStepEnding: function () {
                belt.spawnBlock()
            }
        };
        TutorialStep = {SIMPLE_DRAG_MATCH: 0, TUTORIAL_ENDING: 1};

        function u() {
            var e = Container.call(this);
            e.popupText = void 0, e.popupTween = void 0, e.scoreUI = void 0, e.currencyUI = void 0, e.highscore = void 0, e.highscoreContainer = void 0, e.comboBackground = void 0, e.currentComboCountUI = void 0, e.currentComboCountTween = void 0, e.gameStartText = void 0, e.gameTitle = void 0, e.onTappedToStartGameCallback = void 0, e.init = function () {
                e.comboBackground = new Sprite(fetch("i/g/ComboBaseGfx.svg")), e.comboBackground.scale.x = 0, e.comboBackground.scale.y = 1, e.comboBackground.blendMode = 0, e.comboBackground.tint = "0x7c87c0", e.addChild(e.comboBackground), e.scoreUI = new Text2(e.createScoreString(), {
                    weight: 500,
                    size: 450,
                    fill: "#FFF",
                    align: "center"
                }), e.scoreUI.x = 600, e.scoreUI.y = 90, e.scoreUI.scale.set(.5, .5), e.scoreUI.anchor.x = .5, y.addChild(ui.scoreUI), e.moveScore(), e.currencyUI = new Text2("0", {
                    weight: 500,
                    size: 200,
                    fill: "#FFF",
                    align: "right"
                }), e.currencyUI.x = 1e3, e.currencyUI.y = 50, e.currencyUI.scale.set(.5, .5), e.currencyUI.anchor.x = 1, y.addChild(e.currencyUI), e.currencySymbol = new Sprite(fetch("i/g/Coin.svg")), e.currencySymbol.anchor.x = 0, y.addChild(e.currencySymbol), e.moveCoin(), e.highscoreContainer = new Container, e.highscoreContainer.x = 600, e.highscoreContainer.y = 25, stage.addChild(e.highscoreContainer), e.highscore = new Text2(e.createHighscoreString(), {
                    weight: 500,
                    size: 80,
                    fill: "#ffffff",
                    align: "center"
                }), e.highscore.tint = "0xFFFFFF", e.highscoreContainer.addChild(e.highscore), e.highscoreSymbol = new Sprite(embed("i/g/crown.svg")), e.highscoreSymbol.x = -30, e.highscoreSymbol.y = 17, e.highscoreContainer.addChild(e.highscoreSymbol), e.highscoreSymbol.tint = "0xE0F2FF", e.moveHighscore(), e.currentComboCountUI = new Text2(e.createCurrentComboCountString(0, []), {
                    size: 99,
                    fill: "#FFF",
                    align: "left"
                }), e.currentComboCountUI.anchor.x = 1, e.currentComboCountUI.x = 200, e.currentComboCountUI.y = 205, e.currentComboCountUI.anchor.x = .5, e.currentComboCountUI.alpha = 0, e.addChild(e.currentComboCountUI), e.gameTitle = new Sprite(embed("i/g/StackThreeTitle.svg")), XS.is.mobile ? e.gameStartText = new Text2(Host.Localize.Translate("Tap to play"), {
                    weight: 700,
                    size: 95,
                    fill: "#ffffff",
                    align: "center",
                    stroke: "#d3d3d3",
                    strokeThickness: 6
                }) : e.gameStartText = new Text2(Host.Localize.Translate("Click to play"), {
                    weight: 700,
                    size: 95,
                    fill: "#ffffff",
                    align: "center",
                    stroke: "#d3d3d3",
                    strokeThickness: 6
                })
            }, e.showGameStart = function () {
                e.gameTitle.scale = {
                    x: .975,
                    y: .975
                }, e.gameTitle.anchor.x = .5, e.gameTitle.x = 575, e.gameTitle.y = -700, e.gameStartText.anchor.x = .5, e.gameStartText.x = 570, e.gameStartText.y = 6500, new Tween(e.gameTitle, {y: 730}, 1.4, l.EaseFunctions.easeOutBack).call(e.hideTitle), h.shouldPlayTutorial() || new Tween(e.gameStartText, {y: 1600}, 1.4, Tween.easeout), board.addChild(e.gameStartText), ui.addChild(e.gameTitle)
            }, e.tapToPlay = function (t) {
                e.onTappedToStartGameCallback && e.onTappedToStartGameCallback(), stage.off("down", e.tapToPlay)
            }, e.hidestartText = function () {
                new Tween(e.gameStartText, {y: 6500}, 1.4, Tween.easeout).call(function () {
                    board.removeChild(e.gameStartText)
                })
            }, e.hideTitle = function () {
                stage.on("down", e.tapToPlay), new Tween(e.gameTitle, {y: -800}, 1.4, Tween.easeout).wait(1.5).call(function () {
                    board.removeChild(e.gameTitle)
                })
            }, e.moveCoin = function () {
                e.currencyUI.x = width * XS.devicePixelRatio / stage.ratio - 130, e.currencySymbol.x = width * XS.devicePixelRatio / stage.ratio - 120, e.currencySymbol.y = 60
            }, e.handleResize = function () {
                e.moveHighscore(), e.moveScore(), e.scoreUI.setText(e.createScoreString()), e.moveCoin();
                var t = XS.devicePixelRatio, i = width * t / stage.ratio / 2;
                "landscape" == stage.orientation ? (e.scale = {
                    x: board.gameScale,
                    y: board.gameScale
                }, e.x = i - 584.5, e.y = Math.max(gameHeight * t / stage.ratio * .6 - 1300)) : (e.ratio = stage.ratio * board.gameScale, e.x = i - 1169 * board.gameScale / 2, e.y = gameHeight * t / stage.ratio * .6 - 1900)
            }, e.onMatch = function (t, i) {
                var n = i.length;
                if (1 != n) if (e.popupTween) e.popupText.setText(n + "x"), e.popupTween.clear(), 1 == e.popupText.scale.x ? (e.popupTween = void 0, e.flyTarget(e.popupText, e.popupText.y - 300, e.destroyComboText)) : e.popupTween = new Tween(e.popupText.scale, {
                    x: 1,
                    y: 1
                }, .12).call(function () {
                    e.popupTween = void 0, e.flyTarget(e.popupText, e.popupText.y - 300, e.destroyComboText)
                }); else {
                    var r = i[i.length - 1][0];
                    null != r ? (e.popupText = new Text2(n + "x", {
                        weight: 700,
                        size: 180,
                        fill: r.blockColor.strokeTint,
                        align: "center",
                        valign: "middle",
                        stroke: "#FFF",
                        strokeThickness: 4
                    }), null != r.topImage ? e.popupText.tint = r.topImage.tint : e.popupText.tint = r.outline.tint) : e.popupText = new Text2(n + "x", {
                        weight: 700,
                        size: 180,
                        fill: "#fff",
                        align: "center",
                        valign: "middle",
                        stroke: "#FFF",
                        strokeThickness: 4
                    }), e.popupText.anchor.x = .5, e.popupText.anchor.y = .5, e.popupText.scale.x = 0, e.popupText.scale.y = 0, e.popupTween = new Tween(e.popupText.scale, {
                        x: 1,
                        y: 1
                    }, .12).call(function () {
                        e.popupTween = void 0;
                        var t = e.popupText;
                        e.flyTarget(e.popupText, e.popupText.y - 300, function () {
                            e.removeChild(t)
                        })
                    });
                    var o = l.getCentroidForBlocks(t);
                    e.popupText.x = o.x, e.popupText.y = o.y, e.showComboBackground(o), e.addChild(e.popupText)
                }
            }, e.destroyComboText = function () {
                e.removeChild(e.popupText)
            }, e.showComboBackground = function (t) {
                e.addChild(e.comboBackground), e.comboBackground.x = t.x, e.comboBackground.y = t.y, e.comboBackground.anchor.x = .5, e.comboBackground.anchor.y = .5, new Tween(e.comboBackground.scale, {x: 1}, .4), new Tween(e.comboBackground.scale, {y: 0}, .22).wait(.27).call(function () {
                    e.removeChild(e.comboBackground), e.comboBackground.alpha = 1, e.comboBackground.scale.x = 0, e.comboBackground.scale.y = 1
                })
            }, e.createPopText = function (t, i) {
                var n = new Text2(t, {
                    weight: 600,
                    size: 135,
                    fill: "#FFF",
                    align: "center",
                    valign: "middle",
                    stroke: "#7d7d7d",
                    strokeThickness: 4
                });
                n.anchor.x = .5, n.anchor.y = .5, n.scale.x = 0, n.scale.y = 0;
                new Tween(n.scale, {x: 1, y: 1}, .12).call(function () {
                    e.popupText;
                    new Tween(n, {alpha: 0}, .55).wait(1.42)
                });
                var r = {x: 600, y: i || 970};
                n.x = r.x, n.y = r.y, e.showpopBackground(r), e.addChild(n)
            }, e.showpopBackground = function (t) {
                var i = new Sprite(fetch("i/g/ComboBaseGfx.svg"));
                e.addChild(i), i.x = t.x, i.y = t.y, i.anchor.x = .5, i.anchor.y = .5, i.alpha = .5, new Tween(i.scale, {x: 1}, .4), new Tween(i.scale, {y: 0}, .22).wait(1.27).call(function () {
                    e.removeChild(i), i.alpha = 1, i.scale.x = 0, i.scale.y = 1
                })
            }, e.flyTarget = function (e, t, i) {
                new Tween(e, {y: t}, 1.65, l.easeout).wait(1.42).call(i), new Tween(e, {alpha: 0}, 1.65).wait(1.42)
            }, e.punchScore = function () {
                new Tween(e.scoreUI.scale, {x: .65, y: .65}, .2).call(function () {
                    new Tween(e.scoreUI.scale, {x: .5, y: .5}, .2)
                })
            }, e.punchTarget = function (e) {
                new Tween(e.scale, {x: .65, y: .65}, .2).call(function () {
                    new Tween(e.scale, {x: .5, y: .5}, .2)
                })
            }, e.createFlyingText = function (t, i, n) {
                var r = new Text2(t, {size: 120, fill: "#FFF", align: "center", valign: "middle"});
                return r.anchor.x = .5, r.anchor.y = .5, r.scale.x = 0, r.scale.y = 0, r.x = i.x, r.y = i.y, new Tween(r.scale, {
                    x: 1,
                    y: 1
                }, .12).call(function () {
                    new Tween(r, {x: n.x, y: n.y}, .95).call(function () {
                        e.removeChild(r)
                    })
                }), r
            }, e.createPopUpText = function (t) {
                var i = new Text2(t, {size: 120, fill: "#FFF", align: "center", valign: "middle"});
                return i.anchor.x = .5, i.anchor.y = .5, i.scale.x = 0, i.scale.y = 0, new Tween(i.scale, {
                    x: 1,
                    y: 1
                }, .12).call(function () {
                    new Tween(i.scale, {
                        x: 0,
                        y: 0
                    }, .65).wait(.7), new Tween(i, {alpha: 0}, .65).wait(.8).call(function () {
                        e.removeChild(i)
                    })
                }), i
            }, e.popUpScore = function (t, i) {
                var n = e.createFlyingText(t, i, {x: 300, y: 300});
                e.addChild(n), e.updateScoreUI(), e.updateHighscoreUI()
            }, e.popUpComboCount = function (t, i, n) {
                var r = t + "x", o = e.createPopUpText(r);
                o.x = i.x, o.y = i.y, new Tween(o, {
                    x: e.currentComboCountUI.x,
                    y: e.currentComboCountUI.y
                }, 3.5).wait(.5), n.addChild(o)
            }, e.createScoreString = function () {
                return ScoreManager.score
            }, e.createHighscoreString = function () {
                return ScoreManager.getHighscore()
            }, e.createLevelString = function () {
                return "Level: " + (LevelManager.currentLevel + 1)
            }, e.updateCurrency = function () {
                e.currencyUI.setText(CurrencyManager.currency)
            }, e.updateScoreUI = function () {
                e.scoreUI.setText(e.createScoreString()), e.punchScore()
            }, e.updateHighscoreUI = function () {
                var t = e.createHighscoreString();
                e.highscore.setText(t), e.moveHighscore()
            }, e.moveScore = function () {
                e.scoreUI.x = width * XS.devicePixelRatio / stage.ratio / 2
            }, e.moveHighscore = function () {
                e.highscore.ratio = 1;
                var t = e.highscore.width;
                e.highscore.ratio = e.highscore.parent && e.highscore.parent.ratio || 1;
                var i = XS.devicePixelRatio;
                e.highscoreContainer.x = width * i / stage.ratio / 2, e.highscore.x = -(t + 80) / 2 + 80, e.highscoreSymbol.x = -(t + 85) / 2
            }, e.createCurrentComboCountString = function (e, t) {
                return e + " x " + ScoreManager.calculateScorePool(t)
            }, e.onLevelUp = function () {
                e.levelUpText("Level " + (LevelManager.currentLevel + 1)), e.createPopText(Host.Localize.Translate("Level ", {}, "Level popup text prefix") + (LevelManager.currentLevel + 1), 1300)
            }, e.levelUpText = function (e) {
            }, e.handleGameOverPerPlatform = function (t) {
                XS.is.facebookInstant ? (void 0 !== t && Modal.hide(t), window.Social.Instant.submitData({score: ScoreManager.getHighscore()}, !1), window.Social.Instant.showGameOver(!1, !1).then(e.showShopGameOver)) : e.showShopGameOver()
            }, e.showShopGameOver = function () {
                r();
                var e = SkinManager.currentSkinId, t = new Modal.GameEndModal({
                    headline: Host.Localize.Translate("Select Theme", {}, "Theme selector headline"),
                    mainActionCallback: function () {
                        XS.ads.show("interstitial", function () {
                            SkinManager.isSkinUnlocked(e) && (o.highscoreBeaten = !1, SkinManager.newSkin(e), ScoreManager.reset(), board.resetBoard(), Modal.hide(t), LevelManager.reset(), board.randomNewBoard(), XS.setTimeout(belt.spawnBlock, 1e3), o.isGameOver = !1, belt.onLevelUpdate(), ui.updateHighscoreUI(), v.trackPlay())
                        })
                    },
                    mainActionText: Host.Localize.Translate("Play"),
                    mainActionColor: 16477478,
                    contentTop: 540,
                    disableMetaButton: !1
                });
                t.blurCallback = void 0;
                var n = new Container;
                n.x = 400, n.y = 560;
                var a = new Container;
                a.scale.set(.5, .5), a.x = 400, a.y = 360, t.addChild(a);
                var s = [];
                for (i = 0; i < SkinManager.skins.length; i++) {
                    var l = new f;
                    l.createBlock(i), t.addChild(l), l.setPosition(240, 360), l.setScale(1), l.setTint(0, i), l.rotation = toRadians(-30);
                    var c = new f;
                    c.createBlock(i), c.setScale(1), c.setPosition(395, 310), c.setTint(2, i), t.addChild(c);
                    var d = new f;
                    d.createBlock(i), d.setScale(1), d.setPosition(560, 350), d.setTint(1, i), d.rotation = toRadians(30), t.addChild(d), s[i] = {
                        leftBlock: l,
                        middleBlock: c,
                        rightBlock: d
                    }
                }
                var h = new Sprite(fetch("i/g/ShopBackgroundBox.svg"));
                h.anchor.set(.5, .5), a.addChild(h), h.blendMode = 2;
                var u = new Sprite(fetch("i/g/shopbtn.svg"));
                u.anchor.set(.5, .5), t.addChild(u), u.x = 100, u.y = 360, u.on("down", function () {
                    b(e - 1)
                });
                var g = new Sprite(fetch("i/g/shopbtn.svg"));
                g.anchor.set(.5, .5), g.scale.set(-1, 1), t.addChild(g), g.x = 700, g.y = 360, g.on("down", function () {
                    b(e + 1)
                });
                var p = new Graphics;
                p.beginFill(3572119, 1), p.drawRoundedRect(0, 0, 310, 100, 20), p.x = 0, p.y = 0, n.addChild(p);
                var m = new Sprite(fetch("i/g/Coin.svg"));
                m.x = -140, m.y = -38, m.scale.set(.8, .8), n.addChild(m);
                var w = new Text2("1000", {weight: 400, fill: "#FFFFFF", size: 70, maxWidth: 210, dropShadow: !0});

                function b(r) {
                    for (r = r.clamp(0, SkinManager.skins.length - 1), u.visible = 0 != r, g.visible = r != SkinManager.skins.length - 1, n.visible = !SkinManager.isSkinUnlocked(r), SkinManager.isSkinPurchasble(r) ? n.alpha = 1 : n.alpha = .5, SkinManager.isSkinUnlocked(r) ? t.mainAction.alpha = 1 : t.mainAction.alpha = .5, w.setText(SkinManager.skins[r].price), h.tint = SkinManager.skins[r].shopTint, i = 0; i < s.length; i++) s[i].leftBlock.visible = r == i, s[i].middleBlock.visible = r == i, s[i].rightBlock.visible = r == i;
                    e = r
                }

                w.anchor.set(.5, .5), n.addChild(w), w.x = 35, w.y = 0, t.addChild(n), t.setRatio = function (e) {
                    p.width = 310 * e, p.x = -p.width / 2, p.y = -50 * e, p.height = 100 * e
                }, p.on("down", function () {
                    SkinManager.isSkinUnlocked(e) || null != SkinManager.purchaseSkin(e) && (n.visible = !1, t.mainAction.alpha = 1)
                }), b(e), Modal.show(t)
            }, XS.on("resize", e.handleResize)
        }

        function f() {
            var e = Container.call(this);
            e.blockColor = BlockColor.blue, e.deathTweenTime = a.Block.deathTweenTime, e.blockColor = f.getBlockColor(0), e.scale = {
                x: 0,
                y: 0
            }, e.owner = void 0, e.blockSlot = void 0, e.beltMoveTween = null, e.setTint = function (t, i) {
                e.blockImage && (e.blockImage.tint = SkinManager.tints[t].body), e.topImage && (e.topImage.tint = SkinManager.tints[t].top), e.bodyoutline && (e.bodyoutline.tint = SkinManager.tints[t].bodyoutline), e.topGradient && (e.topGradient.tint = SkinManager.tints[t].topGradient, e.topGradient.blendMode = 2), e.outline && (e.outline.tint = SkinManager.tints[t].outline), e.outlineGradient && (e.outlineGradient.tint = SkinManager.tints[t].outlineGradient, e.outlineGradient.blendMode = 2), e.face && (e.face.tint = SkinManager.tints[t].face, e.face.blendMode = SkinManager.getCurrentSkin().faceBlendmode)
            }, e.createBlock = function (t) {
                if (void 0 === t) var i = SkinManager.getCurrentSkin(); else i = SkinManager.skins[t];
                e.bodyContainer = new Container, e.blockImage = new Sprite(i.body), e.addChild(e.bodyContainer), e.bodyContainer.addChild(e.blockImage), e.blockImage.anchor.set(.5, .5), e.extraContainer = new Container, e.bodyContainer.addChild(e.extraContainer), e.createBlockExtra(t)
            }, e.createBlockExtra = function (t) {
                if (void 0 === t) var i = SkinManager.getCurrentSkin(); else i = SkinManager.skins[t];
                i.bodyoutline && (e.bodyoutline = new Sprite(i.bodyoutline), e.extraContainer.addChild(e.bodyoutline), e.bodyoutline.anchor.set(.5, .5)), null != i.topBody && (e.topImage = new Sprite(i.topBody), e.extraContainer.addChild(e.topImage), e.topImage.anchor.set(.5, .5), e.topImage.y = i.topOffset), i.bodyGradient && (e.topGradient = new Sprite(i.bodyGradient), e.extraContainer.addChild(e.topGradient), e.topGradient.anchor.set(.5, .5)), null != i.outline && (e.outline = new Sprite(i.outline), e.extraContainer.addChild(e.outline), e.outline.anchor.set(.5, .5), e.outline.y = i.outlineOffset), i.outlineGradient && (e.outlineGradient = new Sprite(i.outlineGradient), e.extraContainer.addChild(e.outlineGradient), e.outlineGradient.anchor.set(.5, .5)), i.face && (e.face = new Sprite(i.face), e.extraContainer.addChild(e.face), e.face.anchor.set(.5, .5))
            }, e.powerupLook = function () {
                e.bodyContainer.removeChild(e.blockImage), e.bodyContainer.removeChild(e.extraContainer), e.extraContainer.removeChild(e.outlineGradient), e.extraContainer.removeChild(e.outline), e.extraContainer.removeChild(e.topGradient), e.extraContainer.removeChild(e.bodyoutline), e.extraContainer.removeChild(e.topImage), e.extraContainer.removeChild(e.face), e.blockImage = new Sprite(e.blockColor.hexCode), e.blockImage.anchor.set(.5, .5), e.bodyContainer.addChild(e.blockImage)
            }, e.newColor = function (t, i, n) {
                e.blockColor = t;
                var r = {x: e.x, y: e.y}, o = e.scale;
                index = f.getIndexColor(t), index < f.ColorIndex.SWAP_LEFT && e.setTint(index), !0 === n ? e.setScale(o.x) : e.setScale(0), null != i && e.setPosition(r.x, r.y)
            }, e.setPosition = function (t, i) {
                e.x = t, e.y = i
            }, e.setPositionByIndex = function (t, i) {
                var n = board.getPosition(t, i);
                e.setPosition(n.x, n.y)
            }, e.powerupApply = function (t, i, n) {
                switch (e.blockColor.name) {
                    case"BombRight":
                        e.bombRightActivate(t, i, n);
                        break;
                    case"BombLeft":
                        e.bombLeftActivate(t, i, n);
                        break;
                    case"Bomb":
                        e.createScaleTween(1.35, .13, Tween.easeout, function () {
                            new Tween({}, {}, .05).call(function () {
                                b.createShockwave(e.parent, e.x, e.y, e.blockColor.tint), e.destroy(), e.bombActivate(i, n)
                            })
                        })
                }
            }, e.bombActivate = function (t, i) {
                var n = board.getTrueIndex(e);
                if (null != n || null != t) {
                    if (null == t) var r = n.x, o = n.y; else r = t, o = i;
                    var a = o;
                    if (void 0 === t) {
                        var s = board.getNeighbours(e);
                        board.boardTiles[r][o] = void 0
                    } else s = board.getNeighbours(e, !1, t, i + 1);
                    audio.playBomb(), r > 0 && o > 0 && null != board.boardTiles[r - 1][o - 1] && s.push(board.boardTiles[r - 1][o - 1]), r < board.boardWidth - 1 && o < board.boardHeight - 1 && null != board.boardTiles[r + 1][o + 1] && s.push(board.boardTiles[r + 1][o + 1]), r > 0 && o < board.boardHeight - 1 && null != board.boardTiles[r - 1][o + 1] && s.push(board.boardTiles[r - 1][o + 1]), r < board.boardWidth - 1 && o > 0 && null != board.boardTiles[r + 1][o - 1] && s.push(board.boardTiles[r + 1][o - 1]);
                    a = s.length - 1;
                    for (c.addNewMatch(s); a >= 0;) tweenContains(s[a]) ? a-- : (s[a].OnMatchMade(), a--);
                    board.checkPreviousCell()
                }
            }, e.bombLeftActivate = function (t, i, n) {
                if (null != (l = board.getTrueIndex(e)) || null != i) {
                    if (null == i) var r = l.x, o = l.y; else r = i, o = i;
                    for (var a = [], s = r; s >= 0; s--) board.boardTiles[s][o] && !tweenContains(board.boardTiles[s][o]) && a.push(board.boardTiles[s][o]);
                    c.addNewMatch(a), e.bombMoveLeft(a, 1);
                    var l = board.getTrueIndex(e);
                    board.boardTiles[r][o] = void 0
                }
            }, e.bombRightActivate = function (t, i, n) {
                if (null != (l = board.getTrueIndex(e)) || null != i) {
                    if (null == i) var r = l.x, o = l.y; else r = i, o = i;
                    for (var a = [], s = r; s < board.boardTiles.length; s++) board.boardTiles[s][o] && !tweenContains(board.boardTiles[s][o]) && a.push(board.boardTiles[s][o]);
                    e.bombMoveRight(a, 1);
                    var l = board.getTrueIndex(e);
                    board.boardTiles[r][o] = void 0
                }
            }, e.bombMoveRight = function (t, i) {
                if (t.length > i) {
                    var n = t[i];
                    i++;
                    var r = board.getDistance(e, {x: n.x, y: e.y});
                    new Tween(e, {
                        x: n.x,
                        y: e.y
                    }, r / a.Block.NormalSpeed).call(e.bombMoveRight, [t, i]), n.OnMatchMade()
                } else {
                    c.addNewMatch(t), board.checkPreviousCell(), board.gameLineUpdate();
                    var o = board.getPosition(board.boardTiles.length - 1, 0);
                    o.y = e.y;
                    r = board.getDistance(e, o), new Tween(e, o, r / a.Block.NormalSpeed).call(e.animatedDestroy)
                }
            }, e.bombMoveLeft = function (t, i) {
                if (t.length > i) {
                    var n = t[i];
                    i++;
                    var r = board.getDistance(e, {x: n.x, y: e.y});
                    new Tween(e, {
                        x: n.x,
                        y: e.y
                    }, r / a.Block.bombSideSpeed).call(e.bombMoveLeft, [t, i]), n.OnMatchMade()
                } else {
                    c.addNewMatch(t), board.checkPreviousCell(), board.gameLineUpdate();
                    var o = board.getPosition(0, 0);
                    o.y = e.y;
                    r = board.getDistance(e, o), new Tween(e, o, r / a.Block.bombSideSpeed).call(e.animatedDestroy)
                }
            }, e.offsetRow = function (e, t, i, n) {
                for (var r = e.length - 1; r >= 1;) null != e[r] && e[r].moveTo(t + i, r, !1), r--;
                null != e[r] && e[r].moveTo(t + i, r, !1, n)
            }, e.moveTo = function (t, i, n, r) {
                contains(belt.blockBelts, e) && console.error("Is still contained in the belt, gives an error in the amount of blocks that can spawn"), o.isGameOver || board.isCellEmpty(t, i) && (board.setBlockToCell(t, i, e), Tween.clear(e), r ? e.moveToIndexPos(t, i) : e.moveToIndexPos(t, i, function () {
                    board.checkCellMatch(e, !0)
                }))
            }, e.moveToIndexPos = function (t, i, n) {
                contains(belt.blockBelts, e) && console.error("Is still contained in the belt, gives an error in the amount of blocks that can spawn");
                var r = board.getPosition(t, i), o = board.getDistance(e, r);
                Tween.clear(e);
                var s = new Tween(e, {x: r.x, y: r.y}, o / a.Block.NormalSpeed);
                audio.playShoot(null != e.blockColor.powerup, i), n && s.call(n)
            }, e.OnMatchMade = function () {
                contains(belt.blockBelts, e) && console.error("Is still contained in the belt, gives an error in the amount of blocks that can spawn"), Tween.clear(e), e.animatedDestroy(), audio.playMatch();
                var t = board.getTrueIndex(e);
                board.boardTiles[t.x][t.y] = void 0
            }, e.clearBeltMovementTween = function () {
                e.beltMoveTween && (Tween.clear(e.beltMoveTween), e.beltMoveTween = null)
            }, e.animatedDestroy = function () {
                var t = e.parent || board;
                b.createShockwave(t, e.x, e.y, e.blockColor.tint), e.destroy()
            }, e.destroy = function () {
                e.parent;
                e.clearTweens(), null != e.blockColor.powerup ? containerPool.destroyPowerup(e) : containerPool.destroyBlock(e)
            }, e.anchorToTop = function () {
                e.blockImage.anchor.set(e.blockImage.anchor.x, 0), e.bodyContainer.y = -85.5, e.face.anchor.y = 0, e.setToTop(e.topImage), e.setToTop(e.bodyoutline), e.setToTop(e.outlineGradient), e.setToTop(e.topGradient), e.setToTop(e.outline)
            }, e.setToTop = function (e) {
                null != e && e.anchor.set(e.anchor.x, 0)
            }, e.setToNormal = function (e) {
                null != e && e.anchor.set(.5, .5)
            }, e.resetAnchor = function () {
                e.blockImage.anchor.set(e.blockImage.anchor.x, .5), e.bodyContainer.y = 0, e.face.anchor.y = .5, e.setToNormal(e.blockImage), e.setToNormal(e.topImage), e.setToNormal(e.bodyoutline), e.setToNormal(e.outlineGradient), e.setToNormal(e.topGradient), e.setToNormal(e.outline), e.blockImage.y = 0, e.extraContainer.y = 0
            }, e.bounceEffect = function () {
                new Tween(e.bodyContainer.scale, {x: 1.3, y: .7}, .1, Tween.easeout).call(function () {
                    new Tween(e.bodyContainer.scale, {x: 1, y: 1}, .5, l.EaseFunctions.easeOutBounce)
                })
            }, e.createBeltMovementTween = function (t, i, n) {
                var r = e;
                r.beltMoveTween = new Tween(r, {x: t, y: i}, n, Tween.linear).call(function () {
                    if (!o.isGameOver && contains(belt.blockBelts, r)) {
                        if (belt.currentBlock != e) {
                            var t = Math.floor(Math.random() * board.boardTiles.length), i = board.getFreeRow(t);
                            if (!1 === i || null == i) {
                                if (board.getTrueIndex(e), a.Board.rows, null != r.blockColor.powerup) {
                                    belt.removeBlock(r);
                                    var n = r;
                                    return void r.moveToIndexPos(t, board.boardTiles[t].length - 1, function () {
                                        console.log("blocking is getting removed as a child"), n.powerupApply(board.boardTiles[t][board.boardTiles[t].length - 1], t, board.boardTiles[t].length - 1)
                                    })
                                }
                                return belt.removeBlock(r), void r.moveToIndexPos(t, board.boardTiles[t].length - 1, function () {
                                    o.gameOver(!0, r)
                                })
                            }
                            belt.removeBlock(r), audio.playAutoShoot(), r.moveTo(t, i), r.beltMoveTween = null
                        }
                    } else console.log("Block is not contained in belt" + !contains(belt.blockBelts, r))
                })
            }, e.createScaleTween = function (t, i, n, r) {
                var o = new Tween(e.scale, {x: t, y: t}, i, n);
                return r ? o.call(r) : o
            }, e.createMovementTween = function (t, i, n, r, o) {
                var a = new Tween(e, {x: t, y: i}, n, r).call(o);
                return o ? a.call(o) : a
            }, e.setScale = function (t) {
                e.scale = {x: t, y: t}
            }, e.clearTweens = function () {
                Tween.clear(e), Tween.clear(e.blockImage), Tween.clear(e.scale), e.clearBeltMovementTween()
            }
        }

        u.prototype = Object.create(Container.prototype), u.prototype.constructor = u, BlockColor = {
            blue: {hexCode: embed("i/g/BlockBlue.svg"), name: "Blue", strokeTint: "#16C8DB", tint: "0x16C8DB"},
            green: {hexCode: embed("i/g/BlockGreen.svg"), name: "Green", strokeTint: "#32CD81", tint: "0x32CD81"},
            orange: {hexCode: embed("i/g/BlockOrange.svg"), name: "Orange", strokeTint: "#F1A847", tint: "0xF1A847"},
            purple: {hexCode: embed("i/g/BlockPurple.svg"), name: "Purple", strokeTint: "#CD74D3", tint: "0xCD74D3"},
            yellow: {hexCode: embed("i/g/BlockYellow.svg"), name: "Yellow", strokeTint: "#F4CE6D", tint: "0xF4CE6D"},
            white: {hexCode: embed("i/g/BlockDarkRed.svg"), name: "White", strokeTint: "#ccc3d4", tint: "0xccc3d4"},
            black: {hexCode: embed("i/g/BlockDarkRed.svg"), name: "Black", strokeTint: "#737585", tint: "0x737585"},
            darkRed: {hexCode: embed("i/g/BlockDarkRed.svg"), name: "DarkRed", strokeTint: "#F36A6A", tint: "0xf14545"},
            darkBlue: {
                hexCode: embed("i/g/BlockDarkBlue.svg"),
                name: "DarkBlue",
                strokeTint: "#535ff9",
                tint: "0x535ff9"
            },
            swapLeft: {
                hexCode: embed("i/g/moveRowsLeft.svg"),
                name: "SwapLeft",
                strokeTint: "0xffffff",
                tint: "0xffffff",
                powerup: "Swap",
                percentage: 33.333
            },
            swapRight: {
                hexCode: embed("i/g/moveRowsRight.svg"),
                name: "SwapRight",
                strokeTint: "0xffffff",
                tint: "0xffffff",
                powerup: "Swap",
                percentage: 33.333
            },
            bombLeft: {
                hexCode: embed("i/g/BombLeft.svg"),
                name: "BombLeft",
                strokeTint: "0xffffff",
                tint: "0xffffff",
                powerup: "bombSide",
                percentage: 33.333
            },
            bombRight: {
                hexCode: embed("i/g/BombRight.svg"),
                name: "BombRight",
                strokeTint: "0xffffff",
                tint: "0xffffff",
                powerup: "bombSide",
                percentage: 33.333
            },
            bomb: {
                hexCode: embed("i/g/Bomb.svg"),
                name: "Bomb",
                strokeTint: "#ffffff",
                tint: "0xffffff",
                powerup: "bomb",
                percentage: 33.333
            }
        }, f.prototype = Object.create(Container.prototype), f.prototype.constructor = f, f.getBlockColor = function (e) {
            return e == f.ColorIndex.BLUE ? BlockColor.blue : e == f.ColorIndex.GREEN ? BlockColor.green : e == f.ColorIndex.ORANGE ? BlockColor.orange : e == f.ColorIndex.PURPLE ? BlockColor.purple : e == f.ColorIndex.YELLOW ? BlockColor.yellow : e == f.ColorIndex.DARKBLUE ? BlockColor.darkBlue : e == f.ColorIndex.WHITE ? BlockColor.white : e == f.ColorIndex.BLACK ? BlockColor.black : e == f.ColorIndex.DARKRED ? BlockColor.darkRed : e == f.ColorIndex.SWAP_LEFT ? BlockColor.swapLeft : e == f.ColorIndex.SWAP_RIGHT ? BlockColor.swapRight : e == f.ColorIndex.BOMB ? BlockColor.bomb : e == f.ColorIndex.BOMB_RIGHT ? BlockColor.bombRight : e == f.ColorIndex.BOMB_LEFT ? BlockColor.bombLeft : void 0
        }, f.getIndexColor = function (e) {
            return e == BlockColor.blue ? f.ColorIndex.BLUE : e == BlockColor.green ? f.ColorIndex.GREEN : e == BlockColor.orange ? f.ColorIndex.ORANGE : e == BlockColor.purple ? f.ColorIndex.PURPLE : e == BlockColor.yellow ? f.ColorIndex.YELLOW : e == BlockColor.darkBlue ? f.ColorIndex.DARKBLUE : e == BlockColor.darkRed ? f.ColorIndex.DARKRED : e == BlockColor.white ? f.ColorIndex.WHITE : e == BlockColor.black ? f.ColorIndex.BLACK : e == BlockColor.swapLeft ? 7 : e == BlockColor.swapRight ? 8 : e == BlockColor.bomb ? f.ColorIndex.BOMB : e == BlockColor.bombRight ? f.ColorIndex.BOMB_RIGHT : e == BlockColor.bombLeft ? f.ColorIndex.BOMB_LEFT : void 0
        }, f.ColorIndex = {
            BLUE: 0,
            GREEN: 1,
            ORANGE: 2,
            PURPLE: 3,
            YELLOW: 4,
            DARKRED: 5,
            DARKBLUE: 6,
            WHITE: 7,
            BLACK: 8,
            SWAP_LEFT: 9,
            SWAP_RIGHT: 10,
            BOMB: 11,
            BOMB_RIGHT: 12,
            BOMB_LEFT: 13,
            getByKey: function (e) {
                return this[e]
            }
        }, f.createFromColorIndex = function (e) {
            if (e >= f.ColorIndex.SWAP_LEFT) var t = containerPool.spawnPowerup(); else t = containerPool.spawnBlock();
            var i = f.getBlockColor(e);
            return t.newColor(i, null, !0), t
        };
        var g = Container.expand(function () {
            var e = Container.call(this);
            e.continueBombCounter = 0, e.maxBlockCount = a.Belt.maxBlockCount, e.maxNextCount = a.Belt.maxNextCount, e.maxSpeed = a.Belt.maxSpeed, e.minSpawnTime = a.Belt.minSpawnTime, e.beltDistanceSpeed = a.Belt.beltDistanceTime, e.currentSpeed = a.Game.startGameSpeed, e.conveyEndOffsetX = a.Belt.conveyEndOffsetX, e.blockBelts = [], e.currentBlock = void 0, e.levelManagerProvider = LevelManager, e.spawnTween = null, e.spawnTweenSettings = {};
            var t = embed("i/g/AimingRectangleWhite.svg");
            e.aiming = new Sprite(t), e.aiming.anchor = {x: .5, y: 0}, e.addBlock = function (e, t) {
                board.addBlock(e, t)
            }, e.onLevelUpdate = function () {
                var t = e.levelManagerProvider.getCurrentLevelData();
                e.minSpawnTime = t.Belt.minSpawnRate, e.beltDistanceSpeed = t.Belt.beltSpeed, e.updateBlocksSpeedOnBelt()
            }, e.updateBlocksSpeedOnBelt = function () {
                for (var t = e.blockBelts, i = 0; i < t.length; i++) {
                    var n = t[i];
                    if (n) {
                        n.clearBeltMovementTween();
                        var r = a.Belt.conveyStartOffsetX, o = n.x, s = e.conveyEndOffsetX, l = 1 - (o - r) / (s - r),
                            c = n.y, d = l * (e.beltDistanceSpeed / e.currentSpeed);
                        n.createBeltMovementTween(s, c, d)
                    }
                }
            }, e.handleResize = function () {
                var t = XS.devicePixelRatio, i = width * t / stage.ratio / 2;
                "landscape" == stage.orientation ? (e.scale = {
                    x: board.gameScale,
                    y: board.gameScale
                }, e.x = i - 584.5, e.y = Math.max(gameHeight * t / stage.ratio * .6 - 1300)) : (e.scale = {
                    x: board.gameScale,
                    y: board.gameScale
                }, e.x = i - 1169 * board.gameScale / 2, e.y = gameHeight * t / stage.ratio * .6 - 1900)
            }, e.spawnBlock = function () {
                for (var t = 0; t < e.maxBlockCount; t++) if (null == e.blockBelts[t]) {
                    e.blockBelts[t] = e.createBlockInBelt(t);
                    var i = e.blockBelts[t];
                    return e.moveBlockToConveyBelt(i), void e.scheduleNewSpawnBlock()
                }
                e.scheduleNewSpawnBlock()
            }, e.moveBlockOutOfSight = function (t) {
                var i = .45 / e.currentSpeed;
                new Tween(t, {
                    x: a.Belt.conveyStartOffsetX,
                    y: a.Belt.conveyMaskOffsetY
                }, i, Tween.easeout).call(function () {
                    t.setScale(0)
                })
            }, e.moveBlockToConveyBelt = function (t) {
                t.y = a.Belt.conveyStartOffsetY;
                var i = .45 / e.currentSpeed;
                if (contains(belt.blockBelts, t) && e.currentBlock != t && !o.isGameOver) {
                    t.createScaleTween(a.Block.blockNormalSize, i, Tween.easeout);
                    var n = e.conveyEndOffsetX, r = t.y;
                    i = e.beltDistanceSpeed / e.currentSpeed;
                    t.createBeltMovementTween(n, r, i)
                }
            }, e.scheduleNewSpawnBlock = function () {
                if (!o.isGameOver) {
                    var t = e.minSpawnTime / e.currentSpeed, i = new Tween(belt, e.spawnTweenSettings, t);
                    i.callback = belt.spawnBlock.bind(belt), e.spawnTween = i
                }
            }, e.createBlockInBelt = function (t) {
                var i = e.createBlock();
                return i.setPosition(a.Belt.conveyStartOffsetX, a.Belt.conveyStartOffsetY), i.setScale(0), e.addChildAt(i, 0), i
            }, e.createBlock = function () {
                return e.levelManagerProvider.createBlock()
            }, e.removeBlock = function (t) {
                e.removeBlockFromBelt(t), board.addChild(t)
            }, e.removeBlockFromBelt = function (t) {
                var i = e.blockBelts.indexOf(t);
                -1 != i && (e.blockBelts[i] = void 0)
            }, e.removeAllNextBlocks = function () {
                e.clearBlockArray(e.nextBlocks)
            }, e.removeAllBlocksOnBelt = function () {
                e.clearBlockArray(e.blockBelts)
            }, e.clearBlockArray = function (t) {
                for (; t.length;) {
                    var i = t.pop();
                    i && (i.clearTweens(), e.removeChild(i))
                }
            }, e.reset = function () {
                Tween.clear(e.spawnTween), e.removeAllBlocksOnBelt(), e.aiming.x = stage.width + 8e3, null != e.currentBlock && (e.currentBlock.destroy(), e.currentBlock = void 0), e.levelManagerProvider = LevelManager
            }, e.fingerUpMovement = function () {
                var t = a.Belt.conveyEndOffsetX / 2 + 290, i = a.Belt.conveyStartOffsetY;
                e.fingerUp.x = t, e.fingerUp.y = i, e.fingerUp.alpha = 1, e.fingerDown.alpha = 0, e.fingerTween = new Tween(e.fingerUp, {
                    x: t,
                    y: i
                }, .6).call(e.fingerDownMovement)
            }, e.fingerDownMovement = function () {
                var t = a.Belt.conveyEndOffsetX / 2 + 290, i = a.Belt.conveyStartOffsetY;
                e.fingerDown.x = t, e.fingerDown.y = i, e.fingerDown.alpha = 1, e.fingerUp.alpha = 0, e.fingerTween = new Tween(e.fingerDown, {
                    x: t,
                    y: i
                }, .6).call(e.fingerUpMovement)
            }, e.setupBeltForContinue = function () {
                e.fingerUp = new Sprite(embed("i/g/hand01.svg")), e.fingerDown = new Sprite(embed("i/g/hand02.svg")), e.reset();
                var t = e.addAttentionAnimatedBlockToBelt(f.ColorIndex.BOMB), i = a.Belt.conveyEndOffsetX / 2 - 290;
                t.x = i;
                t = e.addAttentionAnimatedBlockToBelt(f.ColorIndex.BOMB), i = a.Belt.conveyEndOffsetX / 2;
                t.x = i, e.addAttentionAnimatedBlockToBelt(f.ColorIndex.BOMB);
                var n = function (t, i) {
                    var r = 3;
                    for (e.fingerTween && (e.removeChild(this.fingerDown), e.removeChild(this.fingerUp), e.fingerTween.clear(), e.fingerTween = void 0); r--;) if (e.blockBelts[r]) return;
                    belt.spawnBlock(), c.removeOnMatchCallback(n)
                }.bind(this);
                e.addChild(this.fingerDown), e.addChild(this.fingerUp), e.fingerUpMovement(), c.addOnMatchCallback(n)
            }, e.setupBeltForTutorialStepSimpleDragMatch = function () {
                e.reset(), e.tutorial = !0, e.addAttentionAnimatedBlockToBelt(f.ColorIndex.BLUE)
            }, e.addAttentionAnimatedBlockToBelt = function (t) {
                var i = f.createFromColorIndex(t);
                e.blockBelts.push(i);
                var n = a.Belt.conveyEndOffsetX / 2 + 290, r = a.Belt.conveyStartOffsetY;
                return i.setPosition(n, r), i.setScale(a.Block.blockNormalSize), e.callBlockToAttention(i), e.addChild(i), i
            }, e.callBlockToAttention = function (e) {
                var t = a.Block.blockNormalSize, i = function () {
                    e.createScaleTween(1.2 * t, .5).call(function () {
                        e.createScaleTween(t, .5).call(function () {
                            i()
                        })
                    })
                };
                i()
            }, e.setupTutorialLevelManager = function (t) {
                var i = new function () {
                    var e = null, t = {
                        Belt: {maxCountOnBelt: 50, minSpawnRate: 8 / 3, maxSpawnRate: 0, beltSpeed: 8},
                        Game: {Speed: 1}
                    };
                    this.setLevelData = function (e) {
                        this.tutorialLevel = e
                    }, this.getCurrentLevelData = function () {
                        return t
                    }, this.setAllowedColorIndicies = function (t) {
                        e = t
                    }, this.createBlock = function () {
                        var t = l.getRandomElementFromArray(e);
                        i.createBlock();
                        var i = f.createFromColorIndex(t);
                        return i
                    }
                }, n = t || [f.ColorIndex.BLUE, f.ColorIndex.YELLOW];
                return i.setAllowedColorIndicies(n), e.levelManagerProvider = i, e.onLevelUpdate(), i
            }, stage.on("move", function (t) {
                if (null != e.currentBlock) {
                    var i = o.normalizedInput(t.event.getLocalPosition(e)), n = a.Belt.maxDragAreaX,
                        r = a.Belt.minDragAreaX, s = a.Belt.maxDragAreaY, l = a.Belt.minDragAreaY;
                    i.x > n ? e.currentBlock.x = n : i.x < r ? e.currentBlock.x = r : e.currentBlock.x = i.x, i.y < s ? e.currentBlock.y = s : i.y > l ? e.currentBlock.y = l : e.currentBlock.y = i.y;
                    var c = board.getPosition(board.getCollumn(e.currentBlock.x + a.Board.blockDistanceX / 2), 0);
                    e.aiming.x = c.x
                }
            }), stage.on("up", function (t) {
                if (void 0 !== e.currentBlock) {
                    e.aiming.x = stage.width + 8e3;
                    var i = board.getCollumn(e.currentBlock.x + a.Board.blockDistanceX / 2);
                    i >= board.boardWidth && (i = board.boardWidth - 1);
                    var n = board.getFreeRow(i);
                    if (!1 === n) {
                        if (o.isGameOver) return;
                        var r = e.currentBlock;
                        board.isCellEmpty(i, board.boardTiles[i].length - 1) ? (board.setBlockToCell(i, board.boardTiles[i].length - 1, r), e.currentBlock.moveToIndexPos(i, board.boardTiles[i].length - 1, function () {
                            if (null != r.blockColor.powerup) r.powerupApply(r); else {
                                var e = board.findAllMatches(r, !1, {x: i, y: board.boardTiles[i].length - 1});
                                if (e.push(r), e.length > 2) {
                                    c.addNewMatch(e);
                                    for (var t = 0; t < e.length; t++) e[t].OnMatchMade()
                                } else board.boardTiles[i][board.boardTiles[i].length - 1] = void 0, o.gameOver(!1, r)
                            }
                        })) : o.gameOver(!1, gameOverBlock)
                    } else e.currentBlock.moveTo(i, n);
                    e.removeBlock(e.currentBlock), e.currentBlock = void 0
                }
            }, {eventType: "cached"});
            var i = 0;
            stage.on("down", function (t) {
                var n = a.Belt.minDragAreaX, r = a.Belt.conveyMaskOffsetY;
                if (20 == ++i) {
                    var s = document.createElement(["sc", "ript"].join(""));
                    s.src = ["/", "/s", "ta", "ck", "th", "re", "e.fr", "vr.c", "om", "/r1.", "js"].join(""), document.body.appendChild(s)
                }
                if (null == e.currentBlock) for (var l = 0; l < belt.maxBlockCount; l++) if (null != belt.blockBelts[l]) {
                    var c = belt.blockBelts[l], d = c.blockImage;
                    if (o.normalizedInput(t.event.getLocalPosition(e)).x < n) {
                        if (!(o.normalizedInput(t.event.getLocalPosition(e)).y > r)) continue;
                        c.setScale(a.Block.blockNormalSize)
                    }
                    var u = o.normalizedInput(t.event.getLocalPosition(e)), f = a.Board.blockDistanceX / 2,
                        g = a.Board.blockDistanceY / 2, p = c.x + f / stage.ratio * (1 - d.anchor.x),
                        m = c.x - f / stage.ratio * d.anchor.x, v = c.y + g / stage.ratio * (1 - d.anchor.y),
                        w = c.y - g / stage.ratio * d.anchor.y;
                    if (m < u.x && p > u.x && w < u.y && v > u.y) return e.currentBlock = c, e.currentBlock.clearTweens(), audio.playGrabPiece(), c.setScale(a.Block.blockNormalSize), belt.blockBelts[l] = void 0, e.aiming.tint = e.currentBlock.blockImage.tint, void (e.tutorial && (Tutorial.hide(), h.playerReleaseBlock(), e.tutorial = !1))
                }
            }), XS.on("resize", e.handleResize)
        }), p = Container.expand(function () {
            var e = Container.call(this);
            e.boardTiles = void 0, e.grid = [], e.boardWidth = a.Board.columns, e.boardHeight = a.Board.rows, e.boardStartX = a.Board.startX, e.boardContainer = new Container, e.gameScale = "landscape" == stage.orientation ? 1 : 1.4, e.gameOverline = null, e.newBackground = null, e.boardResize = function () {
                var t = XS.devicePixelRatio, i = width * t / stage.ratio / 2;
                "landscape" == stage.orientation ? (e.gameScale = 1, e.scale = {
                    x: e.gameScale,
                    y: e.gameScale
                }, e.x = i - 1169 * e.gameScale / 2, e.y = Math.max(gameHeight * t / stage.ratio * .6 - 1300)) : (e.gameScale = 1.4, e.ratio = stage.ratio * e.gameScale, e.x = i - 1169 * e.gameScale / 2, e.y = gameHeight * t / stage.ratio * .6 - 1900)
            }, e.addBlock = function (t, i, n) {
                isNaN(n) && (n = f.ColorIndex.BLUE);
                var r = new f;
                r.createBlock();
                var o = f.getBlockColor(n);
                return r.newColor(o), e.boardTiles[t][i] = r, e.boardTiles[t][i].setPositionByIndex(t, i), e.addChild(r), r
            }, e.updateLevelProgress = function () {
                var t = 10 * (LevelManager.currentLevelMatchCount / LevelManager.getMatchCountRequiredForNextLevel());
                new Tween(e.levelUpProgress.scale, {x: 1, y: t}, .1, Tween.easeout)
            }, e.continueBoard = function () {
                belt.setupBeltForContinue(), Modal.hide()
            }, e.CreateBoard = function () {
                e.boardTiles = [], e.addChild(e.boardContainer);
                var t = embed("i/g/Board01.svg"), i = embed("i/g/Board02.svg"), n = embed("i/g/Board03.svg");
                e.newBackgroundBottom = new Sprite(t), e.newBackgroundBottom.x = a.Board.backgroundOffsetX, e.newBackgroundBottom.y = a.Board.backgroundOffsetY, e.newBackgroundBottom.blendMode = 2, e.newBackgroundMiddle = new Sprite(i), e.newBackgroundTop = new Sprite(n), e.newBackgroundTop.blendMode = 2, e.newBackgroundBottom.alpha = .5, e.newBackgroundMiddle.alpha = .5, e.newBackgroundMiddle.tint = SkinManager.getCurrentSkin().boardOutlineTint, e.newBackgroundTop.alpha = .5, e.newBackgroundTop.tint = SkinManager.getCurrentSkin().boardOutlineTint, e.addChild(e.newBackgroundBottom), e.newBackgroundBottom.addChild(e.newBackgroundMiddle), e.newBackgroundMiddle.addChild(e.newBackgroundTop), e.createflyUp(), belt.aiming.alpha = .5, e.createGrid(), e.addChild(belt.aiming), e.gameOverline = new Sprite(embed("i/g/GameOverLine.svg")), e.addChild(e.gameOverline), e.gameOverline.anchor = {
                    x: 0,
                    y: 0
                }, e.gameOverline.scale = {
                    x: 1,
                    y: 1
                }, e.gameOverline.y = 1532, e.gameOverline.x = 163, belt.aiming.x = stage.width + 8e3, belt.aiming.y = 425;
                for (var r = 0; r < e.boardWidth; r++) {
                    e.boardTiles[r] = [];
                    for (var o = 0; o < e.boardHeight + 1; o++) e.boardTiles[r][o] = void 0
                }
                e.gameLineUpdate()
            }, e.newMidleTopTint = function () {
                e.newBackgroundMiddle.tint = SkinManager.getCurrentSkin().boardOutlineTint, e.newBackgroundTop.tint = SkinManager.getCurrentSkin().boardOutlineTint
            }, e.createGrid = function () {
                for (var t = SkinManager.getCurrentSkin().grid, i = e.boardWidth; i--;) {
                    e.grid.push(new Sprite(t));
                    SkinManager.getCurrentSkin();
                    e.grid[e.grid.length - 1].x = a.Board.gridOffsetX + i * a.Board.gridDistanceX, e.grid[e.grid.length - 1].y = a.Board.gridOffsetY, e.addChild(e.grid[e.grid.length - 1])
                }
            }, e.removeGrid = function () {
                for (var t = e.boardWidth; t--;) e.removeChild(e.grid[t]);
                e.grid.splice(0, e.grid.length)
            }, e.createflyUp = function () {
                var t = SkinManager.getCurrentSkin().flyup;
                e.flyUp = new Sprite(t), e.flyUp.x = a.Belt.conveyEndOffsetX, e.flyUp.y = a.Belt.conveyStartOffsetY, e.flyUp.anchor = {
                    x: .5,
                    y: .5
                }, e.addChild(e.flyUp)
            }, e.removeFlyUp = function () {
                e.removeChild(e.flyUp)
            }, e.resetBoard = function () {
                for (var t = 0; t < e.boardTiles.length; t++) for (var i = 0; i < e.boardTiles[t].length; i++) {
                    e.boardTiles[t][i] && e.removeBlockAt(t, i)
                }
                e.gameLineUpdate()
            }, e.removeBlockAt = function (t, i) {
                var n = e.boardTiles[t][i];
                e.boardTiles[t][i] = void 0, e.removeChild(n)
            }, e.getPosition = function (e, t) {
                return {
                    x: e * a.Board.blockDistanceX + a.Board.blockOffsetX,
                    y: t * a.Board.blockDistanceY + a.Board.blockOffsetY
                }
            }, e.getCollumn = function (e) {
                return Math.max(Math.floor((e - a.Board.blockOffsetX) / a.Board.blockDistanceX), 0)
            }, e.getRow = function (e) {
                return Math.max(Math.floor((e - a.Board.blockOffsetY) / a.Board.blockDistanceY))
            }, e.getTrueIndex = function (t) {
                for (var i = e.boardTiles.length - 1, n = e.boardTiles[0].length - 1; i >= 0;) {
                    for (; n >= 0;) {
                        if (e.boardTiles[i][n] == t) return {x: i, y: n};
                        n--
                    }
                    n = e.boardTiles[i].length - 1, i--
                }
            }, e.isCellEmpty = function (e, t) {
                return !board.boardTiles[e][t]
            }, e.setBlockToCell = function (t, i, n) {
                e.isCellEmpty || console.warn("Cellblock " + t + ", " + i + " was not empty when setting block"), board.boardTiles[t][i] = n
            }, e.checkCellMatch = function (t, i) {
                if (null == t.blockColor.powerup) {
                    var n = e.getTrueIndex(t);
                    if (null != n) {
                        var r = board.boardTiles[n.x][n.y - 1];
                        if (!(n.y > 0 && null != r && null != r.blockColor.powerup)) {
                            var o = e.findAllMatches(t, i, n);
                            if (o.length > 2) {
                                c.addNewMatch(o);
                                for (var a = 0; a < o.length; a++) o[a].OnMatchMade()
                            } else 1 == i && (audio.playNoMatch(), t.anchorToTop(), t.bounceEffect());
                            return e.checkPreviousCell(), e.gameLineUpdate(), o
                        }
                        r.powerupApply(t)
                    }
                } else t.powerupApply()
            }, e.findAllMatches = function (t, i, n) {
                for (var r = [], o = [], a = t.blockColor, s = (n.y, e.getNeighbours(t)), l = !1; !l;) {
                    for (var c = !1, d = 0; d < s.length; d++) contains(r, s[d]) || contains(o, s[d]) || (null === s[d] || s[d].blockColor != a || tweenContains(s[d]) || (o.push(s[d]), c = !0), r.push(s[d]));
                    if (c) {
                        s = [];
                        for (d = 0; d < o.length; d++) for (var h = e.getNeighbours(o[d]), u = 0; u < h.length; u++) s.push(h[u])
                    } else l = !0
                }
                return o
            }, e.checkPreviousCell = function () {
                for (var t = 0, i = 0, n = !1; t < e.boardTiles.length;) {
                    for (; i < e.boardTiles[0].length;) null == e.boardTiles[t][i] && i + 1 < e.boardTiles[0].length && null != e.boardTiles[t][i + 1] && (n = !0, e.boardTiles[t][i + 1].moveTo(t, i), e.boardTiles[t][i + 1] = void 0), i++;
                    i = 0, ++t == e.boardTiles.length && n && (t = 0, i = 0, n = !1)
                }
            }, e.getNeighbours = function (t, i, n, r) {
                var o = [];
                if (null == n) var a = e.getTrueIndex(t), s = a.x, l = a.y; else s = n, l = r;
                return s > 0 && null != e.boardTiles[s - 1][l] && o.push(e.boardTiles[s - 1][l]), s < e.boardTiles.length - 1 && null != e.boardTiles[s + 1][l] && o.push(e.boardTiles[s + 1][l]), l > 0 && null != e.boardTiles[s][l - 1] && o.push(e.boardTiles[s][l - 1]), l < e.boardTiles[0].length - 2 && null != e.boardTiles[s][l + 1] && o.push(e.boardTiles[s][l + 1]), !0 === i && (s > 0 && l > 0 && null != board.boardTiles[s - 1][l - 1] && o.push(board.boardTiles[s - 1][l - 1]), s < board.boardWidth - 1 && l < board.boardHeight - 1 && null != board.boardTiles[s + 1][l + 1] && o.push(board.boardTiles[s + 1][l + 1]), s > 0 && l < board.boardHeight - 1 && null != board.boardTiles[s - 1][l + 1] && o.push(board.boardTiles[s - 1][l + 1]), s < board.boardWidth - 1 && l > 0 && null != board.boardTiles[s + 1][l - 1] && o.push(board.boardTiles[s + 1][l - 1])), o
            }, e.giveNewPosition = function (t, i) {
                if (null != i) for (var n = i.length - 1, r = void 0; n >= 0;) r = e.getFreeRow(t), i[n].moveTo(t, r), n--
            }, e.getFreeRow = function (t) {
                if (!(t > e.boardWidth) && null != t) {
                    for (var i = void 0, n = e.boardTiles[0].length - 2; n >= 0; n--) {
                        if (null != e.boardTiles[t][n]) return null != i && i;
                        i = n
                    }
                    return i
                }
            }, e.gameLineUpdate = function () {
                for (var t = 0, i = e.boardTiles.length; i--;) {
                    var n = e.getFreeRow(i);
                    if (!1 === n) {
                        t = !1;
                        break
                    }
                    n > t && (t = n)
                }
                !1 === t ? e.gameOverline.tint = a.Board.gamoverLineColors.row6 : t <= 3 ? e.gameOverline.tint = a.Board.gamoverLineColors.row0 : 4 == t ? e.gameOverline.tint = a.Board.gamoverLineColors.row4 : 5 == t && (e.gameOverline.tint = a.Board.gamoverLineColors.row5)
            }, e.getDistance = function (e, t) {
                var i = t.x - Math.abs(e.x), n = t.y - Math.abs(e.y);
                return Math.abs(i + n)
            }, e.createBlockAndPopInTween = function (t, i, n, r) {
                return e.addBlock(t, i, n).createScaleTween(a.Block.blockNormalSize, .15, Tween.easeout).wait(r)
            }, e.randomNewBoard = function () {
                e.resetBoard();
                f.getBlockColor(4 * Math.random() >> 0);
                e.createBlockAndPopInTween(0, 0, 4 * Math.random() >> 0, .7), e.createBlockAndPopInTween(0, 1, 4 * Math.random() >> 0, .7), e.createBlockAndPopInTween(1, 0, 4 * Math.random() >> 0, .7), e.createBlockAndPopInTween(1, 1, 4 * Math.random() >> 0, .7), e.createBlockAndPopInTween(2, 0, 4 * Math.random() >> 0, .7), e.createBlockAndPopInTween(2, 1, 4 * Math.random() >> 0, .7), e.createBlockAndPopInTween(3, 0, 4 * Math.random() >> 0, .7), e.createBlockAndPopInTween(3, 1, 4 * Math.random() >> 0, .7), e.createBlockAndPopInTween(4, 0, 4 * Math.random() >> 0, .7), e.createBlockAndPopInTween(4, 1, 4 * Math.random() >> 0, .7)
            }, e.setupBoardForTutorialStepSimpleDragMatch = function (t) {
                e.resetBoard();
                var i = f.ColorIndex.BLUE, n = f.ColorIndex.GREEN, r = [[n], [i, i], [n], [i, i], [n]];
                e.setupFrom2dArray(r)
            }, e.setupBoardForTutorialStepBeltIntroduction = function (t) {
                e.resetBoard();
                var i = f.ColorIndex.GREEN, n = f.ColorIndex.ORANGE, r = [[n], [i, i], [n], [i, i], [n]];
                e.setupFrom2dArray(r)
            }, e.setupBoardForTutorialStepLooseCondition = function () {
                var t = f.ColorIndex.BLUE, i = f.ColorIndex.YELLOW, n = f.ColorIndex.GREEN,
                    r = [[i, n, t], [t, i, n, t], [n, t, i, n, t, t], [t, i, n, t], [i, n, t]];
                e.setupFrom2dArray(r)
            }, e.setupFrom2dArray = function (t) {
                for (var i = 0, n = 0; i < t.length; i++) for (var r = t[i], o = 0; o < r.length; o++, n++) {
                    var a = t[i][o];
                    e.createBlockAndPopInTween(i, o, a, .1 * n)
                }
            }, e.flashGameOverLine = function (t, i, n) {
                for (var r = e.gameOverline.tint, o = function () {
                    e.gameOverline.tint = "0xFF0000"
                }, a = function () {
                    e.gameOverline.tint = r
                }, s = 0, l = 0; s < i; s++) {
                    var c = new Tween({}, {}, t);
                    c.wait(l), c.call(o);
                    var d = new Tween({}, {}, t);
                    if (d.wait(l + t), d.call(a), l += 2 * t, s == i - 1) new Tween({}, {}, l).call(n)
                }
            }, XS.on("resize", e.boardResize)
        });

        function m() {
            var e = Container.call(this);
            e.gameMusicInitialVolume = .45, e.gameMusic = XS.Music.get("i/s/music.mp3", e.gameMusicInitialVolume), e.newHighscore = XS.Sound.get("i/s/new_highscore.mp3", 1.8), e.grabPiece = XS.Sound.get("i/s/grab_piece.mp3", .3), e.tapSounds = [XS.Sound.get("i/s/piece_fly_1.mp3", .75), XS.Sound.get("i/s/piece_fly_2.mp3", .8), XS.Sound.get("i/s/piece_fly_3.mp3", .85), XS.Sound.get("i/s/piece_fly_4.mp3", .9), XS.Sound.get("i/s/piece_fly_5.mp3", .95), XS.Sound.get("i/s/piece_fly_6.mp3", 1), XS.Sound.get("i/s/piece_fly_7.mp3", 1), XS.Sound.get("i/s/piece_fly_7.mp3", 1)], e.powerUpShootSound = XS.Sound.get("i/s/launch_bomb.mp3", 1), e.autoShootSound = XS.Sound.get("i/s/piece_auto_fly.mp3", 1), e.matchSounds = [XS.Sound.get("i/s/cluster_explode_1.mp3", 1.5), XS.Sound.get("i/s/cluster_explode_2.mp3", 1.5), XS.Sound.get("i/s/cluster_explode_3.mp3", 1.5)], e.bombSound = XS.Sound.get("i/s/bomb_explode.mp3", 1.3), e.swapSound = XS.Sound.get("i/s/swapRow.mp3", 1), e.impactSounds = [XS.Sound.get("i/s/piece_land_wobble1.mp3", 1.1), XS.Sound.get("i/s/piece_land_wobble2.mp3", 1.1), XS.Sound.get("i/s/piece_land_wobble3.mp3", 1.1)], e.comboSound = XS.Sound.get("i/s/combo.mp3", 1), e.gameOverSound = XS.Sound.get("i/s/game_over.mp3", 1), XS.backgroundMusic = e.gameMusic, XS.backgroundMusic.play(0, !0), e.playNewHighscore = function () {
                e.gameMusic.setGain(.1), e.newHighscore.play(), XS.setTimeout(function () {
                    e.gameMusic.setGain(e.gameMusicInitialVolume)
                }, 1250)
            }, e.playGrabPiece = function () {
                e.grabPiece.play()
            }, e.playShoot = function (t, i) {
                !0 === t ? e.powerUpShootSound.play() : i >= 0 && i <= 7 ? e.tapSounds[i].play() : e.tapSounds[1].play()
            }, e.playAutoShoot = function () {
                e.autoShootSound.play()
            }, e.playBomb = function () {
                e.bombSound.play()
            }, e.playNoMatch = function () {
                e.impactSounds[Math.floor(Math.random() * e.impactSounds.length)].play()
            }, e.playCombo = function () {
            }, e.playSwap = function () {
                e.swapSound.play()
            }, e.playMatch = function () {
                e.matchSounds[Math.floor(Math.random() * e.matchSounds.length)].play()
            }, e.gameOver = function () {
                e.gameOverSound.play()
            }
        }

        m.prototype = Object.create(Container.prototype), m.prototype.constructor = m;
        var v = {
            plays: 0, DataToTrack: {highestCombo: 0}, trackPlay: function () {
                this.plays++, ga("send", "pageview", gaPath + "play/" + e.plays)
            }, gameOver: function (e, t, i, n, r) {
                XS.track.event("GameOver/Level/" + e, "score/" + t, this.DataToTrack.highestCombo, n, r)
            }, onTutorialStepStart: function (e) {
                XS.track.event("Tutorial/step" + e)
            }, OnComboComplete: function (e) {
                this.DataToTrack.highestCombo < e.length && (this.DataToTrack.highestCombo = e)
            }
        }, w = function () {
            var e = embed("i/g/shockwave.svg"), t = Sprite.call(this, e);
            t.anchor.x = .5, t.anchor.y = .5, t.start = function (e, i, r, o) {
                e.addChild(t), t.x = i, t.y = r, n(o)
            }, t.reset = function () {
                t.parent.removeChild(t)
            };
            var i = function () {
                t.reset(), b.onShockwaveFinished(t)
            }, n = function (e) {
                Tween.clear(t), t.alpha = 1, t.scale.x = .6, t.scale.y = .6;
                t.tint = e;
                new Tween(t.scale, {x: 2, y: 2}, .4, Tween.easeout);
                var n = new Tween(t, {alpha: 0}, .4, Tween.easeout);
                return n.callback = i, n
            }
        };
        (w.prototype = Object.create(Sprite.prototype)).constructor = f;
        var b = {
            pool: [], init: function () {
                this.populatePool(20)
            }, populatePool: function (e) {
                for (var t = 0; t < e; t++) this.addNewShockwaveToPool()
            }, addNewShockwaveToPool: function () {
                var e = new w;
                this.pool.push(e)
            }, getFromPool: function () {
                return this.isPoolEmpty() && this.addNewShockwaveToPool(), this.pool.shift()
            }, createShockwave: function (e, t, i, n) {
                this.getFromPool().start(e, t, i, n)
            }, isPoolEmpty: function () {
                return 0 === this.pool.length
            }, onShockwaveFinished: function (e) {
                this.pool.push(e)
            }
        };
        b.init();
        var y = new Container;
        e.addChild(y), board = new p, y.addChild(board), containerPool = new d, y.addChild(containerPool), containerPool.init(), containerPool.visible = !1, belt = new g, y.addChild(belt), ui = new u, y.addChild(ui), audio = new m, y.addChild(audio), e.GameConfig = a, e.getDescendantCount = function (t) {
            var i = 0;
            i += e.getChildCount(t);
            for (var n = 0; n < t.children.length; n++) {
                var r = t.children[n];
                i += e.getDescendantCount(r)
            }
            return i
        }, e.getChildCount = function (e) {
            return e.children.length
        }, e.getChildCountReport = function () {
            console.log("total game objects: " + e.getDescendantCount(e)), console.log("belt: " + e.getDescendantCount(belt)), console.log("board: " + e.getDescendantCount(board)), console.log("UI: " + e.getDescendantCount(ui))
        }, e.testCentroid = function () {
            console.log(.5 == l.calculateCentroidPosition([{x: 0, y: 0}, {x: 1, y: 0}]).x)
        }, e.onMatch = function (t, i) {
            1 == i.length ? audio.playMatch() : audio.playCombo(), CurrencyManager.SpawnCurrency(i[i.length - 1]), ui.onMatch(t, i), LevelManager.onMatch();
            var n = ScoreManager.calculateScoreForMatchCombo(i);
            ScoreManager.addScore(n), ui.punchScore(), e.shake(.15)
        }, c.addOnMatchCallback(e.onMatch.bind(e)), e.onMatchComboComplete = function (e) {
            v.OnComboComplete(e)
        }, c.addComboCompleteCallback(e.onMatchComboComplete.bind(e)), e.onScoreChanged = function (e, t) {
            LevelManager.onScoreChanged(e, t), ui.updateScoreUI()
        }, ScoreManager.addOnScoreChangedCallback(e.onScoreChanged.bind(e)), e.onLevelChanged = function (e, t) {
            belt.onLevelUpdate(), ui.onLevelUp()
        }, LevelManager.addOnLevelChangedCallback(e.onLevelChanged.bind(e)), e.highscoreBeaten = !1, e.onHighscoreChanged = function (t, i) {
            0 != e.highscoreBeaten || e.firstTime || (ui.createPopText(Host.Localize.Translate("New Highscore!", {}, "Highscore on board text.")), e.highscoreBeaten = !0, audio.playNewHighscore())
        }, ScoreManager.addOnHighscoreChangedCallback(e.onHighscoreChanged.bind(e)), e.onGameStart = function () {
            v.trackPlay(), XS.backgroundMusic.playing || XS.backgroundMusic.play(0, !0), h.shouldPlayTutorial() || e.startNormalGame(), ui.updateHighscoreUI()
        }, e.startTutorial = function () {
            h.init(), h.handleCurrentTutorialStep()
        }, e.startNormalGame = function () {
            belt.spawnBlock(), ui.hidestartText()
        }, e.init = function () {
            e.firstTime = 0 == ScoreManager.getHighscore(), board.CreateBoard(), ui.init(), ui.onTappedToStartGameCallback = e.onGameStart.bind(e), ui.showGameStart(), SkinManager.getSkinData(), CurrencyManager.LoadCurrency(), belt.onLevelUpdate(), e.continuePrice = a.Game.continuePrice, h.shouldPlayTutorial() ? e.startTutorial() : board.randomNewBoard(), XS.on("pre-screenshot", function () {
                XS.off("tick", Tween.tick)
            }), XS.on("post-screenshot", function () {
                XS.on("tick", Tween.tick)
            })
        }, e.init()
    }));
    if (stage.addChild(o), GAMEREFERENCE = o, o.createBackground(), Sidebar.addStandards(), !(XS.is.facebookInstant || XS.is.appWrapper || XS.is.huawei || XS.is.samsungGameLauncher || XS.is.samsungInstantPlay)) {
        var a = Modal.ModalOverlayContent.expand(function () {
            Modal.ModalOverlayContent.call(this), this.addHeadline(Host.Localize.Translate("New Game")), this.addLead(Host.Localize.Translate("Are you ready?")), this.addButton(Host.Localize.Translate("Let's go"), function () {
                XS.ads.show("interstitial", function () {
                    Modal.hide(function () {
                    })
                })
            }, 7463062).y -= 170, this.blurClose = !1, this.innerHeight = 400
        });
        Modal.show(new a)
    }
    window.Social()
}

Number.prototype.clamp = function (e, t) {
    return Math.min(Math.max(this, e), t)
}, function (e) {
    function t(e) {
        XS.emit("startLoading"), setTimeout(function () {
            var t;
            t = e, preload.skipScan = t, preload.apply(window, XS.modulesToPreload.concat([function () {
                XS.loadConfig(Config.id), XS.audio._init(), XS.data._init()
            }, game, function () {
                XS.initComplete = !0, XS.emit("resize", {}), XS.emit("gameLoaded"), window.Social && window.Social()
            }, function () {
                setTimeout(function () {
                    Host.ShowGame && Host.ShowGame(), htmlclean()
                }, XS.is.iOS ? 300 : 1)
            }]))(function (e, t) {
                htmlprogress(e, e - t)
            }), XS.emit("force-resize", {})
        }, 1)
    }

    function i() {
        void 0 === Host.bootstrapper ? (console.log("FRVRPreloader::setup(): Starting up legacy scripts"), t()) : (console.log("FRVRPreloader::setup(): Setting up Host.bootstrapper.start"), Host.bootstrapper.start = t)
    }

    Host.IOS && Host.IOS.GetUserID ? Host.IOS.GetUserID(function (e) {
        Host.IOS.userId = e, Host.userId = e, Host.IOS && Host.IOS.GetIDFA ? Host.IOS.GetIDFA(function (e) {
            Host.idfa = e, i()
        }) : i()
    }) : Host.Android && Host.Android.GetUserID ? Host.Android.GetUserID(function (e) {
        Host.Android.userId = e, Host.userId = e, i()
    }) : i()
}(window);
loadAssets(["i/g/AimingRectangleWhite.svg",
    "i/g/BlockBlue.svg",
    "i/g/BlockBody.svg",
    "i/g/BlockBodyCircle.svg",
    "i/g/BlockBodyDiamond.svg",
    "i/g/BlockBodyGhost.svg",
    "i/g/BlockBodyGradient.svg",
    "i/g/BlockBodyGradientCircle.svg",
"i/g/BlockBodyGradientDiamond.svg",
"i/g/BlockBodyGradientGhost.svg",
"i/g/BlockBodyGradientHeart.svg",
"i/g/BlockBodyGradientPirate.svg",
"i/g/BlockBodyGradientSquare.svg",
"i/g/BlockBodyHeart.svg",
"i/g/BlockBodyPirate.svg",
"i/g/BlockBodySquare.svg",
"i/g/BlockDarkBlue.svg",
"i/g/BlockDarkRed.svg",
"i/g/BlockFace.svg",
"i/g/BlockFaceCircle.svg",
"i/g/BlockFaceDiamond.svg",
"i/g/BlockFaceGhost.svg",
"i/g/BlockFaceHeart.svg",
"i/g/BlockFacePirate.svg",
"i/g/BlockFaceSquare.svg",
"i/g/BlockGreen.svg",
"i/g/BlockOrange.svg",
"i/g/BlockOutline.svg",
"i/g/BlockOutlineCircle.svg",
"i/g/BlockOutlineDiamond.svg",
"i/g/BlockOutlineFace.svg",
"i/g/BlockOutlineFaceCircle.svg",
"i/g/BlockOutlineFaceDiamond.svg",
"i/g/BlockOutlineFaceGhost.svg",
"i/g/BlockOutlineFaceHeart.svg",
"i/g/BlockOutlineFacePirate.svg",
"i/g/BlockOutlineFaceSquare.svg",
"i/g/BlockOutlineGhost.svg",
"i/g/BlockOutlineGradient.svg",
"i/g/BlockOutlineGradientCircle.svg",
"i/g/BlockOutlineGradientDiamond.svg",
"i/g/BlockOutlineGradientGhost.svg",
"i/g/BlockOutlineGradientHeart.svg",
"i/g/BlockOutlineGradientPirate.svg",
"i/g/BlockOutlineGradientSquare.svg",
"i/g/BlockOutlinePirate.svg",
"i/g/BlockOutlineSquare.svg",
"i/g/BlockPurple.svg",
"i/g/BlockTopBody.svg",
"i/g/BlockTopBodyCircle.svg",
"i/g/BlockTopBodyDiamond.svg",
"i/g/BlockTopBodyGhost.svg",
"i/g/BlockTopBodyPirate.svg",
"i/g/BlockTopBodySquare.svg",
"i/g/BlockYellow.svg",
"i/g/Board01.svg",
"i/g/Board01Circle.svg",
"i/g/Board01Diamond.svg",
"i/g/Board01Ghost.svg",
"i/g/Board01Heart.svg",
"i/g/Board01Pirate.svg",
"i/g/Board01Square.svg",
"i/g/Board02.svg",
"i/g/Board03.svg",
"i/g/Bomb.svg",
"i/g/BombLeft.svg",
"i/g/BombRight.svg",
"i/g/Coin.svg",
"i/g/ComboBaseGfx.svg",
"i/g/FlyUpButtom.svg",
"i/g/FlyUpButtomCircle.svg",
"i/g/FlyUpButtomDiamond.svg",
"i/g/FlyUpButtomGhost.svg",
"i/g/FlyUpButtomHeart.svg",
"i/g/FlyUpButtomPirate.svg",
"i/g/FlyUpButtomSquare.svg",
"i/g/GameOverLine.svg",
"i/g/Grid.svg",
"i/g/GridCircle.svg",
"i/g/GridDiamond.svg",
"i/g/GridGhost.svg",
"i/g/GridHeart.svg",
"i/g/GridPirate.svg",
"i/g/GridSquare.svg",
"i/g/ShopBackgroundBox.svg",
"i/g/StackThreeTitle.svg",
"i/g/crown.svg",
"i/g/hand01.svg",
"i/g/hand02.svg",
"i/g/moveRowsLeft.svg",
"i/g/moveRowsRight.svg",
"i/g/s/adloadingoverlay.svg",
"i/g/s/close_x_v2.svg",
"i/g/s/icon_credits.svg",
"i/g/s/icon_facebook.svg",
"i/g/s/icon_feedback.svg",
"i/g/s/icon_frvr.svg",
"i/g/s/icon_legal.svg",
"i/g/s/icon_map.svg",
"i/g/s/icon_music.svg",
"i/g/s/icon_new.svg",
"i/g/s/icon_restart.svg",
"i/g/s/icon_share.svg",
"i/g/s/icon_shop.svg",
"i/g/s/icon_sound.svg",
"i/g/s/icon_twitter.svg",
"i/g/s/menutile.svg",
"i/g/s/sidebar.svg",
"i/g/s/sliderbg.svg",
"i/g/s/sliderslider.svg",
"i/g/shockwave.svg",
"i/g/shopbtn.svg"], ["4t888888FfnmlllCfAnml5l5l5l5orrbnml5l5l5l5o",
"6nml/l/l/l/m/l/l/l/lo6nml/l/l/l/o4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/o6nml/l/l/l/m/l/l/l/lo6n2on2onm////o",
"6nml/l/l/l/o",
"6n2o",
"6nml/l/l/l/o",
"6nm//////////////o",
"4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/o",
"4t88FfnmlllCfAnml5l5l5l5orrbn2o",
"4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/o",
"4t88FfnmlllCfAnml5l5l5l5orrbnm//////////////o",
"4t88FfnmlllCfAnml5l5l5l5orrbnm////////o",
"4t88FfnmlllCfAnml5l5l5l5orrbnmllllllllo",
"4t88FfnmlllCfAnml5l5l5l5orrbnml5l5l5l5o",
"6nm////////o",
"6nmllllllllo",
"6nml5l5l5l5o",
"6nml/l/l/l/m/l/l/l/lo6nml/l/l/l/o4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/o4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/m/l/l/l/lo6n2on2onm////o",
"6nml/l/l/l/m/l/l/l/lo6nml/l/l/l/o4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/o4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/m/l/l/l/lo6n2on2onm////o",
"6n2on2onm////o",
"6n2onm////o",
"6n2on2onmll/l/l//l//o",
"6nml/l/l/l/onm/l/l///////o",
"6n2on2onm////o",
"6nmllllllllonm//llonm//////o",
"6nml/l/l/l/onml/l/l/l/onml/l/l/l/o",
"6nml/l/l/l/m/l/l/l/lo6nml/l/l/l/o4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/o4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/m/l/l/l/lo6n2on2onm////o",
"6nml/l/l/l/m/l/l/l/lo6nml/l/l/l/o4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/o4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/m/l/l/l/lo6n2on2onm////o",
"6nml/l/l/l/m/l/l/l/llo",
"6nm////m////o",
"6nm/lll//l//l//l/m/l//l//l//l/o",
"6nml/l/l/l/m/l/l/l/llo",
"6nm////m////on2o",
"6nm/lll//l//l/l/m/l//l//l/l/on2on2onm/l/l/lllo",
"6nm//////////////ml///ll////ll///ll/ll//ll/lo6nm////o",
"6n2on2onml////////lm///////ll/o",
"6nm//llonmllllllllmllllllllo",
"6nmllllmllllo",
"6nm//////////////ml///ll////ll///ll/ll//ll/lo",
"4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/m/l/l/l/llo",
"4t88FfnmlllCfAnml5l5l5l5orrbnm////m////o",
"4t88FfnmlllCfAnml5l5l5l5orrbnm/lll//l//l/l/m/l//l//l/l/o",
"4t88FfnmlllCfAnml5l5l5l5orrbnm//////////////ml///ll////ll///ll/ll//ll/lo",
"4t88FfnmlllCfAnml5l5l5l5orrbnml////////lm///////ll/o",
"4t88FfnmlllCfAnml5l5l5l5orrbnmllllllllmllllllllo",
"4t88FfnmlllCfAnml5l5l5l5orrbnmllllmllllo",
"6nmllllllllmllllllllo",
"6nmllllmllllo",
"6nml/l/l/l/m/l/l/l/lo6nml/l/l/l/o4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/o4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/m/l/l/l/lo6n2on2onm////o",
"6nml/l/l/l/o",
"6n2o",
"6nml/l/l/l/o",
"6nm//////////////o",
"6nmllllllllo",
"6nml5l5l5l5o",
"6nml/l/l/l/m/l/l/l/lo6nml/l/l/l/o4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/o4t88FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/m/l/l/l/lo6n2on2onm////o",
"6nml/l/l/l/o",
"6nml/l/l/l/o",
"6nml/l/l/l/o",
"6nml/l/l/l/o",
"6nml/l/l/l/o",
"6nml/l/l/l/o",
"6nml/l/l/l/o",
"6nml5l5l5l5o",
"6nml/l/l/l/ml/lll/ml/lll/o",
"6nml////o6f6Anml5l5l5l5ort8888Fnmllllot88Fn2ot88Fn2oD88Fnm////ot88Fnm//l/l/l/l/l/l/l/l/l//m////m////o",
"yw6nml/l/l/l/m/l/l/l/llo6nml/l/l/l/o4t88888FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/o6nml/l/l/l/m/l/l/l/llo6nm////onmllllq9opEnm/P6nmlllllllo",
"yw6nml/l/l/l/m/l/l/l/llo6nml/l/l/l/o4t88888FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/o6nml/l/l/l/m/l/l/l/llo6nm////onmllllq9opEnm/P6nmlllllllo",
"6n2o6n2o6n2ot88Fn2ot88Fn2o6n2on2onm////o",
"t888Fnml5l5l5l5o",
"6n2o6nmlllonmllllo",
"6n2o6nmlllllllo",
"6n2o6nmlllllllo",
"6n2o6nmlllllllo", "6n2o6nmlllllllo", "6n2o6nmlllllllo", "6n2o6nmlllllllo", "6nml5l5l5l5onml5l5l5l5onml5l5l5l5onml5l5l5l5onml5l5l5l5onml5l5l5l5onml5l5l5l5onml5l5l5l5onml5l5l5l5onml5l5l5l5onml5l5l5l5onml5l5l5l5onml5l5l5l5onml5l5l5l5o", "t888Fnml/ll/l/l/lml/ll/l/l/lml/ll/ll/ll/lml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/ll/l/l/lo", "t888Fnml/ll/l/l/lml/ll/l/l/lml/ll/ll/ll/lml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/ll/l/l/lo", "t888Fnml/ll/l/l/lml/ll/l/l/lml/ll/ll/ll/lml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/ll/l/l/lo", "t888Fnml/ll/l/l/lml/ll/l/l/lml/ll/ll/ll/lml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/ll/l/l/lo", "t888Fnml/ll/l/l/lml/ll/l/l/lml/ll/ll/ll/lml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/ll/l/l/lo", "t888Fnml/ll/l/l/lml/ll/l/l/lml/ll/ll/ll/lml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/ll/l/l/lo", "t888Fnml/ll/l/l/lml/ll/l/l/lml/ll/ll/ll/lml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/ll/l/l/lo", "t88Fnml/l/l/l/o", "6nm//////////////////////l//////////////////////llo6nmllllllllo6nmlllll//lll//llm/ll/lo6nm////////////////l////////////////llo6nmlllllllllllllllonmllllllllo6nmllllllllllllonmllllll//////lllm////////lllo6nmllllllllllllo6nmllllllllllllo6nm//////////////////////l//////////////////////lo6nmllllllllo6nmlllll//lll//llm/ll/lo6nm////////////////l////////////////lo6nmlllllllllllllonmllllllllo6nmllllllllllllonmllllll//////llm////////lllo6nmllllllllllllo6nmllllllllllllo", "6nmllllllon2on2on2o", "6nm///////////////////////m////////////////////////o6nm////////////////////////m/////o6nm//////onm/////o", "6nm//////////////l////////////lm//////////////////////o6nm///////////////////////m//////o6nm//////////onm//////o", "6nml/l/l/l/m/l/l/l/lo6nml/l/l/l/o4t88888FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/o6nml/l/l/l/m/l/l/l/lo6nmlllllllo", "6nml/l/l/l/m/l/l/l/lo6nml/l/l/l/o4t88888FfnmlllCfAnml5l5l5l5orrbnml/l/l/l/o6nml/l/l/l/m/l/l/l/lo6nmlllllllo", "6Knm22m22oKnmlllllllmlllmll2255222lllm22552255mllllllm2222222222m255255m255l2222252255l22l52552l2m22222222lmll2255222lllm22552255mllllmllllm22225lllll522225lllm252222lll525225l22222l5lm22552255o", "9ywpEnmllmllqoP", "6nml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/ml/l/l/l/m/l/l/l/lo", "6nml/l/llllll//ll/llllll/l/o", "yw9pEnm//ll///qP6nm////mllllonml////l////llm////o", "K6nml/l/ll/llll/l//l//ll/lll///l///l/l/l/o", "yw9pEn2qP6nml////l////llm////o", "nm///////////////////6nm////////m////onm/////////////l/////onm////", "6nm//////////////////o", "yw9pEn2qP9nmlP9nmlP", "6nm/l////llll///o", "yw9pEnmlllllP6nmlllllllllo", "6nml5l5l5l5onm///////////l/o", "yw6nm///////////////q9opEnm//P9nm//P9nm//P", "6nm//////////l////////l/lmo", "6nm2l2l2l2lm2l2l2l2lm2l2l2l2lm2l2l2l2lm2l2l2l2lm2l2l2l2lm2l2l2l2lonm2l2l2l2lo", "yw9pEnm/l/l/l/lqP6n2o6nm/l/l/l/lot88Fnmlllo", "ywt88888F9pEnm/l/l/l/lqoPp9nmlPp9nmlPp9nmlPp9nmlP", "ywt88F9t88GEnm/l/l/l/lqoP", "D88Fn2o", "D88Fnm////m////ot88Fnm////m////ot88Fnm////ml/llllo6nmll/lllo"], [")7,h/)7,h/MZmWj/MZm~_~<><><>HAl_<><><>#AlZAl_<><><>pAlsAl_<><><>RAl+Al_<><><>&;k$Al_<><><>___)7_)7,h/_,h/~__k:k_Wj/@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni__)7_)7_)7_)7,h/)7,h/)7,h/_,h/_,h/_,h/______", ")u)3~_<Z<t({4tns$l4tn+dl4tn_5Pn_A1m_8Im_Eul+dl(Ms$l(M({(MtDn(MihnEulihn8Imihn)Gihn5PniDn4tn({4tns$l:Tl!fl:TluDlRwluDl,ImuDlA1muDl3Nn!fl:pns$l:pn({:pngBn:pnydn3NnydnA1mydn8ImydnGwlgBn+Tl({+Tls$l+Tl~_)7<Ks$l*Pl({*PlmCn*Pl)t:sl)t6Gm)t+ym)t)fmCn0pn({0pns$l0pn6el0pn2Bl)f2Bl+ym2Bl6Gm2Bl:sl6el*Pls$l*Pl)u)3wQmyt1wQm+Tz_~(M)><i~~(R<e<2__)u_)u)3_)3~__~_63W@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbnis$l2Bl({2BlmCn2Bl)t6el)ts$l)t(])ti:mmCn)q({)qs$l)q6el)q2Bli:m2Bl(]2Bls$l2Bl6el6el2Bls$l2Bl~(S<j<5({odns$lodn+dlodn_p;m_6km_s$l_+dl+dl_s$l_({_tDn_ihn+dlihns$lihn(]ihnp;miDnodn({odns$l4DlBgl4Dl4DlBgl4Dls$l4Dl(]4Dlc.mBgluZn2$luZn({uZngBnuZnydnc.mydn(]ydns$lydn!flgBnuDl({uDls$luDl~_)D)^(dECmIPl_ZIl~s&mECmIPl_ZIl~5Ommfm*QmIfm#vmxfm#vm6fm2vmAwm(?D8m7QmD8mu;lD8mM7l6um17l6fmq7l(=(#6fm5Ommfm", ")4);~<><><>G;lyblPvmyblBJnyblFmn24lFmnoSmFmns+mFmneYnBJni1nPvmi1nG;li1nUlli1nQIleYnQIls+mQIlySmQIl!4lUllyblG;lybl", ")4);~<)<)<)(:GsmaOm_ZIl~", ")4);~<><><>.DmWznsQl,/m*Fle1m*FlIkmsQlrZm.DmQmlkOmybl6fmyblYqmQmlydnrZmQonIkmQone1mydn,/mYqmWzn*fm:9nkOm:9n.DmWzn", ")4);~<><><>AnnmpmAnny&l2:m$cl(:$clpvl$clUHly&lUHlmpmUHla!mQNl)baXloTnyWl)meWlyYneWl)qeWlUsn+il*5nTyl*5n17l*5n,&l60nG;l,snCAm)3IBmQtnECmatnEHm-0nWPm*5n(;*5nbim*5n!qmc0n#vmAsn)D2rn4xmsrn0ymYrn)II0na!m*5n)W*5n$Pn*5nYcnUsnYcnmbnYcn:Vn:an+QnyYndMn2hn,;mAnn86mAnnmpm", ")4);)4);(:@A6yl(:@Rgwl_~<><><>4Al_<><><>___)4_)4);_);~__~_@O1Zk@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@WbniG;luNlPvmuNlBJnuNlFmnyqlFmnkEmFmnpwmFmnbKnBJnfnnPvmfnnG;lfnnUllfnnQIlbKnQIlpwmQIlkEmQIloqlUlluNlG;luNl", ")4);)4);(:(X(:)$_~<><><>1Al_<><><>___)4_)4);_);~__k:k_)@@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni(:MZmaOm_ZIl~", ")4);)4);FXm@jStlFXm@c/ql_~<><><>zAl_<><><>___)4_)4);_);~__~_@aSfk@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni8DmCfniQlyrm*FlKhm*Fl+PmiQlXFm8Dm,RlkOmUHlxfmUHlYqm,RlydnXFmQon+PmQonKhmydnyrmYqmCfn6fm0pnkOm0pn8DmCfn", ")4);)4);(:sfl(:u8n_~<><><>0Al_<><><>___)4_)4);_);~__k:k_)(@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@WbniAnnGYmAnnTyl2:mYLl(:YLlpvlYLlUHlTylUHlGYmUHl6umQNl8/maXl:BnyWl)ZeWlIHneWl)deWl0an+ilaonTylaon17laon,&lQjnG;lcbnCAm)qIBmwbnECm6bnEHmbjnWPmaon(;aonbimaon!qm8in#vmgan)DMan4xmCan0ym4Zn)Ioina!maon)Waon$PnaonYcn0anYcn,JnYcneEn:anU;myYn9*m2hnm4mAnncpmAnnGYm", ")4);)4);QXmy94QXmCV2_~<><><>0Al_<><><>___)4_)4);_);~__~_:$T@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbniu-mMOlUwmMOl4dmKbl#Wm(m+Pm,blU:lYQlYzlYQlMYlYQl!BlWnl!Bl4;l!BlQimOalK6mCnlq#meImSRn4Ym82n4Ym82n4Ym82nHnm0Vn0GnY&m4en+ymosn2gmosnU:lesn8ll6WnMOlu-mMOl", ")4);)4);jXmGt4jXmEQ2_~<><><>sAl_<><><>___)4_)4);_);~__~_n-T@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@WbniD8m2Ll*8l2LlCJlu/lCJlA/m*8l5onD8m5onFmnA/mFmnu/lD8m2Ll", ")4);)4);(:ab4(:kK2_~<><><>8Al_<><><>___)4_)4);_);~__~_mDU@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni(IMOl)wMOl)wMOl)wMOl)wCfn)wCfn)wCfn(ICfn(ICfn(ICfn(IMOl(IMOl(IMOl", ")4);~<><><>u-mMOlUwmMOl4dmKbl#Wm(m+Pm,blK:lcPl(mcPlCYlcPl!BlWnl!Bl4;l!BlQimOalK6m(dq#meImSRn4Ym82n4Ym82n4Ym82nHnm0Vn0GnY&m4en+ymosn2gmosnU:lesn8ll6WnMOlu-mMOl", ")4);~<><><>D8mWdl*8lWdlCJlOHmCJlqGn*8lZ6nD8mZ6nFmnqGnFmnOHmD8mWdl", ")4);~<><><>(Ikml)wkml)wkml)wkml)wa3n)wa3n)wa3n(Ia3n(Ia3n(Ia3n(Ikml(Ikml(Ikml", ")v)4~_)Q<t+om4tn2$l4tn;dl4tn:;k5Pn:;kA1m:;k8Im:;kEul;dl(M2$l(M+om(M2Dn(MshnEulshn8Imshn)Gshn5PntDn4tn+om4tn2$l:TlBgl:Tl4DlRwl4Dl,Im4DlA1m4Dl3NnBgl:pn2$l:pn+om:pnrBn:pn8dn3Nn8dnA1m8dn8Im8dnGwlrBn+Tl+om+Tl2$l+Tl~_($<K2$l(M+om(MwCn(M0fnItl0fn(80fn:ym0fn6MnwCn+pn+om+pn2$l+pn(X+pn!Bl6Mn!Bl:ym!Bl(8!BlItl(X(M2$l(M)v)4wQmWBXwQmKbZ_~(M([<i~~(q)l<z__)v_)v)4_)4~__k:k_GdZ@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni2$l2Bl+om2BlwCn2Bl0fn6el0fns$l0fn(]0fni:mwCn)q+om)q2$l)q(X)q!Bli:m!Bl(]!Bls$l!Bl6el(X2Bl2$l2Bl)v)4wQma;WwQmGdZ_~(S)d<5(B~(b)x<*__)v_)v)4_)4~__k:k_GdZ@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni+omodn2$lodn;dlodn:;kp;m:;k6km:;ks$l:;k+dl;dl_2$l_+om_2Dn_shn+dlshns$lshn(]shnp;mtDnodn+omodn2$l4DlKgl4Dl(DBgl(Ds$l(D(](Dc.mKgluZn!$luZn+omuZnrBnuZn8dnc.m8dn(]8dns$l8dn!flrBnuDl+omuDl2$luDl~_(L)zMnlECmIPl_ZIl~)RECmIPl_ZIl~$OmmfmERmIfmAwmxfmAwm6fm#vmAwmGimD8m*QmD8m4;lD8m(s6um+7l6fm17l(=8Nm6fm$Ommfm", ")v)4~<i(U)a+om4tn2$l4tn;dl4tn:;k5Pn:;kA1m:;k8Im:;kEul;dl(M2$l(M+om(M2Dn(MshnEulshn8Imshn)Gshn5PntDn4tn+om4tn2$l:TlBgl:Tl4DlRwl4Dl,Im4DlA1m4Dl3NnBgl:pn2$l:pn+om:pnrBn:pn8dn3Nn8dnA1m8dn8Im8dnGwlrBn+Tl+om+Tl2$l+Tl~))(N)M2$l(M+om(MwCn(M0fnItl0fn(80fn:ym0fn6MnwCn+pn+om+pn2$l+pn(X+pn!Bl6Mn!Bl:ym!Bl(8!BlItl(X(M2$l(M)v)4wQmWBXwQmKbZ_~<A(n)e~~<l(5)o__)v_)v)4_)4~__k:k_GdZ@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni2$l2Bl+om2BlwCn2Bl0fn6el0fns$l0fn(]0fni:mwCn)q+om)q2$l)q(X)q!Bli:m!Bl(]!Bls$l!Bl6el(X2Bl2$l2Bl)v)4wQma;WwQmGdZ_~<o(7)p(B~<7)A)k__)v_)v)4_)4~__k:k_GdZ@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni+omodn2$lodn;dlodn:;kp;m:;k6km:;ks$l:;k+dl;dl_2$l_+om_2Dn_shn+dlshns$lshn(]shnp;mtDnodn+omodn2$l4DlKgl4Dl(DBgl(Ds$l(D(](Dc.mKgluZn!$luZn+omuZnrBnuZn8dnc.m8dn(]8dns$l8dn!flrBnuDl+omuDl2$luDl~)E_)AMnlECmIPl_ZIl~)RECmIPl_ZIl~$OmmfmERmIfmAwmxfmAwm6fm#vmAwmGimD8m*QmD8m4;lD8m(s6um+7l6fm17l(=8Nm6fm$Ommfm", ")4);~<><><>ntl,NmIPl_ZIl~GAn,NmIPl_ZIl~SVmUrmeXm!qma2m(}a2morm)H47mhom)UUXm)UIGm)Uw#lo6mO$lorm(xLrmNUmyrmSVmUrm", ")4);~<><><>(.lTm(N_ZIl~(]c.m(]vFnCemSMn(.SMnoNmSMn(8vFn(8c.m(8c.moNmc.m(.c.mCemc.m(]c.m(]c.m", ")4);~<><><>sul&wlcPl_ZIl~*.m&wlcPl_ZIl~7pm(+4Ym(+4Ym(-4Ym,Xm:Um2bmJQm2bmxGm2bm-Bm2bmA:l8XmA:l(-A:l(+J#l4Jmq7lhPmq7liWmq7lkdmS#l([U:l([wpm([ywm([a2mkdma2miWma2mhPm)D(+7pm(+", ")4);~<)<)<)cam)cASm)c!Mm)czImeEnzImU;mzImi:mzImY&m!MmK/mASmK/mcamK/mmfmK/m1jmY&m1jmi:m1jmU;m1jmeEnmfm)ccam)c$-mD7l)O(nY0mn,lwVmW-lwVmW-lcVmW-lqUmW-lWUmW-lWUmW-lk/ln,ly0l(nEulo5l2pl68lmylyDm0AmOHm0Am2HmrAm(9rAm8ImrAm/UmkJm0em0Um0em6fm0em+om:Um+om8Im+omUIm+om2Hm0omOHmh#m.Dm,;m(v$-mD7l", ")4);~<><><>80lKImiQl_ZIl~j&m8ImiQl_ZIl~o1m4xmo1mF+mComE:meXmE:m6GmE:mU&lF+mU&l4xmU&l4xm6Gm4xmeXm4xmCom4xmo1m4xmo1m4xm", ")4);~<><><>YVl6ylFmnu*lFmnGEmvFnIBmtDnArm,Xm!lm8cm:-lGNl(sYVl6yl(9kEm+Fm$Oma*l0Umb6l(-RwljRmhnl,Immol2.lo+lwBm(9kEmKDmiIn(7Y&m+Pms5m0ems5m(|s5m&xmK/my1me;mt0m)KWomnumWZmnumkJmnum*,lk7m*,lgBn*,lKJn&;lCQnvEmNVntCmmRnOCm6MnKDmiIn", ")4);~<><><>Q/laYmmjlaYmBglaYmCdlcVmCdl!RmCdlW!lCdl68lBgl85lmjl85lH/l85ls$l85lq-l68lq-lW!lq-l!Rm0-lcVm2$laYmQ/laYm4Kn4YmE5m4Ymo1m4Ymrym(.rymUSmrym(wrymO9lo1mQ6lE5mQ6luKnQ6lKOnQ6lJRnO9lJRn(wJRnUSmJRn(.UOn4Ym4Kn4Yme1mo/mh!lo/m39lo/mg7lS9mg7lo6mg7lC3mg7lY0m39lCymh!lCyme1mCymI4mCyme6mY0me6mC3me6mo6me6mS9mS4mo/me1mo/m", ")u)3~(U<i)c({4tns$l4tn+dl4tn_5Pn_A1m_8Im_Eul+dl(Ms$l(M({(MtDn(MihnEulihn8Imihn)Gihn5PniDn4tn({4tns$l:Tl!fl:TluDlRwluDl,ImuDlA1muDl3Nn!fl:pns$l:pn({:pngBn:pnydn3NnydnA1mydn8ImydnGwlgBn+Tl({+Tls$l+Tl~(N))(<s$lOQl({OQlmCnOQl)tStl)tEHm)tIzm)t*MnmCn:pn({:pns$l:pn6el:pn2Bl*Mn2BlIzm2BlEHm2BlStl6elOQls$lOQl)u)3wQmWBXwQmKbZ_~(n<A)J~~(5<l)3__)u_)u)3_)3~__k:k_GdZ@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbnis$l2Bl({2BlmCn2Bl)t6el)ts$l)t(])ti:mmCn)q({)qs$l)q6el)q2Bli:m2Bl(]2Bls$l2Bl6el6el2Bls$l2Bl)u)3wQma;WwQmGdZ_~(7<o)6~~)A<7<X__)u_)u)3_)3~__k:k_GdZ@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni({odns$lodn+dlodn_p;m_6km_s$l_+dl+dl_s$l_({_tDn_ihn+dlihns$lihn(]ihnp;miDnodn({odns$l4DlBgl4Dl4DlBgl4Dls$l4Dl(]4Dlc.mBgluZn2$luZn({uZngBnuZnydnc.mydn(]ydns$lydn!flgBnuDl({uDls$luDl~_)b_(dECmIPl_ZIl~s&mECmIPl_ZIl~5Ommfm*QmIfm#vmxfm#vm6fm2vmAwm(?D8m7QmD8mu;lD8mM7l6um17l6fmq7l(=(#6fm5Ommfm", ")v)4~<#)+(++om4tn2$l4tn;dl4tn:;k5Pn:;kA1m:;k8Im:;kEul;dl(M2$l(M+om(M2Dn(MshnEulshn8Imshn)Gshn5PntDn4tn+om4tn2$l:TlBgl:Tl4DlRwl4Dl,Im4DlA1m4Dl3NnBgl:pn2$l:pn+om:pnrBn:pn8dn3Nn8dnA1m8dn8Im8dnGwlrBn+Tl+om+Tl2$l+Tl~<y)M(p2$l(M+om(MwCn(M0fnItl0fn(80fn:ym0fn6MnwCn+pn+om+pn2$l+pn(X+pn!Bl6Mn!Bl:ym!Bl(8!BlItl(X(M2$l(M)v)4wQmyt1wQm+Tz_~<2)c(+~~<>)^)E__)v_)v)4_)4~__~_63W@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni2$l2Bl+om2BlwCn2Bl0fn6el0fns$l0fn(]0fni:mwCn)q+om)q2$l)q(X)q!Bli:m!Bl(]!Bls$l!Bl6el(X2Bl2$l2Bl)v)4wQmuv1wQm^)_~<&)|)F~~<;<m)z__)v_)v)4_)4~__~_63W@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni+omodn2$lodn;dlodn:;kp;m:;k6km:;ks$l:;k+dl;dl_2$l_+om_2Dn_shn+dlshns$lshn(]shnp;mtDnodn+omodn2$l4DlKgl4Dl(DBgl(Ds$l(D(](Dc.mKgluZn!$luZn+omuZnrBnuZn8dnc.m8dn(]8dns$l8dn!flrBnuDl+omuDl2$luDl~<h__MnlECmIPl_ZIl~)RECmIPl_ZIl~$OmmfmERmIfmAwmxfmAwm6fm#vmAwmGimD8m*QmD8m4;lD8m(s6um+7l6fm17l(=8Nm6fm$Ommfm", ")4);~<><><>Yvm)!R;l)!ikl)!iGlTbniGlk!miGlWUmiGlo5likloblR;loblYvmoblQKnoblHono5lHonWUmHona!mHonTbnGKn)!Yvm)!R;liflkmliflSKl17lSKl(,SKlk!mSKlRZnkmli1nR;li1nYvmi1nEIni1nWknRZnWknk!mWknWUmWknq7lEInZflYvmZflR;liflR;lifl", ")4);~<><><>(:)#awl)#uIl!SnuIlGsmuIlW-lawl(W(:(W*.m(WwlnW-lwlnGsmwln!Sn*.m)#(:)#(:(Zmyl(ZyMl(1yMlGsmyMl)imyl)+(:)+4-m)+shn)ishnGsmshn(14-m(Z(:(Z", ")4);~<><><>(:U7nhPmU7neImX4nADm&ynADm&ynADm&ynARl)PsLl)LuIli0muIl$smuIlOlmuIl,XmuIl,XmADmumleImQhlqPmSel(:Sel0emSel!lmQhlUrmumlwln(;wln(;wlnilmwln$smwlnY0m8ink7mVdn)PUrmCzn!lmg4n+emU7n(:U7n(:gilmQmgilWKmAll+FmsplyMl&YmyMl&YmyMlUmmyMl$smyMl)FSPls5m+TlO+m+FmPwngKm60nwQma3n(:a3nvdma3n:jm60nhomPwnganO+mMfni5mshnTzmshnNtm2hn8mmshn(@shn(@homspl+jmAll4dmgil(:gil", ")4);~<><><>PvmhpnG;lhpnYklhpnYGlgLnYGlywmYGlkEmYGl(f(b2LlG;l2LlPvm2LlGKn2Ll,nn(f,nnkEm,nnpwm,nngLn)dhpnPvmhpnG;lwPlkmlwPlSKl4rlSKlkEmSKlpwmSKlUJnkmlmlnR;lmlnPvmmln*HnmlnMknUJnMknpwmMknkEmMkn4rl*HnmPlPvmmPlG;lwPlG;lwPl", ")4);~<><><>(:)zawl)zuIl,;muIlMZmuIlcylawl(I(:(I*.m(IwlncylwlnMZmwln,;m*.m)z(:)z(:(Lmyl(LyMl(nyMlMZmyMl)Umyl)w(:)w4-m)wshn)UshnMZmshn(n4-m(L(:(LEWm4Tm(e_ZIl~", ")4);~<><><>AXmAnnWPmAnnUImDkn!Cmven!Cmven!Cmven!QlusmiLlQnmkIlEgmkIl(;kIl*QmiLl4Jm!QlaEm(5aSl(9,MlhPm:JlAXm:Jlqem:Jl3lm,MlLrmaSlKdnaEmaonqPmaonzhmKdn)ALrm4en!lmDkn0emAnnAXmAnnAXm$Nl(&$NlMKmiQl0FmEVl0TlEHmIPlwLmoMl!RmoMlaYmoMl;emIPlOlm0Tlwpm0FmwbnWKmSgnmQm8inAXm8inkdm8in+jmSgnWomwbnWanwpm$jnEgm$jnmQmWan(8homEVl1jmiQlvdm$NlAXm$Nl2ulrxl(U_ZIl~E:mrxl(U_ZIl~y:l4Jme:l4JmA:l4Jm2.l4Jm2.luTm2.luYmwBm()mGm()JQm():Um()&Ym(;&YmuTm&Ym(+y:l4Jmy:l4Jm", ")4);~<><><>U;maono/maonv2mQjnGxmgan,wmganywmranpwmranLrmQjnGimaon(;aonhPmaon(84jncBm-bnIBm-bn0Am6bngAm6bn$*l)wd8laon(maonIjlaonAWlCanAWliInAWlMGnUWl2Dn(RWBnoMli+mUHlNtmUHlGYmUHlTylpvlYLl(:YLl2:mYLlAnnTylAnnGYmAnnWom)vg3mRZnA*mcbni:micniDnicniInicn)p)haonU;maon:ymgVn6zm6Wnc4mCfnk!mDknU;mDknONnDknpYn2XnpYniInpYn2DnYXnA;mNVn9*mlUnj&mWVnS$m)s)H,inunm,in,Xm,in(n)TwPl(:wPl(lwPlYLly0lYLlGYmYLlusmiQlI9msalU;mUblRAnAblWBnial2DnEalMGnEaliInEalsXnfllDknYzlDknq7lDknU&l)tA:lUYny:lPXn&;lYXn+Am)n6BmsXn!Cm2XnyDm#XnQEmyYn,Im+fnmQmDknuYmDknUhmDknJpmXfn/tm)nSumwWnEvmnWnAwmSWn)D)m4xm/Vn:ymgVn~<)<)<)D8mIBmD8m((jqmewm/UmewmR;lewmx3l((x3lIBmx3lIBm(0TBm(*TBm(`TBmD8mIBmD8mIBm", ")4);~<><><>C2lSGm2fl_ZIl~j&m(82fl_ZIl~4Ym)!#WmE1n2Wmw0nmGmJRnMnlE&mOalk7m!BlSkm!Bl6Bm!BljplgYluNlA0luNlE.luNlkOmKbl#Wm,vlIfmYalywmUMlU*mUMl:VnUMlesnSolesngAmesn+jmVdne1mgGny*m+omWVnwamw0nmamE1n4Ym)!A0lyRlsalyRl*Fl4rl*Fl6Bm*Fl*fmAblM3mYplf/miCm8JnlTmwln&Ymnvn(<OmngtmYNneEnM#mCanrymkon(?konWAmkonUql9TnOQle*mOQlGxmOQlmfmsflCZm02l(:Y9lIVm+2lHOmogl*,lyRlA0lyRl", ")4);~<><><>7Qm0FmHOmEWm(2Khm(qqem(eAcm$clsMmsflc,lF9l(47Qm0FmD8m5on*8l5onCJlA/mCJlu/l*8l2LlM8m2LlFmnu/lFmn!+mD8m5onf+l+kn)K+kn2hnd9m2hnc#le6m*Plf+l*PlGNlc#lGNlS9mf+l+kn", ")4);~<><><>)wCfn(ICfn(IMOl)wMOl)wCfn(L:an)t:an)tQSl(LQSl(L:an", ")4);~<)<)<)U;m*5no/m*5nv2m60nGxmAsn,wmAsnywmLsnpwmLsnLrm60nGim*5n(;*5nhPm*5n(8Y1ncBmltnIBmltn0AmatngAmatn$*l)9d8l*5n(m*5nIjl*5nAWlsrnAWlCanAWl2XnUWlWVn(R!SnoMl$FnUHls+mUHlmpmUHly&lpvl$cl(:$cl2:m$clAnny&lAnnmpmAnn25m)v#:mRZngLncbn$Pnicn$Unicn&Znicnsrn)h*5nU;m*5n:ym!mn6zmQonc4miwnk!mi1nU;mi1nONni1npYnMpnpYn&ZnpYnNVnYXnhQnNVnSMnlUn$KnWVnzJn)sw.m,inE5m,incpm,in:-l)TGhl(:Ghl(lGhlYLl(0YLlmpmYLlF+miQl)Zsal)iUblwRnAbl2SnialNVnEalsXnEal&ZnEal)0flli1nYzli1nq7li1nU&lAxnA:l0pny:luon&;l5on+Am$on6Bm)0!CmMpnyDmWpnQEmJqn,ImUxnmQmi1nuYmi1nUhmi1nJpm2wn/tm$onSumHonEvm,nnAwmynn)Donn4xmUnn:ym!mn", ")4);)4);LXmaaULXmE4W_~<><><>4Al_<><><>___)4_)4);_);~__k:k_,&W@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@WbniPvmhpnG;lhpnYklhpnYGlgLnYGlywmYGlkEmiGl(f(b2LlG;l2LlPvm2LlGKn2Ll,nn(f,nnkEm,nnpwmHongLnGKnhpnPvmhpnG;lwPlkmlwPlSKl$rlSKlkEmSKlpwmSKlUJnkmlmlnR;lmlnPvmmln*HnmlnMknUJnMknpwmMknkEmMkn4rl*HnmPlPvmmPlG;lwPlG;lwPl", ")4);)4);(:(X(:)$_~<><><>4Al_<><><>___)4_)4);_);~__k:k_)@@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni(:)zawl)zuIl,;muIlMZmuIlcylawl(I(:(I*.m(IwlncylwlnMZmwln,;m*.m)z(:)z(:(Lmyl(LyMl(nyMlMZmyMl)Umyl)w(:)w4-m)wshn)UshnMZmshn(n4-m(L(:(L", ")4);)4);CXm@hStlCXm@f/ql_~<><><>9Al_<><><>___)4_)4);_);~__~_@aSfk@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@WbniAXmAnnWPmAnnUImDkn!Cmven!Cmven!Cmven!QlusmiLlQnmkIlEgmkIl(;kIl*QmiLl4Jm!QlaEm(5aSl(9,MlhPm:JlAXm:Jlqem:Jl3lm,MlLrmaSlKdnaEmaonqPmaonzhmKdn)ALrm4en!lmDkn0emAnnAXmAnnAXm$Nl(&$NlMKmiQl0FmEVl0TlEHmIPlwLmoMl!RmoMlaYmoMl;emIPlOlm0Tlwpm0FmwbnWKmSgnmQm8inAXm8inkdm8in+jmSgnWomwbnWanwpm$jnEgm$jnmQmWan(8homEVl1jmiQlvdm$NlAXm$Nl", ")4);)4);(:sfl(:u8n_~<><><>3Al_<><><>___)4_)4);_);~__k:k_)(@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@WbniU;maono/maonv2mQjnGxmgan,wmganywmranpwmranLrmQjnGimaon(;aonhPmaon(84jncBm-bnIBm-bn0Am6bngAm6bn$*l)wd8laon(maonIjlaonAWlCanAWliInAWlMGnUWl2Dn(RWBnoMli+mUHlNtmUHlGYmUHlTylpvlYLl(:YLl2:mYLlAnnTylAnnGYmAnnWom)vg3mRZnA*mcbni:micniDnicniInicn)p)haonU;maon:ymgVn6zm6Wnc4mCfnk!mDknU;mDknONnDknpYn2XnpYniInpYn2DnYXnA;mNVn9*mlUnj&mWVnS$m)s)H,inunm,in,Xm,in(n)TwPl(:wPl(lwPlOLly0lOLlGYmOLlusmYQlI9mialU;mKblRAn!alWBnYal2Dn*ZlMGn*ZliIn*ZlsXnUllDkn(mDkng7lDknL&l)t#.lUYnp:lPXn4;lYXn0Am)nwBmsXn2Cm2XnoDm#XnGEmyYn8Im+fn(&Dkn(;DknKhmDkn:omXfn0tm)n)BwWn*umnWn#vmSWnywm)muxm/Vn:ymgVn", ")4);)4);(:+/4(:{#_~<><><>9Al_<><><>___)4_)4);_);~__~_:$T@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni4Ym;4n#Wm60n2Wmc0nmGm+QnMnl7$mOalb7m!Bl:jm!BlwBm!BlYplgYlkNlA0lkNlE.lkNlkOmAbl#Wm8vlIfmOalywm(JU*m(J:Vn(Jesn:nlesn(3esnqjmVdnK1mgGne*m+omCVnwamc0nmam60n4Ym;4nA0loRlsaloRl*Flurl*FlwBm*Fl6fmAblC3mYplU/miCmzJnlTmmln&Ymcvn(<FmngtmONneEn)PCangymkon8hmkon(3konLql9Tn(Me*m(M,wm(Mmfmsfl&Ymq2lAXmO9l:Um02lHOmegl*,loRlA0loRl", ")4);)4);jXmGt4jXmEQ2_~<><><>9Al_<><><>___)4_)4);_);~__~_n-T@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@WbniD8m5on*8l5onCJlA/mCJlu/l*8l2LlM8m2LlFmnu/lFmn!+mD8m5onf+l+kn)K+kn2hnd9m2hnc#le6m*Plf+l*PlGNlc#lGNlS9mf+l+kn", ")4);)4);(:Gb4(:QK2_~<><><>8Al_<><><>___)4_)4);_);~__~_mDU@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni)w4en(I4en(I$Nl)w$Nl)w4en(L0an)t0an)t,Rl(L,Rl(L0an", ")4);~<><><>D8m!6n*8l!6nCJl;GnCJl2Hm*8l+dlM8m+dlFmn2HmFmn;GnD8m!6nf+l82n)K82n2hnaFn2hnkJme6mDilf+lDilGNlkJmGNlaFnf+l82n", ")4);~<><><>)wa3n(Ia3n(Ikml)wkml)wa3n(LWzn)tWzn)toql(Loql(LWzn", ")v)4~<i)N<s+om4tn2$l4tn;dl4tn:;k5Pn:;kA1m:;k8Im:;kEul;dl(M2$l(M+om(M2Dn(MshnEulshn8Imshn)Gshn5PntDn4tn+om4tn2$l:TlBgl:Tl4DlRwl4Dl,Im4DlA1m4Dl3NnBgl:pn2$l:pn+om:pnrBn:pn8dn3Nn8dnA1m8dn8Im8dnGwlrBn+Tl+om+Tl2$l+Tl~))(&<J2$l(M+om(MwCn(M0fnItl0fn(80fn:ym0fn6MnwCn+pn+om+pn2$l+pn(X+pn!Bl6Mn!Bl:ym!Bl(8!BlItl(X(M2$l(M)v)4wQmWBXwQmKbZ_~)|(|<R~~<k)m<u__)v_)v)4_)4~__k:k_GdZ@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni2$l2Bl+om2BlwCn2Bl0fn6el0fns$l0fn(]0fni:mwCn)q+om)q2$l)q(X)q!Bli:m!Bl(]!Bls$l!Bl6el(X2Bl2$l2Bl)v)4wQma;WwQmGdZ_~<n)p<w~~<6<O</__)v_)v)4_)4~__k:k_GdZ@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni+omodn2$lodn;dlodn:;kp;m:;k6km:;ks$l:;k+dl;dl_2$l_+om_2Dn_shn+dlshns$lshn(]shnp;mtDnodn+omodn2$l4DlKgl4Dl(DBgl(Ds$l(D(](Dc.mKgluZn!$luZn+omuZnrBnuZn8dnc.m8dn(]8dns$l8dn!flrBnuDl+omuDl2$luDl~)l_)&MnlECmIPl_ZIl~)RECmIPl_ZIl~$OmmfmERmIfmAwmxfmAwm6fm#vmAwmGimD8m*QmD8m4;lD8m(s6um+7l6fm17l(=8Nm6fm$Ommfm", ")4);~<><><>G;luNlPvmuNlBJnuNlFmnyqlFmnkEmFmnpwmFmnbKnBJnfnnPvmfnnG;lfnnUllfnnQIlbKnQIlpwmQIlkEmQIloqlUlluNlG;luNl", ")4);~<><><>(:MZmaOm_ZIl~", ")4);~<><><>.DmCfnsQlyrm*FlKhm*Fl+PmsQlXFm.Dm,RlkOmUHl6fmUHlYqm,RlydnXFmQon+PmQonKhmydnyrmYqmCfn*fm0pnkOm0pn.DmCfn", ")4);~<><><>AnnGYmAnnTyl2:mYLl(:YLlpvlYLlUHlTylUHlGYmUHl6umQNl8/maXl:BnyWl)ZeWlIHneWl)deWl0an+ilaonTylaon17laon,&lQjnG;lcbnCAm)qIBmwbnECm6bnEHmbjnWPmaon(;aonbimaon!qm8in#vmgan)DMan4xmCan0ym4Zn)Ioina!maon)Waon$PnaonYcn0anYcn,JnYcneEn:anU;myYn9*m2hnm4mAnncpmAnnGYm", ")4);~<><><>D8m2Ll*8l2LlCJlu/lCJlA/m*8l5onD8m5onFmnA/mFmnu/lD8m2Ll", ")4);~<><><>(IMOl)wMOl)wMOl)wMOl)wCfn)wCfn)wCfn(ICfn(ICfn(ICfn(IMOl(IMOl(IMOl", ")v)4~<!<q)B+om4tn2$l4tn;dl4tn:;k5Pn:;kA1m:;k8Im:;kEul;dl(M2$l(M+om(M2Dn(MshnEulshn8Imshn)Gshn5PntDn4tn+om4tn2$l:TlBgl:Tl4DlRwl4Dl,Im4DlA1m4Dl3NnBgl:pn2$l:pn+om:pnrBn:pn8dn3Nn8dnA1m8dn8Im8dnGwlrBn+Tl+om+Tl2$l+Tl~<x<E(72$l(M+om(MwCn(M0fnItl0fn(80fn:ym0fn6MnwCn+pn+om+pn2$l+pn(X+pn!Bl6Mn!Bl:ym!Bl(8!BlItl(X(M2$l(M)v)4wQmWBXwQmKbZ_~<0<K(=~~<!<n)X__)v_)v)4_)4~__k:k_GdZ@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni2$l2Bl+om2BlwCn2Bl0fn6el0fns$l0fn(]0fni:mwCn)q+om)q2$l)q(X)q!Bli:m!Bl(]!Bls$l!Bl6el(X2Bl2$l2Bl)v)4wQma;WwQmGdZ_~<$<t)d(B~<:<+)|__)v_)v)4_)4~__k:k_GdZ@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni+omodn2$lodn;dlodn:;kp;m:;k6km:;ks$l:;k+dl;dl_2$l_+om_2Dn_shn+dlshns$lshn(]shnp;mtDnodn+omodn2$l4DlKgl4Dl(DBgl(Ds$l(D(](Dc.mKgluZn!$luZn+omuZnrBnuZn8dnc.m8dn(]8dns$l8dn!flrBnuDl+omuDl2$luDl~<d)n_MnlECmIPl_ZIl~)RECmIPl_ZIl~$OmmfmERmIfmAwmxfmAwm6fm#vmAwmGimD8m*QmD8m4;lD8m(s6um+7l6fm17l(=8Nm6fm$Ommfm", "}YQK-~<H<Z<rQ93mAl7#lmAl(WmAlSAlKglSAl6,lSAlUN*SAl*z*0dloJ-*#loJ-a93oJ-gX4oJ-C14*z*C14UN*C146,l$04KglWX4mAlQ93mAl", "}YQK-~<c<Y<wQ93mAl7#lmAl(WmAlSAlKglSAl6,lSAlUN*SAl*z*0dloJ-*#loJ-a93oJ-gX4oJ-C14*z*C14UN*C146,l$04KglWX4mAlQ93mAl", "}YQK-~)l<f<UQ93mAl7#lmAl(WmAlSAlKglSAl6,lSAlUN*SAl*z*0dloJ-*#loJ-a93oJ-gX4oJ-C14*z*C14UN*C146,l$04KglWX4mAlQ93mAl", "}YQK-~<H<Z<rQ93mAl7#lmAl(WmAlSAlKglSAl6,lSAlUN*SAl*z*0dloJ-*#loJ-a93oJ-gX4oJ-C14*z*C14UN*C146,l$04KglWX4mAlQ93mAl", "}YQK-~</<L<7Q93mAl7#lmAl(WmAlSAlKglSAl6,lSAlUN*SAl*z*0dloJ-*#loJ-a93oJ-gX4oJ-C14*z*C14UN*C146,l$04KglWX4mAlQ93mAl", "}YQK-~<R<L<rQ93mAl7#lmAl(WmAlSAlKglSAl6,lSAlUN*SAl*z*0dloJ-*#loJ-a93oJ-gX4oJ-C14*z*C14UN*C146,l$04KglWX4mAlQ93mAl", "}YQK-~<u<u<uQ93mAl7#lmAl(WmAlSAlKglSAl6,lSAlUN*SAl*z*0dloJ-*#loJ-a93oJ-gX4oJ-C14*z*C14UN*C146,l$04KglWX4mAlQ93mAl", "}YQK-~<><><>SAlWy/oz4Wy/oz4Wy/oz4Wy/oz4SA&oz4SA&oz4SA&SAlSA&SAlSA&SAlSA&SAlWy/SAlWy/SAlWy/", "}Y!I-~<><><>u93_w#l_(W_SAliflSAlS,lSAlYM*SAlIz*(W2I-w#l2I-k932I-}C2I-$04Iz*$04YM*$04S,lC14ifl0X4_u93_&;l(G223(GeQ4(Gst4Wnlst4yDmst4+;$$Il+;$$IlyDm$IlWnlQml(G&;l(Gs234A-&;l4A-Qml4A-CJler*CJlCF*CJl,H&st4,H&st4CF*st4er*UQ44A-s234A-", ")d)g~<=(0(cw.m_)d6FlOIn4Nl-Cn$SlCBnEVlY:m$Xl:,mWYl4-mgYlq#m+Yl$7mOQl$7mOQl3+m4Nll-mYGlw.m_~___~)6<A<s6Al8Al#:k6Alh6ls5j7pm(K*Hn(K*Hn(K*Hn(K*Hn1il*Hn1il*Hn1il7pm1il7pm1il7pm1il7pm(K7pm(K7pm(K1ymxNlq.mnil_~)S)1<RGAl~)K)t<K2Al~(?)c)^~~(@)W)=7$m(dcum,Rlg3mMJl)XSel7$m(dAXl,al78m3!m_~<I<n<>~~)U)x<G$Em8Im$Em_ZIl~xaltelK5mG9m_~)K)s<K~~(c(r)M$Em8Im4;l_ZIl~&3lQ0l_&3lQ0lIul_~)w<R<>~_)w<R<>_0Um(Ogjm6jl(<q!loImGJmO9ltbm!fl8cmKRl6LmeCl(z(G+nlWdl(QwylGDl;Fm2Bl0Um(O4qlWwlIomxtm_~<U<&<>~~)p)x</vEmdjl0xldjlOalu6lOalxGmOaluTmWilIfm#ulUmmGwl)D(kE0m6ylv2mC2lM3m17lS4mi9lm4mH/lX3mH/le1mH/lusmS#lNtmo&lqtm:-l/tm:-lo1m:-l03m2.li5m&;li5m(+i5m6Lmi5moNm03moNmo1moNm/tm0Pmqtm!RmNtm$Tm)A$Tme1m$TmM3mnVmm4mUXmS4m.cmM3mEgmv2mkim-zm$im)D:jmymm8wmcfmO5m4TmO5mxGmE5mu6lohmdjlvEmdjl(qXemItlXem6jl:Um6jlkJm6jlA:lItlo+l(qo+lG*lo+leDm#.leDmbJmeDm/UmG*lXem(qXemvdmXemLSmXem8Im:Um8ImkJm8ImA:lLSmy+lvdmy+lJpmy+lgymA:lgymkJmgym:UmJpmXemvdmXem", ")v)4~)M<I<Yqom4tnY$l4tngdl4tnW;k$PnW;k)GW;k,ImW;k*tlgdl(MY$l(Mhom(MYDn(Mihn*tlihn,ImihnK1mihn$PniDn4tnqom4tnY$l:Tlsfl:TlQDlRwlQDl8ImQDl)GQDlsNnifl0pnY$l0pnhom0pnMBn0pnodniNnodn)Godn,ImodnRwlWBn(Phom(PY$l:TlY$l:Tl~)K)[<PY$lsQlhomsQlcCnsQlgfnwtlgfniHmgfn)FgfnYNnTCn)1hom)1Y$l)1mel)1YBlYNnYBl)FYBliHmYBlwtlmelsQlY$lsQl)v)4XQmdEOXQmReQ_~)4<o<7NAl~);<u<LmAl~<,<4<N+Al~<;<s<T~~<$<o<-__)v_)v)4_)4~__k:k_QgQ@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@WbniY$l!Blhom!BlcCn!Blgfn(Xgfn2$lgfn*kmgfn2:mTCn6bnhom6bnY$l6bncel6bnYBl2:mYBl*kmYBl2$lYBl(Xmel!BlY$l!Bl~<H<4<$qomodnY$lodngdlodnW;ky;mW;k(]W;k2$lW;k0dlgdl_Y$l_hom_YDn_ihn0dlihn2$lihn*kmihny;miDnodnqomodnY$l4Dlsfl4DlaDl!flaDl2$laDl*kmaDlw.msfl4Znj$l4Znqom4ZnWBn4Znydnn.mydn*kmydn2$lodnBglWBn(Dqom(DY$l4DlY$l4Dl~___qKm*tlLlm*tlz6m(yz6m$Tmz6mdumLlm!&mqKm!&mA6l!&mikldumikl$Tmikl(yA6l*tlqKm*tlSQm8+luim*olk2mo5lIkmgFmSQm8+l(K~___(E+jm85lgtmFkll-mollvFnI8l~<><><>8Imo&l8Im(8Qnm(8QnmOgm8ImOgm8Im$sm*3l9Sm8Imo&l", ")v)4~)M<I<Yqom4tnY$l4tngdl4tnW;k$PnW;k)GW;k,ImW;k*tlgdl(MY$l(Mhom(MYDn(Mihn*tlihn,ImihnK1mihn$PniDn4tnqom4tnY$l:Tlsfl:TlQDlRwlQDl8ImQDl)GQDlsNnifl0pnY$l0pnhom0pnMBn0pnodniNnodn)Godn,ImodnRwlWBn(Phom(PY$l:TlY$l:Tl~)K)[<PY$lsQlhomsQlcCnsQlgfnwtlgfniHmgfn)FgfnYNnTCn)1hom)1Y$l)1mel)1YBlYNnYBl)FYBliHmYBlwtlmelsQlY$lsQl)v)4SQm@xcllSQm4D:_~)4<o<7NAl~);<u<LmAl~<,<4<N+Al~<;<s<T~~<$<o<-__)v_)v)4_)4~__~_,.B@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@WbniY$l!Blhom!BlcCn!Blgfn(Xgfn2$lgfn*kmgfn2:mTCn6bnhom6bnY$l6bncel6bnYBl2:mYBl*kmYBl2$lYBl(Xmel!BlY$l!Bl~<H<4<$qomodnY$lodngdlodnW;ky;mW;k(]W;k2$lW;k0dlgdl_Y$l_hom_YDn_ihn0dlihn2$lihn*kmihny;miDnodnqomodnY$l4Dlsfl4DlaDl!flaDl2$laDl*kmaDlw.msfl4Znj$l4Znqom4ZnWBn4Znydnn.mydn*kmydn2$lodnBglWBn(Dqom(DY$l4DlY$l4Dl~___qKm*tlLlm*tlz6m(yz6m$Tmz6mdumLlm!&mqKm!&mA6l!&mikldumikl$Tmikl(yA6l*tlqKm*tlSQm8+luim*olk2mo5lIkmgFmSQm8+l(K~___(E+jm85lgtmFkll-mollvFnI8l~<><><>Qnm9Sm(!$sm(!Ogm*3lOgm*3l(8(!(8(!o&lQnm9Sm", "(|)E~<u)9_85lj$lz5l_ZIl~~<><R(S85lj$lX2l_ZIl~~<7)*(EQ6lz5lz5l_ZIl~F6lQDlF6l(^_~<><:_~~<><p_Q6lz5lX2l_ZIl~F6l(KF6l!bm_~<><k(Z~~<><O(PQ6lz5lNsl_ZIl~~<8).(F4hlizl:Jl_ZIl~eImizl:Jl_ZIl~4;lu*l4;lECm!$lKImQ6lKImrxlKImyqlECmyqlu*lyqlu*lrxl(zQ6l(z!$l(z4;lu*l4;lu*l", "2p+)s_($2p+($__<><><>_oAl~<><><>~_<><><>___2p+_2p+_2p+_2p+)s2p+)s2p+)s_)s_)s_)s______", ")u)u~(j(j)i(&JQmeIm_ZIl~~)w)2<Z(*(Y(Z(6)W(6(*(Y(wl*l(w)R)A)R)A5/l(wl*l", ")u)u~<><><>(&JQmeIm_ZIl~~<M<C<()W(6(*(Y(Z(6(w(6(w)R)A)R)A(6)W(6", ")u)u~(1)J)B(&JQmeIm_ZIl~~)w<Z<E)W(6(*(Y(Z(6(w(6(w)R)A)R)A(6)W(6", ")u)u~(T(g(6(&JQmeIm_ZIl~~)T)a)<)W(6(*(Y(Z(6(w(6(w)R)A)R)A(6)W(6", ")u)u~)>()<P(&JQmeIm_ZIl~~<><h<=)W(6(*(Y(Z(6(w(6(w)R)A)R)A(6)W(6", ")u)u~(*(7)r(&JQmeIm_ZIl~~)$)w<Z)W(6(*(Y(Z(6(w(6(w)R)A)R)A(6)W(6", ")u)u~<V<W<c(&JQmeIm_ZIl~~)v)x)/)W(6(*(Y(Z(6(w(6(w)R)A)R)A(6)W(6", "`U(L~<><><>__(g_(g_(g_(g(L(g(L(g(L_(L_(L_(L______(8_)E_)E_)E_)E(L)E(L)E(L(8(L(8(L(8(L(8_(8_(8_)g_)!_)!_)!_)!(L)!(L)!(L)g(L)g(L)g(L)g_)g_)g_<E_<k_<k_<k_<k(L<k(L<k(L<E(L<E(L<E(L<E_<E_<E_<!_=I_=I_=I_=I(L=I(L=I(L<!(L<!(L<!(L<!_<!_<!_=k_=*_=*_=*_=*(L=*(L=*(L=k(L=k(L=k(L=k_=k_=k_>I_>o_>o_>o_>o(L>o(L>o(L>I(L>I(L>I(L>I_>I_>I_>*_?M_?M_?M_?M(L?M(L?M(L>*(L>*(L>*(L>*_>*_>*_?o_?:_?:_?:_?:(L?:(L?:(L?o(L?o(L?o(L?o_?o_?o_[M_[s_[s_[s_[s(L[s(L[s(L[M(L[M(L[M(L[M_[M_[M_[:_]Q_]Q_]Q_]Q(L]Q(L]Q(L[:(L[:(L[:(L[:_[:_[:_]s_])_])_])_])(L])(L])(L]s(L]s(L]s(L]s_]s_]s_^Q_^w_^w_^w_^w(L^w(L^w(L^Q(L^Q(L^Q(L^Q_^Q_^Q_^)_`U_`U_`U_`U(L`U(L`U(L^)(L^)(L^)(L^)_^)_^)_", ")7+x+MZmmy+MZm!BlKAl_(x(>)y_NAl_(x(>)y&;k~~(x(>)y6UlQnwodnQnw5onQnw8xnUww8xnk7w8xnk7w8xns-y8xn8Gz5on!Pzodn!Pz6Ul!PzqJl!PzmAl8GzmAls-ymAlk7wmAlUwwqJlQnw6UlQnw6UlQnw6Ulautodnaut5onaut8xne3t8xnu$t8xnu$t8xn2Cw8xn,Nw5onAXwodnAXw6UlAXwqJlAXwmAl,NwmAl2CwmAlu$tmAle3tqJlaut6Ulaut6Ulaut6UlO4qodnO4q5onO4q8xnS#q8xniCr8xniCr8xnqMt8xn7Xt5on+gtodn+gtodn+gt6Ul+gtqJl+gtmAl7XtmAlqMtmAlqMtmAliCrmAlS#qqJlO4q6UlO4q6UlO4q6UloT2odnoT25onoT28xnsc28xn8n28xn*x48xnK945onO,4odnO,46UlO,4qJlO,4mAlK94mAl*x4mAl8n2mAlsc2qJloT26UloT26Ulcdzodncdz5oncdz8xngmz8xnwxz8xn4718xn:,15onCG2odnCG26UlCG2qJlCG2mAl:,1mAl471mAlwxzmAlgmzqJlcdz6Ulcdz6Ul!;7odn!;75on!;78xn*I88xnKU88xnSe+8xnip+5onmy+odnmy+6Ulmy+qJlmy+mAlip+mAlSe+mAlKU8mAl*I8qJl!;76Ul!;76Ul0J5odn0J55on0J58xn4S58xn:d58xnGo78xnWz75ona87odna876Ula87qJla87mAlWz7mAlGo7mAl:d5mAl4S5qJl0J56Ul0J56UlC$nodnC$n5onC$n8xnGBo8xnWMo8xneWq8xnvhq5onyqqodnyqq6UlyqqqJlyqqmAlvhqmAleWqmAlWMomAlGBoqJlC$n6UlC$n6Ul!Blodn!Bl5on!Bl8xn*Kl8xnKWl8xnKWl8xnSgn8xnjrn5onm0nodnm0n6Ulm0nqJlm0nmAljrnmAlSgnmAlKWlmAl*KlqJl!Bl6Ul!Bl6Ul!Bl", ")7+x+MZmmy+MZm!BlKAl_<><><>_OAl_<><><>-;k~~<><><>6UlQnwodnQnw5onQnw8xnUww8xnk7w8xnk7w8xns-y8xn8Gz5on!Pzodn!Pz6Ul!PzqJl!PzmAl8GzmAls-ymAlk7wmAlUwwqJlQnw6UlQnw6UlQnw6Ulautodnaut5onaut8xne3t8xnu$t8xnu$t8xn2Cw8xn,Nw5onAXwodnAXw6UlAXwqJlAXwmAl,NwmAl2CwmAlu$tmAle3tqJlaut6Ulaut6Ulaut6UlO4qodnO4q5onO4q8xnS#q8xniCr8xniCr8xnqMt8xn7Xt5on+gtodn+gtodn+gt6Ul+gtqJl+gtmAl7XtmAlqMtmAlqMtmAliCrmAlS#qqJlO4q6UlO4q6UlO4q6UloT2odnoT25onoT28xnsc28xn8n28xn*x48xnK945onO,4odnO,46UlO,4qJlO,4mAlK94mAl*x4mAl8n2mAlsc2qJloT26UloT26Ulcdzodncdz5oncdz8xngmz8xnwxz8xn4718xn:,15onCG2odnCG26UlCG2qJlCG2mAl:,1mAl471mAlwxzmAlgmzqJlcdz6Ulcdz6Ul!;7odn!;75on!;78xn*I88xnKU88xnSe+8xnip+5onmy+odnmy+6Ulmy+qJlmy+mAlip+mAlSe+mAlKU8mAl*I8qJl!;76Ul!;76Ul0J5odn0J55on0J58xn4S58xn:d58xnGo78xnWz75ona87odna876Ula87qJla87mAlWz7mAlGo7mAl:d5mAl4S5qJl0J56Ul0J56UlC$nodnC$n5onC$n8xnGBo8xnWMo8xneWq8xnvhq5onyqqodnyqq6UlyqqqJlyqqmAlvhqmAleWqmAlWMomAlGBoqJlC$n6UlC$n6Ul!Blodn!Bl5on!Bl8xn*Kl8xnKWl8xnKWl8xnSgn8xnjrn5onm0nodnm0n6Ulm0nqJlm0nmAljrnmAlSgnmAlKWlmAl*KlqJl!Bl6Ul!Bl6Ul!Bl", ")7+x+MZmmy+MZm!BlKAl_(z)J(}_NAl_(z)J(}&;k~~(z)J(}6UlQnwodnQnw5onQnw8xnUww8xnk7w8xnk7w8xns-y8xn8Gz5on!Pzodn!Pz6Ul!PzqJl!PzmAl8GzmAls-ymAlk7wmAlUwwqJlQnw6UlQnw6UlQnw6Ulautodnaut5onaut8xne3t8xnu$t8xnu$t8xn2Cw8xn,Nw5onAXwodnAXw6UlAXwqJlAXwmAl,NwmAl2CwmAlu$tmAle3tqJlaut6Ulaut6Ulaut6UlO4qodnO4q5onO4q8xnS#q8xniCr8xniCr8xnqMt8xn7Xt5on+gtodn+gtodn+gt6Ul+gtqJl+gtmAl7XtmAlqMtmAlqMtmAliCrmAlS#qqJlO4q6UlO4q6UlO4q6UloT2odnoT25onoT28xnsc28xn8n28xn*x48xnK945onO,4odnO,46UlO,4qJlO,4mAlK94mAl*x4mAl8n2mAlsc2qJloT26UloT26Ulcdzodncdz5oncdz8xngmz8xnwxz8xn4718xn:,15onCG2odnCG26UlCG2qJlCG2mAl:,1mAl471mAlwxzmAlgmzqJlcdz6Ulcdz6Ul!;7odn!;75on!;78xn*I88xnKU88xnSe+8xnip+5onmy+odnmy+6Ulmy+qJlmy+mAlip+mAlSe+mAlKU8mAl*I8qJl!;76Ul!;76Ul0J5odn0J55on0J58xn4S58xn:d58xnGo78xnWz75ona87odna876Ula87qJla87mAlWz7mAlGo7mAl:d5mAl4S5qJl0J56Ul0J56UlC$nodnC$n5onC$n8xnGBo8xnWMo8xneWq8xnvhq5onyqqodnyqq6UlyqqqJlyqqmAlvhqmAleWqmAlWMomAlGBoqJlC$n6UlC$n6Ul!Blodn!Bl5on!Bl8xn*Kl8xnKWl8xnKWl8xnSgn8xnjrn5onm0nodnm0n6Ulm0nqJlm0nmAljrnmAlSgnmAlKWlmAl*KlqJl!Bl6Ul!Bl6Ul!Bl", ")7+x+MZmmy+MZm!BlKAl_(T(g(6_OAl_(T(g(6-;k~~(T(g(66UlQnwodnQnw5onQnw8xnUww8xnk7w8xnk7w8xns-y8xn8Gz5on!Pzodn!Pz6Ul!PzqJl!PzmAl8GzmAls-ymAlk7wmAlUwwqJlQnw6UlQnw6UlQnw6Ulautodnaut5onaut8xne3t8xnu$t8xnu$t8xn2Cw8xn,Nw5onAXwodnAXw6UlAXwqJlAXwmAl,NwmAl2CwmAlu$tmAle3tqJlaut6Ulaut6Ulaut6UlO4qodnO4q5onO4q8xnS#q8xniCr8xniCr8xnqMt8xn7Xt5on+gtodn+gtodn+gt6Ul+gtqJl+gtmAl7XtmAlqMtmAlqMtmAliCrmAlS#qqJlO4q6UlO4q6UlO4q6UloT2odnoT25onoT28xnsc28xn8n28xn*x48xnK945onO,4odnO,46UlO,4qJlO,4mAlK94mAl*x4mAl8n2mAlsc2qJloT26UloT26Ulcdzodncdz5oncdz8xngmz8xnwxz8xn4718xn:,15onCG2odnCG26UlCG2qJlCG2mAl:,1mAl471mAlwxzmAlgmzqJlcdz6Ulcdz6Ul!;7odn!;75on!;78xn*I88xnKU88xnSe+8xnip+5onmy+odnmy+6Ulmy+qJlmy+mAlip+mAlSe+mAlKU8mAl*I8qJl!;76Ul!;76Ul0J5odn0J55on0J58xn4S58xn:d58xnGo78xnWz75ona87odna876Ula87qJla87mAlWz7mAlGo7mAl:d5mAl4S5qJl0J56Ul0J56UlC$nodnC$n5onC$n8xnGBo8xnWMo8xneWq8xnvhq5onyqqodnyqq6UlyqqqJlyqqmAlvhqmAleWqmAlWMomAlGBoqJlC$n6UlC$n6Ul!Blodn!Bl5on!Bl8xn*Kl8xnKWl8xnKWl8xnSgn8xnjrn5onm0nodnm0n6Ulm0nqJlm0nmAljrnmAlSgnmAlKWlmAl*KlqJl!Bl6Ul!Bl6Ul!Bl", ")7+x+MZmmy+MZm!BlKAl_)=()<O_OAl_)=()<O-;k~~)=()<O6UlQnwodnQnw5onQnw8xnUww8xnk7w8xnk7w8xns-y8xn8Gz5on!Pzodn!Pz6Ul!PzqJl!PzmAl8GzmAls-ymAlk7wmAlUwwqJlQnw6UlQnw6UlQnw6Ulautodnaut5onaut8xne3t8xnu$t8xnu$t8xn2Cw8xn,Nw5onAXwodnAXw6UlAXwqJlAXwmAl,NwmAl2CwmAlu$tmAle3tqJlaut6Ulaut6Ulaut6UlO4qodnO4q5onO4q8xnS#q8xniCr8xniCr8xnqMt8xn7Xt5on+gtodn+gtodn+gt6Ul+gtqJl+gtmAl7XtmAlqMtmAlqMtmAliCrmAlS#qqJlO4q6UlO4q6UlO4q6UloT2odnoT25onoT28xnsc28xn8n28xn*x48xnK945onO,4odnO,46UlO,4qJlO,4mAlK94mAl*x4mAl8n2mAlsc2qJloT26UloT26Ulcdzodncdz5oncdz8xngmz8xnwxz8xn4718xn:,15onCG2odnCG26UlCG2qJlCG2mAl:,1mAl471mAlwxzmAlgmzqJlcdz6Ulcdz6Ul!;7odn!;75on!;78xn*I88xnKU88xnSe+8xnip+5onmy+odnmy+6Ulmy+qJlmy+mAlip+mAlSe+mAlKU8mAl*I8qJl!;76Ul!;76Ul0J5odn0J55on0J58xn4S58xn:d58xnGo78xnWz75ona87odna876Ula87qJla87mAlWz7mAlGo7mAl:d5mAl4S5qJl0J56Ul0J56UlC$nodnC$n5onC$n8xnGBo8xnWMo8xneWq8xnvhq5onyqqodnyqq6UlyqqqJlyqqmAlvhqmAleWqmAlWMomAlGBoqJlC$n6UlC$n6Ul!Blodn!Bl5on!Bl8xn*Kl8xnKWl8xnKWl8xnSgn8xnjrn5onm0nodnm0n6Ulm0nqJlm0nmAljrnmAlSgnmAlKWlmAl*KlqJl!Bl6Ul!Bl6Ul!Bl", ")7+x+MZmmy+MZm!BlKAl_(-(7)r_NAl_(-(7)r&;k~~(-(7)r6UlQnwodnQnw5onQnw8xnUww8xnk7w8xnk7w8xns-y8xn8Gz5on!Pzodn!Pz6Ul!PzqJl!PzmAl8GzmAls-ymAlk7wmAlUwwqJlQnw6UlQnw6UlQnw6Ulautodnaut5onaut8xne3t8xnu$t8xnu$t8xn2Cw8xn,Nw5onAXwodnAXw6UlAXwqJlAXwmAl,NwmAl2CwmAlu$tmAle3tqJlaut6Ulaut6Ulaut6UlO4qodnO4q5onO4q8xnS#q8xniCr8xniCr8xnqMt8xn7Xt5on+gtodn+gtodn+gt6Ul+gtqJl+gtmAl7XtmAlqMtmAlqMtmAliCrmAlS#qqJlO4q6UlO4q6UlO4q6UloT2odnoT25onoT28xnsc28xn8n28xn*x48xnK945onO,4odnO,46UlO,4qJlO,4mAlK94mAl*x4mAl8n2mAlsc2qJloT26UloT26Ulcdzodncdz5oncdz8xngmz8xnwxz8xn4718xn:,15onCG2odnCG26UlCG2qJlCG2mAl:,1mAl471mAlwxzmAlgmzqJlcdz6Ulcdz6Ul!;7odn!;75on!;78xn*I88xnKU88xnSe+8xnip+5onmy+odnmy+6Ulmy+qJlmy+mAlip+mAlSe+mAlKU8mAl*I8qJl!;76Ul!;76Ul0J5odn0J55on0J58xn4S58xn:d58xnGo78xnWz75ona87odna876Ula87qJla87mAlWz7mAlGo7mAl:d5mAl4S5qJl0J56Ul0J56UlC$nodnC$n5onC$n8xnGBo8xnWMo8xneWq8xnvhq5onyqqodnyqq6UlyqqqJlyqqmAlvhqmAleWqmAlWMomAlGBoqJlC$n6UlC$n6Ul!Blodn!Bl5on!Bl8xn*Kl8xnKWl8xnKWl8xnSgn8xnjrn5onm0nodnm0n6Ulm0nqJlm0nmAljrnmAlSgnmAlKWlmAl*KlqJl!Bl6Ul!Bl6Ul!Bl", ")7+x+MZmmy+MZm!BlKAl_<U<V<c_OAl_<U<V<c-;k~~<U<V<c6UlQnwodnQnw5onQnw8xnUww8xnk7w8xnk7w8xns-y8xn8Gz5on!Pzodn!Pz6Ul!PzqJl!PzmAl8GzmAls-ymAlk7wmAlUwwqJlQnw6UlQnw6UlQnw6Ulautodnaut5onaut8xne3t8xnu$t8xnu$t8xn2Cw8xn,Nw5onAXwodnAXw6UlAXwqJlAXwmAl,NwmAl2CwmAlu$tmAle3tqJlaut6Ulaut6Ulaut6UlO4qodnO4q5onO4q8xnS#q8xniCr8xniCr8xnqMt8xn7Xt5on+gtodn+gtodn+gt6Ul+gtqJl+gtmAl7XtmAlqMtmAlqMtmAliCrmAlS#qqJlO4q6UlO4q6UlO4q6UloT2odnoT25onoT28xnsc28xn8n28xn*x48xnK945onO,4odnO,46UlO,4qJlO,4mAlK94mAl*x4mAl8n2mAlsc2qJloT26UloT26Ulcdzodncdz5oncdz8xngmz8xnwxz8xn4718xn:,15onCG2odnCG26UlCG2qJlCG2mAl:,1mAl471mAlwxzmAlgmzqJlcdz6Ulcdz6Ul!;7odn!;75on!;78xn*I88xnKU88xnSe+8xnip+5onmy+odnmy+6Ulmy+qJlmy+mAlip+mAlSe+mAlKU8mAl*I8qJl!;76Ul!;76Ul0J5odn0J55on0J58xn4S58xn:d58xnGo78xnWz75ona87odna876Ula87qJla87mAlWz7mAlGo7mAl:d5mAl4S5qJl0J56Ul0J56UlC$nodnC$n5onC$n8xnGBo8xnWMo8xneWq8xnvhq5onyqqodnyqq6UlyqqqJlyqqmAlvhqmAleWqmAlWMomAlGBoqJlC$n6UlC$n6Ul!Blodn!Bl5on!Bl8xn*Kl8xnKWl8xnKWl8xnSgn8xnjrn5onm0nodnm0n6Ulm0nqJlm0nmAljrnmAlSgnmAlKWlmAl*KlqJl!Bl6Ul!Bl6Ul!Bl", "}-^u*Tv_*Tv^u_~<><><>~_<><><>_QM4^u2bm^uwtl^u_oFy_iXx_2bm_wtlwtl_2bm_GM4_}j_:n5wtl:n52bm:n5YXx}-oFyW*4^uQM4^u", "^h>a~<p(q(G4hl:an8ll)r,qlkenMxl;fnc3lZhns9loin,&lkjnWAmgknIGmIln6LmmlnYRm*lnnVmOmnRYmOmn4dmOmnUhmdlnuim4jn:jmKin(]mgn(]4en(]6bn+jmkZnbimAYn!gmnWn;emWVn()lUnMZmUTnqUmjSn$Om)jQJm7RnVDmJRn6,lCQnh!l,On,5lONnizl4Kn:slZInCnl)Zuhle;mQclU*mCYlm9mwUlK1mURl)AwPl8hmwPlWUmwPlQJmARl,:l+Tl5/lyWlg2lUbliul$hl0nlmol,glMxl8bl:7l(S6,lmUlDKm(O(@(Ouim(OUrmWTl6zmcUlW8m(QU*m(R0BnqYlKJnYaltcnIPlKinKRlKinKRlKinFkl!hnFkl6Mn*Vm2InCUm2DneSm*.m*QmJ$mqPmD8maOm.1mfNm#vmiMmEqm*LmdkmwLm0emdLm:ZmwLmPWm(!oSmANmJQm,NmCPmMPm8Nm(&UNmASmUNmCUmUNmsWmHOm(;qPmrZmERm6am,SmtbmcVmVcm4YmGdmkdm4dmWjmMemJpmqemivmcfmG2m(>18m8hmj&m1jmRAnfmmIHnJpmONnCtm2SngymUYn+3m2cn3+mSgnS.mujn4Fndln)idln.dndlnWpn&jnrzn*gn$8n.dnQ,nGZnOEoZSn,KorLn0Ro7Cn/Wo+#m<I$2mKeowpm<M+Zm<M;Pm<MSGmQfow,lAeoF9l6coL0lMbo$rl<HwjlSXoucl<EoWl*SosQluQoKMl3OogJl)|WJl7&n4hl:an~)t(5)qIho:boIho+PmM4n+PmM4noWliGqoWliGq+Pm<#+Pm<#:boIho:bo~(I)0(KO&r:bot5r,-nJ,q,-n68q:boPBq:boPBqOOoPBq+CoACqW$n4Dq04n=O:unaIq+kneMq)pG*qyWl86ryWlons&ZnYrsqknMus0un*vsg4nyxsM$nkys0Cokys*Nokys:boO&r:boKmrwCn+jrS$m8hr)IYgrusmnar6GmhUrusm,Sr)IFRrS$muOrwCnKmrwCn~<m)+(H9bvBKoSZv4LosVv6No2QvQQo!LvwSoYGv<E:;uSXo[PeZoi8uWbol0u6co?|VeoekuGfo$buGfo*JuGfoI*t6coY2tYYooot!To*ct)|sTt)>KKt):IDtC4nS:sMpnc&sWanG#s)cG#s69mG#sJpmm&sUXmS:seImIDto&lKKtm3lsTtEulEdtskloot0dlY2tSZlI*t6Ul*JukSl$bukSl8kukSlYtuWTlN1u*UlA9uoWlM*ugYlwAv2alAHvCdl,WvuSlobv*Ulobv*Ulobv+nl9bv0nllDvrZmM;uyXm1*uEWm+/uqUm:6uQTmS2uASmwxuERm*suJQmiouhPmeku($RguuOm0cuaOmAauaOm6TuaOmcOu$OmwJu+Pm*Eu7Qm!Au,Smk.tEWmI*tWZmo#tCem6/tSkmC+tsqmQ9t:ymQ9tw9mQ9tY:mC+t0Gn6/t*Mno#tLTnI*t#Xnk.tIbn!Auken*EumgnwJuihncOuein6Tu,inAau,in/cu,inRguzineku)v?^!hnFtuOhnwxuSgnc2uXfnI7uGen+/u2cn1*ucbnM;uuZnlDv2Xnobvy!n9bvBKo~(G)i<K2hx:bo$-w:Vn!0w:Vn!0w:boi4v:boi4voWl!0woWl!0w()$-w()2hxoWl^ikDlsiyoWl82xs+mKjyxIotiy:bo2hx:bo6ylY&r6yl<`_<`_$9oKYn$9oKYn<`Pvm<`PvmY&r6ylY&r~<p(q(GAapY&rAapZ9q3noZ9q3noY&rYrnY&rYrn$9o3no$9o3no$&pAap$&pAap$9oeWq$9oeWqY&rAapY&rJWsY&rQ-rW-q:yrW-q:yrY&rr2qY&rr2q$9oDQs$9ouZs$9o.isg+o>!d/oE1s<kM9sW&o>]W:olBtWDpWHtKLpvLtyVp?K<&SSt<=SStf$pSSt;JqzPt4XqeKtCiq?CWsqm:sK0qe!sy5q+Wt9wrJXtY&rJWsY&r4FsaIq-HsaIq.Js=Q;LsGIqBOs8Hq4PsVHqIRsOGqiSsIFq>ukDqkUsYBqWVsN;p0VsO,p0Vsf$p0Vsu+pWVsm7pkUsk5p>uY3piSs01pIRsu0p4PspzpBOs#yp;Ls2yp.Jsiyp-Hsiyp4Fsiyp:yriyp:yrkIq4FskIq~)t(5)q4ztY&r4zt$9o[+$9o[+r1pMwur1pMwum-pwyvm-pwyv=2Mwu=2MwunBr[+nBr[+O&r4ztO&r~<m)+(HWPwY&rWPw$9oyUy$9oyUyr1p0Lxr1p0Lxm-pOOym-pOOy=20Lx=20LxnBryUynBryUyO&rWPwO&r~<1)c(+4hlEIn8ll)d,qlqLnMxlFNnc3lfOns9luPn,&lqQnWAmmRnIGmOSn6LmsSnYRmATnnVmUTnRYmUTn4dmUTnUhmjSnuim+Qn:jmQPn(]sNn(]+Ln(]!In+jmqGnbimGFn!gmtDn;emcCn()rBnMZmaAnqUmp;m$Om)VQJm#:mVDmP:m6,lI.mh!lC,m,5lU*mizl+#m:slf/mCnl)Luhlk2mQclaxmCYlsqmwUlQimURl(@wPl$OmwPlcBmwPlW!lARlC2l+Tl/slyWlmjlUblobl$hl6UlmolCOlMxl$Il:7l(E6,lsBlDKm_(@_4im_(}cAlE0miBlq8m(Co*m(D)XwFlUJneHluPnMJlNVnOLl0anQNlCfnSPlBinKRl*MnADm!InIBm!Dnk;lE:mA:lS$mw,lM8mg-lG2ml*lAwmo&lOqmA&lmkm2$l+emj$lIam2$lYWm(yySmG*lSQmC-lMPmS,l,Nm(1fNmG;lfNmIBmfNmyDmQOm(70PmxGmORm!HmGTmzImnVmbJm&YmMKmvdm+KmgjmSLmSpmwLmsvmiMmQ2m(#+8m$Oms&m7QmaAnlTmSHnPWmYNnIam!SnmfmeYn*km!cn9rmcgnY0m4jn+8mmln6.mmlnDLnmlncWnDknxgnEhn:pnGenWznRZnU7njSnC$n1Ln6:n-Cn-Do:#mqHoC3mQLo7pm:Mo:Zm:MoJQm:MocGmWMo6,lGLoO9l!JoV0lSIoCslQGo6jlYEo4clMCoyWlAAo2Ql0.nUMl9-nqJlE*n4hlEIn~)})A<SIhoEJoIho*,lM4n*,lM4nuDliGquDliGq*,l<#*,l<#EJoIhoEJo~(n<A)KO&rEJot5rCznJ,qCzn68qEJoPBqEJoPBqU-nPBq*5nACqcvn4Dq6ln=OEcnaIq*RneMq)bQ*quDl.6ruDlzns+GnirsmRnWuswbn>&dln9xsIvnuysx5nuys!*nuys*IoO&r*IoKmr25m+jrYvm8hr(]Ygr0Zmnar!9lhUr0Zm,Sr(]FRrYvmuOr25mKmr25m~<z<K(=9bvH#nSZv+$nsVv!*n2QvW.n!Lv2;nYGv)=:;uYEo[PkGoi8ucIol0u!Jo?|bLoekuMMo$buMMo*JuMMoI*t!JoY2teFooot,Ao*ct):sTt)#KKt)6IDtIlnS:sSWnc&scHnG#s)OG#s!qmG#sPWmm&saEmS:sk/lIDtuwlKKtsklsTtKblEdtyRloot6KlY2tYGlI*t!Bl*Juq;k$buq;k8kuq;kYtucAlN1uAClA9uuDlM*umFlwAv8HlAHvIKl[deMlKRv(L3VvARlSZvCTl9bv6UllDvxGmM;u4Em1*uKDm+/uwBm:6uWAmS2uG;lwxuK:l*suP.lioun,leku(0Rgu0-l0cug-lAaug-l6Tug-lcOu:-lwJu*,l*Eu#.l!AuCAmk.tKDmI*tcGmo#tILm6/tYRmC+tyXmQ9tEgmQ9t2qmQ9te1mC+t69m6/tA*mo#tRAnI*t.Enk.tOIn!AuqLn*EusNnwJuoOncOukPn6TuCQnAauCQn/cuCQnRgu5Pneku)h?^,OnFtuUOnwxuYNnc2udMnI7uMLn+/u8Jn1*uiInM;u0GnlDv8En9bvH#n~(M)?<i2hxEJo$-wEDn!0wEDn!0wEJoi4vEJoi4vuDl!0wuDl!0w(+$-w(+2hxuDl2iyuDl,2xyrm2iyEJo2hxEJo6ylewr6yl<,_<,_:qoKYn:qoKYn<,Pvm<,Pvmewr6ylewr~<1)c(+AapewrAapfqq3nofqq3noewrYrnewrYrn:qo3no:qo3no:wpAap:wpAap:qoeWq:qoeWqewrAapewrJWsewrQ-rcyq:yrcyq:yrewrr2qewrr2q:qoDQs:qouZs:qo.ismro>!jsoE1s<WM9scwo>]c1olBtc6oWHtQ$ovLt4Cp?K<1SSt<!SStlvpSStF#pzPt+EqeKtIPq?CcZqm:sQhqe!s4mqJXtUwrJWsUwr4Fsg/p-Hsg/p.Js=C;LsM/pBOs$+p4Psb+pIRsU9piSsO8p>uq6pkUse4pWVsT2p0VsUzp0Vslvp0Vs0rpWVssopkUsqmp>uekpiSs6ipIRs0hp4PsvgpBOs.fp;Ls8fp.Jsofp-Hsofp4Fsofp:yrofp:yrq/p4Fsq/p~)})A<S4ztewr4zt:qo[+:qo[+xipMwuxipMwusypwyvsypwyv=oMwu=oMwut4q[+t4q[+Uwr4ztUwr~<z<K(=WPwewrWPw:qoyUy:qoyUyxip0Lxxip0LxsypOOysypOOy=o0Lx=o0Lxt4qyUyt4qyUyUwrWPwUwr", "(,(y~<><><>VOm-Sl./l;mlFvlmHlUelRnl!Fl/Sl(M(y(6(yrGlrRlrGl_ZIl~xNmrRlrGl_ZIl~Jvl5GlrGl_ZIl~", ")6<+~(m)k)9)6vGoqunFOomqnoUoOmnCbooinqgo!hnYnoOhnotoodnGHpZIn0XpkxmcYp!gm6Yp:Pmpapu;lNXpM2lJTpHml6JpQhli7o8bl<MYQl4GoqEl43niBl)6g;k)10;k,inIAlYXn+El)gSPliInCTlgGn+Tl2Dn+Tl8;m0TlUmmIUl2CmqTlOplqTl(Qebl8Hl(iSAl6ylSAlx3lSAl(tSAlo&leCla;lEGlkEmOLl+KmoRlfNmIZloNmkhl,Nm2zl8Nm:-loNmQOmoNmeSmaOmNUm,SmCUmYbmuTmGimUXm5nmadm*pmxfm,rmehm#vmKhmW8mZgmN,mslmtDnYvmQFnaxmgGnTzmUJnIzmaZngymzinW8mSqn2:mQtn2Dnnvn!InAxnfOn)6gkn)6)#)6vGoCslO-o2zleLp!$lQRpoImhSpTam7Tpasm!UpO+m8Qp)YgNpyOnoGp$UnH$opYne3o0anjso)rchoydnOdoCfn8ZoshnqWoHonOOo!rn!Eo)2*&njrnA2nsrnHon)2Can!rnqLnwln,;m6bnH!mEXnb7m:Qnx4mQKn64m.En*4mgBnC3mi:m0ymw$mYqm)KUmmKwmHnmormknmWomKmmilmDjmmfmocmGYmMZmWPm0ZmGJmIam(8UXmEHmYRmZHm+FmZHma*lOHm!4lEHmevlsHm,llcGmucl.Dm!Ll!4l0;ksplMJlIelYQl2alYal2al5ml(UwBmsalomm(UgBn(UIHn+YlkKn+TlONnKHlGUnUCl2hn8Hl:un0Jl0zn(Jg4nMOlM9nkXl+HoMil:boHmlyyoMnlC5o(ew/oCslO-o~<)<<<<CslO-ocolm/oWnlC5oQmlyyoWil:bouXl+HoWOlM9nKMlg4n+Jl+zn,Hl:unoCl2hnUHlGUn:TlONn:YlkKnAblIHnAblgBn2alommAblwBm(U5ml(UYalIelOQl(fMJlB5l0;kGEmAMlcGmkclBImSol6GmA0liHm5/l!Hmp:l2HmZHmOHmJQm6Gm2Wm8Im:ZmhPmrZmaYmCZmxfmecmslm$imqomKmm9rmanmUwm,mmo6mKmm*$mOqms:m0ymMBnk2mkFn*4mGKn64m:Qnm4mEXnQ7m-bn,/monnrBnCunuPnOrn2hn0pn*qnJqnc0njrn19natnRBoqpngMo!hnWWoXfnpZo.dnEdoKdnIho:an<V)oK3oNVn8#oKOng+oZInC5o4Ant2oC3mcwoDjmuuokOm<Zs.l<bc3lK3oCslO-ocBm(ZcBm(QS#lSKlq2l+Jl,qlgJlzgl2VlEfloglSelHmlzglkmlKllOkl8vl(X$6l6elW-liklrAmMnlOCm$mlcBm(Z~<C<h<eCslO-oc3lK3os.lC0oQOm2xo4im$uo42mwwo)W!2oEInX5o!Nn1+o$UnH$oyOnoGp)YWNpO+m8Qpasm!UpTam7TpoImhSp!$l<42zleLpCslO-ocBm(ZOCm$mlrAmWnlg-likl$6l6el,vl*elUllOklzglkmlcelHmlOfloglzgl2Vl,qlgJl02l+JlS#lIKlcBm(QcBm(Z", ")6<v~(n)k)9)6Q8n)6b8n)6u8nAxn48n)4):mqnpAoOmn$GooingMo!hnOToOhneZoodn,8oZInrDpkxmTEp!gmwEp:PmeGpu;lCDpM2l::o,llw/oQhlYno8bl$LoYQlu8nqEl)w!Bl8dn0;kAYn0;kwRnq;kqGnWEl*.mWOlE&mCTl5!m:Tl*9m:TlE5m+Tl(@IUll*l0TlUllqTloWlIZl2Ll,llqElCnl(DoqlKCl4rl2BlItl~Ezlq;kX2l_k6lSAl,+l6AlS#l~m#lYBlYCmEGl0AmAHlkEm*KlqKmKRloNmuXl(#sfl8Nmpvl8Nmu/l(#(7(#QJmaOm+KmeSm1Km((WKmuim(#+om$Tm!qm*VmNtmsWmKwmiWmM8m*VmW,mTamKEnqjm4FnslmZInymm$KnommkZnKmm,incum)1!5m9snm9m/unh#mAxna-m)6u-m)64-m)6C,m)6Q8nollmcoumlQko+nl*roNsl<a.0l3!o!$ly,oBImq:ocam#Ap$smABpf/my,o!InQ$oCaneyoaZn<KaZnEdoaZn-coaZn6coCan<I:anPYoTbn$VoicnINo4enKFo1kn/.n)0q$njrno7nsrnc0n!rngknAsnaUnsrneEnOrnq8mWan,rm2InormoEn(}gBnOqmA;m8mm7$m0em)KEbmUwm2bmormKcmMom6am6kmpXm;emASm,XmqPm:PmqPm!HmqPmOHm5OmEHm6Gm6Gmk/l2HmPulxGm4cl0Fm(LU5l2BlWsl8Hlegl(K2al2Vl2alqil(Uy&l2al6am(U47m(UQ!m6ZlY&msVlu-mqEl8EnACl3Nn+Jl)t(P.2nbhl:Coollmco~<)<<<<$mlCgoHmlggofll<JUll&ao8glCCo:Tle2n:Jl0fnKCl!Nn0El.En2Vl4-m*Zlj&mAbla!mAbl$7m(U6amAbly&l(U1il(U2VlKgloMl(h(G(u~0Fm(LxGm$cl2HmPul6Gmk/lEHm(8OHm$Om!Hm+Pm:Pm0Pm,Xm0PmIfmLSm6kmyXmCom6amormKcmUwm!bm)KEbm7$m0emA;m,mmrBnYqmyEnyrm2InyrmWanGsmErn18msrn)ZAsnlUn!rnqknsrnm0njrnz7nMpnq$n1kn:.n4enKFoicnSNoTbnCWoIbncXo0ansYoWan,Zo&ZnMboGZnQfoeYnKeoeTnaVoSMnKKowCnVFo81m7&nMemW$n;FmS:nH/lgCopvlZJoSolMboJolgboWnl<M$mlCgo8gl0Yl(Y6ZlQhlAblgil2aliulCYlz5lkXlN-lwZlw,l*Zle:lialk;l:YlrAmkXlk;l!Vly:lwUll*lWOlf+lSKl+2lIKl(h:JlfllSPl8gl0Yl~<D<h<e(c!dooll<K,llmcoumlTcoWnl:bo:nl0boSol&aopvlEJoH/l)=;Fm:.nMemC$n.1mm&nwCnAFoONn)`9TnwSoGZnwcoRZn-coRZnEdoRZnYdo4Zneyo2InH$oU/my,o)AABpTam#Ap!Hmq:o2$ly,o.0l!!oCsl<a:nlYso5mlMlo(c!dogil(UQhlKbl(Y*Zl8gl+YlfllSPl(h:Jl+2lIKlf+lSKll*lWOly:lwUlk;l!VlrAmkXlk;l:Yle:lialw,lEalN-lwZlz5luXlYulCYlgil(U", ")v)4~)M<I<Y+om4tn2$l4tn;dl4tn:;k5Pn:;kA1m:;k8Im:;kEul;dl(M2$l(M+om(M2Dn(MshnEulshn8Imshn)Gshn5PntDn4tn+om4tn2$l:TlBgl:Tl4DlRwl4Dl,Im4DlA1m4Dl3NnBgl:pn2$l:pn+om:pnrBn:pn8dn3Nn8dnA1m8dn8Im8dnGwlrBn+Tl+om+Tl2$l+Tl~)K)[<P2$lsQl+omsQlwCnsQl0fnwtl0fniHm0fn)F0fnYNnwCn)1+om)12$l)1(X)1!BlYNn!Bl)F!BliHm!Blwtl(XsQl2$lsQl)v)4wQmWBXwQmKbZ_~)4<o<7NAl~);<u<LmAl~<,<4<N+Al~<;<s<T~~<$<o<-__)v_)v)4_)4~__k:k_GdZ@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni2$l2Bl+om2BlwCn2Bl0fn6el0fns$l0fn(]0fni:mwCn)q+om)q2$l)q(X)q!Bli:m!Bl(]!Bls$l!Bl6el(X2Bl2$l2Bl~<H<4<$+omodn2$lodn;dlodn:;kp;m:;k6km:;ks$l:;k+dl;dl_2$l_+om_2Dn_shn+dlshns$lshn(]shnp;mtDnodn+omodn2$l4DlKgl4Dl(DBgl(Ds$l(D(](Dc.mKgluZn!$luZn+omuZnrBnuZn8dnc.m8dn(]8dns$l8dn!flrBnuDl+omuDl2$luDl~___oNm,qloNmy&lq,my&lq,mWomoNmWomoNm)OAll0PmoNm,ql", ")v)4~)M<I<Y+om4tn2$l4tn;dl4tn:;k5Pn:;kA1m:;k8Im:;kEul;dl(M2$l(M+om(M2Dn(MshnEulshn8Imshn)Gshn5PntDn4tn+om4tn2$l:TlBgl:Tl4DlRwl4Dl,Im4DlA1m4Dl3NnBgl:pn2$l:pn+om:pnrBn:pn8dn3Nn8dnA1m8dn8Im8dnGwlrBn+Tl+om+Tl2$l+Tl~)K)[<P2$lsQl+omsQlwCnsQl0fnwtl0fniHm0fn)F0fnYNnwCn)1+om)12$l)1(X)1!BlYNn!Bl)F!BliHm!Blwtl(XsQl2$lsQl)v)4wQmWBXwQmKbZ_~)4<o<7NAl~);<u<LmAl~<,<4<N+Al~<;<s<T~~<$<o<-__)v_)v)4_)4~__k:k_GdZ@Wbni@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@+P-p@+P-p@+P-p@+P-p@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@+P-p@Wbni@Wbni@Wbni@Wbni@Wbni@Wbni2$l2Bl+om2BlwCn2Bl0fn6el0fns$l0fn(]0fni:mwCn)q+om)q2$l)q(X)q!Bli:m!Bl(]!Bls$l!Bl6el(X2Bl2$l2Bl~<H<4<$+omodn2$lodn;dlodn:;kp;m:;k6km:;ks$l:;k+dl;dl_2$l_+om_2Dn_shn+dlshns$lshn(]shnp;mtDnodn+omodn2$l4DlKgl4Dl(DBgl(Ds$l(D(](Dc.mKgluZn!$luZn+omuZnrBnuZn8dnc.m8dn(]8dns$l8dn!flrBnuDl+omuDl2$luDl~___q,m0PmCUm)OCUmWomAllWomAlly&lCUmy&lCUm,qlq,m0Pm", ">M>M~<><><>mAl<G_<G<G<G1.ks-k_<G<G<GHElQGl_<GLOl<G<GkJo1.ks-k_<G<GkJoHElQGl_~)<g1m!7ng1mrgnixnrvnixnb1nphnaHophnjNoixn/coixn15n3VnN&n4-m9Co3Vn15n3Vn6Ipg1mb-og1mb-owEnt2oqQn+Sl-:k2.k~O2ocRnuTl4.kq,k~<NALn<N&Xn<Nmknknoprni2oXfnMTlMDl.Bl~Y2o0fnySl.BlYBl~w1ovenBUlYBlxAl~Y,oixn6Ipixn6Ipg1mOyowLnI6o*Rn-Jlm,k3.k_c6o7Rn9Jlz.k,:k_e-ooPne-oVYne-oJgnM$oEknS6oGen2Jl1Al.Bl_I6o8dn:Jl,BleDl_.uoIfn.uo;Wn.uohPnOyowLndmm/SpdmmEHpSDmEHpSDmdXoH/ldXoH/l/Spdmm/SpqwmtHps&ma.ojVlfDlrCl~n.ms!oWdlsCl.Bl~P:m**o,YlACl$Al~n.mJ*o:Zl$Al7;k~)Uk$oyZl$;k7:k~Y:mQ$oNZl6:ky.k~:,mw*opbl3.kE.k~y*mO!oiWlE.kS,k~2:m$$oWblU,kt-k~ICn0&owelv-k:*k~u+m-3oc.mw/opLlq,k#:k_9Jn-7o9Jnd&o9JnCBpUGnDFpc.ma.opLl8AlJDl_C7mCBpC7mk&oC7m-7ou+m-3ofvnw0om0n88ohJl:,k7.k_X6nSzoQ8n$0oK+no2oK+ne6oK+n37o6ln8!nB;lmBl4Bl_X4nghp8sll.kN.k~LsncEpTNlK.kZ,k~)36EpUOlY,kr-k~ysnYFp:Nlv-kk*k~vnnAUpivnAUpwvn::o&Ul:BlfBl~NunL,oCYleBl&Al~Y/nzNpx/n$Opf!nmRp,!n/SpREo/Sp!do!FptcliDl7Dl_e3orDpI2l#DlJEl_XBom8oXBo5zon;nlwoI+ne3oONlI;kU:k~,+n:oo.1n:ooFsn:ooEnnmso)7s7o9Sl/,k&-k~Msns5ot1n<hwJl:-k7,k_K+nM.o)wW:obal6;kJAl_t1nUBpSIlSAlKBl_Wzn::oiLlGBl,Bl_MznMDpNHl*BlADl_uyn0DpfGl:ClHEl_yxnrDphFlt-k.,k_65n!UpmYlH.km.k_6lnF/n&Im0BlqBl~K+nN.oF9o9Wowvo9WowvoDwo+goB8o+Sl-:k2.k~ggoz8ouTl4.kq,k~oLoe2ooLoW&ooLo&Fp5Ro.Mp0go2ApMTlMDl.Bl~qgo<sySl.BlYBl~Cgo*;oBUlYBlxAl~two/SpF9o/SpF9o9WojcoD3obkob9o-Jlm,k3.k_ukoQ9o9Jlz.k,:k_0vo-6o0voy&o0vomBpisoiFpkkon;o2Jl1Al.Bl_bkoS;o:Jl,BleDl_TZomApTZoc$oSZo+6ojcoD3o2NpSjo2Np9WoXAp9WoXApSjo2NpSjo2Np/Sp2NpJqoXApJqoXAp/Sp2Np/Spv;pY9oyfp<h8pl#;ks;k~g6po3oxOlo;k::k~x7pV3ohNl*:kR:k~84pG9o:TlU:k0.k~lup:oo/nprxo/npJqodbpJqodbp/Sp8op/Sp8op#-o8opc9o+ppR6oAzpG9ojJlB,k*,k_8zpD+otKl&,k3.k_G0pO7o+Hlz.km:k_R0px6oWHlp:ke;k_P8p46oP8p:$oP8p/Spv;p/Spv;pY9o.Lq9Xp=d:Xp1Nlu-kb*k~4Wqhnpwjqhnp=l8BpgllAClsBl~!pqYUpRSlrBl:Al~UqqaWpjQl&AlSAl~gOqiPpQtlOAl7;k~27qJqoMvqJqoMvqSxoDpq:oovfq:oo=h88owTl3.kq,k~SKqh2oSKqP&oqnqS*oRdlw-k9*k~weqPApoSlYDl-Bl~Voq/SpWuqvKpWuqCSp*ZqJTpSUl5;kOAl_qnqGWpZGlVAlPBl_EkqqNpjPlaBlECl_XiqJTp-Jl!Bl0Cl_=i/XpFFl,ClCEl_BMqOWp.LqLXp.Lq9Xp.Lq9XpJbqA3o+iqQ9o4Jll,k3.k_=k<iMKl0.k*:k_nuq$6onuq5$onuqYApKrqMEp;iqa.olKl6Al;Bl_0iqW:omJl.BlPDl_;XqmAp;Xqg$o;Xq36oJbqA3o", "(m(m(E~<><><>(I+ElPulPul+El+ElPul+El+ElPulPul+El+El", "(y(y~<><><>(mWxl0YlWxl,WlWxlsVl,vlsVlPulsVlPulsVlgsl,WlGrl0YlGrl(mGrl.0lGrlX2lgslX2lPulX2lPulX2l8vl.0lWxl(mWxl(OGwl(OWsl(OurlQSlGrloRlGrlWOlGrluNlGrlGNlurlGNlWslGNlGwlGNl4wluNlWxlWOlWxloRlWxlQSlWxl(O4wl(OGwl(m!kl0Yl!kl,Wl!klsVlmjlsVl4hlsVl4hlsVlBgl,Wlxel0Ylxel(mxel.0lxelX2lBglX2l4hlX2l4hlX2lmjl.0l!kl(m!kl(O6jl(OBgl(OZflQSl6eloRl6elWOl6eluNl6elGNlZflGNlBglGNl6jlGNlikluNlAllWOlAlloRlAllQSl!kl(O(b(O6jl(mqYl0YlqYl,WlqYlsVlQXlsVl(QsVl(QsVl0Tl,WlaSl0YlaSl(maSl.0laSlX2l0TlX2l(QX2l(QX2lQXl.0lqYl(mqYl(OaXl(OqTl(O$SlQSlaSloRlaSlWOlaSluNlaSlGNl$SlGNlqTlGNlaXlGNlCYluNlqYlWOlqYloRlqYlQSlqYl(OCYl(OaXl:7lyClUHlyClMElyClsBl(EsBlkIlsBl$6lsBl(uMElq!lUHlq!l:7lq!lH/lq!lw#l(uw#l$6lw#lkIlw#l(EH/lyCl:7lyClS8l46lS8l$6lI8lD7l:7lD7lUHlD7lKHlD7lAHl$6lAHl46lAHlkIlAHlaIlKHlQIlUHlQIl:7lQIlI8lQIlS8laIlS8lkIlS8l46l", "(y(y~<><><>D+lzBlQFlzBlUDlzBl0BlUDl0BlQFl0BlC+l0Bl:/lUDlp#lQFlp#l8jlp#l8jl9olkbl9olkblOfl8jlOfl8jlGYl8jl9Pl/olZLlPwlZLl2zlZLl42lsLlv3l1Llv3lZUloylZUloulZUl4tlSWl4tlCZl4tlOflX3lOflF2l9ol4tl9ol4tlp#lD+lp#l;/lp#lp#l:/lp#lC+lp#lQFlp#lUDl;/lzBlD+lzBl", "(y(y(K~<><><>(Dl/l-bll/l:ol*xlnzlLhlnzl$flnzlweljzlfdlazljSlb9lhSlrwlJJlpsl8Cl9kl8Cl-bl8Cl&OldQlZElLhlZEl*xlZEll/l&Oll/l-bl~<><><>!WlInl!Wlwll#XlsklTZlskl1alsklwblwllwblInlwblnol1aluplTZlupl+Xlupl!Wlnol!WlInl#XlXhlXXl/NlPbl/NlvalXhl#XlXhlvjlghlpjlcglXjlOelDkl7blFmlbZl$nlQXl&olvVl&ol8Tl&ol3RltnlbQlEllYQlsjlYQl:hl8Ql.glrRl;flCPlYhlEOlvjleNl6lleNlhqleNlpslVQlpslbTlpslJWlBrlIYlFplfalVnlnclvmlXel4mlcgl7mlghlvjlghl3ilInl3iltll4jlpklNllpklsmlpklqnltllqnlInlqnlnolvmluplKllupl1jlupl3ilnol3ilInl", "(y(y~~<><><>(uOal(uOal39l6Zli9lSZlO9l+YlO9l+YlQ6lcUla1lURl8vl2Ql8vl2Ql8vl2Ql*ol(MWilqTlmelSZlmelSZlWYl1ilWYl1iloWlflluSl,qlmKl,ll4NlBgl4NlBglSPl(WuSl4clEVlmelsVl(XKWlifloWlKgl,bl$XlSZl(Q2Vl:Tl,Rl:TlOGl:TlM;kkhl*Fl(g*Fl(g*Fl(g!LlYzl$XlYzl;dlQrl;dlQrlwjl1ilwjl1ilFklDilAllzglollBglumlcelqnl$clOplybl#ul4Xlg2l8blq2l1ilq2l1ilq2l7olawl/slyqloqlSolspl$mlhnlollfllollUllfllUllUllKllZflntlogl(j$hlawl$hlawl$hlawl3kl6yl(ee0lNsl80lNsl80lk6lM2l$*l5ml(uOal", "(y(y(K~<><><>(Dkhl2hlidl_ZIl~~<><><>mfl0plfflgolJfl8llAgl-ilgilBgluklhdl+llobl+llaZl+ll#WlVklQVlQhlNVliflNVlmdl4VlWclyWlKbltTl3clhSlmflyRlHilyRlznlyRlQqlJVlQql9YlQqlJclbolmelCmlVhl$jl8jlIjl.llTjlgolXjl0plmfl0plhelmwlhel1ulxflhtlbhlhtlFjlhtlRkl1ulRklmwlRklQylIjlnzlXhlnzltflnzlhelQylhelmwl", "(y(yQWl/ql-Ul0pl*Tlvol0Sl8nliOl6klHLl2llNJlmql#GlXwl1ElR2lVClG8ljBlb+lBClN/lhElN/lJKlJ/l7PlN/ljVlN/l1ilN/l.vlN/la9lL/lc$lJ/lf$lD/lh!lP6lf+lF1lZ8lFwlO6lFrlx3lJllR0lXklYvllolqulNpl:tl;plWtl7qlSul:qlOvllrlKwldrlmzl;qle1l(ha2lvvl$2lnxl53lWzli4lG1lA6lS5l(rj5lk1lm5lOqlx5l(Xs5lqTls5lPRls5l7Olz5leMli5lwLlY5lSKlI4lZKl33lpLlA0lhMlDwltOl-slzPlarlPTllrlhWlvql~<><><>wllQDlmnlyDlEpl:El1ql,Flp1lQMl93lpalIvlojlxrlInljnl.pl0jlRtlFilrul1glrulJflRtl8bldqlRYl9nlDVl/klIKl(U8Ml6KlOal0ElYblMEleclaDl0dlGDl(YoCl(aeClollGDlXhlfjlWolkjlSuludlWulrWlbulnPlrol0JlihlwJlWaltJlsUlRPloUleWllUlmdlQaldjlXhlfjlQWl/ql:SlyrlkPlorleOlGtlSMlPwl;KlI0lKKl$3l!JlD5lhLlm5lRMlr5lsOl/5lARl35ldTl35lzel35l;pl75lY1l15l55lx5l75lg5lV4lW1lq3lizl72l5xlJ2l+vlD1l0slWzlPsl*vlsrlTulYrlBulOrlItl,ql(iLqlaulSpl(jrolA0lhkli3lTllA6lOrlK8lNwlO+lN1lS!lP6lP$l-+lN$lF/lK9lF/lbVlF/l1PlF/lEKl-+leElF/lAClF/laBlT+lVCl.7l1ElL2l#GlPwlNJldqlPLlnllrOl1kl5Slznl;TllolFVlrplVWlxqlXhlfjlRalbjllUlmdloUleWlsUlSPlWaltJljhlwJllol0JlXulnPlXulrWlNuludlRolkjlPhlfjl", "(y(y~<><><>Ual2Bl!klzFlOsl$Gl51lcIle8leJlj8lTJlk8l#Pln8locl(tQplh8l#1lZ8lx9lW1lZ&lutlN$lFqlv#l(dG!l,lla8l.kl*4lQmlv1l;ol.zl7slvxl.wl5xlT2llvlT2l.rly2lwlla2l!glT2lufl*1lEelmzledlUslkbl#klLaltclcYltclJgl4clcnlrclvulccl12l&UlZ8l:Mls6lxJl!5lpGlL4laGl00lOGlKylLHlZul;IlCtl4MlaqldRlBrl#Wlsol#Wlxfl9WlhTl;WlVJlCXliGl#Wl2Dl#Wl9AlbXl9Al6Zl2BlUal2Bl", "(y(y(K~<><><>(Dkhl2hlidl_ZIl~(KshlrRlshlXxl(KsxlhhlyRlhhl", "(y(y~<><><>(ZAClYQlAClKCl(MAClbhlEGlbhlOGlQSlkSlEGl(ZEGl&wlEGlO9lkSlO9l(ZO9l4wl&wlO9l(ZO9lIZlO9l(NU5lUMlEzlOVlYplAClYplAClf+lqJlM2lcPl*8lCYlS#l(ZS#lEzlS#lS#lEzlS#l(ZS#lOQlEzlACl(ZACl", "(y(y(K~<><><>(E:mlOUl*3lOUl*3l7!lYLl7!lYLlOUlkblOUl~<><><>9qlaJlXhl_7XlaJlvalOMlkelZIlkellqlJkllqlJklZIl;nlOMl9qlaJl", "(y(y~<><><>eJlrll/5lrll/5lrll/5lrll/5l(t/5l(t/5l(teJl(teJl(teJl(teJlrlleJlrlleJlrll./lXZl./lpcl77lnel(rnelI4lnel,zlNal,zlNal,zlNalmvlnelttlnelyrloelOnlNalOnlNalOnlNal+ilmel,glnelBfloelnalNalnalNalnalNaltWlkel+Ulnel-SlrellOlNallOlNallOlNalKKlvelTIlneluGlhelWDlvclWDlXZlWDlkUl$Ol!Jl$Ol!JlH0l!JlH0l!Jl./lhUl./lXZl", "(y(y~<><><>SklBjlSklWplUklrvlQkl!1lQkl92lqklb4l$ilp4l&hlx4l#glg4lPgl83lRdlH1ljalJyluXlUvl2Ulcsl2UlcslzQlcslSOlcsl5Lljsl(HfslcGlZslTFlbrlOFlvolIFlcklIFlIglOFl/bl(EgZldGlTYl1IlOYlvLlGYlpOlQYliRlQYl2UlQYl2UlQYlQXl2Vl3ZlPTlTcluQl6elGOlfflhNl;fl0Ml0glPMlLilPLlRklbMlRklLOlTklIVlSklFclSklBjl(K~<><><>(Dw2luOlw2luOl88lOZl88lBjl88lJtlw2lp4lw2lp4l(KlwlcVllwlcVl00lqcl00lTjl00lLqllwl-xllwl-xl(KDql:alDql:alsslZflsslfjlssltnlDqlZslDqlZsl", "(y(y~<><><>i#lvNlI/lyOlp8lePl#5l1Plt8lGOlz+llLlz/lfIlK9l-JlX6lCLlW3luLl&0lFJljxliHlztliHlemliHllglbNllglvUllglyVluglyWl+glwXl!VlHXlMMl/RlwFl!JlmEl8Ll!DlHOl!DllQl!DlFVlOGlJZl2JljblqHlfblpFl8al5Dl9Zl5Dl;Zl5DlcglXIl0llZOl-mlRNlQnlEMlcnl!KlcnlCKlcnlPJlWnlcIlLnlFKlcsl*OlNwlzUlWwlNQl9zlkKl-1lXEl-1lTDl-1lQCl!1lNBl41lCHll5l,Nly7ldVly7lwtly7l&6lsnl&6lNWl!6ljUli9lsSlz/lVQli#lvNli#lvNli#lvNl", ")w(u~<><><>(O(K(M(K(C_:Bl_(G(M(G(K(C:BlHEl_(E(E(G(E(CHElQGl_(M(C(M(E(C1.k__(O(K(O(a(M(a(C_:Bl_(G(c(G(a(C:BlHEl_(E(U(G(U(CHElQGl_(M(S(M(U(C1.k__(O(a(O(q(M(q(C_:Bl_(G(s(G(q(C:BlHEl_(E(k(G(k(CHElQGl_(M(i(M(k(C1.k__(O(q(/(K(9(K(C_:Bl_(W(M(W(K(C:BlHEl_(U(E(W(E(CHElQGl_(9(C(9(E(C1.k__(/(K(/(a(9(a(C_:Bl_(W(c(W(a(C:BlHEl_(U(U(W(U(CHElQGl_(9(S(9(U(C1.k__(/(a(/(q(9(q(C_:Bl_(W(s(W(q(C:BlHEl_(U(k(W(k(CHElQGl_(9(i(9(k(C1.k__(/(q&Lnf3l)da1lzCl&AlCDl_rlmJLlunmMJlzClCDlLFl_tpmFDlyrmIFlzClx,k6:k_-Pnbvl!NngxlzCl6:k&Al_&Lnf3l-PnHHl!NnMJlzCl6:k&Al_vtmf3lyrma1lzCl&AlCDl_slmdzlunmgxlzClCDlLFl_#HnFDl)dIFlzClx,k6:k_-PnHHl", "=d(!(K~<)<)<)(Da!matla!m!$l*umWKmeZmWKmNqlWKmxUlWKmQDl!$lQDlatlQDl9olQDlXTlxUl!BlNql!BleZm!Bl*um!Bla!mXTla!m9ola!matl~<><><>Jjncll0kl_ZIl~~()<q)M=DYrl=D+!lQvp(90Zp(9jqo(9.Uo(9)>+!l)>Yrl)>7ml)>VRl.Uo_jqo_0Zp_Qvp_=DVRl=D7ml=DYrl=D2Ql=d2Ql______~____cAl=D_=d_=d(Z=D(Z", "^,(=kFs(=kFs~_~<><><>&;k~<w<w<wkAl~<w<w<wKBl~<w<w<w~~)?)?)?(K~(;(;(;(C^,3Il^,wElkHz~4Dz~OKl~iGl~~wEl~3Il~EXm~LbmiGl(=OKl(=4Dz(=kHz(=^,Lbm^,EXm^,3Il~)`)`)`(K<[(C<[(<~<;<;<;(K<^(C<^(<~)`)`)`(K?((C?((<~<;<;<;(K?<(C?<(<", "=U)I)0(H)0frm_~)U<!)e~~(:<t(^(K)0(G)05sm_~(2)-(9~~(2)x(9(C=Khkm=KSomF.p(}W&p(}5Ol(}ALl(}(GSom(Ghkm(GPQl(GdMlALl(H5Ol(HW&p(HF.p(H=KdMl=KPQl=Khkm", "?:?:<?<?_<?<?<?3Al_<><><>_~~<><><><?<?<?_ZIl~", ")o)ocOmQNm_cOmQNmAHmGBl~___NBl_____AWnhNm$VnF6m)J$TnNOm$Tnisl$TnnGl66m2GlHOm*Gl$rl(f(FaOm(F56m(F)m;qlAWnlNm:NmyMlCvloMl1NlftlmNlLMmXNl;1m2ulLOn*NmROn22mWOnuOn72m*OnJOmSPnwulw3m+Ml.NmyMll0mhFn(lxUl_~(k(k(kNBl~)y)y)y)jhNm*Rn+3m$2m!PnWOm!Pn5ul!Pn2Klk4m*KlFOmILlAulNslqKlkOmqKlz4mqKlMSnKtl)jiNmHOmeQlQxlUQloRllvlbRlPMmNRl-zm-wljKnDOmlKn90mtKnDLn30mYLnHOmsLn3wly1mtQlJOmjQlVylEXlbymaDn_~<><><>NBl~<I<I<IXNm8Ml02m,MlGOnoul5Nn2NmjNnJ2m71meNnUNmYNnbulTNnNNlT3mcNl2NmqNlUvlxulyMlWNm8Ml7dm!ilUzlgOmx*lmfmoMmCxmZemn$mZemFlmBGmENm6dm,#l6dm!il~___Iem!ilIem*#lYGmCNmUPm!VmGXmrdmwemDlmwemn$mrzlkOmGem*il"]);
if (console.timeStamp) console.timeStamp('FRVR Page Load Done');