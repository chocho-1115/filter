/*! Javascript Library
 *  杨燚平 email:849890769@qq.com 
 *  https://github.com/chocho-1115/filter
*/
this.FILTER = this.FILTER || {};

(function(){
	"use strict";
	
	var F = FILTER;
	
	//params
	//{fileload: function(item){}, complete: function(result){}}
	F.preload = F.preload || function(srcArr, params){
		
		if(typeof(srcArr) == 'string'){
			srcArr = [{path:srcArr}];
		};
		
		if(srcArr.length==0){params.complete&&params.complete({});return false};
		//console.log(srcArr)
		
		var num = 0,
			imgArrObj = {},
			minTime = params.minTime || 0,
			len = srcArr.length,
			t = minTime/len,
			st = (new Date()).getTime();
			
		for(var i = 0; i < len; i++){
			
			(function(i){
				
				var newImg = new Image();
				
				newImg.onload = newImg.onerror = function(e) {
					e = e || window.event;
					var self = this;
					setTimeout(function(){
						endLoad(self,e.type,i);
					},t*i-( (new Date()).getTime() -st));
				};
				
				if(typeof(srcArr[i]) == 'string') srcArr[i] = {path:srcArr[i],name:i};
				
				newImg.src = srcArr[i].path;
				
			}(i));
		}
		
		
		function endLoad(this_, eType, i) {
			num++;
			var progress = num / len;
			
			srcArr[i]['result'] = this_;
			srcArr[i]['progress'] = progress;
			srcArr[i]['index'] = i;
			srcArr[i]['status'] = eType == 'load' ? 200 : 'Failed to load';
			
			imgArrObj[srcArr[i].name] = this_;
			
			params.fileload&&params.fileload(srcArr[i]);
			
			if(num === len) params.complete&&params.complete(imgArrObj);
		}
		
		
		
		
	};
	
}());