// FilterJs.js Javascript Library by hylink 杨燚平 2015-07-03 email:849890769@qq.com

;var FILTER=this.FILTER||{};

(function(win,doc){
	'use strict';
	
	//局部变量
	var fCanvas = doc.createElement('canvas'),
		f2D = fCanvas.getContext && fCanvas.getContext("2d"),
		_ = FILTER;


	//能力检测
	if(!f2D){throw('html5 canvas is not supported');}
	
	
	//版本
	_.VERSION = '';
	
    //常量
	_.CHANNEL = {
         RED:   0,
         GREEN: 1,
         BLUE:  2,
         ALPHA: 3
    };
	
	_.LUMA = [ //0.3,0.59,0.11
		 0.212671,
		 0.71516,
		 0.072169 
	];
	
	_.CONSTANTS = {
		PI:    Math.PI,
		PI2:   Math.PI*2,
		PI_2:  Math.PI*.5,
		SQRT2: Math.SQRT2,
		toRad: Math.PI/180,
		toDeg: 180/Math.PI
	};
	
	
    
	//构造函数
	_.Create = function(imgObj){
		//强制使用new
		if(!(this instanceof _.Create)){return new _.Create(imgObj);}
		//imgObj 不能为空
		if(!imgObj) throw('imgObj is null');
		
		var imgObjType = Object.prototype.toString.call(imgObj);
		if(imgObjType!=='[object HTMLImageElement]' && imgObjType!=='[object ImageData]') throw('imgObj 对象类型错误')
		
		if(imgObjType==='[object ImageData]'){
			this.imgData = _.copyData(imgObj);
		}else{
			//获取imgData
			f2D.clearRect(0, 0, fCanvas.width, fCanvas.height);
			fCanvas.width = imgObj.width;
			fCanvas.height = imgObj.height;
			f2D.drawImage(imgObj, 0, 0, imgObj.width, imgObj.height);
			this.imgData = f2D.getImageData(0, 0, imgObj.width, imgObj.height);
		}
		this.originalImgData = _.copyData(this.imgData);
	}
	
	_.Create.prototype = {
		
		constructor: 'FILTER',
        
		/**
			 裁切imgData 
			 * @parameters : 
					* 裁切区域
					x
					y
					width  
					height 
					
		 */
		setBounds : function(x, y, width, height){
            if(arguments.length < 4) return fasle;
            
			f2D.clearRect(0,0,fCanvas.width,fCanvas.height);
			
			var thisImg = this.imgData,
				x = x || 0,
				y = y || 0,
				getW = width || thisImg.width - (x || 0),
				getH = height || thisImg.height - (y || 0);
			
			if(getW<0 || getH<0) throw('裁切区域设置有误');
			
			fCanvas.width = thisImg.width;
			fCanvas.height = thisImg.height;

			f2D.putImageData(thisImg, 0, 0);

			this.imgData = f2D.getImageData(x, y, getW, getH);
            
            return this;
		},
		
		//设置滤镜
		setType : function(typeName){
			
			if(!this.imgData)throw('this.imgObj is null');
			
			_.type[typeName](this.imgData);
			
			return this;
			
		},
        
		//将ImageData数据 返回成base64字符串 默认为png格式
		getBase64 : function(type){
			if(!this.imgData)throw('this.imgObj is null');
			
			type = type||'image/png';
			
			f2D.clearRect(0,0,fCanvas.width,fCanvas.height);
			
			var imgData = this.imgData;
			
			fCanvas.width = imgData.width;
			fCanvas.height = imgData.height;
			f2D.putImageData(imgData,0,0);
			
			return fCanvas.toDataURL(type);
		},
		
		reset : function(){
			this.imgData = _.copyData(this.originalImgData);
			return this;
		},
		//复制一个getImageData对象
		copyData : function(){
			
			if(!this.imgData)throw('this.imgObj is null');
			
			return _.copyData(this.imgData);
			
		},
		
		
		clone : function(){
            var imgData = this.copyData();
			return _.Create(imgData);
        }
		
		
	};
	/*########################################################################################*/
	
	//copy imgData
	/*_.copyData = function(imgData){
		
		if(!imgData) throw('parameters imgData are required');
		
		f2D.clearRect(0, 0, fCanvas.width, fCanvas.height);
		
		fCanvas.width = imgData.width;
		fCanvas.height = imgData.height;
		f2D.putImageData(imgData, 0, 0);
		
		return f2D.getImageData(0, 0, imgData.width, imgData.height);
		
	};*/
	_.copyData = function(imgData){
		
		if(!imgData) throw('parameters imgData are required');
		
		/*var arr = new Uint8ClampedArray( [255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255] );
		var arr_img = new ImageData(arr, 2, 2);
		window.cont2D.putImageData(arr_img, 500, 500);
		
		
		var arr = new Uint8ClampedArray( [255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255] );
		var arr_img = window.cont2D.createImageData(2,2)
		arr_img.data.set(arr);
		window.cont2D.putImageData(arr_img, 550, 550);*/
		
		var arr = new Uint8ClampedArray(imgData.data);
		var arr_img = new ImageData(arr, imgData.width, imgData.height);

		return arr_img;
		
	};

	
	 
	
}(window,document));


   





























