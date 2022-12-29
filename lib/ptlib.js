// 导航条
var ptNavi = (function (pam) {
    pnos = document.querySelectorAll(".ptNavi")
    for (var i = 0; i < pnos.length; i++) {
        var ele=pnos[i]
        setNaviStyle(ele)
    }

    function setNaviStyle(navibox) {
        let ulo=navibox.querySelector("ul")
        naviEleFirst = ulo.querySelector("li")
        swb_li = createSwBtn(ulo)
        neH = naviEleFirst.offsetHeight
        nH = ulo.offsetHeight
        if ((nH - neH) > (neH / 2)) {
            ulo.style['height'] = naviEleFirst.offsetHeight + "px";
            ulo.dataset.lineHeight = ulo.style['height']
            ulo.dataset.swStat = 'close'
            ulo.style['overflow'] = "hidden";
            naviEles = ulo.querySelectorAll('li')
            for (var e = 0; e < naviEles.length; e++) {
                now_ele = naviEles[e]
                now_ele.style['border-bottom'] = "1px solid #999999";
            }
            document.querySelectorAll('.pt-navi-sw')
            swb_li.style['display'] = 'block'

            if (navibox.className.indexOf('ptNavi-full') > -1) {
                ulo.style['flex-direction'] = 'column'
                ulo.style['flex-wrap'] = 'nowrap'
            }


        }
    }

    function createSwBtn(ulo) {
        swb_li = document.createElement("li")
        swb = document.createElement('a')
        swb.innerHTML = "☰"
        swb.addEventListener('click', function (e) {
            setNaviSw(ulo, swb)
        })
        swb_li.classList.add('pt-navi-sw')
        swb_li.append(swb)
        ulo.append(swb_li)
        return swb_li
    }

    function setNaviSw(ulo, swb) {
        let navibox=ulo.parentNode
        if (ulo.dataset.swStat == 'close') {
            ulo.style['height'] = "auto"
            ulo.dataset.swStat = "open"
            swb.innerHTML = "─"
            if (navibox.className.indexOf('ptNavi-fix') > -1) {
                ulo.style['overflow'] = 'auto'
            }
        } else {
            ulo.style['height'] = ulo.dataset.lineHeight;
            ulo.dataset.swStat = "close"
            swb.innerHTML = "☰"
            ulo.style['overflow'] = 'hidden'
        }
    }
})
ptNavi(".ptNavi")


