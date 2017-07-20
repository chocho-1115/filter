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
	
	
	_.Float32Array = function(a){
		return new ((typeof Float32Array !== "undefined") ? Float32Array : Array)(a);
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
        },
		
		getParticles : function(params){
			var imgData = this.imgData,
				imgW = imgData.width,
				imgH = imgData.height,
				pieceW = params.pieceW||imgW/30,
				pieceH = params.pieceH||imgH/30,
				pieceXR = Math.floor(pieceW/2),
				pieceYR = Math.floor(pieceH/2),
				regX = params.regX||0,
				regY = params.regY||0,
				xMax = Math.floor(imgW/pieceW),
				yMax = Math.floor(imgH/pieceH);
			
			for(var x = 0;x<xMax;x++){
				for(var y = 0;y<yMax;y++){
					var index = ((y*pieceH+pieceYR)*imgW + (x*pieceW+pieceXR))*4;
					params.add({
						r:imgData.data[index],
						g:imgData.data[index+1],
						b:imgData.data[index+2],
						a:imgData.data[index+3],
						x:x-xMax*regX,
						y:y-yMax*regY
					});
					
				}
			}
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
		
		var arr = new Uint8ClampedArray(imgData.data);
		var arr_img = new ImageData(arr, imgData.width, imgData.height);

		return arr_img;
		
	};
	
	
	
	
	//矩阵运算
	_.MMatrix = {
		
		//矩阵加法
		add : function (m1, m2){
			
			var l = m1.length,
				i = 0,
				m = new Float32Array(m1.length);
			
			while (i<l) { m[i]=m1[i] + m2[i]; i++; }
			
			return m;
			
		},
		//矩阵减法
		subtract : function (m1, m2){
			
			var l = m1.length,
				i = 0,
				m = new Float32Array(m1.length);
			
			while (i<l) { m[i]=m1[i]-m2[i]; i++; }
			
			return m;
			
		},
		//矩阵与标量相乘
		multiplyScalar : function (m1, s){
			
			if (1==s) return new CM(m1);
			
			var l = m1.length,
				i = 0,
				m = new Float32Array(m1.length);
			
			while (i<l) { m[i]=m1[i]*s; i++; }
			
			return m;
		},
		
		
	
	}
	 
	
}(window,document));


   





























