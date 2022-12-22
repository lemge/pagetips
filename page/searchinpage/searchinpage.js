/*
 * @Description: 
 * @Date: 2022-12-14 15:55:47
 * @LastEditors: lec
 * @LastEditTime: 2022-12-22 15:17:32
 */
var sip={
    eleMap:{},
    inpVal:"",
    DomList:[],
    SerBarDomList:{},
    nowShowDom:null,
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
        this.searchHandle()
        this.struPanel()
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
    //建立面板
    struPanel:function(){
        
        var div=document.createElement("div")
        div.classList.add("sebar-box")
        this.SerBarDomList['sebar-box']=div

        var b1=document.createElement("button")
        b1.classList.add("sebar-b1")
        b1.innerHTML="❮"
        div.append(b1)
        this.SerBarDomList['sebar-b1']=b1

        var d1=document.createElement("div")
        d1.classList.add("sebar-d1")
        d1.innerText=""
        div.append(d1)
        this.SerBarDomList['sebar-d1']=d1


        var b2=document.createElement("button")
        b2.classList.add("sebar-b2")
        b2.innerHTML="❯"
        div.append(b2)
        this.SerBarDomList['sebar-b2']=b2

        document.querySelector("body").append(div)
    }
}