// 自动目录
var autoCatalog = {
    pam: null,
    isin: null,
    init: function (pam, isin) {
        this.pam = pam;
        this.isin = isin;
        cataobjs = document.querySelectorAll(pam)
        for (var i = 0; i < cataobjs.length; i++) {

            this.getH(cataobjs[i])
        }
    },
    getH: function (cataobj) {
        self = this;
        hs = cataobj.querySelectorAll("h1,h2,h3,h4,h5,h6,.pt-ac-h1,.pt-ac-h2,.pt-ac-h3,.pt-ac-h4,.pt-ac-h5,.pt-ac-h6")

        hlist = document.createElement('ul')
        hlistbox = document.createElement('div')

        // cataobj.insertBefore(hlistbox, cataobj.firstChild)
        cataobj.append(hlistbox)
        hlistbox.append(hlist)

        hlist.classList.add('autocl')
        hlist.classList.add('autocl-hidden')
        hlistbox.classList.add('autoclbox-hidden')

        if (this.isin == 'in') {
            hlistbox.classList.add('autoclbox-in')
            cataobj.style.position = 'relative';
            hlistbox.style.position = 'absolute';
        }

        hlist_tool_bar = document.createElement('div')
        hlist_tool_bar.classList.add('hlist-tool-bar')

        sw_btn = document.createElement("a")
        sw_btn.innerText = "☰目录"
        sw_btn.classList.add('sw-btn')
        sw_btn.onmouseover = function (o) {
            hlist_tmp = o.target.parentNode.previousElementSibling;
            hlistbox_tmp = o.target.parentNode.parentNode;
            if (hlist_tmp.className.indexOf('autocl-hidden') > -1) {
                hlist_tmp.classList.remove('autocl-hidden')
                hlistbox_tmp.classList.remove('autoclbox-hidden')
                hlistbox_tmp.classList.add('autoclbox-show')
            } else {
                hlist_tmp.classList.add('autocl-hidden')
                hlistbox_tmp.classList.remove('autoclbox-show')
                hlistbox_tmp.classList.add('autoclbox-hidden')
            }
        }
        hlistbox.onmouseleave = function (o) {
            o.target.firstChild.classList.add('autocl-hidden')
            o.target.classList.remove('autoclbox-show')
            o.target.classList.add('autoclbox-hidden')
        }

        hlist_tool_bar.append(sw_btn)
        hlistbox.append(hlist_tool_bar)

        hlistbox.classList.add('autoclbox')


        tmp_mark = Math.random().toString()
        for (var i = 0; i < hs.length; i++) {

            if (hs[i].className.indexOf('pt-ca-rm') > -1) {
                continue;
            }


            linkstr = 'autocata_' + i
            hlele = document.createElement('li')
            hlelea = document.createElement('a')
            hlelea.innerHTML = hs[i].innerText
            hlelea.setAttribute('href', "#" + tmp_mark + "_" + linkstr)


            if (hs[i].nodeName === 'H1' || hs[i].className.indexOf('pt-ac-h1') > -1) {
                hlelea.classList.add('pt-ac-a-h1')
            } else if (hs[i].nodeName === 'H2' || hs[i].className.indexOf('pt-ac-h2') > -1) {
                hlelea.classList.add('pt-ac-a-h2')
            } else if (hs[i].nodeName === 'H3' || hs[i].className.indexOf('pt-ac-h3') > -1) {
                hlelea.classList.add('pt-ac-a-h3')
            } else if (hs[i].nodeName === 'H4' || hs[i].className.indexOf('pt-ac-h4') > -1) {
                hlelea.classList.add('pt-ac-a-h4')
            } else if (hs[i].nodeName === 'H5' || hs[i].className.indexOf('pt-ac-h5') > -1) {
                hlelea.classList.add('pt-ac-a-h5')
            } else if (hs[i].nodeName === 'H6' || hs[i].className.indexOf('pt-ac-h6') > -1) {
                hlelea.classList.add('pt-ac-a-h6')
            }


            alink = document.createElement("a")
            alink.setAttribute('id', +tmp_mark + "_" + linkstr)
            alink.innerText = "#"
            hs[i].append(alink)
            hlele.append(hlelea)
            hlist.append(hlele)
        }
    },

}

