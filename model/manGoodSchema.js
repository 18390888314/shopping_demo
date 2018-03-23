var mongoose = require("mongoose");
var manGoods=new mongoose.Schema({
    "productName":String,
    "salePrice":String,
    "productNum":Number,
    "goodType":String,
    "goodIntroduce":String,
    "productImg":[]

});
module.exports=mongoose.model("manGoods",manGoods);