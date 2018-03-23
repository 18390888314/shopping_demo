var express = require('express');
var mongoose=require("mongoose");
var router = express.Router();
var md5=require("../model/md5");
var users=require("../model/userSchema");
var session=require("express-session");
/* GET users listing. */
mongoose.connect("mongodb://127.0.0.1:27017/shopping");
mongoose.connection.on("connected", function () {
    console.log("mongodb connected success");
});
mongoose.connection.on("error", function () {
    console.log("mongodb connected fail");
});
mongoose.connection.on("disconnected", function () {
    console.log("mongodb connected disconnected");
})


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post("/doregister",function (req,res,next) {
    var regx =/^(\w){6,20}$/;
    var userNmae=req.body.userName;
    var psw=md5(req.body.psw);
    if(req.body.psw.match(regx)==null){  //密码由
        console.log("密码格式不正确！");
        res.json({
            "status":0,
            message:"密码格式不正确！"
        });
        return;

    }else {
        users.find({"username": userNmae}, (err, data) => {
            if (err) {
                console.log(err);
                return;
            } else {
                users.create({"userName": userNmae, "userPsw": psw,"registerTime":new Date().toLocaleString()}, (err, data) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    res.redirect("/");
                });
            }
        })
    }
})

router.post("/dologin",(req,res,next)=>{
    var userName=req.body.userName;
    var psw=md5(req.body.psw);
    users.findOne({"userName":userName,"userPsw":psw},(err,data)=>{
        if(err){
            console.log(err);
            return;
        }else if(data.isadmin==true){
            req.session.login="2";
            res.json({
                "status":2,
                message:"管理员登录成功",
                login:req.session.login
            });
        }else {
            req.session.login="1";
            req.session.userName=data.userName;
            console.log(data);
            res.json({
                "status":1,
                message:"普通用户登录成功",
                login:req.session.login
            });
        }

    });
});
router.get("/unlogin",(req,res,next)=>{
    req.session.login="";
    req.session.userName="";
    res.redirect("/");
});
module.exports = router;
