// FilterJs.js by hylink 杨燚平 2015-07-03 email:849890769@qq.com

this.FILTER = this.FILTER || {};

(function(){
	"use strict";
	
	var F = FILTER;
	
	
	F.preload = F.preload || function(srcArr, fileload, complete){
		
		if(typeof(srcArr) == 'string'){
			srcArr = [{path:srcArr}];
		};
		
		if(srcArr.length==0){complete({});return false};
		
		var num = 0,
			imgArrObj = {};

		
		for(var i = 0, len = srcArr.length; i < len; i++){
			(function(i){
				
				var newImg = new Image();
				
				newImg.onload = newImg.onerror = function(e) {
					e = e || window.event;
					endLoad(this, e.type, i);
				};
				
				if(typeof(srcArr[i]) == 'string') srcArr[i] = {path:srcArr[i]};
				
				newImg.src = srcArr[i].path;
				
			}(i));
		}
		
		
		function endLoad(this_, eType, i) {
			num++;
			var progress = Math.floor(num * 100 / len);
			
			srcArr[i]['result'] = this_;
			srcArr[i]['progress'] = progress;
			srcArr[i]['index'] = i;
			srcArr[i]['status'] = eType == 'load' ? 200 : 'Failed to load';
			
			imgArrObj[srcArr[i].id || i+''] = this_;
			
			fileload(srcArr[i]);
			
			if(num === len) complete(imgArrObj);
		}
		
	};
	
}());