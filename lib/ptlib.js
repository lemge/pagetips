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
            console.log(cataobjs[i])
            this.getH(cataobjs[i])
        }
    },
    getH: function (cataobj) {
        self=this;
        hs = cataobj.querySelectorAll("h1,h2,h3,h4,h5,h6,.pt-ac-h1,.pt-ac-h2,.pt-ac-h3,.pt-ac-h4,.pt-ac-h5,.pt-ac-h6")
        console.log(hs)
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
        sw_btn.onclick = function (o) {
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
        // hlistbox.onmouseleave = function (o) {
        //     o.target.firstChild.classList.add('autocl-hidden')
        //     o.target.classList.remove('autoclbox-show')
        //     o.target.classList.add('autoclbox-hidden')
        // }
        hlist_tool_bar.append(sw_btn)
        hlistbox.append(hlist_tool_bar)

        hlistbox.classList.add('autoclbox')



        tmp_mark=Math.random().toString()
        for (var i = 0; i < hs.length; i++) {
            // console.log(pnos[i])
            if (hs[i].className.indexOf('pt-ca-rm') > -1) {
                continue;
            }
            linkstr = 'autocata_' + i
            hlele = document.createElement('li')
            hlelea = document.createElement('a')
            hlelea.innerHTML = hs[i].innerText
            hlelea.setAttribute('href', "#"+tmp_mark+"_" + linkstr)
            alink = document.createElement("a")
            alink.setAttribute('id', +tmp_mark+"_" +linkstr)
            alink.innerText = "#"
            hs[i].append(alink)
            hlele.append(hlelea)
            hlist.append(hlele)
        }
    },

}
