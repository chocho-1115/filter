---
title: javascript滤镜
---

---
本文主要介绍 filter.js 和 preloadImage.js
 * filter.js //主文件
 * preloadImage.js //图片加载处理
 * colorMatrixFilter.js //颜色矩阵
 * ConvolutionMatrixFilter.js //卷积矩阵
---
## filter.js
#### 创建filter ：FILTER.Create( imgEle / ImageData )
``` javascript
var cont2D = canEle.getContext("2d");
var imgO = new Image();
imgO.onload = function(){
    var F =  FILTER.Create(this);
};
imgO.src='path';
```
FILTER.Create 创建filter对象时，必须传递一个图片数据对象。这个对象可以是img元素，  也可以是ImageData对象。

通过构造函数 FILTER.Create 创建的实例 F，拥有以下属性和方法：
``` javascript
/*+++++++++++++ filter对象的属性 +++++++++++++*/

F.imgData //保存了 ImageData 信息
F.originalImgData //备份了 ImageData 信息 方便恢复图片数据

/*+++++++++++++ filter对象的方法 +++++++++++++*/

F.setBounds(x, y, width, height) //裁切图片
F.getBase64(type) //将ImageData数据 返回成base64字符串 默认为png格式：'image/png'；返回字符串
F.reset() //恢复图片数据
F.copyData() //对ImageData属性进行copy，并返回新的ImageData
F.clone() //克隆F对象，返回新的filter对象
```

---
## preloadImage.js
``` javascript
var imgSrcArr = [
    {path:'images/8.jpg',name:'pic1'},
    {path:'images/8.jpg',name:'pic2'},
    {path:'images/500.jpg',name:'pic3'}
];
FILTER.preload( imgSrcArr, {fileload: fileloadCallback , complete: completeCallback} );
function fileloadCallback(item){ //单张图片加载完后的回调函数
    item['result']; //img对象
    item['progress']; //加载进度
    item['index']; //在imgSrcArr中的下标
    item['status']; //加载状态
}
function completeCallback(result){ //所有图片加载完后的回调函数
    console.log('完成');
}
```
这里的第一个参数 imgSrcArr 可以是下面三种变量中的任意一种：
第一种 可以是字符串：'images/8.jpg'；
第二种 可以是字符串组成的数组 ['images/8.jpg','images/9.jpg','images/10.png']；
第三种 可以是自定义的属对象数组 [{path:'images/9.jpg',name:'pic1'},{path:'images/8.jpg',name:'pic2',id:'my'},{path:'images/80.jpg',name:'pic3'}]

在complete属性指向的回调函数，是在所有图片都加载完后调用的。参数result是一个对象，默认情况下是一个以imgSrcArr的下标为属性名，以img对象为属性值的对象（属性名可以自定义，以id值为属性名）：
加入imgSrcArr参数为上面的第三种情况的时候，那么result就是这样的对象：
``` javascript
{
 '0':	img,// images/9.jpg
 'my':	img,// images/8.jpg
 '2':	img,// images/80.jpg

}
```


