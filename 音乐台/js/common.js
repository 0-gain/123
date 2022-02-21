(function (w) {
    w.common = {};
    w.common.css = function (node, type, val) {
        // common(ulnode,translateX)
        if (typeof node === "object" && typeof node["transform"] === "undefined") {
            node["transform"] = {};
        }

        if (arguments.length >= 3) {
            //设置
            var text = "";
            node["transform"][type] = val;

            for (item in node["transform"]) {
                if (node["transform"].hasOwnProperty(item)) {
                    switch (item) {
                        case "translateX":
                        case "translateY":
                            text += item + "(" + node["transform"][item] + "px)";
                            break;
                        case "scale":
                            text += item + "(" + node["transform"][item] + ")";
                            break;
                        case "rotate":
                            text += item + "(" + node["transform"][item] + "deg)";
                            break;
                    }
                }
            }
            node.style.transform = node.style.webkitTransform = text;
        } else if (arguments.length == 2) {
            //读取
            val = node["transform"][type];
            if (typeof val === "undefined") {
                switch (type) {
                    case "translateX":
                    case "translateY":
                    case "rotate":
                        val = 0;
                        break;
                    case "scale":
                        val = 1;
                        break;
                }
            }
            return val;
        }
    }
    w.common.carousel = function (arr) {
        var carouselWrap = document.querySelector('.carousel-wrap');
        if (carouselWrap) {
            var pointsLength = arr.length;

            var needCarousel = carouselWrap.getAttribute('needCarousel')
            needCarousel = needCarousel == null ? false : true;
            if (needCarousel) {
                arr = arr.concat(arr);
            }

            var ulNode = document.createElement('ul')
            for (var i = 0; i < arr.length; i++) {
                ulNode.innerHTML +=
                    `<li style="width:${100 / arr.length}%;"><a href="javascript:;"><img src="./img/${arr[i]}"></a></li>`
            }
            ulNode.classList = 'list';
            ulNode.style.width = `${arr.length}00%`
            carouselWrap.appendChild(ulNode)

            setTimeout(() => {
                var imgNode = document.querySelector('.carousel-wrap > .list > li > a >img')
                carouselWrap.style.height = imgNode.offsetHeight + 'px'
            }, 100)

            var pointNode = document.querySelector('.carousel-wrap > .point')
            if (pointNode) {
                for (var i = 0; i < pointsLength; i++) {
                    if (i == 0) {
                        pointNode.innerHTML += `<span class='active'></span>`
                    } else {
                        pointNode.innerHTML += `<span></span>`
                    }
                }
                var pointsSpan = document.querySelectorAll('.carousel-wrap > .point > span')
            }
            /* 
                滑屏基本逻辑
                1.获取手指一开始的位置
                2.获取元素一开始的位置
                3.计算出手指移动的差值
            */
            //手指一开始的位置
            var start = {};
            //元素一开始的位置
            var element = {};
            var timer = 0;
            var isX = true;
            var isFirst = true;
            //无缝
            /*点击第一组的第一张时 瞬间跳到第二组的第一张
            点击第二组的最后一张时  瞬间跳到第一组的最后一张*/
            //index代表ul的位置

            carouselWrap.addEventListener('touchstart', function (e) {
                e = e || event
                touchX = e.changedTouches[0]
                start.x = touchX.clientX;
                start.y = touchX.clientY;
                element.x = common.css(ulNode, 'translateX')
                element.y = common.css(ulNode, 'translateY')
                ulNode.style.transition = 'none';

                isX = true;
                isFirst = true;

                if (needCarousel) {
                    var index = common.css(ulNode, 'translateX') / document.documentElement.clientWidth;
                    if (-index === 0) {
                        index = -pointsLength
                    } else if (-index == (arr.length - 1)) {
                        index = -(pointsLength - 1)
                    }
                    /* translateX = index * document.documentElement.clientWidth;
                    startX = touchX.clientX
                    elementX = translateX */
                    common.css(ulNode, 'translateX', index * document.documentElement.clientWidth)
                }
                clearInterval(timer);
            })
            carouselWrap.addEventListener('touchmove', function (e) {
                e = e || event;
                if (!isX) {
                    return;
                }
                var nowX = e.changedTouches[0].clientX;
                var nowY = e.changedTouches[0].clientY;
                var disX = start.x - nowX
                var disY = start.y - nowY
                if (isFirst) {
                    isFirst = false;
                    if (Math.abs(disY) > Math.abs(disX)) {
                        isX = false;
                        return;
                    }
                }
                common.css(ulNode, 'translateX', element.x - disX)
            })
            carouselWrap.addEventListener('touchend', function () {
                var index = common.css(ulNode, 'translateX') / document.documentElement.clientWidth;
                index = Math.round(index)
                if (index > 0) {
                    index = 0
                } else if (index < 1 - arr.length) {
                    index = 1 - arr.length
                }
                for (var i = 0; i < pointsLength; i++) {
                    pointsSpan[i].classList.remove('active')
                }
                //-5 -6 -7 -8 -9
                //0 1 2 3 4
                pointsSpan[-index % pointsLength].classList.add('active')

                ulNode.style.transition = '.5s left'
                /* translateX = index * document.documentElement.clientWidth
                ulNode.style.transform = `translateX(${translateX}px)` */
                common.css(ulNode, 'translateX', index * document.documentElement.clientWidth)
                // console.log(translateX)
                auto()
            })

            //自动轮播

            var needAuto = carouselWrap.getAttribute('needAuto')
            needAuto = needAuto == null ? false : true;
            if (needAuto) {
                auto()
            }
            //setTimeout在规定时间后执行完某个操作就停止了，而setInterval则可以一直循环下去。
            function auto() {
                clearInterval(timer);
                var index = common.css(ulNode, 'translateX') / document.documentElement.clientWidth;
                timer = setInterval(() => {
                    if (index == 1 - arr.length) {
                        ulNode.style.transition = "none";
                        index = 1 - arr.length / 2;
                        /* translateX = index * document.documentElement.clientWidth;
                        ulNode.style.transform = `translateX(${translateX}px)` */
                        common.css(ulNode, 'translateX', index * document.documentElement.clientWidth)
                    }
                    setTimeout(() => {
                        index--;
                        ulNode.style.transition = "1s transform";
                        /* translateX = index * document.documentElement.clientWidth;
                        ulNode.style.transform = `translateX(${translateX}px)` */
                        common.css(ulNode, 'translateX', index * document.documentElement.clientWidth)
                        myPoints()
                    }, 50);
                }, 3000);


            }

            function myPoints() {
                var index = common.css(ulNode, 'translateX') / document.documentElement.clientWidth;
                for (var i = 0; i < pointsLength; i++) {
                    pointsSpan[i].classList.remove('active')
                }
                pointsSpan[-index % pointsLength].classList.add('active')
            }
        }
    }
    //防抖动   即点即停
    /*transiton的问题
     
     * 1.元素没有渲染完成时，无法触发过渡的
     * 2.在transform切换下，如果前后transform属性值 变换函数的位置个数不一样 无法触发过渡的
     * 3.我们没有办法拿到transition中任何一帧的状态
     * 				-----  Tween算法
     * */
    w.common.scrollBar = function (wrap, callBack) {
        var content = wrap.children[0];
        var minY = wrap.clientHeight - content.offsetHeight;
        var start = {};
        var element = {};
        // 防抖动
        var isY = true;
        var isFirst = true;
        var timer = 0;
        var Tween = {
            Linear: function (t, b, c, d) {
                return c * t / d + b;
            },
            back: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            }
        }
        // 快速滑屏
        var lastPoint = 0;
        var lastTime = 0;
        var pointDis = 0;
        var timeDis = 1;
        var speed = 0;
        content.addEventListener('touchstart', function (ev) {
            ev = ev || event;
            var touchC = ev.changedTouches[0];
            // 重置minY
            minY = wrap.clientHeight - content.offsetHeight;
            // console.log(carousel.offsetHeight)
            start = {
                x: touchC.clientX,
                y: touchC.clientY
            };
            element.y = common.css(content, 'translateY');
            element.x = common.css(content, 'translateX');
            content.style.transition = 'none';
            lastPoint = touchC.clientY;
            lastTime = new Date().getTime();
            isY = true;
            isFirst = true;
            clearInterval(timer);
            pointDis = 0;

            if(callBack&&typeof callBack['start'] === 'function'){
                callBack['start'].call(content)
            }
        })
        content.addEventListener('touchmove', function (ev) {
            if (!isY) {
                return;
            }
            ev = ev || event;
            var touchC = ev.changedTouches[0];
            var now = {
                x: touchC.clientX,
                y: touchC.clientY
            };
            var dis = {
                x: now.x - start.x,
                y: now.y - start.y
            };
            var translateY = element.y + dis.y;

            var nowPoint = touchC.clientY;
            var nowTime = new Date().getTime();
            pointDis = nowPoint - lastPoint;
            timeDis = nowTime - lastTime;
            if (translateY > 0) {
                content.handMove = true;
                var scale = document.documentElement.clientHeight / ((document.documentElement
                    .clientHeight + translateY) * 1.5);
                translateY = element.y + dis.y * scale;
            } else if (translateY < minY) {
                content.handMove = true;
                var over = minY - translateY;
                var scale = document.documentElement.clientHeight / ((document.documentElement
                    .clientHeight + over) * 1.5);
                translateY = element.y + dis.y * scale;
            }

            if (isFirst) {
                isFirst = false;
                if (Math.abs(dis.x) > Math.abs(dis.y)) {
                    isY = false;
                    return;
                }
            }
            
            common.css(content, 'translateY', translateY);
            
            lastPoint = nowPoint;
            lastTime = nowTime;
            if(callBack&&typeof callBack["move"] === "function"){
				callBack["move"].call(content);
			}
        })
        content.addEventListener('touchend', function () {
            if (!isY) {
                return;
            }
            var translateY = common.css(content, 'translateY');
            if (content.handMove) {
                if (translateY > 0) {
                    translateY = 0;
                    content.style.transition = '1s transform';
                    
                    common.css(content, 'translateY', translateY);
                } else if (translateY < minY) {
                    translateY = minY;
                    content.style.transition = '1s transform';
                
                }
                common.css(content, 'translateY', translateY);
                content.handMove = false;
                if(callBack&&typeof callBack["end"] === "function"){
                    callBack["end"].call(content);
                }
            } else {
                speed = pointDis / timeDis;
                speed = Math.abs(speed) < 0.5 ? 0 : speed;
                var targetY = translateY + speed * 200;
                
                var time = Math.abs(speed) * 0.2;
                time = time < 0.8 ? 0.8 : time;
                time = time > 2 ? 2 : time;
                var type = 'Linear';
                if (targetY > 0) {
                    targetY = 0;
                    type = 'back';
                } else if (targetY < minY) {
                    targetY = minY;
                    type = 'back';
                }
                bsr(type, targetY, time);
                common.css(content, 'translateY', targetY);
                
            }
        })

        function bsr(type, targetY, time) {
            clearInterval(timer);
            // 当前次数
            var t = 0;
            //初始位置
            var b = common.css(content, 'translateY');
            // 最终位置与初始位置之间的差值
            var c = targetY - b;
            // 总次数
            var d = time * 1000 / (1000 / 60);
            timer = setInterval(() => {
                t++;
                if(callBack&&typeof callBack["autoMove"] === "function"){
                    callBack["move"].call(content);
                }
                if (t > d) {
                    clearInterval(timer);
                    if(callBack&&typeof callBack["end"] === "function"){
                        callBack["end"].call(content);
                    }
                }
                var point = Tween[type](t, b, c, d);
                common.css(content, "translateY", point);
            }, 1000 / 60);
        }

    }
})(window)