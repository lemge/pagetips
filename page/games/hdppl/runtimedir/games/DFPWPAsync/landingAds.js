var delayB4StartGame = 300;
var showPlayButton = false;
var showPlayButtonNoFrame = false;
if(typeof(activeRotator) === "undefined") var activeRotator = true;
if(typeof(gameIsPortrait) == 'undefined') activeRotator = false;
//var ga = function(){};

//MANAGER
var adsManager;
var adsLoader;
var adsRequest;
var adsRenderingSettings;
var adDisplayContainer;
var CDBetweenInterTimer;
var currentAd;
var isDisplayingAd = false;

if(typeof CDBetweenInter === 'undefined')	var CDBetweenInter = 10 * 1000; //	s * 1000 // was 120
var apply_CDBetweenInter_to_first_MR = true;

var videoContent = document.getElementById('c2canvasdiv');

// var reallyOnMobile = false;  var onMobile = false; // now on dedicated include
var pubIsLoaded = false;
var actualTypeOfPub = "";
var adsObjectIsReady = false;

// var nopreroll;
// var nomidroll;



var TOB4Launch;
var canFireAnInter = !apply_CDBetweenInter_to_first_MR;

//_________________________________________
//Request Ads >> Request the Ad
//	param : 
//		bool isInter : true if interstitial
//_________________________________________
// function requestAds(isInter) {
// 	console.log("正在运行", arguments.callee.name)
// 	pubIsLoaded = true;
// 	isInter = isInter || false;
//
// 	prepareAds();
//
// 	google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.INSECURE); //activate the VPAID //redund
// 	adDisplayContainer.initialize();
// 	adsRequest.forceNonLinearFullSlot = true;
// 	if(isInter){
// 		actualTypeOfPub = "midroll";
// 		//adsRequest.adTagUrl = 'http://pubads.g.doubleclick.net/gampad/ads?sz=400x300&iu=/14206847/Playzool_Mid-roll&ciu_szs&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&description_url=playzool.com%2F%3Fshow%3Dsplash%26game%3Dchroma_PZOOL&channel=2980870669&hl=en&cust_params=fpartner%3Dplaytouch';
// 		adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=400x300|640x480&iu=/14206847/Playzool_Mid-roll&ciu_szs&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&overlay=0&description_url=https%3A%2F%2Fplayzool.com%2F%3Fshow%3Dsplash%26game%3D248Scribble_PZOOL&cust_params=uua%3DMozilla%2F5.0+%28Windows+NT+10.0%3B+Win64%3B+x64%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F108.0.0.0+Safari%2F537.36+Edg%2F108.0.1462.42%26userIP%3D5.188.230.99%26fpartner%3Dplaytouch%26_p%3Dp_playtouch%26gameCode%3D248Scribble%26rewarded%3Dfalse%26c_playtouch%3Dc_248Scribble';
// 	}
// 	else{
// 		actualTypeOfPub = "preroll";
// 		//adsRequest.adTagUrl = 'http://pubads.g.doubleclick.net/gampad/ads?sz=400x300&iu=/14206847/test&ciu_szs&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&description_url=playzool.com%2F%3Fshow%3Dsplash%26game%3Dchroma_PZOOL&channel=2980870669&hl=en&cust_params=fpartner%3Dplaytouch';
// 		adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=400x300|640x480&iu=/14206847/test&ciu_szs&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&overlay=0&description_url=https%3A%2F%2Fplayzool.com%2F%3Fshow%3Dsplash%26game%3D248Scribble_PZOOL&cust_params=uua%3DMozilla%2F5.0+%28Windows+NT+10.0%3B+Win64%3B+x64%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F108.0.0.0+Safari%2F537.36+Edg%2F108.0.1462.42%26userIP%3D5.188.230.99%26fpartner%3Dplaytouch%26_p%3Dp_playtouch%26gameCode%3D248Scribble%26rewarded%3Dfalse%26c_playtouch%3Dc_248Scribble';
// 	}
//
// 	if(typeof window["no"+actualTypeOfPub] === "boolean" && window["no"+actualTypeOfPub]) return console.log('Ads off');
//
// 	var obj = getSizeWindow();
// 	adsRequest.linearAdSlotWidth = obj.x;
// 	adsRequest.linearAdSlotHeight = obj.y;
// 	adsRequest.nonLinearAdSlotWidth = obj.x;
// 	adsRequest.nonLinearAdSlotHeight = obj.y;
//
// 	//if(!isInter){
// 		if(_debug) console.log("Launch request for " + actualTypeOfPub);
// 		adsLoader.requestAds(adsRequest);
// 	//}
// }

