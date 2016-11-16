// FilterJs.js by hylink 杨燚平 2015-07-03 email:849890769@qq.com

//矩阵滤镜
(function(window,document){
	
	'use strict';
	
    //局部变量
	var fCanvas = document.createElement('canvas'),
		f2D = fCanvas.getContext && fCanvas.getContext("2d"),
		_ = window.FILTER||{};
    
    //构造函数
	_.ConvolutionMatrixFilter = _.ConvolutionMatrixFilter || function(mat){
		//卷积核 默认为3*3的卷积核
		var r = (Math.sqrt(mat.length)-1)/2; ///卷积核半径
		if(Math.floor(r)!=r)throw('the length of the parameter m should be 9,25,49...');
		this.matrix = mat&&mat.concat() || [
								0, 0, 0,
								0, 1, 0,
								0, 0, 0
							];
		this.originalMatrix = this.matrix.concat();
		
		//滤镜通道开关
		this.awakeChannels = {};					
		this.awakeChannels[ _.CHANNEL.RED   ] = true;
		this.awakeChannels[ _.CHANNEL.GREEN ] = true;
		this.awakeChannels[ _.CHANNEL.BLUE  ] = true;
		//this.awakeChannels[ _.CHANNEL.ALPHA ] = true;
		
	};
    
	_.ConvolutionMatrixFilter.prototype = {
		
        constructor : 'ConvolutionMatrixFilter',
		
		//重置matrix的值为创建实例时的值
		reset: function( ) {
            this.matrix = this.originalMatrix.concat(); 
            return this;
        },
		
		clone: function(){
			return new _.ConvolutionMatrixFilter(this.matrix);
		},
		
		setAwakeRedChannel : function(bool){
			if( bool === undefined ) bool = true;
			this.awakeChannels[ _.CHANNEL.RED   ] = bool;
			return this;
		},
		
		setAwakeGreenChannel : function(bool){
			if( bool === undefined ) bool = true;
			this.awakeChannels[ _.CHANNEL.GREEN   ] = bool;
			return this;
		},
		
		setAwakeBlueChannel : function(bool){
			if( bool === undefined ) bool = true;
			this.awakeChannels[ _.CHANNEL.BLUE   ] = bool;
			return this;
		},
		
		setAwakeChannel : function( rBool, gBool, bBool ){
			if( rBool === undefined ) return false;
			if( gBool === undefined ) gBool = rBool;
			if( bBool === undefined ) bBool = rBool;
			
			this.awakeChannels[ _.CHANNEL.RED   ] = rBool;
			this.awakeChannels[ _.CHANNEL.GREEN ] = gBool;
			this.awakeChannels[ _.CHANNEL.BLUE  ] = bBool;
			
			return this;
		},
		
		copyData : function(imgData){
		
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
			
		},
		
		//imgData 图像数据  divisor 系数 offset偏移
		apply : function(imgData, divisor, offset){
			var self = this;
			// imgData副本 
			var newImgData = self.copyData(imgData);//
		 	
			var w = imgData.width, h = imgData.height;
			var iD = newImgData.data, oD = imgData.data;
			var m = self.matrix;
		 	
			var mW = Math.sqrt(m.length);
			var r = (mW-1)/2; ///卷积核半径
			// 对除了边缘的点之外的内部点的 RGB 进行操作，透明度在最后都设为 255
			
			if(Math.floor(r)!=r)throw('the length of the parameter m should be 9,25,49...');

			switch(r){
				case 1:
					for (var y = 1; y < h-1; y += 1) {//行
						for (var x = 1; x < w-1; x += 1) {//列
							for (var c = 0; c < 3; c += 1) {//rgb
								if(!self.awakeChannels[c])continue;
								var i = (y*w + x)*4 + c;
								oD[i] = (offset||0)
									+(m[0]*iD[i-w*4-4] + m[1]*iD[i-w*4] + m[2]*iD[i-w*4+4]
									+ m[3]*iD[i-4]     + m[4]*iD[i]     + m[5]*iD[i+4]
									+ m[6]*iD[i+w*4-4] + m[7]*iD[i+w*4] + m[8]*iD[i+w*4+4])
									/ (divisor||1);
							}
							oD[(y*w + x)*4 + 3] = 255; // 设置透明度
						}
					}
				break;
				case 2:
					for (var y = 2; y < h-2; y += 1) {//行
						for (var x = 2; x < w-2; x += 1) {//列
							for (var c = 0; c < 3; c += 1) {//rgb
								if(!self.awakeChannels[c])continue;
								var i = (y*w + x)*4 + c;
								oD[i] = (offset||0)
									+(m[0 ]*iD[i-w*8-8] + m[1 ]*iD[i-w*8-4] + m[2 ]*iD[i-w*8] + m[3 ]*iD[i-w*8+4] + m[4 ]*iD[i-w*8+8]
									+ m[5 ]*iD[i-w*4-8] + m[6 ]*iD[i-w*4-4] + m[7 ]*iD[i-w*4] + m[8 ]*iD[i-w*4+4] + m[9 ]*iD[i-w*4+8]
									+ m[10]*iD[i-8]     + m[11]*iD[i-4]     + m[12]*iD[i]     + m[13]*iD[i+4]     + m[14]*iD[i+8]     
									+ m[15]*iD[i+w*4-8] + m[16]*iD[i+w*4-4] + m[17]*iD[i+w*4] + m[18]*iD[i+w*4+4] + m[19]*iD[i+w*4+8]
									+ m[20]*iD[i+w*8-8] + m[21]*iD[i+w*8-4] + m[22]*iD[i+w*8] + m[23]*iD[i+w*8+4] + m[24]*iD[i+w*8+8])
									/ (divisor||1);
							}
							oD[(y*w + x)*4 + 3] = 255; // 设置透明度
						}
					}
				break;
				
				default:
					var mLen = m.length;
					for (var y = r; y < h-r; y += 1) {//图像行
						for (var x = r; x < w-r; x += 1) {//图像列
							for (var c = 0; c < 3; c += 1) {//rgb
								if(!self.awakeChannels[c])continue;
								var i = (y*w + x)*4 + c;//imageData对象的下标
								var v = 0;
								for(var k = 0;k < mLen;k++){//卷积核
									v += m[k]*iD[i-w*4*(Math.floor(k/mW)-r)+4*(k%mW-r)]  ///Math.floor(k/mW) 第几行  k%mW 第几列
								}
								oD[i] = (offset||0)+v/(divisor||1); ///设置偏移与阈值
							}
							oD[(y*w + x)*4 + 3] = 255; // 设置透明度
						}
					}
				
			}

			//水平边界处理
			for(var i = r; i < w - r; i++){
				
			}
			
			
			
			//水平边缘
			
			return imgData;
		}

	};
}(window,document));











	