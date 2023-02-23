// launch.js
const fs = require("fs")
const puppeteer = require("puppeteer");

const ToutiaoHot="./hot.json";

//使用 puppeteer.launch 启动 Chrome
(async () => {
    const browser = await puppeteer.launch({
        headless: true, //有浏览器界面启动
        slowMo: 100, //放慢浏览器执行速度，方便测试观察
        defaultViewport: { width: 1400, height: 900 },
        args: [
            //启动 Chrome 的参数，查看https://peter.sh/experiments/chromium-command-line-switches/
            "–no-sandbox",
            "--window-size=1400,900"
        ],
    });


    const page = await browser.newPage();
    let url = "https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc"

    page.on('response', async response => {
        if (response.url() == url) {
            console.log("------------------------------------- ")
            console.log(response.url())
            const cont = await response.text()
            // console.log(cont)
            //保存文件
            // 调用fs.writeFile()方法
            Comp(cont)
            console.log("------------------------------------- ")
        }

    })

    await page.goto(url, { waitUntil: "networkidle0" });
    const cont = await page.content();

    await page.close();
    await browser.close();
})();

function Comp(newCont){
    //读取存储的内容
    let dataList=ReadOldBand()
    let newdataList=JSON.parse(newCont)
    // console.log(newdataList);
    newdataList=newdataList['data']
    console.log("正在检测新热点....")
    let hot=0
    for(let i=0;i<newdataList.length;i++){
        let nowHot=newdataList[i]["Title"]+"---"+newdataList[i]["QueryWord"];
        if(dataList.indexOf(nowHot)>=0){
            // console.log(nowHot+"【在榜单中】\n")
        }else{
            console.log("-----新热点-----\n",dataList.indexOf(nowHot),"\n",nowHot,"\n-----------\n")
            console.log("\n地址参考：",newdataList[i]["Url"])
            hot=hot+1
        }
    }
    if(hot>0){
        console.log("发现热点： ",hot," 个")
    }else{
        console.log("没有新热点..")
    }
    SaveBand(newCont)
    return true;
}

function ReadOldBand(){
    //读取文件
    let data = fs.readFileSync(ToutiaoHot, 'utf8')
    
    let dataJson=JSON.parse(data);
    var dataList=[];
    let dj=dataJson['data']
    for(let i=0;i<dj.length;i++){
        dataList.push(dj[i]["Title"]+"---"+dj[i]["QueryWord"])
    }
    return dataList;
}

function SaveBand(cont){
    fs.writeFile(ToutiaoHot, cont, function (err) {
        // 如果err为true，则文件写入失败，并返回失败信息
        if (err) {
            return console.log('文件写入失败！' + err.message)
        }
        // 若文件写入成功，将显示“文件写入成功”
        return console.log('文件写入成功！')
    })
}