function prepareAds(){
	console.log("正在运行", arguments.callee.name)
	if(adsObjectIsReady){return;}
	adsObjectIsReady = true;

	//create display Container
	if(typeof(adDisplayContainer) == "undefined"){
		google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.INSECURE); //activate the VPAID
		adDisplayContainer = new google.ima.AdDisplayContainer(document.getElementById('adContainer'));
		adDisplayContainer.initialize();
	}
	// Create ads loader.
	if(typeof(adsLoader) == "undefined"){
		adsLoader = new google.ima.AdsLoader(adDisplayContainer);
		adsLoader.getSettings().setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.INSECURE); //activate the VPAID
	}
	// Request video ads.
	if(typeof(adsRequest) == "undefined"){
		adsRequest = new google.ima.AdsRequest();
	}
	//Rendering Setting
	if(typeof(adsRenderingSettings) == "undefined"){
		adsRenderingSettings = new google.ima.AdsRenderingSettings();
		adsRenderingSettings.loadVideoTimeout = 20000;
  		adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
		adsRenderingSettings.enablePreloading = true;
	}
	if(_debug){
		for (var index in google.ima.AdEvent.Type) {
			adsLoader.addEventListener(
				google.ima.AdEvent.Type[index],
				function(){console.log("adsLoader.AdEvent :::", google.ima.AdEvent.Type[this.index], arguments);}.bind({index:index})
			);
		}
		for (var index in google.ima.AdErrorEvent.Type) {
			adsLoader.addEventListener(
				google.ima.AdErrorEvent.Type[index],
				function(){console.log("adsLoader.AdErrorEvent :::", google.ima.AdErrorEvent.Type[this.index], arguments);}.bind({index:index})
			);
		}
		for (var index in google.ima.AdsManagerLoadedEvent.Type) {
			adsLoader.addEventListener(
				google.ima.AdsManagerLoadedEvent.Type[index],
				function(){console.log("adsLoader.AdsManagerLoadedEvent :::", google.ima.AdsManagerLoadedEvent.Type[this.index], arguments);}.bind({index:index})
			);
		}
		for (var index in google.ima.CustomContentLoadedEvent.Type) {
			adsLoader.addEventListener(
				google.ima.CustomContentLoadedEvent.Type[index],
				function(){console.log("adsLoader.CustomContentLoadedEvent :::", google.ima.CustomContentLoadedEvent.Type[this.index], arguments);}.bind({index:index})
			);
		}
		for (var index in google.ima.AdError.Type) {
			adsLoader.addEventListener(
				google.ima.AdError.Type[index],
				function(){console.log("adsLoader.AdError :::", google.ima.AdError.Type[this.index], arguments);}.bind({index:index})
			);
		}
	}
	adsLoader.addEventListener(
		google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
		onAdsManagerLoaded,
		false
	);
	adsLoader.addEventListener(
		google.ima.AdErrorEvent.Type.AD_ERROR,
		onAdError,
		false
	);
	
}

