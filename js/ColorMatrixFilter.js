// FilterJs.js by hylink 杨燚平 2015-07-03 email:849890769@qq.com

//矩阵滤镜
(function(window,document){
	
	'use strict';
	
    var _ = window.FILTER||{};
    
    //构造函数
	_.ColorMatrixFilter = _.ColorMatrixFilter || function(mat){
		
		this.matrix = mat && _.Float32Array( mat ) || _.Float32Array( [
														1, 0, 0, 0, 0, 
														0, 1, 0, 0, 0, 
														0, 0, 1, 0, 0, 
														0, 0, 0, 1, 0
														] )
		this.originalMatrix = _.Float32Array( this.matrix )
		
		
	};
    
    
	_.ColorMatrixFilter.prototype = {
		
        constructor : 'ColorMatrixFilter',

        
        //获取单个通道的颜色值 ch 为通道序号  asGray 是否为灰色
        channel: function( ch, asGray ) {
            var f = asGray ? 1 : 0;
            switch(ch){
                case _.CHANNEL.ALPHA:
                    return this.add([
                                0, 0, 0, 1, 0, 
                                0, 0, 0, 1, 0, 
                                0, 0, 0, 1, 0, 
                                0, 0, 0, 0, 255
                            ]);
                    break;

                case _.CHANNEL.BLUE:
                    return this.add([
                                0, 0, f, 0, 0, 
                                0, 0, f, 0, 0, 
                                0, 0, 1, 0, 0, 
                                0, 0, 0, 0, 255
                            ]);
                    break;

                case _.CHANNEL.GREEN:
                    return this.add([
                                0, f, 0, 0, 0, 
                                0, 1, 0, 0, 0, 
                                0, f, 0, 0, 0, 
                                0, 0, 0, 0, 255
                            ]);
                    break;

                case _.CHANNEL.RED:
                default:
                    return this.add([
                                1, 0, 0, 0, 0, 
                                f, 0, 0, 0, 0, 
                                f, 0, 0, 0, 0, 
                                0, 0, 0, 0, 255
                            ]);
                    break;
            }
        },
        redChannel: function( asGray ) {
            return this.channel(_.CHANNEL.RED, asGray);
        },

        greenChannel: function( asGray ) {
            return this.channel(_.CHANNEL.GREEN, asGray);
        },

        blueChannel: function( asGray ) {
            return this.channel(_.CHANNEL.BLUE, asGray);
        },

        alphaChannel: function( asGray ) {
            return this.channel(_.CHANNEL.ALPHA, true);
        },
		
		//调整通道 对单个通道的调整
		reviseChannel: function( ch, scale ,offset) {
			scale = ( scale === undefined ) ? 0 : scale;
			offset = ( offset === undefined ) ? 0 : offset;
			switch( ch ){
				case FILTER.CHANNEL.ALPHA:
					return this.add([
								1, 0, 0, 0, 0, 
								0, 1, 0, 0, 0, 
								0, 0, 1, 0, 0, 
								0, 0, 0, scale, offset
							]);
					break;
				
				case FILTER.CHANNEL.BLUE:
					return this.add([
								1, 0, 0, 0, 0, 
								0, 1, 0, 0, 0, 
								0, 0, scale, 0, offset, 
								0, 0, 0, 1, 0
							]);
					break;
				
				case FILTER.CHANNEL.GREEN:
					return this.add([
								1, 0, 0, 0, 0, 
								0, scale, 0, 0, offset, 
								0, 0, 1, 0, 0, 
								0, 0, 0, 1, 0
							]);
					break;
				
				case FILTER.CHANNEL.RED:
				default:
					return this.add([
								scale, 0, 0, 0, offset, 
								0, 1, 0, 0, 0, 
								0, 0, 1, 0, 0, 
								0, 0, 0, 1, 0
							]);
					break;
			}
		},
		
		reviseRed: function(scale, offset) {
            return this.reviseChannel(_.CHANNEL.RED,scale,offset);
        },

        reviseGreen: function(scale, offset) {
            return this.reviseChannel(_.CHANNEL.GREEN,scale,offset);
        },
		
        reviseBlue: function(scale, offset) {
            return this.reviseChannel(_.CHANNEL.BLUE,scale,offset);
        },

        reviseAlpha: function(scale, offset) {
            return this.reviseChannel(_.CHANNEL.ALPHA,scale,offset);
        },
		
		
		
		
		//交换通道
		swapChannels: function( ch1, ch2 ) {
			switch( ch1 )
			{
				case FILTER.CHANNEL.ALPHA:
					switch( ch2 )
					{
						case FILTER.CHANNEL.ALPHA:
							return this;
							break;
						
						case FILTER.CHANNEL.BLUE:
							return this.add([
										1, 0, 0, 0, 0, 
										0, 1, 0, 0, 0, 
										0, 0, 0, 1, 0, 
										0, 0, 1, 0, 0
									]);
							break;
						
						case FILTER.CHANNEL.GREEN:
							return this.add([
										1, 0, 0, 0, 0, 
										0, 0, 0, 1, 0, 
										0, 0, 1, 0, 0, 
										0, 1, 0, 0, 0
									]);
							break;
						
						case FILTER.CHANNEL.RED:
						default:
							return this.add([
										0, 0, 0, 1, 0, 
										0, 1, 0, 0, 0, 
										0, 0, 1, 0, 0, 
										1, 0, 0, 0, 0
									]);
							break;
					}
					break;
				
				case FILTER.CHANNEL.BLUE:
					switch( ch2 )
					{
						case FILTER.CHANNEL.ALPHA:
							return this.add([
										1, 0, 0, 0, 0, 
										0, 1, 0, 0, 0, 
										0, 0, 0, 1, 0, 
										0, 0, 1, 0, 0
									]);
							break;
						
						case FILTER.CHANNEL.BLUE:
							return this;
							break;
						
						case FILTER.CHANNEL.GREEN:
							return this.add([
										1, 0, 0, 0, 0, 
										0, 0, 1, 0, 0, 
										0, 1, 0, 0, 0, 
										0, 0, 0, 1, 0
									]);
							break;
						
						case FILTER.CHANNEL.RED:
						default:
							return this.add([
										0, 0, 1, 0, 0, 
										0, 1, 0, 0, 0, 
										1, 0, 0, 0, 0, 
										0, 0, 0, 1, 0
									]);
							break;
					}
					break;
				
				case FILTER.CHANNEL.GREEN:
					switch( ch2 )
					{
						case FILTER.CHANNEL.ALPHA:
							return this.add([
										1, 0, 0, 0, 0, 
										0, 0, 0, 1, 0, 
										0, 0, 1, 0, 0, 
										0, 1, 0, 0, 0
									]);
							break;
						
						case FILTER.CHANNEL.BLUE:
							return this.add([
										1, 0, 0, 0, 0, 
										0, 0, 1, 0, 0, 
										0, 1, 0, 0, 0, 
										0, 0, 0, 1, 0
									]);
							break;
						
						case FILTER.CHANNEL.GREEN:
							return this;
							break;
						
						case FILTER.CHANNEL.RED:
						default:
							return this.add([
										0, 1, 0, 0, 0, 
										1, 0, 0, 0, 0, 
										0, 0, 1, 0, 0, 
										0, 0, 0, 1, 0
									]);
							break;
					}
					break;
				
				case FILTER.CHANNEL.RED:
				default:
					switch( ch2 )
					{
						case FILTER.CHANNEL.ALPHA:
							return this.add([
										0, 0, 0, 1, 0, 
										0, 1, 0, 0, 0, 
										0, 0, 1, 0, 0, 
										1, 0, 0, 0, 0
									]);
							break;
						
						case FILTER.CHANNEL.BLUE:
							return this.add([
										0, 0, 1, 0, 0, 
										0, 1, 0, 0, 0, 
										1, 0, 0, 0, 0, 
										0, 0, 0, 1, 0
									]);
							break;
						
						case FILTER.CHANNEL.GREEN:
							return this.add([
										0, 1, 0, 0, 0, 
										1, 0, 0, 0, 0, 
										0, 0, 1, 0, 0, 
										0, 0, 0, 1, 0
									]);
							break;
						
						case FILTER.CHANNEL.RED:
						default:
							return this;
							break;
					}
					break;
			}
		},
		
		//去色
		desaturate: function() {
			return this.add([
						FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 0, 
						FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 0, 
						FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 0, 
						0, 0, 0, 1, 0
					]);
		},
		//平均 返回灰色图片 是对红绿蓝进行加权平均数的计算
		average: function( r, g, b ) {
			if ( r === undefined ) r = 0.3333;
			if ( g === undefined ) g = 0.3333;
			if ( b === undefined ) b = 0.3334;
			
			return this.add([
					r, g, b, 0, 0, 
					r, g, b, 0, 0, 
					r, g, b, 0, 0, 
					0, 0, 0, 1, 0
				]);
		},
		
		//明度  对红绿蓝进行数值偏移计算
		brightness: function( r, g, b ) {
			if ( g === undefined )  g = r;
			if ( b === undefined )  b = r;
			return this.add([
					1, 0, 0, 0, r, 
					0, 1, 0, 0, g, 
					0, 0, 1, 0, b, 
					0, 0, 0, 1, 0
				]);
		},
		
		
		
		//着色
		colorize: function( rgb, alpha ) {
			var r, g, b, inv_alpha;
			if ( alpha === undefined ) alpha = 1;
			//var alpha = alpha ? 0 : 1;
			r = (((rgb >> 16) & 255) * 0.0039215686274509803921568627451);  // / 255
			g = (((rgb >> 8) & 255) * 0.0039215686274509803921568627451);  // / 255
			b = ((rgb & 255) * 0.0039215686274509803921568627451);  // / 255
			inv_alpha = 1 - alpha;
			
			//console.log((rgb >> 8).toString(2))
			//console.log((255).toString(2))
			//console.log(((rgb >> 8) & 255).toString(2))
			
			//console.log((inv_alpha + ((alpha * r) * FILTER.LUMA[0])), ((alpha * r) * FILTER.LUMA[1]), ((alpha * r) * FILTER.LUMA[2]), 0, 0)
			//console.log(((alpha * g) * FILTER.LUMA[0]), (inv_alpha + ((alpha * g) * FILTER.LUMA[1])), ((alpha * g) * FILTER.LUMA[2]), 0, 0)
			//console.log(((alpha * b) * FILTER.LUMA[0]), ((alpha * b) * FILTER.LUMA[1]), (inv_alpha + ((alpha * b) * FILTER.LUMA[2])), 0, 0)
	
			return this.add([
						(inv_alpha + ((alpha * r) * FILTER.LUMA[0])), ((alpha * r) * FILTER.LUMA[1]), ((alpha * r) * FILTER.LUMA[2]), 0, 0, 
						((alpha * g) * FILTER.LUMA[0]), (inv_alpha + ((alpha * g) * FILTER.LUMA[1])), ((alpha * g) * FILTER.LUMA[2]), 0, 0, 
						((alpha * b) * FILTER.LUMA[0]), ((alpha * b) * FILTER.LUMA[1]), (inv_alpha + ((alpha * b) * FILTER.LUMA[2])), 0, 0, 
							0, 0, 0, 1, 0
						]);
		},
		
		//反向
		invert: function( ) {
			return this.add([
					-1, 0,  0, 0, 255,
					0, -1,  0, 0, 255,
					0,  0, -1, 0, 255,
					0,  0,  0, 1,   0
				]);
		},
		
		invertRed: function( ) {
			return this.add([
					-1, 0,  0, 0, 255,
					0,  1,  0, 0, 255,
					0,  0,  1, 0, 255,
					0,  0,  0, 1,   0
				]);
		},
		
		invertGreen: function( ) {
			return this.add([
					1,  0,  0, 0, 255,
					0,  -1, 0, 0, 255,
					0,  0,  1, 0, 255,
					0,  0,  0, 1,   0
				]);
		},
		
		invertBlue: function( ) {
			return this.add([
					1,  0,  0, 0, 255,
					0,  1,  0, 0, 255,
					0,  0, -1, 0, 255,
					0,  0,  0, 1,   0
				]);
		},
		
		//alpha 反向
		invertAlpha: function( ) {
			return this.add([
					1,  0,  0, 0, 0,
					0,  1,  0, 0, 0,
					0,  0,  1, 0, 0,
					0,  0,  0, -1, 255
				]);
		},
		
		//饱和度
		saturate: function( s ) {
			
			var sInv, irlum, iglum, iblum;
			sInv = (1 - s);
			irlum = (sInv * FILTER.LUMA[0]);
			iglum = (sInv * FILTER.LUMA[1]);
			iblum = (sInv * FILTER.LUMA[2]);
			
			return this.add([
					(irlum + s), iglum, iblum, 0, 0, 
					irlum, (iglum + s), iblum, 0, 0, 
					irlum, iglum, (iblum + s), 0, 0, 
					0, 0, 0, 1, 0
				]);
		},
		
		//对比度
		contrast: function( r, g, b ) {
			if ( g === undefined )  g = r;
			if ( b === undefined )  b = r;
			r += 1.0; g += 1.0; b += 1.0;
			return this.add([
					r, 0, 0, 0, (128 * (1 - r)), 
					0, g, 0, 0, (128 * (1 - g)), 
					0, 0, b, 0, (128 * (1 - b)), 
					0, 0, 0, 1, 0
				]);
		},
		//快速校正对比度
		quickContrastCorrection: function( contrast ) {
			if ( contrast === undefined ) contrast = 1.2;
			return this.add([
				contrast, 0, 0, 0, 0, 
				0, contrast, 0, 0, 0, 
				0, 0, contrast, 0, 0, 
				0, 0, 0, 1, 0
				]);
		},
		
		//色相调整 色环 0-360
		adjustHue: function( degrees ) {
			degrees *= FILTER.CONSTANTS.toRad;
			var cos = Math.cos(degrees), sin = Math.sin(degrees);
			
			return this.add([
					((FILTER.LUMA[0] + (cos * (1 - FILTER.LUMA[0]))) + (sin * -(FILTER.LUMA[0]))), ((FILTER.LUMA[1] + (cos * -(FILTER.LUMA[1]))) + (sin * -(FILTER.LUMA[1]))), ((FILTER.LUMA[2] + (cos * -(FILTER.LUMA[2]))) + (sin * (1 - FILTER.LUMA[2]))), 0, 0, 
					((FILTER.LUMA[0] + (cos * -(FILTER.LUMA[0]))) + (sin * 0.143)), ((FILTER.LUMA[1] + (cos * (1 - FILTER.LUMA[1]))) + (sin * 0.14)), ((FILTER.LUMA[2] + (cos * -(FILTER.LUMA[2]))) + (sin * -0.283)), 0, 0, 
					((FILTER.LUMA[0] + (cos * -(FILTER.LUMA[0]))) + (sin * -((1 - FILTER.LUMA[0])))), ((FILTER.LUMA[1] + (cos * -(FILTER.LUMA[1]))) + (sin * FILTER.LUMA[1])), ((FILTER.LUMA[2] + (cos * (1 - FILTER.LUMA[2]))) + (sin * FILTER.LUMA[2])), 0, 0, 
					0, 0, 0, 1, 0
				]);
		},
		
		
		
		//sepia 偏色  褐色调旧照片。
		sepia: function( amount ) {
			if ( amount === undefined ) amount = 0.5;
			if ( amount > 1 ) amount = 1;
			else if ( amount < 0 ) amount = 0;
			return this.add([
				1.0 - (0.607 * amount), 0.769 * amount, 0.189 * amount, 0, 0, 
				0.349 * amount, 1.0 - (0.314 * amount), 0.168 * amount, 0, 0, 
				0.272 * amount, 0.534 * amount, 1.0 - (0.869 * amount), 0, 0, 
				0, 0, 0, 1, 0
			]);
		},
		
		//sepia2 偏色  红褐色调旧照片。
		sepia2: function( amount ) {
			if ( amount === undefined ) amount = 10;
			if ( amount > 100 ) amount = 100;
			amount *= 2.55;
			return this.add([
				FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 40, 
				FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 20, 
				FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, -amount, 
				0, 0, 0, 1, 0
			]);
		},
		//灰白阈值
		threshold: function( threshold, factor ) {
			if ( factor === undefined )  factor = 256;
			
			return this.add([
					(FILTER.LUMA[0] * factor), (FILTER.LUMA[1] * factor), (FILTER.LUMA[2] * factor), 0, (-(factor-1) * threshold), 
					(FILTER.LUMA[0] * factor), (FILTER.LUMA[1] * factor), (FILTER.LUMA[2] * factor), 0, (-(factor-1) * threshold), 
					(FILTER.LUMA[0] * factor), (FILTER.LUMA[1] * factor), (FILTER.LUMA[2] * factor), 0, (-(factor-1) * threshold), 
					0, 0, 0, 1, 0
				]);
		},
		
		
		//阈值 保留彩色
		threshold_rgb: function( threshold, factor ) {
			if ( factor === undefined )  factor = 256;
			
			return this.add([
					factor, 0, 0, 0, (-(factor-1) * threshold), 
					0, factor, 0, 0, (-(factor-1) * threshold), 
					0,  0, factor, 0, (-(factor-1) * threshold), 
					0, 0, 0, 1, 0
				]);
		},
		
		/*threshold_alpha: function( threshold, factor ) {
			if ( threshold === undefined )  threshold = 0.5;
			if ( factor === undefined ) factor = 256;
			
			return this.add([
					1, 0, 0, 0, 0, 
					0, 1, 0, 0, 0, 
					0, 0, 1, 0, 0, 
					0, 0, 0, factor, (-factor * threshold)
				]);
		},*/
		
		// RGB 转 YCbCr
		RGB2YCbCr: function( ) {
			return this.add([
					0.5, -0.418688, -0.081312, 0, 128,  
					0.299, 0.587, 0.114, 0, 0,   
					-0.168736, -0.331264, 0.5, 0, 128,  
					0, 0, 0, 1, 0
				]);
		},
		// YCbCr 转 RGB
		YCbCr2RGB: function( ) {
			return this.add([
					1.402, 1, 0, 0, -179.456,  
					-0.71414, 1, -0.34414, 0, 135.45984,
					0, 1, 1.772, 0, -226.816,
					0, 0, 0, 1, 0
				]);
		},

		add: function( mat ) {
			this.matrix = ( this.matrix ) ? this.CMconcat(this.matrix,mat) : mat;
			return this;
		},
		//重置matrix的值为创建实例时的值
		reset: function( ) {
            this.matrix = _.Float32Array( this.originalMatrix );
            return this;
        },
		//清除矩阵滤镜效果 
		clear: function( ) {
            this.matrix = _.Float32Array( [
								1, 0, 0, 0, 0, 
								0, 1, 0, 0, 0, 
								0, 0, 1, 0, 0, 
								0, 0, 0, 1, 0
							]); 
            return this;
        },
		
		clone: function(){
			return new _.ColorMatrixFilter(this.matrix);
		},
		
		
		//两个矩阵的乘积
        CMconcat : function(tm, mat) {
            var t = [], m0, m1, m2, m3, m4;

            // i=0
            m0=mat[0]; m1=mat[1]; m2=mat[2]; m3=mat[3]; m4=mat[4];
            t[ 0 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
            t[ 1 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
            t[ 2 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
            t[ 3 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
            t[ 4 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;

            // i=5
            m0=mat[5]; m1=mat[6]; m2=mat[7]; m3=mat[8]; m4=mat[9];
            t[ 5 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
            t[ 6 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
            t[ 7 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
            t[ 8 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
            t[ 9 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;

            // i=10
            m0=mat[10]; m1=mat[11]; m2=mat[12]; m3=mat[13]; m4=mat[14];
            t[ 10 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
            t[ 11 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
            t[ 12 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
            t[ 13 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
            t[ 14 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;

            // i=15
            m0=mat[15]; m1=mat[16]; m2=mat[17]; m3=mat[18]; m4=mat[19];
            t[ 15 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
            t[ 16 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
            t[ 17 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
            t[ 18 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
            t[ 19 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;
            
            return t;
            
        },

		//matrix*｛RGBA｝ 
		apply : function(imgData){
			var d = imgData.data;
			var m = this.matrix,
				len = d.length,
				p0, p1, p2, p3, 
                p4, p5, p6, p7, 
                p8, p9, p10, p11,
                p12, p13, p14, p15,
                t0, t1, t2, t3,
				rem = len%8;
//var sT = new Date();

			
			
			/*for(var i = 0; i < len; i += 8){
				
				t0 = d[i]; t1 = d[i+1]; t2 = d[i+2]; t3 = d[i+3];
                p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = d[i+4]; t1 = d[i+5]; t2 = d[i+6]; t3 = d[i+7];
                p4  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p5  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p6  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p7  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
               
                
                d[i] = p0; d[i+1] = p1; d[i+2] = p2; d[i+3] = p3;
                d[i+4] = p4; d[i+5] = p5; d[i+6] = p6; d[i+7] = p7;

			}
			
			if(rem){
				for (i = len-rem; i < len; i+=4){
                    t0 = d[i]; t1 = d[i+1]; t2 = d[i+2]; t3 = d[i+3];
					p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
					p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
					p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
					p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
					
					d[i] = p0; d[i+1] = p1; d[i+2] = p2; d[i+3] = p3;
                }
			}*/
			
			
			for (var i = 0; i < len; i+=4){
				t0 = d[i]; t1 = d[i+1]; t2 = d[i+2]; t3 = d[i+3];
				p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
				p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
				p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
				p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
				
				d[i] = p0; d[i+1] = p1; d[i+2] = p2; d[i+3] = p3;
			}
			
			
//console.log((new Date())-sT)
			return imgData;
			
		},
		
		
		apply_ : function(imgData){
			var d = imgData.data;
			var m = this.matrix,
				len = d.length,
				p0, p1, p2, p3, 
                p4, p5, p6, p7, 
                p8, p9, p10, p11,
                p12, p13, p14, p15,
                t0, t1, t2, t3,
				rem = len%8;
//var sT = new Date();

			
			
			/*for(var i = 0; i < len; i += 8){
				
				t0 = d[i]; t1 = d[i+1]; t2 = d[i+2]; t3 = d[i+3];
                p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = d[i+4]; t1 = d[i+5]; t2 = d[i+6]; t3 = d[i+7];
                p4  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p5  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p6  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p7  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
               
                
                d[i] = p0; d[i+1] = p1; d[i+2] = p2; d[i+3] = p3;
                d[i+4] = p4; d[i+5] = p5; d[i+6] = p6; d[i+7] = p7;

			}
			
			if(rem){
				for (i = len-rem; i < len; i+=4){
                    t0 = d[i]; t1 = d[i+1]; t2 = d[i+2]; t3 = d[i+3];
					p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
					p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
					p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
					p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
					
					d[i] = p0; d[i+1] = p1; d[i+2] = p2; d[i+3] = p3;
                }
			}*/
			
			
			for (var i = 0; i < len; i+=4){
				t0 = d[i]; t1 = d[i+1]; t2 = d[i+2]; t3 = d[i+3];
				p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
				p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
				p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
				p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
				
				d[i] = p0; d[i+1] = p1; d[i+2] = p2; d[i+3] = p3;
			}
			
			
//console.log((new Date())-sT)
			return imgData;
			
		},
		
		
		apply_ : function(imgData){
			var d = imgData.data;
			var m = this.matrix,
				len = d.length,
				p0, p1, p2, p3, 
                p4, p5, p6, p7, 
                p8, p9, p10, p11,
                p12, p13, p14, p15,
                t0, t1, t2, t3,
				rem = len%16;
			
			for(var i = 0; i < len; i += 16){
				
				t0 = d[i]; t1 = d[i+1]; t2 = d[i+2]; t3 = d[i+3];
                p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = d[i+4]; t1 = d[i+5]; t2 = d[i+6]; t3 = d[i+7];
                p4  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p5  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p6  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p7  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = d[i+8]; t1 = d[i+9]; t2 = d[i+10]; t3 = d[i+11];
                p8  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p9  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p10  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p11  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = d[i+12]; t1 = d[i+13]; t2 = d[i+14]; t3 = d[i+15];
                p12  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p13  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p14  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p15  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                d[i] = p0; d[i+1] = p1; d[i+2] = p2; d[i+3] = p3;
                d[i+4] = p4; d[i+5] = p5; d[i+6] = p6; d[i+7] = p7;
                d[i+8] = p8; d[i+9] = p9; d[i+10] = p10; d[i+11] = p11;
                d[i+12] = p12; d[i+13] = p13; d[i+14] = p14; d[i+15] = p15;

			}
			
			if(rem){
				for (i = len-rem; i < len; i+=4){
                    t0 = d[i]; t1 = d[i+1]; t2 = d[i+2]; t3 = d[i+3];
					p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
					p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
					p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
					p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
					
					d[i] = p0; d[i+1] = p1; d[i+2] = p2; d[i+3] = p3;
                }
			}
			
			return imgData;
			
		}
	};
}(window,document));











	