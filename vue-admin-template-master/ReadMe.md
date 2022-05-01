## 路由组件的搭建
vue-router
在上面分析的时候，路由组件应该有四个：Home、Search、Login、Register
-components文件夹：经常放置的非路由组件（共用全局组件）
-pages|views文件夹：经常放置路由组件

5.1配置路由
项目当中配置的路由一般放置在router文件夹中

5.2总结
路由组件与非路由组件的区别？
1：路由组件一般放置在pages|views文件夹，非路由组件一般放置components文件夹中
2：路由组件一般需要在router文件夹中进行注册(使用的即为组件的名字)，非路由组件在使用的时候，一般都是以标签的形式使用
3：注册完路由，不管路由组件还是非路由组件身上都有$route、$router属性
$route:一般获取路由信息【路径、query、params等等】
$router:一般进行编程式导航进行路由跳转【push|replace】

5.3路由的跳转？
路由的跳转有两种形式：
声明式导航router-link,可以进行路由的跳转
编程式导航:利用的是组件实例的$router.push|replace,可以进行路由的跳转

编程式导航：声明式导航能做的，编程式导航都可以做
但是编程式导航除了可以进行路由跳转，还可以做一些其他的业务逻辑。

## 路由传参
1.路由跳转有几种方式？
比如：A->B
声明式导航：router-link(务必要有to属性)，可以实现路由的跳转
编程式导航：利用的是组件实例的$router.push|replace方法，可以实现路由的跳转。（可以书写一些自己业务）

2.路由传参，参数有几种写法？
params参数：属于路径当中的一部分，需要注意，在配置路由的时候，需要占位
query参数：不属于路径当中的一部分，类似于ajax中的queryString/home?k=v&kv=,不需要占位

## 路由传参相关面试题
1：路由传递参数（对象的写法）path是否可以结合params参数一起使用？
    可以使用path和name。但如果要结合params参数一起使用的话，只能使用name
    如果使用path跳转路径会出现错误，而且只会出现query参数
    ``http://localhost:8080/#/home?k=QWE``


2：如何指定params参数可传可不传？
    如果路由要求传递params参数，但是你就不传递params参数，会发现URL有问题
    在配置路由的时候，在占位的后面加上一个问好【params可以传递或者不传递】
    ``path:"/search/:keyWord?"``

3：params参数可以传递也可以不传递，但是如果传递是空串，如何解决？
    使用undefined来解决

    ``this.$router.push({
              name:"search",
              params:{keyWord:""||undefined},
              query:{k:this.keyWord.toUpperCase()}
          })``

4：路由组件能不能传递props数据？
    可以，一共有三种方式
    1)第一种：布尔值的写法（只能传递params参数）
            props:true
    2)第二种：对象的写法:额外的给路由组件传递一些props
            props:{a:1,b:2},
    3)第三种：函数的写法: 可以将params参数、query参数，通过props传递给路由组件
            props:($route)=>{
                return {keyWord:$route.params.keyWord,k:$route.query.k}
            }


## axios二次封装
可以发送请求的：XMLHttpRequest、fetch、JQ、axios
    1) 为什么需要进行二次封装axios？
需要用到它的请求拦截器、响应拦截器。
    请求拦截器：在发请求之前可以处理一些业务
    响应拦截器：当服务器数据返回以后，可以处理一些事情

    2) 在项目当中经常API文件夹【axios】
    接口当中：路径都带有/api
    baseURL:"/api"

## nprogress进度条的使用

    start：进度条开始
    done：进度条结束

## 演示卡顿现象
正常：事件触发非常频繁，而且每一次的触发，回调函数都要去执行(如果时间很短，而回调函数内部有计算，那么很可能出现游览器卡顿)

节流throttle：在规定的间隔时间范围内不会重复回调，只有大于这个时间间隔才会触发回调，把频繁触发变为少了触发
防抖debounce：前面的所有的触发都被取消，最后一次执行在规定的时间之后才会触发，也就是说如果连续快速的触发 只会执行一次(执行最后一次)

## Home页面的拆分
    总共拆分为7个组件
    1) 三级联动组件
    ---由于三级联动，在Home、Search、Detail，把三级联动注册为全局组件。
    好处：只需要注册一次，就可以在项目任意地方使用

    2) 开发Home首页当中的ListContainer组件与Floor组件？
    https://docschina.org/
    但是这里需要注意：服务器返回的数据(接口)只有商品分类菜单分类数据，对于ListContainer组件与Floor组件没有提供
    采用mock数据(模拟):可以生成随机数据，拦截ajax请求，在前端玩耍，跟后台没有关系，需要用到mockjs插件


## Search模块的拆分
    1)TypeNav商品分类菜单（过渡动画效果）
    过渡动画：前提组件|元素务必要有v-if|v-show指令才可以进行过渡动画

    2)现在的商品分类三级列表可以进行优化？
    在APP根组件当中发请求【根组件mounted】只执行一次

    3)Object.assign()
    合并参数:Object.assign(this.SearchParams,this.$route.query,this.$route.params);

    4)分页器
    分页器的展示，需要哪些数据（条件）？
    分页器连续页码的个数：5|7【奇数】，因为奇数对称(好看)

    pageNo:当前第几个
    pageSize：代表每一页展示多少条数据
    total：代表整个分页一共要展示多少条数据
    continues：代表分页连续页码个数
    
    需要先自定义分页器：在开发的时候先自己传递假的数据进行调式，调式成功以后在用服务器数据

    [注]：对于分页器而言，很重要的一个地方【算出：连续页面起始数字和结束数字】

    v-for和v-if需要混用的时候，使用计算属性代替v-if，然后遍历计算属性

## Detail详情页
    1) 先渲染出静态页面(路由组件)

    2) api配置

    3) vuex捞数据

##  uuid
    1、首先封装uuid，生成uuid。
        新建文件：uuid_token.js

    2、这里我们将UUID储存在detail的小仓库中：

    3、在之前封装的request.js中获取生成的uuid

## shopCart模块
    1) 修改某个产品的个数
    采用的``changeCartListNum(cartList,changeNum)``函数，由于数量的增加、减少和填写，都是再向一个服务器发送请求，所以采用的同一个回调，changeNum形参：变化量(1)、变化量(2)和input输入框最终的个数(不是变化的量)，我们向服务器发送的是与此时已经添加进来的数量的差量，所以将input输入的最终量-原有的量，将差量向服务器发送过去

    2) 删除全选中的商品
    注意：我们没有删除全选中的商品接口，但是有通过商品的ID删除商品的接口
    使用promise.all([p1,p2,p3])
    p1,p2,p3都是对象，如果p1,p2,p3有一个返回失败，则失败，如果全成功则返回成功

    3) 全选框
    遍历所有的产品，将产品勾选，再调用服务器刷新页面


##  login模块
    登录与注册功能(git)：必须要会的技能
    assets文件夹---放置全部组件共用静态资源
    在样式当中也可以使用@符但是前面要加个~例如：~@/assets/images/icons.png

    注册---通过数据库存储用户信息(名字、密码)
    登录---登录成功的时候，后台为了区分你这个用户是谁，服务器下发token【令牌：唯一标识符】
    【注】一般登录成功服务器会下发token，前台持久存储token【带着token找服务器要用户信息进行展示，通过请求拦截器】
    vuex仓库存储数据---不是持久化

    怎样才能使token永久保存？
    保存在本地存储
## 路由懒加载