function onAdEvent(adEvent) {
	console.log("正在运行", arguments.callee.name)
	if(_debug){console.log(actualTypeOfPub,adEvent.type);}
	if(typeof(fireEvent) != 'undefined') fireEvent("IMA_"+actualTypeOfPub+'_'+adEvent.type);
	switch (adEvent.type) {
		case google.ima.AdEvent.Type.LOADED:
			isDisplayingAd = false;
			currentAd = adEvent.getAdData();
			if(_debug) console.log("Ad",currentAd);
			break;
		case google.ima.AdEvent.Type.STARTED:
			if(actualTypeOfPub == "midroll"){
				goToAd();
			}else if(actualTypeOfPub == "preroll"){
				hideGameForAd();
			}
			c = adEvent;
			if(_debug) console.log(adEvent);
			if(adEvent.getAd().getContentType().indexOf("video") != -1 || adEvent.getAd().getContentType() == ""){
				document.getElementById("mainContainer").style.backgroundColor = "black";
			}
			else{
				document.getElementById("mainContainer").style.backgroundColor = "white";
			}
			if(typeof(fireEvent) != 'undefined') fireEvent(actualTypeOfPub+'_start');
			isDisplayingAd = true;
			if(adEvent.getAd().getContentType().indexOf("video") == -1 ){
				startTimerForIMG()
			}
			break;
		case google.ima.AdEvent.Type.CLICK:
			/**/
			if(typeof(fireEvent) != 'undefined') fireEvent(actualTypeOfPub+'_click');
			if(typeof(fireEvent) != 'undefined') fireEvent(actualTypeOfPub+'_end');
			isDisplayingAd = false;
			clearInterval(Ad_timerTimer);
			if(actualTypeOfPub == "midroll"){
				TOB4Launch = setTimeout(function(){back2Game();},500);
			}else if(actualTypeOfPub == "preroll"){
				TOB4Launch = setTimeout(function(){showGame("click");}, delayB4StartGame);
			}
			break;
		// case google.ima.AdEvent.Type.COMPLETE:
		case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
			// This event indicates the ad has finished
			if(typeof(fireEvent) != 'undefined') fireEvent(actualTypeOfPub+'_allComplete');
			if(typeof(fireEvent) != 'undefined') fireEvent(actualTypeOfPub+'_end');
			isDisplayingAd = false;
			clearInterval(Ad_timerTimer);
			if(actualTypeOfPub == "midroll"){
				TOB4Launch = setTimeout(function(){back2Game();},500);
			}else if(actualTypeOfPub == "preroll"){
				TOB4Launch = setTimeout(function(){showGame("complete");},delayB4StartGame);
			}
			break;
		case google.ima.AdEvent.Type.USER_CLOSE:
			if(typeof(fireEvent) != 'undefined') fireEvent(actualTypeOfPub+'_close');
			if(typeof(fireEvent) != 'undefined') fireEvent(actualTypeOfPub+'_end');
			isDisplayingAd = false;
			clearInterval(Ad_timerTimer);
			if(actualTypeOfPub == "midroll"){
				TOB4Launch = setTimeout(function(){back2Game();},500);
			}else if(actualTypeOfPub == "preroll"){
				TOB4Launch = setTimeout(function(){showGame("close");},delayB4StartGame);
			}
			break;
	}
}

function onContentPauseRequested(adEvent) {
	console.log("正在运行", arguments.callee.name)
	if(_debug){console.log("Pause Request");}
	if(typeof(fireEvent) != 'undefined') fireEvent("IMA_"+actualTypeOfPub+'_'+adEvent.type);
}

function onContentResumeRequested(adEvent) {
	console.log("正在运行", arguments.callee.name)
	if(_debug){console.log("onContentResumeRequested");}
	if(typeof(fireEvent) != 'undefined') fireEvent("IMA_"+actualTypeOfPub+'_'+adEvent.type);
}

function destroyObjectAds () {
	console.log("正在运行", arguments.callee.name)
	/*if(adsLoader != null){
		adsLoader.destroy();
	}
	adsLoader = undefined;
	if(adDisplayContainer != null){
		adDisplayContainer.destroy();
	}
	adDisplayContainer = undefined;
	if(adsManager != null){
		adsManager.destroy();
	}
	adsManager = undefined;

	adsObjectIsReady = false;
	*/
	pubIsLoaded = false;
	nextTouchLoadPubInter();
}

//_____________________________________________________________________________________

function hideGameForAd(){
	console.log("正在运行", arguments.callee.name)
	document.getElementById("c2canvasdiv").style.display = "none";
	document.getElementById("mainContainer").style.display = "block";
	// $("body").css("background-color","white");
}

function showGame(message){
	console.log("正在运行", arguments.callee.name)
	if(adsManager != null){
		adsManager.destroy();
	}
	adsManager = undefined;

	message = message || "default";
	if(_debug){console.log("ShowGame Message : " + message);}
	document.getElementById("c2canvasdiv").style.display = "block";
	document.getElementById("mainContainer").style.display = "none";
	document.getElementById("c2canvas").focus();

	destroyObjectAds();

	loadGame();
	clearInterval(Ad_timerTimer);
}

