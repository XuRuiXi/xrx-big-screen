### **通用大屏项目框架**



**采用umi框架，约定式路由，集成国际化**


**外层分辨率自适应容器\<EqRatioBox />**  

通过设计稿的尺寸，然后再根据可视区域的尺寸，计算出缩放比例，然后通过transform:scale()来实现自适应,再设置transform-origin: 0 0;来实现左上角对齐

使用方法
```js
<EqRatioBox
// 设计稿尺寸
  width={5120}
  height={1440}
  // xAlign="left"
  style={{
    // 开发者窗口尺寸
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    background: '#000',
  }}
>
  {children}
</EqRatioBox>
```

原理：

