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