//Size of window
//return obj{x,y}
function getSizeWindow(){
	console.log("正在运行", arguments.callee.name)
	var obj = {};
	var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0];
	obj.x = w.innerWidth || e.clientWidth || g.clientWidth;
	obj.y = w.innerHeight|| e.clientHeight|| g.clientHeight;
	return obj;
}

function hideAll(){
	console.log("正在运行", arguments.callee.name)
	document.getElementById("mainContainer").style.display = "none";
	document.getElementById("c2canvasdiv").style.display = "none";
}

function clickOnButonAds(){
	console.log("正在运行", arguments.callee.name)
	document.getElementById("c2canvasdiv").style.display = "block";
	document.getElementById("buttonPlayContainer").style.display = "none";
	document.getElementById("mainContainer").style.display = "block";
	var p = document.getElementById("buttonPlayContainer");
	p.parentElement.removeChild(p);
	if(inIframe() && document.referrer.indexOf('gogy.com') !== -1) window.top.location.href = window.location.href.split("?")[0] + "?fromPartner=gogy&utm_source=gogy&utm_medium=frameBreaker&utm_campaign=gogy.com";
	else setTimeout(function(){requestAds(false);},100);
}


function launchGame(){
	var lpdiv=document.querySelector("#loadingpage")
	lpdiv.remove();
	console.log("正在运行", arguments.callee.name)
	if(typeof(fireEvent) != 'undefined') fireEvent('onGameStart');
	if(!canFireAnInter && apply_CDBetweenInter_to_first_MR)	CDBetweenInterTimer = setTimeout(function(){	canFireAnInter = true;	}, CDBetweenInter);
	jQuery(window).resize(function() {
		if(typeof(cr_sizeCanvas) == "function") cr_sizeCanvas(jQuery(window).width(), jQuery(window).height());
		if(checkOrientation())	hideRotator();
	});
	
	// Create new runtime using the c2canvas
	cr_createRuntime('c2canvas');
	document.getElementById("c2canvas").focus();
	setTimeout(function(){ checkOrientation(); }, 500);
	
	// Pause and resume on page becoming visible/invisible
	function onVisibilityChanged() {
		console.log("正在运行", arguments.callee.name)
		if (document.hidden || document.mozHidden || document.webkitHidden || document.msHidden){
			if(typeof(cr_setSuspended) == "function") cr_setSuspended(true);
			window.shouldLoadTimeBeTracked = (typeof trackUnfocused !== "undefined" && trackUnfocused === true);
		}else{
			if(typeof(cr_setSuspended) == "function") cr_setSuspended(false);
		}
	};
	document.body.style.backgroundColor="black";
	document.addEventListener('visibilitychange', onVisibilityChanged, false);
	document.addEventListener('mozvisibilitychange', onVisibilityChanged, false);
	document.addEventListener('webkitvisibilitychange', onVisibilityChanged, false);
	document.addEventListener('msvisibilitychange', onVisibilityChanged, false);
}

function send(sUrl,type) {
	console.log("正在运行", arguments.callee.name)
	var scriptLoad  = document.createElement("script");
	if(type = "file"){
		scriptLoad.src  = sUrl;
	}else if(type="js"){
		scriptLoad.innerHTML = sUrl;
	}
	scriptLoad.type = "text/javascript";
	document.body.appendChild(scriptLoad);
	document.body.removeChild(scriptLoad);
}

//_____________________________________________________________________________________

var eventOnClick = setTimeout(function(){
	document.getElementById("buttonPlay").onclick  = clickOnButonAds;
	document.getElementById("buttonPlay").addEventListener("touchstart", clickOnButonAds, false);
},100);

hideAll();
showGame("no ad")

// if(typeof(nopreroll) != "undefined"){
// 	clearTimeout(eventOnClick);
// 	showGame("no ad");
// }else{
// 	if(window.location !== window.parent.location && document.referrer.indexOf('gogy.com') !== -1){
// 		document.getElementById("buttonPlayContainer").style.display = "block";
// 	}else if (navigator.userAgent.match(/(mobile|android|iphone|ipad|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {
// 		onMobile = true;
// 		// reallyOnMobile = true;
// 		document.getElementById("buttonPlayContainer").style.display = "block";
// 		if(showPlayButton === false){
// 			//THIS 2 FOLLOWING LINES UNACTIVE PLAY BUTTON
// 			clearTimeout(eventOnClick);
// 			clickOnButonAds();
// 		}
// 	} else {
// 	   clearTimeout(eventOnClick);
// 	   clickOnButonAds();
// 	}
// }

