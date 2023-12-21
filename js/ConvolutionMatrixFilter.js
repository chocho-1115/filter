/*! Javascript Library
 *  杨燚平 email:849890769@qq.com 
 *  https://github.com/chocho-1115/filter
*/
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
		
		this.matrix = mat && _.Float32Array( mat ) || _.Float32Array( [
															0, 0, 0,
															0, 1, 0,
															0, 0, 0
														] )
		this.originalMatrix = _.Float32Array( this.matrix )
		
		
		
		/*this.matrix = mat&&mat.concat() || [
								0, 0, 0,
								0, 1, 0,
								0, 0, 0
							];*/
		//this.originalMatrix = this.matrix.concat();
		
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
            this.matrix = _.Float32Array( this.originalMatrix ); 
            return this;
        },
		
		clone: function(){
			return new _.ConvolutionMatrixFilter(this.matrix);
		},
		
		//清除矩阵滤镜效果 
		clear: function( ) {
            this.matrix = _.Float32Array( [
								0, 0, 0,
								0, 1, 0,
								0, 0, 0
							]); 
            return this;
        },
		
		add: function( mat ) {
			//this.matrix = ( this.matrix ) ? this.CMconcat(this.matrix,mat) : mat;
			return this;
		},
		
		//是否唤醒红色通道 关闭红色通道 滤镜讲不对红色通道起作用
		setAwakeRedChannel : function(bool){
			if( bool === undefined ) bool = true;
			this.awakeChannels[ _.CHANNEL.RED ] = bool;
			return this;
		},
		
		setAwakeGreenChannel : function(bool){
			if( bool === undefined ) bool = true;
			this.awakeChannels[ _.CHANNEL.GREEN ] = bool;
			return this;
		},
		
		setAwakeBlueChannel : function(bool){
			if( bool === undefined ) bool = true;
			this.awakeChannels[ _.CHANNEL.BLUE ] = bool;
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
		
		//imgData 图像数据  divisor 系数 offset偏移
		apply : function(imgData, divisor, offset){
			var self = this;
			
			if(!imgData) throw('parameters imgData are required');
			// imgData副本 
			var Uint8Arr = new Uint8ClampedArray(imgData.data);
			var newImgData = new ImageData(Uint8Arr, imgData.width, imgData.height);
		 	
			var w = imgData.width, h = imgData.height;
			var iD = newImgData.data, oD = imgData.data;
			
			var m = self.matrix, mLen = m.length;
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
					for (var y = r; y < h-r; y += 1) {//图像行
						for (var x = r; x < w-r; x += 1) {//图像列
							for (var c = 0; c < 3; c += 1) {//rgb
								if(!self.awakeChannels[c])continue;
								var i = (y*w + x)*4 + c;//imageData对象的下标
								var v = 0;
								for(var k = 0;k < mLen;k++){//卷积核
									v += m[k]*iD[i+w*4*(Math.floor(k/mW)-r)+4*(k%mW-r)]  ///Math.floor(k/mW)-r 卷积核的第几行即卷积核的y值  k%mW-r 卷积核的第几列即x值  卷积核中心为 [0, 0]
								}
								oD[i] = (offset||0)+v/(divisor||1); ///设置偏移与阈值
							}
							oD[(y*w + x)*4 + 3] = 255; // 设置透明度
						}
					}
				
			}

			//水平边界处理 包括四个角
			for(var y = 0; y < r; y++){//图像行
				for(x = 0; x < w; x++){//图像列
				
					var x_ = x, y_ = h-y-1;
					
					for (var c = 0; c < 3; c += 1) {//rgb
						if(!self.awakeChannels[c])continue;
						//顶部
						var i = (y*w + x)*4 + c;
						var v = 0;
						
						var i_ = (y_*w + x_)*4 + c
						var v_ = 0;
						
						for(var k = 0;k < mLen; k++){//卷积核
							var mY = Math.floor(k/mW)-r, mX = k%mW-r; ///卷积核的x y 坐标
							//顶部
							if(x+mX<0 || x+mX>=w || y+mY<0){//超出图片矩阵范围
								v += m[k]*iD[i];
							}else{
								v += m[k]*iD[i+w*4*(mY)+4*(mX)]  ///Math.floor(k/mW) 第几行  k%mW 第几列
							}
							
							//底部
							if(x_+mX<0 || x_+mX>=w || y_+mY>=h){//超出图片矩阵范围
								v_ += m[k]*iD[i_];
							}else{
								v_ += m[k]*iD[i_+w*4*(mY)+4*(mX)]  ///Math.floor(k/mW) 第几行  k%mW 第几列
							}
							
						}
						oD[i] = (offset||0)+v/(divisor||1); ///设置偏移与阈值
						oD[i_] = (offset||0)+v_/(divisor||1);
						//底部
					}
					oD[(y*w + x)*4 + 3] = 255; // 设置透明度
					oD[(y_*w + x_)*4 + 3] = 255; // 设置透明度
				}
			}
			
			//垂直边界处理 不包括四个角
			for(var y = r; y < h-r; y++){//图像行
				for(x = 0; x < r; x++){//图像列
				
					var x_ = w-x-1, y_ = y;
					
					for (var c = 0; c < 3; c += 1) {//rgb
						if(!self.awakeChannels[c])continue;
						//左边
						var i = (y*w + x)*4 + c;
						var v = 0;
						
						var i_ = (y_*w + x_)*4 + c
						var v_ = 0;
						
						for(var k = 0;k < mLen; k++){//卷积核
							var mY = Math.floor(k/mW)-r, mX = k%mW-r; ///卷积核的x y 坐标
							//左侧
							if(x+mX<0){//超出图片矩阵范围 
								v += m[k]*iD[i];
							}else{
								v += m[k]*iD[i+w*4*(mY)+4*(mX)]  ///Math.floor(k/mW) 第几行  k%mW 第几列
							}
							
							//右侧
							if(x_+mX>=w){//超出图片矩阵范围
								v_ += m[k]*iD[i_];
							}else{
								v_ += m[k]*iD[i_+w*4*(mY)+4*(mX)]  ///Math.floor(k/mW) 第几行  k%mW 第几列
							}
							
						}
						oD[i] = (offset||0)+v/(divisor||1); ///设置偏移与阈值
						oD[i_] = (offset||0)+v_/(divisor||1);
						//底部
					}
					oD[(y*w + x)*4 + 3] = 255; // 设置透明度
					oD[(y_*w + x_)*4 + 3] = 255; // 设置透明度
				}
			}
			

			
			//水平边缘
			
			return imgData;
		}

	};
}(window,document));











	