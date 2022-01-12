// 导航条
var ptNavi = (function (pam) {
    // console.log(pam)
    pnos = document.querySelectorAll(".ptNavi")
    for (var i = 0; i < pnos.length; i++) {
        // console.log(pnos[i])
        setNaviStyle(pnos[i])
    }

    function setNaviStyle(no) {
        naviEleFirst = no.querySelector("li")
        swb_li = createSwBtn(no)
        neH = naviEleFirst.offsetHeight
        nH = no.offsetHeight
        if ((nH - neH) > (neH / 2)) {
            // no.style['flex-direction'] = 'column'
            no.style['height'] = naviEleFirst.offsetHeight + "px";
            no.dataset.lineHeight = no.style['height']
            no.dataset.swStat = 'close'
            no.style['overflow'] = "hidden";
            naviEles = no.querySelectorAll('li')
            for (var e = 0; e < naviEles.length; e++) {
                now_ele = naviEles[e]
                now_ele.style['border-bottom'] = "1px solid #333333";
            }
            document.querySelectorAll('pt-navi-sw')
            swb_li.style['display'] = 'block'

            if (no.className.indexOf('ptNavi-full') > -1) {
                no.style['flex-direction'] = 'column'
                no.style['flex-wrap'] = 'nowrap'
            }


        }
    }

    function createSwBtn(no) {
        swb_li = document.createElement("li")
        swb = document.createElement('a')
        swb.innerHTML = "☰"
        swb.addEventListener('click', function (e) {
            setNaviSw(no, swb)
        })
        swb_li.classList.add('pt-navi-sw')
        swb_li.append(swb)
        no.append(swb_li)
        return swb_li
    }

    function setNaviSw(no, swb) {
        if (no.dataset.swStat == 'close') {
            no.style['height'] = "auto"
            no.dataset.swStat = "open"
            swb.innerHTML = "─"
            if (no.className.indexOf('ptNavi-fix') > -1) {
                no.style['overflow'] = 'auto'
            }
        } else {
            no.style['height'] = no.dataset.lineHeight;
            no.dataset.swStat = "close"
            swb.innerHTML = "☰"
            no.style['overflow'] = 'hidden'
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
            // console.log(pnos[i])

            this.getH(cataobjs[i])
        }
    },
    getH: function (cataobj) {
        self=this;
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
            hlist_tmp=o.target.parentNode.previousElementSibling;
            hlistbox_tmp=o.target.parentNode.parentNode;
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



        tmp_mark=Math.random().toString()
        for (var i = 0; i < hs.length; i++) {

            if (hs[i].className.indexOf('pt-ca-rm') > -1) {
                continue;
            }


            linkstr = 'autocata_' + i
            hlele = document.createElement('li')
            hlelea = document.createElement('a')
            hlelea.innerHTML = hs[i].innerText
            hlelea.setAttribute('href', "#"+tmp_mark+"_" + linkstr)


            if(hs[i].nodeName==='H1' || hs[i].className.indexOf('pt-ac-h1') > -1){
                hlelea.classList.add('pt-ac-a-h1')
            }else if(hs[i].nodeName==='H2' || hs[i].className.indexOf('pt-ac-h2') > -1){
                hlelea.classList.add('pt-ac-a-h2')
            } else if(hs[i].nodeName==='H3' || hs[i].className.indexOf('pt-ac-h3') > -1){
                hlelea.classList.add('pt-ac-a-h3')
            } else if(hs[i].nodeName==='H4' || hs[i].className.indexOf('pt-ac-h4') > -1){
                hlelea.classList.add('pt-ac-a-h4')
            } else if(hs[i].nodeName==='H5' || hs[i].className.indexOf('pt-ac-h5') > -1){
                hlelea.classList.add('pt-ac-a-h5')
            } else if(hs[i].nodeName==='H6' || hs[i].className.indexOf('pt-ac-h6') > -1){
                hlelea.classList.add('pt-ac-a-h6')
            }


            alink = document.createElement("a")
            alink.setAttribute('id', +tmp_mark+"_" +linkstr)
            alink.innerText = "#"
            hs[i].append(alink)
            hlele.append(hlelea)
            hlist.append(hlele)
        }
    },

}

var autoCatalog2={
    args:{struType:'htmlele',dataS:'body',style:'catalog'},
    catalogData:[],
    init:function (args){
        // 初始化
        this.catalogData=[]
        this.args=args
        this.setCatalogData()
        // console.log(this.catalogData)
        this.setCataLogDom()
    },
    setCatalogData:function (){
      // 设置目录数据
      if(this.args['struType']==='htmlele'){
          //自动抓取数据
          return this.getDataByEle()
      }else if(this.args['struType']==='htmllist'){
          //通过ul获取数据
          return this.getDataByUl()
      }else if(this.args['struType']==='json'){
          //通过json设置数据
      }
    },
    getDataByEle:function (){
        // 抓取文档数据
        eleobj=document.querySelector(this.args['dataS'])
        hs=eleobj.querySelectorAll("h1,h2,h3,h4,h5,h6,.pt-ac-h1,.pt-ac-h2,.pt-ac-h3,.pt-ac-h4,.pt-ac-h5,.pt-ac-h6")

        for (var i=0;i<hs.length;i++){

            if(hs[i].className.indexOf('pt-ac-rm')>-1){
                continue;
            }
            tmp_link={
                'i':0,
                't':"",
                'l':'',
                'ex':{},
            };

            if(hs[i].nodeName==='H1' || hs[i].className.indexOf('pt-ac-h1') > -1){
                tmp_link['i']=1
            }else if(hs[i].nodeName==='H2' || hs[i].className.indexOf('pt-ac-h2') > -1){
                tmp_link['i']=2
            } else if(hs[i].nodeName==='H3' || hs[i].className.indexOf('pt-ac-h3') > -1){
                tmp_link['i']=3
            } else if(hs[i].nodeName==='H4' || hs[i].className.indexOf('pt-ac-h4') > -1){
                tmp_link['i']=4
            } else if(hs[i].nodeName==='H5' || hs[i].className.indexOf('pt-ac-h5') > -1){
                tmp_link['i']=5
            } else if(hs[i].nodeName==='H6' || hs[i].className.indexOf('pt-ac-h6') > -1){
                tmp_link['i']=6
            }
            tmp_link['t']=hs[i].innerText;
            tmp_link['ex']={"ele":hs[i]};
            tmp_link['l']="autocta"+this.getUnStr()+i;

            this.catalogData.push(tmp_link)
        }
        return
    },
    getDataByUl:function (){
        //通过ul列表获取数据
        return
    },
    setCataLogDom:function (){
        self=this
        //设置目录导航
        hlistbox=document.createElement('div');
        hlistbox.classList.add('autoclbox-hidden');
        hlist=document.createElement('ul');

        hlist.classList.add('autocl');
        hlist.classList.add('autocl-hidden');

        hlist_tool_bar=document.createElement('div');
        hlist_tool_bar.classList.add('hlist-tool-bar');

        sw_btn=document.createElement('a');
        sw_btn.innerText="☰目录";
        sw_btn.classList.add('sw-btn')

        sw_btn.onmouseover = function (o) {
            self.sw_btn_Func(o)
        }
        sw_btn.onclick=function (o){
            self.sw_btn_Func(o)
        }
        hlistbox.onmouseleave = function (o) {
            self.leave_Func(o)
        }

        hlist_tool_bar.append(sw_btn)
        hlistbox.append(hlist_tool_bar)

        hlistbox.classList.add('autoclbox')

        hlistbox.append(hlist)

        //构建目录内容
        for(var i=0;i<this.catalogData.length;i++){

            now_stru_ele=this.catalogData[i];

            console.log(now_stru_ele)
            hlele = document.createElement('li')
            hlelea = document.createElement('a')
            hlelea.innerHTML = now_stru_ele['t']
            hlelea.setAttribute('href', "#"+now_stru_ele['l'])
            hlelea.dataset.hrefto=now_stru_ele['l']

            hlelea.classList.add('pt-ac-a-h'+now_stru_ele['i'])
            alink = document.createElement("a")
            alink.setAttribute('id', now_stru_ele['l'])
            alink.innerText = "#"
            now_stru_ele['ex']['ele'].append(alink)
            hlele.append(hlelea)
            hlist.append(hlele)

        }

        cataobj=document.querySelector(this.args['dataS'])
        cataobj.append(hlistbox)


        if (this.args.style=== 'catalog-in') {
            hlistbox.classList.add('autoclbox-in')
            cataobj.style.position = 'relative';
            hlistbox.style.position = 'absolute';
        }

        window.onhashchange=function () {
                hash=window.location.hash
            if(hash!=="")
            {
                hreftoobj=document.querySelector(hash)
                objTop=hreftoobj.getBoundingClientRect().top
                window.scrollBy(window.scrollX,objTop-100)
            }
        }
    },
    getUnStr:function (){
        tmp_mark=new Date().getTime() + Math.random().toString(36).substr(2)
        return tmp_mark
    },
    sw_btn_Func:function (o){

            hlist_tmp=o.target.parentNode.nextElementSibling;
            hlistbox_tmp=o.target.parentNode.parentNode;
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
    leave_Func:function (o){
            o.target.firstChild.classList.add('autocl-hidden')
            o.target.classList.remove('autoclbox-show')
            o.target.classList.add('autoclbox-hidden')
    },



}
