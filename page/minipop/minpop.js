//可以暂停的settimeout
function setTimeoutEx(callback, delay) {
    var setTimeoutId, start, remaining = delay;

    this.pause = function () {
        window.clearTimeout(setTimeoutId);
        remaining -= new Date() - start;
    };

    this.play= function () {
        start = new Date();
        window.clearTimeout(setTimeoutId);
        setTimeoutId= window.setTimeout(callback, remaining);
        console.log(setTimeoutId)
    };

    this.play();
}



var minpop2 = function () {
    var mo = {
    };
    //功能方法
    //设置msg
    mo.msg=function(inhtml){
        var self=this;
        var msg=self._create_ele("div");
        var zid=self._get_z();
        msg=self._set_ele_style(msg,{
            // "border":"1px solid #333333",
            "padding":"1rem",
            "position":"relative",
            "margin-bottom":"0.5rem",
            "border-radius":"0.2rem",
            "background-color":"#4FB8DB",
            "color":"#ffffff",
            "text-align":"left",
            "padding-right":"25px",
        });
        msg=self._set_ele_style(msg,self._cus_msg_style);
        var inhtmlbody=self._create_ele("span");
        inhtmlbody.innerHTML=inhtml;
        for (var ib_index in self._msg_inhtml_before){
            var el=self._msg_inhtml_before[ib_index];
            el._pN=msg;
            msg.append(el);
        }
        msg.append(inhtmlbody);
        for (var i in self._msg_inhtml_after){
            var el=self._msg_inhtml_after[i];
            el._pN=msg;
            msg.append(el);
        }
        var msgid="msg"+zid;
        msg.setAttribute("id",msgid);
        self._root._minpop_._msg_eles[msgid]=msg;
        self._show_msg(msg,msgid);
        return self;
    };
    // msg大小
    mo.size_sm=function(){
        var self=this;
        size_style={
            "font-size":"0.5rem",
            "padding":"0.5rem",
        };
        self._cus_msg_style=self._map_com(self._cus_msg_style,size_style);
        return self;
    };
    mo.size_lg=function(){
        var self=this;
        size_style={
            "font-size":"1.5rem",
            "padding":"1.5rem",
        };
        self._cus_msg_style=self._map_com(self._cus_msg_style,size_style);
        return self;
    };
    //尺寸适应文字大小
    mo.size_fit_txt=function(){
        var self=this;
        size_style={
            "margin-left":"auto",
            "margin-right":"auto",
        };
        self._cus_msg_style=self._map_com(self._cus_msg_style,size_style);
        return self;
    };
    // msg样式
    mo.type_suc=function(){
        var self=this;
        type_style={
            "background-color":"#31B847",
        };
        self._cus_msg_style=self._map_com(self._cus_msg_style,type_style);
        return self;
    };
    mo.type_ero=function(){
        var self=this;
        type_style={
            "background-color":"#C63B40",
        };
        self._cus_msg_style=self._map_com(self._cus_msg_style,type_style);
        return self;
    };
    mo.type_war=function(){
        var self=this;
        type_style={
            "background-color":"#DB7526",
        };
        self._cus_msg_style=self._map_com(self._cus_msg_style,type_style);
        return self;
    };
    mo.type_notice=function(){
        var self=this;
        type_style={
            "background-color":"#333333",
        };
        self._cus_msg_style=self._map_com(self._cus_msg_style,type_style);
        return self;
    };
    //msg操作属性
    mo.ctl_m_close=function(){
        var self=this;
        self._auto_close=false;
        var close_btn=self._create_ele("button");
        close_btn=self._set_ele_style(close_btn,{
            "background":"transparent",
            "border":"none",
            "color":"#ffffff",
            "position":"absolute",
            "top":"0",
            "right":"0",
            "border-radius":"100px",
            "height":"25px",
            "width":"25px",
        });
        close_btn.innerHTML="✖";
        close_btn.onclick=function(e){
            var pn=e.target._pN;
            self._rm_msg(pn,pn.id,10);
        };
        self._msg_inhtml_after.push(close_btn);
        return self;
    };
    //msg显示
    mo._show_msg=function(msg,msgid){
        var self=this;
        if(typeof(self.now_msg_box)=="undefined")
        {
            self.pos_center();
        }
        msg._pN=self.now_msg_box;
        self.now_msg_box.appendChild(msg);
        if(self._auto_close)
        {
            self._rm_msg(msg,msgid);
        }
    };
    //设置msg位置
    mo.pos_center=function(){
        var self=this;
        self._cus_msg_box_style={
            "top":"0",
            "left":"0",
            "right":"0",
            "flex-direction":"column",
            "margin-left":"auto",
            "margin-right":"auto",
            "width":self._center_msg_box_width,
        };
        self._set_msg_box(self._id_after+"msg_center");
        return self;
    };
    mo.pos_left_top=function(){
        var self=this;
        self._cus_msg_box_style={
            "top":"0",
            "left":"0",
            "width":self._msg_box_width,
            "flex-direction":"column",
        };
        self._set_msg_box(self._id_after+"msg_left_top");
        return self;
    };
    mo.pos_left_bot=function(){
        var self=this;
        self._cus_msg_box_style={
            "bottom":"0",
            "left":"0",
            "width":self._msg_box_width,
            "flex-direction":"column-reverse",
        };
        self._set_msg_box(self._id_after+"msg_left_bot");
        return self;
    };
    mo.pos_right_top=function(){
        var self=this;
        self._cus_msg_box_style={
            "top":"0",
            "right":"0",
            "width":self._msg_box_width,
            "flex-direction":"column",
        };
        self._set_msg_box(self._id_after+"msg_right_top");
        return self;
    };
    mo.pos_right_bot=function(){
        var self=this;
        self._cus_msg_box_style={
            "bottom":"0",
            "right":"0",
            "width":self._msg_box_width,
            "flex-direction":"column-reverse",
        };
        self._set_msg_box(self._id_after+"msg_right_bot");
        return self;
    };
    mo.pos_center_up=function(){
        var self=this;
        self._cus_msg_box_style={
            "top":"30%",
            "left":"0",
            "right":"0",
            "flex-direction":"column",
            "margin-left":"auto",
            "margin-right":"auto",
            "width":self._center_msg_box_width,
        };
        self._set_msg_box(self._id_after+"msg_center_up");
        return self;
    };
    mo.pos_center_down=function(){
        var self=this;
        self._cus_msg_box_style={
            "top":"70%",
            "left":"0",
            "right":"0",
            "flex-direction":"column",
            "margin-left":"auto",
            "margin-right":"auto",
            "width":self._center_msg_box_width,
        };
        self._set_msg_box(self._id_after+"msg_center_down");
        return self;
    };

    //msg位置设置
    mo._set_msg_box=function(msg_box_id){
      var self=this;
      if(typeof(self._root._minpop_._msg_box_eles[msg_box_id])!="undefined"){
          self.now_msg_box=self._root._minpop_._msg_box_eles[msg_box_id];
          return self;
      }
      var msg_box=self._create_ele("div");
      var this_z=self._get_z();
      msg_box=self._set_ele_style(msg_box,{
          "display": "flex",
          "position": "fixed",
          "max-width":"80%",
          "z-index": this_z,
      });
      msg_box=self._set_ele_style(msg_box,self._cus_msg_box_style);
      msg_box.setAttribute("id",msg_box_id);
      self.now_msg_box=msg_box;
      self._root._minpop_._msg_box_eles[msg_box_id]=msg_box;
      self._body_dom.appendChild(msg_box);
      self._rm_msg_box(msg_box,msg_box_id,);
      return self;
    };
    //设置遮罩层
    mo.cover = function (rm_time) {
        var self = this;
        var cover_ele=self._root._minpop_._cover_ele;
        if(typeof (rm_time)=="undefined"){
            rm_time=self._rmtime;
        }
        if(self._obj_length(cover_ele)>0){
            var this_cover=cover_ele["cover"];
            clearTimeout(self._root._minpop_._setTimeId_.cover_rm);
            self._rm_cover(this_cover,"cover",rm_time);
            return self;
        }
        var cover_div = self._create_ele("div");
        var this_z_index=self._root._minpop_._init_z-1;
        cover_div = self._set_ele_style(cover_div, {
            "height": self._window_height + "px",
            "width": self._window_width + "px",
            display: "block",
            position: "fixed",
            top: 0,
            left: 0,
            "background-color": self.cover_color,
            opacity: 0.5,
            "z-index": this_z_index,
        });
        var cover_id=self._id_after+"cover";
        cover_div.setAttribute("id",cover_id);
        self._root._minpop_._cover_ele["cover"]=cover_div;
        self._body_dom.appendChild(cover_div);
        self._rm_cover(cover_div,"cover",rm_time);
        return self;
    };
    //删除rm_msg的具体操作
    mo._rm_msg_func=function(o,oid,rm_time){
        var self=this;
        var pn=o._pN;
        o.parentNode.removeChild(o);
        delete (self._root._minpop_._msg_eles[oid]);
        self._rm_msg_box(pn,pn.id,10);
        console.log(rm_time)
    }
    //删除方法
    mo._rm_msg=function(o,oid,rm_time){
        var self=this;
        if(typeof(rm_time)=="undefined"){
            rm_time=self._rmtime;
        }
        setTimeoutEx(function () {
            mo._rm_msg_func(o,oid,rm_time) 
        },rm_time);
    };
    mo._rm_msg_box=function(o,oid,rm_time){
        var self=this;
        if(typeof (rm_time)=="undefined"){
            rm_time=self._rmtime;
        }
        setTimeoutEx(function () {
            if(o.childElementCount<1){
                try{
                    self._body_dom.removeChild(o);
                }catch (e) {
                    console.log("be removed..")
                }
                delete (self._root._minpop_._msg_box_eles[oid]);
            }else{
                // self._rm_msg_box(o,oid,10);
            }
        },rm_time);
    };
    mo._rm_cover_handle=function(o,oid){
        var self=this;
        self._body_dom.removeChild(o);
        delete(self._root._minpop_._cover_ele[oid]);
    };
    mo._rm_cover=function(o,oid,rm_time){
        var self=this;
        console.log(rm_time);
        var msg_eles=self._root._minpop_._msg_eles;
        var msg_box_eles=self._root._minpop_._msg_box_eles;
        if(rm_time)
        {
            self._root._minpop_._setTimeId_.cover_rm=setTimeout(function () {
                if (self._obj_length(msg_eles)<1 && self._obj_length(msg_box_eles)<1) {
                    self._rm_cover_handle(o,oid)
                }else{
                    self._rm_cover(o,oid,10);
                }
            },rm_time);
        }else{
            self._rm_cover_handle(o,oid);
        }
    };
    //工具方法
    mo._map_com=function(m1,m2){
        for (var i in m2){
            m1[i]=m2[i];
        }
        return m1;
    }
    mo._get_z = function () {
        var self = this;
        if (self._obj_length(self._root._minpop_._cover_ele) == 0 && mo._obj_length(self._root._minpop_._msg_box_eles) == 0 && mo._obj_length(self._root._minpop_._msg_eles) == 0) {
            self._root._minpop_._z_=self._root._minpop_._init_z ;
        }
        self._root._minpop_._z_ = self._root._minpop_._z_ + 1;
        return self._root._minpop_._z_;
    };
    mo._minus_z = function () {
        this._z_ = this._z_ - 1;
    };
    mo._create_ele = function (tag_name) {
        return document.createElement(tag_name)
    };
    mo._set_ele_style = function (ele, style_map) {
        for (var index in style_map) {
            ele.style.setProperty(index, style_map[index]);
        }
        return ele
    };
    mo._obj_length = function (o) {
        var n = 0;
        for (var i in o) {
            n++;
        }
        return n;
    };


    // 初始化
    mo._init = function () {
        var self = this;
        self._window_height = window.innerHeight;
        self._window_width = window.innerWidth;
        self._rmtime=3000;
        self._cus_msg_box_style={};//初始化msgbox的位置
        self._cus_msg_style={};//初始化msg的样式
        self._body_dom = document.querySelector("body");
        self.cover_color="#000000";
        self._id_after="_minpop_";
        self._msg_box_width="20rem";
        self._center_msg_box_width="50rem";
        self._msg_inhtml_before=[];
        self._msg_inhtml_after=[];
        self._auto_close=true;

        self._root=document;
        if(self._obj_length(self._root._minpop_)){
            return self
        }
        self._root._minpop_={};
        self._root._minpop_._msg_eles={};
        self._root._minpop_._msg_box_eles={};
        self._root._minpop_._cover_ele={};
        self._root._minpop_._z_=399;//这里是z-index的取值，需要最后的msg_box通过get_z方法来调用。get_z方法会自动加上1
        self._root._minpop_._init_z=self._root._minpop_._z_;//保存最初的z-index
        self._root._minpop_._setTimeId_={};//保存setTimeId
        return self;
    };
    mo._init();
    return mo;
};
