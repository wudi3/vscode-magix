# Magix 辅助开发插件

## 功能

### html模板页与js页跳转

通过快捷键`Alt+Tab`、`MAC键+鼠标点击 Magix tmpl属性值`、`右键快捷方式`，支持 html模板页与之相关联的js页跳转:

`Alt+Tab`
![js跳转](https://intranetproxy.alipay.com/skylark/lark/0/2019/gif/7892/1550888482475-7bdfbb90-f1b7-493b-867c-1a2b9844b4c8.gif)
`右键快捷方式`
<img src="https://intranetproxy.alipay.com/skylark/lark/0/2019/gif/7892/1550888527996-56dd4160-5cd0-4a4a-b303-dcbfc7e4fd79.gif" alt="js跳转" width="800"/>
`MAC键+鼠标点击 Magix tmpl属性值`
<img src="https://intranetproxy.alipay.com/skylark/lark/0/2019/gif/7892/1550888545112-8b4c380f-7919-43b6-8e6f-906c114cc1f3.gif" alt="js跳转" width="800"/>


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

<img src="https://intranetproxy.alipay.com/skylark/lark/0/2019/gif/7892/1550888563917-69826d7b-7ae5-4507-b9fb-4a41e21097ee.gif" alt="hstz" width="800"/>

### html magix mx-事件提示 

<img src="https://intranetproxy.alipay.com/skylark/lark/0/2019/gif/7892/1550888581784-d9dbc243-7ea2-4b4e-ace7-503d03624d88.gif" alt="hsts" width="800"/>


### Diamond 快速打开



### html 模板代码折叠

<img src="https://intranetproxy.alipay.com/skylark/lark/0/2019/gif/7892/1550888614787-633d2084-470c-4522-b6bf-48f06a29ec8a.gif" alt="Diamond" width="800"/>


## 加群有惊喜

<img src="https://intranetproxy.alipay.com/skylark/lark/0/2019/jpeg/7892/1550888632895-b3e30ddc-6c16-4508-880f-ad9804f85e0d.jpeg?x-oss-process=image/resize,w_386" alt="Diamond" width="400"/>


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