var iOSVersion = parseFloat(
	('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0,''])[1])
	.replace('undefined', '3_2').replace('_', '.').replace('_', '')
) || false;

//__________________________________________________________________________________________________
var canTouchForPub = false;
function touchStart(){
	console.log("正在运行", arguments.callee.name)
	if(navigator.userAgent.match(/iemobile/i)) {
		return;
	}
	if(canTouchForPub){
		if(!activeRotator || (activeRotator && reallyOnMobile && document.getElementById("rotator").style.display != "block")){
			if(_debug) console.log("get the touch to request an ad");
			// requestAds(true);
			canTouchForPub = false;
		}
	}
}
addEventListener("touchstart", touchStart, false)

function launchAd(){
	console.log("正在运行", arguments.callee.name)
	if(_debug) console.log("launching ad");
	document.getElementById("c2canvasdiv").style.display = "block";
	document.getElementById("mainContainer").style.display = "block";

	hideGameForAd();
	if(typeof(cr_setSuspended) == "function") cr_setSuspended(true);
	// setTimeout(function(){requestAds(true);},100);
}

function loadGame(){
	console.log("正在运行", arguments.callee.name)
	if(_debug) console.log("LoadGame");
	//if(typeof customLoading === "function") customLoading();
	for (var i = 0; i < tabScriptToLoad.length; i++) {
		$.getScript({
			 url: tabScriptToLoad[i]
			,cache: true
		});
	}
	startsLoadingGameAt = Date.now();
	window.timerC2MA = setInterval(function(){
		if(typeof(window.cr_createRuntime) != "undefined" && typeof(jQuery) != "undefined" ){
			clearInterval(window.timerC2MA);
			if(_debug) console.log('launch');
			launchGame();
		}
	},100);	
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
	console.log("正在运行", arguments.callee.name)
	var events = [
		{"name":google.ima.AdEvent.Type.LOADED,"callback":onAdEvent},
		{"name":google.ima.AdEvent.Type.STARTED,"callback":onAdEvent},
		{"name":google.ima.AdEvent.Type.COMPLETE,"callback":onAdEvent},
		{"name":google.ima.AdEvent.Type.USER_CLOSE,"callback":onAdEvent},
		{"name":google.ima.AdEvent.Type.CLICK,"callback":onAdEvent},
		{"name":google.ima.AdEvent.Type.ALL_ADS_COMPLETED,"callback":onAdEvent},
		{"name":google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,"callback":onContentResumeRequested},
		{"name":google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,"callback":onContentPauseRequested},
		// {"name":google.ima.AdEvent.Type.AD_ERROR,"callback":onAdError}
		{"name":google.ima.AdErrorEvent.Type.AD_ERROR,"callback":onAdError}
	];

	adsManager = adsManagerLoadedEvent.getAdsManager(videoContent,adsRenderingSettings);
	for (var index in events) {
		adsManager.addEventListener(
			events[index].name,
			events[index].callback
		);
	}
	if(_debug){
		for (var index in google.ima.AdEvent.Type) {
			adsManager.addEventListener(
				google.ima.AdEvent.Type[index],
				function(){console.log("adsManager.AdEvent :::", google.ima.AdEvent.Type[this.index], arguments);}.bind({index:index})
			);
		}
		for (var index in google.ima.AdErrorEvent.Type) {
			adsManager.addEventListener(
				google.ima.AdErrorEvent.Type[index],
				function(){console.log("adsManager.AdErrorEvent :::", google.ima.AdErrorEvent.Type[this.index], arguments);}.bind({index:index})
			);
		}
		for (var index in google.ima.AdsManagerLoadedEvent.Type) {
			adsManager.addEventListener(
				google.ima.AdsManagerLoadedEvent.Type[index],
				function(){console.log("adsManager.AdsManagerLoadedEvent :::", google.ima.AdsManagerLoadedEvent.Type[this.index], arguments);}.bind({index:index})
			);
		}
		for (var index in google.ima.CustomContentLoadedEvent.Type) {
			adsManager.addEventListener(
				google.ima.CustomContentLoadedEvent.Type[index],
				function(){console.log("adsManager.CustomContentLoadedEvent :::", google.ima.CustomContentLoadedEvent.Type[this.index], arguments);}.bind({index:index})
			);
		}
		for (var index in google.ima.AdError.Type) {
			adsManager.addEventListener(
				google.ima.AdError.Type[index],
				function(){console.log("adsManager.AdError :::", google.ima.AdError.Type[this.index], arguments);}.bind({index:index})
			);
		}
	}

	try {
		var windowsSize = getSizeWindow();
		adsManager.init(windowsSize.x, windowsSize.y, google.ima.ViewMode.FULLSCREEN);
		if(actualTypeOfPub == "preroll"){
			adsManager.start();
			$( window ).resize(function(){
				if(!isDisplayingAd || typeof(adsManager) == 'undefined') return;
				if(typeof(adsManager.resize) != 'function') return;
				if(typeof(currentAd) == 'undefined') return;
				var adHeight = (typeof(currentAd.naturalHeight) != 'undefined')?currentAd.naturalHeight:(typeof(currentAd.vastMediaHeight) != 'undefined')?currentAd.vastMediaHeight:-1;
				var adWidth = (typeof(currentAd.naturalWidth) != 'undefined')?currentAd.naturalWidth:(typeof(currentAd.vastMediaWidth) != 'undefined')?currentAd.vastMediaWidth:-1;
				if(adHeight == -1|| adWidth == -1 || typeof(currentAd.contentType) == 'undefined') return;
				
				if(currentAd.contentType.indexOf("video") == -1){
					if($(window).width() < adWidth + 40){ return;	}
					if($(window).height() < adHeight + 75){ return;	}
				}
				var windowsSize = getSizeWindow();
				adsManager.resize(windowsSize.x, windowsSize.y, google.ima.ViewMode.FULLSCREEN);
			});
		}

	} catch (adError) {
		onAdError(adError);
	}
}

function back2Game(){
	console.log("正在运行", arguments.callee.name)
	if(_debug) console.log("back2Game");
	if(typeof(fireEvent) != 'undefined'){ fireEvent("back2Game")};
	if(typeof(cr_setSuspended) == "function") cr_setSuspended(false);
	if(typeof(setAutoShareEnabled) != 'undefined') setAutoShareEnabled(true);

	document.getElementById("c2canvasdiv").style.display = "block";
	document.getElementById("mainContainer").style.display = "none";
	document.getElementById("c2canvas").focus();

	if(typeof(cr_sizeCanvas) == "function") cr_sizeCanvas(jQuery(window).width(), jQuery(window).height());
	setTimeout(function(){$(window).scrollTop(0);},200);

	destroyObjectAds();
	checkOrientation();
	clearInterval(Ad_timerTimer);

	setTimeout(function(){
		adsLoader.contentComplete();
		if(adsManager != null){
			adsManager.destroy();
		}
		adsManager = undefined;
		//adsLoader.requestAds(adsRequest);
	},200);

}

function goToAd(){
	console.log("正在运行", arguments.callee.name)
	hideGameForAd();
	if(typeof(cr_setSuspended) == "function") cr_setSuspended(true);
}

function onAdError(adErrorEvent){
	console.log("正在运行", arguments.callee.name)
	if(_debug){var lastAdError = adErrorEvent; console.log("onAdError",adErrorEvent.getError());}
	if(typeof(fireEvent) != 'undefined'){ fireEvent("IMA_"+actualTypeOfPub+'_'+google.ima.AdErrorEvent.Type.AD_ERROR)};
	if(typeof(fireEvent) != 'undefined'){ fireEvent(actualTypeOfPub+'_error')};
	if(typeof(fireEvent) != 'undefined'){ fireEvent(actualTypeOfPub+'_end')};
	isDisplayingAd = false;

	if(actualTypeOfPub == "preroll"){
		TOB4Launch = setTimeout(function(){showGame("error");},delayB4StartGame);
		if(window.location !== window.parent.location) $('#c2canvasdiv').one("click", function(){ launchPubInter("postponedPreroll"); });
	}
	else if(actualTypeOfPub == "midroll"){
		back2Game();
	}
}

var currTime,Ad_timerTimer;
function startTimerForIMG(){
	console.log("正在运行", arguments.callee.name)
	currTime = 16;
	Ad_timerTimer = setInterval(
		function() {
			currTime-=1;
			if(document.getElementById('Ad_timer')) document.getElementById('Ad_timer').innerHTML = currTime;

			if(currTime < 0){
				clearInterval(Ad_timerTimer);
				if(typeof(fireEvent) != 'undefined') fireEvent('preroll_timerEnd');
				if(typeof(fireEvent) != 'undefined') fireEvent('preroll_end');
				if(actualTypeOfPub == "midroll"){
					back2Game();
				}else if(actualTypeOfPub == "preroll"){
					TOB4Launch = setTimeout(function(){showGame("close");},delayB4StartGame);
				}
			}
		},
		1000
	);
}
//___________________________Delay ads_______________________________________________

function launchPubInter(){
	console.log("正在运行", arguments.callee.name)
	// if(!canFireAnInter) return;
	if(navigator.userAgent.match(/iemobile/i)) {
		return;
	}

	document.getElementById("c2canvasdiv").style.display = "block";
	document.getElementById("mainContainer").style.display = "block";
	
	hideGameForAd();
	if(typeof(cr_setSuspended) == "function") cr_setSuspended(true);
	//Launch the pub
	if(typeof(adsManager) != "undefined"){
		//adsLoader.requestAds(adsRequest);
		canFireAnInter = false;
		CDBetweenInterTimer = setTimeout(function(){	canFireAnInter = true;	}, CDBetweenInter);
		adsManager.start();
	}else{
		back2Game();
	}
}



function onC2LayoutChange(state,name,force){
	console.log("正在运行", arguments.callee.name)
	if(typeof(showInterDFP) == "undefined") window.showInterDFP = true;
	if(typeof(c2LayoutChangeStack) != "undefined"){
		for(var i=0; i<c2LayoutChangeStack.length; i++){
			if(typeof(c2LayoutChangeStack[i]) == "function")	c2LayoutChangeStack[i].apply(this, arguments);
			else if(typeof(window[c2LayoutChangeStack[i]]) == "function")	window[c2LayoutChangeStack[i]].apply(this, arguments);
		}
	}
	if(typeof(force) != "undefined" && force == false){  
		return;
	}
	
	switch(name) {
	    case "Splash":
			if(endsLoadingGameAt == 0 && shouldLoadTimeBeTracked){
				endsLoadingGameAt = Date.now();
				var timeSpentToLoad = endsLoadingGameAt - startsLoadingGameAt;
				// if(timeSpentToLoad < loadingTimeCap) gtag('send', 'timing', "Games", "Load", timeSpentToLoad, statisticPool);
			}
		break;
	    case "LevelSelect":
		break;
	    case "GameMain":
			if(state == "in"){
				if(typeof(setAutoShareEnabled) != 'undefined') setAutoShareEnabled(false);
				/*
				// setTimeout(function(){
		    		if(!pubIsLoaded && delayInter){
		    			canTouchForPub = true;
		    			if (navigator.userAgent.match(/(android|iphone|ipad|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {}else{
		    				canTouchForPub = false;
		    				requestAds(true);
		    			}
		    		}
		    	// },1500);
				*/
				if(showInterDFP)	nextTouchLoadPubInter();
	    	}else if(state == "out"){

	    	}
		break;
	    case "GameOver":
	    	if(state == "in"){
	    		if(canFireAnInter && showInterDFP && typeof(nomidroll) == 'undefined'){
		    		launchPubInter();
		    	}else{
					if(typeof(setAutoShareEnabled) != 'undefined') setAutoShareEnabled(true);
				}
	    	}else if(state == "out"){
	    		
	    	}
		break;
	}
}

eventToFire.registerEvent("c2LayoutChange", function(state,name,force){setTimeout(onC2LayoutChange, 1,state,name,force)});

function nextTouchLoadPubInter(){
	console.log("正在运行", arguments.callee.name)
	if(!pubIsLoaded){// && delayInter){
		canTouchForPub = true;
		if (navigator.userAgent.match(/(mobile|android|iphone|ipad|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {}else{
			canTouchForPub = false;
			// setTimeout(requestAds.bind(this,true),5000);
		}
	}
}

// dots
document.getElementById("mainContainer").style.zIndex = -2;

//REMOVE NEXT TIME
// $("#containerProgressBar").remove();
// $("#titleTimer").hide();
// $("#adTitle").css("position","");