var autoCatalog2_rm = {
    args: {title:"☰目录",struType: 'htmlele', dataS: 'body', style: 'catalog', leaveClose: false},
    catalogData: [],
    init: function (args) {
        // 初始化
        this.catalogData = []
        for (var key in args) {
            this.args[key] = args[key]
        }
        this.setCatalogData()

        this.setCataLogDom()
    },
    setCatalogData: function () {
        // 设置目录数据
        if (this.args['struType'] === 'htmlele') {
            //自动抓取数据
            return this.getDataByEle();
        } else if (this.args['struType'] === 'htmllist') {
            //通过ul获取数据
            return this.getDataByUl();
        } else if (this.args['struType'] === 'json') {
            //通过json设置数据
            return this.getDataByJson();
        }
    },
    getDataByJson: function () {
        this.catalogData = this.args.dataS
        return this.catalogData
    },
    getDataByEle: function () {
        // 抓取文档数据
        eleobj = document.querySelector(this.args['dataS'])
        hs = eleobj.querySelectorAll("h1,h2,h3,h4,h5,h6,.pt-ac-h1,.pt-ac-h2,.pt-ac-h3,.pt-ac-h4,.pt-ac-h5,.pt-ac-h6")

        for (var i = 0; i < hs.length; i++) {

            if (hs[i].className.indexOf('pt-ac-rm') > -1) {
                continue;
            }
            tmp_link = {
                'i': 0,
                't': "",
                'l': '',
                'ex': {},
            };

            if (hs[i].nodeName === 'H1' || hs[i].className.indexOf('pt-ac-h1') > -1) {
                tmp_link['i'] = 1
            } else if (hs[i].nodeName === 'H2' || hs[i].className.indexOf('pt-ac-h2') > -1) {
                tmp_link['i'] = 2
            } else if (hs[i].nodeName === 'H3' || hs[i].className.indexOf('pt-ac-h3') > -1) {
                tmp_link['i'] = 3
            } else if (hs[i].nodeName === 'H4' || hs[i].className.indexOf('pt-ac-h4') > -1) {
                tmp_link['i'] = 4
            } else if (hs[i].nodeName === 'H5' || hs[i].className.indexOf('pt-ac-h5') > -1) {
                tmp_link['i'] = 5
            } else if (hs[i].nodeName === 'H6' || hs[i].className.indexOf('pt-ac-h6') > -1) {
                tmp_link['i'] = 6
            }
            tmp_link['t'] = hs[i].innerText;
            tmp_link['ex'] = {"ele": hs[i]};
            tmp_link['ex']['class'] = hs[i].className
            if (tmp_link['ex']['class'] === '') {
                tmp_link['ex']['class'] = 'pt-ac-comele'
            }

            tmp_link['l'] = "autocta" + this.getUnStr() + i;

            this.catalogData.push(tmp_link)
        }
        return
    },
    getDataByUl: function () {
        //通过ul列表获取数据
        self = this;
        ulobj = document.querySelector(self.args.dataS)
        tli = 0;
        setfe = false;

        function struJsonData(ulobj, inSecBox = false) {
            let liobjs = ulobj.querySelectorAll(':scope > li')
            for (let k = 0; k < liobjs.length; k++) {

                tmp_link = {
                    'i': 0,
                    't': "",
                    'l': '',
                    'ex': {},
                };

                nowli = liobjs[k]
                hasUl = nowli.querySelector("ul")
                tmp_link['i'] = tli;
                tmp_link['t'] = nowli.querySelector('a').innerText
                tmp_link['l'] = nowli.querySelector('a').getAttribute('href')
                tmp_link['l'] = tmp_link['l'].substr(tmp_link['l'].indexOf('#') + 1);
                if (inSecBox === true) {
                    tmp_link['ex']['class'] = " pt-ac-fc "
                } else {
                    tmp_link['ex']['class'] = " pt-ac-comele "
                }


                if (hasUl == null) {
                    //没有二级目录
                    if (setfe === true) {
                        tmp_link['ex']['class'] += ' pt-ac-fe '
                    }
                    self.catalogData.push(tmp_link)
                } else {
                    //有二级目录
                    tmp_link['ex']['class'] = ' pt-ac-ff '

                    if (setfe === true) {
                        tmp_link['ex']['class'] += ' pt-ac-fe '
                    }
                    self.catalogData.push(tmp_link)
                    struJsonData(hasUl, true)
                    setfe = true
                }
            }
            tli++;
        }

        struJsonData(ulobj, false)
        return
    },
    setCataLogDom: function () {
        self = this
        console.log(self.catalogData)
        //设置目录导航
        hlistbox = document.createElement('div');
        hlistbox.classList.add('autoclbox-hidden');
        hlist = document.createElement('ul');

        hlist.classList.add('autocl');
        hlist.classList.add('autocl-hidden');

        hlist_tool_bar = document.createElement('div');
        hlist_tool_bar.classList.add('hlist-tool-bar');

        sw_btn = document.createElement('a');
        sw_btn.innerText = self.args.title;
        sw_btn.classList.add('sw-btn')

        sw_btn.onmouseover = function (o) {
            self.sw_btn_Func(o)
        }
        sw_btn.onclick = function (o) {
            self.sw_btn_Func(o)
        }
        if (self.args.leaveClose === true) {
            hlistbox.onmouseleave = function (o) {
                self.leave_Func(o)
            }

        }

        hlist_tool_bar.append(sw_btn)
        hlistbox.append(hlist_tool_bar)

        hlistbox.classList.add('autoclbox')

        hlistbox.append(hlist)

        function stru_hlele(now_stru_ele) {

            hlele = document.createElement('li')
            hlelea = document.createElement('a')
            hlelea.innerHTML = now_stru_ele['t']
            if (now_stru_ele['ex']['class'].indexOf('pt-ac-ff') > -1) {
                hlelea.setAttribute('href', "#")
                f_mark = document.createElement('span')
                f_mark.classList.add('pt-ac-f-mark')
                f_mark.innerText = "✚"
                hlelea.prepend(f_mark)
                hlelea.dataset.now_ff = "open"
                hlelea.onclick = function (o) {
                    now_a = o.target
                    if (now_a.dataset.now_ff === "open") {
                        now_a.querySelector(".pt-ac-f-mark").innerText = '━'
                        pt_ac_fb = now_a.parentElement.nextElementSibling
                        // pt_ac_fb.classList.remove('pt-ac-fb-open');
                        pt_ac_fb.classList.add('pt-ac-fb-close');
                        now_a.dataset.now_ff = "close";
                    } else {
                        now_a.querySelector(".pt-ac-f-mark").innerText = '✚'
                        pt_ac_fb = now_a.parentElement.nextElementSibling
                        pt_ac_fb.classList.remove('pt-ac-fb-close');
                        // pt_ac_fb.classList.add('pt-ac-fb-open');
                        now_a.dataset.now_ff = "open";
                    }
                    return false;
                }
            } else {
                hlelea.setAttribute('href', "#" + now_stru_ele['l'])
            }
            hlelea.dataset.hrefto = now_stru_ele['l']

            hlelea.classList.add('pt-ac-a-h' + now_stru_ele['i'])
            alink = document.createElement("a")
            alink.setAttribute('id', now_stru_ele['l'])
            alink.innerText = "#"
            if (now_stru_ele['ex']['ele']) {
                now_stru_ele['ex']['ele'].append(alink)
            }
            // hlele.className=now_stru_ele['ex']['class']

            accessClass = ['pt-ac-comele', 'pt-ac-ff', 'pt-ac-fc', 'pt-ac-fe']

            for (var ai = 0; ai < accessClass.length; ai++) {
                if (now_stru_ele['ex']['class'].indexOf(accessClass[ai]) > -1) {
                    hlele.classList.add(accessClass[ai])
                }
            }
            if (hlele.className === '') {
                hlele.classList.add('pt-ac-comele')
            }

            hlele.append(hlelea)
            return hlele;
        }

        function stru_folder_box(catalogD, i, out_box) {
            i++
            var folder_box = document.createElement('div')
            folder_box.classList.add('pt-ac-folder-box')
            while (i < catalogD.length) {
                now_stru_ele = catalogD[i];
                if (now_stru_ele['ex']['class'].indexOf('pt-ac-comele') > -1) {
                    break;
                }

                if (now_stru_ele['ex']['class'].indexOf('pt-ac-fe') > -1) {
                    break;
                }
                hlele = stru_hlele(now_stru_ele)
                folder_box.append(hlele);

                if (now_stru_ele['ex']['class'].indexOf('pt-ac-ff') > -1) {
                    i = stru_folder_box(catalogD, i, folder_box)
                }

                i++;
            }
            out_box.append(folder_box);
            return i
        }

        //构建目录内容
        for (var i = 0; i < this.catalogData.length; i++) {

            now_stru_ele = this.catalogData[i];
            hlele = stru_hlele(now_stru_ele)
            hlist.append(hlele)
            if (now_stru_ele['ex']['class'].indexOf('pt-ac-ff') > -1) {
                i = stru_folder_box(this.catalogData, i, hlist)
            }

        }

        cataobj = document.querySelector(this.args['dataS'])
        cataobj.append(hlistbox)


        if (this.args.style === 'catalog-in') {
            hlistbox.classList.add('autoclbox-in')
            cataobj.style.position = 'relative';
            hlistbox.style.position = 'absolute';
        }

        window.onhashchange = function () {
            hash = window.location.hash
            if (hash !== "") {
                hreftoobj = document.querySelector(hash)
                objTop = hreftoobj.getBoundingClientRect().top
                window.scrollBy(window.scrollX, objTop - 100)
            }
        }
    },
    getUnStr: function () {
        tmp_mark = new Date().getTime() + Math.random().toString(36).substr(2)
        return tmp_mark
    },
    sw_btn_Func: function (o) {

        hlist_tmp = o.target.parentNode.nextElementSibling;
        hlistbox_tmp = o.target.parentNode.parentNode;
        if (hlist_tmp.className.indexOf('autocl-hidden') > -1) {
            hlist_tmp.classList.remove('autocl-hidden')
            hlistbox_tmp.classList.remove('autoclbox-hidden')
            hlistbox_tmp.classList.add('autoclbox-show')
        } else {
            hlist_tmp.classList.add('autocl-hidden')
            hlistbox_tmp.classList.remove('autoclbox-show')
            hlistbox_tmp.classList.add('autoclbox-hidden')
        }
    },
    leave_Func: function (o) {
        o.target.firstChild.classList.add('autocl-hidden')
        o.target.classList.remove('autoclbox-show')
        o.target.classList.add('autoclbox-hidden')
    },


}

