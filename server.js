const express = require('express');
const fs = require('fs');
const path = require('path')

const app = express();

// 注册
app.get('/server', (req, res) => {
    //设置响应头    设置允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    // 判断req.query的属性个数
    let counts = 0;
    let obj = req.query;
    // 检验用户名是否存在
    let flag = false;
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            counts++;
        }
    }
    // 如果是1个则只需要验证用户名是否存在，如果是2个直接写入
    if (counts >= 2) {
        let user = {
            "useName": req.query.userName,
            "password": req.query.password
        }
        if(!flag){
            //用户名不存在
            fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (error, data) => {
                    let arr = JSON.parse(data);
                    arr.push(user);
                fs.writeFile(path.join(__dirname, 'user.json'), JSON.stringify(arr), 'utf8', (error) => {
                    if (error) return console.log("追加文件失败" + error.message);
                    res.send('ok');
                });
            })
        }
    }else if(counts > 0){
        let useName = {
            "useName": req.query.userName,
        }
        // console.log(useName);//{ useName: 'again1' }
        // 检查user.json中是否已经存在该用户名
        fs.readFile(path.join(__dirname,'user.json'),'utf8',(error,data)=>{
            let arr = JSON.parse(data);
            arr.push(useName);
            let newArr = arr.filter((item,index)=>{
                let temArr = [];
                arr.forEach(item2=>{
                    temArr.push(item2.useName);
                })
                return temArr.indexOf(item.useName) == index;
            })
            // 如果newArr的length比arr的length少说明用户名重复了
            if(arr.length != newArr.length){
                flag = true;
                res.send('用户名重复了')
            }else{
                res.send('ok')
            }
        })
    }
})

// 登录
app.get('/server-login', (req,res) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    let user = {
        "useName": req.query.userName,
        "password": req.query.password
    }
    fs.readFile(path.join(__dirname,'user.json'),'utf8',(error,data)=>{
        let arr = JSON.parse(data);//[{}]
        let flag = false;
        let isName = false;
        arr.forEach(item=>{
            console.log(item.useName,user.useName)
            if(item.useName == user.useName && item.password == user.password){
                // 说明用户名和密码都正确
                flag = true;
            }else if(item.useName == user.useName){
                isName = true;
            }else{}
        })
        if(flag){
            res.send('ok')
        }else if(isName){
            res.send('useName')
        }else{
            res.send('登陆失败');
        }
    })
})
app.listen(8000, () => {
    console.log('8000端口，已经启动')
})