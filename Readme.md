## 什么是AJAX？
    Ajax即Asynchronous Javascript And XML (异步JavaScript和XML)，并非编程语言；Ajax允许通过与场景后面的Web服务器交换数据来异步更新网页。这意味着可以更新网页部分，而不需要重新加载整个页面。
    Ajax仅仅组合了：
        1.游览器内建的XMLHttpRequest对象(从web服务器请求数据)
            用于同幕后服务器交换数据，这意味着可以更新网页的部分，而不需要重新加载整个页面
        2.JavaScript和HTML DOM (显示或使用数据)
    Ajax工作流程：
        1.网页中发生一个事件(页面加载、按钮点击)
        2.由JavaScript创建XMLHttpRequest对象
        3.XMLHttpRequest对象向web服务器发送请求
        4.服务器处理该请求
        5.服务器将响应发送回页面
        6.由JavaScript读取响应
        7.由JavaScript执行正确的动作(比如更新页面)
    

