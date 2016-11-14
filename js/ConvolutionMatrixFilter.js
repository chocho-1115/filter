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
	};
    
	_.ConvolutionMatrixFilter.prototype = {
		
        constructor : 'ConvolutionMatrixFilter',
		
		copyData : function(imgData){
		
			if(!imgData) throw('parameters imgData are required');
			
			f2D.clearRect(0, 0, fCanvas.width, fCanvas.height);
			
			fCanvas.width = imgData.width;
			fCanvas.height = imgData.height;
			f2D.putImageData(imgData, 0, 0);
			
			return f2D.getImageData(0, 0, imgData.width, imgData.height);
			
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











	