(function () {
    var ubs=document.querySelectorAll(".ub-sw")
    ubs.forEach(function (o) {

        o.addEventListener("click",function (e) {
            console.log(e.target)
            let up=getParentNodeClass(e.target,"user-bar-box")
            let ubox=up.querySelector(".user-box")

            if(ubox.dataset.stat==="open"){
                ubox.classList.add("user-box-hidden")
                ubox.dataset.stat="close"
            }else{
                ubox.classList.remove("user-box-hidden")
                ubox.dataset.stat="open"
            }
        })
    })

    function getParentNodeClass(dom,cl){
        let pd=dom.parentNode
        if(pd.classList.contains(cl)){
            return pd
        }else {
            return getParentNodeClass(pd,cl)
        }
    }
})()