var autoCatalog2 = {
    args: {title:"☰目录",struType: 'htmlele', dataS: 'body', style: 'catalog', leaveClose: false,top:0,hidden:true},
    catalogData: [],
    class_mark:"",
    init: function (args) {
        // 初始化
        this.catalogData = []
        for (var key in args) {
            this.args[key] = args[key]
        }



        if(this.args.style==='menu'){
            this.class_mark='-menu'
        }else if(this.args.style==='touch'){
            this.class_mark='-touch'
        }

        this.setCatalogData()

        this.setCataLogDom()
    },
    setCatalogData: function () {
        // 设置目录数据
        if (this.args['struType'] === 'htmlele') {
            //自动抓取数据
            return this.getDataByEle();
        } else if (this.args['struType'] === 'htmllist') {
            //通过ul获取数据
            return this.getDataByUl();
        } else if (this.args['struType'] === 'json') {
            //通过json设置数据
            return this.getDataByJson();
        }
    },
    getDataByJson: function () {
        this.catalogData = this.args.dataS
        return this.catalogData
    },
    getDataByEle: function () {
        // 抓取文档数据
        eleobj = document.querySelector(this.args['dataS'])
        hs = eleobj.querySelectorAll("h1,h2,h3,h4,h5,h6,.pt-ac-h1,.pt-ac-h2,.pt-ac-h3,.pt-ac-h4,.pt-ac-h5,.pt-ac-h6")

        for (var i = 0; i < hs.length; i++) {

            if (hs[i].className.indexOf('pt-ac-rm') > -1) {
                continue;
            }
            tmp_link = {
                'i': 0,
                't': "",
                'l': '',
                'ex': {},
            };

            if (hs[i].nodeName === 'H1' || hs[i].className.indexOf('pt-ac-h1') > -1) {
                tmp_link['i'] = 1
            } else if (hs[i].nodeName === 'H2' || hs[i].className.indexOf('pt-ac-h2') > -1) {
                tmp_link['i'] = 2
            } else if (hs[i].nodeName === 'H3' || hs[i].className.indexOf('pt-ac-h3') > -1) {
                tmp_link['i'] = 3
            } else if (hs[i].nodeName === 'H4' || hs[i].className.indexOf('pt-ac-h4') > -1) {
                tmp_link['i'] = 4
            } else if (hs[i].nodeName === 'H5' || hs[i].className.indexOf('pt-ac-h5') > -1) {
                tmp_link['i'] = 5
            } else if (hs[i].nodeName === 'H6' || hs[i].className.indexOf('pt-ac-h6') > -1) {
                tmp_link['i'] = 6
            }
            tmp_link['t'] = hs[i].innerText;
            tmp_link['ex'] = {"ele": hs[i]};
            tmp_link['ex']['class'] = hs[i].className
            if (tmp_link['ex']['class'] === '') {
                tmp_link['ex']['class'] = 'pt-ac-comele'
            }

            tmp_link['l'] = "autocta" + this.getUnStr() + i;

            this.catalogData.push(tmp_link)
        }
        return
    },
    getDataByUl: function () {
        //通过ul列表获取数据
        self = this;
        ulobj = document.querySelector(self.args.dataS)
        tli = 0;
        setfe = false;

        function struJsonData(ulobj, inSecBox = false) {
            let liobjs = ulobj.querySelectorAll(':scope > li')
            for (let k = 0; k < liobjs.length; k++) {

                tmp_link = {
                    'i': 0,
                    't': "",
                    'l': '',
                    'ex': {},
                };

                nowli = liobjs[k]
                // console.log(nowli)
                hasUl = nowli.querySelector("ul")
                tmp_link['i'] = tli;
                tmp_link['t'] = nowli.querySelector('a').innerText
                tmp_link['l'] = nowli.querySelector('a').getAttribute('href')
                tmp_link['l'] = tmp_link['l'].substr(tmp_link['l'].indexOf('#') + 1);
                if (inSecBox === true) {
                    tmp_link['ex']['class'] = " pt-ac-fc "
                } else {
                    tmp_link['ex']['class'] = " pt-ac-comele "
                }


                if (hasUl == null) {
                    //没有二级目录
                    if (setfe === true) {
                        tmp_link['ex']['class'] += ' pt-ac-fe '
                    }
                    self.catalogData.push(tmp_link)
                } else {
                    //有二级目录
                    tmp_link['ex']['class'] = ' pt-ac-ff '

                    if (setfe === true) {
                        tmp_link['ex']['class'] += ' pt-ac-fe '
                    }
                    self.catalogData.push(tmp_link)
                    struJsonData(hasUl, true)
                    setfe = true
                }
            }
            tli++;
        }

        struJsonData(ulobj, false)
        console.log(self.catalogData);
        return
    },
    setCataLogDom: function () {
        self = this
        console.log(self.catalogData)
        //设置目录导航
        var aclbox = document.createElement('div')
        if (this.args.top>0){
            aclbox.style.top=this.args.top+"px"
        }
        aclbox.classList.add('acl-box'+self.class_mark)

        var swb = document.createElement('a')
        swb.classList.add('acl-swb'+self.class_mark)
        swb.innerHTML=self.args.title;

         // swb.onmouseover = function (o) {
         //    self.sw_btn_Func(o)
         // }
        swb.onclick = function (o) {
            self.sw_btn_Func(o)
        }

        //设定初始状态是展开还是现实
        if(this.args.hidden){
            aclbox.classList.add('acl-box-hidden'+self.class_mark)
        }else{
            aclbox.classList.add('acl-box-show'+self.class_mark)
            swb.classList.add('acl-swb-open'+self.class_mark)
            aclbox.dataset.Status='open'
        }



        function setListUl(catalogData) {
            let ulist = document.createElement('ul')
            ulist.classList.add('acl-ul'+self.class_mark)
            for (let i = 0; i < catalogData.length; i++) {
                let nowli = catalogData[i]
                let tmpLi = document.createElement('li')
                tmpLi.classList.add('acl-li'+self.class_mark)
                let tmpA = document.createElement('a')
                tmpA.innerHTML = nowli.t;
                tmpA.setAttribute('href', nowli.l)
                let tmpUl=null
                if (nowli.c.length > 0) {
                    //有二级目录
                    tmpLi.classList.add("acl-li-b"+self.class_mark)
                    tmpUl=setListUl(nowli.c)
                    tmpUl.dataset.Stru='open'
                    let f_mark = document.createElement('span')
                    f_mark.classList.add('acl-sws'+self.class_mark)
                    f_mark.innerText = "▼"
                    tmpA.prepend(f_mark);
                    tmpA.onclick=function (o){
                        now_a=o.target
                        if(now_a.nodeName!=='A')
                        {
                            now_a=now_a.parentNode
                        }
                        nextul=now_a.nextElementSibling
                        if(tmpUl.dataset.Stru==='open'){
                            now_a.querySelector(".acl-sws"+self.class_mark).innerText = '▶'
                            tmpUl.classList.add('aclist-hidden'+self.class_mark);
                            tmpUl.dataset.Stru='close'
                        }else{
                            now_a.querySelector(".acl-sws"+self.class_mark).innerText = '▼'
                            tmpUl.classList.remove('aclist-hidden'+self.class_mark);
                            tmpUl.dataset.Stru='open'
                        }
                        return false;
                    }
                } else {
                    //无二级目录
                }
                tmpLi.append(tmpA)
                if(tmpUl!==null){
                    tmpLi.append(tmpUl)
                }
                ulist.append(tmpLi)
            }
            return ulist
        }
        aclist = setListUl(self.catalogData)
        aclbox.append(swb)

        if (self.args.leaveClose === true) {
            aclist.onmouseleave = function (o) {
                self.leave_Func(o)
            }
        }

        aclbox.append(aclist)
        document.querySelector('body').append(aclbox)

        window.onhashchange = function () {
            hash = window.location.hash
            if (hash !== "") {
                hreftoobj = document.querySelector(hash)
                if(hreftoobj!=null)
                {
                    objTop = hreftoobj.getBoundingClientRect().top
                    window.scrollBy(window.scrollX, objTop - 100)
                }
            }
        }
    },
    getUnStr: function () {
        tmp_mark = new Date().getTime() + Math.random().toString(36).substr(2)
        return tmp_mark
    },
    sw_btn_Func: function (o) {
        let aclBox=o.target.parentNode;
        let swb=o.target
        if(aclBox.dataset.Status==='open'){
            aclBox.classList.remove("acl-box-show"+self.class_mark)
            aclBox.classList.add("acl-box-hidden"+self.class_mark)
            swb.classList.remove('acl-swb-open'+self.class_mark)
            swb.classList.add('acl-swb-close'+self.class_mark)
            aclBox.dataset.Status='close'
        }else{
            aclBox.classList.remove("acl-box-hidden"+self.class_mark)
            aclBox.classList.add("acl-box-show"+self.class_mark)
            swb.classList.remove('acl-swb-close'+self.class_mark)
            swb.classList.add('acl-swb-open'+self.class_mark)
            aclBox.dataset.Status='open'
        }
    },
    leave_Func: function (o) {
        let aclBox=o.target.parentNode;
        if(aclBox.dataset.Status==='close'){
            aclBox.classList.remove("acl-box-hidden"+self.class_mark)
            aclBox.classList.add("acl-box-show"+self.class_mark)
            aclBox.dataset.Status='open'
        }else{
            aclBox.classList.remove("acl-box-show"+self.class_mark)
            aclBox.classList.add("acl-box-hidden"+self.class_mark)
            aclBox.dataset.Status='close'
        }
    },


}
