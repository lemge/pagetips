var Found={
    cdomList:[],//存储博客配置
    domList:[],//存储动态内容配置
    sorFunc:{
      },
    run:function (){
        this.initDomList();
        this.sorFunc={
            "data/tags.json":this.struTags,
        }
      this.initFillData();

    },
    initFillData:function (){
        var self=this;

        for(let i=0;i<this.domList.length;i++){
            let sor=this.domList[i]["sor"]
            let sorDom=this.domList[i]['dom']
            let sorFunc=this.sorFunc[sor]
            axios.get(sor)
                .then(function (response) {
                    sorFunc(sorDom,response.data)
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        //载入博客配置
        axios.get('data/config.json')
            .then(function (response) {
                self.fillCont(response.data);//填充博客配置内容
            })
            .catch(function (error) {
                console.log(error);
            });

        // //载入博客文章列表
        //
        // axios.get('data/list.json')
        //     .then(function (response) {
        //         self.blogListData=response.data;
        //         self.struBlogList();//填充博客列表
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
        //
        // //载入博客文章
        // axios.get('data/cont.json')
        //     .then(function (response) {
        //         self.contInfo=response.data;
        //         self.struBlogCont();//填充博客文章。
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });


        return true;
    },
    initDomList:function (){

        let dlc=document.querySelectorAll(".jss-c")
        for(let i=0;i<dlc.length;i++){
            this.cdomList[dlc[i].dataset.sor]=dlc[i]

        }


        let dl=document.querySelectorAll(".jss")
        for(let i=0;i<dl.length;i++){
            this.domList.push(
                {
                    "sor":dl[i].dataset.sor,
                    "dom":dl[i]
                }
            )
        }
    },
    struTags:function (dom,tagData){
        var tagsbox=dom;

        for(let i=0;i<tagData.length;i++){
            var taglabel=document.createElement("label")
            taglabel.classList.add(tagData[i]["class"])
            taglabel.innerHTML=tagData[i]["title"]
            taglabel.setAttribute("style",tagData[i]["style"])
            tagsbox.append(taglabel)
        }

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
        Infodiv.classList.add("pm-def")
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
    fillCont:function (cdata){
            let tmpDict=cdata
            for(var key in tmpDict){
                if(key =="naviList"){
                    this.struLinkList(tmpDict[key],this.cdomList[key])
                }
                else{
                    this.cdomList[key].innerHTML=tmpDict[key]
                }
            }

    }
}
window.onload=function (){

    Found.run()
}