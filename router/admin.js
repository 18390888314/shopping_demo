var express = require('express');
var mongoose=require("mongoose");
var router = express.Router();
var md5=require("../model/md5");
//var favicon=require("serve-favicon");
var users=require("../model/userSchema");
var manGoods=require("../model/manGoodSchema");
var womanGoods=require("../model/womanGoodSchema");
var otherGoods=require("../model/otherGoodSchema");
var session=require("express-session");
var formidable=require("formidable");
var util=require("util");
var path=require("path");
var fs=require("fs");
/* GET users listing. */

/*router.use((req,res,next)=>{
    if(req.session.login=="2"){
        next();
    }else {
        res.json({
            "status":0,
            message:"您没有权限进入此页面"
        });
    }
});*/
router.get("/",(req,res,next)=>{   //后台主页
    users.count({},(err,result)=>{
        var userNum=result;
        var pageNum=Math.ceil(result/10);
        res.render("admin-index.ejs",{
            pageNum:pageNum,
            result:userNum
        });
    })
 ;
});

router.get("/getUserData",(req,res,next)=>{   //获取用户信息
    var page=parseInt(req.query.page);
    var limit=10;
    var skip=limit*page;
    users.find({},null,{sort:{"_id":-1},skip:skip,limit:limit},(err,data)=>{
        if(err){
            console.log(err)
            return;
        }
        res.json(data);

    })
        //.limit(limit).skip(skip);

});
router.get("/removeUser",(req,res,next)=>{   //删除用户
    var userId=req.query.userId;
    users.remove({"_id":userId},(err,result)=>{
     if(err){
    console.log(err);
    return;
    }else if(result.ok==1||result.n==1){
       res.json({
           "status":1,
           "message":"删除成功"
       });
     }

    });
});
router.get("/showAddGoods",(req,res,next)=>{  //展示添加商品的页面
        fs.readdir("./static",(err,result)=>{
        res.render("admin-addGoods.ejs",{
            result
        });
    });
});
router.post("/doaddGood",(req,res,next)=>{   //添加商品
    var picArr=[];
    var form = new formidable.IncomingForm();
    form.multiples=true;
    form.uploadDir="./static/";
    form.parse(req, function(err, fields,files) {
        var goodName=fields.goodName;
        var goodPrice=fields.goodPrice;
        var goodId=fields.goodId;
        var goodType;
        if(fields.goodType=="男装"){
            goodType="man";
        }else if(fields.goodType=="女装"){
            goodType="woman";
        }else {
            goodType="other";
        }
        var goodIntroduce=fields.goodIntroduce;
   new Promise(function (resolve) {
       if(files.tupian.length>=0) {
           for (var i = 0; i < files.tupian.length; i++) {
               var oldpath = files.tupian[i].path;
               var extname = path.extname(files.tupian[i].name);
               var random = Math.ceil(Math.random() * 100000);
               var newpath = "./static/" + fields.goodType + "/" + random + extname;
               var paths = fields.goodType + "/" + random + extname;
               picArr.push(paths);
               fs.renameSync(oldpath, newpath, (err) => {
                   if (err) {
                       console.log("改名失败！");
                       return;
                   }
               })
           }
       }else {
           var oldpath = files.tupian.path;
           var extname = path.extname(files.tupian.name);
           var random = Math.ceil(Math.random() * 100000);
           var newpath = "./static/" + fields.goodType + "/" + random + extname;
           var paths = fields.goodType + "/" + random + extname;
           picArr.push(paths);
           if(!files.tupian.size==0){
               fs.renameSync(oldpath, newpath, (err) => {
                   if (err) {
                       console.log("改名失败！");
                       return;
                   }
               })
           }else {
               fs.unlinkSync(oldpath,(err)=>{
                   if(err){
                       console.log(err);
                       return;
                   }
               });
           }
       }
         resolve(picArr);
     }).then(
         (picArr)=>{
             if(goodType=="man"){
                 manGoods.create({"productName":goodName,"salePrice":goodPrice,"productNum":goodId,"goodType":goodType,"goodIntroduce":goodIntroduce,"productImg":picArr},(err)=>{
                     if(err){
                         console.log(err);
                         return;
                     }else {
                         res.redirect("/admin/showAddGoods");
                     }
                 })
             }else if(goodType=="woman"){
                 womanGoods.create({"productName":goodName,"salePrice":goodPrice,"productNum":goodId,"goodType":goodType,"goodIntroduce":goodIntroduce,"productImg":picArr},(err)=>{
                     if(err){
                         console.log(err);
                         return;
                     }else {
                         res.redirect("/admin/showAddGoods");
                     }
                 })
             }else {
                otherGoods.create({"productName":goodName,"salePrice":goodPrice,"productNum":goodId,"goodType":goodType,"goodIntroduce":goodIntroduce,"productImg":picArr},(err)=>{
                     if(err){
                         console.log(err);
                         return;
                     }else {
                         res.redirect("/admin/showAddGoods");
                     }
                 })
             }
         }
     )
    })
});

router.get("/goodList",(req,res,next)=>{  //商品管理页面
    var reSult=0;
    fs.readdir("./static",(err,result)=>{
       Promise.all([getCount(otherGoods),getCount(manGoods),getCount(womanGoods)]).then((value)=>{
          var val=value[2];
           res.render("admin-goodList.ejs",{
               result,
               val,
           });
       })
    });

    function getCount(goodList) {
        return new Promise(function (resolve,reject) {
            goodList.count({},(err,result1)=>{
                if(err){
                    console.log(err);
                    return;
                }
                reSult+=result1;
                resolve(reSult);
            })
        })
    }
})
router.get("/getGoods",(req,res,next)=>{   //获取商品列表
var type=req.query.type;
var pageNum=req.query.pageNum;
var limit=6;
var skip=pageNum*limit;
if(type=="其他"){
otherGoods.find({},null,{skip:skip,limit:limit},(err,result)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log(result);
    res.json({
        status:1,
        result
    });
})
}else if(type=="女装"){
   womanGoods.find({},(err,result)=>{
        if(err){
            console.log(err);
            return;
        }
        res.json({
            status:1,
            result
        });
    })
}else if(type=="男装"){
    manGoods.find({},(err,result)=>{
        if(err){
            console.log(err);
            return;
        }
        res.json({
            status:1,
            result
        });
    })
}
});
module.exports = router;