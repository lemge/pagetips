var _Worker = Worker;
Worker = function(url, option){
	this.onerror= null;
	this.onmessage= null;
	this.listOfMessageCB = {};
	//--------
	this.realCreated = false;
	this.isTerminate = false;
	this.postQueued = [];
	
	if( typeof hostCDNDir !== "undefined" && (typeof option === "undefined" || typeof option.noRedirect === "undefined" || option.noRedirect === false) ){
		url = hostCDNDir + url.replace('./', '');
	}
	
	var req = new XMLHttpRequest();
	
	req.onreadystatechange = function(worker) {
		if (this.readyState === 4) {
            var file = this.responseText || "";
			blobURL = URL.createObjectURL( new Blob([file], { type: 'application/javascript' }));
			//blobURL = URL.createObjectURL( new Blob([ '(',file,')()' ], { type: 'application/javascript' })); //only use when fonction.toString ???
			worker.realWorker = new _Worker(blobURL, option);
			URL.revokeObjectURL(blobURL);
			worker.linkWorker();
		}
	}.bind(req,this);
	
	
	
	req.open('GET', url);
	req.send();
	
	return this;
}

Worker.prototype.postMessage = function(message) {
	if(this.realCreated){
		this.realWorker.postMessage.apply(this.realWorker, arguments);
	}else{
		this.postQueued.push(arguments);
	}
};

Worker.prototype.terminate = function(){
	if(this.realCreated){
		this.realWorker.terminate();
	}else{
		this.isTerminate = true;
	}
}

Worker.prototype.addEventListener = function(type,cb){
	if(!this.listOfMessageCB[type])this.listOfMessageCB[type] =[];
	this.listOfMessageCB[type].push(cb);
}

Worker.prototype.linkWorker = function() {
	this.realCreated = true;
	this.realWorker.onmessage = function(){
		if(this.onmessage){this.onmessage.apply(this, arguments);}
	}.bind(this);
	this.realWorker.onerror = function(){
		if(this.onerror){this.onerror.apply(this, arguments);}
	}.bind(this);
	this.realWorker.addEventListener("message", function (e) {
		for(var i in this.listOfMessageCB["message"]){
			this.listOfMessageCB["message"][i](e);
		}
	}.bind(this), false);
	
	for (var i = 0; i < this.postQueued.length; i++) {
		this.realWorker.postMessage.apply(this.realWorker, this.postQueued[i]);
	};
	if(this.isTerminate){this.terminate();}
};