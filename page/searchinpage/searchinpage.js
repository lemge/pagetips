/*
 * @Description: 
 * @Date: 2022-12-14 15:55:47
 * @LastEditors: lec
 * @LastEditTime: 2022-12-22 16:05:13
 */
var sip={
    eleMap:{},
    inpVal:"",
    SerBarDomList:{},

    DomList:[],
    nowShowDom:null,
    nowShowNum:0,

    SerBarDomList:{},
    run:function(id){
        var self=this;
        let elebox=document.querySelector(id)
        this.eleMap['inp']=elebox.querySelector(".sip-inp")
        this.eleMap["btn"]=elebox.querySelector(".sip-btn")
        this.eleMap["btn"].onclick=function(){
            self.search()
        }
    },
    search:function(){
        this.inpVal=this.eleMap["inp"].value.trim()
        if(this.inpVal==""){
            window.alert("搜索不为空")
            return false;
        }

        this.fre()
        
        
        this.searchHandle()
        this.struPanel()
        this.setSeBarClick(0)
    },
    //初始化刷新
    fre:function(){
        this.DomList=[];
        if(this.nowShowDom)
        {
            this.nowShowDom.classList.remove("nowShowDom")
        }
        this.nowShowDom=null;
        this.nowShowNum=0;
    },
    //查找数据
    searchHandle:function(){
        
        let ele=document.querySelectorAll("*")
        for(let i=0;i<ele.length;i++)
        {
            if(ele[i].childElementCount==0){
                let tmpTxt=ele[i].innerText
                if(tmpTxt && tmpTxt.indexOf(this.inpVal)>-1){
                    this.DomList.push(ele[i])
                }
            }
        }
    },
    //处理导航响应 
    setSeBarClick:function(Num){

        if(this.nowShowDom)
        {
            this.nowShowDom.classList.remove("nowShowDom")
        }

        var sum=this.DomList.length
        if(Num==0)
        {
            this.nowShowNum=0;
        }else if(Num==-1){
            this.nowShowNum=this.nowShowNum-1
        }else if(Num==1){
            this.nowShowNum=this.nowShowNum+1
        }
        if(this.nowShowNum<1){
            this.nowShowNum=1
        }
        if(this.nowShowNum>=sum){
            this.nowShowNum=sum
        }
        this.SerBarDomList['sebar-d1'].innerHTML=this.nowShowNum+"/"+sum;
        this.nowShowDom=this.DomList[this.nowShowNum-1]
        console.log(this.nowShowDom)
        let rect=this.nowShowDom.getBoundingClientRect()
        let X=rect.x
        let Y=rect.y
        let wh=window.innerHeight;
        window.scrollBy(X,Y-(wh/3))
        console.log(this.nowShowDom)
        this.nowShowDom.classList.add("nowShowDom")
    },
    //建立面板
    struPanel:function(){
        var self=this
        console.log(this.SerBarDomList['sebar-box'])
        if(this.SerBarDomList['sebar-box']){
            this.SerBarDomList['sebar-box'].remove()
        }
        
        var div=document.createElement("div")
        div.classList.add("sebar-box")
        this.SerBarDomList['sebar-box']=div

        var b1=document.createElement("button")
        b1.classList.add("sebar-b1")
        b1.innerHTML="❮"
        div.append(b1)
        this.SerBarDomList['sebar-b1']=b1
        b1.onclick=function(){
            self.setSeBarClick(-1)
        }

        var d1=document.createElement("div")
        d1.classList.add("sebar-d1")
        d1.innerText="50/120"
        div.append(d1)
        this.SerBarDomList['sebar-d1']=d1


        var b2=document.createElement("button")
        b2.classList.add("sebar-b2")
        b2.innerHTML="❯"
        div.append(b2)
        this.SerBarDomList['sebar-b2']=b2
        b2.onclick=function(){
            self.setSeBarClick(1)
        }

        document.querySelector("body").append(div)
    }
}