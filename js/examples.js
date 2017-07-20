

window.addImgToEle = null;
window.addImgToCan = null;
window.cont2D = null;

window.canEle = null;



function initCanvas(opt){
	
	var imgEleBox = document.getElementById('imgEleBox');
	var canEle = document.getElementById('canvas');
	var canW = opt.imgW*opt.rowLen+opt.imgMargin*(opt.rowLen-1);
	var canH = 1500;
	
	canEle.width = canW;
	canEle.height = canH;
	
	if(!canEle||!canEle.getContext){return;}
	window.cont2D = canEle.getContext("2d");
	
	//添加img	
    window.addImgToEle = function (data,name){
		var newEle = document.createElement('img');
		newEle.setAttribute('src',data);
		newEle.setAttribute('title',name);
		newEle.setAttribute('alt',name);
		imgEleBox.appendChild(newEle);
	}
	
	//在画布中添加img
	var posX = 0,
        posY = 0,
        num = 0;
		
		
	window.addImgToCan = function(data,name){
		
		var x = name != undefined ? num%opt.rowLen*(opt.imgW+opt.imgMargin) : 0,
			y = name != undefined ? Math.floor(num/opt.rowLen)*(opt.imgH+opt.imgMargin) : 0;

		cont2D.putImageData(data.imgData||data,x,y);
		if(name){
			cont2D.fillStyle="rgba(0,0,0,.6)";
			//cont2D.rect(x,y,opt.imgW,opt.imgH*.2);
			cont2D.fillRect(x,y,opt.imgW,opt.imgH*.2);
			
			cont2D.fillStyle = '#ccc';
			cont2D.font="12px Verdana";
			cont2D.textBaseline="top";
			cont2D.fillText(name,x+3,y+(opt.imgH*.2-12)/2);
		}
		num++;
    }
	
	/*++++++++++++++++++++++++++++++++++++++++++*/
	
	
	
	

};


