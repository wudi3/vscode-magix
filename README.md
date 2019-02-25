# Magix 辅助开发插件

## 功能

### html模板页与js页跳转

通过快捷键`Alt+Tab`、`MAC键+鼠标点击 Magix tmpl属性值`、`右键快捷方式`，支持 html模板页与之相关联的js页跳转:

`Alt+Tab`
<img src="images/kjtz.gif" alt="js跳转" width="800"/>
`右键快捷方式`
<img src="images/yj.gif" alt="js跳转" width="800"/>
`MAC键+鼠标点击 Magix tmpl属性值`
<img src="images/dianji-tiaozhuan.gif" alt="js跳转" width="800"/>


注意：由于跳转功能是基于 magix3的js/ts写法的语法分析，仅支持下面写法的跳转功能,特殊项目可联系 **@灼日** **@抱血** 添加适配

```javascript
  var Magix = require('magix');
  module.exports = Magix.View.extend(
    temp:'@index.html',
    init:function(){},
    render:function(){}
  );
```
### html mx-前缀函数跳转至定义

通过快捷键`MAC键+鼠标点击`，支持 html模板页函数跳转到与之相关联的js定义:

<img src="images/hstz.gif" alt="hstz" width="800"/>

### html magix mx-事件提示 

<img src="images/hsts.gif" alt="hsts" width="800"/>


### Diamond 快速打开

<img src="images/Diamond.gif" alt="Diamond" width="800"/>

### html 模板代码折叠

<img src="images/zhedie.gif" alt="Diamond" width="800"/>


## 加群有惊喜

<img src="images/qun.jpg" alt="Diamond" width="400"/>


## 版本说明

### 0.0.1

html页面与js跳转功能

### 0.0.2

函数跳转功能

### 0.0.3

函数自动提示

### 0.0.4

Diamond 快捷功能

### 0.0.5

html 模板语法折叠功能


