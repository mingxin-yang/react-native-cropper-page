# react-native-cropper-page  

<!--
[![NPM version](https://img.shields.io/npm/v/react-native-cropper-page.svg)](https://www.npmjs.com/package/react-native-cropper-page)



## Installation
```bash
$ npm install react-native-cropper-page
```
-->
![img](https://github.com/mingxin-yang/images/blob/master/uiuuj.gif?raw=true)
## Quick Start

```
this.props.navigation.navigate("CropView", {
  data: {uri:response.uri,width:response.width,height:response.height},
  responseCropData: async (data)=>{
    console.log("responseCropData",data)
  }
});
```
