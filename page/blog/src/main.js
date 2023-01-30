var Found={
    fillData:[],
    domList:{},
    run:function (){
        this.initDomList();
      this.initFillData();

    },
    initFillData:function (){
        if(blogConfig){
            this.fillData.push(blogConfig)
        }
        this.fillCont();
        return true;
    },
    initDomList:function (){
        let dl=document.querySelectorAll(".jss")
        console.log(dl)
        for(let i=0;i<dl.length;i++){
            this.domList[dl[i].dataset.sor]=dl[i]
        }
        console.log(this.domList)
    },
    struLinkList:function (l,domObj){
        for(let i=0;i<l.length;i++){
            var tmpli=document.createElement("li")
            var tmpa=document.createElement("a")
            tmpa.innerHTML=l[i]["t"]
            tmpa.setAttribute("href",l[i]["l"])
            tmpli.append(tmpa)
            domObj.append(tmpli)
        }
        return domObj
    },
    fillCont:function (){
        for(let i=0;i<this.fillData.length;i++){
            let tmpDict=this.fillData[i]
            for(var key in tmpDict){
                if(key =="naviList"){
                    this.struLinkList(tmpDict[key],this.domList[key])
                }else{
                    this.domList[key].innerHTML=tmpDict[key]
                }
            }
        }
    }
}
window.onload=function (){

    Found.run()
}