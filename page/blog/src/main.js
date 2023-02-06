var Found={
    fillData:[],
    blogListData:[],
    contInfo:{},
    domList:{},
    run:function (){
        this.initDomList();
      this.initFillData();

    },
    initFillData:function (){
        if(blogConfig){
            this.fillData.push(blogConfig)
        }
        if(typeof(blogList)!=="undefined"){
            this.blogListData=blogList;
        }
        //载入博客文章
        var self=this;
        axios.get('data/cont.json')
            .then(function (response) {
                console.log(response);
                self.contInfo=JSON.parse(response.data);
                console.log(self.contInfo);
                this.struBlogCont();//填充博客文章。
            })
            .catch(function (error) {
                console.log(error);
            });
        // if(typeof(contInfo)!=="undefined"){
        //     this.contInfo=contInfo;
        // }
        this.fillCont();//填充博客配置内容
        this.struBlogList();//填充博客列表
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
    struBlogList:function (){
        if(this.blogListData && this.domList["blogList"])
        {
            console.log("has blog list")
        }else{
            console.log("no blog list")
            return false;
        }
        let bl=this.domList["blogList"]
        // console.log(bl)
        // console.log(this.blogListData)
        if (this.blogListData.length<1){
            bl.innerHTML="没有数据"
        }else{
            for(let i=0;i<this.blogListData.length;i++){

                let ele_data=this.blogListData[i]
                var lidom=document.createElement("li")
                var adom=document.createElement("a")
                adom.setAttribute("href","content.html?untid="+ele_data['untid'])
                lidom.append(adom)

                var titlediv=document.createElement("div")
                titlediv.classList.add("list-title")
                titlediv.innerHTML=ele_data['title']
                adom.append(titlediv)

                var txtdiv=document.createElement('div')
                txtdiv.classList.add("list-txt")
                txtdiv.innerHTML=ele_data['txt']
                adom.append(txtdiv)

                var imgdiv=document.createElement("div")
                imgdiv.classList.add("list-img")
                adom.append(imgdiv)

                var imgobj=document.createElement("img")
                imgobj.setAttribute("src",ele_data["cover"])
                imgdiv.append(imgobj)

                var exdiv=document.createElement("div")
                adom.append(exdiv)
                exdiv.classList.add("list-ex")
                exdiv.innerHTML=ele_data["ex"]

                bl.append(lidom)

            }
        }
        return true;
    },
    struBlogCont:function(){
        console.log(this.domList)
        if(this.contInfo && this.domList["continfo"])
        {
            console.log("has blog cont")
        }else{
            console.log("no blog cont")
            return false;
        }
        let ci=this.domList['continfo']

        var contdiv=document.createElement("div")
        ci.append(contdiv)

        var titlediv=document.createElement("h1")
        contdiv.append(titlediv)
        titlediv.innerHTML=this.contInfo.title;

        var bodydiv=document.createElement("div")
        contdiv.append(bodydiv)
        bodydiv.innerHTML=this.contInfo.body;

        var Infodiv=document.createElement("div")
        contdiv.append(Infodiv)
        infodivHtml="<ul>"
        for(let k in this.contInfo.info){
            infodivHtml+="<li>" +
                "<b>"+k+"<b>:" +this.contInfo.info[k]+
                "</li>"
        }
        infodivHtml+="</ul>"
        Infodiv.innerHTML=infodivHtml;

        var tagdiv=document.createElement("div")
        contdiv.append(tagdiv)

        for(let i=0;i<this.contInfo.tag.length;i++){
            let l=document.createElement("label")
            l.classList.add("pt-tag-def")
            l.innerHTML=this.contInfo.tag[i]
            tagdiv.append(l)
        }



    },
    fillCont:function (){
        for(let i=0;i<this.fillData.length;i++){
            let tmpDict=this.fillData[i]
            for(var key in tmpDict){
                if(key =="naviList"){
                    this.struLinkList(tmpDict[key],this.domList[key])
                }
                else{
                    this.domList[key].innerHTML=tmpDict[key]
                }
            }
        }
    }
}
window.onload=function (){

    Found.run()
}