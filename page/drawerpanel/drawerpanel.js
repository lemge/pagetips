/*
 * @Description: 
 * @Date: 2022-12-08 22:27:08
 * @LastEditors: lec
 * @LastEditTime: 2022-12-11 21:43:21
 */
(
    function(){

        var DrawerPanel=function(selector){

            return DrawerPanel.init(selector)
        }
        DrawerPanel.EleObj=null;
        DrawerPanel.NaviBox=null;
        DrawerPanel.NaviList=[];
        DrawerPanel.PanelBox=null;
        DrawerPanel.PanelList={};
        DrawerPanel.NaviSwitchBtn=null;
        
        var args={
            ww:0,//界面宽度
            wh:0,//界面高度
            funcsMap:{},
            clickInfo:{
                mark:"",
                clickInd:0,
                btnObj:null,
            }//存储按钮点击信息
        }

        var fn={}
        var dp=DrawerPanel;
        DrawerPanel.fn=fn

        /**
         * @description: 输出当前选中的变量
         * @return {*}
         */        
        fn.cl=function(){
            console.log(DrawerPanel.EleObj)
            return fn
        }

        /**
         * @description: 运行
         * @return {*}
         */        
        fn.run=function(){
            fn.init().setStyle()

        }

        //设置navibar的位置
        var setwh=function(){
            args.ww=window.innerWidth;
            args.wh=window.innerHeight;
            window.onresize=function(){
                setwh()
                fn.setStyle()
            }
        }

        //设定navibox的抽屉按钮

        var setSwitchBtn=function(){
            var nsb=document.createElement("button")
            DrawerPanel.NaviSwitchBtn=nsb
            nsb.classList.add("navi-switch-btn")
            DrawerPanel.NaviBox.append(nsb)
            nsb.innerHTML="<div>❰</div>"
            nsb.onclick=function(){
                ishidden=(nsb.className.indexOf("navi-switch-btn-hidden")>-1)


                if (ishidden)
                {
                    DrawerPanel.NaviBox.classList.remove("navi-hidden")
                    nsb.classList.remove("navi-switch-btn-hidden")
                    nsb.style.left="0px"
                    nsb.style.width="100%"
                }else{
                    DrawerPanel.NaviBox.classList.add("navi-hidden")
                    nsb.classList.add("navi-switch-btn-hidden")

                    let ll=(DrawerPanel.NaviBox.clientWidth-60)/2+"px"
                    nsb.style.left=ll
                    nsb.style.width="60px"
                }
            }

        }


        fn.funcs=function(fmap){
            args.funcsMap=fmap
            return fn
        }

        var BtnClick=function(e){
            var b=e.target
            if (b.dataset.for!=undefined && b.dataset.for!=""){
                //存在for,响应点击
                var forList=b.dataset.for.split(",")
                var RunInd=0
                //查看有没有点击过
                if(args.clickInfo.mark==b.dataset.mark){
                    //点击过
                    if(args.clickInfo.clickInd<forList.length-1)
                    {
                        RunInd=args.clickInfo.clickInd+1
                    }

                }else{
                    //没有点击过
                }
                args.clickInfo.mark=b.dataset.mark
                args.clickInfo.btnObj=b
                args.clickInfo.clickInd=RunInd

                BtnClickHandle(e,forList[RunInd])


            }
        }

        var BtnClickHandle=function(e,handleFunc){
            if (args.funcsMap.hasOwnProperty(handleFunc))
            {
                args.funcsMap[handleFunc](e)
            }else{
                CtlPanel(e,handleFunc)
            }
            
            setClickLight(e.target)
        }
        
        
        var CtlPanel=function(e,pid){
            let panelobj=DrawerPanel.PanelList[pid]
            if (!panelobj){
                return false
            }
            console.log(DrawerPanel.PanelList)
            for(let k in DrawerPanel.PanelList){
                DrawerPanel.PanelList[k].classList.remove("p-show")
            }

            panelobj.classList.add("p-show")

            if (panelobj.classList.contains("p-tips"))
            {
                btnPos=e.target.getBoundingClientRect()
                let eCenter=btnPos.left+btnPos.width/2
                let pLeft=eCenter-panelobj.clientWidth/2
                panelPos=panelobj.getBoundingClientRect()
                panelobj.style.left=pLeft+"px"
            }
            
        }

        var setClickLight=function(btn){

            var btnmark=btn.dataset.mark;
            
            DrawerPanel.NaviList.forEach(function(b){
                let blb=b.querySelectorAll(".btn-light-box")
                if(blb){
                    blb.forEach(function(lb){
                        lb.remove()
                    })
                }
                createBtnLight(b,b.dataset.hcount,0)
            })
            
            if (args.clickInfo.mark==btnmark){
                //已经点击过了
                createBtnLight(btn,btn.dataset.hcount,args.clickInfo.clickInd+1)
            }else{//没有点击过
                createBtnLight(btn,btn.dataset.hcount,0)
            }
            
        }
        var createBtnLight=function(btn,sum,count){

            
            let blb=btn.querySelectorAll(".btn-light-box")
                if(blb){
                    blb.forEach(function(lb){
                        lb.remove()
                    })
                }
            var lightbox=document.createElement("div")
            lightbox.classList.add("btn-light-box")
            btn.append(lightbox)
            let dark=Number(sum)-count
            while(count>0){
                let s=document.createElement("span")
                // s.innerHTML="•"
                s.classList.add("btn_light")
                lightbox.append(s)
                count--;
            }

            while(dark>0){
                let s=document.createElement("span")
                // s.innerHTML="•"
                s.classList.add("btn_dark")
                lightbox.append(s)
                dark--;
            }

        }


        var StruPanel=function(ele){
            let newBox=document.createElement("div")
            newBox.classList.add("panel-body")
            let childNodeList=ele.childNodes
            for(let i=0;i<childNodeList.length;i){
                newBox.appendChild(childNodeList[i])
            }
            console.log(newBox)
            ele.append(newBox)
            
            let closeBtn=document.createElement("button")
            ele.append(closeBtn)
            closeBtn.innerHTML="✖"
            closeBtn.classList.add("panel-close-btn")
            closeBtn.onclick=function(e){
                //点击关闭按钮动作
                ClosePanel(e)
            }
            return ele

        }

        //关闭Panel的命令
        var ClosePanel=function(e){
            e.target.parentNode.classList.remove("p-show")
            args.clickInfo.clickInd=args.clickInfo.clickInd-1
            if(args.clickInfo.clickInd<0)
            {
                args.clickInfo.clickInd=0
            }
            setClickLight(args.clickInfo.btnObj)
        }

        /**
         * @description: 初始化所有Eleobj
         * @return {*}
         */        
        fn.init=function(){
            //初始化映射
            dp.NaviBox=dp.EleObj.querySelector(".mydp-navi")
            dp.NaviList=dp.NaviBox.querySelectorAll("button")
            dp.PanelBox=dp.EleObj.querySelector(".mydp-panelbox")
            let tmppanelList=dp.PanelBox.querySelectorAll(".mydp-panelbox>div")
            
            tmppanelList.forEach(element => {
                element=StruPanel(element)
                dp.PanelList[element.id]=element
            });
            let i=1;
            dp.NaviList.forEach(element => {
                element.dataset["mark"]="btn_"+i
                element.onclick=function(e){
                    BtnClick(e)
                }
                
                var handleCount=0
                if (element.dataset.for!=undefined && element.dataset.for!="")
                {
                    handleCount=element.dataset.for.split(",").length
                }
                element.dataset["hcount"]=handleCount

                setClickLight(element)
                i++;
            });
            //设置开关按钮
            setSwitchBtn()
            return fn
        }
        /**
         * @description: 设置样式
         * @return {*}
         */        
        fn.setStyle=function(){

            let naviboxwidth=dp.NaviBox.clientWidth
            dp.NaviBox.style.left=(args.ww-naviboxwidth)/2+"px"
            
            return fn

        }

        //初始化所有内容
        DrawerPanel.init=function(selector){
            setwh()
            DrawerPanel.EleObj=document.querySelector(selector)
            return DrawerPanel.fn
        }

        window.DrawerPanel=window.$DP=DrawerPanel
        return DrawerPanel
    }
)()