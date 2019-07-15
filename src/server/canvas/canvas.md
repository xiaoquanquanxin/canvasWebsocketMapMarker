### 需要绘制部分
### 
1。可约车部分：
####    
1。地图    
2。各个站点  
3。用户位置  【当用户开启定位当时候】    
4。起点与终点logo 【当用户选择起点的时候】    

###
2。有未完成订单部分：
####
1。地图    
2。各个站点
3。起点与终点logo 【乘车前，乘车中就没了】    
4。规划路线  【待驾，乘车中】    
5。汽车logo 【排队之后】



###  可能遇到的问题：   
1。定位不准
2。道路定位点可能会七扭八歪


### 单位的约定
1。时间单位：HH:mm:ss 
2。距离单位：统一 m
3。



### interface
在javaScript全局环境下，会暴露出来一个NativeUtilsCallH5对象，用于提供H5方法接口  
NativeUtilsCallH5下 的 DriverLessCar 表示无人车模块  

>1.无车可约      
NativeUtilsCallH5.DriverLessCar.drawNoCar()

>2.约车记录详情    
同上

>3.有车可约-无未完成订单-进入页面   
javaScript自执行

>4.有车可约-无未完成订单-用户未定位状态
NativeUtilsCallH5.DriverLessCar.drawUnLocation()

>5.有车可约-无未完成订单-用户开启定位状态
/**
*   @userPoint:string ,用户定位的json字符串
*/
NativeUtilsCallH5.DriverLessCar.drawUnLocation(userPoint)



