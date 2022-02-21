(function (w) {
    w.common = {};
    w.common.css = function (node, type, val) {
        // common(ulnode,translateX)
        if(typeof node ==="object" && typeof node["transform"] ==="undefined" ){
				node["transform"]={};
			}
			
			if(arguments.length>=3){
				//设置
				var text ="";
				node["transform"][type] = val;
				
				for( item in node["transform"]){
					if(node["transform"].hasOwnProperty(item)){
						switch (item){
							case "translateX":
							case "translateY":
								text +=  item+"("+node["transform"][item]+"px)";
								break;
							case "scale":
								text +=  item+"("+node["transform"][item]+")";
								break;
							case "rotate":
								text +=  item+"("+node["transform"][item]+"deg)";
								break;
						}
					}
				}
				node.style.transform = node.style.webkitTransform = text;
			}else if(arguments.length==2){
				//读取
				val =node["transform"][type];
				if(typeof val === "undefined"){
					switch (type){
						case "translateX":
						case "translateY":
						case "rotate":
							val =0;
							break;
						case "scale":
							val =1;
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
            console.log(arr)

            var ulNode = document.createElement('ul')
            for (var i = 0; i < arr.length; i++) {
                ulNode.innerHTML +=
                    `<li style="width:${100 / arr.length}%;"><a href="javascript:;"><img src="./${arr[i]}"></a></li>`
            }
            console.log(arr.length)
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
            var startX = 0;
            //元素一开始的位置
            var elementX = 0;
            var translateX = 0;
            var timer = 0;
            //无缝
            /*点击第一组的第一张时 瞬间跳到第二组的第一张
            点击第二组的最后一张时  瞬间跳到第一组的最后一张*/
            //index代表ul的位置

            carouselWrap.addEventListener('touchstart', function (e) {
                e = e || event
                touchX = e.changedTouches[0]
                startX = touchX.clientX
                elementX = common.css(ulNode,'translateX') 
                ulNode.style.transition = 'none';


                if (needCarousel) {
                    var index = common.css(ulNode,'translateX') / document.documentElement.clientWidth;
                    if (-index === 0) {
                        index = -pointsLength
                    } else if (-index == (arr.length - 1)) {
                        index = -(pointsLength - 1)
                    }
                    /* translateX = index * document.documentElement.clientWidth;
                    startX = touchX.clientX
                    elementX = translateX */
                    common.css(ulNode,'translateX',index * document.documentElement.clientWidth) 
                }
                    startX = touchX.clientX
                    elementX = translateX
                clearInterval(timer);
            })
            carouselWrap.addEventListener('touchmove', function (e) {
                e = e || event;
                var nowX = e.changedTouches[0].clientX;
                var disX = startX - nowX
                /* translateX = elementX - disX
                ulNode.style.transform = `translateX(${translateX}px)` */
                common.css(ulNode,'translateX',elementX - disX)
            })
            carouselWrap.addEventListener('touchend', function () {
                var index = common.css(ulNode,'translateX') / document.documentElement.clientWidth;
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
                common.css(ulNode,'translateX',index * document.documentElement.clientWidth)
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
                var index =  common.css(ulNode,'translateX') / document.documentElement.clientWidth;
                timer = setInterval(() => {
                    if (index == 1 - arr.length) {
                        ulNode.style.transition = "none";
                        index = 1 - arr.length / 2;
                        /* translateX = index * document.documentElement.clientWidth;
                        ulNode.style.transform = `translateX(${translateX}px)` */
                        common.css(ulNode,'translateX',index * document.documentElement.clientWidth)
                    }
                    setTimeout(() => {
                        index--;
                        ulNode.style.transition = "1s transform";
                        /* translateX = index * document.documentElement.clientWidth;
                        ulNode.style.transform = `translateX(${translateX}px)` */
                        common.css(ulNode,'translateX',index * document.documentElement.clientWidth)
                        myPoints()
                        console.log(index)
                    }, 50);
                }, 3000);


            }

            function myPoints() {
                var index = common.css(ulNode,'translateX') / document.documentElement.clientWidth;
                for (var i = 0; i < pointsLength; i++) {
                    pointsSpan[i].classList.remove('active')
                }
                pointsSpan[-index % pointsLength].classList.add('active')
            }
        }
    }
})(window)