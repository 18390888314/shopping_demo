var express = require('express');
var manGoods=require("../model/manGoodSchema");
var womanGoods=require("../model/womanGoodSchema");
var otherGoods=require("../model/otherGoodSchema");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
      login:req.session.login,
      userName:req.session.userName,
  });
});
router.get("/register",function (req,res,next) {
    res.render('register.ejs',
        {
            login:req.session.login,
            userName:req.session.userName,
        });
});
router.get("/login",function (req,res,next) {
    res.render('login.ejs',
        {
            login:req.session.login,
            userName:req.session.userName,
        });
});

router.get("/getGoods",(req,res,next)=>{
    var resultAll=[];
    readManGoods().then(readWomanGoods()).then(readOtherGoods());
  function readManGoods() {
      return new Promise(function (resolve,reject) {
          manGoods.find({},(err,result)=>{
              if(!result==[]){
                  resultAll=resultAll.concat(result);
                  resolve(resultAll);
              }else {
                  resolve(resultAll);
              }
          })
      })
  }
    function readWomanGoods() {
        return new Promise(function (resolve,reject) {
            womanGoods.find({},(err,result)=>{
                if(!result==[]){
                    resultAll=resultAll.concat(result);
                    resolve(resultAll);
                }else {
                    resolve(resultAll);
                }
            })
        })
    }
    function readOtherGoods() {
        return new Promise(function (resolve,reject) {
            otherGoods.find({},(err,result)=>{
              if(!result==[]){
                  resultAll=resultAll.concat(result);
                  resolve(resultAll);
                  res.json({
                      "status":1,
                      "result":resultAll,
                      "msg":"成功"
                  })
              }else {
                  resolve(resultAll);
                  res.json({
                      "status":1,
                      "result":resultAll,
                      "msg":"成功"
                  })
              }
            })
        })
    }
})

module.exports = router;
