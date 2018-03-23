//var db=require("db");
var mongoose = require("mongoose");
var users=new mongoose.Schema({
    "userName":String,
    "userPsw":String,
    "isadmin":{type:Boolean,default:false},
    "orderList":Array,
    "registerTime":String,
    "cartList":[                  //购物车
        {
            "productName":String,
            "salePrice":String,
            "productId":String,
            "productNum":Number,
            "checked":String,
            "productImg":String,
        }
    ],
    "addressList":Array
});
module.exports=mongoose.model("users",users);