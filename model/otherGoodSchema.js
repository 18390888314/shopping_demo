var mongoose = require("mongoose");
var otherGoods=new mongoose.Schema({
    "productName":String,
    "salePrice":String,
    "productNum":Number,
    "goodType":String,
    "goodIntroduce":String,
    "productImg":[]

});
module.exports=mongoose.model("otherGoods",otherGoods);