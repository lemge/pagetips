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
        swb_li=createSwBtn(no)
        neH = naviEleFirst.offsetHeight
        nH = no.offsetHeight
        if ((nH - neH) > (neH / 2)) {
            // no.style['flex-direction'] = 'column'
            no.style['height'] = naviEleFirst.offsetHeight + "px";
            no.dataset.lineHeight=no.style['height']
            no.dataset.swStat='close'
            no.style['overflow'] = "hidden";
            naviEles = no.querySelectorAll('li')
            for (var e = 0; e < naviEles.length; e++) {
                now_ele = naviEles[e]
                now_ele.style['border-bottom'] = "1px solid #333333";
            }
            document.querySelectorAll('pt-navi-sw')
            swb_li.style['display']='block'

            if(no.className.indexOf('ptNavi-full') > -1){
                no.style['flex-direction'] = 'column'
                no.style['flex-wrap']='nowrap'
            }



        }
    }
    function createSwBtn(no){
        swb_li=document.createElement("li")
        swb=document.createElement('a')
        swb.innerHTML="☰"
        swb.addEventListener('click',function (e) {
            setNaviSw(no,swb)
        })
        swb_li.classList.add('pt-navi-sw')
        swb_li.append(swb)
        no.append(swb_li)
        return swb_li
    }

    function setNaviSw(no,swb){
        if(no.dataset.swStat=='close'){
            no.style['height']="auto"
            no.dataset.swStat="open"
            swb.innerHTML="─"
            if(no.className.indexOf('ptNavi-fix') > -1){
                no.style['overflow'] = 'auto'
            }
        }else{
            no.style['height']=no.dataset.lineHeight;
            no.dataset.swStat="close"
            swb.innerHTML="☰"
            no.style['overflow'] = 'hidden'
        }
    }
})
ptNavi(".ptNavi")

// 自动目录
var autoCatalog=(function (pam){
    cataobjs=document.querySelectorAll(pam)
    for (var i = 0; i < cataobjs.length; i++) {
        // console.log(pnos[i])
        console.log(cataobjs[i])
        getH(cataobjs[i])
    }
    function getH(cataobj){
        hs=cataobj.querySelectorAll("h1,h2,h3,h4,h5,h6,.pt-ac-h1,.pt-ac-h2,.pt-ac-h3,.pt-ac-h4,.pt-ac-h5,.pt-ac-h6")
        console.log(hs)
        hlist=document.createElement('ul')
        hlistbox=document.createElement('div')
        hlist.classList.add('autocl')

        hlist_tool_bar=document.createElement('div')
        hlist_tool_bar.classList.add('hlist-tool-bar')

        sw_btn=document.createElement("a")
        sw_btn.innerText="☰目录"
        sw_btn.classList.add('sw-btn')
        sw_btn.onclick=function (){
            if(hlist.className.indexOf('autocl-hidden') > -1){
                hlist.classList.remove('autocl-hidden')
                hlistbox.classList.remove('autoclbox-hidden')
            }else{
                hlist.classList.add('autocl-hidden')
                hlistbox.classList.add('autoclbox-hidden')
            }
        }
        hlist_tool_bar.append(sw_btn)
        hlistbox.append(hlist_tool_bar)
        hlistbox.append(hlist)
        hlistbox.classList.add('autoclbox')


    for (var i = 0; i < hs.length; i++) {
        // console.log(pnos[i])
        linkstr='autocata_'+i
        hlele=document.createElement('li')
        hlelea=document.createElement('a')
        hlelea.innerHTML=hs[i].innerText
        hlelea.setAttribute('href',"#"+linkstr)
        alink=document.createElement("a")
        alink.setAttribute('id',linkstr)
        alink.innerText="#"
        hs[i].append(alink)
        hlele.append(hlelea)
        hlist.append(hlele)
         }
        cataobj.insertBefore(hlistbox,cataobj.firstChild)

    }
})