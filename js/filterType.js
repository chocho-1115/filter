/*! Javascript Library
 *  杨燚平 email:849890769@qq.com 
 *  https://github.com/chocho-1115/filter
*/
//滤镜类型
;(function(doc){
	
	'use strict';
	
    var _ = window.FILTER;
    
	_.type = {
		
		
		gray : function(imgData){
			for(var i = 0; i < imgData.data.length; i += 4){
				var v = imgData.data[i]*0.3 + imgData.data[i+1]*0.59 + imgData.data[i+2]*0.11;
				imgData.data[i]=v;
				imgData.data[i+1]=v;
				imgData.data[i+2]=v;
				imgData.data[i+3]=255;
			}
			return imgData;
		},
		
		
		//放大镜
		magnifier : function(imgData,opt,B){
			opt = opt||{};
			var centerX = opt.centerX||150/2,
				centerY = opt.centerY||150/2,
				r = 150/2,
				w = imgData.width,
				h = imgData.height,
				x = -1,//当前像素点的坐标
				y = 0,//
				M = 1,//M为放大倍数
				M_ = -1,
				i_ = -1,
				len = imgData.data.length,
				line = 0,//当前点到圆心的距离
				copyData = _.copyData(imgData).data;//.concat();
			
			for (var i=0;i<len;i+=4){
				if(++x>=w){x=0;++y;}
				/*if(x==centerX){
					line = Math.abs(y-centerY);
				}else if(y==centerY){
					line = Math.abs(x-centerX);
				}else{
					line = Math.sqrt(Math.pow(x-centerX,2)+Math.pow(y-centerY,2));
				}*/
				line = Math.sqrt(Math.pow(x-centerX,2)+Math.pow(y-centerY,2));
				//if(typeof(line)!='number')console.log(line)
				if(line<r){
					M_ = B===true ? tween.enlargeT((r-line)/r)*M+1 :tween.easeInOutSine((r-line)/r)*M+1;
					
					i_ = ( (centerY-Math.round((centerY-y)/M_))*w + (centerX-Math.round((centerX-x)/M_)) ) * 4;
					
					imgData.data[i]=copyData[i_];
					imgData.data[i+1]=copyData[i_+1];
					imgData.data[i+2]=copyData[i_+2];
					imgData.data[i+3]=copyData[i_+3];
				}
			}
			return imgData;
		},
		
		
		//放大
		enlarge : function(imgData,opt){
			return this.magnifier(imgData,opt,true);
		},
		
		
		//混合模式 http://www.kankanews.com/ICkengine/archives/1806.shtml
		blendingMode : {
			
		}
	};

}());
//----------------------------------------------------------
	
	//FilterJs 模块扩展
FILTER.type = (function ( baseModule ) {
    baseModule.mask = function(imgData){
		for (var i=0;i<imgData.data.length;i+=4){
			
			//方式1
			imgData.data[i]=255;
			
			//方式2
			//imgData.data[i]=0;
			//imgData.data[i+1]=0;
			//imgData.data[i+2]=0;
			
		}
		return imgData;
    };
    return baseModule;
})( FILTER.type || {} );















	